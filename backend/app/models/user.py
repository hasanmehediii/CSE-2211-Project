from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import Column, Integer, String, Text, Date
from sqlalchemy.orm import Session, declarative_base
from pydantic import BaseModel
from typing import List, Optional
from app.database import get_db
from datetime import date

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    user_id = Column(Integer, primary_key=True, index=True)
    email = Column(String(100), unique=True)
    username = Column(String(50), unique=True)
    password = Column(String(100))
    address = Column(Text)
    phone = Column(String(20))
    dob = Column(Date)
    card_num = Column(String(30))
    bank_acc = Column(String(50))

class UserBase(BaseModel):
    email: Optional[str] = None
    username: Optional[str] = None
    password: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    dob: Optional[date] = None
    card_num: Optional[str] = None
    bank_acc: Optional[str] = None

class UserCreate(UserBase):
    pass

class User(UserBase):
    user_id: int

    class Config:
        orm_mode = True

router = APIRouter(prefix="/users", tags=["users"])

def get_user(db: Session, user_id: int):
    return db.query(User).filter(User.user_id == user_id).first()

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(User).offset(skip).limit(limit).all()

def create_user(db: Session, user: UserCreate):
    db_user = User(**user.dict())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.post("/", response_model=User)
def create_user_endpoint(user: UserCreate, db: Session = Depends(get_db)):
    return create_user(db, user)

@router.get("/", response_model=List[User])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return get_users(db, skip, limit)

@router.get("/{user_id}", response_model=User)
def read_user(user_id: int, db: Session = Depends(get_db)):
    db_user = get_user(db, user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user