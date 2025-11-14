### GlassMagneticCursor
Interactive magnetic cursor with glass effects.

```tsx
import { GlassMagneticCursor, GlassMagneticWrapper, useMagneticCursor } from 'aura-glass';

// Global magnetic cursor
<GlassMagneticCursor
  variant="glow"               // 'default' | 'glow' | 'trail' | 'morph' | 'ripple'
  size={20}                    // Cursor size in pixels
  color="rgba(59, 130, 246, 0.5)"
  magnetStrength={0.3}         // Magnetic pull strength
  magnetRadius={100}           // Magnetic interaction radius
  showCursor={true}            // Show custom cursor
  trailLength={5}              // Trail effect length
  glowIntensity={1}            // Glow effect intensity
  morphTargets={true}          // Morph to target elements
  hapticFeedback={true}        // Haptic feedback on interaction
/>

// Magnetic wrapper for elements
<GlassMagneticWrapper strength={0.5} radius={150} haptic>
  <button>I'm magnetic!</button>
</GlassMagneticWrapper>

// Custom magnetic behavior
function CustomComponent() {
  const { ref, isHovering } = useMagneticCursor({
    strength: 0.4,
    radius: 120,
    onHover: (hovering) => console.log('Magnetic hover:', hovering)
  });
  
  return <div ref={ref}>Custom magnetic element</div>;
}
```