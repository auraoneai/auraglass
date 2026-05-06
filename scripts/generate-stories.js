#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Generate basic Storybook stories for Glass components
 * This script automatically creates .stories.tsx files for components that don't have them
 */

const componentsDir = path.join(__dirname, '..', 'src', 'components');
const primitivesDir = path.join(__dirname, '..', 'src', 'primitives');

// Basic story template
const createBasicStoryTemplate = (componentName, componentPath, props = {}) => {
  const category = componentPath.split('/').slice(-2)[0]; // Get parent directory name
  const capitalizedCategory = category.charAt(0).toUpperCase() + category.slice(1);

  return `import type { Meta, StoryObj } from '@storybook/react';
import { ${componentName} } from './${componentName}';

const meta: Meta<typeof ${componentName}> = {
  title: 'Components/${capitalizedCategory}/${componentName}',
  component: ${componentName},
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism ${componentName.toLowerCase()} component.',
      },
    },
  },
  argTypes: {
    ${Object.entries(props).map(([key, value]) => {
      if (Array.isArray(value)) {
        return `${key}: {
      control: { type: 'select' },
      options: ${JSON.stringify(value)},
      description: '${key} prop',
    },`;
      } else if (typeof value === 'boolean') {
        return `${key}: {
      control: 'boolean',
      description: '${key} prop',
    },`;
      } else if (typeof value === 'number') {
        return `${key}: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: '${key} prop',
    },`;
      }
      return `${key}: {
      control: 'text',
      description: '${key} prop',
    },`;
    }).join('\n    ')}
  },
  args: {
    ${Object.entries(props).map(([key, value]) => {
      if (Array.isArray(value) && value.length > 0) {
        return `${key}: '${value[0]}',`;
      } else if (typeof value === 'boolean') {
        return `${key}: false,`;
      } else if (typeof value === 'number') {
        return `${key}: ${value},`;
      }
      return `${key}: '${value || ''}',`;
    }).join('\n    ')}
  },
};

export default meta;
type Story = StoryObj<typeof ${componentName}>;

export const Default: Story = {
  args: {
    children: (
      <div className="p-4 text-center">
        <h3 className="text-lg font-semibold mb-2">${componentName}</h3>
        <p className="text-sm opacity-80">This is the default ${componentName.toLowerCase()} component.</p>
      </div>
    ),
  },
};

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-4">
      ${Array.isArray(props.variant) ? props.variant.map(variant =>
        `<${componentName} key="${variant}" {...args} variant="${variant}">
        ${variant}
      </${componentName}>`
      ).join('\n      ') : `<${componentName} {...args}>
        Default
      </${componentName}>`}
    </div>
  ),
  args: {
    children: null,
  },
};
`;
};

// Common props patterns for different component types
const getCommonProps = (componentName) => {
  const commonProps = {
    className: '',
    children: null,
    disabled: false,
  };

  // Button-like components
  if (componentName.toLowerCase().includes('button')) {
    return {
      ...commonProps,
      variant: ['primary', 'secondary', 'ghost', 'outline', 'danger'],
      size: ['sm', 'md', 'lg'],
      loading: false,
    };
  }

  // Input-like components
  if (componentName.toLowerCase().includes('input') || componentName.toLowerCase().includes('select')) {
    return {
      ...commonProps,
      placeholder: 'Enter text...',
      value: '',
      size: ['sm', 'md', 'lg'],
    };
  }

  // Card-like components
  if (componentName.toLowerCase().includes('card')) {
    return {
      ...commonProps,
      variant: ['default', 'outlined', 'elevated'],
      size: ['sm', 'md', 'lg'],
    };
  }

  // Modal/Dialog components
  if (componentName.toLowerCase().includes('modal') || componentName.toLowerCase().includes('dialog')) {
    return {
      ...commonProps,
      open: true,
      title: 'Modal Title',
      size: ['sm', 'md', 'lg'],
    };
  }

  return commonProps;
};

// Find all component files
function findComponents(dir, results = []) {
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      findComponents(fullPath, results);
    } else if (item.endsWith('.tsx') && !item.endsWith('.stories.tsx') && !item.endsWith('.d.ts')) {
      // Check if it's a component (starts with capital letter)
      const componentName = path.parse(item).name;
      if (componentName[0] === componentName[0].toUpperCase()) {
        results.push({
          name: componentName,
          path: fullPath,
          relativePath: path.relative(path.join(__dirname, '..', 'src'), fullPath),
        });
      }
    }
  }

  return results;
}

// Generate stories for components that don't have them
function generateStories() {
  console.log('🔍 Finding components...');

  const components = findComponents(componentsDir);
  const primitives = findComponents(primitivesDir);

  const allComponents = [...components, ...primitives];

  console.log('Found ' + allComponents.length + ' components');

  let created = 0;
  let skipped = 0;

  for (const component of allComponents) {
    const storyPath = component.path.replace('.tsx', '.stories.tsx');

    // Skip if story already exists
    if (fs.existsSync(storyPath)) {
      skipped++;
      continue;
    }

    // Get common props for this component type
    const props = getCommonProps(component.name);

    // Generate story content
    const storyContent = createBasicStoryTemplate(component.name, component.relativePath, props);

    // Write story file
    fs.writeFileSync(storyPath, storyContent, 'utf8');
    created++;

    console.log('✅ Created story for ' + component.name);
  }

  console.log('\n📊 Summary:');
  console.log('   Created: ' + created + ' stories');
  console.log('   Skipped: ' + skipped + ' (already exist)');
  console.log('   Total components: ' + allComponents.length);
}

// Run the generator
if (require.main === module) {
  generateStories();
}

module.exports = { generateStories, createBasicStoryTemplate };
