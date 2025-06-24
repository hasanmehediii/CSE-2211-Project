import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import carImage from '../assets/car2.jpg'; // Ensure the image exists

const Home = () => {
  const navigate = useNavigate(); // Initialize useNavigate for programmatic navigation

  const handleCardClick = (car) => {
    // Navigate to CarDetail page and pass the car data as state
    navigate('/car-detail', { state: car });
  };

  // Main page background style
  const pageStyle = {
    background: 'linear-gradient(to right, rgb(1, 26, 35), rgb(18, 1, 43))', // Deep blue to black gradient (same as navbar)
    color: '#fff',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    padding: '0', // Remove padding to eliminate white lines on sides
    margin: '0',  // Ensure no margin on the body
    fontFamily: "'Roboto', sans-serif", // Clean font
  };

  // Hero Section styles
  const heroStyle = {
    backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.7)), url(${carImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '100vh', // Ensure full viewport height
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start', // Aligning text to the left
    textAlign: 'left',
    color: '#fff',
    padding: '0 2rem',
  };

  // Heading, Subheading, and Button styles
  const headingStyle = {
    fontSize: '3.5rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
    letterSpacing: '1px',
    textTransform: 'uppercase', // Make the title look more bold
  };

  const subheadingStyle = {
    fontSize: '1.5rem',
    marginBottom: '2rem',
    color: '#e0e0e0',
  };

  const buttonStyle = {
    padding: '1rem 2.5rem', // Larger padding for a bigger button
    fontSize: '1.3rem', // Larger font size
    background: 'linear-gradient(to right, #ff6347, #ff1a1a)', // Gradient background for button
    color: '#fff',
    border: 'none',
    borderRadius: '30px', // Elliptical shape for the button
    cursor: 'pointer',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  };

  // Car categories and cards
  const sectionStyle = {
    marginTop: '2rem', // Reduced margin to tighten space
    background: 'linear-gradient(to right, rgb(1, 26, 35), rgb(18, 1, 43))',
    padding: '3rem 2rem',
  };

  const cardRowStyle = {
    display: 'flex',
    overflowX: 'auto',
    gap: '2rem',
    paddingBottom: '1rem',
  };

  const carCardStyle = {
    minWidth: '300px',
    backgroundColor: 'rgba(3, 22, 35, 0.82)',
    borderRadius: '15px',
    boxShadow: '0 12px 24px rgba(0, 255, 255, 0.2)',
    transition: 'transform 0.3s, box-shadow 0.3s',
    cursor: 'pointer',
    overflow: 'hidden', // Ensure content stays within the card
  };

  const carImageStyle = {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
    borderTopLeftRadius: '15px',
    borderTopRightRadius: '15px',
  };

  const carDetailsStyle = {
    padding: '1.5rem',
    textAlign: 'center',
  };

  const carNameStyle = {
    fontSize: '1.35rem',
    margin: '0.5rem 0',
    color: '#ffffff',
  };

  const carPriceStyle = {
    fontSize: '1.1rem',
    color: '#00ffff',
    margin: '0.3rem 0',
  };

  const carRatingStyle = {
    color: 'gold',
    fontSize: '1.3rem',
  };

  // Car Data
  const carData = [
    {
      category: 'Top Sales',
      cars: [
        { name: 'Tesla Model S', price: '$89,990', image: '/images/tesla.jpg', rating: 5 },
        { name: 'BMW M8', price: '$133,000', image: '/images/bmw.jpg', rating: 4 },
        { name: 'Audi R8', price: '$158,000', image: '/images/audi.jpg', rating: 5 },
        { name: 'Lamborghini Aventador', price: '$393,695', image: '/images/lamborghini.jpg', rating: 5 },
      ],
    },
    {
      category: 'New Arrival',
      cars: [
        { name: 'Tesla Model X', price: '$109,990', image: '/images/tesla2.jpg', rating: 4 },
        { name: 'BMW X6', price: '$87,250', image: '/images/bmw2.jpg', rating: 4 },
        { name: 'Audi A8', price: '$86,500', image: '/images/audi2.jpg', rating: 4 },
        { name: 'Lamborghini Huracan', price: '$261,274', image: '/images/lamborghini2.jpg', rating: 5 },
      ],
    },
    {
      category: 'Budget Friendly',
      cars: [
        { name: 'Ford Mustang', price: '$42,000', image: '/images/mustang.jpg', rating: 4 },
        { name: 'Mercedes C-Class', price: '$43,550', image: '/images/mercedes.jpg', rating: 3 },
        { name: 'Honda Civic', price: '$25,500', image: '/images/normal1.jpg', rating: 4 },
        { name: 'Toyota Corolla', price: '$21,900', image: '/images/normal2.jpg', rating: 4 },
      ],
    },
  ];

  return (
    <div style={pageStyle}>
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section style={heroStyle}>
        <h1 style={headingStyle}>Welcome to BMW City</h1>
        <p style={subheadingStyle}>Experience the ride of your dreams</p>
        <button style={buttonStyle} onClick={() => window.scrollTo(0, document.getElementById('car-categories').offsetTop)}>
          Explore Now
        </button>
      </section>

      {/* Additional Text Section */}
      <section style={{ padding: '2rem 2rem', textAlign: 'center', color: '#fff' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>
          Discover Our Latest Cars
        </h2>
        <p style={{ fontSize: '1.2rem', color: '#e0e0e0' }}>
          Browse our top-selling, new arrival, and budget-friendly cars. Find your dream car now!
        </p>
      </section>

      {/* Car Categories Section */}
      <div id="car-categories" style={sectionStyle}>
        {carData.map((section, idx) => (
          <div key={idx} style={{ marginBottom: '3rem' }}>
            <h2
              style={{
                fontSize: '2rem',
                marginBottom: '1.5rem',
                color: '#ffffff',
                borderLeft: '5px solid #ff6347',
                paddingLeft: '1rem',
              }}
            >
              {section.category}
            </h2>
            <div style={cardRowStyle}>
              {section.cars.map((car, index) => (
                <div
                  key={index}
                  style={carCardStyle}
                  onClick={() => handleCardClick(car)} // Add click handler
                >
                  <img src={car.image} alt={car.name} style={carImageStyle} />
                  <div style={carDetailsStyle}>
                    <h3 style={carNameStyle}>{car.name}</h3>
                    <p style={carPriceStyle}>{car.price}</p>
                    <p style={carRatingStyle}>{'★'.repeat(car.rating)}{'☆'.repeat(5 - car.rating)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
