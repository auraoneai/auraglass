import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { GlassIntelligentFormBuilder, FormSchema } from './GlassIntelligentFormBuilder';

const meta: Meta<typeof GlassIntelligentFormBuilder> = {
  title: 'AI/GlassIntelligentFormBuilder',
  component: GlassIntelligentFormBuilder,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Revolutionary AI-powered form builder with intelligent field suggestions, real-time optimization, accessibility compliance, and performance monitoring.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof GlassIntelligentFormBuilder>;

const sampleContactSchema: Partial<FormSchema> = {
  title: 'Contact Support Form',
  description: 'Get in touch with our support team for assistance',
  fields: [
    {
      id: 'name',
      type: 'text',
      label: 'Full Name',
      placeholder: 'Enter your full name',
      required: true
    },
    {
      id: 'email',
      type: 'email',
      label: 'Email Address',
      placeholder: 'your@email.com',
      required: true
    },
    {
      id: 'issue-type',
      type: 'select',
      label: 'Issue Category',
      required: true,
      options: [
        { value: 'technical', label: 'Technical Issue' },
        { value: 'billing', label: 'Billing Question' },
        { value: 'feature', label: 'Feature Request' },
        { value: 'other', label: 'Other' }
      ]
    },
    {
      id: 'message',
      type: 'textarea',
      label: 'Describe Your Issue',
      placeholder: 'Please provide as much detail as possible...',
      required: true
    }
  ]
};

const sampleRegistrationSchema: Partial<FormSchema> = {
  title: 'User Registration',
  description: 'Create your account to get started',
  fields: [
    {
      id: 'first-name',
      type: 'text',
      label: 'First Name',
      placeholder: 'John',
      required: true
    },
    {
      id: 'last-name',
      type: 'text',
      label: 'Last Name',
      placeholder: 'Doe',
      required: true
    },
    {
      id: 'email',
      type: 'email',
      label: 'Email Address',
      placeholder: 'john@example.com',
      required: true
    },
    {
      id: 'phone',
      type: 'tel',
      label: 'Phone Number',
      placeholder: '+1 (555) 123-4567',
      required: false
    },
    {
      id: 'password',
      type: 'password',
      label: 'Password',
      placeholder: 'Create a secure password',
      required: true
    },
    {
      id: 'birth-date',
      type: 'date',
      label: 'Date of Birth',
      required: true
    },
    {
      id: 'terms',
      type: 'checkbox',
      label: 'I agree to the Terms and Conditions',
      required: true
    }
  ]
};

export const EmptyBuilder: Story = {
  args: {
    enableAIAssistance: true,
    enableRealTimeOptimization: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Start with a clean slate and build your form from scratch. The AI will provide intelligent suggestions as you add and configure fields.',
      },
    },
  },
};

export const ContactFormDemo: Story = {
  args: {
    initialSchema: sampleContactSchema,
    enableAIAssistance: true,
    enableRealTimeOptimization: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Pre-configured contact form showing AI analysis and optimization suggestions. Notice how the AI detects the form purpose and provides relevant recommendations.',
      },
    },
  },
};

export const RegistrationFormDemo: Story = {
  args: {
    initialSchema: sampleRegistrationSchema,
    enableAIAssistance: true,
    enableRealTimeOptimization: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Complex registration form demonstrating AI field type suggestions, validation recommendations, and UX optimizations for better conversion rates.',
      },
    },
  },
};

export const WithoutAI: Story = {
  args: {
    initialSchema: sampleContactSchema,
    enableAIAssistance: false,
    enableRealTimeOptimization: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Traditional form builder without AI assistance. Compare this with the AI-enabled versions to see the difference in functionality and user experience.',
      },
    },
  },
};

