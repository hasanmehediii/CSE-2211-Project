# Query Implementation Report

This document details the implementation of the 16 queries from `Queries.txt` in the project.

## Query Implementation Details

Below is a list of each query, its functionality, and where it has been implemented.

### User-Facing Queries

These queries are accessible to all users.

1.  **Available Cars with Category**
    *   **Functionality**: Fetches all available cars along with their category name.
    *   **Backend**: Implemented in `backend/app/queries.py` as the `get_available_cars_with_category` function, exposed via the `/queries/available-cars-with-category` endpoint.
    *   **Frontend**: Implemented in `frontend/src/pages/AvailableCars.jsx`.

2.  **Cars More Expensive Than Category**
    *   **Functionality**: Fetches all cars that are more expensive than all cars in a given category.
    *   **Backend**: Implemented in `backend/app/queries.py` as the `get_cars_more_expensive_than_category` function, exposed via the `/queries/cars-more-expensive-than-category/{category_id}` endpoint.
    *   **Frontend**: Implemented in `frontend/src/pages/ExpensiveCars.jsx`.

3.  **Visible Reviews**
    *   **Functionality**: Fetches all visible reviews with user and car details.
    *   **Backend**: Implemented in `backend/app/queries.py` as the `get_visible_reviews` function, exposed via the `/queries/visible-reviews` endpoint.
    *   **Frontend**: Implemented in `frontend/src/pages/Reviews.jsx`.

4.  **Electric or Hybrid Cars**
    *   **Functionality**: Fetches all available electric or hybrid cars.
    *   **Backend**: Implemented in `backend/app/queries.py` as the `get_electric_or_hybrid_cars` function, exposed via the `/queries/electric-or-hybrid-cars` endpoint.
    *   **Frontend**: Implemented in `frontend/src/pages/ElectricHybridCars.jsx`.

5.  **Comparable Cars (Cheaper Than Category)**
    *   **Functionality**: Fetches all cars that are cheaper than any car in a given category.
    *   **Backend**: Implemented in `backend/app/queries.py` as the `get_cars_cheaper_than_category` function, exposed via the `/queries/cars-cheaper-than-category/{category_id}` endpoint.
    *   **Frontend**: Implemented in `frontend/src/pages/ComparableCars.jsx`.

### Admin-Level Queries

These queries are accessible only to administrators via the admin panel.

6.  **All Users and Their Purchases**
    *   **Functionality**: Fetches all users and their purchase details.
    *   **Backend**: Implemented in `backend/app/queries.py` as the `get_users_and_purchases` function, exposed via the `/queries/users-and-purchases` endpoint.
    *   **Frontend**: Implemented in `frontend/src/pages/admin/UsersAndPurchases.jsx`.

7.  **Order Details with Car Information**
    *   **Functionality**: Fetches order details along with car information for processing orders.
    *   **Backend**: Implemented in `backend/app/queries.py` as the `get_order_details_with_car_info` function, exposed via the `/queries/order-details-with-car-info` endpoint.
    *   **Frontend**: Implemented in `frontend/src/pages/admin/OrderDetailsWithCarInfo.jsx`.

8.  **Users with Completed Purchases**
    *   **Functionality**: Fetches all users who have completed at least one purchase.
    *   **Backend**: Implemented in `backend/app/queries.py` as the `get_users_with_completed_purchases` function, exposed via the `/queries/users-with-completed-purchases` endpoint.
    *   **Frontend**: Implemented in `frontend/src/pages/admin/UsersWithCompletedPurchases.jsx`.

9.  **Employees and Number of Orders Handled**
    *   **Functionality**: Fetches all active employees and the number of orders they have handled.
    *   **Backend**: Implemented in `backend/app/queries.py` as the `get_employees_and_orders_handled` function, exposed via the `/queries/employees-and-orders-handled` endpoint.
    *   **Frontend**: Implemented in `frontend/src/pages/admin/EmployeesAndOrdersHandled.jsx`.

10. **Top 5 Most Reviewed Cars**
    *   **Functionality**: Fetches the top 5 most reviewed cars.
    *   **Backend**: Implemented in `backend/app/queries.py` as the `get_top_5_most_reviewed_cars` function, exposed via the `/queries/top-5-most-reviewed-cars` endpoint.
    *   **Frontend**: Implemented in `frontend/src/pages/admin/Top5MostReviewedCars.jsx`.

11. **Available Cars and Inventory Quantities**
    *   **Functionality**: Fetches all available cars with their inventory quantities and locations.
    *   **Backend**: Implemented in `backend/app/queries.py` as the `get_available_cars_and_inventory` function, exposed via the `/queries/available-cars-and-inventory` endpoint.
    *   **Frontend**: Implemented in `frontend/src/pages/admin/AvailableCarsAndInventory.jsx`.

12. **Employees and Their Shipping Records**
    *   **Functionality**: Fetches all active employees and their shipping records.
    *   **Backend**: Implemented in `backend/app/queries.py` as the `get_employees_and_shipping_records` function, exposed via the `/queries/employees-and-shipping-records` endpoint.
    *   **Frontend**: Implemented in `frontend/src/pages/admin/EmployeesAndShippingRecords.jsx`.

13. **Insert a New Car**
    *   **Functionality**: Allows an admin to insert a new car into the database.
    *   **Backend**: Implemented in `backend/app/queries.py` as the `create_car` function, exposed via a POST request to the `/queries/cars` endpoint.
    *   **Frontend**: Implemented in `frontend/src/pages/admin/InsertNewCar.jsx`.

14. **Register a New User**
    *   **Functionality**: Allows an admin to register a new user.
    *   **Backend**: Implemented in `backend/app/queries.py` as the `create_user` function, exposed via a POST request to the `/queries/users` endpoint.
    *   **Frontend**: Implemented in `frontend/src/pages/admin/RegisterNewUser.jsx`.

15. **Update Car Price and Availability**
    *   **Functionality**: Allows an admin to update the price and availability of a car.
    *   **Backend**: Implemented in `backend/app/queries.py` as the `update_car` function, exposed via a PUT request to the `/queries/cars/{car_id}` endpoint.
    *   **Frontend**: Implemented in `frontend/src/pages/admin/UpdateCarPriceAndAvailability.jsx`.

16. **Delete User by Email**
    *   **Functionality**: Allows an admin to delete a user by their email address.
    *   **Backend**: Implemented in `backend/app/queries.py` as the `delete_user` function, exposed via a DELETE request to the `/queries/users/{email}` endpoint.
    *   **Frontend**: Implemented in `frontend/src/pages/admin/DeleteUserByEmail.jsx`.
