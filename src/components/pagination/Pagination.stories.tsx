// Pagination.stories.tsx — SURF story contract (S-41): subject = ComponentMeta name,
// kind 'component'; Default + state stories cover the meta's declared states.
import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Pagination } from './Pagination';

const defaultChildren = undefined;

const meta: Meta = {
  title: 'surf/pagination',
  component: Pagination.Root,
  parameters: { ag: { subject: 'Pagination', kind: 'component' } },
};
export default meta;
type Story = StoryObj;

export const Default: Story = { render: () => <Pagination.Root page={5} pageCount={12} getHref={(p: number) => `?page=${p}`} /> };
export const RTL: Story = { render: () => <Pagination.Root page={5} pageCount={12} getHref={(p: number) => `?page=${p}`} />, parameters: { globals: { dir: 'rtl' } } };
export const ReducedTransparency: Story = { render: () => <Pagination.Root page={5} pageCount={12} getHref={(p: number) => `?page=${p}`} />, parameters: { ag: { material: 'regular' } } };
export const ForcedColors: Story = { render: () => <Pagination.Root page={5} pageCount={12} getHref={(p: number) => `?page=${p}`} />, parameters: { globals: { forcedColors: 'active' } } };
