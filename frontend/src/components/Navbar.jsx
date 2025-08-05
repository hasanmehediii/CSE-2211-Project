import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import axios from 'axios';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:8000/categories/');
        console.log('Categories Response:', response.data);
        setCategories(response.data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleCategoryClick = () => {
    setIsDropdownOpen(false);
    setSearchTerm('');
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <nav className="navbar">
        <div className="logo">
          <Link to="/">Goriber Gari</Link>
        </div>
        <div className="nav-center">
          <div className="nav-links">
            <Link to="/" className="nav-link">Home</Link>
            <div className="nav-link dropdown" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="dropdown-button"
              >
                Categories
              </button>
              <div className={`dropdown-menu ${isDropdownOpen ? 'show' : ''}`}>
                <input
                  type="text"
                  placeholder="Search categories..."
                  className="dropdown-search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <ul className="dropdown-list">
                  {filteredCategories.length > 0 ? (
                    filteredCategories.map((category) => (
                      <li key={category.category_id} className="dropdown-item">
                        <Link
                          to={`/category/${category.category_id}`}
                          className="dropdown-link"
                          onClick={handleCategoryClick}
                        >
                          {category.name}
                        </Link>
                      </li>
                    ))
                  ) : (
                    <li className="dropdown-item no-results">No categories found</li>
                  )}
                </ul>
              </div>
            </div>
            <Link to="/faq" className="nav-link">FAQs</Link>
            {user ? (
              <div className="user-info">
                <Link to="/profile" className="username">{user.username}</Link>
                <button onClick={handleLogout} className="logout-button">Logout</button>
              </div>
            ) : (
              <Link to="/login" className="login-button">Login</Link>
            )}
          </div>
        </div>
      </nav>
      <style jsx>{`
        .navbar {
          position: fixed;
          top: 0;
          width: 100%;
          background: rgba(0, 9, 4, 0.85);
          color: #ffffff;
          padding: 0.5rem 1rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          z-index: 1000;
          backdrop-filter: blur(20px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }
        .logo {
          font-size: 1.75rem;
          font-weight: 800;
          letter-spacing: 0.05em;
        }
        .logo a {
          color: #ffffff;
          text-decoration: none;
          transition: color 0.3s ease, transform 0.3s ease;
        }
        .logo a:hover {
          color: #22d3ee;
          transform: scale(1.05);
        }
        .nav-center {
          display: flex;
          justify-content: center;
          width: 80%; /* Increased to accommodate more links */
        }
        .nav-links {
          display: flex;
          gap: 2rem;
          align-items: center;
        }
        .nav-link {
          color: #d1d5db;
          text-decoration: none;
          font-size: 1.1rem;
          font-weight: 600;
          transition: color 0.3s ease;
        }
        .nav-link:hover {
          color: #22d3ee;
        }
        .dropdown {
          position: relative;
        }
        .dropdown-button {
          background: none;
          border: none;
          color: #d1d5db;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: color 0.3s ease;
        }
        .dropdown-button:hover {
          color: #22d3ee;
        }
        .dropdown-menu {
          position: absolute;
          top: 40px;
          left: -20px;
          background: #1e293b;
          border-radius: 12px;
          width: 300px;
          max-height: 400px;
          overflow-y: auto;
          padding: 1rem;
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
          z-index: 100;
          opacity: 0;
          visibility: hidden;
          transform: translateY(-10px);
          transition: opacity 0.3s ease, visibility 0.3s ease, transform 0.3s ease;
        }
        .dropdown-menu.show {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }
        .dropdown-search {
          width: 100%;
          padding: 0.75rem;
          margin-bottom: 0.75rem;
          background: #0f172a;
          color: #e5e7eb;
          border: 1px solid #334155;
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.3s ease;
        }
        .dropdown-search:focus {
          outline: none;
          border-color: #22d3ee;
        }
        .dropdown-list {
          list-style-type: none;
          padding: 0;
          margin: 0;
        }
        .dropdown-item {
          padding: 0.75rem;
          background: #1e293b;
          border-radius: 8px;
          margin-bottom: 0.5rem;
          transition: background-color 0.2s ease;
        }
        .dropdown-item:hover {
          background: #334155;
        }
        .dropdown-link {
          color: #e5e7eb;
          text-decoration: none;
          font-size: 1rem;
          font-weight: 500;
        }
        .dropdown-link:hover {
          color: #22d3ee;
        }
        .no-results {
          color: #94a3b8;
          text-align: center;
          font-size: 0.95rem;
        }
        .user-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .username {
          font-size: 1rem;
          color: #ffea00ff;
          font-weight: 500;
        }
        .login-button, .logout-button {
          padding: 0.5rem 1.5rem;
          background: #22d3ee;
          border-radius: 2rem;
          color: #1e293b;
          font-weight: 600;
          text-decoration: none;
          cursor: pointer;
          transition: background 0.3s ease, transform 0.2s ease;
        }
        .logout-button {
          border: none;
        }
        .login-button:hover, .logout-button:hover {
          background: #06b6d4;
          transform: translateY(-2px);
        }
        @media (max-width: 768px) {
          .navbar {
            padding: 0.75rem 1rem;
          }
          .nav-center {
            width: 80%;
          }
          .nav-links {
            gap: 1.5rem;
          }
          .dropdown-menu {
            width: 250px;
          }
        }
        @media (max-width: 480px) {
          .navbar {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }
          .nav-center {
            width: 100%;
            justify-content: flex-start;
          }
          .nav-links {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
          .dropdown-menu {
            width: 100%;
            left: 0;
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;