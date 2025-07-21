import React, { useEffect, useState, Component } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import carImage from '../assets/car2.jpg';

// Error Boundary
class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-message">
          Something went wrong: {this.state.error?.message || 'Unknown error'}
        </div>
      );
    }
    return this.props.children;
  }
}

const CarDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const car = location.state;

  const [carDetails, setCarDetails] = useState(null);
  const [stock, setStock] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!car) {
      navigate('/');
      return;
    }

    const fetchCarData = async () => {
      try {
        const carId = car.car_id || car.id;
        const [carRes, stockRes, reviewRes] = await Promise.all([
          axios.get(`http://localhost:8000/cars/${carId}`),
          axios.get(`http://localhost:8000/cars/${carId}/inventory`),
          axios.get(`http://localhost:8000/cars/${carId}/reviews`)
        ]);

        setCarDetails(carRes.data);
        setStock(stockRes.data.quantity);
        setReviews(reviewRes.data.filter(r => r.is_visible));
      } catch (err) {
        setError(err.message || 'Failed to load car details.');
      } finally {
        setLoading(false);
      }
    };

    fetchCarData();
  }, [car]);

  const handleImageError = (e) => {
    e.target.src = carImage;
  };

  return (
    <ErrorBoundary>
      <div className="page">
        <Navbar />
        <div className="car-detail-container">
          {loading ? (
            <p className="loading">Loading...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : (
            <div className="detail-content">
              <div className="car-image-box">
                <img
                  src={carDetails.image_link || carImage}
                  alt={carDetails.model_name}
                  onError={handleImageError}
                  className="car-image"
                />
              </div>
              <div className="car-info">
                <h1 className="car-title">{carDetails.model_name}</h1>
                <p className="car-price">${carDetails.price?.toFixed(2)}</p>
                <p className="car-description">{carDetails.description || 'No description available.'}</p>
                <ul className="info-list">
                  <li><strong>Release Date:</strong> {carDetails.release_date || 'N/A'}</li>
                  <li><strong>Stock Available:</strong> {stock ?? 'N/A'} units</li>
                </ul>
              </div>
            </div>
          )}

          <div className="reviews-section">
            <h2 className="section-title">User Reviews</h2>
            {reviews.length > 0 ? (
              reviews.map((r, idx) => (
                <div key={idx} className="review-box">
                  <p className="review-text">"{r.review_text}"</p>
                  <p className="review-user">- {r.username} {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</p>
                </div>
              ))
            ) : (
              <p className="no-reviews">No reviews available.</p>
            )}
          </div>
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
        .car-detail-container {
          flex: 1;
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        .loading, .error-message {
          text-align: center;
          margin-top: 2rem;
          font-size: 1.2rem;
        }
        .error-message {
          color: #f43f5e;
        }
        .detail-content {
          display: flex;
          gap: 2rem;
          flex-wrap: wrap;
          margin-bottom: 2rem;
        }
        .car-image-box {
          flex: 1 1 40%;
        }
        .car-image {
          width: 100%;
          border-radius: 1rem;
          object-fit: cover;
          box-shadow: 0 8px 16px rgba(3, 132, 98, 0.48);
        }
        .car-info {
          flex: 1 1 50%;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .car-title {
          font-size: 2.5rem;
          font-weight: bold;
          color: #ffffff;
          text-transform: uppercase;
          text-shadow: 0 3px 6px rgba(0, 0, 0, 0.5);
        }
        .car-price {
          font-size: 1.8rem;
          color: #22d3ee;
        }
        .car-description {
          font-size: 1rem;
          color: #d1d5db;
        }
        .info-list {
          list-style: none;
          padding: 0;
          font-size: 1rem;
          color: #d1d5db;
        }
        .info-list li {
          margin-bottom: 0.5rem;
        }
        .reviews-section {
          margin-top: 3rem;
        }
        .section-title {
          font-size: 1.8rem;
          margin-bottom: 1rem;
          color: #ec4899;
        }
        .review-box {
          background: rgba(15, 23, 42, 0.95);
          padding: 1rem;
          border-radius: 0.75rem;
          margin-bottom: 1rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
        }
        .review-text {
          font-size: 1rem;
          font-style: italic;
          margin-bottom: 0.5rem;
        }
        .review-user {
          font-size: 0.9rem;
          color: #facc15;
        }
        .no-reviews {
          color: #d1d5db;
          text-align: center;
          font-size: 1rem;
        }

        @media (max-width: 768px) {
          .detail-content {
            flex-direction: column;
          }
          .car-title {
            font-size: 2rem;
          }
          .car-price {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </ErrorBoundary>
  );
};

export default CarDetail;
