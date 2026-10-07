/* MAT-172 — variant × thickness grid generated from matrix.meta.ts. */
import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';
import { Surface } from '../Surface';
import { Environment } from '../Environment';
import { MATRIX_CELLS } from './matrix.meta';
import type { StoryAgParameters } from '../../contracts/testing';

const meta = {
  title: 'Material Lab/Matrix',
  component: Surface,
  parameters: {
    ag: { subject: 'Surface', kind: 'matrix' } satisfies StoryAgParameters,
  },
} satisfies Meta<typeof Surface>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Matrix: Story = {
  render: () => (
    <Environment backdrop="media">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(140px, 1fr))', gap: 16, padding: 24 }}>
        {MATRIX_CELLS.map(({ variant, thickness }) => (
          <div key={`${variant}-${thickness}`}>
            <div style={{ fontSize: 11, marginBottom: 4 }}>{variant} / {thickness}</div>
            {variant === 'content-raised' ? (
              <Surface layer="content" content="content-raised" thickness={thickness} style={{ padding: 16 }}>content</Surface>
            ) : (
              <Surface layer="chrome" variant={variant} thickness={thickness} style={{ padding: 16 }}>{variant}</Surface>
            )}
          </div>
        ))}
      </div>
    </Environment>
  ),
};
