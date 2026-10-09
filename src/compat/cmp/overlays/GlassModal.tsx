/* CMP-337 compat: GlassModal (4.x) -> Dialog | AlertDialog | Sheet (5.0).
   warnDeprecated fires at call time, once per page load per symbol; unmappable
   props drop with a single warning; never throws. Mapping per §10.2/metas. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Dialog } from '../../../components/dialog';
import { AlertDialog } from '../../../components/alert-dialog';
import { Sheet } from '../../../components/sheet';
import type { OverlayOpenChangeDetails } from '../../../components/overlays/_shared';
import { __compatWrap as wrap } from './_shared';

const DEP = 'DEP-C0101';
const drop = (p: string) => warnDeprecated(`${DEP}.prop.${p}`);

export interface GlassModalAction { label: string; onClick?: (e: unknown) => void; }

export interface GlassModalProps {
  open?: boolean;
  onClose?: () => void;
  onOpenChange?: (open: boolean) => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  footer?: React.ReactNode;
  role?: string;
  size?: 'small' | 'medium' | 'large' | 'fullscreen' | 'sm' | 'md' | 'lg' | 'full';
  variant?: string;
  closeOnBackdropClick?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  isContained?: boolean;
  backdropBlur?: unknown;
  material?: unknown;
  materialProps?: unknown;
  consciousness?: unknown;
  predictive?: unknown;
  adaptive?: unknown;
  eyeTracking?: unknown;
  trackAchievements?: unknown;
  animation?: unknown;
  compact?: unknown;
  children?: React.ReactNode;
  trigger?: React.ReactNode;
  className?: string;
}

const SIZE_MAP = { small: 'sm', medium: 'md', large: 'lg', fullscreen: 'full' } as const;

export function useGlassModalMapping(props: GlassModalProps, dep = DEP) {
  const {
    open, onClose, onOpenChange, title, description, footer, role, size, variant,
    closeOnBackdropClick, closeOnOverlayClick, closeOnEscape, isContained,
    backdropBlur, material, materialProps, consciousness, predictive, adaptive,
    eyeTracking, trackAchievements, animation, compact, children, trigger, className, ...rest
  } = props;
  for (const [p, v] of Object.entries({ backdropBlur, material, materialProps, consciousness,
    predictive, adaptive, eyeTracking, trackAchievements, animation, compact, isContained }))
    if (v !== undefined) warnDeprecated(`${dep}.prop.${p}`);

  const handleOpenChange = (o: boolean, details: OverlayOpenChangeDetails) => {
    if (!o && closeOnEscape === false && String((details as { reason?: string })?.reason ?? '').includes('escape')) return;
    onOpenChange?.(o);
    if (!o) onClose?.();
  };
  const dismissible = closeOnBackdropClick !== false && closeOnOverlayClick !== false;
  const mappedSize = size !== undefined ? ((SIZE_MAP as Record<string, string>)[size] ?? size) : undefined;
  return { open, handleOpenChange, dismissible, mappedSize, variant, role, title, description, footer, children, trigger, className, rest };
}

/** @deprecated GlassModal DEP-C0101 since 4.3.0, removed in 5.0.0. {@link Dialog} */
export function GlassModal(props: GlassModalProps) {
  warnDeprecated(DEP);
  const m = useGlassModalMapping(props);

  if (m.role === 'alertdialog') {
    return wrap('GlassModal', (
      <AlertDialog.Root {...(m.open !== undefined ? { open: m.open } : {})} onOpenChange={m.handleOpenChange}>
        {m.trigger ? <AlertDialog.Trigger>{m.trigger}</AlertDialog.Trigger> : null}
        <AlertDialog.Content {...(m.className !== undefined ? { className: m.className } : {})}>
          {m.title !== undefined ? <AlertDialog.Title>{m.title}</AlertDialog.Title> : null}
          {m.description !== undefined ? <AlertDialog.Description>{m.description}</AlertDialog.Description> : null}
          {m.children}
          {m.footer !== undefined ? <AlertDialog.Footer>{m.footer}</AlertDialog.Footer> : null}
        </AlertDialog.Content>
      </AlertDialog.Root>
    ));
  }
  if (m.variant === 'drawer' || m.variant === 'sheet' || m.variant === 'bottom') {
    return wrap('GlassModal', (
      <Sheet.Root {...(m.open !== undefined ? { open: m.open } : {})} onOpenChange={m.handleOpenChange} side="bottom" {...(m.dismissible !== undefined ? { dismissible: m.dismissible } : {})}>
        <Sheet.Content {...(m.className !== undefined ? { className: m.className } : {})}>
          {m.title}
          {m.description}
          {m.children}
          {m.footer}
        </Sheet.Content>
      </Sheet.Root>
    ));
  }
  const size = m.variant === 'fullscreen' ? 'full' : (m.mappedSize as 'sm' | 'md' | 'lg' | 'full' | undefined);
  return wrap('GlassModal', (
    <Dialog.Root {...(m.open !== undefined ? { open: m.open } : {})} onOpenChange={m.handleOpenChange}>
      {m.trigger ? <Dialog.Trigger>{m.trigger}</Dialog.Trigger> : null}
      <Dialog.Content
        {...(size !== undefined ? { size: size as 'sm' | 'md' | 'lg' | 'xl' | 'full' } : {})}
        {...(m.className !== undefined ? { className: m.className } : {})}
      >
        {m.title !== undefined ? <Dialog.Title>{m.title}</Dialog.Title> : null}
        {m.description !== undefined ? <Dialog.Description>{m.description}</Dialog.Description> : null}
        {m.children}
        {m.footer !== undefined ? <Dialog.Footer>{m.footer}</Dialog.Footer> : null}
      </Dialog.Content>
    </Dialog.Root>
  ));
}
