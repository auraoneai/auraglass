/* PLAT-288: server helpers — a token (read from the `tokens` map) and
   materialProps() evaluated on the server (no client boundary involved).
   `cn` is internal on 5.x (no ./internal subpath export), so it is not part
   of the consumer surface. */
import { materialProps } from 'aura-glass/material';
import { tokens } from 'aura-glass/tokens';

export default function PlatServerHelpersPage() {
  const mp = materialProps({ layer: 'chrome' });
  return (
    <main data-ag-canary="plat-server-helpers" style={{ padding: tokens['--ag-space-4'] }}>
      <h1>plat/server-helpers</h1>
      <pre data-ag-canary="material-props">{JSON.stringify(mp)}</pre>
    </main>
  );
}
