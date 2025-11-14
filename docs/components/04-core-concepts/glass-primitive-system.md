### Glass Primitive System

AuraGlass provides multiple primitive component variants that form the foundation of the entire design system:

#### Glass Components - Choose Your Implementation

**Glass (GlassCore) - Basic Implementation**
The fundamental glass component with mixin-based styling. Perfect for simple projects.

```tsx
import { Glass } from 'aura-glass';
// or import { GlassCore } from 'aura-glass';

<Glass
  variant="frosted"       // Glass variant: 'frosted' | 'dynamic' | 'clear' | 'tinted' | 'luminous'
  blur="standard"         // Blur intensity: 'none' | 'light' | 'standard' | 'heavy'
  opacity={0.1}          // Background opacity (0-1)
  rounded="md"           // Border radius: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'
  glow={true}            // Enable glow effects
  glowColor="#3b82f6"    // Custom glow color
  hover={true}           // Enable hover effects
>
  {/* Your content */}
</Glass>
```

**GlassAdvanced - Full-Featured Implementation**
Advanced glass component with complete design token integration and gradient support.

```tsx
import { GlassAdvanced } from 'aura-glass';

<GlassAdvanced
  variant="iridescent"       // Advanced variants: 'iridescent' | 'mesh' | 'feature'  
  elevation="modal"          // Extended elevation: 'float' | 'modal'
  gradient="mesh"            // Gradient options: 'primary' | 'secondary' | 'radial' | 'mesh' | 'iridescent'
  texture={true}             // Noise texture overlay
  glow={true}                // Enhanced glow effects
>
  {/* Advanced glass content */}
</GlassAdvanced>
```

#### OptimizedGlass Components - Choose Your Optimization

**OptimizedGlass (OptimizedGlassCore) - Device-Adaptive**
Performance-optimized glass with automatic device capability detection.

```tsx
import { OptimizedGlass } from 'aura-glass';
// or import { OptimizedGlassCore } from 'aura-glass';

<OptimizedGlass
  variant="luminous"            // Glass variant
  blur="heavy"                  // Blur intensity
  optimization="auto"           // Performance optimization: 'auto' | 'high' | 'medium' | 'low'
  hardwareAcceleration={true}   // Enable GPU acceleration
  physics={true}                // Enable physics interactions
>
  {/* Performance-optimized content */}
</OptimizedGlass>
```

**OptimizedGlassAdvanced - High-Performance**
Advanced performance optimization with CSS variables and lazy effects.

```tsx
import { OptimizedGlassAdvanced } from 'aura-glass';

<OptimizedGlassAdvanced
  variant="ethereal"              // Extended variants: 'frosted' | 'liquid' | 'crystal' | 'holographic' | 'neural' | 'ethereal'
  performanceMode="ultra"         // Performance modes: 'low' | 'medium' | 'high' | 'ultra'
  depth={5}                       // Depth levels: 1-5
  tint="rainbow"                  // Tint options: 'neutral' | 'blue' | 'purple' | 'rainbow' | etc.
  animation="shimmer"             // Animations: 'none' | 'float' | 'pulse' | 'shimmer' | 'breathe' | 'morph'
  lighting="volumetric"           // Lighting: 'ambient' | 'directional' | 'volumetric' | 'caustic' | 'iridescent'
  refraction={true}               // Advanced effects
  caustics={true}
  hoverSheen={true}               // Micro-interactions
  liftOnHover={true}
>
  {/* High-performance glass content */}
</OptimizedGlassAdvanced>
```

#### Motion Components - Choose Your Animation System

**Motion (MotionNative) - Web Animations API**
Lightweight animation system using native browser APIs.

```tsx
import { Motion } from 'aura-glass';
// or import { MotionNative } from 'aura-glass';

<Motion
  type="elastic"                // Animation type: 'fade' | 'slide' | 'scale' | 'bounce' | 'elastic'
  direction="up"               // Animation direction: 'up' | 'down' | 'left' | 'right'
  physics={true}               // Enable physics-based animation
  springConfig={{              // Custom spring configuration
    stiffness: 200,
    damping: 25,
    mass: 1
  }}
  animateOnMount={true}        // Animate on component mount
  animateOnHover={false}       // Animate on hover
  respectReducedMotion={true}  // Respect accessibility preferences
>
  {/* Animated content */}
</Motion>
```

**MotionFramer - Framer Motion System**
Full-featured animation system with Framer Motion integration.

```tsx
import { MotionFramer } from 'aura-glass';

<MotionFramer
  preset="bounceIn"             // Animation presets: 'fadeIn' | 'slideIn' | 'scaleIn' | 'bounceIn' | 'pulseIn'
  duration={300}                // Animation duration (ms)
  delay={0}                     // Animation delay (ms)
  easing="ease-out"            // Easing: 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'spring'
  animateOnMount={true}        // Animate on mount
  animateOnHover={false}       // Animate on hover
  animateOnScroll={true}       // Animate when in view
>
  {/* Framer Motion animated content */}
</MotionFramer>
```