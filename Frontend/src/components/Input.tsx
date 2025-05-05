import { forwardRef, InputHTMLAttributes } from 'react';
import styled from 'styled-components';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

const InputContainer = styled.div<{ fullWidth?: boolean }>`
  margin-bottom: 1.5rem;
  width: ${props => props.fullWidth ? '100%' : 'auto'};
`;

const InputLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  font-size: 0.9375rem;
`;

const StyledInput = styled.input<{ hasError?: boolean }>`
  display: block;
  width: 100%;
  height: 44px;
  padding: 0 1rem;
  font-size: 1rem;
  background-color: ${props => props.theme.colors.inputBg};
  border: 1px solid ${props => props.hasError
    ? props.theme.colors.error
    : props.theme.colors.inputBorder};
  border-radius: ${props => props.theme.radius.md};
  transition: all ${props => props.theme.transitions.fast};
  
  &:focus {
    border-color: ${props => props.hasError
      ? props.theme.colors.error
      : props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.hasError
      ? `${props.theme.colors.error}33`
      : `${props.theme.colors.primary}33`};
  }
  
  &::placeholder {
    color: ${props => props.theme.colors.textLight};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.span`
  display: block;
  color: ${props => props.theme.colors.error};
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

const Input = forwardRef<HTMLInputElement, InputProps>(({ 
  label, 
  error, 
  fullWidth = true,
  ...props 
}, ref) => {
  return (
    <InputContainer fullWidth={fullWidth}>
      {label && <InputLabel>{label}</InputLabel>}
      <StyledInput
        ref={ref}
        hasError={!!error}
        {...props}
      />
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </InputContainer>
  );
});

export default Input;