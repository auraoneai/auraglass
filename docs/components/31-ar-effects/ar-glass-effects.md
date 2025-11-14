# ARGlassEffects

WebXR-powered augmented reality component with hand tracking, spatial interactions, and immersive 3D experiences.

## 🌟 Overview

ARGlassEffects brings the power of WebXR to AuraGlass, enabling developers to create immersive augmented reality experiences that seamlessly integrate with glassmorphism design principles.

## 🎯 Features

- **WebXR Integration**: Native browser AR support
- **Hand Tracking**: Gesture-based 3D interactions
- **Spatial Audio**: 3D positional sound effects
- **Physics Simulation**: Dynamic object interactions
- **Adaptive Scaling**: Context-aware UI adjustments
- **Multi-Modal Input**: Voice, touch, and gesture support

## 📚 Basic Usage

```tsx
import { ARGlassEffects } from 'aura-glass';

function ARExperience() {
  return (
    <ARGlassEffects
      mode="preview"
      enableHandTracking={true}
      enablePhysics={true}
      showControls={true}
      content={{
        title: "AR Experience",
        text: "Welcome to augmented reality!"
      }}
      onInteraction={(type, data) => {
        console.log('AR interaction:', type, data);
      }}
    />
  );
}
```

## 🎨 Props API

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `mode` | `'ar' \| 'preview' \| 'demo'` | `'preview'` | AR display mode |
| `content` | `object` | `{}` | Content configuration |
| `enablePhysics` | `boolean` | `false` | Enable physics simulation |
| `enableHandTracking` | `boolean` | `false` | Enable hand gesture tracking |
| `enableVoiceControl` | `boolean` | `false` | Enable voice interaction |
| `adaptiveScaling` | `boolean` | `true` | Enable adaptive UI scaling |
| `showControls` | `boolean` | `true` | Show AR control panel |
| `showInfo` | `boolean` | `true` | Show capability information |
| `onInteraction` | `function` | - | Interaction callback |
| `className` | `string` | `''` | Additional CSS classes |

## 🔧 Content Configuration

```tsx
const content = {
  title: "Your AR Title",
  text: "Description of the AR experience",
  data: [0.8, 0.6, 0.9, 0.4], // Data visualization
  media: "path/to/media" // Media content
};
```

## 🎮 Interaction Types

### Hand Tracking
```tsx
<ARGlassEffects
  enableHandTracking={true}
  onInteraction={(type, data) => {
    if (type === 'hand_interaction') {
      // Handle hand gestures
      console.log('Hand position:', data.hand.position);
    }
  }}
/>
```

### Surface Detection
```tsx
<ARGlassEffects
  onInteraction={(type, data) => {
    if (type === 'surface_detected') {
      // Handle surface detection
      console.log('Surfaces found:', data.count);
      data.points.forEach(point => {
        // Place objects on detected surfaces
      });
    }
  }}
/>
```

### Panel Interactions
```tsx
<ARGlassEffects
  onInteraction={(type, data) => {
    if (type === 'panel_interaction') {
      switch (data.type) {
        case 'main':
          // Main panel interaction
          break;
        case 'secondary':
          // Secondary panel interaction
          break;
      }
    }
  }}
/>
```

## 🌐 WebXR Compatibility

### Browser Support
- Chrome 79+ (Android)
- Edge 79+ (Android)
- Safari 13.1+ (iOS)
- Firefox Reality
- Oculus Browser

### Feature Detection
```tsx
import { ARGlassEffects } from 'aura-glass';

// Check WebXR support
function checkARSupport() {
  return navigator.xr && navigator.xr.isSessionSupported('immersive-ar');
}

// Conditional rendering
{checkARSupport() ? (
  <ARGlassEffects mode="ar" />
) : (
  <ARGlassEffects mode="preview" />
)}
```

## 🎨 Customization

### Custom Materials
```tsx
// Custom glass material for AR
const customMaterial = ARGlassMaterialFactory.createSpatialUI({
  color: new THREE.Color(0.2, 0.8, 1.0),
  opacity: 0.9,
  interactionRadius: 4.0,
  glowIntensity: 1.5
});
```

### Animation Systems
```tsx
// Custom floating animation
const floatingAnimation = ARGlassAnimations.createFloatingAnimation(
  object,
  0.1, // amplitude
  0.8  // frequency
);

// Custom rotation animation
const rotationAnimation = ARGlassAnimations.createRotationAnimation(
  object,
  new THREE.Vector3(0, 1, 0), // axis
  1.5 // speed
);
```

