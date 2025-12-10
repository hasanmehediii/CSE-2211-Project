import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import carImage from '../assets/3.jpg';
import api from '../api.jsx';
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
          api.get('/cars/top-rated'),
          api.get('/cars/new-arrivals'),
          api.get('/cars/budget-friendly'),
        ]);

        const formattedData = [
          {
            category: 'Top Class',
            subtitle: 'Hand-picked premium rides with top ratings.',
            cars: topRated.data.map((car) => ({
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
            subtitle: 'Recently added, be the first to own them.',
            cars: newArrivals.data.map((car) => ({
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
            subtitle: 'Smart choices that save your wallet.',
            cars: budgetFriendly.data.map((car) => ({
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
      } catch (err) {
        console.error('Failed to fetch car data:', err);
        setError('Failed to load cars. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  const handleCardClick = (car) => {
    if (car && car.car_id) {
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
      scrollContainer.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = (index) => {
    const scrollContainer = scrollRefs.current[index];
    if (scrollContainer) {
      scrollContainer.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  const scrollToCars = () => {
    const el = document.getElementById('car-categories');
    if (el) {
      const offset = 80; // navbar height offset
      const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <>
      <Navbar />

      <div className="page">
        {/* HERO SECTION */}
        <section className="hero">
          <div className="hero-bg" />
          <div className="hero-overlay" />
          <div className="hero-content">
            <div className="hero-pill">Goriber Gari • Smart Car Marketplace</div>
            <h1 className="hero-title">
              Find the <span className="accent">right car</span> for your budget.
            </h1>
            <p className="hero-subtitle">
              From premium rides to daily budget cars, Goriber Gari helps you discover cars
              that match your style and your wallet.
            </p>
            <div className="hero-actions">
              <button className="hero-button primary" onClick={scrollToCars}>
                Explore Cars
              </button>
              <button
                className="hero-button ghost"
                onClick={() => navigate('/cars')}
              >
                View All Listings
              </button>
            </div>

            <div className="hero-stats">
              <div className="stat-card">
                <span className="stat-number">150+</span>
                <span className="stat-label">Cars Listed</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">4.8★</span>
                <span className="stat-label">Average Rating</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">24/7</span>
                <span className="stat-label">Support</span>
              </div>
            </div>
          </div>
        </section>

        {/* DISCOVER SECTION */}
        <section className="discover">
          <div className="discover-inner">
            <h2 className="discover-title">Discover Your Next Drive</h2>
            <p className="discover-text">
              Scroll through curated sections: Top Class, New Arrivals, and Budget Friendly.
              Every car is carefully described so you can compare and decide with confidence.
            </p>
          </div>
        </section>

        {/* CAR CATEGORIES */}
        <main id="car-categories" className="categories">
          {error && <div className="message error-message">{error}</div>}
          {loading ? (
            <div className="message loading">Loading cars...</div>
          ) : carData.length === 0 ? (
            <div className="message no-data">No cars available right now.</div>
          ) : (
            carData.map((section, idx) => (
              <section key={idx} className="category-section">
                <div className="category-header">
                  <div>
                    <h2 className="category-title">{section.category}</h2>
                    {section.subtitle && (
                      <p className="category-subtitle">{section.subtitle}</p>
                    )}
                  </div>
                  <span className="category-chip">Curated for you</span>
                </div>

                <div className="car-row-container">
                  <button
                    className="scroll-button left"
                    onClick={() => scrollLeft(idx)}
                    aria-label="Scroll left"
                  >
                    <FaChevronLeft />
                  </button>

                  <div
                    className="car-row"
                    ref={(el) => (scrollRefs.current[idx] = el)}
                  >
                    {section.cars.map((car, index) => (
                      <article
                        key={`${section.category}-${car.car_id}-${index}`}
                        className="car-card"
                        onClick={() => handleCardClick(car)}
                      >
                        <div className="car-image-wrapper">
                          <img
                            src={car.image}
                            alt={car.name}
                            className="car-image"
                            onError={handleImageError}
                          />
                          <div className="car-tag">{section.category}</div>
                          <div className="car-glow" />
                        </div>
                        <div className="car-details">
                          <div className="car-header">
                            <h3 className="car-name">{car.name}</h3>
                            <p className="car-price">{car.price}</p>
                          </div>
                          <p className="car-description">{car.description}</p>
                          <div className="car-meta">
                            {car.rating > 0 ? (
                              <span className="car-rating">
                                {'★'.repeat(car.rating)}
                                {'☆'.repeat(5 - car.rating)}
                              </span>
                            ) : (
                              <span className="car-rating muted">New Listing</span>
                            )}
                            <button
                              type="button"
                              className="car-view-button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCardClick(car);
                              }}
                            >
                              View details
                            </button>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>

                  <button
                    className="scroll-button right"
                    onClick={() => scrollRight(idx)}
                    aria-label="Scroll right"
                  >
                    <FaChevronRight />
                  </button>
                </div>
              </section>
            ))
          )}
        </main>

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

        /* HERO */

        .hero {
          position: relative;
          min-height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          padding: 0 clamp(1.2rem, 7vw, 4.5rem) 2.5rem;
          overflow: hidden;
        }

        .hero-bg {
          position: absolute;
          inset: 0;
          background-image: url(${carImage});
          background-size: cover;
          background-position: center;
          transform: scale(1.06);
          filter: brightness(0.9);
        }

        .hero-overlay {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(to right, rgba(15, 23, 42, 0.96), rgba(15, 23, 42, 0.4)),
            radial-gradient(circle at 80% 15%, rgba(56, 189, 248, 0.4), transparent 60%);
          mix-blend-mode: multiply;
        }

        .hero-content {
          position: relative;
          z-index: 1;
          max-width: 640px;
          padding-top: 4.2rem; /* offset navbar */
          display: flex;
          flex-direction: column;
          gap: 1.3rem;
          animation: fadeUp 0.7s ease-out;
        }

        .hero-pill {
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

        .hero-title {
          font-size: clamp(2.5rem, 4.8vw, 3.4rem);
          line-height: 1.08;
          font-weight: 800;
          letter-spacing: 0.02em;
          color: #f9fafb;
        }

        .hero-title .accent {
          background: linear-gradient(120deg, var(--accent), var(--accent-strong));
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .hero-subtitle {
          font-size: 0.96rem;
          color: var(--text-muted);
          max-width: 520px;
        }

        .hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.85rem;
        }

        .hero-button {
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
        }

        .hero-button.primary {
          background: linear-gradient(to right, var(--accent-strong), #f97316);
          color: #f9fafb;
          box-shadow: 0 20px 45px rgba(248, 113, 113, 0.65);
        }

        .hero-button.primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 26px 60px rgba(248, 113, 113, 0.75);
        }

        .hero-button.ghost {
          background: rgba(15, 23, 42, 0.85);
          border: 1px solid rgba(148, 163, 184, 0.9);
          color: var(--text-main);
        }

        .hero-button.ghost:hover {
          background: rgba(15, 23, 42, 1);
          transform: translateY(-1px);
        }

        .hero-stats {
          display: flex;
          flex-wrap: wrap;
          gap: 0.8rem;
          margin-top: 0.6rem;
        }

        .stat-card {
          min-width: 120px;
          padding: 0.75rem 0.95rem;
          border-radius: 1rem;
          background: radial-gradient(circle at top left, rgba(56, 189, 248, 0.2), transparent 60%);
          border: 1px solid rgba(148, 163, 184, 0.7);
          backdrop-filter: blur(18px);
          display: flex;
          flex-direction: column;
          gap: 0.1rem;
          box-shadow: 0 20px 50px rgba(15, 23, 42, 0.99);
        }

        .stat-number {
          font-weight: 700;
          font-size: 1.08rem;
          color: #f9fafb;
        }

        .stat-label {
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        /* DISCOVER */

        .discover {
          width: 100%;
          padding: 2rem clamp(1.5rem, 6vw, 1rem) 1.5rem;
        }

        .discover-inner {
          max-width: 1120px;
          margin: 0 auto;
          padding: 1.4rem 1.6rem;
          border-radius: 1.3rem;
          background: linear-gradient(120deg, rgba(15, 23, 42, 0.98), rgba(15, 23, 42, 0.92));
          border: 1px solid rgba(148, 163, 184, 0.45);
          box-shadow: 0 22px 60px rgba(15, 23, 42, 0.9);
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
          animation: fadeUp 0.6s ease-out;
        }

        .discover-title {
          font-size: 1.45rem;
          font-weight: 700;
          color: #f9fafb;
        }

        .discover-text {
          font-size: 0.92rem;
          color: var(--text-muted);
          max-width: 650px;
        }

        /* MESSAGES */

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

        /* CATEGORIES */

        .categories {
          width: 100%;
          padding: 1.6rem clamp(1.5rem, 6vw, 4rem) 3.4rem;
        }

        .category-section {
          max-width: 1120px;
          margin: 0 auto 3.6rem;
          position: relative;
          animation: fadeUp 0.6s ease-out;
        }

        .category-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 1rem;
          margin-bottom: 1.1rem;
        }

        .category-title {
          font-size: 1.35rem;
          font-weight: 700;
          color: #f9fafb;
        }

        .category-subtitle {
          font-size: 0.86rem;
          color: var(--text-muted);
          margin-top: 0.2rem;
        }

        .category-chip {
          font-size: 0.8rem;
          padding: 0.3rem 0.8rem;
          border-radius: 999px;
          border: 1px solid rgba(148, 163, 184, 0.7);
          background: rgba(15, 23, 42, 0.9);
          color: var(--text-muted);
          white-space: nowrap;
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
          gap: 1.2rem;
          padding: 0.25rem 0.3rem 0.7rem;
          scrollbar-width: thin;
          scrollbar-color: rgba(148, 163, 184, 0.7) transparent;
        }

        .car-row::-webkit-scrollbar {
          height: 6px;
        }

        .car-row::-webkit-scrollbar-track {
          background: transparent;
        }

        .car-row::-webkit-scrollbar-thumb {
          background: rgba(148, 163, 184, 0.7);
          border-radius: 999px;
        }

        .car-card {
          min-width: 280px;
          max-width: 310px;
          background: radial-gradient(circle at top left, rgba(56, 189, 248, 0.16), transparent 60%),
            var(--card-bg);
          border-radius: 1.2rem;
          border: 1px solid var(--card-border);
          box-shadow: 0 18px 48px rgba(15, 23, 42, 0.98);
          cursor: pointer;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transform: translateZ(0);
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
        }

        .car-card:hover {
          transform: translateY(-10px) scale(1.02);
          border-color: rgba(56, 189, 248, 0.75);
          box-shadow: 0 26px 65px rgba(15, 23, 42, 1);
        }

        .car-image-wrapper {
          position: relative;
          overflow: hidden;
        }

        .car-image {
          width: 100%;
          height: 190px;
          object-fit: cover;
          transform: scale(1.04);
          transition: transform 0.4s ease;
        }

        .car-card:hover .car-image {
          transform: scale(1.11);
        }

        .car-tag {
          position: absolute;
          bottom: 0.7rem;
          left: 0.7rem;
          background: rgba(15, 23, 42, 0.9);
          border-radius: 999px;
          padding: 0.2rem 0.75rem;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--text-muted);
          border: 1px solid rgba(148, 163, 184, 0.7);
        }

        .car-glow {
          position: absolute;
          inset: auto 0 -35%;
          height: 65%;
          background: radial-gradient(circle at 50% 0, rgba(56, 189, 248, 0.22), transparent 65%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .car-card:hover .car-glow {
          opacity: 1;
        }

        .car-details {
          padding: 0.75rem 0.9rem 0.9rem;
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
        }

        .car-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: 0.6rem;
        }

        .car-name {
          font-size: 1rem;
          font-weight: 600;
          color: #f9fafb;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .car-price {
          font-size: 0.96rem;
          font-weight: 600;
          color: var(--accent);
        }

        .car-description {
          font-size: 0.84rem;
          color: var(--text-muted);
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .car-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 0.25rem;
          gap: 0.75rem;
        }

        .car-rating {
          font-size: 0.8rem;
          color: #facc15;
          white-space: nowrap;
        }

        .car-rating.muted {
          color: var(--text-muted);
        }

        .car-view-button {
          padding: 0.38rem 1rem;
          border-radius: 999px;
          border: none;
          font-size: 0.8rem;
          background: rgba(15, 23, 42, 0.9);
          color: var(--accent);
          border: 1px solid rgba(56, 189, 248, 0.7);
          cursor: pointer;
          transition: background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
          white-space: nowrap;
        }

        .car-view-button:hover {
          background: rgba(15, 23, 42, 1);
          transform: translateY(-1px);
          box-shadow: 0 9px 24px rgba(15, 23, 42, 0.95);
        }

        .scroll-button {
          background: rgba(15, 23, 42, 0.95);
          color: #f9fafb;
          border: 1px solid rgba(148, 163, 184, 0.7);
          border-radius: 999px;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          position: absolute;
          z-index: 10;
          transition: background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
          backdrop-filter: blur(14px);
        }

        .scroll-button:hover {
          background: rgba(15, 23, 42, 1);
          transform: translateY(-1px);
          box-shadow: 0 10px 25px rgba(15, 23, 42, 0.9);
        }

        .scroll-button.left {
          left: 0;
          transform: translateX(-50%);
        }

        .scroll-button.right {
          right: 0;
          transform: translateX(50%);
        }

        /* RESPONSIVE */

        @media (max-width: 900px) {
          .hero {
            align-items: flex-end;
            padding: 0 1.4rem 2rem;
          }

          .hero-content {
            padding-top: 3.6rem;
          }

          .discover {
            padding: 1.8rem 1.4rem 1.3rem;
          }

          .categories {
            padding: 1.6rem 1.4rem 3rem;
          }
        }

        @media (max-width: 768px) {
          .hero {
            padding: 0 1.1rem 1.8rem;
          }

          .hero-title {
            max-width: 100%;
          }

          .hero-subtitle {
            font-size: 0.9rem;
          }

          .hero-stats {
            gap: 0.7rem;
          }

          .stat-card {
            padding: 0.7rem 0.85rem;
          }

          .discover-inner {
            padding: 1.1rem 1.25rem;
          }

          .category-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .scroll-button {
            display: none; /* swipe on mobile */
          }

          .car-card {
            min-width: 240px;
          }
        }

        @media (max-width: 480px) {
          .hero-content {
            padding-top: 3.1rem;
          }

          .hero-title {
            font-size: 1.9rem;
          }

          .hero-subtitle {
            font-size: 0.84rem;
          }

          .hero-actions {
            gap: 0.6rem;
          }

          .hero-button {
            font-size: 0.82rem;
            padding: 0.6rem 1.3rem;
          }

          .discover {
            padding: 1.6rem 1.1rem 1.1rem;
          }

          .categories {
            padding: 1.4rem 1.1rem 2.5rem;
          }

          .car-card {
            min-width: 220px;
          }

          .car-image {
            height: 175px;
          }
        }
      `}</style>
    </>
  );
};

export default Home;
