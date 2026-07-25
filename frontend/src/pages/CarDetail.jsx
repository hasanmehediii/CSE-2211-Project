import React, { Component, useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  FaArrowLeft,
  FaArrowRight,
  FaCarSide,
  FaCheckCircle,
  FaCouch,
  FaGasPump,
  FaPalette,
  FaPen,
  FaQuoteLeft,
  FaRegStar,
  FaRoad,
  FaShoppingBag,
  FaStar,
} from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext.jsx';
import { CartContext } from '../context/CartContext.jsx';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import carImage from '../assets/car2.jpg';
import api from '../api.jsx';
import './CarDetail.css';

class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="car-detail-fallback">
          <span>Something went off course.</span>
          <h1>We could not display this car.</h1>
          <a href="/">Return to the showroom</a>
        </div>
      );
    }
    return this.props.children;
  }
}

const getCarImage = (manufacturer) => {
  if (!manufacturer) return carImage;
  const images = {
    audi: '/images/audi.jpg',
    bmw: '/images/bmw.jpg',
    ferrari: '/images/ferrari.jpg',
    lamborghini: '/images/lamborghini.jpg',
    mercedes: '/images/mercedes.jpg',
    mustang: '/images/mustang.jpg',
    tesla: '/images/tesla.jpg',
  };
  const name = manufacturer.toLowerCase();
  const match = Object.keys(images).find((brand) => name.includes(brand));
  return match ? images[match] : carImage;
};

const formatMoney = (value) => {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return 'Price on request';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
};

const clampRating = (value) => Math.min(5, Math.max(0, Math.round(Number(value) || 0)));

const Stars = ({ value }) => (
  <span className="detail-stars" aria-label={`${clampRating(value)} out of 5 stars`}>
    {[1, 2, 3, 4, 5].map((star) => (
      star <= clampRating(value) ? <FaStar key={star} /> : <FaRegStar key={star} />
    ))}
  </span>
);

