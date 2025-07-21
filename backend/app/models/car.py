from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import Column, Integer, String, Numeric, Boolean, Date, ForeignKey, func
from sqlalchemy.orm import Session, relationship
from pydantic import BaseModel
from typing import List, Optional
from app.database import get_db, Base
from datetime import date
from app.models.category import Category
from app.models.review import ReviewModel
from app.models.car_inventory import CarInventory
from app.models.car_inventory_log import CarInventoryLog

# Car model
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

# Pydantic models
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
        orm_mode = True

class CarCreate(BaseModel):
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
    image_link: Optional[str] = None

    class Config:
        orm_mode = True

class CarWithRating(CarBase):
    car_id: int
    rating: Optional[float] = None

    class Config:
        orm_mode = True

# New endpoint models
class CarDetail(CarBase):
    inventory: List[dict]
    inventory_logs: List[dict]
    reviews: List[dict]

    class Config:
        orm_mode = True

# Existing Car CRUD Operations
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

# Routes (Including new route for car details)
router = APIRouter(prefix="/cars", tags=["cars"])

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

# New endpoint for car details, including inventory and reviews
@router.get("/car-detail/{car_id}", response_model=CarDetail)
def read_car_detail(car_id: int, db: Session = Depends(get_db)):
    return get_car_details(db, car_id)

@router.get("/cars/{car_id}/details")
def get_car_details(car_id: int, db: Session = Depends(get_db)):
    # Get car details
    car = db.query(Car).filter(Car.car_id == car_id).first()
    if not car:
        raise HTTPException(status_code=404, detail="Car not found")
    
    # Get car inventory
    inventory = db.query(CarInventory).filter(CarInventory.car_id == car_id).first()
    
    # Get car inventory logs
    inventory_logs = db.query(CarInventoryLog).filter(CarInventoryLog.car_id == car_id).all()
    
    # Get car reviews
    reviews = db.query(ReviewModel).filter(ReviewModel.car_id == car_id, ReviewModel.is_visible == True).all()
    
    # Combine the data into one response
    car_details = {
        "car": car,
        "inventory": inventory,
        "inventory_logs": inventory_logs,
        "reviews": reviews
    }

    return car_details

class CarResponse(CarBase):
    car_id: int
    quantity: Optional[int] = None
    rating: Optional[float] = None
    description: Optional[str] = None

    class Config:
        orm_mode = True

@router.get("/{car_id}/details", response_model=CarResponse)
def read_car_details(car_id: int, db: Session = Depends(get_db)):
    db_car = get_car_details(db, car_id)
    if db_car is None:
        raise HTTPException(status_code=404, detail="Car not found")
    return db_car

def generate_car_description(db: Session, car: Car) -> str:
    """Generate a description for a car based on its attributes."""
    description_parts = []
    if car.manufacturer:
        description_parts.append(f"Manufacturer: {car.manufacturer}")
    if car.model_name:
        description_parts.append(f"Model: {car.model_name}")
    if car.year:
        description_parts.append(f"Year: {car.year}")
    if car.engine_type:
        description_parts.append(f"Engine: {car.engine_type}")
    if car.transmission:
        description_parts.append(f"Transmission: {car.transmission}")
    if car.color:
        description_parts.append(f"Color: {car.color}")
    if car.mileage is not None:
        description_parts.append(f"Mileage: {car.mileage} km")
    if car.fuel_capacity is not None:
        description_parts.append(f"Fuel Capacity: {car.fuel_capacity} L")
    if car.seating_capacity is not None:
        description_parts.append(f"Seating Capacity: {car.seating_capacity}")
    if car.price is not None:
        description_parts.append(f"Price: ${car.price}")
    return ", ".join(description_parts) if description_parts else "No description available."

def get_car_details(db: Session, car_id: int):
    """Fetch car details with car_inventory data for a specific car_id."""
    result = (
        db.query(Car, CarInventory.quantity)
        .join(CarInventory, Car.car_id == CarInventory.car_id, isouter=True)
        .filter(Car.car_id == car_id)
        .first()
    )
    if result is None:
        return None
    car, quantity = result
    car_dict = car.__dict__
    car_dict['quantity'] = quantity
    car_dict['rating'] = db.query(func.avg(ReviewModel.rating)).filter(ReviewModel.car_id == car.car_id).scalar()
    car_dict['description'] = generate_car_description(db, car)
    return CarResponse.parse_obj(car_dict)