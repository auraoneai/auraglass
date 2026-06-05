# 3.3 Marketing Evidence

Generated for Agent 3 scope.

## Completed

- [x] `docs/components/marketing/readme.md` distinguishes Marketing Kit surfaces from app UI components.
- [x] The marketing docs include a complete page-level composition for hero, feature grid, install command, changelog, social proof, and evidence sections.
- [x] The docs example uses deterministic `AuroraBackground` particles and `reducedMotion`.
- [x] `src/stories/AuraGlass33MarketingLaunch.stories.tsx` adds `3.3/Marketing Launch Kit`.
- [x] The Storybook story renders a complete launch page using package-owned marketing components.
- [x] The Storybook story includes visual-evidence placeholders for recipe render, Storybook baseline, reduced-motion check, and manual accessibility signoff.

## Storybook Surface

Story title:

```text
3.3/Marketing Launch Kit
```

Exported story:

```text
LaunchPage
```

## Public Component Evidence

The story and docs use Marketing Kit exports from the package root:

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
```

## Recorded Release Gate

- [x] `npm run test:recipes:render -- --skip-build` captured `reports/3.3-release/recipe-screenshots/marketing-launch-kit.png`.
- [x] `npm run build-storybook` completed for the 3.3 Storybook surface set.
- [x] Reduced-motion visual coverage is recorded by `npm run test:visual:app-chrome` through `reports/3.3-release/app-chrome-visuals/reduced-motion.png`.
- [ ] Manual accessibility signoff remains external and is tracked in `reports/3.3-release/accessibility-certification.md`.
