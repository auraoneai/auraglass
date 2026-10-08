// @ts-nocheck — codemod fixture: intentionally unbound identifiers/imports
import { SegmentedControl } from 'aura-glass';

export function X() {
  return <SegmentedControl.Root aria-label="Options" value={v}>{opts.map(renderOpt)}</SegmentedControl.Root>;
}
