### Chart Quality Tiers
Adaptive chart rendering based on device performance.

```tsx
import { useQualityTier, getQualityBasedPhysicsParams } from 'aura-glass';

function AdaptiveChart() {
  const { currentTier, updateQuality } = useQualityTier('medium', true);
  const physicsParams = getQualityBasedPhysicsParams(currentTier);
  const glassParams = getQualityBasedGlassParams(currentTier);

  return (
    <div>
      <p>Current Quality: {currentTier}</p>
      <p>Particle Count: {physicsParams.stiffness > 200 ? 100 : 50}</p>
      <p>Blur Strength: {glassParams.blurStrength}</p>
    </div>
  );
}
```