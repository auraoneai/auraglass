### useGlassPerformance
Real-time performance monitoring with automatic quality adjustment.

```tsx
import { useGlassPerformance } from 'aura-glass';

function PerformanceAwareComponent() {
  const { metrics, quality, isLowPerformance, getOptimalSettings } = useGlassPerformance({
    enableMonitoring: true,
    targetFPS: 60,
    autoAdjustQuality: true,
    onQualityChange: (newQuality) => console.log('Quality adjusted:', newQuality),
  });

  const settings = getOptimalSettings();

  return (
    <div>
      <p>FPS: {metrics.fps}</p>
      <p>Memory: {metrics.memoryUsage}MB</p>
      <p>Quality: {(quality * 100).toFixed(0)}%</p>
      <p>Particle Count: {settings.particleCount}</p>
      {isLowPerformance && <p>⚠️ Low performance detected</p>}
    </div>
  );
}
```