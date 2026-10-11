/* CMP-131 compat: GlassButtonGroup (4.x) -> ButtonGroup (5.0).
   warnDeprecated once per symbol per page load; props pass through unmolested. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { ButtonGroup } from '../../../components/button-group';
import { __compatWrap as wrap } from './_shared';

// No CMP DEP id yet: the row lands via #313 (4.x) + REQ-FIN-13 sync; re-point then.
const DEP = 'GlassButtonGroup';

export function GlassButtonGroup(props: React.ComponentProps<typeof ButtonGroup>) {
  warnDeprecated(DEP);
  return wrap('GlassButtonGroup', <ButtonGroup {...props} />);
}
