import type { Preview } from '@storybook/react';
import { ThemeProvider } from '../src/theme/ThemeProvider';
import { AnimationProvider } from '../src/contexts/AnimationContext';
import { CursorGlow } from '../src/components/interactive/CursorGlow';
import '../src/styles/index.css';
import {
  DEFAULT_PERSONA_ID,
  PERSONA_LIST,
  type PersonaId,
} from '../src/theme/designMatrix';

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

fontLinks.forEach(href => {
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
document.body.style.letterSpacing = '-0.01em';

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
      default: 'ultra-premium',
      values: [
        {
          name: 'ultra-premium',
          value: `
            radial-gradient(circle at 20% 20%, rgba(59,130,246,0.4) 0%, transparent 40%),
            radial-gradient(circle at 80% 20%, rgba(147,51,234,0.3) 0%, transparent 40%), 
            radial-gradient(circle at 20% 80%, rgba(236,72,153,0.2) 0%, transparent 40%),
            radial-gradient(circle at 80% 80%, rgba(59,130,246,0.2) 0%, transparent 40%),
            linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 25%, #16213e 50%, #0f0f23 75%, #0a0a0f 100%)
          `,
        },
        {
          name: 'glassmorphism',
          value: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 20%, #16213e 40%, #0f0f23 60%, #0a0a0a 100%)',
        },
        {
          name: 'light-premium',
          value: `
            radial-gradient(circle at 20% 20%, rgba(59,130,246,0.1) 0%, transparent 40%),
            radial-gradient(circle at 80% 20%, rgba(147,51,234,0.08) 0%, transparent 40%), 
            linear-gradient(135deg, #f8fafc 0%, #e2e8f0 25%, #cbd5e1 50%, #e2e8f0 75%, #f8fafc 100%)
          `,
        },
        {
          name: 'dark',
          value: '#0f0f0f',
        },
        {
          name: 'light',
          value: '#ffffff',
        },
      ],
    },
  },
  decorators: [
    (Story, context) => {
      const personaId = (context.globals.persona || DEFAULT_PERSONA_ID) as PersonaId;

      return (
        <AnimationProvider>
          <ThemeProvider
            forceColorMode="dark"
            initialPersona={personaId}
            persona={personaId}
          >
        <div
          style={{
            padding: '20px',
            minHeight: '100vh',
            position: 'relative'
          }}
        >
          {/* Global pointer-following glow overlay */}
          <CursorGlow size={360} intensity={0.6} opacity={0.16} color="#ffffff" />
          {/* Add some background elements to showcase glass effects */}
          {/* Enhanced background elements for dramatic glass effect */}
          <div 
            style={{
              position: 'absolute',
              top: '10%',
              left: '20%',
              width: '300px',
              height: '300px',
              background: 'radial-gradient(circle, rgba(59,130,246,0.8) 0%, rgba(59,130,246,0.4) 30%, rgba(59,130,246,0.2) 60%, transparent 100%)',
              borderRadius: '50%',
              filter: 'blur(60px)',
              zIndex: 0,
              pointerEvents: 'none'
            }}
          />
          <div 
            style={{
              position: 'absolute',
              bottom: '20%',
              right: '15%',
              width: '250px',
              height: '250px',
              background: 'radial-gradient(circle, rgba(147,51,234,0.6) 0%, rgba(147,51,234,0.3) 40%, rgba(236,72,153,0.2) 70%, transparent 100%)',
              borderRadius: '50%',
              filter: 'blur(50px)',
              zIndex: 0,
              pointerEvents: 'none'
            }}
          />
          <div 
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '400px',
              height: '200px',
              background: 'conic-gradient(from 0deg, rgba(59,130,246,0.3), rgba(147,51,234,0.2), rgba(236,72,153,0.3), rgba(59,130,246,0.3))',
              borderRadius: '50%',
              filter: 'blur(80px)',
              transform: 'translate(-50%, -50%)',
              zIndex: 0,
              pointerEvents: 'none'
            }}
          />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <Story />
          </div>
        </div>
          </ThemeProvider>
        </AnimationProvider>
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
