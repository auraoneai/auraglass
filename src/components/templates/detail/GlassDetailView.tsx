import React, { forwardRef, useState } from 'react';
import { GlassButton, IconButton } from '@/components/button';
import { cn } from '../../../lib/utilsComprehensive';
import { GlassCard } from '@/components/card';
import { GlassBadge } from '@/components/data-display';
import { GlassGrid, GlassGridItem } from '@/components/layout';
import { HStack, VStack } from '@/components/layout';
import { Motion } from '@/primitives';

export interface DetailField {
  id: string;
  label: string;
  value: any;
  type?: 'text' | 'number' | 'date' | 'boolean' | 'badge' | 'link' | 'custom';
  render?: (value: any) => React.ReactNode;
  copyable?: boolean;
  width?: 'auto' | 'full' | 'half' | 'third' | 'quarter';
}

export interface DetailSection {
  id: string;
  title: string;
  description?: string;
  fields?: DetailField[];
  component?: React.ReactNode;
  collapsible?: boolean;
  defaultExpanded?: boolean;
}

export interface DetailTab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
  content: React.ReactNode;
}

export interface DetailAction {
  id: string;
  label: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'error';
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export interface GlassDetailViewProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Detail item title
   */
  title: string;
  /**
   * Detail item subtitle
   */
  subtitle?: string;
  /**
   * Status badge
   */
  status?: {
    label: string;
    variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  };
  /**
   * Breadcrumb navigation
   */
  breadcrumb?: React.ReactNode;
  /**
   * Header actions
   */
  actions?: DetailAction[];
  /**
   * Detail sections
   */
  sections?: DetailSection[];
  /**
   * Detail tabs
   */
  tabs?: DetailTab[];
  /**
   * Active tab
   */
  activeTab?: string;
  /**
   * Tab change handler
   */
  onTabChange?: (tabId: string) => void;
  /**
   * Layout variant
   */
  layout?: 'default' | 'sidebar' | 'tabs' | 'accordion';
  /**
   * Sidebar content (for sidebar layout)
   */
  sidebar?: React.ReactNode;
  /**
   * Loading state
   */
  loading?: boolean;
  /**
   * Error state
   */
  error?: string;
  /**
   * Back action
   */
  onBack?: () => void;
  /**
   * Share action
   */
  onShare?: () => void;
  /**
   * Print action
   */
  onPrint?: () => void;
}

/**
 * GlassDetailView component
 * Comprehensive detail view with multiple layout options
 */
