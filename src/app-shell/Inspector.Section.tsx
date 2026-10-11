'use client';
/* Inspector.Section (SURF-037/056): CMP Collapsible seam with a title
   trigger. Base UI Collapsible owns aria-expanded/hidden/aria-controls on
   the trigger and panel — no manual attributes. */

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
  return (
    <CollapsibleRoot defaultOpen={defaultOpen}>
      <div data-ag-part="inspector-section" {...(rest as Record<string, unknown>)}>
        <CollapsibleTrigger className="ag-inspector__section-trigger">
          {title}
        </CollapsibleTrigger>
        <CollapsibleContent>
          {children}
        </CollapsibleContent>
      </div>
    </CollapsibleRoot>
  );
}
