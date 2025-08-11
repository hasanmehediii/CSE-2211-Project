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
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
};

export default AppRoutes;
