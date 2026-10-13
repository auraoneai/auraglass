// TODO(aura-glass 5): GlassTabs.onValueChange: an index handler onChange(event, index) must map the index to the tab value, see docs/auraglass-5/migrate/5.md#b-6
// @ts-nocheck — frozen 4.x consumer usage, codemod input (do not "fix").
import { GlassTabs } from 'aura-glass';

export function Settings({ index, setIndex }: any) {
  return <GlassTabs value={index} onValueChange={(event: any, i: any) => setIndex(i)} />;
}
