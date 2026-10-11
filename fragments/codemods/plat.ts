/* fragments/codemods/plat.ts — PLAT owns this file on both branches (§3.4).
 *
 * PLAT's codemod fragment (PLAT-338): the subpath rules (B4 removed subpaths,
 * B17 asset renames, B18/B19 are transform-code patterns, not table rows),
 * the deps table (B7), the provider-collapse renames the `providers` codemod
 * consumes, and entry-level `removed` rows for subpaths with no 5.0
 * equivalent (B19). Symbol-level renames for components live in the CMP/SURF/
 * MAT fragments; this file must never duplicate them.
 */
import type { CodemodMappingFragment } from '../../src/contracts/fragments';

const DOC = 'docs/auraglass-5/migrate/5.md';

export default {
  renames: [
    // B4 + B16: removed subpaths collapse to the root barrel; the imported
    // specifiers are then handled by canonical-names / removed on the symbol.
    { from: '*', fromEntry: './navigation', to: '*', toEntry: '.' },
    { from: '*', fromEntry: './overlays', to: '*', toEntry: '.' },
    { from: '*', fromEntry: './marketing', to: '*', toEntry: '.' },
    { from: '*', fromEntry: './workflows', to: '*', toEntry: '.' },
    { from: '*', fromEntry: './workspace', to: '*', toEntry: '.' },
    { from: '*', fromEntry: './client', to: '*', toEntry: '.' },
    { from: '*', fromEntry: './ssr', to: '*', toEntry: '.' },
    { from: '*', fromEntry: './server', to: '*', toEntry: '.' },
    { from: '*', fromEntry: './registry', to: '*', toEntry: '.' },
    { from: '*', fromEntry: './services', to: '*', toEntry: '.' },
    { from: '*', fromEntry: './dist', to: '*', toEntry: '.' },
    // B17: asset subpath renames.
    { from: '*', fromEntry: './styles', to: '*', toEntry: './styles.css' },
    { from: '*', fromEntry: './tokens/css', to: '*', toEntry: './tokens.css' },
    { from: '*', fromEntry: './tokens/tailwind', to: '*', toEntry: './tailwind.css' },
    // Provider collapse (PLAT-329): every 4.x provider wrapper resolves to the
    // single AuraGlassProvider; the providers transform unwraps the extras.
    { from: 'GlassProvider', fromEntry: '.', to: 'AuraGlassProvider', toEntry: '.' },
    { from: 'GlassThemeProvider', fromEntry: '.', to: 'AuraGlassProvider', toEntry: '.' },
    { from: 'ThemeProvider', fromEntry: '.', to: 'AuraGlassProvider', toEntry: '.' },
    { from: 'MotionProvider', fromEntry: '.', to: 'AuraGlassProvider', toEntry: '.' },
    { from: 'MotionPreferenceProvider', fromEntry: '.', to: 'AuraGlassProvider', toEntry: '.' },
    { from: 'ReducedMotionProvider', fromEntry: '.', to: 'AuraGlassProvider', toEntry: '.' },
    { from: 'ToastProvider', fromEntry: '.', to: 'AuraGlassProvider', toEntry: '.' },
    { from: 'TooltipProvider', fromEntry: '.', to: 'AuraGlassProvider', toEntry: '.' },
    { from: 'DensityProvider', fromEntry: '.', to: 'AuraGlassProvider', toEntry: '.' },
    { from: 'PersonaProvider', fromEntry: '.', to: 'AuraGlassProvider', toEntry: '.' },
    { from: 'AuraGlassProvider4', fromEntry: '.', to: 'AuraGlassProvider', toEntry: '.' },
  ],
  props: [
    // Provider `preview="v5"` (C-E 4.3.0) does not exist on 5.0 — it IS 5.0.
    { component: 'AuraGlassProvider', from: 'preview', to: null, todo: 'preview="v5" is unnecessary in 5.0; drop the prop' },
  ],
  removed: [
    // B19: entry-level removals — no 5.0 equivalent, emit TODO instead of a
    // broken collapse.
    { symbol: 'aura-glass/utils/env', entry: './utils/env', reason: 'env helpers removed; write your own `typeof window` checks (B19)', doc: `${DOC}#removed` },
    { symbol: 'aura-glass/tokens/json', entry: './tokens/json', reason: 'tokens JSON subpath removed; read tokens via `aura-glass/tokens` (B19)', doc: `${DOC}#removed` },
    { symbol: 'aura-glass/tokens/manifest', entry: './tokens/manifest', reason: 'tokens manifest subpath removed (B19)', doc: `${DOC}#removed` },
    // Symbol-level removals for subpaths that collapse to root (B4): the
    // surviving import specifiers still need a verdict.
    { symbol: 'glassMixins', entry: './core/mixins/glassMixins', reason: 'core mixins removed; compose from `--ag-*` tokens (B4)', doc: `${DOC}#removed` },
  ],
  deps: [
    // B7: 24 → 4 runtime dependencies. aura-glass bumps to ^5.0.0; deps that
    // were transitive through aura-glass 4.x are removed (consumers that still
    // import them must declare them directly — `doctor` warns via
    // undeclared-transitive).
    { pkg: 'aura-glass', range: '^5.0.0', when: 'upgrade' },
    { pkg: 'date-fns', range: '', when: 'remove' },
    { pkg: 'chart.js', range: '', when: 'remove' },
    { pkg: 'react-chartjs-2', range: '', when: 'remove' },
    { pkg: 'zod', range: '', when: 'remove' },
    { pkg: 'framer-motion', range: '', when: 'remove' },
    { pkg: 'motion', range: '', when: 'remove' },
    { pkg: 'tailwind-merge', range: '', when: 'remove' },
  ],
  fixtures: [
    'imports-subpaths',
    'providers',
    'canonical-names',
    'prop-grammar',
    'dead-optical-props',
    'css-vars',
    'deps',
    'removed',
    'ai-chat',
    'app-shell-slots',
    'media-backdrops',
    'reduced-motion-initial',
    'motion-imports',
    'motion-props',
  ],
} satisfies CodemodMappingFragment;
