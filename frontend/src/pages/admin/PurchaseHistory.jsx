import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminNavbar from '../../components/AdminNavbar';
import Footer from '../../components/Footer';
import './Admin.css';

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
        return <div className="loading">Loading purchase history...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="page-container">
            <AdminNavbar />
            <div className="content-container">
                <h2 className="admin-page-heading">Purchase History</h2>
                {purchases.length === 0 ? (
                    <p className="no-data">No purchase records found.</p>
                ) : (
                    <div className="table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Purchase ID</th>
                                    <th>User ID</th>
                                    <th>Amount</th>
                                    <th>Payment Method</th>
                                    <th>Status</th>
                                    <th>Invoice Number</th>
                                </tr>
                            </thead>
                            <tbody>
                                {purchases.map((purchase) => (
                                    <tr key={purchase.purchase_id} onClick={() => handleRowClick(purchase.purchase_id)}>
                                        <td>{purchase.purchase_id}</td>
                                        <td>{purchase.user_id}</td>
                                        <td>{purchase.amount}</td>
                                        <td>{purchase.payment_method || 'N/A'}</td>
                                        <td>{purchase.status || 'N/A'}</td>
                                        <td>{purchase.invoice_number || 'N/A'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {showModal && selectedPurchase && (
                    <div className="modal-overlay">
                        <div className="modal">
                            <h3 className="modal-title">Purchase Details</h3>
                            <p><strong>Purchase ID:</strong> {selectedPurchase.purchase_id}</p>
                            <p><strong>User ID:</strong> {selectedPurchase.user_id}</p>
                            <p><strong>Amount:</strong> {selectedPurchase.amount}</p>
                            <p><strong>Payment Method:</strong> {selectedPurchase.payment_method || 'N/A'}</p>
                            <p><strong>Status:</strong> {selectedPurchase.status || 'N/A'}</p>
                            <p><strong>Invoice Number:</strong> {selectedPurchase.invoice_number || 'N/A'}</p>

                            <h4 className="modal-subtitle">User Information:</h4>
                            {selectedPurchase.user ? (
                                <ul className="modal-list">
                                    <li className="modal-list-item">Username: {selectedPurchase.user.username}</li>
                                    <li className="modal-list-item">Email: {selectedPurchase.user.email}</li>
                                    <li className="modal-list-item">Phone: {selectedPurchase.user.phone || 'N/A'}</li>
                                </ul>
                            ) : (
                                <p>User information not available.</p>
                            )}

                            <h4 className="modal-subtitle">Associated Orders:</h4>
                            {selectedPurchase.orders && selectedPurchase.orders.length > 0 ? (
                                <ul className="modal-list">
                                    {selectedPurchase.orders.map(order => (
                                        <li key={order.order_id} className="modal-list-item">
                                            Order ID: {order.order_id}, Status: {order.status}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No associated orders found.</p>
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

export default PurchaseHistory;
