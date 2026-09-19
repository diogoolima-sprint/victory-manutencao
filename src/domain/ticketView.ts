import { Priority, SlaConfig, Ticket, TicketStatus } from '../types';
import { computeSla, slaStyle } from './sla';
import { fmtDateTime, fmtElapsed } from './format';

export interface TicketCardData {
  id: string;
  number: string;
  hotelName: string;
  sector: string;
  local: string;
  categoryName: string;
  description: string;
  priority: Priority;
  status: TicketStatus;
  responsavelName: string;
  createdAtLabel: string;
  elapsedLabel: string;
  slaLabel: string;
  slaColor: string;
}

/** Ported from buildCard() in the prototype's renderVals(). */
export function buildTicketCard(
  ticket: Ticket,
  slaConfig: SlaConfig,
  hotelName: (id: string) => string,
  categoryName: (id: string) => string,
  staffName: (id: string | null) => string,
  now: Date = new Date()
): TicketCardData {
  const sla = computeSla(ticket, slaConfig, now);
  const st = slaStyle[sla.state];
  const endRef = ticket.conclusion?.at ?? ticket.cancellation?.at ?? now.getTime();
  const elapsedH = (endRef - ticket.createdAt) / 3600000;

  return {
    id: ticket.id,
    number: ticket.number,
    hotelName: hotelName(ticket.hotelId),
    sector: ticket.sector,
    local: ticket.local,
    categoryName: categoryName(ticket.categoryId),
    description: ticket.description,
    priority: ticket.priority,
    status: ticket.status,
    responsavelName: staffName(ticket.responsavelId),
    createdAtLabel: fmtDateTime(new Date(ticket.createdAt)),
    elapsedLabel: fmtElapsed(elapsedH),
    slaLabel: sla.label,
    slaColor: st.color,
  };
}

export const priorityRank: Record<Priority, number> = { urgente: 3, alta: 2, normal: 1, baixa: 0 };

/** Urgent-first, then oldest-first — same ordering rule used throughout the prototype. */
export function sortTicketsForBoard(tickets: Ticket[]): Ticket[] {
  return [...tickets].sort((a, b) => priorityRank[b.priority] - priorityRank[a.priority] || a.createdAt - b.createdAt);
}
