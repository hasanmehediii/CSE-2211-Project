from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import Column, Integer, String, Date
from sqlalchemy.orm import Session, relationship
from pydantic import BaseModel
from typing import List, Optional
from app.database import get_db, Base
from datetime import date, datetime
from passlib.context import CryptContext

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class User(Base):
    __tablename__ = "users"
    
    user_id = Column(Integer, primary_key=True, index=True)
    email = Column(String(100), unique=True, nullable=False)
    username = Column(String(50), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    address = Column(String(255))
    phone = Column(String(20))
    dob = Column(Date)
    card_num = Column(String(20))
    bank_acc = Column(String(20))
    
    reviews = relationship("ReviewModel", back_populates="user")
    purchases = relationship("PurchaseModel", back_populates="user")

class UserBase(BaseModel):
    email: str
    username: str
    password: str
    address: Optional[str] = None
    phone: Optional[str] = None
    dob: Optional[date] = None
    card_num: Optional[str] = None
    bank_acc: Optional[str] = None

class ReviewSummary(BaseModel):
    review_id: int
    car_id: int
    rating: int
    review_text: Optional[str] = None
    created_at: datetime

    class Config:
        orm_mode = True

class PurchaseSummary(BaseModel):
    purchase_id: int
    amount: float
    status: Optional[str] = None
    invoice_number: Optional[str] = None

    class Config:
        orm_mode = True

class UserPublic(BaseModel):
    user_id: int
    email: str
    username: str
    address: Optional[str] = None
    phone: Optional[str] = None
    dob: Optional[date] = None
    card_num: Optional[str] = None
    bank_acc: Optional[str] = None

    class Config:
        orm_mode = True

class UserResponse(UserBase):
    user_id: int

    class Config:
        orm_mode = True

class UserWithActivityResponse(UserPublic):
    reviews: List[ReviewSummary] = []
    purchases: List[PurchaseSummary] = []

    class Config:
        orm_mode = True

class UserCreate(UserBase):
    pass


class UserUpdate(BaseModel):
    email: Optional[str] = None
    username: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    dob: Optional[date] = None
    card_num: Optional[str] = None
    bank_acc: Optional[str] = None


class UserLogin(BaseModel):
    email: str
    password: str

router = APIRouter(prefix="/users", tags=["users"])

def get_user(db: Session, user_id: int):
    return db.query(User).filter(User.user_id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(User).offset(skip).limit(limit).all()

def create_user(db: Session, user: UserCreate):
    hashed_password = pwd_context.hash(user.password)
    db_user = User(
        email=user.email,
        username=user.username,
        password=hashed_password,
        address=user.address,
        phone=user.phone,
        dob=user.dob,
        card_num=user.card_num,
        bank_acc=user.bank_acc
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.get("/{user_id}/all", response_model=UserWithActivityResponse)
def get_user_full_info(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.put("/{user_id}", response_model=UserPublic)
def update_user_endpoint(user_id: int, user_update: UserUpdate, db: Session = Depends(get_db)):
    db_user = get_user(db, user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    update_data = user_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_user, key, value)

    db.commit()
    db.refresh(db_user)
    return db_user

@router.post("/", response_model=UserResponse)
def create_user_endpoint(user: UserCreate, db: Session = Depends(get_db)):
    db_user = get_user_by_email(db, user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    db_user = get_user_by_email(db, user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Username already taken")
    return create_user(db, user)

@router.get("/", response_model=List[UserResponse])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return get_users(db, skip, limit)

@router.get("/{user_id}", response_model=UserPublic)
def read_user(user_id: int, db: Session = Depends(get_db)):
    db_user = get_user(db, user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@router.post("/login")
def login_user(user: UserLogin, db: Session = Depends(get_db)):
    db_user = get_user_by_email(db, user.email)
    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    try:
        if not pwd_context.verify(user.password, db_user.password):
            raise HTTPException(status_code=401, detail="Invalid email or password")
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error verifying password")
    return {
        "message": "Login successful",
        "user_id": db_user.user_id,
        "username": db_user.username
    }