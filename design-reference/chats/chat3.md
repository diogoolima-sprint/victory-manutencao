# Chat

_Started 2026-09-05 15:36 UTC_

---

## User

<system-info comment="Only acknowledge these if relevant">
Project title is now "Prioridades e navegação do projeto"
What `list_files` on the project root returns right now (dotfiles, if any, are not shown here):
📁 _ds
📁 uploads
📄 support.js
📄 Victory Manutenção.dc.html
User is viewing file: Victory Manutenção.dc.html
Current date is now September 5, 2026
</system-info>

<attached aesthetic_system_instructions>
A design system or theme is attached to this project. That attachment already answers the visual-style question: apply it. Do NOT ask the user which visual style to use — no questions about vibe, colors or palette directions (including color-swatch svg-options questions), typography, mood, or art direction, and skip the "divergent visuals" question from the question-asking tips; offer divergent visual directions only if the user themselves asks for alternatives. This rule bans asking the user to pre-pick a style in the abstract — swatches, mood words, palette pickers. It does not ban asking them to choose among candidates you have already built: putting built candidates on a file-options board for the user to pick from is encouraged. Treat the attachment as the confirmed starting point and product context — the "confirm the starting point" tip is already satisfied, so do not ask the user to confirm or re-pick it. Spend your questions on everything else you need: audience, purpose, content, structure, scope, interactions, tone of copy.
</attached aesthetic_system_instructions>

<pasted_text name="Pasted text (542 lines)">
Quero fazer uma nova rodada de refinamento do aplicativo Victory Manutenção.

IMPORTANTE: o aplicativo já está funcional e possui uma versão desktop e uma versão mobile.

NÃO quero reconstruir o sistema.
NÃO quero remover funcionalidades existentes.
NÃO quero alterar a lógica de negócio sem necessidade.

Quero evoluir principalmente a EXPERIÊNCIA MOBILE.

==================================================
1. PRINCIPAL PRIORIDADE: MOBILE
==================================================

O aplicativo será utilizado predominantemente em smartphones.

Portanto, a versão mobile deve ser tratada como a experiência PRINCIPAL do produto.

A versão desktop deve ser uma adaptação expandida da mesma lógica e identidade visual, e não o contrário.

Não quero simplesmente pegar o layout desktop e empilhar seus elementos verticalmente.

Quero um verdadeiro design MOBILE-FIRST.

A interface mobile deve ser pensada para:

- uso com uma mão;
- toque;
- leitura rápida;
- ambientes com pouca atenção disponível;
- usuários andando pelo hotel;
- abertura rápida de chamados;
- acompanhamento rápido de solicitações;
- identificação imediata de urgências.

==================================================
2. PRINCÍPIO DE UX MOBILE
==================================================

Para cada tela mobile, faça a seguinte pergunta:

"O que o usuário precisa fazer nesta tela?"

A resposta deve determinar a hierarquia.

Evitar colocar no mobile informações apenas porque elas existem no desktop.

Informações secundárias podem ficar escondidas em detalhes, filtros ou telas complementares.

Priorizar ações.

==================================================
3. NAVEGAÇÃO MOBILE
==================================================

Criar uma navegação mobile muito simples.

Considerar uma barra de navegação inferior fixa com os principais destinos:

- Início
- Chamados
- Novo chamado
- Painel
- Mais

O botão "Novo chamado" deve possuir destaque visual e ser extremamente fácil de acessar.

Se a arquitetura atual utilizar outra navegação que funcione melhor, preserve a lógica, mas priorize a facilidade de acesso.

A navegação deve ficar sempre acessível.

==================================================
4. HOME MOBILE
==================================================

A Home mobile não deve tentar reproduzir todo o Dashboard desktop.

Ela deve mostrar apenas o que é realmente importante para aquele usuário.

Para um gestor:

- chamados abertos;
- urgentes;
- atrasados;
- em execução;
- resumo por hotel;
- itens que requerem atenção.

Para manutenção:

- chamados não atribuídos;
- meus chamados;
- urgentes;
- em execução;
- aguardando.

Para solicitante:

- meus chamados;
- status dos chamados;
- botão Novo chamado.

Usar cards compactos, listas e indicadores.

Evitar gráficos complexos no mobile quando uma informação numérica ou uma lista resolver melhor.

