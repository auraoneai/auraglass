import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassMotionController, GlassAnimated, GlassAnimationSequence, GlassAnimationTimeline } from './GlassMotionController';
import { cn } from '../../lib/utils';

const meta: Meta<typeof GlassMotionController> = {
  title: 'Components/Animations/GlassMotionController',
  component: GlassMotionController,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glassmotioncontroller component.',
      },
    },
  },
  argTypes: {
    // Component-specific argTypes will be added here
  },
  args: {
    // Default args will be added here
  },
};

export default meta;
type Story = StoryObj<typeof GlassMotionController>;

export const Default: Story = {
  args: {
    children: (
      <div className="glass-foundation-complete glass-bg-transparent glass-border-white/40 glass-shadow-2xl glass-radius-2xl glass-p-8 glass-text-center glass-contrast-guard">
        <GlassAnimated animation={{ type: 'fadeIn', duration: 650 }}>
          <h3 className="glass-heading glass-text-2xl glass-font-bold glass-mb-4">GlassMotionController</h3>
        </GlassAnimated>
        <GlassAnimated animation={{ type: 'slideIn', direction: 'up', duration: 800, delay: 120 }}>
          <p className="glass-body glass-text-base leading-relaxed">
            Experience the ultimate glassmorphism component with stunning visual effects and premium typography.
          </p>
        </GlassAnimated>
        <div className="mt-6 glass-glass-inline-glass-flex glass-items-center glass-gap-3 glass-justify-center">
          <GlassAnimated animation={{ type: 'scaleIn', duration: 600, delay: 220 }}>
            <button className="glass-foundation-complete glass-hover bg-glass-frosted glass-border-white/40 glass-shadow-2xl glass-radius-xl glass-px-4 glass-py-2 transition-all glass-contrast-guard">
              Try It
            </button>
          </GlassAnimated>
          <GlassAnimated animation={{ type: 'fadeIn', duration: 600, delay: 300 }}>
            <span className="glass-caption glass-text-xs opacity-80">Animated on mount</span>
          </GlassAnimated>
        </div>
      </div>
    ),
  },
};

export const Variants: Story = {
  render: (args) => (
    <div className="glass-flex glass-flex-wrap glass-gap-6">
      <GlassMotionController {...args}>
        <div className="glass-foundation-complete glass-glass-glass-backdrop-blur-md glass-bg-transparent glass-border-white/40 glass-shadow-2xl glass-radius-2xl glass-p-6 glass-text-center min-w-40 glass-contrast-guard">
          <span className="glass-heading glass-text-lg glass-font-semibold">Primary</span>
          <p className="glass-caption glass-text-sm glass-mt-1 opacity-80">Premium variant</p>
        </div>
      </GlassMotionController>
      <GlassMotionController {...args}>
        <div className="glass-foundation-complete glass-glass-glass-backdrop-blur-md glass-bg-transparent glass-border-white/40 glass-shadow-2xl glass-radius-2xl glass-p-6 glass-text-center min-w-40 glass-contrast-guard">
          <span className="glass-heading glass-text-lg glass-font-semibold">Secondary</span>
          <p className="glass-caption glass-text-sm glass-mt-1 opacity-80">Elegant variant</p>
        </div>
      </GlassMotionController>
      <GlassMotionController {...args}>
        <div className="glass-foundation-complete glass-glass-glass-backdrop-blur-md bg-glass-frosted glass-border-white/40 glass-shadow-2xl glass-radius-2xl glass-p-6 glass-text-center min-w-40 glass-contrast-guard">
          <span className="glass-heading glass-text-lg glass-font-semibold">Frosted</span>
          <p className="glass-caption glass-text-sm glass-mt-1 opacity-80">Crystal clear</p>
        </div>
      </GlassMotionController>
    </div>
  ),
  args: {
    children: null,
  },
};

// Stories for GlassAnimationSequence
export const AnimationSequence: Story = {
  render: (args) => (
    <GlassMotionController enabled={true}>
      <GlassAnimationSequence staggerDelay={200}>
        <div className="glass-grid glass-glass-grid-cols-3 glass-gap-4">
          <GlassAnimated className="glass-foundation-complete glass-glass-glass-backdrop-blur-md glass-bg-transparent glass-border-white/40 glass-shadow-2xl glass-radius-xl glass-p-6 glass-text-center hover:glass-shadow-2xl transition-all glass-contrast-guard">
            <div className="glass-heading glass-text-xl glass-font-bold glass-mb-2">Step 1</div>
            <div className="glass-body glass-text-sm glass-opacity-90">Initialize</div>
          </GlassAnimated>
          <GlassAnimated className="glass-foundation-complete glass-glass-glass-backdrop-blur-md glass-bg-transparent glass-border-white/40 glass-shadow-2xl glass-radius-xl glass-p-6 glass-text-center hover:glass-shadow-2xl transition-all glass-contrast-guard">
            <div className="glass-heading glass-text-xl glass-font-bold glass-mb-2">Step 2</div>
            <div className="glass-body glass-text-sm glass-opacity-90">Process</div>
          </GlassAnimated>
          <GlassAnimated className="glass-foundation-complete glass-glass-glass-backdrop-blur-md glass-bg-transparent glass-border-white/40 glass-shadow-2xl glass-radius-xl glass-p-6 glass-text-center hover:glass-shadow-2xl transition-all glass-contrast-guard">
            <div className="glass-heading glass-text-xl glass-font-bold glass-mb-2">Step 3</div>
            <div className="glass-body glass-text-sm glass-opacity-90">Complete</div>
          </GlassAnimated>
        </div>
      </GlassAnimationSequence>
    </GlassMotionController>
  ),
};

