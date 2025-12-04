import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import {
    Bell,
    Calendar,
    Camera,
    Clock,
    FileText,
    Gift,
    Home,
    Image,
    Mail,
    Music,
    Search,
    Settings,
    Star,
    Trophy,
    User,
    Video
} from 'lucide-react';
import { GlassGoldenRatioGrid, type GoldenRatioItem } from './GlassGoldenRatioGrid';

// Basic content items
const basicItems: GoldenRatioItem[] = [
  {
    id: 'home',
    content: (
      <div className="glass-flex glass-flex-col glass-items-center glass-gap-2">
        <Home size={24} />
        <span className="glass-text-sm">Home</span>
      </div>
    ),
    priority: 10,
    category: 'navigation'
  },
  {
    id: 'profile',
    content: (
      <div className="glass-flex glass-flex-col glass-items-center glass-gap-2">
        <User size={20} />
        <span className="glass-text-xs">Profile</span>
      </div>
    ),
    priority: 8,
    category: 'user'
  },
  {
    id: 'settings',
    content: (
      <div className="glass-flex glass-flex-col glass-items-center glass-gap-2">
        <Settings size={20} />
        <span className="glass-text-xs">Settings</span>
      </div>
    ),
    priority: 6,
    category: 'system'
  },
  {
    id: 'messages',
    content: (
      <div className="glass-flex glass-flex-col glass-items-center glass-gap-2">
        <Mail size={18} />
        <span className="glass-text-xs">Messages</span>
      </div>
    ),
    priority: 7,
    category: 'communication'
  }
];

// Media gallery items
const mediaItems: GoldenRatioItem[] = [
  {
    id: 'featured-image',
    content: (
      <div className="glass-w-full glass-h-full glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-lg glass-flex glass-items-center glass-justify-center">
        <div className="glass-text-center">
          <Image size={32} className="glass-mx-auto glass-mb-2" />
          <span className="glass-text-sm glass-font-semibold">Featured Photo</span>
        </div>
      </div>
    ),
    priority: 15,
    category: 'media'
  },
  {
    id: 'video-1',
    content: (
      <div className="glass-w-full glass-h-full glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-lg glass-flex glass-items-center glass-justify-center">
        <div className="glass-text-center">
          <Video size={24} />
          <span className="glass-text-xs">Video</span>
        </div>
      </div>
    ),
    priority: 10,
    category: 'media'
  },
  {
    id: 'music-1',
    content: (
      <div className="glass-w-full glass-h-full glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-lg glass-flex glass-items-center glass-justify-center">
        <div className="glass-text-center">
          <Music size={24} />
          <span className="glass-text-xs">Music</span>
        </div>
      </div>
    ),
    priority: 8,
    category: 'media'
  },
  {
    id: 'gallery-1',
    content: (
      <div className="glass-w-full glass-h-full glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-lg glass-flex glass-items-center glass-justify-center">
        <Camera size={20} />
      </div>
    ),
    priority: 6,
    category: 'media'
  },
  {
    id: 'gallery-2',
    content: (
      <div className="glass-w-full glass-h-full glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-lg glass-flex glass-items-center glass-justify-center">
        <Image size={20} />
      </div>
    ),
    priority: 5,
    category: 'media'
  },
  {
    id: 'gallery-3',
    content: (
      <div className="glass-w-full glass-h-full glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-lg glass-flex glass-items-center glass-justify-center">
        <Video size={20} />
      </div>
    ),
    priority: 4,
    category: 'media'
  }
];

