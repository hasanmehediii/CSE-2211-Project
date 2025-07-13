from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import Column, Integer, String, Numeric, Date, Text
from sqlalchemy.orm import Session, declarative_base
from pydantic import BaseModel
from typing import List, Optional
from app.database import get_db
from datetime import date

Base = declarative_base()

class Employee(Base):
    __tablename__ = "employees"
    
    emp_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100))
    email = Column(String(100), unique=True)
    phone = Column(String(20))
    dob = Column(Date)
    address = Column(Text)
    hire_date = Column(Date)
    salary = Column(Numeric(10, 2))
    position = Column(String(50))
    department = Column(String(50))
    status = Column(String(20), default="active")

class EmployeeBase(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    dob: Optional[date] = None
    address: Optional[str] = None
    hire_date: Optional[date] = None
    salary: Optional[float] = None
    position: Optional[str] = None
    department: Optional[str] = None
    status: str = "active"

class EmployeeCreate(EmployeeBase):
    pass

class Employee(EmployeeBase):
    emp_id: int

    class Config:
        orm_mode = True

router = APIRouter(prefix="/employees", tags=["employees"])

def get_employee(db: Session, emp_id: int):
    return db.query(Employee).filter(Employee.emp_id == emp_id).first()

def get_employees(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Employee).offset(skip).limit(limit).all()

def create_employee(db: Session, employee: EmployeeCreate):
    db_employee = Employee(**employee.dict())
    db.add(db_employee)
    db.commit()
    db.refresh(db_employee)
    return db_employee

@router.post("/", response_model=Employee)
def create_employee_endpoint(employee: EmployeeCreate, db: Session = Depends(get_db)):
    return create_employee(db, employee)

@router.get("/", response_model=List[Employee])
def read_employees(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return get_employees(db, skip, limit)

@router.get("/{emp_id}", response_model=Employee)
def read_employee(emp_id: int, db: Session = Depends(get_db)):
    db_employee = get_employee(db, emp_id)
    if db_employee is None:
        raise HTTPException(status_code=404, detail="Employee not found")
    return db_employee