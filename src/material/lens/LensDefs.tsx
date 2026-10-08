/* MAT-183 — server-safe SVG filter defs for enhanced-tier edge refraction.
   REQ-MAT-58 filter structure: feImage(map) -> feDisplacementMap(in=SourceGraphic)
   with a STATIC scale per id (SC-37/E-10; never written at runtime).
   blur()+saturate() stay in the CSS backdrop-filter list after url(#...).
   Not exported from aura-glass/material — the A11Y provider mounts one per
   document (A11Y-029) unless the tier is standard|lightweight. */
import * as React from 'react';
import type { LensId, Shape, SizeClass } from '../types';
import { DEFAULT_MATERIAL_SPEC } from '../defineMaterial';
import { LENS_MAP_DATA } from './lens-map-data';

const SHAPES: readonly Shape[] = ['fixed', 'capsule', 'concentric'];
const SIZECLASSES: readonly Exclude<SizeClass, 'sheet'>[] = ['control', 'bar', 'panel'];

/** sizeClass -> the spec refraction.scale row (control=thin, bar=regular, panel=thick) */
const SCALE: Record<Exclude<SizeClass, 'sheet'>, number> = {
  control: DEFAULT_MATERIAL_SPEC.refraction.scale.thin,
  bar: DEFAULT_MATERIAL_SPEC.refraction.scale.regular,
  panel: DEFAULT_MATERIAL_SPEC.refraction.scale.thick,
};

/* data: URIs generated from the committed assets/lens PNGs — a relative
   href would resolve against the consuming document's base URL, not the
   package (the package ships dist/ only). */
const mapHref = (id: LensId) => LENS_MAP_DATA[id];

export const LENS_IDS: readonly LensId[] = SHAPES.flatMap((shape) =>
  SIZECLASSES.map((sc) => `ag-lens-${shape}-${sc}` as LensId));

export function LensDefs() {
  return (
    <svg
      data-ag-lens-defs=""
      data-ag-lens-ready=""
      aria-hidden="true"
      focusable="false"
      width="0"
      height="0"
    >
      <defs>
        {LENS_IDS.map((id) => {
          const sc = id.split('-')[3] as Exclude<SizeClass, 'sheet'>;
          return (
            <filter id={id} key={id} colorInterpolationFilters="sRGB">
              <feImage href={mapHref(id)} result="map" />
              <feDisplacementMap
                in="SourceGraphic"
                in2="map"
                scale={SCALE[sc]}
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
          );
        })}
      </defs>
    </svg>
  );
}
