import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminNavbar from '../../components/AdminNavbar';
import Footer from '../../components/Footer';

const PurchaseHistory = () => {
    const [purchases, setPurchases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedPurchase, setSelectedPurchase] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchPurchases = async () => {
            try {
                const response = await axios.get('http://localhost:8000/admin/purchases');
                setPurchases(response.data);
            } catch (err) {
                setError('Failed to fetch purchase history.');
                console.error('Error fetching purchase history:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchPurchases();
    }, []);

    const handleRowClick = async (purchaseId) => {
        try {
            const response = await axios.get(`http://localhost:8000/admin/purchases/${purchaseId}`);
            setSelectedPurchase(response.data);
            setShowModal(true);
        } catch (err) {
            setError('Failed to fetch purchase details.');
            console.error('Error fetching purchase details:', err);
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedPurchase(null);
    };

    if (loading) {
        return <div style={styles.loading}>Loading purchase history...</div>;
    }

    if (error) {
        return <div style={styles.error}>{error}</div>;
    }

    return (
        <div style={styles.pageContainer}>
            <AdminNavbar />
            <div style={styles.contentContainer}>
                <h2 style={styles.heading}>Purchase History</h2>
                {purchases.length === 0 ? (
                    <p style={styles.noData}>No purchase records found.</p>
                ) : (
                    <div style={styles.tableContainer}>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>Purchase ID</th>
                                    <th style={styles.th}>User ID</th>
                                    <th style={styles.th}>Amount</th>
                                    <th style={styles.th}>Payment Method</th>
                                    <th style={styles.th}>Status</th>
                                    <th style={styles.th}>Invoice Number</th>
                                </tr>
                            </thead>
                            <tbody>
                                {purchases.map((purchase) => (
                                    <tr key={purchase.purchase_id} style={styles.tr} onClick={() => handleRowClick(purchase.purchase_id)}>
                                        <td style={styles.td}>{purchase.purchase_id}</td>
                                        <td style={styles.td}>{purchase.user_id}</td>
                                        <td style={styles.td}>{purchase.amount}</td>
                                        <td style={styles.td}>{purchase.payment_method || 'N/A'}</td>
                                        <td style={styles.td}>{purchase.status || 'N/A'}</td>
                                        <td style={styles.td}>{purchase.invoice_number || 'N/A'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {showModal && selectedPurchase && (
                    <div style={modalStyles.overlay}>
                        <div style={modalStyles.modal}>
                            <h3 style={modalStyles.modalTitle}>Purchase Details</h3>
                            <p><strong>Purchase ID:</strong> {selectedPurchase.purchase_id}</p>
                            <p><strong>User ID:</strong> {selectedPurchase.user_id}</p>
                            <p><strong>Amount:</strong> {selectedPurchase.amount}</p>
                            <p><strong>Payment Method:</strong> {selectedPurchase.payment_method || 'N/A'}</p>
                            <p><strong>Status:</strong> {selectedPurchase.status || 'N/A'}</p>
                            <p><strong>Invoice Number:</strong> {selectedPurchase.invoice_number || 'N/A'}</p>

                            <h4 style={modalStyles.subTitle}>User Information:</h4>
                            {selectedPurchase.user ? (
                                <ul style={modalStyles.list}>
                                    <li style={modalStyles.listItem}>Username: {selectedPurchase.user.username}</li>
                                    <li style={modalStyles.listItem}>Email: {selectedPurchase.user.email}</li>
                                    <li style={modalStyles.listItem}>Phone: {selectedPurchase.user.phone || 'N/A'}</li>
                                </ul>
                            ) : (
                                <p>User information not available.</p>
                            )}

                            <h4 style={modalStyles.subTitle}>Associated Orders:</h4>
                            {selectedPurchase.orders && selectedPurchase.orders.length > 0 ? (
                                <ul style={modalStyles.list}>
                                    {selectedPurchase.orders.map(order => (
                                        <li key={order.order_id} style={modalStyles.listItem}>
                                            Order ID: {order.order_id}, Status: {order.status}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No associated orders found.</p>
                            )}

                            <button onClick={closeModal} style={modalStyles.closeButton}>Close</button>
                        </div>
                    </div>
                )}
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
    contentContainer: {
        flexGrow: 1,
        padding: '20px',
        backgroundColor: '#1a202c', // Dark background
        fontFamily: 'Arial, sans-serif',
        background: 'linear-gradient(135deg, #2d3748, #1a202c)', // Dark gradient
    },
    heading: {
        fontSize: '2.5rem',
        color: '#667eea',
        marginBottom: '20px',
        textAlign: 'center',
        textShadow: '0 0 8px rgba(102, 126, 234, 0.5)',
    },
    loading: {
        textAlign: 'center',
        fontSize: '1.2rem',
        color: '#a0aec0',
        marginTop: '50px',
    },
    error: {
        textAlign: 'center',
        fontSize: '1.2rem',
        color: '#fc8181',
        marginTop: '50px',
    },
    noData: {
        textAlign: 'center',
        fontSize: '1.2rem',
        color: '#cbd5e0',
        marginTop: '50px',
    },
    tableContainer: {
        overflowX: 'auto',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
        backgroundColor: '#2d3748', // Darker table background
        marginTop: '20px',
        border: '1px solid #4a5568',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
    },
    th: {
        padding: '12px 15px',
        textAlign: 'left',
        backgroundColor: '#4a5568',
        color: 'white',
        textTransform: 'uppercase',
        fontSize: '0.85rem',
        borderBottom: '2px solid #667eea',
    },
    tr: {
        borderBottom: '1px solid #4a5568',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
        '&:nth-of-type(even)': {
            backgroundColor: '#2d3748',
        },
        '&:hover': {
            backgroundColor: '#4a5568',
        },
    },
    td: {
        padding: '12px 15px',
        fontSize: '0.9rem',
        color: '#cbd5e0',
    },
};

const modalStyles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
    },
    modal: {
        backgroundColor: '#2d3748',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.5)',
        width: '90%',
        maxWidth: '600px',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative',
        color: '#cbd5e0',
        border: '1px solid #4a5568',
    },
    modalTitle: {
        fontSize: '1.8rem',
        color: '#667eea',
        marginBottom: '20px',
        borderBottom: '1px solid #4a5568',
        paddingBottom: '10px',
    },
    subTitle: {
        fontSize: '1.2rem',
        color: '#a3bffa',
        marginTop: '20px',
        marginBottom: '10px',
    },
    list: {
        listStyleType: 'none',
        padding: 0,
    },
    listItem: {
        backgroundColor: '#1a202c',
        padding: '10px',
        borderRadius: '4px',
        marginBottom: '8px',
        border: '1px solid #4a5568',
    },
    closeButton: {
        marginTop: '20px',
        padding: '10px 20px',
        backgroundColor: '#e53e3e',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '1rem',
        fontWeight: 'bold',
        transition: 'background-color 0.2s ease',
        '&:hover': {
            backgroundColor: '#c53030',
        },
    },
};

export default PurchaseHistory;
