# Design Matrix

## Purpose
- Provide a persona-aware design blueprint that unifies theming, glassmorphism, and interaction patterns across AuraOne applications.
- Document reusable token schemas, layout primitives, and palette strategies so new products can inherit or extend the Midnight Slate, Meridian, Solar Apex, Ultrathink, and extended persona identities without bespoke overrides.
- Offer an adaptive color library enabling future personas to remain cohesive while addressing domain-specific needs.

## Quick Start
1. **Generate CSS variables** – `npm run glass:generate-persona-css` compiles `[data-persona="<id>"]` custom properties into `src/styles/generated/persona-variables.css` (commit the output). CI should call `npm run glass:validate-persona-css` to ensure the CSS stays in sync with `src/theme/designMatrix.ts`.
2. **Wrap with ThemeProvider** – Supply `initialPersona` (or controlled `persona`) on `ThemeProvider`. The provider stamps `<html data-persona="...">`, persists selections when `persistPersona` is true, and exposes runtime helpers via `usePersonaTheme()`.
3. **Render PersonaPicker** – Import `PersonaPicker` from `@/components/theme/PersonaPicker` to give designers a ready-made persona switcher sourced directly from the design matrix.
4. **Consume persona tokens** – Call `usePersonaTheme()` or read CSS variables to bind styling decisions to the active persona.

```tsx
import { ThemeProvider } from "@aura/aura-glass";
import { PersonaPicker } from "@aura/aura-glass";

export function PersonaDemo({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider initialPersona="midnight-slate">
      <PersonaPicker orientation="horizontal" />
      {children}
    </ThemeProvider>
  );
}
```

```tsx
import { usePersonaTheme } from "@aura/aura-glass";

export function PersonaBadge() {
  const { personaId, persona, setPersona, personas } = usePersonaTheme();

  return (
    <button onClick={() => setPersona(personas[0].meta.id)}>
      Active persona: {persona.meta.name} ({personaId})
    </button>
  );
}
```

## System Overview
- **Theme Provider Contract:** Wrap surfaces with `ThemeProvider`, set `initialPersona` or controlled `persona`, and opt-in to storage persistence via `persistPersona`. The provider syncs `html[data-persona]`, hydrates from local storage, and exposes persona metadata via `usePersonaTheme()`.
- **Token Distribution:** Semantic tokens are defined per persona under the namespaces `background`, `text`, `border`, `accent`, `state`, `shadow`, `overlay`, and `gradient`, with chart palettes exposed via `chart.series.<persona>`.
- **CSS Variable Layer:** `src/styles/generated/persona-variables.css` (generated) registers persona variables under `[data-persona="<persona>"]`. `src/styles/glass.css` consumes them with fallbacks so components inherit persona-aware backgrounds, shadows, and focus rings.
- **Glassmorphism Language:** Surfaces rely on blurred backdrops, spectral edge glows, and persona-specific shadow tokens. Depth is communicated through consistent spacing rhythms, corner radii, and layered panels.
- **Navigation Shell:** `GlassAppShell`, `GlassHeader`, and `GlassSidebar` emit `data-persona` attributes, consume persona tokens, and provide slot-based hooks for layout-specific treatments (badges, CTA clusters, halo indicators). `PersonaPicker` ships as a first-class control wired to these tokens.
- **Canonical Persona Data:** Runtime tokens are sourced from `src/theme/designMatrix.ts`. Update personas through that module to keep this guide, generated CSS, and ThemeProvider hooks aligned.
- **Canonical Persona Data:** Runtime tokens are sourced from `src/theme/designMatrix.ts`. Update personas through that module to keep this guide, generated CSS, and ThemeProvider hooks aligned.

## Global Design Elements
- **Typography Framework:** Each persona defines a five-tier type ladder (Display, Headline, Metric, Body, Caption) that maps to CSS custom properties (`--font-<persona>-*`) and responsive scale adjustments; baseline grids snap to 4px increments to preserve rhythm across components.
- **Layout & Spacing Principles:** Content shells respect persona grid spacing (`Base Grid` from 20–24px) with consistent gutter ratios (1.5× vertically, 1× horizontally). Navigation, hero sections, and analytics canvases use modular depth tiers (canvas → surface → widget) to keep glass layering predictable.
- **Microinteraction System:** Interactions inherit easing curves by persona (e.g., Midnight Slate uses `cubic-bezier(0.33,0,0.2,1)` for kinetic pulses, Solar Apex uses `cubic-bezier(0.3,0.7,0.4,1)` for radiant sweeps). Feedback events (hover, focus, press, async complete) trigger tokenized shadows, glows, and state accents, all respecting `prefers-reduced-motion` and screen-reader announcements.
- **Glassmorphism Essentials:** Use multi-stop gradients, translucency (0.62–0.78), and persona-specific edge lighting to differentiate layers. Shadows default to persona `shadow.panel` tokens with optional `glow` overlays for CTAs or hero metrics.
- **Theme Extensions:** Adaptive palettes inherit neutral canvases and typography from the closest persona, overriding only `accent`, `gradient`, and `state` tokens while reusing interaction timings to maintain cross-application familiarity.

## Persona Profiles

