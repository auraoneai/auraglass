/**
 * AuraGlass Eye Tracking Stories
 * Gaze-responsive glass effects using WebGazer.js and device camera
import { cn } from '../../lib/utils';
 */

import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import {
    GlassEyeTrackingCalibration,
    GlassEyeTrackingProvider,
    GlassGazeResponsive,
    GlassGazeVisualization,
    useEyeTracking
} from './GlassEyeTracking';

const meta: Meta<typeof GlassEyeTrackingProvider> = {
  title: 'Advanced/Consciousness Interface/Eye Tracking',
  component: GlassEyeTrackingProvider,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Glass Eye Tracking

Gaze-responsive glass effects using WebGazer.js for camera-based eye tracking.

## Features
- **Camera-Based Eye Tracking** - Uses device camera with WebGazer.js for gaze detection
- **Calibration System** - 9-point calibration with visual feedback and accuracy measurement
- **Gaze-Responsive Components** - Components that react to where users look
- **Real-time Visualization** - Debug overlay showing gaze regions and interactions
- **Spatial Interaction Regions** - Define areas that respond to user gaze with intensity levels

## Technical Details
- **WebGazer Integration** - Loads WebGazer.js dynamically for eye tracking
- **TensorFlow Face Mesh** - Uses TFFacemesh tracker for accurate gaze prediction
- **Ridge Regression** - Machine learning model for gaze point prediction
- **Fixation Detection** - Distinguishes between fixations, saccades, and pursuit movements
- **Session Persistence** - Saves calibration data across browser sessions

## Privacy & Security
- **Local Processing** - All eye tracking happens locally in the browser
- **No Data Transmission** - Gaze data never leaves the user's device
- **User Consent** - Requires explicit camera permission
- **Calibration Required** - Must calibrate before tracking begins

## Browser Support
- **Modern Browsers** - Chrome, Firefox, Edge, Safari with WebRTC support
- **Camera Access** - Requires getUserMedia API support
- **WebAssembly** - TensorFlow.js requires WASM support
        `,
      },
    },
  },
  argTypes: {
    autoInitialize: {
      control: 'boolean',
      description: 'Automatically initialize eye tracking on load',
    },
  },
  args: {
    onGazeInteraction: fn(),
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof GlassEyeTrackingProvider>;

// Demo component showing gaze interactions
function EyeTrackingDemo() {
  const { isInitialized, isCalibrating, activeInteractions } = useEyeTracking();
  const [showVisualization, setShowVisualization] = useState(true);
  const [gazeCount, setGazeCount] = useState(0);

  const handleGazeEnter = (regionId: string) => {
    setGazeCount(prev => prev + 1);
    console.log(`Gaze entered region: ${regionId}`);
  };

  return (
    <div className="glass-min-glass-h-screen glass-p-8 space-y-8">
      {/* Header */}
      <div className="glass-text-center glass-gap-4">
        <h1 className="glass-text-4xl glass-font-bold glass-text-primary">
          👁️ Glass Eye Tracking
        </h1>
        <p className="glass-text-lg glass-text-secondary">
          Gaze-responsive interface that reacts to where you look
        </p>
        
        {/* Status Indicators */}
        <div className="glass-flex glass-justify-center glass-gap-4">
          <div className={`flex items-center glass-gap-2 glass-surface-secondary glass-radius-full glass-px-4 glass-py-2`}>
            <div className={`w-2 h-2 glass-radius-full ${isInitialized ? 'bg-green-400' : 'bg-red-400'}`} />
            <span className="glass-text-sm glass-text-primary">
              {isInitialized ? 'Eye Tracking Active' : 'Not Initialized'}
            </span>
          </div>
          
          <div className="glass-flex glass-items-center glass-gap-2 glass-surface-secondary glass-radius-full glass-px-4 glass-py-2">
            <div className={`w-2 h-2 glass-radius-full ${isCalibrating ? 'bg-yellow-400' : 'bg-blue-400'}`} />
            <span className="glass-text-sm glass-text-primary">
              {isCalibrating ? 'Calibrating' : 'Ready'}
            </span>
          </div>
          
          <div className="glass-flex glass-items-center glass-gap-2 glass-surface-secondary glass-radius-full glass-px-4 glass-py-2">
            <div className="glass-text-sm glass-text-primary">
              👁️ Gaze Interactions: {gazeCount}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="glass-flex glass-justify-center glass-gap-4">
          <button
            onClick={() => setShowVisualization(!showVisualization)}
            className="glass-surface-primary glass-elev-2 glass-radius-lg glass-px-4 glass-py-2 hover:glass-elev-3 transition-all duration-300 glass-focus glass-touch-target glass-contrast-guard"
          >
            {showVisualization ? '👁️ Hide Gaze Debug' : '👁️ Show Gaze Debug'}
          </button>
        </div>
      </div>

      {/* Gaze-Responsive Grid */}
      <div className="glass-grid glass-glass-grid-cols-2 md:glass-glass-grid-cols-4 glass-gap-6">
        {Array.from({ length: 8 }, (_, i) => (
          <GlassGazeResponsive
            key={`gaze-card-${i}`}
            regionId={`gaze-card-${i}`}
            onGazeEnter={() => handleGazeEnter(`gaze-card-${i}`)}
            onGazeLeave={() => console.log(`Gaze left gaze-card-${i}`)}
            onGazeIntensityChange={(intensity) => console.log(`Gaze intensity: ${intensity}`)}
            glassIntensity={true}
            glassRadius={true}
            glassBlur={true}
            className="glass-surface-primary glass-elev-2 glass-radius-lg glass-p-6 glass-text-center glass-gap-4 glass-cursor-pointer glass-min-glass-h-32"
          >
            <div className="glass-text-3xl">
              {['👁️', '🔍', '👀', '🎯', '✨', '💎', '🌟', '🔮'][i]}
            </div>
            <h3 className="glass-text-lg glass-font-medium glass-text-primary">
              Gaze Zone {i + 1}
            </h3>
            <p className="glass-text-sm glass-text-secondary">
              Look at me to see the gaze effect!
            </p>
          </GlassGazeResponsive>
        ))}
      </div>

      {/* Active Interactions Display */}
      <div className="glass-surface-primary glass-elev-1 glass-radius-lg glass-p-6">
        <h3 className="glass-text-xl glass-font-medium glass-text-primary glass-mb-4">
          👁️ Active Gaze Interactions ({activeInteractions.length})
        </h3>
        {activeInteractions.length > 0 ? (
          <div className="glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 lg:glass-glass-grid-cols-3 glass-gap-4">
            {activeInteractions.map((interaction) => (
              <div 
                key={interaction.region.id}
                className="glass-surface-secondary glass-radius-md glass-p-4 glass-gap-2"
              >
                <div className="glass-flex glass-items-center glass-justify-between">
                  <span className="glass-text-sm glass-font-medium glass-text-primary">
                    {interaction.region.id}
                  </span>
                  <span className="glass-text-xs glass-text-secondary glass-capitalize">
                    {interaction.type}
                  </span>
                </div>
                <div className="glass-gap-1">
                  <div className="glass-flex glass-justify-between glass-text-xs glass-text-tertiary">
                    <span>Duration:</span>
                    <span>{interaction.duration}ms</span>
                  </div>
                  <div className="glass-flex glass-justify-between glass-text-xs glass-text-tertiary">
                    <span>Intensity:</span>
                    <span>{(interaction.intensity * 100).toFixed(0)}%</span>
                  </div>
                  <div className="glass-w-full glass-surface-primary glass-radius-sm glass-h-1 overflow-hidden">
                    <div 
                      className="glass-h-full glass-surface-blue transition-all duration-300"
                      style={{ width: `${interaction.intensity * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-text-center glass-text-sm glass-text-secondary glass-py-8">
            Look at the gaze-responsive elements above to see active interactions...
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="glass-surface-primary glass-elev-1 glass-radius-lg glass-p-6">
        <h3 className="glass-text-xl glass-font-medium glass-text-primary glass-mb-4">
          📋 How to Use Eye Tracking
        </h3>
        <div className="glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 glass-gap-6">
          <div className="glass-gap-3">
            <h4 className="glass-text-lg glass-font-medium glass-text-primary">Setup Steps:</h4>
            <ol className="list-decimal list-inside glass-gap-2 glass-text-sm glass-text-secondary">
              <li>Grant camera permission when prompted</li>
              <li>Complete the 9-point calibration process</li>
              <li>Look at different elements to see gaze effects</li>
              <li>Toggle visualization to see debug overlay</li>
            </ol>
          </div>
          <div className="glass-gap-3">
            <h4 className="glass-text-lg glass-font-medium glass-text-primary">Tips for Best Results:</h4>
            <ul className="list-disc list-inside glass-gap-2 glass-text-sm glass-text-secondary">
              <li>Ensure good lighting on your face</li>
              <li>Keep your head relatively still</li>
              <li>Look directly at calibration points</li>
              <li>Recalibrate if accuracy seems low</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Gaze Visualization */}
      <GlassGazeVisualization show={showVisualization} />
    </div>
  );
}

