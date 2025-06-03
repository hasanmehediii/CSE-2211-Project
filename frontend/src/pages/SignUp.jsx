// src/pages/Signup.jsx
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import carImage from '../assets/car2.jpg';

const Signup = () => {
  const pageStyle = {
    backgroundImage: `url(${carImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '90vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2rem',
  };

  const cardStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: '10px',
    padding: '2rem',
    width: '100%',
    maxWidth: '400px',
    color: '#fff',
    boxShadow: '0 8px 20px rgba(0,0,0,0.5)',
  };

  const inputStyle = {
    padding: '0.8rem',
    fontSize: '1rem',
    border: 'none',
    borderRadius: '5px',
    outline: 'none',
  };

  const buttonStyle = {
    padding: '0.75rem',
    fontSize: '1rem',
    backgroundColor: '#000',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  };

  return (
    <>
      <Navbar />
      <div style={pageStyle}>
        <form style={cardStyle}>
          <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Sign Up</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input type="text" placeholder="Full Name" style={inputStyle} />
            <input type="email" placeholder="Email" style={inputStyle} />
            <input type="password" placeholder="Password" style={inputStyle} />
            <input type="password" placeholder="Confirm Password" style={inputStyle} />
            <button type="submit" style={buttonStyle}>Create Account</button>
            <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem' }}>
              Already have an account?
              <a href="/login" style={{ color: '#00ffff', fontWeight: 'bold', marginLeft: '0.5rem', textDecoration: 'underline' }}>
                Login →
              </a>
            </p>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default Signup;
