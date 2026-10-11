import type * as React from 'react';
import type { ChangeDetails, MaterialBearingProps } from '../../contracts/components';

/** @tier Certified. Radio semantics (REQ-CTL-40): single value. */
export interface SegmentedControlRootProps extends MaterialBearingProps {
  value?: string | undefined;
  defaultValue?: string | undefined;
  onValueChange?: ((value: string, details: ChangeDetails) => void) | undefined;
  size?: 'sm' | 'md' | 'lg' | undefined;
  /** Layout orientation (default 'horizontal'); roving focus follows it. */
  orientation?: 'horizontal' | 'vertical' | undefined;
  /** Required accessible name. */
  'aria-label': string;
  /** Required form name (REQ-CMP-41). */
  name: string;
  disabled?: boolean | undefined;
  className?: string | undefined;
  children?: React.ReactNode;
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
