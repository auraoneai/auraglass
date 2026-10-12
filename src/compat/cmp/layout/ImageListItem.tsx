/* CMP-127 compat: ImageListItem (4.x) -> ImageList.Item (5.0).
   warnDeprecated fires at call time, once per page load per symbol; never throws. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { ImageList as AgImageList } from '../../../components/image-list';

const DEP = 'DEP-C0260';

/** @deprecated since 4.3.0, removed in 6.0.0. Use {@link ImageList.Item}. */
export function ImageListItem(props: React.ComponentProps<typeof AgImageList.Item>) {
  warnDeprecated(DEP);
  return <AgImageList.Item {...props} />;
}
