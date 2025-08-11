import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminNavbar from '../../components/AdminNavbar';
import Footer from '../../components/Footer';

const ManageOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('http://localhost:8000/admin/orders');
                setOrders(response.data);
            } catch (err) {
                setError('Failed to fetch orders.');
                console.error('Error fetching orders:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const handleRowClick = async (orderId) => {
        try {
            const response = await axios.get(`http://localhost:8000/admin/orders/${orderId}`);
            setSelectedOrder(response.data);
            setShowModal(true);
        } catch (err) {
            setError('Failed to fetch order details.');
            console.error('Error fetching order details:', err);
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedOrder(null);
    };

    if (loading) {
        return <div style={styles.loading}>Loading orders...</div>;
    }

    if (error) {
        return <div style={styles.error}>{error}</div>;
    }

    return (
        <div style={styles.pageContainer}>
            <AdminNavbar />
            <div style={styles.contentContainer}>
                <h2 style={styles.heading}>Manage Orders</h2>
                {orders.length === 0 ? (
                    <p style={styles.noData}>No orders found.</p>
                ) : (
                    <div style={styles.tableContainer}>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>Order ID</th>
                                    <th style={styles.th}>Purchase ID</th>
                                    <th style={styles.th}>Status</th>
                                    <th style={styles.th}>Shipping Address</th>
                                    <th style={styles.th}>Tracking Number</th>
                                    <th style={styles.th}>Expected Delivery</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order.order_id} style={styles.tr} onClick={() => handleRowClick(order.order_id)}>
                                        <td style={styles.td}>{order.order_id}</td>
                                        <td style={styles.td}>{order.purchase_id}</td>
                                        <td style={styles.td}>{order.status || 'N/A'}</td>
                                        <td style={styles.td}>{order.shipping_address || 'N/A'}</td>
                                        <td style={styles.td}>{order.tracking_number || 'N/A'}</td>
                                        <td style={styles.td}>{order.expected_delivery ? new Date(order.expected_delivery).toLocaleDateString() : 'N/A'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {showModal && selectedOrder && (
                    <div style={modalStyles.overlay}>
                        <div style={modalStyles.modal}>
                            <h3 style={modalStyles.modalTitle}>Order Details</h3>
                            <p><strong>Order ID:</strong> {selectedOrder.order_id}</p>
                            <p><strong>Purchase ID:</strong> {selectedOrder.purchase_id}</p>
                            <p><strong>Status:</strong> {selectedOrder.status || 'N/A'}</p>
                            <p><strong>Shipping Address:</strong> {selectedOrder.shipping_address || 'N/A'}</p>
                            <p><strong>Tracking Number:</strong> {selectedOrder.tracking_number || 'N/A'}</p>
                            <p><strong>Expected Delivery:</strong> {selectedOrder.expected_delivery ? new Date(selectedOrder.expected_delivery).toLocaleDateString() : 'N/A'}</p>

                            <h4 style={modalStyles.subTitle}>Order Items:</h4>
                            {selectedOrder.order_items && selectedOrder.order_items.length > 0 ? (
                                <ul style={modalStyles.list}>
                                    {selectedOrder.order_items.map(item => (
                                        <li key={item.order_item_id} style={modalStyles.listItem}>
                                            Item ID: {item.order_item_id}, Car ID: {item.car_id}, Quantity: {item.quantity}, Price: {item.price_at_order}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No order items found.</p>
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

export default ManageOrders;
