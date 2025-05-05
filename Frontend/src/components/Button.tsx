import styled, { css } from 'styled-components';
import { Loader2 } from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
}

const sizeStyles = {
  sm: css`
    height: 36px;
    padding: 0 0.75rem;
    font-size: 0.875rem;
  `,
  md: css`
    height: 44px;
    padding: 0 1rem;
    font-size: 1rem;
  `,
  lg: css`
    height: 52px;
    padding: 0 1.25rem;
    font-size: 1.125rem;
  `,
};

const variantStyles = {
  primary: css`
    background-color: ${props => props.theme.colors.primary};
    color: white;
    
    &:hover:not(:disabled) {
      background-color: ${props => props.theme.colors.primaryDark};
    }
    
    &:active:not(:disabled) {
      background-color: ${props => props.theme.colors.primaryDark};
    }
  `,
  secondary: css`
    background-color: ${props => props.theme.colors.secondary};
    color: white;
    
    &:hover:not(:disabled) {
      filter: brightness(0.9);
    }
    
    &:active:not(:disabled) {
      filter: brightness(0.85);
    }
  `,
  outline: css`
    background-color: transparent;
    color: ${props => props.theme.colors.primary};
    border: 1px solid ${props => props.theme.colors.primary};
    
    &:hover:not(:disabled) {
      background-color: rgba(37, 99, 235, 0.05);
    }
    
    &:active:not(:disabled) {
      background-color: rgba(37, 99, 235, 0.1);
    }
  `,
  ghost: css`
    background-color: transparent;
    color: ${props => props.theme.colors.text};
    
    &:hover:not(:disabled) {
      background-color: rgba(0, 0, 0, 0.05);
    }
    
    &:active:not(:disabled) {
      background-color: rgba(0, 0, 0, 0.1);
    }
  `,
  danger: css`
    background-color: ${props => props.theme.colors.error};
    color: white;
    
    &:hover:not(:disabled) {
      filter: brightness(0.9);
    }
    
    &:active:not(:disabled) {
      filter: brightness(0.85);
    }
  `,
};

const StyledButton = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: ${props => props.theme.radius.md};
  font-weight: 500;
  transition: all ${props => props.theme.transitions.fast};
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  
  ${props => sizeStyles[props.size || 'md']}
  ${props => variantStyles[props.variant || 'primary']}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  svg {
    margin-right: ${props => props.children ? '0.5rem' : '0'};
  }
`;

const LoadingSpinner = styled(Loader2)`
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

interface ButtonComponentProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, ButtonProps {
  leftIcon?: React.ReactNode;
}

const Button: React.FC<ButtonComponentProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  isLoading = false,
  leftIcon,
  disabled,
  ...props 
}) => {
  return (
    <StyledButton
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <LoadingSpinner size={size === 'sm' ? 16 : 20} />
      ) : leftIcon ? (
        leftIcon
      ) : null}
      {children}
    </StyledButton>
  );
};

export default Button;