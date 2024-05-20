import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import EditEmployeeForm from './EditEmployeeForm';

const EmployeeList = () => {
  const [employeeList, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('http://localhost:8002/api/emp/list/');
        setEmployees(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchEmployees();
  }, []);

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:8002/api/emp/${id}/delete/`)
      .then(response => {
        setEmployees(employeeList.filter(employee => employee.id !== id));
      })
      .catch(error => {
        console.log(error);
        console.error("Check flag Status, Failed to delete employee.");
      });
  };

  const handleFormSubmit = (updatedEmployee) => {
    axios.put(`http://localhost:8002/api/emp/${updatedEmployee.id}/`, updatedEmployee)
      .then(response => {
        setEmployees(employeeList.map(employee =>
          employee.id === updatedEmployee.id ? updatedEmployee : employee
        ));
        setSelectedEmployee(null);
      })
      .catch(error => {
        console.log(error);
        console.error("Failed to edit employee.");
      });
  };

  return (
    <div>
      <h2>Employee List</h2>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Birthdate</th>
            <th>Department</th>
            <th>Salary</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(employeeList) && employeeList.length > 0 ? (
            employeeList.map(employee => (
              <tr key={employee.id}>
                <td>{employee.id}</td>
                <td>{employee.name}</td>
                <td>{employee.birthdate}</td>
                <td>{employee.department}</td>
                <td>{employee.salary}</td>
                <td>
                  <button onClick={() => handleEdit(employee)}>Edit</button>
                  <button onClick={() => handleDelete(employee.id)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No employees found</td>
            </tr>
          )}
        </tbody>
      </table>
      {selectedEmployee && (
        <EditEmployeeForm
          employee={selectedEmployee}
          onSubmit={handleFormSubmit}
          onCancel={() => setSelectedEmployee(null)}
        />
      )}
    </div>
  );
};

export default EmployeeList;