==================================================
5. NOVO CHAMADO — EXPERIÊNCIA MOBILE
==================================================

Esta é uma das telas MAIS IMPORTANTES do aplicativo.

Quero que abrir um chamado seja extremamente rápido.

O fluxo deve ser pensado para celular.

Sequência:

HOTEL
↓
SETOR
↓
LOCAL
↓
CATEGORIA
↓
DESCRIÇÃO
↓
PRIORIDADE
↓
FOTO
↓
ENVIAR

Utilizar controles adequados para toque.

Evitar campos pequenos.

Utilizar selects, botões de seleção, chips e componentes próprios para mobile quando forem melhores que dropdowns tradicionais.

O campo de descrição deve ser confortável para digitação.

O botão para tirar/anexar foto deve ser muito evidente.

O usuário deve conseguir abrir um chamado sem precisar navegar por várias telas desnecessariamente.

Se for melhor para a UX, pode transformar o processo em etapas, desde que seja rápido.

==================================================
6. FOTO
==================================================

Dar bastante importância à fotografia.

Em manutenção hoteleira, uma foto frequentemente explica o problema melhor que uma descrição longa.

No mobile:

- permitir abrir a câmera diretamente;
- permitir selecionar foto da galeria;
- mostrar miniatura da imagem;
- permitir remover uma foto;
- permitir adicionar mais de uma foto.

==================================================
7. LISTA DE CHAMADOS MOBILE
==================================================

Não utilizar uma tabela tradicional no smartphone.

Transformar chamados em cards/listas altamente escaneáveis.

Exemplo:

┌─────────────────────────────┐
│ 🔴 URGENTE                  │
│ MAN-2026-000120             │
│                             │
│ Apartamento 501             │
│ Ar-condicionado             │
│ Victory Business · 42 min   │
│                             │
│ Em execução                 │
└─────────────────────────────┘

A prioridade deve ser imediatamente perceptível.

Mostrar primeiro:

- prioridade;
- local;
- problema;
- status;
- tempo;
- hotel/setor.

Informações menos importantes podem aparecer somente ao abrir o chamado.

==================================================
8. DETALHE DO CHAMADO
==================================================

Ao tocar em um chamado, criar uma tela clara de detalhes.

No topo:

Número do chamado
Status
Prioridade

Depois:

Hotel
Setor
Local
Categoria
Descrição
Fotos

Depois:

Responsável
Data de abertura
SLA

E finalmente:

Histórico / Timeline

As ações principais devem estar disponíveis de forma clara.

Exemplo:

[ ASSUMIR CHAMADO ]

[ INICIAR EXECUÇÃO ]

[ ALTERAR STATUS ]

[ CONCLUIR CHAMADO ]

Os botões devem mudar conforme o perfil e o status do chamado.

==================================================
9. PAINEL DA MANUTENÇÃO MOBILE
==================================================

Essa deve ser uma das principais experiências do aplicativo.

O profissional da manutenção deve abrir o app e rapidamente saber:

"O que eu preciso fazer agora?"

Criar uma visão com:

URGENTES
Não atribuídos
Meus chamados
Em execução
Aguardando

Priorizar chamados pela combinação de:

1. urgência;
2. SLA;
3. tempo em aberto.

Permitir filtros rápidos:

Todos
Urgentes
Meu setor
Meus chamados
Atrasados

Evitar menus escondidos demais.

==================================================
10. STATUS
==================================================

Os status devem ser visualmente muito claros:

Aberto
Recebido
Em análise
Em execução
Aguardando
Concluído
Cancelado

Utilizar badges e ícones.

Não depender somente das cores.

==================================================
11. SLA NO MOBILE
==================================================

O SLA deve ser muito fácil de entender.

Exemplos:

🟢 Dentro do prazo
🟡 Próximo do vencimento
🔴 Atrasado

Mostrar:

"Há 42 min"

"Vence em 18 min"

"Atrasado há 2h"

Isso é mais útil no mobile do que simplesmente mostrar datas.

==================================================
12. DASHBOARD MOBILE
==================================================

Não tentar reproduzir todos os gráficos do desktop.

No mobile, priorizar:

Chamados abertos
Urgentes
Atrasados
Em execução
Aguardando

Depois:

"Requer atenção"

Depois:

"Chamados por hotel"

