/**
 * AuraGlass Predictive Engine Stories
 * AI-powered system that learns user behavior and anticipates interface needs
import { cn } from '../../lib/utils';
 */

import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import React, { useState } from 'react';
import {
    GlassPredictionIndicator,
    GlassPredictiveEngineProvider,
    useInteractionRecorder,
    usePredictiveEngine
} from './GlassPredictiveEngine';

const meta: Meta<typeof GlassPredictiveEngineProvider> = {
  title: 'Advanced/Consciousness Interface/Predictive Engine',
  component: GlassPredictiveEngineProvider,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Glass Predictive Engine

AI-powered system that learns user behavior patterns and anticipates interface needs using neural networks.

## Features
- **Neural Network Learning** - Uses artificial neural networks to analyze behavior patterns
- **Real-time Predictions** - Generates predictions with confidence scoring
- **Behavioral Analysis** - Tracks sequences, temporal patterns, spatial interactions, and context
- **Adaptive Insights** - Provides performance, usability, and engagement recommendations
- **Persistent Learning** - Saves and loads user patterns across sessions

## Usage
The Predictive Engine observes user interactions and builds behavioral models to predict future needs. It can preload content, suggest actions, optimize performance, and provide insights.

## AI Capabilities
- **Sequential Pattern Recognition** - Learns action sequences and predicts next steps
- **Temporal Pattern Analysis** - Identifies time-based usage patterns
- **Spatial Interaction Mapping** - Tracks screen region preferences
- **Contextual Adaptation** - Adapts based on device type, time of day, etc.
- **Neural Network Training** - Continuously improves predictions through feedback
        `,
      },
    },
  },
  argTypes: {},
  args: {
    onPrediction: fn(),
    onInsight: fn(),
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof GlassPredictiveEngineProvider>;

// Demo component that uses the predictive engine
function PredictiveEngineDemo() {
  const [interactionCount, setInteractionCount] = useState(0);
  const [selectedPreset, setSelectedPreset] = useState('balanced');
  const { predictions, insights, engine } = usePredictiveEngine();
  const { recordClick, recordHover, recordFocus } = useInteractionRecorder('demo-component');

  const handleInteraction = (type: string) => {
    setInteractionCount(prev => prev + 1);

    // Create synthetic events for the interaction recorder
    const syntheticMouseEvent = {
      currentTarget: document.createElement('div'),
      preventDefault: () => {},
      stopPropagation: () => {},
    } as unknown as React.MouseEvent;

    const syntheticFocusEvent = {
      currentTarget: document.createElement('div'),
      preventDefault: () => {},
      stopPropagation: () => {},
    } as unknown as React.FocusEvent;

    if (type === 'click') recordClick(syntheticMouseEvent);
    if (type === 'hover') recordHover(syntheticMouseEvent);
    if (type === 'focus') recordFocus(syntheticFocusEvent);
  };

  return (
    <div className="glass-min-glass-h-screen glass-p-8 space-y-8">
      {/* Header */}
      <div className="glass-text-center glass-gap-4">
        <h1 className="glass-text-4xl glass-font-bold glass-text-primary">
          🧠 Glass Predictive Engine
        </h1>
        <p className="glass-text-lg glass-text-secondary">
          AI-powered system that learns your behavior and anticipates your needs
        </p>
        <div className="glass-surface-secondary glass-radius-lg glass-p-4">
          <div className="glass-text-sm glass-text-primary glass-mb-2">
            AI Learning Progress: {interactionCount} interactions recorded
          </div>
          <div className="glass-w-full glass-surface-primary glass-radius-sm glass-h-2 overflow-hidden">
            <div 
              className="glass-h-full glass-gradient-primary glass-gradient-primary glass-gradient-primary transition-all duration-500"
              style={{ width: `${Math.min(100, interactionCount * 2)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Interactive Elements */}
      <div className="glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-3 glass-gap-6">
        {[
          { id: 'button-1', label: 'Primary Action', color: 'blue' },
          { id: 'button-2', label: 'Secondary Action', color: 'purple' },
          { id: 'button-3', label: 'Tertiary Action', color: 'green' },
        ].map((item) => (
          <div
            key={item.id}
            className={`glass-surface-primary glass-elev-2 glass-radius-lg glass-p-6 cursor-pointer
                      hover:glass-elev-3 transition-all duration-300 text-center glass-gap-4
                      bg-gradient-to-br from-${item.color}-500/10 to-${item.color}-600/10`}
            onClick={() => handleInteraction('click')}
            onMouseEnter={() => handleInteraction('hover')}
            onFocus={() => handleInteraction('focus')}
            tabIndex={0}
          >
            <div className="glass-text-2xl">🎯</div>
            <h3 className="glass-text-lg glass-font-medium glass-text-primary">{item.label}</h3>
            <p className="glass-text-sm glass-text-secondary">
              Click to generate AI predictions
            </p>
          </div>
        ))}
      </div>

      {/* AI Predictions Display */}
      <div className="glass-grid glass-glass-grid-cols-1 lg:glass-glass-grid-cols-2 glass-gap-6">
        <div className="glass-surface-primary glass-elev-1 glass-radius-lg glass-p-6">
          <h3 className="glass-text-xl glass-font-medium glass-text-primary glass-mb-4">
            🔮 AI Predictions ({predictions.length})
          </h3>
          {predictions.length > 0 ? (
            <div className="glass-gap-3">
              {predictions.slice(0, 5).map((prediction) => (
                <div 
                  key={prediction.id}
                  className="glass-surface-secondary glass-radius-md glass-p-3"
                >
                  <div className="glass-flex glass-items-center glass-justify-between glass-mb-2">
                    <span className="glass-text-sm glass-font-medium glass-text-primary glass-capitalize">
                      {prediction.type}: {prediction.target}
                    </span>
                    <div className="glass-flex glass-items-center glass-gap-2">
                      <div 
                        className="glass-w-2 glass-h-2 glass-radius-full"
                        style={{
                          backgroundColor: prediction.confidence > 0.8 ? 'var(--glass-color-success)' : 
                                         prediction.confidence > 0.6 ? 'var(--glass-color-warning)' : 'var(--glass-color-danger)'
                        }}
                      />
                      <span className="glass-text-xs glass-text-secondary">
                        {(prediction.confidence * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                  <div className="glass-text-xs glass-text-tertiary">
                    Timing: {prediction.timing}ms | Metadata: {Object.keys(prediction.metadata).length} items
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-text-center glass-text-sm glass-text-secondary glass-py-8">
              Start interacting to see AI predictions appear...
            </div>
          )}
        </div>

        <div className="glass-surface-primary glass-elev-1 glass-radius-lg glass-p-6">
          <h3 className="glass-text-xl glass-font-medium glass-text-primary glass-mb-4">
            💡 AI Insights ({insights.length})
          </h3>
          {insights.length > 0 ? (
            <div className="glass-gap-3">
              {insights.slice(0, 3).map((insight) => (
                <div 
                  key={insight.id}
                  className="glass-surface-secondary glass-radius-md glass-p-3"
                >
                  <div className="glass-flex glass-items-center glass-justify-between glass-mb-2">
                    <span className="glass-text-sm glass-font-medium glass-text-primary glass-capitalize">
                      {insight.category}
                    </span>
                    <span className="glass-text-xs glass-text-secondary">
                      Impact: {(insight.impact * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="glass-text-sm glass-text-primary glass-mb-1">
                    {insight.insight}
                  </div>
                  <div className="glass-text-xs glass-text-tertiary">
                    💡 {insight.recommendation}
                  </div>
                  <div className="glass-text-xs glass-text-quaternary glass-mt-1">
                    Confidence: {(insight.confidence * 100).toFixed(0)}%
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-text-center glass-text-sm glass-text-secondary glass-py-8">
              AI insights will appear after sufficient interaction data...
            </div>
          )}
        </div>
      </div>

      {/* Neural Network Visualization */}
      <div className="glass-surface-primary glass-elev-1 glass-radius-lg glass-p-6">
        <h3 className="glass-text-xl glass-font-medium glass-text-primary glass-mb-4">
          🧪 Neural Network Activity
        </h3>
        <div className="glass-grid glass-glass-grid-cols-3 glass-gap-4 glass-text-center">
          <div className="glass-gap-2">
            <div className="glass-text-2xl">📥</div>
            <div className="glass-text-sm glass-text-secondary">Input Layer</div>
            <div className="glass-text-lg glass-font-medium glass-text-primary">
              {interactionCount > 10 ? '10 neurons' : `${interactionCount} neurons`}
            </div>
          </div>
          <div className="glass-gap-2">
            <div className="glass-text-2xl">🔄</div>
            <div className="glass-text-sm glass-text-secondary">Hidden Layer</div>
            <div className="glass-text-lg glass-font-medium glass-text-primary">
              20 neurons
            </div>
          </div>
          <div className="glass-gap-2">
            <div className="glass-text-2xl">📤</div>
            <div className="glass-text-sm glass-text-secondary">Output Layer</div>
            <div className="glass-text-lg glass-font-medium glass-text-primary">
              5 predictions
            </div>
          </div>
        </div>
        <div className="glass-mt-4 glass-text-center">
          <div className="glass-glass-inline-glass-flex glass-items-center glass-gap-2 glass-surface-secondary glass-radius-full glass-px-4 glass-py-2">
            <div className="glass-w-2 glass-h-2 glass-surface-green glass-radius-full animate-pulse" />
            <span className="glass-text-sm glass-text-primary">
              Neural network {interactionCount > 5 ? 'actively learning' : 'initializing'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export const Interactive: Story = {
  render: (args) => (
    <GlassPredictiveEngineProvider {...args}>
      <PredictiveEngineDemo />
      <GlassPredictionIndicator showInsights={true} maxPredictions={5} />
    </GlassPredictiveEngineProvider>
  ),
};

export const Conservative: Story = {
  render: (args) => (
    <GlassPredictiveEngineProvider {...args}>
      <div className="glass-p-8">
        <h2 className="glass-text-2xl glass-font-bold glass-text-primary glass-mb-4">
          Conservative AI Mode
        </h2>
        <p className="glass-text-sm glass-text-secondary mb-6">
          High confidence threshold (80%), slower learning, 3 max predictions
        </p>
        <PredictiveEngineDemo />
      </div>
      <GlassPredictionIndicator showInsights={true} maxPredictions={3} />
    </GlassPredictiveEngineProvider>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Conservative mode with high confidence thresholds and fewer predictions.',
      },
    },
  },
};

export const Aggressive: Story = {
  render: (args) => (
    <GlassPredictiveEngineProvider {...args}>
      <div className="glass-p-8">
        <h2 className="glass-text-2xl glass-font-bold glass-text-primary glass-mb-4">
          Aggressive AI Mode
        </h2>
        <p className="glass-text-sm glass-text-secondary mb-6">
          Low confidence threshold (40%), fast learning, 10 max predictions
        </p>
        <PredictiveEngineDemo />
      </div>
      <GlassPredictionIndicator showInsights={true} maxPredictions={10} />
    </GlassPredictiveEngineProvider>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Aggressive mode with low confidence thresholds and many predictions.',
      },
    },
  },
};

export const Experimental: Story = {
  render: (args) => (
    <GlassPredictiveEngineProvider {...args}>
      <div className="glass-p-8">
        <h2 className="glass-text-2xl glass-font-bold glass-text-primary glass-mb-4">
          Experimental AI Mode
        </h2>
        <p className="glass-text-sm glass-text-secondary mb-6">
          Ultra-low confidence threshold (30%), maximum predictions (15), advanced neural network
        </p>
        <PredictiveEngineDemo />
      </div>
      <GlassPredictionIndicator showInsights={true} maxPredictions={15} />
    </GlassPredictiveEngineProvider>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Experimental mode with the most aggressive prediction settings for maximum AI responsiveness.',
      },
    },
  },
};

// Minimal prediction indicator story
export const PredictionIndicatorOnly: Story = {
  render: () => (
    <GlassPredictiveEngineProvider>
      <div className="glass-min-glass-h-screen glass-p-8">
        <h2 className="glass-text-2xl glass-font-bold glass-text-primary glass-mb-4">
          Prediction Indicator Demo
        </h2>
        <p className="glass-text-sm glass-text-secondary mb-8">
          The floating AI indicator shows when predictions are available. Click elements to generate predictions.
        </p>
        
        <div className="glass-grid glass-glass-grid-cols-2 md:glass-glass-grid-cols-4 glass-gap-4">
          {Array.from({ length: 8 }, (_, i) => (
            <button
              key={i}
              className="glass-surface-primary glass-elev-2 glass-radius-lg glass-p-4 hover:glass-elev-3 transition-all duration-300 glass-focus glass-touch-target glass-contrast-guard"
              onClick={() => console.log(`Button ${i + 1} clicked`)}
            >
              <div className="glass-text-lg glass-mb-2">🎯</div>
              <div className="glass-text-sm glass-text-primary">Action {i + 1}</div>
            </button>
          ))}
        </div>
      </div>
      <GlassPredictionIndicator showInsights={true} maxPredictions={5} />
    </GlassPredictiveEngineProvider>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Shows just the floating prediction indicator with interactive elements.',
      },
    },
  },
};