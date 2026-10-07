---
"aura-glass": patch
---

MAT bridge content on the 4.x line (MAT-327, bridge row-group H): tokens/legacy/4x-rendered.tokens.json + tokens/compat-alias-map.json (807 --glass-* names: 15 successors / 618 frozen / 174 flagged), scripts/tokens/build.mjs --platform bridge-4x emitting src/material/compat/tokens.css + src/styles/{v5,preview-v5}.css and dist/tokens/4x/, mat:build:bridge + mat:test:mot-4x CI (MAT-362).
