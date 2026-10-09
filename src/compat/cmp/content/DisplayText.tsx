/* CMP-111 compat: DisplayText (4.x) -> Heading size="display" (5.0).
   warnDeprecated fires at call time, once per page load per symbol. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Heading } from '../../../components/heading/Heading';
import type { HeadingProps } from '../../../components/heading/Heading';

const DEP = 'DEP-C0223';

export interface DisplayTextProps extends Omit<HeadingProps, 'size' | 'level'> {
  /** 4.x DisplayText rendered h1 by default; override if needed. */
  level?: HeadingProps['level'];
}

export function DisplayText({ level = 1, ...rest }: DisplayTextProps) {
  warnDeprecated(DEP);
  return <Heading level={level} size="display" {...rest} />;
}
