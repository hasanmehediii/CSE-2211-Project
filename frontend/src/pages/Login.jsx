// src/pages/Login.jsx
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Login = () => {
  const loginContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '2rem',
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    width: '300px',
    gap: '1rem',
  };

  const inputStyle = {
    padding: '0.5rem',
    fontSize: '1rem',
  };

  const buttonStyle = {
    padding: '0.75rem',
    fontSize: '1rem',
    backgroundColor: '#000',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
  };

  return (
    <>
      <Navbar />
      <div style={loginContainerStyle}>
        <h2>Login</h2>
        <form style={formStyle}>
          <input type="email" placeholder="Email" style={inputStyle} />
          <input type="password" placeholder="Password" style={inputStyle} />
          <button type="submit" style={buttonStyle}>Login</button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default Login;
