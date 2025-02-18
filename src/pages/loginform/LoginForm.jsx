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
        
        // Test localStorage access
        try {
          localStorage.setItem('test', 'before-login');
          console.log('Can write to localStorage:', localStorage.getItem('test') === 'before-login');
        } catch (e) {
          console.error('localStorage test failed:', e);
        }

        const response = await axios.post(`${API_URL}/api/user/login`, 
          { username, password },
          { headers: { 'Content-Type': 'application/json' }}
        );

        console.log('Login response data:', {
          hasUsername: !!response.data?.username,
          username: response.data?.username,
          fullResponse: response.data
        });

        if (response.data?.username) {
          try {
            // Store each piece separately and verify
            localStorage.setItem('username', response.data.username);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userId', response.data.userId.toString());
            
            // Verify storage
            console.log('Storage verification:', {
              storedUsername: localStorage.getItem('username'),
              storedToken: !!localStorage.getItem('token'),
              storedUserId: localStorage.getItem('userId')
            });

            onLoginSuccess?.();
            navigate('/dashboard');
          } catch (storageError) {
            console.error('Storage error:', storageError);
            setError('Failed to save login data');
          }
        } else {
          console.warn('Invalid response:', response.data);
          setError('Invalid login response');
        }
      } else {
        // Handle signup...
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data?.message || 'Authentication failed');
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
