from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import Column, Integer, String, Date, ForeignKey, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from app.database import get_db
from datetime import date

Base = declarative_base()

class Shipping(Base):
    __tablename__ = "shipping"
    
    ship_id = Column(Integer, primary_key=True, index=True)
    emp_id = Column(Integer, ForeignKey("employees.emp_id"), nullable=False)
    order_id = Column(Integer, ForeignKey("orders.order_id"), nullable=False)
    shipping_provider = Column(String(100))
    tracking_number = Column(String(100))
    status = Column(String(30), default="pending")
    shipped_date = Column(Date)
    delivery_date = Column(Date)
    delivery_address = Column(Text)
    remarks = Column(Text)

class ShippingBase(BaseModel):
    emp_id: int
    order_id: int
    shipping_provider: Optional[str] = None
    tracking_number: Optional[str] = None
    status: str = "pending"
    shipped_date: Optional[date] = None
    delivery_date: Optional[date] = None
    delivery_address: Optional[str] = None
    remarks: Optional[str] = None

class ShippingCreate(ShippingBase):
    pass

class Shipping(ShippingBase):
    ship_id: int

    class Config:
        orm_mode = True

router = APIRouter(prefix="/shipping", tags=["shipping"])

def get_shipping(db: Session, ship_id: int):
    return db.query(Shipping).filter(Shipping.ship_id == ship_id).first()

def get_shippings(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Shipping).offset(skip).limit(limit).all()

def create_shipping(db: Session, shipping: ShippingCreate):
    db_shipping = Shipping(**shipping.dict())
    db.add(db_shipping)
    db.commit()
    db.refresh(db_shipping)
    return db_shipping

@router.post("/", response_model=Shipping)
def create_shipping_endpoint(shipping: ShippingCreate, db: Session = Depends(get_db)):
    return create_shipping(db, shipping)

@router.get("/", response_model=List[Shipping])
def read_shippings(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return get_shippings(db, skip, limit)

@router.get("/{ship_id}", response_model=Shipping)
def read_shipping(ship_id: int, db: Session = Depends(get_db)):
    db_shipping = get_shipping(db, ship_id)
    if db_shipping is None:
        raise HTTPException(status_code=404, detail="Shipping not found")
    return db_shipping