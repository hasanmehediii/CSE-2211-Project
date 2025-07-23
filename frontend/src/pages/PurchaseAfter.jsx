import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';

const PurchaseAfter = () => {
  const { purchaseId } = useParams();
  const navigate = useNavigate();
  const [purchaseDetails, setPurchaseDetails] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const purchaseResponse = await axios.get(`http://localhost:8000/purchases/${purchaseId}`);
        setPurchaseDetails(purchaseResponse.data);

        const orderResponse = await axios.get(`http://localhost:8000/orders/?purchase_id=${purchaseId}`);
        if (orderResponse.data.length > 0) {
          setOrderDetails(orderResponse.data[0]);
        } else {
          setError('No order found for this purchase.');
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Failed to fetch purchase details.');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [purchaseId]);

  if (loading) {
    return (
      <div className="page">
        <Navbar />
        <div className="purchase-after-container">
          <p>Loading purchase details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <Navbar />
        <div className="purchase-after-container">
          <div className="error-message">{error}</div>
          <button onClick={() => navigate('/')} className="back-button">
            Back to Home
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="page">
      <Navbar />
      <div className="purchase-after-container">
        <h1>Purchase Details</h1>
        <div className="purchase-info">
          <p><strong>Purchase ID:</strong> {purchaseDetails.purchase_id}</p>
          <p><strong>User ID:</strong> {purchaseDetails.user_id}</p>
          <p><strong>Amount:</strong> ${purchaseDetails.amount.toFixed(2)}</p>
          <p><strong>Payment Method:</strong> {purchaseDetails.payment_method}</p>
          <p><strong>Status:</strong> {purchaseDetails.status}</p>
          <p><strong>Invoice Number:</strong> {purchaseDetails.invoice_number}</p>
        </div>
        {orderDetails && (
          <div className="order-info">
            <h2>Order Details</h2>
            <p><strong>Order ID:</strong> {orderDetails.order_id}</p>
            <p><strong>Status:</strong> {orderDetails.status}</p>
            <p><strong>Shipping Address:</strong> {orderDetails.shipping_address}</p>
            <p><strong>Tracking Number:</strong> {orderDetails.tracking_number || 'N/A'}</p>
            <p><strong>Expected Delivery:</strong> {orderDetails.expected_delivery || 'N/A'}</p>
          </div>
        )}
        <div className="action-buttons">
          <button onClick={() => navigate(`/payment/${purchaseId}`)} className="proceed-button">
            Proceed to Payment
          </button>
          <button onClick={() => navigate('/')} className="back-button">
            Back to Home
          </button>
        </div>
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
        .purchase-after-container {
          flex: 1;
          padding: 2rem;
          max-width: 800px;
          margin: 0 auto;
          width: 100%;
        }
        h1 {
          font-size: 2.5rem;
          font-weight: 700;
          color: #ec4899;
          margin-bottom: 1rem;
          text-align: center;
        }
        h2 {
          font-size: 1.8rem;
          font-weight: 600;
          color: #22d3ee;
          margin-top: 2rem;
          margin-bottom: 1rem;
        }
        .purchase-info,
        .order-info {
          background: rgba(15, 23, 42, 0.95);
          padding: 1.5rem;
          border-radius: 0.5rem;
          margin-bottom: 2rem;
        }
        .purchase-info p,
        .order-info p {
          font-size: 1.2rem;
          margin-bottom: 0.5rem;
        }
        .error-message {
          text-align: center;
          font-size: 1.2rem;
          color: #f43f5e;
          margin-bottom: 1rem;
        }
        .action-buttons {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-top: 2rem;
        }
        .proceed-button,
        .back-button {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
          font-size: 1rem;
          font-weight: 600;
          transition: background 0.3s, transform 0.2s;
        }
        .proceed-button {
          background: #22d3ee;
          color: #1e293b;
        }
        .proceed-button:hover {
          background: #06b6d4;
          transform: translateY(-2px);
        }
        .back-button {
          background: #ec4899;
          color: #ffffff;
        }
        .back-button:hover {
          background: #db2777;
          transform: translateY(-2px);
        }
        @media (max-width: 768px) {
          .purchase-after-container {
            padding: 1.5rem;
            width: 95%;
          }
          h1 {
            font-size: 1.8rem;
          }
          h2 {
            font-size: 1.5rem;
          }
          .purchase-info p,
          .order-info p {
            font-size: 1rem;
          }
          .action-buttons {
            flex-direction: column;
            gap: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default PurchaseAfter;