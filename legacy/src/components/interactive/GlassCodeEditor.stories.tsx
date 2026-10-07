import type { Meta, StoryObj } from '@storybook/react';
import { GlassCodeEditor, GlassCodeEditorWithFiles } from './GlassCodeEditor';

import { cn } from '../../lib/utils';
const meta: Meta<typeof GlassCodeEditor> = {
  title: 'Effects + Advanced/Glass Code Editor',
  component: GlassCodeEditor,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glasscodeeditor component.',
      },
    },
  },
  argTypes: {
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
    value: {
      control: 'text',
      description: 'Code content',
    },
    language: {
      control: { type: 'select' },
      options: ['javascript', 'typescript', 'python', 'html', 'css', 'json'],
      description: 'Programming language',
    },
    readOnly: {
      control: 'boolean',
      description: 'Read-only mode',
    },
    lineNumbers: {
      control: 'boolean',
      description: 'Show line numbers',
    },
  },
  args: {
    className: '',
    value: 'function hello() {\n  console.log("Hello, World!");\n}',
    language: 'javascript',
    readOnly: false,
    lineNumbers: true,
  },
};

export default meta;
type Story = StoryObj<typeof GlassCodeEditor>;

export const Default: Story = {
  args: {
    value: 'console.log("Hello from GlassCodeEditor!");',
    language: 'javascript',
  },
};

export const TypeScriptExample: Story = {
  args: {
    value: 'interface User {\n  name: string;\n  age: number;\n}\n\nconst user: User = {\n  name: "Alice",\n  age: 30\n};',
    language: 'typescript',
    lineNumbers: true,
  },
};

export const ReadOnlyExample: Story = {
  args: {
    value: 'const data = [\n  { id: 1, name: "Item 1" },\n  { id: 2, name: "Item 2" }\n];',
    language: 'javascript',
    readOnly: true,
    lineNumbers: true,
  },
};

// Stories for GlassCodeEditorWithFiles
export const WithFiles: Story = {
  render: (args) => (
    <GlassCodeEditorWithFiles
      files={[
        {
          name: 'index.js',
          content: 'console.log("Hello from index.js!");\n\nfunction greet(name) {\n  return `Hello, ${name}!`;\n}',
          language: 'javascript'
        },
        {
          name: 'styles.css',
          content: '.container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  min-height: 100vh;\n}',
          language: 'css'
        },
        {
          name: 'App.tsx',
          content: 'import React from "react";\n\nconst App: React.FC = () => {\n  return (\n    <div className="container">\n      <h1>Hello World</h1>\n    </div>\n  );\n};\n\nexport default App;',
          language: 'typescript'
        }
      ]}
      onFileChange={(...args) => console.log('Mock function called', ...args)}
    />
  ),
  args: {},
};

export const MultiFileProject: Story = {
  render: (args) => (
    <GlassCodeEditorWithFiles
      files={[
        {
          name: 'package.json',
          content: '{\n  "name": "my-project",\n  "version": "1.0.0",\n  "scripts": {\n    "start": "react-scripts start",\n    "build": "react-scripts build"\n  }\n}',
          language: 'json'
        },
        {
          name: 'src/App.js',
          content: 'import React from "react";\nimport "./App.css";\n\nfunction App() {\n  return (\n    <div className="App">\n      <header className="App-header">\n        <h1>My React App</h1>\n      </header>\n    </div>\n  );\n}\n\nexport default App;',
          language: 'javascript'
        },
        {
          name: 'src/App.css',
          content: '.App {\n  text-align: center;\n}\n\n.App-header {\n  background-color: #282c34;\n  min-height: 100vh;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  color: white;\n}',
          language: 'css'
        },
        {
          name: 'README.md',
          content: '# My Project\n\nThis is a sample React project with multiple files.\n\n## Getting Started\n\n1. Install dependencies: `npm install`\n2. Start development server: `npm start`',
          language: 'markdown'
        }
      ]}
      onFileChange={(...args) => console.log('Mock function called', ...args)}
    />
  ),
  args: {},
};
