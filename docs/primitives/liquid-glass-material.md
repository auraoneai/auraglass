# LiquidGlassMaterial Primitive

## Overview

`LiquidGlassMaterial` is the foundational primitive that powers the Liquid Glass system. It provides physics-based glass rendering with realistic refraction, environmental adaptation, and GPU acceleration.

## Props API

### Core Properties

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `ior` | `number` | `1.43` | Index of Refraction (1.0-2.0) |
| `thickness` | `number` | `2` | Glass thickness in logical units |
| `quality` | `QualityTier` | `"balanced"` | Rendering quality level |
| `variant` | `"regular" \| "clear"` | `"regular"` | Glass material variant |

### Visual Properties

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tint` | `TintMode` | `"neutral"` | Tinting mode for glass |
| `opacity` | `number` | `0.9` | Base opacity (0-1) |
| `blur` | `number` | `20` | Backdrop blur intensity |
| `saturation` | `number` | `1.8` | Color saturation multiplier |

### Interaction Properties

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `motionFactor` | `number` | `1.0` | Motion responsiveness (0-2) |
| `hoverIntensity` | `number` | `1.2` | Hover effect multiplier |
| `pressIntensity` | `number` | `0.8` | Press effect multiplier |

### Advanced Properties

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `environmentalAdaptation` | `boolean` | `true` | Enable content-aware adaptation |
| `contrastEnforcement` | `ContrastLevel` | `"auto"` | WCAG compliance level |
| `gpuAcceleration` | `boolean` | `true` | Enable GPU-accelerated effects |
| `debug` | `boolean` | `false` | Show debugging overlays |

## Usage Examples

### Basic Implementation

```tsx
import { LiquidGlassMaterial } from '@/primitives/LiquidGlassMaterial'

function BasicGlassCard() {
  return (
    <LiquidGlassMaterial>
      <div className="p-6">
        <h2>Glass Card Content</h2>
        <p>This content is rendered with liquid glass effects.</p>
      </div>
    </LiquidGlassMaterial>
  )
}
```

### Customized Material Properties

```tsx
function CustomGlass() {
  return (
    <LiquidGlassMaterial
      ior={1.46}
      thickness={3}
      quality="ultra"
      tint="warm"
      motionFactor={0.8}
    >
      <YourComponent />
    </LiquidGlassMaterial>
  )
}
```

### Interactive Glass Surface

```tsx
function InteractiveGlass() {
  const [isPressed, setIsPressed] = useState(false)
  
  return (
    <LiquidGlassMaterial
      ior={isPressed ? 1.48 : 1.43}
      hoverIntensity={1.3}
      pressIntensity={0.7}
      motionFactor={1.2}
    >
      <button
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
      >
        Interactive Glass Button
      </button>
    </LiquidGlassMaterial>
  )
}
```

### Performance-Optimized Usage

```tsx
function OptimizedGlass() {
  const isMobile = useMediaQuery('(max-width: 768px)')
  
  return (
    <LiquidGlassMaterial
      quality={isMobile ? "efficient" : "high"}
      gpuAcceleration={!isMobile}
      motionFactor={isMobile ? 0.5 : 1.0}
    >
      <ResponsiveContent />
    </LiquidGlassMaterial>
  )
}
```

## Material Variants

### Regular Glass (Default)
- **IOR**: 1.43
- **Appearance**: Standard glass with subtle refraction
- **Use Cases**: General UI elements, cards, panels

### Ultra Clear Glass
- **IOR**: 1.41
- **Appearance**: Minimal refraction, crystal clear
- **Use Cases**: Content overlays, subtle backgrounds

### Dense Glass
- **IOR**: 1.46
- **Appearance**: Strong refraction, thick material
- **Use Cases**: Primary actions, important notifications

### Crystal Glass
- **IOR**: 1.52
- **Appearance**: Maximum refraction, premium feel
- **Use Cases**: Hero elements, premium features

## Quality Tiers

### Ultra Quality
- **Performance**: High GPU usage
- **Features**: Full shader effects, procedural normals
- **Recommended**: High-end devices, desktop

```tsx
<LiquidGlassMaterial quality="ultra" />
```

### High Quality
- **Performance**: Moderate GPU usage
- **Features**: Optimized shaders, essential effects
- **Recommended**: Modern devices, tablets

```tsx
<LiquidGlassMaterial quality="high" />
```

### Balanced Quality
- **Performance**: Hybrid approach
- **Features**: GPU + CSS fallback
- **Recommended**: General use, cross-device

```tsx
<LiquidGlassMaterial quality="balanced" />
```

### Efficient Quality
- **Performance**: CSS-only rendering
- **Features**: Basic glass effects
- **Recommended**: Low-end devices, battery save

```tsx
<LiquidGlassMaterial quality="efficient" />
```

## Tinting System

### Neutral Tint
```tsx
<LiquidGlassMaterial tint="neutral" />
```
Pure glass appearance with no color bias.

### Warm Tint
```tsx
<LiquidGlassMaterial tint="warm" />
```
Subtle amber/golden tinting for welcoming interfaces.

### Cool Tint
```tsx
<LiquidGlassMaterial tint="cool" />
```
Blue-tinted glass for technical or professional contexts.

### Content-Aware Tint
```tsx
<LiquidGlassMaterial tint="content" />
```
Dynamically adapts tinting based on background content.

## Accessibility Features

### Contrast Enforcement
```tsx
<LiquidGlassMaterial
  contrastEnforcement="strict"
  // Automatically adjusts opacity/tint for WCAG AAA compliance
