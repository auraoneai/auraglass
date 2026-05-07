import type { Meta, StoryObj } from '@storybook/react';
import { GlassGenerativeArt, type ArtPrompt } from './GlassGenerativeArt';

const mockArtPrompts: ArtPrompt[] = [
  {
    id: 'cosmic-abstract',
    text: 'Cosmic abstract painting with swirling galaxies and nebulae in vibrant colors',
    style: 'abstract expressionism',
    category: 'abstract',
    tags: ['space', 'cosmic', 'vibrant', 'swirling']
  },
  {
    id: 'cyberpunk-city',
    text: 'Cyberpunk cityscape at night with neon lights reflecting on wet streets',
    style: 'digital art',
    category: 'architecture',
    tags: ['cyberpunk', 'neon', 'city', 'night']
  },
  {
    id: 'ethereal-portrait',
    text: 'Ethereal portrait of a person made of flowing light and energy',
    style: 'digital painting',
    category: 'portrait',
    tags: ['ethereal', 'light', 'energy', 'flowing']
  },
  {
    id: 'surreal-landscape',
    text: 'Surreal landscape with floating islands and impossible waterfalls',
    style: 'surrealism',
    category: 'landscape',
    tags: ['surreal', 'floating', 'impossible', 'waterfalls']
  },
  {
    id: 'biomech-fusion',
    text: 'Biomechanical fusion of organic forms and technological components',
    style: 'biomechanical art',
    category: 'surreal',
    tags: ['biomechanical', 'organic', 'technology', 'fusion']
  },
  {
    id: 'ocean-depths',
    text: 'Deep ocean scene with bioluminescent creatures and coral reefs',
    style: 'photorealistic',
    category: 'nature',
    tags: ['ocean', 'bioluminescent', 'coral', 'deep']
  }
];

const meta = {
  title: 'AI + Intelligence/Glass Generative Art',
  component: GlassGenerativeArt,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    prompt: {
      control: 'text',
    },
    showPromptLibrary: {
      control: 'boolean',
    },
    showAdvancedSettings: {
      control: 'boolean',
    },
    showGenerationHistory: {
      control: 'boolean',
    },
    enableIterativeGeneration: {
      control: 'boolean',
    },
    enablePromptEnhancement: {
      control: 'boolean',
    },
    enableStyleMixing: {
      control: 'boolean',
    },
    realTimeGeneration: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof GlassGenerativeArt>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    prompt: 'A majestic dragon soaring through a cosmic nebula',
    suggestions: mockArtPrompts,
    showPromptLibrary: true,
    showAdvancedSettings: true,
    showGenerationHistory: true,
    enableIterativeGeneration: true,
    enablePromptEnhancement: true,
    enableStyleMixing: false,
    realTimeGeneration: false,
  },
};

export const MinimalInterface: Story = {
  args: {
    prompt: 'Peaceful zen garden with cherry blossoms',
    suggestions: mockArtPrompts.slice(0, 3),
    showPromptLibrary: false,
    showAdvancedSettings: false,
    showGenerationHistory: false,
    enablePromptEnhancement: true,
    realTimeGeneration: false,
  },
};

export const PromptLibraryFocus: Story = {
  args: {
    prompt: '',
    suggestions: mockArtPrompts,
    showPromptLibrary: true,
    showAdvancedSettings: false,
    showGenerationHistory: false,
    enablePromptEnhancement: true,
    realTimeGeneration: false,
  },
};

export const AdvancedMode: Story = {
  args: {
    prompt: 'Futuristic city with flying cars and holographic displays',
    suggestions: mockArtPrompts,
    showPromptLibrary: true,
    showAdvancedSettings: true,
    showGenerationHistory: true,
    enableIterativeGeneration: true,
    enablePromptEnhancement: true,
    enableStyleMixing: true,
    realTimeGeneration: false,
    generationSettings: {
      model: 'stable-diffusion',
      style: 'cyberpunk',
      resolution: '1024x1024',
      steps: 30,
      guidance: 8.5,
      iterations: 2,
    },
  },
};

export const RealTimeGeneration: Story = {
  args: {
    prompt: 'Abstract geometric patterns with vibrant colors',
    suggestions: mockArtPrompts,
    showPromptLibrary: true,
    showAdvancedSettings: true,
    showGenerationHistory: true,
    enablePromptEnhancement: true,
    realTimeGeneration: true,
  },
};

export const AbstractArtFocus: Story = {
  args: {
    prompt: 'Flowing abstract forms with gradient colors and dynamic movement',
    suggestions: mockArtPrompts.filter(p => p.category === 'abstract'),
    showPromptLibrary: true,
    showAdvancedSettings: true,
    enablePromptEnhancement: true,
    generationSettings: {
      style: 'abstract expressionism',
      steps: 25,
      guidance: 7.0,
    },
  },
};

