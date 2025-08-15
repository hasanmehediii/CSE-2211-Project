import React, { useState, useEffect } from 'react';
import ReportPage from '../../components/ReportPage';
import './Admin.css';

const UsersWithCompletedPurchases = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('http://localhost:8000/queries/users-with-completed-purchases')
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
            <h2>{item.username}</h2>
            <p><span className="font-bold">Email:</span> {item.email}</p>
        </>
    );

    return (
        <ReportPage
            title="Users with Completed Purchases"
            loading={loading}
            error={error}
            data={data}
            renderItem={renderItem}
        />
    );
};

export default UsersWithCompletedPurchases;
