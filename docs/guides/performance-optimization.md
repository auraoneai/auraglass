# Liquid Glass Performance Optimization

Liquid glass primitives should scale from low-power devices to GPU-accelerated scenes without losing readability or interaction quality.

## Guidelines

- Prefer tokenized CSS glass surfaces for standard UI.
- Use GPU, Houdini, or Three-backed effects only where the interaction needs them.
- Gate expensive effects behind feature detection and quality tiers.
- Keep animation paths reduced-motion aware.
- Avoid layout shifts when swapping between enhanced and fallback materials.

## Verification

Use Storybook, visual tests, and targeted browser checks for any primitive-level rendering change.
