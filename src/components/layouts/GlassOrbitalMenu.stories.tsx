import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import {
    Bell,
    Camera,
    Download,
    Edit,
    Heart,
    Home,
    Mail,
    Mic,
    Minus,
    Pause,
    Play,
    Plus,
    Search,
    Settings,
    Share,
    Trash2,
    User
} from 'lucide-react';
import { GlassOrbitalMenu, type OrbitalMenuItem } from './GlassOrbitalMenu';

// Mock menu items with icons
const createMenuItem = (id: string, label: string, icon: React.ReactNode, shortcut?: string): OrbitalMenuItem => ({
  id,
  label,
  icon,
  shortcut,
  onClick: fn(),
  category: 'action',
  priority: Math.floor(Math.random() * 5),
  metadata: {
    usage: Math.floor(Math.random() * 100),
    lastUsed: new Date().toISOString()
  }
});

const basicItems: OrbitalMenuItem[] = [
  createMenuItem('home', 'Home', <Home size={20} />, '⌘H'),
  createMenuItem('profile', 'Profile', <User size={20} />, '⌘U'),
  createMenuItem('settings', 'Settings', <Settings size={20} />, '⌘,'),
  createMenuItem('messages', 'Messages', <Mail size={20} />, '⌘M'),
];

const extendedItems: OrbitalMenuItem[] = [
  createMenuItem('home', 'Home', <Home size={20} />, '⌘H'),
  createMenuItem('profile', 'Profile', <User size={20} />, '⌘U'),
  createMenuItem('settings', 'Settings', <Settings size={20} />, '⌘,'),
  createMenuItem('messages', 'Messages', <Mail size={20} />, '⌘M'),
  createMenuItem('search', 'Search', <Search size={20} />, '⌘F'),
  createMenuItem('notifications', 'Notifications', <Bell size={20} />, '⌘N'),
];

const manyItems: OrbitalMenuItem[] = [
  createMenuItem('home', 'Home', <Home size={20} />, '⌘H'),
  createMenuItem('profile', 'Profile', <User size={20} />, '⌘U'),
  createMenuItem('settings', 'Settings', <Settings size={20} />, '⌘,'),
  createMenuItem('messages', 'Messages', <Mail size={20} />, '⌘M'),
  createMenuItem('search', 'Search', <Search size={20} />, '⌘F'),
  createMenuItem('notifications', 'Notifications', <Bell size={20} />, '⌘N'),
  createMenuItem('favorites', 'Favorites', <Heart size={20} />, '⌘L'),
  createMenuItem('share', 'Share', <Share size={20} />, '⌘S'),
  createMenuItem('download', 'Download', <Download size={20} />, '⌘D'),
  createMenuItem('edit', 'Edit', <Edit size={20} />, '⌘E'),
  createMenuItem('delete', 'Delete', <Trash2 size={20} />, '⌘⌫'),
  createMenuItem('add', 'Add New', <Plus size={20} />, '⌘+'),
];

const mediaItems: OrbitalMenuItem[] = [
  createMenuItem('play', 'Play', <Play size={20} />, 'Space'),
  createMenuItem('pause', 'Pause', <Pause size={20} />, 'Space'),
  createMenuItem('camera', 'Camera', <Camera size={20} />, '⌘C'),
  createMenuItem('mic', 'Microphone', <Mic size={20} />, '⌘⇧M'),
  createMenuItem('volume-up', 'Volume Up', <Plus size={20} />, '↑'),
  createMenuItem('volume-down', 'Volume Down', <Minus size={20} />, '↓'),
];

const customCenterElement = (
  <div className="glass-w-8 glass-h-8 glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-full glass-flex glass-items-center glass-justify-center">
    <div className="glass-w-3 glass-h-3 glass-surface-subtle glass-radius-full" />
  </div>
);

const meta = {
  title: 'Surfaces/App Shells + Layout/Glass Orbital Menu',
  component: GlassOrbitalMenu,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    radius: {
      control: { type: 'range', min: 60, max: 200, step: 10 },
    },
    itemSize: {
      control: { type: 'range', min: 32, max: 80, step: 4 },
    },
    isOpen: {
      control: 'boolean',
    },
    rotationSpeed: {
      control: { type: 'range', min: 0, max: 2, step: 0.1 },
    },
    autoRotate: {
      control: 'boolean',
    },
    hoverExpansion: {
      control: { type: 'range', min: 1, max: 2, step: 0.1 },
    },
    springTension: {
      control: { type: 'range', min: 100, max: 500, step: 50 },
    },
    springFriction: {
      control: { type: 'range', min: 10, max: 50, step: 5 },
    },
    soundEnabled: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof GlassOrbitalMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: basicItems,
    isOpen: true,
    radius: 120,
    itemSize: 48,
    rotationSpeed: 0.5,
    autoRotate: false,
    hoverExpansion: 1.2,
    springTension: 300,
    springFriction: 25,
    soundEnabled: true,
    glassConfig: {
      blur: 20,
      opacity: 0.8,
      saturation: 1.2,
      brightness: 1.1,
      contrast: 1.1
    }
  },
};

