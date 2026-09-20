import { SlaConfig, StaffUser, Ticket } from '../types';
import { computeSla, isNonTerminal } from './sla';
import { inHotelScope } from './permissions';

export interface AppNotification {
  id: string;
  ticketId: string;
  text: string;
  at: number;
}

/**
 * In-app notification feed, derived live from ticket state — same
 * approach as the prototype (no persistence, recomputed on every read).
 * Round 2 turns the "assigned"/"created" cases into real FCM push sends
 * server-side; this function stays useful as the source of truth for
 * *when* those pushes should fire.
 */
export function deriveNotifications(
  tickets: Ticket[],
  currentUser: StaffUser | null,
  slaConfig: SlaConfig,
  now: Date = new Date()
): AppNotification[] {
  if (!currentUser) return [];
  const notifications: AppNotification[] = [];

  for (const t of tickets) {
    if (!inHotelScope(currentUser, t)) continue;

    if (isNonTerminal(t)) {
      const sla = computeSla(t, slaConfig, now);
        if (sla.state === 'overdue') {
        notifications.push({ id: `${t.id}-o`, ticketId: t.id, text: `Chamado ${t.number} está com o SLA estourado.`, at: now.getTime() });
      } else if (sla.state === 'warning' && t.priority !== 'urgente') {
        notifications.push({ id: `${t.id}-w`, ticketId: t.id, text: `Chamado ${t.number} está próximo do prazo de SLA.`, at: now.getTime() });
      }
    }

    if (t.responsavelId === currentUser.id && t.timeline.length) {
      const last = t.timeline[t.timeline.length - 1];
      if (last.label === 'Responsável atribuído') {
        notifications.push({
          id: `${t.id}-a`,
          ticketId: t.id,
          text: `Chamado ${t.number} foi atribuído a você${t.autoAssigned ? ' automaticamente pelo sistema.' : '.'}`,
          at: last.at,
        });
      }
    }

    if (t.solicitanteUserId === currentUser.id && t.timeline.length === 1) {
      notifications.push({ id: `${t.id}-c`, ticketId: t.id, text: `Chamado ${t.number} foi criado com sucesso.`, at: t.createdAt });
    }
  }

  notifications.sort((a, b) => b.at - a.at);
  return notifications.slice(0, 6);
}
