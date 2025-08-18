import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminNavbar from '../../components/AdminNavbar';
import Footer from '../../components/Footer';

const ManageCars = () => {
    const [cars, setCars] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newCar, setNewCar] = useState({
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
        price: '',
        available: true,
        image_link: '',
        category_id: '',
        quantity: 0,
    });
    const [selectedCar, setSelectedCar] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedCar, setEditedCar] = useState(null);

    useEffect(() => {
        fetchCars();
        fetchCategories();
    }, []);

    const fetchCars = async () => {
        try {
            const response = await axios.get('http://localhost:8000/admin/cars');
            setCars(response.data);
        } catch (err) {
            setError('Failed to fetch cars.');
            console.error('Error fetching cars:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:8000/categories/');
            setCategories(response.data);
        } catch (err) {
            console.error('Error fetching categories:', err);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        const val = type === 'checkbox' ? checked : value;
        setNewCar({ ...newCar, [name]: val });
    };

    const handleAddCar = async (e) => {
        e.preventDefault();
        try {
            const carData = { ...newCar };
            delete carData.quantity; // Remove quantity before sending
            const response = await axios.post('http://localhost:8000/admin/cars', carData);
            const newCarId = response.data.car_id;

            // Now set the stock for the new car
            await axios.put(`http://localhost:8000/admin/cars/${newCarId}/stock`, { quantity: newCar.quantity });

            alert('Car added successfully!');
            setNewCar({
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
                price: '',
                available: true,
                image_link: '',
                category_id: '',
                quantity: 0,
            });
            fetchCars(); // Refresh car list
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to add car.');
            console.error('Error adding car:', err);
        }
    };

    const handleRowClick = async (carId) => {
        try {
            const response = await axios.get(`http://localhost:8000/admin/cars/${carId}`);
            setSelectedCar(response.data);
            setEditedCar(response.data);
            setShowModal(true);
            setIsEditing(false);
        } catch (err) {
            setError('Failed to fetch car details.');
            console.error('Error fetching car details:', err);
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedCar(null);
        setIsEditing(false);
        setEditedCar(null);
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleEditedCarInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        const val = type === 'checkbox' ? checked : value;
        setEditedCar({ ...editedCar, [name]: val });
    };

    const handleUpdateCar = async (e) => {
        e.preventDefault();
        try {
            const carData = { ...editedCar };
            const newQuantity = carData.quantity;
            delete carData.quantity; // This field does not exist on the car model

            // Update car details
            await axios.put(`http://localhost:8000/admin/cars/${editedCar.car_id}`, carData);

            // Update stock quantity
            await axios.put(`http://localhost:8000/admin/cars/${editedCar.car_id}/stock`, { quantity: newQuantity });

            alert('Car updated successfully!');
            fetchCars();
            closeModal();
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to update car.');
            console.error('Error updating car:', err);
        }
    };

    const handleDeleteCar = async (carId) => {
        if (window.confirm('Are you sure you want to delete this car?')) {
            try {
                await axios.delete(`http://localhost:8000/admin/cars/${carId}`);
                alert('Car deleted successfully!');
                fetchCars();
                closeModal();
            } catch (err) {
                setError(err.response?.data?.detail || 'Failed to delete car.');
                console.error('Error deleting car:', err);
            }
        }
    };

    if (loading) {
        return <div style={styles.loading}>Loading cars...</div>;
    }

    if (error) {
        return <div style={styles.error}>{error}</div>;
    }

    return (
        <div style={styles.pageContainer}>
            <AdminNavbar />
            <div style={styles.contentContainer}>
                <h2 style={styles.heading}>Manage Cars</h2>

                <div style={styles.formSection}>
                    <h3 style={styles.subHeading}>Add New Car</h3>
                    <form onSubmit={handleAddCar} style={styles.form}>
                        {/* Form inputs for new car... */}
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Model Number:</label>
                            <input type="text" name="modelnum" value={newCar.modelnum} onChange={handleInputChange} style={styles.input} required />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Manufacturer:</label>
                            <input type="text" name="manufacturer" value={newCar.manufacturer} onChange={handleInputChange} style={styles.input} />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Model Name:</label>
                            <input type="text" name="model_name" value={newCar.model_name} onChange={handleInputChange} style={styles.input} />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Year:</label>
                            <input type="number" name="year" value={newCar.year} onChange={handleInputChange} style={styles.input} />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Quantity:</label>
                            <input type="number" name="quantity" value={newCar.quantity} onChange={handleInputChange} style={styles.input} />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Price:</label>
                            <input type="number" name="price" value={newCar.price} onChange={handleInputChange} style={styles.input} />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Category:</label>
                            <select name="category_id" value={newCar.category_id} onChange={handleInputChange} style={styles.select} required>
                                <option value="">Select a Category</option>
                                {categories.map(cat => (
                                    <option key={cat.category_id} value={cat.category_id}>{cat.category_name}</option>
                                ))}
                            </select>
                        </div>
                        <button type="submit" style={styles.button}>Add Car</button>
                    </form>
                </div>

                <h3 style={styles.subHeading}>All Cars</h3>
                <div style={styles.tableContainer}>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>ID</th>
                                <th style={styles.th}>Manufacturer</th>
                                <th style={styles.th}>Model Name</th>
                                <th style={styles.th}>Price</th>
                                <th style={styles.th}>Quantity</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cars.map((car) => (
                                <tr key={car.car_id} style={styles.tr} onClick={() => handleRowClick(car.car_id)}>
                                    <td style={styles.td}>{car.car_id}</td>
                                    <td style={styles.td}>{car.manufacturer}</td>
                                    <td style={styles.td}>{car.model_name}</td>
                                    <td style={styles.td}>{car.price}</td>
                                    <td style={styles.td}>{car.quantity}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {showModal && editedCar && (
                    <div style={modalStyles.overlay}>
                        <div style={modalStyles.modal}>
                            {!isEditing ? (
                                <>
                                    <h3 style={modalStyles.modalTitle}>Car Details</h3>
                                    <p><strong>ID:</strong> {selectedCar.car_id}</p>
                                    <p><strong>Model Name:</strong> {selectedCar.model_name}</p>
                                    <p><strong>Manufacturer:</strong> {selectedCar.manufacturer}</p>
                                    <p><strong>Price:</strong> {selectedCar.price}</p>
                                    <p><strong>Quantity:</strong> {selectedCar.quantity}</p>
                                    <div style={modalStyles.buttonGroup}>
                                        <button onClick={handleEditClick} style={modalStyles.editButton}>Edit</button>
                                        <button onClick={() => handleDeleteCar(selectedCar.car_id)} style={modalStyles.deleteButton}>Delete</button>
                                        <button onClick={closeModal} style={modalStyles.closeButton}>Close</button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <h3 style={modalStyles.modalTitle}>Edit Car</h3>
                                    <form onSubmit={handleUpdateCar} style={styles.form}>
                                        <div style={styles.formGroup}>
                                            <label style={styles.label}>Model Name:</label>
                                            <input type="text" name="model_name" value={editedCar.model_name} onChange={handleEditedCarInputChange} style={styles.input} />
                                        </div>
                                        <div style={styles.formGroup}>
                                            <label style={styles.label}>Manufacturer:</label>
                                            <input type="text" name="manufacturer" value={editedCar.manufacturer} onChange={handleEditedCarInputChange} style={styles.input} />
                                        </div>
                                        <div style={styles.formGroup}>
                                            <label style={styles.label}>Price:</label>
                                            <input type="number" name="price" value={editedCar.price} onChange={handleEditedCarInputChange} style={styles.input} />
                                        </div>
                                        <div style={styles.formGroup}>
                                            <label style={styles.label}>Quantity:</label>
                                            <input type="number" name="quantity" value={editedCar.quantity} onChange={handleEditedCarInputChange} style={styles.input} />
                                        </div>
                                        <div style={modalStyles.buttonGroup}>
                                            <button type="submit" style={modalStyles.updateButton}>Update Car</button>
                                            <button onClick={() => setIsEditing(false)} style={modalStyles.cancelButton}>Cancel</button>
                                        </div>
                                    </form>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

// Styles... (keeping them the same as they are extensive)
const styles = {
    pageContainer: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: '#1a202c',
        color: '#ffffff',
    },
    contentContainer: {
        flexGrow: 1,
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        background: 'linear-gradient(135deg, #2d3748, #1a202c)',
    },
    heading: {
        fontSize: '2.5rem',
        color: '#667eea',
        marginBottom: '20px',
        textAlign: 'center',
        textShadow: '0 0 8px rgba(102, 126, 234, 0.5)',
    },
    subHeading: {
        fontSize: '1.8rem',
        color: '#a3bffa',
        marginBottom: '15px',
        marginTop: '30px',
        borderBottom: '1px solid #4a5568',
        paddingBottom: '10px',
    },
    formSection: {
        backgroundColor: '#2d3748',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
        marginBottom: '30px',
    },
    form: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '15px',
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
    },
    label: {
        marginBottom: '5px',
        fontSize: '0.9rem',
        color: '#cbd5e0',
        fontWeight: 'bold',
    },
    input: {
        padding: '10px',
        border: '1px solid #4a5568',
        borderRadius: '4px',
        fontSize: '1rem',
        backgroundColor: '#1a202c',
        color: '#ffffff',
    },
    select: {
        padding: '10px',
        border: '1px solid #4a5568',
        borderRadius: '4px',
        fontSize: '1rem',
        backgroundColor: '#1a202c',
        color: '#ffffff',
    },
    button: {
        gridColumn: '1 / -1',
        padding: '10px 20px',
        backgroundColor: '#667eea',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '1rem',
        fontWeight: 'bold',
    },
    tableContainer: {
        overflowX: 'auto',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
        backgroundColor: '#2d3748',
        marginTop: '20px',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
    },
    th: {
        padding: '12px 15px',
        textAlign: 'left',
        backgroundColor: '#4a5568',
        color: 'white',
        textTransform: 'uppercase',
        fontSize: '0.85rem',
    },
    tr: {
        borderBottom: '1px solid #4a5568',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
    },
    td: {
        padding: '12px 15px',
        fontSize: '0.9rem',
        color: '#cbd5e0',
    },
    loading: {
        textAlign: 'center',
        padding: '50px',
        fontSize: '1.5rem',
    },
    error: {
        textAlign: 'center',
        padding: '50px',
        fontSize: '1.5rem',
        color: 'red',
    },
    noData: {
        textAlign: 'center',
        padding: '50px',
        fontSize: '1.2rem',
    },
};

const modalStyles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
    },
    modal: {
        backgroundColor: '#2d3748',
        padding: '30px',
        borderRadius: '8px',
        width: '90%',
        maxWidth: '600px',
        maxHeight: '90vh',
        overflowY: 'auto',
    },
    modalTitle: {
        fontSize: '1.8rem',
        color: '#667eea',
        marginBottom: '20px',
    },
    buttonGroup: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '10px',
        marginTop: '20px',
    },
    editButton: {
        padding: '10px 20px',
        backgroundColor: '#4299e1',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    deleteButton: {
        padding: '10px 20px',
        backgroundColor: '#e53e3e',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    updateButton: {
        padding: '10px 20px',
        backgroundColor: '#48bb78',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    cancelButton: {
        padding: '10px 20px',
        backgroundColor: '#718096',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    closeButton: {
        padding: '10px 20px',
        backgroundColor: '#a0aec0',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    carImage: {
        maxWidth: '100%',
        height: 'auto',
        borderRadius: '8px',
        marginTop: '10px',
    },
};

export default ManageCars;