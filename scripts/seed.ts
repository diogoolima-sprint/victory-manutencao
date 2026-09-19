/**
 * Seeds the Firebase Local Emulator Suite with the exact demo dataset
 * from the design prototype (project/Victory Manutenção.dc.html):
 * 2 hotels, their sectors, the 10 categories, 5 staff accounts (as real
 * Firebase Auth users), and ~20 sample tickets with realistic timelines.
 *
 * Uses the Admin SDK, which bypasses firestore.rules/storage.rules
 * entirely — this is trusted server-side tooling, never shipped in the
 * app. Run with the emulators already up: `npm run seed` (see README).
 */
import { initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';

process.env.FIRESTORE_EMULATOR_HOST = process.env.FIRESTORE_EMULATOR_HOST || '127.0.0.1:8080';
process.env.FIREBASE_AUTH_EMULATOR_HOST = process.env.FIREBASE_AUTH_EMULATOR_HOST || '127.0.0.1:9099';

const PROJECT_ID = 'demo-victory-manutencao';
const app = initializeApp({ projectId: PROJECT_ID });
const auth = getAuth(app);
const db = getFirestore(app);

const SEED_PASSWORD = 'victory123';

type Priority = 'baixa' | 'normal' | 'alta' | 'urgente';
type Status = 'aberto' | 'recebido' | 'analise' | 'execucao' | 'aguardando' | 'concluido' | 'cancelado';

const NOW = new Date();
const daysAgo = (d: number, h = 9, m = 0) => {
  const dt = new Date(NOW);
  dt.setDate(dt.getDate() - d);
  dt.setHours(h, m, 0, 0);
  return dt;
};
const hoursAgo = (h: number) => new Date(NOW.getTime() - h * 3600000);
const minsAgo = (m: number) => new Date(NOW.getTime() - m * 60000);

const hotels = [
  { id: 'h1', name: 'Victory Business', unidade: 'VB', perfil: 'Business', apartamentos: 152, ativo: true },
  { id: 'h2', name: 'Victory Suítes', unidade: 'VS', perfil: 'Suítes', apartamentos: 122, ativo: true },
];

const sectorNames = ['UHs', 'Recepção', 'Governança', 'Manutenção', 'Cozinha', 'Restaurante', 'Administrativo', 'Lavanderia', 'Áreas comuns'];
const sectors = hotels.flatMap((h) => sectorNames.map((n, i) => ({ id: `${h.id}-s${i}`, hotelId: h.id, name: n, ativo: true })));

const categoryNames = ['Elétrica', 'Hidráulica', 'Ar-condicionado', 'Mobiliário', 'Equipamentos', 'Eletrônica', 'Pintura', 'Estrutura', 'Segurança', 'Outros'];
const categories = categoryNames.map((n, i) => ({ id: `c${i + 1}`, name: n, ativo: true }));
const catByName = (n: string) => categories.find((c) => c.name === n)!.id;

const staff = [
  { id: 'u1', name: 'Diogo Lima', username: 'diogo.lima', role: 'admin', hotelId: null as string | null, ativo: true },
  { id: 'u2', name: 'Marcos', username: 'marcos', role: 'manutencao', hotelId: 'h1', ativo: true },
  { id: 'u3', name: 'Rodrigo', username: 'rodrigo', role: 'manutencao', hotelId: 'h1', ativo: true },
  { id: 'u4', name: 'Cácio', username: 'cacio', role: 'manutencao', hotelId: 'h2', ativo: true },
  { id: 'u5', name: 'Jeferson', username: 'jeferson', role: 'manutencao', hotelId: 'h2', ativo: true },
];
const staffById = Object.fromEntries(staff.map((u) => [u.id, u]));

interface RawTicket {
  n: number; h: string; s: string; l: string; cat: string; d: string; p: Priority; st: Status;
  resp: string | null; sol: string; solU?: string; created: Date;
  concl?: { service: string; note: string; at: Date; byId: string };
  canc?: { reason: string; at: Date; byId: string };
  wait?: string;
}

// Verbatim from the prototype's seed data (Victory Manutenção.dc.html:1110-1131).
const raw: RawTicket[] = [
  { n: 101, h: 'h1', s: 'Recepção', l: 'Balcão da recepção', cat: 'Mobiliário', d: 'Gaveta do balcão emperrada, não fecha corretamente.', p: 'baixa', st: 'concluido', resp: 'u1', sol: 'Diogo Lima', solU: 'u1', created: daysAgo(28), concl: { service: 'Ajustada corrediça da gaveta e lubrificados os trilhos.', note: 'Sem necessidade de troca de peça.', at: daysAgo(26, 11), byId: 'u1' } },
  { n: 102, h: 'h1', s: 'Governança', l: 'Apartamento 210', cat: 'Hidráulica', d: 'Vazamento no registro do chuveiro, água acumulando no piso.', p: 'alta', st: 'concluido', resp: 'u1', sol: 'Diogo Lima', created: daysAgo(27), concl: { service: 'Substituído registro de gaveta do chuveiro.', note: 'Testado por 15 min sem novos vazamentos.', at: daysAgo(26, 16), byId: 'u1' } },
  { n: 103, h: 'h1', s: 'Cozinha', l: 'Cozinha principal', cat: 'Equipamentos', d: 'Fogão industrial com um queimador que não acende.', p: 'urgente', st: 'concluido', resp: 'u1', sol: 'Diogo Lima', created: daysAgo(25), concl: { service: 'Limpeza do injetor e troca da vela de ignição do queimador.', note: 'Equipamento voltou a funcionar normalmente.', at: daysAgo(24, 20), byId: 'u1' } },
  { n: 104, h: 'h2', s: 'Áreas comuns', l: 'Área da piscina', cat: 'Estrutura', d: 'Piso ao redor da piscina com azulejo trincado, risco de acidente.', p: 'alta', st: 'concluido', resp: 'u1', sol: 'Diogo Lima', created: daysAgo(24), concl: { service: 'Azulejo substituído e rejunte refeito.', note: 'Área isolada durante o serviço, liberada em seguida.', at: daysAgo(23, 14), byId: 'u1' } },
  { n: 105, h: 'h1', s: 'Administrativo', l: 'Sala financeiro', cat: 'Eletrônica', d: 'Impressora fiscal apresentando erro de papel constante.', p: 'normal', st: 'concluido', resp: 'u1', sol: 'Diogo Lima', solU: 'u1', created: daysAgo(23), concl: { service: 'Limpeza do sensor de papel e recalibração.', note: '', at: daysAgo(22, 10), byId: 'u1' } },
  { n: 106, h: 'h1', s: 'Manutenção', l: 'Depósito de manutenção', cat: 'Segurança', d: 'Extintor com carga vencida.', p: 'normal', st: 'concluido', resp: 'u1', sol: 'Diogo Lima', solU: 'u1', created: daysAgo(22), concl: { service: 'Extintor recarregado pela empresa terceirizada.', note: 'Etiqueta de validade atualizada.', at: daysAgo(20, 9), byId: 'u1' } },
  { n: 107, h: 'h1', s: 'Restaurante', l: 'Salão do restaurante', cat: 'Ar-condicionado', d: 'Ar-condicionado do salão não está resfriando.', p: 'alta', st: 'concluido', resp: 'u1', sol: 'Diogo Lima', solU: 'u1', created: daysAgo(21), concl: { service: 'Higienização dos filtros e recarga de gás.', note: '', at: daysAgo(20, 15), byId: 'u1' } },
  { n: 108, h: 'h1', s: 'Governança', l: 'Apartamento 412', cat: 'Elétrica', d: 'Tomada do quarto sem energia.', p: 'normal', st: 'concluido', resp: 'u1', sol: 'Diogo Lima', solU: 'u1', created: daysAgo(20), concl: { service: 'Disjuntor do circuito rearmado e tomada substituída.', note: '', at: daysAgo(19, 12), byId: 'u1' } },
  { n: 109, h: 'h2', s: 'Lavanderia', l: 'Lavanderia', cat: 'Equipamentos', d: 'Secadora industrial fazendo barulho excessivo.', p: 'normal', st: 'cancelado', resp: null, sol: 'Diogo Lima', created: daysAgo(19), canc: { reason: 'Equipamento será substituído no próximo trimestre — reparo não é mais necessário.', at: daysAgo(18, 9), byId: 'u1' } },
  { n: 110, h: 'h1', s: 'Recepção', l: 'Corredor do 3º andar', cat: 'Pintura', d: 'Pintura descascando próximo ao elevador.', p: 'baixa', st: 'concluido', resp: 'u1', sol: 'Diogo Lima', solU: 'u1', created: daysAgo(17), concl: { service: 'Trecho lixado e repintado.', note: '', at: daysAgo(15, 13), byId: 'u1' } },
  { n: 111, h: 'h1', s: 'Governança', l: 'Apartamento 108', cat: 'Ar-condicionado', d: 'Ar-condicionado pingando água no carpete.', p: 'alta', st: 'execucao', resp: 'u1', sol: 'Diogo Lima', created: daysAgo(6) },
  { n: 112, h: 'h1', s: 'Governança', l: 'Apartamento 305', cat: 'Hidráulica', d: 'Vaso sanitário com descarga contínua.', p: 'alta', st: 'execucao', resp: 'u1', sol: 'Diogo Lima', solU: 'u1', created: daysAgo(5) },
  { n: 113, h: 'h2', s: 'Cozinha', l: 'Cozinha', cat: 'Elétrica', d: 'Disjuntor da cozinha desarmando sozinho.', p: 'urgente', st: 'execucao', resp: 'u1', sol: 'Diogo Lima', created: hoursAgo(20) },
  { n: 114, h: 'h1', s: 'Áreas comuns', l: 'Academia', cat: 'Equipamentos', d: 'Esteira ergométrica com correia solta.', p: 'normal', st: 'aguardando', resp: 'u1', sol: 'Diogo Lima', solU: 'u1', created: daysAgo(4), wait: 'Aguardando peça de reposição do fornecedor.' },
  { n: 115, h: 'h1', s: 'Administrativo', l: 'Recepção administrativa', cat: 'Eletrônica', d: 'Computador da recepção travando com frequência.', p: 'normal', st: 'analise', resp: null, sol: 'Diogo Lima', solU: 'u1', created: daysAgo(3) },
  { n: 116, h: 'h1', s: 'Restaurante', l: 'Cozinha do restaurante', cat: 'Segurança', d: 'Sensor de fumaça disparando falso alarme.', p: 'alta', st: 'analise', resp: 'u1', sol: 'Diogo Lima', solU: 'u1', created: daysAgo(2) },
  { n: 117, h: 'h2', s: 'Governança', l: 'Apartamento 704', cat: 'Mobiliário', d: 'Porta do guarda-roupa saiu do trilho.', p: 'baixa', st: 'recebido', resp: 'u1', sol: 'Diogo Lima', created: daysAgo(1) },
  { n: 118, h: 'h1', s: 'Recepção', l: 'Banheiro da recepção', cat: 'Hidráulica', d: 'Torneira pingando continuamente.', p: 'baixa', st: 'recebido', resp: null, sol: 'Diogo Lima', solU: 'u1', created: hoursAgo(20) },
  { n: 119, h: 'h1', s: 'Governança', l: 'Apartamento 220', cat: 'Ar-condicionado', d: 'Ar-condicionado não liga.', p: 'urgente', st: 'aberto', resp: null, sol: 'Diogo Lima', created: hoursAgo(3) },
  { n: 120, h: 'h1', s: 'Governança', l: 'Apartamento 501', cat: 'Elétrica', d: 'Chuveiro elétrico sem aquecer.', p: 'urgente', st: 'aberto', resp: null, sol: 'Diogo Lima', solU: 'u1', created: minsAgo(40) },
];

interface TimelineEntry { label: string; note: string; byName: string; byId: string | null; at: Date }

function buildSeedLog(t: { status: Status; createdAt: Date; description: string; solicitante: string; responsavelId: string | null; conclusion: RawTicket['concl']; cancellation: RawTicket['canc']; wait: string | null }): TimelineEntry[] {
  const order: Status[] = ['aberto', 'recebido', 'analise', 'execucao', 'aguardando'];
  const idx = order.indexOf(t.status);
  const stepsPassed = t.status === 'concluido' || t.status === 'cancelado' ? order.length : idx + 1;
  const endTime = t.conclusion ? t.conclusion.at : t.cancellation ? t.cancellation.at : NOW;
  const span = Math.max(endTime.getTime() - t.createdAt.getTime(), 60000);
  const log: TimelineEntry[] = [];

  for (let i = 0; i < stepsPassed; i++) {
    const st = order[i];
    const at = new Date(t.createdAt.getTime() + span * (i / Math.max(stepsPassed, 1)) * 0.8);
    if (st === 'aberto') log.push({ label: 'Chamado aberto', note: t.description, byName: t.solicitante, byId: null, at: t.createdAt });
    else if (st === 'recebido') log.push({ label: 'Chamado recebido', note: 'Solicitação recebida pela equipe de manutenção.', byName: 'Sistema', byId: null, at });
    else if (st === 'analise') log.push({ label: 'Em análise técnica', note: 'Equipe avaliando o problema reportado.', byName: t.responsavelId ? staffById[t.responsavelId].name : 'Manutenção', byId: t.responsavelId, at });
    else if (st === 'execucao') log.push({ label: 'Execução iniciada', note: 'Início do atendimento em campo.', byName: t.responsavelId ? staffById[t.responsavelId].name : 'Manutenção', byId: t.responsavelId, at });
    else if (st === 'aguardando') log.push({ label: 'Aguardando', note: t.wait || 'Aguardando peça ou fornecedor.', byName: t.responsavelId ? staffById[t.responsavelId].name : 'Manutenção', byId: t.responsavelId, at });
  }
  if (t.responsavelId) log.push({ label: 'Responsável atribuído', note: `Atribuído a ${staffById[t.responsavelId].name}.`, byName: 'Gestão do hotel', byId: null, at: new Date(t.createdAt.getTime() + span * 0.25) });
  if (t.conclusion) log.push({ label: 'Chamado concluído', note: t.conclusion.service + (t.conclusion.note ? ' ' + t.conclusion.note : ''), byName: staffById[t.conclusion.byId].name, byId: t.conclusion.byId, at: t.conclusion.at });
  if (t.cancellation) log.push({ label: 'Chamado cancelado', note: t.cancellation.reason, byName: staffById[t.cancellation.byId].name, byId: t.cancellation.byId, at: t.cancellation.at });
  log.sort((a, b) => a.at.getTime() - b.at.getTime());
  return log;
}

const pad2 = (n: number) => String(n).padStart(2, '0');
const dayKey = (d: Date) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;

async function main() {
  console.log(`Seeding emulator project "${PROJECT_ID}"...`);

  console.log('Creating Auth users + hotels + sectors + categories...');
  for (const u of staff) {
    const email = `${u.username}@victory.internal`;
    try {
      await auth.createUser({ uid: u.id, email, password: SEED_PASSWORD, displayName: u.name });
    } catch (e: unknown) {
      if ((e as { code?: string }).code !== 'auth/uid-already-exists') throw e;
    }
    await db.doc(`users/${u.id}`).set({
      name: u.name,
      username: u.username,
      role: u.role,
      hotelId: u.hotelId,
      ativo: u.ativo,
      mustChangePassword: false,
    });
  }

  for (const h of hotels) await db.doc(`hotels/${h.id}`).set(h);
  for (const s of sectors) await db.doc(`sectors/${s.id}`).set(s);
  for (const c of categories) await db.doc(`categories/${c.id}`).set(c);
  await db.doc('slaConfig/default').set({ baixa: 72, normal: 24, alta: 2, urgente: 0 });

  console.log('Creating tickets...');
  const sorted = [...raw].sort((a, b) => a.created.getTime() - b.created.getTime());
  const dayCounters: Record<string, number> = {};
  const batch = db.batch();

  for (const r of sorted) {
    const key = dayKey(r.created);
    dayCounters[key] = (dayCounters[key] || 0) + 1;
    const number = `${key}-${pad2(dayCounters[key])}`;

    const conclusion = r.concl
      ? { service: r.concl.service, note: r.concl.note, at: Timestamp.fromDate(r.concl.at), byId: r.concl.byId }
      : null;
    const cancellation = r.canc
      ? { reason: r.canc.reason, at: Timestamp.fromDate(r.canc.at), byId: r.canc.byId }
      : null;

    const timeline = buildSeedLog({
      status: r.st,
      createdAt: r.created,
      description: r.d,
      solicitante: r.sol,
      responsavelId: r.resp,
      conclusion: r.concl,
      cancellation: r.canc,
      wait: r.wait || null,
    }).map((e) => ({ ...e, at: Timestamp.fromDate(e.at) }));

    const ref = db.doc(`tickets/t${r.n}`);
    batch.set(ref, {
      number,
      hotelId: r.h,
      sector: r.s,
      local: r.l,
      categoryId: catByName(r.cat),
      description: r.d,
      priority: r.p,
      status: r.st,
      responsavelId: r.resp,
      autoAssigned: false,
      solicitante: r.sol,
      solicitanteUserId: r.solU || 'u1',
      createdAt: Timestamp.fromDate(r.created),
      conclusion,
      cancellation,
      wait: r.wait || null,
      photos: [],
      timeline,
    });
  }
  await batch.commit();

  console.log('Setting today\'s ticket-number counters...');
  for (const [key, count] of Object.entries(dayCounters)) {
    await db.doc(`counters/${key}`).set({ seq: count });
  }

  console.log('\nDone. Demo logins (all password "victory123"):');
  for (const u of staff) console.log(`  ${u.username.padEnd(12)} ${u.role}`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
