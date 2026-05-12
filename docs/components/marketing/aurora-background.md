# AuroraBackground

`AuroraBackground` renders a package-owned aurora field for product heroes and launch pages.

```tsx
import { AuroraBackground } from "aura-glass";

<AuroraBackground fixed particles={24} grain vignette seed="homepage" />;
```

## API

- `palette`: `"aurora" | "prism" | "ocean" | "ember" | "mono"`
- `intensity`: `"subtle" | "medium" | "strong"`
- `motion`: `"none" | "subtle" | "full"`
- `particles`: `boolean | number`
- `grain`: `boolean`
- `vignette`: `boolean`
- `fixed`: `boolean`
- `reducedMotion`: `boolean`
- `seed`: `string | number`

## Notes

Particle positions are generated from `seed`, so server and client output stay deterministic. The component does not read `window`, `document`, or `navigator` during render. It is decorative by default with `aria-hidden` and does not capture pointer events.
