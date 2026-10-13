# Liquid Glass Design Rules

Use Liquid Glass as a functional layer for navigation, controls, presentations, and transient UI. Do not make the content layer default to Liquid Glass. In 5.0 the look ships as the material engine in `aura-glass/styles.css` (single import; tiers `standard` / `enhanced` / `lightweight` with solid and forced-colors fallback rungs), applied through `Surface` and the material axes on components.

Rules:

- Use `regular` as the default variant.
- Use `clear` only over media-rich content and pair it with local dimming.
- Group related controls with `SurfaceGroup` from `aura-glass/material`.
- Use `ScrollEdge` from `aura-glass/material` when floating controls overlap scrollable content.
- Avoid direct Liquid Glass nesting unless a surface group or layer override explains the relationship.
- Respect reduced motion by disabling parallax, shimmer, and morphing.
- Keep controls keyboard reachable and screen-reader labeled.
