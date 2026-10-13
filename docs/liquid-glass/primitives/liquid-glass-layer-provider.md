# Environment and material tiers

Layering in 5.0 is declared per surface, not through a provider: `Surface` (and every material-bearing component) takes `layer`, `variant`, and `thickness`, and the material engine in `aura-glass/styles.css` resolves the shipped tiers (`standard`, `enhanced`, `lightweight`) plus the solid and forced-colors fallback rungs. `Environment` from `aura-glass/material` declares the ambient backdrop behind a subtree. (The 4.x `LiquidGlassLayerProvider` name survives only as a deprecated adapter in `aura-glass/compat`.)

Use `Environment` near app shells and complex surfaces. Direct nested glass surfaces should be avoided unless wrapped in `SurfaceGroup` or explicitly allowed for advanced cases.
