import React from 'react';
import styled from 'styled-components';
import { PiggyBank as PiggyBankIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
`;

const PiggyBankWrapper = styled.div`
  color: #ff4b2b;
`;

const LogoText = styled.span`
  color: #ff4b2b;
  font-size: 2rem;
  font-weight: bold;
  letter-spacing: 1px;
`;

const Logo = () => {
  const navigate = useNavigate();

  return (
    <LogoContainer onClick={() => navigate('/')}>
      <PiggyBankWrapper>
        <PiggyBankIcon size={32} />
      </PiggyBankWrapper>
      <LogoText>DIME</LogoText>
    </LogoContainer>
  );
};

export default Logo; 