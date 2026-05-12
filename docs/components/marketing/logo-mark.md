# LogoMark

`LogoMark` renders the frosted conic AuraGlass brand mark.

```tsx
import { LogoMark } from "aura-glass";

<LogoMark size={48} label="AuraGlass" />;
```

## API

- `size`: `number | string`
- `palette`: `"aurora" | "prism" | "ocean" | "ember" | "mono"`
- `label`: `string`
- `animated`: `boolean`

## Accessibility

Without `label`, the mark is decorative and renders with `aria-hidden`. When `label` is provided, it renders as an accessible image with that label.
