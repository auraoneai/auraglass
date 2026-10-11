/* CMP-323 compat: GlassLinkButton (4.x) -> Button render={<a/>} (5.0).
   warnDeprecated fires at call time, once per page load per symbol; unmappable
   props drop with a single warning; never throws. Mapping per the target meta. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Button } from '../../../components/button';
import type { GlassButtonProps } from './GlassButton';

const DEP = 'DEP-C0005';
const drop = (p: string) => warnDeprecated(`${DEP}.prop.${p}`);

export interface GlassLinkButtonProps extends Omit<GlassButtonProps, 'asChild'> {
  href?: string;
  target?: string;
  rel?: string;
}

export function GlassLinkButton({ href, target, rel, ...rest }: GlassLinkButtonProps) {
  warnDeprecated(DEP);
  const resolvedRel = target === '_blank' ? (rel ?? 'noopener noreferrer') : rel;
  return (
    <Button
      {...(rest as object)}
      render={
        <a
          {...(href !== undefined ? { href } : {})}
          {...(target !== undefined ? { target } : {})}
          {...(resolvedRel !== undefined ? { rel: resolvedRel } : {})}
        />
      }
    />
  );
}
