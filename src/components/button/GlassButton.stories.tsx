import type { Meta, StoryObj } from '@storybook/react';
import { useRef } from 'react';
import { GlassButton } from './GlassButton';
import { cn } from '../../lib/utils';
import { useGlassParallax } from '../../hooks/useGlassParallax';
import { GlassButtonVariantType } from './types';

const meta: Meta<typeof GlassButton> = {
  title: 'Controls/Buttons/Glass Button',
  component: GlassButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A sophisticated glass morphism button component with multiple variants and interactive effects.',
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'ghost', 'outline', 'link', 'destructive', 'success', 'warning'] as GlassButtonVariantType[],
      description: 'Button variant that determines color and style',
    },
    size: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Button size',
    },
    glassVariant: {
      control: { type: 'select' },
      options: ['frosted', 'dynamic', 'clear', 'tinted', 'luminous'],
      description: 'Glass morphism variant',
    },
    intensity: {
      control: { type: 'select' },
      options: ['subtle', 'medium', 'strong', 'intense', 'ultra', 'extreme'],
      description: 'Glass intensity level',
    },
    elevation: {
      control: { type: 'select' },
      options: ['none', 'low', 'medium', 'high', 'ultra'],
      description: 'Glass elevation level',
    },
    loading: {
      control: 'boolean',
      description: 'Show loading spinner',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable button interaction',
    },
  },
  args: {
    variant: 'primary',
    size: 'md',
    glassVariant: 'frosted',
    intensity: 'medium',
    elevation: 'level2',
    loading: false,
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<typeof GlassButton>;

export const Default: Story = {
  args: {
    children: 'Click Me',
  },
};

export const Variants: Story = {
  render: (args) => (
    <div className="glass-flex glass-flex-wrap glass-gap-4">
      {(['primary', 'secondary', 'ghost', 'outline', 'link', 'destructive', 'success', 'warning'] as GlassButtonVariantType[]).map((variant) => (
        <GlassButton key={variant} {...args} variant={variant}>
          {variant}
        </GlassButton>
      ))}
    </div>
  ),
  args: {
    children: null, // Will be overridden in render
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="glass-flex glass-flex-wrap glass-items-center glass-gap-4">
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <GlassButton key={size} {...args} size={size}>
          Size {size.toUpperCase()}
        </GlassButton>
      ))}
    </div>
  ),
  args: {
    children: null, // Will be overridden in render
  },
};

export const GlassVariants: Story = {
  render: (args) => (
    <div className="glass-flex glass-flex-wrap glass-gap-4">
      {(['frosted', 'dynamic', 'clear', 'tinted', 'luminous'] as const).map((glassVariant) => (
        <GlassButton key={glassVariant} {...args} glassVariant={glassVariant}>
          {glassVariant}
        </GlassButton>
      ))}
    </div>
  ),
  args: {
    children: null, // Will be overridden in render
  },
};

export const WithIcons: Story = {
  render: (args) => (
    <div className="glass-flex glass-flex-wrap glass-gap-4">
      <GlassButton {...args}>
        <svg className="glass-w-4 glass-h-4 glass-mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Add Item
      </GlassButton>
      <GlassButton {...args} variant="secondary">
        <svg className="glass-w-4 glass-h-4 glass-mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        View Details
      </GlassButton>
      <GlassButton {...args} variant="destructive">
        <svg className="glass-w-4 glass-h-4 glass-mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        Delete
      </GlassButton>
    </div>
  ),
  args: {
    children: null, // Will be overridden in render
  },
};

export const LoadingStates: Story = {
  render: (args) => (
    <div className="glass-flex glass-flex-wrap glass-gap-4">
      <GlassButton {...args} loading>
        Loading...
      </GlassButton>
      <GlassButton {...args} loading variant="secondary">
        Processing
      </GlassButton>
      <GlassButton {...args} loading variant="ghost" size="sm">
        Saving
      </GlassButton>
    </div>
  ),
  args: {
    children: null, // Will be overridden in render
  },
};

export const DisabledStates: Story = {
  render: (args) => (
    <div className="glass-flex glass-flex-wrap glass-gap-4">
      <GlassButton {...args} disabled>
        Disabled
      </GlassButton>
      <GlassButton {...args} disabled variant="secondary">
        Can't Click
      </GlassButton>
      <GlassButton {...args} disabled variant="destructive">
        Inactive
      </GlassButton>
    </div>
  ),
  args: {
    children: null, // Will be overridden in render
  },
};

export const SpecularParallax: Story = {
  render: (args) => (
    <div className="glass-flex glass-flex-wrap glass-gap-6 glass-inset-lg">
      {(['primary', 'secondary', 'success', 'warning', 'destructive'] as GlassButtonVariantType[]).map((variant) => {
        const Demo: React.FC = () => {
          const ref = useRef<HTMLButtonElement>(null);
          useGlassParallax(ref, { strength: 10 });
          return (
            <GlassButton
              ref={ref}
              {...args}
              variant={variant}
              className="glass-overlay-specular glass-parallax"
            >
              {variant}
            </GlassButton>
          );
        };
        return <Demo key={variant} />;
      })}
    </div>
  ),
  args: {
    children: null,
  },
};

