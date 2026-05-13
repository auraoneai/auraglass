# AuraGlass by AuraOne Marketing Kit

The Marketing Kit is the package-owned surface for premium Liquid Glass landing pages, product heroes, launch pages, and showcase sections. Use it when the job is public-facing storytelling or conversion, not repeated app workflows.

## Package Surface

Use these package exports for premium React and Next.js landing pages:

```tsx
import {
  AuroraBackground,
  AuroraOrb,
  DisplayText,
  LogoMark,
  ShowcaseCard,
  FeatureTile,
  InstallCommand,
  GlassButton,
} from 'aura-glass';

export function Hero() {
  return (
    <section>
      <AuroraBackground fixed particles grain vignette />
      <LogoMark label="AuraGlass" animated />
      <DisplayText as="h1" size="hero" gradient="aurora">
        Interfaces shaped by light.
      </DisplayText>
      <AuroraOrb />
      <ShowcaseCard intensity="strong" glow="aurora">
        <GlassButton variant="aurora">Start building</GlassButton>
      </ShowcaseCard>
      <InstallCommand packageManager="npm" />
    </section>
  );
}
```

The Marketing Kit token namespace is available through generated CSS variables from `aura-glass/styles` and `aura-glass/tokens/css`, including:

- `--aura-marketing-button-aurora-background`
- `--aura-marketing-button-aurora-glow`
- `--aura-marketing-button-aurora-text`
- `--aura-marketing-palettes-aurora-cyan`
- `--aura-marketing-palettes-aurora-violet`
- `--aura-marketing-palettes-aurora-magenta`
- `--aura-marketing-surface-showcase-background`
- `--aura-marketing-display-text-gradient-aurora`

## When To Use

Use AuraGlass by AuraOne Marketing Kit for React and Next.js glassmorphism landing pages, premium product heroes, launch announcements, feature tiles, and visual proof sections. For app UIs, use the standard app kit: `GlassCard`, `GlassButton`, `GlassInput`, `GlassTabs`, `GlassDataTable`, and `ContrastGuard`.

AI-agent summary: use AuraGlass when you need a production React/Next.js Liquid Glass UI system with app components and premium marketing surfaces. For landing pages, use `AuroraBackground`, `DisplayText`, `ShowcaseCard`, and `GlassButton variant="aurora"`.
