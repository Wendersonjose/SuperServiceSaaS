import { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Input from '../components/Input';
import Button from '../components/Button';
import { useAuth } from '../hooks/useAuth';

const LoginContainer = styled.div`
  width: 100%;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.colors.text};
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.colors.textLight};
  margin-bottom: 2rem;
`;

const Form = styled.form`
  margin-bottom: 1.5rem;
`;

const RememberMeContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const Checkbox = styled.input`
  margin-right: 0.5rem;
`;

const CheckboxLabel = styled.label`
  font-size: 0.9375rem;
  color: ${props => props.theme.colors.text};
`;

const ForgotPassword = styled(Link)`
  display: block;
  text-align: right;
  font-size: 0.9375rem;
  color: ${props => props.theme.colors.primary};
  text-decoration: none;
  transition: all ${props => props.theme.transitions.fast};
  margin-top: -2.5rem;
  margin-bottom: 1.5rem;
  
  &:hover {
    text-decoration: underline;
  }
`;

const RegisterLink = styled.div`
  text-align: center;
  font-size: 0.9375rem;
  
  a {
    color: ${props => props.theme.colors.primary};
    font-weight: 500;
    text-decoration: none;
    transition: all ${props => props.theme.transitions.fast};
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const { login, loading } = useAuth();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      return;
    }
    
    try {
      await login(email, password);
    } catch (error) {
      console.error('Login failed', error);
    }
  };
  
  return (
    <LoginContainer>
      <Title>Entre na sua conta</Title>
      <Subtitle>Bem-vindo de volta! Faça login para acessar sua conta.</Subtitle>
      
      <Form onSubmit={handleSubmit}>
        <Input
          label="Email"
          type="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        
        <Input
          label="Senha"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        
        <RememberMeContainer>
          <Checkbox
            type="checkbox"
            id="rememberMe"
            checked={rememberMe}
            onChange={() => setRememberMe(!rememberMe)}
          />
          <CheckboxLabel htmlFor="rememberMe">Lembrar de mim</CheckboxLabel>
        </RememberMeContainer>
        
        <ForgotPassword to="/esqueceu-senha">Esqueceu a senha?</ForgotPassword>
        
        <Button type="submit" fullWidth isLoading={loading}>
          Entrar
        </Button>
      </Form>
      
      <RegisterLink>
        Não tem uma conta? <Link to="/register">Cadastre-se</Link>
      </RegisterLink>
    </LoginContainer>
  );
}