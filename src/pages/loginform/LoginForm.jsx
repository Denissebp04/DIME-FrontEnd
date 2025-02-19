import { useState } from 'react';
import axios from 'axios';
import * as Components from './Components';
import { API_URL } from '../../config/config';
import { useNavigate } from 'react-router-dom';

const LoginForm = ({ onLoginSuccess }) => {
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
        const username = e.target.username.value;
        const password = e.target.password.value;
        const loginData = { username, password };
        
        console.log('Login attempt with:', loginData);

        try {
          const response = await axios.post(`${API_URL}/api/user/login`, loginData, {
            headers: {
              'Content-Type': 'application/json'
            }
          });

          console.log('Server response:', response);

          if (!response.data) {
            throw new Error('No data received from server');
          }

          // Check response structure
          if (!response.data.token || !response.data.userId) {
            console.error('Invalid response structure:', response.data);
            throw new Error('Invalid server response structure');
          }

          // Store user data
          localStorage.setItem('username', username);
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('userId', response.data.userId.toString());

          console.log('Login successful, stored data:', {
            username: localStorage.getItem('username'),
            token: localStorage.getItem('token'),
            userId: localStorage.getItem('userId')
          });

          onLoginSuccess?.();
          navigate('/dashboard');
        } catch (apiError) {
          console.error('API Error:', apiError);
          throw new Error(apiError.response?.data?.message || 'Login request failed');
        }
      } else {
        // Handle signup
        const username = e.target.username.value;
        const email = e.target.email.value;
        const password = e.target.password.value;
        
        const signupData = { username, email, password };
        
        console.log('Signup attempt with:', { username, email });

        const response = await axios.post(`${API_URL}/api/user/register`, signupData, {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.data) {
          console.log('Registration successful');
          // Automatically switch to sign in
          setSignIn(true);
          setError('Registration successful! Please sign in.');
        } else {
          setError('Registration failed');
        }
      }
    } catch (error) {
      console.error('Login Error:', error);
      setError(error.message || 'Authentication failed');
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
