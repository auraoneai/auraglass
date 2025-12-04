import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import {
    AdaptiveGlassDensity,
    MobileGlassBottomSheet,
    MobileGlassNavigation,
    TouchOptimizedGlass,
    TouchRippleEffects
} from './TouchGlassOptimization';

const meta: Meta<typeof TouchOptimizedGlass> = {
  title: 'Mobile/TouchGlassOptimization',
  component: TouchOptimizedGlass,
  parameters: {
    docs: {
      description: {
        component: 'Comprehensive touch interaction optimization for glassmorphism components with haptic feedback, gesture recognition, and mobile-first interactions.',
      },
    },
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TouchOptimizedGlass>;

const TouchDemo = () => {
  const [tapCount, setTapCount] = useState(0);
  const [longPressCount, setLongPressCount] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<string | null>(null);
  const [lastAction, setLastAction] = useState<string>('');

  const handleTap = () => {
    setTapCount(prev => prev + 1);
    setLastAction('Tap');
  };

  const handleLongPress = () => {
    setLongPressCount(prev => prev + 1);
    setLastAction('Long Press');
  };

  const handleSwipe = (direction: 'left' | 'right' | 'up' | 'down') => {
    setSwipeDirection(direction);
    setLastAction(`Swipe ${direction}`);
  };

  return (
    <div className="space-y-6">
      <div className="glass-text-center">
        <h2 className="glass-text-3xl glass-font-bold glass-text-primary glass-mb-4">Touch Glass Interactions</h2>
        <p className="glass-text-primary/80">
          Try tapping, long pressing, and swiping on the glass below
        </p>
      </div>

      <div className="glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-3 glass-gap-6">
        <div className="glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-2xl glass-p-6 glass-text-center glass-contrast-guard">
          <div className="glass-text-3xl glass-font-bold glass-text-primary glass-mb-2">{tapCount}</div>
          <div className="glass-text-primary/80">Taps</div>
        </div>

        <div className="glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-2xl glass-p-6 glass-text-center glass-contrast-guard">
          <div className="glass-text-3xl glass-font-bold glass-text-primary glass-mb-2">{longPressCount}</div>
          <div className="glass-text-primary/80">Long Presses</div>
        </div>

        <div className="glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-2xl glass-p-6 glass-text-center glass-contrast-guard">
          <div className="glass-text-2xl glass-font-bold glass-text-primary glass-mb-2">
            {swipeDirection ? swipeDirection.toUpperCase() : '—'}
          </div>
          <div className="glass-text-primary/80">Last Swipe</div>
        </div>
      </div>

      <div className="glass-text-center">
        <div className="inline-glass-block glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-2xl glass-px-6 glass-py-3 glass-contrast-guard">
          <div className="glass-text-primary/60 glass-text-sm">Last Action:</div>
          <div className="glass-text-primary glass-font-medium">{lastAction || 'None'}</div>
        </div>
      </div>

      <div className="glass-text-center">
        <TouchOptimizedGlass
          onTap={handleTap}
          onLongPress={handleLongPress}
          onSwipe={handleSwipe}
          touchFeedback={true}
          rippleEffect={true}
          hapticsEnabled={true}
          glassIntensity="medium"
          className="glass-mx-auto"
        >
          <div className="glass-p-8 min-h-[200px] glass-flex glass-flex-col glass-items-center glass-justify-center">
            <div className="glass-text-4xl glass-mb-4">👆</div>
            <div className="glass-text-xl glass-font-semibold glass-text-primary glass-mb-2">Touch Glass</div>
            <div className="glass-text-primary/70 glass-text-sm glass-text-center max-w-xs">
              Tap, long press, or swipe this glass surface to see different interactions
            </div>
          </div>
        </TouchOptimizedGlass>
      </div>

      <div className="glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-2xl glass-p-6 glass-contrast-guard">
        <h3 className="glass-text-xl glass-font-semibold glass-text-primary glass-mb-4">Touch Instructions</h3>
        <div className="glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 glass-gap-4 glass-text-primary/80">
          <div className="glass-space-y-2">
            <div className="glass-flex glass-items-center glass-gap-3">
              <div className="glass-w-2 glass-h-2 glass-radius-full glass-surface-blue" />
              <span><strong>Tap:</strong> Quick touch for immediate action</span>
            </div>
            <div className="glass-flex glass-items-center glass-gap-3">
              <div className="glass-w-2 glass-h-2 glass-radius-full glass-surface-green" />
              <span><strong>Long Press:</strong> Hold for 500ms for context menu</span>
            </div>
          </div>
          <div className="glass-space-y-2">
            <div className="glass-flex glass-items-center glass-gap-3">
              <div className="glass-w-2 glass-h-2 glass-radius-full glass-surface-primary" />
              <span><strong>Swipe Left/Right:</strong> Navigate between content</span>
            </div>
            <div className="glass-flex glass-items-center glass-gap-3">
              <div className="glass-w-2 glass-h-2 glass-radius-full glass-surface-primary" />
              <span><strong>Swipe Up/Down:</strong> Scroll or dismiss</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const InteractiveTouch: Story = {
  args: {},
  render: () => (
    <div className="glass-min-glass-h-screen glass-gradient-primary glass-gradient-primary via-purple-900 glass-gradient-primary glass-p-8">
      <div className="max-w-4xl glass-mx-auto">
        <TouchDemo />
      </div>
    </div>
  ),
};

export const TouchFeedback: Story = {
  args: {
    touchFeedback: true,
    rippleEffect: true,
    hapticsEnabled: true,
    children: (
      <div className="glass-p-6 glass-text-center">
        <div className="glass-text-4xl glass-mb-3">📱</div>
        <div className="glass-text-primary glass-font-medium">Touch Feedback</div>
        <div className="glass-text-primary/70 glass-text-sm">Visual, haptic, and ripple effects</div>
      </div>
    )
  },
  render: (args) => (
    <div className="glass-min-glass-h-screen glass-gradient-primary glass-gradient-primary via-purple-900 glass-gradient-primary glass-p-8">
      <div className="max-w-4xl glass-mx-auto">
        <div className="glass-text-center mb-12">
          <h1 className="glass-text-3xl glass-font-bold glass-text-primary glass-mb-4">
            🎯 Touch Feedback Demo
          </h1>
          <p className="glass-text-xl glass-text-primary/80">
            Experience visual feedback, haptic responses, and ripple effects
          </p>
        </div>

        <div className="glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-3 glass-gap-8 mb-12">
          <TouchOptimizedGlass
            {...args}
            onTap={() => console.log('Light feedback')}
            glassIntensity="light"
          />

          <TouchOptimizedGlass
            {...args}
            onTap={() => console.log('Medium feedback')}
            glassIntensity="medium"
          />

          <TouchOptimizedGlass
            {...args}
            onTap={() => console.log('Heavy feedback')}
            glassIntensity="heavy"
          />
        </div>

        <div className="glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-2xl glass-p-6 glass-contrast-guard">
          <h3 className="glass-text-xl glass-font-semibold glass-text-primary glass-mb-4">Feedback Types</h3>
          <div className="glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-3 glass-gap-6">
            <div className="glass-text-center">
              <div className="glass-text-3xl glass-mb-3">👆</div>
              <h4 className="glass-font-medium glass-text-primary glass-mb-2">Visual Feedback</h4>
              <p className="glass-text-primary/70 glass-text-sm">Scale and opacity changes on touch</p>
            </div>

            <div className="glass-text-center">
              <div className="glass-text-3xl glass-mb-3">📳</div>
              <h4 className="glass-font-medium glass-text-primary glass-mb-2">Haptic Feedback</h4>
              <p className="glass-text-primary/70 glass-text-sm">Vibration patterns for touch confirmation</p>
            </div>

            <div className="glass-text-center">
              <div className="glass-text-3xl glass-mb-3">💫</div>
              <h4 className="glass-font-medium glass-text-primary glass-mb-2">Ripple Effects</h4>
              <p className="glass-text-primary/70 glass-text-sm">Material Design-inspired touch ripples</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const MobileNavigation: Story = {
  args: {},
  render: () => {
    const [currentPage, setCurrentPage] = useState(0);
    const [swipeHistory, setSwipeHistory] = useState<string[]>([]);

    const pages = [
      { title: 'Dashboard', icon: '📊', color: 'from-blue-500 to-cyan-500' },
      { title: 'Messages', icon: '💬', color: 'from-green-500 to-emerald-500' },
      { title: 'Settings', icon: '⚙️', color: 'from-purple-500 to-pink-500' },
      { title: 'Profile', icon: '👤', color: 'from-orange-500 to-red-500' }
    ];

    const handleSwipe = (direction: 'left' | 'right' | 'up' | 'down') => {
      setSwipeHistory(prev => [...prev.slice(-4), direction]);

      if (direction === 'left' && currentPage < pages.length - 1) {
        setCurrentPage(prev => prev + 1);
      } else if (direction === 'right' && currentPage > 0) {
        setCurrentPage(prev => prev - 1);
      }
    };

    return (
      <div className="glass-min-glass-h-screen glass-gradient-primary glass-gradient-primary via-purple-900 glass-gradient-primary glass-p-8">
        <div className="max-w-4xl glass-mx-auto">
          <div className="glass-text-center mb-12">
            <h1 className="glass-text-3xl glass-font-bold glass-text-primary glass-mb-4">
              📱 Mobile Glass Navigation
            </h1>
            <p className="glass-text-xl glass-text-primary/80">
              Swipe left/right to navigate between pages
            </p>
          </div>

          <div className="mb-8">
            <div className="glass-flex glass-justify-center glass-gap-2 glass-mb-4">
              {pages.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentPage ? 'bg-white' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>

            <div className="glass-text-center mb-6">
              <div className="inline-glass-block glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-2xl glass-px-6 glass-py-3 glass-contrast-guard">
                <div className="glass-text-primary/60 glass-text-sm">Current Page</div>
                <div className="glass-text-primary glass-font-medium">{pages[currentPage].title}</div>
              </div>
            </div>
          </div>

          <MobileGlassNavigation
            onSwipeLeft={() => handleSwipe('left')}
            onSwipeRight={() => handleSwipe('right')}
            onSwipeUp={() => handleSwipe('up')}
            onSwipeDown={() => handleSwipe('down')}
          >
            <div className="glass-p-8 glass-text-center">
              <div className={`inline-block p-8 rounded-3xl bg-gradient-to-br ${pages[currentPage].color} mb-6`}>
                <div className="glass-text-6xl">{pages[currentPage].icon}</div>
              </div>
              <h2 className="glass-text-3xl glass-font-bold glass-text-primary glass-mb-4">{pages[currentPage].title}</h2>
              <p className="glass-text-primary/70 glass-text-lg">
                Swipe left or right to navigate between different sections
              </p>
            </div>
          </MobileGlassNavigation>

          <div className="mt-8 glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-2xl glass-p-6 glass-contrast-guard">
            <h3 className="glass-text-xl glass-font-semibold glass-text-primary glass-mb-4">Swipe History</h3>
            <div className="glass-flex glass-flex-wrap glass-gap-2">
              {swipeHistory.length === 0 ? (
                <div className="glass-text-primary/60">No swipes yet</div>
              ) : (
                swipeHistory.map((swipe, index) => (
                  <div
                    key={index}
                    className="glass-px-3 glass-py-1 glass-surface-subtle/20 glass-radius-lg glass-text-primary glass-text-sm"
                  >
                    {swipe} →
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-8 glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-2xl glass-p-6 glass-contrast-guard">
            <h3 className="glass-text-xl glass-font-semibold glass-text-primary glass-mb-4">Navigation Controls</h3>
            <div className="glass-grid glass-glass-grid-cols-2 md:glass-glass-grid-cols-4 glass-gap-4">
              <button
                onClick={() => handleSwipe('left')}
                className="glass-px-4 glass-py-2 glass-surface-blue/20 hover:glass-surface-blue/30 glass-text-primary glass-radius-lg glass-font-medium transition-colors glass-focus glass-touch-target glass-contrast-guard"
                disabled={currentPage >= pages.length - 1}
              >
                ← Left
              </button>

              <button
                onClick={() => handleSwipe('right')}
                className="glass-px-4 glass-py-2 glass-surface-blue/20 hover:glass-surface-blue/30 glass-text-primary glass-radius-lg glass-font-medium transition-colors glass-focus glass-touch-target glass-contrast-guard"
                disabled={currentPage <= 0}
              >
                Right →
              </button>

              <button
                onClick={() => handleSwipe('up')}
                className="glass-px-4 glass-py-2 glass-surface-green/20 hover:glass-surface-green/30 glass-text-primary glass-radius-lg glass-font-medium transition-colors glass-focus glass-touch-target glass-contrast-guard"
              >
                ↑ Up
              </button>

              <button
                onClick={() => handleSwipe('down')}
                className="glass-px-4 glass-py-2 glass-surface-green/20 hover:glass-surface-green/30 glass-text-primary glass-radius-lg glass-font-medium transition-colors glass-focus glass-touch-target glass-contrast-guard"
              >
                Down ↓
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  },
};

export const AdaptiveDensity: Story = {
  args: {},
  render: () => (
    <div className="glass-min-glass-h-screen glass-gradient-primary glass-gradient-primary via-purple-900 glass-gradient-primary glass-p-8">
      <div className="max-w-6xl glass-mx-auto">
        <div className="glass-text-center mb-12">
          <h1 className="glass-text-3xl glass-font-bold glass-text-primary glass-mb-4">
            📐 Adaptive Glass Density
          </h1>
          <p className="glass-text-xl glass-text-primary/80">
            Glass effects that automatically adapt to screen size and device capabilities
          </p>
        </div>

        <div className="glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 lg:glass-glass-grid-cols-3 glass-gap-8 mb-12">
          <AdaptiveGlassDensity screenSize="small" devicePixelRatio={1} autoAdapt={true}>
            <div className="glass-p-6 glass-text-center">
              <div className="glass-text-4xl glass-mb-3">📱</div>
              <h3 className="glass-text-xl glass-font-semibold glass-text-primary glass-mb-2">Mobile (Small)</h3>
              <p className="glass-text-primary/70 glass-text-sm">
                Optimized for small screens with reduced effects for better performance
              </p>
              <div className="mt-4 glass-text-primary/60 glass-text-xs">
                • Lower density effects<br/>
                • Reduced blur intensity<br/>
                • Minimal animations<br/>
                • Touch-optimized
              </div>
            </div>
          </AdaptiveGlassDensity>

          <AdaptiveGlassDensity screenSize="medium" devicePixelRatio={1.5} autoAdapt={true}>
            <div className="glass-p-6 glass-text-center">
              <div className="glass-text-4xl glass-mb-3">💻</div>
              <h3 className="glass-text-xl glass-font-semibold glass-text-primary glass-mb-2">Tablet (Medium)</h3>
              <p className="glass-text-primary/70 glass-text-sm">
                Balanced effects for medium screens with moderate performance impact
              </p>
              <div className="mt-4 glass-text-primary/60 glass-text-xs">
                • Medium density effects<br/>
                • Standard blur intensity<br/>
                • Balanced animations<br/>
                • Touch-friendly
              </div>
            </div>
          </AdaptiveGlassDensity>

          <AdaptiveGlassDensity screenSize="large" devicePixelRatio={2} autoAdapt={true}>
            <div className="glass-p-6 glass-text-center">
              <div className="glass-text-4xl glass-mb-3">🖥️</div>
              <h3 className="glass-text-xl glass-font-semibold glass-text-primary glass-mb-2">Desktop (Large)</h3>
              <p className="glass-text-primary/70 glass-text-sm">
                Full effects for large screens with high-performance capabilities
              </p>
              <div className="mt-4 glass-text-primary/60 glass-text-xs">
                • High density effects<br/>
                • Maximum blur intensity<br/>
                • Complex animations<br/>
                • Mouse optimized
              </div>
            </div>
          </AdaptiveGlassDensity>
        </div>

        <div className="glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-2xl glass-p-6 glass-contrast-guard">
          <h3 className="glass-text-xl glass-font-semibold glass-text-primary mb-6 glass-text-center">Adaptive Features</h3>
          <div className="glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 lg:glass-glass-grid-cols-4 glass-gap-6">
            <div className="glass-text-center">
              <div className="glass-text-3xl glass-mb-3">📏</div>
              <h4 className="glass-font-semibold glass-text-primary glass-mb-2">Screen Size</h4>
              <p className="glass-text-primary/70 glass-text-sm">Adapts to viewport dimensions</p>
            </div>

            <div className="glass-text-center">
              <div className="glass-text-3xl glass-mb-3">🔍</div>
              <h4 className="glass-font-semibold glass-text-primary glass-mb-2">Pixel Ratio</h4>
              <p className="glass-text-primary/70 glass-text-sm">Considers device pixel density</p>
            </div>

            <div className="glass-text-center">
              <div className="glass-text-3xl glass-mb-3">⚡</div>
              <h4 className="glass-font-semibold glass-text-primary glass-mb-2">Performance</h4>
              <p className="glass-text-primary/70 glass-text-sm">Auto-adjusts based on capabilities</p>
            </div>

            <div className="glass-text-center">
              <div className="glass-text-3xl glass-mb-3">♿</div>
              <h4 className="glass-font-semibold glass-text-primary glass-mb-2">Accessibility</h4>
              <p className="glass-text-primary/70 glass-text-sm">Maintains usability across devices</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const RippleEffects: Story = {
  args: {},
  render: () => (
    <div className="glass-min-glass-h-screen glass-gradient-primary glass-gradient-primary via-purple-900 glass-gradient-primary glass-p-8">
      <div className="max-w-4xl glass-mx-auto">
        <div className="glass-text-center mb-12">
          <h1 className="glass-text-3xl glass-font-bold glass-text-primary glass-mb-4">
            💫 Touch Ripple Effects
          </h1>
          <p className="glass-text-xl glass-text-primary/80">
            Material Design-inspired ripple effects with customizable colors and timing
          </p>
        </div>

        <div className="glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 glass-gap-8 mb-12">
          <TouchRippleEffects
            color="var(--glass-border-default)"
            maxRipples={3}
            rippleDuration={600}
          >
            <div className="glass-p-8 glass-text-center glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-2xl glass-contrast-guard">
              <div className="glass-text-4xl glass-mb-3">🌊</div>
              <h3 className="glass-text-xl glass-font-semibold glass-text-primary glass-mb-2">Default Ripple</h3>
              <p className="glass-text-primary/70 glass-text-sm">
                Standard white ripple with medium duration and up to 3 simultaneous ripples
              </p>
            </div>
          </TouchRippleEffects>

          <TouchRippleEffects
            color="var(--glass-color-primary, 0.6)"
            maxRipples={5}
            rippleDuration={800}
          >
            <div className="glass-p-8 glass-text-center glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-2xl glass-contrast-guard">
              <div className="glass-text-4xl glass-mb-3">💙</div>
              <h3 className="glass-text-xl glass-font-semibold glass-text-primary glass-mb-2">Blue Ripple</h3>
              <p className="glass-text-primary/70 glass-text-sm">
                Custom blue color with longer duration and more simultaneous ripples
              </p>
            </div>
          </TouchRippleEffects>

          <TouchRippleEffects
            color="var(--glass-color-success, 0.5)"
            maxRipples={2}
            rippleDuration={400}
          >
            <div className="glass-p-8 glass-text-center glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-2xl glass-contrast-guard">
              <div className="glass-text-4xl glass-mb-3">💚</div>
              <h3 className="glass-text-xl glass-font-semibold glass-text-primary glass-mb-2">Green Ripple</h3>
              <p className="glass-text-primary/70 glass-text-sm">
                Fast green ripple with limited simultaneous effects for subtle feedback
              </p>
            </div>
          </TouchRippleEffects>

          <TouchRippleEffects
            color="rgba(249, 115, 22, 0.7)"
            maxRipples={4}
            rippleDuration={1000}
          >
            <div className="glass-p-8 glass-text-center glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-2xl glass-contrast-guard">
              <div className="glass-text-4xl glass-mb-3">🧡</div>
              <h3 className="glass-text-xl glass-font-semibold glass-text-primary glass-mb-2">Orange Ripple</h3>
              <p className="glass-text-primary/70 glass-text-sm">
                Bold orange ripple with slow, dramatic animation and multiple effects
              </p>
            </div>
          </TouchRippleEffects>
        </div>

        <div className="glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-2xl glass-p-6 glass-contrast-guard">
          <h3 className="glass-text-xl glass-font-semibold glass-text-primary mb-6 glass-text-center">Ripple Effect Features</h3>
          <div className="glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 glass-gap-8">
            <div>
              <h4 className="glass-font-medium glass-text-primary glass-mb-3">Customization Options</h4>
              <div className="glass-space-y-2 glass-text-primary/80">
                <div>• Custom colors and opacity</div>
                <div>• Adjustable animation duration</div>
                <div>• Configurable ripple limits</div>
                <div>• Size and scale control</div>
              </div>
            </div>
            <div>
              <h4 className="glass-font-medium glass-text-primary glass-mb-3">Performance Features</h4>
              <div className="glass-space-y-2 glass-text-primary/80">
                <div>• Efficient DOM manipulation</div>
                <div>• Automatic cleanup</div>
                <div>• GPU-accelerated animations</div>
                <div>• Memory leak prevention</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const BottomSheet: Story = {
  args: {},
  render: () => {
    const [sheets, setSheets] = useState({
      menu: false,
      settings: false,
      profile: false
    });

    const openSheet = (sheet: keyof typeof sheets) => {
      setSheets(prev => ({ ...prev, [sheet]: true }));
    };

    const closeSheet = (sheet: keyof typeof sheets) => {
      setSheets(prev => ({ ...prev, [sheet]: false }));
    };

    return (
      <div className="glass-min-glass-h-screen glass-gradient-primary glass-gradient-primary via-purple-900 glass-gradient-primary glass-p-8">
        <div className="max-w-4xl glass-mx-auto">
          <div className="glass-text-center mb-12">
            <h1 className="glass-text-3xl glass-font-bold glass-text-primary glass-mb-4">
              📄 Mobile Glass Bottom Sheet
            </h1>
            <p className="glass-text-xl glass-text-primary/80">
              Touch-optimized bottom sheets with snap points and smooth animations
            </p>
          </div>

          <div className="glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-3 glass-gap-6 mb-12">
            <div className="glass-text-center">
              <div className="glass-p-6 glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-2xl glass-mb-4 glass-contrast-guard">
                <div className="glass-text-4xl glass-mb-3">🍽️</div>
                <h3 className="glass-text-xl glass-font-semibold glass-text-primary glass-mb-2">Menu Sheet</h3>
                <p className="glass-text-primary/70 glass-text-sm glass-mb-4">
                  Navigation menu with quick actions and shortcuts
                </p>
                <button
                  onClick={() => openSheet('menu')}
                  className="glass-px-6 glass-py-2 glass-surface-blue/20 hover:glass-surface-blue/30 glass-text-primary glass-radius-lg glass-font-medium transition-colors glass-focus glass-touch-target glass-contrast-guard"
                >
                  Open Menu
                </button>
              </div>
            </div>

            <div className="glass-text-center">
              <div className="glass-p-6 glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-2xl glass-mb-4 glass-contrast-guard">
                <div className="glass-text-4xl glass-mb-3">⚙️</div>
                <h3 className="glass-text-xl glass-font-semibold glass-text-primary glass-mb-2">Settings Sheet</h3>
                <p className="glass-text-primary/70 glass-text-sm glass-mb-4">
                  Configuration options and preferences panel
                </p>
                <button
                  onClick={() => openSheet('settings')}
                  className="glass-px-6 glass-py-2 glass-surface-green/20 hover:glass-surface-green/30 glass-text-primary glass-radius-lg glass-font-medium transition-colors glass-focus glass-touch-target glass-contrast-guard"
                >
                  Open Settings
                </button>
              </div>
            </div>

            <div className="glass-text-center">
              <div className="glass-p-6 glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-2xl glass-mb-4 glass-contrast-guard">
                <div className="glass-text-4xl glass-mb-3">👤</div>
                <h3 className="glass-text-xl glass-font-semibold glass-text-primary glass-mb-2">Profile Sheet</h3>
                <p className="glass-text-primary/70 glass-text-sm glass-mb-4">
                  User profile information and account settings
                </p>
                <button
                  onClick={() => openSheet('profile')}
                  className="glass-px-6 glass-py-2 glass-surface-primary/20 hover:glass-surface-primary/30 glass-text-primary glass-radius-lg glass-font-medium transition-colors glass-focus glass-touch-target glass-contrast-guard"
                >
                  Open Profile
                </button>
              </div>
            </div>
          </div>

          {/* Menu Sheet */}
          <MobileGlassBottomSheet
            isOpen={sheets.menu}
            onClose={() => closeSheet('menu')}
            height="60vh"
            snapPoints={['30vh', '60vh', '80vh']}
          >
            <div className="glass-p-6">
              <h2 className="glass-text-2xl glass-font-bold glass-text-primary mb-6">Navigation Menu</h2>
              <div className="glass-space-y-4">
                <button className="glass-w-full glass-p-4 glass-surface-subtle/10 hover:glass-surface-subtle/20 glass-radius-lg glass-text-primary glass-font-medium transition-colors glass-text-left glass-focus glass-touch-target glass-contrast-guard">
                  🏠 Home
                </button>
                <button className="glass-w-full glass-p-4 glass-surface-subtle/10 hover:glass-surface-subtle/20 glass-radius-lg glass-text-primary glass-font-medium transition-colors glass-text-left glass-focus glass-touch-target glass-contrast-guard">
                  🔍 Search
                </button>
                <button className="glass-w-full glass-p-4 glass-surface-subtle/10 hover:glass-surface-subtle/20 glass-radius-lg glass-text-primary glass-font-medium transition-colors glass-text-left glass-focus glass-touch-target glass-contrast-guard">
                  ❤️ Favorites
                </button>
                <button className="glass-w-full glass-p-4 glass-surface-subtle/10 hover:glass-surface-subtle/20 glass-radius-lg glass-text-primary glass-font-medium transition-colors glass-text-left glass-focus glass-touch-target glass-contrast-guard">
                  📱 Downloads
                </button>
                <button className="glass-w-full glass-p-4 glass-surface-subtle/10 hover:glass-surface-subtle/20 glass-radius-lg glass-text-primary glass-font-medium transition-colors glass-text-left glass-focus glass-touch-target glass-contrast-guard">
                  ⚙️ Settings
                </button>
              </div>
            </div>
          </MobileGlassBottomSheet>

          {/* Settings Sheet */}
          <MobileGlassBottomSheet
            isOpen={sheets.settings}
            onClose={() => closeSheet('settings')}
            height="70vh"
            snapPoints={['40vh', '70vh']}
          >
            <div className="glass-p-6">
              <h2 className="glass-text-2xl glass-font-bold glass-text-primary mb-6">Settings</h2>
              <div className="space-y-6">
                <div className="glass-flex glass-items-center glass-justify-between">
                  <span className="glass-text-primary glass-font-medium">Notifications</span>
                  <div className="glass-w-12 glass-h-6 glass-surface-subtle/20 glass-radius-full glass-p-1">
                    <div className="glass-w-4 glass-h-4 glass-surface-subtle glass-radius-full transform translate-x-6"></div>
                  </div>
                </div>

                <div className="glass-flex glass-items-center glass-justify-between">
                  <span className="glass-text-primary glass-font-medium">Dark Mode</span>
                  <div className="glass-w-12 glass-h-6 glass-surface-blue glass-radius-full glass-p-1">
                    <div className="glass-w-4 glass-h-4 glass-surface-subtle glass-radius-full"></div>
                  </div>
                </div>

                <div className="glass-flex glass-items-center glass-justify-between">
                  <span className="glass-text-primary glass-font-medium">Auto-play</span>
                  <div className="glass-w-12 glass-h-6 glass-surface-subtle/20 glass-radius-full glass-p-1">
                    <div className="glass-w-4 glass-h-4 glass-surface-subtle glass-radius-full"></div>
                  </div>
                </div>

                <div className="pt-4 glass-border-t glass-border-white/20">
                  <button className="glass-w-full glass-p-3 glass-surface-red/20 hover:glass-surface-red/30 glass-text-primary glass-radius-lg glass-font-medium transition-colors glass-focus glass-touch-target glass-contrast-guard">
                    Clear Cache
                  </button>
                </div>
              </div>
            </div>
          </MobileGlassBottomSheet>

          {/* Profile Sheet */}
          <MobileGlassBottomSheet
            isOpen={sheets.profile}
            onClose={() => closeSheet('profile')}
            height="75vh"
            snapPoints={['50vh', '75vh']}
          >
            <div className="glass-p-6">
              <div className="glass-text-center mb-6">
                <div className="glass-w-20 glass-h-20 glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-full glass-mx-auto glass-mb-4 glass-flex glass-items-center glass-justify-center">
                  <span className="glass-text-3xl">👤</span>
                </div>
                <h2 className="glass-text-2xl glass-font-bold glass-text-primary glass-mb-2">John Doe</h2>
                <p className="glass-text-primary/70">john.doe@example.com</p>
              </div>

              <div className="glass-space-y-4">
                <button className="glass-w-full glass-p-4 glass-surface-subtle/10 hover:glass-surface-subtle/20 glass-radius-lg glass-text-primary glass-font-medium transition-colors glass-text-left glass-focus glass-touch-target glass-contrast-guard">
                  ✏️ Edit Profile
                </button>
                <button className="glass-w-full glass-p-4 glass-surface-subtle/10 hover:glass-surface-subtle/20 glass-radius-lg glass-text-primary glass-font-medium transition-colors glass-text-left glass-focus glass-touch-target glass-contrast-guard">
                  🔒 Privacy Settings
                </button>
                <button className="glass-w-full glass-p-4 glass-surface-subtle/10 hover:glass-surface-subtle/20 glass-radius-lg glass-text-primary glass-font-medium transition-colors glass-text-left glass-focus glass-touch-target glass-contrast-guard">
                  🔔 Notification Preferences
                </button>
                <button className="glass-w-full glass-p-4 glass-surface-subtle/10 hover:glass-surface-subtle/20 glass-radius-lg glass-text-primary glass-font-medium transition-colors glass-text-left glass-focus glass-touch-target glass-contrast-guard">
                  💳 Subscription
                </button>

                <div className="pt-4 glass-border-t glass-border-white/20">
                  <button className="glass-w-full glass-p-3 glass-surface-red/20 hover:glass-surface-red/30 glass-text-primary glass-radius-lg glass-font-medium transition-colors glass-focus glass-touch-target glass-contrast-guard">
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </MobileGlassBottomSheet>

          <div className="glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-2xl glass-p-6 glass-contrast-guard">
            <h3 className="glass-text-xl glass-font-semibold glass-text-primary mb-6 glass-text-center">Bottom Sheet Features</h3>
            <div className="glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 lg:glass-glass-grid-cols-4 glass-gap-6">
              <div className="glass-text-center">
                <div className="glass-text-3xl glass-mb-3">📏</div>
                <h4 className="glass-font-semibold glass-text-primary glass-mb-2">Snap Points</h4>
                <p className="glass-text-primary/70 glass-text-sm">Multiple height positions</p>
              </div>

              <div className="glass-text-center">
                <div className="glass-text-3xl glass-mb-3">👆</div>
                <h4 className="glass-font-semibold glass-text-primary glass-mb-2">Touch Drag</h4>
                <p className="glass-text-primary/70 glass-text-sm">Smooth drag interactions</p>
              </div>

              <div className="glass-text-center">
                <div className="glass-text-3xl glass-mb-3">🎯</div>
                <h4 className="glass-font-semibold glass-text-primary glass-mb-2">Backdrop</h4>
                <p className="glass-text-primary/70 glass-text-sm">Modal backdrop with blur</p>
              </div>

              <div className="glass-text-center">
                <div className="glass-text-3xl glass-mb-3">📱</div>
                <h4 className="glass-font-semibold glass-text-primary glass-mb-2">Mobile First</h4>
                <p className="glass-text-primary/70 glass-text-sm">Optimized for mobile UX</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
};
