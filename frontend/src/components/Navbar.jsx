import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
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

        {/* Right: Login/Sign Up */}
        <div className="nav-right">
          <Link to="/login" className="login-button">Login</Link>
        </div>
      </nav>
      <style jsx>{`
        .navbar {
          position: fixed;
          top: 0;
          width: 100%;
          background: rgba(0, 12, 6, 0.7); /* Semi-transparent for stronger blur effect */
          color: #ffffff;
          padding: 1rem 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          z-index: 50;
          backdrop-filter: blur(15px); /* Increased blur intensity */
          -webkit-backdrop-filter: blur(15px);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
        }
        .logo {
          font-size: 1.75rem;
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
          gap: 2.5rem;
          align-items: center;
        }
        .nav-link {
          color: #e2e8f0;
          text-decoration: none;
          font-size: 1.1rem;
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
          justify-content: flex-start; /* Changed to move login button left */
          width: 15%; /* Reduced width to shift button left */
          padding-left: 1rem; /* Added padding to fine-tune left positioning */
        }
        .login-button {
          color: #ffffff;
          text-decoration: none;
          font-size: 1rem;
          padding: 0.6rem 1.75rem;
          background: #db2777;
          border-radius: 2rem;
          font-weight: 500;
          transition: background 0.3s ease, transform 0.2s ease;
        }
        .login-button:hover {
          background: #be185d;
          transform: translateY(-2px);
        }
      `}</style>
    </>
  );
};

export default Navbar;