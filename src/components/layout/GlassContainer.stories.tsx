import type { Meta, StoryObj } from '@storybook/react';
import { GlassPredictiveEngineProvider } from '../advanced/GlassPredictiveEngine';
import {
    ConsciousGlassContainer,
    ConsciousnessPresets,
    GlassContainer
} from './GlassContainer';

const meta: Meta<typeof GlassContainer> = {
  title: 'Components/Layout/GlassContainer',
  component: GlassContainer,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A responsive container with glassmorphism styling and consciousness interface integration for intelligent, adaptive user experiences.',
      },
    },
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl', 'full'],
      description: 'Container size',
    },
    padding: {
      control: 'select',
      options: ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'],
      description: 'Container padding',
    },
    variant: {
      control: 'select',
      options: ['default', 'fluid', 'breakout'],
      description: 'Container variant',
    },
    glass: {
      control: 'boolean',
      description: 'Enable glassmorphism background',
    },
    elevation: {
      control: 'select',
      options: [0, 1, 2, 3, 4, 'float', 'modal'],
      description: 'Glass elevation level',
    },
    radius: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'xl', '2xl', 'full'],
      description: 'Border radius',
    },
    // Consciousness feature controls
    predictive: {
      control: 'boolean',
      description: 'Enable predictive UI features',
    },
    preloadContent: {
      control: 'boolean',
      description: 'Enable content preloading',
    },
    eyeTracking: {
      control: 'boolean',
      description: 'Enable eye tracking integration',
    },
    gazeResponsive: {
      control: 'boolean',
      description: 'Enable gaze-responsive features',
    },
    adaptive: {
      control: 'boolean',
      description: 'Enable biometric adaptation',
    },
    biometricResponsive: {
      control: 'boolean',
      description: 'Enable biometric responsive features',
    },
    spatialAudio: {
      control: 'boolean',
      description: 'Enable spatial audio',
    },
    audioFeedback: {
      control: 'boolean',
      description: 'Enable audio feedback',
    },
    trackAchievements: {
      control: 'boolean',
      description: 'Enable achievement tracking',
    },
    usageContext: {
      control: 'select',
      options: ['main', 'sidebar', 'modal', 'card', 'list', 'form'],
      description: 'Container usage context',
    },
  },
  args: {
    size: 'lg',
    padding: 'md',
    variant: 'default',
    glass: false,
    elevation: 1,
    radius: 'none',
    centered: true,
  },
  decorators: [
    (Story) => (
      <GlassPredictiveEngineProvider
        onPrediction={(prediction) => console.log('Prediction:', prediction)}
        onInsight={(insight) => console.log('Insight:', insight)}
      >
        <div className="glass-min-h-screen glass-gradient-primary glass-gradient-primary via-purple-900 glass-gradient-primary p-8">
          <Story />
        </div>
      </GlassPredictiveEngineProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof GlassContainer>;

export const Default: Story = {
  args: {
    children: (
      <div className="p-8 text-primary">
        <h2 className="text-2xl font-bold mb-4">Default Container</h2>
        <p className="text-primary/80 mb-4">
          A standard glass container with basic functionality.
        </p>
        <div className="w-full h-32 glass-surface-subtle/10 glass-radius-lg flex items-center justify-center">
          <span className="text-primary/60">Container Content</span>
        </div>
      </div>
    ),
  },
};

export const WithGlass: Story = {
  args: {
    glass: true,
    elevation: 'float',
    radius: 'lg',
    children: (
      <div className="p-8 text-primary">
        <h2 className="text-2xl font-bold mb-4">Glass Container</h2>
        <p className="text-primary/80 mb-4">
          A glass container with glassmorphism background and elevated appearance.
        </p>
        <div className="w-full h-32 glass-surface-subtle/5 glass-radius-lg flex items-center justify-center border border-white/10">
          <span className="text-primary/60">Glassmorphic Content</span>
        </div>
      </div>
    ),
  },
};

export const PredictiveContainer: Story = {
  args: {
    glass: true,
    elevation: 2,
    radius: 'lg',
    predictive: true,
    preloadContent: true,
    trackAchievements: true,
    usageContext: 'main',
    achievementId: 'predictive_container_demo',
    children: (
      <div className="p-8 text-primary">
        <h2 className="text-2xl font-bold mb-4">🧠 Predictive Container</h2>
        <p className="text-primary/80 mb-4">
          This container learns from your interactions and predicts your needs.
          Click and interact to see predictions in the browser console.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <button className="p-4 glass-surface-blue/20 glass-radius-lg border border-blue/30 hover:glass-surface-blue/30 transition-colors">
            Frequently Used Action
          </button>
          <button className="p-4 glass-surface-green/20 glass-radius-lg border border-green/30 hover:glass-surface-green/30 transition-colors">
            Secondary Action
          </button>
        </div>
      </div>
    ),
  },
};

export const BiometricAdaptive: Story = {
  args: {
    glass: true,
    elevation: 2,
    radius: 'lg',
    adaptive: true,
    biometricResponsive: true,
    trackAchievements: true,
    usageContext: 'form',
    children: (
      <div className="p-8 text-primary">
        <h2 className="text-2xl font-bold mb-4">🔄 Adaptive Container</h2>
        <p className="text-primary/80 mb-4">
          This container adapts its size and padding based on device capabilities and user stress levels.
          It will automatically optimize for mobile devices and adjust for accessibility needs.
        </p>
        <div className="gap-4">
          <div className="p-4 glass-surface-subtle/5 glass-radius-lg">
            <label className="block text-sm font-medium mb-2">Adaptive Form Field</label>
            <input 
              type="text" 
              className="w-full p-3 glass-surface-subtle/10 glass-radius-md border border-white/20 text-primary placeholder:text-primary/50 glass-touch-target glass-contrast-guard"
              placeholder="Touch targets adjust based on stress level"
            />
          </div>
          <div className="text-sm text-primary/60">
            💡 Container size and padding adapt automatically based on biometric data
          </div>
        </div>
      </div>
    ),
  },
};

export const EyeTrackingResponsive: Story = {
  args: {
    glass: true,
    elevation: 3,
    radius: 'xl',
    eyeTracking: true,
    gazeResponsive: true,
    spatialAudio: true,
    audioFeedback: true,
    usageContext: 'card',
    children: (
      <div className="p-8 text-primary">
        <h2 className="text-2xl font-bold mb-4">👁️ Eye Tracking Container</h2>
        <p className="text-primary/80 mb-4">
          This container responds to your gaze with visual and audio feedback.
          Look at this container to see the glow effect and hear spatial audio.
        </p>
        <div className="w-full h-40 glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-lg flex items-center justify-center border border-purple-400/30">
          <div className="text-center">
            <div className="text-2xl mb-2">👁️</div>
            <span className="text-primary/60">Gaze-responsive content</span>
          </div>
        </div>
        <div className="text-sm text-primary/60 glass-mt-4">
          💡 Container glows and plays audio when you look at it
        </div>
      </div>
    ),
  },
};

export const ConsciousPresets: Story = {
  name: 'Consciousness Presets',
  render: () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl">
      {/* Minimal Preset */}
      <GlassContainer
        glass={true}
        elevation={2}
        radius="lg"
        {...ConsciousnessPresets.minimal}
        usageContext="card"
      >
        <div className="p-6 text-primary">
          <h3 className="text-lg font-bold mb-2">📊 Minimal Preset</h3>
          <p className="text-primary/80 text-sm mb-4">
            Basic predictive features and achievement tracking for performance-sensitive contexts.
          </p>
          <div className="text-xs text-primary/60">
            Features: Predictive UI, Achievement Tracking
          </div>
        </div>
      </GlassContainer>

      {/* Balanced Preset */}
      <GlassContainer
        glass={true}
        elevation={2}
        radius="lg"
        {...ConsciousnessPresets.balanced}
        usageContext="main"
      >
        <div className="p-6 text-primary">
          <h3 className="text-lg font-bold mb-2">⚖️ Balanced Preset</h3>
          <p className="text-primary/80 text-sm mb-4">
            Balanced consciousness features for general use with good performance.
          </p>
          <div className="text-xs text-primary/60">
            Features: Predictive UI, Biometric Adaptation, Achievement Tracking
          </div>
        </div>
      </GlassContainer>

      {/* Immersive Preset */}
      <GlassContainer
        glass={true}
        elevation={3}
        radius="lg"
        {...ConsciousnessPresets.immersive}
        usageContext="modal"
      >
        <div className="p-6 text-primary">
          <h3 className="text-lg font-bold mb-2">🌟 Immersive Preset</h3>
          <p className="text-primary/80 text-sm mb-4">
            Full consciousness features for immersive, interactive experiences.
          </p>
          <div className="text-xs text-primary/60">
            Features: All consciousness features enabled
          </div>
        </div>
      </GlassContainer>

      {/* Accessible Preset */}
      <GlassContainer
        glass={true}
        elevation={2}
        radius="lg"
        {...ConsciousnessPresets.accessible}
        usageContext="form"
      >
        <div className="p-6 text-primary">
          <h3 className="text-lg font-bold mb-2">♿ Accessible Preset</h3>
          <p className="text-primary/80 text-sm mb-4">
            Accessibility-focused consciousness features with spatial audio and biometric adaptation.
          </p>
          <div className="text-xs text-primary/60">
            Features: Biometric Adaptation, Spatial Audio, Achievement Tracking
          </div>
        </div>
      </GlassContainer>
    </div>
  ),
};

export const ConsciousContainer: Story = {
  name: 'Conscious Container (All Features)',
  render: () => (
    <ConsciousGlassContainer
      glass={true}
      elevation="modal"
      radius="xl"
      usageContext="main"
      className="max-w-4xl"
    >
      <div className="p-12 text-primary">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">🧠✨ Conscious Glass Container</h2>
          <p className="text-primary/80 text-lg mb-6">
            Experience the full power of consciousness interface integration
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="p-6 glass-surface-subtle/5 glass-radius-lg border border-white/10">
            <h4 className="font-bold mb-2">🔮 Predictive Features</h4>
            <ul className="text-sm text-primary/80 gap-1">
              <li>• Learns interaction patterns</li>
              <li>• Preloads content intelligently</li>
              <li>• Predicts user needs</li>
            </ul>
          </div>
          
          <div className="p-6 glass-surface-subtle/5 glass-radius-lg border border-white/10">
            <h4 className="font-bold mb-2">👁️ Eye Tracking</h4>
            <ul className="text-sm text-primary/80 gap-1">
              <li>• Gaze-responsive interface</li>
              <li>• Attention-based interactions</li>
              <li>• Visual feedback on focus</li>
            </ul>
          </div>
          
          <div className="p-6 glass-surface-subtle/5 glass-radius-lg border border-white/10">
            <h4 className="font-bold mb-2">🔄 Biometric Adaptation</h4>
            <ul className="text-sm text-primary/80 gap-1">
              <li>• Device capability detection</li>
              <li>• Stress-level adaptation</li>
              <li>• Accessibility optimization</li>
            </ul>
          </div>
          
          <div className="p-6 glass-surface-subtle/5 glass-radius-lg border border-white/10">
            <h4 className="font-bold mb-2">🎵 Spatial Audio</h4>
            <ul className="text-sm text-primary/80 gap-1">
              <li>• Positional sound feedback</li>
              <li>• Audio interaction cues</li>
              <li>• Accessibility enhancement</li>
            </ul>
          </div>
        </div>
        
        <div className="text-center">
          <button className="px-8 py-3 glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-lg font-semibold hover:glass-gradient-primary hover:glass-gradient-primary transition-all transform hover:scale-105">
            Experience Consciousness Features
          </button>
          <p className="text-xs text-primary/60 glass-mt-4">
            Interact with this container to experience all consciousness features working together
          </p>
        </div>
      </div>
    </ConsciousGlassContainer>
  ),
};

export const SizeVariants: Story = {
  name: 'Size Variants',
  render: () => (
    <div className="space-y-6">
      {(['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const).map((size) => (
        <GlassContainer
          key={size}
          size={size}
          glass={true}
          elevation={1}
          radius="md"
          padding="md"
        >
          <div className="text-primary text-center py-4">
            <h4 className="font-bold text-lg">Size: {size.toUpperCase()}</h4>
            <p className="text-primary/70 text-sm">Container with {size} sizing</p>
          </div>
        </GlassContainer>
      ))}
    </div>
  ),
};
