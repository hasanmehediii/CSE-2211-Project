import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import carImage from '../assets/car2.jpg';

const CarDetail = () => {
  const { carId } = useParams();  // Get carId from URL
  const navigate = useNavigate();

  const [carDetails, setCarDetails] = useState(null);
  const [inventory, setInventory] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch car data when component mounts or carId changes
  useEffect(() => {
    if (!carId) {
      navigate('/');  // Redirect to home if no carId is available
      return;
    }

    const fetchCarData = async () => {
      try {
        const [carRes, inventoryRes, reviewRes] = await Promise.all([
          axios.get(`http://localhost:8000/cars/${carId}`),
          axios.get(`http://localhost:8000/cars/${carId}/inventory`),
          axios.get(`http://localhost:8000/cars/${carId}/reviews`)
        ]);

        setCarDetails(carRes.data);
        setInventory(inventoryRes.data);  // Set inventory data
        setReviews(reviewRes.data.filter(r => r.is_visible)); // Set visible reviews
      } catch (err) {
        setError(err.message || 'Failed to load car details.');
      } finally {
        setLoading(false);
      }
    };

    fetchCarData();
  }, [carId, navigate]);  // Dependency on carId

  const handleImageError = (e) => {
    e.target.src = carImage;  // Fallback to default image if car image fails to load
  };

  return (
    <div className="page">
      <Navbar />
      
      {/* Loading or Error message */}
      {loading ? (
        <p className="loading">Loading...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <>
          {/* Car Details Section */}
          <div className="car-detail-container">
            <div className="car-image-box">
              <img
                src={carDetails?.image_link || carImage}
                alt={carDetails?.model_name}
                onError={handleImageError}
                className="car-image"
              />
            </div>
            <div className="car-info">
              <h1 className="car-title">{carDetails?.model_name}</h1>
              <p className="car-price">${carDetails?.price?.toFixed(2)}</p>
              <p className="car-description">{carDetails?.description || 'No description available.'}</p>
              <ul className="info-list">
                <li><strong>Release Date:</strong> {carDetails?.release_date || 'N/A'}</li>
                <li><strong>Stock Available:</strong> {inventory?.quantity ?? 'N/A'} units</li>
              </ul>
            </div>
          </div>

          {/* Inventory Section */}
          <div className="inventory-section">
            <h2>Inventory</h2>
            {inventory ? (
              <div>{inventory.quantity} units available</div>
            ) : (
              <p>No inventory information available</p>
            )}
          </div>

          {/* User Reviews Section */}
          <div className="reviews-section">
            <h2>User Reviews</h2>
            {reviews.length > 0 ? (
              reviews.map((r, idx) => (
                <div key={idx} className="review-box">
                  <p className="review-text">"{r.review_text}"</p>
                  <p className="review-user">- {r.username} {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</p>
                </div>
              ))
            ) : (
              <p>No reviews available.</p>
            )}
          </div>
        </>
      )}

      <Footer />
    </div>
  );
};

export default CarDetail;
