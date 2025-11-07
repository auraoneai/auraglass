# 🌊 Liquid Glass Migration Guide

Welcome to **AuraGlass Liquid Glass** - the next evolution of glassmorphism with Apple-quality material physics and environmental intelligence.

## 🚀 Quick Migration

### Enable Liquid Glass on Any Component

```tsx
// Before: Standard glass
<GlassModal open={true} onClose={handleClose}>
  Content
</GlassModal>

// After: Liquid Glass ✨
<GlassModal 
  material="liquid" 
  open={true} 
  onClose={handleClose}
>
  Content
</GlassModal>
```

That's it! All upgraded components support the `material="liquid"` prop with intelligent defaults.

## 📋 Component Support Matrix

### ✅ Liquid Glass Ready (v2.0+)

| Component | Status | Material Prop | Material Props |
|-----------|--------|---------------|----------------|
| `GlassModal` | ✅ Ready | `material="liquid"` | ✅ Full support |
| `GlassDialog` | ✅ Ready | `material="liquid"` | ✅ Full support |
| `GlassDrawer` | ✅ Ready | `material="liquid"` | ✅ Full support |
| `GlassPopover` | ✅ Ready | `material="liquid"` | ✅ Full support |
| `GlassButton` | ✅ Ready | `material="liquid"` | ✅ Full support |
| `GlassInput` | ✅ Ready | `material="liquid"` | ✅ Full support |
| `GlassCard` | ✅ Ready | `material="liquid"` | ✅ Full support |
| `GlassContainer` | ✅ Ready | `material="liquid"` | ✅ Full support |
| `DimensionalGlass` | ✅ Ready | `material="liquid"` | ✅ Full support |
| `GlassHeader` | ✅ Ready | `material="liquid"` | ✅ Full support |

### 🔄 Legacy Components (v1.x)

Components without `material` prop continue working unchanged. No breaking changes.

## 🎛️ Configuration Guide

### Basic Liquid Glass

```tsx
<GlassModal 
  material="liquid"
  // Uses intelligent defaults:
  // - IOR: 1.52 (crown glass)
  // - Thickness: 12px
  // - Tint: Adaptive based on content
  // - Quality: High performance
  // - Environmental adaptation: Enabled
>
  Your content
</GlassModal>
```

### Advanced Material Properties

```tsx
<GlassModal 
  material="liquid"
  materialProps={{
    ior: 1.8,           // High refraction (crystal-like)
    thickness: 20,       // Thicker material (more depth)
    tint: {             // Custom tint
      r: 59, g: 130, b: 246, a: 0.15 
    },
    variant: 'regular', // 'regular' | 'clear'
    quality: 'ultra'    // 'ultra' | 'high' | 'balanced' | 'efficient'
  }}
>
  Premium content
</GlassModal>
```

## 🎨 Design Token Integration

### Accessing Liquid Glass Tokens

```tsx
import { LIQUID_GLASS } from '@/tokens/glass';

// Material physics
const ior = LIQUID_GLASS.MATERIAL.PHYSICS.IOR.CROWN_GLASS; // 1.52
const density = LIQUID_GLASS.MATERIAL.DENSITY.HIGH; // 0.92

// Environmental adaptation
const adaptationSpeed = LIQUID_GLASS.ENVIRONMENTAL.ADAPTATION_SPEED; // 300ms
```

### CSS Custom Properties

```css
.my-liquid-surface {
  --liquid-glass-ior: 1.48;
  --liquid-glass-thickness: 14px;
  --liquid-glass-tint: rgba(0, 0, 0, 0.08);
  --liquid-glass-quality: high;
  --liquid-glass-environment-adapt: 0.7;
}
```

## 🧪 Advanced Features

### Environmental Adaptation

```tsx
<GlassContainer
  material="liquid"
  materialProps={{
    // Automatically adapts tint based on backdrop content
    // Ensures WCAG AA/AAA compliance
    environmentAdaptation: true,
    
    // Custom adaptation sensitivity
    adaptationSensitivity: 0.8
  }}
/>
```

### Motion Responsiveness

```tsx
<GlassCard
  material="liquid"
  materialProps={{
    // Responds to device motion and user interactions
    motionResponsive: true,
    
    // Custom motion sensitivity (0.0 - 1.0)
    motionSensitivity: 0.6
  }}
/>
```

### Performance Optimization

```tsx
// Ultra quality - maximum fidelity
<GlassModal 
  material="liquid"
  materialProps={{ quality: 'ultra' }}
/>

// Efficient - battery-friendly
<GlassButton 
  material="liquid"
  materialProps={{ quality: 'efficient' }}
/>
```

## 🎯 Component-Specific Guides

### Modal & Dialog Migration

```tsx
// Enhanced modal with adaptive density
<GlassModal
  material="liquid"
  materialProps={{
    // Automatically adjusts for modal context
    ior: 1.52,
    thickness: 12,
    variant: 'regular',
    // High urgency gets adaptive red tint
    urgencyAdaptive: true
  }}
/>

// Drawer with mobile optimization
<GlassDrawer
  material="liquid"
  position="bottom"
  materialProps={{
    // Optimized for mobile interactions
    thickness: 8,
    density: 0.85, // Lighter for drawers
    motionFactor: 0.6
  }}
/>
```

### Button Migration

