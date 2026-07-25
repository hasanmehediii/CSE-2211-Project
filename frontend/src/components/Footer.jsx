import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa';
import { HiOutlineMail } from 'react-icons/hi';
import './Footer.css';

const Footer = () => (
  <footer className="site-footer">
    <div className="site-footer__inner">
      <div className="site-footer__top">
        <div className="site-footer__brand">
          <Link to="/" className="site-footer__logo">
            <span>G</span>
            <strong>Goriber Gari</strong>
          </Link>
          <p>
            Helping everyday drivers discover the right car with less noise and
            more confidence.
          </p>
        </div>

        <div className="site-footer__nav">
          <div>
            <h3>Explore</h3>
            <Link to="/">Showroom</Link>
            <Link to="/faq">Common questions</Link>
          </div>
          <div>
            <h3>Account</h3>
            <Link to="/login">Sign in</Link>
            <Link to="/signup">Create account</Link>
            <Link to="/profile">My profile</Link>
          </div>
        </div>

        <div className="site-footer__newsletter">
          <span>Stay in the loop</span>
          <h3>Good cars. Useful updates.</h3>
          <form onSubmit={(event) => event.preventDefault()}>
            <label className="sr-only" htmlFor="footer-email">Email address</label>
            <input id="footer-email" type="email" placeholder="Your email address" />
            <button type="submit" aria-label="Subscribe">→</button>
          </form>
          <small>No spam. Just the occasional showroom update.</small>
        </div>
      </div>

      <div className="site-footer__bottom">
        <p>© {new Date().getFullYear()} Goriber Gari. Made for the road ahead.</p>
        <div className="site-footer__socials">
          <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook"><FaFacebookF /></a>
          <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter"><FaTwitter /></a>
          <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"><FaInstagram /></a>
          <a href="mailto:contact@cardealer.com" aria-label="Email"><HiOutlineMail /></a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
