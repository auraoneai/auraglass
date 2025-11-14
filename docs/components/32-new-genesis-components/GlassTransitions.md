# GlassTransitions

Advanced transition system with 5+ variants (shatter, liquid, ripple, morph, frost) and interactive components.

## Overview

The `GlassTransitions` system provides a comprehensive set of animated transitions specifically designed for glassmorphism interfaces. It includes multiple transition variants, page transitions, and interactive components with smooth animations.

## Features

- **5 Transition Variants**: Shatter, liquid, ripple, morph, and frost effects
- **Page Transitions**: AnimatePresence-based route transitions
- **Interactive Components**: Swipeable cards, accordions, modals, and tabs
- **Physics-Based Animations**: Realistic motion with spring animations
- **Customizable Timing**: Configurable duration and easing
- **Accessibility Support**: Respects reduced motion preferences

## Usage

```tsx
import {
  GlassTransition,
  GlassPageTransition,
  SwipeableGlassCards,
  GlassAccordion,
  GlassModal,
  GlassTabs
} from 'aura-glass';

function App() {
  return (
    <div>
      {/* Basic transition */}
      <GlassTransition variant="liquid" duration={0.6}>
        <div>Content with liquid transition</div>
      </GlassTransition>

      {/* Page transition */}
      <GlassPageTransition variant="morph">
        <PageContent />
      </GlassPageTransition>

      {/* Interactive components */}
      <SwipeableGlassCards
        cards={[
          { id: '1', content: <Card1 />, background: 'rgba(255,0,0,0.1)' },
          { id: '2', content: <Card2 />, background: 'rgba(0,255,0,0.1)' }
        ]}
        onSwipe={(direction, cardId) => console.log('Swiped', direction, cardId)}
      />
    </div>
  );
}
```

## API Reference

### GlassTransition

Basic transition wrapper component.

```tsx
interface GlassTransitionProps {
  children: React.ReactNode;
  variant?: 'shatter' | 'liquid' | 'ripple' | 'morph' | 'frost';
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
}
```

### GlassPageTransition

Page-level transitions with AnimatePresence.

```tsx
interface GlassPageTransitionProps {
  children: React.ReactNode;
  variant?: 'shatter' | 'liquid' | 'ripple' | 'morph' | 'frost';
  duration?: number;
  className?: string;
}
```

### SwipeableGlassCards

Interactive card carousel with swipe gestures.

```tsx
interface SwipeableGlassCardsProps {
  cards: Array<{
    id: string;
    content: React.ReactNode;
    background?: string;
  }>;
  onSwipe?: (direction: 'left' | 'right', cardId: string) => void;
  className?: string;
}
```

### GlassAccordion

Collapsible content with smooth animations.

```tsx
interface GlassAccordionProps {
  items: Array<{
    id: string;
    title: string;
    content: React.ReactNode;
    icon?: React.ReactNode;
  }>;
  allowMultiple?: boolean;
  className?: string;
}
```

### GlassModal

Modal with glass transition effects.

```tsx
interface GlassModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  variant?: 'shatter' | 'liquid' | 'ripple' | 'morph' | 'frost';
  className?: string;
}
```

### GlassTabs

Tabbed interface with transition animations.

```tsx
interface GlassTabsProps {
  tabs?: Array<{
    id: string;
    label: string;
    content: React.ReactNode;
    icon?: React.ReactNode;
  }>;
  children?: React.ReactNode;
  value?: string;
  onValueChange?: (value: string) => void;
  defaultTab?: string;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  onTabChange?: (tabId: string) => void;
}
```

## Transition Variants

### Shatter

Dramatic glass-breaking effect with multiple fragments.

```tsx
<GlassTransition variant="shatter">
  <Content />
</GlassTransition>
```

**Features:**
- Scale and rotation animations
- Blur effects during transition
- Multiple keyframes for realistic shattering

### Liquid

Smooth liquid-like morphing effect.

```tsx
<GlassTransition variant="liquid">
  <Content />
</GlassTransition>
```

**Features:**
- Clip-path based morphing
- Smooth scaling transitions
- Organic liquid-like movement

### Ripple

Expanding ripple effect from center.

```tsx
<GlassTransition variant="ripple">
  <Content />
</GlassTransition>
```

**Features:**
- Circular expansion animation
- Scale-based ripple effect
- Smooth border radius transitions

### Morph

Organic shape morphing between states.

```tsx
<GlassTransition variant="morph">
  <Content />
</GlassTransition>
```

**Features:**
- Complex border-radius morphing
- Multi-axis scaling
- Smooth interpolation between shapes

### Frost

Frost-like blur and brightness effects.

```tsx
<GlassTransition variant="frost">
  <Content />
</GlassTransition>
```

**Features:**
- Progressive blur effects
- Brightness adjustments
- Frost-like visual appearance

## Advanced Usage

### Custom Timing

```tsx
<GlassTransition variant="liquid" duration={1.2}>
  <SlowTransitionContent />
</GlassTransition>
```

