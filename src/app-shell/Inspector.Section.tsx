'use client';
/* Inspector.Section (SURF-056): CMP Collapsible seam with a title trigger
   carrying aria-expanded; panel hidden when closed. */

import * as React from 'react';
import { Collapsible } from '../components/collapsible';
import type { FC, ReactNode } from 'react';

/* CMP seed compounds are typed Record<part, FC>; bind parts locally. */
const CollapsibleRoot = Collapsible.Root as FC<{ defaultOpen?: boolean; children?: ReactNode }>;
const CollapsibleTrigger = Collapsible.Trigger as FC<Record<string, unknown> & { children?: ReactNode }>;
const CollapsibleContent = Collapsible.Content as FC<Record<string, unknown> & { children?: ReactNode }>;
import type { PartProps } from '../contracts/components';

export type InspectorSectionProps = PartProps<'div'> & {
  title: React.ReactNode;
  defaultOpen?: boolean | undefined;
};

export function InspectorSection({ title, defaultOpen = true, children, ...rest }: InspectorSectionProps) {
  const id = React.useId();
  return (
    <CollapsibleRoot defaultOpen={defaultOpen}>
      <div data-ag-part="inspector-section" {...(rest as Record<string, unknown>)}>
        <CollapsibleTrigger aria-expanded={defaultOpen} aria-controls={`${id}-panel`} className="ag-inspector__section-trigger">
          {title}
        </CollapsibleTrigger>
        <CollapsibleContent id={`${id}-panel`} {...(defaultOpen ? {} : { hidden: true })}>
          {children}
        </CollapsibleContent>
      </div>
    </CollapsibleRoot>
  );
}
