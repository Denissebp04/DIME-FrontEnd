import axios from 'axios';
import { API_URL } from '../config/config';

const BUDGET_API_URL = `${API_URL}/api/budgets`;

export const budgetService = {
    // Get all budgets for a user
    getUserBudgets: async (userId) => {
        const response = await axios.get(`${BUDGET_API_URL}/user/${userId}`);
        return response.data;
    },

    // Create a new budget
    createBudget: async (budgetData) => {
        try {
            const response = await axios.post(BUDGET_API_URL, budgetData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Budget service error:', error.response || error);
            throw error;
        }
    },

    // Update a budget
    updateBudget: async (id, budgetData) => {
        const response = await axios.put(`${BUDGET_API_URL}/${id}`, budgetData);
        return response.data;
    },

    // Delete a budget
    deleteBudget: async (id) => {
        await axios.delete(`${BUDGET_API_URL}/${id}`);
    }
}; 