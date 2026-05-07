import type { Meta, StoryObj } from '@storybook/react';
import { GlassPresenceIndicator } from './GlassPresenceIndicator';

const mockUsers = [
  {
    id: '1',
    name: 'Alice Johnson',
    avatar: 'data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2764%27%20height=%2764%27%20viewBox=%270%200%2064%2064%27%3E%3Crect%20width=%2764%27%20height=%2764%27%20rx=%2732%27%20fill=%27%230f766e%27/%3E%3Ccircle%20cx=%2732%27%20cy=%2726%27%20r=%2711%27%20fill=%27%23ffffff%27%20opacity=%27.9%27/%3E%3Cpath%20d=%27M14%2057c3-12%2013-18%2018-18s15%206%2018%2018%27%20fill=%27%23ffffff%27%20opacity=%27.85%27/%3E%3C/svg%3E',
    status: 'online' as const,
    activity: 'Working on project',
    location: 'San Francisco, CA',
    timezone: 'PST',
    isTyping: false,
    customStatus: { emoji: '💻', text: 'Coding' }
  },
  {
    id: '2',
    name: 'Bob Smith',
    avatar: 'data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2764%27%20height=%2764%27%20viewBox=%270%200%2064%2064%27%3E%3Crect%20width=%2764%27%20height=%2764%27%20rx=%2732%27%20fill=%27%230f766e%27/%3E%3Ccircle%20cx=%2732%27%20cy=%2726%27%20r=%2711%27%20fill=%27%23ffffff%27%20opacity=%27.9%27/%3E%3Cpath%20d=%27M14%2057c3-12%2013-18%2018-18s15%206%2018%2018%27%20fill=%27%23ffffff%27%20opacity=%27.85%27/%3E%3C/svg%3E',
    status: 'away' as const,
    activity: 'In a meeting',
    lastSeen: new Date(Date.now() - 15 * 60 * 1000),
    customStatus: { emoji: '🏢', text: 'In meeting' }
  },
  {
    id: '3',
    name: 'Carol Davis',
    status: 'online' as const,
    activity: 'Available',
    isTyping: true,
    customStatus: { emoji: '✨', text: 'Ready to help!' }
  },
  {
    id: '4',
    name: 'David Wilson',
    avatar: 'data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2764%27%20height=%2764%27%20viewBox=%270%200%2064%2064%27%3E%3Crect%20width=%2764%27%20height=%2764%27%20rx=%2732%27%20fill=%27%230f766e%27/%3E%3Ccircle%20cx=%2732%27%20cy=%2726%27%20r=%2711%27%20fill=%27%23ffffff%27%20opacity=%27.9%27/%3E%3Cpath%20d=%27M14%2057c3-12%2013-18%2018-18s15%206%2018%2018%27%20fill=%27%23ffffff%27%20opacity=%27.85%27/%3E%3C/svg%3E',
    status: 'busy' as const,
    activity: 'Do not disturb',
    lastSeen: new Date(Date.now() - 5 * 60 * 1000),
    customStatus: { emoji: '🔥', text: 'On deadline' }
  },
  {
    id: '5',
    name: 'Emma Brown',
    status: 'offline' as const,
    lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000),
    location: 'New York, NY'
  },
  {
    id: '6',
    name: 'Frank Miller',
    avatar: 'data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2764%27%20height=%2764%27%20viewBox=%270%200%2064%2064%27%3E%3Crect%20width=%2764%27%20height=%2764%27%20rx=%2732%27%20fill=%27%230f766e%27/%3E%3Ccircle%20cx=%2732%27%20cy=%2726%27%20r=%2711%27%20fill=%27%23ffffff%27%20opacity=%27.9%27/%3E%3Cpath%20d=%27M14%2057c3-12%2013-18%2018-18s15%206%2018%2018%27%20fill=%27%23ffffff%27%20opacity=%27.85%27/%3E%3C/svg%3E',
    status: 'online' as const,
    activity: 'Available for chat',
    isTyping: false
  },
  {
    id: '7',
    name: 'Grace Lee',
    status: 'away' as const,
    activity: 'Away from keyboard',
    lastSeen: new Date(Date.now() - 30 * 60 * 1000),
    customStatus: { emoji: '🌮', text: 'Lunch break' }
  },
  {
    id: '8',
    name: 'Henry Chen',
    avatar: 'data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2764%27%20height=%2764%27%20viewBox=%270%200%2064%2064%27%3E%3Crect%20width=%2764%27%20height=%2764%27%20rx=%2732%27%20fill=%27%230f766e%27/%3E%3Ccircle%20cx=%2732%27%20cy=%2726%27%20r=%2711%27%20fill=%27%23ffffff%27%20opacity=%27.9%27/%3E%3Cpath%20d=%27M14%2057c3-12%2013-18%2018-18s15%206%2018%2018%27%20fill=%27%23ffffff%27%20opacity=%27.85%27/%3E%3C/svg%3E',
    status: 'online' as const,
    activity: 'Active',
    isTyping: true
  }
];

