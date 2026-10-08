/* Label (CMP-030): <label data-ag-part="label">. required -> aria-hidden asterisk
   plus VisuallyHidden ' (required)' so AT announces it; disabled -> data-disabled.
   No Root/LabelRoot alias. */
import * as React from 'react';
import { VisuallyHidden } from './VisuallyHidden';
import { cn } from '../internal/index';

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  /** Marks the control required: visual asterisk + screen-reader ' (required)'. */
  required?: boolean;
  disabled?: boolean;
  ref?: React.Ref<HTMLLabelElement>;
}

export function Label({ required, disabled, children, ...props }: LabelProps): React.ReactElement {
  return (
    <label
      {...props}
      data-ag-part="label"
      {...(disabled ? { 'data-disabled': '' } : {})}
      className={cn('ag-label', props.className) || undefined}
    >
      {children}
      {required ? (
        <>
          <span aria-hidden="true">*</span>
          <VisuallyHidden>{' (required)'}</VisuallyHidden>
        </>
      ) : null}
    </label>
  );
}

Label.displayName = 'Label';
