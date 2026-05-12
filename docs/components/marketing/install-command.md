# InstallCommand

`InstallCommand` renders a polished install command with optional copy support.

```tsx
import { InstallCommand } from "aura-glass";

<InstallCommand packageManager="pnpm" />;
```

## API

- `command`: `string`
- `packageManager`: `"npm" | "pnpm" | "yarn" | "bun"`
- `copyable`: `boolean`
- `copiedLabel`: `string`

## Accessibility And SSR

Clipboard access is only attempted inside the button click handler and is guarded for SSR. The copied state is exposed through the button label and a polite live region.