const meta = {
  title: 'Workflows/Glass Presence Indicator',
  component: GlassPresenceIndicator,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    maxVisible: {
      control: { type: 'range', min: 1, max: 10, step: 1 },
    },
    layout: {
      control: { type: 'select' },
      options: ['horizontal', 'vertical', 'grid', 'stack'],
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
    },
    theme: {
      control: { type: 'select' },
      options: ['light', 'dark', 'auto'],
    },
  },
} satisfies Meta<typeof GlassPresenceIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    users: mockUsers.slice(0, 5),
    showAvatars: true,
    showNames: true,
    showStatus: true,
    showActivity: true,
    showLastSeen: true,
    showTypingIndicator: true,
  },
};

export const HorizontalLayout: Story = {
  args: {
    users: mockUsers.slice(0, 4),
    layout: 'horizontal',
    size: 'medium',
    showAvatars: true,
    showNames: true,
    showStatus: true,
    showActivity: false,
  },
};

export const VerticalLayout: Story = {
  args: {
    users: mockUsers.slice(0, 6),
    layout: 'vertical',
    size: 'medium',
    showAvatars: true,
    showNames: true,
    showStatus: true,
    showActivity: true,
    showLastSeen: true,
  },
};

export const GridLayout: Story = {
  args: {
    users: mockUsers.slice(0, 8),
    layout: 'grid',
    size: 'medium',
    showAvatars: true,
    showNames: true,
    showStatus: true,
    maxVisible: 8,
  },
};

export const StackLayout: Story = {
  args: {
    users: mockUsers,
    layout: 'stack',
    size: 'small',
    showAvatars: true,
    showNames: true,
    showStatus: true,
    showActivity: false,
    maxVisible: 6,
  },
};

export const SmallSize: Story = {
  args: {
    users: mockUsers.slice(0, 5),
    size: 'small',
    layout: 'horizontal',
    showAvatars: true,
    showNames: false,
    showStatus: true,
    showActivity: false,
  },
};

export const LargeSize: Story = {
  args: {
    users: mockUsers.slice(0, 4),
    size: 'large',
    layout: 'vertical',
    showAvatars: true,
    showNames: true,
    showStatus: true,
    showActivity: true,
    showLastSeen: true,
  },
};

export const MinimalView: Story = {
  args: {
    users: mockUsers,
    showAvatars: false,
    showNames: true,
    showStatus: true,
    showActivity: false,
    showLastSeen: false,
    showTypingIndicator: false,
    layout: 'stack',
    size: 'small',
    maxVisible: 8,
  },
};

export const StatusOnly: Story = {
  args: {
    users: mockUsers,
    showAvatars: true,
    showNames: false,
    showStatus: true,
    showActivity: false,
    showLastSeen: false,
    showTypingIndicator: false,
    layout: 'horizontal',
    size: 'small',
    maxVisible: 10,
  },
};

export const WithTypingIndicators: Story = {
  args: {
    users: mockUsers.map((user, index) => ({
      ...user,
      isTyping: index % 3 === 0
    })),
    showTypingIndicator: true,
    showAvatars: true,
    showNames: true,
    showStatus: true,
    layout: 'vertical',
    maxVisible: 6,
  },
};

export const GroupedByStatus: Story = {
  args: {
    users: mockUsers,
    groupSimilarStatus: true,
    showAvatars: true,
    showNames: true,
    showStatus: true,
    showActivity: true,
    layout: 'vertical',
    maxVisible: 8,
  },
};

export const RealTimeSync: Story = {
  args: {
    users: mockUsers.slice(0, 6),
    realTimeSync: true,
    showAvatars: true,
    showNames: true,
    showStatus: true,
    showActivity: true,
    showLastSeen: true,
    showTypingIndicator: true,
    layout: 'vertical',
  },
};

export const OnlineOnly: Story = {
  args: {
    users: mockUsers.filter(user => user.status === 'online'),
    showAvatars: true,
    showNames: true,
    showStatus: true,
    showActivity: true,
    showTypingIndicator: true,
    layout: 'horizontal',
  },
};

export const OfflineUsers: Story = {
  args: {
    users: mockUsers.filter(user => user.status === 'offline'),
    showAvatars: true,
    showNames: true,
    showStatus: true,
    showActivity: false,
    showLastSeen: true,
    layout: 'vertical',
  },
};

export const CustomStatuses: Story = {
  args: {
    users: mockUsers.filter(user => user.customStatus),
    showAvatars: true,
    showNames: true,
    showStatus: true,
    showActivity: false,
    layout: 'vertical',
    size: 'medium',
  },
};

export const LimitedVisible: Story = {
  args: {
    users: mockUsers,
    maxVisible: 3,
    showAvatars: true,
    showNames: true,
    showStatus: true,
    showActivity: true,
    layout: 'vertical',
  },
};

export const NoAnimations: Story = {
  args: {
    users: mockUsers.slice(0, 5),
    animateChanges: false,
    showAvatars: true,
    showNames: true,
    showStatus: true,
    showActivity: true,
    layout: 'vertical',
  },
};

export const SilentMode: Story = {
  args: {
    users: mockUsers.slice(0, 5),
    soundEnabled: false,
    showAvatars: true,
    showNames: true,
    showStatus: true,
    showActivity: true,
    realTimeSync: true,
    layout: 'horizontal',
  },
};