// Dashboard widgets
const dashboardItems: GoldenRatioItem[] = [
  {
    id: 'main-chart',
    content: (
      <div className="glass-w-full glass-h-full glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-lg glass-p-4">
        <h3 className="glass-text-lg glass-font-bold glass-mb-2">Analytics</h3>
        <div className="glass-w-full glass-h-12 glass-surface-subtle/20 glass-radius glass-flex glass-items-end justify-around">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="glass-w-2 glass-surface-subtle/60 glass-radius-t"
              style={{ height: `${20 + Math.random() * 60}%` }}
            />
          ))}
        </div>
      </div>
    ),
    priority: 20,
    category: 'analytics'
  },
  {
    id: 'stats-1',
    content: (
      <div className="glass-w-full glass-h-full glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-lg glass-p-3 glass-text-center">
        <div className="glass-text-2xl glass-font-bold">1,234</div>
        <div className="glass-text-xs opacity-80">Total Users</div>
      </div>
    ),
    priority: 15,
    category: 'stats'
  },
  {
    id: 'stats-2',
    content: (
      <div className="glass-w-full glass-h-full glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-lg glass-p-3 glass-text-center">
        <div className="glass-text-2xl glass-font-bold">89%</div>
        <div className="glass-text-xs opacity-80">Conversion</div>
      </div>
    ),
    priority: 12,
    category: 'stats'
  },
  {
    id: 'calendar',
    content: (
      <div className="glass-w-full glass-h-full glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-lg glass-p-3 glass-flex glass-items-center glass-justify-center">
        <div className="glass-text-center">
          <Calendar size={24} className="glass-mx-auto glass-mb-1" />
          <div className="glass-text-xs">Calendar</div>
        </div>
      </div>
    ),
    priority: 10,
    category: 'productivity'
  },
  {
    id: 'notifications',
    content: (
      <div className="glass-w-full glass-h-full glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-lg glass-p-3 glass-flex glass-items-center glass-justify-center">
        <div className="glass-text-center">
          <Bell size={20} className="glass-mx-auto glass-mb-1" />
          <div className="glass-text-xs">3 New</div>
        </div>
      </div>
    ),
    priority: 8,
    category: 'communication'
  },
  {
    id: 'clock',
    content: (
      <div className="glass-w-full glass-h-full glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-lg glass-p-3 glass-flex glass-items-center glass-justify-center">
        <div className="glass-text-center">
          <Clock size={20} className="glass-mx-auto glass-mb-1" />
          <div className="glass-text-xs">{new Date().toLocaleTimeString()}</div>
        </div>
      </div>
    ),
    priority: 6,
    category: 'utility'
  }
];

// Content cards
const contentCards: GoldenRatioItem[] = [
  {
    id: 'hero-content',
    content: (
      <div className="glass-w-full glass-h-full glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-lg glass-p-4">
        <div className="glass-flex glass-items-center glass-gap-2 glass-mb-3">
          <Star size={20} className="glass-text-secondary" />
          <h2 className="glass-text-lg glass-font-bold">Featured Article</h2>
        </div>
        <p className="glass-text-sm glass-opacity-90 glass-mb-3">
          Discover the mathematical beauty of the golden ratio in modern design systems.
        </p>
        <button className="glass-surface-subtle/20 hover:glass-surface-subtle/30 glass-px-3 glass-py-1 glass-radius glass-text-sm transition-colors">
          Read More
        </button>
      </div>
    ),
    priority: 25,
    category: 'content'
  },
  {
    id: 'article-1',
    content: (
      <div className="glass-w-full glass-h-full glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-lg glass-p-3">
        <FileText size={20} className="glass-mb-2" />
        <h3 className="glass-text-sm glass-font-semibold glass-mb-1">Design Principles</h3>
        <p className="glass-text-xs opacity-80">Essential guidelines for creating harmonious layouts...</p>
      </div>
    ),
    priority: 12,
    category: 'content'
  },
  {
    id: 'article-2',
    content: (
      <div className="glass-w-full glass-h-full glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-lg glass-p-3">
        <Trophy size={20} className="glass-mb-2" />
        <h3 className="glass-text-sm glass-font-semibold glass-mb-1">Best Practices</h3>
        <p className="glass-text-xs opacity-80">Learn from award-winning designs...</p>
      </div>
    ),
    priority: 10,
    category: 'content'
  },
  {
    id: 'promotion',
    content: (
      <div className="glass-w-full glass-h-full glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-lg glass-p-3 glass-flex glass-items-center glass-justify-center">
        <div className="glass-text-center">
          <Gift size={24} className="glass-mx-auto glass-mb-2" />
          <div className="glass-text-sm glass-font-semibold">Special Offer</div>
          <div className="glass-text-xs glass-opacity-90">50% Off</div>
        </div>
      </div>
    ),
    priority: 18,
    category: 'promotion'
  },
  {
    id: 'search',
    content: (
      <div className="glass-w-full glass-h-full glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-lg glass-p-3 glass-flex glass-items-center glass-justify-center">
        <div className="glass-text-center">
          <Search size={20} className="glass-mx-auto glass-mb-2" />
          <div className="glass-text-xs">Quick Search</div>
        </div>
      </div>
    ),
    priority: 8,
    category: 'utility'
  }
];

