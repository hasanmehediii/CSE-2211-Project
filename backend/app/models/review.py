from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import Column, Integer, Text, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import Session, relationship
from pydantic import BaseModel
from typing import List, Optional
from app.database import get_db, Base
from datetime import datetime
from app.models.user import User  # Import the User model

class ReviewModel(Base):
    __tablename__ = "reviews"
    
    review_id = Column(Integer, primary_key=True, index=True)
    purchase_id = Column(Integer, ForeignKey("purchase.purchase_id"), nullable=False)
    car_id = Column(Integer, ForeignKey("cars.car_id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    rating = Column(Integer, nullable=False)
    review_text = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    is_visible = Column(Boolean, default=True)
    helpful_count = Column(Integer, default=0)
    employee_feedback = Column(Text)

    purchase = relationship("PurchaseModel", back_populates="reviews")
    car = relationship("Car", back_populates="reviews")
    user = relationship("User", back_populates="reviews")

class ReviewBase(BaseModel):
    purchase_id: int
    car_id: int
    user_id: int
    rating: int
    review_text: Optional[str] = None
    is_visible: bool = True
    helpful_count: int = 0
    employee_feedback: Optional[str] = None

class ReviewCreate(ReviewBase):
    pass

class ReviewResponse(ReviewBase):
    review_id: int
    created_at: datetime
    username: Optional[str] = None  # Include username for CarDetail.jsx

    class Config:
        orm_mode = True

router = APIRouter(prefix="/reviews", tags=["reviews"])

def get_review(db: Session, review_id: int):
    return db.query(ReviewModel).filter(ReviewModel.review_id == review_id).first()

def get_reviews(db: Session, skip: int = 0, limit: int = 100):
    return db.query(ReviewModel).offset(skip).limit(limit).all()

def get_reviews_by_car_id(db: Session, car_id: int, skip: int = 0, limit: int = 100):
    return (
        db.query(ReviewModel)
        .join(User, ReviewModel.user_id == User.user_id)
        .filter(ReviewModel.car_id == car_id, ReviewModel.is_visible == True)
        .offset(skip)
        .limit(limit)
        .all()
    )

def create_review(db: Session, review: ReviewCreate):
    db_review = ReviewModel(**review.dict())
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    return db_review

@router.post("/", response_model=ReviewResponse)
def create_review_endpoint(review: ReviewCreate, db: Session = Depends(get_db)):
    return create_review(db, review)

@router.get("/", response_model=List[ReviewResponse])
def read_reviews(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return get_reviews(db, skip, limit)

@router.get("/{review_id}", response_model=ReviewResponse)
def read_review(review_id: int, db: Session = Depends(get_db)):
    db_review = get_review(db, review_id)
    if db_review is None:
        raise HTTPException(status_code=404, detail="Review not found")
    return db_review

@router.get("/cars/{car_id}/reviews", response_model=List[ReviewResponse])
def read_reviews_by_car_id(car_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    reviews = get_reviews_by_car_id(db, car_id, skip, limit)
    if not reviews:
        raise HTTPException(status_code=404, detail="No reviews found for this car")
    return reviews