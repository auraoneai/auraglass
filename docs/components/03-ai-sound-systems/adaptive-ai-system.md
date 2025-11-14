### Adaptive AI System
Machine learning-driven UI optimization and personalization.

```tsx
import { adaptiveAI, useAdaptiveAI } from 'aura-glass';

// Using adaptive AI directly
const insights = adaptiveAI.getInsights();
const config = adaptiveAI.getConfiguration();

// React hook for adaptive behavior
function AdaptiveComponent() {
  const { config, insights, ai } = useAdaptiveAI();
  
  return (
    <div
      style={{
        '--glass-intensity': config.glassIntensity,
        '--animation-speed': config.animationSpeed,
        fontSize: `${config.fontSize}rem`,
      }}
    >
      <p>Total Interactions: {insights.totalInteractions}</p>
      <p>Session Duration: {Math.floor(insights.sessionDuration / 1000)}s</p>
      <p>Glass Intensity: {config.glassIntensity.toFixed(2)}</p>
      <p>Preferred Motion: {config.reducedMotion ? 'Reduced' : 'Full'}</p>
    </div>
  );
}

// AI automatically adapts based on:
// - User interaction patterns (clicks, hovers, scrolling)
// - Device capabilities (mobile, tablet, desktop)
// - Time of day and usage context
// - Accessibility preferences
// - Performance characteristics
```