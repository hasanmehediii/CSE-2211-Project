import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import carImage from '../assets/car2.jpg';
import api from '../api.jsx';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
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

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.username || !formData.password) {
      setError('Email, username, and password are required.');
      return;
    }
    setLoading(true);
    try {
      const response = await api.post('/users', {
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <div className="page">
        <Navbar />
        <section className="auth-section">
          <div className="auth-bg" />
          <div className="auth-overlay" />
          <div className="auth-content">
            <h1 className="auth-title">
              Create your <span className="accent">account</span>
            </h1>
            <p className="auth-subtitle">
              Join us to discover cars that match your style and wallet.
            </p>
            <form className="auth-form" onSubmit={handleSignup}>
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
              <div className="form-group password-group">
                <label htmlFor="password">Password</label>
                <div className="password-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={togglePasswordVisibility}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
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
              {error && <p className="error-message">{error}</p>}
              <button type="submit" className="auth-button primary" disabled={loading}>
                {loading ? 'Processing...' : 'Sign Up'}
              </button>
            </form>
            <p className="toggle-text">
              Already have an account?{' '}
              <Link to="/login" className="toggle-link">
                Login
              </Link>
            </p>
          </div>
        </section>
        <Footer />
      </div>
      <style jsx>{`
        :root {
          --bg: #020617;
          --card-bg: rgba(15, 23, 42, 0.96);
          --card-border: rgba(148, 163, 184, 0.35);
          --accent: #22d3ee;
          --accent-strong: #e11d48;
          --text-main: #e5e7eb;
          --text-muted: #9ca3af;
        }

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          background: var(--bg);
          color: var(--text-main);
          font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .page {
          min-height: 100vh;
          background:
            radial-gradient(circle at top left, rgba(56, 189, 248, 0.15), transparent 55%),
            radial-gradient(circle at bottom right, rgba(244, 63, 94, 0.22), transparent 60%),
            var(--bg);
          color: #ffffff;
          display: flex;
          flex-direction: column;
          font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
          overflow-x: hidden;
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .auth-section {
          position: relative;
          min-height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          padding: 0 clamp(1.2rem, 7vw, 4.5rem) 2.5rem;
          overflow: hidden;
        }

        .auth-bg {
          position: absolute;
          inset: 0;
          background-image: url(${carImage});
          background-size: cover;
          background-position: center;
          transform: scale(1.06);
          filter: brightness(0.9);
        }

        .auth-overlay {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(to right, rgba(15, 23, 42, 0.96), rgba(15, 23, 42, 0.4)),
            radial-gradient(circle at 80% 15%, rgba(56, 189, 248, 0.4), transparent 60%);
          mix-blend-mode: multiply;
        }

        .auth-content {
          position: relative;
          z-index: 1;
          max-width: 640px;
          padding-top: 4.2rem;
          display: flex;
          flex-direction: column;
          gap: 1.3rem;
          animation: fadeUp 0.7s ease-out;
        }

        .auth-title {
          font-size: clamp(2.5rem, 4.8vw, 3.4rem);
          line-height: 1.08;
          font-weight: 800;
          letter-spacing: 0.02em;
          color: #f9fafb;
        }

        .auth-title .accent {
          background: linear-gradient(120deg, var(--accent), var(--accent-strong));
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .auth-subtitle {
          font-size: 0.96rem;
          color: var(--text-muted);
          max-width: 520px;
        }

        .auth-form {
          background: var(--card-bg);
          padding: 1.5rem;
          border-radius: 1.2rem;
          border: 1px solid var(--card-border);
          box-shadow: 0 18px 48px rgba(15, 23, 42, 0.98);
          max-width: 450px;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.2rem;
        }

        .auth-form .form-group:nth-child(3) {
          grid-column: span 2;
        }

        .auth-form .form-group:nth-child(8) {
          grid-column: span 2;
        }

        .auth-form button {
          grid-column: span 2;
        }

        .auth-form .error-message {
          grid-column: span 2;
        }

        .form-group {
          margin-bottom: 0;
        }

        .form-group label {
          display: block;
          font-size: 1rem;
          font-weight: 500;
          color: #f9fafb;
          margin-bottom: 0.4rem;
        }

        .form-group input {
          width: 100%;
          padding: 0.6rem 1rem;
          font-size: 0.9rem;
          border: none;
          border-radius: 0.5rem;
          background: rgba(15, 23, 42, 0.85);
          color: #f9fafb;
          outline: none;
          border: 1px solid rgba(148, 163, 184, 0.7);
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .form-group input:focus {
          border-color: var(--accent);
          box-shadow: 0 0 0 2px rgba(34, 211, 238, 0.3);
        }

        .password-group {
          position: relative;
        }

        .password-wrapper {
          position: relative;
        }

        .password-toggle {
          position: absolute;
          top: 50%;
          right: 1rem;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 0;
          display: flex;
          align-items: center;
          transition: color 0.2s ease;
        }

        .password-toggle:hover {
          color: var(--text-main);
        }

        .error-message {
          color: #fecaca;
          font-size: 0.9rem;
          margin-bottom: 0.75rem;
          text-align: center;
          background: rgba(127, 29, 29, 0.65);
          border: 1px solid rgba(248, 113, 113, 0.85);
          padding: 0.5rem;
          border-radius: 0.5rem;
        }

        .auth-button {
          width: 100%;
          padding: 0.75rem 1.6rem;
          border-radius: 999px;
          border: none;
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease, border 0.2s ease;
          white-space: nowrap;
        }

        .auth-button.primary {
          background: linear-gradient(to right, var(--accent-strong), #f97316);
          color: #f9fafb;
          box-shadow: 0 20px 45px rgba(248, 113, 113, 0.65);
        }

        .auth-button.primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 26px 60px rgba(248, 113, 113, 0.75);
        }

        .auth-button:disabled {
          background: rgba(148, 163, 184, 0.7);
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .toggle-text {
          margin-top: 0.75rem;
          font-size: 0.9rem;
          color: var(--text-muted);
          text-align: center;
        }

        .toggle-link {
          color: var(--accent);
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .toggle-link:hover {
          color: var(--accent-strong);
        }

        @media (max-width: 900px) {
          .auth-section {
            align-items: flex-end;
            padding: 0 1.4rem 2rem;
          }

          .auth-content {
            padding-top: 3.6rem;
          }
        }

        @media (max-width: 768px) {
          .auth-section {
            padding: 0 1.1rem 1.8rem;
          }

          .auth-title {
            max-width: 100%;
          }

          .auth-subtitle {
            font-size: 0.9rem;
          }

          .auth-form {
            padding: 1.2rem;
            max-width: 400px;
          }

          .form-group input {
            padding: 0.5rem 1rem;
            font-size: 0.85rem;
          }

          .auth-button {
            padding: 0.6rem 1.3rem;
            font-size: 0.85rem;
          }

          .error-message {
            font-size: 0.85rem;
          }

          .toggle-text {
            font-size: 0.85rem;
          }
        }

        @media (max-width: 480px) {
          .auth-content {
            padding-top: 3.1rem;
          }

          .auth-title {
            font-size: 1.9rem;
          }

          .auth-subtitle {
            font-size: 0.84rem;
          }

          .auth-form {
            padding: 1rem;
            max-width: 350px;
            grid-template-columns: 1fr;
          }

          .auth-form .form-group:nth-child(3),
          .auth-form .form-group:nth-child(8),
          .auth-form button,
          .auth-form .error-message {
            grid-column: span 1;
          }

          .form-group input {
            padding: 0.4rem 1rem;
            font-size: 0.8rem;
          }

          .auth-button {
            padding: 0.5rem 1.3rem;
            font-size: 0.8rem;
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

export default Signup;