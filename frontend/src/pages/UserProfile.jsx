import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import axios from 'axios';
import api from '../api.jsx';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';

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
                    const response = await api.get(`/users/${user.user_id}/all`);
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
        api.put(`/users/${user.user_id}`, formData)
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
        return <div className="message loading">Loading profile...</div>;
    }

    if (error) {
        return <div className="message error-message">{error}</div>;
    }

    return (
        <>
            <div className="page">
                <Navbar />
                <section className="profile-section">
                    <div className="profile-content">
                        <div className="profile-pill">Goriber Gari • Profile</div>
                        <h1 className="profile-title">
                            My <span className="accent">Profile</span>
                        </h1>
                        <p className="profile-subtitle">
                            Manage your account details, view purchase history, and track orders.
                        </p>
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
                                            <button type="submit" className="btn-save primary">Save Changes</button>
                                            <button type="button" className="btn-cancel ghost" onClick={handleCancel}>Cancel</button>
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
                                        <button className="btn-edit primary" onClick={handleEdit}>Edit Profile</button>
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
                                    ) : <p className="no-data">You have no past purchases.</p>}
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
                                    ) : <p className="no-data">You have no past orders.</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <Footer />
            </div>

            <style jsx>{`
                :root {
                  --bg: #020617;
                  --card-bg: rgba(15, 23, 42, 0.96);
                  --card-border: rgba(148, 163, 184, 0.35);
                  --accent: #22d3ee;
                  --accent-strong: #e11d48;
                  --text-main: #e5e7eb;
                  --text-muted: #9ca3af;
                }

                * {
                  box-sizing: border-box;
                }

                body {
                  margin: 0;
                  background: var(--bg);
                  color: var(--text-main);
                  font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
                }

                .page {
                  min-height: 100vh;
                  background:
                    radial-gradient(circle at top left, rgba(56, 189, 248, 0.15), transparent 55%),
                    radial-gradient(circle at bottom right, rgba(244, 63, 94, 0.22), transparent 60%),
                    var(--bg);
                  color: #ffffff;
                  display: flex;
                  flex-direction: column;
                  font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
                  overflow-x: hidden;
                }

                @keyframes fadeUp {
                  from {
                    opacity: 0;
                    transform: translateY(16px);
                  }
                  to {
                    opacity: 1;
                    transform: translateY(0);
                  }
                }

                /* PROFILE SECTION */

                .profile-section {
                  width: 100%;
                  padding: 2rem clamp(1.5rem, 6vw, 4rem) 1.5rem;
                }

                .profile-content {
                  max-width: 1120px;
                  margin: 0 auto;
                  display: flex;
                  flex-direction: column;
                  gap: 1.3rem;
                  animation: fadeUp 0.6s ease-out;
                }

                .profile-pill {
                  display: inline-flex;
                  align-items: center;
                  gap: 0.4rem;
                  padding: 0.25rem 1rem;
                  border-radius: 999px;
                  font-size: 0.8rem;
                  letter-spacing: 0.14em;
                  text-transform: uppercase;
                  background: rgba(15, 23, 42, 0.85);
                  border: 1px solid rgba(148, 163, 184, 0.7);
                  color: var(--text-muted);
                  backdrop-filter: blur(18px);
                  width: fit-content;
                }

                .profile-title {
                  font-size: clamp(2.5rem, 4.8vw, 3.4rem);
                  line-height: 1.08;
                  font-weight: 800;
                  letter-spacing: 0.02em;
                  color: #f9fafb;
                }

                .profile-title .accent {
                  background: linear-gradient(120deg, var(--accent), var(--accent-strong));
                  -webkit-background-clip: text;
                  background-clip: text;
                  color: transparent;
                }

                .profile-subtitle {
                  font-size: 0.96rem;
                  color: var(--text-muted);
                  max-width: 520px;
                }

                .profile-grid {
                  display: grid;
                  grid-template-columns: 1fr 1fr;
                  gap: 1.5rem;
                }

                .profile-card,
                .history-card {
                  background: var(--card-bg);
                  border-radius: 1.2rem;
                  border: 1px solid var(--card-border);
                  box-shadow: 0 18px 48px rgba(15, 23, 42, 0.98);
                  padding: 1.5rem;
                }

                .card-title {
                  font-size: 1.35rem;
                  font-weight: 700;
                  color: #f9fafb;
                  margin-bottom: 1rem;
                }

                .profile-info {
                  display: flex;
                  flex-direction: column;
                  gap: 0.75rem;
                }

                .info-item {
                  display: flex;
                  justify-content: space-between;
                  font-size: 0.92rem;
                  color: var(--text-muted);
                }

                .info-item strong {
                  color: #f9fafb;
                }

                .profile-form {
                  display: flex;
                  flex-direction: column;
                  gap: 1.2rem;
                }

                .form-group label {
                  display: block;
                  font-size: 1rem;
                  font-weight: 500;
                  color: #f9fafb;
                  margin-bottom: 0.4rem;
                }

                .form-group input {
                  width: 100%;
                  padding: 0.6rem 1rem;
                  font-size: 0.9rem;
                  border: none;
                  border-radius: 0.5rem;
                  background: rgba(15, 23, 42, 0.85);
                  color: #f9fafb;
                  outline: none;
                  border: 1px solid rgba(148, 163, 184, 0.7);
                  transition: border-color 0.2s ease, box-shadow 0.2s ease;
                }

                .form-group input:focus {
                  border-color: var(--accent);
                  box-shadow: 0 0 0 2px rgba(34, 211, 238, 0.3);
                }

                .form-buttons {
                  display: flex;
                  gap: 0.85rem;
                }

                .btn-save,
                .btn-cancel,
                .btn-edit {
                  padding: 0.75rem 1.6rem;
                  border-radius: 999px;
                  border: none;
                  cursor: pointer;
                  font-size: 0.9rem;
                  font-weight: 600;
                  display: inline-flex;
                  align-items: center;
                  justify-content: center;
                  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease, border 0.2s ease;
                  white-space: nowrap;
                }

                .btn-save.primary,
                .btn-edit.primary {
                  background: linear-gradient(to right, var(--accent-strong), #f97316);
                  color: #f9fafb;
                  box-shadow: 0 20px 45px rgba(248, 113, 113, 0.65);
                }

                .btn-save.primary:hover,
                .btn-edit.primary:hover {
                  transform: translateY(-2px);
                  box-shadow: 0 26px 60px rgba(248, 113, 113, 0.75);
                }

                .btn-cancel.ghost {
                  background: rgba(15, 23, 42, 0.85);
                  border: 1px solid rgba(148, 163, 184, 0.9);
                  color: var(--text-main);
                }

                .btn-cancel.ghost:hover {
                  background: rgba(15, 23, 42, 1);
                  transform: translateY(-1px);
                }

                .history-list {
                  display: flex;
                  flex-direction: column;
                  gap: 1.2rem;
                }

                .history-item {
                  background: radial-gradient(circle at top left, rgba(56, 189, 248, 0.16), transparent 60%),
                    rgba(15, 23, 42, 0.85);
                  border-radius: 1rem;
                  border: 1px solid var(--card-border);
                  padding: 1rem;
                  font-size: 0.92rem;
                  color: var(--text-muted);
                }

                .history-item p {
                  margin: 0.3rem 0;
                }

                .history-item strong {
                  color: #f9fafb;
                }

                .status {
                  padding: 0.2rem 0.75rem;
                  border-radius: 999px;
                  font-size: 0.8rem;
                  font-weight: 600;
                  margin-left: 0.5rem;
                }

                .status-completed,
                .status-delivered {
                  background: rgba(16, 185, 129, 0.2);
                  color: #10b981;
                  border: 1px solid rgba(16, 185, 129, 0.5);
                }

                .status-processing,
                .status-shipped {
                  background: rgba(245, 158, 11, 0.2);
                  color: #f59e0b;
                  border: 1px solid rgba(245, 158, 11, 0.5);
                }

                .status-pending {
                  background: rgba(168, 85, 247, 0.2);
                  color: #a855f7;
                  border: 1px solid rgba(168, 85, 247, 0.5);
                }

                .status-cancelled {
                  background: rgba(239, 68, 68, 0.2);
                  color: #ef4444;
                  border: 1px solid rgba(239, 68, 68, 0.5);
                }

                .no-data {
                  font-size: 0.92rem;
                  color: var(--text-muted);
                  text-align: center;
                  padding: 1rem;
                  background: rgba(15, 23, 42, 0.85);
                  border-radius: 1rem;
                  border: 1px dashed rgba(148, 163, 184, 0.5);
                }

                .message {
                  text-align: center;
                  font-size: 0.95rem;
                  padding: 1.5rem 1rem;
                  border-radius: 0.9rem;
                  margin: 2rem auto;
                  max-width: 600px;
                }

                .loading {
                  color: var(--text-muted);
                  background: rgba(15, 23, 42, 0.8);
                  border: 1px dashed rgba(148, 163, 184, 0.5);
                }

                .error-message {
                  color: #fecaca;
                  background: rgba(127, 29, 29, 0.65);
                  border: 1px solid rgba(248, 113, 113, 0.85);
                }

                /* RESPONSIVE */

                @media (max-width: 900px) {
                  .profile-section {
                    padding: 1.8rem 1.4rem 1.3rem;
                  }

                  .profile-grid {
                    grid-template-columns: 1fr;
                  }
                }

                @media (max-width: 768px) {
                  .profile-section {
                    padding: 1.6rem 1.1rem 1.1rem;
                  }

                  .profile-title {
                    font-size: 2.2rem;
                  }

                  .profile-subtitle {
                    font-size: 0.9rem;
                  }

                  .card-title {
                    font-size: 1.2rem;
                  }

                  .profile-card,
                  .history-card {
                    padding: 1.2rem;
                  }

                  .form-group input {
                    padding: 0.5rem 1rem;
                    font-size: 0.85rem;
                  }

                  .btn-save,
                  .btn-cancel,
                  .btn-edit {
                    padding: 0.6rem 1.3rem;
                    font-size: 0.85rem;
                  }

                  .history-item {
                    padding: 0.9rem;
                    font-size: 0.85rem;
                  }
                }

                @media (max-width: 480px) {
                  .profile-title {
                    font-size: 1.9rem;
                  }

                  .profile-subtitle {
                    font-size: 0.84rem;
                  }

                  .profile-card,
                  .history-card {
                    padding: 1rem;
                  }

                  .form-group input {
                    padding: 0.4rem 1rem;
                    font-size: 0.8rem;
                  }

                  .btn-save,
                  .btn-cancel,
                  .btn-edit {
                    padding: 0.5rem 1.3rem;
                    font-size: 0.8rem;
                  }

                  .history-item {
                    padding: 0.8rem;
                    font-size: 0.8rem;
                  }
                }
            `}</style>
        </>
    );
};

export default UserProfile;