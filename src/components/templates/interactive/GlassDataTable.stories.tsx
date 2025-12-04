import type { Meta, StoryObj } from '@storybook/react';
import { GlassDataTable } from './GlassDataTable';
import React from 'react';

const meta: Meta<typeof GlassDataTable> = {
  title: 'Templates/Interactive/GlassDataTable',
  component: GlassDataTable,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A comprehensive data table component with sorting, filtering, pagination, and loading states.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof GlassDataTable>;

// Sample data for the stories
const sampleUsers = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', status: 'Active', joinDate: '2023-01-15', projects: 12 },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'Developer', status: 'Active', joinDate: '2023-03-22', projects: 8 },
  { id: 3, name: 'Carol Brown', email: 'carol@example.com', role: 'Designer', status: 'Inactive', joinDate: '2022-11-08', projects: 15 },
  { id: 4, name: 'David Wilson', email: 'david@example.com', role: 'Manager', status: 'Active', joinDate: '2022-09-12', projects: 23 },
  { id: 5, name: 'Eva Davis', email: 'eva@example.com', role: 'Developer', status: 'Active', joinDate: '2023-05-03', projects: 6 },
  { id: 6, name: 'Frank Miller', email: 'frank@example.com', role: 'Designer', status: 'Active', joinDate: '2023-02-18', projects: 11 },
  { id: 7, name: 'Grace Lee', email: 'grace@example.com', role: 'Developer', status: 'Inactive', joinDate: '2022-12-01', projects: 9 },
  { id: 8, name: 'Henry Taylor', email: 'henry@example.com', role: 'Admin', status: 'Active', joinDate: '2022-10-15', projects: 18 },
  { id: 9, name: 'Iris Chen', email: 'iris@example.com', role: 'Manager', status: 'Active', joinDate: '2023-04-07', projects: 14 },
  { id: 10, name: 'Jack Anderson', email: 'jack@example.com', role: 'Developer', status: 'Active', joinDate: '2023-06-12', projects: 4 },
  { id: 11, name: 'Kate Wilson', email: 'kate@example.com', role: 'Designer', status: 'Active', joinDate: '2023-01-28', projects: 7 },
  { id: 12, name: 'Liam Garcia', email: 'liam@example.com', role: 'Developer', status: 'Inactive', joinDate: '2022-08-14', projects: 13 },
];

const userColumns = [
  {
    key: 'name' as const,
    label: 'Name',
    sortable: true,
    width: '200px',
    render: (value: any) => (
      <div className="glass-flex glass-items-center glass-gap-3">
        <div className="glass-w-8 glass-h-8 glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-full glass-flex glass-items-center glass-justify-center glass-text-primary glass-text-sm glass-font-medium">
          {String(value).charAt(0)}
        </div>
        <span className="glass-font-medium">{String(value)}</span>
      </div>
    ),
  },
  {
    key: 'email' as const,
    label: 'Email',
    sortable: true,
    render: (value: any) => (
      <span className="glass-text-primary hover:glass-text-primary">{String(value)}</span>
    ),
  },
  {
    key: 'role' as const,
    label: 'Role',
    sortable: true,
    render: (value: any) => {
      const roleColors = {
        Admin: 'bg-red-100 text-red-800',
        Manager: 'bg-purple-100 text-purple-800',
        Developer: 'bg-blue-100 text-blue-800',
        Designer: 'bg-green-100 text-green-800',
      };
      const colorClass = roleColors[value as keyof typeof roleColors] || 'bg-gray-100 text-gray-800';
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
          {String(value)}
        </span>
      );
    },
  },
  {
    key: 'status' as const,
    label: 'Status',
    sortable: true,
    render: (value: any) => (
      <div className="glass-flex glass-items-center glass-gap-2">
        <div className={`w-2 h-2 rounded-full ${value === 'Active' ? 'bg-green-500' : 'bg-gray-400'}`} />
        <span className={value === 'Active' ? 'text-green-700' : 'text-gray-500'}>
          {String(value)}
        </span>
      </div>
    ),
  },
  {
    key: 'projects' as const,
    label: 'Projects',
    sortable: true,
    render: (value: any) => (
      <div className="glass-flex glass-items-center glass-gap-2">
        <span className="font-mono glass-text-sm">{String(value)}</span>
        <div className="glass-w-16 glass-h-1 glass-surface-subtle glass-radius-full overflow-hidden">
          <div 
            className="glass-h-full glass-surface-blue transition-all duration-300"
            style={{ width: `${Math.min(100, (Number(value) / 25) * 100)}%` }}
          />
        </div>
      </div>
    ),
  },
  {
    key: 'joinDate' as const,
    label: 'Join Date',
    sortable: true,
    render: (value: any) => new Date(String(value)).toLocaleDateString(),
  },
];

