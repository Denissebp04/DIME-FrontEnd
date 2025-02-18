import React from 'react';
import styled from 'styled-components';
import { PiggyBank as PiggyBankIcon } from 'lucide-react';

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const PiggyBank = styled.div`
  color: #ff4b2b;
`;

const LogoText = styled.span`
  color: #ff4b2b;
  font-size: 2rem;
  font-weight: bold;
  letter-spacing: 1px;
`;

const Logo = () => {
  return (
    <LogoContainer>
      <PiggyBank>
        <PiggyBankIcon size={32} />
      </PiggyBank>
      <LogoText>DIME</LogoText>
    </LogoContainer>
  );
};

export default Logo; 