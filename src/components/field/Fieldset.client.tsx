'use client';

import * as React from 'react';
import { Fieldset as Base } from '@base-ui/react/fieldset';
import type { FieldsetRootProps } from './Field.types';

function FieldsetRoot({ legend, className, children, ref, ...rest }: FieldsetRootProps) {
  return (
    <Base.Root data-ag-part="root" className={className} ref={ref} {...rest}>
      {legend !== undefined && <Base.Legend data-ag-part="legend">{legend}</Base.Legend>}
      {children}
    </Base.Root>
  );
}

/* S-27/CMP-227: Fieldset is a flat callable (renders the root); `.Root` is the
   compound-style alias for the same element. */
export const Fieldset = Object.assign(FieldsetRoot, { Root: FieldsetRoot });
