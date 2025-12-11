import type { Meta, StoryObj } from '@storybook/react';
import React, { useRef, useState, useCallback } from 'react';
import { GalileoElementInteractionPlugin } from './GalileoElementInteractionPlugin';
import { cn } from '../../../lib/utils';
// Mock implementation for Storybook - the actual plugin may not be fully implemented
interface GalileoInteractionConfig {
  enabled: boolean;
  magneticEffect: boolean;
  rippleEffect: boolean;
  glowEffect: boolean;
  physics: {
    stiffness: number;
    damping: number;
    mass: number;
  };
  visual: {
    scale: number;
    glowIntensity: number;
    rippleSpeed: number;
    rippleSize: number;
  };
}

// Safe mock function that won't crash
const createGalileoPlugin = (config?: Partial<GalileoInteractionConfig>) => {
  console.log('Mock Galileo plugin created with config:', config);
  return {
    id: 'galileo-interaction',
    beforeInit: () => console.log('Plugin beforeInit called'),
    afterInit: () => console.log('Plugin afterInit called'),
    beforeUpdate: () => console.log('Plugin beforeUpdate called'),
    afterUpdate: () => console.log('Plugin afterUpdate called'),
    destroy: () => console.log('Plugin destroy called'),
    config: { enabled: true, magneticEffect: true, rippleEffect: true, glowEffect: true, ...config }
  };
};

// Define the args type
type PluginArgs = {
  enabled?: boolean;
  magneticEffect?: boolean;
  rippleEffect?: boolean;
  glowEffect?: boolean;
};

const meta: Meta = {
  title: 'Components/Plugins/GalileoElementInteractionPlugin',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A chart plugin that adds interactive effects like magnetic attraction, ripple effects, and glow to chart elements.',
      },
    },
  },
  argTypes: {
    enabled: {
      control: 'boolean',
      description: 'Enable/disable the plugin',
      defaultValue: true,
    },
    magneticEffect: {
      control: 'boolean',
      description: 'Enable magnetic attraction effect on hover',
      defaultValue: true,
    },
    rippleEffect: {
      control: 'boolean',
      description: 'Enable ripple effect on click',
      defaultValue: true,
    },
    glowEffect: {
      control: 'boolean',
      description: 'Enable glow effect',
      defaultValue: true,
    },
  },
  args: {
    enabled: true,
    magneticEffect: true,
    rippleEffect: true,
    glowEffect: true,
    stiffness: 0.1,
    damping: 0.8,
    mass: 1,
    scale: 1.1,
    glowIntensity: 0.5,
    rippleSpeed: 0.6,
    rippleSize: 2,
  },
};

export default meta;
type Story = StoryObj<PluginArgs>;

