// src/components/Navbar.jsx
import React from 'react';
import FAQ from '../pages/FAQ';

const Navbar = () => {
  const navStyle = {
  position: 'fixed',
  top: 0,
  width: '95%',
  background: 'linear-gradient(to right, rgb(1, 26, 35), rgb(18, 1, 43))', // Deep blue to black gradient
  color: '#fff',
  padding: '0.5rem 1.5rem',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  zIndex: 1000,
  backdropFilter: 'blur(10px)', // Apply blur effect on the background
  WebkitBackdropFilter: 'blur(10px)', // Safari compatibility for blur effect
};

  const logoStyle = {
    fontSize: '1.25rem',
    fontWeight: 'bold',
  };

  const navLinksStyle = {
    display: 'flex',
    gap: '1.75rem',
  };

  const linkStyle = {
    color: '#fff',
    textDecoration: 'none',
    fontSize: '1.5rem',
  };

  const loginButtonStyle = {
    color: '#fff',
    textDecoration: 'none',
    fontSize: '1rem',
    padding: '0.8rem 1.5rem',
    backgroundColor: '#007bff',
    borderRadius: '50px',  // Elliptical border
    border: 'none',
    display: 'inline-block',
    transition: 'background-color 0.3s ease',
    marginRight: '5rem',
  };

  const navbarCenterStyle = {
    display: 'flex',
    justifyContent: 'center',
    width: '50%', // Set this to adjust the size of the center section
  };

  const navbarRightStyle = {
    display: 'flex',
    justifyContent: 'flex-end',
    width: '50%',
  };

  return (
    <nav style={navStyle}>
      <div style={logoStyle}>Goriber Gari</div>
      
      {/* Centered Navbar Links */}
      <div style={navbarCenterStyle}>
        <div style={navLinksStyle}>
          <a href="/" style={linkStyle}>Home</a>
          <a href="/categories" style={linkStyle}>Categories</a>
          <a href="/FAQ" style={linkStyle}>FAQs</a>
        </div>
      </div>

      {/* Right-Aligned Login/Sign Up */}
      <div style={navbarRightStyle}>
        <a href="/login" style={loginButtonStyle}>Login/Sign Up</a>
      </div>
    </nav>
  );
};

export default Navbar;
