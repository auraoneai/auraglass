# GlassButton Component

## Overview

`GlassButton` is a premium interactive button component with liquid glass material support. It features pressure-sensitive effects, size-responsive thickness adaptation, and seamless integration with the Liquid Glass system.

## Features

- ✨ Liquid Glass material with pressure-sensitive IOR changes
- 🎯 Size-responsive thickness adaptation
- 📱 Touch-optimized interactions and feedback
- ♿ Full accessibility with enhanced focus indicators
- 🎨 Multiple variants and customizable styling
- ⚡ GPU-accelerated hover and press effects

## Props API

### Core Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"primary" \| "secondary" \| "ghost" \| "destructive"` | `"primary"` | Button style variant |
| `size` | `"sm" \| "md" \| "lg" \| "xl"` | `"md"` | Button size |
| `disabled` | `boolean` | `false` | Disabled state |
| `loading` | `boolean` | `false` | Loading state with spinner |

### Liquid Glass Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `material` | `"glass" \| "liquid"` | `"glass"` | Material system to use |
| `materialProps` | `LiquidGlassMaterialProps` | - | Liquid glass configuration |

### Interaction Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `pressIntensity` | `number` | `0.8` | Press effect intensity (0-2) |
| `hoverIntensity` | `number` | `1.2` | Hover effect intensity (0-2) |
| `ripple` | `boolean` | `true` | Enable ripple effect on click |

### Layout Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `fullWidth` | `boolean` | `false` | Expand to full container width |
| `icon` | `React.ReactNode` | - | Icon element (left side) |
| `iconRight` | `React.ReactNode` | - | Icon element (right side) |

## Usage Examples

### Basic Button

```tsx
import { GlassButton } from '@/components/button/GlassButton'

function BasicButton() {
  return (
    <div className="space-x-2">
      <GlassButton variant="primary">
        Primary Action
      </GlassButton>
      
      <GlassButton variant="secondary">
        Secondary Action
      </GlassButton>
      
      <GlassButton variant="ghost">
        Ghost Button
      </GlassButton>
    </div>
  )
}
```

### Liquid Glass Button

```tsx
function LiquidGlassButton() {
  return (
    <GlassButton
      variant="primary"
      material="liquid"
      materialProps={{
        ior: 1.45,
        quality: "high",
        tint: "neutral",
        thickness: 2,
        motionFactor: 1.2
      }}
    >
      Premium Action
    </GlassButton>
  )
}
```

### Interactive Effects

```tsx
function InteractiveButton() {
  return (
    <GlassButton
      material="liquid"
      materialProps={{
        ior: 1.43, // Changes to 1.46 on hover, 1.48 on press
        quality: "balanced",
        hoverIntensity: 1.3,
        pressIntensity: 0.7
      }}
      pressIntensity={0.9}
      hoverIntensity={1.4}
      ripple={true}
    >
      Interactive Glass
    </GlassButton>
  )
}
```

### Size-Responsive Buttons

```tsx
function ResponsiveButtons() {
  return (
    <div className="space-y-4">
      <GlassButton
        size="sm"
        material="liquid"
        materialProps={{
          thickness: 1.5, // Thinner for small buttons
          ior: 1.42
        }}
      >
        Small Button
      </GlassButton>
      
      <GlassButton
        size="md"
        material="liquid"
        materialProps={{
          thickness: 2, // Standard thickness
          ior: 1.43
        }}
      >
        Medium Button
      </GlassButton>
      
      <GlassButton
        size="lg"
        material="liquid"
        materialProps={{
          thickness: 2.5, // Thicker for large buttons
          ior: 1.44
        }}
      >
        Large Button
      </GlassButton>
      
      <GlassButton
        size="xl"
        material="liquid"
        materialProps={{
          thickness: 3, // Thickest for XL buttons
          ior: 1.45
        }}
      >
        Extra Large Button
      </GlassButton>
    </div>
  )
}
```

## Button Variants

### Primary Button
```tsx
<GlassButton variant="primary" material="liquid">
  Primary Action
</GlassButton>
```
- High visibility for main actions
- Enhanced glass effects
- Strong visual hierarchy

### Secondary Button
```tsx
<GlassButton variant="secondary" material="liquid">
  Secondary Action
</GlassButton>
```
- Supporting actions
- Moderate glass effects
- Balanced visual weight

### Ghost Button
```tsx
<GlassButton variant="ghost" material="liquid">
  Ghost Action
</GlassButton>
```
- Subtle appearance
- Minimal glass effects
- Low visual hierarchy

### Destructive Button
```tsx
<GlassButton
  variant="destructive"
  material="liquid"
  materialProps={{
    tint: "warm", // Subtle red tinting
    ior: 1.46 // Slightly higher refraction
  }}
>
  Delete Item
</GlassButton>
```
- Warning/danger actions
- Warm tinting for attention
- Enhanced refraction

## Advanced Features

### Loading State