export const IconOnly: Story = {
  render: (args) => (
    <div className="glass-flex glass-flex-wrap glass-gap-4">
      <GlassButton {...args} iconOnly>
        <svg className="glass-w-4 glass-h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </GlassButton>
      <GlassButton {...args} iconOnly variant="secondary">
        <svg className="glass-w-4 glass-h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </GlassButton>
      <GlassButton {...args} iconOnly variant="destructive" size="sm">
        <svg className="glass-w-4 glass-h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </GlassButton>
    </div>
  ),
  args: {
    children: null, // Will be overridden in render
  },
};

export const Showcase: Story = {
  args: {
    variant: 'primary',
    size: 'lg',
    glassVariant: 'luminous',
    intensity: 'ultra',
    elevation: 'level4',
    children: (
      <div className="glass-flex glass-items-center">
        <svg className="glass-w-5 glass-h-5 glass-mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        Premium Action
      </div>
    ),
  },
};

export const CallToAction: Story = {
  args: {
    variant: 'primary',
    size: 'xl',
    glassVariant: 'dynamic',
    intensity: 'extreme',
    elevation: 'level4',
    className: 'glass-px-8 glass-py-4 glass-text-lg glass-font-semibold',
    children: 'Get Started Today',
  },
};

// Consciousness Interface Features
export const WithPredictiveFeatures: Story = {
  render: (args) => (
    <div className="glass-stack glass-stack-lg">
      <div className="glass-surface-overlay glass-backdrop-blur-sm glass-radius-lg glass-p-4 glass-contrast-guard">
        <h3 className="glass-text-sm glass-font-medium glass-text-primary glass-mb-2">Predictive Button</h3>
        <p className="glass-text-xs glass-text-primary-secondary glass-mb-4">Anticipates user actions and preloads responses</p>
        <GlassButton 
          {...args}
        >
          Predictive Action
        </GlassButton>
      </div>
    </div>
  ),
  args: {
    variant: 'primary',
    size: 'md',
  },
};

export const WithEyeTracking: Story = {
  render: (args) => (
    <div className="glass-stack glass-stack-lg">
      <div className="glass-surface-overlay glass-backdrop-blur-sm glass-radius-lg glass-p-4 glass-contrast-guard">
        <h3 className="glass-text-sm glass-font-medium glass-text-primary glass-mb-2">Eye Tracking Enabled</h3>
        <p className="glass-text-xs glass-text-primary-secondary glass-mb-4">Responds to user gaze with visual feedback</p>
        <div className="glass-flex glass-flex-wrap glass-gap-4">
          <GlassButton 
            {...args}
          >
            Look at me
          </GlassButton>
          <GlassButton 
            {...args}
            variant="secondary"
          >
            Focus here
          </GlassButton>
        </div>
      </div>
    </div>
  ),
  args: {
    size: 'md',
  },
};

export const BiometricAdaptive: Story = {
  render: (args) => (
    <div
      className="glass-radius-2xl glass-border glass-border-subtle glass-surface-overlay glass-p-5 glass-contrast-guard"
      style={{ width: "min(640px, calc(100vw - 64px))" }}
    >
      <div className="glass-flex glass-flex-col glass-gap-4">
        <div>
          <h3 className="glass-text-base glass-font-semibold glass-text-primary glass-mb-1">
            Biometric adaptive actions
          </h3>
          <p className="glass-text-sm glass-text-secondary">
            Stable Storybook sample showing larger hit targets and calmer copy
            for stress-aware action states.
          </p>
        </div>
        <div className="glass-grid glass-grid-cols-1 sm:glass-grid-cols-3 glass-gap-3">
          {[
            ["Input cadence", "Slower"],
            ["Target size", "Large"],
            ["Motion", "Reduced"],
          ].map(([label, value]) => (
            <div
              key={label}
              className="glass-radius-lg glass-border glass-border-subtle glass-surface-overlay glass-p-3"
            >
              <div className="glass-text-xs glass-text-secondary">{label}</div>
              <div className="glass-text-sm glass-font-semibold glass-text-primary">
                {value}
              </div>
            </div>
          ))}
        </div>
        <div className="glass-flex glass-flex-wrap glass-gap-3">
          <GlassButton {...args} size="lg" biometricResponsive={false}>
            Confirm review
          </GlassButton>
          <GlassButton
            {...args}
            size="lg"
            variant="destructive"
            biometricResponsive={false}
          >
            Escalate carefully
          </GlassButton>
        </div>
      </div>
    </div>
  ),
  args: {
    size: 'lg',
  },
};

