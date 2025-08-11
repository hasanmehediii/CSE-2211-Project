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
        setNewCar({ ...newCar, [name]: type === 'checkbox' ? checked : value });
    };

    const handleAddCar = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8000/admin/cars', newCar);
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
            setEditedCar(response.data); // Initialize editedCar with selectedCar data
            setShowModal(true);
            setIsEditing(false); // Start in view mode
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
        setEditedCar({ ...editedCar, [name]: type === 'checkbox' ? checked : value });
    };

    const handleUpdateCar = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:8000/admin/cars/${editedCar.car_id}`, editedCar);
            alert('Car updated successfully!');
            fetchCars(); // Refresh car list
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
                fetchCars(); // Refresh car list
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
                            <label style={styles.label}>Engine Type:</label>
                            <input type="text" name="engine_type" value={newCar.engine_type} onChange={handleInputChange} style={styles.input} />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Transmission:</label>
                            <input type="text" name="transmission" value={newCar.transmission} onChange={handleInputChange} style={styles.input} />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Color:</label>
                            <input type="text" name="color" value={newCar.color} onChange={handleInputChange} style={styles.input} />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Mileage:</label>
                            <input type="number" name="mileage" value={newCar.mileage} onChange={handleInputChange} style={styles.input} />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Fuel Capacity:</label>
                            <input type="number" name="fuel_capacity" value={newCar.fuel_capacity} onChange={handleInputChange} style={styles.input} />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Seating Capacity:</label>
                            <input type="number" name="seating_capacity" value={newCar.seating_capacity} onChange={handleInputChange} style={styles.input} />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Price:</label>
                            <input type="number" name="price" value={newCar.price} onChange={handleInputChange} style={styles.input} />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Available:</label>
                            <input type="checkbox" name="available" checked={newCar.available} onChange={handleInputChange} style={{ ...styles.input, width: 'auto' }} />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Image Link:</label>
                            <input type="text" name="image_link" value={newCar.image_link} onChange={handleInputChange} style={styles.input} />
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
                {cars.length === 0 ? (
                    <p style={styles.noData}>No cars found.</p>
                ) : (
                    <div style={styles.tableContainer}>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>ID</th>
                                    <th style={styles.th}>Manufacturer</th>
                                    <th style={styles.th}>Model Name</th>
                                    <th style={styles.th}>Year</th>
                                    <th style={styles.th}>Price</th>
                                    <th style={styles.th}>Category ID</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cars.map((car) => (
                                    <tr key={car.car_id} style={styles.tr} onClick={() => handleRowClick(car.car_id)}>
                                        <td style={styles.td}>{car.car_id}</td>
                                        <td style={styles.td}>{car.manufacturer}</td>
                                        <td style={styles.td}>{car.model_name}</td>
                                        <td style={styles.td}>{car.year}</td>
                                        <td style={styles.td}>{car.price}</td>
                                        <td style={styles.td}>{car.category_id}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {showModal && selectedCar && (
                    <div style={modalStyles.overlay}>
                        <div style={modalStyles.modal}>
                            {!isEditing ? (
                                <>
                                    <h3 style={modalStyles.modalTitle}>Car Details</h3>
                                    <p><strong>ID:</strong> {selectedCar.car_id}</p>
                                    <p><strong>Model Number:</strong> {selectedCar.modelnum}</p>
                                    <p><strong>Manufacturer:</strong> {selectedCar.manufacturer}</p>
                                    <p><strong>Model Name:</strong> {selectedCar.model_name}</p>
                                    <p><strong>Year:</strong> {selectedCar.year}</p>
                                    <p><strong>Engine Type:</strong> {selectedCar.engine_type}</p>
                                    <p><strong>Transmission:</strong> {selectedCar.transmission}</p>
                                    <p><strong>Color:</strong> {selectedCar.color}</p>
                                    <p><strong>Mileage:</strong> {selectedCar.mileage}</p>
                                    <p><strong>Fuel Capacity:</strong> {selectedCar.fuel_capacity}</p>
                                    <p><strong>Seating Capacity:</strong> {selectedCar.seating_capacity}</p>
                                    <p><strong>Price:</strong> {selectedCar.price}</p>
                                    <p><strong>Available:</strong> {selectedCar.available ? 'Yes' : 'No'}</p>
                                    <p><strong>Added Date:</strong> {selectedCar.added_date}</p>
                                    <p><strong>Image:</strong></p>
                                    {selectedCar.image_link && (
                                        <img src={selectedCar.image_link} alt="Car Image" style={modalStyles.carImage} />
                                    )}
                                    <p><strong>Image Link:</strong> {selectedCar.image_link}</p>
                                    <p><strong>Category ID:</strong> {selectedCar.category_id}</p>
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
                                            <label style={styles.label}>Model Number:</label>
                                            <input type="text" name="modelnum" value={editedCar.modelnum} onChange={handleEditedCarInputChange} style={styles.input} required />
                                        </div>
                                        <div style={styles.formGroup}>
                                            <label style={styles.label}>Manufacturer:</label>
                                            <input type="text" name="manufacturer" value={editedCar.manufacturer} onChange={handleEditedCarInputChange} style={styles.input} />
                                        </div>
                                        <div style={styles.formGroup}>
                                            <label style={styles.label}>Model Name:</label>
                                            <input type="text" name="model_name" value={editedCar.model_name} onChange={handleEditedCarInputChange} style={styles.input} />
                                        </div>
                                        <div style={styles.formGroup}>
                                            <label style={styles.label}>Year:</label>
                                            <input type="number" name="year" value={editedCar.year} onChange={handleEditedCarInputChange} style={styles.input} />
                                        </div>
                                        <div style={styles.formGroup}>
                                            <label style={styles.label}>Engine Type:</label>
                                            <input type="text" name="engine_type" value={editedCar.engine_type} onChange={handleEditedCarInputChange} style={styles.input} />
                                        </div>
                                        <div style={styles.formGroup}>
                                            <label style={styles.label}>Transmission:</label>
                                            <input type="text" name="transmission" value={editedCar.transmission} onChange={handleEditedCarInputChange} style={styles.input} />
                                        </div>
                                        <div style={styles.formGroup}>
                                            <label style={styles.label}>Color:</label>
                                            <input type="text" name="color" value={editedCar.color} onChange={handleEditedCarInputChange} style={styles.input} />
                                        </div>
                                        <div style={styles.formGroup}>
                                            <label style={styles.label}>Mileage:</label>
                                            <input type="number" name="mileage" value={editedCar.mileage} onChange={handleEditedCarInputChange} style={styles.input} />
                                        </div>
                                        <div style={styles.formGroup}>
                                            <label style={styles.label}>Fuel Capacity:</label>
                                            <input type="number" name="fuel_capacity" value={editedCar.fuel_capacity} onChange={handleEditedCarInputChange} style={styles.input} />
                                        </div>
                                        <div style={styles.formGroup}>
                                            <label style={styles.label}>Seating Capacity:</label>
                                            <input type="number" name="seating_capacity" value={editedCar.seating_capacity} onChange={handleEditedCarInputChange} style={styles.input} />
                                        </div>
                                        <div style={styles.formGroup}>
                                            <label style={styles.label}>Price:</label>
                                            <input type="number" name="price" value={editedCar.price} onChange={handleEditedCarInputChange} style={styles.input} />
                                        </div>
                                        <div style={styles.formGroup}>
                                            <label style={styles.label}>Available:</label>
                                            <input type="checkbox" name="available" checked={editedCar.available} onChange={handleEditedCarInputChange} style={{ ...styles.input, width: 'auto' }} />
                                        </div>
                                        <div style={styles.formGroup}>
                                            <label style={styles.label}>Image Link:</label>
                                            <input type="text" name="image_link" value={editedCar.image_link} onChange={handleEditedCarInputChange} style={styles.input} />
                                        </div>
                                        <div style={styles.formGroup}>
                                            <label style={styles.label}>Category:</label>
                                            <select name="category_id" value={editedCar.category_id} onChange={handleEditedCarInputChange} style={styles.select} required>
                                                <option value="">Select a Category</option>
                                                {categories.map(cat => (
                                                    <option key={cat.category_id} value={cat.category_id}>{cat.category_name}</option>
                                                ))}
                                            </select>
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

const styles = {
    pageContainer: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: '#1a202c', // Dark background for the whole page
        color: '#ffffff',
    },
    contentContainer: {
        flexGrow: 1,
        padding: '20px',
        backgroundColor: '#1a202c', // Dark background
        fontFamily: 'Arial, sans-serif',
        background: 'linear-gradient(135deg, #2d3748, #1a202c)', // Dark gradient
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
        textShadow: '0 0 5px rgba(163, 191, 250, 0.3)',
    },
    loading: {
        textAlign: 'center',
        fontSize: '1.2rem',
        color: '#a0aec0',
        marginTop: '50px',
    },
    error: {
        textAlign: 'center',
        fontSize: '1.2rem',
        color: '#fc8181',
        marginTop: '50px',
    },
    noData: {
        textAlign: 'center',
        fontSize: '1.2rem',
        color: '#cbd5e0',
        marginTop: '50px',
    },
    formSection: {
        backgroundColor: '#2d3748',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
        marginBottom: '30px',
        border: '1px solid #4a5568',
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
    textarea: {
        padding: '10px',
        border: '1px solid #4a5568',
        borderRadius: '4px',
        fontSize: '1rem',
        minHeight: '80px',
        resize: 'vertical',
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
        transition: 'background-color 0.2s ease',
        '&:hover': {
            backgroundColor: '#5a67d8',
        },
    },
    tableContainer: {
        overflowX: 'auto',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
        backgroundColor: '#2d3748',
        marginTop: '20px',
        border: '1px solid #4a5568',
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
        borderBottom: '2px solid #667eea',
    },
    tr: {
        borderBottom: '1px solid #4a5568',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
        '&:nth-of-type(even)': {
            backgroundColor: '#2d3748',
        },
        '&:hover': {
            backgroundColor: '#4a5568',
        },
    },
    td: {
        padding: '12px 15px',
        fontSize: '0.9rem',
        color: '#cbd5e0',
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
        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.5)',
        width: '90%',
        maxWidth: '800px',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative',
        color: '#cbd5e0',
        border: '1px solid #4a5568',
    },
    modalTitle: {
        fontSize: '1.8rem',
        color: '#667eea',
        marginBottom: '20px',
        borderBottom: '1px solid #4a5568',
        paddingBottom: '10px',
    },
    subTitle: {
        fontSize: '1.2rem',
        color: '#a3bffa',
        marginTop: '20px',
        marginBottom: '10px',
    },
    list: {
        listStyleType: 'none',
        padding: 0,
    },
    listItem: {
        backgroundColor: '#1a202c',
        padding: '10px',
        borderRadius: '4px',
        marginBottom: '8px',
        border: '1px solid #4a5568',
    },
    closeButton: {
        marginTop: '20px',
        padding: '10px 20px',
        backgroundColor: '#e53e3e',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '1rem',
        fontWeight: 'bold',
        transition: 'background-color 0.2s ease',
        '&:hover': {
            backgroundColor: '#c53030',
        },
    },
    carImage: {
        maxWidth: '100%',
        height: 'auto',
        borderRadius: '8px',
        marginTop: '10px',
        marginBottom: '10px',
        border: '1px solid #4a5568',
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
        fontSize: '1rem',
        fontWeight: 'bold',
        transition: 'background-color 0.2s ease',
        '&:hover': {
            backgroundColor: '#3182ce',
        },
    },
    deleteButton: {
        padding: '10px 20px',
        backgroundColor: '#e53e3e',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '1rem',
        fontWeight: 'bold',
        transition: 'background-color 0.2s ease',
        '&:hover': {
            backgroundColor: '#c53030',
        },
    },
    updateButton: {
        padding: '10px 20px',
        backgroundColor: '#48bb78',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '1rem',
        fontWeight: 'bold',
        transition: 'background-color 0.2s ease',
        '&:hover': {
            backgroundColor: '#38a169',
        },
    },
    cancelButton: {
        padding: '10px 20px',
        backgroundColor: '#718096',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '1rem',
        fontWeight: 'bold',
        transition: 'background-color 0.2s ease',
        '&:hover': {
            backgroundColor: '#5f6b7d',
        },
    },
};

export default ManageCars;