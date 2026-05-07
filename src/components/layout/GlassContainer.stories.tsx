import type { Meta, StoryObj } from '@storybook/react';
import { GlassPredictiveEngineProvider } from '../advanced/GlassPredictiveEngine';
import {
    ConsciousGlassContainer,
    ConsciousnessPresets,
    GlassContainer
} from './GlassContainer';

const meta: Meta<typeof GlassContainer> = {
  title: 'Surfaces/App Shells + Layout/Glass Container',
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
        <div className="glass-min-glass-h-screen glass-gradient-primary glass-gradient-primary via-purple-900 glass-gradient-primary glass-p-8">
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
      <div className="glass-p-8 glass-text-primary">
        <h2 className="glass-text-2xl glass-font-bold glass-mb-4">Default Container</h2>
        <p className="glass-text-primary/80 glass-mb-4">
          A standard glass container with basic functionality.
        </p>
        <div className="glass-w-full glass-h-32 glass-surface-subtle/10 glass-radius-lg glass-flex glass-items-center glass-justify-center">
          <span className="glass-text-primary/60">Container Content</span>
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
      <div className="glass-p-8 glass-text-primary">
        <h2 className="glass-text-2xl glass-font-bold glass-mb-4">Glass Container</h2>
        <p className="glass-text-primary/80 glass-mb-4">
          A glass container with glassmorphism background and elevated appearance.
        </p>
        <div className="glass-w-full glass-h-32 glass-surface-subtle/5 glass-radius-lg glass-flex glass-items-center glass-justify-center glass-border glass-border-white/10">
          <span className="glass-text-primary/60">Glassmorphic Content</span>
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
      <div className="glass-p-8 glass-text-primary">
        <h2 className="glass-text-2xl glass-font-bold glass-mb-4">🧠 Predictive Container</h2>
        <p className="glass-text-primary/80 glass-mb-4">
          This container learns from your interactions and predicts your needs.
          Click and interact to see predictions in the browser console.
        </p>
        <div className="glass-grid glass-glass-grid-cols-2 glass-gap-4">
          <button className="glass-p-4 glass-surface-blue/20 glass-radius-lg glass-border glass-border-blue/30 hover:glass-surface-blue/30 transition-colors">
            Frequently Used Action
          </button>
          <button className="glass-p-4 glass-surface-green/20 glass-radius-lg glass-border glass-border-green/30 hover:glass-surface-green/30 transition-colors">
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
      <div className="glass-p-8 glass-text-primary">
        <h2 className="glass-text-2xl glass-font-bold glass-mb-4">🔄 Adaptive Container</h2>
        <p className="glass-text-primary/80 glass-mb-4">
          This container adapts its size and padding based on device capabilities and user stress levels.
          It will automatically optimize for mobile devices and adjust for accessibility needs.
        </p>
        <div className="glass-gap-4">
          <div className="glass-p-4 glass-surface-subtle/5 glass-radius-lg">
            <label className="glass-block glass-text-sm glass-font-medium glass-mb-2">Adaptive Form Field</label>
            <input 
              type="text" 
              className="glass-w-full glass-p-3 glass-surface-subtle/10 glass-radius-md glass-border glass-border-white/20 glass-text-primary placeholder:glass-text-primary/50 glass-touch-target glass-contrast-guard"
              placeholder="Touch targets adjust based on stress level"
            />
          </div>
          <div className="glass-text-sm glass-text-primary/60">
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
      <div className="glass-p-8 glass-text-primary">
        <h2 className="glass-text-2xl glass-font-bold glass-mb-4">👁️ Eye Tracking Container</h2>
        <p className="glass-text-primary/80 glass-mb-4">
          This container responds to your gaze with visual and audio feedback.
          Look at this container to see the glow effect and hear spatial audio.
        </p>
        <div className="glass-w-full h-40 glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-lg glass-flex glass-items-center glass-justify-center glass-border glass-border-purple-400/30">
          <div className="glass-text-center">
            <div className="glass-text-2xl glass-mb-2">👁️</div>
            <span className="glass-text-primary/60">Gaze-responsive content</span>
          </div>
        </div>
        <div className="glass-text-sm glass-text-primary/60 glass-mt-4">
          💡 Container glows and plays audio when you look at it
        </div>
      </div>
    ),
  },
};

