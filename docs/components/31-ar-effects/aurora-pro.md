# AuroraPro

Spectacular aurora borealis effects with dynamic color palettes, particle systems, and atmospheric lighting.

## 🌟 Overview

AuroraPro creates mesmerizing aurora borealis (northern lights) effects with advanced shader technology, multiple color palettes, and interactive controls. Perfect for creating atmospheric backgrounds, cosmic themes, and immersive visual experiences.

## 🎯 Features

- **Spectacular Aurora Displays**: Realistic northern lights simulation
- **Multiple Color Palettes**: Arctic, Forest, Sunset, Ocean, Cosmic themes
- **Advanced Shader Effects**: Flow, Pulse, Shift, and Mixed animation modes
- **Particle Systems**: Enhanced visual density with customizable particles
- **Atmospheric Lighting**: Dynamic environmental illumination
- **Interactive Controls**: Real-time parameter adjustment
- **Performance Optimized**: GPU-accelerated rendering with adaptive quality

## 📚 Basic Usage

```tsx
import { AuroraPro } from 'aura-glass';

function AuroraBackground() {
  return (
    <AuroraPro
      intensity={1.0}
      speed={1.0}
      colorPalette="arctic"
      particleCount={50}
      showParticles={true}
      showWaves={true}
      showCurtain={false}
      animationMode="flow"
      showControls={true}
    />
  );
}
```

## 🎨 Props API

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `intensity` | `number` | `1.0` | Overall effect intensity (0.1 - 2.0) |
| `speed` | `number` | `1.0` | Animation speed multiplier |
| `colorPalette` | `string` | `'arctic'` | Color palette selection |
| `customColors` | `[string, string, string]` | - | Custom color array for 'custom' palette |
| `particleCount` | `number` | `50` | Number of aurora particles |
| `showParticles` | `boolean` | `true` | Enable particle effects |
| `showWaves` | `boolean` | `true` | Enable wave effects |
| `showCurtain` | `boolean` | `false` | Enable curtain effects |
| `animationMode` | `'flow' \| 'pulse' \| 'shift' \| 'mixed'` | `'flow'` | Animation mode |
| `showControls` | `boolean` | `false` | Show control panel |
| `autoAnimate` | `boolean` | `true` | Enable automatic animation |
| `onAnimationChange` | `function` | - | Animation mode change callback |
| `className` | `string` | `''` | Additional CSS classes |

## 🌈 Color Palettes

