/* CMP-037 icon types: 5.0 names — no Glass* aliases (those leave root via
   PRD-18 compat). ref is a normal prop (React 19); components are pure,
   server-safe functions created by createIcon. */
import type * as React from 'react';

export type IconNode = readonly [
  tag: keyof React.JSX.IntrinsicElements,
  attrs: Record<string, string | number | boolean | undefined>,
];

// SVG's elevation belongs to light-source primitives; the Icon root follows
// the component grammar and does not expose a material elevation escape hatch.
export interface IconProps extends Omit<React.SVGProps<SVGSVGElement>, 'elevation'> {
  size?: string | number;
  absoluteStrokeWidth?: boolean;
  title?: string;
  ref?: React.Ref<SVGSVGElement>;
}

export type IconComponent = (props: IconProps) => React.ReactElement;

export interface IconComponentProps extends IconProps {
  name: keyof typeof import('./components').iconRegistry | (string & {});
}
