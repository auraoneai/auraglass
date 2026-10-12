import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { FileUpload } from '../../../src/components/file-upload';
import type { StoryAgParameters } from '../../../src/contracts/testing';

const sbMeta = {
  title: 'Core/FileUpload',
  component: FileUpload,
  tags: ['certified'],
  parameters: { ag: { tier: 'standard', subject: 'FileUpload', kind: 'component' } },
} satisfies Meta<typeof FileUpload>;
export default sbMeta;
type Story = StoryObj<typeof sbMeta>;

export const Default: Story = {
  parameters: { ag: { tier: 'standard', subject: 'FileUpload', id: 'core-file-upload--default' } },
  render: () => (
    <FileUpload />
  ),
};

export const WithFiles: Story = {
  parameters: { ag: { tier: 'standard', subject: 'FileUpload', id: 'core-file-upload--with-files' } },
  render: () => (
    <FileUpload defaultItems={[{ file: new File(['x'], 'photo.png', { type: 'image/png' }), status: 'selected' }]} />
  ),
};


/* REQ-CMP-126: images only, 1 MB cap — a wrong-type file renders Field.Error
   (aria-describedby on the dropzone) and is announced through S-26. */
export const Rejection: Story = {
  parameters: { ag: { tier: 'standard', subject: 'FileUpload', id: 'core-file-upload--rejection' } },
  render: () => (
    <FileUpload accept="image/*" maxSize={1024 * 1024} />
  ),
};
