from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.database import get_db
from pydantic import BaseModel

class NewCar(BaseModel):
    category_id: int
    modelnum: str
    manufacturer: str
    model_name: str
    year: int
    engine_type: str
    transmission: str
    color: str
    mileage: int
    fuel_capacity: int
    seating_capacity: int
    price: int

class NewUser(BaseModel):
    email: str
    username: str
    password: str
    address: str
    phone: str
    dob: str
    card_num: str
    bank_acc: str

class UpdateCar(BaseModel):
    price: int
    available: bool

router = APIRouter(
    prefix="/queries",
    tags=["queries"],
)

# 1. Available Cars with Category (NATURAL JOIN)
@router.get("/available-cars-with-category")
def get_available_cars_with_category(db: Session = Depends(get_db)):
    query = text("""
        SELECT c.model_name , c.manufacturer , c.year , c.price , cat.name AS category_name
        FROM cars c
        NATURAL JOIN categories cat
        WHERE c.available = TRUE;
    """)
    result = db.execute(query).fetchall()
    return [{"model_name": row[0], "manufacturer": row[1], "year": row[2], "price": row[3], "category_name": row[4]} for row in result]

# 2. All Users and Their Purchases (LEFT OUTER JOIN)
@router.get("/users-and-purchases")
def get_users_and_purchases(db: Session = Depends(get_db)):
    query = text("""
        SELECT u.username , p.purchase_id , p.amount , p.date
        FROM users u
        LEFT OUTER JOIN purchase p ON u.user_id = p.user_id
        WHERE p.status = 'paid' OR p.purchase_id IS NULL;
    """)
    result = db.execute(query).fetchall()
    return [{"username": row[0], "purchase_id": row[1], "amount": row[2], "date": row[3]} for row in result]

# 3. Order Details with Car Information (USING Clause)
@router.get("/order-details-with-car-info")
def get_order_details_with_car_info(db: Session = Depends(get_db)):
    query = text("""
        SELECT o.order_id , o.date AS order_date , c.model_name
        FROM orders o
        JOIN order_item oi USING (order_id)
        JOIN cars c USING (car_id)
        WHERE o.status = 'processing';
    """)
    result = db.execute(query).fetchall()
    return [{"order_id": row[0], "order_date": row[1], "model_name": row[2]} for row in result]

# 4. Users with Completed Purchases (EXISTS)
@router.get("/users-with-completed-purchases")
def get_users_with_completed_purchases(db: Session = Depends(get_db)):
    query = text("""
        SELECT u.username , u.email
        FROM users u
        WHERE EXISTS (
            SELECT 1
            FROM purchase p
            WHERE p.user_id = u.user_id
            AND p.status = 'paid'
        );
    """)
    result = db.execute(query).fetchall()
    return [{"username": row[0], "email": row[1]} for row in result]

# 5. Cars More Expensive Than All Cars in a Category (ALL)
@router.get("/cars-more-expensive-than-category/{category_id}")
def get_cars_more_expensive_than_category(category_id: int, db: Session = Depends(get_db)):
    query = text("""
        SELECT model_name , price
        FROM cars
        WHERE price > ALL (
            SELECT price
            FROM cars
            WHERE category_id = :cat_id
        )
        ORDER BY price DESC;
    """)
    result = db.execute(query, {"cat_id": category_id}).fetchall()
    return [{"model_name": row[0], "price": row[1]} for row in result]

# 6. Employees and Number of Orders Handled (Scalar Subquery)
@router.get("/employees-and-orders-handled")
def get_employees_and_orders_handled(db: Session = Depends(get_db)):
    query = text("""
        SELECT e.emp_id , e.name , e.position ,
        (
            SELECT COUNT(*)
            FROM shipping s
            WHERE s.emp_id = e.emp_id
        ) AS total_shipments ,
        (
            SELECT COUNT(*)
            FROM shipping s
            WHERE s.emp_id = e.emp_id
            AND s.status = 'delivered'
        ) AS deliveries_completed
        FROM employees e
        WHERE e.status = 'active'
        ORDER BY deliveries_completed DESC, total_shipments DESC, e.name;
    """)
    result = db.execute(query).fetchall()
    return [{"emp_id": row[0], "name": row[1], "position": row[2], "total_shipments": row[3], "deliveries_completed": row[4]} for row in result]

# 7. Top 5 Most Reviewed Cars (WITH/CTE)
@router.get("/top-5-most-reviewed-cars")
def get_top_5_most_reviewed_cars(db: Session = Depends(get_db)):
    query = text("""
        WITH CarReviews AS (
            SELECT c.model_name , c.manufacturer , COUNT(r.review_id) AS review_count
            FROM cars c
            LEFT JOIN reviews r ON c.car_id = r.car_id
            GROUP BY c.model_name , c.manufacturer
        )
        SELECT model_name , manufacturer , review_count
        FROM CarReviews
        ORDER BY review_count DESC
        LIMIT 5;
    """)
    result = db.execute(query).fetchall()
    return [{"model_name": row[0], "manufacturer": row[1], "review_count": row[2]} for row in result]

# 8. Available Cars and Inventory Quantities (INNER JOIN)
@router.get("/available-cars-and-inventory")
def get_available_cars_and_inventory(db: Session = Depends(get_db)):
    query = text("""
        SELECT c.model_name , c.manufacturer , ci.quantity , ci.location
        FROM cars c
        INNER JOIN car_inventory ci ON c.car_id = ci.car_id
        WHERE c.available = TRUE AND ci.quantity > 0
        ORDER BY ci.quantity DESC;
    """)
    result = db.execute(query).fetchall()
    return [{"model_name": row[0], "manufacturer": row[1], "quantity": row[2], "location": row[3]} for row in result]

