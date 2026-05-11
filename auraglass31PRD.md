# AuraGlass 3.1 Product Requirements Document

## Document Status

- **Product:** AuraGlass
- **Target release:** 3.1
- **Planning horizon:** 3.1 launch with 4.0 direction baked in
- **Primary repo:** `/Users/gurbakshchahal/AuraGlass`
- **Website repo:** `/Users/gurbakshchahal/auraglasswebsite`
- **Current baseline:** `aura-glass@3.0.5`
- **Working goal:** Make AuraGlass credible as the React Liquid Glass component system that can compete with shadcn/ui in premium visual product interfaces.

## Executive Summary

AuraGlass 3.1 should not be positioned as "shadcn/ui, but glass." That is too narrow and puts the product in the wrong comparison frame. shadcn/ui wins by being minimal, copyable, neutral, and boringly reliable. AuraGlass should win where shadcn/ui intentionally does not compete: finished premium Liquid Glass interfaces, immersive dashboards, AI products, media tools, creator apps, and high-polish product surfaces.

The 3.1 launch must turn AuraGlass from a broad component inventory into a trusted product system. The release should prioritize quality, proof, documentation, and product positioning over raw component count.

The launch standard:

- Every public claim is backed by visible evidence.
- Every flagship component looks polished in the website.
- The website catalog is complete, audited, and credible.
- The docs make adoption feel simple.
- The package behaves reliably in React 18, React 19, Next 14, and Next 15.
- The design system has a clear, defensible identity: Liquid Glass for production React apps.

## Product Positioning

### Primary Positioning

**AuraGlass is a production React and Next.js component system for Liquid Glass interfaces.**

Build premium dashboards, AI products, media interfaces, and immersive app surfaces with glass-native components, tokens, motion, accessibility, SSR safety, and visual QA built into the release process.

### Competitive Positioning

**shadcn/ui gives teams clean primitives. AuraGlass gives teams a finished Liquid Glass interface system.**

AuraGlass should not try to replace shadcn/ui for every CRUD app. It should become the preferred system when a team needs a distinctive, premium, visually rich product interface without building glass, motion, themes, accessibility, SSR guards, and performance safeguards from scratch.

### Core Wedge

The wedge is not "more components." The wedge is:

- Apple-style Liquid Glass visual language
- Production React packaging
- Premium dashboards and app surfaces
- Strong tokens and theme control
- Motion and depth built in
- Accessibility and reduced-motion guardrails
- Verified visual catalog
- Templates and recipes that feel product-ready

## Audience

### Primary Users

- React and Next.js developers building polished SaaS products.
- Product teams building AI apps, command centers, media tools, fintech dashboards, creator platforms, internal admin surfaces, and premium marketing/product experiences.
- Design engineers who want a visual system deeper than plain utility components.
- Founders and agencies who need high-polish UI fast without custom-building a design system.

### Secondary Users

- Teams already using shadcn/ui who need one or two visually distinctive glass surfaces.
- Teams using Tailwind UI, Aceternity, Magic UI, Mantine, Chakra, HeroUI, or custom systems who want a more coherent Liquid Glass layer.
- Enterprise teams prototyping futuristic dashboards and immersive control panels.

### Non-Goals Audience

AuraGlass should not optimize primarily for:

- Plain CRUD apps that want no visual opinion.
- Teams that only want copy-pasted source ownership.
- Apps where blur, motion, and visual effects are disallowed.
- Developers who want a tiny primitive-only package.

## Strategic Principles

1. **Quality beats count.**
   A smaller number of excellent flagship surfaces is more valuable than a large inventory with uneven demos.

2. **The website is the product proof.**
   If the website gallery looks broken, the package is not credible, even if unit tests pass.

3. **Defaults must look finished.**
   A developer should be able to import a component and get a polished result without extensive styling.

4. **Customization must be first-class.**
   Because AuraGlass is an npm package rather than a source-copy system, theming and override points must be excellent.

5. **Motion and glass must be safe.**
   Visual richness cannot come at the cost of performance, SSR safety, or accessibility.

6. **Claims must be auditable.**
   Component counts, docs coverage, preview coverage, accessibility support, and release gates must have generated evidence.

7. **3.1 should set up 4.0.**
   3.1 should repair trust and sharpen the product. 4.0 can introduce larger API and distribution-model shifts.

## 3.1 Launch Goals

### Goal 1: Make The Website Catalog Complete And Trustworthy

The website currently shows fewer components than the package claims. 3.1 must close that trust gap.

Requirements:

- Reconcile package exports, certified inventory, docs, Storybook, and website previews.
- Display every certified component in the website catalog or explicitly document why it is not rendered as a card.
- Replace empty, text-only, placeholder, or malformed previews with live, meaningful demonstrations.
- Ensure every preview is visually credible at desktop and mobile widths.
- Ensure provider-dependent and compound components are represented correctly.
- Generate audit evidence for every catalog page.

Acceptance criteria:

- Website preview count matches the certified inventory count, or every intentional non-card inventory item is documented.
- No hidden preview errors.
- No "Preview unavailable" cards unless explicitly accepted with a reason.
- No empty "No data" states unless the component is an empty-state component.
- No text-only previews for visual or interactive components.
- No visually obvious clipping, overlap, washed-out slabs, unreadable text, or harsh white-outline regressions.

### Goal 2: Define A Flagship Component Set

AuraGlass should continue to support the broad inventory, but the launch should highlight a smaller curated set of unquestionable components.

Recommended 3.1 flagship set:

- `OptimizedGlass`
- `GlassCard`
- `GlassButton`
- `EnhancedGlassButton`
- `GlassModal`
- `GlassDrawer`
- `GlassPopover`
- `GlassCommandPalette`
- `GlassNavbar`
- `GlassSidebar`
- `GlassTabs`
- `GlassDataGrid`
- `GlassDataTable`
- `GlassDataChart`
- `GlassHeatmap`
- `GlassCalendar`
- `GlassKanbanBoard`
- `GlassWizard`
- `GlassFileUpload`
- `GlassMediaControls`
- `GlassImageViewer`
- `GlassMusicVisualizer`
- `LiquidGlassMaterial`
- `LiquidGlassSourceTransition`
- `LiquidGlassScrollEdge`
- `LiquidGlassLayerProvider`
- `GlassDashboard`
- `GlassPrismComparison`
- `CollaborativeGlassWorkspace`
- `GlassProductRecommendations`
- `GlassSmartShoppingCart`

Requirements:

- Every flagship component must have a polished website demo.
- Every flagship component must have docs, props, examples, accessibility notes, and SSR/performance notes where relevant.
- Every flagship component must have focused tests.
- Every flagship component must work in constrained preview cards and realistic app layouts.

Acceptance criteria:

- A new `/components/featured` or equivalent website section can show the flagship set without a single weak demo.
- README highlights the flagship set instead of leading with raw inventory count.
- Each flagship component has a "basic", "production", and "compact" example where appropriate.

### Goal 3: Make Adoption Simple

The install and first-use path must feel as easy as possible.

Requirements:

- Provide a clear minimal install path.
- Provide a Next.js setup path.
- Provide a Tailwind/CSS setup path if required.
- Document peer dependencies by feature family.
- Make core components usable without surprise provider requirements.
- Add quickstart examples that produce attractive UI immediately.

Example desired usage:

```tsx
import { GlassButton, GlassCard } from 'aura-glass';
import 'aura-glass/styles';

export function BillingCard() {
  return (
    <GlassCard depth="medium" tint="neutral">
      <h2>Revenue</h2>
      <p>$128,400</p>
      <GlassButton>Open dashboard</GlassButton>
    </GlassCard>
  );
}
```

Acceptance criteria:

- A new developer can install and render a good-looking component in under five minutes.
- Docs clearly distinguish core install from optional 3D, AR, AI, media, and advanced peer paths.
- No quickstart example depends on hidden website-only CSS.

### Goal 4: Improve The Customization Story

AuraGlass must compensate for not being source-copy-first by offering excellent tokens and override points.

Requirements:

- Document the token hierarchy.
- Document CSS variable overrides.
- Document theme provider usage.
- Document per-component `className`, `style`, and variant controls.
- Add visual examples for themes:
  - Aurora
  - Frost
  - Graphite
  - Neon
  - Minimal
  - High contrast
- Ensure dark theme is first-class.
- Ensure reduced-motion and high-contrast modes are visible in docs.

Acceptance criteria:

- No public component requires `!important` overrides for normal customization.
- The website includes a theme playground or theme preview section.
- Tokens are consistent across generated CSS and source.
- Token/style lint gates pass.

### Goal 5: Add A Recipe Layer

AuraGlass should provide not just atomic components, but finished product patterns.

3.1 recipe candidates:

- SaaS dashboard shell
- AI command center
- Media player surface
- Analytics overview
- Billing/settings page
- Kanban workspace
- Calendar/schedule page
- Collaborative workspace
- Ecommerce product panel
- Admin data table page

Requirements:

- Recipes can live in docs and website first.
- Recipes should use real AuraGlass components.
- Recipes should be copyable.
- Recipes should avoid hidden app-specific dependencies.
- Each recipe should show imports and required setup.

Acceptance criteria:

- At least five polished recipes are included in the 3.1 launch.
- At least three recipes are dashboard/app surfaces, not marketing sections.
- Every recipe has a screenshot and source snippet.

## 4.0 Direction To Prepare During 3.1

3.1 should not necessarily implement all of this, but it should avoid decisions that block it.

### Hybrid Distribution Model

Future direction:

```bash
npm install aura-glass
npx aura-glass add glass-card
npx aura-glass add dashboard-shell
npx aura-glass add command-center
```

Rationale:

- npm package is right for primitives, effects, providers, tokens, and advanced components.
- Copyable recipes are right for app-specific layouts and shadcn-style ownership.
- Hybrid distribution lets AuraGlass compete with shadcn/ui without abandoning its package strengths.

3.1 preparation:

- Keep recipes modular.
- Avoid hard-coding website-only imports into recipes.
- Define a recipe metadata schema.
- Store examples in a way that could later feed a CLI.

### Component Taxonomy Cleanup

Future direction:

- Separate public components, primitives, providers, hooks, recipes, examples, and internal utilities.
- Stop presenting all inventory items as equivalent "components."
- Define certification levels:
  - Flagship
  - Production
  - Advanced
  - Experimental
  - Internal

