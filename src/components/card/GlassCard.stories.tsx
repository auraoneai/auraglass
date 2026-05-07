import type { Meta, StoryObj } from '@storybook/react';
import { useRef } from 'react';
import { GlassCard } from './GlassCard';
import { cn } from '../../lib/utils';
import { GlassButton } from '../button/GlassButton';
import { useGlassParallax } from '../../hooks/useGlassParallax';

const meta: Meta<typeof GlassCard> = {
  title: 'Surfaces/Cards + Panels/Glass Card',
  component: GlassCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A sophisticated glassmorphism card component with consciousness interface features including predictive content, eye tracking, biometric adaptation, and spatial audio feedback.',
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'outlined', 'elevated', 'interactive', 'feature', 'minimal', 'primary', 'outline'],
      description: 'Card variant style',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg', 'xl'],
      description: 'Card size',
    },
    intensity: {
      control: { type: 'select' },
      options: ['subtle', 'medium', 'strong', 'intense', 'ultra', 'extreme'],
      description: 'Glass intensity level',
    },
    elevation: {
      control: { type: 'select' },
      options: ['none', 'low', 'medium', 'high', 'ultra'],
      description: 'Card elevation level',
    },
    hoverable: {
      control: 'boolean',
      description: 'Enable hover effects',
    },
    clickable: {
      control: 'boolean',
      description: 'Make card clickable',
    },
    loading: {
      control: 'boolean',
      description: 'Show loading state',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable card interaction',
    },
  },
  args: {
    variant: 'default',
    size: 'md',
    intensity: 'medium',
    elevation: 'level2',
    hoverable: false,
    clickable: false,
    loading: false,
    disabled: false,
  },
};

export default meta;

