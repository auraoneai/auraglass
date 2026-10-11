/* REQ-SURF-150 — CarouselRail materials through the MAT material API
 * (materialProps → data-ag-* only; no optics in SURF code). Slides are opaque
 * content (content-raised: never a backdrop filter); Prev/Next/Indicators are
 * thin chrome — clear over media, regular otherwise. The autoplay toggle and
 * the individual indicator dots carry no material, so a rail renders at most
 * 3 blurred surfaces at a fine pointer and 1 (Indicators) at a coarse pointer,
 * where Prev/Next are not rendered (blur budget, REQ-SURF-191). */
import { materialProps, type MaterialAttributes } from '../../material';

export type CarouselMaterial = Omit<MaterialAttributes, 'className'> & { className: 'ag-surface' };

const withClass = (attrs: MaterialAttributes): CarouselMaterial => ({ ...attrs, className: 'ag-surface' });

export const slideMaterial = (): CarouselMaterial =>
  withClass(materialProps({ layer: 'content', content: 'content-raised' }));

export const navMaterial = (overMedia: boolean): CarouselMaterial =>
  withClass(materialProps({ layer: 'chrome', thickness: 'thin', variant: overMedia ? 'clear' : 'regular' }));
