import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import carImage from '../assets/car2.jpg'; // Ensure image path is valid

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
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Slightly dark background for readability
    backdropFilter: 'blur(12px)',
    borderRadius: '15px',
    padding: '2.5rem 2rem',
    width: '100%',
    maxWidth: '420px',
    color: '#fff',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
    transition: 'box-shadow 0.3s ease',
  };

  const inputStyle = {
    padding: '0.8rem 1rem',
    fontSize: '1rem',
    border: 'none',
    borderRadius: '10px',
    outline: 'none',
    marginBottom: '1.2rem',
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Light background for input fields
    color: '#fff',
    transition: 'background-color 0.3s ease',
  };

  const inputFocusStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  };

const buttonStyle = {
    padding: '1rem 2.5rem', // Larger padding for a bigger button
    fontSize: '1.4rem', // Larger font size
    background: 'linear-gradient(45deg,rgb(1, 255, 35),rgb(12, 241, 111))', // Gradient background for button
    color: '#fff',
    border: 'none',
    borderRadius: '50px', // Elliptical shape for the button
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
    width: '100%', // Make the button fill the width of the card
  };

  const buttonHoverStyle = {
    background: 'linear-gradient(45deg, #228B22, #32CD32)',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
  };

  return (
    <>
      <Navbar />
      <div style={pageStyle}>
        <form
          style={cardStyle}
          onFocus={(e) => e.target.style.backgroundColor = inputFocusStyle.backgroundColor}
          onBlur={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
        >
          <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', fontFamily: "'Poppins', sans-serif" }}>Sign Up</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <input
              type="text"
              placeholder="Full Name"
              style={inputStyle}
              required
            />
            <input
              type="email"
              placeholder="Email"
              style={inputStyle}
              required
            />
            <input
              type="password"
              placeholder="Password"
              style={inputStyle}
              required
            />
            <input
              type="password"
              placeholder="Confirm Password"
              style={inputStyle}
              required
            />
            <button
              type="submit"
              style={buttonStyle}
            >
              Create Account
            </button>
            <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem' }}>
              Already have an account?
              <a
                href="/login"
                style={{
                  color: '#00ffff',
                  fontWeight: 'bold',
                  marginLeft: '0.5rem',
                  textDecoration: 'underline',
                }}
              >
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
