import React, { useState } from 'react';
import ReportPage from '../../components/ReportPage';
import './Admin.css';

const CarsCheaperThanCategory = () => {
    const [cars, setCars] = useState([]);
    const [categoryId, setCategoryId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        fetch(`http://localhost:8000/queries/cars-cheaper-than-category/${categoryId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setCars(data);
                setLoading(false);
            })
            .catch(error => {
                setError(error.message);
                setLoading(false);
            });
    };

    const renderCar = (car) => (
        <>
            <h2>{car.model_name}</h2>
            <p><span className="font-bold">Manufacturer:</span> {car.manufacturer}</p>
            <p><span className="font-bold">Price:</span> ${car.price}</p>
        </>
    );

    const searchForm = (
        <form onSubmit={handleSubmit}>
            <input
                type="number"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                placeholder="Enter Category ID"
            />
            <button type="submit">Search</button>
        </form>
    );

    return (
        <ReportPage
            title="Cars Cheaper Than Category"
            loading={loading}
            error={error}
            data={cars}
            renderItem={renderCar}
            searchForm={searchForm}
        />
    );
};

export default CarsCheaperThanCategory;
