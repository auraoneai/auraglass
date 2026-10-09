/* CMP-131 compat: GlassFileUpload (4.x) -> FileUpload (5.0).
   warnDeprecated once per symbol per page load; props pass through unmolested. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { FileUpload } from '../../../components/file-upload';
import { __compatWrap as wrap } from './_shared';

const DEP = 'DEP-C0263';

export function GlassFileUpload(props: React.ComponentProps<typeof FileUpload>) {
  warnDeprecated(DEP);
  return wrap('GlassFileUpload', <FileUpload {...props} />);
}
