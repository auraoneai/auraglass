/* REQ-MAT-23 (D-07): the component size class is internal. It is absent from
   SurfaceProps and MaterialRole, reachable only through the internal
   componentMaterialProps(role, sizeClass) channel. */
import type { SurfaceProps, MaterialRole, SizeClass } from '../../../src/material/types';
import { materialProps } from '../../../src/material/materialProps';
import { componentMaterialProps } from '../../../src/material/internal';

type Equals<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? true : false;

// sizeClass is not a key of SurfaceProps or MaterialRole
const _surfaceHasNoSizeClass: Equals<'sizeClass' extends keyof SurfaceProps ? true : false, false> = true;
const _roleHasNoSizeClass: Equals<'sizeClass' extends keyof MaterialRole ? true : false, false> = true;
void _surfaceHasNoSizeClass;
void _roleHasNoSizeClass;

// @ts-expect-error — sizeClass is not a public Surface prop
const _surface: SurfaceProps = { sizeClass: 'control' };
void _surface;

// @ts-expect-error — sizeClass is not part of the public MaterialRole
materialProps({ layer: 'chrome', sizeClass: 'control' });

// @ts-expect-error — the public materialProps takes no size-class argument
materialProps({ layer: 'chrome' }, 'control');

// the internal channel takes the size class positionally and only the 4 classes
const sizes: readonly SizeClass[] = ['control', 'bar', 'panel', 'sheet'];
for (const s of sizes) componentMaterialProps({ layer: 'chrome' }, s);
// @ts-expect-error — 'tile' is not a size class
componentMaterialProps({ layer: 'chrome' }, 'tile');
