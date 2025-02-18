import styled from 'styled-components';
import React, { useEffect } from 'react';

export const Container = styled.div`
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
    position: relative;
    overflow: hidden;
    width: 768px;
    max-width: 100%;
    min-height: 480px;
    margin: 2rem;
`;

export const SignUpContainer = styled.div`
    position: absolute;
    top: 0;
    height: 100%;
    transition: all 0.6s ease-in-out;
    left: 0;
    width: 50%;
    opacity: 0;
    z-index: 1;
    ${props => props.$signinIn !== true ? `
        transform: translateX(100%);
        opacity: 1;
        z-index: 5;
    ` : null}
`;

export const SignInContainer = styled.div`
    position: absolute;
    top: 0;
    height: 100%;
    transition: all 0.6s ease-in-out;
    left: 0;
    width: 50%;
    z-index: 2;
    ${props => props.$signinIn !== true ? `transform: translateX(100%);` : null}
`;

export const Form = styled.form`
    background-color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 0 50px;
    height: 100%;
    text-align: center;
`;

export const Title = styled.h1`
    font-weight: bold;
    margin: 0;
    margin-bottom: 15px;
`;

export const Input = styled.input`
    background-color: #eee;
    border: none;
    padding: 12px 15px;
    margin: 8px 0;
    width: 100%;
`;

export const Button = styled.button`
    border-radius: 20px;
    border: 1px solid #ff4b2b;
    background: linear-gradient(45deg, #ff4b2b, #ff416c);
    color: #ffffff;
    font-size: 12px;
    font-weight: bold;
    padding: 12px 45px;
    letter-spacing: 1px;
    text-transform: uppercase;
    transition: transform 80ms ease-in;
    &:active {
        transform: scale(0.95);
    }
    &:focus {
        outline: none;
    }
`;

export const GhostButton = styled(Button)`
    background-color: transparent;
    border-color: #ffffff;
`;

export const Anchor = styled.a`
    color: #333;
    font-size: 14px;
    text-decoration: none;
    margin: 15px 0;
`;

export const OverlayContainer = styled.div`
    position: absolute;
    top: 0;
    left: 50%;
    width: 50%;
    height: 100%;
    overflow: hidden;
    transition: transform 0.6s ease-in-out;
    z-index: 100;
    ${props => props.$signinIn !== true ? `transform: translateX(-100%);` : null}
`;

export const Overlay = styled.div`
    background: linear-gradient(45deg, #ff4b2b, #ff416c);
    background-repeat: no-repeat;
    background-size: cover;
    background-position: 0 0;
    color: #ffffff;
    position: relative;
    left: -100%;
    height: 100%;
    width: 200%;
    transform: translateX(0);
    transition: transform 0.6s ease-in-out;
    ${props => props.$signinIn !== true ? `transform: translateX(50%);` : null}
`;

export const OverlayPanel = styled.div`
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 0 40px;
    text-align: center;
    top: 0;
    height: 100%;
    width: 50%;
    transform: translateX(0);
    transition: transform 0.6s ease-in-out;
`;

export const LeftOverlayPanel = styled(OverlayPanel)`
    transform: translateX(-20%);
    ${props => props.$signinIn !== true ? `transform: translateX(0);` : null}
`;

export const RightOverlayPanel = styled(OverlayPanel)`
    right: 0;
    transform: translateX(0);
    ${props => props.$signinIn !== true ? `transform: translateX(20%);` : null}
`;

export const Paragraph = styled.p`
    font-size: 14px;
    font-weight: 100;
    line-height: 20px;
    letter-spacing: 0.5px;
    margin: 20px 0 30px;
`;

export const Error = styled.div`
    color: #ef4444;
    margin: 10px 0;
    font-size: 14px;
    text-align: center;
`;

export const LoginPage = styled.div`
  min-height: 100vh;
  background: #ff4b2b;
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
  width: 100%;
`;

