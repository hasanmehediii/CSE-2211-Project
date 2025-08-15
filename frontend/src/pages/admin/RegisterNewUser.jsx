import React, { useState } from 'react';
import axios from 'axios';
import './Admin.css';

const RegisterNewUser = () => {
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
        address: '',
        phone: '',
        dob: '',
        card_num: '',
        bank_acc: ''
    });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:8000/queries/users', formData)
            .then(response => {
                setMessage(`User created successfully with ID: ${response.data.user_id}`);
            })
            .catch(error => {
                setMessage(`Error creating user: ${error.response.data.detail}`);
            });
    };

    return (
        <div className="admin-page">
            <h1>Register New User</h1>
            <form onSubmit={handleSubmit} className="admin-form">
                {Object.keys(formData).map(key => (
                    <div className="form-group" key={key}>
                        <label htmlFor={key}>{key.replace(/_/g, ' ')}</label>
                        <input
                            type={key === 'password' ? 'password' : (key === 'dob' ? 'date' : 'text')}
                            name={key}
                            id={key}
                            value={formData[key]}
                            onChange={handleChange}
                            required
                        />
                    </div>
                ))}
                <button type="submit">Register User</button>
            </form>
            {message && <p className="text-center mt-4">{message}</p>}
        </div>
    );
};

export default RegisterNewUser;
