// src/pages/Home.jsx
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import carImage from '../assets/car2.jpg'; // Ensure this path is correct

const Home = () => {
  const heroStyle = {
    backgroundImage: `url(${carImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '80vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#fff',
    textShadow: '2px 2px 4px rgba(0, 17, 14, 0.7)',
  };

  const headingStyle = {
    fontSize: '3rem',
    marginBottom: '1rem',
  };

  const subheadingStyle = {
    fontSize: '1.5rem',
    marginBottom: '2rem',
  };

  const buttonStyle = {
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    backgroundColor: '#fff',
    color: '#000',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  };

  return (
    <>
      <Navbar />
      <section style={heroStyle}>
        <h1 style={headingStyle}>Welcome to BMW City</h1>
        <p style={subheadingStyle}>Your dream car awaits!</p>
        <button style={buttonStyle}>Explore Now</button>
      </section>
      <Footer />
    </>
  );
};

export default Home;