| Persona | Primary Context | Palette Anchor | Surface Schema | Typography Scale | Motion & Interaction Signals |
| --- | --- | --- | --- | --- | --- |
| **Midnight Slate** | Experimental intelligence workspaces, telemetry-heavy research platforms | Deep charcoal / ultraviolet base with cyan ion accents, magenta diagnostics | Layered glass panes (20–28px rhythm), 10px radius, spectral edge lighting, kinetic glow | Body 15/22px, metrics 18/26px, hero 28/34px; cyan accent drives hierarchy | Spectral pulses, cyan focus ring, prefers-reduced-motion fallbacks on glows |
| **Midnight Meridian** | Operational productivity suites, task orchestration dashboards | Teal/emerald base with amber highlights, indigo support tones | Elevated panels (16–24px rhythm), 12px radius, ambient shadows, subtle borders | Body 14/20px, KPIs 16/24px, hero 24/30px; teal CTA halo | Smooth ease-out motions, teal focus ring, timer pulses mapped to semantic state tokens |
| **Solar Apex** | Executive control centers, compliance and governance consoles | Midnight indigo charcoal with molten solar gradients (amber → persimmon), auric gold highlights | Beveled 12px radii, luminous borders, long warm shadows, prismatic edges | Body 15/22px, analytics 18/26px, hero 28/34px; auric headline emphasis | Solar flare highlights, warm focus ring, gradient sweeps gated by motion preferences |
| **Violet Nebula** | Strategic foresight tooling, model governance and scenario planning | Nebula violet base, electric fuchsia highlights, silver neutrals | High-polish glass slabs (24–32px rhythm), 16px radius, holographic edge traces | Body 16/24px, strategy cards 20/28px, hero 32/40px; silver typographic anchors | Holographic shimmer loops (1200ms), depth parallax on hero panels, cyan-fuchsia focus gradient |
| **Aurora Noir** | Observability networks, mission-critical operations command | Midnight navy foundation with aurora green ribbons and cobalt glows | Layered glass struts (22–30px rhythm), 12px radius, polar sheen overlays, dynamic depth fog | Body 15/22px, metrics 17/24px, hero 26/32px; luminous aqua headlines | Aurora sweep gradients (2400ms), telemetry ripple feedback, emerald focus corona |
| **Helios Foundry** | Industrial automation platforms, robotics coordination suites | Graphite slate with molten copper cores and brass highlights | Structured pane grid (24–28px rhythm), 12px chamfer, brushed metal borders, volumetric glow | Body 15/22px, metrics 18/26px, hero 30/36px; copper-accented numerals | Mechanized slide-ins (220ms), gear pulse focus ring, thermal status flares on alerts |
| **Glacier Morn** | Clinical oversight systems, healthcare compliance dashboards | Deep arctic blue with icy cyan accents and pearl neutrals | Frosted glass planes (18–24px rhythm), 10px radius, clinical translucency, low-noise shadows | Body 15/22px, metrics 18/26px, hero 28/34px; icy teal emphasis | Measured fades (200ms), heartbeat diagnostics glow, sterile focus outline |
| **Terra Inflect** | Cyber defense war rooms, incident response workflows | Obsidian base with volcanic ember gradients and hazard amber highlights | Faceted panels (20–28px rhythm), 8px radius, ember-edge outlines, reinforced borders | Body 15/22px, metrics 18/26px, hero 26/32px; ember-streak callouts | Escalation pulses (160ms), perimeter scan sweeps, ember-lit focus ring |
| **Lumen Veil** | Creative production suites, experiential storytelling systems | Charcoal canvas with lavender halos and rose quartz highlights | Soft diffusion panels (24–32px rhythm), 14px radius, iridescent film overlays, layered bokeh | Body 16/24px, metrics 20/28px, hero 32/40px; lavender typographic anchors | Cinematic cross-fades (260ms), parallax tilt on hero frames, gradient focus highlights |
| **Nimbus Relay** | Real-time collaboration hubs, communications orchestration | Midnight indigo with electric sky cyan and sunset coral accents | Floating tile stacks (18–26px rhythm), 12px radius, airy drop shadows, signal halos | Body 15/22px, metrics 18/26px, hero 28/34px; sky-kissed headings | Cloud-drift motion (280ms), presence ping animations, dual-tone focus loop |

## Persona Playbooks
### Midnight Slate Playbook
- **Narrative Pillars:** Experimental, data-rich, kinetic. Surfaces emphasize discovery and telemetry clarity.
- **Key Tokens:** Cyan ion accent for CTAs, magenta diagnostic for anomalies, slate neutrals for baselines.
- **Layouts:** Tri-column analytics with floating telemetry sidebars; hero metrics anchor top-left with spectral glow.
- **Microinteractions:** Ripple pulses on chart hovers, cyan focus rings on control inputs, spectral toast elevation for async updates.
- **Accessibility:** Maintain AA+ contrast on ultraviolet backgrounds; offer static outlines when motion reduced.

### Midnight Meridian Playbook
- **Narrative Pillars:** Productive, task-focused, calm confidence. Interfaces prioritize queues and timers.
- **Key Tokens:** Teal primary for progress, amber secondary for incentives, indigo depth for shells.
- **Layouts:** Split panes with queue lists, KPI strips, and activity feeds; cards use ambient shadows and 12px radii.
- **Microinteractions:** Timer sweep animations, teal halo on selection, soft scale on productivity widgets.
- **Accessibility:** Provide timer audio toggles; ensure focus rings thicken under high-contrast preferences.

### Solar Apex Playbook
- **Narrative Pillars:** Executive authority, compliance, strategic oversight.
- **Key Tokens:** Auric gold for primary CTAs, persimmon gradients for alerts, charcoal neutrals for balance.
- **Layouts:** 12-column executive dashboards, compliance matrices, and long-shadow hero cards.
- **Microinteractions:** Radiant sweeps on filters, warm flare on alert acknowledgements, prismatic overlay transitions.
- **Accessibility:** Maintain persistent alert badges; reduce gradient intensity for low-vision modes.

### Violet Nebula Playbook
- **Narrative Pillars:** Futurist, predictive, multidimensional thinking.
- **Key Tokens:** Nebula violet canvas, electric fuchsia highlights, silver typography anchors.
- **Layouts:** Scenario canvases, branching narrative cards, and holographic overlays with depth stacking.
- **Microinteractions:** Holographic shimmer on hover, depth parallax on cards, cyan-fuchsia focus gradients with reduced-motion fades.
- **Accessibility:** Provide 2D fallback outlines, ensure perspective transforms never hide action affordances.

