### GlassMeshGradient
Ambient animated mesh gradients with glass overlay effects.

```tsx
import { GlassMeshGradient, GlassMeshBackground, meshGradientPresets } from 'aura-glass';

<GlassMeshGradient
  colors={['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b']}
  points={4}                // Number of gradient points
  speed={0.5}               // Animation speed
  blur={100}                // Blur amount in pixels
  opacity={0.8}             // Overall opacity
  animate={true}            // Enable animation
  interactive={true}        // Mouse interaction
  complexity="moderate"     // 'simple' | 'moderate' | 'complex'
  variant="ambient"         // 'ambient' | 'vibrant' | 'subtle' | 'dark'
/>

// Background wrapper with content
<GlassMeshBackground {...meshGradientPresets.aurora}>
  <div>Your content over animated mesh</div>
</GlassMeshBackground>
```