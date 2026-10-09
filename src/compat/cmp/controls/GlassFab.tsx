/* CMP-323 compat: GlassFab (4.x) -> IconButton prominent (5.0).
   warnDeprecated fires at call time, once per page load per symbol; unmappable
   props drop with a single warning; never throws. Mapping per the target meta. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { IconButton } from '../../../components/icon-button';

const DEP = 'DEP-C0008';
const drop = (p: string) => warnDeprecated(`${DEP}.prop.${p}`);

export interface GlassFabProps {
  icon?: React.ReactNode;
  children?: React.ReactNode;
  label?: string;
  'aria-label'?: string;
  position?: string;
  offset?: number | string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  className?: string;
}

/** @deprecated GlassFab DEP-C0008 since 4.3.0, removed in 5.0.0. {@link IconButton} */
export function GlassFab({ icon, children, label, position, offset, ...rest }: GlassFabProps) {
  warnDeprecated(DEP);
  if (position !== undefined) drop('position');
  if (offset !== undefined) drop('offset');
  const ariaLabel = (rest as Record<string, unknown>)['aria-label'] as string | undefined;
  return (
    <IconButton
      prominent
      label={label ?? ariaLabel ?? 'Action'}
      icon={icon ?? children}
      {...rest}
    />
  );
}
