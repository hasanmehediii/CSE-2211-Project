from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import Session, relationship
from pydantic import BaseModel
from typing import List, Optional
from app.database import get_db, Base
from app.models.review import ReviewModel  # Import ReviewModel (adjust path as needed)
from app.models.user import User  # Import User model (adjust path as needed)

class CarInventory(Base):
    __tablename__ = "car_inventory"
    
    inventory_id = Column(Integer, primary_key=True, index=True)
    car_id = Column(Integer, ForeignKey("cars.car_id"), nullable=False)
    location = Column(String(100))
    quantity = Column(Integer, nullable=False)
    notes = Column(String(255))
    
    car = relationship("Car", back_populates="inventories")
    inventory_logs = relationship("CarInventoryLog", back_populates="inventory")

class CarInventoryBase(BaseModel):
    car_id: int
    location: Optional[str] = None
    quantity: int
    notes: Optional[str] = None

class CarInventoryCreate(CarInventoryBase):
    pass

class CarInventoryResponse(CarInventoryBase):
    inventory_id: int

    class Config:
        orm_mode = True

router = APIRouter(prefix="/car_inventory", tags=["car_inventory"])

def get_car_inventory(db: Session, inventory_id: int):
    return db.query(CarInventory).filter(CarInventory.inventory_id == inventory_id).first()

def get_car_inventories(db: Session, skip: int = 0, limit: int = 100):
    return db.query(CarInventory).offset(skip).limit(limit).all()

# Fix: Return a list of car inventories, not just one
def get_car_inventory_by_car_id(db: Session, car_id: int):
    return db.query(CarInventory).filter(CarInventory.car_id == car_id).all()  # Ensure this returns all inventory items, not just one

def get_reviews_by_car_id(db: Session, car_id: int, skip: int = 0, limit: int = 100):
    return (
        db.query(ReviewModel)
        .join(User, ReviewModel.user_id == User.user_id)
        .filter(ReviewModel.car_id == car_id, ReviewModel.is_visible == True)
        .offset(skip)
        .limit(limit)
        .all()
    )

def create_car_inventory(db: Session, car_inventory: CarInventoryCreate):
    db_inventory = CarInventory(**car_inventory.dict())
    db.add(db_inventory)
    db.commit()
    db.refresh(db_inventory)
    return db_inventory

@router.post("/", response_model=CarInventoryResponse)
def create_car_inventory_endpoint(car_inventory: CarInventoryCreate, db: Session = Depends(get_db)):
    return create_car_inventory(db, car_inventory)

@router.get("/", response_model=List[CarInventoryResponse])
def read_car_inventories(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return get_car_inventories(db, skip, limit)

@router.get("/{inventory_id}", response_model=CarInventoryResponse)
def read_car_inventory(inventory_id: int, db: Session = Depends(get_db)):
    db_inventory = get_car_inventory(db, inventory_id)
    if db_inventory is None:
        raise HTTPException(status_code=404, detail="Car inventory not found")
    return db_inventory

@router.get("/cars/{car_id}/inventory", response_model=CarInventoryResponse)
def read_car_inventory_by_car_id(car_id: int, db: Session = Depends(get_db)):
    db_inventory = get_car_inventory_by_car_id(db, car_id)
    if db_inventory is None:
        raise HTTPException(status_code=404, detail="Inventory for car not found")
    return db_inventory