```tsx
function LoadingButton() {
  const [loading, setLoading] = useState(false)
  
  const handleClick = async () => {
    setLoading(true)
    await performAsyncAction()
    setLoading(false)
  }
  
  return (
    <GlassButton
      loading={loading}
      disabled={loading}
      onClick={handleClick}
      material="liquid"
      materialProps={{
        // Glass effects adjust during loading
        motionFactor: loading ? 0.5 : 1.0,
        opacity: loading ? 0.8 : 0.9
      }}
    >
      {loading ? 'Processing...' : 'Submit'}
    </GlassButton>
  )
}
```

### Icon Buttons

```tsx
import { SearchIcon, UserIcon, SettingsIcon } from '@/icons'

function IconButtons() {
  return (
    <div className="flex gap-2">
      <GlassButton
        variant="ghost"
        size="sm"
        material="liquid"
        icon={<SearchIcon />}
      >
        Search
      </GlassButton>
      
      <GlassButton
        variant="primary"
        material="liquid"
        icon={<UserIcon />}
        iconRight={<SettingsIcon />}
      >
        User Settings
      </GlassButton>
    </div>
  )
}
```

### Full Width Button

```tsx
<GlassButton
  fullWidth
  variant="primary"
  material="liquid"
  materialProps={{
    quality: "high",
    environmentalAdaptation: true
  }}
>
  Full Width Action
</GlassButton>
```

### Pressure-Sensitive Effects

```tsx
function PressureSensitiveButton() {
  const [pressure, setPressure] = useState(0)
  
  return (
    <GlassButton
      material="liquid"
      materialProps={{
        ior: 1.43 + (pressure * 0.05),
        thickness: 2 + (pressure * 0.5),
        opacity: 0.9 + (pressure * 0.1)
      }}
      onTouchStart={(e) => {
        if (e.touches[0].force) {
          setPressure(e.touches[0].force)
        }
      }}
      onTouchEnd={() => setPressure(0)}
    >
      Pressure Sensitive
    </GlassButton>
  )
}
```

## Mobile Optimization

### Touch-Optimized Button

```tsx
import { useMediaQuery } from '@/hooks/useMediaQuery'

function MobileOptimizedButton() {
  const isMobile = useMediaQuery('(max-width: 768px)')
  
  return (
    <GlassButton
      size={isMobile ? "lg" : "md"}
      material="liquid"
      materialProps={{
        quality: isMobile ? "efficient" : "high",
        motionFactor: isMobile ? 0.6 : 1.0,
        thickness: isMobile ? 2.5 : 2,
        gpuAcceleration: !isMobile
      }}
      ripple={isMobile} // Enhanced feedback on mobile
    >
      Mobile Friendly
    </GlassButton>
  )
}
```

### Gesture Recognition

```tsx
function GestureButton() {
  return (
    <GlassButton
      material="liquid"
      materialProps={{
        motionFactor: 1.5, // Responds to device movement
        hoverIntensity: 1.2
      }}
      onTouchMove={(e) => {
        // Custom gesture handling
        const touch = e.touches[0]
        // Adjust glass effects based on touch movement
      }}
    >
      Gesture Responsive
    </GlassButton>
  )
}
```

## Accessibility Features

### Enhanced Focus Indicators

```tsx
<GlassButton
  material="liquid"
  materialProps={{
    contrastEnforcement: "strict",
    // Focus ring is enhanced with liquid glass effects
  }}
  aria-label="Accessible button with enhanced focus"
>
  Accessible Button
</GlassButton>
```

### Screen Reader Support

```tsx
<GlassButton
  loading={loading}
  aria-describedby="button-help"
  aria-pressed={isPressed}
>
  Toggle Action
  <span id="button-help" className="sr-only">
    Click to toggle the current state
  </span>
</GlassButton>
```

### High Contrast Mode

```tsx
<GlassButton
  material="liquid"
  materialProps={{
    // Automatically detects high contrast preferences
    // Adjusts glass properties for visibility
    contrastEnforcement: "auto"
  }}
>
  High Contrast Compatible
</GlassButton>
```

## Styling and Theming

### Custom Styles

```tsx
<GlassButton
  className="custom-button"
  style={{
    '--button-border': '1px solid rgba(255,255,255,0.2)',
    '--button-shadow': '0 4px 6px rgba(0,0,0,0.1)'
  }}
  material="liquid"
>
  Custom Styled
</GlassButton>
```

### Theme Integration

```tsx
import { useGlassTheme } from '@/hooks/useGlassTheme'

function ThemedButton() {
  const theme = useGlassTheme()
  
  return (
    <GlassButton
      material="liquid"
      materialProps={{
        ior: theme.glass.ior,
        tint: theme.glass.tint,
        quality: theme.performance.quality,
        thickness: theme.glass.thickness
      }}
      variant={theme.button.variant}
    >
      Themed Button
    </GlassButton>
  )
}
```

## Performance Optimization

### Conditional Liquid Glass

```tsx
function OptimizedButton() {
  const { isLowPowerMode } = useDeviceCapabilities()
  
  return (
    <GlassButton
      material={isLowPowerMode ? "glass" : "liquid"}
      materialProps={{
        quality: isLowPowerMode ? "efficient" : "balanced",
        gpuAcceleration: !isLowPowerMode
      }}
    >
      Performance Optimized
    </GlassButton>
  )
}
```