/>
```

### Reduced Motion Support
```tsx
<LiquidGlassMaterial
  // Automatically respects prefers-reduced-motion
  motionFactor={0} // Manual override if needed
/>
```

### High Contrast Mode
```tsx
<LiquidGlassMaterial
  // Automatically detects high contrast preferences
  // Switches to enhanced visibility mode
/>
```

## Performance Optimization

### GPU Memory Management
```tsx
import { useLiquidGlassMemory } from '@/hooks/useLiquidGlassMemory'

function OptimizedComponent() {
  const { allocateGPU, deallocateGPU } = useLiquidGlassMemory()
  
  useEffect(() => {
    allocateGPU('component-id')
    return () => deallocateGPU('component-id')
  }, [])
  
  return <LiquidGlassMaterial />
}
```

### Conditional Rendering
```tsx
function ConditionalGlass() {
  const { isLowPowerMode } = useDeviceCapabilities()
  
  if (isLowPowerMode) {
    return <div className="fallback-glass" />
  }
  
  return <LiquidGlassMaterial quality="balanced" />
}
```

## Integration with Other Components

### With Motion Controllers
```tsx
import { GlassMotionController } from '@/components/animations/GlassMotionController'

<GlassMotionController>
  <LiquidGlassMaterial motionFactor={1.2}>
    <AnimatedContent />
  </LiquidGlassMaterial>
</GlassMotionController>
```

### With Theme System
```tsx
import { useGlassTheme } from '@/hooks/useGlassTheme'

function ThemedGlass() {
  const theme = useGlassTheme()
  
  return (
    <LiquidGlassMaterial
      ior={theme.glass.ior}
      tint={theme.glass.tint}
      quality={theme.performance.quality}
    >
      <Content />
    </LiquidGlassMaterial>
  )
}
```

## Debug Mode

Enable debug mode to visualize glass properties:

```tsx
<LiquidGlassMaterial debug={true}>
  <YourComponent />
</LiquidGlassMaterial>
```

Debug mode shows:
- IOR visualization overlay
- GPU performance metrics
- Contrast compliance status
- Material property indicators

## Browser-Specific Considerations

### Safari Optimization
```tsx
<LiquidGlassMaterial
  // Safari has native backdrop-filter optimization
  quality="ultra"
  gpuAcceleration={true}
/>
```

### Firefox Compatibility
```tsx
<LiquidGlassMaterial
  // Firefox has limited WebGL support
  quality="balanced"
  gpuAcceleration={false}
/>
```

## TypeScript Integration

```tsx
import type { LiquidGlassMaterialProps } from '@/primitives/LiquidGlassMaterial'

interface CustomGlassProps extends LiquidGlassMaterialProps {
  children: React.ReactNode
  customProp?: string
}

function CustomGlassComponent({ children, ...glassProps }: CustomGlassProps) {
  return (
    <LiquidGlassMaterial {...glassProps}>
      {children}
    </LiquidGlassMaterial>
  )
}
```

## Related Documentation

- [Liquid Glass System Overview](./liquid-glass-system.md)
- [GPU Acceleration Guide](../components/27-revolutionary-enhancements/liquid-glass-gpu.md)
- [Accessibility Guidelines](../guides/accessibility.md)
- [Performance Best Practices](./performance-optimization.md)

## Migration from OptimizedGlass

See [Liquid Glass Migration Guide](../guides/liquid-glass-migration.md) for detailed migration instructions from the previous glass system.