'use client';
import * as React from 'react';
import { Button as BaseButton } from '@base-ui/react/button';
import { Toggle } from '@base-ui/react/toggle';
import { materialProps } from '../../material';
import { cn } from '../../internal';
import { toChangeDetails } from '../../foundation';
import type { ChangeDetails } from '../../contracts/components';
import type { ButtonProps } from './Button.types';
import { useControllableWarning } from '../../foundation/controllable';

/* Dev-only: at most one prominent button per view root. One warning total. */
const prominentRegistry = new Set<object>();
let prominentWarned = false;
function useProminentGuard(prominent: boolean | undefined, token: object) {
  React.useEffect(() => {
    if (!prominent || typeof process === 'undefined' || process.env.NODE_ENV === 'production') return;
    if (prominentRegistry.size > 0 && !prominentWarned) {
      prominentWarned = true;
      // eslint-disable-next-line no-console
      console.error(
        '[aura-glass] A second prominent Button mounted in the same view. ' +
          'Only one prominent action is allowed per surface (SC-24).',
      );
    }
    prominentRegistry.add(token);
    return () => {
      prominentRegistry.delete(token);
    };
  }, [prominent, token]);
}

function Spinner() {
  return <span data-ag-part="spinner" aria-hidden="true" />;
}

function Inner({ startIcon, endIcon, loading, children, bare }: Pick<ButtonProps, 'startIcon' | 'endIcon' | 'loading' | 'children'> & { bare?: boolean | undefined }) {
  const part = (name: string) => (bare ? undefined : name);
  return (
    <>
      {/* REQ-33: hit-area expands the pointer target to --ag-target-min without affecting layout */}
      <span {...(part('hit-area') ? { 'data-ag-part': 'hit-area' } : {})} aria-hidden="true" />
      {loading ? (bare ? <span aria-hidden="true" /> : <Spinner />) : null}
      {startIcon ? <span {...(part('icon') ? { 'data-ag-part': 'icon' } : {})}>{startIcon}</span> : null}
      {/* label stays mounted while loading so width is stable (hidden via CSS visibility); omitted when icon-only */}
      {children !== undefined && children !== null ? <span {...(part('label') ? { 'data-ag-part': 'label' } : {})}>{children}</span> : null}
      {endIcon ? <span {...(part('icon') ? { 'data-ag-part': 'icon' } : {})}>{endIcon}</span> : null}
    </>
  );
}

/** Button — 'use client' leaf on Base UI Button; switches to Toggle when pressed props are present. */
export function Button(props: ButtonProps) {
  const {
    variant = 'regular',
    thickness,
    prominent,
    intent = 'neutral',
    size = 'md',
    refraction,
    loading,
    startIcon,
    endIcon,
    pressed,
    defaultPressed,
    onPressedChange,
    pointerLight,
    focusableWhenDisabled,
    disabled,
    render,
    className,
    type,
    onClick,
    children,
    ref,
    suppressInnerParts,
    'data-ag-part': partOverride,
    ...rest
  } = props as ButtonProps & { 'data-ag-part'?: string };

  useControllableWarning('Button', 'pressed', pressed);
  const token = React.useRef<object>({});
  useProminentGuard(prominent, token.current);

  const isToggle = pressed !== undefined || defaultPressed !== undefined || onPressedChange !== undefined;

  const role: Parameters<typeof materialProps>[0] = { layer: 'chrome', variant };
  if (thickness !== undefined) role.thickness = thickness;
  if (prominent === true) role.prominent = true;
  if (refraction === true) role.refraction = true;
  const attrs = materialProps(role);
  const shared = {
    ...attrs,
    'data-ag-part': partOverride ?? 'root',
    'data-ag-interactive': '',
    'data-ag-size-class': 'control',
    'data-ag-size': size,
    'data-ag-intent': intent !== 'neutral' ? intent : undefined,
    'data-ag-variant': variant === 'identity' ? 'identity' : attrs['data-ag-variant'],
    ...(pointerLight ? { 'data-ag-pointer-light': '' } : {}),
    'aria-busy': loading || undefined,
    disabled,
    className: cn('ag-button', className),
    ref,
  } as const;

  const inner = <Inner startIcon={startIcon} endIcon={endIcon} loading={loading} bare={suppressInnerParts}>{children}</Inner>;

  const guardClick = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (loading) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      onClick?.(e);
    },
    [loading, onClick],
  );

  if (isToggle) {
    return (
      <Toggle
        {...rest}
        {...shared}
        pressed={pressed}
        defaultPressed={defaultPressed}
        onPressedChange={(p, eventDetails) => onPressedChange?.(p, toChangeDetails(eventDetails))}
        onClick={guardClick}
        render={render as React.ComponentProps<typeof Toggle>['render']}
        type={(type ?? 'button') as 'button'}
      >
        {inner}
      </Toggle>
    );
  }
  return (
    <BaseButton
      {...rest}
      {...shared}
      focusableWhenDisabled={focusableWhenDisabled}
      onClick={guardClick}
      render={render as React.ComponentProps<typeof BaseButton>['render']}
      type={(type ?? 'button') as 'button'}
    >
      {inner}
    </BaseButton>
  );
}
