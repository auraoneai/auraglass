import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { GlassCollaborativeCursor, type CursorUser } from './GlassCollaborativeCursor';

const mockUsers: CursorUser[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    color: '#FF6B6B',
    avatar: 'data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2764%27%20height=%2764%27%20viewBox=%270%200%2064%2064%27%3E%3Crect%20width=%2764%27%20height=%2764%27%20rx=%2732%27%20fill=%27%230f766e%27/%3E%3Ccircle%20cx=%2732%27%20cy=%2726%27%20r=%2711%27%20fill=%27%23ffffff%27%20opacity=%27.9%27/%3E%3Cpath%20d=%27M14%2057c3-12%2013-18%2018-18s15%206%2018%2018%27%20fill=%27%23ffffff%27%20opacity=%27.85%27/%3E%3C/svg%3E',
    x: 150,
    y: 100,
    lastActivity: Date.now(),
    isActive: true,
    action: 'typing',
    selection: { startX: 120, startY: 80, endX: 200, endY: 120 }
  },
  {
    id: '2',
    name: 'Bob Smith',
    color: '#4ECDC4',
    avatar: 'data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2764%27%20height=%2764%27%20viewBox=%270%200%2064%2064%27%3E%3Crect%20width=%2764%27%20height=%2764%27%20rx=%2732%27%20fill=%27%230f766e%27/%3E%3Ccircle%20cx=%2732%27%20cy=%2726%27%20r=%2711%27%20fill=%27%23ffffff%27%20opacity=%27.9%27/%3E%3Cpath%20d=%27M14%2057c3-12%2013-18%2018-18s15%206%2018%2018%27%20fill=%27%23ffffff%27%20opacity=%27.85%27/%3E%3C/svg%3E',
    x: 300,
    y: 200,
    lastActivity: Date.now() - 1000,
    isActive: true,
    action: 'selecting'
  },
  {
    id: '3',
    name: 'Carol Davis',
    color: '#45B7D1',
    x: 450,
    y: 150,
    lastActivity: Date.now() - 500,
    isActive: true,
    action: 'drawing'
  },
  {
    id: '4',
    name: 'David Wilson',
    color: '#96CEB4',
    avatar: 'data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2764%27%20height=%2764%27%20viewBox=%270%200%2064%2064%27%3E%3Crect%20width=%2764%27%20height=%2764%27%20rx=%2732%27%20fill=%27%230f766e%27/%3E%3Ccircle%20cx=%2732%27%20cy=%2726%27%20r=%2711%27%20fill=%27%23ffffff%27%20opacity=%27.9%27/%3E%3Cpath%20d=%27M14%2057c3-12%2013-18%2018-18s15%206%2018%2018%27%20fill=%27%23ffffff%27%20opacity=%27.85%27/%3E%3C/svg%3E',
    x: 200,
    y: 300,
    lastActivity: Date.now() - 2000,
    isActive: true,
    action: 'idle'
  },
  {
    id: '5',
    name: 'Emma Brown',
    color: '#FECA57',
    x: 350,
    y: 250,
    lastActivity: Date.now() - 4000,
    isActive: false,
    action: 'idle'
  },
  {
    id: '6',
    name: 'Frank Miller',
    color: '#FF9FF3',
    avatar: 'data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2764%27%20height=%2764%27%20viewBox=%270%200%2064%2064%27%3E%3Crect%20width=%2764%27%20height=%2764%27%20rx=%2732%27%20fill=%27%230f766e%27/%3E%3Ccircle%20cx=%2732%27%20cy=%2726%27%20r=%2711%27%20fill=%27%23ffffff%27%20opacity=%27.9%27/%3E%3Cpath%20d=%27M14%2057c3-12%2013-18%2018-18s15%206%2018%2018%27%20fill=%27%23ffffff%27%20opacity=%27.85%27/%3E%3C/svg%3E',
    x: 500,
    y: 300,
    lastActivity: Date.now(),
    isActive: true,
    action: 'typing'
  }
];

const meta: Meta<typeof GlassCollaborativeCursor> = {
  title: 'Workflows/Social/Glass Collaborative Cursor',
  component: GlassCollaborativeCursor,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  args: {
    onCursorMove: fn(),
    onUserAction: fn(),
  },
  argTypes: {
    onCursorMove: { action: undefined },
    onUserAction: { action: undefined },
    cursorSize: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
    },
    fadeTimeout: {
      control: { type: 'range', min: 1000, max: 10000, step: 500 },
    },
    maxTrailLength: {
      control: { type: 'range', min: 5, max: 50, step: 5 },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    users: mockUsers,
    currentUserId: 'current',
    showCursorTails: true,
    showUserLabels: true,
    showAvatars: false,
    showSelections: true,
    showActions: true,
  },
};

export const WithAvatars: Story = {
  args: {
    users: mockUsers,
    currentUserId: 'current',
    showCursorTails: true,
    showUserLabels: true,
    showAvatars: true,
    showSelections: true,
    showActions: true,
  },
};

