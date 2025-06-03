// src/pages/Home.jsx
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import carImage from '../assets/car2.jpg'; // Make sure the image exists

const Home = () => {
  const heroStyle = {
    backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.8)), url(${carImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '90vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#fff',
    textAlign: 'center',
    padding: '0 2rem',
  };

  const headingStyle = {
    fontSize: '4rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
    letterSpacing: '2px',
  };

  const subheadingStyle = {
    fontSize: '1.8rem',
    marginBottom: '2rem',
    color: '#e0e0e0',
  };

  const buttonStyle = {
    padding: '0.8rem 2rem',
    fontSize: '1.1rem',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
    transition: 'background 0.3s ease',
  };

  return (
    <>
      <Navbar />
      <section style={heroStyle}>
        <h1 style={headingStyle}>Welcome to BMW City</h1>
        <p style={subheadingStyle}>Experience the ride of your dreams</p>
        <button style={buttonStyle}>Explore Now</button>
      </section>
      <Footer />
    </>
  );
};

export default Home;
