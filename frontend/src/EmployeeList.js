// EmployeeList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';


export const EmployeeList = (employees) => {
  const [employeeList, setEmployees] = useState([]);

  // useEffect(() => {
  //   fetchEmployees();
  // }, []);

  
  // const fetchEmployees = async () => {
  //   try {
  //     const response = await axios.get('http://localhost:8002/api/emp/list/');
  //     console.log(response.data)
  //     setEmployees(response.data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

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
  }, [employees]); // Empty dependency array ensures the effect runs only once on component mount



  const handleEdit = (id) => {
    axios.put(`http://localhost:8002/api/emp/${id}/`, {/* Your updated employee data */})
      .then(response => {
        console.log("Employee edited successfully:", response.data);
        // You can update the state or perform any other action upon successful edit
      const updatedEmployeeList = employeeList.map(employee => {
        if (employee.id === id) {
          return { ...employee, ...response.data };
        }
        return employee;
        });
        setEmployees(updatedEmployeeList);
      })
      .catch(error => {
        console.log(error);
        console.error("check flag Status, Failed to edit employee.");
      });
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
  return (
    <div >
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
                  <button onClick={() => handleEdit(employee.id)}>Edit</button>
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
    </div>
  );
};  

export default EmployeeList;

