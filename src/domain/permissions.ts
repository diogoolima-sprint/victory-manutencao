import { StaffUser, Ticket } from '../types';
import { isNonTerminal } from './sla';

// Every rule here is ported 1:1 from the prototype's renderVals() —
// see design-reference/handoff-spec.md "Roles & Permissions"
// and "Interactions & Behavior" sections. Keep these in sync; they are
// the single source of truth the UI and (eventually) Firestore rules
// both defer to.

export function inHotelScope(user: StaffUser | null, ticket: Ticket): boolean {
  if (!user) return false;
  if (user.role === 'admin') return true;
  return ticket.hotelId === user.hotelId;
}

/** Admin, or the gestor of the ticket's own hotel. */
export function canManageTicket(user: StaffUser | null, ticket: Ticket): boolean {
  if (!user) return false;
  if (user.role === 'admin') return true;
  return user.role === 'gestor' && ticket.hotelId === user.hotelId;
}

/** The technician currently assigned to this ticket. */
export function isAssignedTech(user: StaffUser | null, ticket: Ticket): boolean {
  return !!user && user.role === 'manutencao' && ticket.responsavelId === user.id;
}

export function canAssign(user: StaffUser | null, ticket: Ticket): boolean {
  return canManageTicket(user, ticket) || isAssignedTech(user, ticket);
}

export function canChangeStatus(user: StaffUser | null, ticket: Ticket): boolean {
  return (canManageTicket(user, ticket) || isAssignedTech(user, ticket)) && isNonTerminal(ticket);
}

export function canConclude(user: StaffUser | null, ticket: Ticket): boolean {
  return (canManageTicket(user, ticket) || isAssignedTech(user, ticket)) && isNonTerminal(ticket);
}

export function canCancel(user: StaffUser | null, ticket: Ticket): boolean {
  return canManageTicket(user, ticket) && isNonTerminal(ticket);
}

export function canAddNote(user: StaffUser | null, ticket: Ticket): boolean {
  return canManageTicket(user, ticket) || isAssignedTech(user, ticket);
}

/**
 * Priority is immutable after creation for everyone except staff with
 * manage rights — this is the ONE legitimate path to change it. Never
 * add another one (see handoff README, "business logic to preserve").
 */
export function canChangePriority(user: StaffUser | null, ticket: Ticket): boolean {
  return canManageTicket(user, ticket);
}

/** Manutenção is deliberately excluded — they never open tickets, only work them. */
export function canCreateTicket(user: StaffUser | null): boolean {
  return !!user && (user.role === 'admin' || user.role === 'gestor' || user.role === 'solicitante');
}

export function showHotelFilter(user: StaffUser | null): boolean {
  return !!user && user.role === 'admin';
}

export function showResponsavelFilter(user: StaffUser | null): boolean {
  return !!user && (user.role === 'admin' || user.role === 'gestor');
}
