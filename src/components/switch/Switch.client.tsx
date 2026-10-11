'use client';

import * as React from 'react';
import { Switch as Base } from '@base-ui/react/switch';
import { cn } from '../../internal';
import { toChangeDetails } from '../../foundation';
import { materialProps } from '../../material';
import { setAnimating } from '../../material/stateAttributes';
import { sizeAttrs } from '../control-shared/size';

/* REQ-CMP-46: data-ag-animating on the thumb while the toggle animates
   (drag uses BU's data-dragging). Clears on transitionend. */
function flagAnimating(root: HTMLElement | null) {
  const thumb = root?.querySelector<HTMLElement>("[data-ag-part='thumb']");
  if (!thumb) return;
  setAnimating(thumb, true);
  const off = () => setAnimating(thumb, false);
  thumb.addEventListener('transitionend', off, { once: true });
  /* transitionend may not fire under calm/none (0 duration) — bound it */
  setTimeout(off, 400);
}
import type { SwitchProps } from './Switch.types';

/** Switch — 'use client' leaf on BU Switch.Root + Thumb (REQ-CMP-45..47).
 * root is the track; thumb is the transient part. */
export function Switch({ size, onCheckedChange, children, className, ref, ...rest }: SwitchProps) {
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const setRefs = (el: HTMLDivElement | null) => {
    rootRef.current = el;
    if (typeof ref === 'function') ref(el);
    else if (ref) ref.current = el;
  };
  return (
    <Base.Root
      data-ag-part="root"
      /* track material: content-sunken at rest (unchecked); the checked
         override to the opaque accent lives in Switch.css [data-checked] */
      {...materialProps({ layer: 'content', content: 'content-sunken' })}
      className={cn('ag-switch', className)}
      onCheckedChange={(c, details) => {
        flagAnimating(rootRef.current);
        onCheckedChange?.(c, toChangeDetails(details));
      }}
      ref={setRefs}
      {...sizeAttrs(size)}
      {...rest}
    >
      <span data-ag-part="hit-area" aria-hidden="true" />
      <Base.Thumb
        data-ag-part="thumb"
        {...materialProps({ layer: 'transient', thickness: 'thin' })}
      />
      {children}
    </Base.Root>
  );
}
