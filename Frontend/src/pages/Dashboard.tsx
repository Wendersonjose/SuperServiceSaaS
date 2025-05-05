import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Calendar, DollarSign, Users, Percent } from 'lucide-react';
import Card from '../components/Card';
import DataCard from '../components/DataCard';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';

const PageTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const PageSubtitle = styled.p`
  color: ${props => props.theme.colors.textLight};
  margin-bottom: 2rem;
`;

const DataCardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
  
  @media (min-width: ${props => props.theme.breakpoints.sm}) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  
  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    grid-template-columns: 2fr 1fr;
  }
`;

const CardTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const CardSubtitle = styled.p`
  color: ${props => props.theme.colors.textLight};
  font-size: 0.9375rem;
  margin-bottom: 1.5rem;
`;

const ChartContainer = styled.div`
  width: 100%;
  height: 300px;
`;

const AppointmentsList = styled.div`
  margin-top: 1rem;
`;

const AppointmentItem = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  
  &:last-child {
    border-bottom: none;
  }
`;

const ClientAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${props => props.theme.colors.primary}20;
  color: ${props => props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 16px;
  margin-right: 1rem;
`;

const AppointmentInfo = styled.div`
  flex: 1;
`;

const ClientName = styled.div`
  font-weight: 500;
  margin-bottom: 0.25rem;
`;

const AppointmentDetails = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textLight};
  display: flex;
  align-items: center;
`;

const AppointmentTime = styled.span`
  margin-right: 0.5rem;
  
  &::after {
    content: '•';
    margin-left: 0.5rem;
  }
`;

const AppointmentStatus = styled.div<{ status: 'confirmado' | 'pendente' }>`
  padding: 0.25rem 0.75rem;
  border-radius: ${props => props.theme.radius.full};
  font-size: 0.75rem;
  font-weight: 500;
  background-color: ${props => 
    props.status === 'confirmado' 
      ? `${props.theme.colors.success}20` 
      : `${props.theme.colors.warning}20`};
  color: ${props => 
    props.status === 'confirmado' 
      ? props.theme.colors.success 
      : props.theme.colors.warning};
`;

const performanceData = [
  { day: 'Dom', appointments: 4, revenue: 400 },
  { day: 'Seg', appointments: 6, revenue: 650 },
  { day: 'Ter', appointments: 8, revenue: 800 },
  { day: 'Qua', appointments: 10, revenue: 1000 },
  { day: 'Qui', appointments: 12, revenue: 1300 },
  { day: 'Sex', appointments: 14, revenue: 1500 },
  { day: 'Sáb', appointments: 4, revenue: 300 },
];

const todayAppointments = [
  { 
    id: 1, 
    client: 'Maria Silva', 
    initials: 'MA',
    service: 'Corte de Cabelo', 
    time: '09:30', 
    duration: '45min',
    professional: 'André',
    status: 'confirmado' as const,
  },
  { 
    id: 2, 
    client: 'João Santos', 
    initials: 'JO',
    service: 'Barba', 
    time: '10:30', 
    duration: '30min',
    professional: 'Carlos',
    status: 'pendente' as const,
  },
];

export default function Dashboard() {
  const [animateChart, setAnimateChart] = useState(false);
  
  useEffect(() => {
    // Trigger chart animation after render
    const timer = setTimeout(() => {
      setAnimateChart(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <>
      <PageTitle>Dashboard</PageTitle>
      <PageSubtitle>Bem-vindo(a)! Aqui está um resumo da sua empresa hoje.</PageSubtitle>
      
      <DataCardsGrid>
        <DataCard 
          title="Agendamentos Hoje" 
          value="12" 
          icon={<Calendar size={20} color="#2563EB" />}
          change={{ value: 2, isPositive: true, text: 'em relação à semana passada' }}
        />
        
        <DataCard 
          title="Receita Hoje" 
          value="R$ 1.250,00" 
          icon={<DollarSign size={20} color="#10B981" />}
          change={{ value: 18, isPositive: true, text: 'em relação à semana passada' }}
        />
        
        <DataCard 
          title="Novos Clientes" 
          value="5" 
          icon={<Users size={20} color="#2563EB" />}
          change={{ value: 12, isPositive: true, text: 'em relação ao mês anterior' }}
        />
        
        <DataCard 
          title="Taxa de Ocupação" 
          value="78%" 
          icon={<Percent size={20} color="#8B5CF6" />}
          change={{ value: 5, isPositive: true, text: 'em relação à semana passada' }}
        />
      </DataCardsGrid>
      
      <DashboardGrid>
        <Card>
          <CardTitle>Desempenho Semanal</CardTitle>
          <CardSubtitle>Agendamentos e receita dos últimos 7 dias</CardSubtitle>
          
          <ChartContainer>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={performanceData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis yAxisId="left" orientation="left" stroke="#2563EB" />
                <YAxis yAxisId="right" orientation="right" stroke="#10B981" />
                <Tooltip />
                <Legend />
                <Bar 
                  yAxisId="left" 
                  dataKey="appointments" 
                  name="Agendamentos" 
                  fill="#2563EB" 
                  radius={[4, 4, 0, 0]}
                  animationDuration={animateChart ? 1000 : 0}
                />
                <Bar 
                  yAxisId="right" 
                  dataKey="revenue" 
                  name="Receita (R$)" 
                  fill="#10B981" 
                  radius={[4, 4, 0, 0]}
                  animationDuration={animateChart ? 1500 : 0}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </Card>
        
        <Card>
          <CardTitle>Agendamentos de Hoje</CardTitle>
          <CardSubtitle>Uma visão dos seus compromissos para hoje</CardSubtitle>
          
          <AppointmentsList>
            {todayAppointments.map(appointment => (
              <AppointmentItem key={appointment.id}>
                <ClientAvatar>{appointment.initials}</ClientAvatar>
                <AppointmentInfo>
                  <ClientName>{appointment.client}</ClientName>
                  <AppointmentDetails>
                    <AppointmentTime>{appointment.time}</AppointmentTime>
                    <span>Prof: {appointment.professional}</span>
                  </AppointmentDetails>
                </AppointmentInfo>
                <AppointmentStatus status={appointment.status}>
                  {appointment.status === 'confirmado' ? 'Confirmado' : 'Pendente'}
                </AppointmentStatus>
              </AppointmentItem>
            ))}
          </AppointmentsList>
        </Card>
      </DashboardGrid>
    </>
  );
}