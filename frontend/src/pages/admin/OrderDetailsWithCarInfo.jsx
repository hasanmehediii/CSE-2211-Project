import React, { useState, useEffect } from 'react';
import ReportPage from '../../components/ReportPage';
import './Admin.css';

const OrderDetailsWithCarInfo = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('http://localhost:8000/queries/order-details-with-car-info')
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
            <h2>Order ID: {item.order_id}</h2>
            <p><span className="font-bold">Order Date:</span> {item.order_date}</p>
            <p><span className="font-bold">Model Name:</span> {item.model_name}</p>
        </>
    );

    return (
        <ReportPage
            title="Order Details with Car Info"
            loading={loading}
            error={error}
            data={data}
            renderItem={renderItem}
        />
    );
};

export default OrderDetailsWithCarInfo;
