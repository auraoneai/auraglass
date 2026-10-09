'use client';
import * as React from 'react';
import { Button as BaseButton } from '@base-ui/react/button';
import { Toggle } from '@base-ui/react/toggle';
import { materialProps } from '../../material';
import { cn } from '../../internal';
import { toChangeDetails } from '../../foundation';
import type { ChangeDetails } from '../../contracts/components';
import type { ButtonProps } from './Button.types';

/* Dev-only: at most one prominent button per chrome surface. Registry is a
   WeakMap keyed by the nearest [data-ag-surface][data-ag-layer=chrome]
   ancestor (falls back to a module sentinel when outside any surface). */
const CHROME_SCOPE = '[data-ag-surface][data-ag-layer="chrome"]';
const PROMINENT_FALLBACK = {};
const prominentRegistry = new WeakMap<object, Set<object>>();
const prominentWarnedScopes = new WeakSet<object>();
function useProminentGuard(
  prominent: boolean | undefined,
  token: object,
  elementRef: React.MutableRefObject<HTMLElement | null>,
) {
  React.useEffect(() => {
    if (!prominent || typeof process === 'undefined' || process.env.NODE_ENV === 'production') return;
    /* parentElement.closest: the button itself emits data-ag-surface+chrome —
       the guard scopes to the nearest ANCESTOR surface. */
    const scope = (elementRef.current?.parentElement?.closest(CHROME_SCOPE) ?? PROMINENT_FALLBACK) as object;
    let registry = prominentRegistry.get(scope);
    if (!registry) {
      registry = new Set();
      prominentRegistry.set(scope, registry);
    }
    if (registry.size > 0 && !prominentWarnedScopes.has(scope)) {
      prominentWarnedScopes.add(scope);
      // eslint-disable-next-line no-console
      console.error(
        '[aura-glass] A second prominent Button mounted in the same chrome surface. ' +
          'Only one prominent action is allowed per surface (SC-24).',
      );
    }
    registry.add(token);
    return () => {
      registry.delete(token);
    };
  }, [prominent, token, elementRef]);
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

  const token = React.useRef<object>({});
  const elementRef = React.useRef<HTMLElement | null>(null);
  useProminentGuard(prominent, token.current, elementRef);

  const isToggle = pressed !== undefined || defaultPressed !== undefined || onPressedChange !== undefined;

  /* REQ-CMP-34: thin chrome + interactive by default. */
  const role: Parameters<typeof materialProps>[0] = { layer: 'chrome', variant, thickness: 'thin', interactive: true };
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
    ref: (node: HTMLElement | null) => {
      elementRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) (ref as React.MutableRefObject<HTMLElement | null>).current = node;
    },
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