export const PortraitMode: Story = {
  args: {
    prompt: 'Portrait of a wise elder with kind eyes and weathered features',
    suggestions: mockArtPrompts.filter(p => p.category === 'portrait'),
    showPromptLibrary: true,
    showAdvancedSettings: true,
    enablePromptEnhancement: true,
    generationSettings: {
      style: 'photorealistic',
      resolution: '768x768',
      steps: 35,
      guidance: 9.0,
    },
  },
};

export const LandscapeMode: Story = {
  args: {
    prompt: 'Majestic mountain range at sunset with golden light',
    suggestions: mockArtPrompts.filter(p => p.category === 'landscape'),
    showPromptLibrary: true,
    showAdvancedSettings: true,
    enablePromptEnhancement: true,
    generationSettings: {
      style: 'photorealistic',
      resolution: '1920x1080',
      steps: 30,
      guidance: 7.5,
    },
  },
};

export const SurrealArt: Story = {
  args: {
    prompt: 'Melting clocks in a dreamlike landscape with impossible architecture',
    suggestions: mockArtPrompts.filter(p => p.category === 'surreal'),
    showPromptLibrary: true,
    showAdvancedSettings: true,
    enablePromptEnhancement: true,
    generationSettings: {
      style: 'surrealism',
      steps: 40,
      guidance: 8.0,
    },
  },
};

export const NatureTheme: Story = {
  args: {
    prompt: 'Enchanted forest with magical creatures and glowing mushrooms',
    suggestions: mockArtPrompts.filter(p => p.category === 'nature'),
    showPromptLibrary: true,
    showAdvancedSettings: true,
    enablePromptEnhancement: true,
    generationSettings: {
      style: 'fantasy art',
      resolution: '768x768',
      steps: 28,
      guidance: 7.5,
    },
  },
};

export const HighQualityMode: Story = {
  args: {
    prompt: 'Detailed architectural interior with ornate decorations',
    suggestions: mockArtPrompts,
    showPromptLibrary: true,
    showAdvancedSettings: true,
    showGenerationHistory: true,
    enablePromptEnhancement: true,
    generationSettings: {
      model: 'dall-e',
      style: 'photorealistic',
      resolution: '1024x1024',
      steps: 50,
      guidance: 10.0,
      iterations: 1,
    },
  },
};

export const MultipleIterations: Story = {
  args: {
    prompt: 'Colorful bird in tropical paradise',
    suggestions: mockArtPrompts,
    showPromptLibrary: true,
    showAdvancedSettings: true,
    enableIterativeGeneration: true,
    enablePromptEnhancement: true,
    generationSettings: {
      iterations: 4,
      steps: 25,
      guidance: 7.5,
    },
  },
};

export const StyleMixing: Story = {
  args: {
    prompt: 'Modern city skyline in impressionist painting style',
    suggestions: mockArtPrompts,
    showPromptLibrary: true,
    showAdvancedSettings: true,
    enableStyleMixing: true,
    enablePromptEnhancement: true,
    generationSettings: {
      style: 'impressionism',
      steps: 35,
      guidance: 8.0,
    },
  },
};

export const PromptEnhancementDisabled: Story = {
  args: {
    prompt: 'Simple drawing of a cat',
    suggestions: mockArtPrompts,
    showPromptLibrary: true,
    showAdvancedSettings: true,
    enablePromptEnhancement: false,
    realTimeGeneration: false,
  },
};

export const CustomModel: Story = {
  args: {
    prompt: 'Anime character with magical powers',
    suggestions: mockArtPrompts,
    showPromptLibrary: true,
    showAdvancedSettings: true,
    enablePromptEnhancement: true,
    generationSettings: {
      model: 'custom',
      style: 'anime',
      resolution: '768x768',
      steps: 30,
      guidance: 8.0,
    },
  },
};

export const HistoryFocus: Story = {
  args: {
    prompt: 'Generated artwork example',
    suggestions: mockArtPrompts.slice(0, 2),
    showPromptLibrary: false,
    showAdvancedSettings: false,
    showGenerationHistory: true,
    enablePromptEnhancement: true,
  },
};

export const WideAspectRatio: Story = {
  args: {
    prompt: 'Panoramic view of alien planet with multiple moons',
    suggestions: mockArtPrompts,
    showPromptLibrary: true,
    showAdvancedSettings: true,
    enablePromptEnhancement: true,
    generationSettings: {
      resolution: '1920x1080',
      style: 'sci-fi',
      steps: 32,
      guidance: 7.8,
    },
  },
};

export const LowGuidance: Story = {
  args: {
    prompt: 'Creative interpretation of music as visual art',
    suggestions: mockArtPrompts,
    showPromptLibrary: true,
    showAdvancedSettings: true,
    enablePromptEnhancement: true,
    generationSettings: {
      guidance: 3.0,
      steps: 40,
      style: 'abstract expressionism',
    },
  },
};

export const HighGuidance: Story = {
  args: {
    prompt: 'Precise technical blueprint of futuristic machine',
    suggestions: mockArtPrompts,
    showPromptLibrary: true,
    showAdvancedSettings: true,
    enablePromptEnhancement: true,
    generationSettings: {
      guidance: 15.0,
      steps: 35,
      style: 'technical illustration',
    },
  },
};