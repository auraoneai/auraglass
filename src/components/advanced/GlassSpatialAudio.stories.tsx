/**
 * AuraGlass Spatial Audio Stories
 * 3D positioned glass sounds with Web Audio API and HRTF
 */

import type { Meta, StoryObj } from '@storybook/react';
import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../../lib/utils';
import {
  GlassSpatialAudioProvider,
  GlassAudioReactive,
  GlassSpatialVisualizer,
  useSpatialAudio,
  useGlassSound,
  spatialAudioPresets,
} from './GlassSpatialAudio';

const meta: Meta<typeof GlassSpatialAudioProvider> = {
  title: 'Advanced/Consciousness Interface/Spatial Audio',
  component: GlassSpatialAudioProvider,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Glass Spatial Audio System

3D positioned glass sounds with Web Audio API and Head-Related Transfer Function (HRTF) processing.

## Features
- **3D Spatial Positioning** - Sounds positioned in 3D space with accurate directional audio
- **HRTF Processing** - Head-Related Transfer Function for realistic 3D audio perception
- **Glass-Themed Sound Library** - Synthesized glass sounds (tap, hover, slide, break, ambient)
- **Real-time Audio Analysis** - Volume and frequency analysis for reactive components
- **Spatial Visualization** - 3D audio space visualization with active sound sources
- **Multiple Distance Models** - Linear, inverse, and exponential distance attenuation

## Technical Implementation
- **Web Audio API** - Full Web Audio API integration with AudioContext management
- **PannerNode** - 3D audio positioning with HRTF or equalpower panning
- **Synthetic Audio Generation** - Procedurally generated glass sounds using oscillators
- **Audio-Reactive Components** - Visual elements that respond to audio characteristics
- **Performance Optimized** - Efficient audio buffer management and source pooling

## Sound Types
- **UI Sounds** - Sharp, metallic sounds for interface interactions
- **Ambient Sounds** - Soft, ethereal glass atmosphere
- **Feedback Sounds** - Glass breaking, sliding, and transformation effects
- **Notification Sounds** - Bell-like glass chimes for alerts

## Browser Support
- **Modern Browsers** - Chrome, Firefox, Edge, Safari with Web Audio API
- **HTTPS Required** - Some browsers require HTTPS for audio context
- **User Interaction** - Audio context must be initialized after user gesture
        `,
      },
    },
  },
  argTypes: {
    settings: {
      control: 'object',
      description: 'Spatial audio configuration settings',
    },
    autoInitialize: {
      control: 'boolean',
      description: 'Automatically initialize audio on user interaction',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof GlassSpatialAudioProvider>;

// Interactive demo component
function SpatialAudioDemo() {
  const { isInitialized, masterVolume, setMasterVolume } = useSpatialAudio();
  const { playTap, playHover, playSlide, playBreak, playNotification } = useGlassSound();
  const [soundCount, setSoundCount] = useState(0);
  const [showVisualizer, setShowVisualizer] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const playSpatialSound = (soundType: string, element: HTMLElement) => {
    setSoundCount(prev => prev + 1);
    
    switch (soundType) {
      case 'tap':
        playTap(element);
        break;
      case 'hover':
        playHover(element);
        break;
      case 'slide':
        playSlide(element);
        break;
      case 'break':
        playBreak(element);
        break;
      case 'notification':
        playNotification(element);
        break;
    }
  };

  return (
    <div ref={containerRef} className="glass-min-h-screen p-8 space-y-8">
      {/* Header */}
      <div className="text-center gap-4">
        <h1 className="text-4xl font-bold text-primary">
          🎵 Glass Spatial Audio
        </h1>
        <p className="text-lg glass-text-secondary">
          3D positioned glass sounds that respond to your interactions
        </p>
        
        {/* Status and Controls */}
        <div className="flex justify-center items-center space-x-6">
          <div className="flex items-center gap-2 glass-surface-secondary glass-radius-full px-4 py-2">
            <div className={`w-2 h-2 glass-radius-full ${isInitialized ? 'bg-green-400' : 'bg-red-400'}`} />
            <span className="text-sm text-primary">
              {isInitialized ? 'Audio Active' : 'Click to Initialize'}
            </span>
          </div>
          
          <div className="flex items-center gap-2 glass-surface-secondary glass-radius-full px-4 py-2">
            <span className="text-sm text-primary">🔊</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={masterVolume}
              onChange={(e) => setMasterVolume(parseFloat(e.target.value))}
              className="w-20"
            />
            <span className="text-xs glass-text-secondary">
              {(masterVolume * 100).toFixed(0)}%
            </span>
          </div>
          
          <div className="flex items-center gap-2 glass-surface-secondary glass-radius-full px-4 py-2">
            <span className="text-sm text-primary">
              🎶 Sounds Played: {soundCount}
            </span>
          </div>
        </div>

        <button
          onClick={() => setShowVisualizer(!showVisualizer)}
          className="glass-surface-primary glass-elev-2 glass-radius-lg px-4 py-2 hover:glass-elev-3 transition-all duration-300"
        >
          {showVisualizer ? '🎵 Hide Audio Visualizer' : '🎵 Show Audio Visualizer'}
        </button>
      </div>

      {/* Spatial Audio Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { sound: 'tap', icon: '🫳', label: 'Glass Tap', description: 'Sharp metallic tap sound' },
          { sound: 'hover', icon: '👻', label: 'Glass Hover', description: 'Subtle ethereal whisper' },
          { sound: 'slide', icon: '↔️', label: 'Glass Slide', description: 'Smooth sliding effect' },
          { sound: 'break', icon: '💥', label: 'Glass Break', description: 'Dramatic shattering' },
          { sound: 'notification', icon: '🔔', label: 'Glass Bell', description: 'Crystalline notification' },
          { sound: 'tap', icon: '⚡', label: 'Energy Burst', description: 'High-energy glass effect' },
          { sound: 'hover', icon: '🌟', label: 'Starlight', description: 'Gentle twinkling sound' },
          { sound: 'slide', icon: '🌊', label: 'Glass Wave', description: 'Flowing glass texture' },
        ].map((item, i) => (
          <button
            key={`sound-${i}`}
            className="glass-surface-primary glass-elev-2 glass-radius-lg p-6 text-center gap-4 
                       hover:glass-elev-3 transition-all duration-300 cursor-pointer group"
            onClick={(e) => playSpatialSound(item.sound, e.currentTarget)}
            onMouseEnter={(e) => playHover(e.currentTarget)}
          >
            <div className="text-3xl group-hover:scale-110 transition-transform duration-300">
              {item.icon}
            </div>
            <h3 className="text-lg font-medium text-primary">
              {item.label}
            </h3>
            <p className="text-sm glass-text-secondary">
              {item.description}
            </p>
            <div className="text-xs glass-text-tertiary">
              Click to hear spatial audio
            </div>
          </button>
        ))}
      </div>

      {/* Audio-Reactive Components */}
      <div className="glass-stack glass-stack-lg">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-primary mb-2">
            🎨 Audio-Reactive Glass
          </h2>
          <p className="text-sm glass-text-secondary">
            Components that visually respond to audio characteristics
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassAudioReactive
            position={{ x: -0.5, y: 0, z: 0 }}
            reactToVolume={true}
            intensityMultiplier={1.5}
            className="glass-surface-primary glass-elev-2 glass-radius-lg p-6 text-center gap-4"
          >
            <div className="text-2xl">🎵</div>
            <h3 className="text-lg font-medium text-primary">Volume Reactive</h3>
            <p className="text-sm glass-text-secondary">
              Responds to audio volume levels
            </p>
          </GlassAudioReactive>
          
          <GlassAudioReactive
            position={{ x: 0, y: 0, z: 0 }}
            reactToVolume={true}
            reactToFrequency={true}
            intensityMultiplier={1.2}
            className="glass-surface-primary glass-elev-2 glass-radius-lg p-6 text-center gap-4"
          >
            <div className="text-2xl">🌈</div>
            <h3 className="text-lg font-medium text-primary">Full Spectrum</h3>
            <p className="text-sm glass-text-secondary">
              Responds to volume and frequency
            </p>
          </GlassAudioReactive>
          
          <GlassAudioReactive
            position={{ x: 0.5, y: 0, z: 0 }}
            reactToFrequency={true}
            intensityMultiplier={2.0}
            className="glass-surface-primary glass-elev-2 glass-radius-lg p-6 text-center gap-4"
          >
            <div className="text-2xl">📊</div>
            <h3 className="text-lg font-medium text-primary">Frequency Reactive</h3>
            <p className="text-sm glass-text-secondary">
              Responds to frequency analysis
            </p>
          </GlassAudioReactive>
        </div>
      </div>

      {/* Sound Information */}
      <div className="glass-surface-primary glass-elev-1 glass-radius-lg p-6">
        <h3 className="text-xl font-medium text-primary mb-4">
          🔊 Spatial Audio Features
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="gap-3">
            <h4 className="text-lg font-medium text-primary">3D Positioning</h4>
            <ul className="gap-1 text-sm glass-text-secondary">
              <li>• HRTF processing for realistic 3D audio</li>
              <li>• Distance-based volume attenuation</li>
              <li>• Directional panning effects</li>
              <li>• Real-time position updates</li>
            </ul>
          </div>
          <div className="gap-3">
            <h4 className="text-lg font-medium text-primary">Glass Sounds</h4>
            <ul className="gap-1 text-sm glass-text-secondary">
              <li>• Synthesized glass tones</li>
              <li>• Multiple sound variations</li>
              <li>• Category-based organization</li>
              <li>• Procedural audio generation</li>
            </ul>
          </div>
          <div className="gap-3">
            <h4 className="text-lg font-medium text-primary">Interactive Features</h4>
            <ul className="gap-1 text-sm glass-text-secondary">
              <li>• Mouse position tracking</li>
              <li>• Element-based positioning</li>
              <li>• Volume and frequency analysis</li>
              <li>• Visual audio feedback</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Spatial Visualizer */}
      <GlassSpatialVisualizer show={showVisualizer} />
    </div>
  );
}

export const Interactive: Story = {
  render: (args) => (
    <GlassSpatialAudioProvider {...args}>
      <SpatialAudioDemo />
    </GlassSpatialAudioProvider>
  ),
  args: {
    settings: spatialAudioPresets.standard,
    autoInitialize: true,
  },
};

export const MinimalMode: Story = {
  render: (args) => (
    <GlassSpatialAudioProvider {...args}>
      <div className="glass-min-h-screen p-8 space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-primary mb-4">
            Minimal Spatial Audio
          </h2>
          <p className="text-sm glass-text-secondary mb-6">
            Non-spatial audio with reduced volume and simplified effects
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Tap', 'Hover', 'Slide', 'Break'].map((soundType, i) => {
            const { playTap, playHover, playSlide, playBreak } = useGlassSound();
            const sounds = { Tap: playTap, Hover: playHover, Slide: playSlide, Break: playBreak };
            
            return (
              <button
                key={soundType}
                className="glass-surface-primary glass-elev-1 glass-radius-lg p-4 text-center hover:glass-elev-2 transition-all duration-300"
                onClick={(e) => sounds[soundType as keyof typeof sounds](e.currentTarget)}
              >
                <div className="text-xl mb-2">🔊</div>
                <div className="text-sm text-primary">{soundType}</div>
              </button>
            );
          })}
        </div>
      </div>
      <GlassSpatialVisualizer show={true} />
    </GlassSpatialAudioProvider>
  ),
  args: {
    settings: spatialAudioPresets.minimal,
    autoInitialize: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Minimal mode with non-spatial audio and reduced volume.',
      },
    },
  },
};

export const ImmersiveMode: Story = {
  render: (args) => (
    <GlassSpatialAudioProvider {...args}>
      <div className="glass-min-h-screen p-8 space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-primary mb-4">
            Immersive Spatial Audio
          </h2>
          <p className="text-sm glass-text-secondary mb-6">
            Full 3D spatial audio with HRTF processing and Doppler effects
          </p>
        </div>
        
        <div className="relative h-96 glass-surface-primary glass-elev-1 glass-radius-lg p-8">
          <div className="text-center mb-6">
            <h3 className="text-lg font-medium text-primary">
              3D Audio Space
            </h3>
            <p className="text-sm glass-text-secondary">
              Click anywhere to place sounds in 3D space
            </p>
          </div>
          
          <div 
            className="relative w-full h-full glass-surface-secondary glass-radius-lg cursor-crosshair"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = ((e.clientX - rect.left) / rect.width) * 2 - 1; // -1 to 1
              const y = 1 - ((e.clientY - rect.top) / rect.height) * 2; // -1 to 1 (inverted)
              
              const { playGlassSound } = useSpatialAudio();
              playGlassSound('tap', { x, y, z: 0 }, { volume: 0.8 });
              
              // Visual feedback
              const dot = document.createElement('div');
              dot.className='absolute w-4 h-4 glass-surface-primary glass-radius-full animate-ping';
              dot.style.left = `${((x + 1) / 2) * 100}%`;
              dot.style.top = `${((1 - y) / 2) * 100}%`;
              dot.style.transform = 'translate(-50%, -50%)';
              e.currentTarget.appendChild(dot);
              
              setTimeout(() => {
                if (dot.parentNode) {
                  dot.parentNode.removeChild(dot);
                }
              }, 1000);
            }}
          >
            <div className="absolute glass-top-2 left-2 text-xs glass-text-tertiary">
              Left (-1, 1)
            </div>
            <div className="absolute glass-top-2 right-2 text-xs glass-text-tertiary">
              Right (1, 1)
            </div>
            <div className="absolute bottom-2 left-2 text-xs glass-text-tertiary">
              Left (-1, -1)
            </div>
            <div className="absolute bottom-2 right-2 text-xs glass-text-tertiary">
              Right (1, -1)
            </div>
            <div className="absolute glass-top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-3 h-3 glass-surface-green glass-radius-full" />
              <div className="text-xs text-primary glass-mt-1">Listener (0, 0)</div>
            </div>
          </div>
        </div>
      </div>
      <GlassSpatialVisualizer show={true} />
    </GlassSpatialAudioProvider>
  ),
  args: {
    settings: spatialAudioPresets.immersive,
    autoInitialize: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Immersive mode with full 3D spatial audio, HRTF processing, and interactive positioning.',
      },
    },
  },
};

export const GamingMode: Story = {
  render: (args) => (
    <GlassSpatialAudioProvider {...args}>
      <div className="glass-min-h-screen p-8 space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-primary mb-4">
            Gaming Audio Mode
          </h2>
          <p className="text-sm glass-text-secondary mb-6">
            High-performance spatial audio optimized for gaming interactions
          </p>
        </div>
        
        <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
          {Array.from({ length: 15 }, (_, i) => {
            const { playTap, playBreak } = useGlassSound();
            const isTarget = i % 3 === 0;
            
            return (
              <button
                key={i}
                className={`aspect-square glass-surface-primary glass-elev-2 glass-radius-lg 
                          hover:glass-elev-3 transition-all duration-300 flex items-center justify-center
                          ${isTarget ? 'bg-red-500/20' : 'glass-surface-primary/20'}`}
                onClick={(e) => {
                  if (isTarget) {
                    playBreak(e.currentTarget);
                  } else {
                    playTap(e.currentTarget);
                  }
                }}
              >
                <div className="text-xl">
                  {isTarget ? '🎯' : '⚪'}
                </div>
              </button>
            );
          })}
        </div>
        
        <div className="text-center glass-surface-primary glass-elev-1 glass-radius-lg p-4">
          <p className="text-sm glass-text-secondary">
            🎯 Red targets: Break sound | ⚪ Blue targets: Tap sound
          </p>
          <p className="text-xs glass-text-tertiary glass-mt-2">
            Optimized for low latency and precise audio positioning
          </p>
        </div>
      </div>
      <GlassSpatialVisualizer show={true} />
    </GlassSpatialAudioProvider>
  ),
  args: {
    settings: spatialAudioPresets.gaming,
    autoInitialize: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Gaming mode with optimized performance for interactive gaming experiences.',
      },
    },
  },
};

// Audio-reactive only story
export const AudioReactiveOnly: Story = {
  render: (args) => (
    <GlassSpatialAudioProvider {...args}>
      <div className="glass-min-h-screen p-8 space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-primary mb-4">
            Audio-Reactive Components
          </h2>
          <p className="text-sm glass-text-secondary mb-6">
            Visual components that respond to spatial audio characteristics
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { position: { x: -0.8, y: 0.5, z: 0 }, label: 'Left High' },
            { position: { x: 0.8, y: 0.5, z: 0 }, label: 'Right High' },
            { position: { x: -0.8, y: -0.5, z: 0 }, label: 'Left Low' },
            { position: { x: 0.8, y: -0.5, z: 0 }, label: 'Right Low' },
          ].map((config, i) => (
            <GlassAudioReactive
              key={i}
              position={config.position}
              reactToVolume={true}
              reactToFrequency={i % 2 === 0}
              intensityMultiplier={1.5}
              className="glass-surface-primary glass-elev-2 glass-radius-lg p-6 text-center gap-4 glass-min-h-32"
            >
              <div className="text-2xl">🎵</div>
              <h3 className="text-sm font-medium text-primary">{config.label}</h3>
              <p className="text-xs glass-text-secondary">
                {i % 2 === 0 ? 'Volume + Frequency' : 'Volume Only'}
              </p>
            </GlassAudioReactive>
          ))}
        </div>
        
        <div className="text-center">
          <button
            className="glass-surface-primary glass-elev-2 glass-radius-lg px-6 py-3 hover:glass-elev-3 transition-all duration-300"
            onClick={() => {
              const { playGlassSound } = useSpatialAudio();
              playGlassSound('ambientGlass', { x: 0, y: 0, z: 0 }, { loop: true, volume: 0.5 });
            }}
          >
            🎵 Start Ambient Audio
          </button>
        </div>
      </div>
      <GlassSpatialVisualizer show={false} />
    </GlassSpatialAudioProvider>
  ),
  args: {
    settings: spatialAudioPresets.standard,
    autoInitialize: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows audio-reactive components responding to spatial audio characteristics.',
      },
    },
  },
};