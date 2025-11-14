# GlassDepthLayer

Multi-layer depth perception system with parallax and holographic overlays.

## Overview

The `GlassDepthLayer` component creates sophisticated 3D depth effects for glassmorphism interfaces. It provides multiple depth layers with realistic parallax effects, hover interactions, and layered glass compositions.

## Features

- **8 Depth Layers**: From background to overlay with precise z-indexing
- **Parallax Effects**: Mouse-based 3D transformations
- **Hover Interactions**: Dynamic lift and shadow effects
- **Layered Composition**: Multi-layer glass stacking
- **3D Transforms**: CSS 3D transformations with `preserve-3d`
- **Customizable Config**: Per-layer configuration options

## Usage

```tsx
import {
  GlassDepthLayer,
  GlassDepthScene,
  LayeredGlassStack,
  useDepthAnimation
} from 'aura-glass';

function DepthDemo() {
  return (
    <GlassDepthScene perspective={1200}>
      <GlassDepthLayer layer="foreground" enableParallax>
        <div className="p-6">
          <h2>Foreground Content</h2>
          <p>This appears closest to the viewer</p>
        </div>
      </GlassDepthLayer>

      <GlassDepthLayer layer="mid" enableHover hoverLift={15}>
        <div className="p-6">
          <h3>Middle Layer</h3>
          <p>This is in the middle depth</p>
        </div>
      </GlassDepthLayer>

      <GlassDepthLayer layer="far">
        <div className="p-6">
          <p>Background content</p>
        </div>
      </GlassDepthLayer>
    </GlassDepthScene>
  );
}
```

## API Reference

### GlassDepthLayer

Individual depth layer component.

```tsx
type DepthLayer =
  | 'background'
  | 'far'
  | 'mid-far'
  | 'mid'
  | 'mid-near'
  | 'near'
  | 'foreground'
  | 'overlay';

interface DepthLayerProps extends Omit<HTMLMotionProps<'div'>, 'style'> {
  layer: DepthLayer;
  customConfig?: Partial<GlassDepthConfig>;
  children: React.ReactNode;
  enableParallax?: boolean;
  parallaxStrength?: number;
  enableHover?: boolean;
  hoverLift?: number;
  className?: string;
}

interface GlassDepthConfig {
  layer: DepthLayer;
  opacity: number;
  blur: number;
  brightness: number;
  zIndex: number;
  transform: string;
  shadow: string;
}
```

### GlassDepthScene

Container component that establishes the 3D perspective.

```tsx
interface DepthSceneProps {
  children: React.ReactNode;
  perspective?: number;
  className?: string;
}
```

### LayeredGlassStack

Automated layer management for complex compositions.

```tsx
interface LayeredGlassStackProps {
  layers: {
    content: React.ReactNode;
    layer: DepthLayer;
    config?: Partial<GlassDepthConfig>;
  }[];
  enableParallax?: boolean;
  enableHover?: boolean;
  className?: string;
}
```

## Depth Layers

### Layer Specifications

| Layer | Z-Index | Opacity | Blur | Transform | Use Case |
|-------|---------|---------|------|-----------|----------|
| background | 1 | 0.02 | 2px | translateZ(-200px) scale(1.8) | Distant backgrounds |
| far | 10 | 0.05 | 8px | translateZ(-150px) scale(1.5) | Background elements |
| mid-far | 20 | 0.08 | 12px | translateZ(-100px) scale(1.3) | Secondary content |
| mid | 30 | 0.12 | 16px | translateZ(-50px) scale(1.1) | Main content layer |
| mid-near | 40 | 0.16 | 20px | translateZ(0px) scale(1) | Interactive elements |
| near | 50 | 0.22 | 24px | translateZ(50px) scale(0.9) | Foreground content |
| foreground | 60 | 0.3 | 28px | translateZ(100px) scale(0.8) | Modal overlays |
| overlay | 70 | 0.4 | 32px | translateZ(200px) scale(0.6) | Tooltips, menus |

## Advanced Usage

### Custom Layer Configuration

```tsx
<GlassDepthLayer
  layer="mid"
  customConfig={{
    opacity: 0.15,
    blur: 20,
    brightness: 0.8,
    transform: 'translateZ(-30px) scale(1.05) rotateX(5deg)',
    shadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
  }}
  enableParallax
  parallaxStrength={0.8}
>
  <CustomLayerContent />
</GlassDepthLayer>
```

### Layered Stack Composition

```tsx
const layers = [
  {
    content: <BackgroundImage />,
    layer: 'background' as const,
    config: { opacity: 0.03, blur: 1 }
  },
  {
    content: <MainContent />,
    layer: 'mid' as const
  },
  {
    content: <Navigation />,
    layer: 'near' as const,
    config: { zIndex: 55 }
  },
  {
    content: <Modal />,
    layer: 'overlay' as const
  }
];

<LayeredGlassStack
  layers={layers}
  enableParallax={true}
  enableHover={true}
/>
```

### Interactive Depth Effects

```tsx
function InteractiveCard() {
  return (
    <GlassDepthLayer
      layer="mid-near"
      enableParallax
      parallaxStrength={0.6}
      enableHover
      hoverLift={20}
      whileHover={{
        scale: 1.05,
        transition: { duration: 0.3 }
      }}
    >
      <motion.div
        className="glass-card p-6"
        whileHover={{ y: -10 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <h3>Interactive Card</h3>
        <p>This card responds to mouse movement and hover</p>
      </motion.div>
    </GlassDepthLayer>
  );
}
```