export const Interactive: Story = {
  render: (args) => (
    <GlassEyeTrackingProvider {...args}>
      <EyeTrackingDemo />
    </GlassEyeTrackingProvider>
  ),
  args: {
    autoInitialize: false,
    onGazeInteraction: fn(),
  },
};

export const WithCalibration: Story = {
  render: (args) => (
    <GlassEyeTrackingProvider {...args}>
      <div className="glass-min-glass-h-screen glass-p-8">
        <div className="glass-text-center space-y-6">
          <h1 className="glass-text-3xl glass-font-bold glass-text-primary">
            Eye Tracking Calibration
          </h1>
          <p className="glass-text-lg glass-text-secondary">
            Complete calibration to enable gaze-responsive effects
          </p>
          
          <GlassEyeTrackingCalibration
            onComplete={() => {
              console.log('✅ Eye tracking calibration completed!');
              alert('Calibration completed! You can now use gaze interactions.');
            }}
          />
        </div>
      </div>
    </GlassEyeTrackingProvider>
  ),
  args: {
    autoInitialize: true,
    onGazeInteraction: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the calibration flow required before eye tracking can be used.',
      },
    },
  },
};

export const SubtleMode: Story = {
  render: (args) => (
    <GlassEyeTrackingProvider {...args}>
      <div className="glass-min-glass-h-screen glass-p-8 space-y-8">
        <div className="glass-text-center">
          <h2 className="glass-text-2xl glass-font-bold glass-text-primary glass-mb-4">
            Subtle Eye Tracking Mode
          </h2>
          <p className="glass-text-sm glass-text-secondary">
            Gentle gaze effects with reduced intensity and minimal visual feedback
          </p>
        </div>
        
        <div className="glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-3 glass-gap-6">
          {['Article Card', 'Product Info', 'Call to Action'].map((title, i) => (
            <GlassGazeResponsive
              key={title}
              regionId={`subtle-${i}`}
              glassIntensity={true}
              glassRadius={false}
              glassBlur={false}
              className="glass-surface-primary glass-elev-1 glass-radius-lg glass-p-6 glass-gap-4"
            >
              <div className="glass-text-xl">📄</div>
              <h3 className="glass-text-lg glass-font-medium glass-text-primary">{title}</h3>
              <p className="glass-text-sm glass-text-secondary">
                This content subtly responds to your gaze with minimal effects.
              </p>
              <div className="glass-text-xs glass-text-tertiary">
                Look at this card to see subtle gaze responsiveness
              </div>
            </GlassGazeResponsive>
          ))}
        </div>
      </div>
      <GlassGazeVisualization show={false} />
    </GlassEyeTrackingProvider>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Subtle mode with gentle gaze effects and reduced visual feedback.',
      },
    },
  },
};

