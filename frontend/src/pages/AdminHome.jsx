import React from 'react';
import { Link } from 'react-router-dom';
import AdminNavbar from '../components/AdminNavbar';
import Footer from '../components/Footer';

const AdminHome = () => {
    return (
        <div style={styles.pageContainer}>
            <AdminNavbar />
            <div style={styles.container}>
                <h2 style={styles.heading}>Admin Dashboard</h2>
                <div style={styles.gridContainer}>
                    <Link
                        to="/admin/manage-cars"
                        style={styles.card}
                        onMouseEnter={e => e.currentTarget.style.transform = styles.cardHover.transform}
                        onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        <h3 style={styles.cardTitle}>Manage Cars</h3>
                        <p style={styles.cardDescription}>Add, edit, or delete car listings.</p>
                    </Link>
                    <Link
                        to="/admin/manage-users"
                        style={styles.card}
                        onMouseEnter={e => e.currentTarget.style.transform = styles.cardHover.transform}
                        onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        <h3 style={styles.cardTitle}>Manage Users</h3>
                        <p style={styles.cardDescription}>View and manage user accounts.</p>
                    </Link>
                    <Link
                        to="/admin/manage-orders"
                        style={styles.card}
                        onMouseEnter={e => e.currentTarget.style.transform = styles.cardHover.transform}
                        onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        <h3 style={styles.cardTitle}>Manage Orders</h3>
                        <p style={styles.cardDescription}>Process and track customer orders.</p>
                    </Link>
                    <Link
                        to="/admin/purchase-history"
                        style={styles.card}
                        onMouseEnter={e => e.currentTarget.style.transform = styles.cardHover.transform}
                        onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        <h3 style={styles.cardTitle}>Purchase History</h3>
                        <p style={styles.cardDescription}>Review all past purchase records.</p>
                    </Link>
                    <Link
                        to="/admin/manage-employees"
                        style={styles.card}
                        onMouseEnter={e => e.currentTarget.style.transform = styles.cardHover.transform}
                        onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        <h3 style={styles.cardTitle}>Manage Employees</h3>
                        <p style={styles.cardDescription}>Add, edit, or delete employee records.</p>
                    </Link>
                </div>
            </div>
            <Footer />
        </div>
    );
};

const styles = {
    pageContainer: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: '#1a202c', // Dark background for the whole page
        color: '#ffffff',
    },
    container: {
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        background: 'linear-gradient(135deg, #2d3748, #1a202c)', // Dark gradient
    },
    heading: {
        fontSize: '3rem',
        fontWeight: 'bold',
        color: '#667eea', // Vibrant color for heading
        marginBottom: '40px',
        textShadow: '0 0 10px rgba(102, 126, 234, 0.5)',
    },
    gridContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '30px',
        width: '100%',
        maxWidth: '1200px',
    },
    card: {
        backgroundColor: '#2d3748', // Darker card background
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.4)',
        transition: 'all 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        textDecoration: 'none',
        color: 'inherit',
        border: '1px solid #4a5568',
    },
    cardHover: {
        transform: 'translateY(-10px) scale(1.02)',
        boxShadow: '0 12px 25px rgba(0, 0, 0, 0.6)',
        background: 'linear-gradient(45deg, #4a5568, #2d3748)',
    },
    cardTitle: {
        fontSize: '1.75rem',
        fontWeight: 'bold',
        color: '#a3bffa', // Lighter vibrant color
        marginBottom: '10px',
    },
    cardDescription: {
        color: '#cbd5e0',
        fontSize: '1.1rem',
        lineHeight: '1.5',
    },
};

export default AdminHome;
