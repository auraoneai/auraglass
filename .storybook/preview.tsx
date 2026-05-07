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

// Import premium fonts
const fontLinks = [
  'https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap',
  'https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800&display=swap',
  'https://fonts.googleapis.com/css2?family=Geist:wght@100;200;300;400;500;600;700;800;900&display=swap'
];

if (typeof document !== 'undefined') {
  fontLinks.forEach(href => {
    if (document.head.querySelector(`link[href="${href}"]`)) return;
    const link = document.createElement('link');
    link.href = href;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  });

  // Apply premium font stack
  document.body.style.fontFamily = 'Geist, Inter, -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", system-ui, sans-serif';
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
          value: 'linear-gradient(135deg, #0f172a 0%, #1d4ed8 46%, #0f766e 100%)',
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
                  <Story />
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
