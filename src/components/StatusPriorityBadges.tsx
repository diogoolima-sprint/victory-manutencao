import React from 'react';
import { Badge } from './Badge';
import { PRIORITY_META, STATUS_META, Priority, TicketStatus } from '../types';

export function StatusBadge({ status, size = 'md' }: { status: TicketStatus; size?: 'sm' | 'md' }) {
  const m = STATUS_META[status];
  return <Badge label={m.label} bg={m.bg} color={m.color} size={size} />;
}

export function PriorityBadge({ priority, size = 'md' }: { priority: Priority; size?: 'sm' | 'md' }) {
  const m = PRIORITY_META[priority];
  return <Badge label={m.label} bg={m.bg} color={m.color} dot size={size} />;
}
