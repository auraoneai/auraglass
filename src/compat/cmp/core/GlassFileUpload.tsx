/* REQ-CMP-131 compat: GlassFileUpload (4.x) -> FileUpload (5.0).
   warnDeprecated('DEP-C0255') fires at call time, once per page load, dev only.
   The 5.0 meta lists no prop changes for this name, so props pass through. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { FileUpload } from '../../../components/file-upload';
import { __compatWrap as wrap } from '../overlays/_shared';

const DEP = 'DEP-C0255';

export function GlassFileUpload(props: React.ComponentProps<typeof FileUpload>) {
  warnDeprecated(DEP);
  return wrap('GlassFileUpload', <FileUpload {...props} />);
}
