'use client';
import * as React from 'react';
import { Button } from '../button/Button.client';
import { cn } from '../../internal';
import type { IconButtonProps } from './IconButton.types';

/** IconButton — Button leaf for icon-only actions. Shares Button internals (same chunk). */
export function IconButton({ label, icon, shape = 'capsule', className, ...rest }: IconButtonProps) {
  if (typeof process === 'undefined' || process.env.NODE_ENV !== 'production') {
    if (!label) {
      // eslint-disable-next-line no-console
      console.error('[aura-glass] IconButton requires a non-empty `label` (aria-label).');
    }
  }
  return (
    <Button
      {...rest}
      aria-label={label}
      data-ag-shape={shape === 'fixed' ? 'fixed' : undefined}
      className={cn('ag-button', 'ag-icon-button', className)}
      startIcon={icon}
    />
  );
}