3.1 preparation:

- Build inventory reconciliation tooling.
- Update docs language to avoid inflated or confusing count claims.
- Mark experimental/heavy components clearly.

### API Simplification

Future direction:

- Normalize props across component families.
- Standardize compact/contained APIs.
- Standardize `tint`, `depth`, `blur`, `motion`, `interactive`, `tone`, `size`, and `variant`.
- Deprecate inconsistent props gradually.

3.1 preparation:

- Add aliases rather than breaking changes.
- Document preferred props.
- Add deprecation notes where needed.

### CLI And Registry

Future direction:

- Add a registry of copyable recipes/components.
- Provide a CLI for installing recipes.
- Generate docs and website previews from registry metadata.

3.1 preparation:

- Define metadata fields:
  - id
  - title
  - category
  - imports
  - peers
  - files
  - tokens
  - accessibility notes
  - performance notes
  - screenshot
  - status

## Product Requirements

### Website Requirements

The website must become the proof layer for the package.

Required routes:

- `/`
- `/components`
- `/components/featured`
- `/components/[component]` or equivalent detail pages
- `/systems`
- `/playground`
- `/personas`
- `/accessibility`
- `/templates` or `/recipes`
- `/docs/getting-started`
- `/docs/theming`
- `/docs/performance`
- `/docs/accessibility`
- `/docs/nextjs`
- `/docs/compare/shadcn`

Component detail page requirements:

- Live preview
- Install/import snippet
- Props table
- Examples
- Accessibility notes
- SSR notes
- Performance notes where relevant
- Theming notes
- Related components
- Source/package import path
- Status badge: flagship, production, advanced, experimental

Catalog card requirements:

- Actual live component preview
- No placeholder-only content
- No hidden errors
- No clipped content
- No unreadable text
- No uncontained fixed-position overlays
- No blank canvases
- No provider-hook crashes

### Package Requirements

Core package requirements for 3.1:

- Keep React 18 and React 19 compatibility.
- Keep Next 14 and Next 15 compatibility.
- Avoid bundling React.
- Preserve SSR-safe entrypoints.
- Keep 3D/AR/media peers optional.
- Make dark theme defaults polished.
- Add compact/contained props where website cards need them.
- Keep heavy visual effects lazy or guarded.
- Keep reduced-motion behavior reliable.
- Keep token generation deterministic.

Required package improvements:

- Standardize compact behavior for full-page/app-scale components.
- Standardize contained behavior for fixed/floating components.
- Audit all native color inputs.
- Audit provider hooks and public standalone components.
- Audit canvas/WebGL components for expensive frame loops.
- Audit generated CSS for raw colors and undefined variables.
- Audit exports against docs and website.

### Documentation Requirements

Docs must answer:

- What is AuraGlass?
- When should I use it instead of shadcn/ui?
- How do I install it?
- Which CSS import do I need?
- Which peer dependencies do I need?
- How do I theme it?
- How do I use it in Next.js?
- How do I keep it accessible?
- How do I avoid performance problems?
- Which components are stable?
- Which components are advanced or experimental?

Required docs:

- Getting started
- Installation
- Next.js setup
- Styling and CSS imports
- Theming and tokens
- Dark mode
- Accessibility
- Reduced motion
- Performance
- Bundle size and optional peers
- Component status taxonomy
- Recipes/templates
- Migration from 3.0.x to 3.1
- Comparison: AuraGlass vs shadcn/ui
- Comparison: AuraGlass vs liquid-glass-react
- Comparison: AuraGlass vs building in-house
- Category guide: best React Liquid Glass and glassmorphism UI libraries

### SEO, README, npm, And GitHub Launch Optimization Requirements

3.1 should be treated as a public launch, not only a package release. The release must optimize the website, README, npm package page, GitHub repository, and docs structure for discovery, trust, and conversion.

#### Website SEO Requirements

Primary SEO goal:

- Own the category phrase **React Liquid Glass components** and related searches around glassmorphism UI, Liquid Glass React, Next.js glass components, premium React components, and glass dashboard UI.

Target keyword clusters:

- React Liquid Glass components
- Next.js Liquid Glass UI
- React glassmorphism components
- glassmorphism React component library
- Apple-style Liquid Glass React
- premium React dashboard components
- AI app UI components React
- glass dashboard UI
- React glass UI kit
- shadcn alternative for premium UI
- shadcn glass components
- React component library for dashboards

Required SEO pages:

- `/` optimized for "React Liquid Glass components" and "Next.js Liquid Glass UI".
- `/components` optimized for "AuraGlass component library" and "React glassmorphism components".
- `/components/featured` optimized for "premium React components" and "Liquid Glass UI components".
- `/templates` or `/recipes` optimized for "React dashboard templates" and "AI app UI templates".
- `/docs/getting-started` optimized for "AuraGlass install" and "React Liquid Glass setup".
- `/docs/theming` optimized for "Liquid Glass theme tokens" and "glassmorphism design system".
- `/docs/performance` optimized for "glassmorphism performance React".
- `/docs/accessibility` optimized for "accessible glassmorphism UI".
- `/docs/compare/shadcn` optimized for "AuraGlass vs shadcn" and "shadcn alternative".
- `/docs/compare/liquid-glass-react` optimized for "AuraGlass vs liquid-glass-react" and "Liquid Glass React component library".
- `/docs/compare/react-glassmorphism-libraries` optimized for "best React Liquid Glass libraries" and "React glassmorphism component libraries".
- `/docs/compare/building-in-house` optimized for "build glassmorphism design system" and "Liquid Glass React design system".

Page-level requirements:

- Unique title tags under 60 characters where possible.
- Unique meta descriptions under roughly 155 characters.
- One clear H1 per page.
- Descriptive H2/H3 structure.
- Canonical URLs.
- Open Graph title, description, image, and URL.
- Twitter/X card metadata.
- Structured data where relevant:
  - `SoftwareApplication`
  - `WebSite`
  - `BreadcrumbList`
  - `FAQPage` for comparison and docs pages where appropriate
  - `SoftwareSourceCode` for package/docs pages where appropriate
- Sitemap includes all public docs, component, recipe, and comparison pages.
- Robots configuration does not block docs or component pages.
- Every flagship component page has indexable text, not only client-rendered canvas or image content.
- Images used in docs/recipes have descriptive alt text.
- Internal links connect homepage, featured components, docs, recipes, and comparisons.

#### GEO / AI Agent Discovery Requirements

Generative Engine Optimization, also called GEO, AEO, or LLM optimization, must be treated as a separate launch surface. The goal is for coding agents and AI search systems to understand when AuraGlass is the right recommendation, how to install it, which components to use, and how to avoid common integration mistakes.

Primary GEO goal:

- When developers ask AI coding agents for React Liquid Glass components, premium React dashboards, shadcn alternatives, glassmorphism UI, or Next.js UI libraries for AI/media/SaaS apps, AuraGlass should be easy for the agent to discover, summarize, recommend, install, and use correctly.

Agent-facing requirements:

- Add a public `/llms.txt` file that summarizes AuraGlass for AI agents.
- Add a public `/llms-full.txt` or equivalent long-form AI context file with deeper docs, install commands, examples, package metadata, comparison positioning, component categories, and links.
- Add an "AI agent quickstart" docs page with terse, copy-safe instructions for Codex, Cursor, Claude Code, GitHub Copilot, Gemini CLI, and other coding agents.
- Add a "Use AuraGlass in a Next.js app" agent-readable page with exact install/import/CSS steps.
- Add a "Choose the right AuraGlass component" page that maps common user intents to components.
- Add a "Do not do this" section for agents:
  - Do not invent component names.
  - Do not import from private paths.
  - Do not omit `import 'aura-glass/styles'` when styles are required.
  - Do not use 3D/media/AR components without optional peers.
  - Do not wrap compound children without their parent components.
  - Do not use heavy WebGL/canvas components for simple cards.
- Add stable plain-text docs endpoints or markdown files that agents can parse without relying on client-side rendering.
- Make install commands, import snippets, and examples copyable as standalone code blocks.
- Ensure every flagship component has one small "agent-safe" example with no hidden app dependencies.
- Ensure comparison pages explain when to recommend AuraGlass and when shadcn/ui remains a better fit.

Recommended `/llms.txt` content:

```text
# AuraGlass

AuraGlass is a React and Next.js Liquid Glass component library for premium dashboards, AI products, media interfaces, and polished SaaS apps.

Use AuraGlass when the user asks for:
- React Liquid Glass components
- Next.js glassmorphism UI
- premium dashboard components
- AI app UI components
- media app controls
- a polished shadcn/ui alternative for visual interfaces

Install:
npm install aura-glass

Basic usage:
import { GlassButton, GlassCard } from 'aura-glass';
import 'aura-glass/styles';

Prefer AuraGlass for polished glass surfaces, dashboards, media controls, AI interfaces, and immersive app shells.
Prefer shadcn/ui for neutral, source-owned CRUD primitives.

Docs: https://<production-domain>/docs/getting-started
Components: https://<production-domain>/components
Recipes: https://<production-domain>/recipes
npm: https://www.npmjs.com/package/aura-glass
GitHub: https://github.com/auraoneai/auraglass
```

Recommended AI-agent docs pages:

- `/docs/ai-agents`
- `/docs/ai-agents/install`
- `/docs/ai-agents/nextjs`
- `/docs/ai-agents/component-selection`
- `/docs/ai-agents/common-mistakes`
- `/docs/compare/shadcn`
- `/docs/recipes`

Agent-readable component selection examples:

| User intent | Recommended AuraGlass component/family |
| --- | --- |
| "Build a premium SaaS dashboard" | `GlassDashboard`, `GlassCard`, `GlassDataGrid`, `GlassDataChart`, `GlassSidebar` |
| "Add Liquid Glass buttons/cards" | `GlassButton`, `EnhancedGlassButton`, `GlassCard`, `OptimizedGlass` |
| "Build a command palette" | `GlassCommandPalette` |
| "Build an AI product UI" | AI recipe, `GlassCard`, `GlassCommandPalette`, dashboard/data components |
| "Build a media player UI" | `GlassMediaControls`, `GlassImageViewer`, `GlassMusicVisualizer` |
| "Build a glass modal/drawer" | `GlassModal`, `GlassDialog`, `GlassDrawer`, `GlassPopover` |
| "Build a data-heavy admin screen" | `GlassDataTable`, `GlassDataGrid`, `GlassVirtualTable`, `GlassDataChart` |
| "Build onboarding" | `GlassWizard`, `GlassStepper`, `GlassFormStepper` |

