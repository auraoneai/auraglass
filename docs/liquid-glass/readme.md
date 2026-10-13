# Liquid Glass Documentation

This is the dedicated home for AuraGlass Liquid Glass documentation. Use it for material rules, migration guidance, primitive APIs, and the map from existing glass components to the shipped 5.0 material patterns. In 5.0 (`aura-glass@5.0.1`) the material engine ships inside the single `aura-glass/styles.css` import; the primitives below are the `aura-glass/material` exports.

Component API pages live in the [component reference](https://auraglass-48859d.gitlab.io/components/button) of the docs site, generated from each 5.0 component's meta.

## Start Here

- [Design rules](./design-rules.md): when to use Liquid Glass, when to avoid it, and how to keep it accessible.
- [Component map](./component-map.md): which 5.0 component to choose instead of scanning every export.
- [Migration guide](https://auraglass-48859d.gitlab.io/plat/migrate/5): how existing glass surfaces move to 5.0 (`npx aura-glass-cli migrate 4to5`).

## Primitives

- [ConcentricFrame](./primitives/liquid-glass-concentric-frame.md)
- [SurfaceGroup](./primitives/liquid-glass-effect-group.md)
- [Environment and material tiers](./primitives/liquid-glass-layer-provider.md)
- [ScrollEdge](./primitives/liquid-glass-scroll-edge.md)
- [SourceTransition](./primitives/liquid-glass-source-transition.md)

The unshipped physics/GPU explorations (`LiquidGlassMaterial` props design, liquid glass system tiers, backdrop sampler, showcase) were deleted in the 5.0 GA cleanup (2026-10-13); the shipped equivalents are `Surface` / `SurfaceGroup` / `ScrollEdge` / `ConcentricFrame` / `Environment` from `aura-glass/material`.

## Related Docs

- [Performance optimization](../guides/performance-optimization.md)
