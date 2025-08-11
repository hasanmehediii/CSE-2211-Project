import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminNavbar from '../../components/AdminNavbar';
import Footer from '../../components/Footer';

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
        return <div style={styles.loading}>Loading users...</div>;
    }

    if (error) {
        return <div style={styles.error}>{error}</div>;
    }

    return (
        <div style={styles.pageContainer}>
            <AdminNavbar />
            <div style={styles.contentContainer}>
                <h2 style={styles.heading}>Manage Users</h2>
                {users.length === 0 ? (
                    <p style={styles.noData}>No users found.</p>
                ) : (
                    <div style={styles.tableContainer}>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>ID</th>
                                    <th style={styles.th}>Username</th>
                                    <th style={styles.th}>Email</th>
                                    <th style={styles.th}>Address</th>
                                    <th style={styles.th}>Phone Number</th>
                                    <th style={styles.th}>Date of Birth</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.user_id} style={styles.tr} onClick={() => handleRowClick(user.user_id)}>
                                        <td style={styles.td}>{user.user_id}</td>
                                        <td style={styles.td}>{user.username}</td>
                                        <td style={styles.td}>{user.email}</td>
                                        <td style={styles.td}>{user.address || 'N/A'}</td>
                                        <td style={styles.td}>{user.phone || 'N/A'}</td>
                                        <td style={styles.td}>{user.dob ? new Date(user.dob).toLocaleDateString() : 'N/A'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {showModal && selectedUser && (
                    <div style={modalStyles.overlay}>
                        <div style={modalStyles.modal}>
                            {!isEditing ? (
                                <>
                                    <h3 style={modalStyles.modalTitle}>User Details</h3>
                                    <p><strong>ID:</strong> {selectedUser.user_id}</p>
                                    <p><strong>Username:</strong> {selectedUser.username}</p>
                                    <p><strong>Email:</strong> {selectedUser.email}</p>
                                    <p><strong>Address:</strong> {selectedUser.address || 'N/A'}</p>
                                    <p><strong>Phone:</strong> {selectedUser.phone || 'N/A'}</p>
                                    <p><strong>Date of Birth:</strong> {selectedUser.dob ? new Date(selectedUser.dob).toLocaleDateString() : 'N/A'}</p>
                                    <p><strong>Card Number:</strong> {selectedUser.card_num || 'N/A'}</p>
                                    <p><strong>Bank Account:</strong> {selectedUser.bank_acc || 'N/A'}</p>

                                    <h4 style={modalStyles.subTitle}>Purchases:</h4>
                                    {selectedUser.purchases && selectedUser.purchases.length > 0 ? (
                                        <ul style={modalStyles.list}>
                                            {selectedUser.purchases.map(purchase => (
                                                <li key={purchase.purchase_id} style={modalStyles.listItem}>
                                                    Purchase ID: {purchase.purchase_id}, Amount: {purchase.amount}, Status: {purchase.status}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p>No purchases found.</p>
                                    )}

                                    <h4 style={modalStyles.subTitle}>Reviews:</h4>
                                    {selectedUser.reviews && selectedUser.reviews.length > 0 ? (
                                        <ul style={modalStyles.list}>
                                            {selectedUser.reviews.map(review => (
                                                <li key={review.review_id} style={modalStyles.listItem}>
                                                    Review ID: {review.review_id}, Car ID: {review.car_id}, Rating: {review.rating}, Text: {review.review_text || 'N/A'}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p>No reviews found.</p>
                                    )}
                                    <div style={modalStyles.buttonGroup}>
                                        <button onClick={handleEditClick} style={modalStyles.editButton}>Edit</button>
                                        <button onClick={() => handleDeleteUser(selectedUser.user_id)} style={modalStyles.deleteButton}>Delete</button>
                                        <button onClick={closeModal} style={modalStyles.closeButton}>Close</button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <h3 style={modalStyles.modalTitle}>Edit User</h3>
                                    <form onSubmit={handleUpdateUser} style={styles.form}>
                                        <div style={styles.formGroup}>
                                            <label style={styles.label}>Email:</label>
                                            <input type="email" name="email" value={editedUser.email} onChange={handleEditedUserInputChange} style={styles.input} required />
                                        </div>
                                        <div style={styles.formGroup}>
                                            <label style={styles.label}>Username:</label>
                                            <input type="text" name="username" value={editedUser.username} onChange={handleEditedUserInputChange} style={styles.input} required />
                                        </div>
                                        <div style={styles.formGroup}>
                                            <label style={styles.label}>Address:</label>
                                            <input type="text" name="address" value={editedUser.address || ''} onChange={handleEditedUserInputChange} style={styles.input} />
                                        </div>
                                        <div style={styles.formGroup}>
                                            <label style={styles.label}>Phone:</label>
                                            <input type="text" name="phone" value={editedUser.phone || ''} onChange={handleEditedUserInputChange} style={styles.input} />
                                        </div>
                                        <div style={styles.formGroup}>
                                            <label style={styles.label}>Date of Birth:</label>
                                            <input type="date" name="dob" value={editedUser.dob || ''} onChange={handleEditedUserInputChange} style={styles.input} />
                                        </div>
                                        <div style={styles.formGroup}>
                                            <label style={styles.label}>Card Number:</label>
                                            <input type="text" name="card_num" value={editedUser.card_num || ''} onChange={handleEditedUserInputChange} style={styles.input} />
                                        </div>
                                        <div style={styles.formGroup}>
                                            <label style={styles.label}>Bank Account:</label>
                                            <input type="text" name="bank_acc" value={editedUser.bank_acc || ''} onChange={handleEditedUserInputChange} style={styles.input} />
                                        </div>
                                        <div style={modalStyles.buttonGroup}>
                                            <button type="submit" style={modalStyles.updateButton}>Update User</button>
                                            <button onClick={() => setIsEditing(false)} style={modalStyles.cancelButton}>Cancel</button>
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
        maxWidth: '800px',
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
    buttonGroup: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '10px',
        marginTop: '20px',
    },
    editButton: {
        padding: '10px 20px',
        backgroundColor: '#4299e1',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '1rem',
        fontWeight: 'bold',
        transition: 'background-color 0.2s ease',
        '&:hover': {
            backgroundColor: '#3182ce',
        },
    },
    deleteButton: {
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
    updateButton: {
        padding: '10px 20px',
        backgroundColor: '#48bb78',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '1rem',
        fontWeight: 'bold',
        transition: 'background-color 0.2s ease',
        '&:hover': {
            backgroundColor: '#38a169',
        },
    },
    cancelButton: {
        padding: '10px 20px',
        backgroundColor: '#718096',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '1rem',
        fontWeight: 'bold',
        transition: 'background-color 0.2s ease',
        '&:hover': {
            backgroundColor: '#5f6b7d',
        },
    },
};

export default ManageUsers;