export const GlassDetailView = forwardRef<HTMLDivElement, GlassDetailViewProps>(
  (
    {
      title,
      subtitle,
      status,
      breadcrumb,
      actions = [],
      sections = [],
      tabs = [],
      activeTab,
      onTabChange,
      layout = 'default',
      sidebar,
      loading = false,
      error,
      onBack,
      onShare,
      onPrint,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [expandedSections, setExpandedSections] = useState<Set<string>>(
      new Set(sections.filter((s: any) => s.defaultExpanded !== false).map((s: any) => s.id))
    );
    const [currentTab, setCurrentTab] = useState(activeTab || tabs[0]?.id);

    // Toggle section expansion
    const toggleSection = (sectionId: string) => {
      const newExpanded = new Set(expandedSections);
      if (newExpanded.has(sectionId)) {
        newExpanded.delete(sectionId);
      } else {
        newExpanded.add(sectionId);
      }
      setExpandedSections(newExpanded);
    };

    // Handle tab change
    const handleTabChange = (tabId: string) => {
      setCurrentTab(tabId);
      onTabChange?.(tabId);
    };

    // Render field value
    const renderFieldValue = (field: DetailField) => {
      if (field.render) {
        return field.render(field.value);
      }

      switch (field.type) {
        case 'boolean':
          return (
            <GlassBadge data-glass-component variant={field.value ? 'success' : 'error'} size="xs">
              {field.value ? 'Yes' : 'No'}
            </GlassBadge>
          );
        case 'badge':
          return (
            <GlassBadge variant="outline" size="xs">
              {field.value}
            </GlassBadge>
          );
        case 'link':
          return (
            <a
              href={field.value}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              {field.value}
            </a>
          );
        case 'date':
          return new Date(field.value).toLocaleDateString();
        case 'number':
          return typeof field.value === 'number' ? field.value.toLocaleString() : field.value;
        default:
          return field.value;
      }
    };

    // Render field
    const renderField = (field: DetailField) => {
      const widthClasses = {
        auto: 'w-auto',
        full: 'w-full',
        half: 'w-1/2',
        third: 'w-1/3',
        quarter: 'w-1/4',
      };

      return (
        <div key={field.id} className={cn('glass-auto-gap glass-auto-gap-xs', widthClasses[field.width || 'auto'])}>
          <label className="text-sm font-medium glass-text-secondary">
            {field.label}
          </label>
          <HStack space="sm" align="center">
            <div className="text-sm text-primary">
              {renderFieldValue(field)}
            </div>
            {field.copyable && (
              <IconButton
                icon="📋"
                variant="ghost"
                size="xs"
                onClick={(e) => navigator.clipboard?.writeText(String(field.value))}
                aria-label="Copy to clipboard"
              />
            )}
          </HStack>
        </div>
      );
    };

    // Render section
    const renderSection = (section: DetailSection) => {
      const isExpanded = expandedSections.has(section.id);

      return (
        <Motion key={section.id} type="slide" direction="down">
          <GlassCard variant="default">
            {/* Section header */}
            <div
              className={cn(
                'flex items-center justify-between',
                section.collapsible && 'cursor-pointer'
              )}
              onClick={section.collapsible ? () => toggleSection(section.id) : undefined}
            >
              <VStack space="xs">
                <h3 className="text-lg font-semibold text-primary">
                  {section.title}
                </h3>
                {section.description && (
                  <p className="text-sm glass-text-secondary">
                    {section.description}
                  </p>
                )}
              </VStack>

              {section.collapsible && (
                <GlassButton
                  leftIcon={isExpanded ? "−" : "+"}
                  variant="ghost"
                  size="sm"
                  aria-label={isExpanded ? 'Collapse section' : 'Expand section'}
                />
              )}
            </div>

            {/* Section content */}
            {(!section.collapsible || isExpanded) && (
              <Motion type="slide" direction="down" className="mt-6">
                {section.component ? (
                  section.component
                ) : section.fields ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {section.fields.map(renderField)}
                  </div>
                ) : null}
              </Motion>
            )}
          </GlassCard>
        </Motion>
      );
    };

    // Render tabs
    const renderTabs = () => {
      if (tabs.length === 0) return null;

      return (
        <VStack space="md">
          {/* Tab navigation */}
          <div className="border-b border-glass-border/20">
            <nav className="flex space-x-8">
              {tabs.map((tab) => (
                <GlassButton
                  key={tab.id}
                  onClick={(e) => handleTabChange(tab.id)}
                  className={cn(
                    'flex items-center glass-gap-2 glass-py-2 glass-px-1 border-b-2 transition-colors',
                    currentTab === tab.id
                      ? 'border-primary text-primary font-medium'
                      : 'border-transparent glass-text-secondary hover:text-foreground'
                  )}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <GlassBadge variant="outline" size="xs">
                      {tab.badge}
                    </GlassBadge>
                  )}
                </GlassButton>
              ))}
            </nav>
          </div>

          {/* Tab content */}
          <div>
            {tabs.find(tab => tab.id === currentTab)?.content}
          </div>
        </VStack>
      );
    };

    // Render header
    const renderHeader = () => (
      <VStack space="md">
        {/* Breadcrumb */}
        {breadcrumb && (
          <div className="text-sm glass-text-secondary">
            {breadcrumb}
          </div>
        )}

        {/* Title section */}
        <HStack space="md" align="center" justify="between">
          <HStack space="md" align="center">
            {onBack && (
              <GlassButton
                leftIcon="←"
                variant="ghost"
                size="sm"
                onClick={onBack}
                aria-label="Go back"
              />
            )}

            <VStack space="xs">
              <HStack space="sm" align="center">
                <h1 className="text-2xl font-bold text-primary">
                  {title}
                </h1>
                {status && (
                  <GlassBadge variant={status.variant} size="sm">
                    {status.label}
                  </GlassBadge>
                )}
              </HStack>

              {subtitle && (
                <p className="text-lg glass-text-secondary">
                  {subtitle}
                </p>
              )}
            </VStack>
          </HStack>

          {/* Actions */}
          <HStack space="sm" align="center">
            {onShare && (
              <GlassButton
                leftIcon="📤"
                variant="ghost"
                size="sm"
                onClick={onShare}
                aria-label="Share"
              />
            )}

            {onPrint && (
              <GlassButton
                leftIcon="🖨️"
                variant="ghost"
                size="sm"
                onClick={onPrint}
                aria-label="Print"
              />
            )}

            {actions.map((action) => (
              <GlassButton
                key={action.id}
                variant={action.variant}
                size="sm"
                leftIcon={action.icon}
                onClick={action.onClick}
                disabled={action.disabled}
                loading={action.loading}
              >
                {action.label}
              </GlassButton>
            ))}
          </HStack>
        </HStack>
      </VStack>
    );

    // Render content based on layout
    const renderContent = () => {
      if (loading) {
        return (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent glass-radius-full animate-spin" />
          </div>
        );
      }

      if (error) {
        return (
          <GlassCard variant="default" className="p-8 text-center">
            <div className="text-destructive font-medium mb-2">Error</div>
            <div className="glass-text-secondary">{error}</div>
          </GlassCard>
        );
      }

      switch (layout) {
        case 'sidebar':
          return (
            <GlassGrid cols={12} gap="lg">
              <GlassGridItem colSpan={8}>
                <VStack space="lg">
                  {tabs.length > 0 ? renderTabs() : (
                    sections.map(renderSection)
                  )}
                  {children}
                </VStack>
              </GlassGridItem>
              <GlassGridItem colSpan={4}>
                {sidebar}
              </GlassGridItem>
            </GlassGrid>
          );

        case 'tabs':
          return renderTabs();

        case 'accordion':
          return (
            <VStack space="md">
              {sections.map((section: any) => ({
                ...section,
                collapsible: true,
              })).map(renderSection)}
              {children}
            </VStack>
          );

        default:
          return (
            <VStack space="lg">
              {sections.map(renderSection)}
              {tabs.length > 0 && renderTabs()}
              {children}
            </VStack>
          );
      }
    };

    return (
      <div ref={ref} className={cn('w-full glass-auto-gap glass-auto-gap-3xl', className)} {...props}>
        {/* Header */}
        {renderHeader()}

        {/* Content */}
        {renderContent()}
      </div>
    );
  }
);

GlassDetailView.displayName = 'GlassDetailView';