export const Default: Story = {
  args: {
    data: sampleUsers,
    columns: userColumns,
    searchable: true,
    paginated: true,
    pageSize: 8,
  },
  render: (args) => (
    <div className="glass-p-8 glass-min-glass-h-screen glass-gradient-primary glass-gradient-primary glass-gradient-primary">
      <div className="max-w-7xl glass-mx-auto">
        <div className="mb-6">
          <h1 className="glass-text-2xl glass-font-bold glass-text-secondary glass-mb-2">User Management</h1>
          <p className="glass-text-secondary">Manage your team members and their roles</p>
        </div>
        <GlassDataTable {...args} />
      </div>
    </div>
  ),
};

export const LoadingState: Story = {
  args: {
    data: [],
    columns: userColumns,
    loading: true,
    loadingRows: 6,
  },
  render: (args) => (
    <div className="glass-p-8 glass-min-glass-h-screen glass-gradient-primary glass-gradient-primary glass-gradient-primary">
      <div className="max-w-7xl glass-mx-auto">
        <div className="mb-6">
          <h1 className="glass-text-2xl glass-font-bold glass-text-secondary glass-mb-2">Loading Data</h1>
          <p className="glass-text-secondary">Loading skeleton animation while data loads</p>
        </div>
        <GlassDataTable {...args} />
      </div>
    </div>
  ),
};

export const EmptyState: Story = {
  args: {
    data: [],
    columns: userColumns,
    emptyMessage: 'No users found. Try adjusting your search criteria.',
  },
  render: (args) => (
    <div className="glass-p-8 glass-min-glass-h-screen glass-gradient-primary glass-gradient-primary glass-gradient-primary">
      <div className="max-w-7xl glass-mx-auto">
        <div className="mb-6">
          <h1 className="glass-text-2xl glass-font-bold glass-text-secondary glass-mb-2">Empty State</h1>
          <p className="glass-text-secondary">How the table looks when there's no data</p>
        </div>
        <GlassDataTable {...args} />
      </div>
    </div>
  ),
};

export const SimpleTable: Story = {
  args: {
    data: [
      { name: 'Task 1', priority: 'High', status: 'In Progress', assignee: 'Alice' },
      { name: 'Task 2', priority: 'Medium', status: 'Completed', assignee: 'Bob' },
      { name: 'Task 3', priority: 'Low', status: 'Todo', assignee: 'Carol' },
      { name: 'Task 4', priority: 'High', status: 'In Progress', assignee: 'David' },
    ],
    columns: [
      { key: 'name', label: 'Task Name', sortable: true },
      { 
        key: 'priority', 
        label: 'Priority', 
        sortable: true,
        render: (value: any) => {
          const colors = {
            High: 'text-red-600 bg-red-50',
            Medium: 'text-yellow-600 bg-yellow-50',
            Low: 'text-green-600 bg-green-50',
          };
          const color = colors[value as keyof typeof colors] || 'text-gray-600 bg-gray-50';
          return <span className={`px-2 py-1 rounded text-sm ${color}`}>{String(value)}</span>;
        }
      },
      { key: 'status', label: 'Status', sortable: true },
      { key: 'assignee', label: 'Assignee', sortable: true },
    ],
    searchable: false,
    paginated: false,
  },
  render: (args) => (
    <div className="glass-p-8 glass-min-glass-h-screen glass-gradient-primary glass-gradient-primary glass-gradient-primary">
      <div className="max-w-4xl glass-mx-auto">
        <div className="mb-6">
          <h1 className="glass-text-2xl glass-font-bold glass-text-secondary glass-mb-2">Simple Task List</h1>
          <p className="glass-text-secondary">Basic table without search or pagination</p>
        </div>
        <GlassDataTable {...args} />
      </div>
    </div>
  ),
};

export const AllFeatures: Story = {
  args: {
    data: sampleUsers.concat(sampleUsers.map((user, i) => ({ 
      ...user, 
      id: user.id + 100, 
      name: user.name + ' (Copy)',
      email: `copy${i + 1}@example.com`
    }))),
    columns: userColumns,
    searchable: true,
    paginated: true,
    pageSize: 5,
  },
  render: (args) => (
    <div className="glass-p-8 glass-min-glass-h-screen glass-gradient-primary glass-gradient-primary glass-gradient-primary">
      <div className="max-w-7xl glass-mx-auto">
        <div className="mb-6">
          <h1 className="glass-text-2xl glass-font-bold glass-text-secondary glass-mb-2">Complete Data Table</h1>
          <p className="glass-text-secondary">All features enabled: search, sort, pagination with larger dataset</p>
        </div>
        <GlassDataTable {...args} />
      </div>
    </div>
  ),
};