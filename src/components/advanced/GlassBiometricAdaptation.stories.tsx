/**
 * AuraGlass Biometric Adaptation Stories
 * Heart rate and stress-responsive UI with device sensors and behavioral analysis
import { cn } from '../../lib/utils';
 */

import type { Meta, StoryObj } from '@storybook/react';
import React, { useState, useEffect } from 'react';
import {
  GlassBiometricAdaptationProvider,
  GlassStressResponsive,
  GlassBiometricDashboard,
  useBiometricAdaptation,
  biometricAdaptationPresets,
} from './GlassBiometricAdaptation';

const meta: Meta<typeof GlassBiometricAdaptationProvider> = {
  title: 'Advanced/Consciousness Interface/Biometric Adaptation',
  component: GlassBiometricAdaptationProvider,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Glass Biometric Adaptation System

Heart rate and stress-responsive UI with device sensors and behavioral analysis.

## Features
- **Device Sensor Integration** - Accelerometer, gyroscope, and ambient light sensors
- **Behavioral Stress Analysis** - Analyzes interaction patterns to detect stress
- **Heart Rate Monitoring** - Web Bluetooth API integration for heart rate monitors
- **Adaptive UI Responses** - Interface adapts colors, motion, layout based on stress levels
- **Real-time Dashboard** - Biometric monitoring with visualization and controls

## Biometric Detection Methods
- **Behavioral Analysis** - Rapid clicking, irregular movements, prolonged hover times
- **Device Motion** - Accelerometer and gyroscope for agitation detection
- **Environmental Context** - Ambient light, time of day patterns
- **Heart Rate Devices** - Bluetooth heart rate monitors (requires pairing)
- **Machine Learning** - Pattern recognition for stress indicators

## Adaptation Types
- **Color Adaptation** - Calming colors during stress, energizing colors when calm
- **Motion Adaptation** - Slower animations during stress to reduce overstimulation
- **Layout Adaptation** - Simplified layouts with increased spacing during stress
- **Audio Adaptation** - Reduced volume and calming frequencies during stress

## Privacy & Security
- **Local Processing** - All biometric analysis happens on-device
- **No Data Transmission** - Biometric data never leaves the user's browser
- **Behavioral Inference** - Uses interaction patterns, not raw biometric data
- **User Control** - Users can disable sensors and adaptations at any time

## Stress Levels
- **0.0 - 0.3** - Calm state (energizing adaptations)
- **0.3 - 0.7** - Normal state (standard interface)
- **0.7 - 1.0** - Stressed state (calming adaptations)
        `,
      },
    },
  },
  argTypes: {
    settings: {
      control: 'object',
      description: 'Biometric adaptation configuration',
    },
    autoInitialize: {
      control: 'boolean',
      description: 'Automatically initialize biometric monitoring',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof GlassBiometricAdaptationProvider>;

// Demo component that simulates stress scenarios
function BiometricAdaptationDemo() {
  const { 
    latestReading, 
    currentStressLevel, 
    connectHeartRateMonitor,
    engine
  } = useBiometricAdaptation();
  
  const [simulatedStress, setSimulatedStress] = useState(0);
  const [interactionCount, setInteractionCount] = useState(0);
  const [rapidClicks, setRapidClicks] = useState(0);
  const [showDashboard, setShowDashboard] = useState(true);

  // Simulate stress scenarios for demo
  const simulateStressScenario = (scenario: string) => {
    switch (scenario) {
      case 'calm':
        setSimulatedStress(0.1);
        break;
      case 'focused':
        setSimulatedStress(0.4);
        break;
      case 'stressed':
        setSimulatedStress(0.8);
        break;
      case 'overwhelmed':
        setSimulatedStress(0.95);
        break;
    }
  };

  // Handle rapid clicking to simulate stress
  const handleRapidClick = () => {
    const now = Date.now();
    setRapidClicks(prev => prev + 1);
    setInteractionCount(prev => prev + 1);
    
    // Simulate stress from rapid clicking
    if (rapidClicks > 10) {
      setSimulatedStress(Math.min(1, simulatedStress + 0.1));
    }
    
    // Record interaction if engine available
    // Note: recordAction method not available on BiometricAdaptationEngine
    // if (engine) {
    //   engine.recordAction('click', {
    //     rapid: rapidClicks > 5,
    //     timestamp: now,
    //   });
    // }
  };

  // Reset rapid clicks periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setRapidClicks(prev => Math.max(0, prev - 1));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const effectiveStressLevel = Math.max(currentStressLevel, simulatedStress);

  return (
    <div className="glass-min-glass-h-screen glass-p-8 space-y-8">
      {/* Header */}
      <div className="glass-text-center glass-gap-4">
        <h1 className="glass-text-4xl glass-font-bold glass-text-primary">
          🌡️ Glass Biometric Adaptation
        </h1>
        <p className="glass-text-lg glass-text-secondary">
          Interface that adapts to your physiological and behavioral state
        </p>
        
        {/* Current Status */}
        <div className="glass-flex glass-justify-center glass-items-center space-x-6">
          <div className="glass-flex glass-items-center glass-gap-2 glass-surface-secondary glass-radius-full glass-px-4 glass-py-2">
            <div 
              className="glass-w-3 glass-h-3 glass-radius-full"
              style={{
                backgroundColor: effectiveStressLevel > 0.7 ? 'var(--glass-color-danger)' : 
                                effectiveStressLevel > 0.4 ? 'var(--glass-color-warning)' : 
                                'var(--glass-color-success)'
              }}
            />
            <span className="glass-text-sm glass-text-primary">
              Stress: {(effectiveStressLevel * 100).toFixed(0)}%
            </span>
          </div>
          
          {latestReading?.heartRate && (
            <div className="glass-flex glass-items-center glass-gap-2 glass-surface-secondary glass-radius-full glass-px-4 glass-py-2">
              <span className="glass-text-sm glass-text-primary">
                ❤️ {latestReading.heartRate} BPM
              </span>
            </div>
          )}
          
          <div className="glass-flex glass-items-center glass-gap-2 glass-surface-secondary glass-radius-full glass-px-4 glass-py-2">
            <span className="glass-text-sm glass-text-primary">
              🖱️ Interactions: {interactionCount}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="glass-flex glass-justify-center glass-gap-4">
          <button
            onClick={() => setShowDashboard(!showDashboard)}
            className="glass-surface-primary glass-elev-2 glass-radius-lg glass-px-4 glass-py-2 hover:glass-elev-3 transition-all duration-300 glass-focus glass-touch-target glass-contrast-guard"
          >
            {showDashboard ? '📊 Hide Dashboard' : '📊 Show Dashboard'}
          </button>
          
          <button
            onClick={connectHeartRateMonitor}
            className="glass-surface-primary glass-elev-2 glass-radius-lg glass-px-4 glass-py-2 hover:glass-elev-3 transition-all duration-300 glass-focus glass-touch-target glass-contrast-guard glass-focus glass-touch-target glass-contrast-guard"
          >
            ❤️ Connect Heart Rate Monitor
          </button>
        </div>
      </div>

      {/* Stress Simulation Controls */}
      <div className="glass-surface-primary glass-elev-1 glass-radius-lg glass-p-6">
        <h3 className="glass-text-xl glass-font-medium glass-text-primary glass-mb-4">
          🎭 Stress Simulation
        </h3>
        <div className="glass-grid glass-glass-grid-cols-2 md:glass-glass-grid-cols-4 glass-gap-4">
          {[
            { scenario: 'calm', label: 'Calm State', icon: '😌', stress: 0.1 },
            { scenario: 'focused', label: 'Focused', icon: '🎯', stress: 0.4 },
            { scenario: 'stressed', label: 'Stressed', icon: '😰', stress: 0.8 },
            { scenario: 'overwhelmed', label: 'Overwhelmed', icon: '🤯', stress: 0.95 },
          ].map((item) => (
            <button
              key={item.scenario}
              onClick={() => simulateStressScenario(item.scenario)}
              className={`glass-surface-secondary glass-elev-2 glass-radius-lg glass-p-4 text-center glass-gap-2
                         hover:glass-elev-3 transition-all duration-300 glass-focus glass-touch-target glass-contrast-guard
                         ${simulatedStress === item.stress ? 'ring-2 ring-blue-500' : ''}`}
            >
              <div className="glass-text-2xl">{item.icon}</div>
              <div className="glass-text-sm glass-text-primary glass-font-medium">{item.label}</div>
              <div className="glass-text-xs glass-text-secondary">{(item.stress * 100).toFixed(0)}%</div>
            </button>
          ))}
        </div>
        <div className="glass-mt-4 glass-text-center">
          <p className="glass-text-sm glass-text-secondary">
            Click buttons above to simulate different stress states and see interface adaptations
          </p>
        </div>
      </div>

      {/* Stress-Responsive Interface Elements */}
      <div className="space-y-6">
        <div className="glass-text-center">
          <h2 className="glass-text-2xl glass-font-bold glass-text-primary glass-mb-2">
            🎨 Adaptive Interface Elements
          </h2>
          <p className="glass-text-sm glass-text-secondary">
            These elements adapt their appearance based on your stress level
          </p>
        </div>
        
        <div className="glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-3 glass-gap-6">
          <GlassStressResponsive adaptationType="color">
            <div className="glass-surface-primary glass-elev-2 glass-radius-lg glass-p-6 glass-text-center glass-gap-4">
              <div className="glass-text-2xl">🎨</div>
              <h3 className="glass-text-lg glass-font-medium glass-text-primary">Color Adaptation</h3>
              <p className="glass-text-sm glass-text-secondary">
                Colors shift to calming blues when stressed
              </p>
              <div className="glass-text-xs glass-text-tertiary">
                Current: {effectiveStressLevel > 0.7 ? 'Calming Mode' : 'Normal Mode'}
              </div>
            </div>
          </GlassStressResponsive>
          
          <GlassStressResponsive adaptationType="motion">
            <div className="glass-surface-primary glass-elev-2 glass-radius-lg glass-p-6 glass-text-center glass-gap-4">
              <div className="glass-text-2xl">🌊</div>
              <h3 className="glass-text-lg glass-font-medium glass-text-primary">Motion Adaptation</h3>
              <p className="glass-text-sm glass-text-secondary">
                Animations slow down during stress
              </p>
              <div className="glass-text-xs glass-text-tertiary">
                Speed: {effectiveStressLevel > 0.7 ? 'Slower' : 'Normal'}
              </div>
            </div>
          </GlassStressResponsive>
          
          <GlassStressResponsive adaptationType="layout">
            <div className="glass-surface-primary glass-elev-2 glass-radius-lg glass-p-6 glass-text-center glass-gap-4">
              <div className="glass-text-2xl">📐</div>
              <h3 className="glass-text-lg glass-font-medium glass-text-primary">Layout Adaptation</h3>
              <p className="glass-text-sm glass-text-secondary">
                Spacing increases when stressed
              </p>
              <div className="glass-text-xs glass-text-tertiary">
                Density: {effectiveStressLevel > 0.7 ? 'Reduced' : 'Normal'}
              </div>
            </div>
          </GlassStressResponsive>
        </div>
        
        {/* Full Adaptation Example */}
        <GlassStressResponsive adaptationType="all">
          <div className="glass-surface-primary glass-elev-2 glass-radius-lg glass-p-8 glass-text-center space-y-6">
            <div className="glass-text-3xl">🧘‍♀️</div>
            <h3 className="glass-text-xl glass-font-bold glass-text-primary">Full Biometric Adaptation</h3>
            <p className="glass-text-lg glass-text-secondary">
              This element uses all adaptation types: color, motion, and layout
            </p>
            <div className="glass-gap-2">
              <div className="glass-text-sm glass-text-tertiary">
                Adaptation Status: {effectiveStressLevel > 0.7 ? '🧘‍♀️ Calming Mode Active' : '⚡ Normal Mode'}
              </div>
              <div className="glass-text-sm glass-text-tertiary">
                Interface responds to stress in real-time
              </div>
            </div>
          </div>
        </GlassStressResponsive>
      </div>

      {/* Interactive Stress Test */}
      <div className="glass-surface-primary glass-elev-1 glass-radius-lg glass-p-6">
        <h3 className="glass-text-xl glass-font-medium glass-text-primary glass-mb-4">
          🖱️ Behavioral Stress Detection
        </h3>
        <div className="glass-text-center glass-gap-4">
          <p className="glass-text-sm glass-text-secondary">
            Click rapidly on the button below to simulate stress behavior
          </p>
          <button
            onClick={handleRapidClick}
            className="glass-surface-secondary glass-elev-2 glass-radius-lg glass-px-8 glass-py-4 glass-text-lg glass-font-medium
                      hover:glass-elev-3 transition-all duration-300 glass-text-primary glass-focus glass-touch-target glass-contrast-guard glass-focus glass-touch-target glass-contrast-guard"
          >
            🖱️ Stress Test Button
          </button>
          <div className="glass-gap-2">
            <div className="glass-text-sm glass-text-tertiary">
              Rapid Clicks: {rapidClicks} | {rapidClicks > 10 ? '🚨 Stress Detected!' : '✅ Normal Behavior'}
            </div>
            <div className="glass-text-xs glass-text-quaternary">
              Click rapidly multiple times to trigger behavioral stress detection
            </div>
          </div>
        </div>
      </div>

      {/* Biometric Information */}
      <div className="glass-surface-primary glass-elev-1 glass-radius-lg glass-p-6">
        <h3 className="glass-text-xl glass-font-medium glass-text-primary glass-mb-4">
          📊 Biometric Detection Methods
        </h3>
        <div className="glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 lg:glass-glass-grid-cols-3 glass-gap-6">
          <div className="glass-gap-3">
            <h4 className="glass-text-lg glass-font-medium glass-text-primary">Behavioral Analysis</h4>
            <ul className="glass-gap-1 glass-text-sm glass-text-secondary">
              <li>• Rapid clicking patterns</li>
              <li>• Irregular mouse movements</li>
              <li>• Prolonged hover times</li>
              <li>• Error frequency tracking</li>
            </ul>
          </div>
          <div className="glass-gap-3">
            <h4 className="glass-text-lg glass-font-medium glass-text-primary">Device Sensors</h4>
            <ul className="glass-gap-1 glass-text-sm glass-text-secondary">
              <li>• Accelerometer (device shake)</li>
              <li>• Gyroscope (rotation patterns)</li>
              <li>• Ambient light sensor</li>
              <li>• Time-based context</li>
            </ul>
          </div>
          <div className="glass-gap-3">
            <h4 className="glass-text-lg glass-font-medium glass-text-primary">External Devices</h4>
            <ul className="glass-gap-1 glass-text-sm glass-text-secondary">
              <li>• Bluetooth heart rate monitors</li>
              <li>• Fitness trackers (via Web Bluetooth)</li>
              <li>• Smartwatch integration</li>
              <li>• Health device APIs</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Dashboard */}
      <GlassBiometricDashboard show={showDashboard} />
    </div>
  );
}

export const Interactive: Story = {
  render: (args) => (
    <GlassBiometricAdaptationProvider {...args}>
      <BiometricAdaptationDemo />
    </GlassBiometricAdaptationProvider>
  ),
  args: {
    settings: biometricAdaptationPresets.standard,
    autoInitialize: true,
  },
};

export const SubtleMode: Story = {
  render: (args) => (
    <GlassBiometricAdaptationProvider {...args}>
      <div className="glass-min-glass-h-screen glass-p-8 space-y-8">
        <div className="glass-text-center">
          <h2 className="glass-text-2xl glass-font-bold glass-text-primary glass-mb-4">
            Subtle Biometric Adaptation
          </h2>
          <p className="glass-text-sm glass-text-secondary mb-6">
            Gentle adaptations with reduced sensitivity and slower response times
          </p>
        </div>
        
        <div className="glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 glass-gap-8">
          <GlassStressResponsive adaptationType="all">
            <div className="glass-surface-primary glass-elev-2 glass-radius-lg glass-p-6 glass-gap-4">
              <div className="glass-text-2xl">🌅</div>
              <h3 className="glass-text-lg glass-font-medium glass-text-primary">Subtle Adaptation</h3>
              <p className="glass-text-sm glass-text-secondary">
                Gentle changes that don't distract from the main experience
              </p>
            </div>
          </GlassStressResponsive>
          
          <div className="glass-surface-primary glass-elev-1 glass-radius-lg glass-p-6">
            <h4 className="glass-text-lg glass-font-medium glass-text-primary glass-mb-3">Settings</h4>
            <div className="glass-gap-2 glass-text-sm glass-text-secondary">
              <div>• Sensitivity: 30% (Low)</div>
              <div>• Response Speed: 2000ms (Slow)</div>
              <div>• Stress Threshold: 80% (High)</div>
              <div>• Calming Threshold: 20% (Low)</div>
            </div>
          </div>
        </div>
      </div>
      <GlassBiometricDashboard show={true} />
    </GlassBiometricAdaptationProvider>
  ),
  args: {
    settings: biometricAdaptationPresets.subtle,
    autoInitialize: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Subtle mode with gentle adaptations and reduced sensitivity.',
      },
    },
  },
};

export const SensitiveMode: Story = {
  render: (args) => (
    <GlassBiometricAdaptationProvider {...args}>
      <div className="glass-min-glass-h-screen glass-p-8 space-y-8">
        <div className="glass-text-center">
          <h2 className="glass-text-2xl glass-font-bold glass-text-primary glass-mb-4">
            Sensitive Biometric Adaptation
          </h2>
          <p className="glass-text-sm glass-text-secondary mb-6">
            Highly responsive adaptations that react quickly to biometric changes
          </p>
        </div>
        
        <div className="glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-3 glass-gap-6">
          {['Quick Response', 'High Sensitivity', 'Immediate Feedback'].map((title, i) => (
            <GlassStressResponsive key={title} adaptationType="all">
              <div className="glass-surface-primary glass-elev-2 glass-radius-lg glass-p-6 glass-gap-4">
                <div className="glass-text-2xl">⚡</div>
                <h3 className="glass-text-lg glass-font-medium glass-text-primary">{title}</h3>
                <p className="glass-text-sm glass-text-secondary">
                  Responds immediately to even small changes in stress levels
                </p>
              </div>
            </GlassStressResponsive>
          ))}
        </div>
        
        <div className="glass-surface-primary glass-elev-1 glass-radius-lg glass-p-6">
          <h4 className="glass-text-lg glass-font-medium glass-text-primary glass-mb-3">Sensitive Mode Settings</h4>
          <div className="glass-grid glass-glass-grid-cols-2 glass-gap-4 glass-text-sm glass-text-secondary">
            <div>• Sensitivity: 90% (Very High)</div>
            <div>• Response Speed: 500ms (Fast)</div>
            <div>• Stress Threshold: 50% (Low)</div>
            <div>• Calming Threshold: 40% (High)</div>
          </div>
        </div>
      </div>
      <GlassBiometricDashboard show={true} />
    </GlassBiometricAdaptationProvider>
  ),
  args: {
    settings: biometricAdaptationPresets.sensitive,
    autoInitialize: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Sensitive mode with high responsiveness and quick adaptations.',
      },
    },
  },
};

export const AccessibilityMode: Story = {
  render: (args) => (
    <GlassBiometricAdaptationProvider {...args}>
      <div className="glass-min-glass-h-screen glass-p-8 space-y-8">
        <div className="glass-text-center">
          <h2 className="glass-text-2xl glass-font-bold glass-text-primary glass-mb-4">
            Accessibility Biometric Adaptation
          </h2>
          <p className="glass-text-sm glass-text-secondary mb-6">
            Optimized for users with accessibility needs and clear visual feedback
          </p>
        </div>
        
        <div className="glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 glass-gap-8">
          <GlassStressResponsive adaptationType="all">
            <div className="glass-surface-primary glass-elev-2 glass-radius-lg glass-p-8 glass-gap-4 glass-border-2 glass-border-blue/30">
              <div className="glass-text-3xl">♿</div>
              <h3 className="glass-text-xl glass-font-bold glass-text-primary">Accessible Adaptation</h3>
              <p className="glass-text-base glass-text-secondary">
                High contrast adaptations with clear visual feedback for users with accessibility needs
              </p>
              <div className="glass-text-sm glass-text-tertiary glass-p-3 glass-surface-blue/10 glass-radius-md">
                ℹ️ This element provides clear visual indicators of adaptation state
              </div>
            </div>
          </GlassStressResponsive>
          
          <div className="space-y-6">
            <div className="glass-surface-primary glass-elev-1 glass-radius-lg glass-p-6">
              <h4 className="glass-text-lg glass-font-medium glass-text-primary glass-mb-3">Accessibility Features</h4>
              <ul className="glass-gap-2 glass-text-sm glass-text-secondary">
                <li>• High contrast mode support</li>
                <li>• Clear visual state indicators</li>
                <li>• Reduced motion options</li>
                <li>• Screen reader compatibility</li>
                <li>• Keyboard navigation support</li>
              </ul>
            </div>
            
            <div className="glass-surface-primary glass-elev-1 glass-radius-lg glass-p-6">
              <h4 className="glass-text-lg glass-font-medium glass-text-primary glass-mb-3">Settings</h4>
              <div className="glass-gap-2 glass-text-sm glass-text-secondary">
                <div>• All adaptations enabled</div>
                <div>• Stress threshold: 60%</div>
                <div>• High contrast mode</div>
                <div>• Clear visual feedback</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <GlassBiometricDashboard show={true} />
    </GlassBiometricAdaptationProvider>
  ),
  args: {
    settings: biometricAdaptationPresets.accessibility,
    autoInitialize: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Accessibility mode optimized for users with special needs and clear feedback.',
      },
    },
  },
};

// Dashboard-only story
export const DashboardOnly: Story = {
  render: (args) => (
    <GlassBiometricAdaptationProvider {...args}>
      <div className="glass-min-glass-h-screen glass-p-8">
        <div className="glass-text-center glass-gap-4 mb-8">
          <h2 className="glass-text-2xl glass-font-bold glass-text-primary">
            Biometric Dashboard
          </h2>
          <p className="glass-text-sm glass-text-secondary">
            Real-time biometric monitoring and adaptation settings
          </p>
        </div>
        
        <div className="glass-grid glass-glass-grid-cols-2 md:glass-glass-grid-cols-4 glass-gap-4 mb-8">
          {Array.from({ length: 8 }, (_, i) => (
            <button
              key={i}
              className="glass-surface-primary glass-elev-2 glass-radius-lg glass-p-4 hover:glass-elev-3 transition-all duration-300 glass-focus glass-touch-target glass-contrast-guard"
              onClick={() => console.log(`Interaction ${i + 1}`)}
            >
              <div className="glass-text-lg glass-mb-2">🖱️</div>
              <div className="glass-text-sm glass-text-primary">Action {i + 1}</div>
            </button>
          ))}
        </div>
      </div>
      <GlassBiometricDashboard show={true} />
    </GlassBiometricAdaptationProvider>
  ),
  args: {
    settings: biometricAdaptationPresets.standard,
    autoInitialize: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the biometric dashboard with interactive elements for testing.',
      },
    },
  },
};