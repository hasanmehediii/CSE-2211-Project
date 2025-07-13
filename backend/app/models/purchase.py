from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import Column, Integer, Numeric, String, Date, ForeignKey, Text
from sqlalchemy.orm import Session , declarative_base
from pydantic import BaseModel
from typing import List, Optional
from app.database import get_db
from datetime import date

Base = declarative_base()

class Purchase(Base):
    __tablename__ = "purchase"
    
    purchase_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    date = Column(Date, default=date.today)
    amount = Column(Numeric(10, 2))
    payment_method = Column(String(50))
    status = Column(String(30), default="pending")
    invoice_number = Column(String(100), unique=True)
    notes = Column(Text)

class PurchaseBase(BaseModel):
    user_id: int
    date: date
    amount: Optional[float] = None
    payment_method: Optional[str] = None
    status: str = "pending"
    invoice_number: Optional[str] = None
    notes: Optional[str] = None

class PurchaseCreate(PurchaseBase):
    pass

class Purchase(PurchaseBase):
    purchase_id: int

    class Config:
        orm_mode = True

router = APIRouter(prefix="/purchases", tags=["purchases"])

def get_purchase(db: Session, purchase_id: int):
    return db.query(Purchase).filter(Purchase.purchase_id == purchase_id).first()

def get_purchases(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Purchase).offset(skip).limit(limit).all()

def create_purchase(db: Session, purchase: PurchaseCreate):
    db_purchase = Purchase(**purchase.dict())
    db.add(db_purchase)
    db.commit()
    db.refresh(db_purchase)
    return db_purchase

@router.post("/", response_model=Purchase)
def create_purchase_endpoint(purchase: PurchaseCreate, db: Session = Depends(get_db)):
    return create_purchase(db, purchase)

@router.get("/", response_model=List[Purchase])
def read_purchases(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return get_purchases(db, skip, limit)

@router.get("/{purchase_id}", response_model=Purchase)
def read_purchase(purchase_id: int, db: Session = Depends(get_db)):
    db_purchase = get_purchase(db, purchase_id)
    if db_purchase is None:
        raise HTTPException(status_code=404, detail="Purchase not found")
    return db_purchase