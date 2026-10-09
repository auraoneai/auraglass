/* CMP-426 compat: ImageListItem (4.x) -> ImageList.Item (5.0). */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { ImageList as AgImageList } from '../../../components/image-list';
import { __compatWrap as wrap } from './_shared';

const DEP = 'DEP-C0232';

export function ImageListItem(props: React.ComponentProps<typeof AgImageList.Item>) {
  warnDeprecated(DEP);
  return wrap('ImageListItem', <AgImageList.Item {...props} />);
}
