# Quickstart — Vite

From a new Vite + React app to the AuraGlass `app-frame` block on screen: six
shell commands and one file edit. You need Node 20.19 or later.

`auraglass init` wires the stylesheet and the cascade-layer order for you, so
there is no `tsconfig.json` change, no `@source` line and no optional peer to
install. Each `{step}` block below holds one command;
`tests/dx/quickstart.spec.ts` runs them literally, with and without Tailwind.

## 1. Create the app

{step scaffold}
```bash
npm create vite@latest my-app -- --template react-ts --no-interactive
```

{step scaffold}
```bash
cd my-app
```

### Using Tailwind CSS v4?

If your Vite app already uses Tailwind through `@tailwindcss/vite`, skip
ahead: `init` detects it. To add Tailwind now, these are the steps from the
[Tailwind CSS Vite guide](https://tailwindcss.com/docs/installation/using-vite)
(they are Tailwind's, not AuraGlass's, so they are not counted above).

{prepare tailwind variant=tailwind}
```bash
npm install tailwindcss @tailwindcss/vite
```

{prepare edit variant=tailwind file=vite.config.ts}
```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

{prepare edit variant=tailwind file=src/index.css}
```css
@import "tailwindcss";
```

## 2. Install AuraGlass

AuraGlass 5.0 is the current release on the npm `latest` dist-tag
(`aura-glass@5.0.1`).

{step install}
```bash
npm install aura-glass
```

## 3. Set up AuraGlass

`init` detects Vite and Tailwind, imports `aura-glass/styles.css` once before
your app CSS in `src/main.tsx`, wraps `<App />` in `AuraGlassProvider` and
writes `auraglass.json`. A fresh Vite app has no git repository yet, so tell
the CLI to write without its dirty-tree guard.

{step init}
```bash
npx aura-glass-cli@latest init --yes --allow-no-git
```

## 4. Add the app-frame block

{step add}
```bash
npx aura-glass-cli@latest add app-frame --yes --allow-no-git
```

The block's source lands in `components/aura/app-frame/`; it is your code to
change.

## 5. Render it

Replace `src/App.tsx` with:

{step edit file=src/App.tsx}
```tsx
import { AppFrame } from '../components/aura/app-frame';

export default function App() {
  return <AppFrame />;
}
```

## 6. Run

{step run}
```bash
npm run dev
```

Open the URL the dev server prints: the app frame (top bar, sidebar, inspector
and status bar) renders on AuraGlass material, with no console errors.

Using Next.js instead? See [the Next.js quickstart](./next.md).
