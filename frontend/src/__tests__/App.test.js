// App.test.js
import React from 'react';
import { render, waitFor } from '@testing-library/react';
import axios from 'axios';
import App from './App';

jest.mock('axios');

describe('App Component', () => {
  test('renders without crashing', () => {
    render(<App />);
  });

  test('fetches employees on component mount', async () => {
    const mockEmployees = [
      { id: 1, name: 'kummari Naresh', birthdate: '1990-01-01', department: 'IT', salary: 50000 },
      { id: 2, name: 'Anil', birthdate: '1995-05-05', department: 'HR', salary: 60000 },
    ];

    axios.get.mockResolvedValue({ data: mockEmployees });

    render(<App />);

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledTimes(1);
      expect(axios.get).toHaveBeenCalledWith('http://localhost:8002/api/emp/list/');
    });
  });

  test('updates employee list when new employee is added', async () => {
    const { getByText } = render(<App />);
    const addButton = getByText('Add Employee');

    axios.get.mockResolvedValueOnce({ data: [] }); // Initial fetch with no employees
    axios.get.mockResolvedValueOnce({ data: [{ id: 1, name: 'Kummari Naresh', birthdate: '1990-01-01', department: 'IT', salary: 50000 }] }); // Fetch after adding an employee

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledTimes(1);
    });

    axios.post.mockResolvedValueOnce({ data: { id: 1, name: 'Kummari naresh', birthdate: '1990-01-01', department: 'IT', salary: 50000 } }); // Simulate adding an employee
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(axios.post).toHaveBeenCalledWith('http://localhost:8002/api/emp/', expect.any(Object));
    });

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledTimes(2);
      expect(axios.get).toHaveBeenCalledWith('http://localhost:8002/api/emp/list/');
    });
  });
});
