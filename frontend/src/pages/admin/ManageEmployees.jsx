import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminNavbar from '../../components/AdminNavbar';
import Footer from '../../components/Footer';
import './Admin.css';

const ManageEmployees = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedEmployee, setEditedEmployee] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [newEmployee, setNewEmployee] = useState({
        name: '',
        position: '',
        email: '',
        phone: '',
        salary: ''
    });

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const response = await axios.get('http://localhost:8000/admin/employees');
            setEmployees(response.data);
        } catch (err) {
            setError('Failed to fetch employees.');
            console.error('Error fetching employees:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleRowClick = (employee) => {
        setSelectedEmployee(employee);
        setEditedEmployee(employee);
        setShowModal(true);
        setIsEditing(false);
        setIsAdding(false);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedEmployee(null);
        setIsEditing(false);
        setEditedEmployee(null);
        setIsAdding(false);
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleEditedEmployeeInputChange = (e) => {
        const { name, value } = e.target;
        setEditedEmployee({ ...editedEmployee, [name]: value });
    };

    const handleNewEmployeeInputChange = (e) => {
        const { name, value } = e.target;
        setNewEmployee({ ...newEmployee, [name]: value });
    };

    const handleUpdateEmployee = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:8000/admin/employees/${editedEmployee.emp_id}`, editedEmployee);
            alert('Employee updated successfully!');
            fetchEmployees();
            closeModal();
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to update employee.');
            console.error('Error updating employee:', err);
        }
    };

    const handleDeleteEmployee = async (employeeId) => {
        if (window.confirm('Are you sure you want to delete this employee?')) {
            try {
                await axios.delete(`http://localhost:8000/admin/employees/${employeeId}`);
                alert('Employee deleted successfully!');
                fetchEmployees();
                closeModal();
            } catch (err) {
                setError(err.response?.data?.detail || 'Failed to delete employee.');
                console.error('Error deleting employee:', err);
            }
        }
    };

    const handleAddEmployee = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8000/admin/employees', newEmployee);
            alert('Employee added successfully!');
            fetchEmployees();
            closeModal();
            setNewEmployee({
                name: '',
                position: '',
                email: '',
                phone: '',
                salary: ''
            });
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to add employee.');
            console.error('Error adding employee:', err);
        }
    };

    const openAddModal = () => {
        setIsAdding(true);
        setShowModal(true);
        setIsEditing(false);
        setSelectedEmployee(null);
        setEditedEmployee(null);
    };

    if (loading) {
        return <div className="loading">Loading employees...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="page-container">
            <AdminNavbar />
            <div className="content-container">
                <h2 className="admin-page-heading">Manage Employees</h2>
                <button onClick={openAddModal} className="add-button">Add Employee</button>
                {employees.length === 0 ? (
                    <p className="no-data">No employees found.</p>
                ) : (
                    <div className="table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Employee ID</th>
                                    <th>Name</th>
                                    <th>Position</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Salary</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employees.map((employee) => (
                                    <tr key={employee.emp_id} onClick={() => handleRowClick(employee)}>
                                        <td>{employee.emp_id}</td>
                                        <td>{employee.name}</td>
                                        <td>{employee.position}</td>
                                        <td>{employee.email}</td>
                                        <td>{employee.phone}</td>
                                        <td>{employee.salary}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {showModal && (
                    <div className="modal-overlay">
                        <div className="modal">
                            {isAdding ? (
                                <>
                                    <h3 className="modal-title">Add New Employee</h3>
                                    <form onSubmit={handleAddEmployee} className="admin-form">
                                        <div className="form-group">
                                            <label>Name:</label>
                                            <input type="text" name="name" value={newEmployee.name} onChange={handleNewEmployeeInputChange} required />
                                        </div>
                                        <div className="form-group">
                                            <label>Position:</label>
                                            <input type="text" name="position" value={newEmployee.position} onChange={handleNewEmployeeInputChange} required />
                                        </div>
                                        <div className="form-group">
                                            <label>Email:</label>
                                            <input type="email" name="email" value={newEmployee.email} onChange={handleNewEmployeeInputChange} />
                                        </div>
                                        <div className="form-group">
                                            <label>Phone:</label>
                                            <input type="text" name="phone" value={newEmployee.phone} onChange={handleNewEmployeeInputChange} />
                                        </div>
                                        <div className="form-group">
                                            <label>Salary:</label>
                                            <input type="number" name="salary" value={newEmployee.salary} onChange={handleNewEmployeeInputChange} />
                                        </div>
                                        <div className="button-group">
                                            <button type="submit" className="update-button">Add Employee</button>
                                            <button type="button" onClick={closeModal} className="cancel-button">Cancel</button>
                                        </div>
                                    </form>
                                </>
                            ) : !isEditing ? (
                                <>
                                    <h3 className="modal-title">Employee Details</h3>
                                    <p><strong>ID:</strong> {selectedEmployee.emp_id}</p>
                                    <p><strong>Name:</strong> {selectedEmployee.name}</p>
                                    <p><strong>Position:</strong> {selectedEmployee.position}</p>
                                    <p><strong>Email:</strong> {selectedEmployee.email}</p>
                                    <p><strong>Phone:</strong> {selectedEmployee.phone}</p>
                                    <p><strong>Salary:</strong> {selectedEmployee.salary}</p>
                                    <div className="button-group">
                                        <button onClick={handleEditClick} className="edit-button">Edit</button>
                                        <button onClick={() => handleDeleteEmployee(selectedEmployee.emp_id)} className="delete-button">Delete</button>
                                        <button onClick={closeModal} className="cancel-button">Close</button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <h3 className="modal-title">Edit Employee</h3>
                                    <form onSubmit={handleUpdateEmployee} className="admin-form">
                                        <div className="form-group">
                                            <label>Name:</label>
                                            <input type="text" name="name" value={editedEmployee.name} onChange={handleEditedEmployeeInputChange} required />
                                        </div>
                                        <div className="form-group">
                                            <label>Position:</label>
                                            <input type="text" name="position" value={editedEmployee.position} onChange={handleEditedEmployeeInputChange} required />
                                        </div>
                                        <div className="form-group">
                                            <label>Email:</label>
                                            <input type="email" name="email" value={editedEmployee.email} onChange={handleEditedEmployeeInputChange} />
                                        </div>
                                        <div className="form-group">
                                            <label>Phone:</label>
                                            <input type="text" name="phone" value={editedEmployee.phone} onChange={handleEditedEmployeeInputChange} />
                                        </div>
                                        <div className="form-group">
                                            <label>Salary:</label>
                                            <input type="number" name="salary" value={editedEmployee.salary} onChange={handleEditedEmployeeInputChange} />
                                        </div>
                                        <div className="button-group">
                                            <button type="submit" className="update-button">Update Employee</button>
                                            <button type="button" onClick={() => setIsEditing(false)} className="cancel-button">Cancel</button>
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

export default ManageEmployees;
