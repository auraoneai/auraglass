import type { Meta, StoryObj } from '@storybook/react';
import { GlassMusicVisualizer } from './GlassMusicVisualizer';

const meta = {
  title: 'AI + Intelligence/Glass Music Visualizer',
  component: GlassMusicVisualizer,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    canvasWidth: {
      control: { type: 'range', min: 400, max: 1200, step: 50 },
    },
    canvasHeight: {
      control: { type: 'range', min: 200, max: 600, step: 50 },
    },
    showControls: {
      control: 'boolean',
    },
    showFrequencyDisplay: {
      control: 'boolean',
    },
    showWaveform: {
      control: 'boolean',
    },
    showSpectrum: {
      control: 'boolean',
    },
    realTimeAnalysis: {
      control: 'boolean',
    },
    enableInteraction: {
      control: 'boolean',
    },
    enableRecording: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof GlassMusicVisualizer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    canvasWidth: 800,
    canvasHeight: 400,
    showControls: true,
    showFrequencyDisplay: true,
    showWaveform: true,
    showSpectrum: true,
    realTimeAnalysis: true,
    enableInteraction: true,
    enableRecording: false,
    audioSettings: {
      volume: 0.8,
      gain: 1.0,
      bassBoost: 0,
      trebleBoost: 0,
      smoothing: 0.8,
      fftSize: 256,
    },
    visualSettings: {
      mode: 'bars',
      colorScheme: 'rainbow',
      particleCount: 100,
      sensitivity: 1.0,
      symmetry: false,
      mirror: false,
    },
  },
};

export const FrequencyBars: Story = {
  args: {
    canvasWidth: 800,
    canvasHeight: 300,
    showControls: true,
    showFrequencyDisplay: true,
    realTimeAnalysis: true,
    enableInteraction: true,
    visualSettings: {
      mode: 'bars',
      colorScheme: 'rainbow',
      sensitivity: 1.2,
      symmetry: false,
      mirror: true,
    },
    audioSettings: {
      fftSize: 512,
      smoothing: 0.7,
    },
  },
};

export const WaveformMode: Story = {
  args: {
    canvasWidth: 800,
    canvasHeight: 300,
    showControls: true,
    showFrequencyDisplay: true,
    realTimeAnalysis: true,
    enableInteraction: true,
    visualSettings: {
      mode: 'wave',
      colorScheme: 'neon',
      sensitivity: 1.5,
      symmetry: true,
      mirror: false,
    },
    audioSettings: {
      fftSize: 1024,
      smoothing: 0.9,
    },
  },
};

export const CircularVisualizer: Story = {
  args: {
    canvasWidth: 600,
    canvasHeight: 600,
    showControls: true,
    showFrequencyDisplay: true,
    realTimeAnalysis: true,
    enableInteraction: true,
    visualSettings: {
      mode: 'circular',
      colorScheme: 'galaxy',
      sensitivity: 1.0,
      symmetry: true,
      mirror: false,
    },
    audioSettings: {
      fftSize: 256,
      smoothing: 0.8,
    },
  },
};

export const SpectrumAnalyzer: Story = {
  args: {
    canvasWidth: 800,
    canvasHeight: 400,
    showControls: true,
    showFrequencyDisplay: true,
    showSpectrum: true,
    realTimeAnalysis: true,
    enableInteraction: true,
    visualSettings: {
      mode: 'spectrum',
      colorScheme: 'fire',
      sensitivity: 1.0,
    },
    audioSettings: {
      fftSize: 512,
      smoothing: 0.6,
    },
  },
};

export const ParticleSystem: Story = {
  args: {
    canvasWidth: 800,
    canvasHeight: 500,
    showControls: true,
    showFrequencyDisplay: true,
    realTimeAnalysis: true,
    enableInteraction: true,
    visualSettings: {
      mode: 'particles',
      colorScheme: 'rainbow',
      particleCount: 150,
      sensitivity: 1.3,
    },
    audioSettings: {
      fftSize: 256,
      smoothing: 0.7,
    },
  },
};