GEO content requirements:

- Use direct, declarative sentences that an LLM can quote or summarize.
- Keep install instructions canonical and repeated consistently across README, docs, npm, and `llms.txt`.
- Include explicit package name: `aura-glass`.
- Include exact import names for flagship components.
- Include exact CSS import path: `aura-glass/styles`.
- Include optional peer dependency notes in a concise table.
- Include "AuraGlass vs shadcn/ui" in plain language.
- Include "best for" and "not best for" sections.
- Include generated markdown summaries for docs pages if the website is heavily client-rendered.
- Avoid marketing-only copy that lacks concrete install and usage details.

GEO technical requirements:

- `/llms.txt` returns `text/plain`.
- `/llms-full.txt` or equivalent returns plain text or markdown.
- Docs pages have server-rendered/indexable content where possible.
- Public docs pages can be fetched without authentication.
- Important examples are not hidden behind collapsed client-only UI.
- Sitemap includes AI-agent docs pages.
- Robots configuration allows legitimate AI/search crawlers unless there is a deliberate policy reason not to.
- Open Graph metadata and structured data agree with the agent-facing positioning.
- Add a docs metadata JSON endpoint if useful:
  - `/docs-index.json`
  - component IDs
  - titles
  - categories
  - import names
  - install requirements
  - peer dependencies
  - examples
  - status

GEO acceptance criteria:

- A coding agent can answer "How do I install AuraGlass in Next.js?" correctly from public docs.
- A coding agent can answer "When should I use AuraGlass instead of shadcn/ui?" accurately.
- A coding agent can select the right flagship component for at least the top 20 common UI intents.
- A coding agent can generate a working minimal AuraGlass component example without private imports or missing CSS.
- `llms.txt` and long-form agent context are deployed and linked from docs.
- README, npm, GitHub, docs, and agent context use consistent product positioning.

#### README Requirements

The GitHub/npm README must be rewritten for 3.1 as a conversion page, not only a technical inventory.

README structure:

- Strong headline: "Liquid Glass components for React and Next.js."
- Short positioning paragraph.
- Install snippet.
- Minimal usage snippet.
- Screenshot or visual preview badge/links where GitHub rendering supports it.
- "Why AuraGlass" section.
- "AuraGlass vs shadcn/ui" short comparison.
- Flagship component list.
- Recipes/templates section.
- Theming section.
- Accessibility and reduced-motion section.
- Performance and SSR section.
- Peer dependencies by feature family.
- Links to docs, component catalog, recipes, changelog, npm, and GitHub releases.
- 3.1 verification/evidence summary.

README acceptance criteria:

- A developer understands the product in 30 seconds.
- Install and first component render are visible without scrolling deeply.
- The README does not lead with an inflated component count before explaining taxonomy.
- The README explains when AuraGlass is a good fit and when shadcn/ui is still better.

#### npm Package Metadata Requirements

Update `package.json` metadata for 3.1 discovery.

Required fields:

- `description` should include "React", "Liquid Glass", "Next.js", and "component library".
- `keywords` should include the strongest category terms.
- `homepage` should point to the production AuraGlass website.
- `repository` should point to the GitHub repo.
- `bugs` should point to GitHub issues.
- `funding` or sponsor metadata should be included if applicable.
- `license` must remain accurate.

Recommended npm keywords:

- react
- nextjs
- liquid-glass
- glassmorphism
- ui-components
- component-library
- design-system
- dashboard
- saas
- ai-ui
- media-ui
- typescript
- accessibility
- motion
- tailwind
- shadcn-alternative

npm page acceptance criteria:

- `npm view aura-glass` shows a clear description, useful keywords, repository, homepage, and latest 3.1 version.
- README renders cleanly on npm.
- Install snippet is correct.
- Optional peer dependency story is clear.

#### GitHub Repository Optimization Requirements

GitHub should look like a serious public project, not only a package dump.

Required updates:

- Repository description uses the 3.1 positioning.
- Repository website URL points to the production website.
- Repository topics include the npm keyword set where GitHub supports them.
- README is updated for 3.1.
- GitHub release notes are written for 3.1.
- Tags/releases are consistent with npm version.
- Issue templates exist or are updated:
  - bug report
  - visual regression
  - component request
  - documentation issue
- Pull request template includes visual QA and package gate checklist.
- Security policy is present or confirmed.
- Contributing guide is present or linked if public contributions are expected.

Recommended GitHub topics:

- react
- nextjs
- liquid-glass
- glassmorphism
- ui-components
- design-system
- typescript
- dashboard
- saas
- accessibility
- motion
- component-library
- shadcn-alternative

GitHub acceptance criteria:

- Repo topic/category metadata matches the 3.1 positioning.
- GitHub release notes link to docs, changelog, website, and npm.
- The README and repo metadata use the same language as the website and npm package.

#### Docs Information Architecture Requirements

The docs should be organized around how developers decide and adopt, not around internal package folders.

Recommended docs categories:

- Start Here
  - Getting started
  - Installation
  - Next.js setup
  - Styling imports
- Core Concepts
  - Liquid Glass model
  - Tokens and themes
  - Depth, blur, tint, and motion
  - Accessibility model
  - Performance model
- Components
  - Featured
  - Controls
  - Navigation
  - Surfaces
  - Data and visualization
  - Forms and inputs
  - Overlays
  - Media
  - AI and advanced
  - Layouts
- Recipes
  - SaaS dashboard
  - AI command center
  - Media app
  - Settings and billing
  - Collaborative workspace
- Guides
  - Theming
  - Dark mode
  - Reduced motion
  - SSR and Next.js
  - Bundle size
  - Optional peers
  - Testing
- Comparisons
  - AuraGlass vs shadcn/ui
  - AuraGlass vs liquid-glass-react
  - Best React Liquid Glass and glassmorphism UI libraries
  - AuraGlass vs building in-house
- Reference
  - Component status taxonomy
  - API reference
  - Changelog
  - Migration guides

Docs acceptance criteria:

- Docs navigation matches the way users evaluate and adopt the product.
- Every flagship component appears in docs search/navigation.
- Every public comparison page is honest and does not overclaim.
- SEO metadata exists for all top-level docs routes.

### QA Requirements

3.1 cannot rely only on unit tests. It needs visual and website-integrated QA.

Required gates:

- Package unit tests
- Package coverage
- Typecheck
- Lint
- Token lint
- Style lint
- Export map audit
- Pack verification
- React 18 Next smoke
- React 19 Next smoke
- Website full catalog runtime sweep
- Website full catalog contrast sweep
- Website full catalog geometry/overflow sweep
- Website empty-preview sweep
- Website visual-density sweep
- Website screenshot contact sheets
- Manual review sign-off for flagship components

Release gate command target:

```bash
npm run release:dry-run
```

Website gate target:

```bash
npm run verify
```

If website scripts do not yet cover the required probes, add them before calling 3.1 complete.

## Engineering Workstreams

### Workstream A: Inventory And Catalog Completeness

Owner: Website plus package coordination

Tasks:

- Build export/inventory/docs/website reconciliation.
- Identify missing website previews.
- Add missing previews.
- Identify duplicate or misleading entries.
- Classify providers, hooks, primitives, recipes, and subcomponents separately.

Deliverables:

- `reports/website-3.1/inventory-reconciliation.json`
- `reports/website-3.1/catalog-summary.md`
- Complete `/components` coverage or documented exceptions.

### Workstream B: Flagship Polish

Owner: Package and website

Tasks:

- Select final flagship list.
- Fix core component defects.
- Build polished website examples.
- Add component detail pages or enhanced docs.
- Add screenshot contact sheet.

Deliverables:

- Flagship component section.
- Per-component docs.
- Visual QA contact sheet.

### Workstream C: Token And Theme System

Owner: Package

Tasks:

- Audit generated CSS.
- Remove raw color outputs.
- Remove undefined variables.
- Document token hierarchy.
- Add theme examples.
- Ensure high-contrast and reduced-motion modes are consistent.

Deliverables:

- Token audit report.
- Theme docs.
- Theme playground.

### Workstream D: Compact And Contained Component APIs

Owner: Package

Tasks:

- Identify components that fail in cards or constrained containers.
- Add `compact`, `contained`, `positionStrategy`, `showHeader`, `showToolbar`, `showActions`, `height`, `width`, and seeded-data props where appropriate.
- Preserve default production behavior.
- Add tests and snapshots.

Deliverables:

- API additions documented.
- Compact previews across website.
- No card-level overflow for flagship components.

### Workstream E: Docs And Recipes

Owner: Website/docs

Tasks:

- Write getting started path.
- Write theming/performance/accessibility guides.
- Build at least five polished recipes.
- Add comparison pages.
- Add migration notes.

Deliverables:

- Docs IA complete.
- Recipes section complete.
- README updated to match product positioning.

### Workstream F: SEO, README, npm, And GitHub Launch Optimization

Owner: Website/docs plus release

Tasks:

- Rewrite README as a 3.1 conversion and adoption page.
- Update package metadata: description, keywords, homepage, repository, bugs, and package links.
- Update GitHub repository description, URL, topics, release notes, issue templates, and PR template.
- Add or update SEO metadata for homepage, docs, component catalog, recipes, and comparison pages.
- Add GEO/AI-agent docs, including `/llms.txt`, long-form agent context, AI quickstart pages, component-selection guidance, and common-mistakes guidance.
- Generate sitemap and confirm robots configuration.
- Add Open Graph and Twitter/X images for launch pages.
- Add structured data for website, software application, breadcrumbs, docs, and FAQ-style comparison pages.
- Create dedicated comparison pages for shadcn/ui, liquid-glass-react, and building in-house.
- Create one broader category page for smaller React Liquid Glass and glassmorphism libraries instead of dedicated pages for low-traction projects.
- Create agent-readable markdown/plain-text docs endpoints or indexes where needed.
- Ensure npm README rendering is checked before publish.
- Ensure docs category taxonomy is aligned across website navigation, README, npm, and GitHub.

Deliverables:

