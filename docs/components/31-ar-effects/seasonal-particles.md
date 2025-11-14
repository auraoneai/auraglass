# SeasonalParticles

Realistic seasonal particle effects with weather physics, environmental adaptation, and atmospheric enhancements.

## 🌟 Overview

SeasonalParticles creates beautiful, realistic particle effects that simulate natural seasonal phenomena. From falling snow in winter to blooming petals in spring, these effects add atmospheric depth and seasonal context to your applications.

## 🎯 Features

- **Four Complete Seasons**: Winter, Spring, Summer, Autumn with unique particle systems
- **Weather Physics**: Realistic particle movement with wind, gravity, and environmental factors
- **Auto-Season Rotation**: Automatic progression through seasons or manual control
- **Adaptive Performance**: Dynamic particle counts based on device capabilities
- **Interactive Controls**: Real-time parameter adjustment and season switching
- **Environmental Context**: Time and location-aware seasonal adaptation

## 📚 Basic Usage

```tsx
import { SeasonalParticles } from 'aura-glass';

function SeasonalBackground() {
  return (
    <SeasonalParticles
      season="winter"
      particleCount={50}
      windStrength={0.8}
      animationSpeed={1}
      showControls={true}
      onSeasonChange={(season) => console.log('Season:', season)}
    />
  );
}
```

## 🎨 Props API

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `season` | `'winter' \| 'spring' \| 'summer' \| 'autumn' \| 'auto'` | `'auto'` | Season selection or auto-rotation |
| `particleCount` | `number` | `30` | Number of active particles |
| `windStrength` | `number` | `1` | Wind effect intensity (0-2) |
| `animationSpeed` | `number` | `1` | Animation speed multiplier |
| `autoSeason` | `boolean` | `true` | Enable automatic season rotation |
| `seasonDuration` | `number` | `10000` | Duration per season in auto mode (ms) |
| `showControls` | `boolean` | `false` | Show season control panel |
| `onSeasonChange` | `function` | - | Callback when season changes |
| `className` | `string` | `''` | Additional CSS classes |

## ❄️ Winter Effects

### Snow Particles
```tsx
<SeasonalParticles
  season="winter"
  particleCount={80}
  windStrength={0.6}
  animationSpeed={0.8}
/>
```

**Features:**
- Realistic snowflake geometry with hexagonal patterns
- Gentle falling motion with wind drift
- Icy blue color palette with subtle variations
- Physics-based accumulation effects

### Winter Configuration
```tsx
const winterConfig = {
  season: 'winter',
  particleCount: 60,
  windStrength: 0.4,
  animationSpeed: 0.7,
  seasonDuration: 15000
};
```

## 🌸 Spring Effects

### Flower Petals
```tsx
<SeasonalParticles
  season="spring"
  particleCount={40}
  windStrength={1.2}
  animationSpeed={1.2}
/>
```

**Features:**
- Organic petal shapes with natural curves
- Floating motion with gentle breeze effects
- Vibrant spring color palette (pinks, whites, yellows)
- Seasonal blooming patterns

### Spring Configuration
```tsx
const springConfig = {
  season: 'spring',
  particleCount: 45,
  windStrength: 0.8,
  animationSpeed: 1.0,
  seasonDuration: 12000
};
```

## ☀️ Summer Effects

### Sun Rays
```tsx
<SeasonalParticles
  season="summer"
  particleCount={30}
  windStrength={1.5}
  animationSpeed={1.5}
/>
```

**Features:**
- Radiant sun ray particles with pulsing effects
- Warm golden color palette
- High-energy motion patterns
- Summer heat wave distortions

### Summer Configuration
```tsx
const summerConfig = {
  season: 'summer',
  particleCount: 35,
  windStrength: 1.2,
  animationSpeed: 1.3,
  seasonDuration: 10000
};
```

## 🍂 Autumn Effects

