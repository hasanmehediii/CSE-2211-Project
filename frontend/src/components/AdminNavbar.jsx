import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const AdminNavbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // In a real application, you would clear authentication tokens here
        navigate('/'); // Redirect to Home.jsx
    };

    return (
        <nav style={navbarStyles.navbar}>
            <div style={navbarStyles.logoContainer}>
                <Link to="/admin/home" style={navbarStyles.logo}>
                    Admin Panel
                </Link>
            </div>
            <div style={navbarStyles.navLinks}>
                <Link to="/admin/manage-users" style={navbarStyles.navLink}>Manage Users</Link>
                <Link to="/admin/manage-cars" style={navbarStyles.navLink}>Manage Cars</Link>
                <Link to="/admin/manage-orders" style={navbarStyles.navLink}>Manage Orders</Link>
                <Link to="/admin/purchase-history" style={navbarStyles.navLink}>Purchase History</Link>
                <button onClick={handleLogout} style={navbarStyles.logoutButton}>Logout</button>
            </div>
        </nav>
    );
};

const navbarStyles = {
    navbar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 2rem',
        backgroundColor: '#1a202c', // Dark background
        color: '#ffffff',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
    },
    logoContainer: {
        flexShrink: 0,
    },
    logo: {
        color: '#667eea', // A vibrant color for the logo
        fontSize: '1.8rem',
        fontWeight: 'bold',
        textDecoration: 'none',
        transition: 'color 0.3s ease',
        '&:hover': {
            color: '#a3bffa',
        },
    },
    navLinks: {
        display: 'flex',
        gap: '1.5rem',
        alignItems: 'center',
    },
    navLink: {
        color: '#ffffff',
        textDecoration: 'none',
        fontSize: '1.1rem',
        padding: '0.5rem 1rem',
        borderRadius: '5px',
        transition: 'background-color 0.3s ease, color 0.3s ease',
        '&:hover': {
            backgroundColor: '#2d3748',
            color: '#a3bffa',
        },
    },
    logoutButton: {
        backgroundColor: '#e53e3e', // Red for logout
        color: 'white',
        border: 'none',
        padding: '0.6rem 1.2rem',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '1rem',
        fontWeight: 'bold',
        transition: 'background-color 0.3s ease',
        '&:hover': {
            backgroundColor: '#c53030',
        },
    },
};

export default AdminNavbar;
