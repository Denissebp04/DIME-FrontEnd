import React from 'react';
import styled from 'styled-components';

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const PiggyBank = styled.div`
  color: #ff4b2b;
  
  svg {
    width: 32px;
    height: 32px;
  }
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
        {/* We'll replace this with your landing page's piggy bank SVG */}
      </PiggyBank>
      <LogoText>DIME</LogoText>
    </LogoContainer>
  );
};

export default Logo; 