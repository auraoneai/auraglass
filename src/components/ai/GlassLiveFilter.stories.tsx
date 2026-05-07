import type { Meta, StoryObj } from '@storybook/react';
import { GlassLiveFilter, type FilterEffect } from './GlassLiveFilter';

const customFilters: FilterEffect[] = [
  {
    id: 'grayscale',
    name: 'Grayscale',
    description: 'Convert to black and white',
    category: 'color',
    intensity: 1.0,
    parameters: { strength: 1.0 }
  },
  {
    id: 'sepia',
    name: 'Sepia',
    description: 'Vintage sepia tone effect',
    category: 'vintage',
    intensity: 0.8,
    parameters: { warmth: 0.8 }
  },
  {
    id: 'blur',
    name: 'Gaussian Blur',
    description: 'Smooth blur effect',
    category: 'blur',
    intensity: 1.0,
    parameters: { radius: 5 }
  },
  {
    id: 'brightness',
    name: 'Brightness',
    description: 'Adjust image brightness',
    category: 'color',
    intensity: 1.2,
    parameters: { level: 1.2 }
  },
  {
    id: 'contrast',
    name: 'Contrast',
    description: 'Adjust image contrast',
    category: 'color',
    intensity: 1.3,
    parameters: { level: 1.3 }
  },
  {
    id: 'edge-detect',
    name: 'Edge Detection',
    description: 'Detect and highlight edges',
    category: 'artistic',
    intensity: 1.0,
    parameters: { threshold: 0.5 }
  },
  {
    id: 'vintage',
    name: 'Vintage Film',
    description: 'Old film camera effect',
    category: 'vintage',
    intensity: 0.9,
    parameters: { grain: 0.3, vignette: 0.5 }
  },
  {
    id: 'neon',
    name: 'Neon Glow',
    description: 'Cyberpunk neon effect',
    category: 'modern',
    intensity: 1.2,
    parameters: { glow: 1.2, color: '#ff00ff' }
  }
];

const meta = {
  title: 'AI + Intelligence/Glass Live Filter',
  component: GlassLiveFilter,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    canvasWidth: {
      control: { type: 'range', min: 400, max: 1200, step: 50 },
    },
    canvasHeight: {
      control: { type: 'range', min: 300, max: 800, step: 50 },
    },
    maxFilters: {
      control: { type: 'range', min: 1, max: 10, step: 1 },
    },
    showFilterLibrary: {
      control: 'boolean',
    },
    showPreview: {
      control: 'boolean',
    },
    showControls: {
      control: 'boolean',
    },
    enableRealTimeProcessing: {
      control: 'boolean',
    },
    enableChaining: {
      control: 'boolean',
    },
    enableCustomFilters: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof GlassLiveFilter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    availableFilters: customFilters,
    selectedFilters: ['brightness'],
    canvasWidth: 800,
    canvasHeight: 600,
    showFilterLibrary: true,
    showPreview: true,
    showControls: true,
    enableRealTimeProcessing: true,
    enableChaining: true,
    enableCustomFilters: false,
    maxFilters: 5,
    processingSettings: {
      quality: 'medium',
      fps: 30,
      enableGPU: true,
      batchSize: 4,
    },
  },
};

export const ColorFilters: Story = {
  args: {
    availableFilters: customFilters.filter(f => f.category === 'color'),
    selectedFilters: ['brightness', 'contrast'],
    canvasWidth: 800,
    canvasHeight: 600,
    showFilterLibrary: true,
    showPreview: true,
    showControls: true,
    enableRealTimeProcessing: true,
    enableChaining: true,
    maxFilters: 3,
  },
};

export const ArtisticFilters: Story = {
  args: {
    availableFilters: customFilters.filter(f => f.category === 'artistic'),
    selectedFilters: ['edge-detect'],
    canvasWidth: 800,
    canvasHeight: 600,
    showFilterLibrary: true,
    showPreview: true,
    showControls: true,
    enableRealTimeProcessing: true,
    enableChaining: true,
    maxFilters: 3,
  },
};

export const VintageFilters: Story = {
  args: {
    availableFilters: customFilters.filter(f => f.category === 'vintage'),
    selectedFilters: ['sepia', 'vintage'],
    canvasWidth: 800,
    canvasHeight: 600,
    showFilterLibrary: true,
    showPreview: true,
    showControls: true,
    enableRealTimeProcessing: false,
    enableChaining: true,
    maxFilters: 3,
  },
};