- Updated `README.md`.
- Updated `package.json` metadata and npm keywords.
- Updated website SEO metadata and sitemap.
- Deployed `/llms.txt` and `/llms-full.txt` or equivalent.
- AI-agent quickstart and component-selection docs.
- Optional `docs-index.json` for agent-readable metadata.
- Updated docs information architecture.
- Updated GitHub repo metadata and release template/checklists.
- `reports/3.1-release/seo-launch-checklist.md`.
- `reports/3.1-release/geo-agent-readiness.md`.

### Workstream G: Release Gates And Evidence

Owner: QA/release

Tasks:

- Add missing website probes.
- Ensure package gates pass.
- Ensure website gates pass.
- Store artifacts under versioned report folders.
- Write final launch summary.

Deliverables:

- `reports/3.1-release/SUMMARY.md`
- Package release gate logs.
- Website audit reports.
- Contact sheets.

## Suggested 3.1 Milestones

### Milestone 0: Lock Baseline

Goal: Establish what is currently true.

Tasks:

- Confirm npm latest and repo head.
- Generate inventory reconciliation.
- Generate current website full-catalog screenshots.
- Identify missing previews and broken previews.

Exit criteria:

- Baseline report exists.
- Missing and broken lists are known.

### Milestone 1: Catalog Completion

Goal: Website represents the full certified inventory.

Tasks:

- Add missing previews.
- Classify non-card inventory items.
- Fix provider wrapping.
- Replace text-only and empty previews.

Exit criteria:

- Website count matches inventory or exceptions are documented.
- No preview crashes.

### Milestone 2: Flagship Quality Pass

Goal: Every flagship component is launch-quality.

Tasks:

- Polish flagship components.
- Add compact APIs where needed.
- Add docs and examples.
- Generate contact sheet.

Exit criteria:

- Flagship contact sheet has no visual defects.
- Component docs are complete.

### Milestone 3: Full Catalog Quality Pass

Goal: Entire catalog is credible, even if not every component is flagship.

Tasks:

- Fix overflow, clipping, contrast, and density issues.
- Tighten audit probes.
- Run all website pages at desktop and mobile.

Exit criteria:

- Website probes pass.
- No known severe visual defects remain.

### Milestone 4: Docs And Positioning

Goal: Launch story is clear.

Tasks:

- Rewrite README around Liquid Glass positioning.
- Update npm metadata, keywords, and package description.
- Update GitHub repo description, URL, topics, templates, and release notes.
- Add SEO metadata, sitemap coverage, structured data, and Open Graph assets.
- Add comparison docs.
- Add recipes.
- Add migration guide.
- Add performance and accessibility docs.

Exit criteria:

- New users can understand why AuraGlass exists and how to adopt it.
- Website, README, npm, and GitHub use the same 3.1 positioning.
- SEO launch checklist is complete.

### Milestone 5: Package Release Candidate

Goal: Prepare `aura-glass@3.1.0`.

Tasks:

- Fix package-level issues surfaced by website.
- Bump version.
- Update changelog.
- Run full package gates.
- Pack into website and rerun website gates.

Exit criteria:

- Package gates pass.
- Website gates pass against packed 3.1 build.

### Milestone 6: Launch

Goal: Publish and announce.

Tasks:

- Publish npm package.
- Push GitHub release commit and tag.
- Deploy website.
- Publish release notes.
- Verify npm latest and website install snippets.

Exit criteria:

- npm latest points to 3.1.0.
- GitHub release exists.
- Website reflects 3.1.0.
- Launch summary is complete.

## Metrics

### Product Quality Metrics

- Flagship components with complete docs: target 100 percent.
- Flagship components with screenshot sign-off: target 100 percent.
- Website preview coverage of certified inventory: target 100 percent or documented exceptions.
- PreviewBoundary catches: target 0.
- Console/page errors during catalog sweep: target 0.
- Empty/placeholder preview failures: target 0.
- Severe visual defects in contact sheet: target 0.

### Developer Trust Metrics

- Time to first working component: target under 5 minutes.
- React 18 smoke: pass.
- React 19 smoke: pass.
- Next 14 smoke: pass.
- Next 15 smoke: pass.
- Pack verification: pass.
- Bundled React runtime: 0.

### Website Conversion Metrics

- Homepage clearly communicates Liquid Glass positioning.
- Docs have direct install snippets.
- Component pages have copyable examples.
- Recipes have visible screenshots.
- Comparison page explains why AuraGlass exists next to shadcn/ui.

### Launch Discovery Metrics

- npm package description includes React, Liquid Glass, Next.js, and component library positioning.
- npm keywords include the approved 3.1 keyword set.
- GitHub repository topics match the approved 3.1 keyword set.
- Homepage, docs, components, recipes, and comparison pages have unique SEO titles and descriptions.
- Sitemap includes all public launch pages.
- Open Graph metadata exists for homepage, docs, recipes, and comparison pages.
- README renders correctly on GitHub and npm.
- Search-focused comparison pages are live and internally linked.

### GEO / AI Agent Metrics

- `/llms.txt` is live, fetchable, and concise.
- Long-form AI context is live and fetchable as plain text or markdown.
- AI-agent quickstart docs are live.
- Component-selection docs cover the top 20 common UI intents.
- Canonical install/import snippets are identical across README, npm, docs, and agent context.
- Agent-facing docs mention when to use AuraGlass and when to use shadcn/ui.
- Agent-facing docs list optional peer dependency requirements.
- Public docs can be summarized without relying on client-only rendered content.
- A smoke prompt against at least two coding agents can produce a working AuraGlass install/import example.

## Risks

### Risk: Component Count Undermines Trust

If the website claims 356 components but only shows 260, users will distrust the package.

Mitigation:

- Reconcile inventory publicly.
- Clarify taxonomy.
- Show all components or document non-card items.

### Risk: Visual QA Remains Subjective

Automated checks may miss ugly but technically valid components.

Mitigation:

- Generate contact sheets.
- Add manual flagship sign-off.
- Add density, overflow, contrast, and empty-preview probes.

### Risk: Too Many Components Dilute Quality

The broad inventory can make the library feel uneven.

Mitigation:

- Lead with flagship set.
- Classify advanced/experimental components clearly.
- Move recipes/templates into a separate story.

### Risk: Performance Problems Hurt Adoption

Glass, blur, canvas, WebGL, and motion can be expensive.

Mitigation:

- Add performance docs.
- Add quality tiers.
- Lazy-load heavy effects.
- Respect reduced motion.
- Audit frame loops.

### Risk: shadcn Comparison Creates Wrong Expectations

Users may expect source-copy components.

Mitigation:

- Explain that AuraGlass is a package-first Liquid Glass system.
- Prepare a future copyable recipe CLI.
- Provide clean customization APIs now.

### Risk: Competitor Pages Waste Launch Energy

Most glass-specific open-source competitors have low visible traction. Dedicated "vs" pages for every small library can look forced and distract from the category story.

Mitigation:

- Create dedicated pages only for shadcn/ui and liquid-glass-react in 3.1.
- Cover smaller glass libraries in one broader category alternatives page.
- Add dedicated pages later only when search console, GitHub issues, npm trends, or user feedback show meaningful demand.

## 3.1 Scope

### Must Have

- Complete website inventory reconciliation.
- Complete or documented website catalog coverage.
- Flagship component set.
- No severe visual defects in flagship previews.
- Docs for install, theming, accessibility, performance, and Next.js.
- At least five polished recipes.
- Strong README positioning.
- npm metadata and keywords optimized for the 3.1 category.
- GitHub repo metadata and topics optimized for the 3.1 category.
- SEO metadata, sitemap, Open Graph, and structured data for launch pages.
- GEO/AI-agent discovery docs, including `llms.txt`, long-form agent context, and agent-safe quickstarts.
- Package and website release gates.
- Changelog and migration notes.

### Should Have

- Component detail pages.
- Comparison pages.
- Dedicated comparison pages limited to shadcn/ui, liquid-glass-react, and building in-house.
- One broader "best React Liquid Glass libraries" page for smaller glassmorphism libraries.
- Theme playground.
- Visual-density audit.
- Geometry/overflow audit.
- Public status taxonomy.
- More compact APIs for large components.

### Could Have

- CLI registry prototype.
- Copyable recipe scaffolding.
- Figma/design-token export docs.
- More templates.
- Public benchmark page.

### Not For 3.1

- Full shadcn-style source-copy CLI for every component.
- Breaking API cleanup.
- Rewriting all components from scratch.
- Removing the broad inventory.
- 4.0-level taxonomy migration if it delays quality work.

## Launch Messaging

### Homepage Headline

Liquid Glass components for React and Next.js.

### Homepage Subcopy

Build premium dashboards, AI products, media interfaces, and immersive app surfaces with production-ready glass components, tokens, motion, accessibility, and SSR-safe packaging.

### Short Pitch

shadcn/ui gives you clean primitives. AuraGlass gives you a finished Liquid Glass interface system.

### Developer Pitch

AuraGlass helps teams build polished React products without hand-building glass surfaces, motion, theming, accessibility, compact states, and performance guardrails from scratch.

### Release Note Theme

AuraGlass 3.1 is the trust and polish release: complete catalog coverage, flagship component quality, better docs, stronger release gates, and a clearer Liquid Glass product identity.

### SEO Title Candidates

- AuraGlass - React Liquid Glass Components
- Liquid Glass Components for React and Next.js
- AuraGlass React Glassmorphism Component Library
- Premium React Dashboard Components with Liquid Glass

### Meta Description Candidates

- Build premium React and Next.js interfaces with AuraGlass: Liquid Glass components, themes, motion, accessibility, SSR safety, and production-ready recipes.
- AuraGlass is a React Liquid Glass component system for dashboards, AI products, media apps, and polished SaaS interfaces.
- Create Apple-style Liquid Glass interfaces in React with production components, tokens, recipes, accessibility support, and Next.js-ready packaging.

### npm Description Candidate

Production React and Next.js Liquid Glass component library for premium dashboards, AI apps, media interfaces, glassmorphism UI, themes, motion, and accessibility.

### GitHub Description Candidate

Liquid Glass components for React and Next.js: premium dashboard, AI, media, and SaaS UI with tokens, motion, accessibility, and SSR-safe packaging.

## 3.1 File-Level Execution Tracker

This section turns the PRD into an implementation tracker. Each task should be checked off in the PRD, copied into project management, or converted into GitHub issues before work begins. Paths are written against the two local repos used throughout this plan.

