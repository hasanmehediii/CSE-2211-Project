import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const AdminNavbar = () => {
    const navigate = useNavigate();
    const [reportsOpen, setReportsOpen] = useState(false);
    const [actionsOpen, setActionsOpen] = useState(false);

    const handleLogout = () => {
        navigate('/');
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

                <div style={navbarStyles.dropdown} onMouseEnter={() => setReportsOpen(true)} onMouseLeave={() => setReportsOpen(false)}>
                    <button style={navbarStyles.navLink}>Reports</button>
                    {reportsOpen && (
                        <div style={navbarStyles.dropdownContent}>
                            <Link to="/admin/available-cars-with-category" style={navbarStyles.dropdownLink}>Available Cars with Category</Link>
                            <Link to="/admin/users-and-purchases" style={navbarStyles.dropdownLink}>Users and Purchases</Link>
                            <Link to="/admin/order-details-with-car-info" style={navbarStyles.dropdownLink}>Order Details with Car Info</Link>
                            <Link to="/admin/users-with-completed-purchases" style={navbarStyles.dropdownLink}>Users with Completed Purchases</Link>
                            <Link to="/admin/cars-more-expensive-than-category" style={navbarStyles.dropdownLink}>Cars More Expensive Than Category</Link>
                            <Link to="/admin/employees-and-orders-handled" style={navbarStyles.dropdownLink}>Employees and Orders Handled</Link>
                            <Link to="/admin/top-5-most-reviewed-cars" style={navbarStyles.dropdownLink}>Top 5 Most Reviewed Cars</Link>
                            <Link to="/admin/available-cars-and-inventory" style={navbarStyles.dropdownLink}>Available Cars and Inventory</Link>
                            <Link to="/admin/employees-and-shipping-records" style={navbarStyles.dropdownLink}>Employees and Shipping Records</Link>
                            <Link to="/admin/visible-reviews" style={navbarStyles.dropdownLink}>Visible Reviews</Link>
                            <Link to="/admin/electric-or-hybrid-cars" style={navbarStyles.dropdownLink}>Electric or Hybrid Cars</Link>
                            <Link to="/admin/cars-cheaper-than-category" style={navbarStyles.dropdownLink}>Cars Cheaper Than Category</Link>
                        </div>
                    )}
                </div>

                <div style={navbarStyles.dropdown} onMouseEnter={() => setActionsOpen(true)} onMouseLeave={() => setActionsOpen(false)}>
                    <button style={navbarStyles.navLink}>Actions</button>
                    {actionsOpen && (
                        <div style={navbarStyles.dropdownContent}>
                            <Link to="/admin/insert-new-car" style={navbarStyles.dropdownLink}>Insert New Car</Link>
                            <Link to="/admin/register-new-user" style={navbarStyles.dropdownLink}>Register New User</Link>
                            <Link to="/admin/update-car-price-and-availability" style={navbarStyles.dropdownLink}>Update Car</Link>
                            <Link to="/admin/delete-user-by-email" style={navbarStyles.dropdownLink}>Delete User by Email</Link>
                        </div>
                    )}
                </div>

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
        backgroundColor: '#1a202c',
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
        color: '#667eea',
        fontSize: '1.8rem',
        fontWeight: 'bold',
        textDecoration: 'none',
        transition: 'color 0.3s ease',
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
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontFamily: 'inherit',
    },
    logoutButton: {
        backgroundColor: '#e53e3e',
        color: 'white',
        border: 'none',
        padding: '0.6rem 1.2rem',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '1rem',
        fontWeight: 'bold',
        transition: 'background-color 0.3s ease',
    },
    dropdown: {
        position: 'relative',
        display: 'inline-block',
    },
    dropdownContent: {
        display: 'block',
        position: 'absolute',
        backgroundColor: '#2d3748',
        minWidth: '260px',
        boxShadow: '0px 8px 16px 0px rgba(0,0,0,0.2)',
        zIndex: 1,
        borderRadius: '5px',
        padding: '0.5rem 0',
    },
    dropdownLink: {
        color: 'white',
        padding: '12px 16px',
        textDecoration: 'none',
        display: 'block',
        textAlign: 'left',
        background: 'none',
        width: '100%',
        border: 'none',
        cursor: 'pointer',
    },
};

export default AdminNavbar;