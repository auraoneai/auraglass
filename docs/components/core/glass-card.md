# GlassCard Component

## Overview

`GlassCard` is a premium container component with liquid glass material support. It provides variant-specific IOR and thickness values, hover lift effects, and adaptive density based on card usage context.

## Features

- ✨ Liquid Glass material with variant-specific properties
- 🎯 Hover lift effects with interaction depth
- 📱 Mobile-optimized rendering and touch interactions
- ♿ Full accessibility with semantic markup
- 🎨 Multiple variants for different use cases
- ⚡ GPU-accelerated effects with performance optimization

## Props API

### Core Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"default" \| "elevated" \| "outlined" \| "filled"` | `"default"` | Card style variant |
| `padding` | `"none" \| "sm" \| "md" \| "lg" \| "xl"` | `"md"` | Internal padding |
| `interactive` | `boolean` | `false` | Enable hover/click interactions |
| `elevation` | `number` | `1` | Material Design elevation level |

### Liquid Glass Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `material` | `"glass" \| "liquid"` | `"glass"` | Material system to use |
| `materialProps` | `LiquidGlassMaterialProps` | - | Liquid glass configuration |

### Layout Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `width` | `number \| string` | `"100%"` | Card width |
| `height` | `number \| string` | `"auto"` | Card height |
| `maxWidth` | `number \| string` | - | Maximum card width |
| `minHeight` | `number \| string` | - | Minimum card height |

### Interaction Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `hover` | `boolean` | `true` | Enable hover effects |
| `clickable` | `boolean` | `false` | Make card clickable |
| `ripple` | `boolean` | `false` | Enable ripple effect on click |
| `liftOnHover` | `boolean` | `true` | Lift card on hover |

## Usage Examples

### Basic Card

```tsx
import { GlassCard } from '@/components/card/GlassCard'

function BasicCard() {
  return (
    <GlassCard>
      <h3>Card Title</h3>
      <p>This is a basic glass card with default styling.</p>
    </GlassCard>
  )
}
```

### Liquid Glass Card

```tsx
function LiquidGlassCard() {
  return (
    <GlassCard
      material="liquid"
      materialProps={{
        ior: 1.43,
        quality: "high",
        tint: "neutral",
        thickness: 2,
        environmentalAdaptation: true
      }}
      variant="elevated"
      interactive={true}
    >
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Premium Card</h3>
        <p>This card uses liquid glass material for enhanced visual appeal.</p>
        <div className="flex gap-2">
          <GlassButton size="sm">Action</GlassButton>
          <GlassButton size="sm" variant="ghost">Cancel</GlassButton>
        </div>
      </div>
    </GlassCard>
  )
}
```

### Variant-Specific Properties

```tsx
function VariantCards() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <GlassCard
        variant="default"
        material="liquid"
        materialProps={{
          ior: 1.42, // Light refraction
          thickness: 1.5
        }}
      >
        <h4>Default Card</h4>
        <p>Subtle glass effects</p>
      </GlassCard>
      
      <GlassCard
        variant="elevated"
        material="liquid"
        materialProps={{
          ior: 1.44, // Medium refraction
          thickness: 2.5
        }}
        elevation={3}
      >
        <h4>Elevated Card</h4>
        <p>Enhanced depth and presence</p>
      </GlassCard>
      
      <GlassCard
        variant="outlined"
        material="liquid"
        materialProps={{
          ior: 1.43, // Standard refraction
          thickness: 2,
          tint: "cool"
        }}
      >
        <h4>Outlined Card</h4>
        <p>Defined borders with tinting</p>
      </GlassCard>
      
      <GlassCard
        variant="filled"
        material="liquid"
        materialProps={{
          ior: 1.45, // Strong refraction
          thickness: 3,
          opacity: 0.95
        }}
      >
        <h4>Filled Card</h4>
        <p>Dense material appearance</p>
      </GlassCard>
    </div>
  )
}
```

### Interactive Card with Hover Effects