### Aurora Noir Playbook
- **Narrative Pillars:** Mission control, atmospheric, real-time observability.
- **Key Tokens:** Aurora greens and cobalt glows layered over midnight navy.
- **Layouts:** Command board with timeline rails, status grids, and telemetry overlays.
- **Microinteractions:** Aurora trail follows cursor, ripple telemetry on data updates, emerald focus corona.
- **Accessibility:** Offer slower animation cadence for monitoring scenarios; keep telemetry text crisp against glows.

### Helios Foundry Playbook
- **Narrative Pillars:** Industrial precision, mechanical warmth, operational reliability.
- **Key Tokens:** Molten copper primary, brass secondary, graphite foundations.
- **Layouts:** Digital twin panels, control knobs, grid-based production dashboards.
- **Microinteractions:** Gear pulse feedback on controls, thermal glow escalation on alerts, mechanized slide-ins for panels.
- **Accessibility:** Provide haptic hooks for hardware; cap animation durations at 220ms for responsiveness.

### Glacier Morn Playbook
- **Narrative Pillars:** Clinical trust, clarity, and calm assurance.
- **Key Tokens:** Icy cyan primaries, pearl neutrals, soft navy shadows.
- **Layouts:** Checklist-driven forms, vitals dashboards, clean card stacks with frosted glass.
- **Microinteractions:** Heartbeat pulses on vitals, sterile glow on input focus, gentle fades on tab transitions.
- **Accessibility:** Avoid red/green-only indicators; pair colors with icons and text cues.

### Terra Inflect Playbook
- **Narrative Pillars:** Tactical readiness, threat response, resilient operations.
- **Key Tokens:** Volcanic ember primaries, hazard amber warnings, obsidian backgrounds.
- **Layouts:** War room grids, alert stacks, command confirmation dialogs.
- **Microinteractions:** Ember flares on escalation, perimeter sweep focus states, assertive shake on critical errors.
- **Accessibility:** Offer static alternatives for motion-sensitive contexts, ensure severity announced to screen readers.

### Lumen Veil Playbook
- **Narrative Pillars:** Expressive storytelling, immersive creativity, luminous ambiance.
- **Key Tokens:** Lavender halos, rose quartz highlights, charcoal neutrals.
- **Layouts:** Storyboards, media spotlight strips, layered diffusion panels.
- **Microinteractions:** Cinematic cross-fades, parallax tilt on hero frames, gradient focus highlights.
- **Accessibility:** Provide motion toggles, maintain minimum 3:1 contrast during fades.

### Nimbus Relay Playbook
- **Narrative Pillars:** Connected collaboration, adaptive communication, lightness.
- **Key Tokens:** Electric sky cyan primaries, sunset coral accents, midnight indigo anchors.
- **Layouts:** Collaboration tiles, presence bars, chat ribbons with live cursors.
- **Microinteractions:** Cloud drift animations, presence pings, dual-tone focus loops on active sessions.
- **Accessibility:** Offer sound cue toggles and ensure focus states remain visible in dense collaborative spaces.

### Persona Token Cheat Sheet

| Persona | `background.canvas` | `background.surface` | `text.primary` | `accent.primary` | `accent.secondary` | `state.success` | `state.warning` | `state.error` | `shadow.panel` | `focus.ring` |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Midnight Slate | `#090B1A` | `rgba(18,20,43,0.72)` | `#F2F5FF` | `#4FD6FF` | `#B26CFF` | `#3BE0AA` | `#F5B94C` | `#FF4D8D` | `0 24px 60px -30px rgba(79,214,255,0.45)` | `0 0 0 3px rgba(79,214,255,0.32)` |
| Midnight Meridian | `#081418` | `rgba(9,21,24,0.68)` | `#F3F9F9` | `#34D2B4` | `#FDB565` | `#2CB67D` | `#FFBE55` | `#FF5A65` | `0 18px 46px -28px rgba(52,210,180,0.38)` | `0 0 0 3px rgba(52,210,180,0.30)` |
| Solar Apex | `#0D1324` | `rgba(17,23,38,0.70)` | `#F9F4EC` | `#FFB545` | `#FF784A` | `#66DA8B` | `#FF9548` | `#FF4A4A` | `0 28px 64px -32px rgba(255,181,69,0.42)` | `0 0 0 3px rgba(255,181,69,0.35)` |
| Violet Nebula | `#08091C` | `rgba(16,18,44,0.68)` | `#F5F3FF` | `#C06CFF` | `#7AEFFF` | `#62F5BF` | `#FFD470` | `#FF5FB7` | `0 30px 70px -34px rgba(192,108,255,0.45)` | `0 0 0 3px rgba(192,108,255,0.35)` |
| Aurora Noir | `#0A1026` | `rgba(10,16,38,0.70)` | `#E9FBFF` | `#3EF2A1` | `#6F7CFF` | `#38E8AE` | `#FFE27A` | `#FF6F8C` | `0 26px 62px -28px rgba(62,242,161,0.38)` | `0 0 0 3px rgba(62,242,161,0.30)` |
| Helios Foundry | `#10141F` | `rgba(16,20,31,0.74)` | `#FFF3E4` | `#FF8450` | `#F0C85A` | `#6BDD8D` | `#FFC15A` | `#FF5A3C` | `0 30px 66px -30px rgba(255,132,80,0.44)` | `0 0 0 3px rgba(255,132,80,0.32)` |
| Glacier Morn | `#071220` | `rgba(9,20,36,0.72)` | `#F0FAFF` | `#5BE1FF` | `#8AA8FF` | `#63E2C6` | `#FFE08B` | `#FF6B7D` | `0 26px 60px -30px rgba(91,225,255,0.40)` | `0 0 0 3px rgba(91,225,255,0.32)` |
| Terra Inflect | `#120E1A` | `rgba(24,16,32,0.74)` | `#FFEFE6` | `#F8693A` | `#FFAE4D` | `#58D58C` | `#FF944A` | `#FF5C3C` | `0 28px 64px -30px rgba(248,105,58,0.42)` | `0 0 0 3px rgba(248,105,58,0.34)` |
| Lumen Veil | `#0C0B1C` | `rgba(14,13,30,0.72)` | `#FFF4FB` | `#C79BFF` | `#FF7DA9` | `#74E4C2` | `#FFD38F` | `#FF6CA8` | `0 30px 70px -32px rgba(199,155,255,0.45)` | `0 0 0 3px rgba(199,155,255,0.32)` |
| Nimbus Relay | `#0B1024` | `rgba(13,18,40,0.70)` | `#F0F6FF` | `#64C4FF` | `#FF8E71` | `#4FDCC9` | `#FFB469` | `#FF6F7A` | `0 28px 64px -30px rgba(100,196,255,0.40)` | `0 0 0 3px rgba(100,196,255,0.32)` |

