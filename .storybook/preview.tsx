import type { Preview, StoryContext } from '@storybook/react';
import { ThemeProvider } from '../src/theme/ThemeProvider';
import { AnimationProvider } from '../src/contexts/AnimationContext';
import { AccessibilityProvider } from '../src/components/accessibility/AccessibilityProvider';
import { ContrastGuard } from '../src/components/accessibility/ContrastGuard';
import {
  GlassFocusIndicators,
  SkipLinks,
} from '../src/components/accessibility';
import { StorySurface, type StoryPreviewMode, type StorySurfaceKind } from './StorySurface';
import { setDeprecationMode } from '../src/utils/warnDeprecated';
import '../src/styles/index.css';
import {
  DEFAULT_PERSONA_ID,
  PERSONA_LIST,
  type PersonaId,
} from '../src/theme/designMatrix';
import type { ColorMode } from '../src/core/types';

// Import and register ALL Chart.js components to prevent scale registration errors
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Tooltip,
  Legend,
  Filler,
  TimeScale,
  TimeSeriesScale
} from 'chart.js';

// Register ALL Chart.js components globally for Storybook
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Tooltip,
  Legend,
  Filler,
  TimeScale,
  TimeSeriesScale
);

// Premium fonts are loaded via design tokens / public/fonts (Aeonik stack).
if (typeof document !== 'undefined') {
  document.body.style.fontFamily = 'Aeonik, Inter, -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", system-ui, sans-serif';
  document.body.style.fontSize = '14px';
  document.body.style.lineHeight = '1.6';
  document.body.style.fontWeight = '400';
  document.body.style.letterSpacing = '0';
}

export const globalTypes = {
  persona: {
    name: 'Persona',
    description: 'Design Matrix persona selection',
    defaultValue: DEFAULT_PERSONA_ID,
    toolbar: {
      icon: 'paintbrush',
      items: PERSONA_LIST.map((persona) => ({
        value: persona.meta.id,
        title: persona.meta.name,
      })),
    },
  },
  previewMode: {
    name: 'Preview',
    description: 'Story preview mode',
    defaultValue: 'light',
    toolbar: {
      icon: 'contrast',
      items: [
        { value: 'light', title: 'Light' },
        { value: 'dark', title: 'Dark' },
        { value: 'liquid', title: 'Liquid Glass' },
        { value: 'high-contrast', title: 'High Contrast' },
      ],
    },
  },
  v5Preview: {
    name: 'V5 Preview',
    description: 'Opt-in 5.0 preview surface (4.3 bridge, D-20)',
    defaultValue: 'off',
    toolbar: {
      icon: 'globe',
      items: [
        { value: 'off', title: 'V5 preview: off' },
        { value: 'v5', title: 'V5 preview: on' },
      ],
    },
  },
};

const resolveColorMode = (mode: StoryPreviewMode): ColorMode =>
  mode === 'dark' || mode === 'high-contrast' ? 'dark' : 'light';

const resolveSurface = (context: StoryContext): StorySurfaceKind => {
  const configured = context.parameters.previewSurface as StorySurfaceKind | undefined;
  if (configured) return configured;
  if (context.parameters.layout === 'fullscreen') return 'app';
  return 'component';
};

const preview: Preview = {
  parameters: {
    // Limit implicit actions to DOM-like handlers to avoid SB_PREVIEW_API_0002
    actions: { argTypesRegex: '^on(?:Click|Change|Input|Submit|Key.*|Mouse.*|Pointer.*|Focus|Blur|Wheel|Drag.*|Drop|Scroll)$' },
    controls: {
      matchers: {
        // Narrow color matcher to avoid mis-assigning color control to union-typed props
        // Components with real color strings define argTypes explicitly
        color: /backgroundColor$/i,
        date: /Date$/,
      },
    },
    docs: {
      toc: true,
      codePanel: true
    },
    backgrounds: {
      default: 'neutral',
      values: [
        {
          name: 'neutral',
          value: '#f8fafc',
        },
        {
          name: 'dark',
          value: '#0f172a',
        },
        {
          name: 'media',
          value: 'linear-gradient(145deg, #ffffff 0%, #f4f6f8 46%, #e7ebef 100%)',
        },
        {
          name: 'transparent',
          value: 'transparent',
        },
      ],
    },
    options: {
      storySort: {
        order: [
          'Start Here',
          'Foundations',
          'Controls',
          'Navigation',
          'Surfaces',
          'Data + Visualization',
          'Media',
          'Workflows',
          'AI + Intelligence',
          'Effects + Advanced',
          'Showcases',
          'Reference',
          'Certification',
        ],
      },
    },
  },
  decorators: [
    (Story, context) => {
      const personaId = (context.globals.persona || DEFAULT_PERSONA_ID) as PersonaId;
      const previewMode = (context.globals.previewMode || 'light') as StoryPreviewMode;
      const colorMode = resolveColorMode(previewMode);
      const surface = resolveSurface(context);
      const fullscreen = context.parameters.layout === 'fullscreen';
      const highContrast = previewMode === 'high-contrast';
      const v5Preview = context.globals.v5Preview === 'v5';
      // Snapshot runs (Chromatic / visual tests drive the browser) must not
      // spam warnings — deprecations render 'silent' there.
      if (typeof navigator !== 'undefined' && navigator.webdriver) {
        setDeprecationMode('silent');
      }

      return (
        <AccessibilityProvider
          initialSettings={{
            focusIndicators: true,
            keyboardNavigation: true,
            screenReaderOptimized: true,
            highContrast,
            reducedMotion: true,
          }}
          storageKey={`aura-glass-storybook-accessibility-${previewMode}`}
        >
          <AnimationProvider>
            <ThemeProvider
              forceColorMode={colorMode}
              initialPersona={personaId}
              persona={personaId}
              persistPersona={false}
            >
              <StorySurface mode={previewMode} kind={surface} fullscreen={fullscreen}>
                <SkipLinks />

                <GlassFocusIndicators />
                <ContrastGuard
                  as="main"
                  id="main-content"
                  role="main"
                  tabIndex={-1}
                  aria-label={`AuraGlass ${context.title} story preview surface`}
                  className="glass-contrast-guard"
                  level="AA"
                  minContrast={highContrast ? 7 : 4.5}
                  style={{ display: 'block', width: '100%' }}
                >
                  {v5Preview ? (
                    <div data-ag-preview="v5" className="contents">
                      <Story />
                    </div>
                  ) : (
                    <Story />
                  )}
                </ContrastGuard>
              </StorySurface>
            </ThemeProvider>
          </AnimationProvider>
        </AccessibilityProvider>
      );
    },
  ],
};

export default preview;
// Silence benign AbortError rejections during fast refresh / story switches
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (e) => {
    // Ignore aborts from fetch/media/image when Storybook swaps stories/iframes
    if (e?.reason?.name === 'AbortError') {
      e.preventDefault();
    }
  });
}
