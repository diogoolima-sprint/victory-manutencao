import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Ticket } from '../types';
import { subscribeTickets, autoAssignTicket } from '../services/tickets';
import { findTicketsDueForAutoAssign, pickAutoAssignee } from '../domain/autoAssign';
import { useAuth } from './AuthContext';
import { useReferenceData } from './ReferenceDataContext';

interface TicketsContextValue {
  tickets: Ticket[];
  loading: boolean;
}

const TicketsContext = createContext<TicketsContextValue>({ tickets: [], loading: true });

export function TicketsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { staff } = useReferenceData();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  // Latest snapshot for the auto-assign sweep interval closure below.
  const ticketsRef = useRef<Ticket[]>([]);
  const staffRef = useRef(staff);
  ticketsRef.current = tickets;
  staffRef.current = staff;

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeTickets(user, (v) => {
      setTickets(v);
      setLoading(false);
    });
    return unsubscribe;
  }, [user]);

  // 10-minute auto-assign fallback, checked every 15s — ported from the
  // prototype's componentDidMount interval. See src/domain/autoAssign.ts
  // for why this belongs in a server-side Cloud Function eventually.
  useEffect(() => {
    if (!user) return;
    const canRunSweep = user.role === 'admin' || user.role === 'gestor';
    if (!canRunSweep) return;

    const id = setInterval(() => {
      const due = findTicketsDueForAutoAssign(ticketsRef.current);
      due.forEach((t) => {
        const pick = pickAutoAssignee(t, ticketsRef.current, staffRef.current);
        if (pick) autoAssignTicket(t, pick).catch(() => {});
      });
    }, 15000);
    return () => clearInterval(id);
  }, [user]);

  return <TicketsContext.Provider value={{ tickets, loading }}>{children}</TicketsContext.Provider>;
}

export function useTickets(): TicketsContextValue {
  return useContext(TicketsContext);
}
