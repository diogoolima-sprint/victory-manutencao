# Victory Manutenção

Production React Native (Expo) app for the Victory Hotéis maintenance-ticket
system, rebuilt from a Claude Design handoff bundle. The bundle's own
provenance docs — its intro README, the 7 chat transcripts that record the
client's actual final decisions, and its condensed handoff spec — are kept
under `design-reference/` in this repo (the original `.dc.html` prototype
file itself isn't included; it's a 165KB single-file design-tool artifact
that was never meant to be ported as code, only read for logic/copy, which
is now captured in this app instead). Those provenance docs remain the
source of truth for *why* a given screen or rule looks the way it does;
this app reimplements the same screens/logic in TypeScript against a real
Firebase backend instead of the prototype's in-memory state.

## Stack

- **Expo + React Native + TypeScript**, targeting an installable Android/iOS
  app (per the client's own conclusion in the design chats: "vou instalar
  o APP via apk no celular de cada técnico").
- **Firebase**: Auth (username + password, mapped to a synthetic email —
  see `src/lib/username.ts`), Firestore (tickets/hotels/sectors/
  categories/staff), Storage (ticket photos).
- **React Navigation**: auth-gated stack + role-based bottom tabs.

## Getting started

```bash
npm install
cp .env.example .env        # already done for you; emulator mode by default
npm run emulators           # terminal 1 — Firebase Local Emulator Suite
npm run seed                # terminal 2 — one-time: seeds demo data + accounts
npm start                   # terminal 2 — Expo dev server
```

Then press `a` (Android) or `i` (iOS) in the Expo CLI, or scan the QR code
with Expo Go / a dev build. On a physical device or the Android emulator,
set `EXPO_PUBLIC_FIREBASE_EMULATOR_HOST` in `.env` to your machine's LAN IP
(or `10.0.2.2` for the Android emulator) instead of `127.0.0.1`, since the
device can't reach your laptop's loopback address.

**Demo logins** (all password `victory123`, seeded by `npm run seed`):

| username     | role       | hotel            |
|--------------|------------|------------------|
| `diogo.lima` | admin      | rede inteira     |
| `marcos`     | manutenção | Victory Business |
| `rodrigo`    | manutenção | Victory Business |
| `cacio`      | manutenção | Victory Suítes   |
| `jeferson`   | manutenção | Victory Suítes   |

There's no seeded `gestor` or `solicitante` account — that mirrors the
final state of the design prototype, where every demo ticket is
attributed to Diogo Lima (admin) after the client asked to strip out the
other placeholder names (see `design-reference/chats/chat5.md`). Create one via Firebase
Auth + a `users/{uid}` Firestore doc if you want to test those roles.

### Switching to a real Firebase project

Once you have one: fill in the real values in `.env` (see
`.env.example`) and set `EXPO_PUBLIC_USE_FIREBASE_EMULATOR=false`. Deploy
the security rules and seed the real project the same way:

```bash
npx firebase deploy --only firestore:rules,storage:rules --project <your-project-id>
FIRESTORE_EMULATOR_HOST= FIREBASE_AUTH_EMULATOR_HOST= npm run seed   # careful: seeds the REAL project
```

(Only run `seed` against a real project once, or adjust it first — it's
written to be idempotent for Auth users but will duplicate ticket docs on
a second run.)

## What's implemented (round 1 — core flow)

Every screen and business rule below was ported from the original
`.dc.html` prototype's logic (its `<script data-dc-script>` block) and
cross-checked against the `design-reference/chats/*.md` transcripts, which
record the client's actual final decisions (several diverge from the
bundle's own `design-reference/handoff-spec.md` — noted below).

- **Auth**: real Firebase Auth, username-only UI (no email ever shown),
  first-login forced 6-digit password reset (`mustChangePassword`).
- **Roles & permissions**: admin / gestor / manutenção / solicitante,
  enforced in both the UI (`src/domain/permissions.ts`) and
  **server-side** in `firestore.rules` — the prototype's permissions only
  ever lived in client code, which was explicitly flagged as
  unacceptable for production in `design-reference/chats/chat6.md`.
- **Home** (role-based), **Painel de Chamados** / **Meus Chamados** (with
  quick filters, full filter panel, and search), **Novo Chamado**
  (multi-step wizard — hotel→setor→local/quarto→categoria→descrição→
  prioridade→foto→resumo→confirmação, with the exact per-floor room
  ranges for both hotels), and **Detalhe do Chamado** (assignment locked
  to the 2 technicians of that ticket's hotel, status changes,
  conclusion, cancellation, notes, priority override for admin/gestor,
  timeline).
- **Real photo upload** (camera + gallery via `expo-image-picker`) to
  Firebase Storage — the prototype only simulated this with a photo-count
  badge.
- **SLA computation** and the **10-minute auto-assign fallback**, ported
  1:1 from the prototype (`src/domain/sla.ts`, `src/domain/autoAssign.ts`).
- **Atomic `YYYY-MM-DD-NN` ticket numbering** via a Firestore transaction
  (the prototype computed this client-side over its whole in-memory
  ticket list, which doesn't work with concurrent real users).
- **In-app notifications** (bell-style derivation, not push yet — see
  below), derived live the same way the prototype did.

### One correction from the prototype, not a new business rule

The prototype's "Ações" card in ticket detail was gated on `canManage`
alone (admin/gestor), even though it separately computed per-action flags
(`canConclude`, `canChangeStatus`, `canAddNote`) that already account for
the assigned technician. That combination would have locked technicians
out of ever updating a ticket via detail — flatly contradicting the
original spec's "Manutenção: ...assume chamados, atualiza status,
registra o que foi realizado e encerra a solicitação"
(`design-reference/chats/chat1.md`)
and making the whole "Painel de manutenção" pointless. Treated as a
leftover-wrapper bug, not intent — see the comment in
`src/screens/TicketDetailScreen.tsx`.

### One feature restored from the handoff README, not from the shipped screen

`design-reference/handoff-spec.md` describes a priority
override control for admin/gestor as "the one legitimate priority-change
path." The underlying `changePriority()` logic exists in the prototype's
script, but by the time of the final chat
(`design-reference/chats/chat7.md`, "removi a
opção 'Alterar prioridade' da tela de detalhe") no UI ever called it —
the wrapper's own written spec and its last shipped screen disagree. This
app implements the small control the README asks for (admin/gestor only,
in ticket detail), since the function already existed and the written
handoff instructions are the more explicit source of intent.

## Deferred to round 2 (by explicit agreement before starting)

- **Push notifications (FCM)** for ticket creation / assignment / SLA
  alerts — currently derived and shown in-app only, same as the
  prototype. The client explicitly asked for real push once this reaches
  Claude Code (`design-reference/chats/chat6.md`): "vou instalar o APP via apk no
  celular de cada técnico... Temos que pensar no modelo de notificação."
- **Admin CRUD screens** (Hotéis, Setores, Categorias, Usuários, SLA) and
  the **Relatórios** module (CSV export, daily/weekly/monthly reports) —
  stubbed in `src/screens/ConfigScreen.tsx` as "em construção." All the
  underlying data (hotels, sectors, categories, SLA config) is seeded and
  readable; only the admin editing UI is missing.
- **Server-side auto-assign**: the 10-minute fallback currently runs as a
  client-side interval (gated to admin/gestor sessions so it isn't
  hammering Firestore from every device) — see the docstring in
  `src/domain/autoAssign.ts`. It only fires while an admin/gestor has the
  app open. Move it to a scheduled Cloud Function for real reliability.
- **New user creation from the app** (the prototype's "cria usuário +
  senha provisória" flow, `design-reference/chats/chat5.md`) — creating a Firebase Auth
  account needs the Admin SDK, i.e. a Cloud Function, not a client call.
  `npm run seed` (Admin SDK, trusted server context) is the only way to
  add users for now.
- Field-level Firestore write granularity (e.g. a technician's update
  should only ever touch status/notes/conclusion, never `hotelId`) —
  `firestore.rules` currently allows any field write once you're
  authorized to touch the ticket at all. Noted as a hardening pass, not
  silently left unmentioned.

## Project layout

```
src/
  theme/        design tokens ported from colors_and_type.css + font loading
  types/        data model (Hotel, Sector, Category, StaffUser, Ticket, ...)
  domain/       pure business logic — SLA, permissions, auto-assign, ticket
                numbering, notification derivation, wizard step order
  lib/          Firebase client init, Firestore <-> app-model conversion
  services/     Firestore/Auth/Storage calls (the only files that touch the SDK)
  state/        React context providers (auth, reference data, tickets)
  components/   shared UI (Button, TextField, TicketCard, badges, icons, ...)
  screens/      one file per screen
  navigation/   React Navigation stack + tabs
scripts/seed.ts  seeds the emulator (or a real project) with demo data
firestore.rules, storage.rules, firebase.json  Firebase Local Emulator Suite config
design-reference/  the Claude Design handoff bundle's provenance docs (see below)
```

## `design-reference/`

Kept for traceability — every "why" comment in this codebase points back
to one of these:

- `README.md` — the handoff bundle's own intro (what this app is, why it
  exists).
- `handoff-spec.md` — the condensed screen-by-screen / business-logic spec
  written for the coding agent picking this up.
- `chats/chat1.md` through `chat7.md` — the full conversation history
  between the client and the design tool. This is the actual source of
  truth where it disagrees with `handoff-spec.md` (see the two
  discrepancies called out above) — it's chronological, so later chats
  override earlier ones.
