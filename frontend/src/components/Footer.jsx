// src/components/Footer.jsx
import React from 'react';

const Footer = () => {
  const footerStyle = {
    backgroundColor: '#000',
    color: '#fff',
    textAlign: 'center',
    padding: '1rem 0',
    marginTop: '2rem',
  };

  return (
    <footer style={footerStyle}>
      <p>&copy; {new Date().getFullYear()} BMW City. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
