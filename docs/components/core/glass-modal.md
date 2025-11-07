# GlassModal Component

## Overview

`GlassModal` is a premium modal dialog component with liquid glass material support. It provides immersive overlay experiences with realistic glass physics, environmental adaptation, and accessibility-first design.

## Features

- ✨ Liquid Glass material with IOR-based refraction
- 🎯 Adaptive tinting based on urgency levels
- 📱 Mobile-optimized rendering and interactions
- ♿ WCAG AA/AAA compliance with ContrastGuard
- 🎨 Environmental content adaptation
- ⚡ GPU-accelerated effects with CSS fallbacks

## Props API

### Core Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | `false` | Modal visibility state |
| `onClose` | `() => void` | - | Close callback function |
| `title` | `string` | - | Modal title |
| `size` | `"sm" \| "md" \| "lg" \| "xl"` | `"md"` | Modal size variant |

### Liquid Glass Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `material` | `"glass" \| "liquid"` | `"glass"` | Material system to use |
| `materialProps` | `LiquidGlassMaterialProps` | - | Liquid glass configuration |

### Layout Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `maxWidth` | `number \| string` | - | Maximum modal width |
| `height` | `number \| string` | `"auto"` | Modal height |
| `padding` | `number \| string` | `24` | Internal content padding |
| `centered` | `boolean` | `true` | Center modal vertically |

### Behavior Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `closeOnBackdrop` | `boolean` | `true` | Close when clicking backdrop |
| `closeOnEscape` | `boolean` | `true` | Close with Escape key |
| `preventScroll` | `boolean` | `true` | Prevent body scroll when open |
| `urgency` | `"low" \| "normal" \| "high" \| "critical"` | `"normal"` | Urgency level for adaptive tinting |

## Usage Examples

### Basic Modal

```tsx
import { GlassModal } from '@/components/modal/GlassModal'
import { useState } from 'react'

function BasicModal() {
  const [open, setOpen] = useState(false)
  
  return (
    <>
      <button onClick={() => setOpen(true)}>
        Open Modal
      </button>
      
      <GlassModal
        open={open}
        onClose={() => setOpen(false)}
        title="Basic Modal"
      >
        <p>This is a basic glass modal with standard appearance.</p>
      </GlassModal>
    </>
  )
}
```

### Liquid Glass Modal

```tsx
function LiquidGlassModal() {
  const [open, setOpen] = useState(false)
  
  return (
    <GlassModal
      open={open}
      onClose={() => setOpen(false)}
      title="Premium Dialog"
      material="liquid"
      materialProps={{
        ior: 1.45,
        quality: "high",
        tint: "neutral",
        thickness: 3,
        environmentalAdaptation: true
      }}
      size="lg"
    >
      <div className="space-y-4">
        <p>This modal uses liquid glass material for premium feel.</p>
        <div className="flex gap-2">
          <button className="glass-button-primary">Confirm</button>
          <button className="glass-button-secondary">Cancel</button>
        </div>
      </div>
    </GlassModal>
  )
}
```

### Urgency-Based Adaptive Tinting

```tsx
function AdaptiveModal() {
  const [urgency, setUrgency] = useState<'low' | 'normal' | 'high' | 'critical'>('normal')
  
  return (
    <GlassModal
      open={true}
      title="Adaptive Modal"
      material="liquid"
      urgency={urgency}
      materialProps={{
        // Automatically adjusts IOR and tint based on urgency
        ior: urgency === 'critical' ? 1.48 : 1.43,
        quality: "balanced"
      }}
    >
      <div className="space-y-4">
        <p>This modal adapts its appearance based on urgency level.</p>
        
        <div className="flex gap-2">
          <button onClick={() => setUrgency('low')}>Low</button>
          <button onClick={() => setUrgency('normal')}>Normal</button>
          <button onClick={() => setUrgency('high')}>High</button>
          <button onClick={() => setUrgency('critical')}>Critical</button>
        </div>
      </div>
    </GlassModal>
  )
}
```

### Mobile-Optimized Modal

```tsx
import { useMediaQuery } from '@/hooks/useMediaQuery'

function ResponsiveModal() {
  const isMobile = useMediaQuery('(max-width: 768px)')
  
  return (
    <GlassModal
      open={true}
      title="Mobile Modal"
      material="liquid"
      materialProps={{
        quality: isMobile ? "efficient" : "high",
        motionFactor: isMobile ? 0.5 : 1.0,
        ior: 1.43,
        gpuAcceleration: !isMobile
      }}
      size={isMobile ? "sm" : "md"}
      height={isMobile ? "100vh" : "auto"}
    >
      <MobileOptimizedContent />
    </GlassModal>
  )
}
```

## Size Variants

### Small Modal
```tsx
<GlassModal size="sm" maxWidth={400}>
  <CompactContent />
</GlassModal>
```

### Medium Modal (Default)
```tsx
<GlassModal size="md" maxWidth={600}>
  <StandardContent />
</GlassModal>
```

