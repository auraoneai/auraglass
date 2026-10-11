// @ts-nocheck — frozen 4.x consumer usage, codemod input (do not "fix").
import { GlassTabs } from 'aura-glass';

export function Settings({ tab, setTab }) {
  return <GlassTabs value={tab} onValueChange={(id) => setTab(id)} />;
}
