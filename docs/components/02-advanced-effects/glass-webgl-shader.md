### GlassWebGLShader
WebGL-powered glass shaders with GPU acceleration.

```tsx
import { GlassWebGLShader } from 'aura-glass';

<GlassWebGLShader
  variant="refraction"         // 'refraction' | 'dispersion' | 'frosted' | 'crystal' | 'prism'
  intensity={1}                // Effect intensity
  animated={true}              // Enable animation
  interactive={true}           // Mouse interaction
  backgroundColor="transparent" // Background color
  className="absolute inset-0"
/>

// Different shader variants
<GlassWebGLShader variant="dispersion" intensity={1.5} />  // Rainbow dispersion
<GlassWebGLShader variant="crystal" intensity={0.8} />    // Crystal facets
<GlassWebGLShader variant="prism" intensity={1.2} />      // Prism light splitting
```