```tsx
function InteractiveCard() {
  const [isHovered, setIsHovered] = useState(false)
  
  return (
    <GlassCard
      interactive={true}
      clickable={true}
      liftOnHover={true}
      material="liquid"
      materialProps={{
        ior: isHovered ? 1.46 : 1.43,
        thickness: isHovered ? 3 : 2,
        motionFactor: 1.2,
        hoverIntensity: 1.3
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => console.log('Card clicked')}
    >
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <GlassAvatar size="sm" />
          <div>
            <h4 className="font-medium">Interactive Card</h4>
            <p className="text-sm text-gray-600">Hover for effects</p>
          </div>
        </div>
        <p>Click me for interaction feedback!</p>
      </div>
    </GlassCard>
  )
}
```

## Card Variants

### Default Card
```tsx
<GlassCard variant="default" material="liquid">
  <StandardContent />
</GlassCard>
```
- Subtle glass effects
- Minimal visual hierarchy
- General-purpose usage

### Elevated Card
```tsx
<GlassCard
  variant="elevated"
  material="liquid"
  materialProps={{
    ior: 1.44,
    thickness: 2.5
  }}
  elevation={3}
>
  <ImportantContent />
</GlassCard>
```
- Enhanced depth and shadow
- Strong visual hierarchy
- Important content areas

### Outlined Card
```tsx
<GlassCard
  variant="outlined"
  material="liquid"
  materialProps={{
    tint: "cool",
    thickness: 2
  }}
>
  <DefinedContent />
</GlassCard>
```
- Clear boundaries
- Defined structure
- Content separation

### Filled Card
```tsx
<GlassCard
  variant="filled"
  material="liquid"
  materialProps={{
    ior: 1.45,
    opacity: 0.95,
    thickness: 3
  }}
>
  <DenseContent />
</GlassCard>
```
- Dense material appearance
- Strong presence
- Premium content areas

## Advanced Features

### Adaptive Density

```tsx
function AdaptiveDensityCard() {
  const cardRef = useRef<HTMLDivElement>(null)
  const [contentDensity, setContentDensity] = useState(1)
  
  useEffect(() => {
    // Analyze content complexity and adjust glass properties
    const complexity = analyzeContentComplexity(cardRef.current)
    setContentDensity(complexity)
  }, [])
  
  return (
    <GlassCard
      ref={cardRef}
      material="liquid"
      materialProps={{
        ior: 1.43 + (contentDensity * 0.02),
        thickness: 2 + (contentDensity * 0.5),
        environmentalAdaptation: true
      }}
    >
      <ComplexContent />
    </GlassCard>
  )
}
```

### Context-Aware Properties

```tsx
function ContextAwareCard({ usage }: { usage: 'dashboard' | 'modal' | 'sidebar' }) {
  const contextProps = {
    dashboard: {
      ior: 1.42,
      thickness: 2,
      quality: "balanced" as const
    },
    modal: {
      ior: 1.45,
      thickness: 3,
      quality: "high" as const
    },
    sidebar: {
      ior: 1.41,
      thickness: 1.5,
      quality: "efficient" as const
    }
  }
  
  return (
    <GlassCard
      material="liquid"
      materialProps={contextProps[usage]}
    >
      <ContextSpecificContent />
    </GlassCard>
  )
}
```

### Scroll-Adaptive Effects

```tsx
function ScrollAdaptiveCard() {
  const [scrollY, setScrollY] = useState(0)
  
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  const adaptedIOR = 1.43 + Math.min(scrollY / 1000, 0.05)
  
  return (
    <GlassCard
      material="liquid"
      materialProps={{
        ior: adaptedIOR,
        environmentalAdaptation: true,
        motionFactor: 0.8
      }}
    >
      <ScrollSensitiveContent />
    </GlassCard>
  )
}
```

## Mobile Optimization

### Touch-Optimized Card

```tsx
import { useMediaQuery } from '@/hooks/useMediaQuery'

function MobileOptimizedCard() {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const isTouch = useMediaQuery('(hover: none)')
  
  return (
    <GlassCard
      material="liquid"
      materialProps={{
        quality: isMobile ? "efficient" : "high",
        motionFactor: isTouch ? 0.5 : 1.0,
        thickness: isMobile ? 2.5 : 2,
        gpuAcceleration: !isMobile
      }}
      padding={isMobile ? "lg" : "md"}
      interactive={!isTouch} // Disable hover on touch devices
      ripple={isTouch} // Enhanced feedback on touch
    >
      <MobileContent />
    </GlassCard>
  )
}
```