```tsx
// Primary button with branded tint
<GlassButton
  material="liquid" 
  variant="primary"
  materialProps={{
    ior: 1.48,
    thickness: 8, // Responsive to button size
    tint: { r: 59, g: 130, b: 246, a: 0.1 }, // Brand color
    interactive: true // Micro-refraction on hover
  }}
>
  Primary Action
</GlassButton>
```

### Input Migration

```tsx
// State-adaptive input
<GlassInput
  material="liquid"
  state="error"
  materialProps={{
    // Automatically adapts IOR on focus (1.43 → 1.46)
    // Error state gets red tint
    // Focus enhances refraction
    focusAdaptive: true,
    stateAdaptive: true
  }}
/>
```

### Card Migration

```tsx
// Feature card with enhanced depth
<GlassCard
  material="liquid"
  variant="feature"
  materialProps={{
    ior: 1.50, // Enhanced for feature cards
    thickness: 16, // More substantial feel
    quality: 'ultra', // Maximum visual fidelity
    environmentAdaptation: true
  }}
/>
```

## 🛡️ Accessibility & Compliance

### Automatic Contrast Compliance

```tsx
// Contrast Guard automatically ensures WCAG compliance
<GlassModal
  material="liquid" 
  // No additional config needed - automatically:
  // ✓ Samples backdrop luminance
  // ✓ Adjusts tint for contrast ratios
  // ✓ Maintains AA/AAA standards
  // ✓ Preserves visual aesthetics
/>
```

### Reduced Motion Support

```tsx
// Automatically respects prefers-reduced-motion
<GlassCard
  material="liquid"
  materialProps={{
    motionResponsive: true // Disabled if user prefers reduced motion
  }}
/>
```

### Focus Management

```tsx
// Enhanced focus rings with liquid glass
<GlassButton 
  material="liquid"
  className="focus:ring-2 focus:ring-primary/50 focus:ring-offset-2"
>
  Accessible Action
</GlassButton>
```

## ⚡ Performance Guidelines

### Quality Tier Selection

```tsx
// Choose quality based on use case:

// Hero sections, feature showcases
<GlassCard material="liquid" materialProps={{ quality: 'ultra' }} />

// Primary actions, important UI
<GlassButton material="liquid" materialProps={{ quality: 'high' }} />

// Secondary UI, mobile optimization  
<GlassInput material="liquid" materialProps={{ quality: 'balanced' }} />

// Background elements, battery-conscious
<GlassContainer material="liquid" materialProps={{ quality: 'efficient' }} />
```

### GPU Acceleration

```tsx
// Automatic GPU acceleration with CSS fallback
<GlassModal
  material="liquid"
  // No configuration needed - automatically:
  // ✓ Detects WebGL support
  // ✓ Uses GPU shaders when available
  // ✓ Falls back to CSS filters gracefully
  // ✓ Maintains consistent appearance
/>
```

## 🔧 Troubleshooting

### Common Issues

#### Q: Liquid Glass not appearing?
```tsx
// ✅ Ensure material prop is set
<GlassModal material="liquid" />

// ❌ Missing material prop defaults to standard glass
<GlassModal />
```

#### Q: Performance issues on mobile?
```tsx
// ✅ Use balanced or efficient quality
<GlassCard 
  material="liquid" 
  materialProps={{ quality: 'balanced' }}
/>
```

#### Q: Contrast issues with dark backgrounds?
```tsx
// ✅ Enable environmental adaptation
<GlassModal
  material="liquid"
  materialProps={{ 
    environmentAdaptation: true,
    contrastCompliance: 'AAA' // Optional: stricter compliance
  }}
/>
```

### Debug Mode

```tsx
// Enable debug logging
<GlassModal
  material="liquid"
  materialProps={{
    debug: true // Logs IOR calculations, tint adjustments, etc.
  }}
/>
```

## 🎉 Migration Checklist

### Phase 1: Preparation
- [ ] Review component usage in your app
- [ ] Identify high-impact surfaces (modals, cards, buttons)
- [ ] Plan rollout strategy (progressive enhancement)

### Phase 2: Core Components
- [ ] Migrate primary buttons: `material="liquid"`
- [ ] Migrate modal dialogs: `material="liquid"`
- [ ] Migrate main cards: `material="liquid"`

### Phase 3: Enhancement  
- [ ] Fine-tune material properties for brand consistency
- [ ] Optimize performance with appropriate quality tiers
- [ ] Test accessibility across different backgrounds

### Phase 4: Advanced Features
- [ ] Enable environmental adaptation where beneficial
- [ ] Configure motion responsiveness for interactive elements
- [ ] Implement custom tints for branded experiences

## 📚 Resources

- **Storybook**: Interactive component playground
- **Design Tokens**: `/src/tokens/glass.ts`
- **API Reference**: Type definitions in each component
- **Examples**: `/src/components/*/*.liquid.stories.tsx`
- **Tests**: `/src/tests/liquidGlass.test.tsx`

## 🤝 Support

For migration assistance or advanced configurations:

1. Check component stories in Storybook
2. Review test cases for usage patterns  
3. Consult design token documentation
4. Open GitHub issues for specific questions

---

**Welcome to the future of glassmorphism!** 🌊✨

*Liquid Glass brings Apple-quality material physics to your React components with zero breaking changes and maximum visual impact.*