import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaArrowRight,
  FaChevronLeft,
  FaChevronRight,
  FaRegStar,
  FaShieldAlt,
  FaStar,
} from 'react-icons/fa';
import { HiOutlineBadgeCheck, HiOutlineLightningBolt } from 'react-icons/hi';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import carImage from '../assets/car8.jpg';
import heroCar4 from '../assets/car4.jpg';
import heroCar5 from '../assets/car5.jpg';
import heroCar6 from '../assets/car6.jpg';
import heroCar7 from '../assets/car7.jpg';
import api from '../api.jsx';
import './Home.css';

const heroImages = [heroCar4, heroCar5, heroCar6, heroCar7, carImage];

const sectionConfig = [
  {
    category: 'Top rated',
    eyebrow: 'Community favourites',
    subtitle: 'The cars our drivers keep coming back to.',
    endpoint: '/cars/top-rated',
  },
  {
    category: 'Fresh arrivals',
    eyebrow: 'Just landed',
    subtitle: 'New options, ready for their first journey with you.',
    endpoint: '/cars/new-arrivals',
  },
  {
    category: 'Smart value',
    eyebrow: 'More road for your money',
    subtitle: 'Dependable choices selected with your budget in mind.',
    endpoint: '/cars/budget-friendly',
  },
];

const formatPrice = (price) => {
  const amount = Number(price);
  if (!Number.isFinite(amount)) return 'Price on request';

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
};