### Arctic (Default)
```tsx
<AuroraPro colorPalette="arctic" />
```
**Colors:** Cool blue (#4fc3f7), light green (#81c784), purple (#ba68c8)
**Theme:** Icy, serene, northern lights classic

### Forest
```tsx
<AuroraPro colorPalette="forest" />
```
**Colors:** Deep green (#4caf50), light green (#8bc34a), teal (#009688)
**Theme:** Natural, earthy, forest-inspired

### Sunset
```tsx
<AuroraPro colorPalette="sunset" />
```
**Colors:** Orange (#ff9800), pink (#e91e63), purple (#9c27b0)
**Theme:** Warm, fiery, sunset-inspired

### Ocean
```tsx
<AuroraPro colorPalette="ocean" />
```
**Colors:** Cyan (#00bcd4), blue (#2196f3), indigo (#3f51b5)
**Theme:** Aquatic, deep sea, ocean-inspired

### Cosmic
```tsx
<AuroraPro colorPalette="cosmic" />
```
**Colors:** Purple (#9c27b0), violet (#673ab7), blue (#3f51b5)
**Theme:** Space, cosmic, stellar

### Custom
```tsx
<AuroraPro
  colorPalette="custom"
  customColors={['#ff6b6b', '#4ecdc4', '#45b7d1']}
/>
```
**Colors:** User-defined three-color palette
**Theme:** Fully customizable

## 🎭 Animation Modes

### Flow Mode
```tsx
<AuroraPro animationMode="flow" />
```
**Description:** Smooth, flowing aurora waves
**Best for:** Calm, serene environments
**Characteristics:** Organic movement, continuous flow

### Pulse Mode
```tsx
<AuroraPro animationMode="pulse" />
```
**Description:** Breathing, pulsing effects
**Best for:** Dynamic, energetic displays
**Characteristics:** Rhythmic intensity changes

### Shift Mode
```tsx
<AuroraPro animationMode="shift" />
```
**Description:** Color-shifting transitions
**Best for:** Magical, mystical themes
**Characteristics:** Smooth color transitions

### Mixed Mode
```tsx
<AuroraPro animationMode="mixed" />
```
**Description:** Combined animation effects
**Best for:** Complex, rich displays
**Characteristics:** Multiple effects simultaneously

## 🎨 Customization

### Effect Configuration
```tsx
<AuroraPro
  intensity={1.5}           // Higher intensity
  speed={1.2}              // Faster animation
  particleCount={80}       // More particles
  showParticles={true}     // Enable particles
  showWaves={true}         // Enable waves
  showCurtain={true}       // Enable curtains
  animationMode="mixed"    // Combined effects
/>
```

### Advanced Configuration
```tsx
function AdvancedAurora() {
  const [config, setConfig] = useState({
    intensity: 1.2,
    speed: 1.0,
    palette: 'cosmic',
    mode: 'mixed',
    particles: 60
  });

  return (
    <div>
      <div className="controls">
        {/* Control UI */}
        <AuroraControls config={config} onChange={setConfig} />
      </div>

      <AuroraPro
        intensity={config.intensity}
        speed={config.speed}
        colorPalette={config.palette}
        particleCount={config.particles}
        animationMode={config.mode}
        showControls={false}
      />
    </div>
  );
}
```

## 🎮 Interactive Controls

### Control Panel
```tsx
<AuroraPro
  showControls={true}
  onAnimationChange={(mode) => {
    console.log('Animation mode changed to:', mode);
  }}
/>
```

**Control Features:**
- Animation mode selector (Flow, Pulse, Shift, Mixed)
- Intensity slider
- Speed control
- Color palette picker
- Particle count adjustment
- Real-time preview

### Programmatic Control
```tsx
function ControlledAurora() {
  const [intensity, setIntensity] = useState(1.0);
  const [mode, setMode] = useState('flow');

  return (
    <div>
      <div className="controls mb-4">
        <label>
          Intensity: {intensity.toFixed(1)}
          <input
            type="range"
            min="0.1"
            max="2.0"
            step="0.1"
            value={intensity}
            onChange={(e) => setIntensity(Number(e.target.value))}
          />
        </label>

        <select value={mode} onChange={(e) => setMode(e.target.value)}>
          <option value="flow">Flow</option>
          <option value="pulse">Pulse</option>
          <option value="shift">Shift</option>
          <option value="mixed">Mixed</option>
        </select>
      </div>

      <AuroraPro
        intensity={intensity}
        animationMode={mode}
        showControls={false}
      />
    </div>
  );
}
```

## 🎨 Effect Presets

### Serene Display
```tsx
<AuroraPro
  intensity={0.8}
  speed={0.6}
  colorPalette="arctic"
  particleCount={40}
  animationMode="flow"
  showParticles={true}
  showWaves={true}
  showCurtain={false}
/>
```

### Dynamic Display
```tsx
<AuroraPro
  intensity={1.4}
  speed={1.2}
  colorPalette="sunset"
  particleCount={70}
  animationMode="mixed"
  showParticles={true}
  showWaves={true}
  showCurtain={true}
/>
```

### Minimal Display
```tsx
<AuroraPro
  intensity={0.6}
  speed={0.4}
  colorPalette="ocean"
  particleCount={20}
  animationMode="pulse"
  showParticles={false}
  showWaves={true}
  showCurtain={false}
/>
```

### Intense Display
```tsx
<AuroraPro
  intensity={1.8}
  speed={1.5}
  colorPalette="cosmic"
  particleCount={100}
  animationMode="shift"
  showParticles={true}
  showWaves={true}
  showCurtain={true}
/>
```

## 📱 Performance Optimization

### Device Detection
```tsx
function OptimizedAurora() {
  const [deviceCapabilities, setDeviceCapabilities] = useState({
    isMobile: false,
    hasWebGL: false,
    performance: 'high'
  });

  useEffect(() => {
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    // Check WebGL support
    const canvas = document.createElement('canvas');
    const hasWebGL = !!(window.WebGLRenderingContext && canvas.getContext('webgl'));

    // Determine performance tier
    let performance = 'high';
    if (isMobile) performance = 'medium';
    if (!hasWebGL) performance = 'low';

    setDeviceCapabilities({ isMobile, hasWebGL, performance });
  }, []);

  const getOptimizedConfig = (performance) => {
    switch (performance) {
      case 'low':
        return { particleCount: 15, intensity: 0.6, showParticles: false };
      case 'medium':
        return { particleCount: 35, intensity: 0.8, showParticles: true };
      case 'high':
        return { particleCount: 60, intensity: 1.0, showParticles: true };
      default:
        return { particleCount: 40, intensity: 0.8, showParticles: true };
    }
  };

  const config = getOptimizedConfig(deviceCapabilities.performance);

  return (
    <AuroraPro
      particleCount={config.particleCount}
      intensity={config.intensity}
      showParticles={config.showParticles}
      showWaves={true}
      showCurtain={deviceCapabilities.performance === 'high'}
    />
  );
}
```

### Quality Tiers
```tsx
const qualityTiers = {
  low: {
    particleCount: 20,
    intensity: 0.6,
    speed: 0.8,
    showParticles: false,
    showCurtain: false
  },
  medium: {
    particleCount: 40,
    intensity: 0.8,
    speed: 1.0,
    showParticles: true,
    showCurtain: false
  },
  high: {
    particleCount: 60,
    intensity: 1.0,
    speed: 1.2,
    showParticles: true,
    showCurtain: true
  },
  ultra: {
    particleCount: 100,
    intensity: 1.5,
    speed: 1.5,
    showParticles: true,
    showCurtain: true
  }
};
```

## 🎯 Use Cases

### Cosmic Website Background
```tsx
function CosmicWebsite() {
  return (
    <div className="cosmic-site">
      <AuroraPro
        colorPalette="cosmic"
        intensity={1.2}
        animationMode="mixed"
        particleCount={60}
        showControls={false}
      />

      <header className="hero">
        <h1>Welcome to the Cosmos</h1>
        <p>Experience the beauty of aurora lights</p>
      </header>

      <main className="content">
        {/* Website content */}
      </main>
    </div>
  );
}
```

### Meditation App
```tsx
function MeditationApp({ mood }) {
  const auroraSettings = {
    calm: {
      palette: 'ocean',
      intensity: 0.7,
      mode: 'flow',
      speed: 0.5
    },
    energize: {
      palette: 'sunset',
      intensity: 1.2,
      mode: 'pulse',
      speed: 1.0
    },
    focus: {
      palette: 'arctic',
      intensity: 0.9,
      mode: 'shift',
      speed: 0.7
    }
  };

  const settings = auroraSettings[mood] || auroraSettings.calm;

  return (
    <div className="meditation-app">
      <AuroraPro
        colorPalette={settings.palette}
        intensity={settings.intensity}
        animationMode={settings.mode}
        speed={settings.speed}
        showControls={false}
      />

      <MeditationInterface mood={mood} />
    </div>
  );
}
```

### Gaming Environment
```tsx
function GameLevel({ levelType }) {
  const levelThemes = {
    forest: { palette: 'forest', intensity: 1.0, mode: 'flow' },
    space: { palette: 'cosmic', intensity: 1.3, mode: 'shift' },
    underwater: { palette: 'ocean', intensity: 0.9, mode: 'pulse' },
    mystical: { palette: 'sunset', intensity: 1.1, mode: 'mixed' }
  };

  const theme = levelThemes[levelType] || levelThemes.forest;

  return (
    <div className="game-level">
      <AuroraPro
        colorPalette={theme.palette}
        intensity={theme.intensity}
        animationMode={theme.mode}
        particleCount={50}
        showControls={false}
      />

      <GameCanvas levelType={levelType} />
    </div>
  );
}
```

### Event Visualization
```tsx
function DataVisualization({ data, eventType }) {
  const eventThemes = {
    celebration: { palette: 'sunset', mode: 'pulse', intensity: 1.4 },
    conference: { palette: 'arctic', mode: 'flow', intensity: 1.0 },
    concert: { palette: 'cosmic', mode: 'mixed', intensity: 1.2 },
    award: { palette: 'ocean', mode: 'shift', intensity: 1.1 }
  };

  const theme = eventThemes[eventType] || eventThemes.conference;

  return (
    <div className="event-visualization">
      <AuroraPro
        colorPalette={theme.palette}
        animationMode={theme.mode}
        intensity={theme.intensity}
        particleCount={Math.min(80, data.length * 2)}
        showControls={false}
      />

      <DataDisplay data={data} />
    </div>
  );
}
```

## 🎨 Styling

### CSS Integration
```css
.aurora-pro {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -1;
}

.aurora-theme {
  transition: background-color 3s ease;
}

.aurora-theme.arctic {
  background: linear-gradient(180deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%);
}

.aurora-theme.cosmic {
  background: linear-gradient(180deg, #0f0f23 0%, #1a1a2e 50%, #2d1b69 100%);
}
```

### Theme Integration
```tsx
function ThemedAurora({ theme }) {
  const themes = {
    northern: {
      background: 'linear-gradient(180deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)',
      glassColor: 'rgba(79, 195, 247, 0.1)',
      accentColor: '#4fc3f7'
    },
    mystical: {
      background: 'linear-gradient(180deg, #0f0f23 0%, #1a1a2e 50%, #2d1b69 100%)',
      glassColor: 'rgba(186, 104, 200, 0.1)',
      accentColor: '#ba68c8'
    },
    tropical: {
      background: 'linear-gradient(180deg, #0c0c0c 0%, #1a1a2e 50%, #0f3460 100%)',
      glassColor: 'rgba(0, 188, 212, 0.1)',
      accentColor: '#00bcd4'
    }
  };

  return (
    <div
      className="aurora-container"
      style={{
        background: themes[theme].background,
        '--glass-color': themes[theme].glassColor,
        '--accent-color': themes[theme].accentColor
      }}
    >
      <AuroraPro
        colorPalette={theme}
        intensity={1.0}
        showControls={true}
      />

      <Content theme={themes[theme]} />
    </div>
  );
}
```

## 🔧 Troubleshooting

### Common Issues

**Aurora not visible:**
- Check WebGL support in browser
- Verify CSS positioning and z-index
- Ensure proper canvas dimensions

**Poor performance:**
- Reduce `particleCount` for better performance
- Lower `intensity` and `speed` values
- Disable `showCurtain` on slower devices
- Use `animationMode="flow"` for smoother performance

**Color palette not changing:**
- Verify `colorPalette` prop is set correctly
- Check `customColors` array for custom palette
- Ensure component re-renders on prop changes

**Controls not showing:**
- Set `showControls={true}`
- Check CSS for proper positioning
- Verify component has sufficient space

**Animation stuttering:**
- Reduce animation complexity
- Use lower `speed` values
- Check for competing animations
- Verify stable frame rate

## 📚 Related Components

- **SeasonalParticles**: Combine aurora with seasonal effects
- **GlassShatterEffects**: Add shatter effects to aurora displays
- **ARGlassEffects**: Use aurora in AR environments
- **HoudiniGlassProvider**: Optimize aurora rendering performance

## 🔗 Resources

- [WebGL Shaders](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API)
- [Three.js Documentation](https://threejs.org/docs/)
- [Shadertoy](https://www.shadertoy.com/) - Shader inspiration
- [Aurora Photography](https://www.atlasobscura.com/articles/what-causes-the-northern-lights) - Real aurora research

---

*Create breathtaking aurora experiences with AuroraPro - where science meets cosmic beauty.*

