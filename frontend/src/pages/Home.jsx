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
            category: 'Top Sales',
            cars: topRated.data.map(car => ({
              ...car,
              name: car.model_name || car.modelnum,
              price: car.price ? `$${car.price.toFixed(2)}` : 'Price not listed',
              image: car.image_link,
              rating: car.rating ? Math.round(car.rating) : 0,
            })),
          },
          {
            category: 'New Arrival',
            cars: newArrivals.data.map(car => ({
              ...car,
              name: car.model_name || car.modelnum,
              price: car.price ? `$${car.price.toFixed(2)}` : 'Price not listed',
              image: car.image_link,
              rating: 0,
            })),
          },
          {
            category: 'Budget Friendly',
            cars: budgetFriendly.data.map(car => ({
              ...car,
              name: car.model_name || car.modelnum,
              price: car.price ? `$${car.price.toFixed(2)}` : 'Price not listed',
              image: car.image_link,
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

  return (
    <>
      <div className="page">
        <Navbar />
        <section className="hero">
          <h1 className="hero-title">Welcome to BMW City</h1>
          <p className="hero-subtitle">Experience the ride of your dreams</p>
          <button
            className="hero-button"
            onClick={() => window.scrollTo(0, document.getElementById('car-categories').offsetTop)}
          >
            Explore Now
          </button>
        </section>

        <section className="discover">
          <h2 className="discover-title">Discover Our Latest Cars</h2>
          <p className="discover-text">
            Browse our top-selling, new arrival, and budget-friendly cars. Find your dream car now!
          </p>
        </section>

        <div id="car-categories" className="categories">
          {loading ? (
            <div className="loading">Loading cars...</div>
          ) : (
            carData.map((section, idx) => (
              <div key={idx} className="category-section">
                <h2 className="category-title">{section.category}</h2>
                <div className="car-row">
                  {section.cars.map((car, index) => (
                    <div
                      key={index}
                      className="car-card"
                      onClick={() => handleCardClick(car)}
                    >
                      <img src={car.image} alt={car.name} className="car-image" />
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
              </div>
            ))
          )}
        </div>
        <Footer />
      </div>
      <style jsx>{`
        .page {
          background: linear-gradient(135deg, #0f172a, #1e293b);
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
          margin-bottom1rem;
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
          background: linear-gradient(135deg, #0f172a, #1e293b);
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
          background: linear-gradient(135deg, #0f172a, #1e293b);
        }
        .loading {
          text-align: center;
          font-size: 2rem;
          color: #d1d5db;
        }
        .category-section {
          margin-bottom: 3rem;
        }
        .category-title {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          color: #ffffff;
          border-left: 5px solid #ec4899;
          padding-left: 1rem;
        }
        .car-row {
          display: flex;
          overflow-x: auto;
          gap: 1.5rem;
          padding-bottom: 1rem;
          scrollbar-width: thin;
          scrollbar-color: #ec4899 #1e293b;
        }
        .car-row::-webkit-scrollbar {
          height: 8px;
        }
        .car-row::-webkit-scrollbar-thumb {
          background: #ec4899;
          border-radius: 4px;
        }
        .car-row::-webkit-scrollbar-track {
          background: #1e293b;
        }
        .car-card {
          min-width: 300px;
          background: rgba(15, 23, 42, 0.9);
          border-radius: 1rem;
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          cursor: pointer;
          overflow: hidden;
        }
        .car-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
        }
        .car-image {
          width: 100%;
          height: 200px;
          object-fit: cover;
          border-top-left-radius: 1rem;
          border-top-right-radius: 1rem;
        }
        .car-details {
          padding: 1.5rem;
          text-align: center;
        }
        .car-name {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 0.5rem 0;
          color: #ffffff;
        }
        .car-price {
          font-size: 1.2rem;
          color: #22d3ee;
          margin: 0.3rem 0;
        }
        .car-rating {
          color: #facc15;
          font-size: 1.25rem;
          margin: 0.3rem 0;
        }
      `}</style>
    </>
  );
};

export default Home;