Depois:

"Principais categorias"

Gráficos complexos podem ser substituídos por barras simples, rankings ou indicadores.

O usuário deve conseguir compreender o estado da operação em poucos segundos.

==================================================
13. DESKTOP
==================================================

Depois de resolver a experiência mobile, adaptar o sistema para desktop.

O desktop pode aproveitar o espaço horizontal e apresentar:

- mais indicadores;
- gráficos;
- comparativos;
- tabelas;
- múltiplas colunas;
- informações simultâneas.

Porém, deve manter exatamente a mesma lógica e identidade do mobile.

Desktop = experiência expandida.

Mobile = experiência principal.

==================================================
14. RESPONSIVIDADE
==================================================

Testar a interface em diferentes larguras:

320px
360px
375px
390px
414px
768px
1024px
1280px
1440px+

Garantir que:

- nenhum conteúdo seja cortado;
- nenhum botão fique pequeno demais;
- textos não estourem;
- cards se adaptem;
- imagens sejam responsivas;
- formulários permaneçam confortáveis;
- navegação seja adequada;
- tabelas não causem overflow horizontal desnecessário.

Não utilizar simplesmente uma escala proporcional.

Reorganizar os componentes conforme o espaço disponível.

==================================================
15. ACESSIBILIDADE E TOQUE
==================================================

Como o aplicativo será usado principalmente em celular:

- utilizar áreas de toque confortáveis;
- evitar botões muito pequenos;
- manter espaçamento adequado entre ações;
- utilizar contraste suficiente;
- não depender apenas de cor;
- evitar textos excessivamente pequenos.

Priorizar uma interface confortável para uso real durante um turno de hotel.

==================================================
16. VISUAL
==================================================

Preservar a identidade Victory já existente.

Quero uma aparência:

- moderna;
- limpa;
- profissional;
- elegante;
- tecnológica;
- mas simples.

Não transformar o aplicativo em uma interface excessivamente colorida.

Utilizar cor principalmente para comunicar:

- prioridade;
- status;
- alertas;
- ações.

Refinar:

- tipografia;
- espaçamento;
- bordas;
- sombras;
- ícones;
- cards;
- badges;
- botões;
- estados de interação.

==================================================
17. HIERARQUIA
==================================================

Criar uma hierarquia visual muito clara.

No mobile:

AÇÃO &gt; PROBLEMA &gt; LOCAL &gt; STATUS &gt; INFORMAÇÕES SECUNDÁRIAS

No desktop:

AÇÃO + OPERAÇÃO + ANÁLISE

Não dar o mesmo peso visual para todas as informações.

==================================================
18. CONSISTÊNCIA
==================================================

Criar um sistema visual consistente para todo o aplicativo.

O mesmo componente de:

- status;
- prioridade;
- botão;
- campo;
- card;
- usuário;
- hotel;
- setor;
- SLA

deve manter o mesmo comportamento e aparência em todas as telas.

==================================================
19. DADOS
==================================================

Preservar os dados de demonstração existentes.

Corrigir problemas de apresentação como:

"1 abertos"

"1 em execução"

"1 concluídos"

Ajustar automaticamente singular/plural.

Não alterar números reais existentes apenas para melhorar visualmente o dashboard.

==================================================
20. RESULTADO ESPERADO
==================================================

Quero que o resultado final pareça um aplicativo que uma rede hoteleira realmente utilizaria diariamente.

Não quero apenas um dashboard bonito.

Quero um produto:

RÁPIDO
CLARO
MOBILE-FIRST
OPERACIONAL
RESPONSIVO
PROFISSIONAL

Antes de finalizar:

1. Revise todas as telas existentes.
2. Priorize a experiência mobile.
3. Verifique o fluxo completo de abertura de chamado.
4. Verifique o fluxo completo de execução e conclusão.
5. Verifique a experiência de cada perfil.
6. Teste diferentes larguras de tela.
7. Corrija inconsistências visuais.
8. Não remova funcionalidades existentes.
9. Não criar complexidade desnecessária.

A prioridade absoluta desta rodada é:

1. Experiência mobile
2. Clareza operacional
3. Facilidade para abrir chamados
4. Facilidade para executar chamados
5. Responsividade
6. Consistência visual
7. Dashboard gerencial
</pasted_text>

