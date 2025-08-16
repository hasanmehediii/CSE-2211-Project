import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminNavbar from '../../components/AdminNavbar';
import Footer from '../../components/Footer';
import './Admin.css';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedUser, setEditedUser] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:8000/admin/users');
            setUsers(response.data);
        } catch (err) {
            setError('Failed to fetch users.');
            console.error('Error fetching users:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleRowClick = async (userId) => {
        try {
            const response = await axios.get(`http://localhost:8000/admin/users/${userId}`);
            setSelectedUser(response.data);
            setEditedUser(response.data); // Initialize editedUser with selectedUser data
            setShowModal(true);
            setIsEditing(false); // Start in view mode
        } catch (err) {
            setError('Failed to fetch user details.');
            console.error('Error fetching user details:', err);
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedUser(null);
        setIsEditing(false);
        setEditedUser(null);
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleEditedUserInputChange = (e) => {
        const { name, value } = e.target;
        setEditedUser({ ...editedUser, [name]: value });
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:8000/admin/users/${editedUser.user_id}`, editedUser);
            alert('User updated successfully!');
            fetchUsers(); // Refresh user list
            closeModal();
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to update user.');
            console.error('Error updating user:', err);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await axios.delete(`http://localhost:8000/admin/users/${userId}`);
                alert('User deleted successfully!');
                fetchUsers(); // Refresh user list
                closeModal();
            } catch (err) {
                setError(err.response?.data?.detail || 'Failed to delete user.');
                console.error('Error deleting user:', err);
            }
        }
    };

    if (loading) {
        return <div className="loading">Loading users...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="page-container">
            <AdminNavbar />
            <div className="content-container">
                <h2 className="admin-page-heading">Manage Users</h2>
                {users.length === 0 ? (
                    <p className="no-data">No users found.</p>
                ) : (
                    <div className="table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>Address</th>
                                    <th>Phone Number</th>
                                    <th>Date of Birth</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.user_id} onClick={() => handleRowClick(user.user_id)}>
                                        <td>{user.user_id}</td>
                                        <td>{user.username}</td>
                                        <td>{user.email}</td>
                                        <td>{user.address || 'N/A'}</td>
                                        <td>{user.phone || 'N/A'}</td>
                                        <td>{user.dob ? new Date(user.dob).toLocaleDateString() : 'N/A'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {showModal && selectedUser && (
                    <div className="modal-overlay">
                        <div className="modal">
                            {!isEditing ? (
                                <>
                                    <h3 className="modal-title">User Details</h3>
                                    <p><strong>ID:</strong> {selectedUser.user_id}</p>
                                    <p><strong>Username:</strong> {selectedUser.username}</p>
                                    <p><strong>Email:</strong> {selectedUser.email}</p>
                                    <p><strong>Address:</strong> {selectedUser.address || 'N/A'}</p>
                                    <p><strong>Phone:</strong> {selectedUser.phone || 'N/A'}</p>
                                    <p><strong>Date of Birth:</strong> {selectedUser.dob ? new Date(selectedUser.dob).toLocaleDateString() : 'N/A'}</p>
                                    <p><strong>Card Number:</strong> {selectedUser.card_num || 'N/A'}</p>
                                    <p><strong>Bank Account:</strong> {selectedUser.bank_acc || 'N/A'}</p>

                                    <h4 className="modal-subtitle">Purchases:</h4>
                                    {selectedUser.purchases && selectedUser.purchases.length > 0 ? (
                                        <ul className="modal-list">
                                            {selectedUser.purchases.map(purchase => (
                                                <li key={purchase.purchase_id} className="modal-list-item">
                                                    Purchase ID: {purchase.purchase_id}, Amount: {purchase.amount}, Status: {purchase.status}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p>No purchases found.</p>
                                    )}

                                    <h4 className="modal-subtitle">Reviews:</h4>
                                    {selectedUser.reviews && selectedUser.reviews.length > 0 ? (
                                        <ul className="modal-list">
                                            {selectedUser.reviews.map(review => (
                                                <li key={review.review_id} className="modal-list-item">
                                                    Review ID: {review.review_id}, Car ID: {review.car_id}, Rating: {review.rating}, Text: {review.review_text || 'N/A'}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p>No reviews found.</p>
                                    )}
                                    <div className="button-group">
                                        <button onClick={handleEditClick} className="edit-button">Edit</button>
                                        <button onClick={() => handleDeleteUser(selectedUser.user_id)} className="delete-button">Delete</button>
                                        <button onClick={closeModal} className="cancel-button">Close</button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <h3 className="modal-title">Edit User</h3>
                                    <form onSubmit={handleUpdateUser} className="admin-form">
                                        <div className="form-group">
                                            <label>Email:</label>
                                            <input type="email" name="email" value={editedUser.email} onChange={handleEditedUserInputChange} required />
                                        </div>
                                        <div className="form-group">
                                            <label>Username:</label>
                                            <input type="text" name="username" value={editedUser.username} onChange={handleEditedUserInputChange} required />
                                        </div>
                                        <div className="form-group">
                                            <label>Address:</label>
                                            <input type="text" name="address" value={editedUser.address || ''} onChange={handleEditedUserInputChange} />
                                        </div>
                                        <div className="form-group">
                                            <label>Phone:</label>
                                            <input type="text" name="phone" value={editedUser.phone || ''} onChange={handleEditedUserInputChange} />
                                        </div>
                                        <div className="form-group">
                                            <label>Date of Birth:</label>
                                            <input type="date" name="dob" value={editedUser.dob || ''} onChange={handleEditedUserInputChange} />
                                        </div>
                                        <div className="form-group">
                                            <label>Card Number:</label>
                                            <input type="text" name="card_num" value={editedUser.card_num || ''} onChange={handleEditedUserInputChange} />
                                        </div>
                                        <div className="form-group">
                                            <label>Bank Account:</label>
                                            <input type="text" name="bank_acc" value={editedUser.bank_acc || ''} onChange={handleEditedUserInputChange} />
                                        </div>
                                        <div className="button-group">
                                            <button type="submit" className="update-button">Update User</button>
                                            <button type="button" onClick={() => setIsEditing(false)} className="cancel-button">Cancel</button>
                                        </div>
                                    </form>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default ManageUsers;
