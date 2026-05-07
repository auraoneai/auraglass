import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { ToastProvider, useToastHelpers } from '../../feedback/GlassToast';
import { GlassDataTable } from '../interactive/GlassDataTable';
import { GlassFileUpload } from '../../input/GlassFileUpload';
import GlassDevTools from '../../../tools/GlassDevTools';
import { useAccessibility } from '../../../hooks/useAccessibility';
import { usePerformance } from '../../../hooks/usePerformance';
import { Glass } from '../../../primitives';
import { ANIMATION } from '../../../tokens/designConstants';

const meta: Meta = {
  title: 'Showcases/Comprehensive Showcase',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Complete showcase of all practical UI/UX improvements, real-world components, performance optimizations, accessibility features, and developer tools.',
      },
    },
  },
};

export default meta;

const ShowcaseStoryFrame = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      height: '100dvh',
      maxHeight: '100dvh',
      minHeight: 0,
      overflow: 'hidden',
      contain: 'layout paint size',
      background: 'linear-gradient(135deg, #eff6ff 0%, #f8fafc 45%, #ecfeff 100%)',
    }}
  >
    <div
      style={{
        height: '100%',
        maxHeight: '100%',
        overflowY: 'auto',
        overscrollBehavior: 'contain',
      }}
    >
      {children}
    </div>
  </div>
);