### Route Transitions

```tsx
import { Routes, Route, useLocation } from 'react-router-dom';

function App() {
  const location = useLocation();

  return (
    <GlassPageTransition variant="morph" key={location.pathname}>
      <Routes location={location}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </GlassPageTransition>
  );
}
```

### Interactive Swipe Cards

```tsx
const cards = [
  {
    id: 'welcome',
    content: <WelcomeCard />,
    background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)'
  },
  {
    id: 'features',
    content: <FeaturesCard />,
    background: 'linear-gradient(45deg, #f093fb 0%, #f5576c 100%)'
  }
];

<SwipeableGlassCards
  cards={cards}
  onSwipe={(direction, cardId) => {
    console.log(`Swiped ${direction} on card ${cardId}`);
    // Handle swipe analytics or navigation
  }}
/>
```

### Animated Accordion

```tsx
const accordionItems = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    content: <GettingStartedContent />,
    icon: <BookOpen className="w-5 h-5" />
  },
  {
    id: 'advanced-features',
    title: 'Advanced Features',
    content: <AdvancedFeaturesContent />,
    icon: <Settings className="w-5 h-5" />
  }
];

<GlassAccordion
  items={accordionItems}
  allowMultiple={false}
/>
```

### Modal with Transitions

```tsx
const [isModalOpen, setIsModalOpen] = useState(false);

<GlassModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  variant="ripple"
>
  <div className="p-6">
    <h2>Modal Title</h2>
    <p>Modal content with glass transition effect.</p>
  </div>
</GlassModal>
```

### Animated Tabs

```tsx
const tabData = [
  {
    id: 'overview',
    label: 'Overview',
    content: <OverviewTab />,
    icon: <Home className="w-4 h-4" />
  },
  {
    id: 'settings',
    label: 'Settings',
    content: <SettingsTab />,
    icon: <Settings className="w-4 h-4" />
  }
];

<GlassTabs
  tabs={tabData}
  defaultTab="overview"
  orientation="horizontal"
  onTabChange={(tabId) => console.log('Switched to tab:', tabId)}
/>
```

## Performance Optimization

### Reduced Motion Support

All transitions respect the user's `prefers-reduced-motion` setting:

```tsx
// Automatic detection and adjustment
const transitionDuration = useReducedMotion() ? 0.1 : 0.6;
```

### Hardware Acceleration

- Uses `transform` and `opacity` for GPU acceleration
- Minimizes layout thrashing with `transform3d`
- Optimized animation curves for smooth performance

### Memory Management

- Efficient event listeners with cleanup
- Component unmounting prevents memory leaks
- Optimized re-renders with proper dependency arrays

## Accessibility

### Keyboard Navigation

- Full keyboard support for interactive components
- Focus management for modals and overlays
- Skip links for screen reader users

### Screen Reader Support

- Proper ARIA attributes for dynamic content
- Announcement of state changes
- Semantic HTML structure

### Motion Preferences

```tsx
// Respects user motion preferences
<GlassTransition
  variant="liquid"
  duration={prefersReducedMotion ? 0.1 : 0.6}
>
  <Content />
</GlassTransition>
```

## Customization

### Custom Easing

```tsx
import { easings } from 'aura-glass';

// Use custom easing functions
const customTransition = {
  ...glassTransitionVariants.liquid,
  exit: {
    ...glassTransitionVariants.liquid.exit,
    transition: {
      ...glassTransitionVariants.liquid.exit.transition,
      ease: easings.easeOutExpo
    }
  }
};
```

### Theme Integration

```tsx
// Integrate with your design system
<GlassTransition
  variant="liquid"
  className="my-custom-glass-transition"
  style={{
    borderRadius: 'var(--border-radius-lg)',
    backdropFilter: 'var(--backdrop-filter-glass)'
  }}
>
  <Content />
</GlassTransition>
```

## Browser Support

### Modern Browsers
- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

### Fallbacks
- CSS-only transitions for older browsers
- Reduced animation complexity for low-performance devices
- Graceful degradation to static states

## Best Practices

1. **Use Appropriate Variants**: Choose transition types that match content importance
2. **Performance First**: Test transitions on target devices
3. **Accessibility**: Always respect motion preferences
4. **Consistency**: Use similar transitions for similar interactions
5. **Loading States**: Show loading indicators during async transitions
6. **Error Handling**: Provide fallbacks for failed transitions
7. **Testing**: Test transitions across different viewport sizes

## Troubleshooting

### Common Issues

**Transitions not working:**
- Check if `framer-motion` is properly installed
- Verify component is wrapped in AnimatePresence for exit animations
- Ensure proper React keys for list animations

**Performance issues:**
- Reduce transition complexity for mobile devices
- Use `transform3d` for hardware acceleration
- Implement reduced motion for accessibility

**Styling conflicts:**
- Avoid overriding transform properties
- Use proper z-index management
- Check for CSS transform conflicts
