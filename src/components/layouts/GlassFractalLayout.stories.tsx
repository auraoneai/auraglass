import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import {
    Bell,
    Code,
    Cpu,
    Database,
    File,
    Folder,
    Globe,
    HardDrive,
    Heart,
    Home,
    Mail,
    Search,
    Server,
    Settings,
    Share,
    User
} from 'lucide-react';
import { GlassFractalLayout, type FractalNode } from './GlassFractalLayout';

// Simple tree structure
const simpleTree: FractalNode[] = [
  {
    id: 'root',
    content: <Home size={16} />,
    children: [
      {
        id: 'branch1',
        content: <User size={14} />,
        children: [
          { id: 'leaf1', content: <Mail size={12} /> },
          { id: 'leaf2', content: <Bell size={12} /> }
        ]
      },
      {
        id: 'branch2',
        content: <Settings size={14} />,
        children: [
          { id: 'leaf3', content: <Search size={12} /> },
          { id: 'leaf4', content: <Heart size={12} /> }
        ]
      }
    ]
  }
];

// Complex hierarchical structure
const fileSystem: FractalNode[] = [
  {
    id: 'project',
    content: <Folder size={16} />,
    children: [
      {
        id: 'src',
        content: <Folder size={14} />,
        children: [
          {
            id: 'components',
            content: <Folder size={12} />,
            children: [
              { id: 'button.tsx', content: <Code size={10} /> },
              { id: 'modal.tsx', content: <Code size={10} /> },
              { id: 'input.tsx', content: <Code size={10} /> }
            ]
          },
          {
            id: 'utils',
            content: <Folder size={12} />,
            children: [
              { id: 'helpers.ts', content: <File size={10} /> },
              { id: 'constants.ts', content: <File size={10} /> }
            ]
          }
        ]
      },
      {
        id: 'public',
        content: <Folder size={14} />,
        children: [
          { id: 'index.html', content: <Globe size={12} /> },
          { id: 'favicon.ico', content: <Share size={12} /> }
        ]
      },
      {
        id: 'config',
        content: <Folder size={14} />,
        children: [
          { id: 'webpack.config.js', content: <Settings size={12} /> },
          { id: 'package.json', content: <File size={12} /> }
        ]
      }
    ]
  }
];

// Network topology
const networkTopology: FractalNode[] = [
  {
    id: 'datacenter',
    content: <Server size={16} />,
    children: [
      {
        id: 'cluster1',
        content: <Cpu size={14} />,
        children: [
          { id: 'node1', content: <HardDrive size={12} /> },
          { id: 'node2', content: <HardDrive size={12} /> },
          { id: 'node3', content: <HardDrive size={12} /> }
        ]
      },
      {
        id: 'cluster2',
        content: <Cpu size={14} />,
        children: [
          { id: 'node4', content: <HardDrive size={12} /> },
          { id: 'node5', content: <HardDrive size={12} /> }
        ]
      },
      {
        id: 'database',
        content: <Database size={14} />,
        children: [
          { id: 'primary', content: <Database size={12} /> },
          { id: 'replica1', content: <Database size={12} /> },
          { id: 'replica2', content: <Database size={12} /> }
        ]
      }
    ]
  }
];

// Organizational chart
const orgChart: FractalNode[] = [
  {
    id: 'ceo',
    content: <div className="glass-text-xs glass-font-bold">CEO</div>,
    children: [
      {
        id: 'cto',
        content: <div className="glass-text-xs">CTO</div>,
        children: [
          { id: 'dev1', content: <div className="glass-text-xs">Dev</div> },
          { id: 'dev2', content: <div className="glass-text-xs">Dev</div> },
          { id: 'dev3', content: <div className="glass-text-xs">Dev</div> }
        ]
      },
      {
        id: 'cfo',
        content: <div className="glass-text-xs">CFO</div>,
        children: [
          { id: 'acc1', content: <div className="glass-text-xs">Acc</div> },
          { id: 'acc2', content: <div className="glass-text-xs">Acc</div> }
        ]
      },
      {
        id: 'cmo',
        content: <div className="glass-text-xs">CMO</div>,
        children: [
          { id: 'mark1', content: <div className="glass-text-xs">Mkt</div> },
          { id: 'mark2', content: <div className="glass-text-xs">Mkt</div> },
          { id: 'mark3', content: <div className="glass-text-xs">Mkt</div> },
          { id: 'mark4', content: <div className="glass-text-xs">Mkt</div> }
        ]
      }
    ]
  }
];

