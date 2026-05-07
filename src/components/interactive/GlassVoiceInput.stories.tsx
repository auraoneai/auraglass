import type { Meta, StoryObj } from '@storybook/react';
import { GlassVoiceInput } from './GlassVoiceInput';

const meta = {
  title: 'Effects + Advanced/Glass Voice Input',
  component: GlassVoiceInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    language: {
      control: { type: 'select' },
      options: ['en-US', 'en-GB', 'es-ES', 'fr-FR', 'de-DE', 'it-IT', 'ja-JP', 'ko-KR', 'zh-CN'],
    },
    visualizerStyle: {
      control: { type: 'select' },
      options: ['waveform', 'circular', 'bars', 'particle'],
    },
    confidenceThreshold: {
      control: { type: 'range', min: 0, max: 1, step: 0.1 },
    },
    maxTranscriptLength: {
      control: { type: 'range', min: 100, max: 2000, step: 100 },
    },
  },
} satisfies Meta<typeof GlassVoiceInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    showControls: true,
    showVisualizer: true,
    showTranscript: true,
  },
};

export const BasicVoiceInput: Story = {
  args: {
    language: 'en-US',
    continuous: true,
    interimResults: true,
    showVisualizer: true,
    visualizerStyle: 'waveform',
    confidenceThreshold: 0.7,
  },
};

export const CommandRecognition: Story = {
  args: {
    commands: [
      { phrase: 'hello', action: 'greet' },
      { phrase: 'open menu', action: 'open_menu' },
      { phrase: 'close window', action: 'close_window' },
      { phrase: 'search for', action: 'search', fuzzy: true },
      { phrase: 'navigate to', action: 'navigate', fuzzy: true },
    ],
    confidenceThreshold: 0.6,
    showTranscript: true,
    showVisualizer: true,
  },
};

export const WakeWordEnabled: Story = {
  args: {
    wakeWord: 'hey glass',
    continuous: false,
    commands: [
      { phrase: 'what time is it', action: 'get_time' },
      { phrase: 'show weather', action: 'show_weather' },
      { phrase: 'play music', action: 'play_music' },
    ],
    showControls: true,
  },
};

export const CircularVisualizer: Story = {
  args: {
    visualizerStyle: 'circular',
    showVisualizer: true,
    showTranscript: false,
    showControls: false,
  },
};

export const BarsVisualizer: Story = {
  args: {
    visualizerStyle: 'bars',
    showVisualizer: true,
    showTranscript: true,
    continuous: true,
  },
};

export const ParticleVisualizer: Story = {
  args: {
    visualizerStyle: 'particle',
    showVisualizer: true,
    showTranscript: false,
    showControls: true,
  },
};

export const MultiLanguage: Story = {
  args: {
    language: 'es-ES',
    commands: [
      { phrase: 'hola', action: 'greet' },
      { phrase: 'abre menú', action: 'open_menu' },
      { phrase: 'buscar', action: 'search', fuzzy: true },
    ],
    showTranscript: true,
    showControls: true,
  },
};

export const HighSensitivity: Story = {
  args: {
    confidenceThreshold: 0.4,
    interimResults: true,
    continuous: true,
    maxAlternatives: 3,
    showTranscript: true,
  },
};

export const MinimalInterface: Story = {
  args: {
    showControls: false,
    showVisualizer: false,
    showTranscript: true,
    continuous: true,
    maxTranscriptLength: 200,
  },
};

export const VoiceAssistant: Story = {
  args: {
    wakeWord: 'assistant',
    commands: [
      { phrase: 'what time is it', action: 'get_time' },
      { phrase: 'what day is it', action: 'get_date' },
      { phrase: 'open calendar', action: 'open_calendar' },
      { phrase: 'set reminder', action: 'set_reminder', fuzzy: true },
      { phrase: 'search web for', action: 'web_search', fuzzy: true },
      { phrase: 'send message to', action: 'send_message', fuzzy: true },
      { phrase: 'call', action: 'make_call', fuzzy: true },
      { phrase: 'play', action: 'play_media', fuzzy: true },
      { phrase: 'stop', action: 'stop_media' },
      { phrase: 'volume up', action: 'volume_up' },
      { phrase: 'volume down', action: 'volume_down' },
    ],
    confidenceThreshold: 0.7,
    continuous: true,
    showVisualizer: true,
    visualizerStyle: 'circular',
    showTranscript: true,
    showControls: true,
  },
};

export const InteractiveDemo: Story = {
  args: {
    active: false,
    language: 'en-US',
    continuous: true,
    interimResults: true,
    commands: [
      { phrase: 'start recording', action: 'start_recording' },
      { phrase: 'stop recording', action: 'stop_recording' },
      { phrase: 'clear transcript', action: 'clear_transcript' },
      { phrase: 'change language', action: 'change_language' },
      { phrase: 'switch visualizer', action: 'switch_visualizer' },
    ],
    wakeWord: 'wake up',
    confidenceThreshold: 0.6,
    showVisualizer: true,
    visualizerStyle: 'waveform',
    showTranscript: true,
    maxTranscriptLength: 500,
    showControls: true,
    noiseSuppression: true,
    echoCancellation: true,
    autoGainControl: true,
  },
};