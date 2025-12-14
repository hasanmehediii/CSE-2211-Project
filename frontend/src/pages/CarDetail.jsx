import React, { useEffect, useState, useContext, Component } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext.jsx';
import { CartContext } from '../context/CartContext.jsx';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import carImage from '../assets/car2.jpg';
import api from '../api.jsx';
import { FaStar } from 'react-icons/fa';

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

const getCarImage = (manufacturer) => {
  if (!manufacturer) return carImage;
  const images = {
    'audi': '/images/audi.jpg',
    'bmw': '/images/bmw.jpg',
    'ferrari': '/images/ferrari.jpg',
    'lamborghini': '/images/lamborghini.jpg',
    'mercedes': '/images/mercedes.jpg',
    'mustang': '/images/mustang.jpg',
    'tesla': '/images/tesla.jpg',
  };
  const lowerCaseManufacturer = manufacturer.toLowerCase();
  for (const key in images) {
    if (lowerCaseManufacturer.includes(key)) {
      return images[key];
    }
  }
  return carImage; // default image
};

const CarDetail = () => {
  const { carId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
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
    available: false,
  });
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [purchaseIdForReview, setPurchaseIdForReview] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');

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
          api.get(`/cars/${carId}/details`).catch(err => {
            if (err.response?.status === 404) {
              throw new Error('Car not found. It may have been removed or doesn’t exist.');
            }
            throw new Error(`Car API error: ${err.response?.status} ${err.response?.data?.detail || err.message}`);
          }),
          api.get(`/reviews/cars/${carId}/reviews`).catch(err => {
            if (err.response?.status === 404) {
              return { data: [] }; // Handle missing reviews gracefully
            }
            throw new Error(`Reviews API error: ${err.response?.status} ${err.response?.data?.detail || err.message}`);
          }),
        ]);

        console.log('Car Details Response:', carResponse.data);
        console.log('Reviews Response:', reviewsResponse.data);

        const carImageResult = getCarImage(carResponse.data.manufacturer);

        setCarDetails({
          car_id: carResponse.data.car_id,
          name: carResponse.data.model_name || carResponse.data.modelnum || 'Unknown Model',
          price: carResponse.data.price ? `${carResponse.data.price.toFixed(2)}` : 'Price not listed',
          image: carResponse.data.image_link || carImageResult,
          description: carResponse.data.description || 'No description available.',
          year: carResponse.data.year || 'N/A',
          rating: carResponse.data.rating || 0,
          quantity: carResponse.data.quantity ?? 0,
          transmission: carResponse.data.transmission || 'N/A',
          color: carResponse.data.color || 'N/A',
          mileage: carResponse.data.mileage ? `${carResponse.data.mileage} km` : 'N/A',
          fuelCapacity: carResponse.data.fuel_capacity ? `${carResponse.data.fuel_capacity.toFixed(2)} L` : 'N/A',
          seatingCapacity: carResponse.data.seating_capacity || 'N/A',
          available: carResponse.data.quantity > 0,
        });
        setReviews(
          reviewsResponse.data.map(review => ({
            username: review.username || 'Anonymous',
            review_text: review.review_text || 'No comment',
            rating: review.rating || 0,
          }))
        );

        if (user) {
          const purchaseResponse = await api.get(`/users/${user.user_id}/purchase-for-car/${carId}`);
          setPurchaseIdForReview(purchaseResponse.data.purchase_id);
        }

      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message || 'Failed to fetch car details.');
      } finally {
        setLoading(false);
      }
    };

    fetchCarData();
  }, [carId, navigate, user]);

  const handleImageError = (e) => {
    e.target.src = carImage;
  };

  const handleAddToCart = () => {
    console.log('carDetails state on Add to Cart click:', carDetails);
    if (!user) {
      navigate('/login');
      return;
    }
    if (!carDetails.available) {
      setError('This car is currently unavailable or out of stock.');
      return;
    }
    const result = addToCart({ ...carDetails, maxQuantity: carDetails.quantity });
    console.log('Add to Cart result:', result);
    navigate(`/car-purchase/${carId}`, { state: { carDetails } });
  };

  const handleReviewSubmit = async () => {
    if (rating === 0) {
      setError('Please select a rating.');
      return;
    }
    try {
      await api.post('/reviews/', {
        purchase_id: purchaseIdForReview,
        car_id: carId,
        user_id: user.user_id,
        rating: rating,
        review_text: reviewText,
      });
      setShowReviewForm(false);
      // Refresh reviews
      const reviewsResponse = await api.get(`/reviews/cars/${carId}/reviews`);
      setReviews(
        reviewsResponse.data.map((review) => ({
          username: review.username || 'Anonymous',
          review_text: review.review_text || 'No comment',
          rating: review.rating || 0,
        }))
      );
    } catch (error) {
      console.error('Error submitting review:', error);
      setError('Failed to submit review.');
    }
  };

  return (
    <ErrorBoundary>
      <div className="page">
        <Navbar />
        <section className="car-detail-section">
          {loading ? (
            <div className="message loading">Loading car details...</div>
          ) : error ? (
            <div className="message error-message">
              {error}
              <button onClick={() => navigate('/')} className="back-button ghost">
                Back to Home
              </button>
            </div>
          ) : (
            <>
              <div className="car-detail-content">
                <div className="car-image-wrapper">
                  <img
                    src={carDetails.image}
                    alt={carDetails.name}
                    className="car-image"
                    onError={handleImageError}
                  />
                  <div className="car-glow" />
                </div>
                <div className="car-details-section">
                  <div className="car-pill">Goriber Gari • Car Details</div>
                  <h1 className="car-title">
                    {carDetails.name} <span className="accent">{carDetails.year}</span>
                  </h1>
                  <p className="car-subtitle">
                    {carDetails.description}
                  </p>
                  <p className="car-price">${carDetails.price}</p>
                  {carDetails.rating > 0 && (
                    <p className="car-rating">
                      {'★'.repeat(Math.round(carDetails.rating))}{'☆'.repeat(5 - Math.round(carDetails.rating))}
                    </p>
                  )}
                  <div className="car-specs">
                    <div className="spec-item">
                      <span className="spec-label">Transmission</span>
                      <span className="spec-value">{carDetails.transmission}</span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-label">Color</span>
                      <span className="spec-value">{carDetails.color}</span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-label">Mileage</span>
                      <span className="spec-value">{carDetails.mileage}</span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-label">Fuel Capacity</span>
                      <span className="spec-value">{carDetails.fuelCapacity}</span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-label">Seating</span>
                      <span className="spec-value">{carDetails.seatingCapacity}</span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-label">Stock</span>
                      <span className="spec-value">{carDetails.quantity !== null ? carDetails.quantity : 'N/A'}</span>
                    </div>
                  </div>
                  <button onClick={handleAddToCart} className="add-to-cart-button primary" disabled={!carDetails.available}>
                    {carDetails.available ? 'Add to Cart' : 'Out of Stock'}
                  </button>
                </div>
              </div>
              <div className="reviews-section">
                <h2 className="reviews-title">Customer Reviews</h2>
                {reviews.length === 0 ? (
                  <div className="message no-data">No reviews available for this car yet.</div>
                ) : (
                  reviews.map((review, index) => (
                    <article key={index} className="review-card">
                      <div className="review-header">
                        <h3 className="review-name">{review.username}</h3>
                        <span className="review-rating">
                          {'★'.repeat(Math.round(review.rating))}{'☆'.repeat(5 - Math.round(review.rating))}
                        </span>
                      </div>
                      <p className="review-text">{review.review_text}</p>
                    </article>
                  ))
                )}
                {purchaseIdForReview && !showReviewForm && (
                  <button onClick={() => setShowReviewForm(true)} className="write-review-button primary">Write a Review</button>
                )}
                {showReviewForm && (
                  <div className="review-form">
                    <h2 className="form-title">Write a Review</h2>
                    <div className="rating">
                      {[...Array(5)].map((_, index) => (
                        <FaStar
                          key={index}
                          className={index < rating ? 'star selected' : 'star'}
                          onClick={() => setRating(index + 1)}
                        />
                      ))}
                    </div>
                    <textarea
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder="Write your review here..."
                      className="review-textarea"
                    />
                    <button onClick={handleReviewSubmit} className="submit-review-button primary">Submit Review</button>
                  </div>
                )}
              </div>
            </>
          )}
        </section>
        <Footer />
      </div>
      <style jsx>{`
        :root {
          --bg: #020617;
          --card-bg: rgba(15, 23, 42, 0.96);
          --card-border: rgba(148, 163, 184, 0.35);
          --accent: #22d3ee;
          --accent-strong: #e11d48;
          --text-main: #e5e7eb;
          --text-muted: #9ca3af;
        }

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          background: var(--bg);
          color: var(--text-main);
          font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .page {
          min-height: 100vh;
          background:
            radial-gradient(circle at top left, rgba(56, 189, 248, 0.15), transparent 55%),
            radial-gradient(circle at bottom right, rgba(244, 63, 94, 0.22), transparent 60%),
            var(--bg);
          color: #ffffff;
          display: flex;
          flex-direction: column;
          font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
          overflow-x: hidden;
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .car-detail-section {
          width: 100%;
          padding: 8rem clamp(1.5rem, 6vw, 4rem) 3.4rem;
        }

        .car-detail-content {
          max-width: 1120px;
          margin: 0 auto 3.6rem;
          display: flex;
          gap: 2rem;
          animation: fadeUp 0.6s ease-out;
        }

        .car-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.25rem 1rem;
          border-radius: 999px;
          font-size: 0.8rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          background: rgba(15, 23, 42, 0.85);
          border: 1px solid rgba(148, 163, 184, 0.7);
          color: var(--text-muted);
          backdrop-filter: blur(18px);
        }

        .car-title {
          font-size: clamp(2.5rem, 4.8vw, 3.4rem);
          line-height: 1.08;
          font-weight: 800;
          letter-spacing: 0.02em;
          color: #f9fafb;
        }

        .car-title .accent {
          background: linear-gradient(120deg, var(--accent), var(--accent-strong));
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .car-subtitle {
          font-size: 0.96rem;
          color: var(--text-muted);
          max-width: 520px;
          margin-bottom: 1rem;
        }

        .car-image-wrapper {
          position: relative;
          overflow: hidden;
          border-radius: 1.2rem;
          box-shadow: 0 18px 48px rgba(15, 23, 42, 0.98);
          max-width: 50%;
        }

        .car-image {
          width: 100%;
          height: auto;
          object-fit: cover;
          transform: scale(1.04);
          transition: transform 0.4s ease;
        }

        .car-image-wrapper:hover .car-image {
          transform: scale(1.11);
        }

        .car-glow {
          position: absolute;
          inset: auto 0 -35%;
          height: 65%;
          background: radial-gradient(circle at 50% 0, rgba(56, 189, 248, 0.22), transparent 65%);
          opacity: 0.8;
          transition: opacity 0.3s ease;
        }

        .car-details-section {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 1.3rem;
        }

        .car-price {
          font-size: 1.8rem;
          font-weight: 600;
          color: var(--accent);
        }

        .car-rating {
          font-size: 1.2rem;
          color: #facc15;
        }

        .car-specs {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
        }

        .spec-item {
          background: rgba(15, 23, 42, 0.85);
          padding: 0.75rem;
          border-radius: 0.5rem;
          border: 1px solid var(--card-border);
        }

        .spec-label {
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        .spec-value {
          font-size: 1rem;
          font-weight: 600;
          color: #f9fafb;
        }

        .add-to-cart-button {
          padding: 0.75rem 1.6rem;
          border-radius: 999px;
          border: none;
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease, border 0.2s ease;
          white-space: nowrap;
          width: fit-content;
        }

        .add-to-cart-button.primary {
          background: linear-gradient(to right, var(--accent-strong), #f97316);
          color: #f9fafb;
          box-shadow: 0 20px 45px rgba(248, 113, 113, 0.65);
        }

        .add-to-cart-button.primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 26px 60px rgba(248, 113, 113, 0.75);
        }

        .add-to-cart-button:disabled {
          background: rgba(148, 163, 184, 0.7);
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .reviews-section {
          max-width: 1120px;
          margin: 0 auto;
        }

        .reviews-title {
          font-size: 1.45rem;
          font-weight: 700;
          color: #f9fafb;
          margin-bottom: 1rem;
        }

        .review-card {
          background: radial-gradient(circle at top left, rgba(56, 189, 248, 0.16), transparent 60%),
            var(--card-bg);
          border-radius: 1.2rem;
          border: 1px solid var(--card-border);
          box-shadow: 0 18px 48px rgba(15, 23, 42, 0.98);
          padding: 1rem;
          margin-bottom: 1.2rem;
        }

        .review-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .review-name {
          font-size: 1rem;
          font-weight: 600;
          color: #f9fafb;
        }

        .review-rating {
          font-size: 0.9rem;
          color: #facc15;
        }

        .review-text {
          font-size: 0.92rem;
          color: var(--text-muted);
        }

        .write-review-button {
          padding: 0.75rem 1.6rem;
          border-radius: 999px;
          border: none;
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease, border 0.2s ease;
          white-space: nowrap;
          background: linear-gradient(to right, var(--accent-strong), #f97316);
          color: #f9fafb;
          box-shadow: 0 20px 45px rgba(248, 113, 113, 0.65);
        }

        .write-review-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 26px 60px rgba(248, 113, 113, 0.75);
        }

        .review-form {
          background: var(--card-bg);
          padding: 1.5rem;
          border-radius: 1.2rem;
          border: 1px solid var(--card-border);
          box-shadow: 0 18px 48px rgba(15, 23, 42, 0.98);
          margin-top: 1.5rem;
        }

        .form-title {
          font-size: 1.2rem;
          font-weight: 700;
          color: #f9fafb;
          margin-bottom: 1rem;
        }

        .rating {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .star {
          font-size: 1.5rem;
          color: var(--text-muted);
          cursor: pointer;
          transition: color 0.2s ease;
        }

        .star.selected {
          color: #facc15;
        }

        .review-textarea {
          width: 100%;
          min-height: 100px;
          padding: 0.75rem 1rem;
          font-size: 0.9rem;
          border: none;
          border-radius: 0.5rem;
          background: rgba(15, 23, 42, 0.85);
          color: #f9fafb;
          outline: none;
          border: 1px solid rgba(148, 163, 184, 0.7);
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
          margin-bottom: 1rem;
        }

        .review-textarea:focus {
          border-color: var(--accent);
          box-shadow: 0 0 0 2px rgba(34, 211, 238, 0.3);
        }

        .submit-review-button {
          padding: 0.75rem 1.6rem;
          border-radius: 999px;
          border: none;
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease, border 0.2s ease;
          white-space: nowrap;
          background: linear-gradient(to right, var(--accent-strong), #f97316);
          color: #f9fafb;
          box-shadow: 0 20px 45px rgba(248, 113, 113, 0.65);
        }

        .submit-review-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 26px 60px rgba(248, 113, 113, 0.75);
        }

        .back-button {
          padding: 0.75rem 1.6rem;
          border-radius: 999px;
          border: none;
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease, border 0.2s ease;
          white-space: nowrap;
          margin-top: 1rem;
        }

        .back-button.ghost {
          background: rgba(15, 23, 42, 0.85);
          border: 1px solid rgba(148, 163, 184, 0.9);
          color: var(--text-main);
        }

        .back-button.ghost:hover {
          background: rgba(15, 23, 42, 1);
          transform: translateY(-1px);
        }

        .message {
          text-align: center;
          font-size: 0.95rem;
          padding: 1.5rem 1rem;
          border-radius: 0.9rem;
          margin-bottom: 2rem;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .loading {
          color: var(--text-muted);
          background: rgba(15, 23, 42, 0.8);
          border: 1px dashed rgba(148, 163, 184, 0.5);
        }

        .error-message {
          color: #fecaca;
          background: rgba(127, 29, 29, 0.65);
          border: 1px solid rgba(248, 113, 113, 0.85);
        }

        .no-data {
          color: var(--text-muted);
          background: rgba(15, 23, 42, 0.8);
          border: 1px dashed rgba(148, 163, 184, 0.5);
        }

        /* RESPONSIVE */

        @media (max-width: 900px) {
          .car-detail-section {
            padding: 1.8rem 1.4rem 1.3rem;
          }

          .car-detail-content {
            flex-direction: column;
          }

          .car-image-wrapper {
            max-width: 100%;
          }
        }

        @media (max-width: 768px) {
          .car-detail-section {
            padding: 1.6rem 1.1rem 1.1rem;
          }

          .car-title {
            font-size: 2.2rem;
          }

          .car-subtitle {
            font-size: 0.9rem;
          }

          .car-price {
            font-size: 1.5rem;
          }

          .car-specs {
            grid-template-columns: 1fr;
          }

          .spec-item {
            padding: 0.6rem;
            font-size: 0.85rem;
          }

          .add-to-cart-button {
            width: 100%;
          }

          .reviews-title {
            font-size: 1.2rem;
          }

          .review-card {
            padding: 0.9rem;
          }

          .review-name {
            font-size: 0.95rem;
          }

          .review-text {
            font-size: 0.85rem;
          }

          .review-form {
            padding: 1.2rem;
          }

          .form-title {
            font-size: 1.1rem;
          }

          .rating .star {
            font-size: 1.2rem;
          }

          .review-textarea {
            font-size: 0.85rem;
          }

          .submit-review-button {
            width: 100%;
          }
        }

        @media (max-width: 480px) {
          .car-title {
            font-size: 1.9rem;
          }

          .car-subtitle {
            font-size: 0.84rem;
          }

          .car-price {
            font-size: 1.3rem;
          }

          .spec-item {
            font-size: 0.8rem;
          }

          .add-to-cart-button {
            padding: 0.6rem 1.3rem;
            font-size: 0.85rem;
          }

          .reviews-title {
            font-size: 1.1rem;
          }

          .review-card {
            padding: 0.8rem;
          }

          .review-name {
            font-size: 0.9rem;
          }

          .review-text {
            font-size: 0.8rem;
          }

          .review-form {
            padding: 1rem;
          }

          .form-title {
            font-size: 1rem;
          }

          .rating .star {
            font-size: 1.1rem;
          }

          .review-textarea {
            font-size: 0.8rem;
          }

          .submit-review-button {
            padding: 0.6rem 1.3rem;
            font-size: 0.85rem;
          }
        }
      `}</style>
    </ErrorBoundary>
  );
};

export default CarDetail;