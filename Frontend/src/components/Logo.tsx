import styled from 'styled-components';

interface LogoProps {
  color?: 'primary' | 'white';
  showText?: boolean;
}

const LogoContainer = styled.div<LogoProps>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 700;
  color: ${props => props.color === 'white' ? 'white' : props.theme.colors.primary};
`;

const LogoIcon = styled.div<LogoProps>`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: ${props => props.color === 'white' ? 'white' : props.theme.colors.primary};
  color: ${props => props.color === 'white' ? props.theme.colors.primary : 'white'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 16px;
`;

const LogoText = styled.span`
  font-size: 1.25rem;
`;

export default function Logo({ color = 'primary', showText = true }: LogoProps) {
  return (
    <LogoContainer color={color}>
      <LogoIcon color={color}>SP</LogoIcon>
      {showText && <LogoText>ServiçosPro</LogoText>}
    </LogoContainer>
  );
}