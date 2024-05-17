// // EmployeeForm.test.js
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import EmployeeForm from './EmployeeForm';

jest.mock('axios');

describe('EmployeeForm Component', () => {
  test('renders without crashing', () => {
    render(<EmployeeForm />);
  });

  test('input fields update correctly', () => {
    const { getByPlaceholderText } = render(<EmployeeForm />);
    const nameInput = getByPlaceholderText('Name');
    const birthdateInput = getByPlaceholderText('Birthdate');
    const departmentInput = getByPlaceholderText('Department');
    const salaryInput = getByPlaceholderText('Salary');

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(birthdateInput, { target: { value: '1997-01-01' } });
    fireEvent.change(departmentInput, { target: { value: 'IT' } });
    fireEvent.change(salaryInput, { target: { value: '50000' } });

    expect(nameInput.value).toBe('John Doe');
    expect(birthdateInput.value).toBe('1990-01-01');
    expect(departmentInput.value).toBe('IT');
    expect(salaryInput.value).toBe('50000');
  });

  test('submits form data correctly', async () => {
    const employeeData = {
      name: 'John Doe',
      birthdate: '1999-01-01',
      department: 'IT',
      salary: '50000',
    };

    axios.post.mockResolvedValue({ data: { ...employeeData, id: 1 } });

    const { getByPlaceholderText, getByText } = render(<EmployeeForm />);

    const nameInput = getByPlaceholderText('Name');
    const birthdateInput = getByPlaceholderText('Birthdate');
    const departmentInput = getByPlaceholderText('Department');
    const salaryInput = getByPlaceholderText('Salary');
    const submitButton = getByText('Add Employee');

    fireEvent.change(nameInput, { target: { value: employeeData.name } });
    fireEvent.change(birthdateInput, { target: { value: employeeData.birthdate } });
    fireEvent.change(departmentInput, { target: { value: employeeData.department } });
    fireEvent.change(salaryInput, { target: { value: employeeData.salary } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(axios.post).toHaveBeenCalledWith('http://localhost:8002/api/emp/', employeeData);
    });
  });

  test('displays success message after successful form submission', async () => {
    axios.post.mockResolvedValue();

    const { getByText, findByText } = render(<EmployeeForm />);

    const submitButton = getByText('Add Employee');
    fireEvent.click(submitButton);

    const successMessage = await findByText('Employee added successfully.');
    expect(successMessage).toBeInTheDocument();
  });

  test('displays error message if form submission fails', async () => {
    axios.post.mockRejectedValue();

    const { getByText, findByText } = render(<EmployeeForm />);

    const submitButton = getByText('Add Employee');
    fireEvent.click(submitButton);

    const errorMessage = await findByText('Failed to add employee. Please try again.');
    expect(errorMessage).toBeInTheDocument();
  });
});