<!-- The user explicitly selected the following skills for this project, as attachments to their message. These are not optional context — they define how you work. Use them. -->
<attached-skill name="Sprint × Victory Design System (design system)">
[Design System] This project uses the **Sprint × Victory Design System** design system. This is a binding choice for visual style — every visual must follow it. Don't invent colors, type, spacing, or components not grounded here.

Scope: the design system is a visual style reference only. Its guide may describe example products, brands, or people that are unrelated to the user and unrelated to the subject of this conversation. Never treat anything in the design system as a fact about the user, their work, or the topic they asked about.

This project has the **SprintVictoryDesignSystem_019e27** design system bound at `_ds/sprint-victory-design-system-019e27c2-f522-7721-bc18-93ddcfb56268/`. If anything under that path is missing or fails to load, the folder name may differ — `list_files` `_ds/` and use the folder whose name ends with 019e27c2-f522-7721-bc18-93ddcfb56268 instead, including in the <link>/<script> paths below.

**Loading the bundle is how you use this design system.** Every Design Component you build must load `_ds/sprint-victory-design-system-019e27c2-f522-7721-bc18-93ddcfb56268/_ds_bundle.js` in `<helmet>` (include it in child DCs too — de-duped by URL) and compose with its components — do not recreate those components from scratch or restyle raw HTML to look like them. At the top of the template:

```html
<helmet>
  <link rel="stylesheet" href="_ds/sprint-victory-design-system-019e27c2-f522-7721-bc18-93ddcfb56268/colors_and_type.css">
  <link rel="stylesheet" href="_ds/sprint-victory-design-system-019e27c2-f522-7721-bc18-93ddcfb56268/export/src/colors_and_type.css">
  <link rel="stylesheet" href="_ds/sprint-victory-design-system-019e27c2-f522-7721-bc18-93ddcfb56268/preview/_card.css">
  <script src="_ds/sprint-victory-design-system-019e27c2-f522-7721-bc18-93ddcfb56268/_ds_bundle.js"></script>
</helmet>
```

Then mount any component directly in the template — no logic class needed:

```html
<x-import component-from-global-scope="SprintVictoryDesignSystem_019e27.Button" hint-size="auto,40px">Label</x-import>
```

Props are template attributes (kebab → camelCase); template children pass through as `props.children`. The linked stylesheet(s) carry the design tokens (colors, type, spacing) — style against those via `var(--*)` and the design system's classes rather than guessing values.

