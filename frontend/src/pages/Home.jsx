import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import carImage from '../assets/car2.jpg';
import axios from 'axios';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Home = () => {
  const navigate = useNavigate();
  const [carData, setCarData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const scrollRefs = useRef([]);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const [topRated, newArrivals, budgetFriendly] = await Promise.all([
          axios.get("http://localhost:8000/cars/top-rated"),
          axios.get("http://localhost:8000/cars/new-arrivals"),
          axios.get("http://localhost:8000/cars/budget-friendly"),
        ]);

        console.log('Top Rated:', topRated.data);
        console.log('New Arrivals:', newArrivals.data);
        console.log('Budget Friendly:', budgetFriendly.data);

        const formattedData = [
          {
            category: 'Top Class',
            cars: topRated.data.map(car => ({
              ...car,
              name: car.model_name || car.modelnum || 'Unknown Model',
              price: car.price ? `$${car.price.toFixed(2)}` : 'Price not listed',
              image: car.image_link || carImage,
              rating: car.rating ? Math.round(car.rating) : 0,
              description: car.description || 'No description available.',
            })),
          },
          {
            category: 'New Arrivals',
            cars: newArrivals.data.map(car => ({
              ...car,
              name: car.model_name || car.modelnum || 'Unknown Model',
              price: car.price ? `$${car.price.toFixed(2)}` : 'Price not listed',
              image: car.image_link || carImage,
              rating: 0,
              description: car.description || 'No description available.',
            })),
          },
          {
            category: 'Budget Friendly',
            cars: budgetFriendly.data.map(car => ({
              ...car,
              name: car.model_name || car.modelnum || 'Unknown Model',
              price: car.price ? `$${car.price.toFixed(2)}` : 'Price not listed',
              image: car.image_link || carImage,
              rating: 0,
              description: car.description || 'No description available.',
            })),
          },
        ];

        setCarData(formattedData);
      } catch (error) {
        console.error("Failed to fetch car data:", error);
        setError('Failed to load cars. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  const handleCardClick = (car) => {
    if (car && car.car_id) {
      console.log('Navigating to car detail with car:', car);
      navigate(`/car-detail/${car.car_id}`);
    } else {
      console.error('Car ID is not available:', car);
      setError('Cannot navigate to car details: Missing car ID.');
    }
  };

  const handleImageError = (e) => {
    e.target.src = carImage;
  };

  const scrollLeft = (index) => {
    const scrollContainer = scrollRefs.current[index];
    if (scrollContainer) {
      scrollContainer.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = (index) => {
    const scrollContainer = scrollRefs.current[index];
    if (scrollContainer) {
      scrollContainer.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <>
      <div className="page">
        <Navbar/>
        <section className="hero">
          <h1 className="hero-title">Welcome to Goriber Gari</h1>
          <p className="hero-subtitle">Experience the ride of your dreams</p>
          <button
            className="hero-button"
            onClick={() => window.scrollTo({ top: document.getElementById('car-categories').offsetTop, behavior: 'smooth' })}
          >
            Explore Now
          </button>
        </section>

        <section className="discover">
          <h2 className="discover-title">Discover Our Latest Cars</h2>
          <p className="discover-text">
            Browse our top-class, new arrival, and budget-friendly cars. Find your dream car now!
          </p>
        </section>

        <div id="car-categories" className="categories">
          {error && <div className="error-message">{error}</div>}
          {loading ? (
            <div className="loading">Loading cars...</div>
          ) : carData.length === 0 ? (
            <div className="no-data">No cars available.</div>
          ) : (
            carData.map((section, idx) => (
              <div key={idx} className="category-section">
                <h2 className="category-title">{section.category}</h2>
                <div className="car-row-container">
                  <button className="scroll-button left" onClick={() => scrollLeft(idx)}>
                    <FaChevronLeft />
                  </button>
                  <div
                    className="car-row"
                    ref={(el) => (scrollRefs.current[idx] = el)}
                  >
                    {section.cars.map((car, index) => (
                      <div
                        key={`${section.category}-${car.car_id}-${index}`}
                        className="car-card"
                        onClick={() => handleCardClick(car)}
                      >
                        <img
                          src={car.image}
                          alt={car.name}
                          className="car-image"
                          onError={handleImageError}
                        />
                        <div className="car-details">
                          <h3 className="car-name">{car.name}</h3>
                          <p className="car-price">{car.price}</p>
                          <p className="car-description">{car.description}</p>
                          {car.rating > 0 && (
                            <p className="car-rating">
                              {'★'.repeat(car.rating)}{'☆'.repeat(5 - car.rating)}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="scroll-button right" onClick={() => scrollRight(idx)}>
                    <FaChevronRight />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        <Footer />
      </div>
      <style jsx>{`
        .page {
          background: linear-gradient(135deg, #010715ff, #010a04ff);
          color: #ffffff;
          display: flex;
          flex-direction: column;
          font-family: 'Inter', sans-serif;
          margin: 0;
          padding-top: 60px;
          overflow-x: hidden;  /* Prevent horizontal overflow */
        }
        .hero {
          background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.8)), url(${carImage});
          background-size: cover;
          background-position: center;
          height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          padding: 0 1.5rem;
          position: relative;
          width: 100%;
          overflow: hidden;
        }
        .hero-title {
          font-size: 3rem;
          font-weight: 800;
          letter-spacing: 0.02em;
          margin-bottom: 0.75rem;
          text-transform: uppercase;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }
        .hero-subtitle {
          font-size: 1.1rem;
          color: #d1d5db;
          margin-bottom: 1.2rem;
          max-width: 500px;
        }
        .hero-button {
          padding: 0.5rem 1.2rem;
          font-size: 1rem;
          background: linear-gradient(to right, #ec4899, #f43f5e);
          color: #ffffff;
          border: none;
          border-radius: 2rem;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .hero-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
        }
        .discover {
          padding: 1.5rem;
          text-align: center;
          background: linear-gradient(135deg, #000000ff, #010401ff);
          width: 100%;
        }
        .discover-title {
          font-size: 1.75rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }
        .discover-text {
          font-size: 1rem;
          color: #d1d5db;
          max-width: 700px;
          margin: 0 auto;
        }
        .categories {
          padding: 1.5rem;
          background: linear-gradient(135deg, #000000ff, #010401ff);
          width: 100%;
        }
        .loading, .error-message, .no-data {
          text-align: center;
          font-size: 1.2rem;
          color: #d1d5db;
          padding: 1rem;
        }
        .error-message {
          color: #f43f5e;
        }
        .category-section {
          margin-bottom: 5rem;
          position: relative;
        }
        .category-title {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 0.75rem;
          color: #ffffff;
          border-left: 5px solid #ec4899;
          padding-left: 0.5rem;
        }
        .car-row-container {
          position: relative;
          display: flex;
          align-items: center;
          width: 100%;
        }
        .car-row {
          display: flex;
          overflow-x: auto;
          gap: 1rem;
          padding-bottom: 0.5rem;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .car-row::-webkit-scrollbar {
          display: none;
        }
        .car-card {
          min-width: 240px;
          max-width: 260px;
          background: rgba(15, 23, 42, 0.95);
          border-radius: 1rem;
          box-shadow: 0 8px 16px rgba(3, 132, 98, 0.48);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          cursor: pointer;
          overflow: hidden;
        }
        .car-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 24px rgba(136, 115, 22, 0.82);
        }
        .car-image {
          width: 100%;
          height: 160px;
          object-fit: cover;
          border-top-left-radius: 1rem;
          border-top-right-radius: 1rem;
        }
        .car-details {
          padding: 0.5rem;
          text-align: center;
        }
        .car-name {
          font-size: 1.1rem;
          font-weight: 600;
          margin: 0.3rem 0;
          color: #ffffff;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .car-price {
          font-size: 1rem;
          color: #22d3ee;
          margin: 0.2rem 0;
        }
        .car-description {
          font-size: 0.9rem;
          color: #d1d5db;
          margin: 0.2rem 0;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        .car-rating {
          color: #facc15;
          font-size: 0.9rem;
          margin: 0.2rem 0;
        }
        .scroll-button {
          background: rgba(15, 23, 42, 0.7);
          color: #ffffff;
          border: none;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          position: absolute;
          z-index: 10;
          transition: background 0.3s ease;
        }
        .scroll-button:hover {
          background: rgba(5, 23, 0, 1);
        }
        .scroll-button.left {
          left: -16px;
        }
        .scroll-button.right {
          right: -16px;
        }
        @media (max-width: 768px) {
          .page {
            padding-top: 50px;
          }
          .hero {
            height: calc(100vh - 50px);
            padding: 0 1rem;
          }
          .hero-title {
            font-size: 2rem;
          }
          .hero-subtitle {
            font-size: 0.9rem;
          }
          .hero-button {
            padding: 0.4rem 1rem;
            font-size: 0.9rem;
          }
          .discover {
            padding: 1rem;
          }
          .discover-title {
            font-size: 1.5rem;
          }
          .discover-text {
            font-size: 0.9rem;
          }
          .categories {
            padding: 1rem;
          }
          .category-title {
            font-size: 1.3rem;
          }
          .car-card {
            min-width: 200px;
          }
          .car-image {
            height: 140px;
          }
          .scroll-button {
            width: 28px;
            height: 28px;
          }
        }
        @media (max-width: 480px) {
          .page {
            padding-top: 48px;
          }
          .hero {
            height: calc(100vh - 48px);
            padding: 0 0.75rem;
          }
          .hero-title {
            font-size: 1.6rem;
          }
          .hero-subtitle {
            font-size: 0.8rem;
          }
          .hero-button {
            padding: 0.3rem 0.8rem;
            font-size: 0.8rem;
          }
          .discover {
            padding: 0.75rem;
          }
          .discover-title {
            font-size: 1.3rem;
          }
          .discover-text {
            font-size: 0.8rem;
          }
          .categories {
            padding: 0.75rem;
          }
          .category-title {
            font-size: 1.2rem;
          }
          .car-card {
            min-width: 180px;
          }
          .car-image {
            height: 120px;
          }
          .scroll-button {
            width: 24px;
            height: 24px;
          }
        }
      `}</style>
    </>
  );
};

export default Home;
