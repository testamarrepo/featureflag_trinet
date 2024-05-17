import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react';
import axios from 'axios';
import EmployeeList from './EmployeeList';

jest.mock('axios');

describe('EmployeeList Component', () => {
  test('renders without crashing', () => {
    render(<EmployeeList />);
  });

  test('displays "No employees found" when no employees are fetched', async () => {
    axios.get.mockResolvedValue({ data: [] });

    const { getByText } = render(<EmployeeList />);
    const noEmployeesMessage = getByText('No employees found');
    expect(noEmployeesMessage).toBeInTheDocument();
  });

  test('displays employee list when employees are fetched', async () => {
    const mockEmployees = [
      { id: 1, name: 'kummari naresh', birthdate: '1997-01-01', department: 'IT', salary: 50000 },
      { id: 2, name: 'Jane Smith', birthdate: '1995-05-05', department: 'HR', salary: 60000 },
    ];

    axios.get.mockResolvedValue({ data: mockEmployees });

    const { getByText, getAllByRole } = render(<EmployeeList />);
    await waitFor(() => {
      const employeeRows = getAllByRole('row').slice(1); // exclude header row
      expect(employeeRows.length).toBe(mockEmployees.length);

      mockEmployees.forEach((employee, index) => {
        expect(getByText(employee.name)).toBeInTheDocument();
        expect(getByText(employee.birthdate)).toBeInTheDocument();
        expect(getByText(employee.department)).toBeInTheDocument();
        expect(getByText(employee.salary.toString())).toBeInTheDocument();
      });
    });
  });

  test('handles edit button click', async () => {
    axios.put.mockResolvedValue({ data: { id: 1, name: 'Updated Name', birthdate: '1990-01-01', department: 'IT', salary: 55000 } });

    const { getByText } = render(<EmployeeList />);
    const editButton = getByText('Edit');
    fireEvent.click(editButton);

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledTimes(1);
      expect(axios.put).toHaveBeenCalledWith('http://localhost:8002/api/emp/1/', expect.any(Object));
    });
  });

  test('handles delete button click', async () => {
    axios.delete.mockResolvedValue();

    const { getByText } = render(<EmployeeList />);
    const deleteButton = getByText('Delete');
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledTimes(1);
      expect(axios.delete).toHaveBeenCalledWith('http://localhost:8002/api/emp/1/delete/');
    });
  });
});
