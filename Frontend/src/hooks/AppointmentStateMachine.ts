// Enum para todos os estados possíveis
enum AppointmentState {
    Pendente = "Pendente",
    AguardandoConfirmacao = "AguardandoConfirmacao",
    Confirmado = "Confirmado",
    EmAndamento = "EmAndamento",
    Concluido = "Concluido",
    Cancelado = "Cancelado",
    Reagendado = "Reagendado",
    NoShow = "NoShow",
  }
  
  // Interface para os dados do agendamento
  interface Appointment {
    id: string;
    client: string;
    service: string;
    time: string;
    professional: string;
    state: AppointmentState;
    scheduledDateTime: Date;
    createdAt: Date;
  }
  
  // Classe para gerenciar o ciclo de vida do agendamento
  class AppointmentStateMachine {
    private appointment: Appointment;
  
    constructor(appointment: Omit<Appointment, "state" | "createdAt">) {
      this.appointment = {
        ...appointment,
        state: AppointmentState.Pendente,
        createdAt: new Date(),
      };
    }
  
    // Obtém o estado atual
    getState(): AppointmentState {
      return this.appointment.state;
    }
  
    // Obtém os detalhes do agendamento
    getAppointment(): Appointment {
      return this.appointment;
    }
  
    // Transição: Pendente -> AguardandoConfirmacao (estado inicial em Pendente)
    startConfirmationProcess(): void {
      if (this.appointment.state !== AppointmentState.Pendente) {
        throw new Error(
          `Não é possível iniciar o processo de confirmação a partir do estado ${this.appointment.state}`
        );
      }
      this.appointment.state = AppointmentState.AguardandoConfirmacao;
    }
  
    // Transição: AguardandoConfirmacao -> Confirmado (cliente confirma)
    confirmByClient(): void {
      if (this.appointment.state !== AppointmentState.AguardandoConfirmacao) {
        throw new Error(
          `Não é possível confirmar a partir do estado ${this.appointment.state}`
        );
      }
      this.appointment.state = AppointmentState.Confirmado;
    }
  
    // Transição: AguardandoConfirmacao -> Cancelado (limite de tempo excedido)
    cancelDueToTimeout(): void {
      if (this.appointment.state !== AppointmentState.AguardandoConfirmacao) {
        throw new Error(
          `Não é possível cancelar por timeout a partir do estado ${this.appointment.state}`
        );
      }
      this.appointment.state = AppointmentState.Cancelado;
    }
  
    // Transição: Pendente -> Confirmado (confirmação automática)
    confirmAutomatically(): void {
      if (this.appointment.state !== AppointmentState.Pendente) {
        throw new Error(
          `Não é possível confirmar automaticamente a partir do estado ${this.appointment.state}`
        );
      }
      this.appointment.state = AppointmentState.Confirmado;
    }
  
    // Transição: Pendente -> Cancelado (cliente cancela)
    cancelByClient(): void {
      if (this.appointment.state !== AppointmentState.Pendente) {
        throw new Error(
          `Não é possível cancelar a partir do estado ${this.appointment.state}`
        );
      }
      this.appointment.state = AppointmentState.Cancelado;
    }
  
    // Transição: Confirmado -> EmAndamento (data/hora agendada chega)
    startService(): void {
      if (this.appointment.state !== AppointmentState.Confirmado) {
        throw new Error(
          `Não é possível iniciar o serviço a partir do estado ${this.appointment.state}`
        );
      }
      if (new Date() < this.appointment.scheduledDateTime) {
        throw new Error("A data/hora agendada ainda não chegou");
      }
      this.appointment.state = AppointmentState.EmAndamento;
    }
  
    // Transição: Confirmado -> Reagendado (cliente solicita reagendamento)
    requestReschedule(newDateTime: Date): void {
      if (this.appointment.state !== AppointmentState.Confirmado) {
        throw new Error(
          `Não é possível solicitar reagendamento a partir do estado ${this.appointment.state}`
        );
      }
      this.appointment.state = AppointmentState.Reagendado;
      this.appointment.scheduledDateTime = newDateTime;
    }
  
    // Transição: Confirmado -> Cancelado (cancelamento com aviso prévio)
    cancelWithAdvanceNotice(): void {
      if (this.appointment.state !== AppointmentState.Confirmado) {
        throw new Error(
          `Não é possível cancelar com aviso prévio a partir do estado ${this.appointment.state}`
        );
      }
      this.appointment.state = AppointmentState.Cancelado;
    }
  
    // Transição: EmAndamento -> Concluido (serviço concluído)
    completeService(): void {
      if (this.appointment.state !== AppointmentState.EmAndamento) {
        throw new Error(
          `Não é possível concluir o serviço a partir do estado ${this.appointment.state}`
        );
      }
      this.appointment.state = AppointmentState.Concluido;
    }
  
    // Transição: EmAndamento -> Cancelado (problema durante a execução)
    cancelDuringExecution(): void {
      if (this.appointment.state !== AppointmentState.EmAndamento) {
        throw new Error(
          `Não é possível cancelar durante a execução a partir do estado ${this.appointment.state}`
        );
      }
      this.appointment.state = AppointmentState.Cancelado;
    }
  
    // Transição: Reagendado -> Confirmado (novo horário confirmado)
    confirmRescheduledTime(): void {
      if (this.appointment.state !== AppointmentState.Reagendado) {
        throw new Error(
          `Não é possível confirmar o novo horário a partir do estado ${this.appointment.state}`
        );
      }
      this.appointment.state = AppointmentState.Confirmado;
    }
  
    // Transição: Confirmado -> NoShow (cliente não comparece)
    markAsNoShow(): void {
      if (this.appointment.state !== AppointmentState.Confirmado) {
        throw new Error(
          `Não é possível marcar como No-Show a partir do estado ${this.appointment.state}`
        );
      }
      this.appointment.state = AppointmentState.NoShow;
    }
  
    // Verifica se o agendamento atingiu um estado final
    isFinalState(): boolean {
      return [
        AppointmentState.Concluido,
        AppointmentState.Cancelado,
        AppointmentState.NoShow,
      ].includes(this.appointment.state);
    }
  }
  
export { AppointmentStateMachine, AppointmentState };
export type { Appointment };
