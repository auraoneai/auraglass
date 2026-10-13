---
"aura-glass": patch
---

MAT API reports (MAT-343/345, REQ-MAT-22): scripts/mat/api-report.mjs wraps the frozen `api:update --entry` CLI for material/theme/tokens/motion (appending the ENTRIES diff section), composes etc/api/root.mat.api.md and etc/api/compat.mat.api.md, and writes etc/api/material.css-api.json (public vars + S-01 attributes + a11yOverridable + required rung values).
