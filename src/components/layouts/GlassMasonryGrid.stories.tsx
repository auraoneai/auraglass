import type { Meta, StoryObj } from '@storybook/react';
import { GlassMasonryGrid, type MasonryItem } from './GlassMasonryGrid';

import { cn } from '../../lib/utils';
// Generate mock items with varying heights and content
const generateMockItems = (count: number): MasonryItem[] => {
  const categories = ['photos', 'quotes', 'articles', 'videos', 'recipes'];
  const colors = ['from-red-400 to-pink-600', 'from-blue-400 to-purple-600', 'from-green-400 to-teal-600', 'from-yellow-400 to-orange-600', 'from-purple-400 to-indigo-600'];

  return Array.from({ length: count }, (_, i) => {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const height = 150 + Math.random() * 250;
    const color = colors[Math.floor(Math.random() * colors.length)];

    return {
      id: `item-${i + 1}`,
      height,
      category,
      priority: Math.floor(Math.random() * 5),
      content: (
        <div className={`h-full w-full bg-gradient-to-br ${color} rounded-lg flex items-center justify-center text-white relative overflow-hidden`}>
          <div className="glass-absolute glass-inset-0 glass-surface-dark/20" />
          <div className="glass-relative glass-z-10 glass-text-center glass-p-4">
            <h4 className="glass-font-semibold glass-mb-2">{category.charAt(0).toUpperCase() + category.slice(1)} {i + 1}</h4>
            <p className="glass-text-sm glass-opacity-90">
              {category === 'photos' && 'Beautiful landscape photography'}
              {category === 'quotes' && '"Every moment is a fresh beginning."'}
              {category === 'articles' && 'Interesting article about technology and innovation in modern world.'}
              {category === 'videos' && 'Watch this amazing video content'}
              {category === 'recipes' && 'Delicious recipe for home cooking'}
            </p>
            <div className="mt-2 glass-text-xs opacity-75">
              Priority: {Math.floor(Math.random() * 5)} • {Math.floor(height)}px
            </div>
          </div>
        </div>
      ),
      metadata: {
        author: `User ${Math.floor(Math.random() * 100)}`,
        likes: Math.floor(Math.random() * 1000),
        views: Math.floor(Math.random() * 5000),
      }
    };
  });
};

const mockItems = generateMockItems(24);
const smallMockItems = generateMockItems(8);
const largeMockItems = generateMockItems(50);

const meta = {
  title: 'Glass UI/Layouts/GlassMasonryGrid',
  component: GlassMasonryGrid,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    showControls: {
      control: 'boolean',
    },
    showFilters: {
      control: 'boolean',
    },
    showStats: {
      control: 'boolean',
    },
    enableVirtualization: {
      control: 'boolean',
    },
    enableInfiniteScroll: {
      control: 'boolean',
    },
    enableDragReorder: {
      control: 'boolean',
    },
    enableSearch: {
      control: 'boolean',
    },
    sortBy: {
      control: { type: 'select', options: ['id', 'height', 'priority', 'category'] },
    },
    sortOrder: {
      control: { type: 'select', options: ['asc', 'desc'] },
    },
    loadingItems: {
      control: { type: 'range', min: 0, max: 10, step: 1 },
    },
  },
} satisfies Meta<typeof GlassMasonryGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: mockItems,
    showControls: true,
    showFilters: true,
    showStats: true,
    enableVirtualization: false,
    enableInfiniteScroll: false,
    enableDragReorder: false,
    enableSearch: true,
    sortBy: 'id',
    sortOrder: 'asc',
    loadingItems: 0,
    config: {
      columns: 'auto',
      gap: 16,
      minItemWidth: 200,
      maxItemWidth: 400,
      itemPadding: 12,
      autoResize: true,
      animationDelay: 0.05,
      breakpoints: {
        1200: 4,
        900: 3,
        600: 2,
        400: 1
      }
    },
  },
};

export const FixedColumns: Story = {
  args: {
    items: mockItems,
    showControls: true,
    showFilters: true,
    showStats: true,
    config: {
      columns: 3,
      gap: 20,
      minItemWidth: 250,
      itemPadding: 16,
    },
  },
};

export const DenseLayout: Story = {
  args: {
    items: largeMockItems,
    showControls: true,
    showFilters: true,
    showStats: true,
    config: {
      columns: 5,
      gap: 8,
      minItemWidth: 150,
      maxItemWidth: 200,
      itemPadding: 8,
      animationDelay: 0.02,
    },
  },
};

export const WideLayout: Story = {
  args: {
    items: smallMockItems,
    showControls: true,
    showFilters: true,
    showStats: true,
    config: {
      columns: 2,
      gap: 24,
      minItemWidth: 300,
      maxItemWidth: 500,
      itemPadding: 20,
    },
  },
};

export const Virtualized: Story = {
  args: {
    items: largeMockItems,
    showControls: true,
    showFilters: true,
    showStats: true,
    enableVirtualization: true,
    config: {
      columns: 'auto',
      gap: 16,
      minItemWidth: 200,
      animationDelay: 0.01,
    },
  },
};

export const InfiniteScroll: Story = {
  args: {
    items: mockItems,
    showControls: true,
    showFilters: true,
    showStats: true,
    enableInfiniteScroll: true,
    loadingItems: 3,
    config: {
      columns: 'auto',
      gap: 16,
      minItemWidth: 220,
    },
  },
};

export const DragAndDrop: Story = {
  args: {
    items: smallMockItems,
    showControls: true,
    showFilters: false,
    showStats: true,
    enableDragReorder: true,
    config: {
      columns: 3,
      gap: 20,
      minItemWidth: 200,
      itemPadding: 16,
    },
  },
};