export const DramaticMode: Story = {
  render: (args) => (
    <GlassEyeTrackingProvider {...args}>
      <div className="glass-min-glass-h-screen glass-p-8 space-y-8">
        <div className="glass-text-center">
          <h2 className="glass-text-2xl glass-font-bold glass-text-primary glass-mb-4">
            Dramatic Eye Tracking Mode
          </h2>
          <p className="glass-text-sm glass-text-secondary">
            Intense gaze effects with maximum responsiveness and visual feedback
          </p>
        </div>
        
        <div className="glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 glass-gap-8">
          {['Hero Section', 'Feature Highlight'].map((title, i) => (
            <GlassGazeResponsive
              key={title}
              regionId={`dramatic-${i}`}
              glassIntensity={true}
              glassRadius={true}
              glassBlur={true}
              className="glass-surface-primary glass-elev-2 glass-radius-lg glass-p-8 space-y-6 glass-text-center glass-min-glass-h-64"
            >
              <div className="glass-text-4xl">⭐</div>
              <h3 className="glass-text-2xl glass-font-bold glass-text-primary">{title}</h3>
              <p className="glass-text-lg glass-text-secondary">
                This content dramatically responds to your gaze with intense glass effects.
              </p>
              <div className="glass-text-sm glass-text-tertiary">
                🎭 Look at this to see dramatic gaze responsiveness
              </div>
            </GlassGazeResponsive>
          ))}
        </div>
      </div>
      <GlassGazeVisualization show={true} />
    </GlassEyeTrackingProvider>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Dramatic mode with intense gaze effects and maximum visual feedback.',
      },
    },
  },
};

