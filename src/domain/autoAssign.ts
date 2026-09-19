import { StaffUser, Ticket } from '../types';
import { isNonTerminal } from './sla';

export const AUTO_ASSIGN_AFTER_MS = 10 * 60 * 1000; // 10 minutes

/**
 * Tickets that have sat unassigned in 'aberto' for 10+ minutes.
 *
 * IMPORTANT (see handoff README): in the prototype this ran client-side
 * on a 15s interval. That's preserved here for round 1 parity, but it
 * only fires while someone has the app open — it belongs in a
 * server-side scheduled Cloud Function for real reliability. This pure
 * function is written so that move is a lift-and-shift: same signature,
 * same logic, just called from a Function instead of a client effect.
 */
export function findTicketsDueForAutoAssign(tickets: Ticket[], now: Date = new Date()): Ticket[] {
  return tickets.filter(
    (t) => !t.responsavelId && t.status === 'aberto' && now.getTime() - t.createdAt >= AUTO_ASSIGN_AFTER_MS
  );
}

/** Picks the least-loaded active technician of the ticket's hotel, or null if none available. */
export function pickAutoAssignee(ticket: Ticket, allTickets: Ticket[], staff: StaffUser[]): StaffUser | null {
  const techs = staff.filter((u) => u.role === 'manutencao' && u.ativo && u.hotelId === ticket.hotelId);
  if (!techs.length) return null;
  const load = (u: StaffUser) =>
    allTickets.filter((x) => x.responsavelId === u.id && isNonTerminal(x)).length;
  return [...techs].sort((a, b) => load(a) - load(b))[0];
}
