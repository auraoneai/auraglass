/* CMP-426 compat: ImageListItemBar (4.x) -> ImageList.ItemBar (5.0). */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { ImageList as AgImageList } from '../../../components/image-list';
import { __compatWrap as wrap } from './_shared';

const DEP = 'DEP-C0261';

export function ImageListItemBar(props: React.ComponentProps<typeof AgImageList.ItemBar>) {
  warnDeprecated(DEP);
  return wrap('ImageListItemBar', <AgImageList.ItemBar {...props} />);
}