### Large Modal
```tsx
<GlassModal size="lg" maxWidth={800}>
  <ExtendedContent />
</GlassModal>
```

### Extra Large Modal
```tsx
<GlassModal size="xl" maxWidth={1200}>
  <ComplexContent />
</GlassModal>
```

## Advanced Features

### Environmental Adaptation

```tsx
<GlassModal
  material="liquid"
  materialProps={{
    environmentalAdaptation: true,
    // Automatically samples backdrop content
    // Adjusts opacity and tint for optimal visibility
    contrastEnforcement: "strict"
  }}
>
  <ContentWithDynamicBackground />
</GlassModal>
```

### Custom Glass Properties

```tsx
function CustomGlassModal() {
  const [glassIntensity, setGlassIntensity] = useState(1.0)
  
  return (
    <GlassModal
      material="liquid"
      materialProps={{
        ior: 1.43 + (glassIntensity * 0.05),
        thickness: 2 + glassIntensity,
        opacity: 0.9 - (glassIntensity * 0.1),
        blur: 20 + (glassIntensity * 10)
      }}
    >
      <div>
        <label>Glass Intensity:</label>
        <input
          type="range"
          min={0}
          max={2}
          step={0.1}
          value={glassIntensity}
          onChange={e => setGlassIntensity(Number(e.target.value))}
        />
      </div>
    </GlassModal>
  )
}
```

### Performance Monitoring

```tsx
import { useLiquidGlassPerformance } from '@/hooks/useLiquidGlassPerformance'

function PerformanceAwareModal() {
  const { fps, gpuMemory } = useLiquidGlassPerformance()
  const shouldOptimize = fps < 30 || gpuMemory > 80
  
  return (
    <GlassModal
      material="liquid"
      materialProps={{
        quality: shouldOptimize ? "efficient" : "ultra",
        gpuAcceleration: !shouldOptimize,
        motionFactor: shouldOptimize ? 0.3 : 1.0
      }}
    >
      <PerformanceIndicator fps={fps} memory={gpuMemory} />
    </GlassModal>
  )
}
```

## Accessibility Features

### Screen Reader Support

```tsx
<GlassModal
  title="Accessible Modal"
  aria-describedby="modal-description"
  role="dialog"
  aria-modal="true"
>
  <div id="modal-description">
    This modal provides full accessibility support.
  </div>
</GlassModal>
```

### Focus Management

The modal automatically:
- Traps focus within the modal content
- Returns focus to trigger element on close
- Supports keyboard navigation (Tab, Shift+Tab, Escape)

### Contrast Enforcement

```tsx
<GlassModal
  material="liquid"
  materialProps={{
    contrastEnforcement: "strict", // WCAG AAA compliance
    // Automatically adjusts glass properties for readability
  }}
>
  <HighContrastContent />
</GlassModal>
```

### Reduced Motion Support

```tsx
<GlassModal
  material="liquid"
  materialProps={{
    // Automatically respects prefers-reduced-motion
    motionFactor: 0 // Manual override if needed
  }}
>
  <StaticContent />
</GlassModal>
```

## Animation and Transitions

### Custom Entry/Exit Animations

```tsx
<GlassModal
  material="liquid"
  materialProps={{
    // Liquid glass enables enhanced animations
    motionFactor: 1.2,
    hoverIntensity: 1.1
  }}
  className="custom-modal-animation"
>
  <AnimatedContent />
</GlassModal>
```

### Backdrop Effects

```tsx
<GlassModal
  material="liquid"
  materialProps={{
    // Backdrop blur and tinting
    blur: 30,
    tint: "cool",
    opacity: 0.95
  }}
  className="dramatic-backdrop"
>
  <DramaticContent />
</GlassModal>
```

## Integration Examples

### Form Modal

```tsx
import { useForm } from 'react-hook-form'

function FormModal() {
  const { register, handleSubmit } = useForm()
  
  return (
    <GlassModal
      title="Contact Form"
      material="liquid"
      materialProps={{ quality: "balanced" }}
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <GlassInput
          label="Name"
          {...register('name', { required: true })}
        />
        <GlassTextarea
          label="Message"
          {...register('message')}
        />
        <div className="flex gap-2">
          <GlassButton type="submit" variant="primary">
            Send
          </GlassButton>
          <GlassButton type="button" variant="secondary">
            Cancel
          </GlassButton>
        </div>
      </form>
    </GlassModal>
  )
}
```

### Confirmation Modal

```tsx
function ConfirmationModal({ action, onConfirm, onCancel }) {
  return (
    <GlassModal
      title="Confirm Action"
      material="liquid"
      urgency={action.dangerous ? "critical" : "normal"}
      materialProps={{
        ior: action.dangerous ? 1.48 : 1.43,
        tint: action.dangerous ? "warm" : "neutral"
      }}
      size="sm"
    >
      <div className="space-y-4">
        <p>Are you sure you want to {action.description}?</p>
        {action.dangerous && (
          <div className="glass-alert-warning">
            This action cannot be undone.
          </div>
        )}
        <div className="flex gap-2">
          <GlassButton
            onClick={onConfirm}
            variant={action.dangerous ? "destructive" : "primary"}
          >
            Confirm
          </GlassButton>
          <GlassButton onClick={onCancel} variant="ghost">
            Cancel
          </GlassButton>
        </div>
      </div>
    </GlassModal>
  )
}
```

