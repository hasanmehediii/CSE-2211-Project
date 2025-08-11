import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import axios from 'axios';

const UserProfile = () => {
    const { user } = useContext(AuthContext);
    const [userData, setUserData] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({});
    const [purchases, setPurchases] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (user) {
            const fetchData = async () => {
                try {
                    setLoading(true);
                    setError(null);

                    // Single unified API call fetching user info with purchases, reviews, and orders
                    const response = await axios.get(`http://localhost:8000/users/${user.user_id}/all`);
                    // The response data structure assumed:
                    // {
                    //   user info fields,
                    //   purchases: [...],
                    //   reviews: [...],
                    //   orders: [...] (if implemented)
                    // }

                    setUserData(response.data);
                    setFormData(response.data);

                    // Extract purchases and orders from unified response
                    setPurchases(response.data.purchases || []);
                    setOrders(response.data.orders || []); // Make sure your backend supports returning orders here

                } catch (err) {
                    setError('Failed to fetch user data. Please try again later.');
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
        }
    }, [user]);

    const handleEdit = () => setEditMode(true);
    const handleCancel = () => {
        setEditMode(false);
        setFormData(userData);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.put(`http://localhost:8000/users/${user.user_id}`, formData)
            .then(response => {
                setUserData(response.data);
                setFormData(response.data);
                setEditMode(false);
            })
            .catch(err => {
                console.error('Failed to update user data:', err);
                setError('Failed to update profile. Please try again.');
            });
    };

    if (loading) {
        return <div className="loading-container">Loading profile...</div>;
    }

    if (error) {
        return <div className="error-container">{error}</div>;
    }

    return (
        <>
            <div className="profile-page">
                <h1 className="page-title">My Profile</h1>
                <div className="profile-grid">
                    <div className="profile-card">
                        <h2 className="card-title">Account Information</h2>
                        {editMode ? (
                            <form onSubmit={handleSubmit} className="profile-form">
                                <div className="form-group">
                                    <label htmlFor="username">Username</label>
                                    <input id="username" type="text" name="username" value={formData.username || ''} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">Email</label>
                                    <input id="email" type="email" name="email" value={formData.email || ''} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="address">Address</label>
                                    <input id="address" type="text" name="address" value={formData.address || ''} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="phone">Phone</label>
                                    <input id="phone" type="text" name="phone" value={formData.phone || ''} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="dob">Date of Birth</label>
                                    <input id="dob" type="date" name="dob" value={formData.dob || ''} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="card_num">Card Number</label>
                                    <input id="card_num" type="text" name="card_num" value={formData.card_num || ''} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="bank_acc">Bank Account</label>
                                    <input id="bank_acc" type="text" name="bank_acc" value={formData.bank_acc || ''} onChange={handleChange} />
                                </div>
                                <div className="form-buttons">
                                    <button type="submit" className="btn-save">Save Changes</button>
                                    <button type="button" className="btn-cancel" onClick={handleCancel}>Cancel</button>
                                </div>
                            </form>
                        ) : (
                            <div className="profile-info">
                                <div className="info-item">
                                    <strong>Username:</strong><span>{userData.username}</span>
                                </div>
                                <div className="info-item">
                                    <strong>Email:</strong><span>{userData.email}</span>
                                </div>
                                <div className="info-item">
                                    <strong>Address:</strong><span>{userData.address || 'N/A'}</span>
                                </div>
                                <div className="info-item">
                                    <strong>Phone:</strong><span>{userData.phone || 'N/A'}</span>
                                </div>
                                <div className="info-item">
                                    <strong>Date of Birth:</strong><span>{userData.dob || 'N/A'}</span>
                                </div>
                                <div className="info-item">
                                    <strong>Card Number:</strong><span>{userData.card_num || 'N/A'}</span>
                                </div>
                                <div className="info-item">
                                    <strong>Bank Account:</strong><span>{userData.bank_acc || 'N/A'}</span>
                                </div>
                                <button className="btn-edit" onClick={handleEdit}>Edit Profile</button>
                            </div>
                        )}
                    </div>

                    <div className="history-card">
                        <h2 className="card-title">Purchase History</h2>
                        <div className="history-list">
                            {purchases.length > 0 ? (
                                purchases.map(p => (
                                    <div key={p.purchase_id} className="history-item">
                                        <p><strong>ID:</strong> {p.purchase_id}</p>
                                        <p><strong>Amount:</strong> ${p.amount}</p>
                                        <p>
                                            <strong>Status:</strong>
                                            <span className={`status status-${p.status?.toLowerCase()}`}>
                                                {p.status}
                                            </span>
                                        </p>
                                    </div>
                                ))
                            ) : <p>You have no past purchases.</p>}
                        </div>

                        <h2 className="card-title">Order History</h2>
                        <div className="history-list">
                            {orders.length > 0 ? (
                                orders.map(o => (
                                    <div key={o.order_id} className="history-item">
                                        <p><strong>ID:</strong> {o.order_id}</p>
                                        <p>
                                            <strong>Status:</strong>
                                            <span className={`status status-${o.status?.toLowerCase()}`}>
                                                {o.status}
                                            </span>
                                        </p>
                                        <p><strong>Tracking:</strong> {o.tracking_number || 'N/A'}</p>
                                    </div>
                                ))
                            ) : <p>You have no past orders.</p>}
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .profile-page {
                    padding: 3rem 2rem;
                    background-color: #000e02ff;
                    color: #e5e7eb;
                    min-height: 100vh;
                }
                .page-title {
                    font-size: 2.5rem;
                    font-weight: 800;
                    margin-bottom: 2rem;
                    color: #fff;
                    text-align: center;
                }
                .profile-grid {
                    display: grid;
                    grid-template-columns: 1fr 1.5fr;
                    gap: 2rem;
                    max-width: 1200px;
                    margin: 0 auto;
                }
                .profile-card, .history-card {
                    background-color: #090125ff;
                    border-radius: 12px;
                    padding: 2rem;
                    box-shadow: 0 8px 24px rgba(0,0,0,0.3);
                }
                .card-title {
                    font-size: 1.5rem;
                    font-weight: 700;
                    margin-bottom: 1.5rem;
                    padding-bottom: 0.5rem;
                    border-bottom: 1px solid #334155;
                    color: #93c5fd;
                }
                
                /* Profile Info & Form */
                .profile-info .info-item {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 1rem;
                    font-size: 1.1rem;
                }
                .profile-info .info-item strong {
                    color: #94a3b8;
                }
                .profile-info .info-item span {
                    color: #e5e7eb;
                    font-weight: 500;
                }
                .profile-form .form-group {
                    margin-bottom: 1.5rem;
                }
                .profile-form label {
                    display: block;
                    margin-bottom: 0.5rem;
                    font-weight: 600;
                    color: #94a3b8;
                }
                .profile-form input {
                    width: 100%;
                    padding: 0.75rem 1rem;
                    background: #0f172a;
                    color: #e5e7eb;
                    border: 1px solid #334155;
                    border-radius: 8px;
                    font-size: 1rem;
                    transition: border-color 0.3s, box-shadow 0.3s;
                }
                .profile-form input:focus {
                    outline: none;
                    border-color: #22d3ee;
                    box-shadow: 0 0 0 3px rgba(34, 211, 238, 0.2);
                }
                .form-buttons {
                    display: flex;
                    gap: 1rem;
                    margin-top: 1.5rem;
                }
                .btn-edit, .btn-save, .btn-cancel {
                    padding: 0.6rem 1.5rem;
                    border: none;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s;
                }
                .btn-edit, .btn-save {
                    background-color: #22d3ee;
                    color: #1e293b;
                }
                .btn-edit:hover, .btn-save:hover {
                    background-color: #06b6d4;
                    transform: translateY(-2px);
                }
                .btn-cancel {
                    background-color: #334155;
                    color: #e5e7eb;
                }
                .btn-cancel:hover {
                    background-color: #475569;
                }

                /* History Section */
                .history-card .card-title {
                    margin-top: 2rem;
                }
                .history-card .card-title:first-of-type {
                    margin-top: 0;
                }
                .history-list {
                    max-height: 300px;
                    overflow-y: auto;
                    padding-right: 1rem;
                }
                .history-item {
                    background-color: #0f172a;
                    padding: 1rem;
                    border-radius: 8px;
                    margin-bottom: 1rem;
                    border-left: 4px solid #22d3ee;
                }
                .history-item p {
                    margin: 0.3rem 0;
                }
                .status {
                    font-weight: 700;
                    padding: 0.2rem 0.5rem;
                    border-radius: 6px;
                    font-size: 0.9rem;
                }
                .status-completed, .status-delivered { background-color: #10b981; color: #f0fdf4; }
                .status-processing, .status-shipped { background-color: #f59e0b; color: #fffbeb; }
                .status-pending { background-color: #a855f7; color: #f5f3ff; }
                .status-cancelled { background-color: #ef4444; color: #fef2f2; }

                /* Responsive */
                @media (max-width: 992px) {
                    .profile-grid {
                        grid-template-columns: 1fr;
                    }
                }
                @media (max-width: 768px) {
                    .profile-page { padding: 2rem 1rem; }
                    .page-title { font-size: 2rem; }
                }
            `}</style>
        </>
    );
};

export default UserProfile;
