# Handoff: APP Manutenção (Victory Hotéis)

## Overview
Ticket/work-order system for maintenance requests across two hotel properties (Victory Business and Victory Suítes). Covers ticket creation, assignment, SLA tracking, notifications, an automatic-assignment fallback, and a reporting module with CSV export. Built for staff (admins, hotel managers, maintenance techs) and guests/requesters ("solicitantes") — will ship as an installed APK on techs' and some requesters' phones.

## About the Design Files
The file in this bundle (`Victory Manutenção.dc.html`) is a **design reference / functional prototype** built in HTML with an internal component runtime — it is not production code to lift as-is. All state currently lives in memory (React-like local state) and resets on reload; there is no real backend, auth, or push notification delivery. The task is to **recreate this application in a real stack** (recommended: React or React Native/Expo for the APK + Firebase Auth/Firestore for backend), reproducing the screens, logic, and visual design described below.

## Fidelity
**High-fidelity.** Colors, typography, spacing, copy (Portuguese, verbatim), and interaction states are final — implement pixel-close. Layout is responsive (desktop sidebar/grid dashboard vs. mobile single-column with bottom nav); breakpoint is 860px width.

## Roles & Permissions
- **admin**: full access, all hotels, can manage users/hotels/sectors/categories/SLA config, sees Reports.
- **gestor** (manager): scoped to one hotel, sees dashboard/reports for that hotel only.
- **manutencao** (technician): scoped to one hotel, sees "Painel de manutenção" (unassigned + assigned-to-me boards), can be assigned to tickets.
  - Exactly 4 technician accounts, hard-mapped by hotel: **Marcos** and **Rodrigo** → Victory Business; **Cácio** and **Jeferson** → Victory Suítes. The assignee dropdown on a ticket must only ever offer the 2 technicians belonging to that ticket's hotel — never all 4.
- **solicitante** (requester): can create tickets and see only their own tickets ("Meus chamados").

Login is username + password (seed: `diogo.lima` / `marcos` / `rodrigo` / `cacio` / `jeferson`, all password `victory123`). New users are created by an admin with a temp password and `mustChangePassword` flag forcing a reset on first login.

## Screens / Views

### 1. Login
Centered card, hotel-bone background (`--victory-bone`), username + password fields, inline error text on failed auth.

### 2. Dashboard (Home)
Two layouts driven by role + viewport:
- **Mobile home** (all roles, <860px): 2×2 grid of KPI tiles (Chamados abertos, Urgentes, Atrasados, Em execução), then role-specific sections: admin sees "Resumo por hotel"; any role sees "Requer atenção" (overdue/urgent list) when present; manutencao sees "Não atribuídos"; solicitante sees "Meus chamados recentes" + a full-width "Novo chamado" CTA button.
- **Desktop dashboard** (≥860px, admin/gestor): KPI cards row (clickable, each opens the filtered ticket list — see "Selectable KPI tiles" below), two small bar-chart cards (avg. response time / avg. resolution time, last 8 periods), then a 2-column grid: hotel comparison table (admin only) + category breakdown bars. manutencao role instead sees a Kanban-style "Painel de manutenção" with Unassigned / Assigned-open / In-progress columns of ticket cards.

**Selectable KPI tiles**: every stat tile/KPI card (open tickets, urgent, overdue, in-progress, etc.) is clickable — clicking sets the ticket-list filter to that status/quick-filter and navigates straight to the filtered list (`openStatusList(status)` pattern). Preserve this: tiles are not static counters, they're filters-as-navigation.

### 3. Ticket List / "Meus chamados"
Filterable table/list (hotel, sector, status, priority, category, responsible, period, quick filters: urgent/mine/overdue) + free-text search (matches ticket number, location, description). Card layout on mobile, table on desktop.

### 4. New Ticket (multi-step)
Steps: sector → location/room → category → description + priority + photos → summary → confirm → done. Room/location picker uses per-hotel floor plans (Victory Business floors 1–9ish, Victory Suítes floors 5–17, ranges hardcoded per floor). Priority is chosen once here and becomes **immutable after creation** — no priority-change UI exists for solicitantes; only staff with manage rights can override it later (see Ticket Detail).

### 5. Ticket Detail
Header: ticket number, status badge, priority badge (color-coded: baixa/normal/alta/urgente), SLA badge (ok/warning/overdue, computed from `slaConfig` hours per priority vs. elapsed time). Sections:
- **Assignment**: dropdown filtered to the 2 techs of the ticket's hotel; assigning sets status `aberto`→`recebido` and appends a timeline entry.
- **Status controls**: change status (recebido/análise/execução/aguardando), conclude (requires a "serviço realizado" description, optional note/photos, sets `conclusion{service,note,at,byId}`), or cancel (requires reason).
- **Priority**: staff with manage rights (admin, or gestor of that hotel) can change priority post-creation via a dedicated control; this is the one legitimate priority-change path, kept separate from the read-only creation value.
- **Observation/notes**: free-text note + an image-attach button beside it showing a running photo count (max 5), appended to the timeline.
- **Timeline**: chronological log merging seed history + all actions, each with actor name and timestamp.

