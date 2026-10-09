/* CMP-131 compat: GlassText (4.x) -> Text (5.0).
   warnDeprecated once per symbol per page load; props pass through unmolested. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Text } from '../../../components/text';
import { __compatWrap as wrap } from './_shared';

const DEP = 'DEP-C0288';

export function GlassText(props: React.ComponentProps<typeof Text>) {
  warnDeprecated(DEP);
  return wrap('GlassText', <Text {...props} />);
}
