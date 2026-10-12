/* Floating lightbox controls: clear chrome capsules over the image. The popup is
   an identity overlay surface, so they opt into their own optics (allowNested)
   instead of falling back to the nested inner fill. */
import { materialProps } from '../../../material';

export const VIEWER_CONTROL_MATERIAL = /*#__PURE__*/ materialProps({
  layer: 'chrome', variant: 'clear', thickness: 'thin', shape: 'capsule', allowNested: true,
});
