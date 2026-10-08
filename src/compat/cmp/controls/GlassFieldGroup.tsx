/* CMP-328 compat: GlassFieldGroup (4.x) -> Fieldset (5.0).
   warnDeprecated fires at call time, once per page load per symbol; unmappable
   props drop with a single warning; never throws. Mapping per the target meta. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Fieldset } from '../../../components/field';

const DEP = 'DEP-C0028';

export interface GlassFieldGroupProps {
  legend?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export function GlassFieldGroup({ legend, title, description, children, ...rest }: GlassFieldGroupProps) {
  warnDeprecated(DEP);
  return (
    <Fieldset.Root {...rest} {...(legend !== undefined || title !== undefined ? { legend: legend ?? title } : {})}>
      {description}
      {children}
    </Fieldset.Root>
  );
}
