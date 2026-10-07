/* src/compat/mat/material/LiquidGlassMaterial.tsx — MAT-355 (REQ-MAT-24).
   4.x liquid-glass primitives -> Surface/SurfaceGroup/ScrollEdge/ConcentricFrame.
   variant kept (regular|clear); thickness (0-8 px) -> thin/regular/thick;
   adaptToContent/ior/material/enableTilt and the remaining optical props drop
   with one warnDeprecated(id) (REL-072). */
import * as React from 'react';
import { ConcentricFrame, ScrollEdge, Surface, SurfaceGroup } from '../../../material/index';
import type { MaterialVariant, SurfaceGroupProps, Thickness } from '../../../contracts/material';
import type { RadiusToken, SpaceToken } from '../../../contracts/tokens';
import {
  dropNoopProps,
  elevationToThickness,
  pxToSpaceToken,
  thicknessNumberToThickness,
} from './shared';

export interface LiquidGlassMaterialCompatProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  material?: 'standard' | 'liquid';
  variant?: 'regular' | 'clear';
  intent?: 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
  elevation?: 'level1' | 'level2' | 'level3' | 'level4' | 'level5' | number;
  thickness?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  interactive?: boolean;
  ref?: React.Ref<HTMLElement>;
  children?: React.ReactNode;
  [key: string]: unknown;
}

const SIZES: Record<string, Thickness> = { sm: 'thin', md: 'regular', lg: 'regular', xl: 'thick' };

/** 4.x `LiquidGlassMaterial` — IOR/refraction primitive -> Surface. */
export function LiquidGlassMaterial(props: LiquidGlassMaterialCompatProps): React.ReactElement {
  const { intent, elevation, thickness, size, variant, interactive, ref, ...rest } = props;
  const domProps = dropNoopProps(
    'compat.mat.LiquidGlassMaterial',
    rest as Record<string, unknown>,
    [...(intent !== undefined && intent !== 'primary' ? ['intent'] : []),
     ...(variant !== undefined && variant !== 'regular' && variant !== 'clear' ? ['variant'] : [])],
  );
  const mapped: Thickness | undefined =
    thicknessNumberToThickness(thickness) ??
    (size !== undefined ? SIZES[size] : undefined) ??
    elevationToThickness(elevation);
  const mappedVariant: MaterialVariant | undefined = variant === 'regular' || variant === 'clear' ? variant : undefined;
  return (
    <Surface
      {...(domProps as Record<string, unknown>)}
      {...(mapped !== undefined ? { thickness: mapped } : {})}
      {...(mappedVariant !== undefined ? { variant: mappedVariant } : {})}
      {...(interactive === true ? { interactive: true } : {})}
      {...(intent === 'primary' ? { prominent: true } : {})}
      {...(ref !== undefined ? { ref } : {})}
    />
  );
}

export interface LiquidGlassEffectGroupCompatProps extends React.HTMLAttributes<HTMLDivElement> {
  spacing?: number | string;
  morph?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
  [key: string]: unknown;
}

/** 4.x `LiquidGlassEffectGroup` (backdrop-shared group) -> SurfaceGroup. */
export function LiquidGlassEffectGroup(props: LiquidGlassEffectGroupCompatProps): React.ReactElement {
  const { spacing, ...rest } = props;
  const domProps = dropNoopProps('compat.mat.LiquidGlassEffectGroup', rest as Record<string, unknown>);
  const gp: SurfaceGroupProps = { children: domProps.children as React.ReactNode };
  const mappedSpacing = pxToSpaceToken(spacing);
  if (mappedSpacing !== undefined) gp.spacing = mappedSpacing;
  if (typeof domProps.className === 'string') gp.className = domProps.className;
  return <SurfaceGroup {...gp} />;
}

/** 4.x `LiquidGlassLayerProvider` — layer context is gone in 5.0; renders a fragment. */
export function LiquidGlassLayerProvider({ children, ...rest }: { children?: React.ReactNode; [key: string]: unknown }): React.ReactElement {
  dropNoopProps('compat.mat.LiquidGlassLayerProvider', rest as Record<string, unknown>);
  return <>{children}</>;
}

export interface LiquidGlassScrollEdgeCompatProps extends React.HTMLAttributes<HTMLDivElement> {
  edge?: 'top' | 'bottom' | 'left' | 'right';
  styleMode?: 'soft' | 'hard';
  children?: React.ReactNode;
  [key: string]: unknown;
}

/** 4.x `LiquidGlassScrollEdge` -> ScrollEdge. The 4.x `edgeStyle` prop (a CSS
 *  object for the edge visual) collides with the 5.0 `edgeStyle` ('soft'|'hard')
 *  name — it drops with the warning; `styleMode` carries the 5.0 meaning. */
export function LiquidGlassScrollEdge(props: LiquidGlassScrollEdgeCompatProps): React.ReactElement {
  const { edge, styleMode, ...rest } = props;
  const domProps = dropNoopProps(
    'compat.mat.LiquidGlassScrollEdge',
    rest as Record<string, unknown>,
    ['children', ...(edge !== undefined && edge !== 'top' && edge !== 'bottom' ? ['edge'] : [])],
  );
  void domProps;
  return (
    <ScrollEdge
      edge={edge === 'top' || edge === 'bottom' ? edge : 'top'}
      {...(styleMode !== undefined ? { edgeStyle: styleMode } : {})}
    />
  );
}

export interface LiquidGlassConcentricFrameCompatProps extends React.HTMLAttributes<HTMLDivElement> {
  radius?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full' | number;
  inset?: number;
  shape?: 'concentric' | 'capsule' | 'fixed';
  fallbackRadius?: number;
  children?: React.ReactNode;
  [key: string]: unknown;
}

const RADIUS_TOKENS = new Set<RadiusToken>(['xs', 'sm', 'md', 'lg', 'xl', 'full']);

/** 4.x `LiquidGlassConcentricFrame` -> ConcentricFrame. */
export function LiquidGlassConcentricFrame(props: LiquidGlassConcentricFrameCompatProps): React.ReactElement {
  const { radius, inset, children, ...rest } = props;
  const domProps = dropNoopProps(
    'compat.mat.LiquidGlassConcentricFrame',
    rest as Record<string, unknown>,
    [
      ...(typeof radius === 'number' || (radius !== undefined && !RADIUS_TOKENS.has(radius as RadiusToken)) ? ['radius'] : []),
    ],
  );
  const mappedRadius: RadiusToken = RADIUS_TOKENS.has(radius as RadiusToken) ? (radius as RadiusToken) : 'md';
  const mappedInset: SpaceToken = pxToSpaceToken(inset) ?? '2';
  void domProps;
  return (
    <ConcentricFrame radius={mappedRadius} inset={mappedInset}>
      {children}
    </ConcentricFrame>
  );
}
