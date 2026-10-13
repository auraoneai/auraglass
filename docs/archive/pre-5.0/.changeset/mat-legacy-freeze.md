---
"aura-glass": patch
---

Freeze 4.x rendered material values (MAT-328): `scripts/tokens/freeze-4x.mjs` extracts the shared gradient/fill/border literals, the backdrop-filter blur ternary, `buildSurfaceStyles()` output for every {intent, elevation, tier}, and all 250 `--glass-*` primitives into `tokens/legacy/4x-rendered.tokens.json` (DTCG, `ag.tier: "legacy"`).
