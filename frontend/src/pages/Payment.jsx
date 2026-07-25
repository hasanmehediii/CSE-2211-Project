import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  FaArrowLeft,
  FaArrowRight,
  FaBuilding,
  FaCheckCircle,
  FaCreditCard,
  FaLock,
  FaMoneyBillWave,
  FaReceipt,
  FaShieldAlt,
} from 'react-icons/fa';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import CheckoutSteps from '../components/CheckoutSteps.jsx';
import api from '../api.jsx';
import './Checkout.css';

const money = (value) => {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
};

const methods = [
  { value: 'Credit Card', label: 'Card', icon: FaCreditCard },
  { value: 'Bank Transfer', label: 'Bank', icon: FaBuilding },
  { value: 'Cash', label: 'Cash', icon: FaMoneyBillWave },
];

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
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchPurchase = async () => {
      try {
        const response = await api.get(`/purchases/${purchaseId}`);
        setPurchase(response.data);
        setAmountToPay(response.data.amount || '');
        if (response.data.payment_method) setPaymentMethod(response.data.payment_method);
      } catch (fetchError) {
        console.error(fetchError);
        setError('We could not load the purchase details.');
      } finally {
        setLoading(false);
      }
    };
    fetchPurchase();
  }, [purchaseId]);

  const validateInputs = () => {
    if (!amountToPay || Number.isNaN(Number(amountToPay)) || Number(amountToPay) <= 0) {
      setError('Enter a valid payment amount.');
      return false;
    }
    if (paymentMethod === 'Credit Card' && !/^\d{13,19}$/.test(cardNumber.replace(/\s+/g, ''))) {
      setError('Enter a valid card number containing 13–19 digits.');
      return false;
    }
    if (paymentMethod === 'Bank Transfer' && !bankAccount.trim()) {
      setError('Enter your bank account number.');
      return false;
    }
    if (!password) {
      setError('Enter your password to authorise the payment.');
      return false;
    }
    return true;
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccessMessage('');
    if (!validateInputs()) return;

    setSubmitting(true);
    try {
      await api.patch(`/purchases/${purchaseId}`, {
        amount_paid: Number(amountToPay),
      });
      setSuccessMessage('Payment authorised. Returning to your order…');
      setTimeout(() => navigate(`/purchase-after/${purchaseId}`), 1800);
    } catch (submitError) {
      console.error(submitError);
      setError('The payment could not be completed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCardNumber = (event) => {
    const digits = event.target.value.replace(/\D/g, '').slice(0, 19);
    setCardNumber(digits.replace(/(.{4})/g, '$1 ').trim());
  };

  return (
    <div className="checkout-page">
      <Navbar />
      <main className="checkout-main">
        <div className="checkout-container">
          {loading ? (
            <div className="checkout-loading">
              <span />
              <span />
              <span />
            </div>
          ) : !purchase ? (
            <section className="checkout-error-state">
              <span>Payment unavailable</span>
              <h1>{error || 'This purchase could not be found.'}</h1>
              <button onClick={() => navigate('/')}><FaArrowLeft /> Return to showroom</button>
            </section>
          ) : (
            <>
              <button className="checkout-back-link" onClick={() => navigate(-1)}>
                <FaArrowLeft /> Back to order
              </button>
              <CheckoutSteps active={3} />

              <header className="checkout-heading payment-heading">
                <span>Final step</span>
                <h1>Secure your purchase.</h1>
                <p>Choose a payment method and authorise the amount below.</p>
              </header>

              <div className="payment-layout">
                <form className="payment-form-card" onSubmit={onSubmit}>
                  <div className="checkout-card-heading">
                    <span><FaLock /></span>
                    <div>
                      <small>Protected payment</small>
                      <h2>Payment information</h2>
                    </div>
                  </div>

                  {error && <div className="checkout-alert is-error" role="alert">{error}</div>}
                  {successMessage && (
                    <div className="checkout-alert is-success" role="status">
                      <FaCheckCircle /> {successMessage}
                    </div>
                  )}

                  <fieldset className="payment-methods">
                    <legend>Payment method</legend>
                    <div>
                      {methods.map(({ value, label, icon }) => (
                        <button
                          type="button"
                          key={value}
                          className={paymentMethod === value ? 'is-selected' : ''}
                          onClick={() => setPaymentMethod(value)}
                        >
                          {React.createElement(icon)}
                          <span>{label}</span>
                          <i />
                        </button>
                      ))}
                    </div>
                  </fieldset>

                  <label className="checkout-field">
                    <span>Amount to pay</span>
                    <div className="payment-input-with-prefix">
                      <span>$</span>
                      <input
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={amountToPay}
                        onChange={(event) => setAmountToPay(event.target.value)}
                        required
                      />
                    </div>
                  </label>

                  {paymentMethod === 'Credit Card' && (
                    <label className="checkout-field">
                      <span>Card number</span>
                      <div className="payment-input-with-icon">
                        <FaCreditCard />
                        <input
                          type="text"
                          inputMode="numeric"
                          maxLength="23"
                          placeholder="0000 0000 0000 0000"
                          value={cardNumber}
                          onChange={handleCardNumber}
                          required
                        />
                      </div>
                      <small>Enter the number shown on the front of your card.</small>
                    </label>
                  )}

                  {paymentMethod === 'Bank Transfer' && (
                    <label className="checkout-field">
                      <span>Bank account number</span>
                      <div className="payment-input-with-icon">
                        <FaBuilding />
                        <input
                          type="text"
                          placeholder="Enter your account number"
                          value={bankAccount}
                          onChange={(event) => setBankAccount(event.target.value)}
                          required
                        />
                      </div>
                    </label>
                  )}

                  {paymentMethod === 'Cash' && (
                    <div className="payment-cash-note">
                      <FaMoneyBillWave />
                      <span><strong>Cash payment selected</strong>You will receive further collection instructions after authorisation.</span>
                    </div>
                  )}

                  <label className="checkout-field">
                    <span>Account password</span>
                    <div className="payment-input-with-icon">
                      <FaLock />
                      <input
                        type="password"
                        placeholder="Confirm your identity"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        required
                      />
                    </div>
                    <small>Required to confirm that this payment was authorised by you.</small>
                  </label>

                  <button className="checkout-primary-button" type="submit" disabled={submitting || !!successMessage}>
                    {submitting ? 'Authorising…' : successMessage ? 'Payment complete' : `Pay ${money(amountToPay)}`}
                    {!submitting && !successMessage && <FaArrowRight />}
                  </button>

                  <div className="payment-security">
                    <FaShieldAlt />
                    <span>Protected checkout<small>Your payment information is handled securely.</small></span>
                  </div>
                </form>

                <aside className="payment-summary-card">
                  <div className="payment-summary-card__icon"><FaReceipt /></div>
                  <span>Purchase summary</span>
                  <h2>Order #{purchaseId}</h2>
                  <div className="payment-summary-row">
                    <span>Invoice</span>
                    <strong>{purchase.invoice_number || 'Pending'}</strong>
                  </div>
                  <div className="payment-summary-row">
                    <span>Order status</span>
                    <strong className="payment-status">{purchase.status || 'Pending'}</strong>
                  </div>
                  <div className="payment-summary-row">
                    <span>Method</span>
                    <strong>{paymentMethod}</strong>
                  </div>
                  <div className="payment-summary-total">
                    <span>Amount due<small>Current purchase balance</small></span>
                    <strong>{money(purchase.amount)}</strong>
                  </div>
                  <div className="payment-summary-card__note">
                    <FaLock />
                    <p><strong>Secure transaction</strong>Your account confirmation is required before payment.</p>
                  </div>
                </aside>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Payment;
