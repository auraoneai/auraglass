/* CMP-313: Accordion on BU Accordion (tab roles from the 4.x seed removed).
   Item, Header (<h3> default, headingLevel 2–6), Trigger (<button>), Content;
   value string[] with `multiple`; parts [root, item, header, trigger, content]. */
'use client';
import { stateRender, toDataState } from '../../foundation/state';
import * as React from 'react';
import { useControllableWarning } from '../../foundation/controllable';
import { Accordion as BaseAccordion } from '@base-ui/react/accordion';
import { cn } from '../../internal/index';
import { toChangeDetails } from '../../foundation';
import type { ChangeDetails } from '../../contracts/components';

export interface AccordionRootProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Controlled value. Pair with `onValueChange`. */
  value?: string[];
  /** Initial value when uncontrolled. */
  defaultValue?: string[];
  /* REQ-CMP-01: AuraGlass ChangeDetails, never a Base UI type in the d.ts. */
  /** Called with the new value whenever it changes. */
  onValueChange?: (value: string[], details: ChangeDetails) => void;
  /** Allow several open items (value stays an array either way). */
  multiple?: boolean;
}

/* REQ-CMP-121: Arrow, Home and End move focus between this accordion's
   headers. Base UI's Accordion (1.8) only registers items in a CompositeList
   and handles no navigation keys, so the root owns the APG accordion
   keyboard: ArrowDown/ArrowUp (ArrowRight/ArrowLeft when
   data-orientation="horizontal", mirrored under RTL) move to the next/previous
   enabled trigger and wrap; Home/End move to the first/last. Triggers of a
   nested accordion belong to that accordion only. */
function onRootKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
  if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
  const root = e.currentTarget;
  const target = e.target as HTMLElement;
  if (target.getAttribute('data-ag-part') !== 'trigger' || target.closest('.ag-accordion') !== root) return;
  const horizontal = root.getAttribute('data-orientation') === 'horizontal';
  const rtl = horizontal && target.closest('[dir]')?.getAttribute('dir') === 'rtl';
  const nextKey = horizontal ? (rtl ? 'ArrowLeft' : 'ArrowRight') : 'ArrowDown';
  const prevKey = horizontal ? (rtl ? 'ArrowRight' : 'ArrowLeft') : 'ArrowUp';
  if (![nextKey, prevKey, 'Home', 'End'].includes(e.key)) return;
  const triggers = Array.from(root.querySelectorAll<HTMLElement>('[data-ag-part="trigger"]')).filter(
    (t) => t.closest('.ag-accordion') === root
      && !(t as HTMLButtonElement).disabled
      && t.getAttribute('aria-disabled') !== 'true',
  );
  if (triggers.length === 0) return;
  const at = triggers.indexOf(target);
  let next: number;
  if (e.key === 'Home') next = 0;
  else if (e.key === 'End') next = triggers.length - 1;
  else if (e.key === nextKey) next = at < 0 ? 0 : (at + 1) % triggers.length;
  else next = at < 0 ? triggers.length - 1 : (at - 1 + triggers.length) % triggers.length;
  e.preventDefault();
  triggers[next]!.focus();
}

function Root({ className, ref, onValueChange, onKeyDown, ...rest }: AccordionRootProps & {
  /** Ref to the rendered root element. */
  ref?: React.Ref<HTMLDivElement> | undefined }) {
  useControllableWarning('Accordion', 'value', rest.value);
  return (
    <BaseAccordion.Root
      {...rest}
      onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
        onKeyDown?.(e);
        onRootKeyDown(e);
      }}
      {...(onValueChange
        ? { onValueChange: (v: unknown[], eventDetails: unknown) => onValueChange(v as string[], toChangeDetails(eventDetails)) }
        : {})}
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
  return <BaseAccordion.Item render={stateRender<{ open: boolean }>((s) => toDataState({ expanded: s.open }), undefined, 'div')} {...rest} ref={ref} data-ag-part="item" className={cn('ag-accordion-item', className)} />;
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
    <BaseAccordion.Trigger render={stateRender<{ open: boolean }>((s) => toDataState({ expanded: s.open }), undefined, 'button')} {...rest} ref={ref} data-ag-part="trigger" className={cn('ag-accordion-trigger', className)}>
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
  return <BaseAccordion.Panel render={stateRender<{ open: boolean }>((s) => toDataState({ expanded: s.open }), undefined, 'div')} {...rest} ref={ref} data-ag-part="content" className={cn('ag-accordion-content', className)} />;
}

export const Accordion = { Root, Item, Header, Trigger, Content };
