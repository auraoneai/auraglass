// @ts-nocheck — frozen 4.x consumer usage, codemod input (do not "fix").
import { GlassTabs } from 'aura-glass';

export function Settings({ index, setIndex }: any) {
  return <GlassTabs activeTab={index} onChange={(event: any, i: any) => setIndex(i)} />;
}
