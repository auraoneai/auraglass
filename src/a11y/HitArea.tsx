/* MAT-302 (A11Y-024): server-safe hit-area span — no 'use client', no hooks.
   The expanded target geometry lives in css/targets.css keyed on
   [data-ag-part="hit-area"]; the span is decorative so it is aria-hidden and
   must produce exactly one DOM node. */
import React from 'react';

export type HitAreaProps = React.HTMLAttributes<HTMLSpanElement>;

export function HitArea(props: HitAreaProps) {
  return <span data-ag-part="hit-area" aria-hidden="true" {...props} />;
}
