// TODO(aura-glass 5): GlassDatePicker format: display format is locale-driven at 5.0, see docs/auraglass-5/migrate/5.md#b-6
// @ts-nocheck — frozen 4.x consumer usage, codemod input (do not "fix").
import { GlassDatePicker } from 'aura-glass';

export function Due({ value, set }) {
  return <GlassDatePicker value={value} onValueChange={set} />;
}