### Falling Leaves
```tsx
<SeasonalParticles
  season="autumn"
  particleCount={50}
  windStrength={1.0}
  animationSpeed={0.9}
/>
```

**Features:**
- Realistic leaf shapes with organic movement
- Rich autumn color palette (reds, oranges, yellows)
- Swirling wind patterns with realistic physics
- Seasonal color transitions

### Autumn Configuration
```tsx
const autumnConfig = {
  season: 'autumn',
  particleCount: 55,
  windStrength: 0.9,
  animationSpeed: 0.8,
  seasonDuration: 13000
};
```

## 🔄 Auto-Season Mode

### Automatic Rotation
```tsx
<SeasonalParticles
  season="auto"
  particleCount={40}
  windStrength={1.0}
  animationSpeed={1.0}
  autoSeason={true}
  seasonDuration={12000}
  onSeasonChange={(season) => {
    console.log(`Season changed to: ${season}`);
    // Update UI theme or content based on season
    updateAppTheme(season);
  }}
/>
```

### Custom Season Cycle
```tsx
function CustomSeasonCycle() {
  const [currentSeason, setCurrentSeason] = useState('winter');
  const seasons = ['winter', 'spring', 'summer', 'autumn'];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSeason(prev => {
        const currentIndex = seasons.indexOf(prev);
        return seasons[(currentIndex + 1) % seasons.length];
      });
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <SeasonalParticles
      season={currentSeason}
      particleCount={50}
      windStrength={1.0}
      animationSpeed={1.0}
    />
  );
}
```

## 🎮 Interactive Controls

### Control Panel
```tsx
<SeasonalParticles
  season="auto"
  showControls={true}
  particleCount={40}
  windStrength={0.8}
  onSeasonChange={(season) => {
    // Handle season changes
    trackSeasonChange(season);
  }}
/>
```

**Control Features:**
- Season selection buttons
- Wind strength slider
- Particle count adjustment
- Animation speed control
- Real-time parameter updates

### Programmatic Control
```tsx
function ControlledSeason() {
  const [season, setSeason] = useState('winter');
  const [windStrength, setWindStrength] = useState(1.0);

  return (
    <div>
      <div className="controls mb-4">
        <select value={season} onChange={(e) => setSeason(e.target.value)}>
          <option value="winter">Winter</option>
          <option value="spring">Spring</option>
          <option value="summer">Summer</option>
          <option value="autumn">Autumn</option>
        </select>

        <input
          type="range"
          min="0"
          max="2"
          step="0.1"
          value={windStrength}
          onChange={(e) => setWindStrength(Number(e.target.value))}
        />
        <span>Wind: {windStrength}</span>
      </div>

      <SeasonalParticles
        season={season}
        windStrength={windStrength}
        particleCount={50}
        animationSpeed={1}
      />
    </div>
  );
}
```

## 🎨 Customization

### Color Themes
```tsx
// Custom color palettes
const customThemes = {
  northern: {
    winter: '#e3f2fd',
    spring: '#fce4ec',
    summer: '#fff3e0',
    autumn: '#efebe9'
  },
  tropical: {
    winter: '#e1f5fe',
    spring: '#fce4ec',
    summer: '#fff8e1',
    autumn: '#f3e5f5'
  }
};
```

### Particle Customization
```tsx
function CustomParticles() {
  const customParticleConfig = {
    size: { min: 0.5, max: 2.0 },
    opacity: { min: 0.3, max: 0.9 },
    speed: { min: 0.01, max: 0.05 },
    rotation: { min: -0.02, max: 0.02 }
  };

  return (
    <SeasonalParticles
      season="winter"
      particleCount={60}
      // Custom particle properties would be applied internally
    />
  );
}
```

