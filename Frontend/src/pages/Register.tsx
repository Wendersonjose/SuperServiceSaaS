import { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Input from '../components/Input';
import Button from '../components/Button';
import { useAuth } from '../hooks/useAuth';

const RegisterContainer = styled.div`
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

const LoginLink = styled.div`
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

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const { register, loading } = useAuth();
  
  const validatePasswords = () => {
    if (password !== confirmPassword) {
      setPasswordError('As senhas não coincidem');
      return false;
    }
    
    setPasswordError('');
    return true;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password || !confirmPassword) {
      return;
    }
    
    if (!validatePasswords()) {
      return;
    }
    
    try {
      await register(name, email, password);
    } catch (error) {
      console.error('Registration failed', error);
    }
  };
  
  return (
    <RegisterContainer>
      <Title>Crie sua conta</Title>
      <Subtitle>Preencha os dados abaixo para se registrar</Subtitle>
      
      <Form onSubmit={handleSubmit}>
        <Input
          label="Nome completo"
          type="text"
          placeholder="João Silva"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        
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
        
        <Input
          label="Confirme a senha"
          type="password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={passwordError}
          onBlur={validatePasswords}
          required
        />
        
        <Button type="submit" fullWidth isLoading={loading}>
          Criar conta
        </Button>
      </Form>
      
      <LoginLink>
        Já tem uma conta? <Link to="/login">Faça login</Link>
      </LoginLink>
    </RegisterContainer>
  );
}