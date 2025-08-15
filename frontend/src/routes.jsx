// src/routes.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/SignUp';
import Welcome from './pages/Welcome';
import FAQ from './pages/FAQ';
import CarDetail from './pages/CarDetail';
import CarForMe from './pages/CarForMe';
import CarPurchase from './pages/CarPurchase';
import PurchaseAfter from './pages/PurchaseAfter';
import Payment from './pages/Payment';
import UserProfile from './pages/UserProfile';
import AdminHome from './pages/AdminHome';
import ManageUsers from './pages/admin/ManageUsers';
import ManageCars from './pages/admin/ManageCars';
import ManageOrders from './pages/admin/ManageOrders';
import PurchaseHistory from './pages/admin/PurchaseHistory';
import AvailableCarsWithCategory from './pages/admin/AvailableCarsWithCategory';
import UsersAndPurchases from './pages/admin/UsersAndPurchases';
import OrderDetailsWithCarInfo from './pages/admin/OrderDetailsWithCarInfo';
import UsersWithCompletedPurchases from './pages/admin/UsersWithCompletedPurchases';
import CarsMoreExpensiveThanCategory from './pages/admin/CarsMoreExpensiveThanCategory';
import EmployeesAndOrdersHandled from './pages/admin/EmployeesAndOrdersHandled';
import Top5MostReviewedCars from './pages/admin/Top5MostReviewedCars';
import AvailableCarsAndInventory from './pages/admin/AvailableCarsAndInventory';
import EmployeesAndShippingRecords from './pages/admin/EmployeesAndShippingRecords';
import VisibleReviews from './pages/admin/VisibleReviews';
import ElectricOrHybridCars from './pages/admin/ElectricOrHybridCars';
import InsertNewCar from './pages/admin/InsertNewCar';
import RegisterNewUser from './pages/admin/RegisterNewUser';
import UpdateCarPriceAndAvailability from './pages/admin/UpdateCarPriceAndAvailability';
import CarsCheaperThanCategory from './pages/admin/CarsCheaperThanCategory';
import DeleteUserByEmail from './pages/admin/DeleteUserByEmail';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/category/:categoryId" element={<CarForMe />} />
        {/* Modify this to accept carId in the URL */}
        <Route path="/car-detail/:carId" element={<CarDetail />} />
        <Route path="/car-purchase/:carId" element={<CarPurchase />} />
        <Route path="/purchase-after/:purchaseId" element={<PurchaseAfter />} />
        <Route path="/payment/:purchaseId" element={<Payment />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/admin/home" element={<AdminHome />} />
        <Route path="/admin/manage-users" element={<ManageUsers />} />
        <Route path="/admin/manage-cars" element={<ManageCars />} />
        <Route path="/admin/manage-orders" element={<ManageOrders />} />
        <Route path="/admin/purchase-history" element={<PurchaseHistory />} />
        <Route path="/admin/available-cars-with-category" element={<AvailableCarsWithCategory />} />
        <Route path="/admin/users-and-purchases" element={<UsersAndPurchases />} />
        <Route path="/admin/order-details-with-car-info" element={<OrderDetailsWithCarInfo />} />
        <Route path="/admin/users-with-completed-purchases" element={<UsersWithCompletedPurchases />} />
        <Route path="/admin/cars-more-expensive-than-category" element={<CarsMoreExpensiveThanCategory />} />
        <Route path="/admin/employees-and-orders-handled" element={<EmployeesAndOrdersHandled />} />
        <Route path="/admin/top-5-most-reviewed-cars" element={<Top5MostReviewedCars />} />
        <Route path="/admin/available-cars-and-inventory" element={<AvailableCarsAndInventory />} />
        <Route path="/admin/employees-and-shipping-records" element={<EmployeesAndShippingRecords />} />
        <Route path="/admin/visible-reviews" element={<VisibleReviews />} />
        <Route path="/admin/electric-or-hybrid-cars" element={<ElectricOrHybridCars />} />
        <Route path="/admin/insert-new-car" element={<InsertNewCar />} />
        <Route path="/admin/register-new-user" element={<RegisterNewUser />} />
        <Route path="/admin/update-car-price-and-availability" element={<UpdateCarPriceAndAvailability />} />
        <Route path="/admin/cars-cheaper-than-category" element={<CarsCheaperThanCategory />} />
        <Route path="/admin/delete-user-by-email" element={<DeleteUserByEmail />} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
};

export default AppRoutes;
