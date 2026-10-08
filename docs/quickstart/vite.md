# Quickstart — Vite

Six commands, zero manual file edits. Requires Node 20.19+.

{step 1 — scaffold}
```bash
npm create vite@latest my-app -- --template react-ts
cd my-app
```

{step 2 — install AuraGlass}
```bash
npm install aura-glass@^5
npx @auraglass/cli init --yes --framework vite
```

{step 3 — add a block}
```bash
npx @auraglass/cli add auth
```

{step 4 — wire the styles (the CLI writes this import for you)}
```ts
// src/main.tsx — added by `auraglass init`
import 'aura-glass/styles.css';
```

{step 5 — use a component}
```tsx
import { Button } from 'aura-glass';
export default function App() { return <Button>Hello</Button>; }
```

{step 6 — run}
```bash
npm run dev
```

Expected: dev server up, `aura-glass` styles loaded, block files under
`src/components/`. Total time target: ≤ 240 s on a clean cache.