// Mathematical pattern nodes
const mathNodes: FractalNode[] = [
  {
    id: 'center',
    content: <div className="glass-w-4 glass-h-4 glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-full" />,
    children: Array.from({ length: 8 }, (_, i) => ({
      id: `ring1-${i}`,
      content: <div className="glass-w-3 glass-h-3 glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-full" />,
      children: Array.from({ length: 3 }, (_, j) => ({
        id: `ring2-${i}-${j}`,
        content: <div className="glass-w-2 glass-h-2 glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-full" />
      }))
    }))
  }
];

const meta = {
  title: 'Surfaces/App Shells + Layout/Glass Fractal Layout',
  component: GlassFractalLayout,
  parameters: {
    layout: 'fullscreen',
    previewSurface: 'app',
  },
  decorators: [
    (Story) => (
      <div
        className="glass-flex glass-h-screen glass-w-full glass-items-start glass-justify-center glass-overflow-auto glass-p-8"
        style={{ boxSizing: 'border-box' }}
      >
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {
    maxDepth: {
      control: { type: 'range', min: 1, max: 10, step: 1 },
    },
    fractalType: {
      control: { type: 'select' },
      options: ['sierpinski', 'mandelbrot', 'julia', 'tree', 'spiral', 'custom'],
    },
    scaleFactor: {
      control: { type: 'range', min: 0.3, max: 0.9, step: 0.05 },
    },
    branchAngle: {
      control: { type: 'range', min: 10, max: 90, step: 5 },
    },
    initialScale: {
      control: { type: 'range', min: 0.5, max: 2, step: 0.1 },
    },
    zoomLevel: {
      control: { type: 'range', min: 0.1, max: 3, step: 0.1 },
    },
    recursive: {
      control: 'boolean',
    },
    animateGrowth: {
      control: 'boolean',
    },
    centerNode: {
      control: 'boolean',
    },
    interactiveZoom: {
      control: 'boolean',
    },
    soundEnabled: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof GlassFractalLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    nodes: simpleTree,
    maxDepth: 3,
    fractalType: 'tree',
    scaleFactor: 0.618,
    branchAngle: 30,
    initialScale: 1,
    recursive: true,
    animateGrowth: true,
    zoomLevel: 1,
    centerNode: true,
    interactiveZoom: true,
    soundEnabled: true,
  },
};

export const TreePattern: Story = {
  args: {
    nodes: simpleTree,
    maxDepth: 4,
    fractalType: 'tree',
    scaleFactor: 0.7,
    branchAngle: 45,
    animateGrowth: true,
  },
};

export const SpiralPattern: Story = {
  args: {
    nodes: mathNodes,
    maxDepth: 3,
    fractalType: 'spiral',
    scaleFactor: 0.8,
    animateGrowth: true,
  },
};

export const SierpinskiTriangle: Story = {
  args: {
    nodes: mathNodes,
    maxDepth: 4,
    fractalType: 'sierpinski',
    scaleFactor: 0.5,
    animateGrowth: true,
  },
};

export const MandelbrotSet: Story = {
  args: {
    nodes: mathNodes,
    maxDepth: 3,
    fractalType: 'mandelbrot',
    scaleFactor: 0.6,
    animateGrowth: true,
  },
};

export const FileSystemHierarchy: Story = {
  args: {
    nodes: fileSystem,
    maxDepth: 4,
    fractalType: 'tree',
    scaleFactor: 0.75,
    branchAngle: 25,
    initialScale: 0.8,
    animateGrowth: true,
  },
};

export const NetworkTopology: Story = {
  args: {
    nodes: networkTopology,
    maxDepth: 3,
    fractalType: 'tree',
    scaleFactor: 0.8,
    branchAngle: 40,
    initialScale: 1.2,
    animateGrowth: true,
  },
};

export const OrganizationalChart: Story = {
  args: {
    nodes: orgChart,
    maxDepth: 3,
    fractalType: 'tree',
    scaleFactor: 0.85,
    branchAngle: 35,
    initialScale: 0.9,
    animateGrowth: true,
  },
};

export const WideAngleBranches: Story = {
  args: {
    nodes: simpleTree,
    maxDepth: 3,
    fractalType: 'tree',
    branchAngle: 60,
    scaleFactor: 0.7,
    animateGrowth: true,
  },
};

export const NarrowAngleBranches: Story = {
  args: {
    nodes: simpleTree,
    maxDepth: 4,
    fractalType: 'tree',
    branchAngle: 15,
    scaleFactor: 0.8,
    animateGrowth: true,
  },
};

export const LargeScale: Story = {
  args: {
    nodes: simpleTree,
    maxDepth: 3,
    fractalType: 'tree',
    scaleFactor: 0.9,
    initialScale: 1.5,
    animateGrowth: true,
  },
};

export const SmallScale: Story = {
  args: {
    nodes: fileSystem,
    maxDepth: 4,
    fractalType: 'tree',
    scaleFactor: 0.4,
    initialScale: 0.6,
    animateGrowth: true,
  },
};

export const DeepHierarchy: Story = {
  args: {
    nodes: simpleTree,
    maxDepth: 6,
    fractalType: 'tree',
    scaleFactor: 0.6,
    branchAngle: 25,
    animateGrowth: true,
  },
};

export const ShallowHierarchy: Story = {
  args: {
    nodes: orgChart,
    maxDepth: 2,
    fractalType: 'tree',
    scaleFactor: 0.8,
    branchAngle: 45,
    animateGrowth: true,
  },
};

export const NoAnimation: Story = {
  args: {
    nodes: simpleTree,
    maxDepth: 3,
    fractalType: 'tree',
    animateGrowth: false,
  },
};

export const NoRecursion: Story = {
  args: {
    nodes: simpleTree,
    maxDepth: 3,
    fractalType: 'tree',
    recursive: false,
    animateGrowth: true,
  },
};

export const OffCenter: Story = {
  args: {
    nodes: simpleTree,
    maxDepth: 3,
    fractalType: 'tree',
    centerNode: false,
    animateGrowth: true,
  },
};

export const NoInteractiveZoom: Story = {
  args: {
    nodes: simpleTree,
    maxDepth: 3,
    fractalType: 'tree',
    interactiveZoom: false,
    animateGrowth: true,
  },
};

export const ZoomedIn: Story = {
  args: {
    nodes: fileSystem,
    maxDepth: 4,
    fractalType: 'tree',
    zoomLevel: 1.5,
    animateGrowth: true,
  },
};

export const ZoomedOut: Story = {
  args: {
    nodes: networkTopology,
    maxDepth: 3,
    fractalType: 'tree',
    zoomLevel: 0.7,
    animateGrowth: true,
  },
};

export const GoldenRatio: Story = {
  args: {
    nodes: mathNodes,
    maxDepth: 4,
    fractalType: 'spiral',
    scaleFactor: 0.618, // Golden ratio
    animateGrowth: true,
  },
};

export const CustomGlass: Story = {
  args: {
    nodes: simpleTree,
    maxDepth: 3,
    fractalType: 'tree',
    animateGrowth: true,
    glassConfig: {
      blur: 25,
      opacity: 0.7,
      saturation: 1.3,
      brightness: 1.2,
      contrast: 1.1
    }
  },
};

export const MinimalGlass: Story = {
  args: {
    nodes: simpleTree,
    maxDepth: 3,
    fractalType: 'tree',
    animateGrowth: true,
    glassConfig: {
      blur: 5,
      opacity: 0.95,
      saturation: 1.0,
      brightness: 1.0,
      contrast: 1.0
    }
  },
};

export const InteractiveDemo: Story = {
  args: {
    nodes: fileSystem,
    maxDepth: 4,
    fractalType: 'tree',
    scaleFactor: 0.7,
    branchAngle: 30,
    animateGrowth: true,
    interactiveZoom: true,
    onNodeClick: fn(),
    onNodeHover: fn(),
  },
};
