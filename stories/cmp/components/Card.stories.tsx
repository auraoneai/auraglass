import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Card } from '../../../src/components/card';
import type { StoryAgParameters } from '../../../src/contracts/testing';

const sbMeta = {
  title: 'Core/Card',
  component: Card.Root,
  tags: ['certified'],
  parameters: { ag: { tier: 'standard', subject: 'Card', kind: 'component' } },
} satisfies Meta<typeof Card.Root>;
export default sbMeta;
type Story = StoryObj<typeof sbMeta>;

export const Default: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Card', id: 'core-card--default' } },
  render: () => (
    <Card>
      <Card.Header><Card.Title>Title</Card.Title><Card.Description>Desc</Card.Description></Card.Header>
      <Card.Body>Body</Card.Body>
      <Card.Footer>Footer</Card.Footer>
    </Card>
  ),
};

export const RegularOverMedia: Story = {
  /* REQ-CMP-113: regular variant over a media backdrop — keeps the ::before
     blur that the default content-layer card must not have. */
  parameters: { ag: { tier: 'standard', subject: 'Card', id: 'core-card--regular-over-media', scene: 'photo', transparency: 'glass' } },
  render: () => (
    <Card variant="regular">
      <Card.Header><Card.Title>Regular over media</Card.Title></Card.Header>
      <Card.Body>Body</Card.Body>
    </Card>
  ),
};

export const Interactive: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Card', id: 'core-card--interactive' } },
  render: () => (
    <Card interactive>
      <Card.Header><Card.Title>Clickable</Card.Title></Card.Header>
      <Card.Body>Body</Card.Body>
    </Card>
  ),
};

