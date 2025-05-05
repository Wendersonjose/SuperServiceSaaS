import styled, { css } from 'styled-components';

interface CardProps {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
  bordered?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const variantStyles = {
  default: css`
    background-color: ${props => props.theme.colors.card};
    color: ${props => props.theme.colors.text};
  `,
  primary: css`
    background-color: ${props => props.theme.colors.primary};
    color: white;
  `,
  success: css`
    background-color: ${props => props.theme.colors.success};
    color: white;
  `,
  warning: css`
    background-color: ${props => props.theme.colors.warning};
    color: white;
  `,
  error: css`
    background-color: ${props => props.theme.colors.error};
    color: white;
  `,
};

const paddingStyles = {
  none: css`padding: 0;`,
  sm: css`padding: 0.75rem;`,
  md: css`padding: 1.25rem;`,
  lg: css`padding: 2rem;`,
};

const StyledCard = styled.div<CardProps>`
  border-radius: ${props => props.theme.radius.lg};
  box-shadow: ${props => props.theme.shadows.sm};
  overflow: hidden;
  
  ${props => variantStyles[props.variant || 'default']}
  ${props => paddingStyles[props.padding || 'md']}
  
  ${props => props.bordered && css`
    border: 1px solid ${props.theme.colors.border};
  `}
`;

interface CardComponentProps extends React.HTMLAttributes<HTMLDivElement>, CardProps {}

const Card: React.FC<CardComponentProps> = ({ 
  children, 
  variant = 'default',
  bordered = false,
  padding = 'md',
  ...props 
}) => {
  return (
    <StyledCard
      variant={variant}
      bordered={bordered}
      padding={padding}
      {...props}
    >
      {children}
    </StyledCard>
  );
};

export default Card;