### Gesture Recognition

```tsx
function GestureCard() {
  const [gestureState, setGestureState] = useState('idle')
  
  return (
    <GlassCard
      material="liquid"
      materialProps={{
        ior: gestureState === 'swiping' ? 1.46 : 1.43,
        motionFactor: 1.5
      }}
      onTouchStart={() => setGestureState('touching')}
      onTouchMove={() => setGestureState('swiping')}
      onTouchEnd={() => setGestureState('idle')}
    >
      <SwipeableContent />
    </GlassCard>
  )
}
```

## Layout and Composition

### Card Grid

```tsx
function CardGrid({ items }: { items: CardItem[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item, index) => (
        <GlassCard
          key={item.id}
          material="liquid"
          materialProps={{
            ior: 1.43,
            quality: "balanced",
            // Staggered animation delay
            motionFactor: 1.0
          }}
          style={{
            animationDelay: `${index * 100}ms`
          }}
          className="animate-fade-in"
        >
          <CardContent item={item} />
        </GlassCard>
      ))}
    </div>
  )
}
```

### Nested Cards

```tsx
function NestedCards() {
  return (
    <GlassCard
      material="liquid"
      materialProps={{
        ior: 1.42,
        thickness: 3,
        quality: "high"
      }}
      padding="lg"
    >
      <h2>Parent Card</h2>
      
      <div className="grid grid-cols-2 gap-4 mt-4">
        <GlassCard
          material="liquid"
          materialProps={{
            ior: 1.44, // Higher IOR for nested card
            thickness: 2,
            quality: "balanced"
          }}
          padding="sm"
        >
          <h4>Nested Card 1</h4>
        </GlassCard>
        
        <GlassCard
          material="liquid"
          materialProps={{
            ior: 1.44,
            thickness: 2,
            quality: "balanced"
          }}
          padding="sm"
        >
          <h4>Nested Card 2</h4>
        </GlassCard>
      </div>
    </GlassCard>
  )
}
```

## Accessibility Features

### Semantic Markup

```tsx
<GlassCard
  as="article"
  role="article"
  aria-labelledby="card-title"
  tabIndex={clickable ? 0 : undefined}
>
  <h3 id="card-title">Accessible Card</h3>
  <p>This card follows semantic HTML practices.</p>
</GlassCard>
```

### Focus Management

```tsx
<GlassCard
  clickable={true}
  material="liquid"
  materialProps={{
    contrastEnforcement: "strict",
    // Focus indicators enhanced with liquid glass
  }}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick()
    }
  }}
>
  <KeyboardAccessibleContent />
</GlassCard>
```

### High Contrast Support

```tsx
<GlassCard
  material="liquid"
  materialProps={{
    // Automatically adapts to high contrast preferences
    contrastEnforcement: "auto"
  }}
>
  <HighContrastContent />
</GlassCard>
```

## Styling and Theming

### Custom Styling

```tsx
<GlassCard
  className="custom-card"
  style={{
    '--card-border-radius': '12px',
    '--card-border': '1px solid rgba(255,255,255,0.1)',
    '--card-shadow': '0 8px 32px rgba(0,0,0,0.1)'
  }}
  material="liquid"
>
  <CustomStyledContent />
</GlassCard>
```

### Theme Integration

```tsx
import { useGlassTheme } from '@/hooks/useGlassTheme'

function ThemedCard() {
  const theme = useGlassTheme()
  
  return (
    <GlassCard
      material="liquid"
      materialProps={{
        ior: theme.glass.ior,
        tint: theme.glass.tint,
        quality: theme.performance.quality,
        thickness: theme.glass.thickness
      }}
      variant={theme.card.variant}
      padding={theme.card.padding}
    >
      <ThemedContent />
    </GlassCard>
  )
}
```

## Performance Optimization

### Virtualized Cards

```tsx
import { FixedSizeList as List } from 'react-window'

function VirtualizedCards({ items }: { items: CardData[] }) {
  const Card = ({ index, style }: { index: number, style: CSSProperties }) => (
    <div style={style}>
      <GlassCard
        material="liquid"
        materialProps={{
          quality: "efficient", // Lower quality for virtualized lists
          gpuAcceleration: false
        }}
      >
        <CardContent data={items[index]} />
      </GlassCard>
    </div>
  )
  
  return (
    <List
      height={600}
      itemCount={items.length}
      itemSize={200}
      itemData={items}
    >
      {Card}
    </List>
  )
}
```

