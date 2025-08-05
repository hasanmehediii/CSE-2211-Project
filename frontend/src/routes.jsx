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
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
};

export default AppRoutes;