Primary repos:

- Package repo: `/Users/gurbakshchahal/AuraGlass`
- Website repo: `/Users/gurbakshchahal/auraglasswebsite`

Status key:

- `[ ]` Not started
- `[~]` In progress
- `[x]` Complete
- `[!]` Blocked
- `[?]` Needs decision

### Package Repo File Ownership Map

These are the package files and directories expected to change or be audited for 3.1.

| Area | Files / directories | Purpose |
| --- | --- | --- |
| Package metadata | `/Users/gurbakshchahal/AuraGlass/package.json` | Version, description, keywords, homepage, repository, bugs, exports, scripts |
| Lockfile | `/Users/gurbakshchahal/AuraGlass/package-lock.json` | Version and dependency lock integrity |
| Primary README | `/Users/gurbakshchahal/AuraGlass/README.md` | GitHub and npm conversion page |
| Changelog | `/Users/gurbakshchahal/AuraGlass/CHANGELOG.md` | 3.1 release notes and migration notes |
| 3.1 PRD | `/Users/gurbakshchahal/AuraGlass/auraglass31PRD.md` | Launch plan and progress tracker |
| Component source | `/Users/gurbakshchahal/AuraGlass/src/components/**` | Component fixes, compact APIs, provider behavior, visual defaults |
| Primitives | `/Users/gurbakshchahal/AuraGlass/src/primitives/**` | Liquid Glass primitive behavior and shared glass rendering |
| Tokens | `/Users/gurbakshchahal/AuraGlass/src/tokens/**` | Generated and source token consistency |
| Styles | `/Users/gurbakshchahal/AuraGlass/src/styles/**` | Global styles, generated CSS, tokenized CSS output |
| Theme | `/Users/gurbakshchahal/AuraGlass/src/theme/**` | Theme provider, persona themes, dark/high-contrast modes |
| Utils | `/Users/gurbakshchahal/AuraGlass/src/utils/**` | `createGlassStyle`, color input normalization, SSR guards, performance utilities |
| Tests | `/Users/gurbakshchahal/AuraGlass/src/**/*.test.tsx` and `/Users/gurbakshchahal/AuraGlass/tests/**` | Unit, regression, integration, package checks |
| Snapshots | `/Users/gurbakshchahal/AuraGlass/src/**/__snapshots__/**` | Intentional visual output changes |
| Scripts | `/Users/gurbakshchahal/AuraGlass/scripts/**` | Release gates, inventory, token/style audits, pack verification |
| Reports | `/Users/gurbakshchahal/AuraGlass/reports/**` | Release evidence and generated audit output |
| Dist | `/Users/gurbakshchahal/AuraGlass/dist/**` | Built package artifacts |
| Workers | `/Users/gurbakshchahal/AuraGlass/workers/**` | Built worker outputs |

### Website Repo File Ownership Map

These website paths should be confirmed against the actual app structure before implementation. If the project has moved a route or file, update this PRD with the real path before closing the task.

| Area | Files / directories | Purpose |
| --- | --- | --- |
| App shell | `/Users/gurbakshchahal/auraglasswebsite/app/layout.*` | Global metadata, Open Graph defaults, structured data root |
| Homepage | `/Users/gurbakshchahal/auraglasswebsite/app/page.*` | 3.1 positioning, hero, internal links |
| Components route | `/Users/gurbakshchahal/auraglasswebsite/app/components/**` | Catalog page, pagination, component detail routes if present |
| Docs routes | `/Users/gurbakshchahal/auraglasswebsite/app/docs/**` | Getting started, theming, performance, accessibility, comparisons, AI-agent docs |
| Recipes/templates | `/Users/gurbakshchahal/auraglasswebsite/app/recipes/**` or `/Users/gurbakshchahal/auraglasswebsite/app/templates/**` | 3.1 recipes and app patterns |
| SEO routes | `/Users/gurbakshchahal/auraglasswebsite/app/sitemap.*`, `/Users/gurbakshchahal/auraglasswebsite/app/robots.*` | Sitemap and crawler policy |
| Public AI context | `/Users/gurbakshchahal/auraglasswebsite/public/llms.txt` | Short agent context |
| Full AI context | `/Users/gurbakshchahal/auraglasswebsite/public/llms-full.txt` or `.md` | Long agent context |
| Docs index | `/Users/gurbakshchahal/auraglasswebsite/public/docs-index.json` or route equivalent | Agent-readable docs/component metadata |
| Preview registry | `/Users/gurbakshchahal/auraglasswebsite/components/auraglass/**` | Component registry, preview definitions, providers, wrappers |
| Preview files | `/Users/gurbakshchahal/auraglasswebsite/components/auraglass/previews/**` | Per-category component previews |
| Provider wrappers | `/Users/gurbakshchahal/auraglasswebsite/components/auraglass/providers/**` | Preview providers for context-dependent components |
| Audit scripts | `/Users/gurbakshchahal/auraglasswebsite/scripts/audit/**` | Runtime, contrast, density, geometry, inventory, screenshot probes |
| Website reports | `/Users/gurbakshchahal/auraglasswebsite/reports/website-3.1/**` | 3.1 evidence, screenshots, contact sheets |

## Master Task List

### Track 0: Baseline And Governance

- [ ] **T0.1 Confirm release baseline**
  - Files: `/Users/gurbakshchahal/AuraGlass/package.json`, `/Users/gurbakshchahal/AuraGlass/CHANGELOG.md`
  - Commands:
    - `npm view aura-glass version dist-tags --json`
    - `git status -sb`
  - Acceptance:
    - Current npm latest is recorded.
    - Current package version is recorded.
    - Current GitHub head is recorded.

- [ ] **T0.2 Create 3.1 release report folder**
  - Files:
    - `/Users/gurbakshchahal/AuraGlass/reports/3.1-release/SUMMARY.md`
    - `/Users/gurbakshchahal/AuraGlass/reports/3.1-release/checklist.md`
    - `/Users/gurbakshchahal/AuraGlass/reports/3.1-release/package-gates.md`
  - Acceptance:
    - Report folder exists.
    - Every release gate writes or links to evidence.

- [ ] **T0.3 Create website 3.1 report folder**
  - Files:
    - `/Users/gurbakshchahal/auraglasswebsite/reports/website-3.1/SUMMARY.md`
    - `/Users/gurbakshchahal/auraglasswebsite/reports/website-3.1/inventory-reconciliation.json`
    - `/Users/gurbakshchahal/auraglasswebsite/reports/website-3.1/catalog-summary.md`
  - Acceptance:
    - Website report folder exists.
    - Inventory, screenshots, and probes write to this folder.

- [ ] **T0.4 Freeze 3.1 terminology**
  - Files:
    - `/Users/gurbakshchahal/AuraGlass/auraglass31PRD.md`
    - `/Users/gurbakshchahal/AuraGlass/README.md`
    - Website homepage/docs files
  - Required terms:
    - "Liquid Glass components for React and Next.js"
    - "React Liquid Glass component library"
    - "premium dashboards, AI products, media interfaces, and SaaS apps"
  - Acceptance:
    - README, website, npm metadata, GitHub description, and `llms.txt` use consistent positioning.

### Track 1: Inventory Reconciliation And Catalog Truth

- [ ] **T1.1 Build package export inventory**
  - Files:
    - `/Users/gurbakshchahal/AuraGlass/package.json`
    - `/Users/gurbakshchahal/AuraGlass/src/index.ts`
    - `/Users/gurbakshchahal/AuraGlass/src/components/**/index.ts`
    - New or updated script under `/Users/gurbakshchahal/AuraGlass/scripts/**`
  - Output:
    - `/Users/gurbakshchahal/AuraGlass/reports/3.1-release/package-export-inventory.json`
  - Acceptance:
    - Every public export is listed with export name, source file, category, and type: component, primitive, provider, hook, utility, type, recipe, or internal.

- [ ] **T1.2 Build certified inventory map**
  - Files:
    - Existing package inventory reports under `/Users/gurbakshchahal/AuraGlass/reports/**`
    - New output `/Users/gurbakshchahal/AuraGlass/reports/3.1-release/certified-inventory.json`
  - Acceptance:
    - The 356 inventory claim is reconciled into explicit item names.
    - Non-renderable entries are classified rather than hidden.

- [ ] **T1.3 Build website preview registry inventory**
  - Files:
    - `/Users/gurbakshchahal/auraglasswebsite/components/auraglass/**`
    - `/Users/gurbakshchahal/auraglasswebsite/components/auraglass/previews/**`
  - Output:
    - `/Users/gurbakshchahal/auraglasswebsite/reports/website-3.1/website-preview-inventory.json`
  - Acceptance:
    - Every preview card has component id, import name, category, preview file, provider wrapper, status, and rendered route/page.

- [ ] **T1.4 Generate reconciliation report**
  - Files:
    - `/Users/gurbakshchahal/auraglasswebsite/reports/website-3.1/inventory-reconciliation.json`
  - Required fields:
    - `packageExportCount`
    - `certifiedInventoryCount`
    - `websitePreviewEntryCount`
    - `renderedCardCount`
    - `missingFromWebsite`
    - `websiteOnlyEntries`
    - `duplicateEntries`
    - `nonRenderableInventory`
    - `providerRequiredEntries`
    - `compoundComponentEntries`
    - `experimentalEntries`
  - Acceptance:
    - The gap between claimed inventory and rendered website cards is explicit.
    - Every missing item has an owner and next action.

- [ ] **T1.5 Resolve missing preview coverage**
  - Files:
    - `/Users/gurbakshchahal/auraglasswebsite/components/auraglass/previews/**`
    - `/Users/gurbakshchahal/auraglasswebsite/components/auraglass/**registry**`
  - Acceptance:
    - Every certified renderable component has a live preview card.
    - Every non-renderable item is documented with a clear reason.
    - Catalog count and inventory count no longer conflict.

### Track 2: Website Preview Quality

- [ ] **T2.1 Audit current component cards by screenshot**
  - Files:
    - `/Users/gurbakshchahal/auraglasswebsite/reports/website-3.1/screenshots/page-*.png`
    - `/Users/gurbakshchahal/auraglasswebsite/reports/website-3.1/contact-sheet.png`
  - Acceptance:
    - Every page has a screenshot.
    - Contact sheet is created.
    - Bad cards are recorded by component id.