export const AIAssistanceDemo: Story = {
  render: () => {
    const [schema, setSchema] = React.useState<FormSchema | undefined>();
    
    return (
      <div className="space-y-8">
        <div className="text-center py-8 glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-xl">
          <h1 className="text-3xl font-bold glass-text-secondary mb-4">🤖 AI-Powered Form Builder</h1>
          <p className="text-lg glass-text-secondary max-w-3xl mx-auto leading-relaxed">
            Experience the future of form creation with our intelligent form builder. 
            Watch as AI analyzes your form purpose, suggests optimal field types, 
            provides accessibility improvements, and optimizes for better conversion rates.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 glass-surface-blue text-primary glass-radius-full flex items-center justify-center mx-auto mb-3">
                🧠
              </div>
              <h3 className="font-semibold">Smart Field Detection</h3>
              <p className="text-sm glass-text-secondary mt-1">AI automatically suggests field types based on labels and context</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 glass-surface-green text-primary glass-radius-full flex items-center justify-center mx-auto mb-3">
                ✅
              </div>
              <h3 className="font-semibold">Validation Suggestions</h3>
              <p className="text-sm glass-text-secondary mt-1">Intelligent validation rules and format requirements</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 glass-surface-primary text-primary glass-radius-full flex items-center justify-center mx-auto mb-3">
                ♿
              </div>
              <h3 className="font-semibold">Accessibility First</h3>
              <p className="text-sm glass-text-secondary mt-1">Built-in accessibility compliance and WCAG guidelines</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 glass-surface-primary text-primary glass-radius-full flex items-center justify-center mx-auto mb-3">
                📊
              </div>
              <h3 className="font-semibold">Performance Optimized</h3>
              <p className="text-sm glass-text-secondary mt-1">Real-time performance monitoring and optimization</p>
            </div>
          </div>
        </div>

        <GlassIntelligentFormBuilder
          enableAIAssistance={true}
          enableRealTimeOptimization={true}
          onSchemaChange={setSchema}
        />

        {schema && (
          <div className="glass-surface-subtle text-primary p-6 glass-radius-lg font-mono text-sm overflow-auto">
            <h3 className="text-primary font-bold mb-4">Generated Form Schema:</h3>
            <pre>{JSON.stringify(schema, null, 2)}</pre>
          </div>
        )}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive demo showcasing all AI capabilities. Try adding fields with different names (like "email", "phone", "password", "birth date") and watch the AI provide intelligent suggestions.',
      },
    },
  },
};

export const AdvancedFeatures: Story = {
  render: () => {
    return (
      <div className="space-y-8">
        <div className="glass-gradient-primary glass-gradient-primary glass-gradient-primary text-primary p-8 glass-radius-xl">
          <h2 className="text-2xl font-bold mb-4">🚀 Advanced AI Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold mb-2">🎯 Purpose Detection</h3>
              <ul className="text-sm space-y-1 opacity-90">
                <li>• Contact/Support Forms</li>
                <li>• Registration/Login Forms</li>
                <li>• Payment/Billing Forms</li>
                <li>• Survey/Feedback Forms</li>
                <li>• Application Forms</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">🧠 Field Intelligence</h3>
              <ul className="text-sm space-y-1 opacity-90">
                <li>• Auto field type detection</li>
                <li>• Smart validation rules</li>
                <li>• Accessibility suggestions</li>
                <li>• UX optimizations</li>
                <li>• Real-time analysis</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">📊 Optimization Engine</h3>
              <ul className="text-sm space-y-1 opacity-90">
                <li>• Form flow optimization</li>
                <li>• Conversion rate analysis</li>
                <li>• Performance scoring</li>
                <li>• Accessibility compliance</li>
                <li>• Multi-step recommendations</li>
              </ul>
            </div>
          </div>
        </div>

        <GlassIntelligentFormBuilder
          enableAIAssistance={true}
          enableRealTimeOptimization={true}
        />

        <div className="glass-surface-subtle border-l-4 border-yellow p-6 glass-radius-r-lg">
          <h3 className="font-semibold text-primary mb-2">💡 Pro Tips for AI Form Building</h3>
          <ul className="text-sm text-primary space-y-2">
            <li><strong>Descriptive Labels:</strong> Use clear, descriptive field labels like "Business Email Address" instead of just "Email"</li>
            <li><strong>Context Matters:</strong> Fill in the form title and description - the AI uses this context for better suggestions</li>
            <li><strong>Field Names:</strong> Try fields with names like "password", "phone", "birth date", "website" to see AI suggestions</li>
            <li><strong>Validation Rules:</strong> The AI automatically suggests appropriate validation based on field types and context</li>
            <li><strong>Accessibility:</strong> Watch how the AI provides accessibility tips and compliance scoring</li>
            <li><strong>Export Schema:</strong> Use the export feature to save your form configuration for use in your applications</li>
          </ul>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Comprehensive overview of all advanced AI features with practical examples and tips for getting the most out of the intelligent form builder.',
      },
    },
  },
};