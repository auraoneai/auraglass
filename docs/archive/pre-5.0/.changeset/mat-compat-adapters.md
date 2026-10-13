---
"aura-glass": patch
---

MAT 4.x compat adapters (MAT-354/355/356, REQ-MAT-24): `OptimizedGlass`, `GlassCore`, `OptimizedGlassAdvanced`, `LiquidGlassMaterial`, `LiquidGlassEffectGroup`, `LiquidGlassLayerProvider`, `LiquidGlassScrollEdge`, `LiquidGlassConcentricFrame` map onto `Surface`/`SurfaceGroup`/`ScrollEdge`/`ConcentricFrame` via `materialProps`, dropping the deleted optical props with one `warnDeprecated` each. Also fills `src/compat/mat/index.ts`, `src/root/mat.ts` (frozen ROOT_EXPORTS.mat), and `tests/material/exports` (MAT-347).
