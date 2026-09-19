import { Timestamp } from 'firebase/firestore';
import { Ticket, TimelineEntry, TicketConclusion, TicketCancellation } from '../types';

// Firestore stores dates as Timestamp; the rest of the app works with
// epoch-millis numbers (matches how the prototype used plain JS Dates
// and keeps arithmetic like `(now - createdAt) / 3600000` simple).

export function ticketFromFirestore(id: string, data: Record<string, unknown>): Ticket {
  const toMillis = (v: unknown): number =>
    v instanceof Timestamp ? v.toMillis() : typeof v === 'number' ? v : 0;

  const timeline = ((data.timeline as Record<string, unknown>[] | undefined) || []).map(
    (e): TimelineEntry => ({
      label: e.label as string,
      note: (e.note as string) || '',
      byName: e.byName as string,
      byId: (e.byId as string | null) ?? null,
      at: toMillis(e.at),
    })
  );

  const conclusionRaw = data.conclusion as Record<string, unknown> | null | undefined;
  const conclusion: TicketConclusion | null = conclusionRaw
    ? {
        service: conclusionRaw.service as string,
        note: (conclusionRaw.note as string) || '',
        at: toMillis(conclusionRaw.at),
        byId: conclusionRaw.byId as string,
      }
    : null;

  const cancellationRaw = data.cancellation as Record<string, unknown> | null | undefined;
  const cancellation: TicketCancellation | null = cancellationRaw
    ? {
        reason: cancellationRaw.reason as string,
        at: toMillis(cancellationRaw.at),
        byId: cancellationRaw.byId as string,
      }
    : null;

  return {
    id,
    number: data.number as string,
    hotelId: data.hotelId as string,
    sector: data.sector as string,
    local: data.local as string,
    categoryId: data.categoryId as string,
    description: data.description as string,
    priority: data.priority as Ticket['priority'],
    status: data.status as Ticket['status'],
    responsavelId: (data.responsavelId as string | null) ?? null,
    autoAssigned: !!data.autoAssigned,
    solicitante: data.solicitante as string,
    solicitanteUserId: data.solicitanteUserId as string,
    createdAt: toMillis(data.createdAt),
    conclusion,
    cancellation,
    wait: (data.wait as string | null) ?? null,
    photos: (data.photos as string[]) || [],
    timeline,
  };
}

export function timelineEntryToFirestore(e: TimelineEntry) {
  return { ...e, at: Timestamp.fromMillis(e.at) };
}