export const LoginNav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100vw;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  z-index: 1000;
  margin: 0;
  
  .nav-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .logo {
    font-size: 2rem;
    font-weight: 700;
    color: white;
  }
`;

export const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding-top: 0;
  position: relative;
  overflow: hidden;
  background: linear-gradient(45deg, #ff4b2b, #ff416c);
`;

export const Coin = styled.div`
  position: fixed;
  top: -50px;
  width: 25px;
  height: 25px;
  background: linear-gradient(45deg, #FFD700, #FDB931);
  border-radius: 50%;
  border: 2px solid #FDB931;
  box-shadow: 
    inset 0 0 10px #B88A44,
    0 0 5px rgba(0,0,0,0.2);
  animation: fall linear infinite;
  z-index: 0;

  &::before {
    content: "$";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #B88A44;
    font-weight: bold;
    font-size: 16px;
  }

  @keyframes fall {
    from {
      transform: translateY(-50px) rotate(0deg);
      opacity: 1;
    }
    to {
      transform: translateY(120vh) rotate(360deg);
      opacity: 0;
    }
  }
`;

export const Login = ({ onSubmit, signIn, toggle, error }) => {
  useEffect(() => {
    const createCoins = () => {
      const loginContainer = document.querySelector('.login-container');
      if (!loginContainer) {
        console.log('No login container found');
        return;
      }

      const coin = document.createElement('div');
      coin.className = 'coin';
      
      coin.style.left = `${Math.random() * 100}vw`;
      coin.style.animation = `fall ${Math.random() * 3 + 2}s linear infinite`;
      coin.style.top = '-50px';
      
      loginContainer.appendChild(coin);
      console.log('Coin created');
      
      setTimeout(() => {
        coin.remove();
      }, 5000);
    };

    console.log('Setting up coin interval');
    const interval = setInterval(createCoins, 200);
    return () => {
      console.log('Cleaning up coin interval');
      clearInterval(interval);
    };
  }, []);

  return (
    <LoginContainer className="login-container">
      <Coin style={{ left: '50%', top: '20%' }} />
      <Container>
        <SignUpContainer $signinIn={signIn}>
          <Form onSubmit={onSubmit}>
            <Title>Create Account</Title>
            <Input type='text' name='username' placeholder='Username' required />
            <Input type='email' name='email' placeholder='Email' required />
            <Input type='password' name='password' placeholder='Password' required />
            {error && <Error>{error}</Error>}
            <Button type='submit'>Sign Up</Button>
          </Form>
        </SignUpContainer>

        <SignInContainer $signinIn={signIn}>
          <Form onSubmit={onSubmit}>
            <Title>Sign in</Title>
            <Input 
              type='text' 
              name='username' 
              placeholder='Username' 
              required 
              onChange={(e) => console.log('Username input:', e.target.value)}
            />
            <Input 
              type='password' 
              name='password' 
              placeholder='Password' 
              required 
              onChange={(e) => console.log('Password input:', e.target.value)}
            />
            {error && <Error>{error}</Error>}
            <Anchor href='#'>Forgot your password?</Anchor>
            <Button type='submit'>Sign In</Button>
          </Form>
        </SignInContainer>

        <OverlayContainer $signinIn={signIn}>
          <Overlay $signinIn={signIn}>
            <LeftOverlayPanel $signinIn={signIn}>
              <Title>Welcome Back!</Title>
              <Paragraph>
              Already have an account? Sign in with your credentials
              </Paragraph>
              <GhostButton onClick={toggle}>
                Sign In
              </GhostButton>
            </LeftOverlayPanel>

            <RightOverlayPanel $signinIn={signIn}>
              <Title>First Time Here?</Title>
              <Paragraph>
                No problem, sign up and take control of your finances today
              </Paragraph>
              <GhostButton onClick={toggle}>
                Sign Up
              </GhostButton>
            </RightOverlayPanel>
          </Overlay>
        </OverlayContainer>
      </Container>
    </LoginContainer>
  );
};