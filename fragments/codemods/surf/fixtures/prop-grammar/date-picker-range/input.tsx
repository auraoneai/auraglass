// @ts-nocheck — frozen 4.x consumer usage, codemod input (do not "fix").
import { GlassDatePicker } from 'aura-glass';

export function Stay({ value, set }: any) {
  return <GlassDatePicker mode="range" value={value} onChange={set} />;
}
