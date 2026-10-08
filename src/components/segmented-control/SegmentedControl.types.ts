import type * as React from 'react';
import type { ChangeDetails, MaterialBearingProps } from '../../contracts/components';

/** @tier Certified. Radio semantics (REQ-CTL-40): single value. */
export interface SegmentedControlRootProps extends MaterialBearingProps {
  value?: string | undefined;
  defaultValue?: string | undefined;
  onValueChange?: ((value: string, details: ChangeDetails) => void) | undefined;
  size?: 'sm' | 'md' | 'lg' | undefined;
  /** Required accessible name. */
  'aria-label': string;
  name?: string | undefined;
  disabled?: boolean | undefined;
  className?: string | undefined;
  children?: React.ReactNode;
  ref?: React.Ref<HTMLDivElement> | undefined;
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