const meta = {
  title: 'Glass UI/Layouts/GlassGoldenRatioGrid',
  component: GlassGoldenRatioGrid,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    containerWidth: {
      control: { type: 'range', min: 400, max: 1200, step: 50 },
    },
    containerHeight: {
      control: { type: 'range', min: 300, max: 800, step: 50 },
    },
    goldenRatio: {
      control: { type: 'range', min: 1.4, max: 2.0, step: 0.01 },
    },
    subdivisionLevels: {
      control: { type: 'range', min: 2, max: 6, step: 1 },
    },
    spacing: {
      control: { type: 'range', min: 2, max: 20, step: 2 },
    },
    animateLayout: {
      control: 'boolean',
    },
    showGrid: {
      control: 'boolean',
    },
    showRatioLines: {
      control: 'boolean',
    },
    responsive: {
      control: 'boolean',
    },
    soundEnabled: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof GlassGoldenRatioGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: basicItems,
    containerWidth: 800,
    containerHeight: 600,
    goldenRatio: 1.618,
    subdivisionLevels: 4,
    spacing: 8,
    animateLayout: true,
    showGrid: false,
    showRatioLines: true,
    responsive: false,
    soundEnabled: true,
  },
};

export const MediaGallery: Story = {
  args: {
    items: mediaItems,
    containerWidth: 900,
    containerHeight: 700,
    goldenRatio: 1.618,
    subdivisionLevels: 4,
    spacing: 12,
    showRatioLines: true,
  },
};

export const Dashboard: Story = {
  args: {
    items: dashboardItems,
    containerWidth: 1000,
    containerHeight: 800,
    goldenRatio: 1.618,
    subdivisionLevels: 4,
    spacing: 10,
    showGrid: true,
    showRatioLines: false,
  },
};

export const ContentLayout: Story = {
  args: {
    items: contentCards,
    containerWidth: 900,
    containerHeight: 600,
    goldenRatio: 1.618,
    subdivisionLevels: 3,
    spacing: 15,
    showRatioLines: true,
  },
};

export const ClassicGoldenRatio: Story = {
  args: {
    items: basicItems,
    containerWidth: 800,
    containerHeight: 600,
    goldenRatio: 1.618, // Classic golden ratio
    subdivisionLevels: 3,
    showRatioLines: true,
  },
};

export const ModifiedRatio: Story = {
  args: {
    items: basicItems,
    containerWidth: 800,
    containerHeight: 600,
    goldenRatio: 1.5, // Modified ratio
    subdivisionLevels: 4,
    showRatioLines: true,
  },
};

export const SilverRatio: Story = {
  args: {
    items: basicItems,
    containerWidth: 800,
    containerHeight: 600,
    goldenRatio: 1.414, // Silver ratio (√2)
    subdivisionLevels: 4,
    showRatioLines: true,
  },
};

