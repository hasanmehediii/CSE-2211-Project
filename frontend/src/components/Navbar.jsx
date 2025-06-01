// src/components/Navbar.jsx
import React from 'react';

const Navbar = () => {
  const navStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    backgroundColor: '#000',
    color: '#fff',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  };

  const logoStyle = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
  };

  const navLinksStyle = {
    display: 'flex',
    gap: '1rem',
  };

  const linkStyle = {
    color: '#fff',
    textDecoration: 'none',
    fontSize: '1rem',
  };

  return (
    <nav style={navStyle}>
      <div style={logoStyle}>BMW City</div>
      <div style={navLinksStyle}>
        <a href="/" style={linkStyle}>Home</a>
        <a href="/login" style={linkStyle}>Login</a>
      </div>
    </nav>
  );
};

export default Navbar;
