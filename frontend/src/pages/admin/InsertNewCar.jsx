import React, { useState } from 'react';
import axios from 'axios';
import './Admin.css';
import AdminNavbar from '../../components/AdminNavbar';
import Footer from '../../components/Footer';

const InsertNewCar = () => {
    const [formData, setFormData] = useState({
        category_id: '',
        modelnum: '',
        manufacturer: '',
        model_name: '',
        year: '',
        engine_type: '',
        transmission: '',
        color: '',
        mileage: '',
        fuel_capacity: '',
        seating_capacity: '',
        price: ''
    });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:8000/queries/cars', formData)
            .then(response => {
                setMessage(`Car created successfully with ID: ${response.data.car_id}`);
            })
            .catch(error => {
                setMessage(`Error creating car: ${error.response.data.detail}`);
            });
    };

    return (
        <div className="page-container">
            <AdminNavbar />
            <div className="content-container">
                <div className="admin-page">
                    <h2>Insert New Car</h2>
                    <form onSubmit={handleSubmit} className="admin-form">
                        {Object.keys(formData).map(key => (
                            <div className="form-group" key={key}>
                                <label htmlFor={key}>{key.replace(/_/g, ' ')}</label>
                                <input
                                    type={key.includes('id') || key.includes('year') || key.includes('mileage') || key.includes('capacity') || key.includes('price') ? 'number' : 'text'}
                                    name={key}
                                    id={key}
                                    value={formData[key]}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        ))}
                        <button type="submit">Insert Car</button>
                    </form>
                    {message && <p className="text-center mt-4">{message}</p>}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default InsertNewCar;
