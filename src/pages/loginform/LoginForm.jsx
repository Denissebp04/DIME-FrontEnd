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
        
        console.log('Login attempt with username:', username);

        const response = await axios.post(`${API_URL}/api/user/login`, loginData, {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        // Log the exact response structure
        console.log('Raw response data:', JSON.stringify(response.data, null, 2));

        if (response.data) {
          // Store username before token and userId
          if (response.data.username) {
            console.log('Setting username:', response.data.username);
            localStorage.setItem('username', response.data.username);
          } else {
            console.warn('No username in response data');
          }

          if (response.data.token) {
            localStorage.setItem('token', response.data.token);
          }
          if (response.data.userId) {
            localStorage.setItem('userId', response.data.userId.toString());
          }

          // Verify storage
          console.log('Stored values:', {
            username: localStorage.getItem('username'),
            token: localStorage.getItem('token'),
            userId: localStorage.getItem('userId')
          });

          onLoginSuccess?.();
          navigate('/dashboard');
        } else {
          console.error('Invalid response structure:', response.data);
          setError('Invalid login response');
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
      console.error('Auth Error:', error);
      const errorMessage = error.response?.data?.message 
        || error.response?.data?.error 
        || (signIn ? 'Authentication failed' : 'Registration failed');
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
