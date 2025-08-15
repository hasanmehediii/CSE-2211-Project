import React, { useState, useEffect } from 'react';
import ReportPage from '../../components/ReportPage';
import './Admin.css';

const EmployeesAndOrdersHandled = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('http://localhost:8000/queries/employees-and-orders-handled')
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
            <h2>{item.name}</h2>
            <p><span className="font-bold">Employee ID:</span> {item.emp_id}</p>
            <p><span className="font-bold">Position:</span> {item.position}</p>
            <p><span className="font-bold">Total Shipments:</span> {item.total_shipments}</p>
            <p><span className="font-bold">Deliveries Completed:</span> {item.deliveries_completed}</p>
        </>
    );

    return (
        <ReportPage
            title="Employees and Orders Handled"
            loading={loading}
            error={error}
            data={data}
            renderItem={renderItem}
        />
    );
};

export default EmployeesAndOrdersHandled;