export const Closed: Story = {
  args: {
    items: basicItems,
    isOpen: false,
    radius: 120,
    itemSize: 48,
  },
};

export const AutoRotating: Story = {
  args: {
    items: extendedItems,
    isOpen: true,
    radius: 140,
    itemSize: 52,
    autoRotate: true,
    rotationSpeed: 0.3,
  },
};

export const FastRotation: Story = {
  args: {
    items: extendedItems,
    isOpen: true,
    radius: 120,
    itemSize: 48,
    autoRotate: true,
    rotationSpeed: 1.2,
  },
};

export const LargeRadius: Story = {
  args: {
    items: manyItems,
    isOpen: true,
    radius: 180,
    itemSize: 56,
    hoverExpansion: 1.3,
  },
};

export const SmallRadius: Story = {
  args: {
    items: basicItems,
    isOpen: true,
    radius: 80,
    itemSize: 40,
    hoverExpansion: 1.15,
  },
};

export const ManyItems: Story = {
  args: {
    items: manyItems,
    isOpen: true,
    radius: 160,
    itemSize: 48,
    autoRotate: true,
    rotationSpeed: 0.2,
  },
};

export const MediaControls: Story = {
  args: {
    items: mediaItems,
    isOpen: true,
    radius: 100,
    itemSize: 52,
    centerElement: (
      <div className="glass-w-8 glass-h-8 glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-full glass-flex glass-items-center glass-justify-center">
        <Play size={16} className="glass-text-primary ml-0.5" />
      </div>
    ),
  },
};

export const CustomCenter: Story = {
  args: {
    items: basicItems,
    isOpen: true,
    radius: 120,
    itemSize: 48,
    centerElement: customCenterElement,
  },
};

export const LargeItems: Story = {
  args: {
    items: basicItems,
    isOpen: true,
    radius: 140,
    itemSize: 72,
    hoverExpansion: 1.2,
  },
};

export const SmallItems: Story = {
  args: {
    items: extendedItems,
    isOpen: true,
    radius: 100,
    itemSize: 36,
    hoverExpansion: 1.3,
  },
};

export const HighExpansion: Story = {
  args: {
    items: basicItems,
    isOpen: true,
    radius: 120,
    itemSize: 48,
    hoverExpansion: 1.8,
  },
};

export const LowExpansion: Story = {
  args: {
    items: basicItems,
    isOpen: true,
    radius: 120,
    itemSize: 48,
    hoverExpansion: 1.1,
  },
};

export const SlowAnimation: Story = {
  args: {
    items: basicItems,
    isOpen: true,
    radius: 120,
    itemSize: 48,
    springTension: 150,
    springFriction: 40,
  },
};

export const FastAnimation: Story = {
  args: {
    items: basicItems,
    isOpen: true,
    radius: 120,
    itemSize: 48,
    springTension: 500,
    springFriction: 15,
  },
};

export const BouncyAnimation: Story = {
  args: {
    items: basicItems,
    isOpen: true,
    radius: 120,
    itemSize: 48,
    springTension: 400,
    springFriction: 12,
  },
};

export const StiffAnimation: Story = {
  args: {
    items: basicItems,
    isOpen: true,
    radius: 120,
    itemSize: 48,
    springTension: 600,
    springFriction: 50,
  },
};

export const DisabledItems: Story = {
  args: {
    items: basicItems.map((item, index) => ({
      ...item,
      disabled: index % 2 === 0
    })),
    isOpen: true,
    radius: 120,
    itemSize: 48,
  },
};

export const NoSounds: Story = {
  args: {
    items: basicItems,
    isOpen: true,
    radius: 120,
    itemSize: 48,
    soundEnabled: false,
  },
};

export const CustomGlass: Story = {
  args: {
    items: basicItems,
    isOpen: true,
    radius: 120,
    itemSize: 48,
    glassConfig: {
      blur: 30,
      opacity: 0.6,
      saturation: 1.5,
      brightness: 1.3,
      contrast: 1.2
    }
  },
};

export const MinimalGlass: Story = {
  args: {
    items: basicItems,
    isOpen: true,
    radius: 120,
    itemSize: 48,
    glassConfig: {
      blur: 10,
      opacity: 0.9,
      saturation: 1.0,
      brightness: 1.0,
      contrast: 1.0
    }
  },
};

export const IntenseGlass: Story = {
  args: {
    items: basicItems,
    isOpen: true,
    radius: 120,
    itemSize: 48,
    glassConfig: {
      blur: 40,
      opacity: 0.5,
      saturation: 2.0,
      brightness: 1.5,
      contrast: 1.3
    }
  },
};

export const CompactLayout: Story = {
  args: {
    items: basicItems,
    isOpen: true,
    radius: 80,
    itemSize: 36,
    hoverExpansion: 1.2,
    autoRotate: true,
    rotationSpeed: 0.4,
  },
};

export const SpacedLayout: Story = {
  args: {
    items: basicItems,
    isOpen: true,
    radius: 200,
    itemSize: 60,
    hoverExpansion: 1.3,
  },
};

export const Interactive: Story = {
  args: {
    items: basicItems,
    isOpen: false,
    radius: 120,
    itemSize: 48,
    onOpenChange: fn(),
  },
};