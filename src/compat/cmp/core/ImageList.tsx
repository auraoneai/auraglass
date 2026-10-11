/* CMP-426 compat: ImageList (4.x) -> ImageList (5.0). */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { ImageList as AgImageList } from '../../../components/image-list';
import { __compatWrap as wrap } from './_shared';

const DEP = 'DEP-C0259';

export function ImageList(props: React.ComponentProps<typeof AgImageList>) {
  warnDeprecated(DEP);
  return wrap('ImageList', <AgImageList {...props} />);
}
