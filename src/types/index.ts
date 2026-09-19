// Data model mirrors the Victory Manutenção design prototype
// (project/Victory Manutenção.dc.html) field-for-field, so the
// business rules documented in the handoff carry over unchanged.

export type Role = 'admin' | 'gestor' | 'manutencao' | 'solicitante';

export type Priority = 'baixa' | 'normal' | 'alta' | 'urgente';

export type TicketStatus =
  | 'aberto'
  | 'recebido'
  | 'analise'
  | 'execucao'
  | 'aguardando'
  | 'concluido'
  | 'cancelado';

export interface Hotel {
  id: string;
  name: string;
  unidade: string;
  perfil: string;
  apartamentos: number;
  ativo: boolean;
}

export interface Sector {
  id: string;
  hotelId: string;
  name: string;
  ativo: boolean;
}

export interface Category {
  id: string;
  name: string;
  ativo: boolean;
}

export interface StaffUser {
  id: string; // Firebase Auth uid
  name: string;
  username: string;
  role: Role;
  hotelId: string | null; // null only for admin (network-wide)
  ativo: boolean;
  mustChangePassword: boolean;
}

export interface RoomFloorRange {
  floor: number;
  start: number;
  end: number;
}

export interface TimelineEntry {
  label: string;
  note: string;
  byName: string;
  byId: string | null; // null for "Sistema"
  at: number; // epoch millis
}

export interface TicketConclusion {
  service: string;
  note: string;
  at: number;
  byId: string;
}

export interface TicketCancellation {
  reason: string;
  at: number;
  byId: string;
}

export interface Ticket {
  id: string;
  number: string; // YYYY-MM-DD-NN
  hotelId: string;
  sector: string;
  local: string;
  categoryId: string;
  description: string;
  priority: Priority;
  status: TicketStatus;
  responsavelId: string | null;
  autoAssigned: boolean;
  solicitante: string; // display name, captured at creation
  solicitanteUserId: string;
  createdAt: number; // epoch millis
  conclusion: TicketConclusion | null;
  cancellation: TicketCancellation | null;
  wait: string | null;
  photos: string[]; // Firebase Storage download URLs
  timeline: TimelineEntry[];
}

export type SlaState = 'ok' | 'warning' | 'overdue' | 'done';

export interface SlaResult {
  state: SlaState;
  label: string;
}

export type SlaConfig = Record<Priority, number>; // hours allowed per priority

export const DEFAULT_SLA_CONFIG: SlaConfig = {
  baixa: 72,
  normal: 24,
  alta: 2,
  urgente: 0,
};

export const ROLE_LABEL: Record<Role, string> = {
  admin: 'Administrador da rede',
  gestor: 'Gestor do hotel',
  manutencao: 'Manutenção',
  solicitante: 'Solicitante',
};

export const PRIORITY_ORDER: Priority[] = ['baixa', 'normal', 'alta', 'urgente'];

export const STATUS_META: Record<TicketStatus, { label: string; bg: string; color: string }> = {
  aberto: { label: 'Aberto', bg: '#EFEDE8', color: '#6B655D' },
  recebido: { label: 'Recebido', bg: '#D7EEF9', color: '#007FB6' },
  analise: { label: 'Em análise', bg: '#FBEED2', color: '#C9881A' },
  execucao: { label: 'Em execução', bg: '#FDE7E5', color: '#DC4A43' },
  aguardando: { label: 'Aguardando', bg: '#E8E8E8', color: '#4A4A4A' },
  concluido: { label: 'Concluído', bg: '#DCF3E6', color: '#1F8A5B' },
  cancelado: { label: 'Cancelado', bg: '#E8E8E8', color: '#8B8B8B' },
};

export const PRIORITY_META: Record<Priority, { label: string; bg: string; color: string }> = {
  baixa: { label: 'Baixa', bg: '#EFEDE8', color: '#6B655D' },
  normal: { label: 'Normal', bg: '#D7EEF9', color: '#007FB6' },
  alta: { label: 'Alta', bg: '#FBEED2', color: '#C9881A' },
  urgente: { label: 'Urgente', bg: '#FDE0DE', color: '#B53B35' },
};

// Room ranges per floor, hardcoded per the client's actual floor plans.
export const ROOM_FLOORS_BUSINESS: RoomFloorRange[] = [
  { floor: 4, start: 401, end: 412 },
  { floor: 5, start: 500, end: 512 },
  { floor: 6, start: 600, end: 612 },
  { floor: 7, start: 700, end: 712 },
  { floor: 8, start: 800, end: 812 },
  { floor: 9, start: 900, end: 912 },
  { floor: 10, start: 1000, end: 1012 },
  { floor: 11, start: 1100, end: 1112 },
  { floor: 12, start: 1200, end: 1212 },
  { floor: 13, start: 1300, end: 1312 },
  { floor: 14, start: 1400, end: 1412 },
  { floor: 15, start: 1500, end: 1512 },
];

export const ROOM_FLOORS_SUITES: RoomFloorRange[] = [
  { floor: 5, start: 501, end: 509 },
  { floor: 6, start: 601, end: 609 },
  { floor: 7, start: 701, end: 709 },
  { floor: 8, start: 801, end: 809 },
  { floor: 9, start: 901, end: 909 },
  { floor: 10, start: 1001, end: 1009 },
  { floor: 11, start: 1101, end: 1109 },
  { floor: 12, start: 1201, end: 1209 },
  { floor: 13, start: 1301, end: 1309 },
  { floor: 14, start: 1401, end: 1409 },
  { floor: 15, start: 1501, end: 1509 },
  { floor: 16, start: 1601, end: 1609 },
  { floor: 17, start: 1703, end: 1709 },
  { floor: 18, start: 1803, end: 1809 },
];

// Fixed business rule: exactly two technicians per hotel, hardcoded by
// hotel id ("h1" = Victory Business, "h2" = Victory Suítes) as seeded.
// Never offer a technician from the other hotel in an assignment picker.
