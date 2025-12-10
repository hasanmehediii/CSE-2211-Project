import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import api from '../api.jsx';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories/');
        setCategories(response.data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    fetchCategories();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile nav when route changes
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleCategoryClick = () => {
    setIsDropdownOpen(false);
    setSearchTerm('');
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <div className="navbar-shell">
        <nav className="navbar">
          {/* LEFT: Logo */}
          <div className="navbar-left">
            <Link to="/" className="logo">
              <span className="logo-mark">GG</span>
              <span className="logo-text">Goriber Gari</span>
            </Link>
          </div>

          {/* MOBILE TOGGLE */}
          <button
            className="nav-toggle"
            onClick={() => setIsMobileOpen((prev) => !prev)}
            aria-label="Toggle navigation"
          >
            <span className={`line ${isMobileOpen ? 'open' : ''}`} />
            <span className={`line ${isMobileOpen ? 'open' : ''}`} />
          </button>

          {/* CENTER + RIGHT */}
          <div className={`nav-main ${isMobileOpen ? 'open' : ''}`}>
            <div className="nav-links">
              <Link
                to="/"
                className={`nav-link ${isActive('/') ? 'active' : ''}`}
              >
                Home
              </Link>

              <div className="nav-link dropdown" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen((prev) => !prev)}
                  className="dropdown-button"
                  type="button"
                >
                  Categories
                  <span className={`caret ${isDropdownOpen ? 'rotate' : ''}`}>▾</span>
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

              <Link
                to="/faq"
                className={`nav-link ${isActive('/faq') ? 'active' : ''}`}
              >
                FAQs
              </Link>
            </div>

            <div className="nav-right">
              {user ? (
                <div className="user-info">
                  <Link to="/profile" className="username">
                    {user.username}
                  </Link>
                  <button onClick={handleLogout} className="pill-button ghost">
                    Logout
                  </button>
                </div>
              ) : (
                <Link to="/login" className="pill-button primary">
                  Login
                </Link>
              )}
            </div>
          </div>
        </nav>
      </div>

      <style jsx>{`
        :root {
          --nav-bg: rgba(15, 23, 42, 0.9);
          --nav-border: rgba(148, 163, 184, 0.45);
          --accent: #22d3ee;
          --accent-strong: #e11d48;
          --text-main: #e5e7eb;
          --text-muted: #9ca3af;
        }

        .navbar-shell {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          padding: 0.7rem 1rem;
          display: flex;
          justify-content: center;
          z-index: 1000;
          pointer-events: none;
        }

        .navbar {
          max-width: 1120px;
          width: 100%;
          border-radius: 999px;
          background: radial-gradient(circle at top left, rgba(56, 189, 248, 0.18), transparent 55%),
            var(--nav-bg);
          border: 1px solid var(--nav-border);
          box-shadow: 0 18px 40px rgba(15, 23, 42, 0.9);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          padding: 0.4rem 1.2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          pointer-events: auto;
        }

        .navbar-left {
          flex-shrink: 0;
        }

        .logo {
          display: inline-flex;
          align-items: center;
          gap: 0.55rem;
          text-decoration: none;
        }

        .logo-mark {
          width: 30px;
          height: 30px;
          border-radius: 999px;
          background: conic-gradient(from 160deg, #22d3ee, #0ea5e9, #f97316, #e11d48, #22d3ee);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          font-weight: 800;
          color: #020617;
          box-shadow: 0 0 0 2px rgba(15, 23, 42, 0.95);
        }

        .logo-text {
          font-size: 1.05rem;
          font-weight: 700;
          letter-spacing: 0.09em;
          text-transform: uppercase;
          color: #f9fafb;
        }

        .nav-toggle {
          display: none;
          border: none;
          background: transparent;
          color: #f9fafb;
          cursor: pointer;
          padding: 0.25rem;
          border-radius: 999px;
        }

        .nav-toggle .line {
          width: 19px;
          height: 2px;
          background: #e5e7eb;
          border-radius: 999px;
          transition: transform 0.2s ease, opacity 0.2s ease;
          display: block;
        }

        .nav-toggle .line + .line {
          margin-top: 4px;
        }

        .nav-toggle .line.open:first-child {
          transform: translateY(3px) rotate(45deg);
        }

        .nav-toggle .line.open:last-child {
          transform: translateY(-3px) rotate(-45deg);
        }

        .nav-main {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex: 1;
          gap: 1rem;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 1.4rem;
        }

        .nav-link {
          color: var(--text-muted);
          text-decoration: none;
          font-size: 0.95rem;
          font-weight: 500;
          position: relative;
          padding: 0.25rem 0;
          transition: color 0.2s ease;
        }

        .nav-link::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: 0;
          width: 0;
          height: 2px;
          border-radius: 999px;
          background: linear-gradient(to right, var(--accent), var(--accent-strong));
          transition: width 0.22s ease;
        }

        .nav-link:hover {
          color: #f9fafb;
        }

        .nav-link:hover::after {
          width: 100%;
        }

        .nav-link.active {
          color: #f9fafb;
        }

        .nav-link.active::after {
          width: 100%;
        }

        .dropdown {
          position: relative;
        }

        .dropdown-button {
          background: none;
          border: none;
          color: var(--text-muted);
          font-size: 0.95rem;
          font-weight: 500;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.25rem 0;
          transition: color 0.2s ease;
        }

        .dropdown-button:hover {
          color: #f9fafb;
        }

        .caret {
          font-size: 0.7rem;
          transition: transform 0.2s ease;
        }

        .caret.rotate {
          transform: rotate(180deg);
        }

        .dropdown-menu {
          position: absolute;
          top: 130%;
          left: 0;
          background: rgba(15, 23, 42, 0.98);
          border-radius: 14px;
          width: 280px;
          max-height: 360px;
          overflow-y: auto;
          padding: 0.85rem;
          box-shadow: 0 18px 40px rgba(15, 23, 42, 0.9);
          z-index: 50;
          opacity: 0;
          visibility: hidden;
          transform: translateY(-6px);
          transition: opacity 0.22s ease, visibility 0.22s ease, transform 0.22s ease;
          border: 1px solid rgba(148, 163, 184, 0.6);
        }

        .dropdown-menu.show {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }

        .dropdown-search {
          width: 100%;
          padding: 0.55rem 0.7rem;
          margin-bottom: 0.6rem;
          background: #020617;
          color: #e5e7eb;
          border: 1px solid #334155;
          border-radius: 999px;
          font-size: 0.85rem;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .dropdown-search:focus {
          outline: none;
          border-color: var(--accent);
          box-shadow: 0 0 0 1px rgba(34, 211, 238, 0.6);
        }

        .dropdown-list {
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .dropdown-item {
          padding: 0.5rem 0.5rem;
          border-radius: 8px;
          transition: background 0.18s ease;
        }

        .dropdown-item:hover {
          background: #0f172a;
        }

        .dropdown-link {
          color: #e5e7eb;
          text-decoration: none;
          font-size: 0.85rem;
          font-weight: 500;
        }

        .dropdown-link:hover {
          color: var(--accent);
        }

        .no-results {
          color: #94a3b8;
          text-align: center;
          font-size: 0.8rem;
        }

        .nav-right {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 1rem;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .username {
          font-size: 0.9rem;
          color: #fde68a;
          font-weight: 500;
          text-decoration: none;
        }

        .pill-button {
          padding: 0.4rem 1.1rem;
          border-radius: 999px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: none;
          transition: background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease, color 0.2s ease;
          white-space: nowrap;
        }

        .pill-button.primary {
          background: linear-gradient(to right, var(--accent-strong), #f97316);
          color: #f9fafb;
          box-shadow: 0 10px 25px rgba(248, 113, 113, 0.5);
        }

        .pill-button.primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 16px 35px rgba(248, 113, 113, 0.6);
        }

        .pill-button.ghost {
          background: rgba(15, 23, 42, 0.4);
          border: 1px solid rgba(148, 163, 184, 0.7);
          color: var(--text-main);
        }

        .pill-button.ghost:hover {
          background: rgba(15, 23, 42, 0.8);
          transform: translateY(-1px);
        }

        /* RESPONSIVE */

        @media (max-width: 840px) {
          .navbar {
            padding: 0.4rem 0.9rem;
          }

          .nav-main {
            position: absolute;
            top: 110%;
            left: 0;
            right: 0;
            padding: 0.75rem 0.9rem 0.8rem;
            border-radius: 1.1rem;
            background: rgba(15, 23, 42, 0.98);
            border: 1px solid rgba(148, 163, 184, 0.6);
            flex-direction: column;
            align-items: flex-start;
            gap: 0.85rem;
            transform-origin: top;
            transform: scaleY(0.8);
            opacity: 0;
            visibility: hidden;
            pointer-events: none;
            box-shadow: 0 18px 40px rgba(15, 23, 42, 1);
          }

          .nav-main.open {
            transform: scaleY(1);
            opacity: 1;
            visibility: visible;
            pointer-events: auto;
          }

          .nav-links {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.4rem;
          }

          .nav-right {
            width: 100%;
            justify-content: flex-start;
          }

          .dropdown-menu {
            position: static;
            margin-top: 0.4rem;
            width: 100%;
          }

          .nav-toggle {
            display: inline-flex;
          }
        }

        @media (max-width: 480px) {
          .logo-text {
            font-size: 0.9rem;
          }

          .logo-mark {
            width: 28px;
            height: 28px;
            font-size: 0.75rem;
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;
