/* CMP-112 compat: Box (4.x src/components/layout/Box.tsx) -> Stack (5.0).
   warnDeprecated fires at call time, once per page load per symbol;
   unmappable props drop with a single warning; never throws.
   4.x Box was a plain element with HTML attributes plus `as`; 5.0 absorbs it
   into Stack (column, no gap). Every HTML attribute passes through.
   Dropped: `as` other than "div" (Stack always renders a div; wrap it in the
   element you need), respectMotionPreference. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Stack } from '../../../components/stack/Stack';

const DEP = 'DEP-C0269';
const drop = (p: string) => warnDeprecated(`${DEP}.prop.${p}`);

export interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: keyof React.JSX.IntrinsicElements;
  respectMotionPreference?: boolean;
}

/** @deprecated since 4.3.0, removed in 6.0.0. Use {@link Stack}. */
export function Box({
  as,
  respectMotionPreference,
  ...rest
}: BoxProps & { ref?: React.Ref<HTMLDivElement> | undefined }) {
  warnDeprecated(DEP);
  if (as !== undefined && as !== 'div') drop('as');
  if (respectMotionPreference !== undefined) drop('respectMotionPreference');
  return <Stack {...rest} />;
}
