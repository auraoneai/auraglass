import type { Meta, StoryObj } from '@storybook/react';
import { GlassStyleTransfer, type StyleModel } from './GlassStyleTransfer';

const mockStyleModels: StyleModel[] = [
  {
    id: 'van-gogh',
    name: 'Van Gogh Starry Night',
    description: 'Impressionistic swirls and bold brushstrokes',
    previewUrl: '/styles/van-gogh.jpg',
    strength: 0.8,
    category: 'artistic'
  },
  {
    id: 'picasso',
    name: 'Picasso Cubism',
    description: 'Geometric fragmentation and multiple perspectives',
    previewUrl: '/styles/picasso.jpg',
    strength: 0.7,
    category: 'artistic'
  },
  {
    id: 'monet',
    name: 'Monet Water Lilies',
    description: 'Soft impressionistic light and color',
    previewUrl: '/styles/monet.jpg',
    strength: 0.6,
    category: 'artistic'
  },
  {
    id: 'film-noir',
    name: 'Film Noir',
    description: 'High contrast black and white cinematography',
    previewUrl: '/styles/film-noir.jpg',
    strength: 0.9,
    category: 'photographic'
  },
  {
    id: 'synthwave',
    name: 'Synthwave',
    description: 'Retro-futuristic neon aesthetics',
    previewUrl: '/styles/synthwave.jpg',
    strength: 0.8,
    category: 'modern'
  },
  {
    id: 'kandinsky',
    name: 'Kandinsky Abstract',
    description: 'Geometric abstraction with vibrant colors',
    previewUrl: '/styles/kandinsky.jpg',
    strength: 0.7,
    category: 'abstract'
  }
];

const meta = {
  title: 'AI + Intelligence/Glass Style Transfer',
  component: GlassStyleTransfer,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    transferStrength: {
      control: { type: 'range', min: 0, max: 1, step: 0.1 },
    },
    realTimePreview: {
      control: 'boolean',
    },
    showProgressIndicator: {
      control: 'boolean',
    },
    showStyleLibrary: {
      control: 'boolean',
    },
    showAdvancedControls: {
      control: 'boolean',
    },
    preserveColors: {
      control: 'boolean',
    },
    enhanceDetails: {
      control: 'boolean',
    },
    blendMode: {
      control: { 
        type: 'select', 
        options: ['normal', 'multiply', 'screen', 'overlay', 'soft-light'] 
      },
    },
    resolution: {
      control: { 
        type: 'select', 
        options: ['low', 'medium', 'high', 'ultra'] 
      },
    },
  },
} satisfies Meta<typeof GlassStyleTransfer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    styleModels: mockStyleModels,
    selectedStyle: 'van-gogh',
    transferStrength: 0.7,
    realTimePreview: true,
    showProgressIndicator: true,
    showStyleLibrary: true,
    showAdvancedControls: true,
    preserveColors: false,
    enhanceDetails: true,
    blendMode: 'normal',
    resolution: 'medium',
  },
};

export const ArtisticStyles: Story = {
  args: {
    styleModels: mockStyleModels.filter(s => s.category === 'artistic'),
    selectedStyle: 'van-gogh',
    transferStrength: 0.8,
    realTimePreview: true,
    showStyleLibrary: true,
    showAdvancedControls: true,
  },
};

export const PhotographicStyles: Story = {
  args: {
    styleModels: mockStyleModels.filter(s => s.category === 'photographic'),
    selectedStyle: 'film-noir',
    transferStrength: 0.9,
    realTimePreview: true,
    showStyleLibrary: true,
    showAdvancedControls: true,
    preserveColors: false,
  },
};

export const AbstractStyles: Story = {
  args: {
    styleModels: mockStyleModels.filter(s => s.category === 'abstract'),
    selectedStyle: 'kandinsky',
    transferStrength: 0.7,
    realTimePreview: true,
    showStyleLibrary: true,
    showAdvancedControls: true,
  },
};

export const HighStrengthTransfer: Story = {
  args: {
    styleModels: mockStyleModels,
    selectedStyle: 'picasso',
    transferStrength: 1.0,
    realTimePreview: true,
    showProgressIndicator: true,
    showStyleLibrary: true,
    showAdvancedControls: true,
    enhanceDetails: true,
  },
};

export const LowStrengthTransfer: Story = {
  args: {
    styleModels: mockStyleModels,
    selectedStyle: 'monet',
    transferStrength: 0.3,
    realTimePreview: true,
    showProgressIndicator: true,
    showStyleLibrary: true,
    showAdvancedControls: true,
    preserveColors: true,
  },
};

