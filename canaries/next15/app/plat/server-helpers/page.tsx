/* PLAT-288: server helpers — cn, a token, and materialProps() evaluated on
   the server (no client boundary involved). */
import { cn } from 'aura-glass/internal';
import { materialProps } from 'aura-glass/material';
import { agSpace4 } from 'aura-glass/tokens';

export default function PlatServerHelpersPage() {
  const classes = cn('canary', true && 'helpers');
  const mp = materialProps({ tier: 'solid' as never });
  return (
    <main data-ag-canary="plat-server-helpers" style={{ padding: agSpace4 as never }}>
      <h1 className={classes}>plat/server-helpers</h1>
      <pre data-ag-canary="material-props">{JSON.stringify(mp)}</pre>
    </main>
  );
}
