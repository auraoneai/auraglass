/* CMP-131 compat: GlassInlineEdit (4.x) -> InlineEdit (5.0).
   warnDeprecated once per symbol per page load; props pass through unmolested. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { InlineEdit } from '../../../components/inline-edit';
import { __compatWrap as wrap } from './_shared';

const DEP = 'DEP-C0268';

export function GlassInlineEdit(props: React.ComponentProps<typeof InlineEdit>) {
  warnDeprecated(DEP);
  return wrap('GlassInlineEdit', <InlineEdit {...props} />);
}
