### GlassParticles
Glassmorphic particle system with interactive behaviors.

```tsx
import { GlassParticles, GlassParticleEmitter, particlePresets } from 'aura-glass';

<GlassParticles
  count={50}                    // Number of particles
  maxSize={8}                   // Maximum particle size
  minSize={2}                   // Minimum particle size
  speed={1}                     // Movement speed
  connectionDistance={100}      // Distance to draw connections
  mouseInteraction={true}       // Mouse repulsion/attraction
  mouseRadius={150}            // Mouse interaction radius
  colorScheme="gradient"        // 'monochrome' | 'rainbow' | 'gradient' | 'custom'
  colors={['#3b82f6', '#8b5cf6', '#ec4899']}
  shape="circle"               // 'circle' | 'square' | 'triangle' | 'star'
  behavior="float"             // 'float' | 'swarm' | 'orbit' | 'explode' | 'gravity'
  glow={true}                  // Enable glow effect
  blur={true}                  // Enable blur filter
/>

// Particle emitter with triggers
<GlassParticleEmitter trigger="hover" {...particlePresets.fireflies}>
  <div>Hover me for particles!</div>
</GlassParticleEmitter>
```