// codemods fragment for SURF (contract S-38..S-45). Lane blocks are owned by SURF lanes W1..W5; edit only your own block.
import type { CodemodMappingFragment } from '../../src/contracts/fragments';

// --- lane W1 begin ---
const w1: CodemodMappingFragment = {};
// --- lane W1 end ---

// --- lane W2 begin ---
const w2: CodemodMappingFragment = {};
// --- lane W2 end ---

// --- lane W3 begin ---
const w3: CodemodMappingFragment = {};
// --- lane W3 end ---

// --- lane W4 begin ---
const w4: CodemodMappingFragment = {};
// --- lane W4 end ---

// --- lane W5 begin ---
// W5 rows: workspace/workflows subpaths plus the commerce/presence/comment
// 4.x exports removed at 5.0 (DEP-S0800..S0813). Every row names a real
// release/4.x export; `registryItem` points at the 5.1 successor block/item.
const w5: CodemodMappingFragment = {
  renames: [
    {
      from: 'SmartShoppingCart',
      fromEntry: '.',
      to: 'GlassSmartShoppingCart',
      toEntry: '.',
      compatOnly: false,
    },
  ],
  removed: [
    { symbol: '*', entry: './workspace', reason: 'subpath removed; the app-shell workspace recipes replace it', doc: '#dep-s0800' },
    { symbol: '*', entry: './workflows', reason: 'subpath removed; the app-shell workspace recipes and 5.x registry blocks replace it', doc: '#dep-s0801' },
    { symbol: 'GlassSmartShoppingCart', entry: '.', reason: 'baked-in commerce logic; the registry block takes data by props', registryItem: 'commerce-cart', doc: '#dep-s0804' },
    { symbol: 'GlassEcommerceProvider', entry: '.', reason: 'consumer-owned commerce state; no successor', doc: '#dep-s0806' },
    { symbol: 'GlassProductRecommendations', entry: '.', reason: 'compose the commerce blocks on Card and CarouselRail', registryItem: 'commerce-cart', doc: '#dep-s0805' },
    { symbol: 'GlassCommentThread', entry: '.', reason: 'consolidated into the single comment surface', registryItem: 'comment-thread', doc: '#dep-s0803' },
    { symbol: 'GlassCollaborativeComments', entry: '.', reason: 'comment-thread item plus an anchored-popover pin primitive', registryItem: 'comment-thread', doc: '#dep-s0809' },
    { symbol: 'GlassTeamCursors', entry: '.', reason: 'drew fake cursors with no data input', registryItem: 'presence-stack', doc: '#dep-s0807' },
    { symbol: 'GlassTeamCursorsWithEffects', entry: '.', reason: 'effect variant layered static circles on fake cursors', registryItem: 'presence-stack', doc: '#dep-s0808' },
    { symbol: 'GlassUserPresence', entry: '.', reason: 'random presence colours; deterministic ids in the registry item', registryItem: 'presence-stack', doc: '#dep-s0810' },
    { symbol: 'GlassPresenceIndicator', entry: '.', reason: 'consolidated into presence-stack', registryItem: 'presence-stack', doc: '#dep-s0811' },
    { symbol: 'GlassLiveCursorPresence', entry: '.', reason: 'render cursors from a consumer presence channel', registryItem: 'presence-stack', doc: '#dep-s0812' },
    { symbol: 'GlassCollaborativeCursor', entry: '.', reason: 'render cursors from a consumer presence channel', registryItem: 'presence-stack', doc: '#dep-s0813' },
  ],
};
// --- lane W5 end ---

export default {
  renames: [...(w1.renames ?? []), ...(w2.renames ?? []), ...(w3.renames ?? []), ...(w4.renames ?? []), ...(w5.renames ?? [])],
  props: [...(w1.props ?? []), ...(w2.props ?? []), ...(w3.props ?? []), ...(w4.props ?? []), ...(w5.props ?? [])],
  removed: [...(w1.removed ?? []), ...(w2.removed ?? []), ...(w3.removed ?? []), ...(w4.removed ?? []), ...(w5.removed ?? [])],
  deps: [...(w1.deps ?? []), ...(w2.deps ?? []), ...(w3.deps ?? []), ...(w4.deps ?? []), ...(w5.deps ?? [])],
  areaTransforms: [...(w1.areaTransforms ?? []), ...(w2.areaTransforms ?? []), ...(w3.areaTransforms ?? []), ...(w4.areaTransforms ?? []), ...(w5.areaTransforms ?? [])],
  fixtures: [...(w1.fixtures ?? []), ...(w2.fixtures ?? []), ...(w3.fixtures ?? []), ...(w4.fixtures ?? []), ...(w5.fixtures ?? [])],
  cssVars: { ...(w1.cssVars ?? {}), ...(w2.cssVars ?? {}), ...(w3.cssVars ?? {}), ...(w4.cssVars ?? {}), ...(w5.cssVars ?? {}) },
} satisfies CodemodMappingFragment;
