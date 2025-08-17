# app/models/order_item.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import Column, Integer, Numeric, ForeignKey
from sqlalchemy.orm import Session, relationship
from pydantic import BaseModel
from typing import List, Optional
from app.database import get_db, Base

class OrderItem(Base):
    __tablename__ = "order_item"
    
    order_item_id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.order_id"), nullable=False)
    car_id = Column(Integer, ForeignKey("cars.car_id"), nullable=False)
    quantity = Column(Integer, nullable=False)
    price_at_order = Column(Numeric(10, 2))
    
    order = relationship("Order", back_populates="order_items")
    car = relationship("Car")

class OrderItemBase(BaseModel):
    order_id: int
    car_id: int
    quantity: int
    price_at_order: Optional[float] = None

class OrderItemCreate(OrderItemBase):
    pass

class OrderItemResponse(OrderItemBase):
    order_item_id: int

    class Config:
        orm_mode = True

router = APIRouter(prefix="/order_items", tags=["order_items"])

def get_order_item(db: Session, order_item_id: int):
    return db.query(OrderItem).filter(OrderItem.order_item_id == order_item_id).first()

def get_order_items(db: Session, skip: int = 0, limit: int = 100):
    return db.query(OrderItem).offset(skip).limit(limit).all()

def create_order_item(db: Session, order_item: OrderItemCreate):
    db_order_item = OrderItem(**order_item.dict())
    db.add(db_order_item)
    db.commit()
    db.refresh(db_order_item)
    return db_order_item

@router.post("/", response_model=OrderItemResponse)
def create_order_item_endpoint(order_item: OrderItemCreate, db: Session = Depends(get_db)):
    return create_order_item(db, order_item)

@router.get("/", response_model=List[OrderItemResponse])
def read_order_items(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return get_order_items(db, skip, limit)

@router.get("/{order_item_id}", response_model=OrderItemResponse)
def read_order_item(order_item_id: int, db: Session = Depends(get_db)):
    db_order_item = get_order_item(db, order_item_id)
    if db_order_item is None:
        raise HTTPException(status_code=404, detail="Order item not found")
    return db_order_item

@router.get("/by_order/{order_id}", response_model=List[OrderItemResponse])
def read_order_items_by_order(order_id: int, db: Session = Depends(get_db)):
    return db.query(OrderItem).filter(OrderItem.order_id == order_id).all()
