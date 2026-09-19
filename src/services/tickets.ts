import {
  collection,
  doc,
  onSnapshot,
  query,
  where,
  orderBy,
  runTransaction,
  updateDoc,
  arrayUnion,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { StaffUser, Ticket, TicketStatus, Priority, TimelineEntry } from '../types';
import { dayKey, formatTicketNumber } from '../domain/ticketNumber';
import { ticketFromFirestore, timelineEntryToFirestore } from '../lib/firestoreUtils';

/**
 * Hotel-scoped live ticket feed: admins see the whole network, everyone
 * else only their own hotel (mirrors `inHotelScope()` in the prototype,
 * now enforced server-side by firestore.rules too, not just in the UI).
 * All further slicing (quick filters, search, "mine", dashboard tiles) is
 * done client-side over this set, same as the prototype did over its
 * in-memory state — the dataset is small enough (single-property scale)
 * that this stays simple and fast.
 */
export function subscribeTickets(user: StaffUser | null, callback: (tickets: Ticket[]) => void): () => void {
  if (!user) {
    callback([]);
    return () => {};
  }
  const base = collection(db, 'tickets');
  const q =
    user.role === 'admin'
      ? query(base, orderBy('createdAt', 'desc'))
      : query(base, where('hotelId', '==', user.hotelId), orderBy('createdAt', 'desc'));

  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ticketFromFirestore(d.id, d.data())));
  });
}

export interface CreateTicketInput {
  hotelId: string;
  sectorName: string;
  local: string;
  categoryId: string;
  description: string;
  priority: Priority;
  photoUrls: string[];
}

/** Atomically allocates the next YYYY-MM-DD-NN number and creates the ticket. */
export async function createTicket(input: CreateTicketInput, actor: StaffUser): Promise<{ id: string; number: string }> {
  const now = new Date();
  const counterRef = doc(db, 'counters', dayKey(now));
  const ticketRef = doc(collection(db, 'tickets'));

  const number = await runTransaction(db, async (tx) => {
    const counterSnap = await tx.get(counterRef);
    const nextSeq = counterSnap.exists() ? ((counterSnap.data().seq as number) || 0) + 1 : 1;
    const num = formatTicketNumber(now, nextSeq);

    const openedEntry: TimelineEntry = {
      label: 'Chamado aberto',
      note: input.description,
      byName: actor.name,
      byId: actor.id,
      at: now.getTime(),
    };

    tx.set(counterRef, { seq: nextSeq }, { merge: true });
    tx.set(ticketRef, {
      number: num,
      hotelId: input.hotelId,
      sector: input.sectorName,
      local: input.local,
      categoryId: input.categoryId,
      description: input.description,
      priority: input.priority,
      status: 'aberto' as TicketStatus,
      responsavelId: null,
      autoAssigned: false,
      solicitante: actor.name,
      solicitanteUserId: actor.id,
      createdAt: Timestamp.fromMillis(now.getTime()),
      conclusion: null,
      cancellation: null,
      wait: null,
      photos: input.photoUrls,
      timeline: [timelineEntryToFirestore(openedEntry)],
    });
    return num;
  });

  return { id: ticketRef.id, number };
}

function appendTimeline(ticketId: string, entry: TimelineEntry, extraFields: Record<string, unknown> = {}) {
  return updateDoc(doc(db, 'tickets', ticketId), {
    ...extraFields,
    timeline: arrayUnion(timelineEntryToFirestore(entry)),
  });
}

/** Assigning also flips 'aberto' -> 'recebido', same as the prototype's confirmAssign(). */
export async function assignTicket(ticket: Ticket, staffMember: StaffUser, actor: StaffUser): Promise<void> {
  const now = Date.now();
  await appendTimeline(
    ticket.id,
    { label: 'Responsável atribuído', note: `Atribuído a ${staffMember.name}.`, byName: actor.name, byId: actor.id, at: now },
    {
      responsavelId: staffMember.id,
      autoAssigned: false,
      status: ticket.status === 'aberto' ? 'recebido' : ticket.status,
    }
  );
}

/** Used by the 10-minute auto-assign sweep — attributes the action to "Sistema". */
export async function autoAssignTicket(ticket: Ticket, staffMember: StaffUser): Promise<void> {
  const now = Date.now();
  await appendTimeline(
    ticket.id,
    {
      label: 'Responsável atribuído',
      note: `Atribuído automaticamente pelo sistema a ${staffMember.name} após 10 minutos sem atribuição.`,
      byName: 'Sistema',
      byId: null,
      at: now,
    },
    { responsavelId: staffMember.id, autoAssigned: true, status: 'recebido' }
  );
}

const STATUS_LABEL: Record<TicketStatus, string> = {
  aberto: 'Aberto',
  recebido: 'Recebido',
  analise: 'Em análise',
  execucao: 'Em execução',
  aguardando: 'Aguardando',
  concluido: 'Concluído',
  cancelado: 'Cancelado',
};

export async function changeTicketStatus(ticket: Ticket, newStatus: TicketStatus, actor: StaffUser): Promise<void> {
  await appendTimeline(
    ticket.id,
    { label: `Status alterado para "${STATUS_LABEL[newStatus]}"`, note: '', byName: actor.name, byId: actor.id, at: Date.now() },
    { status: newStatus }
  );
}

const PRIORITY_LABEL: Record<Priority, string> = { baixa: 'Baixa', normal: 'Normal', alta: 'Alta', urgente: 'Urgente' };

export async function changeTicketPriority(ticket: Ticket, newPriority: Priority, actor: StaffUser): Promise<void> {
  await appendTimeline(
    ticket.id,
    { label: `Prioridade alterada para "${PRIORITY_LABEL[newPriority]}"`, note: '', byName: actor.name, byId: actor.id, at: Date.now() },
    { priority: newPriority }
  );
}

export async function addTicketNote(ticket: Ticket, noteText: string, photoUrls: string[], actor: StaffUser): Promise<void> {
  const count = photoUrls.length;
  const suffix = count > 0 ? ` (${count} ${count === 1 ? 'imagem anexada' : 'imagens anexadas'})` : '';
  await appendTimeline(
    ticket.id,
    { label: 'Observação registrada', note: noteText.trim() + suffix, byName: actor.name, byId: actor.id, at: Date.now() },
    count > 0 ? { photos: ticket.photos.concat(photoUrls) } : {}
  );
}

export interface ConcludeInput {
  service: string;
  note: string;
  photoUrls: string[];
}

export async function concludeTicket(ticket: Ticket, input: ConcludeInput, actor: StaffUser): Promise<void> {
  const now = Date.now();
  await appendTimeline(
    ticket.id,
    { label: 'Chamado concluído', note: input.service, byName: actor.name, byId: actor.id, at: now },
    {
      status: 'concluido' as TicketStatus,
      conclusion: {
        service: input.service,
        note: input.note,
        at: Timestamp.fromMillis(now),
        byId: actor.id,
      },
      photos: ticket.photos.concat(input.photoUrls),
    }
  );
}

export async function cancelTicket(ticket: Ticket, reason: string, actor: StaffUser): Promise<void> {
  const now = Date.now();
  await appendTimeline(
    ticket.id,
    { label: 'Chamado cancelado', note: reason, byName: actor.name, byId: actor.id, at: now },
    {
      status: 'cancelado' as TicketStatus,
      cancellation: { reason, at: Timestamp.fromMillis(now), byId: actor.id },
    }
  );
}