export const BlurEffects: Story = {
  args: {
    availableFilters: customFilters.filter(f => f.category === 'blur'),
    selectedFilters: ['blur'],
    canvasWidth: 800,
    canvasHeight: 600,
    showFilterLibrary: true,
    showPreview: true,
    showControls: true,
    enableRealTimeProcessing: true,
    enableChaining: false,
    maxFilters: 2,
  },
};

export const ModernEffects: Story = {
  args: {
    availableFilters: customFilters.filter(f => f.category === 'modern'),
    selectedFilters: ['neon'],
    canvasWidth: 800,
    canvasHeight: 600,
    showFilterLibrary: true,
    showPreview: true,
    showControls: true,
    enableRealTimeProcessing: true,
    enableChaining: true,
    maxFilters: 3,
  },
};

export const HighQualityProcessing: Story = {
  args: {
    availableFilters: customFilters,
    selectedFilters: ['contrast', 'edge-detect'],
    canvasWidth: 1000,
    canvasHeight: 800,
    showFilterLibrary: true,
    showPreview: true,
    showControls: true,
    enableRealTimeProcessing: false,
    enableChaining: true,
    maxFilters: 8,
    processingSettings: {
      quality: 'ultra',
      fps: 60,
      enableGPU: true,
      batchSize: 8,
    },
  },
};

export const LowQualityFast: Story = {
  args: {
    availableFilters: customFilters,
    selectedFilters: ['grayscale'],
    canvasWidth: 600,
    canvasHeight: 400,
    showFilterLibrary: true,
    showPreview: true,
    showControls: true,
    enableRealTimeProcessing: true,
    enableChaining: true,
    maxFilters: 3,
    processingSettings: {
      quality: 'low',
      fps: 15,
      enableGPU: false,
      batchSize: 2,
    },
  },
};

export const MinimalInterface: Story = {
  args: {
    availableFilters: customFilters.slice(0, 4),
    selectedFilters: ['sepia'],
    canvasWidth: 600,
    canvasHeight: 400,
    showFilterLibrary: false,
    showPreview: true,
    showControls: false,
    enableRealTimeProcessing: true,
    enableChaining: false,
    maxFilters: 2,
  },
};

export const PreviewOnly: Story = {
  args: {
    availableFilters: customFilters,
    selectedFilters: ['vintage', 'blur'],
    canvasWidth: 800,
    canvasHeight: 600,
    showFilterLibrary: false,
    showPreview: true,
    showControls: false,
    enableRealTimeProcessing: false,
    enableChaining: true,
    maxFilters: 3,
  },
};

export const FilterLibraryFocus: Story = {
  args: {
    availableFilters: customFilters,
    selectedFilters: [],
    canvasWidth: 400,
    canvasHeight: 300,
    showFilterLibrary: true,
    showPreview: false,
    showControls: true,
    enableRealTimeProcessing: true,
    enableChaining: true,
    maxFilters: 5,
  },
};

export const CustomFiltersEnabled: Story = {
  args: {
    availableFilters: customFilters,
    selectedFilters: ['brightness', 'neon'],
    canvasWidth: 800,
    canvasHeight: 600,
    showFilterLibrary: true,
    showPreview: true,
    showControls: true,
    enableRealTimeProcessing: true,
    enableChaining: true,
    enableCustomFilters: true,
    maxFilters: 7,
  },
};

export const MaxFiltersReached: Story = {
  args: {
    availableFilters: customFilters,
    selectedFilters: ['grayscale', 'sepia', 'blur', 'brightness', 'contrast'],
    canvasWidth: 800,
    canvasHeight: 600,
    showFilterLibrary: true,
    showPreview: true,
    showControls: true,
    enableRealTimeProcessing: true,
    enableChaining: true,
    maxFilters: 5,
  },
};

export const SingleFilterMode: Story = {
  args: {
    availableFilters: customFilters,
    selectedFilters: ['edge-detect'],
    canvasWidth: 800,
    canvasHeight: 600,
    showFilterLibrary: true,
    showPreview: true,
    showControls: true,
    enableRealTimeProcessing: true,
    enableChaining: false,
    maxFilters: 1,
  },
};

export const ChainedFilters: Story = {
  args: {
    availableFilters: customFilters,
    selectedFilters: ['brightness', 'contrast', 'sepia', 'vintage'],
    canvasWidth: 800,
    canvasHeight: 600,
    showFilterLibrary: true,
    showPreview: true,
    showControls: true,
    enableRealTimeProcessing: false,
    enableChaining: true,
    maxFilters: 6,
  },
};

