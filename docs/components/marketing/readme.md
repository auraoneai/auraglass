# AuraGlass by AuraOne Marketing Kit

The Marketing Kit is the package-owned surface for premium Liquid Glass landing pages, product heroes, launch pages, and showcase sections. Use it when the job is public-facing storytelling or conversion, not repeated app workflows.

Marketing components are separate from app UI components:

- Use Marketing Kit components for public pages: `AuroraBackground`, `DisplayText`, `LogoMark`, `ShowcaseCard`, `FeatureTile`, and `InstallCommand`.
- Use app UI components for product workflows: `GlassCard`, `GlassButton`, `GlassInput`, `GlassTabs`, `GlassDataTable`, `GlassPage`, and `ContrastGuard`.
- A marketing page may use app controls for clear commands, but it should not present optional hosted-runtime behavior as production-ready unless that runtime has been configured and verified.

## Package Surface

Use these package exports for premium React and Next.js landing pages:

```tsx
import {
  AuroraBackground,
  DisplayText,
  FeatureTile,
  GlassButton,
  InstallCommand,
  LogoMark,
  ShowcaseCard,
} from 'aura-glass';

export function Hero() {
  return (
    <section style={{ position: 'relative', overflow: 'hidden' }}>
      <AuroraBackground particles={12} grain vignette reducedMotion seed="launch" />
      <LogoMark label="AuraGlass" animated />
      <DisplayText as="h1" size="hero" gradient="aurora">
        Interfaces shaped by light.
      </DisplayText>
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

## 3.3 Page Composition

Use this composition when building a complete launch page. It covers the 3.3 PRD requirement for a production-ready hero, feature grid, install section, changelog section, social proof section, and visual evidence section.

```tsx
import {
  AuroraBackground,
  DisplayText,
  FeatureTile,
  GlassBadge,
  GlassButton,
  InstallCommand,
  LogoMark,
  ShowcaseCard,
} from 'aura-glass';

const features = [
  {
    title: 'Production app surfaces',
    description: 'App shell, workflow, data, and recipe starters for real product screens.',
  },
  {
    title: 'Provider-safe AI states',
    description: 'AI examples stay fail-closed until credentials and authenticated routes are configured.',
  },
  {
    title: 'Theme and marketing polish',
    description: 'Documented presets and launch sections use tokenized color and reduced-motion defaults.',
  },
];

const changelog = [
  'Eight 3.3 recipe starters added to the registry.',
  'Theme preset guidance covers seven product domains.',
  'Marketing Kit docs include a complete page composition.',
];

const evidence = [
  'Recipe render gate',
  'Storybook visual baseline',
  'Reduced-motion check',
  'Manual accessibility signoff',
];

export function LaunchPage() {
  return (
    <main className="ag-marketing-scope">
      <section style={{ position: 'relative', overflow: 'hidden', padding: '56px 32px' }}>
        <AuroraBackground
          particles={14}
          grain
          vignette
          reducedMotion
          seed="auraglass-33-launch"
        />
        <div style={{ position: 'relative', zIndex: 1, display: 'grid', gap: 18 }}>
          <LogoMark label="AuraGlass" animated={false} />
          <GlassBadge variant="primary">3.3 launch</GlassBadge>
          <DisplayText as="h1" size="hero" gradient="aurora" balance>
            AuraGlass for product launches that still behave like product UI.
          </DisplayText>
          <p>
            Build launch pages that pair premium Liquid Glass marketing surfaces with production package evidence.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            <GlassButton variant="aurora">Start building</GlassButton>
            <InstallCommand packageManager="npm" />
          </div>
        </div>
      </section>

      <section aria-label="Feature grid">
        {features.map((feature, index) => (
          <FeatureTile
            key={feature.title}
            index={index + 1}
            title={feature.title}
            description={feature.description}
            tone={index === 1 ? 'warning' : 'aurora'}
          />
        ))}
      </section>

      <section aria-label="Launch proof">
        <ShowcaseCard intensity="strong" glow="aurora" radius="lg" padding="lg">
          <DisplayText as="h2" size="title">
            Changelog preview
          </DisplayText>
          <ul>
            {changelog.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </ShowcaseCard>

        <ShowcaseCard intensity="medium" glow="subtle" radius="lg" padding="lg">
          <DisplayText as="h2" size="title">
            Social proof and evidence
          </DisplayText>
          <ul>
            {evidence.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </ShowcaseCard>
      </section>
    </main>
  );
}
```

## 3.3 Storybook Coverage

AuraGlass 3.3 adds `3.3/Marketing Launch Kit` in Storybook. The story renders a full launch page with deterministic particles, `reducedMotion`, tokenized marketing colors, a feature grid, changelog preview, and visual-evidence placeholders.

## When To Use

Use AuraGlass by AuraOne Marketing Kit for React and Next.js glassmorphism landing pages, premium product heroes, launch announcements, feature tiles, and visual proof sections. For app UIs, use the standard app kit: `GlassCard`, `GlassButton`, `GlassInput`, `GlassTabs`, `GlassDataTable`, and `ContrastGuard`.

AI-agent summary: use AuraGlass when you need a production React/Next.js Liquid Glass UI system with app components and premium marketing surfaces. For landing pages, use `AuroraBackground`, `DisplayText`, `ShowcaseCard`, and `GlassButton variant="aurora"`.

## Evidence

- `reports/3.3-release/marketing-evidence.md`
- `reports/3.3-release/theme-evidence.md`