### Environmental Adaptation
```tsx
function AdaptiveSeason() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  // Determine season based on current date
  const getSeasonFromDate = (date) => {
    const month = date.getMonth();
    if (month >= 11 || month <= 1) return 'winter';
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    return 'autumn';
  };

  const season = getSeasonFromDate(currentTime);
  const hour = currentTime.getHours();

  // Adjust effects based on time of day
  const timeBasedIntensity = hour >= 6 && hour <= 18 ? 1.0 : 0.6;
  const timeBasedWind = hour >= 12 && hour <= 15 ? 1.2 : 0.8;

  return (
    <SeasonalParticles
      season={season}
      particleCount={Math.floor(40 * timeBasedIntensity)}
      windStrength={timeBasedWind}
      animationSpeed={timeBasedIntensity}
    />
  );
}
```

## 📱 Performance Optimization

### Device Detection
```tsx
function OptimizedParticles() {
  const [deviceType, setDeviceType] = useState('desktop');

  useEffect(() => {
    const userAgent = navigator.userAgent;
    if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
      setDeviceType('mobile');
    } else if (/iPad|Android|Tablet/i.test(userAgent)) {
      setDeviceType('tablet');
    } else {
      setDeviceType('desktop');
    }
  }, []);

  const getOptimizedConfig = (device) => {
    switch (device) {
      case 'mobile':
        return { particleCount: 20, animationSpeed: 0.8 };
      case 'tablet':
        return { particleCount: 35, animationSpeed: 0.9 };
      default:
        return { particleCount: 50, animationSpeed: 1.0 };
    }
  };

  const config = getOptimizedConfig(deviceType);

  return (
    <SeasonalParticles
      season="auto"
      particleCount={config.particleCount}
      animationSpeed={config.animationSpeed}
      windStrength={0.8}
    />
  );
}
```

### Quality Tiers
```tsx
const qualityTiers = {
  low: { particleCount: 15, animationSpeed: 0.6, windStrength: 0.5 },
  medium: { particleCount: 30, animationSpeed: 0.8, windStrength: 0.8 },
  high: { particleCount: 50, animationSpeed: 1.0, windStrength: 1.0 },
  ultra: { particleCount: 80, animationSpeed: 1.2, windStrength: 1.2 }
};
```

## 🎯 Use Cases

### Seasonal Website Themes
```tsx
function SeasonalWebsite({ currentSeason }) {
  return (
    <div className={`seasonal-theme ${currentSeason}`}>
      <SeasonalParticles
        season={currentSeason}
        particleCount={40}
        windStrength={0.8}
        showControls={false}
      />

      <header className="hero-section">
        <h1>Seasonal Experience</h1>
        <p>Enjoy the beauty of {currentSeason}</p>
      </header>

      <main className="content">
        {/* Website content */}
      </main>
    </div>
  );
}
```

### Weather Dashboard
```tsx
function WeatherDashboard() {
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    // Fetch weather data
    fetchWeatherData().then(setWeatherData);
  }, []);

  const getSeasonFromWeather = (weather) => {
    if (weather.temperature < 0) return 'winter';
    if (weather.temperature < 15) return 'spring';
    if (weather.temperature < 25) return 'autumn';
    return 'summer';
  };

  const season = weatherData ? getSeasonFromWeather(weatherData) : 'auto';

  return (
    <div className="weather-dashboard">
      <SeasonalParticles
        season={season}
        particleCount={30}
        windStrength={weatherData?.windSpeed || 1}
        animationSpeed={0.8}
      />

      {/* Weather information */}
      {weatherData && (
        <div className="weather-info">
          <h2>{weatherData.location}</h2>
          <div className="temperature">{weatherData.temperature}°C</div>
          <div className="condition">{weatherData.condition}</div>
        </div>
      )}
    </div>
  );
}
```

