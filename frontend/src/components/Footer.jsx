import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="footer-logo">
            <span className="footer-logo-icon">GG</span>
            <div className="footer-logo-text">
              <span className="footer-title">Goriber Gari</span>
              <span className="footer-subtitle">Drive smart. Spend less.</span>
            </div>
          </div>
          <p className="footer-desc">
            A curated experience for car lovers on a Bangladeshi budget. Compare, explore, and
            discover rides that match your lifestyle.
          </p>
        </div>

        <div className="footer-grid">
          <div className="footer-section">
            <h4>Company</h4>
            <ul>
              <li><Link to="/about">About us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/careers">Careers</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Customer</h4>
            <ul>
              <li><Link to="/faq">FAQs</Link></li>
              <li><Link to="/shipping">Shipping &amp; returns</Link></li>
              <li><Link to="/orders">Track order</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Shop</h4>
            <ul>
              <li><Link to="/cars">All cars</Link></li>
              <li><Link to="/new-arrivals">New arrivals</Link></li>
              <li><Link to="/best-sellers">Best sellers</Link></li>
            </ul>
          </div>

          <div className="footer-section footer-connect">
            <h4>Stay in touch</h4>
            <div className="footer-social">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <img src="/social icons/facebook.png" alt="Facebook" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <img src="/social icons/twitter.png" alt="Twitter" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <img src="/social icons/instagram.png" alt="Instagram" />
              </a>
              <a href="mailto:contact@cardealer.com">
                <img src="/social icons/gmail.png" alt="Gmail" />
              </a>
            </div>
            <form
              className="footer-newsletter"
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <input type="email" placeholder="Email for offers" />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 Goriber Gari. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