const CarDetail = () => {
  const { carId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  const [carDetails, setCarDetails] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fatalError, setFatalError] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [purchaseIdForReview, setPurchaseIdForReview] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');

  useEffect(() => {
    const fetchCarData = async () => {
      if (!carId || Number.isNaN(Number(carId))) {
        setFatalError('This car link is not valid.');
        setLoading(false);
        return;
      }

      try {
        const [carResponse, reviewsResponse] = await Promise.all([
          api.get(`/cars/${carId}/details`),
          api.get(`/reviews/cars/${carId}/reviews`).catch((error) => {
            if (error.response?.status === 404) return { data: [] };
            throw error;
          }),
        ]);
        const data = carResponse.data;
        const quantity = Number(data.quantity) || 0;

        setCarDetails({
          car_id: data.car_id,
          name: data.model_name || data.modelnum || 'Unknown model',
          manufacturer: data.manufacturer || 'Goriber Gari selection',
          price: Number(data.price),
          image: data.image_link || getCarImage(data.manufacturer),
          description: data.description || 'A carefully selected car ready for its next journey.',
          year: data.year || '—',
          rating: Number(data.rating) || 0,
          quantity,
          transmission: data.transmission || 'Not listed',
          color: data.color || 'Not listed',
          mileage: data.mileage ? `${Number(data.mileage).toLocaleString()} km` : 'Not listed',
          fuelCapacity: data.fuel_capacity ? `${Number(data.fuel_capacity).toFixed(1)} L` : 'Not listed',
          seatingCapacity: data.seating_capacity || 'Not listed',
          available: quantity > 0,
        });
        setReviews(reviewsResponse.data.map((review) => ({
          username: review.username || 'Anonymous driver',
          review_text: review.review_text || 'No written comment.',
          rating: Number(review.rating) || 0,
        })));

        if (user) {
          try {
            const purchaseResponse = await api.get(
              `/users/${user.user_id}/purchase-for-car/${carId}`
            );
            setPurchaseIdForReview(purchaseResponse.data.purchase_id);
          } catch (purchaseError) {
            if (purchaseError.response?.status !== 404) {
              console.error('Could not check review eligibility:', purchaseError);
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch car details:', error);
        setFatalError(
          error.response?.status === 404
            ? 'This car is no longer available in our showroom.'
            : 'We could not load this car right now. Please try again shortly.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCarData();
  }, [carId, user]);

  const handleAddToCart = () => {
    setActionMessage('');
    if (!user) {
      navigate('/login');
      return;
    }
    if (!carDetails.available) {
      setActionMessage('This car is currently out of stock.');
      return;
    }
    addToCart({ ...carDetails, maxQuantity: carDetails.quantity });
    navigate(`/car-purchase/${carId}`, { state: { carDetails } });
  };

  const handleReviewSubmit = async () => {
    if (!rating) {
      setActionMessage('Select a star rating before submitting your review.');
      return;
    }
    try {
      await api.post('/reviews/', {
        purchase_id: purchaseIdForReview,
        car_id: carId,
        user_id: user.user_id,
        rating,
        review_text: reviewText,
      });
      const response = await api.get(`/reviews/cars/${carId}/reviews`);
      setReviews(response.data.map((review) => ({
        username: review.username || 'Anonymous driver',
        review_text: review.review_text || 'No written comment.',
        rating: Number(review.rating) || 0,
      })));
      setShowReviewForm(false);
      setRating(0);
      setReviewText('');
      setActionMessage('');
    } catch (error) {
      console.error('Error submitting review:', error);
      setActionMessage('Your review could not be submitted. Please try again.');
    }
  };

  const specs = carDetails ? [
    { icon: FaCarSide, label: 'Transmission', value: carDetails.transmission },
    { icon: FaPalette, label: 'Colour', value: carDetails.color },
    { icon: FaRoad, label: 'Mileage', value: carDetails.mileage },
    { icon: FaGasPump, label: 'Fuel capacity', value: carDetails.fuelCapacity },
    { icon: FaCouch, label: 'Seating', value: carDetails.seatingCapacity },
  ] : [];

  return (
    <ErrorBoundary>
      <div className="car-detail-page">
        <Navbar />

        <main className="car-detail-main">
          {loading && (
            <div className="detail-loading" aria-label="Loading car details">
              <div />
              <div>
                <span />
                <span />
                <span />
              </div>
            </div>
          )}

          {!loading && fatalError && (
            <section className="detail-error">
              <span>Unable to continue</span>
              <h1>{fatalError}</h1>
              <button onClick={() => navigate('/')}>
                <FaArrowLeft /> Return to the showroom
              </button>
            </section>
          )}

          {!loading && carDetails && (
            <>
              <div className="detail-container detail-breadcrumb">
                <button onClick={() => navigate('/')}>
                  <FaArrowLeft /> Showroom
                </button>
                <span>/</span>
                <span>{carDetails.name}</span>
              </div>

              <section className="detail-container detail-hero">
                <div className="detail-media">
                  <img
                    src={carDetails.image}
                    alt={carDetails.name}
                    onError={(event) => { event.currentTarget.src = carImage; }}
                  />
                  <div className="detail-media__shade" />
                  <span className={`detail-availability ${carDetails.available ? 'is-available' : ''}`}>
                    <i />
                    {carDetails.available ? 'Available now' : 'Currently unavailable'}
                  </span>
                  <span className="detail-year">{carDetails.year}</span>
                </div>

                <div className="detail-summary">
                  <div className="detail-summary__eyebrow">
                    <span>{carDetails.manufacturer}</span>
                    {carDetails.rating > 0 && (
                      <div><Stars value={carDetails.rating} /><small>{carDetails.rating.toFixed(1)}</small></div>
                    )}
                  </div>
                  <h1>{carDetails.name}</h1>
                  <p className="detail-description">{carDetails.description}</p>

                  <div className="detail-price">
                    <span>Showroom price</span>
                    <strong>{formatMoney(carDetails.price)}</strong>
                  </div>

                  <div className="detail-purchase">
                    <button
                      className="detail-buy-button"
                      onClick={handleAddToCart}
                      disabled={!carDetails.available}
                    >
                      <FaShoppingBag />
                      {carDetails.available ? 'Continue to purchase' : 'Out of stock'}
                      {carDetails.available && <FaArrowRight />}
                    </button>
                    <div className="detail-stock">
                      <FaCheckCircle />
                      <span>
                        <strong>{carDetails.quantity} in stock</strong>
                        Secure checkout after sign in
                      </span>
                    </div>
                  </div>
                  {actionMessage && <p className="detail-action-message" role="alert">{actionMessage}</p>}
                </div>
              </section>

              <section className="detail-container detail-specs">
                <div className="detail-section-heading">
                  <span>At a glance</span>
                  <h2>Everything that matters.</h2>
                </div>
                <div className="detail-spec-grid">
                  {specs.map((spec) => (
                    <div className="detail-spec" key={spec.label}>
                      {React.createElement(spec.icon)}
                      <span>{spec.label}</span>
                      <strong>{spec.value}</strong>
                    </div>
                  ))}
                </div>
              </section>

              <section className="detail-reviews">
                <div className="detail-container">
                  <div className="detail-reviews__header">
                    <div className="detail-section-heading">
                      <span>Owner stories</span>
                      <h2>What drivers say.</h2>
                    </div>
                    {purchaseIdForReview && !showReviewForm && (
                      <button className="detail-write-button" onClick={() => setShowReviewForm(true)}>
                        <FaPen /> Write a review
                      </button>
                    )}
                  </div>

                  {showReviewForm && (
                    <div className="detail-review-form">
                      <div>
                        <span>Share your experience</span>
                        <h3>How was your drive?</h3>
                      </div>
                      <div className="detail-rating-input" aria-label="Select rating">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            className={star <= rating ? 'is-selected' : ''}
                            onClick={() => setRating(star)}
                            aria-label={`${star} star${star > 1 ? 's' : ''}`}
                          >
                            <FaStar />
                          </button>
                        ))}
                      </div>
                      <textarea
                        value={reviewText}
                        onChange={(event) => setReviewText(event.target.value)}
                        placeholder="Tell other drivers what stood out..."
                      />
                      <div className="detail-review-form__actions">
                        <button onClick={() => setShowReviewForm(false)}>Cancel</button>
                        <button onClick={handleReviewSubmit}>Publish review <FaArrowRight /></button>
                      </div>
                    </div>
                  )}

                  {reviews.length ? (
                    <div className="detail-review-grid">
                      {reviews.map((review, index) => (
                        <article className="detail-review-card" key={`${review.username}-${index}`}>
                          <FaQuoteLeft className="detail-quote" />
                          <Stars value={review.rating} />
                          <p>{review.review_text}</p>
                          <footer>
                            <span>{review.username.charAt(0).toUpperCase()}</span>
                            <div>
                              <strong>{review.username}</strong>
                              <small>Verified owner</small>
                            </div>
                          </footer>
                        </article>
                      ))}
                    </div>
                  ) : (
                    <div className="detail-no-reviews">
                      <FaQuoteLeft />
                      <div>
                        <strong>No reviews yet</strong>
                        <span>Be the first owner to share a story about this car.</span>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            </>
          )}
        </main>

        <Footer />
      </div>
    </ErrorBoundary>
  );
};

export default CarDetail;
