from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import Session, declarative_base
from pydantic import BaseModel
from typing import List, Optional
from app.database import get_db
from datetime import datetime

Base = declarative_base()

class CarInventory(Base):
    __tablename__ = "car_inventory"
    
    inventory_id = Column(Integer, primary_key=True, index=True)
    car_id = Column(Integer, ForeignKey("cars.car_id"), nullable=False)
    location = Column(String(100))
    quantity = Column(Integer, nullable=False)
    last_updated = Column(DateTime, default=datetime.utcnow)
    reorder_level = Column(Integer, default=5)
    notes = Column(Text)

class CarInventoryBase(BaseModel):
    car_id: int
    location: Optional[str] = None
    quantity: int
    last_updated: datetime
    reorder_level: int = 5
    notes: Optional[str] = None

class CarInventoryCreate(CarInventoryBase):
    pass

class CarInventory(CarInventoryBase):
    inventory_id: int

    class Config:
        orm_mode = True

router = APIRouter(prefix="/car_inventory", tags=["car_inventory"])

def get_car_inventory(db: Session, inventory_id: int):
    return db.query(CarInventory).filter(CarInventory.inventory_id == inventory_id).first()

def get_car_inventories(db: Session, skip: int = 0, limit: int = 100):
    return db.query(CarInventory).offset(skip).limit(limit).all()

def create_car_inventory(db: Session, car_inventory: CarInventoryCreate):
    db_car_inventory = CarInventory(**car_inventory.dict())
    db.add(db_car_inventory)
    db.commit()
    db.refresh(db_car_inventory)
    return db_car_inventory

@router.post("/", response_model=CarInventory)
def create_car_inventory_endpoint(car_inventory: CarInventoryCreate, db: Session = Depends(get_db)):
    return create_car_inventory(db, car_inventory)

@router.get("/", response_model=List[CarInventory])
def read_car_inventories(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return get_car_inventories(db, skip, limit)

@router.get("/{inventory_id}", response_model=CarInventory)
def read_car_inventory(inventory_id: int, db: Session = Depends(get_db)):
    db_car_inventory = get_car_inventory(db, inventory_id)
    if db_car_inventory is None:
        raise HTTPException(status_code=404, detail="Car inventory not found")
    return db_car_inventory