# GlassWipeSliderExamples

## Overview
`GlassWipeSliderExamples` is tracked in the AuraGlass component inventory and participates in the glassmorphism visual certification workflow. This page provides direct component documentation coverage for the inventory item and links the component to its owner story, visual certification evidence, and implementation source.

## Inventory Metadata

- Category: misc
- Direct Storybook story: `src/components/website-components/GlassWipeSliderExamples.stories.tsx`
- Certification report: `reports/glassmorphism-storybook-visual-certification.json`
- Certification screenshots: `reports/glassmorphism-storybook-visual-certification/screenshots`

## Source Paths

- `src/components/website-components/GlassWipeSliderExamples.tsx`

## Glass Contract

- Render translucent glass surfaces with token-backed colors, blur, border, and elevation values.
- Preserve readable foreground contrast on glass backgrounds.
- Respect reduced-motion preferences for transitions, animation, and interactive feedback.
- Keep keyboard and pointer interactions visible through focus, hover, disabled, and loading states where applicable.

## Usage

```tsx
import { GlassWipeSliderExamples } from 'aura-glass';

export function GlassWipeSliderExamplesExample() {
  return (
    <GlassWipeSliderExamples aria-label="GlassWipeSliderExamples example">
      GlassWipeSliderExamples content
    </GlassWipeSliderExamples>
  );
}
```

## Verification

This component is expected to remain covered by:

- Direct Storybook owner story coverage.
- Direct documentation coverage in this file.
- The full Storybook visual certification report.
- Unit-test coverage tracked by `npm run audit:components`.
