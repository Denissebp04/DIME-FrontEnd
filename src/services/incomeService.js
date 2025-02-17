import axios from 'axios';
import { API_URL } from '../config/config';

const INCOME_API_URL = `${API_URL}/api/incomes`;

export const incomeService = {
    // Create a new income
    createIncome: async (incomeData) => {
        const response = await axios.post(INCOME_API_URL, incomeData);
        return response.data;
    },

    // Get all incomes for a user
    getUserIncomes: async (userId) => {
        const response = await axios.get(`${INCOME_API_URL}/user/${userId}`);
        return response.data;
    },

    // Update an income
    updateIncome: async (id, incomeData) => {
        const response = await axios.put(`${INCOME_API_URL}/${id}`, incomeData);
        return response.data;
    },

    // Delete an income
    deleteIncome: async (id) => {
        await axios.delete(`${INCOME_API_URL}/${id}`);
    }
}; 