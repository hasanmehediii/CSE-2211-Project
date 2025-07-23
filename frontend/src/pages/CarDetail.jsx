import React, { useEffect, useState, Component } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import carImage from '../assets/car2.jpg';

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
          <button onClick={() => window.location.href = '/'} className="back-button">
            Back to Home
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const CarDetail = () => {
  const { carId } = useParams();
  const navigate = useNavigate();
  const [carDetails, setCarDetails] = useState({
    name: 'Unknown Model',
    price: 'Price not listed',
    image: carImage,
    description: 'No description available.',
    year: 'N/A',
    rating: 0,
    quantity: 0,
    transmission: 'N/A',
    color: 'N/A',
    mileage: 'N/A',
    fuelCapacity: 'N/A',
    seatingCapacity: 'N/A',
  });
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCarData = async () => {
      try {
        if (!carId || isNaN(carId)) {
          setError('Invalid car ID. Please select a car from the homepage.');
          navigate('/');
          return;
        }

        console.log('Fetching car data for carId:', carId);
        const [carResponse, reviewsResponse] = await Promise.all([
          axios.get(`http://localhost:8000/cars/${carId}/details`).catch(err => {
            if (err.response?.status === 404) {
              throw new Error('Car not found. It may have been removed or doesn’t exist.');
            }
            throw new Error(`Car API error: ${err.response?.status} ${err.response?.data?.detail || err.message}`);
          }),
          axios.get(`http://localhost:8000/reviews/cars/${carId}/reviews`).catch(err => {
            if (err.response?.status === 404) {
              return { data: [] }; // Handle missing reviews gracefully
            }
            throw new Error(`Reviews API error: ${err.response?.status} ${err.response?.data?.detail || err.message}`);
          }),
        ]);

        console.log('Car Details Response:', carResponse.data);
        console.log('Reviews Response:', reviewsResponse.data);

        setCarDetails({
          name: carResponse.data.model_name || carResponse.data.modelnum || 'Unknown Model',
          price: carResponse.data.price ? `$${carResponse.data.price.toFixed(2)}` : 'Price not listed',
          image: carResponse.data.image_link || carImage,
          description: carResponse.data.description || 'No description available.',
          year: carResponse.data.year || 'N/A',
          rating: carResponse.data.rating || 0,
          quantity: carResponse.data.quantity ?? 0,
          transmission: carResponse.data.transmission || 'N/A',
          color: carResponse.data.color || 'N/A',
          mileage: carResponse.data.mileage ? `${carResponse.data.mileage} km` : 'N/A',
          fuelCapacity: carResponse.data.fuel_capacity ? `${carResponse.data.fuel_capacity.toFixed(2)} L` : 'N/A',
          seatingCapacity: carResponse.data.seating_capacity || 'N/A',
        });
        setReviews(
          reviewsResponse.data.map(review => ({
            username: review.username || 'Anonymous',
            review_text: review.review_text || 'No comment',
            rating: review.rating || 0,
          }))
        );
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message || 'Failed to fetch car details.');
      } finally {
        setLoading(false);
      }
    };

    fetchCarData();
  }, [carId, navigate]);

  const handleImageError = (e) => {
    e.target.src = carImage;
  };

  return (
    <ErrorBoundary>
      <div className="page">
        <Navbar />
        <div className="car-detail-container">
          {loading ? (
            <div className="loading">Loading car details...</div>
          ) : error ? (
            <div className="error-message">
              {error}
              <button onClick={() => navigate('/')} className="back-button">
                Back to Home
              </button>
            </div>
          ) : (
            <>
              <div className="car-detail-content">
                <div className="car-image-section">
                  <img
                    src={carDetails.image}
                    alt={carDetails.name}
                    className="car-image"
                    onError={handleImageError}
                  />
                </div>
                <div className="car-details-section">
                  <h1 className="car-title">{carDetails.name}</h1>
                  <p className="car-price">{carDetails.price}</p>
                  <div className="car-specs">
                    <div className="spec-item">
                      <span className="spec-icon">⚙️</span>
                      <span className="spec-label">Transmission:</span>
                      <span className="spec-value">{carDetails.transmission}</span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-icon">🎨</span>
                      <span className="spec-label">Color:</span>
                      <span className="spec-value">{carDetails.color}</span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-icon">🛣️</span>
                      <span className="spec-label">Mileage:</span>
                      <span className="spec-value">{carDetails.mileage}</span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-icon">⛽</span>
                      <span className="spec-label">Fuel Capacity:</span>
                      <span className="spec-value">{carDetails.fuelCapacity}</span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-icon">👥</span>
                      <span className="spec-label">Seating:</span>
                      <span className="spec-value">{carDetails.seatingCapacity}</span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-icon">📅</span>
                      <span className="spec-label">Year:</span>
                      <span className="spec-value">{carDetails.year}</span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-icon">📦</span>
                      <span className="spec-label">Stock:</span>
                      <span className="spec-value">{carDetails.quantity !== null ? carDetails.quantity : 'N/A'}</span>
                    </div>
                  </div>
                  <p className="car-description">{carDetails.description}</p>
                  {carDetails.rating > 0 && (
                    <p className="car-rating">
                      {'★'.repeat(Math.round(carDetails.rating))}{'☆'.repeat(5 - Math.round(carDetails.rating))}
                    </p>
                  )}
                </div>
              </div>
              <div className="reviews-section">
                <h2>Customer Reviews</h2>
                {reviews.length === 0 ? (
                  <p>No reviews available for this car.</p>
                ) : (
                  reviews.map((review, index) => (
                    <div key={index} className="review">
                      <p><strong>{review.username}</strong>: {review.review_text}</p>
                      <p>{'★'.repeat(Math.round(review.rating))}{'☆'.repeat(5 - Math.round(review.rating))}</p>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
        <Footer />
        <style jsx>{`
          .page {
            background: linear-gradient(135deg, #010715ff, #010a04ff);
            color: #ffffff;
            display: flex;
            flex-direction: column;
            font-family: 'Inter', sans-serif;
            margin: 0;
            overflow-x: hidden;
            padding-top: 60px;
            min-height: 100vh;
          }
          .car-detail-container {
            flex: 1;
            padding: 2rem;
            max-width: 1200px;
            margin: 0 auto;
            width: 100%;
          }
          .car-detail-content {
            display: flex;
            gap: 2rem;
            margin-bottom: 2rem;
          }
          .car-image-section {
            flex: 1;
            max-width: 50%;
          }
          .car-image {
            width: 100%;
            height: auto;
            object-fit: cover;
            border-radius: 1rem;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
          }
          .car-details-section {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }
          .car-title {
            font-size: 2.5rem;
            font-weight: 700;
            color: #ec4899;
            margin-bottom: 0.5rem;
          }
          .car-price {
            font-size: 1.8rem;
            font-weight: 600;
            color: #22d3ee;
            margin-bottom: 1rem;
          }
          .car-specs {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin-bottom: 1rem;
          }
          .spec-item {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            background: rgba(15, 23, 42, 0.95);
            padding: 0.75rem;
            border-radius: 0.5rem;
            font-size: 0.95rem;
          }
          .spec-icon {
            font-size: 1.2rem;
          }
          .spec-label {
            font-weight: 600;
            color: #d1d5db;
          }
          .spec-value {
            color: #facc15;
          }
          .car-description {
            font-size: 1rem;
            color: #d1d5db;
            line-height: 1.6;
          }
          .car-rating {
            font-size: 1.2rem;
            color: #facc15;
            margin-top: 0.5rem;
          }
          .reviews-section {
            margin-top: 2rem;
          }
          .reviews-section h2 {
            font-size: 1.8rem;
            font-weight: 700;
            color: #ec4899;
            margin-bottom: 1rem;
          }
          .review {
            background: rgba(15, 23, 42, 0.95);
            padding: 1rem;
            border-radius: 0.5rem;
            margin-bottom: 1rem;
          }
          .loading, .error-message {
            text-align: center;
            font-size: 1.2rem;
            color: #d1d5db;
            padding: 2rem;
          }
          .error-message {
            color: #f43f5e;
          }
          .back-button {
            margin-top: 1rem;
            padding: 0.5rem 1rem;
            background: #ec4899;
            color: #ffffff;
            border: none;
            border-radius: 0.5rem;
            cursor: pointer;
            font-size: 1rem;
            transition: background 0.3s;
          }
          .back-button:hover {
            background: #db2777;
          }
          @media (max-width: 768px) {
            .car-detail-content {
              flex-direction: column;
            }
            .car-image-section {
              max-width: 100%;
            }
            .car-title {
              font-size: 1.8rem;
            }
            .car-price {
              font-size: 1.4rem;
            }
            .car-specs {
              grid-template-columns: 1fr;
            }
            .spec-item {
              font-size: 0.9rem;
            }
            .car-description, .car-rating {
              font-size: 0.9rem;
            }
            .reviews-section h2 {
              font-size: 1.5rem;
            }
          }
        `}</style>
      </div>
    </ErrorBoundary>
  );
};

export default CarDetail;