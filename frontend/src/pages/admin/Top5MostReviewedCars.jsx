import React, { useState, useEffect } from 'react';
import ReportPage from '../../components/ReportPage';
import './Admin.css';

const Top5MostReviewedCars = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('http://localhost:8000/queries/top-5-most-reviewed-cars')
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
            <p><span className="font-bold">Review Count:</span> {item.review_count}</p>
        </>
    );

    return (
        <ReportPage
            title="Top 5 Most Reviewed Cars"
            loading={loading}
            error={error}
            data={data}
            renderItem={renderItem}
        />
    );
};

export default Top5MostReviewedCars;
