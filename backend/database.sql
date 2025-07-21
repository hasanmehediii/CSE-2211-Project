CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE,
    username VARCHAR(50) UNIQUE,
    password VARCHAR(100),
    address TEXT,
    phone VARCHAR(20),
    dob DATE,
    card_num VARCHAR(30),
    bank_acc varchar(50)
);

CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) not null,
    description text,
    created_at TIMESTAMP default current_timestamp,
    updated_at TIMESTAMP default current_timestamp
);

CREATE TABLE cars (
    car_id SERIAL PRIMARY KEY,
    category_id INT REFERENCES categories(category_id),
    modelnum VARCHAR(50) NOT NULL,
    manufacturer VARCHAR(100),
    model_name VARCHAR(100),
    year INT,
    engine_type VARCHAR(50), -- e.g., Petrol, Diesel, Hybrid, Electric
    transmission VARCHAR(30), -- Manual / Automatic
    color VARCHAR(30),
    mileage INT, -- in kilometers or miles
    fuel_capacity NUMERIC(5,2),
    seating_capacity INT,
    price NUMERIC(10, 2),
    image_link VARCHAR(255), -- URL to the car image
    available BOOLEAN DEFAULT TRUE,
    added_date DATE DEFAULT CURRENT_DATE
);

CREATE TABLE employees (
    emp_id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20),
    dob DATE,
    address TEXT,
    hire_date DATE,
    salary NUMERIC(10, 2),
    position VARCHAR(50),
    department VARCHAR(50),
    status VARCHAR(20) DEFAULT 'active'  -- active, inactive, on_leave etc.
);

CREATE TABLE car_inventory (
    inventory_id SERIAL PRIMARY KEY,
    car_id INT REFERENCES cars(car_id),
    location VARCHAR(100), -- Optional: if you track cars across warehouses
    quantity INT CHECK (quantity >= 0),
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reorder_level INT DEFAULT 5, -- triggers restock alert
    notes TEXT
);

CREATE TABLE car_inventory_log (
    inventory_id INT REFERENCES car_inventory(inventory_id),
    car_id INT REFERENCES cars(car_id),
    quantity INT CHECK (quantity >= 0),
    unit_price NUMERIC(10,2), -- price per unit at the time of log
    total_value NUMERIC(12,2), -- quantity × unit_price
    condition VARCHAR(50), -- 'new', 'used', 'damaged'
    warehouse_location VARCHAR(100), -- where it's stored
    batch_code VARCHAR(50), -- optional for manufacturer tracking
    received_date DATE, -- when the items arrived
    expiration_date DATE, -- useful for battery stock, etc.
    PRIMARY KEY (inventory_id, car_id)
);

CREATE TABLE purchase (
    purchase_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    date DATE DEFAULT CURRENT_DATE,
    amount NUMERIC(10, 2),
    payment_method VARCHAR(50), -- 'Credit Card', 'Bank Transfer', 'Cash'
    status VARCHAR(30) DEFAULT 'pending', -- pending, paid, refunded, failed
    invoice_number VARCHAR(100) UNIQUE,
    notes TEXT
);

CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    purchase_id INT REFERENCES purchase(purchase_id),
    date DATE DEFAULT CURRENT_DATE,
    status VARCHAR(30) DEFAULT 'processing', -- shipped, delivered, cancelled, etc.
    shipping_address TEXT,
    tracking_number VARCHAR(100),
    expected_delivery DATE
);

CREATE TABLE order_item (
    order_item_id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(order_id),
    car_id INT REFERENCES cars(car_id),
    quantity INT CHECK (quantity > 0),
    price_at_order NUMERIC(10, 2), -- to preserve historic pricing
    discount NUMERIC(5,2) DEFAULT 0.00
);

CREATE TABLE shipping (
    ship_id SERIAL PRIMARY KEY,
    emp_id INT REFERENCES employees(emp_id),
    order_id INT REFERENCES orders(order_id),
    shipping_provider VARCHAR(100), -- e.g., FedEx, DHL
    tracking_number VARCHAR(100),
    status VARCHAR(30) DEFAULT 'pending', -- shipped, delivered, delayed, failed
    shipped_date DATE,
    delivery_date DATE,
    delivery_address TEXT,
    remarks TEXT
);

CREATE TABLE reviews (
    review_id SERIAL PRIMARY KEY,
    purchase_id INT REFERENCES purchase(purchase_id),
    car_id INT REFERENCES cars(car_id),
    user_id INT REFERENCES users(user_id), -- optional but useful
    rating INT CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_visible BOOLEAN DEFAULT TRUE, -- moderation toggle
    helpful_count INT DEFAULT 0, -- like upvotes
    employee_feedback TEXT -- optional if staff behavior is reviewed
);