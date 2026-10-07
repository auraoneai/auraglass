import type { Meta, StoryObj } from '@storybook/react';
import { GlassPatternBuilder } from './GlassPatternBuilder';

const meta = {
  title: 'Effects + Advanced/Glass Pattern Builder',
  component: GlassPatternBuilder,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    width: {
      control: { type: 'range', min: 400, max: 1200, step: 50 },
    },
    height: {
      control: { type: 'range', min: 300, max: 800, step: 50 },
    },
    zoom: {
      control: { type: 'range', min: 0.5, max: 3, step: 0.1 },
    },
    gridSize: {
      control: { type: 'range', min: 10, max: 50, step: 5 },
    },
    backgroundColor: {
      control: { type: 'color' },
      type: 'string',
      table: { type: { summary: 'string' } },
    },
    exportFormat: {
      control: { type: 'select' },
      options: ['png', 'svg', 'json'],
    },
  },
} satisfies Meta<typeof GlassPatternBuilder>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    width: 800,
    height: 600,
    showControls: true,
    showLayerPanel: true,
    showProperties: true,
    showGrid: true,
    showRulers: true,
  },
};

export const BasicBuilder: Story = {
  args: {
    width: 600,
    height: 400,
    colorPalette: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'],
    gridSize: 20,
    snapToGrid: true,
    showGrid: true,
  },
};

export const MinimalInterface: Story = {
  args: {
    width: 500,
    height: 400,
    showControls: false,
    showLayerPanel: false,
    showProperties: false,
    showRulers: false,
    showGrid: false,
  },
};

export const WithCustomColors: Story = {
  args: {
    width: 700,
    height: 500,
    colorPalette: [
      '#FF0080', '#FF8000', '#FFFF00', '#80FF00', 
      '#00FF80', '#0080FF', '#8000FF', '#FF0080'
    ],
    backgroundColor: '#1A1A1A',
    showGrid: true,
    gridSize: 25,
  },
};

export const LargeCanvas: Story = {
  args: {
    width: 1000,
    height: 700,
    showControls: true,
    showLayerPanel: true,
    zoom: 0.8,
    gridSize: 30,
  },
};

export const WithPresetLayers: Story = {
  args: {
    width: 600,
    height: 400,
    layers: [
      {
        name: 'Background',
        id: 'bg-layer',
        visible: true,
        locked: false,
        opacity: 1,
        blendMode: 'normal',
        elements: [
          {
            type: 'square',
            x: 300,
            y: 200,
            width: 580,
            height: 380,
            rotation: 0,
            color: '#F0F8FF',
            opacity: 0.8,
            strokeColor: '#4169E1',
            strokeWidth: 2,
            id: 'bg-rect',
            properties: {}
          }
        ]
      },
      {
        name: 'Shapes',
        id: 'shapes-layer',
        visible: true,
        locked: false,
        opacity: 1,
        blendMode: 'normal',
        elements: [
          {
            type: 'circle',
            x: 200,
            y: 150,
            width: 80,
            height: 80,
            rotation: 0,
            color: '#FF6B6B',
            opacity: 0.9,
            strokeColor: '#CC5555',
            strokeWidth: 3,
            id: 'circle-1',
            properties: {}
          },
          {
            type: 'triangle',
            x: 400,
            y: 150,
            width: 80,
            height: 80,
            rotation: 0,
            color: '#4ECDC4',
            opacity: 0.9,
            strokeColor: '#3EAAA0',
            strokeWidth: 3,
            id: 'triangle-1',
            properties: {}
          },
          {
            type: 'square',
            x: 300,
            y: 250,
            width: 60,
            height: 60,
            rotation: 45,
            color: '#45B7D1',
            opacity: 0.9,
            strokeColor: '#3695B8',
            strokeWidth: 3,
            id: 'square-1',
            properties: {}
          }
        ]
      }
    ],
    activeLayerIndex: 1,
  },
};

export const PatternDesigner: Story = {
  args: {
    width: 800,
    height: 600,
    showControls: true,
    showLayerPanel: true,
    showGrid: true,
    snapToGrid: true,
    gridSize: 20,
    colorPalette: [
      '#E74C3C', '#3498DB', '#2ECC71', '#F39C12',
      '#9B59B6', '#1ABC9C', '#34495E', '#E67E22'
    ],
    templates: [
      {
        name: 'Flower Pattern',
        category: 'Nature',
        preview: 'flower-preview',
        id: 'template-flower',
        layers: [{
          name: 'Petals',
          id: 'petals-layer',
          visible: true,
          locked: false,
          opacity: 1,
          blendMode: 'normal',
          elements: Array.from({ length: 8 }, (_, i) => ({
            type: 'circle' as const,
            x: 400 + Math.cos(i * Math.PI / 4) * 60,
            y: 300 + Math.sin(i * Math.PI / 4) * 60,
            width: 40,
            height: 40,
            rotation: 0,
            color: '#FF69B4',
            opacity: 0.8,
            strokeColor: '#FF1493',
            strokeWidth: 2,
            id: `petal-${i}`,
            properties: {}
          })).concat([{
            type: 'circle' as const,
            x: 400,
            y: 300,
            width: 30,
            height: 30,
            rotation: 0,
            color: '#FFD700',
            opacity: 1,
            strokeColor: '#FFA500',
            strokeWidth: 2,
            id: 'center',
            properties: {}
          }])
        }]
      }
    ],
  },
};

export const GeometricDesign: Story = {
  args: {
    width: 600,
    height: 600,
    backgroundColor: '#2C3E50',
    colorPalette: [
      '#E74C3C', '#3498DB', '#2ECC71', '#F39C12',
      '#9B59B6', '#E67E22', '#1ABC9C', '#ECF0F1'
    ],
    showGrid: true,
    gridSize: 30,
    snapToGrid: true,
    zoom: 1,
  },
};

export const InteractiveWorkspace: Story = {
  args: {
    width: 900,
    height: 650,
    showControls: true,
    showLayerPanel: true,
    showProperties: true,
    showRulers: true,
    showGrid: true,
    snapToGrid: false,
    gridSize: 15,
    zoom: 1,
    colorPalette: [
      '#FF5733', '#33FF57', '#3357FF', '#FF33F5',
      '#F5FF33', '#33FFF5', '#F533FF', '#57FF33'
    ],
    exportFormat: 'svg',
  },
};
