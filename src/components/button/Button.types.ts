/* AuraGlass prop types for Button — no Base UI types surface here. */
import type * as React from 'react';
import type { ChangeDetails, Intent, MaterialBearingProps, RenderProp } from '../../contracts/components';

/** @tier Certified (T1 flagship control). */
export interface ButtonProps
  extends Omit<MaterialBearingProps, 'variant'>,
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'color' | 'onChange' | 'prefix' | 'value'> {
  /** Material axis: 'regular' (default) | 'clear' | 'identity'. Never a `material` prop. */
  variant?: 'regular' | 'clear' | 'identity' | undefined;
  /** Status tint from the full S-30 intent union (REQ-CMP-34); neutral omits the attribute. */
  intent?: Intent | undefined;
  /** Emitted as data-ag-size. */
  size?: 'sm' | 'md' | 'lg' | undefined;
  /** Decorative leading icon node. */
  startIcon?: React.ReactNode;
  /** Decorative trailing icon node. */
  endIcon?: React.ReactNode;
  /** Show spinner, set aria-busy, suppress activation. Label stays mounted (visibility:hidden). */
  loading?: boolean | undefined;
  /** Controlled pressed state — presence switches the base to a toggle. */
  pressed?: boolean | undefined;
  /** Initial pressed state of an uncontrolled toggle button. */
  defaultPressed?: boolean | undefined;
  /** Called with the next pressed state when a toggle button is pressed. */
  onPressedChange?: ((pressed: boolean, details: ChangeDetails) => void) | undefined;
  /** Pointer-light highlight opt-in (emitted data-ag-pointer-light; MAT engine installs). */
  pointerLight?: boolean | undefined;
  /** Keep focusable when disabled (Base UI focusableWhenDisabled). */
  focusableWhenDisabled?: boolean | undefined;
  /** Replaces the rendered element; the component props and state are merged onto it. */
  render?: RenderProp | undefined;
  /** Ref to the rendered root element. */
  ref?: React.Ref<HTMLButtonElement> | undefined;
  /** Internal: omit inner part attrs (icon/hit-area/spinner/label) so the button can
      sit inside another component's DOM without leaking undeclared data-parts. */
  suppressInnerParts?: boolean | undefined;
}
