# DisplayText

`DisplayText` provides marketing-scale typography with optional aurora gradient text.

```tsx
import { DisplayText } from "aura-glass";

<DisplayText as="h1" size="hero" gradient="aurora" balance>
  Hand-polished Liquid Glass interfaces
</DisplayText>;
```

## API

- `as`: `"h1" | "h2" | "h3" | "p" | "span"`
- `size`: `"hero" | "section" | "title" | "label"`
- `gradient`: `boolean | "aurora" | "prism" | "ocean" | "ember"`
- `italic`: `boolean`
- `balance`: `boolean`

## Accessibility

Use `as` to preserve page heading order. Gradient text includes a forced-colors fallback so high contrast users receive normal readable text.