### Interactive Storytelling
```tsx
function SeasonalStory() {
  const [currentChapter, setCurrentChapter] = useState(0);
  const chapters = [
    { season: 'winter', title: 'The Frozen Forest' },
    { season: 'spring', title: 'Blossoming Hope' },
    { season: 'summer', title: 'Golden Days' },
    { season: 'autumn', title: 'Falling Leaves' }
  ];

  const currentSeason = chapters[currentChapter].season;

  return (
    <div className="story-container">
      <SeasonalParticles
        season={currentSeason}
        particleCount={45}
        windStrength={1.0}
        animationSpeed={0.9}
        showControls={false}
      />

      <div className="story-content">
        <h1>{chapters[currentChapter].title}</h1>
        <StoryContent chapter={currentChapter} />

        <div className="navigation">
          <button
            onClick={() => setCurrentChapter(Math.max(0, currentChapter - 1))}
            disabled={currentChapter === 0}
          >
            Previous
          </button>

          <button
            onClick={() => setCurrentChapter(Math.min(chapters.length - 1, currentChapter + 1))}
            disabled={currentChapter === chapters.length - 1}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
```

### Gaming Environments
```tsx
function GameEnvironment({ gameState }) {
  const getSeasonFromGameState = (state) => {
    switch (state.level) {
      case 1: return 'winter';
      case 2: return 'spring';
      case 3: return 'summer';
      case 4: return 'autumn';
      default: return 'auto';
    }
  };

  const season = getSeasonFromGameState(gameState);
  const intensity = gameState.isBossFight ? 1.5 : 1.0;

  return (
    <div className="game-environment">
      <SeasonalParticles
        season={season}
        particleCount={Math.floor(40 * intensity)}
        windStrength={gameState.windSpeed || 1}
        animationSpeed={intensity}
      />

      {/* Game content */}
      <GameCanvas gameState={gameState} />
    </div>
  );
}
```

## 🎨 Styling

### CSS Integration
```css
.seasonal-particles {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -1;
}

.seasonal-theme {
  transition: background-color 2s ease, color 2s ease;
}

.seasonal-theme.winter {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #e3f2fd;
}

.seasonal-theme.spring {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: #fce4ec;
}
```

### Theme Integration
```tsx
function ThemedSeasonal({ theme }) {
  const themes = {
    nature: {
      winter: '#e8f5e8',
      spring: '#fce4ec',
      summer: '#fff3e0',
      autumn: '#efebe9'
    },
    cosmic: {
      winter: '#e3f2fd',
      spring: '#f3e5f5',
      summer: '#fff8e1',
      autumn: '#fce4ec'
    }
  };

  return (
    <div
      className="seasonal-container"
      style={{
        background: `linear-gradient(135deg, ${themes[theme].winter} 0%, ${themes[theme].spring} 100%)`
      }}
    >
      <SeasonalParticles
        season="auto"
        particleCount={40}
        windStrength={0.8}
        showControls={true}
      />

      <Content theme={themes[theme]} />
    </div>
  );
}
```

## 🔧 Troubleshooting

### Common Issues

**Particles not visible:**
- Check if WebGL is supported in the browser
- Verify CSS positioning (not `display: none`)
- Ensure proper z-index layering

**Poor performance:**
- Reduce `particleCount` for better performance
- Use `autoSeason={false}` to prevent rapid changes
- Lower `animationSpeed` on slower devices

**Season changes not working:**
- Verify `season` prop is set correctly
- Check `autoSeason` prop for automatic rotation
- Ensure `onSeasonChange` callback is properly implemented

**Wind effects not noticeable:**
- Increase `windStrength` value
- Check if particles are moving (may be subtle)
- Verify animation is not paused

## 📚 Related Components

- **GlassShatterEffects**: Combine seasonal particles with shatter effects
- **AuroraPro**: Create aurora effects that complement seasonal themes
- **ARGlassEffects**: Use seasonal particles in AR environments
- **HoudiniGlassProvider**: Optimize seasonal particle rendering

## 🔗 Resources

- [WebGL Particle Systems](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API)
- [CSS Animations](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations)
- [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)

---

*Bring the beauty of nature's seasons to your applications with SeasonalParticles - where code meets the cycles of life.*