> **Note:** Values act as reference anchors. Final tokens should remain configurable via theme files to honour opacity contexts, dark/light variants, and WCAG checks.

## Visual Playground
- Launch Storybook and use the **Persona** toolbar control (top-right) to flip between personas and inspect component deltas without leaving the gallery.
- Embed `<PersonaPicker />` inside demo pages (e.g., `ComponentsPage.tsx`) to compare before/after treatments directly in the docs shell.
- Generated CSS variables in `src/styles/generated/persona-variables.css` make it easy to diff background, text, and shadow tokens across personas when combined with browser devtools color previews.

## VectorZero V2 Feature-to-Context Mapping

Following the completion of PRDV2 (docs/PRDV2.md, ✅ complete), this section maps each implemented feature to its design persona, UI context, and component dependencies:

### Feature 1: Trader Leaderboards & Copy Trading
- **Primary Persona:** Midnight Meridian (productivity focus, task-oriented)
- **Design Context:** Leaderboard tables with teal CTA halos, trader profile cards with ambient shadows
- **Key Components:** `LeaderboardPanel.tsx`, `TraderProfileDrawer.tsx`, `CopyTradeToggle.tsx`, `FollowerAllocationForm.tsx`
- **UI Patterns:** Sortable tables with 12px radius, teal focus rings, productivity widget scaling
- **Glass Treatment:** Elevated panels (16–24px rhythm), teal halo on selection

### Feature 2: Real-Time News Feed & Event Alerts
- **Primary Persona:** Aurora Noir (mission control, atmospheric observability)
- **Design Context:** Timeline rails with status grids, telemetry overlays with aurora green ribbons
- **Key Components:** `NewsFeedPanel.tsx`, `AlertConfigModal.tsx`, `EventTimeline.tsx`
- **UI Patterns:** Streaming list with provider badges, latency tags (green <60s, amber 1–5m), emerald focus corona
- **Glass Treatment:** Layered glass struts (22–30px rhythm), polar sheen overlays

### Feature 3: AI Market Analysis Assistant (Zara)
- **Primary Persona:** Violet Nebula (futurist, predictive, multidimensional)
- **Design Context:** Scenario canvases with holographic overlays, branching narrative cards
- **Key Components:** `ZaraChatInterface.tsx`, `QueryHistoryPanel.tsx`, `MarketSummaryCard.tsx`
- **UI Patterns:** Chat bubbles with fuchsia highlights, holographic shimmer on hover, depth parallax
- **Glass Treatment:** High-polish glass slabs (24–32px rhythm), holographic edge traces, cyan-fuchsia focus gradient

### Feature 4: Whale Tracking & Smart Money Alerts
- **Primary Persona:** Aurora Noir (real-time observability, telemetry)
- **Design Context:** Command board with whale activity feed, status monitoring grids
- **Key Components:** `WhaleActivityFeed.tsx`, `WalletMonitorPanel.tsx`, `SmartMoneyAlerts.tsx`
- **UI Patterns:** Feed entries with amount highlights, aurora trail animations, ripple telemetry on data updates
- **Glass Treatment:** Midnight navy with aurora green ribbons, emerald focus corona

### Feature 5: Referral Program & Social Sharing
- **Primary Persona:** Midnight Meridian (productive engagement, task completion)
- **Design Context:** Progress tracking, achievement cards, social share widgets
- **Key Components:** `ReferralDashboard.tsx`, `ShareMarketButton.tsx`, `TierProgressIndicator.tsx`
- **UI Patterns:** Teal primary for progress bars, amber highlights for incentives, timer sweep animations
- **Glass Treatment:** Ambient shadows on cards, teal halo on success states

### Feature 6: Cross-Platform Market Aggregation
- **Primary Persona:** Solar Apex (executive control, strategic oversight)
- **Design Context:** 12-column executive dashboards, compliance matrices, long-shadow hero cards
- **Key Components:** `VenueFilterPanel.tsx`, `MarketComparisonDrawer.tsx`, `ArbitrageIndicator.tsx`, `VenueConnectionManager.tsx`
- **UI Patterns:** Auric gold CTAs, prismatic overlay transitions, radiant sweeps on filters
- **Glass Treatment:** Beveled 12px radii, luminous borders, long warm shadows

### Feature 7: Mobile App & Swipe Trading
- **Primary Persona:** Midnight Meridian (mobile-optimized productivity)
- **Design Context:** Touch-first interfaces, compact layouts, swipe gestures
- **Key Components:** Mobile device registration backend, push notification infrastructure (FCM/APNs/Web Push)
- **UI Patterns:** Responsive cards, teal focus rings adapted for touch targets, quiet hours toggles
- **Glass Treatment:** Simplified glass effects for mobile performance (reduced blur, static gradients)

