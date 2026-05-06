# BrandColorIntegration

## Overview

The `BrandColorIntegration` component provides seamless integration of brand colors into the glassmorphism ecosystem. It dynamically adapts to entity brand colors, maintains color history, and ensures harmonious integration with the existing design system.

## Features

- **Dynamic Brand Integration**: Automatically adapts to different brand color schemes
- **Entity Color History**: Tracks and manages color evolution over time
- **Contextual Adaptation**: Adapts colors based on content and context
- **Smooth Transitions**: Animated color transitions between brands
- **Brand Glass Variants**: Specialized glass effects for brand colors
- **Color Harmony**: Ensures brand colors work harmoniously with glass effects

## Usage

```tsx
import { BrandColorIntegration, BrandGlassButton, useBrandColors } from 'aura-glass'

// Basic usage with entity ID
function BrandedComponent() {
  return (
    <BrandColorIntegration entityId="apple">
      <div>Your branded content here</div>
    </BrandColorIntegration>
  )
}

// With custom brand colors
function CustomBrandComponent() {
  return (
    <BrandColorIntegration
      brandColors={['#FF6B6B', '#4ECDC4']}
      animationDuration={1200}
    >
      <div>Custom branded content</div>
    </BrandColorIntegration>
  )
}

// Using brand-aware components
function BrandButtonComponent() {
  return (
    <BrandColorIntegration entityId="google">
      <BrandGlassButton variant="primary">
        Google Branded Button
      </BrandGlassButton>
    </BrandColorIntegration>
  )
}

// Using the hook
function BrandAwareComponent() {
  const brandColors = useBrandColors('microsoft')

  return (
    <div style={{
      backgroundColor: brandColors?.primaryColor ? `${brandColors.primaryColor}10` : undefined
    }}>
      Microsoft branded content
    </div>
  )
}
```

## API Reference

### BrandColorIntegration

The main component that provides brand color integration context.

**Props:**
- `entityId?: string` - Entity identifier (e.g., 'apple', 'google')
- `brandColors?: string[]` - Array of brand colors
- `fallbackColors?: object` - Fallback colors if entity not found
- `animationDuration?: number` - Transition duration in milliseconds
- `className?: string` - Additional CSS classes
- `children: ReactNode` - Child components

### BrandGlassButton

A button component that uses brand colors in glassmorphism style.

**Props:**
- `variant?: 'primary' | 'secondary'` - Button variant
- `children: ReactNode` - Button content
- `className?: string` - Additional CSS classes
- `onClick?: () => void` - Click handler
- `disabled?: boolean` - Disabled state
- Other standard button props

### useBrandColors Hook

Hook to access brand colors for a specific entity.

**Parameters:**
- `entityId?: string` - Entity identifier

**Returns:**
- `EntityBrandColors | null` - Brand color information

## Supported Entities

The system includes predefined brand colors for major entities:

- **Apple**: Blue (#007AFF), Gray (#5856D6)
- **Google**: Blue (#4285F4), Green (#34A853)
- **Microsoft**: Blue (#0078D4), Light Blue (#106EBE)
- **Custom**: Any brand colors via the `brandColors` prop

## Color History

The system maintains color history for each entity:

```tsx
interface EntityBrandColors {
  entityId: string
  primaryColor: string
  secondaryColor: string
  logoUrl?: string
  colorHistory: Array<{
    color: string
    timestamp: number
    confidence: number
  }>
}
```

## CSS Custom Properties

The component injects CSS custom properties for easy styling:

```css
/* Available CSS custom properties */
--brand-primary: #007AFF
--brand-secondary: #5856D6
--brand-primary-rgb: 0, 122, 255
--brand-secondary-rgb: 88, 86, 214
--brand-primary-alpha-10: #007AFF1A
--brand-primary-alpha-20: #007AFF33
--brand-primary-alpha-30: #007AFF4D
```

## Glass Effects

### Brand Glass Variants

```tsx
// Primary brand glass
.brand-glass-primary {
  background: var(--brand-glass-primary);
  backdrop-filter: blur(12px);
  border: 1px solid var(--brand-border-primary);
  box-shadow: var(--brand-shadow-primary);
}

// Secondary brand glass
.brand-glass-secondary {
  background: var(--brand-glass-secondary);
  backdrop-filter: blur(12px);
  border: 1px solid var(--brand-border-secondary);
  box-shadow: var(--brand-shadow-secondary);
}
```

## Accessibility

- Maintains contrast ratios for brand colors
- Provides alternative styling for accessibility modes
- Supports high contrast mode
- Ensures readability with brand colors

## Performance

- Lazy loading of brand color data
- Optimized animations and transitions
- Minimal re-renders with stable references
- Efficient color calculations

## Browser Support

- CSS custom properties support required
- Graceful degradation for older browsers
- Progressive enhancement approach

## Examples

### Entity-Based Branding

```tsx
function EntityBrandedApp() {
  const [currentEntity, setCurrentEntity] = useState('apple')

  return (
    <BrandColorIntegration entityId={currentEntity}>
      <div className="app-container">
        <BrandGlassButton
          onClick={() => setCurrentEntity('google')}
        >
          Switch to Google
        </BrandGlassButton>

        <BrandGlassButton
          variant="secondary"
          onClick={() => setCurrentEntity('microsoft')}
        >
          Switch to Microsoft
        </BrandGlassButton>

        <div className="content">
          {/* Content automatically adapts to current entity colors */}
          <h1 style={{ color: 'var(--brand-primary)' }}>
            {currentEntity.toUpperCase()} Branded App
          </h1>
        </div>
      </div>
    </BrandColorIntegration>
  )
}
```

### Custom Brand Colors

```tsx
function CustomBrandedDashboard() {
  const customBrandColors = ['#FF6B6B', '#4ECDC4', '#45B7D1']

  return (
    <BrandColorIntegration
      brandColors={customBrandColors}
      animationDuration={1500}
    >
      <div className="dashboard">
        <div className="header" style={{
          background: 'var(--brand-glass-primary)',
          backdropFilter: 'blur(20px)'
        }}>
          <h1>Custom Branded Dashboard</h1>
        </div>

        <div className="cards">
          <BrandGlassButton variant="primary">
            Primary Action
          </BrandGlassButton>
          <BrandGlassButton variant="secondary">
            Secondary Action
          </BrandGlassButton>
        </div>
      </div>
    </BrandColorIntegration>
  )
}
```

### Brand Color Animation

```tsx
function AnimatedBrandTransition() {
  const [brandIndex, setBrandIndex] = useState(0)
  const brands = ['apple', 'google', 'microsoft']

  return (
    <BrandColorIntegration
      entityId={brands[brandIndex]}
      animationDuration={1000}
    >
      <motion.div
        className="animated-container"
        animate={{ opacity: 1 }}
        initial={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <button
          onClick={() => setBrandIndex((prev) => (prev + 1) % brands.length)}
          style={{
            background: 'var(--brand-glass-primary)',
            border: '1px solid var(--brand-border-primary)'
          }}
        >
          Switch Brand ({brands[brandIndex]})
        </button>

        <div className="brand-showcase">
          <div style={{ backgroundColor: 'var(--brand-primary)' }}>
            Primary Color
          </div>
          <div style={{ backgroundColor: 'var(--brand-secondary)' }}>
            Secondary Color
          </div>
        </div>
      </motion.div>
    </BrandColorIntegration>
  )
}
```
