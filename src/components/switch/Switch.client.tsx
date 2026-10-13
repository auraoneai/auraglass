'use client';

import * as React from 'react';
import { stateRender, toDataState } from '../../foundation/state';
import { useControllableWarning } from '../../foundation/controllable';
import { Switch as Base } from '@base-ui/react/switch';
import { cn } from '../../internal';
import { toChangeDetails } from '../../foundation';
import { materialProps } from '../../material';
import { setAnimating } from '../../material/stateAttributes';
import { sizeAttrs } from '../control-shared/size';

import type { SwitchProps } from './Switch.types';

/** Switch — 'use client' leaf on BU Switch.Root + Thumb (REQ-CMP-45..47).
 * root is the track; thumb is the transient part. */
export function Switch({ size, onCheckedChange, children, className, ref, ...rest }: SwitchProps) {
  useControllableWarning('Switch', 'checked', rest.checked);
  const labelId = React.useId();
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  /* REQ-CMP-46: while the thumb moves it is glass (allowNested keeps its MAT
     optics inside the track surface) and carries data-ag-animating; at rest
     it returns to the nested inner fill. Clears on transitionend, bounded
     because transitionend does not fire under calm/none (0 duration). */
  const [moving, setMoving] = React.useState(false);
  React.useEffect(() => {
    if (!moving) return undefined;
    const thumb = rootRef.current?.querySelector<HTMLElement>("[data-ag-part='thumb']");
    if (!thumb) {
      setMoving(false);
      return undefined;
    }
    setAnimating(thumb, true);
    const off = () => setMoving(false);
    thumb.addEventListener('transitionend', off);
    const timer = setTimeout(off, 400);
    return () => {
      thumb.removeEventListener('transitionend', off);
      clearTimeout(timer);
      setAnimating(thumb, false);
    };
  }, [moving]);
  const setRefs = (el: HTMLDivElement | null) => {
    rootRef.current = el;
    if (typeof ref === 'function') ref(el);
    else if (ref) ref.current = el;
  };
  const hasChildren = children !== undefined && children !== null && children !== false;
  const rootNode = (
    <Base.Root
      data-ag-part="root"
      /* track material: content-sunken at rest (unchecked); the checked
         override to the opaque accent lives in Switch.css [data-checked] */
      {...materialProps({ layer: 'content', content: 'content-sunken' })}
      className={cn('ag-switch', className)}
      onCheckedChange={(c, details) => {
        setMoving(true);
        onCheckedChange?.(c, toChangeDetails(details));
      }}
      ref={setRefs}
      {...sizeAttrs(size)}
      {...(hasChildren && rest['aria-label'] === undefined && rest['aria-labelledby'] === undefined
        ? { 'aria-labelledby': labelId }
        : {})}
      {...rest}
      render={stateRender<{ checked: boolean }>((s) => toDataState({ checked: s.checked }), undefined, 'span')}
    >
      <span data-ag-part="hit-area" aria-hidden="true" />
      <Base.Thumb
        render={stateRender<{ checked: boolean }>((s) => toDataState({ checked: s.checked }), undefined, 'span')}
        data-ag-part="thumb"
        {...materialProps({ layer: 'transient', thickness: 'thin', allowNested: moving })}
      />
    </Base.Root>
  );
  if (!hasChildren) return rootNode;
  return (
    <label className="ag-switch-field" data-disabled={rest.disabled ? '' : undefined}>
      {rootNode}
      <span id={labelId} className="ag-switch-label">
        {children}
      </span>
    </label>
  );
}
