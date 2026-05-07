import type { Meta, StoryObj } from '@storybook/react';
import { GlassGANGenerator, type GANModel } from './GlassGANGenerator';

const mockGANModels: GANModel[] = [
  {
    id: 'stylegan2-faces',
    name: 'StyleGAN2 Faces',
    description: 'High-quality human face generation',
    type: 'stylegan',
    category: 'faces',
    resolution: 1024,
    latentDim: 512,
    trained: true
  },
  {
    id: 'dcgan-art',
    name: 'DCGAN Art',
    description: 'Abstract art generation',
    type: 'dcgan',
    category: 'art',
    resolution: 256,
    latentDim: 100,
    trained: true
  },
  {
    id: 'biggan-objects',
    name: 'BigGAN Objects',
    description: 'Conditional object generation',
    type: 'biggan',
    category: 'objects',
    resolution: 512,
    latentDim: 128,
    trained: true
  },
  {
    id: 'cyclegan-style',
    name: 'CycleGAN Style Transfer',
    description: 'Unpaired image-to-image translation',
    type: 'cyclegan',
    category: 'style_transfer',
    resolution: 256,
    latentDim: 256,
    trained: true
  },
  {
    id: 'progressive-landscapes',
    name: 'Progressive Landscapes',
    description: 'Landscape scene generation',
    type: 'progressive',
    category: 'landscapes',
    resolution: 512,
    latentDim: 256,
    trained: true
  },
  {
    id: 'stylegan3-general',
    name: 'StyleGAN3 General',
    description: 'General purpose image generation',
    type: 'stylegan',
    category: 'general',
    resolution: 512,
    latentDim: 512,
    trained: false
  }
];

const meta = {
  title: 'AI + Intelligence/Glass GANGenerator',
  component: GlassGANGenerator,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    maxGenerations: {
      control: { type: 'range', min: 4, max: 32, step: 4 },
    },
    canvasWidth: {
      control: { type: 'range', min: 128, max: 512, step: 32 },
    },
    canvasHeight: {
      control: { type: 'range', min: 128, max: 512, step: 32 },
    },
    showModelSelector: {
      control: 'boolean',
    },
    showGenerationControls: {
      control: 'boolean',
    },
    showTrainingControls: {
      control: 'boolean',
    },
    showLatentSpace: {
      control: 'boolean',
    },
    showProgress: {
      control: 'boolean',
    },
    enableInterpolation: {
      control: 'boolean',
    },
    enableRealTime: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof GlassGANGenerator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    availableModels: mockGANModels,
    selectedModel: 'stylegan2-faces',
    maxGenerations: 16,
    canvasWidth: 256,
    canvasHeight: 256,
    showModelSelector: true,
    showGenerationControls: true,
    showTrainingControls: true,
    showLatentSpace: true,
    showProgress: true,
    enableInterpolation: true,
    enableRealTime: false,
    generationParams: {
      seed: 42,
      truncation: 0.7,
      styleStrength: 1.0,
      noiseStrength: 0.5,
      batchSize: 4,
      interpolationSteps: 10,
    },
    trainingConfig: {
      epochs: 100,
      batchSize: 32,
      learningRate: 0.0002,
      beta1: 0.5,
      beta2: 0.999,
      discriminatorSteps: 1,
      generatorSteps: 1,
    },
  },
};

export const StyleGAN2Faces: Story = {
  args: {
    availableModels: mockGANModels.filter(m => m.type === 'stylegan'),
    selectedModel: 'stylegan2-faces',
    maxGenerations: 12,
    showModelSelector: true,
    showGenerationControls: true,
    showLatentSpace: true,
    enableInterpolation: true,
    generationParams: {
      truncation: 0.8,
      batchSize: 6,
    },
  },
};

export const DCGANArt: Story = {
  args: {
    availableModels: mockGANModels.filter(m => m.type === 'dcgan'),
    selectedModel: 'dcgan-art',
    maxGenerations: 16,
    showModelSelector: true,
    showGenerationControls: true,
    showLatentSpace: true,
    enableInterpolation: true,
    generationParams: {
      truncation: 1.0,
      styleStrength: 1.5,
      batchSize: 4,
    },
  },
};

export const BigGANObjects: Story = {
  args: {
    availableModels: mockGANModels.filter(m => m.type === 'biggan'),
    selectedModel: 'biggan-objects',
    maxGenerations: 20,
    showModelSelector: true,
    showGenerationControls: true,
    showLatentSpace: true,
    enableInterpolation: true,
    generationParams: {
      truncation: 0.5,
      batchSize: 8,
    },
  },
};

