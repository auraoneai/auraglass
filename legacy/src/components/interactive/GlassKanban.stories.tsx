import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassKanban } from './GlassKanban';
import { cn } from '../../lib/utils';

const meta: Meta<typeof GlassKanban> = {
  title: 'Workflows/Glass Kanban',
  component: GlassKanban,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glasskanban component.',
      },
    },
  },
  argTypes: {
    columns: {
      control: 'object',
      description: 'Array of kanban columns with cards',
    },
    className: {
      control: 'text',
      description: 'Additional CSS class',
    },
  },
  args: {
    columns: [
      {
        id: 'todo',
        title: 'To Do',
        cards: [
          { id: '1', title: 'Design homepage', description: 'Create wireframes for the main page' },
          { id: '2', title: 'Setup database', description: 'Configure database schema' },
        ],
      },
      {
        id: 'in-progress',
        title: 'In Progress',
        cards: [
          { id: '3', title: 'Implement authentication', description: 'Add login/logout functionality' },
          { id: '4', title: 'Write API endpoints', description: 'Create REST API for data management' },
        ],
      },
      {
        id: 'done',
        title: 'Done',
        cards: [
          { id: '5', title: 'Project setup', description: 'Initialize project structure' },
          { id: '6', title: 'UI components', description: 'Create basic UI components' },
        ],
      },
    ],
    className: '',
  },
};

export default meta;
type Story = StoryObj<typeof GlassKanban>;

export const Default: Story = {
  args: {
    columns: [
      {
        id: 'backlog',
        title: 'Backlog',
        cards: [
          { id: '1', title: 'User research', description: 'Conduct user interviews' },
          { id: '2', title: 'Wireframes', description: 'Create initial wireframes' },
        ],
      },
      {
        id: 'development',
        title: 'Development',
        cards: [
          { id: '3', title: 'Frontend setup', description: 'Set up React application' },
          { id: '4', title: 'Backend API', description: 'Build REST API endpoints' },
        ],
      },
    ],
  },
};

export const Variants: Story = {
  args: {
    columns: [
      {
        id: 'new',
        title: 'New',
        cards: [
          { id: '1', title: 'New feature request' },
        ],
      },
      {
        id: 'active',
        title: 'Active',
        cards: [
          { id: '2', title: 'Bug fix', description: 'Fix login issue' },
          { id: '3', title: 'Feature implementation', description: 'Add dark mode toggle' },
        ],
      },
      {
        id: 'review',
        title: 'Review',
        cards: [
          { id: '4', title: 'Code review', description: 'Review pull request #123' },
        ],
      },
      {
        id: 'completed',
        title: 'Completed',
        cards: [
          { id: '5', title: 'Documentation', description: 'Update API docs' },
          { id: '6', title: 'Testing', description: 'Write unit tests' },
          { id: '7', title: 'Deployment', description: 'Deploy to production' },
        ],
      },
    ],
  },
};