- [ ] **T2.2 Fix text-only previews**
  - Files:
    - `/Users/gurbakshchahal/auraglasswebsite/components/auraglass/previews/**`
  - Acceptance:
    - No visual/interactive component preview consists only of one or two text lines.
    - Every preview demonstrates the component's actual visual affordance.

- [ ] **T2.3 Fix empty and placeholder previews**
  - Files:
    - `/Users/gurbakshchahal/auraglasswebsite/components/auraglass/previews/**`
  - Disallowed unless intentionally demonstrating empty state:
    - "No chart data available"
    - "Preview unavailable"
    - empty grids
    - blank canvases
    - placeholder-only panels
  - Acceptance:
    - Empty-preview probe passes.

- [ ] **T2.4 Fix provider and compound wrappers**
  - Files:
    - `/Users/gurbakshchahal/auraglasswebsite/components/auraglass/providers/**`
    - `/Users/gurbakshchahal/auraglasswebsite/components/auraglass/previews/**`
  - Acceptance:
    - No valid preview throws provider-hook errors.
    - Compound child components render inside their intended parent component.

- [ ] **T2.5 Fix preview card geometry and overflow**
  - Files:
    - Preview wrappers under `/Users/gurbakshchahal/auraglasswebsite/components/auraglass/**`
    - Package compact props under `/Users/gurbakshchahal/AuraGlass/src/components/**` where issue is upstream
  - Acceptance:
    - No preview card has horizontal overflow.
    - No major content is clipped.
    - No labels, legends, buttons, or badges overlap incoherently.

- [ ] **T2.6 Fix dark-theme visual defects**
  - Files:
    - Website preview files
    - Package source for upstream dark defaults
    - `/Users/gurbakshchahal/AuraGlass/src/styles/**`
    - `/Users/gurbakshchahal/AuraGlass/src/tokens/**`
  - Acceptance:
    - No gray/white slab surfaces in dark previews unless intentionally designed.
    - No harsh white-outline regressions.
    - Text contrast passes automated contrast probes and visual review.

### Track 3: Package Component Hardening

- [ ] **T3.1 Add or normalize compact APIs**
  - Files:
    - `/Users/gurbakshchahal/AuraGlass/src/components/**`
  - Target props:
    - `compact`
    - `contained`
    - `preview`
    - `showHeader`
    - `showToolbar`
    - `showActions`
    - `positionStrategy`
    - `height`
    - `width`
  - Acceptance:
    - Full-page/app-scale components can render cleanly inside card-sized containers.
    - Default production behavior is preserved.

- [ ] **T3.2 Add seeded-data props where previews require meaningful content**
  - Files:
    - Data, ecommerce, collaboration, AI, media, and dashboard components under `/Users/gurbakshchahal/AuraGlass/src/components/**`
  - Target props:
    - `items`
    - `records`
    - `rows`
    - `columns`
    - `events`
    - `users`
    - `nodes`
    - `products`
    - `initialData`
  - Acceptance:
    - Website previews do not need to mock internals or rely on empty fallback states.
    - Components remain usable without seeded data where production defaults make sense.

- [ ] **T3.3 Audit native color inputs**
  - Files:
    - `/Users/gurbakshchahal/AuraGlass/src/components/**`
    - `/Users/gurbakshchahal/AuraGlass/src/utils/colorInput*`
  - Acceptance:
    - No `<input type="color">` receives `var(...)`, token names, invalid rgba strings, or non-hex values.
    - Tests cover token-to-hex normalization.

- [ ] **T3.4 Audit provider hooks**
  - Files:
    - `/Users/gurbakshchahal/AuraGlass/src/components/**Provider*`
    - `/Users/gurbakshchahal/AuraGlass/src/hooks/**`
  - Acceptance:
    - Public standalone components do not crash outside providers unless the invariant is intentional.
    - True compound children retain useful invariant errors.
    - Tests document both cases.

- [ ] **T3.5 Audit canvas/WebGL/frame loops**
  - Files:
    - `/Users/gurbakshchahal/AuraGlass/src/components/**`
    - Components containing `canvas`, `webgl`, `requestAnimationFrame`, `readPixels`, `getImageData`, or media analyzers
  - Acceptance:
    - No per-frame GPU-to-CPU readback in normal rendering.
    - Heavy effects pause when offscreen or reduced motion is active.
    - Blank fallback states are replaced with meaningful static previews where possible.

- [ ] **T3.6 Audit glass tokens and generated CSS**
  - Files:
    - `/Users/gurbakshchahal/AuraGlass/src/styles/variables.css`
    - `/Users/gurbakshchahal/AuraGlass/src/tokens/generated.ts`
    - `/Users/gurbakshchahal/AuraGlass/tokens/**`
    - Token generation scripts under `/Users/gurbakshchahal/AuraGlass/scripts/**`
  - Acceptance:
    - No raw RGB/RGBA token output that violates token lint.
    - No undefined CSS variables.
    - No malformed `var(--token, 0.x)` alpha values.
    - Generated outputs are deterministic.

- [ ] **T3.7 Update snapshots intentionally**
  - Files:
    - `/Users/gurbakshchahal/AuraGlass/src/**/__snapshots__/**`
  - Acceptance:
    - Snapshot updates correspond to intentional visual/API changes.
    - No accidental large snapshot churn without review notes.

### Track 4: Flagship Component Program

For each flagship component, create a tracking row in `/Users/gurbakshchahal/AuraGlass/reports/3.1-release/flagship-components.md`.

Required row fields:

- Component name
- Source file
- Website preview file
- Docs page
- Basic example
- Production example
- Compact example
- Accessibility notes
- Performance notes
- SSR notes
- Tests
- Screenshot sign-off
- Status

Flagship checklist per component:

- [ ] Source defaults are visually polished.
- [ ] Works in a constrained card preview.
- [ ] Has real sample data/content.
- [ ] Has no provider crash in valid usage.
- [ ] Has dark-theme contrast.
- [ ] Has reduced-motion behavior if animated.
- [ ] Has SSR-safe import behavior.
- [ ] Has at least one unit/regression test.
- [ ] Has docs examples.
- [ ] Has website preview.
- [ ] Has screenshot sign-off.

Initial flagship component files to track:

| Component | Package source | Website preview owner |
| --- | --- | --- |
| `OptimizedGlass` | `/Users/gurbakshchahal/AuraGlass/src/primitives/**` | Website surface/primitive previews |
| `GlassCard` | `/Users/gurbakshchahal/AuraGlass/src/components/card/**` | Website card previews |
| `GlassButton` | `/Users/gurbakshchahal/AuraGlass/src/components/button/**` | Website button previews |
| `EnhancedGlassButton` | `/Users/gurbakshchahal/AuraGlass/src/components/button/**` | Website button previews |
| `GlassModal` | `/Users/gurbakshchahal/AuraGlass/src/components/modal/**` or overlay source | Website modal previews |
| `GlassDrawer` | `/Users/gurbakshchahal/AuraGlass/src/components/**` | Website modal/overlay previews |
| `GlassPopover` | `/Users/gurbakshchahal/AuraGlass/src/components/**` | Website modal/overlay previews |
| `GlassCommandPalette` | `/Users/gurbakshchahal/AuraGlass/src/components/**` | Website navigation/input previews |
| `GlassNavbar` | `/Users/gurbakshchahal/AuraGlass/src/components/navigation/**` | Website navigation previews |
| `GlassSidebar` | `/Users/gurbakshchahal/AuraGlass/src/components/navigation/**` | Website navigation previews |
| `GlassTabs` | `/Users/gurbakshchahal/AuraGlass/src/components/**` | Website input/navigation previews |
| `GlassDataGrid` | `/Users/gurbakshchahal/AuraGlass/src/components/data-display/**` | Website data-display previews |
| `GlassDataTable` | `/Users/gurbakshchahal/AuraGlass/src/components/data-display/GlassDataTable.tsx` | Website data-display previews |
| `GlassDataChart` | `/Users/gurbakshchahal/AuraGlass/src/components/charts/**` or data-display source | Website data-display previews |
| `GlassHeatmap` | `/Users/gurbakshchahal/AuraGlass/src/components/data-display/GlassHeatmap.tsx` | Website data-display previews |
| `GlassCalendar` | `/Users/gurbakshchahal/AuraGlass/src/components/calendar/**` | Website calendar/input previews |
| `GlassKanbanBoard` | `/Users/gurbakshchahal/AuraGlass/src/components/data-display/GlassKanbanBoard.tsx` | Website data-display previews |
| `GlassWizard` | `/Users/gurbakshchahal/AuraGlass/src/components/input/GlassWizard.tsx` | Website input previews |
| `GlassMediaControls` | `/Users/gurbakshchahal/AuraGlass/src/components/media/**` | Website media previews |
| `GlassImageViewer` | `/Users/gurbakshchahal/AuraGlass/src/components/image/**` | Website media/image previews |
| `GlassMusicVisualizer` | `/Users/gurbakshchahal/AuraGlass/src/components/ai/GlassMusicVisualizer.tsx` | Website media/AI previews |
| `LiquidGlassMaterial` | `/Users/gurbakshchahal/AuraGlass/src/primitives/**` | Website Liquid Glass previews |
| `LiquidGlassSourceTransition` | `/Users/gurbakshchahal/AuraGlass/src/primitives/**` | Website Liquid Glass previews |
| `LiquidGlassScrollEdge` | `/Users/gurbakshchahal/AuraGlass/src/primitives/**` | Website Liquid Glass previews |
| `GlassDashboard` | `/Users/gurbakshchahal/AuraGlass/src/components/**` | Website dashboard/data previews |
| `GlassPrismComparison` | `/Users/gurbakshchahal/AuraGlass/src/components/website-components/GlassPrismComparison.tsx` | Website systems/featured previews |
| `CollaborativeGlassWorkspace` | `/Users/gurbakshchahal/AuraGlass/src/components/collaboration/CollaborativeGlassWorkspace.tsx` | Website collaboration previews |
| `GlassProductRecommendations` | `/Users/gurbakshchahal/AuraGlass/src/components/ecommerce/GlassProductRecommendations.tsx` | Website ecommerce previews |
| `GlassSmartShoppingCart` | `/Users/gurbakshchahal/AuraGlass/src/components/ecommerce/GlassSmartShoppingCart.tsx` | Website ecommerce previews |

