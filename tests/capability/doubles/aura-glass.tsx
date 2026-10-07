// tests/capability/doubles/aura-glass.tsx — SURF-authored doubles for the
// CMP exports the capability registry blocks compose. Mirrored to the S-30
// surface (Card compound parts, Avatar compound parts, flat primitives).
// Delete each mapping in tests/capability/jest.doubles.cjs when the CMP
// component's conformance test passes on next (contract §4.10 note, line
// 1914) — QUAL keeps its own double-vs-real comparison.
import * as React from 'react';

const el = React.createElement;
const passthrough = (tag: React.ElementType) => (props: Record<string, unknown>) => el(tag, props);

export const Button = (p: Record<string, unknown>) => el('button', { type: 'button', ...p });
export const Badge = passthrough('span');
export const Separator = passthrough('hr');
export const TextField = ({ label, ...p }: { label?: React.ReactNode } & Record<string, unknown>) =>
  el('label', {}, label, el('input', p));

export const Card = {
  Root: passthrough('section'),
  Header: passthrough('header'),
  Title: passthrough('h3'),
  Description: passthrough('p'),
  Body: passthrough('div'),
  Footer: passthrough('footer'),
};

export const Avatar = {
  Root: passthrough('span'),
  Image: (p: Record<string, unknown>) => el('img', p),
  Fallback: passthrough('span'),
};
export const AvatarGroup = passthrough('div');

// --- lane W2 additions: real SURF root exports (Timeline/ActivityFeed/
// Pagination ship from src/components, not doubled) + the flat CMP
// primitives W2 blocks compose. ---
export { Timeline } from '../../../src/components/timeline/Timeline';
export { ActivityFeed } from '../../../src/components/timeline/ActivityFeed';
export { Pagination } from '../../../src/components/pagination/Pagination';
export { TabBar } from '../../../src/components/tab-bar/TabBar';

export const Checkbox = ({ 'aria-label': ariaLabel, ...p }: Record<string, unknown>) =>
  el('input', { type: 'checkbox', 'aria-label': ariaLabel, ...p });
export const SearchField = ({ label, ...p }: { label?: React.ReactNode } & Record<string, unknown>) =>
  el('label', {}, label, el('input', { type: 'search', ...p }));
export const NumberField = ({ label, ...p }: { label?: React.ReactNode } & Record<string, unknown>) =>
  el('label', {}, label, el('input', { type: 'number', ...p }));
export const ToggleGroup = {
  Root: passthrough('div'),
  Item: ({ pressed, ...p }: { pressed?: boolean } & Record<string, unknown>) =>
    el('button', { type: 'button', 'aria-pressed': pressed, ...p }),
};
export const Sheet = {
  Root: passthrough('div'),
  Content: passthrough('div'),
  Trigger: passthrough('button'),
};
export const Popover = {
  Root: passthrough('span'),
  Trigger: passthrough('button'),
  Content: passthrough('div'),
};
export const Form = {
  Root: passthrough('form'),
  Field: passthrough('div'),
};