### Image Gallery Modal

```tsx
function GalleryModal({ image, onPrevious, onNext }) {
  return (
    <GlassModal
      open={!!image}
      size="xl"
      material="liquid"
      materialProps={{
        ior: 1.41, // Ultra clear for image viewing
        quality: "ultra",
        tint: "neutral",
        environmentalAdaptation: false // Consistent appearance
      }}
      padding={0}
    >
      <div className="relative">
        <img
          src={image?.url}
          alt={image?.alt}
          className="max-w-full max-h-[80vh] object-contain"
        />
        <div className="absolute bottom-4 left-4 right-4">
          <GlassCard className="p-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">{image?.title}</span>
              <div className="flex gap-2">
                <GlassButton size="sm" onClick={onPrevious}>
                  Previous
                </GlassButton>
                <GlassButton size="sm" onClick={onNext}>
                  Next
                </GlassButton>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </GlassModal>
  )
}
```

## Styling and Theming

### Custom Styles

```tsx
<GlassModal
  className="custom-modal"
  style={{
    '--modal-border': '1px solid rgba(255,255,255,0.1)',
    '--modal-shadow': '0 25px 50px -12px rgba(0,0,0,0.25)'
  }}
  material="liquid"
>
  <StyledContent />
</GlassModal>
```

### Theme Integration

```tsx
import { useGlassTheme } from '@/hooks/useGlassTheme'

function ThemedModal() {
  const theme = useGlassTheme()
  
  return (
    <GlassModal
      material="liquid"
      materialProps={{
        ior: theme.glass.ior,
        tint: theme.glass.tint,
        quality: theme.performance.quality,
        thickness: theme.glass.thickness
      }}
    >
      <ThemedContent />
    </GlassModal>
  )
}
```

## Performance Considerations

### GPU Memory Management

```tsx
// Modal automatically manages GPU resources
useEffect(() => {
  // LiquidGlassMaterial allocates GPU memory when modal opens
  // Automatically deallocates when modal closes
}, [open])
```

### Lazy Loading

```tsx
function LazyModal({ open, ...props }) {
  // Only render modal content when open
  if (!open) return null
  
  return (
    <GlassModal open={open} {...props}>
      <LazyLoadedContent />
    </GlassModal>
  )
}
```

### Backdrop Optimization

```tsx
<GlassModal
  material="liquid"
  materialProps={{
    // Reduce backdrop complexity for performance
    blur: isMobile ? 10 : 20,
    quality: isMobile ? "efficient" : "balanced"
  }}
>
  <OptimizedContent />
</GlassModal>
```

## Browser Compatibility

| Browser | Liquid Glass | Standard Glass | Backdrop Filter |
|---------|-------------|---------------|-----------------|
| Chrome 90+ | ✅ Full | ✅ Complete | ✅ Native |
| Safari 14+ | ✅ Full | ✅ Complete | ✅ Optimized |
| Firefox 88+ | ⚠️ Limited | ✅ Complete | ⚠️ Limited |
| Edge 90+ | ✅ Full | ✅ Complete | ✅ Native |

## Migration Guide

### From Standard GlassModal

```tsx
// Before
<GlassModal
  blur={20}
  opacity={0.9}
  title="Modal"
>
  <Content />
</GlassModal>

// After (with liquid glass)
<GlassModal
  title="Modal"
  material="liquid"
  materialProps={{
    blur: 20,
    opacity: 0.9,
    ior: 1.43,
    quality: "balanced"
  }}
>
  <Content />
</GlassModal>
```

### Gradual Upgrade Path

```tsx
// Phase 1: Add material prop with glass default
<GlassModal material="glass" />

// Phase 2: Conditionally enable liquid glass
<GlassModal material={isSupported ? "liquid" : "glass"} />

// Phase 3: Full liquid glass adoption
<GlassModal material="liquid" />
```

## Related Components

- [GlassDialog](./glass-dialog.md) - Simple dialog component
- [GlassDrawer](./glass-drawer.md) - Slide-in panel component
- [GlassPopover](./glass-popover.md) - Lightweight overlay
- [GlassBottomSheet](./glass-bottom-sheet.md) - Mobile bottom panel

## Troubleshooting

### Common Issues

1. **Modal not appearing**: Check `open` prop and z-index conflicts
2. **Liquid glass not rendering**: Verify GPU support, fallback to standard glass
3. **Performance issues**: Lower quality tier or disable GPU acceleration
4. **Focus trapping issues**: Ensure proper ARIA attributes and focusable elements

### Debug Mode

```tsx
<GlassModal
  material="liquid"
  materialProps={{ debug: true }}
>
  <DebugContent />
</GlassModal>
```

Enables visual debugging overlays and performance metrics for troubleshooting.