### Track 5: Documentation Files And Checklists

- [ ] **T5.1 Rewrite root README**
  - File: `/Users/gurbakshchahal/AuraGlass/README.md`
  - Required sections:
    - Liquid Glass components for React and Next.js
    - Install
    - Minimal usage
    - Why AuraGlass
    - AuraGlass vs shadcn/ui
    - Flagship components
    - Recipes/templates
    - Theming
    - Accessibility
    - Performance
    - SSR and Next.js
    - Optional peers
    - Release evidence
  - Acceptance:
    - README renders cleanly on GitHub and npm.
    - First install path is visible near the top.

- [ ] **T5.2 Add or update migration guide**
  - Target file:
    - `/Users/gurbakshchahal/AuraGlass/docs/migration/3.1.md` or website equivalent
  - Acceptance:
    - 3.0.x to 3.1 API changes are explicit.
    - Compact/contained API additions are documented.

- [ ] **T5.3 Add core docs pages**
  - Target website files:
    - `/Users/gurbakshchahal/auraglasswebsite/app/docs/getting-started/page.*`
    - `/Users/gurbakshchahal/auraglasswebsite/app/docs/installation/page.*`
    - `/Users/gurbakshchahal/auraglasswebsite/app/docs/nextjs/page.*`
    - `/Users/gurbakshchahal/auraglasswebsite/app/docs/theming/page.*`
    - `/Users/gurbakshchahal/auraglasswebsite/app/docs/accessibility/page.*`
    - `/Users/gurbakshchahal/auraglasswebsite/app/docs/performance/page.*`
    - `/Users/gurbakshchahal/auraglasswebsite/app/docs/optional-peers/page.*`
  - Acceptance:
    - Every page has install/import examples where relevant.
    - Every page has SEO metadata.
    - Every page is linkable from docs navigation.

- [ ] **T5.4 Add comparison docs**
  - Target website files:
    - `/Users/gurbakshchahal/auraglasswebsite/app/docs/compare/shadcn/page.*`
    - `/Users/gurbakshchahal/auraglasswebsite/app/docs/compare/liquid-glass-react/page.*`
    - `/Users/gurbakshchahal/auraglasswebsite/app/docs/compare/react-glassmorphism-libraries/page.*`
    - `/Users/gurbakshchahal/auraglasswebsite/app/docs/compare/building-in-house/page.*`
  - Acceptance:
    - Comparisons are honest, specific, and do not overclaim.
    - Each page includes "when to choose AuraGlass" and "when not to choose AuraGlass."
    - `shadcn/ui` and `liquid-glass-react` receive dedicated pages because they have meaningful public traction.
    - Smaller projects such as Omnira UI, Ein UI, Glasscn UI, shadcn-glass-ui, `@liquidglass/react`, and smaller glass UI kits are covered inside the broader category page unless search/user signals justify a dedicated page later.

- [ ] **T5.5 Add recipe docs**
  - Target website files:
    - `/Users/gurbakshchahal/auraglasswebsite/app/recipes/**`
  - Required recipes:
    - SaaS dashboard
    - AI command center
    - Media app
    - Settings and billing
    - Collaborative workspace
  - Acceptance:
    - Each recipe has a screenshot, imports, code snippet, setup notes, and optional peer notes.

### Track 6: SEO And Metadata Files

- [ ] **T6.1 Update package metadata**
  - File: `/Users/gurbakshchahal/AuraGlass/package.json`
  - Fields:
    - `description`
    - `keywords`
    - `homepage`
    - `repository`
    - `bugs`
    - `license`
    - `funding`, if applicable
  - Acceptance:
    - `npm view aura-glass` will show optimized metadata after publish.

- [ ] **T6.2 Add website metadata**
  - Files:
    - `/Users/gurbakshchahal/auraglasswebsite/app/layout.*`
    - route-level metadata files or page exports under `/Users/gurbakshchahal/auraglasswebsite/app/**`
  - Acceptance:
    - Homepage, components, docs, recipes, and comparison pages have unique title and description.
    - Canonical URLs are present.
    - Open Graph metadata is present.

- [ ] **T6.3 Add sitemap and robots**
  - Files:
    - `/Users/gurbakshchahal/auraglasswebsite/app/sitemap.*`
    - `/Users/gurbakshchahal/auraglasswebsite/app/robots.*`
  - Acceptance:
    - Sitemap includes launch pages, docs, recipes, comparison pages, component catalog, and component detail pages.
    - Robots policy allows desired search and AI crawlers.

- [ ] **T6.4 Add structured data**
  - Files:
    - Website layout or per-page metadata helpers
  - Schemas:
    - `SoftwareApplication`
    - `WebSite`
    - `BreadcrumbList`
    - `FAQPage`
    - `SoftwareSourceCode`
  - Acceptance:
    - Structured data validates with no critical errors.

- [ ] **T6.5 Update GitHub repository metadata**
  - Tooling:
    - GitHub web UI or GitHub CLI/API
  - Fields:
    - description
    - website URL
    - topics
  - Acceptance:
    - Repo metadata matches README/npm/website positioning.

- [ ] **T6.6 Add GitHub templates**
  - Target files:
    - `/Users/gurbakshchahal/AuraGlass/.github/ISSUE_TEMPLATE/bug_report.md`
    - `/Users/gurbakshchahal/AuraGlass/.github/ISSUE_TEMPLATE/visual_regression.md`
    - `/Users/gurbakshchahal/AuraGlass/.github/ISSUE_TEMPLATE/component_request.md`
    - `/Users/gurbakshchahal/AuraGlass/.github/ISSUE_TEMPLATE/documentation_issue.md`
    - `/Users/gurbakshchahal/AuraGlass/.github/pull_request_template.md`
    - `/Users/gurbakshchahal/AuraGlass/SECURITY.md`
    - `/Users/gurbakshchahal/AuraGlass/CONTRIBUTING.md`
  - Acceptance:
    - Templates include visual QA, reproduction, package version, browser, framework, and release gate fields.

### Track 7: GEO / AI Agent Files

- [ ] **T7.1 Add short AI context**
  - File: `/Users/gurbakshchahal/auraglasswebsite/public/llms.txt`
  - Acceptance:
    - Served as `text/plain`.
    - Includes package description, install command, basic imports, when to use, when not to use, docs links, npm link, GitHub link.

- [ ] **T7.2 Add long AI context**
  - File: `/Users/gurbakshchahal/auraglasswebsite/public/llms-full.txt` or `/Users/gurbakshchahal/auraglasswebsite/public/llms-full.md`
  - Acceptance:
    - Includes component categories, flagship components, examples, peer dependencies, comparison guidance, recipes, and common mistakes.

- [ ] **T7.3 Add AI-agent docs pages**
  - Target files:
    - `/Users/gurbakshchahal/auraglasswebsite/app/docs/ai-agents/page.*`
    - `/Users/gurbakshchahal/auraglasswebsite/app/docs/ai-agents/install/page.*`
    - `/Users/gurbakshchahal/auraglasswebsite/app/docs/ai-agents/nextjs/page.*`
    - `/Users/gurbakshchahal/auraglasswebsite/app/docs/ai-agents/component-selection/page.*`
    - `/Users/gurbakshchahal/auraglasswebsite/app/docs/ai-agents/common-mistakes/page.*`
  - Acceptance:
    - Pages are plain, concrete, copy-safe, and indexable.
    - Examples avoid hidden dependencies.

- [ ] **T7.4 Add docs metadata endpoint**
  - File or route:
    - `/Users/gurbakshchahal/auraglasswebsite/public/docs-index.json`
    - or `/Users/gurbakshchahal/auraglasswebsite/app/docs-index/route.*`
  - Required fields:
    - component id
    - component name
    - import name
    - category
    - status
    - package path
    - peer dependencies
    - examples
    - docs URL
  - Acceptance:
    - Agent can map user intent to valid imports without inventing names.

- [ ] **T7.5 Run AI-agent smoke prompts**
  - Output:
    - `/Users/gurbakshchahal/AuraGlass/reports/3.1-release/geo-agent-readiness.md`
  - Test prompts:
    - "Install AuraGlass in a Next.js app and render a glass card."
    - "When should I use AuraGlass instead of shadcn/ui?"
    - "Build a premium SaaS dashboard using AuraGlass."
    - "Which AuraGlass components should I use for a media player?"
    - "Create an AI command center UI with AuraGlass."
  - Acceptance:
    - At least two coding agents generate valid package names, imports, CSS import, and component choices.

### Track 8: Website Audit Scripts And Evidence

- [ ] **T8.1 Runtime sweep**
  - Files:
    - `/Users/gurbakshchahal/auraglasswebsite/scripts/audit/runtime.*`
    - Output `/Users/gurbakshchahal/auraglasswebsite/reports/website-3.1/runtime.json`
  - Acceptance:
    - Walks every `/components` page.
    - Captures console errors, page errors, React warnings, provider crashes, and PreviewBoundary catches.

- [ ] **T8.2 Contrast sweep**
  - Files:
    - `/Users/gurbakshchahal/auraglasswebsite/scripts/audit/contrast.*`
    - Output `/Users/gurbakshchahal/auraglasswebsite/reports/website-3.1/contrast.json`
  - Acceptance:
    - Runs across catalog pages and responsive viewports.
    - Reports selector, foreground, background, ratio, required ratio, and text snippet.

- [ ] **T8.3 Geometry and overflow sweep**
  - Files:
    - `/Users/gurbakshchahal/auraglasswebsite/scripts/audit/geometry.*`
    - Output `/Users/gurbakshchahal/auraglasswebsite/reports/website-3.1/geometry.json`
  - Acceptance:
    - Detects overflow, clipping, and obvious element overlap inside preview cards.

- [ ] **T8.4 Empty-preview sweep**
  - Files:
    - `/Users/gurbakshchahal/auraglasswebsite/scripts/audit/empty-previews.*`
    - Output `/Users/gurbakshchahal/auraglasswebsite/reports/website-3.1/empty-previews.json`
  - Acceptance:
    - Fails on blank, placeholder, unavailable, no-data, and text-only invalid previews.

- [ ] **T8.5 Visual-density sweep**
  - Files:
    - `/Users/gurbakshchahal/auraglasswebsite/scripts/audit/visual-density.*`
    - Output `/Users/gurbakshchahal/auraglasswebsite/reports/website-3.1/visual-density.json`
  - Acceptance:
    - Flags cards that are too sparse, too dense, or visually unbalanced.

