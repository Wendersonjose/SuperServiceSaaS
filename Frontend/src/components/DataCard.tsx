import styled from 'styled-components';
import Card from './Card';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface DataCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: {
    value: number;
    isPositive: boolean;
    text: string;
  };
}

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
`;

const CardTitle = styled.h3`
  font-size: 1rem;
  font-weight: 500;
  color: ${props => props.theme.colors.textLight};
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CardValue = styled.div`
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const CardFooter = styled.div<{ isPositive?: boolean }>`
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  color: ${props => props.isPositive 
    ? props.theme.colors.success
    : props.theme.colors.error};
`;

const TrendIcon = styled.div`
  display: flex;
  align-items: center;
  margin-right: 0.25rem;
`;

const ChangeText = styled.span`
  font-weight: 500;
`;

export default function DataCard({ title, value, icon, change }: DataCardProps) {
  return (
    <Card>
      <CardContent>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <IconWrapper>
            {icon}
          </IconWrapper>
        </CardHeader>
        <CardValue>{value}</CardValue>
        {change && (
          <CardFooter isPositive={change.isPositive}>
            <TrendIcon>
              {change.isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            </TrendIcon>
            <ChangeText>{change.value}% {change.text}</ChangeText>
          </CardFooter>
        )}
      </CardContent>
    </Card>
  );
}