## 📱 Device Optimization

### Performance Settings
```tsx
<ARGlassEffects
  mode="ar"
  // Optimize for mobile devices
  enablePhysics={false} // Disable physics on mobile
  particleCount={20} // Reduce particles
  quality="medium" // Lower quality setting
/>
```

### Adaptive Quality
```tsx
// Automatic quality adjustment
function getDeviceCapabilities() {
  const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const hasWebGL = (() => {
    try {
      const canvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && canvas.getContext('webgl'));
    } catch (e) {
      return false;
    }
  })();

  return {
    quality: isMobile ? 'medium' : 'high',
    enablePhysics: hasWebGL && !isMobile,
    particleCount: isMobile ? 30 : 80
  };
}
```

## 🎵 Audio Integration

### Spatial Audio
```tsx
<ARGlassEffects
  enableVoiceControl={true}
  onInteraction={(type, data) => {
    if (type === 'voice_command') {
      // Handle voice commands
      const { command, confidence } = data;
      if (confidence > 0.8) {
        // Process high-confidence commands
      }
    }
  }}
/>
```

### Haptic Feedback
```tsx
// Trigger haptic feedback on interaction
function triggerHapticFeedback(intensity = 0.5, duration = 100) {
  if ('vibrate' in navigator) {
    navigator.vibrate(duration * intensity);
  }
}
```

## 🏗️ Advanced Usage

### Multi-Object AR Scene
```tsx
function ComplexARScene() {
  const [objects, setObjects] = useState([]);

  return (
    <ARGlassEffects
      mode="ar"
      enablePhysics={true}
      onInteraction={(type, data) => {
        if (type === 'surface_detected') {
          // Add objects to detected surfaces
          const newObjects = data.points.map(point => ({
            position: point,
            type: 'glass-panel'
          }));
          setObjects(prev => [...prev, ...newObjects]);
        }
      }}
    >
      {objects.map((obj, index) => (
        <ARObject key={index} {...obj} />
      ))}
    </ARGlassEffects>
  );
}
```

### Collaborative AR
```tsx
function CollaborativeAR() {
  const [sharedObjects, setSharedObjects] = useState([]);

  useEffect(() => {
    // Connect to WebRTC for collaboration
    const connection = new RTCPeerConnection();

    // Sync AR objects across users
    connection.onmessage = (event) => {
      const { type, data } = JSON.parse(event.data);
      if (type === 'object_update') {
        setSharedObjects(prev => [...prev, data]);
      }
    };

    return () => connection.close();
  }, []);

  return (
    <ARGlassEffects mode="ar">
      {sharedObjects.map(obj => (
        <SharedARObject key={obj.id} {...obj} />
      ))}
    </ARGlassEffects>
  );
}
```

## 🎯 Best Practices

### Performance
- Use `mode="preview"` for development testing
- Disable physics on low-end devices
- Limit particle counts based on device capabilities
- Use object pooling for dynamic content

### UX Design
- Provide clear visual feedback for interactions
- Include fallback experiences for non-AR devices
- Consider user comfort with prolonged AR use
- Test on target devices before deployment

### Accessibility
- Ensure sufficient contrast in AR content
- Provide alternative navigation methods
- Consider motion sensitivity preferences
- Test with screen readers and assistive technologies

## 🔧 Troubleshooting

### Common Issues

**AR not starting:**
- Ensure HTTPS is enabled
- Check WebXR browser support
- Verify camera permissions

**Poor performance:**
- Reduce particle counts
- Disable physics simulation
- Lower rendering quality
- Use fewer active effects

**Hand tracking not working:**
- Check device compatibility
- Ensure good lighting conditions
- Verify WebXR permissions
- Test with supported browsers

## 📚 Related Components

- **GlassShatterEffects**: Add interactive effects to AR content
- **SeasonalParticles**: Enhance AR scenes with atmospheric effects
- **AuroraPro**: Create stunning AR aurora displays
- **HoudiniGlassProvider**: Optimize AR rendering performance

## 🔗 Resources

- [WebXR API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/WebXR_API)
- [AR.js Documentation](https://ar-js-org.github.io/AR.js-Docs/)
- [Three.js AR Examples](https://threejs.org/examples/#webxr_ar_paint)

---

*Create immersive augmented reality experiences with ARGlassEffects - the future of interactive design.*

