/* CMP-131 compat: GlassCommandPalette (4.x) -> CommandPalette (5.0).
   warnDeprecated once per symbol per page load; props pass through unmolested. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { CommandPalette } from '../../../components/command-palette/CommandPalette';
import { __compatWrap as wrap } from './_shared';

const DEP = 'DEP-C0255';

export function GlassCommandPalette(props: React.ComponentProps<typeof CommandPalette>) {
  warnDeprecated(DEP);
  return wrap('GlassCommandPalette', <CommandPalette {...props} />);
}
