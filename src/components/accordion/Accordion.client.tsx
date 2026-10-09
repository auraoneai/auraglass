/* CMP-313: Accordion on BU Accordion (tab roles from the 4.x seed removed).
   Item, Header (<h3> default, headingLevel 2–6), Trigger (<button>), Content;
   value string[] with `multiple`; parts [root, item, header, trigger, content]. */
'use client';
import * as React from 'react';
import { Accordion as BaseAccordion } from '@base-ui/react/accordion';
import { cn } from '../../internal/index';
import { useControllableWarning } from '../../foundation/controllable';

export interface AccordionRootProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[], eventDetails: unknown) => void;
  /** Allow several open items (value stays an array either way). */
  multiple?: boolean;
}

function Root({ className, ref, ...rest }: AccordionRootProps & { ref?: React.Ref<HTMLDivElement> | undefined }) {
  useControllableWarning('Accordion', 'value', rest.value);
  return (
    <BaseAccordion.Root
      {...rest}
      ref={ref}
      data-ag-part="root"
      className={cn('ag-accordion', className)}
    />
  );
}

function Item({ className, ref, ...rest }: React.ComponentProps<typeof BaseAccordion.Item>) {
  return <BaseAccordion.Item {...rest} ref={ref} data-ag-part="item" className={cn('ag-accordion-item', className)} />;
}

export interface AccordionHeaderProps extends React.ComponentProps<typeof BaseAccordion.Header> {
  /** Heading level 2..6 (default 3). */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
}

function Header({ headingLevel = 3, className, ref, ...rest }: AccordionHeaderProps) {
  const Tag = `h${headingLevel}` as 'h3';
  return (
    <BaseAccordion.Header
      {...rest}
      ref={ref}
      render={<Tag />}
      data-ag-part="header"
      className={cn('ag-accordion-header', className)}
    />
  );
}

function Trigger({ className, ref, ...rest }: React.ComponentProps<typeof BaseAccordion.Trigger>) {
  return (
    <BaseAccordion.Trigger {...rest} ref={ref} data-ag-part="trigger" className={cn('ag-accordion-trigger', className)} />
  );
}

function Content({ className, ref, ...rest }: React.ComponentProps<typeof BaseAccordion.Panel>) {
  return <BaseAccordion.Panel {...rest} ref={ref} data-ag-part="content" className={cn('ag-accordion-content', className)} />;
}

export const Accordion = { Root, Item, Header, Trigger, Content };
