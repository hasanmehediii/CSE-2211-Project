from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine
from app.models import category, car, user, employee, car_inventory, car_inventory_log, purchase, order, order_item, shipping, review

app = FastAPI(title="Car Purchase API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create database tables
category.Base.metadata.create_all(bind=engine)
car.Base.metadata.create_all(bind=engine)
user.Base.metadata.create_all(bind=engine)
employee.Base.metadata.create_all(bind=engine)
car_inventory.Base.metadata.create_all(bind=engine)
car_inventory_log.Base.metadata.create_all(bind=engine)
purchase.Base.metadata.create_all(bind=engine)
order.Base.metadata.create_all(bind=engine)
order_item.Base.metadata.create_all(bind=engine)
shipping.Base.metadata.create_all(bind=engine)
review.Base.metadata.create_all(bind=engine)

# Include routers
app.include_router(category.router)
app.include_router(car.router)
app.include_router(user.router)
app.include_router(employee.router)
app.include_router(car_inventory.router)
app.include_router(car_inventory_log.router)
app.include_router(purchase.router)
app.include_router(order.router)
app.include_router(order_item.router)
app.include_router(shipping.router)
app.include_router(review.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Car Purchase API"}