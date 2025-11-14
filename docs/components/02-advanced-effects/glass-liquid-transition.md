### GlassLiquidTransition
Fluid morphing transitions between glass states.

```tsx
import { GlassLiquidTransition, GlassLiquidContainer, liquidPresets } from 'aura-glass';

<GlassLiquidTransition
  variant="morph"              // 'morph' | 'flow' | 'ripple' | 'dissolve' | 'splash'
  duration={1000}              // Transition duration in ms
  stiffness={100}              // Spring stiffness
  damping={10}                 // Spring damping
  tension={200}                // Spring tension
  mass={1}                     // Spring mass
  interactive={true}           // Enable mouse interaction
  trigger="hover"              // 'hover' | 'click' | 'auto' | 'scroll'
  intensity={1}                // Effect intensity
>
  <div>Content with liquid transitions</div>
</GlassLiquidTransition>

// Scroll-responsive container
<GlassLiquidContainer morphOnScroll morphIntensity={1.2}>
  <div>Content that morphs on scroll</div>
</GlassLiquidContainer>

// Use presets
<GlassLiquidTransition {...liquidPresets.honey} trigger="click">
  Honey-like viscous transitions
</GlassLiquidTransition>
```