export const RipplesEffect: Story = {
  args: {
    canvasWidth: 600,
    canvasHeight: 600,
    showControls: true,
    showFrequencyDisplay: true,
    realTimeAnalysis: true,
    enableInteraction: true,
    visualSettings: {
      mode: 'ripples',
      colorScheme: 'ice',
      sensitivity: 1.5,
    },
    audioSettings: {
      fftSize: 256,
      smoothing: 0.8,
    },
  },
};

export const NeonTheme: Story = {
  args: {
    canvasWidth: 800,
    canvasHeight: 400,
    showControls: true,
    showFrequencyDisplay: true,
    realTimeAnalysis: true,
    enableInteraction: true,
    visualSettings: {
      mode: 'bars',
      colorScheme: 'neon',
      sensitivity: 1.2,
      mirror: true,
    },
    audioSettings: {
      fftSize: 512,
      smoothing: 0.7,
    },
  },
};

export const FireTheme: Story = {
  args: {
    canvasWidth: 800,
    canvasHeight: 400,
    showControls: true,
    showFrequencyDisplay: true,
    realTimeAnalysis: true,
    enableInteraction: true,
    visualSettings: {
      mode: 'bars',
      colorScheme: 'fire',
      sensitivity: 1.0,
      mirror: false,
    },
    audioSettings: {
      fftSize: 256,
      smoothing: 0.8,
    },
  },
};

export const IceTheme: Story = {
  args: {
    canvasWidth: 800,
    canvasHeight: 400,
    showControls: true,
    showFrequencyDisplay: true,
    realTimeAnalysis: true,
    enableInteraction: true,
    visualSettings: {
      mode: 'circular',
      colorScheme: 'ice',
      sensitivity: 0.8,
      symmetry: true,
    },
    audioSettings: {
      fftSize: 256,
      smoothing: 0.9,
    },
  },
};

export const MonochromeMode: Story = {
  args: {
    canvasWidth: 800,
    canvasHeight: 400,
    showControls: true,
    showFrequencyDisplay: true,
    realTimeAnalysis: true,
    enableInteraction: true,
    visualSettings: {
      mode: 'wave',
      colorScheme: 'monochrome',
      sensitivity: 1.5,
    },
    audioSettings: {
      fftSize: 1024,
      smoothing: 0.8,
    },
  },
};

export const HighSensitivity: Story = {
  args: {
    canvasWidth: 800,
    canvasHeight: 400,
    showControls: true,
    showFrequencyDisplay: true,
    realTimeAnalysis: true,
    enableInteraction: true,
    visualSettings: {
      mode: 'bars',
      colorScheme: 'rainbow',
      sensitivity: 3.0,
      mirror: true,
    },
    audioSettings: {
      fftSize: 256,
      smoothing: 0.5,
    },
  },
};

export const LowSensitivity: Story = {
  args: {
    canvasWidth: 800,
    canvasHeight: 400,
    showControls: true,
    showFrequencyDisplay: true,
    realTimeAnalysis: true,
    enableInteraction: true,
    visualSettings: {
      mode: 'bars',
      colorScheme: 'rainbow',
      sensitivity: 0.3,
      mirror: false,
    },
    audioSettings: {
      fftSize: 256,
      smoothing: 0.9,
    },
  },
};

export const HighResolutionFFT: Story = {
  args: {
    canvasWidth: 1000,
    canvasHeight: 400,
    showControls: true,
    showFrequencyDisplay: true,
    realTimeAnalysis: true,
    enableInteraction: true,
    visualSettings: {
      mode: 'bars',
      colorScheme: 'galaxy',
      sensitivity: 1.0,
    },
    audioSettings: {
      fftSize: 2048,
      smoothing: 0.8,
    },
  },
};

export const MinimalInterface: Story = {
  args: {
    canvasWidth: 600,
    canvasHeight: 300,
    showControls: false,
    showFrequencyDisplay: false,
    showWaveform: false,
    showSpectrum: false,
    realTimeAnalysis: true,
    enableInteraction: true,
    visualSettings: {
      mode: 'circular',
      colorScheme: 'neon',
      sensitivity: 1.0,
    },
  },
};