### Lazy Loading

```tsx
function LazyCard({ data, inView }: { data: CardData, inView: boolean }) {
  return (
    <GlassCard
      material={inView ? "liquid" : "glass"}
      materialProps={{
        quality: inView ? "balanced" : "efficient",
        gpuAcceleration: inView
      }}
    >
      {inView ? <FullContent data={data} /> : <PlaceholderContent />}
    </GlassCard>
  )
}
```

## Integration Examples

### Data Display Cards

```tsx
function DataCard({ metric }: { metric: MetricData }) {
  return (
    <GlassCard
      material="liquid"
      materialProps={{
        ior: metric.trend === 'up' ? 1.45 : 1.43,
        tint: metric.trend === 'up' ? 'warm' : metric.trend === 'down' ? 'cool' : 'neutral'
      }}
      interactive={true}
    >
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h4 className="font-medium">{metric.label}</h4>
          <GlassBadge variant={metric.trend}>{metric.change}</GlassBadge>
        </div>
        <div className="text-2xl font-bold">{metric.value}</div>
        <GlassSparkline data={metric.history} />
      </div>
    </GlassCard>
  )
}
```

### Media Cards

```tsx
function MediaCard({ media }: { media: MediaItem }) {
  return (
    <GlassCard
      material="liquid"
      materialProps={{
        ior: 1.41, // Ultra clear for media
        quality: "high"
      }}
      padding="none"
      interactive={true}
      clickable={true}
    >
      <div className="relative">
        <img
          src={media.thumbnail}
          alt={media.title}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        <div className="p-4 space-y-2">
          <h4 className="font-medium">{media.title}</h4>
          <p className="text-sm text-gray-600">{media.description}</p>
          <div className="flex justify-between items-center">
            <span className="text-xs">{media.duration}</span>
            <GlassButton size="sm" variant="ghost">Play</GlassButton>
          </div>
        </div>
      </div>
    </GlassCard>
  )
}
```

## Browser Compatibility

| Browser | Liquid Glass | Standard Glass | Hover Effects |
|---------|-------------|---------------|---------------|
| Chrome 90+ | ✅ Full | ✅ Complete | ✅ Native |
| Safari 14+ | ✅ Full | ✅ Complete | ✅ Optimized |
| Firefox 88+ | ⚠️ Limited | ✅ Complete | ✅ Fallback |
| Edge 90+ | ✅ Full | ✅ Complete | ✅ Native |

## Migration Guide

### From Standard GlassCard

```tsx
// Before
<GlassCard
  blur={20}
  opacity={0.9}
  variant="elevated"
>
  <Content />
</GlassCard>

// After (with liquid glass)
<GlassCard
  variant="elevated"
  material="liquid"
  materialProps={{
    blur: 20,
    opacity: 0.9,
    ior: 1.44,
    quality: "balanced"
  }}
>
  <Content />
</GlassCard>
```

### Progressive Enhancement

```tsx
// Phase 1: Add material prop
<GlassCard material="glass" />

// Phase 2: Conditional liquid glass
<GlassCard material={supports3D ? "liquid" : "glass"} />

// Phase 3: Full liquid glass
<GlassCard material="liquid" />
```

## Related Components

- [GlassContainer](./glass-container.md) - Layout container
- [DimensionalGlass](./dimensional-glass.md) - Advanced 3D effects
- [GlassPanel](./glass-panel.md) - Simple panel component
- [GlassBox](./glass-box.md) - Flexible box container

## Troubleshooting

### Common Issues

1. **Cards overlapping**: Check z-index and positioning context
2. **Liquid glass not rendering**: Verify GPU support and browser compatibility
3. **Performance issues**: Lower quality tier or disable advanced effects
4. **Hover effects not working**: Ensure interactive prop is enabled

### Debug Mode

```tsx
<GlassCard
  material="liquid"
  materialProps={{ debug: true }}
>
  <DebugContent />
</GlassCard>
```

Enables visual debugging overlays and performance metrics for troubleshooting.