---
"aura-glass": patch
---

Compat token alias map + frozen consumer-4x cases (REQ-MAT-21, H03/D-18, D03): tokens/compat-alias-map.json maps all 807 --glass-* names read in the 4.x snapshot/fixture — 15 -> --ag-* successors (documented + value-equal), 618 frozen at rendered values (light + dark-theme overrides), 174 with no rendered value flagged for review; dist/compat/tokens.css emits at 8.0 KB gz. tests/fixtures/consumer-4x/cases/mat adds 6 frozen 4.x usage cases (glass-card, liquid-material, effect-group, scroll-edge, css-vars, provider-motion).