export const CycleGANStyleTransfer: Story = {
  args: {
    availableModels: mockGANModels.filter(m => m.type === 'cyclegan'),
    selectedModel: 'cyclegan-style',
    maxGenerations: 8,
    showModelSelector: true,
    showGenerationControls: true,
    showLatentSpace: false,
    enableInterpolation: false,
    generationParams: {
      styleStrength: 2.0,
      batchSize: 2,
    },
  },
};

export const ProgressiveGAN: Story = {
  args: {
    availableModels: mockGANModels.filter(m => m.type === 'progressive'),
    selectedModel: 'progressive-landscapes',
    maxGenerations: 12,
    canvasWidth: 512,
    canvasHeight: 512,
    showModelSelector: true,
    showGenerationControls: true,
    showLatentSpace: true,
    enableInterpolation: true,
    generationParams: {
      truncation: 0.6,
      batchSize: 3,
    },
  },
};

export const UntrainedModel: Story = {
  args: {
    availableModels: mockGANModels.filter(m => !m.trained),
    selectedModel: 'stylegan3-general',
    maxGenerations: 16,
    showModelSelector: true,
    showGenerationControls: true,
    showTrainingControls: true,
    showProgress: true,
    trainingConfig: {
      epochs: 50,
      batchSize: 16,
      learningRate: 0.001,
    },
  },
};

export const HighResolution: Story = {
  args: {
    availableModels: mockGANModels.filter(m => m.resolution >= 512),
    selectedModel: 'stylegan2-faces',
    maxGenerations: 8,
    canvasWidth: 512,
    canvasHeight: 512,
    showModelSelector: true,
    showGenerationControls: true,
    showLatentSpace: true,
    enableInterpolation: true,
    generationParams: {
      truncation: 0.7,
      batchSize: 2,
    },
  },
};

export const LowResolution: Story = {
  args: {
    availableModels: mockGANModels.filter(m => m.resolution <= 256),
    selectedModel: 'dcgan-art',
    maxGenerations: 24,
    canvasWidth: 128,
    canvasHeight: 128,
    showModelSelector: true,
    showGenerationControls: true,
    showLatentSpace: true,
    enableInterpolation: true,
    generationParams: {
      batchSize: 8,
    },
  },
};

export const RealTimeGeneration: Story = {
  args: {
    availableModels: mockGANModels.filter(m => m.trained && m.resolution <= 256),
    selectedModel: 'dcgan-art',
    maxGenerations: 20,
    showModelSelector: true,
    showGenerationControls: true,
    showLatentSpace: true,
    enableInterpolation: true,
    enableRealTime: true,
    generationParams: {
      batchSize: 2,
      truncation: 0.8,
    },
  },
};

export const InterpolationFocus: Story = {
  args: {
    availableModels: mockGANModels.filter(m => m.trained),
    selectedModel: 'stylegan2-faces',
    maxGenerations: 8,
    showModelSelector: false,
    showGenerationControls: true,
    showTrainingControls: false,
    showLatentSpace: true,
    enableInterpolation: true,
    generationParams: {
      batchSize: 2,
      interpolationSteps: 20,
    },
  },
};

export const TrainingMode: Story = {
  args: {
    availableModels: [
      ...mockGANModels.filter(m => m.trained),
      {
        id: 'custom-model',
        name: 'Custom GAN',
        description: 'User-defined GAN architecture',
        type: 'dcgan',
        category: 'general',
        resolution: 256,
        latentDim: 128,
        trained: false
      }
    ],
    selectedModel: 'custom-model',
    maxGenerations: 16,
    showModelSelector: true,
    showGenerationControls: false,
    showTrainingControls: true,
    showProgress: true,
    showLatentSpace: false,
    trainingConfig: {
      epochs: 200,
      batchSize: 64,
      learningRate: 0.0001,
      discriminatorSteps: 2,
      generatorSteps: 1,
    },
  },
};

export const LatentSpaceFocus: Story = {
  args: {
    availableModels: mockGANModels.filter(m => m.trained),
    selectedModel: 'stylegan2-faces',
    maxGenerations: 10,
    showModelSelector: false,
    showGenerationControls: true,
    showTrainingControls: false,
    showLatentSpace: true,
    enableInterpolation: true,
    generationParams: {
      batchSize: 1,
      truncation: 0.5,
    },
  },
};

export const MinimalInterface: Story = {
  args: {
    availableModels: mockGANModels.filter(m => m.trained).slice(0, 2),
    selectedModel: 'dcgan-art',
    maxGenerations: 8,
    showModelSelector: false,
    showGenerationControls: false,
    showTrainingControls: false,
    showLatentSpace: false,
    showProgress: false,
    enableInterpolation: false,
  },
};

