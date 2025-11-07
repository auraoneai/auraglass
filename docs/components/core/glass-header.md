# GlassHeader Component

## Overview

`GlassHeader` is a premium navigation header component with liquid glass material support. It features scroll-adaptive density, motion responsiveness, and seamless integration with the Liquid Glass system.

## Features

- ✨ Liquid Glass material support
- 📱 Responsive design with mobile optimization
- 🎯 Scroll-adaptive transparency and effects
- ♿ Full accessibility compliance
- 🎨 Customizable styling and theming
- ⚡ High performance with GPU acceleration

## Props API

### Core Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | - | Header title text |
| `position` | `"static" \| "fixed" \| "sticky"` | `"sticky"` | Header positioning |
| `elevation` | `number` | `2` | Material Design elevation level |
| `transparent` | `boolean` | `false` | Enable transparency mode |

### Liquid Glass Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `material` | `"glass" \| "liquid"` | `"glass"` | Material system to use |
| `materialProps` | `LiquidGlassMaterialProps` | - | Liquid glass configuration |

### Layout Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `height` | `number \| string` | `64` | Header height |
| `maxWidth` | `number \| string` | `"100%"` | Maximum content width |
| `padding` | `number \| string` | `16` | Internal padding |

### Navigation Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `logo` | `React.ReactNode` | - | Logo or brand element |
| `navigation` | `NavItem[]` | `[]` | Navigation menu items |
| `actions` | `React.ReactNode` | - | Action buttons/controls |

## Usage Examples

### Basic Header

```tsx
import { GlassHeader } from '@/components/navigation/GlassHeader'

function BasicHeader() {
  return (
    <GlassHeader
      title="AuraGlass App"
      logo={<Logo />}
      actions={<UserMenu />}
    />
  )
}
```

### Liquid Glass Header

```tsx
function LiquidGlassHeader() {
  return (
    <GlassHeader
      title="Premium App"
      material="liquid"
      materialProps={{
        ior: 1.45,
        quality: "high",
        tint: "neutral",
        motionFactor: 1.2
      }}
      logo={<PremiumLogo />}
      actions={<UserActions />}
    />
  )
}
```

### Scroll-Adaptive Header

```tsx
function ScrollAdaptiveHeader() {
  return (
    <GlassHeader
      title="Dynamic App"
      material="liquid"
      materialProps={{
        ior: 1.43,
        quality: "balanced",
        // Density adapts based on scroll position
        environmentalAdaptation: true
      }}
      transparent={true}
      position="fixed"
    />
  )
}
```

### Mobile-Optimized Header

```tsx
import { useMediaQuery } from '@/hooks/useMediaQuery'

function ResponsiveHeader() {
  const isMobile = useMediaQuery('(max-width: 768px)')
  
  return (
    <GlassHeader
      title="Mobile App"
      material="liquid"
      materialProps={{
        quality: isMobile ? "efficient" : "high",
        motionFactor: isMobile ? 0.6 : 1.0,
        ior: 1.43
      }}
      height={isMobile ? 56 : 64}
      navigation={isMobile ? [] : navigationItems}
      actions={<MobileMenu />}
    />
  )
}
```

## Navigation Configuration

### Navigation Items

```tsx
const navigationItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: <DashboardIcon />
  },
  {
    label: 'Projects',
    href: '/projects',
    icon: <ProjectsIcon />,
    badge: 3 // Optional notification badge
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: <SettingsIcon />
  }
]

<GlassHeader
  navigation={navigationItems}
  material="liquid"
/>
```

### Custom Actions

```tsx
function HeaderActions() {
  return (
    <div className="flex items-center gap-2">
      <GlassButton variant="ghost" size="sm">
        <SearchIcon />
      </GlassButton>
      <GlassButton variant="ghost" size="sm">
        <NotificationIcon />
      </GlassButton>
      <UserAvatar />
    </div>
  )
}

<GlassHeader actions={<HeaderActions />} />
```

## Styling and Theming

### Custom Styling

```tsx
<GlassHeader
  className="custom-header"
  style={{
    borderBottom: '1px solid rgba(255,255,255,0.1)'
  }}
  materialProps={{
    tint: "warm",
    opacity: 0.95
  }}
/>
```

### Theme Integration

```tsx
import { useGlassTheme } from '@/hooks/useGlassTheme'

function ThemedHeader() {
  const theme = useGlassTheme()
  
  return (
    <GlassHeader
      material="liquid"
      materialProps={{
        ior: theme.glass.ior,
        tint: theme.glass.tint,
        quality: theme.performance.quality
      }}
    />
  )
}
```

## Advanced Features

### Scroll Detection

The header automatically detects scroll position and adapts its appearance:

```tsx
<GlassHeader
  material="liquid"
  materialProps={{
    // IOR increases with scroll depth
    // Opacity adjusts for content visibility
    environmentalAdaptation: true
  }}
/>
```

### Motion Responsiveness

```tsx
<GlassHeader
  material="liquid"
  materialProps={{
    motionFactor: 1.0, // Responds to device tilt/movement
    hoverIntensity: 1.2, // Enhanced hover effects
  }}
/>
```

