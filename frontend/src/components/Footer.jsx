import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css'; // Import the CSS file

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-section">
                    <h4>Company</h4>
                    <ul>
                        <li><Link to="/about">About Us</Link></li>
                        <li><Link to="/contact">Contact Us</Link></li>
                        <li><Link to="/careers">Careers</Link></li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h4>Customer Service</h4>
                    <ul>
                        <li><Link to="/faq">FAQ</Link></li>
                        <li><Link to="/shipping">Shipping & Returns</Link></li>
                        <li><Link to="/orders">Track Order</Link></li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h4>Shop</h4>
                    <ul>
                        <li><Link to="/cars">All Cars</Link></li>
                        <li><Link to="/new-arrivals">New Arrivals</Link></li>
                        <li><Link to="/best-sellers">Best Sellers</Link></li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h4>Legal</h4>
                    <ul>
                        <li><Link to="/terms">Terms of Service</Link></li>
                        <li><Link to="/privacy">Privacy Policy</Link></li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h4>Connect With Us</h4>
                    <div className="social-links">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">FB</a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">TW</a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">IG</a>
                    </div>
                    <div className="newsletter">
                        <h4>Subscribe to our Newsletter</h4>
                        <input type="email" placeholder="Enter your email" />
                        <button>Subscribe</button>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; 2025 Car Dealer, Inc. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;