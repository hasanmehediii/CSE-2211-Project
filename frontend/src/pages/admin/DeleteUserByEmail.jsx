import React, { useState } from 'react';
import axios from 'axios';
import './Admin.css';

const DeleteUserByEmail = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.delete(`http://localhost:8000/queries/users/${email}`)
            .then(response => {
                setMessage(`User ${response.data.username} deleted successfully.`);
            })
            .catch(error => {
                setMessage(`Error deleting user: ${error.response.data.detail}`);
            });
    };

    return (
        <div className="admin-page">
            <h1>Delete User by Email</h1>
            <form onSubmit={handleSubmit} className="admin-form">
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="bg-red-500 hover:bg-red-700">Delete User</button>
            </form>
            {message && <p className="text-center mt-4">{message}</p>}
        </div>
    );
};

export default DeleteUserByEmail;
