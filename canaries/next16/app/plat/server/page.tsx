/* GENERATED at integration time by scripts/ci/gen-server-page.mjs — do
   not edit by hand. Renders every server-safe export count so the rsc spec
   can assert the payload carries no client reference. Server Component. */
import * as mod___tokens from 'aura-glass/tokens';
import * as mod___icons from 'aura-glass/icons';
import * as mod___internal from 'aura-glass/internal';
import * as mod___three from 'aura-glass/three';

const modules = {
  'tokens': mod___tokens,
  'icons': mod___icons,
  'internal': mod___internal,
  'three': mod___three,
};

export default function PlatServerPage() {
  const counts = Object.entries(modules).map(([name, mod]) => `${name}:${Object.keys(mod).length}`).join(' ');
  return (
    <main data-ag-canary="plat-server">
      <h1>plat/server</h1>
      <p data-ag-canary="counts">{counts}</p>
    </main>
  );
}