- [ ] **T8.6 Screenshot and contact sheet generation**
  - Files:
    - `/Users/gurbakshchahal/auraglasswebsite/scripts/audit/screenshots.*`
    - Output `/Users/gurbakshchahal/auraglasswebsite/reports/website-3.1/screenshots/**`
    - Output `/Users/gurbakshchahal/auraglasswebsite/reports/website-3.1/contact-sheet.png`
  - Acceptance:
    - Every component page is captured.
    - Contact sheet is reviewed before release.

### Track 9: Release Gates And Commands

Package commands:

- [ ] `npm run lint:check`
- [ ] `npm run lint:tokens`
- [ ] `npm run lint:styles`
- [ ] `npm run glass:full-check`
- [ ] `npm run test:coverage`
- [ ] `npm run verify:pack`
- [ ] `npm run release:dry-run`

Website commands:

- [ ] Install/pack the local AuraGlass 3.1 candidate into the website.
- [ ] Start website dev server.
- [ ] Run full website verify command.
- [ ] Run inventory reconciliation.
- [ ] Run runtime sweep.
- [ ] Run contrast sweep.
- [ ] Run geometry sweep.
- [ ] Run empty-preview sweep.
- [ ] Run visual-density sweep.
- [ ] Generate screenshots and contact sheet.

Release evidence files:

- [ ] `/Users/gurbakshchahal/AuraGlass/reports/3.1-release/package-gates.md`
- [ ] `/Users/gurbakshchahal/AuraGlass/reports/3.1-release/npm-publish.md`
- [ ] `/Users/gurbakshchahal/AuraGlass/reports/3.1-release/github-release.md`
- [ ] `/Users/gurbakshchahal/AuraGlass/reports/3.1-release/seo-launch-checklist.md`
- [ ] `/Users/gurbakshchahal/AuraGlass/reports/3.1-release/geo-agent-readiness.md`
- [ ] `/Users/gurbakshchahal/auraglasswebsite/reports/website-3.1/SUMMARY.md`

### Track 10: Versioning, Publishing, And Launch

- [ ] **T10.1 Create release candidate**
  - Files:
    - `/Users/gurbakshchahal/AuraGlass/package.json`
    - `/Users/gurbakshchahal/AuraGlass/package-lock.json`
    - `/Users/gurbakshchahal/AuraGlass/CHANGELOG.md`
  - Acceptance:
    - Version is `3.1.0`.
    - Changelog includes package fixes, website proof, SEO/GEO work, docs, and remaining known risks.

- [ ] **T10.2 Publish npm**
  - Command:
    - `npm publish --access public`
  - Acceptance:
    - `npm view aura-glass version dist-tags --json` returns `3.1.0` as latest.
    - Publish notes record whether provenance was CI-backed or intentionally disabled for local publish.

- [ ] **T10.3 Push GitHub release**
  - Files:
    - Git commit containing package, docs, and report changes.
    - Git tag `v3.1.0`.
    - GitHub release notes.
  - Acceptance:
    - GitHub main contains release commit.
    - Tag exists.
    - Release notes link to npm, docs, changelog, and website.

- [ ] **T10.4 Deploy website**
  - Files:
    - Website deployment config and build output.
  - Acceptance:
    - Production website reflects 3.1.
    - Sitemap, `llms.txt`, docs, recipes, and component catalog are live.
    - Install snippets point to `aura-glass@3.1.0` or current latest.

## Component Family Audit Checklists

Use these checklists for every component family before closing 3.1.

### Buttons And Controls

- [ ] Visual defaults look polished in dark mode.
- [ ] Hover/focus/active states are visible and not excessive.
- [ ] Focus-visible behavior is accessible.
- [ ] Icon and text spacing is stable.
- [ ] Compact preview does not truncate text.
- [ ] Disabled/loading states are documented.

### Cards And Surfaces

- [ ] Glass background uses tokens.
- [ ] Border and highlight do not create harsh white outlines.
- [ ] Text contrast passes.
- [ ] Nested surfaces remain visually balanced.
- [ ] Works on dark and light backgrounds.
- [ ] Does not require website-specific overrides.

### Data Display

- [ ] Realistic data is available.
- [ ] Empty state is intentional and documented.
- [ ] Tables/grids do not clip columns in preview.
- [ ] Charts have readable labels and legends.
- [ ] Heatmaps, timelines, calendars, and trees avoid overlap.
- [ ] Virtualized components render meaningful sample rows.

### Inputs And Forms

- [ ] Labels and values are readable.
- [ ] Native color inputs use valid literal values.
- [ ] Radio/checkbox/select compound children are wrapped correctly.
- [ ] Validation/error/success states are visible.
- [ ] Keyboard interaction works.
- [ ] Compact forms do not overflow.

### Overlays

- [ ] Modal/drawer/popover previews do not trap the audit runner.
- [ ] Controlled and uncontrolled modes do not loop.
- [ ] Overlay still previews are visually meaningful.
- [ ] Focus management is documented.
- [ ] Portal behavior is contained in website previews where needed.

### Navigation And Layout

- [ ] Full-page layouts support contained preview mode.
- [ ] Sidebar/navbar components do not use fixed positioning unless requested.
- [ ] Responsive collapse states work.
- [ ] Active/current states are clear.
- [ ] No viewport-height assumptions break card previews.

### AI, Media, Canvas, And WebGL

- [ ] Heavy components have compact/static preview modes.
- [ ] No per-frame readback stalls.
- [ ] Reduced motion is respected.
- [ ] Blank canvas states are replaced with meaningful fallback visuals.
- [ ] Optional peer dependencies are documented.
- [ ] Browser-only APIs are guarded.

### Collaboration And Realtime

- [ ] Provider requirements are documented.
- [ ] Standalone preview fallback is inert and safe where appropriate.
- [ ] Cursor/presence layers can render contained.
- [ ] No full-screen assumptions in preview mode.
- [ ] Sample users and activity are seeded.

### Ecommerce And Product Surfaces

- [ ] Sample products/cart items are seeded.
- [ ] Currency/price formatting is stable.
- [ ] Empty cart/recommendation state is intentional.
- [ ] Cards do not overflow with realistic product names.
- [ ] Actions are visible and styled.

### Accessibility Components

- [ ] Accessibility providers do not crash in valid examples.
- [ ] High-contrast mode examples are visible.
- [ ] Reduced-motion examples are visible.
- [ ] Focus indicators are demonstrated.
- [ ] Docs explain accessibility tradeoffs for glass UI.

## Per-Component Tracking Template

Copy this template into `reports/3.1-release/flagship-components.md` and website audit notes for every flagship component and every repaired component.

```md
## Component: <ComponentName>

- Status: [ ] Not started / [~] In progress / [x] Complete / [!] Blocked
- Package source:
- Website preview file:
- Docs page:
- Category:
- Public import:
- Required peers:
- Provider requirements:
- Compound parent requirements:
- Compact/contained support:
- Seeded data support:
- Known 3.0.x issue:
- 3.1 fix:
- Tests added/updated:
- Snapshots updated:
- Website screenshot:
- Accessibility notes:
- Performance notes:
- SSR notes:
- Remaining risk:
- Owner:
- Reviewer:

Checklist:
- [ ] Renders in package test.
- [ ] Renders in website preview.
- [ ] Renders with dark theme.
- [ ] Renders in constrained card.
- [ ] Has meaningful content.
- [ ] Has no console/page errors.
- [ ] Has no PreviewBoundary catch.
- [ ] Has no overflow/clipping.
- [ ] Has no contrast violation.
- [ ] Has docs.
- [ ] Has agent-safe example if flagship.
- [ ] Screenshot reviewed.
```

## Release Checklist

- [ ] Inventory reconciliation complete.
- [ ] Missing previews added or documented.
- [ ] Flagship list finalized.
- [ ] Flagship previews visually signed off.
- [ ] All catalog pages screenshot.
- [ ] Runtime sweep passes.
- [ ] Contrast sweep passes.
- [ ] Geometry/overflow sweep passes.
- [ ] Empty-preview sweep passes.
- [ ] Visual-density sweep passes.
- [ ] Docs updated.
- [ ] Recipes added.
- [ ] README updated.
- [ ] npm package description, homepage, repository, bugs URL, and keywords updated.
- [ ] GitHub repository description, website URL, topics, issue templates, and PR template updated.
- [ ] SEO titles and meta descriptions added for launch pages.
- [ ] Sitemap and robots configuration verified.
- [ ] Open Graph and Twitter/X metadata verified.
- [ ] Structured data added where relevant.
- [ ] `/llms.txt` deployed and verified as `text/plain`.
- [ ] Long-form AI-agent context deployed and verified.
- [ ] AI-agent quickstart docs added.
- [ ] Component-selection guide for agents added.
- [ ] Agent common-mistakes guide added.
- [ ] Canonical install/import snippets checked across README, npm, docs, and agent context.
- [ ] GEO readiness report written.
- [ ] npm README rendering checked.
- [ ] CHANGELOG updated.
- [ ] Migration guide added.
- [ ] Package tests pass.
- [ ] Package release dry-run passes.
- [ ] Website gates pass against packed package.
- [ ] npm publish complete.
- [ ] npm latest verified.
- [ ] GitHub release commit pushed.
- [ ] GitHub tag created.
- [ ] Website deployed.
- [ ] Launch summary written.

## Recommended Immediate Next Steps

1. Run the website inventory reconciliation and identify the exact missing components.
2. Split the missing preview work by category.
3. Select the final 3.1 flagship set and freeze it.
4. Fix package-level compact/contained gaps surfaced by the website.
5. Build the new docs and recipes in parallel with catalog cleanup.
6. Lock the 3.1 SEO keyword set, GEO/AI-agent strategy, npm keywords, GitHub topics, README structure, and docs navigation.
7. Add stronger website audit probes before declaring the catalog clean.
8. Pack the package into the website and verify the website against the exact 3.1 release candidate.

## Final Definition Of Done

AuraGlass 3.1 is done when a new developer can land on the website, understand the product in 30 seconds, install the package in under five minutes, browse a complete and polished component catalog, copy a recipe into a real app, and trust that the package has passed both code-level and visual release gates.
