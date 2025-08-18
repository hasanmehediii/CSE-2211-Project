from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional
from pydantic import BaseModel

from app.database import get_db
from app.models.car import Car, CarCreate
from app.models.car_inventory import CarInventory
from app.models.user import User, UserUpdate
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.purchase import PurchaseModel

class CarUpdate(BaseModel):
    category_id: Optional[int] = None
    modelnum: Optional[str] = None
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
    available: Optional[bool] = None
    image_link: Optional[str] = None

class StockUpdate(BaseModel):
    quantity: int

admin_router = APIRouter()

# Helper function to convert SQLAlchemy model to dict
def model_to_dict(obj):
    if obj is None:
        return None
    return {c.name: getattr(obj, c.name) for c in obj.__table__.columns}

@admin_router.post("/admin/cars", response_model=dict)
def create_car(car: CarCreate, db: Session = Depends(get_db)):
    db_car = Car(**car.dict())
    db.add(db_car)
    db.commit()
    db.refresh(db_car)
    # Also create an inventory entry
    inventory = CarInventory(car_id=db_car.car_id, quantity=10) # Default quantity
    db.add(inventory)
    db.commit()
    return {"message": "Car created successfully", "car_id": db_car.car_id}

@admin_router.put("/admin/cars/{car_id}", response_model=dict)
def update_car(car_id: int, car_update: CarUpdate, db: Session = Depends(get_db)):
    db_car = db.query(Car).filter(Car.car_id == car_id).first()
    if not db_car:
        raise HTTPException(status_code=404, detail="Car not found")
    update_data = car_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_car, key, value)
    db.commit()
    db.refresh(db_car)
    return {"message": "Car updated successfully", "car_id": db_car.car_id}

@admin_router.put("/admin/cars/{car_id}/stock", response_model=dict)
def update_car_stock(car_id: int, stock_update: StockUpdate, db: Session = Depends(get_db)):
    db_inventory = db.query(CarInventory).filter(CarInventory.car_id == car_id).first()
    if not db_inventory:
        # If no inventory exists, create one
        db_inventory = CarInventory(car_id=car_id, quantity=stock_update.quantity)
        db.add(db_inventory)
    else:
        db_inventory.quantity = stock_update.quantity
    db.commit()
    return {"message": "Car stock updated successfully", "car_id": car_id}


@admin_router.delete("/admin/cars/{car_id}", response_model=dict)
def delete_car(car_id: int, db: Session = Depends(get_db)):
    # Also delete associated inventory
    db.query(CarInventory).filter(CarInventory.car_id == car_id).delete()
    db_car = db.query(Car).filter(Car.car_id == car_id).first()
    if not db_car:
        raise HTTPException(status_code=404, detail="Car not found")
    db.delete(db_car)
    db.commit()
    return {"message": "Car deleted successfully", "car_id": car_id}

@admin_router.get("/admin/cars", response_model=List[dict])
def get_all_cars(db: Session = Depends(get_db)):
    results = db.query(Car, CarInventory.quantity).outerjoin(CarInventory, Car.car_id == CarInventory.car_id).all()
    cars_list = []
    for car, quantity in results:
        car_dict = model_to_dict(car)
        car_dict['quantity'] = quantity if quantity is not None else 0
        cars_list.append(car_dict)
    return cars_list

@admin_router.get("/admin/cars/{car_id}", response_model=dict)
def get_car_details(car_id: int, db: Session = Depends(get_db)):
    result = db.query(Car, CarInventory.quantity).outerjoin(CarInventory, Car.car_id == CarInventory.car_id).filter(Car.car_id == car_id).first()
    if not result:
        raise HTTPException(status_code=404, detail="Car not found")
    car, quantity = result
    car_dict = model_to_dict(car)
    car_dict['quantity'] = quantity if quantity is not None else 0
    return car_dict

@admin_router.get("/admin/users", response_model=List[dict])
def get_all_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return [model_to_dict(user) for user in users]

@admin_router.get("/admin/users/{user_id}", response_model=dict)
def get_user_details(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).options(joinedload(User.purchases), joinedload(User.reviews)).filter(User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user_dict = model_to_dict(user)
    user_dict["purchases"] = [model_to_dict(p) for p in user.purchases]
    user_dict["reviews"] = [model_to_dict(r) for r in user.reviews]
    return user_dict

@admin_router.put("/admin/users/{user_id}", response_model=dict)
def update_user(user_id: int, user_update: UserUpdate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.user_id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    update_data = user_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_user, key, value)
    db.commit()
    db.refresh(db_user)
    return {"message": "User updated successfully", "user_id": db_user.user_id}

@admin_router.delete("/admin/users/{user_id}", response_model=dict)
def delete_user(user_id: int, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.user_id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(db_user)
    db.commit()
    return {"message": "User deleted successfully", "user_id": user_id}

@admin_router.get("/admin/orders", response_model=List[dict])
def get_all_orders(db: Session = Depends(get_db)):
    orders = db.query(Order).all()
    return [model_to_dict(order) for order in orders]

@admin_router.get("/admin/orders/{order_id}", response_model=dict)
def get_order_details(order_id: int, db: Session = Depends(get_db)):
    order = db.query(Order).options(joinedload(Order.order_items)).filter(Order.order_id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    order_dict = model_to_dict(order)
    order_dict["order_items"] = [model_to_dict(item) for item in order.order_items]
    return order_dict

@admin_router.get("/admin/order-items", response_model=List[dict])
def get_all_order_items(db: Session = Depends(get_db)):
    order_items = db.query(OrderItem).all()
    return [model_to_dict(item) for item in order_items]

@admin_router.get("/admin/order-items/{order_item_id}", response_model=dict)
def get_order_item_details(order_item_id: int, db: Session = Depends(get_db)):
    item = db.query(OrderItem).filter(OrderItem.order_item_id == order_item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Order Item not found")
    return model_to_dict(item)

@admin_router.get("/admin/purchases", response_model=List[dict])
def get_all_purchases(db: Session = Depends(get_db)):
    purchases = db.query(PurchaseModel).all()
    return [model_to_dict(p) for p in purchases]

@admin_router.get("/admin/purchases/{purchase_id}", response_model=dict)
def get_purchase_details(purchase_id: int, db: Session = Depends(get_db)):
    purchase = db.query(PurchaseModel).options(joinedload(PurchaseModel.orders), joinedload(PurchaseModel.user)).filter(PurchaseModel.purchase_id == purchase_id).first()
    if not purchase:
        raise HTTPException(status_code=404, detail="Purchase not found")
    purchase_dict = model_to_dict(purchase)
    purchase_dict["orders"] = [model_to_dict(o) for o in purchase.orders]
    purchase_dict["user"] = model_to_dict(purchase.user)
    return purchase_dict
