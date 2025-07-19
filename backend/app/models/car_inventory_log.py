# app/models/car_inventory_log.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import Column, Integer, Numeric, String, Date, ForeignKey
from sqlalchemy.orm import Session, relationship
from pydantic import BaseModel
from typing import List, Optional
from app.database import get_db, Base
from datetime import date  # Fix: Import date

class CarInventoryLog(Base):
    __tablename__ = "car_inventory_log"
    
    log_id = Column(Integer, primary_key=True, index=True)
    inventory_id = Column(Integer, ForeignKey("car_inventory.inventory_id"), nullable=False)
    car_id = Column(Integer, ForeignKey("cars.car_id"), nullable=False)
    quantity = Column(Integer, nullable=False)
    unit_price = Column(Numeric(10, 2))
    total_value = Column(Numeric(10, 2))
    condition = Column(String(50))
    warehouse_location = Column(String(100))
    received_date = Column(Date)
    
    inventory = relationship("CarInventory", back_populates="inventory_logs")
    car = relationship("Car")

class CarInventoryLogBase(BaseModel):
    inventory_id: int
    car_id: int
    quantity: int
    unit_price: Optional[float] = None
    total_value: Optional[float] = None
    condition: Optional[str] = None
    warehouse_location: Optional[str] = None
    received_date: Optional[date] = None

class CarInventoryLogCreate(CarInventoryLogBase):
    pass

class CarInventoryLogResponse(CarInventoryLogBase):
    log_id: int

    class Config:
        orm_mode = True

router = APIRouter(prefix="/car_inventory_log", tags=["car_inventory_log"])

def get_car_inventory_log(db: Session, log_id: int):
    return db.query(CarInventoryLog).filter(CarInventoryLog.log_id == log_id).first()

def get_car_inventory_logs(db: Session, skip: int = 0, limit: int = 100):
    return db.query(CarInventoryLog).offset(skip).limit(limit).all()

def create_car_inventory_log(db: Session, log: CarInventoryLogCreate):
    db_log = CarInventoryLog(**log.dict())
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return db_log

@router.post("/", response_model=CarInventoryLogResponse)
def create_car_inventory_log_endpoint(log: CarInventoryLogCreate, db: Session = Depends(get_db)):
    return create_car_inventory_log(db, log)

@router.get("/", response_model=List[CarInventoryLogResponse])
def read_car_inventory_logs(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return get_car_inventory_logs(db, skip, limit)

@router.get("/{log_id}", response_model=CarInventoryLogResponse)
def read_car_inventory_log(log_id: int, db: Session = Depends(get_db)):
    db_log = get_car_inventory_log(db, log_id)
    if db_log is None:
        raise HTTPException(status_code=404, detail="Car inventory log not found")
    return db_log