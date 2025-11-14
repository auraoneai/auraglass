### GlassParallaxLayers
Multi-depth interactive parallax glass layers with mouse tracking and scroll effects.

```tsx
import { GlassParallaxLayers, parallaxPresets } from 'aura-glass';

<GlassParallaxLayers
  layers={[
    {
      depth: 10,
      blur: 'lg',
      content: <div>Background Layer</div>,
    },
    {
      depth: 5,
      blur: 'md',
      content: <div>Middle Layer</div>,
    },
    {
      depth: 0,
      blur: 'none',
      content: <div>Foreground Layer</div>,
    },
  ]}
  mouseIntensity={0.8}      // Mouse parallax intensity (0-1)
  scrollIntensity={0.5}     // Scroll parallax intensity (0-1)
  perspective={1200}        // 3D perspective distance
  autoRotate={false}        // Auto rotation animation
  interactive={true}        // Enable mouse interaction
  debug={false}             // Show debug information
/>

// Use presets for quick setup
<GlassParallaxLayers layers={parallaxPresets.hero} />
```