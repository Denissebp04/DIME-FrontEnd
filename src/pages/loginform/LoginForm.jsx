import { useState, useEffect } from 'react';
import axios from 'axios';
import * as Components from './Components';
import { API_URL } from '../../config/config';

function LoginForm({ onLoginSuccess }) {
  const [signIn, toggle] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Clear error when user types
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
        // Validate password
        if (!formData.password || formData.password.trim() === '') {
            setError('Password is required');
            return;
        }

        const requestData = {
            username: formData.username,
            email: formData.email,
            password: formData.password
        };

        console.log('Registering with:', {
            ...requestData,
            password: '[HIDDEN]'
        });

        const response = await axios.post('http://localhost:8080/api/user/register', 
            requestData,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log('Registration successful');
        alert('Registration successful! You can now sign in.');
        toggle(true);
        // Clear form but keep the email for login convenience
        setFormData(prev => ({ 
            username: '', 
            email: prev.email, 
            password: '' 
        }));
    } catch (error) {
        console.error('Registration error:', {
            status: error.response?.status,
            data: error.response?.data
        });

        if (error.response?.status === 400) {
            if (error.response.data === "Username already exists") {
                setError('This username is already taken. Please choose another.');
            } else if (error.response.data.includes("email")) {
                setError('This email is already registered. Please sign in instead.');
                toggle(true); // Switch to login form
            } else {
                setError(error.response.data || 'Registration failed. Please try again.');
            }
        } else {
            setError('Registration failed. Please try again.');
        }
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
        console.log('Login attempt with:', {
            username: formData.username,
            hasPassword: !!formData.password
        });

        const response = await axios.post('http://localhost:8080/api/user/login', {
            username: formData.username,
            password: formData.password
        });

        console.log('Login successful:', {
            hasToken: !!response.data.token,
            hasUserId: !!response.data.userId
        });

        if (response.data && response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userId', response.data.userId);
            localStorage.setItem('user', JSON.stringify({
                username: response.data.username,
                email: response.data.email
            }));
            onLoginSuccess();
        }
    } catch (error) {
        console.error('Login failed:', error);
        setError(error.response?.data || 'Login failed');
    }
  };

  return (
    <div className="login-page">
      {/* Remove this nav section
      <nav className="landing-nav">
        <div className="nav-content">
          <h1 className="logo">DIME</h1>
        </div>
      </nav>
      */}

      <div className="login-container">
        <Components.Container>
          {/* Registration Form */}
          <Components.SignUpContainer $signinIn={signIn}>
            <Components.Form onSubmit={handleRegister}>
              <Components.Title>Create Account</Components.Title>
              {error && <Components.Error>{error}</Components.Error>}
              <Components.Input type='text' name='username' placeholder='Name' value={formData.username} onChange={handleChange} required />
              <Components.Input type='email' name='email' placeholder='Email' value={formData.email} onChange={handleChange} required />
              <Components.Input type='password' name='password' placeholder='Password' value={formData.password} onChange={handleChange} required />
              <Components.Button type='submit'>Sign Up</Components.Button>
            </Components.Form>
          </Components.SignUpContainer>

          {/* Login Form */}
          <Components.SignInContainer $signinIn={signIn}>
            <Components.Form onSubmit={handleLogin}>
              <Components.Title>Sign In</Components.Title>
              {error && <Components.Error>{error}</Components.Error>}
              <Components.Input 
                  type='text' 
                  name='username' 
                  placeholder='Username' 
                  value={formData.username} 
                  onChange={handleChange} 
                  required 
              />
              <Components.Input 
                  type='password' 
                  name='password' 
                  placeholder='Password' 
                  value={formData.password} 
                  onChange={handleChange} 
                  required 
              />
              <Components.Button type='submit'>Sign In</Components.Button>
            </Components.Form>
          </Components.SignInContainer>

          {/* Overlay Section */}
          <Components.OverlayContainer $signinIn={signIn}>
            <Components.Overlay $signinIn={signIn}>
              <Components.LeftOverlayPanel $signinIn={signIn}>
                <Components.Title>Welcome Back!</Components.Title>
                <Components.Paragraph>
                  Already have an account? Sign in with your credentials
                </Components.Paragraph>
                <Components.GhostButton onClick={() => toggle(true)}>
                  Sign In
                </Components.GhostButton>
              </Components.LeftOverlayPanel>
              <Components.RightOverlayPanel $signinIn={signIn}>
                <Components.Title>First Time?</Components.Title>
                <Components.Paragraph>
                  No problem, sign up and take control of your finances today
                </Components.Paragraph>
                <Components.GhostButton onClick={() => toggle(false)}> 
                  Sign up
                </Components.GhostButton>
              </Components.RightOverlayPanel>
            </Components.Overlay>
          </Components.OverlayContainer>  
        </Components.Container>
      </div>
    </div>
  );
}

export default LoginForm;
