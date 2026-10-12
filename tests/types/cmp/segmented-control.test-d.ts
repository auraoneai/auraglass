/* REQ-CMP-41: SegmentedControl.Root type contract. `aria-label` and `name` are
   required; the value is a single string (radio semantics, ValueProps<string>);
   orientation is 'horizontal' | 'vertical'; Indicator is exported for custom
   content. Run by cmp:test:foundation-pattern (tsc -p tests/types/cmp). */
import * as React from 'react';
import { SegmentedControl } from '../../../src/components/segmented-control';
import type { SegmentedControlRootProps } from '../../../src/components/segmented-control';
import type { ChangeDetails } from '../../../src/contracts/components';

type RootProps = React.ComponentProps<typeof SegmentedControl.Root>;

// both required props present: compiles
export const ok: RootProps = { 'aria-label': 'View', name: 'view', defaultValue: 'list', orientation: 'vertical' };
export const okEl = React.createElement(SegmentedControl.Root, { 'aria-label': 'View', name: 'view' },
  React.createElement(SegmentedControl.Item, { value: 'list' }, 'List'),
  React.createElement(SegmentedControl.Indicator, null));

// @ts-expect-error — `name` is required
export const noName: RootProps = { 'aria-label': 'View' };
// @ts-expect-error — `aria-label` is required
export const noLabel: RootProps = { name: 'view' };
// @ts-expect-error — `name` is required on the element too
export const noNameEl = React.createElement(SegmentedControl.Root, { 'aria-label': 'View' });
// @ts-expect-error — `aria-label` is required on the element too
export const noLabelEl = React.createElement(SegmentedControl.Root, { name: 'view' });

// exactly one value: arrays are not a value
// @ts-expect-error — value is a single string
export const multi: RootProps = { 'aria-label': 'View', name: 'view', value: ['a', 'b'] };
// @ts-expect-error — orientation is 'horizontal' | 'vertical'
export const diag: RootProps = { 'aria-label': 'View', name: 'view', orientation: 'diagonal' };

// onValueChange(value: string, details: ChangeDetails)
type OnChange = NonNullable<SegmentedControlRootProps['onValueChange']>;
export const onChange: OnChange = (value: string, details: ChangeDetails) => { void value; void details; };
