/**
 * GlassThemeDemo Component
 *
 * A comprehensive theme demo component to showcase themed Glass UI components.
 * Migrated to use OptimizedGlass architecture.
 */
import React, { forwardRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { OptimizedGlass, Motion } from '../../primitives';
import { useReducedMotion } from '../../hooks/useReducedMotion';

import { GlassAlert as Alert } from '../data-display/GlassAlert';
import { GlassAvatar as Avatar } from '../data-display/GlassAvatar';
import { GlassBadge as Badge } from '../data-display/GlassBadge';
import { Box } from '../layout/Box';
import { GlassButton as Button } from '../button';
import { GlassCard as Card } from '../card';
import { GlassCheckbox as Checkbox } from '../input/GlassCheckbox';
import { GlassMetricChip as Chip } from '../data-display/GlassMetricChip';
import { GlassProgress as Progress } from '../data-display/GlassProgress';
import { GlassRadioGroup as Radio } from '../input/GlassRadioGroup';
import { GlassSelect as Select } from '../input/GlassSelect';
import { GlassSlider as Slider } from '../input/GlassSlider';
import { GlassSwitch as Switch } from '../input/GlassSwitch';
import { GlassTabs as Tabs, GlassTabsContent as TabsContent, GlassTabsList, GlassTabsTrigger } from '../navigation/GlassTabs';
import { GlassInput as TextField } from '../input/GlassInput';
import { Typography } from '../data-display/Typography';

import { GlassThemeSwitcher } from './GlassThemeSwitcher';
import { CursorGlow } from './CursorGlow';
import { GlassThemeDemoProps } from './types';

// Helper to map glass intensity to elevation level
const mapIntensityToElevation = (intensity: number): 'level1' | 'level2' | 'level3' | 'level4' => {
  if (intensity <= 0.3) return 'level1';
  if (intensity <= 0.6) return 'level2';
  if (intensity <= 0.8) return 'level3';
  return 'level4';
};

// Categories of components to showcase
const COMPONENT_CATEGORIES = {
  inputs: 'Input Components',
  feedback: 'Feedback Components',
  layout: 'Layout Components',
  navigation: 'Navigation Components',
  display: 'Display Components',
};

/**
 * GlassThemeDemo Component
 *
 * A comprehensive theme demo component to showcase themed Glass UI components.
 * Now optimized with OptimizedGlass architecture for better performance.
 */
export const GlassThemeDemo = forwardRef<HTMLDivElement, GlassThemeDemoProps>(
  (
    {
      title = 'Glass UI Theme Demo',
      description = 'Explore different theme options and see how components adapt to theme changes.',
      showThemeSwitcher = true,
      showExamples = true,
      customExamples,
      glassIntensity = 0.7,
      className,
      style,
      header,
      footer,
      showPerformanceMetrics = false,
      useTabs = true,
      showCode = false,
      interactive = true,
      includedCategories = Object.keys(COMPONENT_CATEGORIES),
      minimal = false,
      animation,
      ...rest
    }: GlassThemeDemoProps,
    ref
  ) => {
    const prefersReducedMotion = useReducedMotion();
    const [activeTab, setActiveTab] = useState(0);
    
    // Map glass intensity to elevation level
    const elevation = mapIntensityToElevation(glassIntensity);

    // Example components by category
    const categoryExamples = {
      inputs: (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 glass-mt-4">
          <Card className={cn(
            'p-5 h-full flex flex-col',
            'transition-all duration-200',
            !prefersReducedMotion && 'hover:scale-[1.02]'
          )}>
            <Typography variant="h6" className="mb-4 font-semibold">Button</Typography>
            <Box style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Button variant="primary">Primary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
            </Box>
            {showCode && (
              <pre className="glass-surface-dark/10 glass-radius-md p-3 font-mono text-sm overflow-auto glass-mt-4">
                {`<Button variant="contained">Contained</Button>
<Button variant="outlined">Outlined</Button>
<Button variant="text">Text</Button>`}
              </pre>
            )}
          </Card>

          <Card className={cn(
            'p-5 h-full flex flex-col',
            'transition-all duration-200',
            !prefersReducedMotion && 'hover:scale-[1.02]'
          )}>
            <Typography variant="h6" className="mb-4 font-semibold">Text Field</Typography>
            <Box style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <TextField placeholder="Standard" />
              <TextField placeholder="With placeholder" />
              <TextField placeholder="Disabled" disabled />
            </Box>
            {showCode && (
              <pre className="glass-surface-dark/10 glass-radius-md p-3 font-mono text-sm overflow-auto glass-mt-4">
                {`<TextField label="Standard" />
<TextField label="With placeholder" placeholder="Type here..." />
<TextField label="Disabled" disabled />`}
              </pre>
            )}
          </Card>

          <Card className={cn(
            'p-5 h-full flex flex-col',
            'transition-all duration-200',
            !prefersReducedMotion && 'hover:scale-[1.02]'
          )}>
            <Typography variant="h6" className="mb-4 font-semibold">Select</Typography>
            <Select
              placeholder="Select Option"
              options={[
                { value: 'option1', label: 'Option 1' },
                { value: 'option2', label: 'Option 2' },
                { value: 'option3', label: 'Option 3' },
              ]}
            />
            {showCode && (
              <pre className="glass-surface-dark/10 glass-radius-md p-3 font-mono text-sm overflow-auto glass-mt-4">
                {`<Select
  label="Select Option"
  options={[
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ]}
/>`}
              </pre>
            )}
          </Card>

          <Card className={cn(
            'p-5 h-full flex flex-col',
            'transition-all duration-200',
            !prefersReducedMotion && 'hover:scale-[1.02]'
          )}>
            <Typography variant="h6" className="mb-4 font-semibold">Checkbox & Radio</Typography>
            <Box style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Checkbox label="Checkbox Option" />
              <Radio options={[{ value: 'radio1', label: 'Radio Option' }]} />
              <Switch label="Switch Option" />
            </Box>
            {showCode && (
              <pre className="glass-surface-dark/10 glass-radius-md p-3 font-mono text-sm overflow-auto glass-mt-4">
                {`<Checkbox label="Checkbox Option" />
<Radio label="Radio Option" name="radio-group" />
<Switch label="Switch Option" />`}
              </pre>
            )}
          </Card>

          <Card className={cn(
            'p-5 h-full flex flex-col',
            'transition-all duration-200',
            !prefersReducedMotion && 'hover:scale-[1.02]'
          )}>
            <Typography variant="h6" className="mb-4 font-semibold">Slider</Typography>
            <Slider defaultValue={50} aria-label="Slider" />
            {showCode && (
              <pre className="glass-surface-dark/10 glass-radius-md p-3 font-mono text-sm overflow-auto glass-mt-4">{`<Slider defaultValue={50} aria-label="Slider" />`}</pre>
            )}
          </Card>
        </div>
      ),

      feedback: (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 glass-mt-4">
          <Card className={cn(
            'p-5 h-full flex flex-col',
            'transition-all duration-200',
            !prefersReducedMotion && 'hover:scale-[1.02]'
          )}>
            <Typography variant="h6" className="mb-4 font-semibold">Alert</Typography>
            <Box style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Alert variant="info">Info message</Alert>
              <Alert variant="success">Success message</Alert>
              <Alert variant="warning">Warning message</Alert>
              <Alert variant="error">Error message</Alert>
            </Box>
            {showCode && (
              <pre className="glass-surface-dark/10 glass-radius-md p-3 font-mono text-sm overflow-auto glass-mt-4">
                {`<Alert severity="info">Info message</Alert>
<Alert severity="success">Success message</Alert>
<Alert severity="warning">Warning message</Alert>
<Alert severity="error">Error message</Alert>`}
              </pre>
            )}
          </Card>

          <Card className={cn(
            'p-5 h-full flex flex-col',
            'transition-all duration-200',
            !prefersReducedMotion && 'hover:scale-[1.02]'
          )}>
            <Typography variant="h6" className="mb-4 font-semibold">Progress</Typography>
            <Box style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Progress variant="primary" value={75} />
              <Progress variant="gradient" indeterminate />
            </Box>
            {showCode && (
              <pre className="glass-surface-dark/10 glass-radius-md p-3 font-mono text-sm overflow-auto glass-mt-4">
                {`<Progress variant="determinate" value={75} />
<Progress variant="indeterminate" />`}
              </pre>
            )}
          </Card>

          <Card className={cn(
            'p-5 h-full flex flex-col',
            'transition-all duration-200',
            !prefersReducedMotion && 'hover:scale-[1.02]'
          )}>
            <Typography variant="h6" className="mb-4 font-semibold">Badge</Typography>
            <Box style={{ display: 'flex', gap: '16px' }}>
              <Badge content="4">
                <Button>Messages</Button>
              </Badge>
              <Badge content="New" variant="destructive">
                <Button>Updates</Button>
              </Badge>
            </Box>
            {showCode && (
              <pre className="glass-surface-dark/10 glass-radius-md p-3 font-mono text-sm overflow-auto glass-mt-4">
                {`<Badge content={4}>
  <Button>Messages</Button>
</Badge>
<Badge content="New" color="error">
  <Button>Updates</Button>
</Badge>`}
              </pre>
            )}
          </Card>
        </div>
      ),

      layout: (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 glass-mt-4">
          <Card className={cn(
            'p-5 h-full flex flex-col',
            'transition-all duration-200',
            !prefersReducedMotion && 'hover:scale-[1.02]'
          )}>
            <Typography variant="h6" className="mb-4 font-semibold">Card</Typography>
            <Card>
              <Box style={{ padding: '16px' }}>
                <Typography variant="h4">Card Title</Typography>
                <Typography variant="p">Card content with text</Typography>
                <Box style={{ marginTop: '16px' }}>
                  <Button size="sm">Action</Button>
                </Box>
              </Box>
            </Card>
            {showCode && (
              <pre className="glass-surface-dark/10 glass-radius-md p-3 font-mono text-sm overflow-auto glass-mt-4">
                {`<Card>
  <Box p={2}>
    <Typography variant="h6">Card Title</Typography>
    <Typography variant="body2">Card content with text</Typography>
    <Box mt={2}>
      <Button size="small">Action</Button>
    </Box>
  </Box>
</Card>`}
              </pre>
            )}
          </Card>

          <Card className={cn(
            'p-5 h-full flex flex-col',
            'transition-all duration-200',
            !prefersReducedMotion && 'hover:scale-[1.02]'
          )}>
            <Typography variant="h6" className="mb-4 font-semibold">Paper Card</Typography>
            <Card>
              <Box style={{ padding: '16px' }}>
                <Typography>Paper Component</Typography>
              </Box>
            </Card>
            {showCode && (
              <pre className="glass-surface-dark/10 glass-radius-md p-3 font-mono text-sm overflow-auto glass-mt-4">
                {`<Paper elevation={'level2'}>
  <Box p={2}>
    <Typography>Paper Component</Typography>
  </Box>
</Paper>`}
              </pre>
            )}
          </Card>

          <Card className={cn(
            'p-5 h-full flex flex-col',
            'transition-all duration-200',
            !prefersReducedMotion && 'hover:scale-[1.02]'
          )}>
            <Typography variant="h6" className="mb-4 font-semibold">Box Layout</Typography>
            <Box>
              <Typography>Above divider</Typography>
              <Box style={{ marginTop: '16px', marginBottom: '16px', borderTop: '1px solid rgba(var(--glass-color-black) / var(--glass-opacity-10))' }} />
              <Typography>Below divider</Typography>
            </Box>
            {showCode && (
              <pre className="glass-surface-dark/10 glass-radius-md p-3 font-mono text-sm overflow-auto glass-mt-4">
                {`<Typography>Above divider</Typography>
<Divider style={{ marginTop: '16px', marginBottom: '16px' }} />
<Typography>Below divider</Typography>`}
              </pre>
            )}
          </Card>
        </div>
      ),

      navigation: (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 glass-mt-4">
          <Card className={cn(
            'p-5 h-full flex flex-col',
            'transition-all duration-200',
            !prefersReducedMotion && 'hover:scale-[1.02]'
          )}>
            <Typography variant="h6" className="mb-4 font-semibold">Tabs</Typography>
            <Tabs defaultValue="tab1">
              <GlassTabsList>
                <GlassTabsTrigger value="tab1">Tab 1</GlassTabsTrigger>
                <GlassTabsTrigger value="tab2">Tab 2</GlassTabsTrigger>
                <GlassTabsTrigger value="tab3">Tab 3</GlassTabsTrigger>
              </GlassTabsList>
              <TabsContent value="tab1">Tab 1 Content</TabsContent>
              <TabsContent value="tab2">Tab 2 Content</TabsContent>
              <TabsContent value="tab3">Tab 3 Content</TabsContent>
            </Tabs>
            {showCode && (
              <pre className="glass-surface-dark/10 glass-radius-md p-3 font-mono text-sm overflow-auto glass-mt-4">
                {`<Tabs value={0}>
   <TabPanel value={0} index={0}>Tab 1 Content</TabPanel>
   <TabPanel value={0} index={1}>Tab 2 Content</TabPanel>
   <TabPanel value={0} index={2}>Tab 3 Content</TabPanel>
</Tabs>`}
              </pre>
            )}
          </Card>
        </div>
      ),

      display: (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 glass-mt-4">
          <Card className={cn(
            'p-5 h-full flex flex-col',
            'transition-all duration-200',
            !prefersReducedMotion && 'hover:scale-[1.02]'
          )}>
            <Typography variant="h6" className="mb-4 font-semibold">Typography</Typography>
            <Box style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Typography variant="h3">Heading 3</Typography>
              <Typography variant="h5">Heading 5</Typography>
              <Typography variant="h6">Subtitle 1</Typography>
              <Typography variant="p">Body 1 text</Typography>
              <Typography variant="span">Body 2 text</Typography>
              <Typography variant="p">Caption text</Typography>
            </Box>
            {showCode && (
              <pre className="glass-surface-dark/10 glass-radius-md p-3 font-mono text-sm overflow-auto glass-mt-4">
                {`<Typography variant="h3">Heading 3</Typography>
<Typography variant="h5">Heading 5</Typography>
<Typography variant="subtitle1">Subtitle 1</Typography>
<Typography variant="body1">Body 1 text</Typography>
<Typography variant="body2">Body 2 text</Typography>
<Typography variant="caption">Caption text</Typography>`}
              </pre>
            )}
          </Card>

          <Card className={cn(
            'p-5 h-full flex flex-col',
            'transition-all duration-200',
            !prefersReducedMotion && 'hover:scale-[1.02]'
          )}>
            <Typography variant="h6" className="mb-4 font-semibold">Chip</Typography>
            <Box style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <Chip label="Basic" value="10" />
              <Chip label="Success" value="5" intent="success" />
              <Chip label="Warning" value="3" intent="warning" />
              <Chip label="Danger" value="1" intent="danger" />
            </Box>
            {showCode && (
              <pre className="glass-surface-dark/10 glass-radius-md p-3 font-mono text-sm overflow-auto glass-mt-4">
                {`<Chip label="Basic" />
<Chip label="Clickable" onClick={(e) => {}} />
<Chip label="Deletable" onDelete={() => {}} />
<Chip label="With Avatar">`}
              </pre>
            )}
          </Card>

          <Card className={cn(
            'p-5 h-full flex flex-col',
            'transition-all duration-200',
            !prefersReducedMotion && 'hover:scale-[1.02]'
          )}>
            <Typography variant="h6" className="mb-4 font-semibold">Avatar</Typography>
            <Box style={{ display: 'flex', gap: '8px' }}>
              <Avatar>A</Avatar>
              <Avatar>B</Avatar>
              <Avatar alt="User" />
            </Box>
            {showCode && (
              <pre className="glass-surface-dark/10 glass-radius-md p-3 font-mono text-sm overflow-auto glass-mt-4">
                {`<Avatar>A</Avatar>
<Avatar color="primary">B</Avatar>
<Avatar alt="User" />`}
              </pre>
            )}
          </Card>
        </div>
      ),
    };

    // Filter categories based on includedCategories prop
    const filteredCategories = Object.entries(COMPONENT_CATEGORIES)
      .filter(([key]) => includedCategories.includes(key))
      .map(([key, label]) => ({ key, label }));

    return (
      <OptimizedGlass
        ref={ref}
        elevation={elevation}
        tier="high"
        className={cn(
          'flex flex-col glass-gap-6 w-full glass-radius-xl',
          minimal ? 'glass-p-4' : 'p-8',
          'relative overflow-hidden',
          className
        )}
        style={style}
        {...rest}
      >
        {/* Local cursor glow overlay for theme showcase */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} aria-hidden>
          <CursorGlow global={false} size={280} opacity={0.14} intensity={0.6} />
        </div>

        {/* Custom header or default header */}
        <header className="mb-4">
          {header || (
            <>
              <Typography variant="h4" style={{ marginBottom: '8px' }}>
                {title}
              </Typography>
              {typeof description === 'string' ? (
                <Typography variant="p">{description}</Typography>
              ) : (
                description
              )}
            </>
          )}
        </header>

        {/* Theme switcher */}
        {showThemeSwitcher && (
          <section className="mt-6">
            <GlassThemeSwitcher compact={minimal} themes={[]} />
          </section>
        )}

        {/* Component examples */}
        {showExamples && (
          <section className="mt-6">
            {useTabs && filteredCategories.length > 1 ? (
              <>
                <Tabs defaultValue={filteredCategories[0]?.key}>
                  <GlassTabsList>
                    {filteredCategories.map(({ key, label }) => (
                      <GlassTabsTrigger key={key} value={key}>
                        {label}
                      </GlassTabsTrigger>
                    ))}
                  </GlassTabsList>
                  {filteredCategories.map(({ key, label }) => (
                    <TabsContent key={key} value={key}>
                      {categoryExamples[key as keyof typeof categoryExamples]}
                    </TabsContent>
                  ))}
                </Tabs>
              </>
            ) : (
              // Show all categories without tabs
              <>
                {filteredCategories.map(({ key, label }) => (
                  <Box key={key} style={{ marginTop: '12px', marginBottom: '8px' }}>
                    <Typography variant="h5" style={{ marginBottom: '16px' }}>
                      {label}
                    </Typography>
                    {categoryExamples[key as keyof typeof categoryExamples]}
                  </Box>
                ))}
              </>
            )}
          </section>
        )}

        {/* Custom examples */}
        {customExamples && (
          <section className="mt-6">
            <Typography variant="h5" style={{ marginBottom: '16px' }}>
              Custom Examples
            </Typography>
            {customExamples}
          </section>
        )}

        {/* Performance metrics */}
        {showPerformanceMetrics && (
          <section className="mt-6">
            <Typography variant="h5" style={{ marginBottom: '16px' }}>
              Performance Metrics
            </Typography>
            <Card>
              <Box style={{ padding: '16px' }}>
                <Typography>Theme performance metrics and optimization data</Typography>
              </Box>
            </Card>
          </section>
        )}

        {/* Footer */}
        {footer && (
          <Box style={{ marginTop: 'auto', paddingTop: '8px' }}>
            {footer}
          </Box>
        )}
      </OptimizedGlass>
    );
  }
);

GlassThemeDemo.displayName = 'GlassThemeDemo';
