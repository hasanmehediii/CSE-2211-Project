import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import carImage from '../assets/car2.jpg';
import api from '../api.jsx';

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
        const categoryResponse = await api.get(`/categories/${categoryId}`);
        setCategoryName(categoryResponse.data.name || 'this Category');

        const carsResponse = await api.get(`/cars/category/${categoryId}`);
        setCars(carsResponse.data);
      } catch (err) {
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
      <Navbar />

      <div className="category-page">
        {/* HERO HEADER */}
        <section className="category-hero">
          <div className="category-hero-overlay" />
          <h1 className="category-title">
            Cars in <span className="accent">{categoryName}</span>
          </h1>
          <p className="category-subtitle">
            Explore hand-picked cars under this category
          </p>
        </section>

        {/* CONTENT */}
        <section className="category-content">
          {loading ? (
            <div className="status-card">Loading cars...</div>
          ) : error ? (
            <div className="status-card error">{error}</div>
          ) : cars.length === 0 ? (
            <div className="status-card">No cars available in this category.</div>
          ) : (
            <div className="car-grid">
              {cars.map((car) => (
                <article
                  key={car.car_id}
                  className="car-card"
                  onClick={() => navigate(`/car-detail/${car.car_id}`)}
                >
                  <div className="car-image-wrapper">
                    <img
                      src={car.image_link || carImage}
                      alt={car.model_name || car.modelnum}
                      onError={handleImageError}
                    />
                    <span
                      className={`badge ${
                        car.available ? 'available' : 'sold'
                      }`}
                    >
                      {car.available ? 'Available' : 'Sold Out'}
                    </span>
                  </div>

                  <div className="car-info">
                    <h3 className="car-name">
                      {car.manufacturer} {car.model_name || car.modelnum}
                    </h3>

                    <p className="car-year">{car.year || 'N/A'}</p>

                    <p className="car-price">
                      ${car.price ? car.price.toLocaleString() : 'N/A'}
                    </p>

                    <div className="car-specs">
                      <span>{car.engine_type || 'N/A'}</span>
                      <span>{car.transmission || 'N/A'}</span>
                      <span>
                        {car.mileage
                          ? `${car.mileage.toLocaleString()} mi`
                          : 'N/A'}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>

      <Footer />

      <style jsx>{`
        :root {
          --bg: #020617;
          --card-bg: rgba(15, 23, 42, 0.96);
          --border: rgba(148, 163, 184, 0.35);
          --accent: #22d3ee;
          --accent-strong: #e11d48;
          --text-main: #f9fafb;
          --text-muted: #9ca3af;
        }

        body {
          margin: 0;
          background: var(--bg);
          color: var(--text-main);
          font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .category-page {
          min-height: 100vh;
          background: radial-gradient(
              circle at top left,
              rgba(56, 189, 248, 0.15),
              transparent 55%
            ),
            radial-gradient(
              circle at bottom right,
              rgba(244, 63, 94, 0.25),
              transparent 60%
            ),
            var(--bg);
          color: var(--text-main);
        }

        /* HERO */
        .category-hero {
          position: relative;
          padding: 5rem 1.5rem 3rem;
          text-align: center;
          overflow: hidden;
        }

        .category-hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(2, 6, 23, 0.95),
            rgba(2, 6, 23, 0.7)
          );
        }

        .category-title {
          position: relative;
          font-size: clamp(2rem, 5vw, 2.8rem);
          font-weight: 800;
          margin-bottom: 0.6rem;
        }

        .category-title .accent {
          background: linear-gradient(
            120deg,
            var(--accent),
            var(--accent-strong)
          );
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .category-subtitle {
          position: relative;
          font-size: 0.95rem;
          color: var(--text-muted);
        }

        /* CONTENT */
        .category-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2.5rem 1.5rem 4rem;
        }

        .status-card {
          text-align: center;
          padding: 2rem;
          border-radius: 1rem;
          background: var(--card-bg);
          border: 1px solid var(--border);
          color: var(--text-muted);
        }

        .status-card.error {
          color: #fecaca;
          border-color: rgba(248, 113, 113, 0.6);
        }

        /* GRID */
        .car-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 1.6rem;
        }

        .car-card {
          background: var(--card-bg);
          border-radius: 1.2rem;
          border: 1px solid var(--border);
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.25s ease, box-shadow 0.25s ease,
            border-color 0.25s ease;
          box-shadow: 0 18px 48px rgba(15, 23, 42, 0.95);
        }

        .car-card:hover {
          transform: translateY(-10px) scale(1.02);
          border-color: rgba(56, 189, 248, 0.7);
          box-shadow: 0 28px 70px rgba(15, 23, 42, 1);
        }

        .car-image-wrapper {
          position: relative;
          height: 180px;
        }

        .car-image-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .car-card:hover img {
          transform: scale(1.08);
        }

        .badge {
          position: absolute;
          top: 0.7rem;
          right: 0.7rem;
          padding: 0.25rem 0.75rem;
          border-radius: 999px;
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
        }

        .badge.available {
          background: #22d3ee;
          color: #020617;
        }

        .badge.sold {
          background: #ef4444;
          color: #fff;
        }

        .car-info {
          padding: 0.9rem 1rem 1.1rem;
        }

        .car-name {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
        }

        .car-year {
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .car-price {
          margin: 0.5rem 0;
          font-size: 1rem;
          font-weight: 600;
          color: var(--accent);
        }

        .car-specs {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
        }

        .car-specs span {
          font-size: 0.75rem;
          padding: 0.25rem 0.5rem;
          border-radius: 0.4rem;
          background: rgba(148, 163, 184, 0.15);
          color: var(--text-muted);
        }

        @media (max-width: 480px) {
          .category-content {
            padding: 2rem 1.1rem 3rem;
          }
        }
      `}</style>
    </>
  );
};

export default CarForMe;
