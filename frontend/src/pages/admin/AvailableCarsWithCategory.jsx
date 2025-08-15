import React, { useState, useEffect } from 'react';
import ReportPage from '../../components/ReportPage';
import './Admin.css';

const AvailableCarsWithCategory = () => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('http://localhost:8000/queries/available-cars-with-category')
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
    }, []);

    const renderCar = (car) => (
        <>
            <h2>{car.model_name}</h2>
            <p><span className="font-bold">Manufacturer:</span> {car.manufacturer}</p>
            <p><span className="font-bold">Year:</span> {car.year}</p>
            <p><span className="font-bold">Price:</span> ${car.price}</p>
            <p><span className="font-bold">Category:</span> {car.category_name}</p>
        </>
    );

    return (
        <ReportPage
            title="Available Cars with Category"
            loading={loading}
            error={error}
            data={cars}
            renderItem={renderCar}
        />
    );
};

export default AvailableCarsWithCategory;
