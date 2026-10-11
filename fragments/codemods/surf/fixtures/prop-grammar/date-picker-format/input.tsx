// @ts-nocheck — frozen 4.x consumer usage, codemod input (do not "fix").
import { GlassDatePicker } from 'aura-glass';

export function Due({ value, set }) {
  return <GlassDatePicker value={value} onChange={set} format="dd/MM/yyyy" />;
}