### 6. Settings → Reports (admin/gestor)
- Period switcher: Diário / Semanal / Mensal, with ‹ › arrows to page through periods (day/week/month), current range shown as a label (e.g. "Terça-feira, 03 de março de 2026").
- 3 KPI cards: total tickets created in period, highest-volume sector, most common ticket type (category).
- Filter row (selects): sector, category, responsible technician — all default to "all", scoped to the current user's hotel(s).
- Detail table, columns in order: **Nº, UH/Local, Setor, Tipo, Responsável, Atendimento (response time), Resolução (resolution time), Atribuição (Automática/Manual/—), Observações**.
  - Atendimento = time from `createdAt` to the "Chamado recebido" log entry.
  - Resolução = time from `createdAt` to `conclusion.at` (or "Cancelado"/"Em aberto" if not concluded).
  - Atribuição reflects whether the ticket's current assignment came from the 10-minute auto-assign fallback or a manual pick.
- "Exportar CSV" button: same column order as the table, `;`-delimited, UTF-8 BOM, semicolon chosen for pt-BR Excel compatibility, filename `relatorio-<period>.csv`.

### 7. Settings → other admin tabs
Hotéis, Setores, Categorias, Usuários (create/deactivate), SLA (hours per priority config).

## Interactions & Behavior — business logic to preserve exactly

- **SLA computation**: `slaConfig` maps priority → hours allowed (baixa:72, normal:24, alta:2, urgente:0). State = ok / warning (near deadline) / overdue, computed live against current time for any non-terminal ticket (not concluído/cancelado).
- **Automatic assignment fallback**: a ticket created with status `aberto` and no assignee that remains unassigned for **10 minutes** is auto-assigned by the system to the least-loaded active technician of the correct hotel (fewest currently open tickets assigned to them). This flips status to `recebido`, logs a timeline entry attributed to "Sistema", and sets an `autoAssigned` flag used by the Reports "Atribuição" column. Implementation note: the prototype polls this every 15s client-side (`setInterval`) — in production this belongs in a server-side scheduled job / Cloud Function, not the client.
- **Notifications** (bell icon, dropdown of up to 6 most recent, sorted newest-first):
  - Requester gets a notification the moment their ticket is created ("Chamado X foi criado com sucesso.").
  - Assigned technician gets a notification when assigned, manually or automatically (auto variant appends "automaticamente pelo sistema.").
  - Any user watching a non-terminal ticket gets an overdue-SLA or near-SLA-deadline notification.
  - **For the real app**: these need to become real push notifications (FCM) delivered to the installed APK, not just an in-app dropdown — this was explicitly requested by the client.
- Priority is **read-only after ticket creation** except through the explicit staff "change priority" control in Ticket Detail — do not add any other path to edit it.
- Assignee choices are **hard-restricted to 2 people per hotel** (Marcos/Rodrigo for Victory Business, Cácio/Jeferson for Victory Suítes) — this is a permanent business rule, not sample data.

## State Management (from prototype, to inform data model)
Entities: `hotels`, `sectors` (per hotel), `categories`, `staff` (id, name, username, role, hotelId, ativo, password/mustChangePassword), `tickets` (id, number, hotelId, sector, local, categoryId, description, priority, status, responsavelId, autoAssigned, solicitante/solicitanteUserId, createdAt, conclusion, cancellation, extraLog[], seedLog[], photos[]).
Ticket numbering: `YYYY-MM-DD-NN` sequential per day.
Report state: `{period, offset, sector, category, responsavel}` — offset pages through periods relative to "now".

## Design Tokens (Sprint × Victory Design System)
- Fonts: `--ff-display` / `--ff-sans` = Instrument Sans (headings/body); `--ff-mono` = ui-monospace/JetBrains Mono stack (ticket numbers, timestamps).
- Ink/neutrals: `--victory-ink #0A0A0A`, `--victory-bone #F4F1EC` (app background), `--victory-stone #D9D2C7`, `--victory-warmgray #6B655D`.
- Sprint UI neutrals: `--sprint-text-muted #6B6B6B`, `--sprint-line #E5E7EB`, `--sprint-line-strong #D1D5DB`, `--sprint-bg-soft #F9FAFB`.
- Accent/action: `--sprint-coral #F25C54` (primary buttons, links), hover `#DC4A43`, pressed `#B53B35`, tint `#FDE7E5`.
- Status colors used in the app: priority normal `#007FB6`/`#D7EEF9`, alta `#C9881A`/`#FBEED2`, urgente & overdue/"Em execução" `#DC4A43`/`#FDE7E5` (red family — kept consistent across priority badges, SLA-overdue badges, and the "Em execução" home tile), aberto/neutral `#6B655D`/`#EFEDE8`.
- Radius: `--r-md 10px` (cards, buttons). Shadow: `--shadow-card: 0 1px 0 rgba(15,23,42,.04), 0 2px 12px rgba(15,23,42,.06)`.
- No icon library is wired in the prototype (inline SVG only) — team has not committed to Lucide for this product; check before adding an icon set.

## Assets
No external image assets — the prototype uses inline SVG only (bell, chevrons, nav icons). No logos/photography were embedded in this flow.

## Files
- `Victory Manutenção.dc.html` — full prototype (all screens, logic, and inline styles in one file). Use it as the visual/behavioral source of truth; do not treat its component runtime (`<x-dc>`, `{{ }}` bindings) as something to port — it's specific to this design tool.
- `screenshots/` — reference captures: 01 login, 02 desktop dashboard (admin), 03 ticket list, 04 reports (with filters), 05 new-ticket step, 06 mobile home, 07 ticket detail (mobile).
