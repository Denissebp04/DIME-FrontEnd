import { useState } from 'react';
import axios from 'axios';
import * as Components from './Components';
import { API_URL } from '../../config/config';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [signIn, setSignIn] = useState(true);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const toggle = () => {
    setSignIn(!signIn);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    try {
      if (signIn) {
        const loginData = {
          username: formData.get('username'),
          password: formData.get('password')
        };
        
        console.log('Sending login request:', {
          url: `${API_URL}/api/user/login`,
          data: loginData
        });

        const response = await axios.post(`${API_URL}/api/user/login`, loginData, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          withCredentials: true
        });

        console.log('Backend Response:', response.data);

        // Check the response structure based on your LoginResponse class
        if (response.data) {
          // Store any necessary data from the response
          if (response.data.token) {
            localStorage.setItem('token', response.data.token);
          }
          if (response.data.user) {
            localStorage.setItem('user', JSON.stringify(response.data.user));
          }
          navigate('/dashboard');
        } else {
          setError('Invalid response from server');
        }
      } else {
        // Handle Sign Up
        const signupData = {
          name: formData.get('name'),
          email: formData.get('email'),
          password: formData.get('password')
        };
        
        await axios.post(`${API_URL}/api/user/register`, signupData, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        setSignIn(true);
      }
    } catch (error) {
      console.error('Login Error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      
      // Show the actual error message from the backend
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
