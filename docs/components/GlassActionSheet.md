# GlassActionSheet

## Overview
`GlassActionSheet` is tracked in the AuraGlass component inventory and participates in the glassmorphism visual certification workflow. This page provides direct component documentation coverage for the inventory item and links the component to its owner story, visual certification evidence, and implementation source.

## Inventory Metadata

- Category: misc
- Direct Storybook story: `src/components/mobile/GlassActionSheet.stories.tsx`
- Certification report: `reports/glassmorphism-storybook-visual-certification.json`
- Certification screenshots: `reports/glassmorphism-storybook-visual-certification/screenshots`

## Source Paths

- `src/components/mobile/GlassActionSheet.tsx`

## Glass Contract

- Render translucent glass surfaces with token-backed colors, blur, border, and elevation values.
- Preserve readable foreground contrast on glass backgrounds.
- Respect reduced-motion preferences for transitions, animation, and interactive feedback.
- Keep keyboard and pointer interactions visible through focus, hover, disabled, and loading states where applicable.

## Usage

```tsx
import { GlassActionSheet } from 'aura-glass';

export function GlassActionSheetExample() {
  return (
    <GlassActionSheet aria-label="GlassActionSheet example">
      GlassActionSheet content
    </GlassActionSheet>
  );
}
```

## Verification

This component is expected to remain covered by:

- Direct Storybook owner story coverage.
- Direct documentation coverage in this file.
- The full Storybook visual certification report.
- Unit-test coverage tracked by `npm run audit:components`.
