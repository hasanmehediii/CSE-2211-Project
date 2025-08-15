import React, { useState, useEffect } from 'react';
import ReportPage from '../../components/ReportPage';
import './Admin.css';

const VisibleReviews = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('http://localhost:8000/queries/visible-reviews')
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
            <p><span className="font-bold">User:</span> {item.username}</p>
            <p><span className="font-bold">Rating:</span> {item.rating}</p>
            <p className="text-gray-400">"{item.review_text}"</p>
        </>
    );

    return (
        <ReportPage
            title="Visible Reviews"
            loading={loading}
            error={error}
            data={data}
            renderItem={renderItem}
        />
    );
};

export default VisibleReviews;
