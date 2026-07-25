import React, { useContext, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  FaArrowLeft,
  FaArrowRight,
  FaCarSide,
  FaCreditCard,
  FaMapMarkerAlt,
  FaShieldAlt,
} from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext.jsx';
import { CartContext } from '../context/CartContext.jsx';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import CheckoutSteps from '../components/CheckoutSteps.jsx';
import carFallback from '../assets/car2.jpg';
import './Checkout.css';

const money = (value) => {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return 'Price on request';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
};

const CarPurchase = () => {
  const { carId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { submitOrder } = useContext(CartContext);
  const carDetails = state?.carDetails || {
    name: 'Unknown model',
    price: null,
    quantity: 0,
    image: carFallback,
  };
  const [orderDetails, setOrderDetails] = useState({
    shippingAddress: user?.address || '',
    quantity: 1,
    paymentMethod: 'Credit Card',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleOrderSubmit = async (event) => {
    event.preventDefault();
    setError('');
    if (!user) {
      navigate('/login');
      return;
    }
    if (orderDetails.quantity > Number(carDetails.quantity)) {
      setError('The selected quantity is greater than the available stock.');
      return;
    }

    setSubmitting(true);
    try {
      const result = await submitOrder({
        ...orderDetails,
        carId: Number(carId),
        carDetails,
      });
      if (result.success) {
        navigate(`/purchase-after/${result.purchaseId}`);
      } else {
        setError(result.message || 'We could not place your order.');
      }
    } catch (submitError) {
      console.error('Error submitting order:', submitError);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const total = Number(carDetails.price) * orderDetails.quantity;

  return (
    <div className="checkout-page">
      <Navbar />
      <main className="checkout-main">
        <div className="checkout-container">
          <button className="checkout-back-link" onClick={() => navigate(-1)}>
            <FaArrowLeft /> Back to car
          </button>
          <CheckoutSteps active={1} />

          <header className="checkout-heading">
            <span>Secure checkout</span>
            <h1>Complete your order.</h1>
            <p>Confirm the delivery details below. You can review everything before payment.</p>
          </header>

          <div className="checkout-layout">
            <form className="checkout-form-card" onSubmit={handleOrderSubmit}>
              <div className="checkout-card-heading">
                <span><FaMapMarkerAlt /></span>
                <div>
                  <small>Delivery</small>
                  <h2>Where should we send it?</h2>
                </div>
              </div>

              {error && <div className="checkout-alert is-error" role="alert">{error}</div>}

              <label className="checkout-field">
                <span>Shipping address</span>
                <textarea
                  value={orderDetails.shippingAddress}
                  onChange={(event) => setOrderDetails({
                    ...orderDetails,
                    shippingAddress: event.target.value,
                  })}
                  placeholder="House, road, city and postal code"
                  required
                />
                <small>Use an address where someone can receive the vehicle documents.</small>
              </label>

              <div className="checkout-field-row">
                <label className="checkout-field">
                  <span>Quantity</span>
                  <input
                    type="number"
                    min="1"
                    max={carDetails.quantity}
                    value={orderDetails.quantity}
                    onChange={(event) => setOrderDetails({
                      ...orderDetails,
                      quantity: Number(event.target.value),
                    })}
                    required
                  />
                </label>
                <label className="checkout-field">
                  <span>Payment preference</span>
                  <select
                    value={orderDetails.paymentMethod}
                    onChange={(event) => setOrderDetails({
                      ...orderDetails,
                      paymentMethod: event.target.value,
                    })}
                  >
                    <option value="Credit Card">Credit card</option>
                    <option value="Bank Transfer">Bank transfer</option>
                    <option value="Cash">Cash</option>
                  </select>
                </label>
              </div>

              <div className="checkout-secure-note">
                <FaShieldAlt />
                <span>
                  <strong>Your information is protected</strong>
                  Payment details are collected on the final step.
                </span>
              </div>

              <button className="checkout-primary-button" type="submit" disabled={submitting}>
                {submitting ? 'Placing order…' : 'Review and place order'}
                {!submitting && <FaArrowRight />}
              </button>
            </form>

            <aside className="checkout-summary">
              <div className="checkout-summary__image">
                <img
                  src={carDetails.image || carFallback}
                  alt={carDetails.name}
                  onError={(event) => { event.currentTarget.src = carFallback; }}
                />
                <span><FaCarSide /> Your selection</span>
              </div>
              <div className="checkout-summary__content">
                <span>Order summary</span>
                <h2>{carDetails.name}</h2>
                <div className="checkout-summary__line">
                  <span>Vehicle price</span>
                  <strong>{money(carDetails.price)}</strong>
                </div>
                <div className="checkout-summary__line">
                  <span>Quantity</span>
                  <strong>{orderDetails.quantity}</strong>
                </div>
                <div className="checkout-summary__line">
                  <span>Available stock</span>
                  <strong>{carDetails.quantity}</strong>
                </div>
                <div className="checkout-summary__total">
                  <span>Estimated total<small>Before applicable fees</small></span>
                  <strong>{money(total)}</strong>
                </div>
                <div className="checkout-summary__payment">
                  <FaCreditCard />
                  <span>{orderDetails.paymentMethod}<small>Payment on the final step</small></span>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CarPurchase;
