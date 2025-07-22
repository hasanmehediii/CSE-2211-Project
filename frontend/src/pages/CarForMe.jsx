import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import carImage from '../assets/car2.jpg';

const CarForMe = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const [categoryName, setCategoryName] = useState('this Category');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch category name
        const categoryResponse = await axios.get(`http://localhost:8000/categories/${categoryId}`);
        setCategoryName(categoryResponse.data.name || 'this Category');

        // Fetch cars
        const carsResponse = await axios.get(`http://localhost:8000/cars/category/${categoryId}`);
        console.log(`API Response for category ${categoryId}:`, carsResponse.data);
        setCars(carsResponse.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(
          err.response?.status === 404
            ? `Category ${categoryId} not found`
            : 'Failed to fetch cars for this category'
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [categoryId]);

  const handleImageError = (e) => {
    e.target.src = carImage;
  };

  return (
    <>
      <div className="page">
        <Navbar />
        <section className="car-list-section">
          <h1 className="car-list-title">{`Cars in ${categoryName}`}</h1>
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading cars...</p>
            </div>
          ) : error ? (
            <div className="error-container">
              <p className="error-message">{error}</p>
            </div>
          ) : (
            <div className="car-grid">
              {cars.length > 0 ? (
                cars.map((car) => (
                  <div
                    key={car.car_id}
                    className="car-card"
                    onClick={() => navigate(`/car-detail/${car.car_id}`)}
                  >
                    <div className="car-image-wrapper">
                      <img
                        src={car.image_link || carImage}
                        alt={car.model_name || car.modelnum || 'Car'}
                        className="car-image"
                        onError={handleImageError}
                      />
                      <div className="availability-badge">
                        {car.available ? 'Available' : 'Sold Out'}
                      </div>
                    </div>
                    <div className="car-details">
                      <h3 className="car-name">
                        {car.manufacturer} {car.model_name || car.modelnum}
                      </h3>
                      <p className="car-year">{car.year || 'N/A'}</p>
                      <p className="car-price">${car.price ? car.price.toLocaleString() : 'N/A'}</p>
                      <div className="car-specs">
                        <span>{car.engine_type || 'N/A'}</span>
                        <span>{car.transmission || 'N/A'}</span>
                        <span>{car.mileage ? `${car.mileage.toLocaleString()} mi` : 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-cars">No cars available in {categoryName}.</p>
              )}
            </div>
          )}
        </section>
        <Footer />
      </div>
      <style jsx>{`
        .page {
          background: linear-gradient(135deg, #000903ff, #000b05ff);
          color: #e5e7eb;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          font-family: 'Inter', sans-serif;
        }
        .car-list-section {
          padding: 4rem 2rem;
          max-width: 1200px;
          margin: 0 auto;
          text-align: center;
          flex: 1;
        }
        .car-list-title {
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 2rem;
          color: #ffffff;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          padding: 2rem;
        }
        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #22d3ee;
          border-top: 4px solid transparent;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .error-container {
          padding: 2rem;
          background: rgba(244, 63, 94, 0.1);
          border-radius: 0.5rem;
          margin: 2rem auto;
          max-width: 600px;
        }
        .error-message {
          font-size: 1.25rem;
          color: #f43f5e;
          font-weight: 500;
        }
        .car-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
          padding: 1rem;
        }
        .car-card {
          background: #1e293b;
          border-radius: 1rem;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          cursor: pointer;
          position: relative;
        }
        .car-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 8px 24px rgba(0, 255, 255, 0.3);
        }
        .car-image-wrapper {
          position: relative;
          width: 100%;
          height: 180px;
        }
        .car-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-top-left-radius: 1rem;
          border-top-right-radius: 1rem;
          transition: opacity 0.3s ease;
        }
        .car-card:hover .car-image {
          opacity: 0.9;
        }
        .availability-badge {
          position: absolute;
          top: 0.75rem;
          right: 0.75rem;
          background: #22d3ee;
          color: #1e293b;
          padding: 0.25rem 0.75rem;
          border-radius: 1rem;
          font-size: 0.875rem;
          font-weight: 600;
          text-transform: uppercase;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        .car-details {
          padding: 1rem;
          text-align: left;
        }
        .car-name {
          font-size: 1.25rem;
          font-weight: 700;
          color: #ffffff;
          margin: 0 0 0.5rem;
          line-height: 1.3;
        }
        .car-year {
          font-size: 0.875rem;
          color: #94a3b8;
          margin: 0 0 0.5rem;
        }
        .car-price {
          font-size: 1.125rem;
          font-weight: 600;
          color: #22d3ee;
          margin: 0 0 0.75rem;
        }
        .car-specs {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: #d1d5db;
        }
        .car-specs span {
          background: rgba(255, 255, 255, 0.1);
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
        }
        .no-cars {
          font-size: 1.25rem;
          color: #94a3b8;
          padding: 2rem;
          text-align: center;
        }
        @media (max-width: 768px) {
          .car-list-section {
            padding: 3rem 1rem;
          }
          .car-grid {
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          }
          .car-card {
            width: 100%;
          }
        }
        @media (max-width: 480px) {
          .car-list-title {
            font-size: 2rem;
          }
          .car-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
};

export default CarForMe;