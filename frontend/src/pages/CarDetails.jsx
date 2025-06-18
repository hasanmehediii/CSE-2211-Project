import React from 'react';
import { useLocation } from 'react-router-dom';

const CarDetail = () => {
  const location = useLocation();
  const car = location.state; // Get the car data passed from Welcome page

  // Static details for all cars
  const commonDetails = {
    description: 'This car is one of the most iconic models with top-notch performance and luxury.',
    releaseDate: '2021-01-01',
    reviews: ['Absolutely amazing!', 'Best car in its class.', 'A dream car!'],
    purchasedNumbers: 1234,
    likePercentage: 90,
  };

  const pageStyle = {
    background: '#f5f5f5',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2rem',
  };

  const carDetailCardStyle = {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '2rem',
    width: '80%',
    maxWidth: '800px',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  };

  const carImageStyle = {
    width: '100%',
    maxHeight: '400px',
    objectFit: 'cover',
    borderRadius: '10px',
  };

  const detailStyle = {
    marginTop: '1.5rem',
    textAlign: 'left',
  };

  const sectionTitleStyle = {
    fontSize: '1.5rem',
    marginBottom: '0.8rem',
    color: '#333',
  };

  const listStyle = {
    listStyleType: 'none',
    padding: 0,
  };

  const footerStyle = {
    marginTop: '3rem',
    textAlign: 'center',
    fontSize: '0.9rem',
    color: '#888',
  };

  return (
    <div style={pageStyle}>
      <div style={carDetailCardStyle}>
        <h1>{car.name}</h1>
        <img src={car.image} alt={car.name} style={carImageStyle} />
        
        <div style={detailStyle}>
          <h2 style={sectionTitleStyle}>Description</h2>
          <p>{commonDetails.description}</p>
          
          <h2 style={sectionTitleStyle}>Additional Information</h2>
          <ul style={listStyle}>
            <li><strong>Release Date:</strong> {commonDetails.releaseDate}</li>
            <li><strong>Purchased by:</strong> {commonDetails.purchasedNumbers} users</li>
            <li><strong>Likes Percentage:</strong> {commonDetails.likePercentage}%</li>
          </ul>
          
          <h2 style={sectionTitleStyle}>User Reviews</h2>
          {commonDetails.reviews.map((review, idx) => (
            <p key={idx}>"{review}"</p>
          ))}
        </div>
      </div>

      <footer style={footerStyle}>
        <p>&copy; 2025 CarZone. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default CarDetail;
