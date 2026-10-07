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

export const Fieldset = { Root: FieldsetRoot };