export const Default: Story = {
  render: (args: PluginArgs) => {
    // Create plugin instance with story args
    const config: Partial<GalileoInteractionConfig> = {
      enabled: args.enabled ?? true,
      magneticEffect: args.magneticEffect ?? true,
      rippleEffect: args.rippleEffect ?? true,
      glowEffect: args.glowEffect ?? true,
      physics: {
        stiffness: 200,
        damping: 15,
        mass: 0.8,
      },
      visual: {
        scale: 1.05,
        glowIntensity: 0.3,
        rippleSpeed: 0.6,
        rippleSize: 2,
      },
    };
    const plugin = createGalileoPlugin(config);

    // Simple hover lens card for demo elements
    const LensCard: React.FC<{ className: string; label: string; dotColor: string }> = ({ className, label, dotColor }) => {
      const ref = useRef<HTMLDivElement | null>(null);
      const [style, setStyle] = useState<React.CSSProperties>({});
      const onMove = useCallback((e: React.MouseEvent) => {
        const el = ref.current; if (!el) return;
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left; const y = e.clientY - r.top;
        const size = Math.max(r.width, r.height) * 0.8;
        setStyle({
          backgroundImage: `radial-gradient(${size}px ${size}px at ${x}px ${y}px, rgba(255,255,255,0.18), rgba(255,255,255,0.06) 45%, rgba(255,255,255,0) 60%)`,
          // Use createGlassStyle() instead, // Use createGlassStyle() instead,
        });
      }, []);
      const onLeave = useCallback(() => setStyle({}), []);
      return (
        <div
          ref={ref}
          onMouseMove={onMove}
          onMouseLeave={onLeave}
          className={`chart-element relative overflow-hidden ${className}`}
          style={{ transition: 'transform 180ms ease, box-shadow 180ms ease' }}
        >
          <div className="glass-absolute glass-inset-0 glass-pointer-events-none" style={{ ...(style ?? {}) }} />
          <div className="glass-relative glass-text-center">
            <div className="glass-w-8 glass-h-8 glass-radius-full glass-mx-auto glass-mb-2" style={{ backgroundColor: dotColor }} />
            <p className="glass-text-sm glass-font-medium">{label}</p>
          </div>
        </div>
      );
    };

    return (
      <div className="glass-p-8 space-y-6">
        <div className="glass-text-center">
          <h3 className="glass-text-xl glass-font-semibold glass-mb-2">Galileo Element Interaction Plugin</h3>
          <p className="glass-text-sm opacity-80 glass-mb-4">
            Hover over and click the elements below to see the interactive effects.
          </p>
        </div>

        <div className="glass-flex glass-flex-wrap glass-gap-4 glass-justify-center">
          <LensCard className="glass-p-4 glass-gradient-primary glass-gradient-primary glass-gradient-primary dark:glass-gradient-primary dark:glass-gradient-primary glass-glass-glass-backdrop-blur-md glass-border glass-border-white/20 glass-radius-lg glass-cursor-pointer glass-contrast-guard" label="Data Point 1" dotColor="var(--glass-color-primary)" />
          <LensCard className="glass-p-4 glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-glass-glass-backdrop-blur-md glass-border glass-border-white/20 glass-radius-lg glass-cursor-pointer glass-contrast-guard" label="Data Point 2" dotColor="var(--glass-color-success)" />
          <LensCard className="glass-p-4 glass-gradient-primary glass-gradient-primary glass-gradient-primary dark:glass-gradient-primary dark:glass-gradient-primary glass-glass-glass-backdrop-blur-md glass-border glass-border-white/20 glass-radius-lg glass-cursor-pointer glass-contrast-guard" label="Data Point 3" dotColor="#6366F1" />
        </div>

        <div className="glass-surface-subtle/50 glass-glass-glass-backdrop-blur-md glass-border glass-border-white/10 glass-radius-lg glass-p-4 glass-contrast-guard">
          <h4 className="glass-text-sm glass-font-semibold glass-mb-2">Plugin Status:</h4>
          <p className="glass-text-xs opacity-75">
            Plugin created successfully with effects: Magnetic, Ripple, Glow
          </p>
        </div>
      </div>
    );
  },
  args: {
    enabled: true,
    magneticEffect: true,
    rippleEffect: true,
    glowEffect: true,
  },
};

export const DisabledEffects: Story = {
  render: (args: PluginArgs) => {
    const config: Partial<GalileoInteractionConfig> = {
      enabled: args.enabled ?? true,
      magneticEffect: false,
      rippleEffect: false,
      glowEffect: false,
      physics: {
        stiffness: 200,
        damping: 15,
        mass: 0.8,
      },
      visual: {
        scale: 1.05,
        glowIntensity: 0.3,
        rippleSpeed: 0.6,
        rippleSize: 2,
      },
    };
    const plugin = createGalileoPlugin(config);

    return (
      <div className="glass-p-8 space-y-6">
        <div className="glass-text-center">
          <h3 className="glass-text-xl glass-font-semibold glass-mb-2">Disabled Effects</h3>
          <p className="glass-text-sm opacity-80 glass-mb-4">
            All interactive effects are disabled. Elements won't respond to hover or click.
          </p>
        </div>

        <div className="glass-flex glass-flex-wrap glass-gap-4 glass-justify-center">
          <div className="chart-element glass-p-4 glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-glass-glass-backdrop-blur-md glass-border glass-border-white/20 glass-radius-lg glass-cursor-pointer glass-contrast-guard">
            <div className="glass-text-center">
              <div className="glass-w-8 glass-h-8 glass-surface-red glass-radius-full glass-mx-auto glass-mb-2 glass-contrast-guard"></div>
              <p className="glass-text-sm glass-font-medium">No Effects</p>
            </div>
          </div>
        </div>

        <div className="glass-surface-subtle/50 glass-glass-glass-backdrop-blur-md glass-border glass-border-white/10 glass-radius-lg glass-p-4 glass-contrast-guard">
          <h4 className="glass-text-sm glass-font-semibold glass-mb-2">Plugin Status:</h4>
          <p className="glass-text-xs opacity-75">
            Plugin created with all effects disabled
          </p>
        </div>
      </div>
    );
  },
  args: {
    enabled: true,
    magneticEffect: false,
    rippleEffect: false,
    glowEffect: false,
  },
};
