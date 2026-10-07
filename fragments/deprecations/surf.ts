// deprecations fragment for SURF (contract S-38). Lane blocks are owned by SURF
// lanes W1..W5; edit only your own block. Id ranges: W1 DEP-S0001..S0199,
// W2 DEP-S0200..S0399, W3 DEP-S0400..S0599, W4 DEP-S0600..S0799,
// W5 DEP-S0800..S0999 (SURF-632). This file lives on release/4.x; the daily
// PLAT sync mirrors it to next where it is read-only (REQ-SURF-12).
import type { DeprecationFragment } from '../../src/contracts/fragments';

// --- lane W1 begin ---
const w1 = [] as const;
// --- lane W1 end ---

// --- lane W2 begin ---
const w2 = [] as const;
// --- lane W2 end ---

// --- lane W3 begin ---
const w3 = [] as const;
// --- lane W3 end ---

// --- lane W4 begin ---
const w4 = [] as const;
// --- lane W4 end ---

// --- lane W5 begin ---
// W5 rows cover the ./workspace and ./workflows 4.x subpaths and the
// commerce/presence/comment 4.x exports (Prompt-4 W5 step 3). All ship in the
// 4.2.0 minor: `status: 'planned'` stays until PLAT's release tooling
// publishes 4.2.0 (verify-deprecations fails 'active' when since > line
// version and 'planned' when since <= it).
const w5 = [
  {
    id: 'DEP-S0800',
    kind: 'subpath',
    status: 'planned',
    entry: './workspace',
    symbol: '*',
    since: '4.2.0',
    removeIn: '5.0.0',
    replacement: "aura-glass/app-shell (the 5.x AppShell composition replaces the 4.x workspace layout subpath)",
    codemod: 'imports-subpaths',
    automation: 'full',
    breaking: 'B4',
    message:
      "aura-glass/workspace is removed in 5.0; migrate to aura-glass/app-shell — the AppShell composition replaces the workspace layout subpath.",
    doc: '#dep-s0800',
  },
  {
    id: 'DEP-S0801',
    kind: 'subpath',
    status: 'planned',
    entry: './workflows',
    symbol: '*',
    since: '4.2.0',
    removeIn: '5.0.0',
    replacement: 'aura-glass/app-shell workspace recipes and the 5.x registry blocks',
    codemod: 'imports-subpaths',
    automation: 'full',
    breaking: 'B4',
    message:
      'aura-glass/workflows is removed in 5.0; the app-shell workspace recipes and 5.x registry blocks replace every export this subpath re-exported.',
    doc: '#dep-s0801',
  },
  {
    id: 'DEP-S0802',
    kind: 'export',
    status: 'planned',
    entry: '.',
    symbol: 'PricingCard',
    since: '4.2.0',
    removeIn: '5.0.0',
    replacement: 'the pricing registry block (5.1) or a docs recipe composed on Card',
    codemod: 'removed',
    automation: 'mostly',
    breaking: 'B3',
    message:
      'PricingCard is removed in 5.0; use the pricing registry block (5.1) or the docs recipe composed on Card — it was a composition, not a component.',
    doc: '#dep-s0802',
  },
  {
    id: 'DEP-S0803',
    kind: 'export',
    status: 'planned',
    entry: '.',
    symbol: 'GlassCommentThread',
    since: '4.2.0',
    removeIn: '5.0.0',
    replacement: 'the comment-thread registry item (5.1)',
    codemod: 'removed',
    automation: 'mostly',
    breaking: 'B3',
    message:
      'GlassCommentThread is removed in 5.0; use the comment-thread registry item (5.1), the single comment surface consolidated from the 4.x duplicates.',
    doc: '#dep-s0803',
  },
  {
    id: 'DEP-S0804',
    kind: 'export',
    status: 'planned',
    entry: '.',
    symbol: 'GlassSmartShoppingCart',
    since: '4.2.0',
    removeIn: '5.0.0',
    replacement: 'the commerce-cart registry block (5.1): controlled cart UI with no baked-in business logic',
    codemod: 'removed',
    automation: 'manual',
    breaking: 'B3',
    message:
      'GlassSmartShoppingCart is removed in 5.0; use the commerce-cart registry block (5.1) — controlled cart UI that holds no discounts, tax or currency logic.',
    doc: '#dep-s0804',
  },
  {
    id: 'DEP-S0805',
    kind: 'export',
    status: 'planned',
    entry: '.',
    symbol: 'GlassProductRecommendations',
    since: '4.2.0',
    removeIn: '5.0.0',
    replacement: 'the commerce registry blocks (5.1) composed on Card and CarouselRail',
    codemod: 'removed',
    automation: 'manual',
    breaking: 'B3',
    message:
      'GlassProductRecommendations is removed in 5.0; compose the commerce registry blocks (5.1) on Card and CarouselRail instead.',
    doc: '#dep-s0805',
  },
  {
    id: 'DEP-S0806',
    kind: 'export',
    status: 'planned',
    entry: '.',
    symbol: 'GlassEcommerceProvider',
    since: '4.2.0',
    removeIn: '5.0.0',
    replacement: 'consumer-owned commerce state; the 5.x commerce registry blocks take data by props',
    codemod: 'removed',
    automation: 'manual',
    breaking: 'B3',
    message:
      'GlassEcommerceProvider is removed in 5.0; keep commerce state in your app — the 5.x commerce registry blocks take data by props only.',
    doc: '#dep-s0806',
  },
  {
    id: 'DEP-S0807',
    kind: 'export',
    status: 'planned',
    entry: '.',
    symbol: 'GlassTeamCursors',
    since: '4.2.0',
    removeIn: '5.0.0',
    replacement: 'the presence-stack registry item (5.1)',
    codemod: 'removed',
    automation: 'mostly',
    breaking: 'B3',
    message:
      'GlassTeamCursors is removed in 5.0; use the presence-stack registry item (5.1) — it only drew three fake cursors with no data input.',
    doc: '#dep-s0807',
  },
  {
    id: 'DEP-S0808',
    kind: 'export',
    status: 'planned',
    entry: '.',
    symbol: 'GlassTeamCursorsWithEffects',
    since: '4.2.0',
    removeIn: '5.0.0',
    replacement: 'the presence-stack registry item (5.1)',
    codemod: 'removed',
    automation: 'mostly',
    breaking: 'B3',
    message:
      'GlassTeamCursorsWithEffects is removed in 5.0; use the presence-stack registry item (5.1) — the effect variant layered static circles on fake cursors.',
    doc: '#dep-s0808',
  },
  {
    id: 'DEP-S0809',
    kind: 'export',
    status: 'planned',
    entry: '.',
    symbol: 'GlassCollaborativeComments',
    since: '4.2.0',
    removeIn: '5.0.0',
    replacement: 'the comment-thread registry item (5.1) plus an anchored-popover pin primitive',
    codemod: 'removed',
    automation: 'partial',
    breaking: 'B3',
    message:
      'GlassCollaborativeComments is removed in 5.0; use the comment-thread registry item (5.1) — spatial pins become an anchored-popover primitive.',
    doc: '#dep-s0809',
  },
] as const;
// --- lane W5 end ---

export default [...w1, ...w2, ...w3, ...w4, ...w5] satisfies DeprecationFragment;
