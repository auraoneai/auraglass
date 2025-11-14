### GlassEyeTracking
Gaze-responsive glass effects using WebGazer.js and device camera for eye tracking.

```tsx
import {
  GlassEyeTrackingProvider,
  GlassEyeTrackingCalibration,
  GlassGazeResponsive,
  GlassGazeVisualization,
  useEyeTracking,
  eyeTrackingPresets
} from 'aura-glass';

// Setup eye tracking with calibration
<GlassEyeTrackingProvider autoInitialize={true}>
  <GlassEyeTrackingCalibration
    onComplete={() => console.log('Eye tracking calibrated!')}
  />
  
  {/* Components that respond to gaze */}
  <GlassGazeResponsive
    regionId="interactive-card"
    onGazeEnter={(interaction) => console.log('User looking at card')}
    onGazeLeave={() => console.log('User looked away')}
    glassIntensity={true}
    glassRadius={true}
    glassBlur={true}
  >
    <div>This card responds to your gaze!</div>
  </GlassGazeResponsive>
  
  {/* Debug visualization */}
  <GlassGazeVisualization show={true} />
</GlassEyeTrackingProvider>

// Hook usage
function GazeAwareButton() {
  const { activeInteractions, isInitialized } = useEyeTracking();
  const isGazedAt = activeInteractions.some(i => i.region.id === 'my-button');
  
  return (
    <button className={isGazedAt ? 'gaze-active' : ''}>
      {isGazedAt ? '👁️ Looking at me!' : 'Look at me'}
    </button>
  );
}
```