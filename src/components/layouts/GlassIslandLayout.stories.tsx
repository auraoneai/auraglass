import type { Meta, StoryObj } from '@storybook/react';
import { GlassIslandLayout, type Island, type IslandConnection } from './GlassIslandLayout';

import { cn } from '../../lib/utils';
// Generate mock islands with different content types
const mockIslands: Island[] = [
  {
    id: 'dashboard',
    x: 100,
    y: 100,
    width: 300,
    height: 200,
    category: 'analytics',
    content: (
      <div className="glass-h-full">
        <h3 className="glass-text-lg glass-font-semibold glass-text-primary/90 glass-mb-2">Dashboard</h3>
        <div className="glass-grid glass-glass-grid-cols-2 glass-gap-2 glass-text-sm glass-text-primary/70">
          <div>Users: 1,234</div>
          <div>Revenue: $5,678</div>
          <div>Sessions: 2,345</div>
          <div>Conversion: 12.3%</div>
        </div>
      </div>
    )
  },
  {
    id: 'chat',
    x: 450,
    y: 150,
    width: 250,
    height: 180,
    category: 'communication',
    draggable: true,
    content: (
      <div className="glass-h-full">
        <h3 className="glass-text-lg glass-font-semibold glass-text-primary/90 glass-mb-2">Team Chat</h3>
        <div className="glass-space-y-2 glass-text-sm glass-text-primary/70">
          <div>Alice: Hey team! 👋</div>
          <div>Bob: Ready for the demo</div>
          <div>Charlie: Looking good!</div>
        </div>
      </div>
    )
  },
  {
    id: 'calendar',
    x: 200,
    y: 350,
    width: 280,
    height: 160,
    category: 'productivity',
    pinned: true,
    content: (
      <div className="glass-h-full">
        <h3 className="glass-text-lg glass-font-semibold glass-text-primary/90 glass-mb-2">Calendar</h3>
        <div className="space-y-1 glass-text-sm glass-text-primary/70">
          <div>9:00 AM - Team standup</div>
          <div>2:00 PM - Client presentation</div>
          <div>4:00 PM - Code review</div>
        </div>
      </div>
    )
  },
  {
    id: 'metrics',
    x: 520,
    y: 380,
    width: 200,
    height: 150,
    category: 'analytics',
    content: (
      <div className="glass-h-full">
        <h3 className="glass-text-lg glass-font-semibold glass-text-primary/90 glass-mb-2">Metrics</h3>
        <div className="glass-space-y-2">
          <div className="glass-w-full glass-surface-subtle/20 glass-radius-full glass-h-2">
            <div className="glass-surface-green glass-h-2 glass-radius-full" style={{width: '75%'}}></div>
          </div>
          <div className="glass-w-full glass-surface-subtle/20 glass-radius-full glass-h-2">
            <div className="glass-surface-blue glass-h-2 glass-radius-full" style={{width: '60%'}}></div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'tasks',
    x: 50,
    y: 550,
    width: 320,
    height: 140,
    category: 'productivity',
    content: (
      <div className="glass-h-full">
        <h3 className="glass-text-lg glass-font-semibold glass-text-primary/90 glass-mb-2">Tasks</h3>
        <div className="space-y-1 glass-text-sm glass-text-primary/70">
          <div>✅ Update documentation</div>
          <div>🔄 Review pull requests</div>
          <div>⏳ Deploy to staging</div>
        </div>
      </div>
    )
  },
  {
    id: 'notes',
    x: 750,
    y: 200,
    width: 180,
    height: 220,
    category: 'notes',
    resizable: true,
    content: (
      <div className="glass-h-full">
        <h3 className="glass-text-lg glass-font-semibold glass-text-primary/90 glass-mb-2">Notes</h3>
        <div className="glass-text-sm glass-text-primary/70 space-y-1">
          <div>• Feature ideas</div>
          <div>• Bug reports</div>
          <div>• Meeting notes</div>
          <div>• Architecture thoughts</div>
        </div>
      </div>
    )
  }
];

const mockConnections: IslandConnection[] = [
  {
    from: 'dashboard',
    to: 'metrics',
    type: 'solid',
    color: 'var(--glass-color-primary-light)',
    strength: 1
  },
  {
    from: 'chat',
    to: 'tasks',
    type: 'dashed',
    color: 'var(--glass-color-success-light)',
    strength: 0.8
  },
  {
    from: 'calendar',
    to: 'tasks',
    type: 'dotted',
    color: 'var(--glass-color-warning-light)',
    strength: 0.6
  },
  {
    from: 'metrics',
    to: 'notes',
    type: 'animated',
    color: 'var(--glass-color-danger-light)',
    strength: 0.5
  }
];

const smallIslands = mockIslands.slice(0, 3);
const largeIslands = [
  ...mockIslands,
  {
    id: 'reports',
    x: 400,
    y: 600,
    width: 250,
    height: 160,
    category: 'analytics',
    content: (
      <div className="glass-h-full">
        <h3 className="glass-text-lg glass-font-semibold glass-text-primary/90 glass-mb-2">Reports</h3>
        <div className="glass-text-sm glass-text-primary/70">
          Monthly performance analysis and insights
        </div>
      </div>
    )
  },
  {
    id: 'settings',
    x: 800,
    y: 500,
    width: 200,
    height: 120,
    category: 'system',
    content: (
      <div className="glass-h-full">
        <h3 className="glass-text-lg glass-font-semibold glass-text-primary/90 glass-mb-2">Settings</h3>
        <div className="glass-text-sm glass-text-primary/70">
          System configuration
        </div>
      </div>
    )
  }
];

const meta = {
  title: 'Surfaces/App Shells + Layout/Glass Island Layout',
  component: GlassIslandLayout,
  parameters: {
    layout: 'fullscreen',
    previewSurface: 'app',
  },
  decorators: [
    (Story) => (
      <div
        className="glass-flex glass-min-h-screen glass-w-full glass-items-start glass-justify-center glass-overflow-auto glass-p-8"
        style={{ boxSizing: 'border-box' }}
      >
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
  args: {
    className: 'glass-overflow-auto overflow-auto',
  },
  argTypes: {
    showMinimap: {
      control: 'boolean',
    },
    showConnections: {
      control: 'boolean',
    },
    showGrid: {
      control: 'boolean',
    },
    showStats: {
      control: 'boolean',
    },
    enablePhysics: {
      control: 'boolean',
    },
    enableDragging: {
      control: 'boolean',
    },
    enableResizing: {
      control: 'boolean',
    },
    enableZooming: {
      control: 'boolean',
    },
    zoomLevel: {
      control: { type: 'range', min: 0.2, max: 3.0, step: 0.1 },
    },
    centerOnLoad: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof GlassIslandLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    islands: mockIslands,
    connections: mockConnections,
    showMinimap: true,
    showConnections: true,
    showGrid: false,
    showStats: true,
    enablePhysics: false,
    enableDragging: true,
    enableResizing: false,
    enableZooming: true,
    zoomLevel: 1.0,
    centerOnLoad: true,
    config: {
      containerPadding: 50,
      islandSpacing: 100,
      connectionDistance: 300,
      animationSpeed: 1.0,
      gravityStrength: 0.02,
      repulsionStrength: 100,
      enablePhysics: false,
      enableAutoArrange: false,
      enableCollisionDetection: true
    }
  },
};

export const PhysicsEnabled: Story = {
  args: {
    islands: mockIslands,
    connections: mockConnections,
    showMinimap: true,
    showConnections: true,
    showGrid: true,
    showStats: true,
    enablePhysics: true,
    enableDragging: true,
    enableResizing: false,
    enableZooming: true,
    centerOnLoad: true,
    config: {
      gravityStrength: 0.05,
      repulsionStrength: 150,
      enablePhysics: true,
      animationSpeed: 0.8,
    }
  },
};

export const MinimalView: Story = {
  args: {
    islands: smallIslands,
    connections: [],
    showMinimap: false,
    showConnections: false,
    showGrid: false,
    showStats: false,
    enablePhysics: false,
    enableDragging: true,
    enableResizing: false,
    enableZooming: false,
    centerOnLoad: true,
  },
};

export const ConnectionFocus: Story = {
  args: {
    islands: mockIslands,
    connections: mockConnections,
    showMinimap: false,
    showConnections: true,
    showGrid: true,
    showStats: true,
    enablePhysics: false,
    enableDragging: true,
    enableResizing: false,
    enableZooming: true,
    centerOnLoad: true,
  },
};

export const DragAndResize: Story = {
  args: {
    islands: smallIslands,
    connections: [],
    showMinimap: true,
    showConnections: false,
    showGrid: true,
    showStats: true,
    enablePhysics: false,
    enableDragging: true,
    enableResizing: true,
    enableZooming: true,
    centerOnLoad: true,
  },
};

export const AutoArranged: Story = {
  args: {
    islands: largeIslands,
    connections: mockConnections,
    showMinimap: true,
    showConnections: true,
    showGrid: true,
    showStats: true,
    enablePhysics: false,
    enableDragging: true,
    enableResizing: false,
    enableZooming: true,
    centerOnLoad: true,
    config: {
      enableAutoArrange: true,
      islandSpacing: 120,
    }
  },
};

export const ZoomedIn: Story = {
  args: {
    islands: mockIslands,
    connections: mockConnections,
    showMinimap: true,
    showConnections: true,
    showGrid: true,
    showStats: true,
    enableZooming: true,
    zoomLevel: 1.5,
    centerOnLoad: true,
  },
};

export const ZoomedOut: Story = {
  args: {
    islands: largeIslands,
    connections: mockConnections,
    showMinimap: true,
    showConnections: true,
    showGrid: false,
    showStats: true,
    enableZooming: true,
    zoomLevel: 0.6,
    centerOnLoad: true,
  },
};

export const GridEnabled: Story = {
  args: {
    islands: mockIslands,
    connections: [],
    showMinimap: true,
    showConnections: false,
    showGrid: true,
    showStats: true,
    enableDragging: true,
    enableZooming: true,
    centerOnLoad: true,
  },
};

export const DenseLayout: Story = {
  args: {
    islands: largeIslands,
    connections: [
      ...mockConnections,
      {
        from: 'reports',
        to: 'dashboard',
        type: 'solid',
        color: '#8b5cf6',
        strength: 1
      },
      {
        from: 'settings',
        to: 'notes',
        type: 'dashed',
        color: '#06b6d4',
        strength: 0.7
      }
    ],
    showMinimap: true,
    showConnections: true,
    showGrid: true,
    showStats: true,
    enablePhysics: true,
    enableDragging: true,
    centerOnLoad: true,
    config: {
      islandSpacing: 80,
      gravityStrength: 0.03,
      repulsionStrength: 120,
    }
  },
};

export const SparseLayout: Story = {
  args: {
    islands: smallIslands,
    connections: mockConnections.slice(0, 2),
    showMinimap: true,
    showConnections: true,
    showGrid: false,
    showStats: true,
    enablePhysics: false,
    enableDragging: true,
    centerOnLoad: true,
    config: {
      islandSpacing: 200,
      containerPadding: 100,
    }
  },
};

export const NoConnections: Story = {
  args: {
    islands: mockIslands,
    connections: [],
    showMinimap: true,
    showConnections: false,
    showGrid: false,
    showStats: true,
    enablePhysics: false,
    enableDragging: true,
    enableResizing: true,
    enableZooming: true,
    centerOnLoad: true,
  },
};

export const AllConnections: Story = {
  args: {
    islands: mockIslands,
    connections: [
      ...mockConnections,
      {
        from: 'dashboard',
        to: 'chat',
        type: 'solid',
        color: 'var(--glass-color-success)',
        strength: 0.8
      },
      {
        from: 'calendar',
        to: 'notes',
        type: 'dotted',
        color: 'var(--glass-color-warning)',
        strength: 0.6
      },
      {
        from: 'tasks',
        to: 'notes',
        type: 'animated',
        color: 'var(--glass-color-danger)',
        strength: 0.7
      }
    ],
    showMinimap: true,
    showConnections: true,
    showGrid: true,
    showStats: true,
    enablePhysics: false,
    enableDragging: true,
    centerOnLoad: true,
  },
};

export const PhysicsWithConnections: Story = {
  args: {
    islands: mockIslands,
    connections: mockConnections,
    showMinimap: true,
    showConnections: true,
    showGrid: true,
    showStats: true,
    enablePhysics: true,
    enableDragging: true,
    enableZooming: true,
    centerOnLoad: true,
    config: {
      enablePhysics: true,
      gravityStrength: 0.08,
      repulsionStrength: 200,
      animationSpeed: 0.6,
      enableCollisionDetection: true,
    }
  },
};

export const PinnedIslands: Story = {
  args: {
    islands: mockIslands.map(island => ({ 
      ...island, 
      pinned: island.id === 'dashboard' || island.id === 'calendar' 
    })),
    connections: mockConnections,
    showMinimap: true,
    showConnections: true,
    showGrid: false,
    showStats: true,
    enablePhysics: true,
    enableDragging: true,
    centerOnLoad: true,
  },
};

export const MinimizedIslands: Story = {
  args: {
    islands: mockIslands.map(island => ({ 
      ...island, 
      minimized: island.id === 'notes' || island.id === 'metrics' 
    })),
    connections: mockConnections,
    showMinimap: true,
    showConnections: true,
    showGrid: false,
    showStats: true,
    enableDragging: true,
    centerOnLoad: true,
  },
};

export const CategorizedIslands: Story = {
  args: {
    islands: mockIslands,
    connections: mockConnections.filter(conn => 
      (mockIslands.find(i => i.id === conn.from)?.category === 'analytics' && 
       mockIslands.find(i => i.id === conn.to)?.category === 'analytics') ||
      (mockIslands.find(i => i.id === conn.from)?.category === 'productivity' && 
       mockIslands.find(i => i.id === conn.to)?.category === 'productivity')
    ),
    showMinimap: true,
    showConnections: true,
    showGrid: true,
    showStats: true,
    enableDragging: true,
    centerOnLoad: true,
  },
};

export const LargeScale: Story = {
  args: {
    islands: [
      ...largeIslands,
      {
        id: 'monitoring',
        x: 150,
        y: 800,
        width: 300,
        height: 180,
        category: 'system',
        content: <div className="glass-p-4"><h3 className="glass-text-primary/90">System Monitoring</h3></div>
      },
      {
        id: 'logs',
        x: 600,
        y: 750,
        width: 250,
        height: 160,
        category: 'system',
        content: <div className="glass-p-4"><h3 className="glass-text-primary/90">Log Viewer</h3></div>
      }
    ],
    connections: [
      ...mockConnections,
      {
        from: 'monitoring',
        to: 'logs',
        type: 'solid',
        color: '#ec4899',
        strength: 0.9
      }
    ],
    showMinimap: true,
    showConnections: true,
    showGrid: true,
    showStats: true,
    enablePhysics: true,
    enableDragging: true,
    enableZooming: true,
    zoomLevel: 0.7,
    centerOnLoad: true,
  },
};

export const PerformanceTest: Story = {
  args: {
    islands: Array.from({ length: 20 }, (_, i) => ({
      id: `island-${i}`,
      x: 100 + (i % 5) * 200,
      y: 100 + Math.floor(i / 5) * 150,
      width: 180,
      height: 120,
      category: i % 2 === 0 ? 'system' : 'data',
      content: (
        <div className="glass-p-4">
          <h4 className="glass-text-primary/90">Island {i + 1}</h4>
          <p className="glass-text-primary/60 glass-text-sm">Test content</p>
        </div>
      )
    })),
    showMinimap: true,
    showConnections: true,
    showGrid: true,
    showStats: true,
    enablePhysics: false,
    enableDragging: true,
    enableZooming: true,
    zoomLevel: 0.5,
    centerOnLoad: true,
  },
};
