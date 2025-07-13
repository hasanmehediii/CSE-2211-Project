from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import Column, Integer, Date, String, ForeignKey, Text
from sqlalchemy.orm import Session , declarative_base
from pydantic import BaseModel
from typing import List, Optional
from app.database import get_db
import datetime

Base = declarative_base()

class Order(Base):
    __tablename__ = "orders"
    
    order_id = Column(Integer, primary_key=True, index=True)
    purchase_id = Column(Integer, ForeignKey("purchase.purchase_id"), nullable=False)
    date = Column(Date, default=datetime.date.today)
    status = Column(String(30), default="processing")
    shipping_address = Column(Text)
    tracking_number = Column(String(100))
    expected_delivery = Column(Date)

class OrderBase(BaseModel):
    purchase_id: int
    date: datetime.date
    status: str = "processing"
    shipping_address: Optional[str] = None
    tracking_number: Optional[str] = None
    expected_delivery: Optional[datetime.date] = None

class OrderCreate(OrderBase):
    pass

class Order(OrderBase):
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

@router.post("/", response_model=Order)
def create_order_endpoint(order: OrderCreate, db: Session = Depends(get_db)):
    return create_order(db, order)

@router.get("/", response_model=List[Order])
def read_orders(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return get_orders(db, skip, limit)

@router.get("/{order_id}", response_model=Order)
def read_order(order_id: int, db: Session = Depends(get_db)):
    db_order = get_order(db, order_id)
    if db_order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    return db_order