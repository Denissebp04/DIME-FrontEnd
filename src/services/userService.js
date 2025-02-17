import api from '../config/apiConfig';

export const userService = {
    async register(userData) {
        try {
            const response = await api.post('/user/register', {
                username: userData.username,
                email: userData.email,
                password: userData.password
            });
            return response.data;
        } catch (error) {
            console.error('Registration error:', error);
            throw error.response?.data || 'Registration failed';
        }
    },

    async login(credentials) {
        try {
            const response = await api.post('/user/login', {
                email: credentials.email,
                password: credentials.password
            });
            
            // Store the token and user info
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('userId', response.data.userId);
                localStorage.setItem('user', JSON.stringify({
                    username: response.data.username,
                    email: response.data.email
                }));
            }
            
            return response.data;
        } catch (error) {
            console.error('Login error:', error);
            throw error.response?.data || 'Login failed';
        }
    },

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('user');
    }
}; 