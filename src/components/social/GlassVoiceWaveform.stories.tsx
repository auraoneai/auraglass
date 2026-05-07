import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { GlassVoiceWaveform, type VoiceParticipant } from './GlassVoiceWaveform';

const mockParticipants: VoiceParticipant[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    avatar: 'data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2764%27%20height=%2764%27%20viewBox=%270%200%2064%2064%27%3E%3Crect%20width=%2764%27%20height=%2764%27%20rx=%2732%27%20fill=%27%230f766e%27/%3E%3Ccircle%20cx=%2732%27%20cy=%2726%27%20r=%2711%27%20fill=%27%23ffffff%27%20opacity=%27.9%27/%3E%3Cpath%20d=%27M14%2057c3-12%2013-18%2018-18s15%206%2018%2018%27%20fill=%27%23ffffff%27%20opacity=%27.85%27/%3E%3C/svg%3E',
    color: '#FF6B6B',
    isSpeaking: true,
    isMuted: false,
    audioLevel: 0.7,
    lastActivity: Date.now(),
    isConnected: true
  },
  {
    id: '2',
    name: 'Bob Smith',
    avatar: 'data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2764%27%20height=%2764%27%20viewBox=%270%200%2064%2064%27%3E%3Crect%20width=%2764%27%20height=%2764%27%20rx=%2732%27%20fill=%27%230f766e%27/%3E%3Ccircle%20cx=%2732%27%20cy=%2726%27%20r=%2711%27%20fill=%27%23ffffff%27%20opacity=%27.9%27/%3E%3Cpath%20d=%27M14%2057c3-12%2013-18%2018-18s15%206%2018%2018%27%20fill=%27%23ffffff%27%20opacity=%27.85%27/%3E%3C/svg%3E',
    color: '#4ECDC4',
    isSpeaking: false,
    isMuted: false,
    audioLevel: 0.1,
    lastActivity: Date.now() - 5000,
    isConnected: true
  },
  {
    id: '3',
    name: 'Carol Davis',
    color: '#45B7D1',
    isSpeaking: true,
    isMuted: false,
    audioLevel: 0.9,
    lastActivity: Date.now() - 1000,
    isConnected: true
  },
  {
    id: '4',
    name: 'David Wilson',
    avatar: 'data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2764%27%20height=%2764%27%20viewBox=%270%200%2064%2064%27%3E%3Crect%20width=%2764%27%20height=%2764%27%20rx=%2732%27%20fill=%27%230f766e%27/%3E%3Ccircle%20cx=%2732%27%20cy=%2726%27%20r=%2711%27%20fill=%27%23ffffff%27%20opacity=%27.9%27/%3E%3Cpath%20d=%27M14%2057c3-12%2013-18%2018-18s15%206%2018%2018%27%20fill=%27%23ffffff%27%20opacity=%27.85%27/%3E%3C/svg%3E',
    color: '#96CEB4',
    isSpeaking: false,
    isMuted: true,
    audioLevel: 0,
    lastActivity: Date.now() - 10000,
    isConnected: true
  },
  {
    id: '5',
    name: 'Emma Brown',
    color: '#FECA57',
    isSpeaking: false,
    isMuted: false,
    audioLevel: 0.3,
    lastActivity: Date.now() - 3000,
    isConnected: false
  },
  {
    id: 'current',
    name: 'You',
    color: '#FF9FF3',
    isSpeaking: false,
    isMuted: false,
    audioLevel: 0,
    lastActivity: Date.now(),
    isConnected: true
  }
];

const meta: Meta<typeof GlassVoiceWaveform> = {
  title: 'Workflows/Glass Voice Waveform',
  component: GlassVoiceWaveform,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    onParticipantClick: fn(),
    onMuteToggle: fn(),
  },
  argTypes: {
    waveformStyle: {
      control: { type: 'select' },
      options: ['bars', 'waves', 'circular', 'spectrum'],
    },
    colorMode: {
      control: { type: 'select' },
      options: ['participant', 'activity', 'rainbow'],
    },
    sensitivity: {
      control: { type: 'range', min: 0.1, max: 2, step: 0.1 },
    },
    smoothing: {
      control: { type: 'range', min: 0, max: 1, step: 0.1 },
    },
    maxBars: {
      control: { type: 'range', min: 8, max: 64, step: 4 },
    },
    animationSpeed: {
      control: { type: 'range', min: 0.1, max: 3, step: 0.1 },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    participants: mockParticipants,
    currentUserId: 'current',
    showAvatars: true,
    showNames: true,
    showMuteStatus: true,
    showConnectionStatus: true,
    showVoiceActivity: true,
  },
};

export const BarWaveform: Story = {
  args: {
    participants: mockParticipants,
    currentUserId: 'current',
    waveformStyle: 'bars',
    showAvatars: true,
    showNames: true,
    realTimeMode: true,
  },
};

export const WaveWaveform: Story = {
  args: {
    participants: mockParticipants,
    currentUserId: 'current',
    waveformStyle: 'waves',
    showAvatars: true,
    showNames: true,
    realTimeMode: true,
  },
};

export const CircularWaveform: Story = {
  args: {
    participants: mockParticipants,
    currentUserId: 'current',
    waveformStyle: 'circular',
    showAvatars: true,
    showNames: true,
    realTimeMode: true,
  },
};

