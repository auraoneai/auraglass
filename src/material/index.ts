/* ./material barrel — no directive (MAT-142). Exports exactly the 7 frozen
   contract values plus the types. defineMaterial stays build-only (OI-MAT-05);
   dev/ internals are reachable by path import only. */
export { materialProps } from './materialProps';
export { Surface } from './Surface';
export { SurfaceGroup } from './SurfaceGroup';
export { Environment } from './Environment';
export { ScrollEdge } from './ScrollEdge';
export { ConcentricFrame } from './ConcentricFrame';
export { useMaterialTier } from './useMaterialTier';
export type {
  MaterialVariant, Thickness, Layer, LayerAttr, ContentMaterial, Backdrop, Tier,
  DomTier, Engine, Transparency, Shape, EdgeStyle, MaterialRole, MaterialAttributes,
  SurfaceProps, SurfaceGroupProps, EnvironmentProps, ScrollEdgeProps,
  ConcentricFrameProps, MaterialSpec, MaterialStateSpec, SizeClass, DeletedGlassProp,
} from './types';
