import { useState } from 'react';
import axios from 'axios';
import * as Components from './Components';
import { API_URL } from '../../config/config';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [signIn, setSignIn] = useState(true);
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const toggle = () => {
    setSignIn(!signIn);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (signIn) {
        // Get values directly from the form elements
        const username = e.target.username.value;
        const password = e.target.password.value;

        const loginData = { username, password };
        
        console.log('Attempting login with:', loginData);

        try {
          const response = await axios.post(`${API_URL}/api/user/login`, loginData, {
            headers: {
              'Content-Type': 'application/json'
            }
          });

          console.log('Login response:', response.data);

          if (response.data) {
            // Store all response data
            if (response.data.token) {
              localStorage.setItem('token', response.data.token);
            }
            if (response.data.userId) {
              localStorage.setItem('userId', response.data.userId.toString());
            }
            if (response.data.username) {
              localStorage.setItem('username', response.data.username);
            }

            console.log('Login successful, stored data in localStorage');
            console.log('Attempting to navigate to dashboard...');
            
            // Force navigation
            window.location.href = '/dashboard';
          } else {
            console.error('Invalid response structure:', response.data);
            setError('Invalid login response');
          }
        } catch (apiError) {
          console.error('API Error:', apiError);
          if (apiError.response) {
            console.error('Response data:', apiError.response.data);
            console.error('Response status:', apiError.response.status);
          }
          throw apiError;
        }
      } else {
        // Handle signup...
      }
    } catch (error) {
      console.error('Login Error:', error);
      const errorMessage = error.response?.data?.message 
        || error.response?.data?.error 
        || 'Authentication failed';
      setError(errorMessage);
    }
  };

  return (
    <Components.LoginPage>
      <Components.Login 
        onSubmit={handleSubmit}
        signIn={signIn}
        toggle={toggle}
        error={error}
      />
    </Components.LoginPage>
  );
};

export default LoginForm;