export const SpectrumWaveform: Story = {
  args: {
    participants: mockParticipants,
    currentUserId: 'current',
    waveformStyle: 'spectrum',
    showAvatars: true,
    showNames: true,
    realTimeMode: true,
  },
};

export const RealTimeMode: Story = {
  args: {
    participants: mockParticipants,
    currentUserId: 'current',
    realTimeMode: true,
    soundVisualization: true,
    showAvatars: true,
    showNames: true,
    showVoiceActivity: true,
  },
};

export const ActivityColorMode: Story = {
  args: {
    participants: mockParticipants,
    currentUserId: 'current',
    colorMode: 'activity',
    realTimeMode: true,
    showAvatars: true,
    showNames: true,
  },
};

export const RainbowColorMode: Story = {
  args: {
    participants: mockParticipants,
    currentUserId: 'current',
    colorMode: 'rainbow',
    realTimeMode: true,
    showAvatars: true,
    showNames: true,
  },
};

export const CompactMode: Story = {
  args: {
    participants: mockParticipants,
    currentUserId: 'current',
    compactMode: true,
    showAvatars: true,
    showNames: true,
    showVoiceActivity: false,
  },
};

export const MinimalInterface: Story = {
  args: {
    participants: mockParticipants,
    currentUserId: 'current',
    showAvatars: false,
    showNames: false,
    showMuteStatus: false,
    showConnectionStatus: false,
    showVoiceActivity: false,
    waveformStyle: 'bars',
  },
};

export const ActiveSpeakers: Story = {
  args: {
    participants: mockParticipants.map(p => ({
      ...p,
      isSpeaking: ['1', '3', '5'].includes(p.id),
      audioLevel: ['1', '3', '5'].includes(p.id) ? Math.random() * 0.8 + 0.2 : 0.05
    })),
    currentUserId: 'current',
    realTimeMode: true,
    showAvatars: true,
    showNames: true,
    showVoiceActivity: true,
  },
};

export const MutedUsers: Story = {
  args: {
    participants: mockParticipants.map(p => ({
      ...p,
      isMuted: ['2', '4', 'current'].includes(p.id),
      isSpeaking: false,
      audioLevel: 0
    })),
    currentUserId: 'current',
    showAvatars: true,
    showNames: true,
    showMuteStatus: true,
  },
};

export const DisconnectedUsers: Story = {
  args: {
    participants: mockParticipants.map(p => ({
      ...p,
      isConnected: !['4', '5'].includes(p.id),
      isSpeaking: p.isConnected ? p.isSpeaking : false,
      audioLevel: p.isConnected ? p.audioLevel : 0
    })),
    currentUserId: 'current',
    showAvatars: true,
    showNames: true,
    showConnectionStatus: true,
  },
};

export const HighSensitivity: Story = {
  args: {
    participants: mockParticipants,
    currentUserId: 'current',
    sensitivity: 2,
    realTimeMode: true,
    showAvatars: true,
    showNames: true,
  },
};

export const LowSmoothing: Story = {
  args: {
    participants: mockParticipants,
    currentUserId: 'current',
    smoothing: 0.2,
    realTimeMode: true,
    showAvatars: true,
    showNames: true,
  },
};

export const ManyBars: Story = {
  args: {
    participants: mockParticipants,
    currentUserId: 'current',
    maxBars: 64,
    waveformStyle: 'bars',
    realTimeMode: true,
    showAvatars: true,
    showNames: true,
  },
};

export const FewBars: Story = {
  args: {
    participants: mockParticipants,
    currentUserId: 'current',
    maxBars: 8,
    waveformStyle: 'bars',
    realTimeMode: true,
    showAvatars: true,
    showNames: true,
  },
};

export const FastAnimation: Story = {
  args: {
    participants: mockParticipants,
    currentUserId: 'current',
    animationSpeed: 3,
    realTimeMode: true,
    showAvatars: true,
    showNames: true,
  },
};

export const SlowAnimation: Story = {
  args: {
    participants: mockParticipants,
    currentUserId: 'current',
    animationSpeed: 0.3,
    realTimeMode: true,
    showAvatars: true,
    showNames: true,
  },
};

export const SoloCall: Story = {
  args: {
    participants: [mockParticipants.find(p => p.id === 'current')!],
    currentUserId: 'current',
    showAvatars: true,
    showNames: true,
    showVoiceActivity: true,
  },
};

export const LargeGroup: Story = {
  args: {
    participants: [
      ...mockParticipants,
      ...Array.from({ length: 8 }, (_, i) => ({
        id: `extra-${i}`,
        name: `User ${i + 7}`,
        color: ['#EE5A6F', '#0FB9B1', '#3867D6', '#1DD1A1', '#FD79A8', '#54A0FF', '#5F27CD', '#00D2D3'][i],
        isSpeaking: Math.random() > 0.7,
        isMuted: Math.random() > 0.8,
        audioLevel: Math.random() * 0.8,
        lastActivity: Date.now() - Math.random() * 10000,
        isConnected: Math.random() > 0.1
      }))
    ],
    currentUserId: 'current',
    realTimeMode: true,
    compactMode: true,
    showAvatars: true,
    showNames: true,
  },
};

export const SilentMode: Story = {
  args: {
    participants: mockParticipants,
    currentUserId: 'current',
    soundVisualization: false,
    realTimeMode: true,
    showAvatars: true,
    showNames: true,
  },
};
