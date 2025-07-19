import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa'; // Import Font Awesome icons

const Footer = () => {
  const footerStyle = {
    background: 'linear-gradient(to right, #000000ff, #010401ff)', // Same as navbar color
    color: '#fff',
    textAlign: 'center',
    padding: '2rem 0', // Increased padding for better spacing
    marginTop: '2rem',
  };

  const footerTextStyle = {
    fontSize: '1.1rem',
    marginBottom: '1rem',
    color: '#e0e0e0',
  };

  const socialIconsStyle = {
    display: 'flex',
    justifyContent: 'center',
    gap: '1.5rem',
    marginBottom: '1.5rem',
  };

  const socialIconStyle = {
    fontSize: '2rem',
    color: '#fff',
    cursor: 'pointer',
    transition: 'color 0.3s ease',
  };

  const socialIconHoverStyle = {
    color: '#ff6347', // Hover color for social icons
  };

  return (
    <footer style={footerStyle}>
      {/* Footer Text */}
      <p style={footerTextStyle}>
        &copy; 2025 BMW City. All rights reserved.
      </p>
      
      {/* Social Icons */}
      <div style={socialIconsStyle}>
        <FaFacebook
          style={socialIconStyle}
          onMouseEnter={(e) => (e.target.style.color = '#ff6347')}
          onMouseLeave={(e) => (e.target.style.color = '#fff')}
        />
        <FaTwitter
          style={socialIconStyle}
          onMouseEnter={(e) => (e.target.style.color = '#ff6347')}
          onMouseLeave={(e) => (e.target.style.color = '#fff')}
        />
        <FaInstagram
          style={socialIconStyle}
          onMouseEnter={(e) => (e.target.style.color = '#ff6347')}
          onMouseLeave={(e) => (e.target.style.color = '#fff')}
        />
      </div>
      
      {/* Additional Footer Text */}
      <p style={footerTextStyle}>
        Connect with us on social media for the latest updates and promotions!
      </p>
    </footer>
  );
};

export default Footer;
