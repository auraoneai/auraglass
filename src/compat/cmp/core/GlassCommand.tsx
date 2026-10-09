/* CMP-131 compat: GlassCommand (4.x) -> Command.Root (5.0).
   warnDeprecated once per symbol per page load; props pass through unmolested. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Command } from '../../../components/command-palette/Command';
import { __compatWrap as wrap } from './_shared';

const DEP = 'DEP-C0254';

export function GlassCommand(props: React.ComponentProps<typeof Command.Root>) {
  warnDeprecated(DEP);
  return wrap('GlassCommand', <Command.Root {...props} />);
}