# 9. Employees and Their Shipping Records (RIGHT OUTER JOIN)
@router.get("/employees-and-shipping-records")
def get_employees_and_shipping_records(db: Session = Depends(get_db)):
    query = text("""
        SELECT e.emp_id , e.name AS employee_name , e.department ,
        s.ship_id , s.shipping_provider , s.status AS shipping_status ,
        s.shipped_date , s.delivery_date
        FROM shipping s
        RIGHT OUTER JOIN employees e ON s.emp_id = e.emp_id
        WHERE e.status = 'active'
        ORDER BY s.shipped_date DESC NULLS LAST;
    """)
    result = db.execute(query).fetchall()
    return [{"emp_id": row[0], "employee_name": row[1], "department": row[2], "ship_id": row[3], "shipping_provider": row[4], "shipping_status": row[5], "shipped_date": row[6], "delivery_date": row[7]} for row in result]

# 10. Visible Reviews with User and Car Details (Multiple JOIN)
@router.get("/visible-reviews")
def get_visible_reviews(db: Session = Depends(get_db)):
    query = text("""
        SELECT r.review_id , r.rating , r.review_text , u.username , c.model_name
        FROM reviews r
        JOIN users u USING (user_id)
        JOIN cars c USING (car_id)
        WHERE r.is_visible = TRUE
        ORDER BY r.created_at DESC;
    """)
    result = db.execute(query).fetchall()
    return [{"review_id": row[0], "rating": row[1], "review_text": row[2], "username": row[3], "model_name": row[4]} for row in result]

# 11. Electric or Hybrid Cars (Pattern Matching)
@router.get("/electric-or-hybrid-cars")
def get_electric_or_hybrid_cars(db: Session = Depends(get_db)):
    query = text("""
        SELECT model_name , manufacturer , engine_type
        FROM cars
        WHERE engine_type ~* '^(electric|hybrid)$'
        AND available = TRUE
        ORDER BY model_name;
    """)
    result = db.execute(query).fetchall()
    return [{"model_name": row[0], "manufacturer": row[1], "engine_type": row[2]} for row in result]

# 12. Insert a New Car (INSERT with Subquery)
@router.post("/cars")
def create_car(car: NewCar, db: Session = Depends(get_db)):
    query = text("""
        INSERT INTO cars (
            category_id , modelnum , manufacturer , model_name , year ,
            engine_type , transmission , color , mileage , fuel_capacity ,
            seating_capacity , price , available , added_date
        )
        VALUES (
            :category_id, :modelnum, :manufacturer, :model_name, :year,
            :engine_type, :transmission, :color, :mileage, :fuel_capacity,
            :seating_capacity, :price, TRUE, CURRENT_DATE
        )
        RETURNING car_id , model_name , price;
    """)
    result = db.execute(query, car.dict()).fetchone()
    db.commit()
    return {"car_id": result[0], "model_name": result[1], "price": result[2]}

# 13. Register a New User (INSERT)
@router.post("/users")
def create_user(user: NewUser, db: Session = Depends(get_db)):
    query = text("""
        INSERT INTO users (
            email , username , password , address , phone , dob , card_num ,
            bank_acc
        )
        VALUES (:email, :username, :password, :address, :phone, :dob, :card_num, :bank_acc)
        RETURNING user_id , username , email;
    """)
    result = db.execute(query, user.dict()).fetchone()
    db.commit()
    return {"user_id": result[0], "username": result[1], "email": result[2]}

# 14. Update Car Price and Availability (UPDATE)
@router.put("/cars/{car_id}")
def update_car(car_id: int, car: UpdateCar, db: Session = Depends(get_db)):
    query = text("""
        UPDATE cars
        SET price = :price,
            available = :available,
            added_date = CURRENT_DATE
        WHERE car_id = :car_id
        RETURNING car_id , model_name , price , available;
    """)
    result = db.execute(query, {"car_id": car_id, "price": car.price, "available": car.available}).fetchone()
    db.commit()
    if result:
        return {"car_id": result[0], "model_name": result[1], "price": result[2], "available": result[3]}
    else:
        raise HTTPException(status_code=404, detail="Car not found")

# 15. Cars Cheaper Than Those in a Category (ANY Subquery)
@router.get("/cars-cheaper-than-category/{category_id}")
def get_cars_cheaper_than_category(category_id: int, db: Session = Depends(get_db)):
    query = text("""
        SELECT c.car_id , c.model_name , c.manufacturer , c.price
        FROM cars c
        WHERE c.price < ANY (
            SELECT c2.price
            FROM cars c2
            WHERE c2.category_id = :cat_id
        )
        ORDER BY c.price ASC;
    """)
    result = db.execute(query, {"cat_id": category_id}).fetchall()
    return [{"car_id": row[0], "model_name": row[1], "manufacturer": row[2], "price": row[3]} for row in result]

# 16. Delete User by Email (DELETE)
@router.delete("/users/{email}")
def delete_user(email: str, db: Session = Depends(get_db)):
    query = text("""
        DELETE FROM users
        WHERE email = :email
        RETURNING user_id , username , email;
    """)
    result = db.execute(query, {"email": email}).fetchone()
    db.commit()
    if result:
        return {"user_id": result[0], "username": result[1], "email": result[2]}
    else:
        raise HTTPException(status_code=404, detail="User not found")
