import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import carImage from '../assets/car2.jpg';
import axios from 'axios';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Home = () => {
  const navigate = useNavigate();
  const [carData, setCarData] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRefs = useRef([]);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const [topRated, newArrivals, budgetFriendly] = await Promise.all([
          axios.get("http://localhost:8000/cars/top-rated"),
          axios.get("http://localhost:8000/cars/new-arrivals"),
          axios.get("http://localhost:8000/cars/budget-friendly"),
        ]);

        const formattedData = [
          {
            category: 'Top Class',
            cars: topRated.data.map(car => ({
              ...car,
              name: car.model_name || car.modelnum,
              price: car.price ? `$${car.price.toFixed(2)}` : 'Price not listed',
              image: car.image_link || carImage,
              rating: car.rating ? Math.round(car.rating) : 0,
            })),
          },
          {
            category: 'New Arrivals',
            cars: newArrivals.data.map(car => ({
              ...car,
              name: car.model_name || car.modelnum,
              price: car.price ? `$${car.price.toFixed(2)}` : 'Price not listed',
              image: car.image_link || carImage,
              rating: 0,
            })),
          },
          {
            category: 'Budget Friendly',
            cars: budgetFriendly.data.map(car => ({
              ...car,
              name: car.model_name || car.modelnum,
              price: car.price ? `$${car.price.toFixed(2)}` : 'Price not listed',
              image: car.image_link || carImage,
              rating: 0,
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

  const handleImageError = (e) => {
    e.target.src = carImage; // Fallback to default image on error
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
        <Navbar />
        <section className="hero">
          <h1 className="hero-title">Welcome to BMW City</h1>
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
          {loading ? (
            <div className="loading">Loading cars...</div>
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
                        key={index}
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
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          font-family: 'Inter', sans-serif;
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
          padding: 0 3rem;
          position: relative;
        }
        .hero-title {
          font-size: 4rem;
          font-weight: 800;
          letter-spacing: 0.02em;
          margin-bottom: 1rem;
          text-transform: uppercase;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }
        .hero-subtitle {
          font-size: 1.5rem;
          color: #d1d5db;
          margin-bottom: 2rem;
          max-width: 600px;
        }
        .hero-button {
          padding: 0.75rem 2rem;
          font-size: 1.25rem;
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
          padding: 3rem 2rem;
          text-align: center;
          background: linear-gradient(135deg, #000000ff, #010401ff);
        }
        .discover-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }
        .discover-text {
          font-size: 1.25rem;
          color: #d1d5db;
          max-width: 800px;
          margin: 0 auto;
        }
        .categories {
          padding: 3rem 2rem;
          background: linear-gradient(135deg, #000000ff, #010401ff);
        }
        .loading {
          text-align: center;
          font-size: 2rem;
          color: #d1d5db;
        }
        .category-section {
          margin-bottom: 3rem;
          position: relative;
        }
        .category-title {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          color: #ffffff;
          border-left: 5px solid #ec4899;
          padding-left: 1rem;
        }
        .car-row-container {
          position: relative;
          display: flex;
          align-items: center;
        }
        .car-row {
          display: flex;
          overflow-x: auto;
          gap: 1.5rem;
          padding-bottom: 1rem;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .car-row::-webkit-scrollbar {
          display: none;
        }
        .car-card {
          min-width: 280px;
          max-width: 300px;
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
          height: 200px;
          object-fit: cover;
          border-top-left-radius: 1rem;
          border-top-right-radius: 1rem;
        }
        .car-details {
          padding: 1rem;
          text-align: center;
        }
        .car-name {
          font-size: 1.4rem;
          font-weight: 600;
          margin: 0.5rem 0;
          color: #ffffff;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .car-price {
          font-size: 1.2rem;
          color: #22d3ee;
          margin: 0.3rem 0;
        }
        .car-rating {
          color: #facc15;
          font-size: 1.1rem;
          margin: 0.3rem 0;
        }
        .scroll-button {
          background: rgba(15, 23, 42, 0.7);
          color: #ffffff;
          border: none;
          border-radius: 50%;
          width: 40px;
          height: 40px;
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
          left: -20px;
        }
        .scroll-button.right {
          right: -20px;
        }
        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.5rem;
          }
          .hero-subtitle {
            font-size: 1.2rem;
          }
          .car-card {
            min-width: 240px;
          }
          .car-image {
            height: 160px;
          }
          .scroll-button {
            width: 32px;
            height: 32px;
          }
        }
        @media (max-width: 480px) {
          .hero {
            padding: 0 1.5rem;
          }
          .hero-title {
            font-size: 2rem;
          }
          .hero-subtitle {
            font-size: 1rem;
          }
          .car-card {
            min-width: 200px;
          }
          .car-image {
            height: 140px;
          }
        }
      `}</style>
    </>
  );
};

export default Home;