# app/models/shipping.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import Session, relationship
from pydantic import BaseModel
from typing import List, Optional
from app.database import get_db, Base
from datetime import date  # Fix: Import date

class Shipping(Base):
    __tablename__ = "shippings"
    
    shipping_id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.order_id"), nullable=False)
    emp_id = Column(Integer, ForeignKey("employees.emp_id"), nullable=False)
    shipped_date = Column(Date)
    delivery_date = Column(Date)
    shipping_address = Column(String(255))
    tracking_number = Column(String(50))
    
    order = relationship("Order", back_populates="shipping")
    employee = relationship("Employee", back_populates="shippings")

class ShippingBase(BaseModel):
    order_id: int
    emp_id: int
    shipped_date: Optional[date] = None
    delivery_date: Optional[date] = None
    shipping_address: Optional[str] = None
    tracking_number: Optional[str] = None

class ShippingCreate(ShippingBase):
    pass

class ShippingResponse(ShippingBase):
    shipping_id: int

    class Config:
        orm_mode = True

router = APIRouter(prefix="/shippings", tags=["shippings"])

def get_shipping(db: Session, shipping_id: int):
    return db.query(Shipping).filter(Shipping.shipping_id == shipping_id).first()

def get_shippings(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Shipping).offset(skip).limit(limit).all()

def create_shipping(db: Session, shipping: ShippingCreate):
    db_shipping = Shipping(**shipping.dict())
    db.add(db_shipping)
    db.commit()
    db.refresh(db_shipping)
    return db_shipping

@router.post("/", response_model=ShippingResponse)
def create_shipping_endpoint(shipping: ShippingCreate, db: Session = Depends(get_db)):
    return create_shipping(db, shipping)

@router.get("/", response_model=List[ShippingResponse])
def read_shippings(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return get_shippings(db, skip, limit)

@router.get("/{shipping_id}", response_model=ShippingResponse)
def read_shipping(shipping_id: int, db: Session = Depends(get_db)):
    db_shipping = get_shipping(db, shipping_id)
    if db_shipping is None:
        raise HTTPException(status_code=404, detail="Shipping not found")
    return db_shipping