export const WithSpatialAudio: Story = {
  render: (args) => (
    <div className="glass-stack glass-stack-lg">
      <div className="glass-surface-overlay glass-backdrop-blur-sm glass-radius-lg glass-p-4 glass-contrast-guard">
        <h3 className="glass-text-sm glass-font-medium glass-text-primary glass-mb-2">Spatial Audio Feedback</h3>
        <p className="glass-text-xs glass-text-primary-secondary glass-mb-4">Provides positional audio cues for interactions</p>
        <div className="glass-grid glass-grid-cols-3 glass-gap-4">
          <GlassButton 
            {...args}
            size="sm"
          >
            Left
          </GlassButton>
          <GlassButton 
            {...args}
            size="sm"
          >
            Center
          </GlassButton>
          <GlassButton 
            {...args}
            size="sm"
          >
            Right
          </GlassButton>
        </div>
      </div>
    </div>
  ),
  args: {
    variant: 'outline',
  },
};

export const AchievementTracking: Story = {
  render: (args) => (
    <div className="glass-stack glass-stack-lg">
      <div className="glass-surface-overlay glass-backdrop-blur-sm glass-radius-lg glass-p-4 glass-contrast-guard">
        <h3 className="glass-text-sm glass-font-medium glass-text-primary glass-mb-2">Achievement System</h3>
        <p className="glass-text-xs glass-text-primary-secondary glass-mb-4">Tracks user interactions for gamification</p>
        <div className="glass-flex glass-flex-wrap glass-gap-4">
          <GlassButton 
            {...args}
          >
            First Action
          </GlassButton>
          <GlassButton 
            {...args}
            variant="success"
          >
            Complete Form
          </GlassButton>
          <GlassButton 
            {...args}
            variant="warning"
          >
            Advanced Feature
          </GlassButton>
        </div>
      </div>
    </div>
  ),
  args: {
    size: 'md',
  },
};

export const ConsciousnessShowcase: Story = {
  render: (args) => (
    <div className="glass-stack glass-stack-lg">
      <div className="glass-text-center glass-gap-2">
        <h2 className="glass-text-xl glass-font-semibold glass-text-primary">Consciousness-Enhanced Button</h2>
        <p className="glass-text-sm glass-text-primary-secondary">All consciousness features enabled</p>
      </div>
      
      <div className="glass-surface-overlay glass-backdrop-blur-sm glass-radius-lg glass-p-6 glass-contrast-guard">
        <GlassButton 
          {...args}
          size="lg"
          glassVariant="luminous"
          intensity="ultra"
        >
          <div className="glass-flex glass-items-center">
            <div className="glass-w-2 glass-h-2 glass-surface-success glass-radius-full animate-pulse glass-mr-2 glass-contrast-guard"></div>
            Consciousness Enabled
          </div>
        </GlassButton>
      </div>
      
      <div className="glass-grid glass-grid-cols-1 md:glass-grid-cols-2 glass-gap-4 glass-text-sm">
        <div className="glass-surface-overlay glass-radius-lg glass-p-3 glass-contrast-guard">
          <h4 className="glass-font-medium glass-text-primary glass-mb-2">Active Features</h4>
          <ul className="glass-text-primary-secondary glass-gap-1">
            <li>• Predictive action preloading</li>
            <li>• Eye tracking & gaze response</li>
            <li>• Biometric stress adaptation</li>
            <li>• Spatial audio positioning</li>
            <li>• Achievement tracking</li>
          </ul>
        </div>
        <div className="glass-surface-overlay glass-radius-lg glass-p-3 glass-contrast-guard">
          <h4 className="glass-font-medium glass-text-primary glass-mb-2">User Experience</h4>
          <ul className="glass-text-primary-secondary glass-gap-1">
            <li>• Anticipatory interactions</li>
            <li>• Attention-aware feedback</li>
            <li>• Stress-responsive UI</li>
            <li>• Immersive audio cues</li>
            <li>• Gamified engagement</li>
          </ul>
        </div>
      </div>
    </div>
  ),
  args: {
    variant: 'primary',
  },
  parameters: {
    layout: 'padded',
  },
};

export const ConsciousnessComparison: Story = {
  render: (args) => (
    <div className="glass-grid glass-grid-cols-1 md:glass-grid-cols-2 glass-gap-6">
      <div className="glass-surface-overlay glass-backdrop-blur-sm glass-radius-lg glass-p-4 glass-contrast-guard">
        <h3 className="glass-text-sm glass-font-medium glass-text-primary glass-mb-4">Standard Button</h3>
        <GlassButton {...args}>
          Traditional Interaction
        </GlassButton>
        <p className="glass-text-xs glass-text-primary-secondary glass-mt-2">Basic click interactions</p>
      </div>
      <div className="glass-surface-overlay glass-backdrop-blur-sm glass-radius-lg glass-p-4 glass-contrast-guard">
        <h3 className="glass-text-sm glass-font-medium glass-text-primary glass-mb-4">Consciousness Enhanced</h3>
        <GlassButton 
          {...args}
        >
          <div className="glass-flex glass-items-center">
            <div className="glass-w-2 glass-h-2 glass-surface-primary glass-radius-full animate-pulse glass-mr-2 glass-contrast-guard"></div>
            Enhanced Interaction
          </div>
        </GlassButton>
        <p className="glass-text-xs glass-text-primary-secondary glass-mt-2">Intelligent, adaptive, immersive</p>
      </div>
    </div>
  ),
  args: {
    variant: 'primary',
    size: 'md',
  },
};
