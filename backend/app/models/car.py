from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import Column, Integer, String, Numeric, Boolean, Date, ForeignKey, func
from sqlalchemy.orm import Session, relationship
from pydantic import BaseModel
from typing import List, Optional
from app.database import get_db, Base
from datetime import date
from app.models.category import Category
from app.models.review import ReviewModel

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
    image_link = Column(String(255))
    
    category = relationship("Category", back_populates="cars")
    reviews = relationship("ReviewModel", back_populates="car")
    inventories = relationship("CarInventory", back_populates="car")
    order_items = relationship("OrderItem", back_populates="car")

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
    image_link: Optional[str] = None

    class Config:
        orm_mode = True  # Enable ORM mode for from_orm

class CarWithRating(CarBase):
    car_id: int
    rating: Optional[float] = None

    class Config:
        orm_mode = True

class CarCreate(CarBase):
    pass

router = APIRouter(prefix="/cars", tags=["cars"])

def get_car(db: Session, car_id: int):
    return db.query(Car).filter(Car.car_id == car_id).first()

def create_car(db: Session, car: CarCreate):
    db_car = Car(**car.dict())
    db.add(db_car)
    db.commit()
    db.refresh(db_car)
    return db_car

def get_top_rated_cars(db: Session, limit: int = 6):
    result = (
        db.query(
            Car,
            func.avg(ReviewModel.rating).label("rating"),
        )
        .join(ReviewModel, Car.car_id == ReviewModel.car_id, isouter=True)
        .group_by(Car.car_id)
        .order_by(func.avg(ReviewModel.rating).desc())
        .limit(limit)
        .all()
    )
    cars_with_ratings = []
    for car, rating in result:
        car_dict = car.__dict__
        car_dict['rating'] = rating
        cars_with_ratings.append(CarWithRating.parse_obj(car_dict))
    return cars_with_ratings

def get_new_arrivals(db: Session, limit: int = 6):
    cars = db.query(Car).order_by(Car.added_date.desc()).limit(limit).all()
    return [CarBase.from_orm(car) for car in cars]  # Convert to CarBase

def get_budget_friendly_cars(db: Session, limit: int = 6):
    cars = db.query(Car).order_by(Car.price.asc()).limit(limit).all()
    return [CarBase.from_orm(car) for car in cars]  # Convert to CarBase

@router.get("/", response_model=List[CarBase])
def read_cars(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(Car).offset(skip).limit(limit).all()

@router.get("/top-rated", response_model=List[CarWithRating])
def read_top_rated_cars(db: Session = Depends(get_db)):
    return get_top_rated_cars(db)

@router.get("/new-arrivals", response_model=List[CarBase])
def read_new_arrivals(db: Session = Depends(get_db)):
    return get_new_arrivals(db)

@router.get("/budget-friendly", response_model=List[CarBase])
def read_budget_friendly_cars(db: Session = Depends(get_db)):
    return get_budget_friendly_cars(db)

@router.get("/{car_id}", response_model=CarBase)
def read_car(car_id: int, db: Session = Depends(get_db)):
    db_car = get_car(db, car_id)
    if db_car is None:
        raise HTTPException(status_code=404, detail="Car not found")
    return db_car
