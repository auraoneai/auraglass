import type * as React from 'react';
import type { ChangeDetails, MaterialBearingProps } from '../../contracts/components';

/** @tier Certified. Radio semantics (REQ-CTL-40): single value. */
export interface SegmentedControlRootProps extends MaterialBearingProps {
  /** Controlled value. Pair with `onValueChange`. */
  value?: string | undefined;
  /** Initial value when uncontrolled. */
  defaultValue?: string | undefined;
  /** Called with the new value whenever it changes. */
  onValueChange?: ((value: string, details: ChangeDetails) => void) | undefined;
  /** Control size. */
  size?: 'sm' | 'md' | 'lg' | undefined;
  /** Layout orientation (default 'horizontal'); roving focus follows it. */
  orientation?: 'horizontal' | 'vertical' | undefined;
  /** Required accessible name. */
  'aria-label': string;
  /** Required form name (REQ-CMP-41). */
  name: string;
  /** Disables interaction. */
  disabled?: boolean | undefined;
  /** Class name merged onto the root element. */
  className?: string | undefined;
  /** Content rendered inside the component. */
  children?: React.ReactNode;
  /** Ref to the rendered root element. */
  ref?: React.Ref<HTMLDivElement> | undefined;
}

export interface SegmentedControlIndicatorProps {
  /** Custom indicator content; supplying an Indicator suppresses the auto-rendered one (REQ-CMP-41). */
  children?: React.ReactNode;
  className?: string | undefined;
  ref?: React.Ref<HTMLSpanElement> | undefined;
}

export interface SegmentedControlItemProps {
  value: string;
  disabled?: boolean | undefined;
  /** Full label used for `title` when the label ellipsizes. */
  title?: string | undefined;
  className?: string | undefined;
  children?: React.ReactNode;
  ref?: React.Ref<HTMLButtonElement> | undefined;
}
