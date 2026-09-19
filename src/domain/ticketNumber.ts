function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

/** YYYY-MM-DD key for a given date, used both as the counter doc id and number prefix. */
export function dayKey(d: Date): string {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

/** Ticket number format: YYYY-MM-DD-NN, NN = sequence within that day. */
export function formatTicketNumber(date: Date, seq: number): string {
  return `${dayKey(date)}-${pad2(seq)}`;
}