export const ColorPreservation: Story = {
  args: {
    styleModels: mockStyleModels,
    selectedStyle: 'van-gogh',
    transferStrength: 0.6,
    realTimePreview: true,
    preserveColors: true,
    enhanceDetails: true,
    showAdvancedControls: true,
  },
};

export const HighResolution: Story = {
  args: {
    styleModels: mockStyleModels,
    selectedStyle: 'synthwave',
    transferStrength: 0.8,
    resolution: 'ultra',
    realTimePreview: false,
    showProgressIndicator: true,
    showAdvancedControls: true,
  },
};

export const MultiplyBlendMode: Story = {
  args: {
    styleModels: mockStyleModels,
    selectedStyle: 'film-noir',
    transferStrength: 0.7,
    blendMode: 'multiply',
    realTimePreview: true,
    showAdvancedControls: true,
  },
};

export const OverlayBlendMode: Story = {
  args: {
    styleModels: mockStyleModels,
    selectedStyle: 'kandinsky',
    transferStrength: 0.6,
    blendMode: 'overlay',
    realTimePreview: true,
    showAdvancedControls: true,
  },
};

export const MinimalInterface: Story = {
  args: {
    styleModels: mockStyleModels,
    selectedStyle: 'monet',
    transferStrength: 0.7,
    showStyleLibrary: false,
    showAdvancedControls: false,
    showProgressIndicator: false,
    realTimePreview: true,
  },
};

export const StyleLibraryOnly: Story = {
  args: {
    styleModels: mockStyleModels,
    selectedStyle: '',
    transferStrength: 0.7,
    showStyleLibrary: true,
    showAdvancedControls: false,
    showProgressIndicator: true,
    realTimePreview: true,
  },
};

export const AdvancedControlsOnly: Story = {
  args: {
    styleModels: mockStyleModels,
    selectedStyle: 'van-gogh',
    transferStrength: 0.7,
    showStyleLibrary: false,
    showAdvancedControls: true,
    showProgressIndicator: true,
    realTimePreview: true,
  },
};

export const ProcessingState: Story = {
  args: {
    styleModels: mockStyleModels,
    selectedStyle: 'picasso',
    transferStrength: 0.8,
    realTimePreview: false,
    showProgressIndicator: true,
    showStyleLibrary: true,
    showAdvancedControls: true,
  },
};

export const DisabledRealTime: Story = {
  args: {
    styleModels: mockStyleModels,
    selectedStyle: 'van-gogh',
    transferStrength: 0.7,
    realTimePreview: false,
    showProgressIndicator: true,
    showStyleLibrary: true,
    showAdvancedControls: true,
    resolution: 'high',
  },
};

export const DetailEnhancement: Story = {
  args: {
    styleModels: mockStyleModels,
    selectedStyle: 'synthwave',
    transferStrength: 0.7,
    enhanceDetails: true,
    preserveColors: false,
    realTimePreview: true,
    showAdvancedControls: true,
  },
};

export const SoftLightBlend: Story = {
  args: {
    styleModels: mockStyleModels,
    selectedStyle: 'monet',
    transferStrength: 0.8,
    blendMode: 'soft-light',
    preserveColors: true,
    enhanceDetails: true,
    showAdvancedControls: true,
  },
};

export const ScreenBlendMode: Story = {
  args: {
    styleModels: mockStyleModels,
    selectedStyle: 'kandinsky',
    transferStrength: 0.6,
    blendMode: 'screen',
    realTimePreview: true,
    showAdvancedControls: true,
  },
};

export const LowResolutionFast: Story = {
  args: {
    styleModels: mockStyleModels,
    selectedStyle: 'van-gogh',
    transferStrength: 0.7,
    resolution: 'low',
    realTimePreview: true,
    showProgressIndicator: true,
    showAdvancedControls: true,
  },
};

export const CustomStyleModel: Story = {
  args: {
    styleModels: [
      ...mockStyleModels,
      {
        id: 'custom-style',
        name: 'Custom Neural Style',
        description: 'User-uploaded style reference',
        previewUrl: '/styles/custom.jpg',
        strength: 0.8,
        category: 'modern'
      }
    ],
    selectedStyle: 'custom-style',
    transferStrength: 0.8,
    showStyleLibrary: true,
    showAdvancedControls: true,
  },
};