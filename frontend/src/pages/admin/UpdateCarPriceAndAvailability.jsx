import React, { useState } from 'react';
import axios from 'axios';
import './Admin.css';

const UpdateCarPriceAndAvailability = () => {
    const [carId, setCarId] = useState('');
    const [formData, setFormData] = useState({
        price: '',
        available: true
    });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.put(`http://localhost:8000/queries/cars/${carId}`, formData)
            .then(response => {
                setMessage(`Car ${response.data.model_name} updated successfully.`);
            })
            .catch(error => {
                setMessage(`Error updating car: ${error.response.data.detail}`);
            });
    };

    return (
        <div className="admin-page">
            <h1>Update Car Price and Availability</h1>
            <form onSubmit={handleSubmit} className="admin-form">
                <div className="form-group">
                    <label htmlFor="carId">Car ID</label>
                    <input
                        type="number"
                        name="carId"
                        id="carId"
                        value={carId}
                        onChange={(e) => setCarId(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="price">Price</label>
                    <input
                        type="number"
                        name="price"
                        id="price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="available">Available</label>
                    <input
                        type="checkbox"
                        name="available"
                        id="available"
                        checked={formData.available}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit">Update Car</button>
            </form>
            {message && <p className="text-center mt-4">{message}</p>}
        </div>
    );
};

export default UpdateCarPriceAndAvailability;
