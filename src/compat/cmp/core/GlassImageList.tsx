/* CMP-131 compat: GlassImageList (4.x) -> ImageList (5.0).
   warnDeprecated once per symbol per page load; props pass through unmolested. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { ImageList } from '../../../components/image-list';
import { __compatWrap as wrap } from './_shared';

// No CMP DEP id yet: the row lands via #313 (4.x) + REQ-FIN-13 sync; re-point then.
const DEP = 'GlassImageList';

export function GlassImageList(props: React.ComponentProps<typeof ImageList>) {
  warnDeprecated(DEP);
  return wrap('GlassImageList', <ImageList {...props} />);
}
