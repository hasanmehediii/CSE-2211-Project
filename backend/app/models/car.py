from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import Column, Integer, String, Numeric, Boolean, Date, ForeignKey
from sqlalchemy.orm import Session, relationship, declarative_base
from pydantic import BaseModel
from typing import List, Optional
from app.database import get_db
from datetime import date

Base = declarative_base()

class Car(Base):
    __tablename__ = "cars"
    
    car_id = Column(Integer, primary_key=True, index=True)
    category_id = Column(Integer, ForeignKey("categories.category_id"), nullable=False)
    modelnum = Column(String(50), nullable=False)
    manufacturer = Column(String(100))
    model_name = Column(String(100))
    year = Column(Integer)
    engine_type = Column(String(50))
    transmission = Column(String(30))
    color = Column(String(30))
    mileage = Column(Integer)
    fuel_capacity = Column(Numeric(5, 2))
    seating_capacity = Column(Integer)
    price = Column(Numeric(10, 2))
    available = Column(Boolean, default=True)
    added_date = Column(Date, default=date.today)
    
    category = relationship("Category", back_populates="cars")

from app.models.category import Category
Category.cars = relationship("Car", order_by=Car.car_id, back_populates="category")

class CarBase(BaseModel):
    category_id: int
    modelnum: str
    manufacturer: Optional[str] = None
    model_name: Optional[str] = None
    year: Optional[int] = None
    engine_type: Optional[str] = None
    transmission: Optional[str] = None
    color: Optional[str] = None
    mileage: Optional[int] = None
    fuel_capacity: Optional[float] = None
    seating_capacity: Optional[int] = None
    price: Optional[float] = None
    available: bool = True
    added_date: date

class CarCreate(CarBase):
    pass

class Car(CarBase):
    car_id: int

    class Config:
        orm_mode = True

router = APIRouter(prefix="/cars", tags=["cars"])

def get_car(db: Session, car_id: int):
    return db.query(Car).filter(Car.car_id == car_id).first()

def get_cars(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Car).offset(skip).limit(limit).all()

def create_car(db: Session, car: CarCreate):
    db_car = Car(**car.dict())
    db.add(db_car)
    db.commit()
    db.refresh(db_car)
    return db_car

@router.post("/", response_model=Car)
def create_car_endpoint(car: CarCreate, db: Session = Depends(get_db)):
    return create_car(db, car)

@router.get("/", response_model=List[Car])
def read_cars(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return get_cars(db, skip, limit)

@router.get("/{car_id}", response_model=Car)
def read_car(car_id: int, db: Session = Depends(get_db)):
    db_car = get_car(db, car_id)
    if db_car is None:
        raise HTTPException(status_code=404, detail="Car not found")
    return db_car