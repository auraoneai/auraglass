/* CMP-131 compat: GlassKeyValueEditor (4.x) -> KeyValueEditor (5.0).
   warnDeprecated once per symbol per page load; props pass through unmolested. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { KeyValueEditor } from '../../../components/key-value-editor';
import { __compatWrap as wrap } from './_shared';

const DEP = 'DEP-C0269';

export function GlassKeyValueEditor(props: React.ComponentProps<typeof KeyValueEditor>) {
  warnDeprecated(DEP);
  return wrap('GlassKeyValueEditor', <KeyValueEditor {...props} />);
}
