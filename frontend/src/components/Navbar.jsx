import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaChevronDown, FaUserCircle } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext.jsx';
import api from '../api.jsx';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    api.get('/categories/')
      .then((response) => setCategories(response.data))
      .catch((error) => console.error('Failed to fetch categories:', error));
  }, []);

  useEffect(() => {
    const closeDropdown = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', closeDropdown);
    return () => document.removeEventListener('mousedown', closeDropdown);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
    setIsDropdownOpen(false);
  }, [location.pathname]);

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="site-nav-shell">
      <nav className="site-nav" aria-label="Main navigation">
        <Link to="/" className="site-nav__brand" aria-label="Goriber Gari home">
          <img className="site-nav__mark" src="/carshop.png" alt="" aria-hidden="true" />
          <span>
            <strong>Goriber Gari</strong>
            <small>Find your road</small>
          </span>
        </Link>

        <button
          className={`site-nav__toggle ${isMobileOpen ? 'is-open' : ''}`}
          type="button"
          onClick={() => setIsMobileOpen((open) => !open)}
          aria-expanded={isMobileOpen}
          aria-label="Toggle navigation"
        >
          <span />
          <span />
        </button>

        <div className={`site-nav__content ${isMobileOpen ? 'is-open' : ''}`}>
          <div className="site-nav__links">
            <Link className={location.pathname === '/' ? 'is-active' : ''} to="/">Home</Link>

            <div className="site-nav__dropdown" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsDropdownOpen((open) => !open)}
                aria-expanded={isDropdownOpen}
              >
                Collections
                <FaChevronDown className={isDropdownOpen ? 'is-rotated' : ''} />
              </button>
              <div className={`site-nav__menu ${isDropdownOpen ? 'is-open' : ''}`}>
                <div className="site-nav__menu-heading">
                  <strong>Browse collections</strong>
                  <span>Find cars by category</span>
                </div>
                <input
                  type="search"
                  placeholder="Search categories"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                />
                <div className="site-nav__category-list">
                  {filteredCategories.length ? filteredCategories.map((category) => (
                    <Link key={category.category_id} to={`/category/${category.category_id}`}>
                      <span>{category.name}</span>
                      <span>→</span>
                    </Link>
                  )) : <p>No matching categories</p>}
                </div>
              </div>
            </div>

            <Link className={location.pathname === '/faq' ? 'is-active' : ''} to="/faq">
              FAQs
            </Link>
          </div>

          <div className="site-nav__actions">
            {user ? (
              <>
                <Link className="site-nav__profile" to="/profile">
                  <FaUserCircle />
                  <span>{user.username}</span>
                </Link>
                <button className="site-nav__login is-ghost" onClick={handleLogout}>Log out</button>
              </>
            ) : (
              <Link className="site-nav__login" to="/login">Sign in <span>→</span></Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