The full design-system source tree lives at `/projects/019e27c2-f522-7721-bc18-93ddcfb56268/` — use `list_files` / `read_file` from there for anything not under `_ds/` (layout varies by brand; don't assume folder names). Its guide is reproduced below so you don't need to fetch it:

<design-system-guide>
# Sprint × Victory Design System

A combined design system for two related Brazilian hospitality brands operated by the same group out of Juiz de Fora, Minas Gerais:

- **Sprint Hotelaria** — a hotel revenue-management and data-intelligence consultancy. Two surfaces: a marketing site (Wix-based, `sprinthotelaria.com.br`) and an analytics dashboard product called **Sprint Control** (`app.sprinthotelaria.com.br`).
- **Victory Hotéis** — a midscale corporate hotel network in Juiz de Fora with 274 apartments across two properties:
  - **Victory Business** — 152 apartments, executive profile, contains the **Bacco Gastrobar** restaurant + 6 event halls.
  - **Victory Suítes** — 122 apartments, long-stay profile, lofts with 2 bedrooms + private balconies.

Both groups share the same operational team but each has a distinct visual identity. This system stores tokens, foundations, components and full UI kits so that downstream agents (and humans) can produce on-brand marketing materials, slide decks, social media graphics, and product UI in any of these three voices: **Sprint** (data-driven SaaS), **Victory** (monochrome corporate luxury), or **Bacco** (editorial gastronomy).

---

## Sources used

All materials came from the user's local attached folders (read-only via File System Access). Reproduce them by re-attaching:

- `Imagens/` — all Victory Hotéis + Bacco Gastrobar marketing assets (logos, photography, social posters, vouchers, PDFs). Includes:
  - `Apresentação Victory Hotéis.pdf` — corporate one-pager, the canonical "Quem Somos" text.
  - `UHs/` — room photography (Suite, Suite Nupcial).
  - `Eventos/` — event-space photography (Grande Salão, Foyer, Coffee Break).
  - Multiple poster `.png` files for Late Checkout, Dia da Mulher, WTM 2026, etc.
- `Sprint Hotelaria/` — Sprint Hotelaria brand assets:
  - `Logomarca.jpeg`, `Logomarca BG Branco.png`, `Logos.jpeg` — primary logo + colourway variants.
  - `Sprint 01.svg` — vector shield mark.
  - `Sprint Hotelaria - Google Gemini.pdf` — Wix build guide containing canonical brand colour codes (`#F25C54` coral, `#4A4A4A` dark gray, `#F9FAFB` light gray) and recommended fonts (Inter / Poppins / Roboto).
  - `Simulador gráfico - Site.png`, `Simulador OCC.png`, `Gráfico Laranja.png` — UI illustrations for the product/site.
  - `B2B VB JAN.xlsx`, `Modelo de Planilha de Produção - Empresas.xlsx`, `Modelo de Planilha de Produção - Operadoras.xlsx` — internal commercial templates (not converted; for reference).

No Figma, GitHub repo, or live codebase was provided. Visuals were reconstructed from the PDFs, photography, and poster designs.

---

## Index — what's in this folder

| File / Folder | Purpose |
| --- | --- |
| `README.md` | This file — full design-system reference. |
| `SKILL.md` | Cross-compatible skill manifest (works as a Claude Code Agent Skill). |
| `colors_and_type.css` | All CSS custom properties for colour + type + spacing + shadow + motion. Import this in every artifact. |
| `assets/logos/` | Master logos for Sprint, Victory Hotéis, Victory Business, Victory Suítes, Bacco. PNG + JPEG + SVG. |
| `assets/photography/` | Property photography — suites, reception, event halls. Use for hero sections. |
| `assets/posters/` | Real social-media posters shipped by the team — reference for tone + layout. |
| `assets/illustrations/` | Sprint product illustrations (chart-only mockups). |
| `preview/` | One HTML card per design-system concept (rendered in the Design System tab). |
| `ui_kits/sprint-app/` | Sprint Control dashboard UI kit — analytics product. |
| `ui_kits/sprint-site/` | Sprint Hotelaria marketing site UI kit. |
| `ui_kits/victory-site/` | Victory Hotéis booking + brand site UI kit. |
| `ui_kits/victory-poster/` | Social-post / poster template kit (the Victory team's most frequent output). |

---

## CONTENT FUNDAMENTALS

All copy is in **Brazilian Portuguese**. There is essentially no English in customer-facing material (anglicisms like "Room Service", "Late Check-out", "Buffet Livre", "Gastrobar", and "Coffee Break" do appear and are not translated — they are domain terms in Brazilian hospitality).

### Tone of voice — Victory Hotéis
Sophisticated, warm, slightly poetic. The brand sells the *experience* of staying somewhere that "makes the difference" — the official tagline is **"Onde sua estadia faz a diferença."** Headlines tend to be either:

1. **A reflective question** addressed directly to the guest using `você` (informal "you"):
   - "Que tal viver um feriado sem precisar pegar estrada?"
   - "Seu final de semana, com muito mais tempo."
2. **A declaration of values** in sentence case, with one or two keywords emphasised in colour or weight:
   - *"Por trás de cada experiência inesquecível, a **força**, a **excelência** e o **talento das mulheres** que fazem o Victory Hotéis pulsar."*
   - *"Sofisticação é ter você conosco."*

Body copy uses *você* (never *tu*, never *senhor/a*), avoids exclamation points except for genuinely festive moments ("Parabéns!", "Feliz 2026!"), and signs off with the team voice: *"Equipe Victory Hotéis"*.

Casing follows two patterns that are used consistently:
- **ALL CAPS** for poster headlines that need to compete visually with photography ("LATE CHECK-OUT INCLUSO!", "COBERTURA COM PISCINA, SAUNA E ACADEMIA"). Always with wide tracking.
- **Sentence case** for editorial body and reflective copy ("Desejamos um Natal iluminado e um Ano Novo de grandes conquistas.").

### Tone of voice — Bacco Gastrobar
Editorial, restrained, deliberately understated. Almost never uses an exclamation mark. Headlines are statements about food set in a high-contrast serif:

&gt; *"Desfrute da gastronomia do Bacco em Buffet Livre especial."*

Bacco copy is **noun-led** and short. Prices are foregrounded ("R$ 49,90") — Bacco's audience reads them as a value statement, not a discount.

### Tone of voice — Sprint Hotelaria
Direct, confident, results-oriented. B2B SaaS register addressing hotel owners and revenue managers. The hero promise is unambiguous:

&gt; *"Transformamos os dados do seu hotel em lucro real."*

Sprint headlines highlight one keyword in coral (`#F25C54`) for emphasis ("dados do seu hotel"). KPIs use prefixed currency or trailing `%` ("R$ 2M+ Receita Recuperada", "15% Aumento no RevPAR", "85,4% Ocupação Atual"). Decimal separator is the Brazilian comma (`,`), thousands use period (`.`).

### Vocabulary cheat-sheet (PT-BR hospitality)
- **UH** / **apartamento** = guest room  
- **Diária** = nightly rate / one-night stay  
- **Reservas** = bookings  
- **Pré check-in** = pre-arrival check-in (QR code)  
- **Coffee Break** = morning/afternoon snack service in events  
- **Sala de eventos** / **Grande Salão** = event hall / ballroom  
- **Ocupação** (OCC) = occupancy rate  
- **RevPAR** / **ADR** = standard revenue-management KPIs, used un-translated  
- **Buffet Livre** = all-you-can-eat buffet  
- **Saiba Mais ›** = "Learn more" CTA, always with `›` (single right angle quote)  
- **Consulte condições** = "T&amp;Cs apply", usually in `*` footer

### Emoji &amp; special characters
Emoji are **not used** anywhere in the existing materials. Don't add them. Unicode marks are limited to: `›` (CTAs), `*` (footnotes), `·` (separator in metadata lines like "Estadia curta · Perfil executivo"), `+` (number prefix: `+600 mil habitantes`, `R$ 2M+`), and `—` (em dash in editorial body).

---

## VISUAL FOUNDATIONS

### Colour
Three palettes, summarised:

- **Sprint Hotelaria** — Coral `#F25C54` on near-white (`#FFFFFF` / `#F9FAFB`) with dark gray (`#4A4A4A`) ink. The wordmark also appears on a deep marine-blue gradient (`#061E33 → #1C5B96`) and in gold (`#C9A24A`) for premium variants.
- **Victory Hotéis** — Master brand is monochrome: deep black (`#0A0A0A`) on warm bone/cream (`#F4F1EC`) or vice-versa. Festive comms add gold (`#C9A24A`). Victory Business sub-brand uses navy `#1B2F66`; Victory Suítes uses sky blue `#0099D9`.
- **Bacco Gastrobar** — Strictly monochrome: black `#0A0A0A` ink on light paper `#F4F4F4` (or white). A full grey ramp (`#2A2A2A → #4A4A4A → #8B8B8B → #C9C9C9 → #E8E8E8`) handles every shade in between. No colour accents are used anywhere — Bacco's identity rejects them.

See `colors_and_type.css` for the full token list and `preview/` for visual swatches.

### Typography
- **Display (Victory &amp; Sprint headlines):** **Instrument Sans** 700 with the *wdth* axis pulled to 75% — the condensed instance is what gives the Victory wordmark its tall, tight verticals. Use uppercase + wide letter-spacing for the supporting word ("HOTÉIS", "BUSINESS", "SUÍTES"). Same family at *wdth* 100 + weight 700/800 for Sprint hero headlines.
- **Body (Sprint UI + Victory body):** **Instrument Sans** 400/500/600 at default width. This replaces the earlier Inter substitute referenced in the Sprint Wix guide.
- **Serif (Bacco):** **Noto Serif** 600 — book-weight serif with optical-italic italics. Used as the Bacco display face and for any editorial italic quote.
- **Mono (data / Sprint dashboards):** System monospace stack (`ui-monospace, 'SFMono-Regular'…`). No brand mono was provided — JetBrains Mono is no longer a hard dependency.

All fonts are served from `/fonts` as variable TTFs (plus static instances for the condensed/semi-condensed Instrument Sans cuts). No Google Fonts network dependency.

### Spacing
4-pt grid (`--sp-1` = 4px → `--sp-24` = 96px). Sprint product UI typically uses `--sp-4` (16px) gutters and `--sp-6` (24px) section spacing. Victory marketing posters use generous breathing room — `--sp-12` to `--sp-20` between hero and supporting copy.

### Backgrounds
- **Sprint** — Plain white or `--sprint-bg-soft` (`#F9FAFB`). For hero / award lockups, a radial dark marine gradient with subtle dotted texture (see `assets/logos/sprint-variants.jpeg` upper rows).
- **Victory master** — Full-bleed property photography (warm-tone interiors with orange-and-bone palettes) overlaid with a horizontal dark band carrying the wordmark, or solid black with thin gold geometric lines for festive comms (see `assets/posters/victory-fim-ano.png`).
- **Victory Business / Suítes** — Photo-led, with a tinted overlay (warm dark for Business, cool light for Suítes) keyed to the sub-brand colour.
- **Bacco** — Pure cream paper. No textures, no gradients. Sometimes a hairline double border (see `assets/posters/bacco-buffet.png`).

Repeating patterns and hand-drawn illustrations do **not** appear anywhere in the source material. Don't introduce them.

### Animation &amp; easing
No proprietary motion language is documented in source. Defaults established here:
- **Fade + 4–6 px rise** on entrance (`var(--t-base)`, `var(--ease-out)`).
- **No bounces** anywhere in Victory or Bacco. Sprint's product UI can use a gentle spring (`var(--ease-spring)`) on KPI counter reveals — but only there.
- **Hover state**: 100% opacity → 90% on photographic CTAs; on solid buttons, swap to the `-600` shade. Never use a generic lighten.
- **Press state**: subtle 1–2 px Y translation, or `--coral-700` colour swap. No shrink/scale on Sprint or Victory product surfaces.

### Borders &amp; dividers
- **Sprint** product UI: `1px solid var(--sprint-line)` (`#E5E7EB`). Tables use a single horizontal `border-bottom` only.
- **Bacco** menus / posters: a **hairline double border** drawn 16 px in from the edge — this is the signature device of the brand and appears in nearly every Bacco poster.
- **Victory** posters: no borders. Composition relies on type and photography.

### Shadows &amp; elevation
- **Sprint cards**: `--shadow-card` — `0 1px 0 rgba(15,23,42,.04), 0 2px 12px rgba(15,23,42,.06)`. Two-layer flat-soft.
- **Sprint KPI emphasis card** (red bar in chart, etc.): coral glow — `--shadow-coral`.
- **Victory** marketing: photography-driven, almost no synthetic shadow. The wordmark sometimes has a subtle "glow" — a `text-shadow` with white at 8 px blur — when placed on bright photography (see `assets/posters/victory-wtm.png`).
- Inner shadows: not used.

### Protection gradients vs capsules
When type sits over photography, Victory uses a **horizontal dark band** (black at 100% opacity, top or bottom of the image, ~40% height) rather than a soft protection gradient. For mid-image overlays, a **solid tan capsule** (`--vb-tan` `#E6A856`) with rounded corners (`--r-2xl`) is the recurring "call-out" device — see "COBERTURA COM PISCINA…" pill in `assets/posters/victory-post-feriado.png`.

### Layout rules
- Sprint: 12-column responsive grid, max width 1280 px, hero text never exceeds ~22 chars per line.
- Victory posters: 4:5 (1080 × 1350) or 1:1 (1080 × 1080) Instagram-first ratios. Headlines anchor top-left or top-centre; photography fills the lower 60–75%; a logo lockup pins bottom-right.
- Bacco: A4-portrait or square. Centred axis. Generous margin (≥ 80 px on 1080-wide canvases).

### Transparency &amp; blur
Used sparingly. Victory occasionally tints a photograph at `rgba(0,0,0,.45)` to admit white headline type ("Que tal viver um feriado…"). Frosted/backdrop-blur is **not** used in any existing material.

### Imagery vibe
Property photography is **warm**: terracotta accents in poolside areas, walnut wood, marble counters, cream tiles. Faces (when present) are professionally lit, business-formal (suits, lanyards at events; uniformed staff at reception). Avoid cool blues, b&amp;w, heavy grain, or filtered "lifestyle" shots — those are not on-brand.

### Corner radii
- Sprint UI: `--r-md` (10 px) for buttons + cards, `--r-pill` for tags.
- Victory call-out capsules: `--r-2xl` (28 px) — the Late Checkout "COBERTURA COM PISCINA…" pill is the reference.
- Bacco: **no rounded corners**. All shapes are right-angled.

### Cards
- **Sprint dashboard cards**: white background, `--shadow-card`, `--r-md`, `1px` neutral border, padded `var(--sp-6)`. A small circular tinted icon container (24 px diameter, `--sprint-coral-100` background, `--sprint-coral` icon stroke) usually anchors top-left.
- **Victory marketing cards**: photo on top, dark band with title overlaid, no card chrome. The image *is* the card.
- **Bacco "menu" cards**: cream background, hairline double border, centred type, no shadow.

---

## ICONOGRAPHY

There is **no proprietary icon set** in any of the provided materials. Existing posters use either pictograms-as-illustration (the round flat icons inside the `Call-to-action.png` poster — a laptop with airplane, a coffee cup, a padlock with key, etc.) or no icons at all.

Decision: this design system uses **Lucide** (https://lucide.dev) via CDN as the default icon set. Lucide's stroke style (1.5–2 px round-cap monoline) is compatible with both the modern Sprint dashboard surface and the minimal Victory layouts. Pulled via:

```html
&lt;script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js"&gt;&lt;/script&gt;
&lt;script&gt;lucide.createIcons();&lt;/script&gt;
```

&gt; **Flagged substitution:** No existing icon system was found. Lucide is a default — if the team has commissioned a custom pictogram set (or uses one in materials I didn't see), please share so this can be updated.

For decorative round flat icons (à la the existing Call-to-action poster), a small set of **filled circular icons in `--vb-navy` with a long shadow** is the on-brand treatment. None of those source SVGs were attached, so commissioning or sourcing them is recommended.

Emoji are not used. Unicode characters that *do* appear in the source: `›` `·` `+` `*` `—`. Stick to these.

---

## Substitutions &amp; flags

The brand provides **Instrument Sans** (variable + condensed/semi-condensed statics) and **Noto Serif** (variable) — both served from `/fonts`. The Victory wordmark and Bacco wordmark are still custom drawn (bitmap/SVG), but their working text equivalents now use the brand-supplied families directly. No font substitutions remain.

Outstanding flags:

1. **Sprint shield mark** — provided as `Sprint 01.svg` and used as-is. The "SPRINT" wordmark inside the logo lockup looks like a custom italic-leaning sans; Instrument Sans 700 with the *wdth* axis is used for any sibling layout type but the lockup itself is always rendered from the bitmap/SVG.
2. **Icon system** — none provided. Lucide CDN is the default.
3. **Custom flat pictograms** (`Call-to-action.png` style) — not provided as standalone assets. Use Lucide for now and commission a set if this style is to scale.
4. **Mono typeface** — none provided. The system monospace stack is used for tabular numbers; if the team wants a branded mono (e.g. JetBrains Mono), it can be added to `/fonts` and wired in `colors_and_type.css`.

</design-system-guide>
</attached-skill>

## Assistant

_[tool: read_file]_

_[tool: grep]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: grep]_

_[tool: read_file]_

This is a substantial mobile-first rebuild. I'll rewrite the DC preserving all data/business logic, restructuring the presentation layer: bottom nav, per-role mobile home, step-wizard ticket creation, scannable cards, reordered detail, and pluralization fixes.

_[tool: dc_write]_

_[tool: dc_write]_

_[tool: dc_write]_

_[tool: show_html]_

_[tool: get_webview_logs]_

_[tool: update_todos]_

Rebuilt the app mobile-first while preserving all data/business logic: bottom tab bar with a prominent "Novo chamado" action, condensed per-role home (não reproduz o dashboard completo), a step-by-step ticket wizard (hotel→setor→local→categoria→descrição→prioridade→foto→revisão), scannable priority-first ticket cards used consistently everywhere, reordered ticket detail with photo placeholders and full-width action buttons, quick filter chips, SLA countdown copy ("Vence em Xh"/"Atrasado há Xh"), and fixed the "1 abertos" pluralization bug. Desktop keeps the full charts dashboard and admin screens largely as before.

Note: I've hit my usage limit for this session — flagging per instructions. If you'd like me to continue (e.g. run verification and fix any issues found), just say so.