// Card consciousness interface overview
export const ConsciousnessOverview: Story = {
  render: () => (
    <div className="glass-stack glass-stack-lg">
      <div className="glass-text-center glass-gap-2">
        <h2 className="glass-text-xl glass-font-semibold glass-text-primary">Card Consciousness Features</h2>
        <p className="glass-text-sm glass-text-primary-secondary">Experience intelligent adaptive cards</p>
      </div>
      
      <div className="glass-grid glass-grid-cols-1 lg:glass-grid-cols-2 glass-gap-6">
        <div className="glass-surface-overlay glass-backdrop-blur-sm glass-radius-lg glass-p-4 glass-gap-3 glass-contrast-guard">
          <div className="glass-flex glass-items-center glass-gap-2">
            <div className="glass-w-3 glass-h-3 glass-surface-primary glass-radius-full animate-pulse glass-contrast-guard"></div>
            <h3 className="glass-font-medium glass-text-primary">Predictive Content</h3>
          </div>
          <ul className="glass-text-sm glass-text-primary-secondary glass-gap-1 glass-ml-5">
            <li>• Content adaptation</li>
            <li>• User pattern learning</li>
            <li>• Behavioral predictions</li>
          </ul>
        </div>
        
        <div className="glass-surface-overlay glass-backdrop-blur-sm glass-radius-lg glass-p-4 glass-gap-3 glass-contrast-guard">
          <div className="glass-flex glass-items-center glass-gap-2">
            <div className="glass-w-3 glass-h-3 glass-surface-success glass-radius-full animate-pulse glass-contrast-guard"></div>
            <h3 className="glass-font-medium glass-text-primary">Eye Tracking</h3>
          </div>
          <ul className="glass-text-sm glass-text-primary-secondary glass-gap-1 glass-ml-5">
            <li>• Gaze-based highlighting</li>
            <li>• Focus-aware expansion</li>
            <li>• Attention analytics</li>
          </ul>
        </div>
        
        <div className="glass-surface-overlay glass-backdrop-blur-sm glass-radius-lg glass-p-4 glass-gap-3 glass-contrast-guard">
          <div className="glass-flex glass-items-center glass-gap-2">
            <div className="glass-w-3 glass-h-3 glass-surface-info glass-radius-full animate-pulse glass-contrast-guard"></div>
            <h3 className="glass-font-medium glass-text-primary">Biometric Adaptation</h3>
          </div>
          <ul className="glass-text-sm glass-text-primary-secondary glass-gap-1 glass-ml-5">
            <li>• Stress-level responsiveness</li>
            <li>• Content simplification</li>
            <li>• Cognitive load optimization</li>
          </ul>
        </div>
        
        <div className="glass-surface-overlay glass-backdrop-blur-sm glass-radius-lg glass-p-4 glass-gap-3 glass-contrast-guard">
          <div className="glass-flex glass-items-center glass-gap-2">
            <div className="glass-w-3 glass-h-3 glass-surface-primary glass-radius-full animate-pulse glass-contrast-guard"></div>
            <h3 className="glass-font-medium glass-text-primary">Spatial Audio</h3>
          </div>
          <ul className="glass-text-sm glass-text-primary-secondary glass-gap-1 glass-ml-5">
            <li>• Positional feedback</li>
            <li>• Directional audio cues</li>
            <li>• Immersive interactions</li>
          </ul>
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};
type Story = StoryObj<typeof GlassCard>;

export const Default: Story = {
  args: {
    children: (
      <div className="glass-p-6">
        <h3 className="glass-text-lg glass-font-semibold glass-mb-2">Default Card</h3>
        <p className="glass-text-sm opacity-80">This is a standard glass morphism card.</p>
      </div>
    ),
  },
};

export const Variants: Story = {
  render: (args) => (
    <div className="glass-grid glass-grid-cols-1 md:glass-grid-cols-2 glass-gap-6">
      {(['default', 'outlined', 'elevated', 'interactive', 'feature', 'minimal', 'primary', 'outline'] as const).map((variant) => (
        <GlassCard key={variant} {...args} variant={variant}>
          <div className="glass-p-6">
            <h4 className="glass-text-sm glass-font-medium glass-capitalize glass-mb-2">{variant} Card</h4>
            <p className="glass-text-xs opacity-70">This is a {variant} variant card.</p>
          </div>
        </GlassCard>
      ))}
    </div>
  ),
  args: {
    children: null, // Will be overridden in render
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="glass-grid glass-grid-cols-1 md:glass-grid-cols-2 glass-gap-6">
      {(['sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <GlassCard key={size} {...args} size={size}>
          <div className="glass-p-4 md:glass-p-6">
            <h4 className="glass-text-sm glass-font-medium glass-capitalize glass-mb-2">Size {size.toUpperCase()}</h4>
            <p className="glass-text-xs opacity-70">This is a {size} sized card.</p>
          </div>
        </GlassCard>
      ))}
    </div>
  ),
  args: {
    children: null, // Will be overridden in render
  },
};

export const InteractiveCards: Story = {
  render: (args) => (
    <div className="glass-grid glass-grid-cols-1 md:glass-grid-cols-3 glass-gap-6">
      <GlassCard {...args} hoverable>
        <div className="glass-p-6 glass-text-center">
          <div className="glass-w-12 glass-h-12 glass-mx-auto glass-mb-4 glass-radius-full glass-surface-primary/20 glass-flex glass-items-center glass-justify-center glass-contrast-guard">
            <svg className="glass-w-6 glass-h-6 glass-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="glass-text-lg glass-font-semibold glass-mb-2">Hover Effect</h3>
          <p className="glass-text-sm opacity-80">Hover over this card to see the glass effect in action.</p>
        </div>
      </GlassCard>

      <GlassCard {...args} clickable>
        <div className="glass-p-6 glass-text-center glass-cursor-pointer">
          <div className="glass-w-12 glass-h-12 glass-mx-auto glass-mb-4 glass-radius-full glass-surface-success/20 glass-flex glass-items-center glass-justify-center glass-contrast-guard">
            <svg className="glass-w-6 glass-h-6 glass-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="glass-text-lg glass-font-semibold glass-mb-2">Clickable</h3>
          <p className="glass-text-sm opacity-80">This card is clickable and shows pointer cursor.</p>
        </div>
      </GlassCard>

      <GlassCard {...args} variant="interactive">
        <div className="glass-p-6 glass-text-center">
          <div className="glass-w-12 glass-h-12 glass-mx-auto glass-mb-4 glass-radius-full glass-surface-info/20 glass-flex glass-items-center glass-justify-center glass-contrast-guard">
            <svg className="glass-w-6 glass-h-6 glass-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
          <h3 className="glass-text-lg glass-font-semibold glass-mb-2">Interactive</h3>
          <p className="glass-text-sm opacity-80">Special interactive variant with enhanced effects.</p>
        </div>
      </GlassCard>
    </div>
  ),
  args: {
    children: null, // Will be overridden in render
  },
};

export const ContentShowcase: Story = {
  args: {
    variant: 'feature',
    size: 'lg',
    intensity: 'ultra',
    elevation: 'level4',
    hoverable: true,
    children: (
      <div className="glass-p-8">
        <div className="glass-flex glass-items-start glass-gap-4">
          <div className="glass-w-16 glass-h-16 glass-radius-full glass-gradient-primary glass-gradient-primary glass-gradient-primary dark:glass-gradient-primary dark:glass-gradient-primary glass-flex glass-items-center glass-justify-center glass-flex-shrink-0">
            <svg className="glass-w-8 glass-h-8 glass-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div className="glass-flex-1">
            <h3 className="glass-text-xl glass-font-bold glass-mb-2">Premium Feature Card</h3>
            <p className="glass-text-sm opacity-80 glass-mb-4">
              This showcase demonstrates the full capabilities of our glass morphism card system
              with ultra intensity, extreme elevation, and interactive hover effects.
            </p>
            <div className="glass-flex glass-flex-wrap glass-gap-2">
              <span className="glass-px-3 glass-py-1 glass-surface-primary/20 glass-radius-full glass-text-xs glass-font-medium glass-contrast-guard">Ultra Glass</span>
              <span className="glass-px-3 glass-py-1 glass-surface-info/20 glass-radius-full glass-text-xs glass-font-medium glass-contrast-guard">Interactive</span>
              <span className="glass-px-3 glass-py-1 glass-surface-success/20 glass-radius-full glass-text-xs glass-font-medium glass-contrast-guard">Responsive</span>
            </div>
          </div>
        </div>
      </div>
    ),
  },
};

export const SpecularParallax: Story = {
  render: (args) => (
    <div className="glass-grid glass-grid-cols-1 md:glass-grid-cols-2 glass-gap-6">
      {['default', 'elevated'].map((variant) => {
        const Demo: React.FC = () => {
          const ref = useRef<HTMLDivElement>(null);
          useGlassParallax(ref, { strength: 12 });
          return (
            <GlassCard
              ref={ref}
              {...args}
              variant={variant as any}
              hoverable
              className="glass-overlay-specular glass-parallax glass-overlay-noise glass-edge"
            >
              <div className="glass-p-8 glass-text-center">
                <h3 className="glass-text-lg glass-font-semibold glass-mb-2">{variant === 'default' ? 'Specular + Parallax' : 'Elevated Surface'}</h3>
                <p className="glass-text-sm opacity-80">Move your cursor to see the sheen follow.</p>
              </div>
            </GlassCard>
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

export const LoadingStates: Story = {
  render: (args) => (
    <div className="glass-grid glass-grid-cols-1 md:glass-grid-cols-2 glass-gap-6">
      <GlassCard {...args} loading>
        <div className="glass-p-6">
          <div className="animate-pulse">
            <div className="glass-h-4 glass-surface-subtle/20 glass-radius-md glass-w-3-4 glass-mb-2 glass-contrast-guard"></div>
            <div className="glass-h-3 glass-surface-subtle/10 glass-radius-md glass-w-1-2 glass-mb-4 glass-contrast-guard"></div>
            <div className="glass-h-3 glass-surface-subtle/10 glass-radius-md glass-w-full glass-mb-2 glass-contrast-guard"></div>
            <div className="glass-h-3 glass-surface-subtle/10 glass-radius-md glass-w-2/3 glass-contrast-guard"></div>
          </div>
        </div>
      </GlassCard>
      <GlassCard {...args} loading variant="outlined">
        <div className="glass-p-6">
          <div className="animate-pulse">
            <div className="glass-flex glass-items-center glass-gap-3 glass-mb-4">
              <div className="glass-w-10 glass-h-10 glass-surface-subtle/20 glass-radius-full glass-contrast-guard"></div>
              <div className="glass-flex-1">
                <div className="glass-h-3 glass-surface-subtle/10 glass-radius-md glass-w-1-2 glass-mb-1 glass-contrast-guard"></div>
                <div className="glass-h-2 glass-surface-subtle/10 glass-radius-md glass-w-1/3 glass-contrast-guard"></div>
              </div>
            </div>
            <div className="glass-h-3 glass-surface-subtle/10 glass-radius-md glass-w-full glass-mb-2 glass-contrast-guard"></div>
            <div className="glass-h-3 glass-surface-subtle/10 glass-radius-md glass-w-3-4 glass-contrast-guard"></div>
          </div>
        </div>
      </GlassCard>
    </div>
  ),
  args: {
    children: null, // Will be overridden in render
  },
};

export const ProductCard: Story = {
  args: {
    variant: 'elevated',
    size: 'lg',
    intensity: 'strong',
    elevation: 'level3',
    hoverable: true,
    children: (
      <div className="glass-p-6">
        <div className="glass-text-center glass-mb-6">
          <div className="glass-w-20 glass-h-20 glass-mx-auto glass-mb-4 glass-radius-full glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-flex glass-items-center glass-justify-center">
            <svg className="glass-w-10 glass-h-10 glass-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="glass-text-xl glass-font-bold glass-mb-2">Analytics Dashboard</h3>
          <p className="glass-text-sm opacity-80">Complete business intelligence solution with real-time data visualization.</p>
        </div>
        <div className="glass-flex glass-justify-between glass-items-center">
          <div className="glass-text-2xl glass-font-bold">$299</div>
          <GlassButton size="sm" variant="primary">Get Started</GlassButton>
        </div>
      </div>
    ),
  },
};

// Consciousness Interface Features
export const WithPredictiveContent: Story = {
  render: (args) => (
    <div className="glass-stack glass-stack-lg">
      <div className="glass-surface-overlay glass-backdrop-blur-sm glass-radius-lg glass-p-4 glass-contrast-guard">
        <h3 className="glass-text-sm glass-font-medium glass-text-primary glass-mb-2">Predictive Content</h3>
        <p className="glass-text-xs glass-text-primary-secondary glass-mb-4">Card content adapts based on user behavior patterns</p>
        <GlassCard
          {...args}
        >
          <div className="glass-p-6">
            <div className="glass-flex glass-items-center glass-gap-3 glass-mb-4">
              <div className="glass-w-3 glass-h-3 glass-surface-blue glass-radius-full animate-pulse glass-contrast-guard"></div>
              <h4 className="glass-font-medium">Predictive Card</h4>
            </div>
            <p className="glass-text-sm glass-text-primary-secondary">This content changes based on your usage patterns and preferences.</p>
          </div>
        </GlassCard>
      </div>
    </div>
  ),
  args: {
    variant: 'interactive',
    hoverable: true,
  },
};

export const WithEyeTracking: Story = {
  render: (args) => (
    <div className="glass-stack glass-stack-lg">
      <div className="glass-surface-overlay glass-backdrop-blur-sm glass-radius-lg glass-p-4 glass-contrast-guard">
        <h3 className="glass-text-sm glass-font-medium glass-text-primary glass-mb-2">Eye Tracking Cards</h3>
        <p className="glass-text-xs glass-text-primary-secondary glass-mb-4">Cards respond to where you're looking</p>
        <div className="glass-grid glass-grid-cols-1 md:glass-grid-cols-2 glass-gap-4">
          <GlassCard
            {...args}
          >
            <div className="glass-p-4">
              <h4 className="glass-font-medium glass-mb-2">Gaze-Responsive</h4>
              <p className="glass-text-sm glass-text-primary-secondary">Look at me to see highlighting</p>
            </div>
          </GlassCard>
          <GlassCard
            {...args}
          >
            <div className="glass-p-4">
              <h4 className="glass-font-medium glass-mb-2">Focus-Aware</h4>
              <p className="glass-text-sm glass-text-primary-secondary">Expands on focus</p>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  ),
  args: {
    variant: 'outlined',
    hoverable: true,
  },
};

export const BiometricAdaptive: Story = {
  render: (args) => (
    <div className="glass-stack glass-stack-lg">
      <div className="glass-surface-overlay glass-backdrop-blur-sm glass-radius-lg glass-p-4 glass-contrast-guard">
        <h3 className="glass-text-sm glass-font-medium glass-text-primary glass-mb-2">Biometric Adaptive Cards</h3>
        <p className="glass-text-xs glass-text-primary-secondary glass-mb-4">Adjust complexity based on user stress levels</p>
        <div className="glass-gap-4">
          <GlassCard
            {...args}
          >
            <div className="glass-p-6">
              <div className="glass-flex glass-items-center glass-gap-3 glass-mb-4">
                <div className="glass-w-3 glass-h-3 glass-surface-green glass-radius-full animate-pulse glass-contrast-guard"></div>
                <h4 className="glass-font-medium">Calm State</h4>
              </div>
              <p className="glass-text-sm glass-text-primary-secondary">Rich detailed content shown when user is relaxed</p>
              <div className="glass-mt-4 glass-grid glass-grid-cols-2 glass-gap-3 glass-text-xs">
                <div className="glass-surface-overlay glass-p-2 glass-radius-md glass-contrast-guard">Detail 1</div>
                <div className="glass-surface-overlay glass-p-2 glass-radius-md glass-contrast-guard">Detail 2</div>
              </div>
            </div>
          </GlassCard>
          <GlassCard
            {...args}
            variant="minimal"
          >
            <div className="glass-p-4">
              <div className="glass-flex glass-items-center glass-gap-3 glass-mb-2">
                <div className="glass-w-3 glass-h-3 glass-surface-yellow glass-radius-full animate-pulse glass-contrast-guard"></div>
                <h4 className="glass-font-medium">Stressed State</h4>
              </div>
              <p className="glass-text-sm glass-text-primary-secondary">Simplified view for high stress</p>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  ),
  args: {
    hoverable: true,
  },
};

export const WithSpatialAudio: Story = {
  render: (args) => (
    <div className="glass-stack glass-stack-lg">
      <div className="glass-surface-overlay glass-backdrop-blur-sm glass-radius-lg glass-p-4 glass-contrast-guard">
        <h3 className="glass-text-sm glass-font-medium glass-text-primary glass-mb-2">Spatial Audio Cards</h3>
        <p className="glass-text-xs glass-text-primary-secondary glass-mb-4">Provide audio feedback based on card position</p>
        <div className="glass-grid glass-grid-cols-3 glass-gap-4">
          <GlassCard
            {...args}
          >
            <div className="glass-p-4 glass-text-center">
              <div className="glass-w-8 glass-h-8 glass-mx-auto glass-mb-2 glass-surface-primary/20 glass-radius-full glass-flex glass-items-center glass-justify-center glass-contrast-guard">
                ←
              </div>
              <h4 className="glass-text-sm glass-font-medium">Left</h4>
            </div>
          </GlassCard>
          <GlassCard
            {...args}
          >
            <div className="glass-p-4 glass-text-center">
              <div className="glass-w-8 glass-h-8 glass-mx-auto glass-mb-2 glass-surface-success/20 glass-radius-full glass-flex glass-items-center glass-justify-center glass-contrast-guard">
                ●
              </div>
              <h4 className="glass-text-sm glass-font-medium">Center</h4>
            </div>
          </GlassCard>
          <GlassCard
            {...args}
          >
            <div className="glass-p-4 glass-text-center">
              <div className="glass-w-8 glass-h-8 glass-mx-auto glass-mb-2 glass-surface-info/20 glass-radius-full glass-flex glass-items-center glass-justify-center glass-contrast-guard">
                →
              </div>
              <h4 className="glass-text-sm glass-font-medium">Right</h4>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  ),
  args: {
    variant: 'outlined',
    hoverable: true,
  },
};

export const ConsciousnessShowcase: Story = {
  render: (args) => (
    <div className="glass-stack glass-stack-lg">
      <div className="glass-text-center glass-gap-2">
        <h2 className="glass-text-xl glass-font-semibold glass-text-primary">Consciousness-Enhanced Card</h2>
        <p className="glass-text-sm glass-text-primary-secondary">Complete consciousness interface integration</p>
      </div>
      
      <div className="glass-surface-overlay glass-backdrop-blur-sm glass-radius-lg glass-p-6 glass-contrast-guard">
        <GlassCard
          {...args}
          variant="feature"
          size="lg"
          intensity="ultra"
          hoverable
        >
          <div className="glass-p-8">
            <div className="glass-flex glass-items-start glass-gap-4">
              <div className="glass-w-16 glass-h-16 glass-radius-full glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-flex glass-items-center glass-justify-center glass-flex-shrink-0">
                <div className="glass-w-3 glass-h-3 glass-surface-subtle glass-radius-full animate-pulse glass-contrast-guard"></div>
              </div>
              <div className="glass-flex-1">
                <h3 className="glass-text-xl glass-font-bold glass-mb-2">Consciousness-Enhanced Card</h3>
                <p className="glass-text-sm glass-text-primary-secondary glass-mb-4">
                  This card demonstrates all consciousness features working together: predictive content adaptation, 
                  eye tracking highlights, biometric responsiveness, and immersive spatial audio feedback.
                </p>
                <div className="glass-flex glass-flex-wrap glass-gap-2">
                  <span className="glass-px-3 glass-py-1 glass-surface-primary/20 glass-radius-full glass-text-xs glass-font-medium glass-contrast-guard">Predictive</span>
                  <span className="glass-px-3 glass-py-1 glass-surface-success/20 glass-radius-full glass-text-xs glass-font-medium glass-contrast-guard">Eye Tracking</span>
                  <span className="glass-px-3 glass-py-1 glass-surface-info/20 glass-radius-full glass-text-xs glass-font-medium glass-contrast-guard">Adaptive</span>
                  <span className="glass-px-3 glass-py-1 glass-surface-primary/20 glass-radius-full glass-text-xs glass-font-medium glass-contrast-guard">Spatial Audio</span>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
      
      <div className="glass-grid glass-grid-cols-1 md:glass-grid-cols-2 glass-gap-4 glass-text-sm">
        <div className="glass-surface-overlay glass-radius-lg glass-p-3 glass-contrast-guard">
          <h4 className="glass-font-medium glass-text-primary glass-mb-2">Intelligence Features</h4>
          <ul className="glass-text-primary-secondary glass-gap-1">
            <li>• Predictive content adaptation</li>
            <li>• User pattern recognition</li>
            <li>• Gaze-based highlighting</li>
            <li>• Focus-aware expansion</li>
          </ul>
        </div>
        <div className="glass-surface-overlay glass-radius-lg glass-p-3 glass-contrast-guard">
          <h4 className="glass-font-medium glass-text-primary glass-mb-2">Adaptive Features</h4>
          <ul className="glass-text-primary-secondary glass-gap-1">
            <li>• Biometric responsiveness</li>
            <li>• Stress-aware simplification</li>
            <li>• Positional audio feedback</li>
            <li>• Achievement tracking</li>
          </ul>
        </div>
      </div>
    </div>
  ),
  args: {},
  parameters: {
    layout: 'padded',
  },
};