// Stories for GlassAnimationTimeline
export const AnimationTimeline: Story = {
  render: (args) => (
    <GlassMotionController enabled={true}>
      <GlassAnimationTimeline
        timeline={[
          {
            selector: '.timeline-element',
            animation: { type: 'fadeIn', duration: 600 },
            startTime: 0
          },
          {
            selector: '.timeline-element',
            animation: { type: 'slideIn', direction: 'left', duration: 800 },
            startTime: 1000
          },
          {
            selector: '.timeline-element',
            animation: { type: 'scaleIn', duration: 600 },
            startTime: 2000
          }
        ]}
      >
        <div className="timeline-element glass-foundation-complete glass-glass-glass-backdrop-blur-md glass-bg-transparent glass-border-white/40 glass-shadow-2xl glass-radius-2xl glass-p-12 glass-text-center glass-contrast-guard">
          <h3 className="glass-heading glass-text-3xl glass-font-bold glass-mb-4">Timeline Animation</h3>
          <p className="glass-body glass-text-lg leading-relaxed max-w-md glass-mx-auto">Watch this element transform through a complex animation sequence with breathtaking glassmorphism effects.</p>
          <div className="mt-6 glass-glass-inline-glass-flex glass-items-center glass-gap-2 glass-code glass-px-4 glass-py-2 glass-radius-lg">
            <span className="glass-w-2 glass-h-2 glass-surface-green glass-radius-full animate-pulse glass-contrast-guard"></span>
            <span className="glass-text-xs font-mono">Animation Active</span>
          </div>
        </div>
      </GlassAnimationTimeline>
    </GlassMotionController>
  ),
};

// Interactive sequence demo
export const InteractiveSequence: Story = {
  render: (args) => {
    const [isPlaying, setIsPlaying] = React.useState(false);

    return (
      <GlassMotionController enabled={true}>
        <div className="glass-auto-gap glass-auto-gap-2xl">
          <div className="glass-flex glass-justify-center">
            <button
              onClick={(e) => setIsPlaying(!isPlaying)}
              className="glass-foundation-complete glass-hover glass-glass-glass-backdrop-blur-md glass-bg-transparent glass-border-white/40 glass-shadow-2xl glass-px-8 glass-py-4 glass-radius-xl transition-all glass-button hover:glass-shadow-2xl hover:scale-110 hover:rotate-1 glass-focus glass-touch-target glass-contrast-guard"
            >
              <span className="glass-flex glass-items-center glass-gap-3">
                <div className={`w-3 h-3 glass-radius-full ${isPlaying ? 'bg-red-400' : 'bg-green-400'} animate-pulse`}></div>
                <span className="glass-heading glass-text-lg glass-font-semibold">
                  {isPlaying ? 'Pause' : 'Play'} Sequence
                </span>
              </span>
            </button>
          </div>

          <GlassAnimationSequence staggerDelay={isPlaying ? 200 : 0}>
            <div className="glass-grid glass-glass-grid-cols-4 glass-gap-4">
              {['🔵', '🟢', '🟡', '🔴'].map((emoji, index) => (
                <GlassAnimated
                  key={index}
                  className="glass-foundation-complete glass-glass-glass-backdrop-blur-md glass-bg-transparent glass-border-white/40 glass-shadow-2xl glass-p-8 glass-radius-2xl glass-text-center hover:glass-shadow-2xl hover:scale-105 hover:-rotate-2 transition-all duration-300 glass-contrast-guard"
                >
                  <div className="glass-text-4xl glass-mb-3 filter drop-glass-shadow-lg">{emoji}</div>
                  <div className="glass-caption glass-text-xs glass-font-medium opacity-80 glass-uppercase tracking-wider">Item {index + 1}</div>
                </GlassAnimated>
              ))}
            </div>
          </GlassAnimationSequence>
        </div>
      </GlassMotionController>
    );
  },
};