export const ShallowSubdivision: Story = {
  args: {
    items: mediaItems,
    containerWidth: 800,
    containerHeight: 600,
    subdivisionLevels: 2,
    spacing: 16,
    showGrid: true,
  },
};

export const DeepSubdivision: Story = {
  args: {
    items: dashboardItems,
    containerWidth: 900,
    containerHeight: 700,
    subdivisionLevels: 5,
    spacing: 6,
    showGrid: true,
  },
};

export const WideSpacing: Story = {
  args: {
    items: basicItems,
    containerWidth: 800,
    containerHeight: 600,
    spacing: 20,
    showGrid: true,
  },
};

export const TightSpacing: Story = {
  args: {
    items: mediaItems,
    containerWidth: 800,
    containerHeight: 600,
    spacing: 4,
    showGrid: false,
  },
};

export const WithGridLines: Story = {
  args: {
    items: basicItems,
    containerWidth: 800,
    containerHeight: 600,
    showGrid: true,
    showRatioLines: true,
  },
};

export const NoGridLines: Story = {
  args: {
    items: mediaItems,
    containerWidth: 800,
    containerHeight: 600,
    showGrid: false,
    showRatioLines: false,
  },
};

export const SpiralOnly: Story = {
  args: {
    items: basicItems,
    containerWidth: 800,
    containerHeight: 600,
    showGrid: false,
    showRatioLines: true,
  },
};

export const GridOnly: Story = {
  args: {
    items: basicItems,
    containerWidth: 800,
    containerHeight: 600,
    showGrid: true,
    showRatioLines: false,
  },
};

export const NoAnimation: Story = {
  args: {
    items: basicItems,
    containerWidth: 800,
    containerHeight: 600,
    animateLayout: false,
  },
};

export const Responsive: Story = {
  args: {
    items: contentCards,
    responsive: true,
    subdivisionLevels: 3,
    showRatioLines: true,
  },
};

export const LargeContainer: Story = {
  args: {
    items: dashboardItems,
    containerWidth: 1200,
    containerHeight: 900,
    subdivisionLevels: 5,
    spacing: 12,
    showGrid: true,
  },
};

export const SmallContainer: Story = {
  args: {
    items: basicItems,
    containerWidth: 500,
    containerHeight: 400,
    subdivisionLevels: 3,
    spacing: 8,
  },
};

export const SquareContainer: Story = {
  args: {
    items: mediaItems,
    containerWidth: 600,
    containerHeight: 600,
    subdivisionLevels: 4,
    showRatioLines: true,
  },
};

export const WideContainer: Story = {
  args: {
    items: contentCards,
    containerWidth: 1000,
    containerHeight: 500,
    subdivisionLevels: 3,
    showRatioLines: true,
  },
};

export const TallContainer: Story = {
  args: {
    items: dashboardItems,
    containerWidth: 500,
    containerHeight: 800,
    subdivisionLevels: 4,
    showRatioLines: true,
  },
};

export const CustomGlass: Story = {
  args: {
    items: basicItems,
    containerWidth: 800,
    containerHeight: 600,
    showRatioLines: true,
    glassConfig: {
      blur: 20,
      opacity: 0.85,
      saturation: 1.2,
      brightness: 1.1,
      contrast: 1.05
    }
  },
};

export const MinimalGlass: Story = {
  args: {
    items: basicItems,
    containerWidth: 800,
    containerHeight: 600,
    showRatioLines: true,
    glassConfig: {
      blur: 5,
      opacity: 0.98,
      saturation: 1.0,
      brightness: 1.0,
      contrast: 1.0
    }
  },
};

export const InteractiveDemo: Story = {
  args: {
    items: contentCards,
    containerWidth: 900,
    containerHeight: 700,
    showRatioLines: true,
    showGrid: true,
    onItemClick: fn(),
    onItemHover: fn(),
    onLayoutChange: fn(),
  },
};