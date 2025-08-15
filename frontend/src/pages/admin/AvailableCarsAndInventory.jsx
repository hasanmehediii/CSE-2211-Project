import React, { useState, useEffect } from 'react';
import ReportPage from '../../components/ReportPage';
import './Admin.css';

const AvailableCarsAndInventory = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('http://localhost:8000/queries/available-cars-and-inventory')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setData(data);
                setLoading(false);
            })
            .catch(error => {
                setError(error.message);
                setLoading(false);
            });
    }, []);

    const renderItem = (item) => (
        <>
            <h2>{item.model_name}</h2>
            <p><span className="font-bold">Manufacturer:</span> {item.manufacturer}</p>
            <p><span className="font-bold">Quantity:</span> {item.quantity}</p>
            <p><span className="font-bold">Location:</span> {item.location}</p>
        </>
    );

    return (
        <ReportPage
            title="Available Cars and Inventory"
            loading={loading}
            error={error}
            data={data}
            renderItem={renderItem}
        />
    );
};

export default AvailableCarsAndInventory;
