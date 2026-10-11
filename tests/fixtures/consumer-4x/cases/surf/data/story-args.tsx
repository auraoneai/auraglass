/* Frozen 4.x story props for the W2 (data + date) compat adapters —
   REQ-SURF-13. Copied from the named release/4.x story files (645735fce):
   meta `args` merged with the Default story's args / explicit props. Class
   names, styles and story frames are omitted; `new Date()` story values are
   pinned to fixed instants so the test is deterministic; `fn()` callbacks
   are injected by the test. */
import * as React from 'react';
import type { StoryArgs } from '../app-shell/story-args';

const NOW = new Date(2026, 9, 7, 12, 0, 0);

export const W2_STORY_ARGS: Record<string, StoryArgs> = {
  GlassDataTable: {
    story: 'src/components/data-display/GlassDataTable.stories.tsx (meta args)',
    props: {
      className: '',
      variant: 'default',
      size: 'md',
      sortable: true,
      filterable: true,
      searchable: true,
      pagination: true,
      initialPageSize: 2,
      data: [
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Developer', status: 'Active' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Designer', status: 'Active' },
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Manager', status: 'Inactive' },
      ],
      columns: [
        { header: 'Name', accessorKey: 'name', sortable: true },
        { header: 'Email', accessorKey: 'email', sortable: true },
        { header: 'Role', accessorKey: 'role', filterable: true },
        { header: 'Status', accessorKey: 'status', filterable: true },
      ],
    },
    expectText: ['Name', 'Email', 'John Doe', 'Jane Smith'],
  },
  GlassDataGrid: {
    story: 'src/components/data-display/GlassDataGrid.stories.tsx (meta args)',
    props: {
      className: '',
      sortable: true,
      height: '400px',
      enableRowDragging: false,
      data: [
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Developer' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Designer' },
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Manager' },
      ],
      columns: [
        { key: 'name', label: 'Name', sortable: true },
        { key: 'email', label: 'Email', sortable: true },
        { key: 'role', label: 'Role', sortable: false },
      ],
    },
    expectText: ['Name', 'Role', 'Bob Johnson', 'Designer'],
  },
  GlassVirtualTable: {
    story: 'src/components/data-display/GlassVirtualTable.stories.tsx (meta args)',
    props: {
      className: '',
      disabled: false,
      searchable: false,
      pagination: false,
      columns: [
        { id: 'name', header: 'Name', accessorKey: 'name' },
        { id: 'status', header: 'Status', accessorKey: 'status' },
        { id: 'updated', header: 'Updated', accessorKey: 'updated' },
      ],
      rows: [
        { id: 'aurora', name: 'Aurora workspace', status: 'Ready', updated: '2 min ago' },
        { id: 'meridian', name: 'Meridian research', status: 'Review', updated: '18 min ago' },
        { id: 'foundry', name: 'Foundry systems', status: 'Ready', updated: '1 hr ago' },
        { id: 'helios', name: 'Helios launch', status: 'Draft', updated: 'Yesterday' },
      ],
    },
    expectText: ['Name', 'Status', 'Updated'],
  },
  GlassVirtualList: {
    story: 'src/components/interactive/GlassVirtualList.stories.tsx (meta args + Default)',
    props: {
      className: '',
      height: 300,
      itemHeight: 50,
      smoothScroll: true,
      items: Array.from({ length: 100 }, (_, i) => ({
        id: `item-${i}`,
        height: 50,
        component: ({ index }: { index: number }) => <div>Item {index + 1}</div>,
        props: { index: i },
      })),
    },
  },
  GlassTreeView: {
    story: 'src/components/data-display/GlassTreeView.stories.tsx (Default)',
    props: {
      data: [
        { id: 'overview', label: 'Overview', children: [{ id: 'metrics', label: 'Metrics' }] },
        { id: 'settings', label: 'Settings', children: [{ id: 'tokens', label: 'Tokens' }] },
      ],
      defaultExpandedIds: ['overview'],
      selectionMode: 'single',
      showLines: true,
      showIcons: true,
    },
    expectText: ['Overview', 'Metrics', 'Settings'],
  },
  TreeView: {
    story: 'src/components/tree-view/TreeView.stories.tsx (Default; static <TreeItem> children → the 4.x `items` prop)',
    props: {
      className: '',
      expandedIds: ['workspace', 'components'],
      selectedIds: ['charts'],
      showIcons: true,
      showLines: true,
      items: [
        {
          id: 'workspace',
          label: 'AuraGlass workspace',
          children: [
            { id: 'tokens', label: 'Design tokens' },
            { id: 'components', label: 'Components', children: [{ id: 'buttons', label: 'Buttons' }, { id: 'charts', label: 'Charts' }] },
          ],
        },
      ],
    },
    expectText: ['AuraGlass workspace', 'Components', 'Charts'],
  },
  GlassFileTree: {
    story: 'src/components/interactive/GlassFileTree.stories.tsx (meta args; modifiedAt pinned)',
    props: {
      nodes: [
        {
          id: '1', name: 'src', type: 'folder', path: '/src', level: 0, canExpand: true, isExpanded: true,
          children: [
            {
              id: '2', name: 'components', type: 'folder', path: '/src/components', level: 1, canExpand: true, isExpanded: false,
              children: [
                { id: '3', name: 'Button.tsx', type: 'file', path: '/src/components/Button.tsx', size: 2048, modifiedAt: NOW, extension: 'tsx', level: 2 },
                { id: '4', name: 'Input.tsx', type: 'file', path: '/src/components/Input.tsx', size: 1536, modifiedAt: NOW, extension: 'tsx', level: 2 },
              ],
            },
            { id: '5', name: 'utils.ts', type: 'file', path: '/src/utils.ts', size: 1024, modifiedAt: NOW, extension: 'ts', level: 1 },
          ],
        },
        { id: '6', name: 'package.json', type: 'file', path: '/package.json', size: 512, modifiedAt: NOW, extension: 'json', level: 0 },
      ],
    },
    expectText: ['src', 'components', 'utils.ts', 'package.json'],
  },
  GlassFileExplorer: {
    story: 'src/components/interactive/GlassFileExplorer.stories.tsx (meta args; dates pinned)',
    props: {
      currentPath: '/home/user',
      files: [
        { id: '1', name: 'Documents', type: 'folder', size: 0, modifiedAt: NOW, createdAt: NOW, path: '/home/user/Documents' },
        { id: '2', name: 'image.jpg', type: 'file', size: 2048000, modifiedAt: NOW, createdAt: NOW, extension: 'jpg', mimeType: 'image/jpeg', path: '/home/user/image.jpg' },
        { id: '3', name: 'script.js', type: 'file', size: 1024, modifiedAt: NOW, createdAt: NOW, extension: 'js', mimeType: 'application/javascript', path: '/home/user/script.js' },
      ],
      viewMode: 'list',
      showToolbar: true,
      showBreadcrumb: true,
      showSearch: true,
      variant: 'default',
    },
    expectText: ['Documents', 'image.jpg', 'script.js'],
  },
  GlassFilterBar: {
    story: 'src/components/interactive/GlassFilterBar.stories.tsx (meta args)',
    props: {
      label: 'Active filters',
      filters: [
        { id: 'status', label: 'Status', value: 'Open' },
        { id: 'owner', label: 'Owner', value: 'Design' },
        { id: 'period', label: 'Period', value: 'This week' },
      ],
      onClear: () => undefined,
    },
    expectText: ['Status', 'Open', 'Owner', 'Design'],
  },
  GlassStatCard: {
    story: 'src/components/dashboard/GlassStatCard.stories.tsx (meta args)',
    props: {
      title: 'Total Revenue', value: '$45,231', unit: '', description: 'Monthly recurring revenue', type: 'revenue',
      variant: 'default', size: 'md', layout: 'vertical', showSparkline: false, loading: false,
    },
    expectText: ['Total Revenue', '$45,231', 'Monthly recurring revenue'],
  },
  GlassKPICard: {
    story: 'src/components/dashboard/GlassKPICard.stories.tsx (meta args)',
    props: { variant: 'default', size: 'md', title: 'Revenue', value: '$125,430', trend: 'up', trendPercentage: 12.5 },
    expectText: ['Revenue', '$125,430', '12.5%'],
  },
  GlassMetricCard: {
    story: 'src/components/dashboard/GlassMetricCard.stories.tsx (meta args)',
    props: { variant: 'default', size: 'md', title: 'Active Users', value: '1,234', trend: { value: 8.2, label: 'vs last month', direction: 'up' } },
    expectText: ['Active Users', '1,234', '8.2%', 'vs last month'],
  },
  GlassAnimatedNumber: {
    story: 'src/components/data-display/GlassAnimatedNumber.stories.tsx (meta args)',
    props: { value: 1234, from: 0, duration: 2000, decimals: 0, separator: true, size: 'lg', variant: 'count' },
    expectText: ['1,234'],
  },
  GlassSparkline: {
    story: 'src/components/data-display/GlassSparkline.stories.tsx (Default)',
    props: { data: [10, 15, 8, 20, 12, 18, 25, 16, 22, 19], width: 220, height: 60 },
  },
  GlassTimeline: {
    story: 'src/components/data-display/GlassTimeline.stories.tsx (Default)',
    props: {
      items: [
        { id: '1', title: 'Project Started', subtitle: 'Initial setup completed', time: '2 hours ago' },
        { id: '2', title: 'First Milestone', subtitle: 'Core features implemented', time: '1 hour ago' },
        { id: '3', title: 'Testing Phase', subtitle: 'Bug fixes and optimizations', time: '30 min ago' },
      ],
    },
    expectText: ['Project Started', 'Initial setup completed', 'Testing Phase'],
  },
  GlassActivityFeed: {
    story: 'src/components/dashboard/GlassActivityFeed.stories.tsx (meta args; timestamps pinned)',
    props: {
      title: 'Recent Activity',
      subtitle: 'Latest updates and events',
      maxItems: 10,
      showFilters: true,
      compact: false,
      activities: [
        { id: '1', type: 'user', title: 'User logged in', description: 'John Doe logged into the system', timestamp: NOW, user: { name: 'John Doe', id: 'user-1' } },
        { id: '2', type: 'success', title: 'Task completed', description: 'Database backup completed successfully', timestamp: new Date(NOW.getTime() - 3600000) },
        { id: '3', type: 'warning', title: 'High CPU usage', description: 'Server CPU usage above 80%', timestamp: new Date(NOW.getTime() - 7200000) },
      ],
    },
    expectText: ['User logged in', 'Task completed', 'High CPU usage', 'John Doe'],
  },
  GlassChip: {
    story: 'src/components/data-display/GlassChip.stories.tsx (meta args)',
    props: { children: 'Enterprise', variant: 'primary', size: 'md' },
    expectText: ['Enterprise'],
  },
  GlassKeyValueEditor: {
    story: 'src/components/interactive/GlassKeyValueEditor.stories.tsx (meta args)',
    props: {
      value: [
        { key: 'name', value: 'John Doe' },
        { key: 'email', value: 'john@example.com' },
        { key: 'role', value: 'developer' },
      ],
    },
  },
  GlassDateField: {
    story: 'src/components/input/GlassDateField.stories.tsx (meta args)',
    props: { label: 'Launch date', defaultValue: '2026-09-18', helperText: 'Dates use your current workspace time zone.', fullWidth: true },
    expectText: ['Launch date', 'Dates use your current workspace time zone.'],
  },
  GlassTimeField: {
    story: 'src/components/input/GlassTimeField.stories.tsx (meta args)',
    props: { label: 'Publish time', defaultValue: '09:30', helperText: 'Pacific Time (UTC−07:00)', fullWidth: true },
    expectText: ['Publish time', 'Pacific Time (UTC−07:00)'],
  },
  GlassDatePicker: {
    story: 'src/components/input/GlassDatePicker.stories.tsx (meta args)',
    props: {
      placeholder: 'Select launch date',
      helperText: 'Dates outside the current planning window are disabled.',
      showTodayButton: true,
      showClearButton: true,
      value: null,
    },
    expectText: ['Select launch date', 'Dates outside the current planning window are disabled.'],
  },
  GlassDateRangePicker: {
    story: 'src/components/input/GlassDateRangePicker.stories.tsx (meta args)',
    props: {
      placeholder: 'Select reporting range',
      showClear: true,
      presets: [
        { label: 'Next 14 days', getValue: () => ({ from: new Date(2026, 4, 1), to: new Date(2026, 4, 14) }) },
        { label: 'Launch month', getValue: () => ({ from: new Date(2026, 4, 1), to: new Date(2026, 4, 31) }) },
      ],
    },
    expectText: ['Select reporting range'],
  },
  GlassCalendar: {
    story: 'src/components/calendar/GlassCalendar.stories.tsx (meta args; selectedDate pinned)',
    props: {
      selectedDate: NOW,
      view: 'month',
      showEvents: true,
      showToday: true,
      showWeekends: true,
      dateFormat: 'short',
      loading: false,
      events: [{ id: 'e1', title: 'Launch review', date: NOW, type: 'meeting' }],
    },
  },
};