### Debounced Effects

```tsx
import { useDebounce } from '@/hooks/useDebounce'

function DebouncedButton() {
  const [isHovered, setIsHovered] = useState(false)
  const debouncedHover = useDebounce(isHovered, 100)
  
  return (
    <GlassButton
      material="liquid"
      materialProps={{
        ior: debouncedHover ? 1.46 : 1.43,
        // Prevents excessive re-renders during hover
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      Debounced Effects
    </GlassButton>
  )
}
```

## Integration Examples

### Form Integration

```tsx
import { useForm } from 'react-hook-form'

function FormWithGlassButtons() {
  const { handleSubmit, formState: { isSubmitting } } = useForm()
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <GlassInput label="Name" />
      
      <div className="flex gap-2 mt-4">
        <GlassButton
          type="submit"
          loading={isSubmitting}
          material="liquid"
          materialProps={{ quality: "balanced" }}
        >
          Submit
        </GlassButton>
        
        <GlassButton
          type="button"
          variant="ghost"
          disabled={isSubmitting}
        >
          Cancel
        </GlassButton>
      </div>
    </form>
  )
}
```

### Navigation Integration

```tsx
import { useRouter } from 'next/router'

function NavigationButtons() {
  const router = useRouter()
  
  return (
    <div className="flex gap-2">
      <GlassButton
        variant="ghost"
        material="liquid"
        onClick={() => router.back()}
        icon={<ArrowLeftIcon />}
      >
        Back
      </GlassButton>
      
      <GlassButton
        variant="primary"
        material="liquid"
        onClick={() => router.push('/next')}
        iconRight={<ArrowRightIcon />}
      >
        Next
      </GlassButton>
    </div>
  )
}
```

### State Management Integration

```tsx
import { useDispatch, useSelector } from 'react-redux'

function StateConnectedButton() {
  const dispatch = useDispatch()
  const { count, loading } = useSelector(state => state.counter)
  
  return (
    <GlassButton
      material="liquid"
      materialProps={{
        // Visual feedback based on state
        ior: count > 10 ? 1.46 : 1.43,
        tint: count > 10 ? "warm" : "neutral"
      }}
      loading={loading}
      onClick={() => dispatch({ type: 'INCREMENT' })}
    >
      Count: {count}
    </GlassButton>
  )
}
```

## Animation and Transitions

### Custom Animations

```tsx
<GlassButton
  material="liquid"
  materialProps={{
    motionFactor: 1.2,
    // Enhanced animation support in liquid glass
  }}
  className="animate-bounce-on-click"
>
  Animated Button
</GlassButton>
```

### Staggered Group Animations

```tsx
function AnimatedButtonGroup() {
  return (
    <div className="space-x-2">
      {buttons.map((button, index) => (
        <GlassButton
          key={button.id}
          material="liquid"
          materialProps={{
            motionFactor: 1.0,
            // Staggered animation delay
          }}
          style={{
            animationDelay: `${index * 100}ms`
          }}
          className="animate-fade-in"
        >
          {button.label}
        </GlassButton>
      ))}
    </div>
  )
}
```

## Browser Compatibility

| Browser | Liquid Glass | Standard Glass | Ripple Effects |
|---------|-------------|---------------|----------------|
| Chrome 90+ | ✅ Full | ✅ Complete | ✅ Native |
| Safari 14+ | ✅ Full | ✅ Complete | ✅ Optimized |
| Firefox 88+ | ⚠️ Limited | ✅ Complete | ✅ Fallback |
| Edge 90+ | ✅ Full | ✅ Complete | ✅ Native |

## Migration Guide

### From Standard GlassButton

```tsx
// Before
<GlassButton
  blur={15}
  opacity={0.85}
  variant="primary"
>
  Action
</GlassButton>

// After (with liquid glass)
<GlassButton
  variant="primary"
  material="liquid"
  materialProps={{
    blur: 15,
    opacity: 0.85,
    ior: 1.43,
    quality: "balanced"
  }}
>
  Action
</GlassButton>
```

### Gradual Migration Strategy

```tsx
// Phase 1: Add material prop
<GlassButton material="glass" />

// Phase 2: Conditional liquid glass
<GlassButton material={canUseAdvanced ? "liquid" : "glass"} />

// Phase 3: Full liquid glass
<GlassButton material="liquid" />
```

## Related Components

- [GlassFab](./glass-fab.md) - Floating action button
- [GlassMagneticButton](./glass-magnetic-button.md) - Magnetic interaction effects
- [GlassToggle](./glass-toggle.md) - Toggle button component
- [GlassInput](./glass-input.md) - Input components with glass styling

## Troubleshooting

### Common Issues

1. **Button not clickable**: Check z-index and pointer-events CSS
2. **Liquid glass not rendering**: Verify GPU support and browser compatibility
3. **Performance issues**: Lower quality tier or disable animations
4. **Focus indicators not visible**: Enable contrast enforcement

### Debug Mode

```tsx
<GlassButton
  material="liquid"
  materialProps={{ debug: true }}
>
  Debug Button
</GlassButton>
```

Enables visual debugging overlays and performance metrics for troubleshooting.