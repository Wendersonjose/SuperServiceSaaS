import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import Logo from '../components/Logo';

const AuthLayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  overflow: hidden;
`;

const LeftPanel = styled.div`
  flex: 1;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  display: flex;
  flex-direction: column;
  padding: 2rem;
  position: relative;

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    display: none;
  }
`;

const Dots = styled.div`
  display: flex;
  margin-top: 1.5rem;
  
  span {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.5);
    margin-right: 0.5rem;
    
    &:first-child {
      background-color: white;
    }
  }
`;

const LeftPanelContent = styled.div`
  margin-top: auto;
  margin-bottom: auto;
  max-width: 480px;
`;

const Headline = styled.h2`
  font-size: 2.5rem;
  line-height: 1.2;
  margin-bottom: 1.5rem;
  font-weight: 700;
`;

const Subheadline = styled.p`
  font-size: 1.125rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  opacity: 0.9;
`;

const Footer = styled.footer`
  margin-top: auto;
  font-size: 0.875rem;
  opacity: 0.8;
`;

const RightPanel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  
  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    max-width: 600px;
  }
`;

const FormContainer = styled.div`
  width: 100%;
  max-width: 400px;
`;

export default function AuthLayout() {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return (
    <AuthLayoutContainer>
      <LeftPanel>
        <Logo color="white" />
        <Dots>
          <span></span>
          <span></span>
          <span></span>
        </Dots>
        <LeftPanelContent>
          <Headline>
            Potencialize seu negócio com nossa plataforma de gestão de serviços
          </Headline>
          <Subheadline>
            Agende, gerencie clientes, controle finanças e muito mais em uma única plataforma
          </Subheadline>
        </LeftPanelContent>
        <Footer>
          &copy; 2025 ServiçosPro. Todos os direitos reservados.
        </Footer>
      </LeftPanel>
      
      <RightPanel>
        <FormContainer>
          <Outlet />
        </FormContainer>
      </RightPanel>
    </AuthLayoutContainer>
  );
}