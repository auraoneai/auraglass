// SURF strict lint config (contract §4.11): exports
//   { strict: { '<rule-name>': string[] /* globs this stream owns */ } }
// and escalates each auraglass/<rule> to 'error' over the listed globs via the
// plugin loader. Lane blocks are owned by SURF lanes W1..W5; edit only your
// own block. Entries may only name globs SURF owns — a rule owner may set
// 'error' only over its own stream's paths (non-blocking rollout, §4.11).
'use strict';

// --- lane W1 begin ---
const w1 = {};
// --- lane W1 end ---

// --- lane W2 begin ---
// W2 builtin-rule assertions (SURF-137/138): the strict map only emits
// 'auraglass/<rule>' configs, so react-hooks/rules-of-hooks and
// no-restricted-properties (toLocale* ban) cannot be expressed here.
// Coverage: rules-of-hooks is 'error' over '**/*.{ts,tsx,js,jsx,mjs,cjs}' in
// eslint.config.js — asserted for SURF paths by
// tests/lint/surf/rules-of-hooks.test.ts against the conditional-hook
// fixture; the toLocale* ban is enforced repo-wide by
// tests/lint/surf/locale-guard.test.ts (config-level form is contract-owned).
const w2 = {};
// --- lane W2 end ---

// --- lane W3 begin ---
const w3 = {};
// --- lane W3 end ---

// --- lane W4 begin ---
const w4 = {};
// --- lane W4 end ---

// --- lane W5 begin ---
// SURF-574: auraglass/no-simulation at error over every SURF-owned path.
// SURF-634: CMP's auraglass/prop-grammar and auraglass/no-forward-ref at error
// over the same SURF globs (SURF opted in). src/components/** is left out on
// purpose: that directory is shared with other streams, and per §4.11 a strict
// glob may cover only paths this stream owns — lane W1/W2/W3 add the specific
// SURF-owned component dirs as they land.
const SURF_OWNED = [
  'src/app-shell/**',
  'src/data/**',
  'src/date/**',
  'src/ai/**',
  'src/media/**',
  'src/backdrops/**',
  'src/charts/**',
  'src/three/**',
  'registry/blocks/**',
  'registry/items/**',
  'packages/labs/src/**',
];
// W5 escalations land incrementally: an entry here produces an
// 'auraglass/<rule>': 'error' config line, so the named rule's module must
// already exist under lint/rules/<owner>/. SURF-574 ships today
// (lint/rules/surf/no-simulation.cjs). SURF-634/635 wait on the owner lanes:
//   - 'prop-grammar'   (CMP — eslint fails plugin-wide while unshipped)
//   - 'no-forward-ref' (CMP)
//   - 'contract-boundary' (PLAT — covers blocks/labs public-entry-only and
//     `three` confined to src/three/**, REQ-SURF-166/-170 + OI-01)
// Each entry is added over SURF_OWNED in the PR that lands the rule module;
// until then these lines must stay out or every stream's lint job breaks.
const w5 = {
  'no-simulation': SURF_OWNED,
};
// --- lane W5 end ---

// Merge per rule so two lanes can extend the same rule's glob list.
const strict = {};
for (const block of [w1, w2, w3, w4, w5]) {
  for (const [rule, globs] of Object.entries(block)) {
    strict[rule] = [...(strict[rule] ?? []), ...globs];
  }
}

module.exports = { strict };
