import { useState } from 'react';
import styled from 'styled-components';
import { AppointmentStateMachine, AppointmentState } from '../hooks/AppointmentStateMachine';
import Card from '../components/Card';
import Button from '../components/Button';

const PageTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 1rem;
`;

const AppointmentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const AppointmentDetails = styled.p`
  color: ${props => props.theme.colors.textLight};
  font-size: 0.9375rem;
  margin-bottom: 0.5rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const initialAppointments = [
  {
    id: "1",
    client: 'Maria Silva',
    service: 'Corte de Cabelo',
    time: '09:30',
    professional: 'André',
    scheduledDateTime: new Date("2025-05-05T09:30:00"),
  },
  {
    id: "2",
    client: 'João Santos',
    service: 'Barba',
    time: '10:30',
    professional: 'Carlos',
    scheduledDateTime: new Date("2025-05-05T10:30:00"),
  },
];

export default function Appointment() {
  const [appointmentMachines, setAppointmentMachines] = useState(
    initialAppointments.map(
      appt => new AppointmentStateMachine(appt)
    )
  );

  const updateState = (index: number) => {
    setAppointmentMachines([...appointmentMachines]);
  };

  const handleStartConfirmation = (index: number) => {
    appointmentMachines[index].startConfirmationProcess();
    updateState(index);
  };

  const handleConfirmByClient = (index: number) => {
    appointmentMachines[index].confirmByClient();
    updateState(index);
  };

  const handleCancelByClient = (index: number) => {
    appointmentMachines[index].cancelByClient();
    updateState(index);
  };

  const handleConfirmAutomatically = (index: number) => {
    appointmentMachines[index].confirmAutomatically();
    updateState(index);
  };

  const handleCancelDueToTimeout = (index: number) => {
    appointmentMachines[index].cancelDueToTimeout();
    updateState(index);
  };

  const handleStartService = (index: number) => {
    try {
      appointmentMachines[index].startService();
      updateState(index);
    } catch (error) {
      alert("Não é possível iniciar o serviço: a data/hora agendada ainda não chegou ou o estado é inválido.");
    }
  };

  const handleCompleteService = (index: number) => {
    appointmentMachines[index].completeService();
    updateState(index);
  };

  const handleCancelWithAdvanceNotice = (index: number) => {
    appointmentMachines[index].cancelWithAdvanceNotice();
    updateState(index);
  };

  const handleCancelDuringExecution = (index: number) => {
    appointmentMachines[index].cancelDuringExecution();
    updateState(index);
  };

  const handleRequestReschedule = (index: number) => {
    const newDateTime = new Date("2025-05-06T09:30:00");
    appointmentMachines[index].requestReschedule(newDateTime);
    updateState(index);
  };

  const handleConfirmRescheduledTime = (index: number) => {
    appointmentMachines[index].confirmRescheduledTime();
    updateState(index);
  };

  const handleMarkAsNoShow = (index: number) => {
    appointmentMachines[index].markAsNoShow();
    updateState(index);
  };

  return (
    <div>
      <PageTitle>Agendamentos</PageTitle>
      <AppointmentContainer>
        {appointmentMachines.map((machine, index) => {
          const appt = machine.getAppointment();
          return (
            <Card key={appt.id}>
              <AppointmentDetails>Serviço: {appt.service}</AppointmentDetails>
              <AppointmentDetails>Horário: {appt.time}</AppointmentDetails>
              <AppointmentDetails>Profissional: {appt.professional}</AppointmentDetails>
              <AppointmentDetails>Status: {appt.state}</AppointmentDetails>
              <ButtonContainer>
                {appt.state === AppointmentState.Pendente && (
                  <>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleStartConfirmation(index)}
                    >
                      Iniciar Confirmação
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleConfirmAutomatically(index)}
                    >
                      Confirmar Automaticamente
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleCancelByClient(index)}
                    >
                      Cancelar (Cliente)
                    </Button>
                  </>
                )}
                {appt.state === AppointmentState.AguardandoConfirmacao && (
                  <>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleConfirmByClient(index)}
                    >
                      Confirmar (Cliente)
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleCancelDueToTimeout(index)}
                    >
                      Cancelar (Timeout)
                    </Button>
                  </>
                )}
                {appt.state === AppointmentState.Confirmado && (
                  <>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleStartService(index)}
                    >
                      Iniciar Serviço
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleRequestReschedule(index)}
                    >
                      Reagendar
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleCancelWithAdvanceNotice(index)}
                    >
                      Cancelar (Antecipado)
                    </Button>
                    <Button
                      variant="warning"
                      size="sm"
                      onClick={() => handleMarkAsNoShow(index)}
                    >
                      Marcar como No-Show
                    </Button>
                  </>
                )}
                {appt.state === AppointmentState.EmAndamento && (
                  <>
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => handleCompleteService(index)}
                    >
                      Concluir
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleCancelDuringExecution(index)}
                    >
                      Cancelar (Durante)
                    </Button>
                  </>
                )}
                {appt.state === AppointmentState.Reagendado && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleConfirmRescheduledTime(index)}
                  >
                    Confirmar Reagendamento
                  </Button>
                )}
              </ButtonContainer>
            </Card>
          );
        })}
      </AppointmentContainer>
    </div>
  );
}