import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Logo from './Logo';

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const WelcomeText = styled.span`
  color: #333;
  font-size: 1rem;
`;

const LogoutButton = styled.button`
  background: #ff4b2b;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  
  &:hover {
    background: #ff3517;
  }
`;

const Header = ({ onLogout }) => {
  const [username, setUsername] = useState(() => {
    // Initialize with value from localStorage
    return localStorage.getItem('username') || 'User';
  });

  useEffect(() => {
    // Update username when component mounts and when localStorage changes
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }

    // Function to handle storage changes
    const handleStorageChange = () => {
      const currentUsername = localStorage.getItem('username');
      if (currentUsername && currentUsername !== username) {
        setUsername(currentUsername);
      }
    };

    // Add event listener
    window.addEventListener('storage', handleStorageChange);
    
    // Check username periodically
    const interval = setInterval(() => {
      handleStorageChange();
    }, 1000);

    // Cleanup
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [username]);

  return (
    <HeaderContainer>
      <Logo />
      <UserInfo>
        <WelcomeText>Welcome back, {username}</WelcomeText>
        <LogoutButton onClick={onLogout}>Logout</LogoutButton>
      </UserInfo>
    </HeaderContainer>
  );
};

export default Header; 