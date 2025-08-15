import React, { useState, useEffect } from 'react';
import ReportPage from '../../components/ReportPage';
import './Admin.css';

const EmployeesAndShippingRecords = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('http://localhost:8000/queries/employees-and-shipping-records')
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
            <h2>{item.employee_name}</h2>
            <p><span className="font-bold">Employee ID:</span> {item.emp_id}</p>
            <p><span className="font-bold">Department:</span> {item.department}</p>
            <p><span className="font-bold">Ship ID:</span> {item.ship_id}</p>
            <p><span className="font-bold">Shipping Provider:</span> {item.shipping_provider}</p>
            <p><span className="font-bold">Shipping Status:</span> {item.shipping_status}</p>
            <p><span className="font-bold">Shipped Date:</span> {item.shipped_date}</p>
            <p><span className="font-bold">Delivery Date:</span> {item.delivery_date}</p>
        </>
    );

    return (
        <ReportPage
            title="Employees and Shipping Records"
            loading={loading}
            error={error}
            data={data}
            renderItem={renderItem}
        />
    );
};

export default EmployeesAndShippingRecords;
