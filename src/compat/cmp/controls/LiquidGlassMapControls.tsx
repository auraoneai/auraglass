/* CMP-325 compat: LiquidGlassMapControls (4.x) -> Toolbar (vertical) (5.0).
   warnDeprecated fires at call time, once per page load per symbol; unmappable
   props drop with a single warning; never throws. Mapping per the target meta. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Toolbar } from '../../../components/toolbar';

const DEP = 'DEP-C0017';

export interface LiquidGlassMapControlsProps {
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onLocate?: () => void;
  children?: React.ReactNode;
  className?: string;
}

/** @deprecated LiquidGlassMapControls DEP-C0017 since 4.3.0, removed in 5.0.0. {@link Toolbar} */
export function LiquidGlassMapControls({ onZoomIn, onZoomOut, onLocate, children, ...rest }: LiquidGlassMapControlsProps) {
  warnDeprecated(DEP);
  return (
    <Toolbar.Root orientation="vertical" aria-label="Map controls" {...rest}>
      {children}
      {onZoomIn ? <Toolbar.Button onClick={onZoomIn}>+</Toolbar.Button> : null}
      {onZoomOut ? <Toolbar.Button onClick={onZoomOut}>-</Toolbar.Button> : null}
      {onLocate ? <Toolbar.Button onClick={onLocate}>Locate</Toolbar.Button> : null}
    </Toolbar.Root>
  );
}