export const GPUAccelerated: Story = {
  args: {
    availableFilters: customFilters,
    selectedFilters: ['blur', 'edge-detect', 'neon'],
    canvasWidth: 1000,
    canvasHeight: 800,
    showFilterLibrary: true,
    showPreview: true,
    showControls: true,
    enableRealTimeProcessing: true,
    enableChaining: true,
    maxFilters: 5,
    processingSettings: {
      quality: 'high',
      fps: 60,
      enableGPU: true,
      batchSize: 8,
    },
  },
};

export const CPUProcessing: Story = {
  args: {
    availableFilters: customFilters,
    selectedFilters: ['grayscale', 'brightness'],
    canvasWidth: 600,
    canvasHeight: 400,
    showFilterLibrary: true,
    showPreview: true,
    showControls: true,
    enableRealTimeProcessing: true,
    enableChaining: true,
    maxFilters: 3,
    processingSettings: {
      quality: 'medium',
      fps: 30,
      enableGPU: false,
      batchSize: 2,
    },
  },
};

export const HighFrameRate: Story = {
  args: {
    availableFilters: customFilters,
    selectedFilters: ['brightness', 'contrast'],
    canvasWidth: 800,
    canvasHeight: 600,
    showFilterLibrary: true,
    showPreview: true,
    showControls: true,
    enableRealTimeProcessing: true,
    enableChaining: true,
    maxFilters: 4,
    processingSettings: {
      quality: 'medium',
      fps: 60,
      enableGPU: true,
      batchSize: 6,
    },
  },
};

export const LowFrameRate: Story = {
  args: {
    availableFilters: customFilters,
    selectedFilters: ['vintage', 'blur', 'edge-detect'],
    canvasWidth: 800,
    canvasHeight: 600,
    showFilterLibrary: true,
    showPreview: true,
    showControls: true,
    enableRealTimeProcessing: true,
    enableChaining: true,
    maxFilters: 5,
    processingSettings: {
      quality: 'high',
      fps: 10,
      enableGPU: true,
      batchSize: 2,
    },
  },
};

export const WideCanvas: Story = {
  args: {
    availableFilters: customFilters,
    selectedFilters: ['sepia', 'contrast'],
    canvasWidth: 1200,
    canvasHeight: 400,
    showFilterLibrary: true,
    showPreview: true,
    showControls: true,
    enableRealTimeProcessing: true,
    enableChaining: true,
    maxFilters: 5,
  },
};

export const TallCanvas: Story = {
  args: {
    availableFilters: customFilters,
    selectedFilters: ['brightness', 'edge-detect'],
    canvasWidth: 400,
    canvasHeight: 800,
    showFilterLibrary: true,
    showPreview: true,
    showControls: true,
    enableRealTimeProcessing: true,
    enableChaining: true,
    maxFilters: 5,
  },
};

export const SmallCanvas: Story = {
  args: {
    availableFilters: customFilters.slice(0, 6),
    selectedFilters: ['grayscale'],
    canvasWidth: 400,
    canvasHeight: 300,
    showFilterLibrary: true,
    showPreview: true,
    showControls: true,
    enableRealTimeProcessing: true,
    enableChaining: true,
    maxFilters: 3,
  },
};

export const LargeCanvas: Story = {
  args: {
    availableFilters: customFilters,
    selectedFilters: ['vintage', 'neon'],
    canvasWidth: 1200,
    canvasHeight: 900,
    showFilterLibrary: true,
    showPreview: true,
    showControls: true,
    enableRealTimeProcessing: false,
    enableChaining: true,
    maxFilters: 8,
    processingSettings: {
      quality: 'ultra',
      fps: 30,
      enableGPU: true,
      batchSize: 8,
    },
  },
};

export const NoFiltersSelected: Story = {
  args: {
    availableFilters: customFilters,
    selectedFilters: [],
    canvasWidth: 800,
    canvasHeight: 600,
    showFilterLibrary: true,
    showPreview: true,
    showControls: true,
    enableRealTimeProcessing: true,
    enableChaining: true,
    maxFilters: 5,
  },
};

export const AllFiltersSelected: Story = {
  args: {
    availableFilters: customFilters,
    selectedFilters: customFilters.map(f => f.id),
    canvasWidth: 800,
    canvasHeight: 600,
    showFilterLibrary: true,
    showPreview: true,
    showControls: true,
    enableRealTimeProcessing: false,
    enableChaining: true,
    maxFilters: 10,
  },
};