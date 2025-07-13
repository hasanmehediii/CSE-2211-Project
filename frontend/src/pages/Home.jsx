import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import carImage from '../assets/car2.jpg';
import axios from 'axios';

const Home = () => {
  const navigate = useNavigate();
  const [carData, setCarData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch data from your new API endpoints
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const [topRated, newArrivals, budgetFriendly] = await Promise.all([
          axios.get("http://localhost:8000/cars/top-rated"), // Replace with your actual backend URL
          axios.get("http://localhost:8000/cars/new-arrivals"),
          axios.get("http://localhost:8000/cars/budget-friendly"),
        ]);

        const formattedData = [
          {
            category: 'Top Sales',
            cars: topRated.data.map(car => ({
              ...car,
              name: car.model_name || car.modelnum,
              price: car.price ? `$${car.price.toFixed(2)}` : 'Price not listed',
              image: car.image_link,
              rating: car.rating ? Math.round(car.rating) : 0, // Round rating to nearest integer
            })),
          },
          {
            category: 'New Arrival',
            cars: newArrivals.data.map(car => ({
              ...car,
              name: car.model_name || car.modelnum,
              price: car.price ? `$${car.price.toFixed(2)}` : 'Price not listed',
              image: car.image_link,
              rating: 0, // No rating for new arrivals
            })),
          },
          {
            category: 'Budget Friendly',
            cars: budgetFriendly.data.map(car => ({
              ...car,
              name: car.model_name || car.modelnum,
              price: car.price ? `$${car.price.toFixed(2)}` : 'Price not listed',
              image: car.image_link,
              rating: 0, // No rating for budget cars
            })),
          },
        ];

        setCarData(formattedData);
      } catch (error) {
        console.error("Failed to fetch car data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  const handleCardClick = (car) => {
    navigate('/car-detail', { state: car });
  };

  const pageStyle = {
    background: 'linear-gradient(to right, rgb(1, 26, 35), rgb(18, 1, 43))',
    color: '#fff',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    padding: '0',
    margin: '0',
    fontFamily: "'Roboto', sans-serif",
  };

  const heroStyle = {
    backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.7)), url(${carImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    textAlign: 'left',
    color: '#fff',
    padding: '0 2rem',
  };

  const headingStyle = {
    fontSize: '3.5rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
    letterSpacing: '1px',
    textTransform: 'uppercase',
  };

  const subheadingStyle = {
    fontSize: '1.5rem',
    marginBottom: '2rem',
    color: '#e0e0e0',
  };

  const buttonStyle = {
    padding: '1rem 2.5rem',
    fontSize: '1.3rem',
    background: 'linear-gradient(to right, #ff6347, #ff1a1a)',
    color: '#fff',
    border: 'none',
    borderRadius: '30px',
    cursor: 'pointer',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  };

  const sectionStyle = {
    marginTop: '2rem',
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
    overflow: 'hidden',
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

  return (
    <div style={pageStyle}>
      <Navbar />

      <section style={heroStyle}>
        <h1 style={headingStyle}>Welcome to BMW City</h1>
        <p style={subheadingStyle}>Experience the ride of your dreams</p>
        <button style={buttonStyle} onClick={() => window.scrollTo(0, document.getElementById('car-categories').offsetTop)}>
          Explore Now
        </button>
      </section>

      <section style={{ padding: '2rem 2rem', textAlign: 'center', color: '#fff' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>
          Discover Our Latest Cars
        </h2>
        <p style={{ fontSize: '1.2rem', color: '#e0e0e0' }}>
          Browse our top-selling, new arrival, and budget-friendly cars. Find your dream car now!
        </p>
      </section>

      <div id="car-categories" style={sectionStyle}>
        {loading ? (
          <div style={{ textAlign: 'center', fontSize: '2rem' }}>Loading cars...</div>
        ) : (
          carData.map((section, idx) => (
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
                    onClick={() => handleCardClick(car)}
                  >
                    <img src={car.image} alt={car.name} style={carImageStyle} />
                    <div style={carDetailsStyle}>
                      <h3 style={carNameStyle}>{car.name}</h3>
                      <p style={carPriceStyle}>{car.price}</p>
                      {car.rating > 0 && (
                        <p style={carRatingStyle}>
                          {'★'.repeat(car.rating)}{'☆'.repeat(5 - car.rating)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Home;