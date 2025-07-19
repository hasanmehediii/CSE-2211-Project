# app/models/order.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import Session, relationship
from pydantic import BaseModel
from typing import List, Optional
from app.database import get_db, Base
from datetime import date  # Fix: Import date

class Order(Base):
    __tablename__ = "orders"
    
    order_id = Column(Integer, primary_key=True, index=True)
    purchase_id = Column(Integer, ForeignKey("purchase.purchase_id"), nullable=False)
    status = Column(String(50))
    shipping_address = Column(String(255))
    tracking_number = Column(String(50))
    expected_delivery = Column(Date)
    
    purchase = relationship("PurchaseModel", back_populates="orders")
    order_items = relationship("OrderItem", back_populates="order")
    shipping = relationship("Shipping", back_populates="order")

class OrderBase(BaseModel):
    purchase_id: int
    status: Optional[str] = None
    shipping_address: Optional[str] = None
    tracking_number: Optional[str] = None
    expected_delivery: Optional[date] = None

class OrderCreate(OrderBase):
    pass

class OrderResponse(OrderBase):
    order_id: int

    class Config:
        orm_mode = True

router = APIRouter(prefix="/orders", tags=["orders"])

def get_order(db: Session, order_id: int):
    return db.query(Order).filter(Order.order_id == order_id).first()

def get_orders(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Order).offset(skip).limit(limit).all()

def create_order(db: Session, order: OrderCreate):
    db_order = Order(**order.dict())
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    return db_order

@router.post("/", response_model=OrderResponse)
def create_order_endpoint(order: OrderCreate, db: Session = Depends(get_db)):
    return create_order(db, order)

@router.get("/", response_model=List[OrderResponse])
def read_orders(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return get_orders(db, skip, limit)

@router.get("/{order_id}", response_model=OrderResponse)
def read_order(order_id: int, db: Session = Depends(get_db)):
    db_order = get_order(db, order_id)
    if db_order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    return db_order