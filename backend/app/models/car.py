from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import Column, Integer, String, Numeric, Boolean, Date, ForeignKey, func
from sqlalchemy.orm import Session, relationship, declarative_base
from pydantic import BaseModel
from typing import List, Optional
from app.database import get_db
from datetime import date

# Correct import order:
# Import all dependent ORM models first.
# This ensures that when SQLAlchemy processes the relationships,
# the referenced classes (Category and Review) are already defined.
from app.models.category import Category
from app.models.review import Review

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
    image_link = Column(String(255))
    
    # Define relationship to Category
    category = relationship("Category", back_populates="cars")

# Note: The `Category.cars` relationship definition should be in the `Category` model file
# to prevent circular dependencies. I've removed it from here.

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

# New function to get top-rated cars (by average rating)
def get_top_rated_cars(db: Session, limit: int = 4):
    result = (
        db.query(
            Car,
            func.avg(Review.rating).label("rating"),
        )
        .join(Review, Car.car_id == Review.car_id, isouter=True) # Use a left join to include cars without reviews
        .group_by(Car.car_id)
        .order_by(func.avg(Review.rating).desc())
        .limit(limit)
        .all()
    )
    cars_with_ratings = []
    for car, rating in result:
        car_dict = car.__dict__
        car_dict['rating'] = rating
        cars_with_ratings.append(CarWithRating.parse_obj(car_dict))
    return cars_with_ratings

# New function to get new arrivals (by added_date)
def get_new_arrivals(db: Session, limit: int = 4):
    # This query only involves the Car model, so it should work fine
    return db.query(Car).order_by(Car.added_date.desc()).limit(limit).all()

# New function to get budget-friendly cars (by price)
def get_budget_friendly_cars(db: Session, limit: int = 4):
    # This query also only involves the Car model
    return db.query(Car).order_by(Car.price.asc()).limit(limit).all()

# Updated and new endpoints
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