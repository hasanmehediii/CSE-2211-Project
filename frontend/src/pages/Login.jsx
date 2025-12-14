import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import carImage from '../assets/1.jpg';
import { AuthContext } from '../context/AuthContext.jsx';
import api from '../api.jsx';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
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
      const response = await api.post('/users/login', {
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
              Access your <span className="accent">account</span>
            </h1>
            <p className="auth-subtitle">
              Sign in to explore premium rides and budget-friendly options.
            </p>
            <form className="auth-form" onSubmit={handleLogin}>
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
              {error && <p className="error-message">{error}</p>}
              <button type="submit" className="auth-button primary" disabled={loading}>
                {loading ? 'Processing...' : 'Login'}
              </button>
            </form>
            <p className="toggle-text">
              Don't have an account?{' '}
              <Link to="/signup" className="toggle-link">
                Sign Up
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
        }

        .form-group {
          margin-bottom: 1.2rem;
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

export default Login;