const ShowcaseDemo: React.FC = () => {
  const { success, error, info } = useToastHelpers();
  const accessibility = useAccessibility();
  const performance = usePerformance();

  // Sample data for table
  const tableData = [
    { id: 1, name: 'Modern Dashboard', status: 'Active', users: 1234, performance: 98 },
    { id: 2, name: 'E-commerce Platform', status: 'Active', users: 5678, performance: 95 },
    { id: 3, name: 'Analytics Tool', status: 'Maintenance', users: 890, performance: 87 },
    { id: 4, name: 'CRM System', status: 'Active', users: 2345, performance: 92 },
  ];

  const tableColumns = [
    { key: 'name' as const, label: 'Project Name', sortable: true },
    {
      key: 'status' as const,
      label: 'Status',
      sortable: true,
      render: (value: any) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
          {value}
        </span>
      ),
    },
    {
      key: 'users' as const,
      label: 'Active Users',
      sortable: true,
      render: (value: any) => value.toLocaleString(),
    },
    {
      key: 'performance' as const,
      label: 'Performance Score',
      sortable: true,
      render: (value: any) => (
        <div className="glass-flex glass-items-center glass-gap-2">
          <span className="font-mono">{value}/100</span>
          <div className={`px-1 py-0.5 rounded text-xs ${
            value >= 90 ? 'bg-green-100 text-green-800' : 
            value >= 70 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
          }`}>
            {value >= 90 ? 'A' : value >= 70 ? 'B' : 'C'}
          </div>
        </div>
      ),
    },
  ];

  const handleFileUpload = async (files: File[]) => {
    info('Upload started', `Uploading ${files.length} file(s)...`);
    
    // Simulate upload
    setTimeout(() => {
      success('Upload complete', 'All files uploaded successfully!');
    }, ANIMATION.DURATION.slower * 3);
  };

  const showPerformanceDemo = () => {
    info('Performance Check', `Current FPS: ${performance.metrics.fps}, Score: ${performance.getPerformanceScore()}/100`);
  };

  const showAccessibilityDemo = () => {
    accessibility.announce('Accessibility features are active', 'polite');
    success('Accessibility Demo', 'Screen reader announcement sent');
  };

  return (
    <div
      className={`transition-colors duration-[${ANIMATION.DURATION.normal}ms] glass-gradient-primary glass-gradient-primary via-blue-50 glass-gradient-primary`}
      style={{ minHeight: '100%', overflow: 'clip' }}
    >
      <div className="glass-relative glass-z-10 glass-p-6 md:glass-p-8">
        <div className="max-w-7xl glass-mx-auto">
          {/* Header */}
          <div className="glass-text-center mb-8">
            <div className="glass-glass-inline-glass-flex glass-items-center glass-gap-3 mb-4 glass-px-5 glass-py-2 glass-radius-full glass-surface-subtle bg-opacity-60 glass-backdrop-blur glass-border glass-border-white glass-border-opacity-20">
              <div className="glass-w-3 glass-h-3 glass-surface-green glass-radius-full animate-pulse" />
              <span className="glass-text-sm glass-font-medium tracking-wide glass-text-secondary">
                COMPREHENSIVE GLASS SYSTEM
              </span>
            </div>
            <h1 className="glass-text-4xl glass-font-bold glass-mb-3 glass-text-secondary">
              Complete UI/UX System
            </h1>
            <p className="glass-text-xl max-w-4xl glass-mx-auto leading-relaxed glass-text-secondary">
              Practical components, performance optimization, accessibility features, 
              and developer tools - everything users and developers actually need.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="glass-grid glass-glass-grid-cols-2 md:glass-glass-grid-cols-4 glass-gap-4 mb-8">
            <button
              onClick={showPerformanceDemo}
              className="glass-surface-blue hover:glass-surface-blue glass-text-primary glass-font-semibold glass-py-3 glass-px-4 glass-radius-lg transition-colors glass-shadow-lg hover:glass-shadow-xl glass-focus glass-touch-target glass-contrast-guard glass-focus glass-touch-target glass-contrast-guard"
            >
              📊 Performance Check
            </button>
            <button
              onClick={showAccessibilityDemo}
              className="glass-surface-green hover:glass-surface-green glass-text-primary glass-font-semibold glass-py-3 glass-px-4 glass-radius-lg transition-colors glass-shadow-lg hover:glass-shadow-xl glass-focus glass-touch-target glass-contrast-guard glass-focus glass-touch-target glass-contrast-guard"
            >
              ♿ Accessibility Test
            </button>
            <button
              onClick={() => success('Feature Demo', 'Toast notification system working perfectly!')}
              className="glass-surface-primary hover:glass-surface-primary glass-text-primary glass-font-semibold glass-py-3 glass-px-4 glass-radius-lg transition-colors glass-shadow-lg hover:glass-shadow-xl"
            >
              🔔 Show Toast
            </button>
            <button
              onClick={() => error('Demo Error', 'This is a demo error message with action button.', {
                action: { label: 'Retry', onClick: () => info('Retrying...', 'Operation retried successfully.') }
              })}
              className="glass-surface-red hover:glass-surface-red glass-text-primary glass-font-semibold glass-py-3 glass-px-4 glass-radius-lg transition-colors glass-shadow-lg hover:glass-shadow-xl"
            >
              ⚠️ Demo Error
            </button>
          </div>

          {/* Components Grid */}
          <div className="glass-grid glass-glass-grid-cols-1 lg:glass-glass-grid-cols-2 glass-gap-6 mb-8">
            {/* Data Table */}
            <div className="glass-space-y-4">
              <h2 className="glass-text-2xl glass-font-semibold glass-text-secondary">📊 Smart Data Table</h2>
              <p className="glass-text-secondary">Full-featured table with sorting, filtering, pagination, and loading states.</p>
              <GlassDataTable
                data={tableData}
                columns={tableColumns}
                pageSize={3}
                searchable={true}
                paginated={true}
              />
            </div>

            {/* File Upload */}
            <div className="glass-space-y-4">
              <h2 className="glass-text-2xl glass-font-semibold glass-text-secondary">📁 File Upload System</h2>
              <p className="glass-text-secondary">Advanced upload with drag & drop, progress tracking, and validation.</p>
              <GlassFileUpload
                accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                maxSize={5 * 1024 * 1024}
                maxFiles={3}
                onUpload={handleFileUpload}
                uploadText="Drop your files here or click to browse"
                showPreview={true}
              />
            </div>
          </div>

          {/* Features Overview */}
          <div className="glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-3 glass-gap-6 mb-8">
            <Glass className="glass-p-6 glass-text-center">
              <div className="glass-text-4xl glass-mb-4">⚡</div>
              <h3 className="glass-text-lg glass-font-semibold glass-text-secondary glass-mb-2">Performance First</h3>
              <p className="glass-text-secondary glass-text-sm glass-mb-4">
                Real-time performance monitoring, adaptive quality, and optimization recommendations.
              </p>
              <div className="glass-text-xs glass-text-secondary">
                Current Score: {performance.getPerformanceScore()}/100 ({performance.getGrade()})
              </div>
            </Glass>

            <Glass className="glass-p-6 glass-text-center">
              <div className="glass-text-4xl glass-mb-4">♿</div>
              <h3 className="glass-text-lg glass-font-semibold glass-text-secondary glass-mb-2">Accessibility Built-in</h3>
              <p className="glass-text-secondary glass-text-sm glass-mb-4">
                WCAG compliance, screen reader support, keyboard navigation, and user preferences.
              </p>
              <div className="glass-text-xs glass-text-secondary">
                Font: {accessibility.settings.fontSize} • Contrast: {accessibility.settings.contrast}
              </div>
            </Glass>

            <Glass className="glass-p-6 glass-text-center">
              <div className="glass-text-4xl glass-mb-4">🛠️</div>
              <h3 className="glass-text-lg glass-font-semibold glass-text-secondary glass-mb-2">Developer Tools</h3>
              <p className="glass-text-secondary glass-text-sm glass-mb-4">
                Built-in DevTools with performance monitoring, accessibility testing, and element inspector.
              </p>
              <div className="glass-text-xs glass-text-secondary">
                Check bottom-right corner for DevTools
              </div>
            </Glass>
          </div>

          {/* Technical Details */}
          <Glass className="glass-p-8">
            <h2 className="glass-text-2xl glass-font-semibold glass-text-secondary mb-6">🚀 What's Included</h2>
            <div className="glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 glass-gap-8">
              <div>
                <h3 className="glass-text-lg glass-font-semibold glass-text-secondary glass-mb-4">Real-World Components</h3>
                <ul className="glass-space-y-2 glass-text-sm glass-text-secondary">
                  <li>✅ <strong>GlassDataTable:</strong> Full-featured data tables with sorting, filtering, pagination</li>
                  <li>✅ <strong>GlassToast:</strong> Complete notification system with multiple types and positions</li>
                  <li>✅ <strong>GlassFileUpload:</strong> Advanced file upload with drag & drop and progress tracking</li>
                  <li>✅ <strong>GlassFormTemplate:</strong> Multi-step forms with validation and progress indicators</li>
                </ul>
              </div>
              <div>
                <h3 className="glass-text-lg glass-font-semibold glass-text-secondary glass-mb-4">Advanced Features</h3>
                <ul className="glass-space-y-2 glass-text-sm glass-text-secondary">
                  <li>✅ <strong>Performance Monitoring:</strong> Real-time FPS, memory usage, Web Vitals tracking</li>
                  <li>✅ <strong>Accessibility System:</strong> Screen reader support, keyboard navigation, user preferences</li>
                  <li>✅ <strong>Developer Tools:</strong> Built-in DevTools with inspector, console, and performance tabs</li>
                  <li>✅ <strong>TypeScript Support:</strong> Full type safety with comprehensive interfaces</li>
                </ul>
              </div>
            </div>

            <div className="mt-8 glass-p-6 glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-xl">
              <h3 className="glass-text-lg glass-font-semibold glass-text-secondary glass-mb-2">💡 Key Benefits</h3>
              <div className="glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-3 glass-gap-4 glass-text-sm">
                <div>
                  <strong className="glass-text-primary">For Users:</strong>
                  <ul className="mt-2 space-y-1 glass-text-secondary">
                    <li>• Faster, more responsive interfaces</li>
                    <li>• Better accessibility support</li>
                    <li>• Consistent user experience</li>
                  </ul>
                </div>
                <div>
                  <strong className="glass-text-primary">For Developers:</strong>
                  <ul className="mt-2 space-y-1 glass-text-secondary">
                    <li>• Built-in performance monitoring</li>
                    <li>• Comprehensive developer tools</li>
                    <li>• Type-safe component library</li>
                  </ul>
                </div>
                <div>
                  <strong className="glass-text-primary">For Business:</strong>
                  <ul className="mt-2 space-y-1 glass-text-secondary">
                    <li>• Reduced development time</li>
                    <li>• Better user satisfaction</li>
                    <li>• Compliance with accessibility standards</li>
                  </ul>
                </div>
              </div>
            </div>
          </Glass>
        </div>
      </div>

      {/* Developer Tools (bottom-right corner) */}
      <GlassDevTools position="bottom-right" />
    </div>
  );
};

type Story = StoryObj;

export const Complete: Story = {
  render: () => (
    <ToastProvider position="top-right" maxToasts={5}>
      <ShowcaseStoryFrame>
        <ShowcaseDemo />
      </ShowcaseStoryFrame>
    </ToastProvider>
  ),
};