### Performance Optimization

```tsx
function OptimizedHeader() {
  const { isLowPowerMode } = useDeviceCapabilities()
  
  return (
    <GlassHeader
      material={isLowPowerMode ? "glass" : "liquid"}
      materialProps={{
        quality: isLowPowerMode ? "efficient" : "balanced",
        gpuAcceleration: !isLowPowerMode
      }}
    />
  )
}
```

## Accessibility

### Screen Reader Support

```tsx
<GlassHeader
  title="App Name"
  role="banner"
  aria-label="Main navigation"
/>
```

### Keyboard Navigation

The header provides full keyboard navigation support:
- **Tab**: Navigate through interactive elements
- **Enter/Space**: Activate buttons and links
- **Escape**: Close mobile menu (if applicable)

### Focus Management

```tsx
<GlassHeader
  materialProps={{
    // Focus indicators are enhanced in liquid glass mode
    contrastEnforcement: "strict"
  }}
/>
```

## Integration Examples

### With Routing

```tsx
import { useRouter } from 'next/router'

function RoutedHeader() {
  const router = useRouter()
  
  const navigation = [
    {
      label: 'Home',
      href: '/',
      active: router.pathname === '/'
    },
    {
      label: 'About',
      href: '/about',
      active: router.pathname === '/about'
    }
  ]
  
  return (
    <GlassHeader
      navigation={navigation}
      material="liquid"
    />
  )
}
```

### With State Management

```tsx
import { useAppSelector } from '@/store/hooks'

function StateConnectedHeader() {
  const user = useAppSelector(state => state.user)
  const notifications = useAppSelector(state => state.notifications)
  
  return (
    <GlassHeader
      title={`Welcome, ${user.name}`}
      material="liquid"
      actions={
        <NotificationBadge count={notifications.unread} />
      }
    />
  )
}
```

### With Authentication

```tsx
import { useAuth } from '@/hooks/useAuth'

function AuthenticatedHeader() {
  const { user, logout } = useAuth()
  
  const userMenu = [
    { label: 'Profile', action: () => router.push('/profile') },
    { label: 'Settings', action: () => router.push('/settings') },
    { label: 'Logout', action: logout }
  ]
  
  return (
    <GlassHeader
      logo={<AppLogo />}
      actions={<UserDropdown items={userMenu} />}
      material="liquid"
    />
  )
}
```

## Performance Considerations

### GPU Usage

Liquid glass headers use GPU acceleration for effects:

```tsx
// Monitor GPU usage
import { useLiquidGlassPerformance } from '@/hooks/useLiquidGlassPerformance'

function PerformanceAwareHeader() {
  const { gpuMemory, fps } = useLiquidGlassPerformance()
  
  // Adjust quality based on performance
  const quality = fps > 55 ? 'ultra' : 'balanced'
  
  return (
    <GlassHeader
      material="liquid"
      materialProps={{ quality }}
    />
  )
}
```

### Memory Management

```tsx
// Cleanup GPU resources when unmounting
useEffect(() => {
  return () => {
    // LiquidGlassMaterial automatically cleans up
  }
}, [])
```

## Browser Compatibility

| Browser | Liquid Glass | Standard Glass | Notes |
|---------|-------------|---------------|-------|
| Chrome 90+ | ✅ Full | ✅ Complete | Optimal performance |
| Safari 14+ | ✅ Full | ✅ Complete | Native optimization |
| Firefox 88+ | ⚠️ Limited | ✅ Complete | GPU fallback |
| Edge 90+ | ✅ Full | ✅ Complete | Chromium-based |

## Migration Guide

### From v1 GlassHeader

```tsx
// Before (v1)
<GlassHeader
  blur={20}
  opacity={0.9}
  title="App"
/>

// After (v2 with Liquid Glass)
<GlassHeader
  title="App"
  material="liquid"
  materialProps={{
    blur: 20,
    opacity: 0.9,
    ior: 1.43,
    quality: "balanced"
  }}
/>
```

### Gradual Migration

```tsx
// Phase 1: Keep existing glass
<GlassHeader material="glass" />

// Phase 2: Add liquid glass with fallback
<GlassHeader 
  material={supportedDevice ? "liquid" : "glass"}
/>

// Phase 3: Full liquid glass
<GlassHeader material="liquid" />
```

## Related Components

- [GlassNavigation](./glass-navigation.md) - Full navigation system
- [GlassSidebar](./glass-sidebar.md) - Side navigation panel
- [GlassBreadcrumb](./glass-breadcrumb.md) - Breadcrumb navigation
- [GlassTabBar](./glass-tab-bar.md) - Tab navigation

## Troubleshooting

### Common Issues

1. **Header not sticky**: Check `position` prop and parent container styles
2. **Liquid glass not rendering**: Verify GPU support and fallback to standard glass
3. **Performance issues**: Lower `quality` or disable `gpuAcceleration`
4. **Accessibility warnings**: Enable `contrastEnforcement` and check ARIA labels

### Debug Mode

```tsx
<GlassHeader
  material="liquid"
  materialProps={{ debug: true }}
/>
```

Enables visual debugging overlays for troubleshooting.