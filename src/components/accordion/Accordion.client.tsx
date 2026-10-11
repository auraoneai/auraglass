/* CMP-313: Accordion on BU Accordion (tab roles from the 4.x seed removed).
   Item, Header (<h3> default, headingLevel 2–6), Trigger (<button>), Content;
   value string[] with `multiple`; parts [root, item, header, trigger, content]. */
'use client';
import * as React from 'react';
import { Accordion as BaseAccordion } from '@base-ui/react/accordion';
import { cn } from '../../internal/index';

export interface AccordionRootProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[], eventDetails: BaseAccordion.Root.ChangeEventDetails) => void;
  /** Allow several open items (value stays an array either way). */
  multiple?: boolean;
}

function Root({ className, ref, ...rest }: AccordionRootProps & { ref?: React.Ref<HTMLDivElement> | undefined }) {
  return (
    <BaseAccordion.Root
      {...rest}
      ref={ref}
      data-ag-part="root"
      className={cn('ag-accordion', className)}
    />
  );
}

/* REQ-CMP-01: public part props are AuraGlass-owned (no Base UI types in the
   emitted d.ts); Base UI stays an implementation detail of this file. */
export interface AccordionItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'className'> {
  /** Identifies the item inside the Root `value` array. */
  value?: string;
  disabled?: boolean;
  onOpenChange?: (open: boolean, eventDetails: unknown) => void;
  className?: string;
  ref?: React.Ref<HTMLDivElement> | undefined;
}

function Item({ className, ref, ...rest }: AccordionItemProps) {
  return <BaseAccordion.Item {...rest} ref={ref} data-ag-part="item" className={cn('ag-accordion-item', className)} />;
}

export interface AccordionHeaderProps extends Omit<React.HTMLAttributes<HTMLHeadingElement>, 'className'> {
  className?: string;
  ref?: React.Ref<HTMLHeadingElement> | undefined;
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

export interface AccordionTriggerProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  className?: string;
  ref?: React.Ref<HTMLButtonElement> | undefined;
}

function Trigger({ className, children, ref, ...rest }: AccordionTriggerProps) {
  return (
    <BaseAccordion.Trigger {...rest} ref={ref} data-ag-part="trigger" className={cn('ag-accordion-trigger', className)}>
      <span data-ag-part="hit-area" aria-hidden="true" />
      {children}
    </BaseAccordion.Trigger>
  );
}

export interface AccordionContentProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'className'> {
  /** Keep the panel in the DOM while closed. */
  keepMounted?: boolean;
  /** Use `hidden="until-found"` so find-in-page can open the panel. */
  hiddenUntilFound?: boolean;
  className?: string;
  ref?: React.Ref<HTMLDivElement> | undefined;
}

function Content({ className, ref, ...rest }: AccordionContentProps) {
  return <BaseAccordion.Panel {...rest} ref={ref} data-ag-part="content" className={cn('ag-accordion-content', className)} />;
}

export const Accordion = { Root, Item, Header, Trigger, Content };