export const AccessibilityMode: Story = {
  render: (args) => (
    <GlassEyeTrackingProvider {...args}>
      <div className="glass-min-glass-h-screen glass-p-8 space-y-8">
        <div className="glass-text-center">
          <h2 className="glass-text-2xl glass-font-bold glass-text-primary glass-mb-4">
            Accessibility Eye Tracking Mode
          </h2>
          <p className="glass-text-sm glass-text-secondary">
            High contrast gaze effects optimized for accessibility
          </p>
        </div>
        
        <div className="glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 glass-gap-6">
          {['Accessible Content', 'High Contrast Card'].map((title, i) => (
            <GlassGazeResponsive
              key={title}
              regionId={`accessibility-${i}`}
              glassIntensity={true}
              glassRadius={true}
              glassBlur={false}
              className="glass-surface-primary glass-elev-2 glass-radius-lg glass-p-6 glass-gap-4 glass-border-2 glass-border-transparent hover:glass-border-blue"
            >
              <div className="glass-text-2xl">♿</div>
              <h3 className="glass-text-xl glass-font-bold glass-text-primary">{title}</h3>
              <p className="glass-text-base glass-text-secondary">
                This content uses high contrast gaze effects for better accessibility.
              </p>
              <div className="glass-text-sm glass-text-tertiary">
                Designed for users with visual accessibility needs
              </div>
            </GlassGazeResponsive>
          ))}
        </div>
      </div>
      <GlassGazeVisualization show={true} />
    </GlassEyeTrackingProvider>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Accessibility mode with high contrast effects and clear visual feedback.',
      },
    },
  },
};

// Simple visualization-only story
export const VisualizationOnly: Story = {
  render: () => (
    <GlassEyeTrackingProvider autoInitialize={false}>
      <div className="glass-min-glass-h-screen glass-p-8 space-y-8">
        <div className="glass-text-center">
          <h2 className="glass-text-2xl glass-font-bold glass-text-primary glass-mb-4">
            Eye Tracking Visualization
          </h2>
          <p className="glass-text-sm glass-text-secondary mb-8">
            Debug overlay showing gaze regions and interaction states
          </p>
        </div>

        <div className="glass-grid glass-glass-grid-cols-3 glass-gap-4">
          {Array.from({ length: 9 }, (_, i) => (
            <div
              key={i}
              className="glass-surface-primary glass-elev-1 glass-radius-lg glass-p-4 glass-text-center"
            >
              <div className="glass-text-lg glass-mb-2">📍</div>
              <div className="glass-text-sm glass-text-primary">Region {i + 1}</div>
            </div>
          ))}
        </div>
      </div>
      <GlassGazeVisualization show={true} />
    </GlassEyeTrackingProvider>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Shows the gaze visualization overlay for debugging gaze regions.',
      },
    },
  },
};