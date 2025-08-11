import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import carImage from '../assets/car2.jpg';
import { AuthContext } from '../context/AuthContext.jsx';

const LoginSignup = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    address: '',
    phone: '',
    dob: '',
    card_num: '',
    bank_acc: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (formData.email === 'admin@gorib.com' && formData.password === 'admin') {
        navigate('/admin/home');
        return;
      }
      const response = await axios.post('http://localhost:8000/users/login', {
        email: formData.email,
        password: formData.password,
      });
      if (response.status === 200) {
        login({ user_id: response.data.user_id, username: response.data.username });
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.username || !formData.password) {
      setError('Email, username, and password are required.');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/users', {
        email: formData.email,
        username: formData.username,
        password: formData.password,
        address: formData.address || null,
        phone: formData.phone || null,
        dob: formData.dob || null,
        card_num: formData.card_num || null,
        bank_acc: formData.bank_acc || null,
      });
      if (response.status === 200) {
        navigate('/login');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setFormData({
      email: '',
      username: '',
      password: '',
      address: '',
      phone: '',
      dob: '',
      card_num: '',
      bank_acc: '',
    });
    setError('');
  };

  return (
    <>
      <div className="page">
        <Navbar />
        <section className="auth-section">
          <h1 className="auth-title">{isLogin ? 'Login' : 'Sign Up'}</h1>
          <p className="auth-subtitle">
            {isLogin ? 'Access your account' : 'Create a new account'}
          </p>
          <form className="auth-form" onSubmit={isLogin ? handleLogin : handleSignup}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="Enter your email"
              />
            </div>
            {!isLogin && (
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your username"
                />
              </div>
            )}
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                placeholder="Enter your password"
              />
            </div>
            {!isLogin && (
              <>
                <div className="form-group">
                  <label htmlFor="address">Address (Optional)</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter your address"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone (Optional)</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="dob">Date of Birth (Optional)</label>
                  <input
                    type="date"
                    id="dob"
                    name="dob"
                    value={formData.dob}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="card_num">Card Number (Optional)</label>
                  <input
                    type="text"
                    id="card_num"
                    name="card_num"
                    value={formData.card_num}
                    onChange={handleInputChange}
                    placeholder="Enter your card number"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="bank_acc">Bank Account (Optional)</label>
                  <input
                    type="text"
                    id="bank_acc"
                    name="bank_acc"
                    value={formData.bank_acc}
                    onChange={handleInputChange}
                    placeholder="Enter your bank account"
                  />
                </div>
              </>
            )}
            {error && <p className="error-message">{error}</p>}
            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? 'Processing...' : isLogin ? 'Login' : 'Sign Up'}
            </button>
          </form>
          <p className="toggle-text">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <span className="toggle-link" onClick={toggleForm}>
              {isLogin ? 'Sign Up' : 'Login'}
            </span>
          </p>
        </section>
        <Footer />
      </div>
      <style jsx>{`
        * {
          box-sizing: border-box; /* Ensure padding/margins don't cause overflow */
        }
        .page {
          background: linear-gradient(135deg, #010715ff, #010a04ff);
          color: #ffffff;
          display: flex;
          flex-direction: column;
          font-family: 'Inter', sans-serif;
          margin: 0; /* Remove default margin */
        }
        .auth-section {
          background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.8)), url(${carImage});
          background-size: cover;
          background-position: center;
          min-height: calc(100vh - 60px); /* Adjust for navbar height */
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 1.5rem; /* Match Home.jsx and Navbar.jsx */
          width: 100%;
        }
        .auth-title {
          font-size: 2.5rem; /* Reduced to match Home.jsx */
          font-weight: 800;
          text-transform: uppercase;
          margin-bottom: 0.75rem; /* Reduced */
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }
        .auth-subtitle {
          font-size: 1.25rem; /* Reduced */
          color: #d1d5db;
          margin-bottom: 1.5rem;
        }
        .auth-form {
          background: rgba(15, 23, 42, 0.95);
          padding: 1.5rem; /* Reduced to match Home.jsx */
          border-radius: 1rem;
          box-shadow: 0 8px 16px rgba(3, 132, 98, 0.48);
          width: 100%;
          max-width: 450px; /* Slightly reduced */
        }
        .form-group {
          margin-bottom: 1.2rem; /* Reduced */
        }
        .form-group label {
          display: block;
          font-size: 1rem; /* Reduced */
          font-weight: 500;
          color: #ffffff;
          margin-bottom: 0.4rem;
        }
        .form-group input {
          width: 100%;
          padding: 0.6rem; /* Reduced */
          font-size: 0.9rem; /* Reduced */
          border: none;
          border-radius: 0.5rem;
          background: #1e293b;
          color: #ffffff;
          outline: none;
          transition: box-shadow 0.3s ease;
        }
        .form-group input:focus {
          box-shadow: 0 0 0 2px #ec4899;
        }
        .error-message {
          color: #f43f5e;
          font-size: 0.9rem; /* Reduced */
          margin-bottom: 0.75rem;
          text-align: center;
        }
        .auth-button {
          width: 100%;
          padding: 0.6rem; /* Reduced */
          font-size: 1.1rem; /* Reduced */
          background: linear-gradient(to right, #ec4899, #f43f5e);
          color: #ffffff;
          border: none;
          border-radius: 2rem;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .auth-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
        }
        .auth-button:disabled {
          background: #6b7280;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }
        .toggle-text {
          margin-top: 0.75rem; /* Reduced */
          font-size: 0.9rem; /* Reduced */
          color: #d1d5db;
          text-align: center;
        }
        .toggle-link {
          color: #ec4899;
          cursor: pointer;
          text-decoration: underline;
        }
        .toggle-link:hover {
          color: #f43f5e;
        }
        @media (max-width: 768px) {
          .auth-section {
            min-height: calc(100vh - 50px); /* Match Home.jsx */
            padding: 1rem;
          }
          .auth-title {
            font-size: 2rem;
          }
          .auth-subtitle {
            font-size: 1.1rem;
          }
          .auth-form {
            padding: 1.2rem;
            max-width: 400px;
          }
          .form-group input {
            padding: 0.5rem;
            font-size: 0.85rem;
          }
          .auth-button {
            padding: 0.5rem;
            font-size: 1rem;
          }
          .error-message {
            font-size: 0.85rem;
          }
          .toggle-text {
            font-size: 0.85rem;
          }
        }
        @media (max-width: 480px) {
          .auth-section {
            min-height: calc(100vh - 48px); /* Match Home.jsx */
            padding: 0.75rem;
          }
          .auth-title {
            font-size: 1.8rem;
          }
          .auth-subtitle {
            font-size: 0.9rem;
          }
          .auth-form {
            padding: 1rem;
            max-width: 350px;
          }
          .form-group input {
            padding: 0.4rem;
            font-size: 0.8rem;
          }
          .auth-button {
            padding: 0.4rem;
            font-size: 0.9rem;
          }
          .error-message {
            font-size: 0.8rem;
          }
          .toggle-text {
            font-size: 0.8rem;
          }
        }
      `}</style>
    </>
  );
};

export default LoginSignup;