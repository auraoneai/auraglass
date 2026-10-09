/* CMP-001 seam: the only place outside this directory that may touch the Base
   UI Toggle pin. src/data/chip composes this wrapper; Base UI imports are
   confined to src/components/** and src/foundation/** (REQ-CMP-01). */
import { Toggle } from '@base-ui/react/toggle';

export type ChipToggleProps = Parameters<typeof Toggle>[0];

export function ChipToggle(props: ChipToggleProps) {
  return <Toggle {...props} />;
}