### Feature 8: Advanced Analytics Dashboard
- **Primary Persona:** Midnight Slate (experimental intelligence, telemetry-heavy)
- **Design Context:** Tri-column analytics with floating telemetry sidebars, hero metrics with spectral glow
- **Key Components:** `PerformanceMetricsPanel.tsx`, `TradingHeatmap.tsx`, `CorrelationMatrix.tsx`, `PerformanceTrendChart.tsx`
- **UI Patterns:** Cyan ion accents for metrics, magenta diagnostics for anomalies, ripple pulses on chart hovers
- **Glass Treatment:** Layered glass panes (20–28px rhythm), spectral edge lighting, kinetic glow

### Feature 9: Risk Management & Trading Aids
- **Primary Persona:** Terra Inflect (tactical readiness, threat response)
- **Design Context:** War room grids, alert stacks, command confirmation dialogs
- **Key Components:** `RiskLimitsPanel.tsx`, `StopLossManager.tsx`, `ExposureBreakdown.tsx`, `VaRCalculator.tsx`, `RiskAlertsPanel.tsx`
- **UI Patterns:** Volcanic ember primaries, hazard amber warnings, ember flares on escalation, assertive shake on critical errors
- **Glass Treatment:** Faceted panels (20–28px rhythm), ember-edge outlines, reinforced borders

### Feature 10: Community & Social Integration
- **Primary Persona:** Nimbus Relay (collaborative, connected communication)
- **Design Context:** Collaboration tiles, activity feeds, presence indicators
- **Key Components:** `MarketCommentSection.tsx`, `CommentItem.tsx`, `ActivityFeed.tsx`, `UserFollowButton.tsx`, `FlagContentButton.tsx`
- **UI Patterns:** Electric sky cyan for engagement, sunset coral accents for interactions, cloud-drift motion
- **Glass Treatment:** Floating tile stacks (18–26px rhythm), airy drop shadows, signal halos

### Feature 11: Leverage & Advanced Instruments
- **Primary Persona:** Helios Foundry (industrial precision, operational reliability)
- **Design Context:** Digital twin panels, control interfaces, production dashboards
- **Key Components:** `LeverageControls.tsx`, `ParlayBuilder.tsx`, `ExposurePanel.tsx`, `MarginAccountPanel.tsx`
- **UI Patterns:** Molten copper primary for leverage slider, brass secondary for margin info, thermal glow escalation on alerts
- **Glass Treatment:** Structured pane grid (24–28px rhythm), brushed metal borders, volumetric glow

### Cross-Feature Design Principles
- **Responsive Breakpoints:** All V2 features follow mobile-first design (320px → 768px → 1024px → 1440px)
- **Glass Morphism Consistency:** All panels use persona-specific blur radii, translucency (0.62–0.78), multi-stop gradients
- **Accessibility:** AA+ contrast maintained, `prefers-reduced-motion` fallbacks, screen reader announcements for all state changes
- **Animation Budget:** Interaction animations capped at 260ms for responsiveness, telemetry updates use requestAnimationFrame batching
- **Chart Integration:** All analytics use recharts with persona-specific series colors from `chart.series.<persona>` tokens
- **Form Validation:** Inline validation with persona `state.error` colors, accessible error announcements

### Component Library Additions (V2)
| Component Category | New Components | Shared Patterns |
|-------------------|----------------|-----------------|
| **Data Visualization** | TradingHeatmap, CorrelationMatrix, PerformanceTrendChart, VaRCalculator | recharts integration, responsive sizing, persona color scales |
| **Interactive Controls** | LeverageControls (slider), ParlayBuilder (multi-select), CopyTradeToggle | Touch-friendly targets (44px min), focus indicators, haptic feedback hooks |
| **Social Widgets** | CommentItem (threaded), ActivityFeed, UserFollowButton, ShareButton | Optimistic updates, rate limit indicators, moderation badges |
| **Real-time Feeds** | WhaleActivityFeed, NewsFeedPanel, EventTimeline | SSE/WebSocket integration, auto-scroll, latency badges |
| **Risk Indicators** | ExposurePanel (gauge), RiskAlertsPanel, HealthFactorMeter | Color-coded thresholds, animated transitions, accessible value announcements |
| **Mobile Optimizations** | Touch gesture handlers, swipe detectors, responsive grids | Reduced blur for performance, static gradient fallbacks |

### Dependencies & System Context
- **State Management:** React Query for all data fetching, Zustand for UI state (filter preferences, panel collapse states)
- **Routing:** Next.js 14 App Router with parallel routes for modals/drawers
- **Authentication Context:** All components consume `AuthenticatedUser` from RBAC middleware
- **Theming:** All components use `usePersonaTheme()` hook to access persona-specific tokens
- **Monitoring:** Components emit Prometheus metrics for interaction events (button clicks, form submissions, API calls)

See `docs/PRDV2.md` for implementation specifications and `apps/dashboard-web/components/` for component source code.

## Foundational Token Schema

```
PortalTheme {
  id: "lab" | "worker" | "admin" | "ultrathink" | string;
  background: {
    canvas; surface; elevated; overlay;
  };
  text: {
    primary; secondary; muted; inverse; brand;
  };
  border: {
    subtle; divider; highlight; focus;
  };
  accent: {
    primary; secondary; tertiary;
  };
  state: {
    success; warning; danger; info; discovery;
  };
  shadow: {
    panel; glow; inset;
  };
  gradient: {
    hero; banner; alert; overlay;
  };
  overlay: {
    base; strong; backdrop;
  };
  focusRing;
  motion: {
    entry; hover; focus; async;
  };
  microinteractions: {
    hover; focus; press; async; special;
  };
  chart: {
    series: string[];
    gradients: { from: string; to: string; }[];
  };
  typography: {
    display; headline; metric; body; code;
  };
}
```

