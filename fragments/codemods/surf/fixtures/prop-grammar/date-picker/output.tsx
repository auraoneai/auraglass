// @ts-nocheck — frozen 4.x consumer usage, codemod input (do not "fix").
import { GlassDatePicker } from 'aura-glass';

export function Due({ value, set, err }) {
  return <GlassDatePicker value={value} onValueChange={set} isDisabled isRequired isInvalid={err} description="Pick a day" />;
}
