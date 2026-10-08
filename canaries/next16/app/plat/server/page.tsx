/* PLAT-288: server page — renders every server-safe export. The list is
   generated from build/server-safe-exports.json at integration time; the
   page itself must stay a Server Component (no directive, no hooks). */
import * as material from 'aura-glass/material';
import * as tokens from 'aura-glass/tokens';
import * as icons from 'aura-glass/icons';
import * as data from 'aura-glass/data';
import * as date from 'aura-glass/date';
import * as three from 'aura-glass/three';
import * as charts from 'aura-glass/charts';

const modules = { material, tokens, icons, data, date, three, charts };

export default function PlatServerPage() {
  const counts = Object.entries(modules).map(([name, mod]) => `${name}:${Object.keys(mod).length}`).join(' ');
  return (
    <main data-ag-canary="plat-server">
      <h1>plat/server</h1>
      <p data-ag-canary="counts">{counts}</p>
    </main>
  );
}
