# AuroraOrb

`AuroraOrb` exposes the conic gradient hero orb used for branded marketing moments.

```tsx
import { AuroraOrb } from "aura-glass";

<AuroraOrb size={280} glow="strong" pulse />;
```

## API

- `size`: `number | string`
- `palette`: `"aurora" | "prism" | "ocean" | "ember" | "mono"`
- `pulse`: `boolean`
- `glow`: `"none" | "subtle" | "medium" | "strong"`
- `interactive`: `boolean`
- `tiltX`: `number`
- `tiltY`: `number`

## Notes

The orb is decorative by default and uses CSS gradients instead of canvas or WebGL. Use `tiltX` and `tiltY` when a parent component owns pointer tracking.
