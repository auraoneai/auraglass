import type { Meta, StoryObj } from '@storybook/react';
import { ImageProcessingProvider } from './GlassImageProcessingProvider';
import { GlassIntelligentImageUploader } from './GlassIntelligentImageUploader';

const meta = {
  title: 'AI + Intelligence/Glass Intelligent Image Processor',
  component: GlassIntelligentImageUploader,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'AI-powered image processing with optimization and simple editing.',
      },
    },
  },
  decorators: [
    (Story) => (
      <ImageProcessingProvider>
        <div style={{ minHeight: '600px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '2rem' }}>
          <Story />
        </div>
      </ImageProcessingProvider>
    ),
  ],
} satisfies Meta<typeof GlassIntelligentImageUploader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BasicUploader: Story = {
  name: 'Basic Image Uploader',
  args: {
    maxFiles: 5,
    maxFileSize: 10,
    acceptedFormats: ['image/jpeg', 'image/png', 'image/webp'],
    onImagesUploaded: (images) => {
      console.log('Images uploaded:', images);
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Basic intelligent image uploader with real-time processing feedback.',
      },
    },
  },
};