## Parallax Effects

### Mouse-Based Parallax

```tsx
<GlassDepthLayer
  layer="foreground"
  enableParallax
  parallaxStrength={0.5}
>
  <Content />
</GlassDepthLayer>
```

**Features:**
- Real-time mouse position tracking
- Smooth interpolation for natural movement
- Configurable strength and sensitivity
- Automatic cleanup on mouse leave

### Scroll-Based Parallax

```tsx
// Combine with scroll libraries like Framer Motion
import { useScroll, useTransform } from 'framer-motion';

function ScrollParallax() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, -200]);

  return (
    <GlassDepthScene>
      <GlassDepthLayer
        layer="far"
        style={{ y }}
      >
        <BackgroundContent />
      </GlassDepthLayer>
    </GlassDepthScene>
  );
}
```

## Hover Interactions

### Lift Effects

```tsx
<GlassDepthLayer
  layer="near"
  enableHover
  hoverLift={15}
>
  <CardContent />
</GlassDepthLayer>
```

**Features:**
- Dynamic elevation changes
- Enhanced shadow effects
- Smooth spring animations
- Configurable lift distance

### Combined Effects

```tsx
<GlassDepthLayer
  layer="mid"
  enableParallax
  enableHover
  parallaxStrength={0.7}
  hoverLift={25}
  whileHover={{
    scale: 1.02,
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)'
  }}
>
  <InteractiveElement />
</GlassDepthLayer>
```

## Performance Optimization

### Hardware Acceleration

- Uses `transform3d` for GPU acceleration
- Minimizes paint operations
- Optimized for 60fps animations

### Memory Management

- Efficient event listeners with cleanup
- Debounced mouse move handlers
- Component unmounting prevents memory leaks

### Quality Tiers

```tsx
// Adjust based on device capabilities
const parallaxEnabled = useDeviceCapabilities().supports3D;
const hoverEnabled = !prefersReducedMotion;

<GlassDepthLayer
  layer="mid"
  enableParallax={parallaxEnabled}
  enableHover={hoverEnabled}
/>
```

## Accessibility

### Motion Preferences

Respects `prefers-reduced-motion`:

```tsx
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

<GlassDepthLayer
  layer="near"
  enableParallax={!prefersReducedMotion}
  enableHover={!prefersReducedMotion}
>
  <Content />
</GlassDepthLayer>
```

### Keyboard Navigation

- Proper focus management for interactive layers
- Keyboard-accessible hover alternatives
- Screen reader friendly structure

## Browser Support

### Modern Browsers
- Chrome 36+ (for 3D transforms)
- Firefox 16+ (for 3D transforms)
- Safari 9+ (for 3D transforms)
- Edge 12+ (for 3D transforms)

### Fallbacks
- Graceful degradation to 2D transforms
- CSS-only effects for unsupported browsers
- Progressive enhancement approach

## Integration Examples

### With Animation Libraries

```tsx
import { motion } from 'framer-motion';
import { useDepthAnimation } from 'aura-glass';

function AnimatedLayer() {
  const depthAnimation = useDepthAnimation('foreground');

  return (
    <GlassDepthLayer layer="foreground">
      <motion.div
        initial={depthAnimation.initial}
        animate={depthAnimation.animate}
        exit={depthAnimation.exit}
      >
        <Content />
      </motion.div>
    </GlassDepthLayer>
  );
}
```

### With UI Libraries

```tsx
// Integration with modal libraries
<Modal>
  <GlassDepthScene perspective={800}>
    <GlassDepthLayer layer="overlay">
      <ModalContent />
    </GlassDepthLayer>
  </GlassDepthScene>
</Modal>
```

### With Design Systems

```tsx
// Custom layer configurations
const customLayers = {
  hero: {
    layer: 'foreground' as const,
    opacity: 0.25,
    blur: 15,
    transform: 'translateZ(150px) scale(0.7)'
  },
  card: {
    layer: 'mid-near' as const,
    opacity: 0.18,
    blur: 22
  }
};

<GlassDepthLayer {...customLayers.hero}>
  <HeroContent />
</GlassDepthLayer>
```

## Best Practices

1. **Layer Hierarchy**: Use appropriate depth layers for content importance
2. **Performance**: Test on target devices and disable effects if needed
3. **Accessibility**: Always respect motion preferences
4. **Consistency**: Maintain consistent depth patterns across components
5. **Moderation**: Don't overuse parallax effects to avoid motion sickness
6. **Mobile**: Consider touch interactions and smaller screens
7. **Loading**: Use progressive loading for complex layer stacks

## Troubleshooting

### Common Issues

**Parallax not working:**
- Check if `perspective` is set on parent container
- Verify 3D transform support in browser
- Ensure proper event listener cleanup

**Performance issues:**
- Reduce `parallaxStrength` for better performance
- Use `enableParallax={false}` on mobile devices
- Implement reduced motion for accessibility

**Z-index conflicts:**
- Use proper depth layer ordering
- Avoid manual z-index overrides
- Check for CSS stacking context issues

**Hover effects not smooth:**
- Ensure hardware acceleration is enabled
- Check for conflicting CSS transforms
- Use appropriate animation durations