export const BatchGeneration: Story = {
  args: {
    availableModels: mockGANModels.filter(m => m.trained),
    selectedModel: 'biggan-objects',
    maxGenerations: 32,
    showModelSelector: true,
    showGenerationControls: true,
    showProgress: true,
    generationParams: {
      batchSize: 8,
      truncation: 0.6,
    },
  },
};

export const HighTruncation: Story = {
  args: {
    availableModels: mockGANModels.filter(m => m.trained),
    selectedModel: 'stylegan2-faces',
    maxGenerations: 12,
    showGenerationControls: true,
    showLatentSpace: true,
    enableInterpolation: true,
    generationParams: {
      truncation: 1.5,
      styleStrength: 1.2,
      batchSize: 4,
    },
  },
};

export const LowTruncation: Story = {
  args: {
    availableModels: mockGANModels.filter(m => m.trained),
    selectedModel: 'stylegan2-faces',
    maxGenerations: 12,
    showGenerationControls: true,
    showLatentSpace: true,
    enableInterpolation: true,
    generationParams: {
      truncation: 0.3,
      styleStrength: 0.8,
      batchSize: 4,
    },
  },
};

export const FaceGeneration: Story = {
  args: {
    availableModels: mockGANModels.filter(m => m.category === 'faces'),
    selectedModel: 'stylegan2-faces',
    maxGenerations: 16,
    canvasWidth: 512,
    canvasHeight: 512,
    showModelSelector: false,
    showGenerationControls: true,
    showLatentSpace: true,
    enableInterpolation: true,
    generationParams: {
      truncation: 0.7,
      batchSize: 4,
    },
  },
};

export const ArtGeneration: Story = {
  args: {
    availableModels: mockGANModels.filter(m => m.category === 'art'),
    selectedModel: 'dcgan-art',
    maxGenerations: 20,
    showModelSelector: false,
    showGenerationControls: true,
    showLatentSpace: true,
    enableInterpolation: true,
    generationParams: {
      truncation: 1.2,
      styleStrength: 1.5,
      batchSize: 5,
    },
  },
};

export const ObjectGeneration: Story = {
  args: {
    availableModels: mockGANModels.filter(m => m.category === 'objects'),
    selectedModel: 'biggan-objects',
    maxGenerations: 24,
    showModelSelector: false,
    showGenerationControls: true,
    showLatentSpace: true,
    enableInterpolation: true,
    generationParams: {
      truncation: 0.6,
      batchSize: 6,
    },
  },
};

export const LandscapeGeneration: Story = {
  args: {
    availableModels: mockGANModels.filter(m => m.category === 'landscapes'),
    selectedModel: 'progressive-landscapes',
    maxGenerations: 12,
    canvasWidth: 512,
    canvasHeight: 512,
    showModelSelector: false,
    showGenerationControls: true,
    showLatentSpace: true,
    enableInterpolation: true,
    generationParams: {
      truncation: 0.8,
      batchSize: 3,
    },
  },
};

export const StyleTransferMode: Story = {
  args: {
    availableModels: mockGANModels.filter(m => m.category === 'style_transfer'),
    selectedModel: 'cyclegan-style',
    maxGenerations: 8,
    showModelSelector: false,
    showGenerationControls: true,
    showLatentSpace: false,
    enableInterpolation: false,
    generationParams: {
      styleStrength: 2.0,
      batchSize: 2,
    },
  },
};

export const AllModelsAvailable: Story = {
  args: {
    availableModels: mockGANModels,
    selectedModel: 'stylegan2-faces',
    maxGenerations: 16,
    showModelSelector: true,
    showGenerationControls: true,
    showTrainingControls: true,
    showLatentSpace: true,
    showProgress: true,
    enableInterpolation: true,
    enableRealTime: false,
  },
};

export const FastGeneration: Story = {
  args: {
    availableModels: mockGANModels.filter(m => m.resolution <= 256),
    selectedModel: 'dcgan-art',
    maxGenerations: 32,
    canvasWidth: 128,
    canvasHeight: 128,
    showProgress: true,
    enableRealTime: true,
    generationParams: {
      batchSize: 8,
      truncation: 1.0,
    },
  },
};

export const SlowHighQuality: Story = {
  args: {
    availableModels: mockGANModels.filter(m => m.resolution >= 512),
    selectedModel: 'stylegan2-faces',
    maxGenerations: 4,
    canvasWidth: 512,
    canvasHeight: 512,
    showProgress: true,
    enableRealTime: false,
    generationParams: {
      batchSize: 1,
      truncation: 0.7,
    },
  },
};