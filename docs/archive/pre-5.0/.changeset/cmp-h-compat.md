---
"aura-glass": minor
---

cmp lane 3h: 4.x compat adapters + deprecation/codemod fragments + registry items

- 60 compat adapters under src/compat/cmp/{controls,overlays} (warnDeprecated at call time, once per symbol, never throw; unmappable props drop with a single warning)
- fragments/deprecations/cmp.ts: 87 entries (59 export renames, subpath, 3 removals, prop/prop-value rows)
- fragments/codemods/cmp.ts: 61 renames, 58 prop-grammar rows, 3 removed; 78 fixture case dirs under fragments/codemods/cmp/fixtures/
- registry items confirm-dialog + account-menu, block overlay-flows
