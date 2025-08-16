import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminNavbar from '../../components/AdminNavbar';
import Footer from '../../components/Footer';
import './Admin.css';

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
        return <div className="loading">Loading orders...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="page-container">
            <AdminNavbar />
            <div className="content-container">
                <h2 className="admin-page-heading">Manage Orders</h2>
                {orders.length === 0 ? (
                    <p className="no-data">No orders found.</p>
                ) : (
                    <div className="table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Purchase ID</th>
                                    <th>Status</th>
                                    <th>Shipping Address</th>
                                    <th>Tracking Number</th>
                                    <th>Expected Delivery</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order.order_id} onClick={() => handleRowClick(order.order_id)}>
                                        <td>{order.order_id}</td>
                                        <td>{order.purchase_id}</td>
                                        <td>{order.status || 'N/A'}</td>
                                        <td>{order.shipping_address || 'N/A'}</td>
                                        <td>{order.tracking_number || 'N/A'}</td>
                                        <td>{order.expected_delivery ? new Date(order.expected_delivery).toLocaleDateString() : 'N/A'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {showModal && selectedOrder && (
                    <div className="modal-overlay">
                        <div className="modal">
                            <h3 className="modal-title">Order Details</h3>
                            <p><strong>Order ID:</strong> {selectedOrder.order_id}</p>
                            <p><strong>Purchase ID:</strong> {selectedOrder.purchase_id}</p>
                            <p><strong>Status:</strong> {selectedOrder.status || 'N/A'}</p>
                            <p><strong>Shipping Address:</strong> {selectedOrder.shipping_address || 'N/A'}</p>
                            <p><strong>Tracking Number:</strong> {selectedOrder.tracking_number || 'N/A'}</p>
                            <p><strong>Expected Delivery:</strong> {selectedOrder.expected_delivery ? new Date(selectedOrder.expected_delivery).toLocaleDateString() : 'N/A'}</p>

                            <h4 className="modal-subtitle">Order Items:</h4>
                            {selectedOrder.order_items && selectedOrder.order_items.length > 0 ? (
                                <ul className="modal-list">
                                    {selectedOrder.order_items.map(item => (
                                        <li key={item.order_item_id} className="modal-list-item">
                                            Item ID: {item.order_item_id}, Car ID: {item.car_id}, Quantity: {item.quantity}, Price: {item.price_at_order}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No order items found.</p>
                            )}

                            <button onClick={closeModal} className="modal-close-button">Close</button>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default ManageOrders;