### Tailwind & CSS Variable Mapping
- `tailwind.config.ts`: expose persona namespaces (`colors.lab`, `colors.worker`, `colors.admin`, `colors.ultrathink`) using `rgb(var(--color-<persona>-accent-primary) / <opacity>)` pattern.
- Utilities: `bg-<persona>-surface`, `text-<persona>-muted`, `border-<persona>-divider`, `shadow-<persona>-panel`, `ring-<persona>`, `focus-<persona>`.
- Typography utilities map to CSS variables (`--font-<persona>-display`, `--tracking-<persona>-metric`).

## Glassmorphism Playbook
- **Layering:** Use two to three depth tiers per view (canvas → primary surface → widgets). Each persona defines target blur (Lab 32px, Worker 24px, Admin 28px, Ultrathink 36px) and shadow softness.
- **Borders & Edge Lighting:** Combine semi-transparent borders (`rgba(255,255,255,0.18)`) with persona glow overlays. Lab uses cyan spectral edges, Worker uses teal halos, Admin uses warm auric glows, Ultrathink uses holographic gradients.
- **Motion:** Respect `prefers-reduced-motion`. Provide fallback states where glows become static gradients or drop shadows.
- **Feedback:** Toasts, modals, and command palettes inherit overlay tokens; focus rings rely on `focusRing` tokens for consistent keyboard accessibility.

## Layout Frameworks
- **Shell Composition:** `GlassAppShell` orchestrates header, sidebar, and content panes. Persona-specific props drive navigation badge colors, halo accents, and glass backgrounds.
- **Panels & Widgets:** KPI cards and analytics panels consume `shadow.panel` and `gradient.hero`. Loading skeletons adopt persona overlay tokens (opacity 0.12–0.18).
- **Forms & Modals:** Inputs use `border.focus`, `focusRing`, and `overlay.base`. Danger states map to `state.danger` while inline alerts use `gradient.alert`.
- **Charts:** Chart components read `chart.series.<persona>` arrays, plus gradient stops for area fills. Text labels use `text.secondary` to maintain contrast.

## Adaptive Theme Catalog

| Theme ID | Palette Concept | Recommended Use Cases | Primary / Secondary / Support | Notes |
| --- | --- | --- | --- | --- |
| `aurora-noir` | Midnight navy with aurora green ribbons | Operations monitoring, climate analytics | `#0A1026` / `#3EF2A1` / `#6F7CFF` | Balanced for data-heavy, neutral yet vibrant |
| `helios-foundry` | Graphite base with molten copper highlights | Manufacturing, robotics oversight | `#10141F` / `#FF8450` / `#F0C85A` | Industrial warmth, high contrast |
| `glacier-morn` | Deep arctic blue with icy cyan accents | Healthcare, compliance dashboards | `#071220` / `#5BE1FF` / `#8AA8FF` | Calming yet clinical |
| `terra-inflect` | Obsidian with volcanic ember gradients | Security, incident response | `#120E1A` / `#F8693A` / `#FFAE4D` | Signals urgency without harsh red dominance |
| `lumen-veil` | Charcoal with lavender and rose quartz | Creative tooling, storytelling surfaces | `#0C0B1C` / `#C79BFF` / `#FF7DA9` | Softer, experiential | 

### Adaptation Guidelines
1. **Start with Persona DNA:** Determine whether the new product aligns closest to Lab, Worker, Admin, or Ultrathink; inherit structure, spacing, and typography from the nearest persona.
2. **Select Palette Variant:** Choose an adaptive theme whose palette aligns with user sentiment and domain semantics. Override `accent` and `gradient` tokens while preserving foundational neutrals.
3. **Validate Accessibility:** Run WCAG contrast checks for primary text, badges, and chart elements. Adjust saturation before modifying luminance to keep glass depth consistent.
4. **Surface Hierarchy:** Maintain persona-defined spacing rhythm (e.g., Lab 24px grid) even when palette changes to ensure consistent information density.
5. **Interaction Patterns:** Retain focus ring shape and motion timing from the base persona; only swap color values to align with the new palette.

## Component Archetypes & Guidelines
- **Navigation & Shells:** `GlassAppShell`, headers, and sidebars should inherit persona glass treatments and typography while exposing microinteraction hooks for hover/active states. Maintain halo indicators for active sections and ensure breadcrumbs align with the base grid rhythm.
- **Data Visualization:** Charts consume `chart.series.<persona>` tokens and apply gradient fills that mirror edge lighting. Tooltips should adopt `overlay.strong` tokens with focusable close targets for accessibility.
- **Cards & Panels:** All cards use persona panel radius, `shadow.panel`, and accent borders for key states; metric cards leverage the typography metric tier and provide hover/focus feedback defined in the microinteraction blueprint.
- **Forms & Inputs:** Inputs reference `border.subtle`, focus styles rely on persona `focusRing`, and validation states map to `state.*` tokens. Async submissions trigger toast durations defined in the motion matrix.
- **Tables & Dense Data:** Table headers align to the base grid, zebra or highlight states use muted background tokens, and selection states tap into `accent.secondary`. Row hover animations adhere to persona hover durations.
- **Modals & Overlays:** Overlays use persona `overlay.base` or `overlay.strong`, maintain blur depth per glass matrix, and ensure escape/close patterns provide both visual and motion feedback.
- **Feedback Systems:** Toasts, inline alerts, and notification badges align with persona state colors and microinteraction patterns, with asynchronous completions defaulting to the `Async / Toast` durations.
- **Empty & Loading States:** Skeleton loaders apply persona overlay tokens with tint adjustments per palette; empty states incorporate typography headline/body tiers and optional illustration tokens drawn from persona assets.