export const ConsciousPresets: Story = {
  name: 'Consciousness Presets',
  render: () => (
    <div className="glass-grid glass-glass-grid-cols-1 lg:glass-glass-grid-cols-2 glass-gap-8 max-w-6xl">
      {/* Minimal Preset */}
      <GlassContainer
        glass={true}
        elevation={2}
        radius="lg"
        {...ConsciousnessPresets.minimal}
        usageContext="card"
      >
        <div className="glass-p-6 glass-text-primary">
          <h3 className="glass-text-lg glass-font-bold glass-mb-2">📊 Minimal Preset</h3>
          <p className="glass-text-primary/80 glass-text-sm glass-mb-4">
            Basic predictive features and achievement tracking for performance-sensitive contexts.
          </p>
          <div className="glass-text-xs glass-text-primary/60">
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
        <div className="glass-p-6 glass-text-primary">
          <h3 className="glass-text-lg glass-font-bold glass-mb-2">⚖️ Balanced Preset</h3>
          <p className="glass-text-primary/80 glass-text-sm glass-mb-4">
            Balanced consciousness features for general use with good performance.
          </p>
          <div className="glass-text-xs glass-text-primary/60">
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
        <div className="glass-p-6 glass-text-primary">
          <h3 className="glass-text-lg glass-font-bold glass-mb-2">🌟 Immersive Preset</h3>
          <p className="glass-text-primary/80 glass-text-sm glass-mb-4">
            Full consciousness features for immersive, interactive experiences.
          </p>
          <div className="glass-text-xs glass-text-primary/60">
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
        <div className="glass-p-6 glass-text-primary">
          <h3 className="glass-text-lg glass-font-bold glass-mb-2">♿ Accessible Preset</h3>
          <p className="glass-text-primary/80 glass-text-sm glass-mb-4">
            Accessibility-focused consciousness features with spatial audio and biometric adaptation.
          </p>
          <div className="glass-text-xs glass-text-primary/60">
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
      <div className="glass-p-12 glass-text-primary">
        <div className="glass-text-center mb-8">
          <h2 className="glass-text-3xl glass-font-bold glass-mb-4">🧠✨ Conscious Glass Container</h2>
          <p className="glass-text-primary/80 glass-text-lg mb-6">
            Experience the full power of consciousness interface integration
          </p>
        </div>
        
        <div className="glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 glass-gap-6 mb-8">
          <div className="glass-p-6 glass-surface-subtle/5 glass-radius-lg glass-border glass-border-white/10">
            <h4 className="glass-font-bold glass-mb-2">🔮 Predictive Features</h4>
            <ul className="glass-text-sm glass-text-primary/80 glass-gap-1">
              <li>• Learns interaction patterns</li>
              <li>• Preloads content intelligently</li>
              <li>• Predicts user needs</li>
            </ul>
          </div>
          
          <div className="glass-p-6 glass-surface-subtle/5 glass-radius-lg glass-border glass-border-white/10">
            <h4 className="glass-font-bold glass-mb-2">👁️ Eye Tracking</h4>
            <ul className="glass-text-sm glass-text-primary/80 glass-gap-1">
              <li>• Gaze-responsive interface</li>
              <li>• Attention-based interactions</li>
              <li>• Visual feedback on focus</li>
            </ul>
          </div>
          
          <div className="glass-p-6 glass-surface-subtle/5 glass-radius-lg glass-border glass-border-white/10">
            <h4 className="glass-font-bold glass-mb-2">🔄 Biometric Adaptation</h4>
            <ul className="glass-text-sm glass-text-primary/80 glass-gap-1">
              <li>• Device capability detection</li>
              <li>• Stress-level adaptation</li>
              <li>• Accessibility optimization</li>
            </ul>
          </div>
          
          <div className="glass-p-6 glass-surface-subtle/5 glass-radius-lg glass-border glass-border-white/10">
            <h4 className="glass-font-bold glass-mb-2">🎵 Spatial Audio</h4>
            <ul className="glass-text-sm glass-text-primary/80 glass-gap-1">
              <li>• Positional sound feedback</li>
              <li>• Audio interaction cues</li>
              <li>• Accessibility enhancement</li>
            </ul>
          </div>
        </div>
        
        <div className="glass-text-center">
          <button className="glass-px-8 glass-py-3 glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-lg glass-font-semibold hover:glass-gradient-primary hover:glass-gradient-primary transition-all transform hover:scale-105">
            Experience Consciousness Features
          </button>
          <p className="glass-text-xs glass-text-primary/60 glass-mt-4">
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
          <div className="glass-text-primary glass-text-center glass-py-4">
            <h4 className="glass-font-bold glass-text-lg">Size: {size.toUpperCase()}</h4>
            <p className="glass-text-primary/70 glass-text-sm">Container with {size} sizing</p>
          </div>
        </GlassContainer>
      ))}
    </div>
  ),
};
