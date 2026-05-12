# ShowcaseCard

`ShowcaseCard` is a marketing glass surface for feature cards, hero callouts, and gallery tiles.

```tsx
import { ShowcaseCard } from "aura-glass";

<ShowcaseCard intensity="strong" glow="aurora" interactive>
  Premium marketing content
</ShowcaseCard>;
```

## API

- `intensity`: `"subtle" | "medium" | "strong"`
- `glow`: `"none" | "subtle" | "aurora"`
- `floating`: `boolean`
- `interactive`: `boolean`
- `radius`: `"md" | "lg" | "xl"`
- `padding`: `"sm" | "md" | "lg"`
- `highlight`: `boolean`

## Notes

Use `ShowcaseCard` for marketing and showcase surfaces. Keep ordinary app panels on `GlassCard`.
