/* CMP-127 compat: ImageListItemBar (4.x) -> ImageList.ItemBar (5.0).
   warnDeprecated fires at call time, once per page load per symbol; never throws. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { ImageList as AgImageList } from '../../../components/image-list';

const DEP = 'DEP-C0261';

export function ImageListItemBar(props: React.ComponentProps<typeof AgImageList.ItemBar>) {
  warnDeprecated(DEP);
  return <AgImageList.ItemBar {...props} />;
}
