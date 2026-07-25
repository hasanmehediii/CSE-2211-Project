# app/main.py
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.models import category, car, user, employee, car_inventory, car_inventory_log, purchase, order, order_item, shipping, review
from app import queries
from app.admin import admin_router

app = FastAPI(title="Car Purchase API")

# Add CORS middleware
origins = [
    "http://localhost:5173",  # Default for local development
    "http://127.0.0.1:5173",
    "http://localhost:4173",
    "http://127.0.0.1:4173",
]

# For Vercel deployment
vercel_url = os.environ.get("VERCEL_URL")
if vercel_url:
    origins.append(f"https://{vercel_url}")

# For Render deployment
render_frontend_url = os.environ.get("FRONTEND_URL")
if render_frontend_url:
    origins.append(render_frontend_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create all database tables
Base.metadata.create_all(bind=engine)

# Include routers
api_prefix = "/api"
app.include_router(category.router, prefix=api_prefix)
app.include_router(car.router, prefix=api_prefix)
app.include_router(user.router, prefix=api_prefix)
app.include_router(employee.router, prefix=api_prefix)
app.include_router(car_inventory.router, prefix=api_prefix)
app.include_router(car_inventory_log.router, prefix=api_prefix)
app.include_router(purchase.router, prefix=api_prefix)
app.include_router(order.router, prefix=api_prefix)
app.include_router(order_item.router, prefix=api_prefix)
app.include_router(shipping.router, prefix=api_prefix)
app.include_router(review.router, prefix=api_prefix)
app.include_router(queries.router, prefix=api_prefix)
app.include_router(admin_router, prefix=api_prefix)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Car Purchase API"}


@app.get("/health")
def health_check():
    return {"status": "ok"}
