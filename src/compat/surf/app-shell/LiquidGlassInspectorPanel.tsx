/* LiquidGlassInspectorPanel — 4.x compat adapter (REQ-SURF-13 / REQ-SURF-37,
   DEP-S0033) → Inspector. open={false} renders nothing (as 4.x did);
   title → Inspector.Header + the required aria-label, selectionLabel → a
   lead line in Inspector.Content, sections → Inspector.Section (Base UI
   Collapsible, open by default). placement maps to the inspector mode:
   'bottom' → sheet, otherwise docked. onOpenChange(false) fires from the
   Header close control's click. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Inspector } from '../../../app-shell/Inspector';
import { domProps } from '../_shared';

export interface LiquidGlassInspectorSection {
  id?: string;
  title: string;
  content: React.ReactNode;
}

export interface LiquidGlassInspectorPanelProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  selectionLabel?: string;
  placement?: 'right' | 'left' | 'bottom';
  sections?: LiquidGlassInspectorSection[];
  children?: React.ReactNode;
  [legacy: string]: unknown;
}

/**
 * 4.x `LiquidGlassInspectorPanel` compat adapter (DEP-S0033).
 * @deprecated since 4.3.0, removed in 5.0.0. Use {@link Inspector from aura-glass/app-shell}.
 */
export function LiquidGlassInspectorPanel(props: LiquidGlassInspectorPanelProps) {
  warnDeprecated('DEP-S0033');
  const {
    open = true, onOpenChange, title = 'Inspector', selectionLabel, placement, sections = [], children, ...rest
  } = props;
  if (!open) return null;
  return (
    <Inspector.Root
      {...domProps(rest)}
      aria-label={title}
      mode={placement === 'bottom' ? 'sheet' : 'docked'}
      onClick={(e: React.MouseEvent<HTMLElement>) => {
        if (onOpenChange && (e.target as HTMLElement).closest('[data-ag-part="inspector-header"] button')) {
          onOpenChange(false);
        }
      }}
    >
      <Inspector.Header title={title} />
      <Inspector.Content>
        {selectionLabel !== undefined ? <p>{selectionLabel}</p> : null}
        {sections.map((s, i) => (
          <Inspector.Section key={s.id ?? `${s.title}-${i}`} title={s.title}>
            {s.content}
          </Inspector.Section>
        ))}
        {children}
      </Inspector.Content>
    </Inspector.Root>
  );
}
