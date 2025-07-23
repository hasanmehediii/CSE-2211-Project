import React, { useState, useContext } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import { CartContext } from '../context/CartContext.jsx';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';

const CarPurchase = () => {
  const { carId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { submitOrder } = useContext(CartContext);
  const carDetails = state?.carDetails || { name: 'Unknown Model', price: 'Price not listed', quantity: 0 };
  const [orderDetails, setOrderDetails] = useState({
    shippingAddress: user?.address || '',
    quantity: 1,
    paymentMethod: 'Credit Card',
  });
  const [error, setError] = useState('');

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    if (orderDetails.quantity > carDetails.quantity) {
      setError('Requested quantity exceeds available stock.');
      return;
    }
    try {
      const result = await submitOrder({
        ...orderDetails,
        carId: parseInt(carId),
        carDetails,
      });
      if (result.success) {
        navigate(`/purchase-after/${result.purchaseId}`);
      } else {
        setError(result.message || 'Failed to place order.');
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="page">
      <Navbar />
      <div className="purchase-container">
        <h1>Purchase {carDetails.name}</h1>
        <p>Price: {typeof carDetails.price === 'number' ? `$${carDetails.price.toFixed(2)}` : carDetails.price}</p>
        <p>Available Stock: {carDetails.quantity}</p>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleOrderSubmit}>
          <label>
            Shipping Address:
            <textarea
              value={orderDetails.shippingAddress}
              onChange={(e) => setOrderDetails({ ...orderDetails, shippingAddress: e.target.value })}
              required
            />
          </label>
          <label>
            Quantity:
            <input
              type="number"
              min="1"
              max={carDetails.quantity}
              value={orderDetails.quantity}
              onChange={(e) => setOrderDetails({ ...orderDetails, quantity: Number(e.target.value) })}
              required
            />
          </label>
          <label>
            Payment Method:
            <select
              value={orderDetails.paymentMethod}
              onChange={(e) => setOrderDetails({ ...orderDetails, paymentMethod: e.target.value })}
            >
              <option value="Credit Card">Credit Card</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Cash">Cash</option>
            </select>
          </label>
          <div className="form-buttons">
            <button type="submit" className="submit-button">
              Place Order
            </button>
            <button type="button" onClick={() => navigate('/')} className="back-button">
              Back to Home
            </button>
          </div>
        </form>
      </div>
      <Footer />
      <style jsx>{`
        .page {
          background: linear-gradient(135deg, #010715ff, #010a04ff);
          color: #ffffff;
          display: flex;
          flex-direction: column;
          font-family: 'Inter', sans-serif;
          margin: 0;
          padding-top: 60px;
          min-height: 100vh;
          overflow-x: hidden;
          box-sizing: border-box;
        }
        .purchase-container {
          flex: 1;
          padding: 2rem;
          max-width: 600px;
          margin: 0 auto;
          width: 100%;
        }
        h1 {
          font-size: 2.5rem;
          font-weight: 700;
          color: #ec4899;
          margin-bottom: 1rem;
        }
        p {
          font-size: 1.2rem;
          color: #d1d5db;
          margin-bottom: 1rem;
        }
        .error-message {
          text-align: center;
          font-size: 1.2rem;
          color: #f43f5e;
          margin-bottom: 1rem;
        }
        form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        label {
          display: flex;
          flex-direction: column;
          font-size: 1rem;
          color: #d1d5db;
        }
        textarea,
        input,
        select {
          margin-top: 0.5rem;
          padding: 0.5rem;
          background: #0f172a;
          color: #e5e7eb;
          border: 1px solid #334155;
          border-radius: 0.5rem;
          font-size: 1rem;
        }
        textarea {
          resize: vertical;
          min-height: 80px;
          max-height: 150px;
        }
        .form-buttons {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
          flex-wrap: wrap;
        }
        .submit-button,
        .back-button {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
          font-size: 1rem;
          transition: background 0.3s;
        }
        .submit-button {
          background: #22d3ee;
          color: #1e293b;
        }
        .submit-button:hover {
          background: #06b6d4;
        }
        .back-button {
          background: #ec4899;
          color: #ffffff;
        }
        .back-button:hover {
          background: #db2777;
        }
        @media (max-width: 768px) {
          .purchase-container {
            padding: 1.5rem;
            width: 95%;
          }
          h1 {
            font-size: 1.8rem;
          }
          p,
          label,
          textarea,
          input,
          select {
            font-size: 0.9rem;
          }
          .form-buttons {
            flex-direction: column;
            gap: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default CarPurchase;