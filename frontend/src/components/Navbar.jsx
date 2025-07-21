import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <nav className="navbar">
        {/* Left: Logo */}
        <div className="logo">
          <Link to="/">Goriber Gari</Link>
        </div>

        {/* Center: Navigation Links */}
        <div className="nav-center">
          <div className="nav-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/categories" className="nav-link">Categories</Link>
            <Link to="/faq" className="nav-link">FAQs</Link>
          </div>
        </div>

        {/* Right: User Info or Login */}
        <div className="nav-right">
          {user ? (
            <div className="user-info">
              <span className="username">{user.username}</span>
              <button onClick={handleLogout} className="logout-button">Logout</button>
            </div>
          ) : (
            <Link to="/login" className="login-button">Login</Link>
          )}
        </div>
      </nav>
      <style jsx>{`
        .navbar {
          position: fixed;
          top: 0;
          width: 100%;
          background: rgba(0, 12, 6, 0.7);
          color: #ffffff;
          padding: 0.75rem 1.5rem; /* Reduced padding for compactness */
          display: flex;
          align-items: center;
          justify-content: space-between;
          z-index: 50;
          backdrop-filter: blur(15px);
          -webkit-backdrop-filter: blur(15px);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
        }
        .logo {
          font-size: 1.5rem; /* Reduced font size */
          font-weight: 700;
          letter-spacing: 0.05em;
        }
        .logo a {
          color: #ffffff;
          text-decoration: none;
          transition: transform 0.3s ease;
        }
        .logo a:hover {
          transform: scale(1.05);
        }
        .nav-center {
          display: flex;
          justify-content: center;
          width: 60%;
        }
        .nav-links {
          display: flex;
          gap: 2rem; /* Reduced gap */
          align-items: center;
        }
        .nav-link {
          color: #e2e8f0;
          text-decoration: none;
          font-size: 1rem; /* Reduced font size */
          font-weight: 500;
          position: relative;
          transition: color 0.3s ease;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          width: 0;
          height: 2px;
          bottom: -4px;
          left: 0;
          background-color: #a5b4fc;
          transition: width 0.3s ease;
        }
        .nav-link:hover::after {
          width: 100%;
        }
        .nav-link:hover {
          color: #ffffff;
        }
        .nav-right {
          display: flex;
          justify-content: flex-end;
          width: auto;
          max-width: 180px; /* Slightly reduced max-width */
          padding-right: 1.5rem;
        }
        .login-button {
          color: #ffffff;
          text-decoration: none;
          font-size: 0.9rem; /* Reduced font size */
          padding: 0.4rem 1.2rem; /* Adjusted padding */
          background: #db2777;
          border-radius: 2rem;
          font-weight: 500;
          transition: background 0.3s ease, transform 0.2s ease;
        }
        .login-button:hover {
          background: #be185d;
          transform: translateY(-2px);
        }
        .user-info {
          display: flex;
          align-items: center;
          gap: 0.5rem; /* Further reduced gap */
          flex-wrap: nowrap;
        }
        .username {
          font-size: 0.9rem; /* Reduced font size */
          font-weight: 500;
          color: #e2e8f0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 80px; /* Reduced max-width */
        }
        .logout-button {
          color: #ffffff;
          text-decoration: none;
          font-size: 0.9rem; /* Reduced font size */
          padding: 0.4rem 1.2rem; /* Adjusted padding */
          background: #db2777;
          border-radius: 2rem;
          font-weight: 500;
          border: none;
          cursor: pointer;
          transition: background 0.3s ease, transform 0.2s ease;
          white-space: nowrap;
        }
        .logout-button:hover {
          background: #be185d;
          transform: translateY(-2px);
        }
        @media (max-width: 768px) {
          .navbar {
            padding: 0.5rem 1rem;
          }
          .nav-center {
            width: 50%;
          }
          .nav-links {
            gap: 1.2rem;
          }
          .nav-link {
            font-size: 0.9rem;
          }
          .nav-right {
            max-width: 140px;
          }
          .username {
            max-width: 60px;
          }
          .login-button, .logout-button {
            padding: 0.3rem 1rem;
            font-size: 0.8rem;
          }
        }
        @media (max-width: 480px) {
          .navbar {
            flex-wrap: wrap;
            padding: 0.5rem;
          }
          .nav-center {
            width: 100%;
            justify-content: flex-start;
          }
          .nav-links {
            gap: 0.8rem;
          }
          .nav-right {
            width: 100%;
            justify-content: flex-end;
            padding-right: 0.5rem;
          }
          .username {
            max-width: 50px;
          }
          .login-button, .logout-button {
            padding: 0.3rem 0.8rem;
            font-size: 0.7rem;
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;