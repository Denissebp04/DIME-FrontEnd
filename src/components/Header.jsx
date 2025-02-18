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
  const [username, setUsername] = useState('User');

  useEffect(() => {
    const updateUsername = () => {
      const storedUsername = localStorage.getItem('username');
      console.log('Current stored username:', storedUsername);
      setUsername(storedUsername || 'User');
    };

    // Update username when component mounts
    updateUsername();

    // Listen for storage changes
    window.addEventListener('storage', updateUsername);

    return () => {
      window.removeEventListener('storage', updateUsername);
    };
  }, []);

  // Also check username when the component renders
  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername && storedUsername !== username) {
      setUsername(storedUsername);
    }
  });

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