import { Ticket, SlaConfig, SlaResult, SlaState } from '../types';
import { fmtElapsed } from './format';

export const slaStyle: Record<SlaState, { bg: string; color: string }> = {
  ok: { bg: '#DCF3E6', color: '#1F8A5B' },
  warning: { bg: '#FBEED2', color: '#C9881A' },
  overdue: { bg: '#FDE0DE', color: '#B53B35' },
  done: { bg: '#EFEDE8', color: '#6B655D' },
};

// Ported 1:1 from the prototype's computeSla(). Urgente tickets get one
// hour of grace ("Atenção imediata") before flipping to overdue — this
// mirrors slaConfig.urgente = 0h plus that grace window, exactly as built.
export function computeSla(ticket: Ticket, slaConfig: SlaConfig, now: Date = new Date()): SlaResult {
  if (ticket.status === 'concluido' && ticket.conclusion) {
    const h = (ticket.conclusion.at - ticket.createdAt) / 3600000;
    return { state: 'done', label: `Resolvido em ${fmtElapsed(h)}` };
  }
  if (ticket.status === 'cancelado') {
    return { state: 'done', label: 'Cancelado' };
  }
  const limit = slaConfig[ticket.priority];
  const elapsed = (now.getTime() - ticket.createdAt) / 3600000;

  if (ticket.priority === 'urgente') {
    return elapsed > 1
      ? { state: 'overdue', label: `Atrasado há ${fmtElapsed(elapsed - 1)}` }
      : { state: 'warning', label: 'Atenção imediata' };
  }
  const remaining = limit - elapsed;
  if (remaining < 0) return { state: 'overdue', label: `Atrasado há ${fmtElapsed(-remaining)}` };
  if (remaining <= limit * 0.25) return { state: 'warning', label: `Vence em ${fmtElapsed(remaining)}` };
  return { state: 'ok', label: `Vence em ${fmtElapsed(remaining)}` };
}

export function isNonTerminal(ticket: Ticket): boolean {
  return ticket.status !== 'concluido' && ticket.status !== 'cancelado';
}
