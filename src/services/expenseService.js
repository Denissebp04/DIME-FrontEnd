import axios from 'axios';

const API_URL = 'http://localhost:8080/api/expenses';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    console.log('Using auth token:', token ? 'Present' : 'Missing');
    return {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Cache-Control': 'no-cache'
        }
    };
};

export const expenseService = {
    async getUserExpenses(userId) {
        console.log('Service: Fetching expenses for user:', userId);
        try {
            const response = await axios.get(`${API_URL}/user/${userId}`, getAuthHeader());
            console.log('Service: Received expenses:', response.data);
            return response.data;
        } catch (error) {
            console.error('Service: Failed to fetch expenses:', {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message
            });
            throw error;
        }
    },

    async createExpense(expenseData) {
        console.log('Service: Creating expense:', expenseData);
        try {
            // Log the exact request being made
            console.log('Making request to:', API_URL);
            console.log('With data:', expenseData);
            console.log('With headers:', getAuthHeader());

            const response = await axios.post(API_URL, expenseData, getAuthHeader());
            
            // Log successful response
            console.log('Response received:', response.data);
            return response.data;
        } catch (error) {
            // Log error in detail
            console.error('Request failed:', {
                status: error.response?.status,
                statusText: error.response?.statusText,
                data: error.response?.data,
                message: error.message
            });
            throw error;
        }
    },

    async updateExpense(id, expenseData) {
        console.log('Updating expense:', { id, data: expenseData });
        try {
            const response = await axios.put(`${API_URL}/${id}`, expenseData, getAuthHeader());
            console.log('Updated expense:', response.data);
            return response.data;
        } catch (error) {
            console.error('Failed to update expense:', {
                status: error.response?.status,
                message: error.response?.data,
                error: error.message
            });
            throw error;
        }
    },

    async deleteExpense(id) {
        console.log('Deleting expense:', id);
        try {
            await axios.delete(`${API_URL}/${id}`, getAuthHeader());
            console.log('Expense deleted successfully');
        } catch (error) {
            console.error('Failed to delete expense:', {
                status: error.response?.status,
                message: error.response?.data,
                error: error.message
            });
            throw error;
        }
    }
}; 