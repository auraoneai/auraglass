import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ImageList } from '../../../src/components/image-list';
import type { StoryAgParameters } from '../../../src/contracts/testing';

const sbMeta = {
  title: 'Core/ImageList',
  component: ImageList,
  tags: ['certified'],
  parameters: { ag: { tier: 'standard', subject: 'ImageList', kind: 'component' } },
} satisfies Meta<typeof ImageList>;
export default sbMeta;
type Story = StoryObj<typeof sbMeta>;

export const Default: Story = {
  parameters: { ag: { tier: 'standard', subject: 'ImageList', id: 'core-image-list--default' } },
  render: () => (
    <ImageList cols={3} variant="standard">
      <ImageList.Item><div style={{ background: '#8884', height: 80 }} /></ImageList.Item>
      <ImageList.Item><div style={{ background: '#8884', height: 80 }} /></ImageList.Item>
    </ImageList>
  ),
};

export const Barred: Story = {
  parameters: { ag: { tier: 'standard', subject: 'ImageList', id: 'core-image-list--barred' } },
  render: () => (
    <ImageList cols={2} variant="quilted">
      <ImageList.Item>
        <div style={{ background: '#8884', height: 80 }} />
        <ImageList.ItemBar title="Photo" subtitle="2026" actionIcon={<span>+</span>} />
      </ImageList.Item>
    </ImageList>
  ),
};

export const Masonry: Story = {
  parameters: { ag: { tier: 'standard', subject: 'ImageList', id: 'core-image-list--masonry' } },
  render: () => (
    <ImageList cols={3} variant="masonry">
      <ImageList.Item><div style={{ background: '#8884', height: 120 }} /></ImageList.Item>
      <ImageList.Item><div style={{ background: '#8884', height: 60 }} /></ImageList.Item>
    </ImageList>
  ),
};