export const FilterableGrid: Story = {
  args: {
    items: mockItems,
    showControls: true,
    showFilters: true,
    showStats: true,
    enableSearch: true,
    filterBy: 'photos',
    config: {
      columns: 'auto',
      gap: 16,
      minItemWidth: 200,
    },
  },
};

export const SortedByHeight: Story = {
  args: {
    items: mockItems,
    showControls: true,
    showFilters: true,
    showStats: true,
    sortBy: 'height',
    sortOrder: 'desc',
    config: {
      columns: 4,
      gap: 16,
      minItemWidth: 180,
    },
  },
};

export const SortedByPriority: Story = {
  args: {
    items: mockItems,
    showControls: true,
    showFilters: true,
    showStats: true,
    sortBy: 'priority',
    sortOrder: 'desc',
    config: {
      columns: 'auto',
      gap: 16,
      minItemWidth: 200,
    },
  },
};

export const SortedByCategory: Story = {
  args: {
    items: mockItems,
    showControls: true,
    showFilters: true,
    showStats: true,
    sortBy: 'category',
    sortOrder: 'asc',
    config: {
      columns: 'auto',
      gap: 16,
      minItemWidth: 200,
    },
  },
};

export const MinimalInterface: Story = {
  args: {
    items: smallMockItems,
    showControls: false,
    showFilters: false,
    showStats: false,
    enableSearch: false,
    config: {
      columns: 'auto',
      gap: 16,
      minItemWidth: 200,
      animationDelay: 0.08,
    },
  },
};

export const ResponsiveBreakpoints: Story = {
  args: {
    items: mockItems,
    showControls: true,
    showFilters: true,
    showStats: true,
    config: {
      columns: 'auto',
      gap: 16,
      minItemWidth: 200,
      breakpoints: {
        1400: 6,
        1200: 5,
        1000: 4,
        800: 3,
        600: 2,
        400: 1
      }
    },
  },
};

export const LargeGaps: Story = {
  args: {
    items: smallMockItems,
    showControls: true,
    showStats: true,
    config: {
      columns: 3,
      gap: 32,
      minItemWidth: 200,
      itemPadding: 20,
    },
  },
};

export const SmallGaps: Story = {
  args: {
    items: mockItems,
    showControls: true,
    showStats: true,
    config: {
      columns: 5,
      gap: 4,
      minItemWidth: 150,
      itemPadding: 8,
    },
  },
};

export const SlowAnimation: Story = {
  args: {
    items: smallMockItems,
    showControls: true,
    showStats: true,
    config: {
      columns: 3,
      gap: 16,
      minItemWidth: 200,
      animationDelay: 0.2,
    },
  },
};

export const FastAnimation: Story = {
  args: {
    items: mockItems,
    showControls: true,
    showStats: true,
    config: {
      columns: 'auto',
      gap: 16,
      minItemWidth: 200,
      animationDelay: 0.01,
    },
  },
};

export const NoAnimation: Story = {
  args: {
    items: mockItems,
    showControls: true,
    showStats: true,
    config: {
      columns: 'auto',
      gap: 16,
      minItemWidth: 200,
      animationDelay: 0,
    },
  },
};

export const SearchEnabled: Story = {
  args: {
    items: mockItems,
    showControls: true,
    showFilters: true,
    showStats: true,
    enableSearch: true,
    config: {
      columns: 'auto',
      gap: 16,
      minItemWidth: 200,
    },
  },
};

export const PhotosOnly: Story = {
  args: {
    items: mockItems.filter(item => item.category === 'photos'),
    showControls: true,
    showFilters: false,
    showStats: true,
    config: {
      columns: 'auto',
      gap: 16,
      minItemWidth: 250,
      maxItemWidth: 350,
    },
  },
};

export const QuotesOnly: Story = {
  args: {
    items: mockItems.filter(item => item.category === 'quotes'),
    showControls: true,
    showFilters: false,
    showStats: true,
    config: {
      columns: 2,
      gap: 20,
      minItemWidth: 300,
      itemPadding: 20,
    },
  },
};

export const AllFeatures: Story = {
  args: {
    items: mockItems,
    showControls: true,
    showFilters: true,
    showStats: true,
    enableVirtualization: true,
    enableInfiniteScroll: true,
    enableDragReorder: true,
    enableSearch: true,
    loadingItems: 2,
    config: {
      columns: 'auto',
      gap: 16,
      minItemWidth: 200,
      maxItemWidth: 300,
      itemPadding: 12,
      autoResize: true,
      animationDelay: 0.05,
    },
  },
};

export const LoadingState: Story = {
  args: {
    items: smallMockItems,
    showControls: true,
    showStats: true,
    loadingItems: 6,
    config: {
      columns: 'auto',
      gap: 16,
      minItemWidth: 200,
    },
  },
};

export const EmptyState: Story = {
  args: {
    items: [],
    showControls: true,
    showFilters: true,
    showStats: true,
    enableSearch: true,
    config: {
      columns: 'auto',
      gap: 16,
      minItemWidth: 200,
    },
  },
};

export const SingleColumn: Story = {
  args: {
    items: smallMockItems,
    showControls: true,
    showStats: true,
    config: {
      columns: 1,
      gap: 16,
      minItemWidth: 400,
      maxItemWidth: 600,
      itemPadding: 20,
    },
  },
};

export const ManyColumns: Story = {
  args: {
    items: largeMockItems,
    showControls: true,
    showStats: true,
    config: {
      columns: 8,
      gap: 8,
      minItemWidth: 120,
      maxItemWidth: 150,
      itemPadding: 8,
      animationDelay: 0.01,
    },
  },
};