export const RealTimeMode: Story = {
  args: {
    users: mockUsers.slice(0, 4),
    currentUserId: 'current',
    realTimeMode: true,
    showCursorTails: true,
    showUserLabels: true,
    showAvatars: true,
    showSelections: true,
    showActions: true,
  },
};

export const MinimalInterface: Story = {
  args: {
    users: mockUsers,
    currentUserId: 'current',
    showCursorTails: false,
    showUserLabels: false,
    showAvatars: false,
    showSelections: false,
    showActions: false,
  },
};

export const SmallCursors: Story = {
  args: {
    users: mockUsers,
    currentUserId: 'current',
    cursorSize: 'small',
    showCursorTails: true,
    showUserLabels: true,
    maxTrailLength: 15,
  },
};

export const LargeCursors: Story = {
  args: {
    users: mockUsers,
    currentUserId: 'current',
    cursorSize: 'large',
    showCursorTails: true,
    showUserLabels: true,
    showAvatars: true,
    maxTrailLength: 8,
  },
};

export const LongTrails: Story = {
  args: {
    users: mockUsers,
    currentUserId: 'current',
    showCursorTails: true,
    maxTrailLength: 30,
    fadeTimeout: 8000,
    showUserLabels: true,
  },
};

export const ShortTrails: Story = {
  args: {
    users: mockUsers,
    currentUserId: 'current',
    showCursorTails: true,
    maxTrailLength: 5,
    fadeTimeout: 2000,
    showUserLabels: true,
  },
};

export const ActiveTyping: Story = {
  args: {
    users: mockUsers.map(user => ({
      ...user,
      action: 'typing' as const,
      isActive: true
    })),
    currentUserId: 'current',
    showCursorTails: true,
    showUserLabels: true,
    showActions: true,
    soundEnabled: true,
  },
};

export const SelectionMode: Story = {
  args: {
    users: mockUsers.map(user => ({
      ...user,
      action: 'selecting' as const,
      isActive: true,
      selection: {
        startX: user.x - 50,
        startY: user.y - 20,
        endX: user.x + 100,
        endY: user.y + 40
      }
    })),
    currentUserId: 'current',
    showSelections: true,
    showUserLabels: true,
    showActions: true,
  },
};

export const DrawingMode: Story = {
  args: {
    users: mockUsers.map(user => ({
      ...user,
      action: 'drawing' as const,
      isActive: true
    })),
    currentUserId: 'current',
    showCursorTails: true,
    maxTrailLength: 20,
    showUserLabels: true,
    showActions: true,
  },
};

export const FewUsers: Story = {
  args: {
    users: mockUsers.slice(0, 2),
    currentUserId: 'current',
    showCursorTails: true,
    showUserLabels: true,
    showAvatars: true,
    showActions: true,
  },
};

export const ManyUsers: Story = {
  args: {
    users: [
      ...mockUsers,
      ...Array.from({ length: 8 }, (_, i) => ({
        id: `extra-${i}`,
        name: `User ${i + 7}`,
        color: ['#EE5A6F', '#0FB9B1', '#3867D6', '#1DD1A1', '#FD79A8', '#54A0FF', '#5F27CD', '#00D2D3'][i],
        x: Math.random() * 600,
        y: Math.random() * 400,
        lastActivity: Date.now() - Math.random() * 3000,
        isActive: Math.random() > 0.3,
        action: ['typing', 'selecting', 'drawing', 'idle'][Math.floor(Math.random() * 4)] as any
      }))
    ],
    currentUserId: 'current',
    showCursorTails: true,
    showUserLabels: true,
    realTimeMode: true,
  },
};

export const InactiveUsers: Story = {
  args: {
    users: mockUsers.map(user => ({
      ...user,
      isActive: false,
      lastActivity: Date.now() - 5000
    })),
    currentUserId: 'current',
    fadeTimeout: 10000,
    showCursorTails: false,
    showUserLabels: true,
  },
};

export const NoTrails: Story = {
  args: {
    users: mockUsers,
    currentUserId: 'current',
    showCursorTails: false,
    showUserLabels: true,
    showAvatars: true,
    showActions: true,
  },
};

export const NoLabels: Story = {
  args: {
    users: mockUsers,
    currentUserId: 'current',
    showCursorTails: true,
    showUserLabels: false,
    showSelections: true,
    maxTrailLength: 15,
  },
};

export const SilentMode: Story = {
  args: {
    users: mockUsers,
    currentUserId: 'current',
    soundEnabled: false,
    realTimeMode: true,
    showCursorTails: true,
    showUserLabels: true,
    showActions: true,
  },
};

export const FastFade: Story = {
  args: {
    users: mockUsers,
    currentUserId: 'current',
    fadeTimeout: 1500,
    maxTrailLength: 8,
    showCursorTails: true,
    showUserLabels: true,
  },
};
