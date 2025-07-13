from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import Column, Integer, Numeric, String, Date, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from app.database import get_db
from datetime import date

Base = declarative_base()

class CarInventoryLog(Base):
    __tablename__ = "car_inventory_log"
    
    inventory_id = Column(Integer, ForeignKey("car_inventory.inventory_id"), primary_key=True)
    car_id = Column(Integer, ForeignKey("cars.car_id"), primary_key=True)
    quantity = Column(Integer, nullable=False)
    unit_price = Column(Numeric(10, 2))
    total_value = Column(Numeric(12, 2))
    condition = Column(String(50))
    warehouse_location = Column(String(100))
    batch_code = Column(String(50))
    received_date = Column(Date)
    expiration_date = Column(Date)

class CarInventoryLogBase(BaseModel):
    inventory_id: int
    car_id: int
    quantity: int
    unit_price: Optional[float] = None
    total_value: Optional[float] = None
    condition: Optional[str] = None
    warehouse_location: Optional[str] = None
    batch_code: Optional[str] = None
    received_date: Optional[date] = None
    expiration_date: Optional[date] = None

class CarInventoryLogCreate(CarInventoryLogBase):
    pass

class CarInventoryLog(CarInventoryLogBase):
    class Config:
        orm_mode = True

router = APIRouter(prefix="/car_inventory_logs", tags=["car_inventory_logs"])

def get_car_inventory_log(db: Session, inventory_id: int, car_id: int):
    return db.query(CarInventoryLog).filter(CarInventoryLog.inventory_id == inventory_id, CarInventoryLog.car_id == car_id).first()

def get_car_inventory_logs(db: Session, skip: int = 0, limit: int = 100):
    return db.query(CarInventoryLog).offset(skip).limit(limit).all()

def create_car_inventory_log(db: Session, car_inventory_log: CarInventoryLogCreate):
    db_car_inventory_log = CarInventoryLog(**car_inventory_log.dict())
    db.add(db_car_inventory_log)
    db.commit()
    db.refresh(db_car_inventory_log)
    return db_car_inventory_log

@router.post("/", response_model=CarInventoryLog)
def create_car_inventory_log_endpoint(car_inventory_log: CarInventoryLogCreate, db: Session = Depends(get_db)):
    return create_car_inventory_log(db, car_inventory_log)

@router.get("/", response_model=List[CarInventoryLog])
def read_car_inventory_logs(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return get_car_inventory_logs(db, skip, limit)

@router.get("/{inventory_id}/{car_id}", response_model=CarInventoryLog)
def read_car_inventory_log(inventory_id: int, car_id: int, db: Session = Depends(get_db)):
    db_car_inventory_log = get_car_inventory_log(db, inventory_id, car_id)
    if db_car_inventory_log is None:
        raise HTTPException(status_code=404, detail="Car inventory log not found")
    return db_car_inventory_log