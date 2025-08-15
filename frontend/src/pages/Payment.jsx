import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';

const Payment = () => {
  const { purchaseId } = useParams();
  const navigate = useNavigate();

  const [purchase, setPurchase] = useState(null);
  const [amountToPay, setAmountToPay] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [cardNumber, setCardNumber] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchPurchase = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/purchases/${purchaseId}`);
        setPurchase(res.data);
        setAmountToPay(res.data.amount || '');
      } catch (err) {
        console.error(err);
        setError('Failed to load purchase details.');
      } finally {
        setLoading(false);
      }
    };
    fetchPurchase();
  }, [purchaseId]);

  const validateInputs = () => {
    if (!amountToPay || isNaN(amountToPay) || Number(amountToPay) <= 0) {
      setError('Please enter a valid payment amount.');
      return false;
    }
    if (paymentMethod === 'Credit Card') {
      if (!/^\d{13,19}$/.test(cardNumber.replace(/\s+/g, ''))) {
        setError('Please enter a valid credit card number (13-19 digits).');
        return false;
      }
    } else if (paymentMethod === 'Bank Transfer') {
      if (!bankAccount.trim()) {
        setError('Please enter your bank account number.');
        return false;
      }
    }
    if (!password) {
      setError('Please enter your password.');
      return false;
    }
    return true;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!validateInputs()) return;

    try {
      // Mock payment: just update purchase record to mark paid with amount
      await axios.patch(`http://localhost:8000/purchases/${purchaseId}`, {
        amount_paid: Number(amountToPay),
      });
      setSuccessMessage('Payment successful! Redirecting...');
      setTimeout(() => navigate(`/purchase-after/${purchaseId}`), 2000);
    } catch (err) {
      console.error(err);
      setError('Payment failed. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="page">
        <Navbar />
        <div className="payment-container">
          <p>Loading purchase info...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="page">
      <Navbar />
      <div className="payment-container">
        <h1>Make Payment for Purchase #{purchaseId}</h1>
        <p>
          <strong>Amount Due: </strong> ${purchase?.amount?.toFixed(2) || '0.00'}
        </p>

        {error && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}

        <form onSubmit={onSubmit} className="payment-form">
          <label>
            Amount to Pay:
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={amountToPay}
              onChange={(e) => setAmountToPay(e.target.value)}
              required
            />
          </label>

          <label>
            Payment Method:
            <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
              <option value="Credit Card">Credit Card</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Cash">Cash</option>
            </select>
          </label>

          {paymentMethod === 'Credit Card' && (
            <label>
              Card Number:
              <input
                type="text"
                maxLength="19"
                placeholder="Enter your card number"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                required
              />
            </label>
          )}

          {paymentMethod === 'Bank Transfer' && (
            <label>
              Bank Account Number:
              <input
                type="text"
                placeholder="Enter your bank account number"
                value={bankAccount}
                onChange={(e) => setBankAccount(e.target.value)}
                required
              />
            </label>
          )}

          <label>
            Password:
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          <button type="submit" className="pay-button">Pay Now</button>
        </form>

        <button className="back-button" onClick={() => navigate(-1)}>Back</button>
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
        .payment-container {
          flex: 1;
          max-width: 600px;
          margin: 0 auto;
          padding: 2rem;
          background: rgba(15, 23, 42, 0.95);
          border-radius: 8px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.5);
        }
        h1 {
          font-size: 2rem;
          font-weight: 700;
          color: #ec4899;
          margin-bottom: 1.5rem;
          text-align: center;
        }
        p {
          font-size: 1.2rem;
          margin-bottom: 1.5rem;
          text-align: center;
          color: #22d3ee;
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
        input, select {
          margin-top: 0.5rem;
          padding: 0.5rem 0.75rem;
          background: #0f172a;
          border: 1px solid #334155;
          border-radius: 0.5rem;
          color: #e5e7eb;
          font-size: 1rem;
        }
        .pay-button {
          margin-top: 1rem;
          background: #22d3ee;
          color: #1e293b;
          border: none;
          padding: 0.75rem 1.25rem;
          font-size: 1.1rem;
          font-weight: 700;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: background 0.3s ease;
        }
        .pay-button:hover {
          background: #06b6d4;
        }
        .back-button {
          margin-top: 1rem;
          width: 100%;
          background: #ec4899;
          color: white;
          border: none;
          padding: 0.75rem;
          font-size: 1rem;
          font-weight: 600;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: background 0.3s ease;
        }
        .back-button:hover {
          background: #db2777;
        }
        .error-message {
          color: #f43f5e;
          font-weight: 700;
          margin-bottom: 1rem;
          text-align: center;
        }
        .success-message {
          color: #22c55e;
          font-weight: 700;
          margin-bottom: 1rem;
          text-align: center;
        }
      `}</style>
    </div>
  );
};

export default Payment;
