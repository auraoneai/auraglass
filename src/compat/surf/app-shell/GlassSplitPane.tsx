/* GlassSplitPane — root `aura-glass` 4.x compat adapter (REQ-SURF-13,
   DEP-S0030) → ResizablePanels. left/right → two ResizablePanels.Panel with a
   Handle between, direction → orientation, initial (percent, default 50) →
   defaultLayout, min/max (percent, 4.x defaults 20/80) → the first panel's
   minSize/maxSize,
   onSplitChange(percentage) ← onLayout(layout)[0]. The app-shell
   GlassSplitPane (ratio/direction grid) is REMOVE in PRD-4 §9 and gets no
   adapter. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { ResizablePanels } from '../../../app-shell/ResizablePanels';
import { domProps } from '../_shared';

export interface GlassSplitPaneProps {
  direction?: 'horizontal' | 'vertical';
  initial?: number;
  min?: number;
  max?: number;
  left?: React.ReactNode;
  right?: React.ReactNode;
  onSplitChange?: (percentage: number) => void;
  children?: React.ReactNode;
  [legacy: string]: unknown;
}

/**
 * 4.x `GlassSplitPane` compat adapter (DEP-S0030).
 * @deprecated since 4.3.0, removed in 5.0.0. Use {@link ResizablePanels from aura-glass/app-shell}.
 */
export function GlassSplitPane(props: GlassSplitPaneProps) {
  warnDeprecated('DEP-S0030');
  const {
    direction = 'horizontal', initial = 50, min = 20, max = 80, left, right, onSplitChange, children, ...rest
  } = props;
  const uid = React.useId().replace(/:/g, '');
  const [first, second] = left !== undefined || right !== undefined
    ? [left, right]
    : React.Children.toArray(children);
  return (
    <ResizablePanels.Root
      orientation={direction}
      defaultLayout={[initial, 100 - initial]}
      {...(onSplitChange ? { onLayout: (layout: number[]) => onSplitChange(layout[0] ?? initial) } : {})}
      {...domProps(rest)}
    >
      <ResizablePanels.Panel id={`${uid}-first`} label="First pane" defaultSize={initial} minSize={min} maxSize={max}>
        {first}
      </ResizablePanels.Panel>
      <ResizablePanels.Handle />
      <ResizablePanels.Panel id={`${uid}-second`} label="Second pane" defaultSize={100 - initial}>
        {second}
      </ResizablePanels.Panel>
    </ResizablePanels.Root>
  );
}
