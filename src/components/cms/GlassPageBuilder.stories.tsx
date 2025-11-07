import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { GlassPageBuilder } from './GlassPageBuilder';

const meta: Meta<typeof GlassPageBuilder> = {
  title: 'CMS/GlassPageBuilder',
  component: GlassPageBuilder,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# 🎨 Glass Page Builder

A revolutionary visual page builder with advanced drag-and-drop capabilities, real-time editing, and professional-grade features.

## ✨ Key Features

### 🏗️ **Visual Page Construction**
- **Drag & Drop Interface**: Intuitive component palette with categorized elements
- **Real-time Preview**: See changes instantly as you build
- **Responsive Design**: Preview and edit across desktop, tablet, and mobile breakpoints
- **Grid System**: Optional grid overlay with snap-to-grid functionality

### 🧩 **Rich Component Library**
- **Layout Components**: Containers, rows, columns with flexible properties
- **Content Elements**: Text, headings with inline editing capabilities
- **Media Components**: Images with upload and URL support
- **Interactive Elements**: Buttons with click actions and link support
- **Advanced Components**: Cards and complex layouts

### ⚡ **Advanced Editing**
- **Property Panel**: Comprehensive property editing with multiple input types
- **Inline Editing**: Double-click text elements to edit directly
- **Component Tree**: Hierarchical view of page structure
- **Copy/Paste/Duplicate**: Full component manipulation

### 💼 **Professional Tools**
- **Undo/Redo**: Full history management with keyboard shortcuts
- **Auto-save**: Automatic saving every 30 seconds
- **Export/Import**: Save and load page structures as JSON
- **Preview Mode**: Toggle between editing and preview modes
- **Keyboard Shortcuts**: Professional workflow support

### 🎯 **User Experience**
- **Smart Drop Zones**: Visual feedback for component placement
- **Component Selection**: Clear visual indicators for selected elements
- **Search & Filter**: Find components quickly in large structures
- **Collapsible Panels**: Maximize canvas space when needed

## 🚀 **Use Cases**

- **Landing Page Builder**: Create marketing pages with drag-and-drop ease
- **Content Management**: Build complex layouts without coding
- **Prototyping Tool**: Rapidly prototype interfaces and layouts
- **Website Builder**: Full-featured page construction system
- **Email Template Builder**: Design responsive email layouts
- **App Screen Designer**: Create mobile and web app interfaces

This is the most advanced page builder component in the AuraGlass library, combining the power of professional page builders like Webflow, Elementor, and WordPress Gutenberg into a single, elegant React component.
        `,
      },
    },
  },
  argTypes: {
    initialData: {
      control: 'object',
      description: 'Initial page data to load'
    },
    onSave: {
      action: 'save',
      description: 'Callback when page is saved'
    },
    onPreview: {
      action: 'preview', 
      description: 'Callback when preview is requested'
    },
    onPublish: {
      action: 'publish',
      description: 'Callback when page is published'
    }
  }
};

export default meta;
type Story = StoryObj<typeof GlassPageBuilder>;

// Sample page data for demonstrations
const sampleLandingPageData = {
  components: [
    {
      id: 'comp_1_1',
      type: 'container',
      props: {
        padding: '60px 20px',
        backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '0px',
        maxWidth: '100%',
        display: 'block'
      },
      children: [
        {
          id: 'comp_1_2',
          type: 'heading',
          props: {
            content: 'Welcome to Our Amazing Product',
            level: 'h1',
            fontSize: '48px',
            fontWeight: '700',
            color: '#ffffff',
            textAlign: 'center',
            margin: '0 0 20px 0'
          },
          children: [],
          parent: 'comp_1_1',
          order: 0
        },
        {
          id: 'comp_1_3',
          type: 'text',
          props: {
            content: 'Build beautiful pages with our drag-and-drop page builder. No coding required.',
            fontSize: '20px',
            fontWeight: '400',
            color: '#f1f5f9',
            textAlign: 'center',
            lineHeight: '1.6',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          },
          children: [],
          parent: 'comp_1_1',
          order: 1
        },
        {
          id: 'comp_1_4',
          type: 'button',
          props: {
            text: 'Get Started Free',
            variant: 'primary',
            size: 'large',
            disabled: false,
            href: '',
            onClick: 'alert("Getting started!")'
          },
          children: [],
          parent: 'comp_1_1',
          order: 2
        }
      ],
      parent: undefined,
      order: 0
    },
    {
      id: 'comp_2_1',
      type: 'container',
      props: {
        padding: '80px 20px',
        backgroundColor: '#ffffff',
        borderRadius: '0px',
        maxWidth: '1200px',
        display: 'block'
      },
      children: [
        {
          id: 'comp_2_2',
          type: 'heading',
          props: {
            content: 'Why Choose Our Platform?',
            level: 'h2',
            fontSize: '36px',
            fontWeight: '600',
            color: '#1a202c',
            textAlign: 'center',
            margin: '0 0 50px 0'
          },
          children: [],
          parent: 'comp_2_1',
          order: 0
        },
        {
          id: 'comp_2_3',
          type: 'row',
          props: {
            gap: '40px',
            justifyContent: 'space-between',
            alignItems: 'stretch',
            wrap: 'wrap',
            padding: '0px'
          },
          children: [
            {
              id: 'comp_2_4',
              type: 'card',
              props: {
                padding: '30px',
                borderRadius: '12px',
                backgroundColor: '#f8fafc',
                boxShadow: '0 4px 12px rgba(var(--glass-color-black) / var(--glass-opacity-5))',
                border: '1px solid #e2e8f0'
              },
              children: [
                {
                  id: 'comp_2_5',
                  type: 'heading',
                  props: {
                    content: '⚡ Fast & Intuitive',
                    level: 'h3',
                    fontSize: '24px',
                    fontWeight: '600',
                    color: '#2d3748',
                    textAlign: 'left',
                    margin: '0 0 15px 0'
                  },
                  children: [],
                  parent: 'comp_2_4',
                  order: 0
                },
                {
                  id: 'comp_2_6',
                  type: 'text',
                  props: {
                    content: 'Build pages 10x faster with our intuitive drag-and-drop interface.',
                    fontSize: '16px',
                    fontWeight: '400',
                    color: '#4a5568',
                    textAlign: 'left',
                    lineHeight: '1.6',
                    fontFamily: 'system-ui, -apple-system, sans-serif'
                  },
                  children: [],
                  parent: 'comp_2_4',
                  order: 1
                }
              ],
              parent: 'comp_2_3',
              order: 0
            }
          ],
          parent: 'comp_2_1',
          order: 1
        }
      ],
      parent: undefined,
      order: 1
    }
  ],
  timestamp: new Date().toISOString(),
  version: '1.0.0'
};

const sampleDashboardData = {
  components: [
    {
      id: 'dashboard_1',
      type: 'container',
      props: {
        padding: '20px',
        backgroundColor: '#f7fafc',
        maxWidth: '100%',
        display: 'block'
      },
      children: [
        {
          id: 'dashboard_2',
          type: 'heading',
          props: {
            content: '📊 Analytics Dashboard',
            level: 'h1',
            fontSize: '32px',
            fontWeight: '700',
            color: '#2d3748',
            textAlign: 'left',
            margin: '0 0 30px 0'
          },
          children: [],
          parent: 'dashboard_1',
          order: 0
        },
        {
          id: 'dashboard_3',
          type: 'row',
          props: {
            gap: '20px',
            justifyContent: 'space-between',
            alignItems: 'stretch',
            wrap: 'wrap',
            padding: '0px'
          },
          children: [
            {
              id: 'dashboard_4',
              type: 'card',
              props: {
                padding: '25px',
                borderRadius: '8px',
                backgroundColor: '#ffffff',
                boxShadow: '0 1px 3px rgba(var(--glass-color-black) / var(--glass-opacity-10))',
                border: 'none'
              },
              children: [
                {
                  id: 'dashboard_5',
                  type: 'heading',
                  props: {
                    content: '12,345',
                    level: 'h2',
                    fontSize: '28px',
                    fontWeight: '700',
                    color: '#48bb78',
                    textAlign: 'center',
                    margin: '0 0 10px 0'
                  },
                  children: [],
                  parent: 'dashboard_4',
                  order: 0
                },
                {
                  id: 'dashboard_6',
                  type: 'text',
                  props: {
                    content: 'Total Users',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#718096',
                    textAlign: 'center',
                    lineHeight: '1.4',
                    fontFamily: 'system-ui, -apple-system, sans-serif'
                  },
                  children: [],
                  parent: 'dashboard_4',
                  order: 1
                }
              ],
              parent: 'dashboard_3',
              order: 0
            }
          ],
          parent: 'dashboard_1',
          order: 1
        }
      ],
      parent: undefined,
      order: 0
    }
  ],
  timestamp: new Date().toISOString(),
  version: '1.0.0'
};

export const EmptyBuilder: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: `
### 🎯 **Empty Page Builder**

Start with a blank canvas and build from scratch. This demonstrates the core page builder interface with:

- **Component Palette**: Drag components from the left panel
- **Canvas**: Drop area with visual feedback
- **Property Panel**: Edit component properties on the right
- **Toolbar**: Full set of professional tools

**Try this:**
1. Drag a "Container" from Components palette
2. Drop it on the canvas
3. Drag a "Heading" into the container
4. Double-click the heading to edit text
5. Use the property panel to change colors and styles
        `,
      },
    },
  },
};

export const LandingPageBuilder: Story = {
  args: {
    initialData: sampleLandingPageData,
  },
  parameters: {
    docs: {
      description: {
        story: `
### 🎨 **Pre-loaded Landing Page**

Demonstrates the page builder with a complete landing page structure already loaded:

- **Hero Section**: Gradient background with heading, text, and CTA button
- **Feature Section**: Cards layout with content blocks
- **Professional Styling**: Carefully crafted colors, spacing, and typography

**Explore the features:**
1. Click on different components to see property editing
2. Try the breakpoint switcher (Desktop/Tablet/Mobile)
3. Use the Structure panel to see the component hierarchy
4. Toggle Preview mode to see the final result
5. Try Undo/Redo with the toolbar buttons
        `,
      },
    },
  },
};

export const DashboardBuilder: Story = {
  args: {
    initialData: sampleDashboardData,
  },
  parameters: {
    docs: {
      description: {
        story: `
### 📊 **Dashboard Interface Example**

Shows how to build dashboard-style interfaces with the page builder:

- **Statistics Cards**: Clean metric display cards
- **Grid Layouts**: Organized content sections
- **Data Visualization Ready**: Structure for charts and graphs

**Dashboard Features:**
- Metric cards with large numbers
- Clean, professional styling
- Responsive layout system
- Easy to extend with more components
        `,
      },
    },
  },
};

export const InteractiveShowcase: Story = {
  render: () => {
    const [savedData, setSavedData] = useState<any>(null);
    const [logs, setLogs] = useState<string[]>([]);

    const addLog = (message: string) => {
      setLogs(prev => [...prev.slice(-4), `${new Date().toLocaleTimeString()}: ${message}`]);
    };

    return (
      <div className="h-screen flex flex-col">
        <div className="glass-surface-subtle p-4 border-b border-blue-200">
          <h2 className="text-lg font-semibold text-primary mb-2">
            🚀 Interactive Page Builder Showcase
          </h2>
          <p className="text-primary text-sm mb-3">
            This demo shows all the advanced features working together with callback integration.
          </p>
          
          {/* Action Log */}
          <div className="glass-surface-subtle glass-radius p-3 mb-3">
            <div className="text-xs font-medium glass-text-secondary mb-2">Activity Log:</div>
            <div className="space-y-1 text-xs glass-text-secondary max-h-20 overflow-y-auto">
              {logs.length === 0 ? (
                <div className="glass-text-secondary italic">Waiting for actions...</div>
              ) : (
                logs.map((log, index) => (
                  <div key={index} className="font-mono">{log}</div>
                ))
              )}
            </div>
          </div>

          {/* Feature Highlights */}
          <div className="grid glass-grid-cols-1 md:glass-grid-cols-4 gap-4 text-sm">
            <div className="glass-surface-subtle glass-radius p-3 text-center">
              <div className="text-lg mb-1">🎨</div>
              <div className="font-medium glass-text-secondary">Visual Builder</div>
              <div className="glass-text-secondary text-xs">Drag & drop components</div>
            </div>
            <div className="glass-surface-subtle glass-radius p-3 text-center">
              <div className="text-lg mb-1">⚡</div>
              <div className="font-medium glass-text-secondary">Real-time Editing</div>
              <div className="glass-text-secondary text-xs">Instant property updates</div>
            </div>
            <div className="glass-surface-subtle glass-radius p-3 text-center">
              <div className="text-lg mb-1">📱</div>
              <div className="font-medium glass-text-secondary">Responsive</div>
              <div className="glass-text-secondary text-xs">Multi-device preview</div>
            </div>
            <div className="glass-surface-subtle glass-radius p-3 text-center">
              <div className="text-lg mb-1">💾</div>
              <div className="font-medium glass-text-secondary">Export/Import</div>
              <div className="glass-text-secondary text-xs">JSON data format</div>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <GlassPageBuilder
            initialData={sampleLandingPageData}
            onSave={(data) => {
              setSavedData(data);
              addLog('Page saved successfully');
            }}
            onPreview={(data) => {
              addLog(`Preview mode activated (${data.components.length} components)`);
            }}
            onPublish={(data) => {
              addLog(`Page published with ${data.components.length} components`);
            }}
          />
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: `
### 🎮 **Full Interactive Demo**

Complete demonstration of the page builder with all features enabled and callback integration:

**🔧 Professional Features:**
- **Auto-save**: Saves every 30 seconds automatically
- **Undo/Redo**: Full history with Ctrl+Z/Ctrl+Y support
- **Keyboard Shortcuts**: Professional workflow shortcuts
- **Export/Import**: Complete page data in JSON format
- **Responsive Preview**: Desktop, tablet, and mobile breakpoints

**🎯 Advanced Capabilities:**
- **Component Library**: 10+ pre-built components with full customization
- **Property Editing**: Rich property panel with multiple input types
- **Drag & Drop**: Advanced drag-and-drop with visual feedback
- **Component Tree**: Hierarchical structure view and management
- **Grid System**: Optional grid overlay with snap functionality

**💡 Try These Features:**
1. **Building**: Drag components from the palette to build pages
2. **Editing**: Click components and edit properties in the right panel
3. **Structure**: Use the Structure tab to see component hierarchy
4. **Responsive**: Switch between desktop/tablet/mobile views
5. **Actions**: Try save, preview, and publish buttons
6. **Shortcuts**: Use Ctrl+Z/Y for undo/redo

This is the most advanced page builder component available, rivaling professional tools like Webflow and WordPress Gutenberg.
        `,
      },
    },
  },
};

export const MobileFirst: Story = {
  args: {
    initialData: {
      components: [
        {
          id: 'mobile_1',
          type: 'container',
          props: {
            padding: '20px',
            backgroundColor: '#ffffff',
            maxWidth: '100%'
          },
          children: [
            {
              id: 'mobile_2',
              type: 'heading',
              props: {
                content: '📱 Mobile-First Design',
                level: 'h1',
                fontSize: '24px',
                fontWeight: '700',
                color: '#1a202c',
                textAlign: 'center',
                margin: '0 0 20px 0'
              },
              children: [],
              parent: 'mobile_1',
              order: 0
            },
            {
              id: 'mobile_3',
              type: 'text',
              props: {
                content: 'This page is optimized for mobile viewing. Switch between breakpoints to see responsive behavior.',
                fontSize: '16px',
                color: '#4a5568',
                textAlign: 'center',
                lineHeight: '1.6'
              },
              children: [],
              parent: 'mobile_1',
              order: 1
            },
            {
              id: 'mobile_4',
              type: 'button',
              props: {
                text: 'Tap Me',
                variant: 'primary',
                size: 'large'
              },
              children: [],
              parent: 'mobile_1',
              order: 2
            }
          ],
          parent: undefined,
          order: 0
        }
      ],
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Mobile-optimized page design demonstrating responsive breakpoint management and mobile-first design principles.',
      },
    },
  },
};