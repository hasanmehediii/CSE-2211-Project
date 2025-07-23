# app/models/purchase.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import Column, Integer, Numeric, String, ForeignKey
from sqlalchemy.orm import Session, relationship
from pydantic import BaseModel
from typing import List, Optional
from app.database import get_db, Base

class PurchaseModel(Base):
    __tablename__ = "purchase"
    
    purchase_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    amount = Column(Numeric(10, 2), nullable=False)
    payment_method = Column(String(50))
    status = Column(String(50))
    invoice_number = Column(String(50))
    
    user = relationship("User")
    reviews = relationship("ReviewModel", back_populates="purchase")
    orders = relationship("Order", back_populates="purchase")

class PurchaseBase(BaseModel):
    user_id: int
    amount: float
    payment_method: Optional[str] = None
    status: Optional[str] = None
    invoice_number: Optional[str] = None

class PurchaseCreate(PurchaseBase):
    pass

class PurchaseResponse(PurchaseBase):
    purchase_id: int

    class Config:
        orm_mode = True

class PurchaseUpdatePayment(BaseModel):
    amount: float
    status: Optional[str] = None

router = APIRouter(prefix="/purchases", tags=["purchases"])

def get_purchase(db: Session, purchase_id: int):
    return db.query(PurchaseModel).filter(PurchaseModel.purchase_id == purchase_id).first()

def get_purchases(db: Session, skip: int = 0, limit: int = 100):
    return db.query(PurchaseModel).offset(skip).limit(limit).all()

def create_purchase(db: Session, purchase: PurchaseCreate):
    db_purchase = PurchaseModel(**purchase.dict())
    db.add(db_purchase)
    db.commit()
    db.refresh(db_purchase)
    return db_purchase

@router.post("/", response_model=PurchaseResponse)
def create_purchase_endpoint(purchase: PurchaseCreate, db: Session = Depends(get_db)):
    return create_purchase(db, purchase)

@router.get("/", response_model=List[PurchaseResponse])
def read_purchases(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return get_purchases(db, skip, limit)

@router.patch("/{purchase_id}", response_model=PurchaseResponse)
def update_purchase_payment(purchase_id: int, payment_update: PurchaseUpdatePayment, db: Session = Depends(get_db)):
    purchase = db.query(PurchaseModel).filter(PurchaseModel.purchase_id == purchase_id).first()
    if not purchase:
        raise HTTPException(status_code=404, detail="Purchase not found")

    purchase.amount = payment_update.amount
    if payment_update.status:
        purchase.status = payment_update.status
    db.commit()
    db.refresh(purchase)
    return purchase

@router.get("/{purchase_id}", response_model=PurchaseResponse)
def read_purchase(purchase_id: int, db: Session = Depends(get_db)):
    db_purchase = get_purchase(db, purchase_id)
    if db_purchase is None:
        raise HTTPException(status_code=404, detail="Purchase not found")
    return db_purchase