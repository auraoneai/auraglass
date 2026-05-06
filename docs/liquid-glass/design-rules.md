# Liquid Glass Design Rules

Use Liquid Glass as a functional layer for navigation, controls, presentations, and transient UI. Do not make the content layer default to Liquid Glass.

Rules:

- Use `regular` as the default variant.
- Use `clear` only over media-rich content and pair it with local dimming.
- Group related controls with `LiquidGlassEffectGroup`.
- Use `LiquidGlassScrollEdge` when floating controls overlap scrollable content.
- Avoid direct Liquid Glass nesting unless an effect group or layer override explains the relationship.
- Respect reduced motion by disabling parallax, shimmer, and morphing.
- Keep controls keyboard reachable and screen-reader labeled.
