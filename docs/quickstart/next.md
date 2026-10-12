# Quickstart — Next.js

From a new Next.js app to the AuraGlass `app-frame` block on screen: six shell
commands and one file edit. You need Node 20.19 or later.

`auraglass init` wires the stylesheet and the cascade-layer order for you, so
there is no `tsconfig.json` change, no `@source` line and no optional peer to
install. Each `{step}` block below holds one command;
`tests/dx/quickstart.spec.ts` runs them literally, with and without Tailwind.

## 1. Create the app

With Tailwind CSS (the `create-next-app` default):

{step scaffold variant=tailwind}
```bash
npx create-next-app@latest my-app --yes
```

Without Tailwind CSS:

{step scaffold variant=plain}
```bash
npx create-next-app@latest my-app --yes --no-tailwind
```

Then move into it:

{step scaffold}
```bash
cd my-app
```

## 2. Install AuraGlass

Until 5.0.0 ships, the 5.0 pre-releases publish under the `next` dist-tag.

{step install}
```bash
npm install aura-glass@next
```

## 3. Set up AuraGlass

`init` detects the App Router and Tailwind, adds the layer order and the
`aura-glass/styles.css` import (plus `aura-glass/tailwind.css` when Tailwind is
present) to `app/globals.css`, and writes `auraglass.json`.

{step init}
```bash
npx aura-glass-cli@latest init --yes
```

## 4. Add the app-frame block

{step add}
```bash
npx aura-glass-cli@latest add app-frame --yes
```

The block's source lands in `components/aura/app-frame/`; it is your code to
change.

## 5. Render it

Replace `app/page.tsx` with:

{step edit file=app/page.tsx}
```tsx
import { AppFrame } from '../components/aura/app-frame';

export default function Page() {
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

Using Vite instead? See [the Vite quickstart](./vite.md).