## Implementation Blueprint
1. **Theme Definition:** Create `{persona}-theme.ts` exporting `PortalTheme` structure. Include light/dark variants, chart series, gradients, and motion parameters.
2. **Index Registration:** Update `dark-mode.ts` and `theme/index.ts` to register the theme, ensuring fallbacks for legacy consumers.
3. **CSS Variables:** Append persona CSS variables to `globals.css` under `[data-persona="{id}"]`, covering colors, typography, focus, and motion modifiers.
4. **Tailwind Extension:** Add persona namespace to Tailwind config with opacity-aware helpers and utility shortcuts (`bg-{persona}-surface`, `ring-{persona}`).
5. **Shell Wiring:** Ensure route-level layouts wrap content with `<ThemeProvider persona="{id}" disableTransitionOnChange>`. Shell primitives propagate `data-persona` to root nodes.
6. **Component & Interaction Sweep:** Replace hard-coded colors in persona routes with semantic utilities, align typography usage to the persona ladder, wire glass treatments, and map microinteraction triggers to motion tokens. Update charts, modals, empty states, navigation rails, loaders, and notifications.
7. **Testing & QA:** Run `pnpm typecheck`, `pnpm lint`, and persona-specific Playwright suites. Validate motion fallbacks (`prefers-reduced-motion`), focus visibility, and audio/haptic opt-ins while capturing visual baselines and accessibility audits.
8. **Documentation:** Mirror updates in upgrade files and Storybook entries. Provide before/after references for stakeholders and external applications adopting the system.

## Design Adoption Checklist
1. **Audit Current Experience:** Inventory existing layouts, tokens, and assets; map them to closest persona playbook.
2. **Select Persona & Variant:** Choose a primary persona and optional adaptive palette; document rationale and target outcomes.
3. **Token Integration:** Implement or update `PortalTheme` files, CSS variables, and Tailwind namespaces. Remove hard-coded colors and typography.
4. **Shell Conversion:** Wrap application entry points with `ThemeProvider persona="{id}"`, update navigation shells, headers, and sidebars to emit `data-persona` attributes and glass treatments.
5. **Component Refactor:** Convert cards, tables, charts, forms, modals, and loaders to semantic utilities, applying typography ladders, spacing grids, and glass matrices.
6. **Microinteraction Pass:** Map hover/focus/async triggers to persona motion tokens, ensuring `prefers-reduced-motion` fallbacks and ARIA live updates.
7. **Quality Gates:** Run lint/typecheck/tests, perform accessibility audits (contrast, keyboard, screen reader), capture visual baselines, and validate responsive breakpoints.
8. **Stakeholder Review:** Share annotated before/after screens, gather feedback, and iterate on palette or motion tuning.
9. **Documentation & Handoff:** Update internal design docs, Storybook stories, and developer guidelines. Archive design decisions for future automation.

## Color & Token Governance
- Centralize palettes in `apps/src/design-system/tokens/glass.ts`, exposing arrays for charts, badges, and gradients.
- Maintain a `persona-registry.json` (future enhancement) describing palette swatches, usage rules, and tone curves for AI-assisted theme generation.
- Enforce lint rules or codemods that forbid inline hex codes in persona directories, nudging teams toward semantic tokens.
- Track usage with analytics hooks to monitor persona adoption, theme toggles, and cross-application consistency.

## Appendix: Quick Reference Tables

### Spacing & Radius
| Persona | Base Grid | Panel Radius | Button Radius | Overlay Blur | Primary Layout Pattern |
| --- | --- | --- | --- | --- | --- |
| Midnight Slate | 24px | 10px | 8px | 32px | Analytics tri-column grid with stacked telemetry sidebars |
| Midnight Meridian | 20px | 12px | 10px | 24px | Productivity split pane with task queues + KPI strip |
| Solar Apex | 22px | 12px | 10px | 28px | Executive dashboard with 12-column oversight grid |
| Violet Nebula | 24px | 16px | 12px | 36px | Scenario canvas with 4-column narrative cards |
| Aurora Noir | 22px | 12px | 10px | 30px | Mission command board with timeline rail |
| Helios Foundry | 24px | 12px | 10px | 28px | Industrial twin layout with control sidebar |
| Glacier Morn | 20px | 10px | 8px | 26px | Clinical checklist layout with metrics spine |
| Terra Inflect | 22px | 8px | 6px | 26px | Incident war room grid with alert stack |
| Lumen Veil | 24px | 14px | 12px | 32px | Storyboard flow with media spotlight strip |
| Nimbus Relay | 20px | 12px | 10px | 24px | Collaboration tiles with live presence bar |

### Persona Typography Ladder
| Persona | Display | Headline | Metric | Body | Caption |
| --- | --- | --- | --- | --- | --- |
| Midnight Slate | 600 / 28px / 0.5px | 500 / 22px / 0.4px | 600 / 18px / 0.3px | 400 / 15px / 0.2px | 400 / 13px / 0.1px |
| Midnight Meridian | 600 / 24px / 0.3px | 500 / 20px / 0.2px | 600 / 18px / 0.2px | 400 / 14px / 0.1px | 400 / 12px / 0px |
| Solar Apex | 600 / 28px / 0.4px | 500 / 22px / 0.3px | 600 / 18px / 0.3px | 400 / 15px / 0.1px | 400 / 13px / 0.05px |
| Violet Nebula | 600 / 32px / 0.6px | 500 / 24px / 0.5px | 600 / 20px / 0.4px | 400 / 16px / 0.2px | 400 / 14px / 0.1px |
| Aurora Noir | 600 / 26px / 0.4px | 500 / 21px / 0.3px | 600 / 18px / 0.3px | 400 / 15px / 0.1px | 400 / 13px / 0.05px |
| Helios Foundry | 600 / 30px / 0.35px | 500 / 22px / 0.25px | 600 / 19px / 0.25px | 400 / 15px / 0.1px | 400 / 13px / 0px |
| Glacier Morn | 600 / 26px / 0.45px | 500 / 21px / 0.35px | 600 / 18px / 0.3px | 400 / 15px / 0.15px | 400 / 13px / 0.05px |
| Terra Inflect | 600 / 26px / 0.4px | 500 / 21px / 0.3px | 600 / 18px / 0.25px | 400 / 15px / 0.1px | 400 / 13px / 0px |
| Lumen Veil | 600 / 32px / 0.55px | 500 / 24px / 0.45px | 600 / 20px / 0.35px | 400 / 16px / 0.2px | 400 / 14px / 0.1px |
| Nimbus Relay | 600 / 26px / 0.35px | 500 / 21px / 0.25px | 600 / 18px / 0.25px | 400 / 15px / 0.1px | 400 / 13px / 0.05px |

