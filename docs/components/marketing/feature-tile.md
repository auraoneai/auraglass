# FeatureTile

`FeatureTile` composes `ShowcaseCard` into a repeatable marketing feature block.

```tsx
import { FeatureTile } from "aura-glass";

<FeatureTile
  index="01"
  title="SSR safe"
  description="Deterministic visuals that hydrate cleanly."
  tone="aurora"
/>;
```

## API

- `index`: `string | number`
- `title`: `React.ReactNode`
- `description`: `React.ReactNode`
- `visual`: `React.ReactNode`
- `size`: `"sm" | "md" | "lg"`
- `tone`: `"neutral" | "aurora" | "success" | "info" | "warning"`

## Notes

Pass custom `visual` content for page-specific demos. The component does not ship page-specific artwork.
