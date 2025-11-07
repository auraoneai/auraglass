import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import {
    EnhancedGlassButton,
    ImmersiveGlassButton,
    PhysicsGlassButton,
    SmartAdaptiveButton,
    UltraEnhancedButton,
    VRGlassButton,
} from './EnhancedGlassButton';

const meta: Meta<typeof EnhancedGlassButton> = {
  title: 'Components/Button/EnhancedGlassButton',
  component: EnhancedGlassButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Advanced button component integrating physics engines, AI personalization, and consciousness features.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'destructive', 'ghost', 'outline'],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    enhancedFeatures: {
      control: 'object',
    },
    userId: {
      control: 'text',
    },
    componentId: {
      control: 'text',
    },
  },
  args: {
    children: 'Enhanced Button',
    variant: 'primary',
    size: 'md',
    userId: 'demo-user',
    componentId: 'enhanced-button-demo',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Enhanced Glass Button',
  },
};

export const Physics: Story = {
  args: {
    children: 'Physics Button',
    enhancedFeatures: {
      physics: {
        enabled: true,
        interaction: 'ripple',
        intensity: 1.2,
      },
      organicMotion: {
        enabled: true,
        patterns: ['interactive'],
      },
    },
  },
};

export const Morphing: Story = {
  args: {
    children: 'Morphing Button',
    enhancedFeatures: {
      morphing: {
        enabled: true,
        environmentalAdaptation: true,
        userActivityAdaptation: true,
      },
      physics: {
        enabled: true,
        interaction: 'ripple',
      },
    },
  },
};

export const Spatial3D: Story = {
  args: {
    children: '3D Button',
    enhancedFeatures: {
      spatial3D: {
        enabled: true,
        layers: 6,
        parallax: true,
        holographic: true,
      },
      physics: {
        enabled: true,
        interaction: 'ripple',
      },
    },
  },
};

export const EmotionalAdaptation: Story = {
  args: {
    children: 'Emotional Button',
    enhancedFeatures: {
      emotionalAdaptation: {
        enabled: true,
        biometricTracking: true,
        behaviorAnalysis: true,
        uiAdaptation: true,
      },
      organicMotion: {
        enabled: true,
        patterns: ['gentle'],
        emotionalContext: 'calm',
      },
    },
  },
};

export const AIPersonalization: Story = {
  args: {
    children: 'AI Button',
    enhancedFeatures: {
      aiPersonalization: {
        enabled: true,
        learningMode: 'adaptive',
        recommendationLevel: 'comprehensive',
      },
      emotionalAdaptation: {
        enabled: true,
        behaviorAnalysis: true,
      },
    },
  },
};

export const FullyEnhanced: Story = {
  args: {
    children: 'Ultra Enhanced',
    enhancedFeatures: {
      physics: {
        enabled: true,
        interaction: 'ripple',
        intensity: 1.5,
      },
      morphing: {
        enabled: true,
        environmentalAdaptation: true,
        userActivityAdaptation: true,
      },
      spatial3D: {
        enabled: true,
        layers: 6,
        parallax: true,
        holographic: true,
      },
      organicMotion: {
        enabled: true,
        patterns: ['gentle', 'energetic', 'interactive'],
        enableMicroInteractions: true,
      },
      emotionalAdaptation: {
        enabled: true,
        biometricTracking: true,
        behaviorAnalysis: true,
        uiAdaptation: true,
      },
      aiPersonalization: {
        enabled: true,
        learningMode: 'adaptive',
        recommendationLevel: 'comprehensive',
      },
    },
  },
};

// Pre-configured variants
export const PhysicsButton: Story = {
  render: (args) => (
    <PhysicsGlassButton {...args}>
      Physics Button
    </PhysicsGlassButton>
  ),
};

export const ImmersiveButton: Story = {
  render: (args) => (
    <ImmersiveGlassButton {...args}>
      Immersive Button
    </ImmersiveGlassButton>
  ),
};

export const VRButton: Story = {
  render: (args) => (
    <VRGlassButton {...args}>
      VR Button
    </VRGlassButton>
  ),
};

export const SmartAdaptiveButtonStory: Story = {
  render: (args) => (
    <SmartAdaptiveButton {...args}>
      Smart Adaptive
    </SmartAdaptiveButton>
  ),
};

export const UltraEnhancedButtonStory: Story = {
  render: (args) => (
    <UltraEnhancedButton {...args}>
      Ultra Enhanced
    </UltraEnhancedButton>
  ),
};

// Interactive demonstrations
export const InteractiveDemo: Story = {
  args: {
    children: 'Interactive Demo',
    enhancedFeatures: {
      physics: { enabled: true, interaction: 'ripple' },
      organicMotion: { enabled: true, enableMicroInteractions: true },
      emotionalAdaptation: { enabled: true },
      aiPersonalization: { enabled: true },
    },
    onAdvancedInteraction: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive demonstration showing advanced features. Check the console for interaction events.',
      },
    },
  },
};

export const Variants: Story = {
  render: () => (
    <div className="space-x-4">
      <EnhancedGlassButton variant="primary">Primary</EnhancedGlassButton>
      <EnhancedGlassButton variant="secondary">Secondary</EnhancedGlassButton>
      <EnhancedGlassButton variant="destructive">Destructive</EnhancedGlassButton>
      <EnhancedGlassButton variant="ghost">Ghost</EnhancedGlassButton>
      <EnhancedGlassButton variant="outline">Outline</EnhancedGlassButton>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All available button variants with enhanced features.',
      },
    },
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="space-x-4 flex items-center">
      <EnhancedGlassButton size="xs">XS</EnhancedGlassButton>
      <EnhancedGlassButton size="sm">Small</EnhancedGlassButton>
      <EnhancedGlassButton size="md">Medium</EnhancedGlassButton>
      <EnhancedGlassButton size="lg">Large</EnhancedGlassButton>
      <EnhancedGlassButton size="xl">XL</EnhancedGlassButton>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All available button sizes.',
      },
    },
  },
};

export const Playground: Story = {
  args: {
    children: 'Playground Button',
    enhancedFeatures: {
      physics: {
        enabled: true,
        interaction: 'ripple',
        intensity: 1,
      },
      morphing: {
        enabled: false,
        environmentalAdaptation: false,
      },
      spatial3D: {
        enabled: false,
        holographic: false,
      },
      organicMotion: {
        enabled: true,
        patterns: ['gentle'],
      },
      emotionalAdaptation: {
        enabled: false,
      },
      aiPersonalization: {
        enabled: false,
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Playground to experiment with different enhanced features. Use the controls panel to enable/disable features.',
      },
    },
  },
};