### Glass Treatment Matrix
| Persona | Blur Depth | Border Treatment | Shadow Style | Edge Lighting |
| --- | --- | --- | --- | --- |
| Midnight Slate | 32px Gaussian | 1px spectral cyan inset | Ionized glow (`shadow.panel`) + cyan halo | Cyan-magenta spectral edge |
| Midnight Meridian | 24px Gaussian | 1px teal translucent border | Ambient teal shadow with soft falloff | Teal-to-amber halo band |
| Solar Apex | 28px Gaussian | 1px auric border with 0.2 opacity | Warm elongated shadow with gradient tail | Amber-persimmon prismatic streak |
| Violet Nebula | 36px Gaussian | 1.5px chrome border with inner glow | Deep violet shadow with holographic shimmer | Fuchsia-cyan refractive edge |
| Aurora Noir | 30px Gaussian | 1px polar white border | Polar mist shadow with axial fade | Aurora gradient sweep |
| Helios Foundry | 28px Motion blur hybrid | 1px brushed brass border | Molten copper underside shadow | Copper ember edge core |
| Glacier Morn | 26px Gaussian | 1px frosted white border | Soft diffused glacier shadow | Icy cyan refraction |
| Terra Inflect | 26px Directional blur | 1px ember border with hard corners | Reinforced shadow with ember flare | Hazard amber perimeter glow |
| Lumen Veil | 32px Bokeh blur | 1px lavender mist border | Iridescent drop shadow with film grain | Lavender-rose gradient ribbon |
| Nimbus Relay | 24px Gaussian | 1px sky cyan border | Aerated shadow with dual offset | Sky cyan + sunset coral pulse |

### Microinteraction Blueprint
| Persona | Primary Triggers | Feedback Modality | Accessibility Notes |
| --- | --- | --- | --- |
| Midnight Slate | Hover analytics cards, focus tabs, async success states | Cyan pulse glow, data ripple animations, spectral toast lift | Reduced motion swaps glows for static borders; announce async via ARIA live |
| Midnight Meridian | Task hover, timer start/stop, queue drag | Teal halo expansion, subtle scale, radial timer sweep | Timer audio cues optional; focus ring thickens under high contrast mode |
| Solar Apex | Oversight filter changes, critical alerts, CTA presses | Radiant sweep across CTAs, warm flare on alerts, gradient progress arcs | Provide persistent alert badges; tone down gradients under low vision mode |
| Violet Nebula | Scenario card hover, graph node selection, insight reveal | Holographic shimmer, depth parallax, cyan-fuchsia focus gradient | Motion reduces to opacity fade; add outlines for 2D fallback |
| Aurora Noir | Timeline scrub, telemetry hover, live badge updates | Aurora trail follow, telemetry ripple, emerald focus corona | Offer slower animation option; maintain text contrast during glows |
| Helios Foundry | Machine state change, control knob interaction, alert escalation | Gear pulse, thermal glow escalation, mechanized slide-in | Provide haptic hook for hardware integrations; keep animations under 220ms |
| Glacier Morn | Form validation, critical alert acknowledgement, tab navigation | Sterile glow, heartbeat pulse for vitals, calm fade transitions | Avoid red/green reliance; pair color with iconography |
| Terra Inflect | Threat escalation, command confirmation, log playback | Ember flare, perimeter scan sweep, aggressive shake on critical errors | Offer static fallback; ensure screen reader announces severity |
| Lumen Veil | Media hover, storyboard transition, creative tool activation | Cinematic cross-fade, parallax tilt, gradient focus highlight | Provide toggle for motion-sensitive users; maintain 3:1 contrast during fades |
| Nimbus Relay | Presence updates, message send, live cursor hover | Cloud drift, presence ping, dual-tone focus loop | Provide sound cues toggle; ensure focus states remain visible in dense UIs |

### Motion Durations (ms)
| Persona | Entry | Hover | Focus | Async / Toast |
| --- | --- | --- | --- | --- |
| Midnight Slate | 320 | 180 | 140 | 360 |
| Midnight Meridian | 280 | 160 | 120 | 320 |
| Solar Apex | 340 | 200 | 150 | 360 |
| Violet Nebula | 360 | 220 | 180 | 380 |
| Aurora Noir | 300 | 190 | 150 | 340 |
| Helios Foundry | 260 | 150 | 130 | 320 |
| Glacier Morn | 300 | 170 | 140 | 340 |
| Terra Inflect | 260 | 150 | 120 | 300 |
| Lumen Veil | 340 | 210 | 170 | 360 |
| Nimbus Relay | 280 | 170 | 140 | 320 |

---
This matrix encapsulates the current persona themes and extends the system with adaptive palettes, ensuring new applications can leverage AuraOne's glassmorphism language while tailoring tone, motion, and accessibility to their domain.
