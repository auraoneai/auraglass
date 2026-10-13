# SurfaceGroup

`SurfaceGroup` from `aura-glass/material` groups related material controls into one shared material context. Use it for toolbar groups, segmented controls, badge clusters, and floating control clusters. (The 4.x `LiquidGlassEffectGroup` name survives only as a deprecated adapter in `aura-glass/compat`.)

Checklist:

- Use for related controls that visually belong together.
- Avoid direct glass-on-glass stacking outside a surface group.
- Keep grouped controls keyboard accessible.
- Reduced motion disables morphing but keeps the shared grouping.