export const ControlsOnly: Story = {
  args: {
    canvasWidth: 800,
    canvasHeight: 200,
    showControls: true,
    showFrequencyDisplay: false,
    showWaveform: false,
    showSpectrum: false,
    realTimeAnalysis: true,
    enableInteraction: false,
    visualSettings: {
      mode: 'bars',
      colorScheme: 'rainbow',
      sensitivity: 1.0,
    },
  },
};

export const FrequencyDisplayOnly: Story = {
  args: {
    canvasWidth: 400,
    canvasHeight: 200,
    showControls: false,
    showFrequencyDisplay: true,
    showWaveform: false,
    showSpectrum: false,
    realTimeAnalysis: true,
    enableInteraction: false,
    visualSettings: {
      mode: 'bars',
      colorScheme: 'monochrome',
      sensitivity: 1.0,
    },
  },
};

export const RecordingMode: Story = {
  args: {
    canvasWidth: 800,
    canvasHeight: 400,
    showControls: true,
    showFrequencyDisplay: true,
    realTimeAnalysis: true,
    enableInteraction: true,
    enableRecording: true,
    visualSettings: {
      mode: 'spectrum',
      colorScheme: 'fire',
      sensitivity: 1.0,
    },
    audioSettings: {
      fftSize: 512,
      smoothing: 0.7,
    },
  },
};

export const WideCanvas: Story = {
  args: {
    canvasWidth: 1200,
    canvasHeight: 300,
    showControls: true,
    showFrequencyDisplay: true,
    realTimeAnalysis: true,
    enableInteraction: true,
    visualSettings: {
      mode: 'bars',
      colorScheme: 'galaxy',
      sensitivity: 1.0,
      mirror: false,
    },
    audioSettings: {
      fftSize: 512,
      smoothing: 0.8,
    },
  },
};

export const TallCanvas: Story = {
  args: {
    canvasWidth: 400,
    canvasHeight: 600,
    showControls: true,
    showFrequencyDisplay: true,
    realTimeAnalysis: true,
    enableInteraction: true,
    visualSettings: {
      mode: 'bars',
      colorScheme: 'neon',
      sensitivity: 1.2,
      mirror: true,
    },
    audioSettings: {
      fftSize: 256,
      smoothing: 0.8,
    },
  },
};

export const SymmetricVisualization: Story = {
  args: {
    canvasWidth: 600,
    canvasHeight: 600,
    showControls: true,
    showFrequencyDisplay: true,
    realTimeAnalysis: true,
    enableInteraction: true,
    visualSettings: {
      mode: 'circular',
      colorScheme: 'rainbow',
      sensitivity: 1.0,
      symmetry: true,
      mirror: false,
    },
    audioSettings: {
      fftSize: 256,
      smoothing: 0.8,
    },
  },
};

export const MirroredBars: Story = {
  args: {
    canvasWidth: 800,
    canvasHeight: 400,
    showControls: true,
    showFrequencyDisplay: true,
    realTimeAnalysis: true,
    enableInteraction: true,
    visualSettings: {
      mode: 'bars',
      colorScheme: 'ice',
      sensitivity: 1.0,
      symmetry: false,
      mirror: true,
    },
    audioSettings: {
      fftSize: 512,
      smoothing: 0.7,
    },
  },
};

export const HighParticleCount: Story = {
  args: {
    canvasWidth: 800,
    canvasHeight: 500,
    showControls: true,
    showFrequencyDisplay: true,
    realTimeAnalysis: true,
    enableInteraction: true,
    visualSettings: {
      mode: 'particles',
      colorScheme: 'galaxy',
      particleCount: 300,
      sensitivity: 1.5,
    },
    audioSettings: {
      fftSize: 256,
      smoothing: 0.6,
    },
  },
};

export const LowParticleCount: Story = {
  args: {
    canvasWidth: 800,
    canvasHeight: 400,
    showControls: true,
    showFrequencyDisplay: true,
    realTimeAnalysis: true,
    enableInteraction: true,
    visualSettings: {
      mode: 'particles',
      colorScheme: 'neon',
      particleCount: 50,
      sensitivity: 1.0,
    },
    audioSettings: {
      fftSize: 256,
      smoothing: 0.8,
    },
  },
};