const Home = () => {
  const navigate = useNavigate();
  const [carData, setCarData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [heroIndex, setHeroIndex] = useState(0);
  const scrollRefs = useRef([]);

  useEffect(() => {
    heroImages.forEach((source) => {
      const image = new Image();
      image.src = source;
    });

    const timer = window.setInterval(() => {
      setHeroIndex((current) => (current + 1) % heroImages.length);
    }, 4500);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const responses = await Promise.all(
          sectionConfig.map((section) => api.get(section.endpoint))
        );

        setCarData(
          sectionConfig.map((section, index) => ({
            ...section,
            cars: responses[index].data.map((car) => ({
              ...car,
              name: car.model_name || car.modelnum || 'Model details coming soon',
              priceLabel: formatPrice(car.price),
              image: car.image_link || carImage,
              rating: Math.min(5, Math.max(0, Math.round(Number(car.rating) || 0))),
              description:
                car.description ||
                'A thoughtfully selected car ready for your next drive.',
            })),
          }))
        );
      } catch (err) {
        console.error('Failed to fetch car data:', err);
        setError('We could not load the showroom right now. Please try again shortly.');
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  const openCar = (car) => {
    if (car?.car_id) navigate(`/car-detail/${car.car_id}`);
  };

  const scrollToShowroom = () => {
    document.getElementById('showroom')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const scrollRow = (index, direction) => {
    scrollRefs.current[index]?.scrollBy({
      left: direction * 360,
      behavior: 'smooth',
    });
  };

  return (
    <div className="home-page">
      <Navbar />

      <main>
        <section className="home-hero">
          <div className="home-hero__slides" aria-hidden="true">
            {heroImages.map((source, index) => (
              <img
                className={`home-hero__image ${index === heroIndex ? 'is-active' : ''}`}
                src={source}
                alt=""
                key={source}
              />
            ))}
          </div>
          <div className="home-hero__shade" />
          <div className="home-hero__glow" />

          <div className="home-container home-hero__content">
            <div className="home-hero__copy">
              <span className="home-eyebrow">
                <span className="home-eyebrow__dot" />
                A simpler way to find your car
              </span>
              <h1>
                Your next drive
                <span> starts here.</span>
              </h1>
              <p>
                Discover hand-picked cars for every ambition and every budget.
                Clear choices, honest details, and no unnecessary detours.
              </p>
              <div className="home-hero__actions">
                <button className="home-button home-button--primary" onClick={scrollToShowroom}>
                  Explore the showroom <FaArrowRight />
                </button>
                <button className="home-button home-button--secondary" onClick={() => navigate('/faq')}>
                  How it works
                </button>
              </div>
            </div>

            <div className="home-hero__trust">
              <div>
                <HiOutlineBadgeCheck />
                <span><strong>Quality first</strong>Carefully curated listings</span>
              </div>
              <div>
                <FaShieldAlt />
                <span><strong>Shop confidently</strong>Details before decisions</span>
              </div>
              <div>
                <HiOutlineLightningBolt />
                <span><strong>Quick discovery</strong>Find your fit in minutes</span>
              </div>
            </div>
          </div>

          <button className="home-hero__scroll" onClick={scrollToShowroom} aria-label="Scroll to cars">
            <span />
            Discover
          </button>

          <div className="home-hero__slide-nav" aria-label="Choose hero image">
            {heroImages.map((source, index) => (
              <button
                type="button"
                key={source}
                className={index === heroIndex ? 'is-active' : ''}
                onClick={() => setHeroIndex(index)}
                aria-label={`Show hero image ${index + 1}`}
                aria-current={index === heroIndex ? 'true' : undefined}
              />
            ))}
          </div>
        </section>

        <section className="home-intro">
          <div className="home-container home-intro__grid">
            <div>
              <span className="home-section-label">Built around your journey</span>
              <h2>Less searching.<br />More driving.</h2>
            </div>
            <div className="home-intro__copy">
              <p>
                Buying a car should feel exciting, not overwhelming. We organise the
                showroom into useful collections so you can compare what matters and
                move forward with confidence.
              </p>
              <div className="home-intro__metrics">
                <span><strong>03</strong>Focused collections</span>
                <span><strong>01</strong>Simple experience</span>
              </div>
            </div>
          </div>
        </section>

        <section className="home-showroom" id="showroom">
          <div className="home-container">
            <div className="home-showroom__heading">
              <div>
                <span className="home-section-label">Explore the collection</span>
                <h2>Cars picked for real life.</h2>
              </div>
              <p>Start with a collection, then open any car for its full story.</p>
            </div>

            {error && (
              <div className="home-state home-state--error" role="alert">
                <strong>Something went off course.</strong>
                <span>{error}</span>
              </div>
            )}

            {loading && (
              <div className="home-skeleton-grid" aria-label="Loading cars">
                {[1, 2, 3].map((item) => <div className="home-skeleton" key={item} />)}
              </div>
            )}

            {!loading && !error && carData.map((section, sectionIndex) => (
              <section className="car-collection" key={section.category}>
                <div className="car-collection__header">
                  <div>
                    <span>{section.eyebrow}</span>
                    <h3>{section.category}</h3>
                    <p>{section.subtitle}</p>
                  </div>
                  <div className="car-collection__controls">
                    <button onClick={() => scrollRow(sectionIndex, -1)} aria-label={`Previous ${section.category} cars`}>
                      <FaChevronLeft />
                    </button>
                    <button onClick={() => scrollRow(sectionIndex, 1)} aria-label={`Next ${section.category} cars`}>
                      <FaChevronRight />
                    </button>
                  </div>
                </div>

                {section.cars.length ? (
                  <div
                    className="car-collection__row"
                    ref={(element) => { scrollRefs.current[sectionIndex] = element; }}
                  >
                    {section.cars.map((car, carIndex) => (
                      <article
                        className="showroom-card"
                        key={`${car.car_id || car.name}-${carIndex}`}
                        onClick={() => openCar(car)}
                        tabIndex={0}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' || event.key === ' ') openCar(car);
                        }}
                      >
                        <div className="showroom-card__media">
                          <img
                            src={car.image}
                            alt={car.name}
                            onError={(event) => { event.currentTarget.src = carImage; }}
                          />
                          <span>{section.category}</span>
                        </div>
                        <div className="showroom-card__body">
                          <div className="showroom-card__title">
                            <h4>{car.name}</h4>
                            <strong>{car.priceLabel}</strong>
                          </div>
                          <p>{car.description}</p>
                          <div className="showroom-card__footer">
                            <span className={car.rating ? 'showroom-card__rating' : 'showroom-card__rating is-new'}>
                              {car.rating ? (
                                <>
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    star <= car.rating ? <FaStar key={star} /> : <FaRegStar key={star} />
                                  ))}
                                  <small>{car.rating}.0</small>
                                </>
                              ) : 'New arrival'}
                            </span>
                            <span className="showroom-card__link">View car <FaArrowRight /></span>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="home-state">No cars in this collection yet.</div>
                )}
              </section>
            ))}
          </div>
        </section>

        <section className="home-cta">
          <div className="home-container home-cta__card">
            <div>
              <span className="home-section-label">Need a little direction?</span>
              <h2>Let’s make your first choice a confident one.</h2>
            </div>
            <button className="home-button home-button--light" onClick={() => navigate('/faq')}>
              Read common questions <FaArrowRight />
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
