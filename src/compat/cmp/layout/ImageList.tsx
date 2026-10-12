/* CMP-127 compat: ImageList (4.x) -> ImageList (5.0).
   warnDeprecated fires at call time, once per page load per symbol; never throws.
   The 5.0 props (cols, minItemWidth, gap, variant, items) pass straight through. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { ImageList as AgImageList } from '../../../components/image-list';

const DEP = 'DEP-C0259';

export function ImageList(props: React.ComponentProps<typeof AgImageList>) {
  warnDeprecated(DEP);
  return <AgImageList {...props} />;
}
