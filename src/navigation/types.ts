import { TicketStatus } from '../types';

export type RootStackParamList = {
  Tabs: undefined;
  NewTicket: undefined;
  TicketDetail: { ticketId: string };
};

export type MainTabParamList = {
  Home: undefined;
  Painel: { statusFilter?: TicketStatus; quickFilter?: 'urgent' | 'mine' | 'overdue' } | undefined;
  NovoTabButton: undefined; // never rendered — just the FAB tab button
  Mine: undefined;
  Config: undefined;
};
