import React from 'react';
import './Welcome.css';
import { FaFacebookF, FaTwitter, FaInstagram, FaEnvelope, FaPhone } from 'react-icons/fa';

const carData = [
  {
    category: 'Top Sales',
    cars: [
      { name: 'Tesla Model S', price: '$89,990', image: '/images/tesla.jpg', rating: 5 },
      { name: 'BMW M8', price: '$133,000', image: '/images/bmw.jpg', rating: 4 },
      { name: 'Audi R8', price: '$158,000', image: '/images/audi.jpg', rating: 5 },
      { name: 'Lamborghini Aventador', price: '$393,695', image: '/images/lamborghini.jpg', rating: 5 },
    ],
  },
  {
    category: 'New Arrival',
    cars: [
      { name: 'Tesla Model X', price: '$109,990', image: '/images/tesla2.jpg', rating: 4 },
      { name: 'BMW X6', price: '$87,250', image: '/images/bmw2.jpg', rating: 4 },
      { name: 'Audi A8', price: '$86,500', image: '/images/audi2.jpg', rating: 4 },
      { name: 'Lamborghini Huracan', price: '$261,274', image: '/images/lamborghini2.jpg', rating: 5 },
    ],
  },
  {
    category: 'Budget Friendly',
    cars: [
      { name: 'Ford Mustang', price: '$42,000', image: '/images/mustang.jpg', rating: 4 },
      { name: 'Mercedes C-Class', price: '$43,550', image: '/images/mercedes.jpg', rating: 3 },
      { name: 'Honda Civic', price: '$25,500', image: '/images/normal1.jpg', rating: 4 },
      { name: 'Toyota Corolla', price: '$21,900', image: '/images/normal2.jpg', rating: 4 },
    ],
  },
];

const Welcome = () => {
  return (
    <div className="welcome-container">
      <header className="header">
  <div className="logo">
  <img src="/images/repair-shop.png" alt="CarZone Logo" className="logo-img" />
  <span>CarZone</span>
</div>
  <nav className="nav-links">
    <a href="#">Home</a>
    <a href="#">Explore</a>
    <a href="#">Offers</a>
    <a href="#">Contact</a>
  </nav>
  <p className="tagline">Drive your dream today — Top cars, best deals.</p>
</header>

      {carData.map((section, idx) => (
        <div key={idx} className="section">
          <h2 className="section-title">{section.category}</h2>
          <div className="card-row">
            {section.cars.map((car, index) => (
              <div key={index} className="car-card">
                <img src={car.image} alt={car.name} className="car-image" />
                <div className="car-details">
                  <h3 className="car-name">{car.name}</h3>
                  <p className="car-price">{car.price}</p>
                  <p className="car-rating">
                    {'★'.repeat(car.rating)}{'☆'.repeat(5 - car.rating)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      <footer className="footer">
        <div className="footer-links">
          <a href="#">About Us</a>
          <a href="#">Help</a>
          <a href="#">FAQ</a>
          <a href="#">Contact</a>
        </div>
        <div className="footer-socials">
          <a href="#"><FaFacebookF /></a>
          <a href="#"><FaTwitter /></a>
          <a href="#"><FaInstagram /></a>
          <a href="#"><FaEnvelope /></a>
          <a href="#"><FaPhone /></a>
        </div>
        <p className="footer-copy">&copy; 2025 CarZone. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Welcome;
