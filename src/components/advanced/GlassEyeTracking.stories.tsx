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
    <div className="glass-min-h-screen p-8 space-y-8">
      {/* Header */}
      <div className="text-center gap-4">
        <h1 className="text-4xl font-bold text-primary">
          👁️ Glass Eye Tracking
        </h1>
        <p className="text-lg glass-text-secondary">
          Gaze-responsive interface that reacts to where you look
        </p>
        
        {/* Status Indicators */}
        <div className="flex justify-center gap-4">
          <div className={`flex items-center glass-gap-2 glass-surface-secondary glass-radius-full glass-px-4 glass-py-2`}>
            <div className={`w-2 h-2 glass-radius-full ${isInitialized ? 'bg-green-400' : 'bg-red-400'}`} />
            <span className="text-sm text-primary">
              {isInitialized ? 'Eye Tracking Active' : 'Not Initialized'}
            </span>
          </div>
          
          <div className="flex items-center gap-2 glass-surface-secondary glass-radius-full px-4 py-2">
            <div className={`w-2 h-2 glass-radius-full ${isCalibrating ? 'bg-yellow-400' : 'bg-blue-400'}`} />
            <span className="text-sm text-primary">
              {isCalibrating ? 'Calibrating' : 'Ready'}
            </span>
          </div>
          
          <div className="flex items-center gap-2 glass-surface-secondary glass-radius-full px-4 py-2">
            <div className="text-sm text-primary">
              👁️ Gaze Interactions: {gazeCount}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4">
          <button
            onClick={() => setShowVisualization(!showVisualization)}
            className="glass-surface-primary glass-elev-2 glass-radius-lg px-4 py-2 hover:glass-elev-3 transition-all duration-300 glass-focus glass-touch-target glass-contrast-guard"
          >
            {showVisualization ? '👁️ Hide Gaze Debug' : '👁️ Show Gaze Debug'}
          </button>
        </div>
      </div>

      {/* Gaze-Responsive Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
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
            className="glass-surface-primary glass-elev-2 glass-radius-lg p-6 text-center gap-4 cursor-pointer glass-min-h-32"
          >
            <div className="text-3xl">
              {['👁️', '🔍', '👀', '🎯', '✨', '💎', '🌟', '🔮'][i]}
            </div>
            <h3 className="text-lg font-medium text-primary">
              Gaze Zone {i + 1}
            </h3>
            <p className="text-sm glass-text-secondary">
              Look at me to see the gaze effect!
            </p>
          </GlassGazeResponsive>
        ))}
      </div>

      {/* Active Interactions Display */}
      <div className="glass-surface-primary glass-elev-1 glass-radius-lg p-6">
        <h3 className="text-xl font-medium text-primary mb-4">
          👁️ Active Gaze Interactions ({activeInteractions.length})
        </h3>
        {activeInteractions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeInteractions.map((interaction) => (
              <div 
                key={interaction.region.id}
                className="glass-surface-secondary glass-radius-md p-4 gap-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-primary">
                    {interaction.region.id}
                  </span>
                  <span className="text-xs glass-text-secondary capitalize">
                    {interaction.type}
                  </span>
                </div>
                <div className="gap-1">
                  <div className="flex justify-between text-xs glass-text-tertiary">
                    <span>Duration:</span>
                    <span>{interaction.duration}ms</span>
                  </div>
                  <div className="flex justify-between text-xs glass-text-tertiary">
                    <span>Intensity:</span>
                    <span>{(interaction.intensity * 100).toFixed(0)}%</span>
                  </div>
                  <div className="w-full glass-surface-primary glass-radius-sm h-1 overflow-hidden">
                    <div 
                      className="h-full glass-surface-blue transition-all duration-300"
                      style={{ width: `${interaction.intensity * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-sm glass-text-secondary py-8">
            Look at the gaze-responsive elements above to see active interactions...
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="glass-surface-primary glass-elev-1 glass-radius-lg p-6">
        <h3 className="text-xl font-medium text-primary mb-4">
          📋 How to Use Eye Tracking
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="gap-3">
            <h4 className="text-lg font-medium text-primary">Setup Steps:</h4>
            <ol className="list-decimal list-inside gap-2 text-sm glass-text-secondary">
              <li>Grant camera permission when prompted</li>
              <li>Complete the 9-point calibration process</li>
              <li>Look at different elements to see gaze effects</li>
              <li>Toggle visualization to see debug overlay</li>
            </ol>
          </div>
          <div className="gap-3">
            <h4 className="text-lg font-medium text-primary">Tips for Best Results:</h4>
            <ul className="list-disc list-inside gap-2 text-sm glass-text-secondary">
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
      <div className="glass-min-h-screen p-8">
        <div className="text-center space-y-6">
          <h1 className="text-3xl font-bold text-primary">
            Eye Tracking Calibration
          </h1>
          <p className="text-lg glass-text-secondary">
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
      <div className="glass-min-h-screen p-8 space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-primary mb-4">
            Subtle Eye Tracking Mode
          </h2>
          <p className="text-sm glass-text-secondary">
            Gentle gaze effects with reduced intensity and minimal visual feedback
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {['Article Card', 'Product Info', 'Call to Action'].map((title, i) => (
            <GlassGazeResponsive
              key={title}
              regionId={`subtle-${i}`}
              glassIntensity={true}
              glassRadius={false}
              glassBlur={false}
              className="glass-surface-primary glass-elev-1 glass-radius-lg p-6 gap-4"
            >
              <div className="text-xl">📄</div>
              <h3 className="text-lg font-medium text-primary">{title}</h3>
              <p className="text-sm glass-text-secondary">
                This content subtly responds to your gaze with minimal effects.
              </p>
              <div className="text-xs glass-text-tertiary">
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
      <div className="glass-min-h-screen p-8 space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-primary mb-4">
            Dramatic Eye Tracking Mode
          </h2>
          <p className="text-sm glass-text-secondary">
            Intense gaze effects with maximum responsiveness and visual feedback
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {['Hero Section', 'Feature Highlight'].map((title, i) => (
            <GlassGazeResponsive
              key={title}
              regionId={`dramatic-${i}`}
              glassIntensity={true}
              glassRadius={true}
              glassBlur={true}
              className="glass-surface-primary glass-elev-2 glass-radius-lg p-8 space-y-6 text-center glass-min-h-64"
            >
              <div className="text-4xl">⭐</div>
              <h3 className="text-2xl font-bold text-primary">{title}</h3>
              <p className="text-lg glass-text-secondary">
                This content dramatically responds to your gaze with intense glass effects.
              </p>
              <div className="text-sm glass-text-tertiary">
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
      <div className="glass-min-h-screen p-8 space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-primary mb-4">
            Accessibility Eye Tracking Mode
          </h2>
          <p className="text-sm glass-text-secondary">
            High contrast gaze effects optimized for accessibility
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {['Accessible Content', 'High Contrast Card'].map((title, i) => (
            <GlassGazeResponsive
              key={title}
              regionId={`accessibility-${i}`}
              glassIntensity={true}
              glassRadius={true}
              glassBlur={false}
              className="glass-surface-primary glass-elev-2 glass-radius-lg p-6 gap-4 border-2 border-transparent hover:border-blue"
            >
              <div className="text-2xl">♿</div>
              <h3 className="text-xl font-bold text-primary">{title}</h3>
              <p className="text-base glass-text-secondary">
                This content uses high contrast gaze effects for better accessibility.
              </p>
              <div className="text-sm glass-text-tertiary">
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
      <div className="glass-min-h-screen p-8 space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-primary mb-4">
            Eye Tracking Visualization
          </h2>
          <p className="text-sm glass-text-secondary mb-8">
            Debug overlay showing gaze regions and interaction states
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 9 }, (_, i) => (
            <div
              key={i}
              className="glass-surface-primary glass-elev-1 glass-radius-lg p-4 text-center"
            >
              <div className="text-lg mb-2">📍</div>
              <div className="text-sm text-primary">Region {i + 1}</div>
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