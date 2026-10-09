/* CMP-325 compat: LiquidGlassControlGroup (4.x) -> ButtonGroup (5.0).
   warnDeprecated fires at call time, once per page load per symbol; unmappable
   props drop with a single warning; never throws. Mapping per the target meta. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { ButtonGroup } from '../../../components/button-group';

const DEP = 'DEP-C0011';
const drop = (p: string) => warnDeprecated(`${DEP}.prop.${p}`);

export interface LiquidGlassControlGroupProps {
  orientation?: 'horizontal' | 'vertical';
  'aria-label'?: string;
  attached?: boolean;
  spacing?: number | string;
  children?: React.ReactNode;
  className?: string;
}

/** @deprecated LiquidGlassControlGroup DEP-C0011 since 4.3.0, removed in 5.0.0. {@link ButtonGroup} */
export function LiquidGlassControlGroup({ spacing, ...rest }: LiquidGlassControlGroupProps) {
  warnDeprecated(DEP);
  if (spacing !== undefined) drop('spacing');
  return <ButtonGroup aria-label={(rest as Record<string, unknown>)['aria-label'] as string ?? 'Control group'} {...rest} />;
}
