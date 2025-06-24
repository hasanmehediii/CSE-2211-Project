import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const CarDetail = () => {
  const location = useLocation();
  const car = location.state; // Get the car data passed from the Home page

  // Static details for all cars
  const commonDetails = {
    description: 'This car is one of the most iconic models with top-notch performance and luxury.',
    releaseDate: '2021-01-01',
    reviews: ['Absolutely amazing!', 'Best car in its class.', 'A dream car!'],
    purchasedNumbers: 1234,
    likePercentage: 90,
  };

  const pageStyle = {
    background: 'linear-gradient(to right, rgb(1, 26, 35), rgb(18, 1, 43))', // Gradient matching Navbar
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2rem',
    color: '#fff',
    fontFamily: "'Roboto', sans-serif", // Apply a clean and modern font
  };

  const carDetailCardStyle = {
    backgroundColor: '#1e1e1e', // Dark background for the car detail card
    borderRadius: '20px',
    padding: '3rem',
    width: '90%',
    maxWidth: '900px',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.2)',
    textAlign: 'center',
    transition: 'transform 0.3s',
  };

  const carImageStyle = {
    width: '100%',
    height: '450px',
    objectFit: 'cover',
    borderRadius: '20px',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)',
    transition: 'transform 0.3s',
  };

  const detailStyle = {
    marginTop: '2rem',
    textAlign: 'left',
    color: '#ddd',
  };

  const sectionTitleStyle = {
    fontSize: '1.8rem',
    marginBottom: '1rem',
    color: '#ff6347', // Light red to match the theme
    fontWeight: 'bold',
  };

  const listStyle = {
    listStyleType: 'none',
    padding: '0',
    marginLeft: '20px',
    fontSize: '1.1rem',
    color: '#ccc',
  };

  const reviewStyle = {
    color: '#fff',
    fontStyle: 'italic',
    margin: '10px 0',
  };

  const footerStyle = {
    marginTop: '4rem',
    textAlign: 'center',
    fontSize: '0.9rem',
    color: '#aaa',
    borderTop: '1px solid #444',
    paddingTop: '10px',
    width: '100%',
  };

  return (
    <div style={pageStyle}>
      <Navbar />
      <div style={carDetailCardStyle}>
        <h1 style={{ fontSize: '2.5rem', color: '#fff', fontWeight: 'bold', letterSpacing: '2px' }}>
          {car.name}
        </h1>
        <img src={car.image} alt={car.name} style={carImageStyle} />
        
        <div style={detailStyle}>
          <h2 style={sectionTitleStyle}>Description</h2>
          <p style={{ color: '#e0e0e0', fontSize: '1.2rem', lineHeight: '1.6' }}>{commonDetails.description}</p>
          
          <h2 style={sectionTitleStyle}>Additional Information</h2>
          <ul style={listStyle}>
            <li><strong>Release Date:</strong> {commonDetails.releaseDate}</li>
            <li><strong>Purchased by:</strong> {commonDetails.purchasedNumbers} users</li>
            <li><strong>Likes Percentage:</strong> {commonDetails.likePercentage}%</li>
          </ul>
          
          <h2 style={sectionTitleStyle}>User Reviews</h2>
          {commonDetails.reviews.map((review, idx) => (
            <p key={idx} style={reviewStyle}>"{review}"</p>
          ))}
        </div>
      </div>

      <Footer/>
    </div>
  );
};

export default CarDetail;
