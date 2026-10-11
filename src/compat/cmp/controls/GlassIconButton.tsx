/* CMP-324 compat: GlassIconButton (4.x) -> IconButton (5.0).
   warnDeprecated fires at call time, once per page load per symbol; unmappable
   props drop with a single warning; never throws. Mapping per the target meta. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { IconButton } from '../../../components/icon-button';

const DEP = 'DEP-C0010';
const drop = (p: string) => warnDeprecated(`${DEP}.prop.${p}`);

export interface GlassIconButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'title' | 'color'> {
  icon?: React.ReactNode;
  'aria-label'?: string;
  title?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: string;
}

const SIZE_MAP = { xs: 'sm', xl: 'lg' } as const;

export function GlassIconButton({ icon, children, title, size, variant, ...rest }: GlassIconButtonProps) {
  warnDeprecated(DEP);
  const aria = (rest as Record<string, unknown>)['aria-label'] as string | undefined;
  const label = aria ?? title;
  if (label === undefined) warnDeprecated(`${DEP}.missing-label`);
  if (title !== undefined && aria !== undefined) drop('title');
  if (variant !== undefined && !(variant === 'ghost' || variant === 'tertiary' || variant === 'link' || variant === 'primary' || variant === 'secondary' || variant === 'default' || variant === 'outline')) {
    drop(`variant:${variant}`);
  }
  const mappedSize = size !== undefined ? ((SIZE_MAP as Record<string, 'sm' | 'md' | 'lg'>)[size] ?? size) : undefined;
  return (
    <IconButton
      label={label ?? 'Icon button'}
      icon={icon ?? children}
      {...(mappedSize !== undefined ? { size: mappedSize as 'sm' | 'md' | 'lg' } : {})}
      {...(rest as Omit<typeof rest, 'size'>)}
    />
  );
}
