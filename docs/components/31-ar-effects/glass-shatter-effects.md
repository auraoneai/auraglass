# GlassShatterEffects

Dynamic glass shatter effects with physics-based animations, customizable shards, and interactive controls.

## 🌟 Overview

GlassShatterEffects creates stunning visual effects where glass surfaces appear to shatter into realistic shards with physics-based animation. Perfect for interactive experiences, transitions, and dramatic reveals.

## 🎯 Features

- **Physics-Based Animation**: Realistic glass fracture simulation
- **Multiple Trigger Types**: Click, hover, manual, and auto triggers
- **Customizable Shards**: Control count, size, spread, and appearance
- **Auto-Reform**: Optional automatic reconstruction animation
- **Interactive Controls**: Real-time parameter adjustment
- **Performance Optimized**: Efficient WebGL rendering

## 📚 Basic Usage

```tsx
import { GlassShatterEffects } from 'aura-glass';

function ShatterCard() {
  return (
    <GlassShatterEffects
      trigger="click"
      duration={2}
      intensity={1}
      shardCount={16}
      autoReform={true}
      reformDelay={3000}
      showControls={true}
    >
      <div className="p-8 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20">
        <h3 className="text-2xl font-bold text-white mb-4">Click to Shatter!</h3>
        <p className="text-white/80">
          This content will shatter into glass shards when clicked.
        </p>
      </div>
    </GlassShatterEffects>
  );
}
```

## 🎨 Props API

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `trigger` | `'click' \| 'hover' \| 'manual' \| 'auto'` | `'click'` | How the effect is triggered |
| `duration` | `number` | `2` | Animation duration in seconds |
| `intensity` | `number` | `1` | Effect intensity (0.1 - 2.0) |
| `shardCount` | `number` | `12` | Number of glass shards |
| `autoReform` | `boolean` | `true` | Automatically reform after shattering |
| `reformDelay` | `number` | `3000` | Delay before auto-reform (ms) |
| `showControls` | `boolean` | `false` | Show effect controls |
| `onShatter` | `function` | - | Callback when shatter starts |
| `onReform` | `function` | - | Callback when reform completes |
| `disabled` | `boolean` | `false` | Disable the effect |
| `className` | `string` | `''` | Additional CSS classes |

## 🎮 Trigger Types

### Click Trigger
```tsx
<GlassShatterEffects trigger="click">
  <YourContent />
</GlassShatterEffects>
```

### Hover Trigger
```tsx
<GlassShatterEffects
  trigger="hover"
  reformDelay={2000}
>
  <YourContent />
</GlassShatterEffects>
```

### Manual Trigger
```tsx
function ManualShatter() {
  const [shattered, setShattered] = useState(false);

  return (
    <GlassShatterEffects
      trigger="manual"
      onShatter={() => setShattered(true)}
      onReform={() => setShattered(false)}
    >
      <button
        onClick={() => {
          // Trigger shatter programmatically
          if (shattered) {
            // Trigger reform
          }
        }}
      >
        {shattered ? 'Reform' : 'Shatter'}
      </button>
    </GlassShatterEffects>
  );
}
```

### Auto Trigger
```tsx
<GlassShatterEffects
  trigger="auto"
  reformDelay={5000}
>
  <YourContent />
</GlassShatterEffects>
```

## 🎨 Customization

### Shard Configuration
```tsx
<GlassShatterEffects
  shardCount={24}        // More shards = more dramatic effect
  intensity={1.5}        // Higher intensity = more spread
  duration={3}           // Longer animation = slower effect
>
  <YourContent />
</GlassShatterEffects>
```

### Visual Styling
```tsx
<GlassShatterEffects
  className="custom-shatter"
  style={{
    '--shard-color': '#ff6b6b',
    '--shard-opacity': '0.8',
    '--animation-easing': 'cubic-bezier(0.4, 0, 0.2, 1)'
  }}
>
  <YourContent />
</GlassShatterEffects>
```

### Interactive Controls
```tsx
function InteractiveShatter() {
  const [intensity, setIntensity] = useState(1);
  const [shardCount, setShardCount] = useState(16);

  return (
    <div>
      <div className="controls mb-4">
        <label>
          Intensity: {intensity}
          <input
            type="range"
            min="0.1"
            max="2"
            step="0.1"
            value={intensity}
            onChange={(e) => setIntensity(Number(e.target.value))}
          />
        </label>

        <label>
          Shards: {shardCount}
          <input
            type="range"
            min="5"
            max="50"
            step="5"
            value={shardCount}
            onChange={(e) => setShardCount(Number(e.target.value))}
          />
        </label>
      </div>

      <GlassShatterEffects
        intensity={intensity}
        shardCount={shardCount}
        showControls={true}
      >
        <YourContent />
      </GlassShatterEffects>
    </div>
  );
}
```

## 🎭 Animation Presets

### Dramatic Effect
```tsx
<GlassShatterEffects
  duration={3}
  intensity={1.8}
  shardCount={32}
  autoReform={true}
  reformDelay={5000}
>
  <YourContent />
</GlassShatterEffects>
```

### Subtle Effect
```tsx
<GlassShatterEffects
  duration={1}
  intensity={0.5}
  shardCount={8}
  autoReform={true}
  reformDelay={2000}
>
  <YourContent />
</GlassShatterEffects>
```

### Quick Effect
```tsx
<GlassShatterEffects
  duration={0.8}
  intensity={1.2}
  shardCount={12}
  autoReform={true}
  reformDelay={1500}
>
  <YourContent />
</GlassShatterEffects>
```

## 🔧 Advanced Features

### Event Callbacks
```tsx
function AdvancedShatter() {
  const [isShattered, setIsShattered] = useState(false);
  const [shatterCount, setShatterCount] = useState(0);

  return (
    <GlassShatterEffects
      onShatter={() => {
        setIsShattered(true);
        setShatterCount(prev => prev + 1);
        console.log('Shatter started!');

        // Play sound effect
        playShatterSound();

        // Trigger haptic feedback
        if ('vibrate' in navigator) {
          navigator.vibrate(100);
        }
      }}
      onReform={() => {
        setIsShattered(false);
        console.log('Reform completed!');
      }}
    >
      <div>
        <h3>Shatter Count: {shatterCount}</h3>
        <p>Status: {isShattered ? 'Shattered' : 'Intact'}</p>
        <YourContent />
      </div>
    </GlassShatterEffects>
  );
}
```

### Conditional Rendering
```tsx
function ConditionalShatter({ shouldShatter }) {
  return (
    <GlassShatterEffects
      disabled={!shouldShatter}
      trigger={shouldShatter ? 'click' : 'manual'}
    >
      <YourContent />
    </GlassShatterEffects>
  );
}
```

### Multiple Effects
```tsx
function MultiShatter() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <GlassShatterEffects trigger="click" intensity={0.8}>
        <Card1 />
      </GlassShatterEffects>

      <GlassShatterEffects trigger="hover" intensity={1.2}>
        <Card2 />
      </GlassShatterEffects>

      <GlassShatterEffects trigger="auto" intensity={1.5}>
        <Card3 />
      </GlassShatterEffects>

      <GlassShatterEffects trigger="manual" intensity={0.6}>
        <Card4 />
      </GlassShatterEffects>
    </div>
  );
}
```

## 📱 Performance Optimization

### Device Detection
```tsx
function OptimizedShatter() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
  }, []);

  return (
    <GlassShatterEffects
      shardCount={isMobile ? 8 : 16}
      intensity={isMobile ? 0.8 : 1.2}
      duration={isMobile ? 1.5 : 2}
    >
      <YourContent />
    </GlassShatterEffects>
  );
}
```

### Lazy Loading
```tsx
function LazyShatter() {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref}>
      {isVisible && (
        <GlassShatterEffects>
          <YourContent />
        </GlassShatterEffects>
      )}
    </div>
  );
}
```

## 🎯 Use Cases

### Interactive Cards
```tsx
function InteractiveCards() {
  const cards = [
    { title: 'Project A', description: 'Click to explore' },
    { title: 'Project B', description: 'Hover for preview' },
    { title: 'Project C', description: 'Auto showcase' }
  ];

  return (
    <div className="grid grid-cols-3 gap-6">
      {cards.map((card, index) => (
        <GlassShatterEffects
          key={index}
          trigger={index === 0 ? 'click' : index === 1 ? 'hover' : 'auto'}
          intensity={0.8 + index * 0.2}
        >
          <div className="p-6 bg-white/10 backdrop-blur-lg rounded-xl">
            <h3 className="text-xl font-bold text-white mb-2">{card.title}</h3>
            <p className="text-white/80">{card.description}</p>
          </div>
        </GlassShatterEffects>
      ))}
    </div>
  );
}
```

### Loading States
```tsx
function LoadingShatter({ isLoading }) {
  return (
    <GlassShatterEffects
      trigger="manual"
      autoReform={false}
      disabled={!isLoading}
    >
      <div className="p-8 text-center">
        {isLoading ? (
          <div>
            <div className="animate-spin text-4xl mb-4">⟳</div>
            <p>Loading...</p>
          </div>
        ) : (
          <div>
            <div className="text-4xl mb-4">✓</div>
            <p>Loaded successfully!</p>
          </div>
        )}
      </div>
    </GlassShatterEffects>
  );
}
```

### Error States
```tsx
function ErrorShatter({ hasError, onRetry }) {
  return (
    <GlassShatterEffects
      trigger={hasError ? 'auto' : 'manual'}
      autoReform={!hasError}
      intensity={1.5}
    >
      <div className="p-8 text-center">
        {hasError ? (
          <div>
            <div className="text-4xl text-red-400 mb-4">⚠️</div>
            <h3 className="text-xl font-bold text-white mb-2">Something went wrong</h3>
            <p className="text-white/80 mb-4">The content has been temporarily disabled.</p>
            <button
              onClick={onRetry}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Try Again
            </button>
          </div>
        ) : (
          <YourContent />
        )}
      </div>
    </GlassShatterEffects>
  );
}
```

## 🎨 Styling

### CSS Variables
```css
.glass-shatter-effects {
  --shard-color: rgba(255, 255, 255, 0.8);
  --shard-border: rgba(255, 255, 255, 0.2);
  --animation-duration: 2s;
  --shard-size-min: 0.5;
  --shard-size-max: 1.5;
  --spread-radius: 5;
}
```

### Theme Integration
```tsx
function ThemedShatter({ theme }) {
  const themeStyles = {
    light: {
      background: 'rgba(255, 255, 255, 0.1)',
      border: 'rgba(255, 255, 255, 0.2)'
    },
    dark: {
      background: 'rgba(0, 0, 0, 0.1)',
      border: 'rgba(0, 0, 0, 0.2)'
    },
    colorful: {
      background: 'rgba(255, 20, 147, 0.1)',
      border: 'rgba(255, 20, 147, 0.3)'
    }
  };

  return (
    <GlassShatterEffects
      className={`theme-${theme}`}
      style={themeStyles[theme]}
    >
      <YourContent />
    </GlassShatterEffects>
  );
}
```

## 🔧 Troubleshooting

### Common Issues

**Effect not triggering:**
- Check if `disabled` prop is set to `false`
- Verify the trigger type is appropriate for your use case
- Ensure the component is properly mounted

**Poor performance:**
- Reduce `shardCount` for better performance
- Use shorter `duration` values
- Disable `autoReform` if not needed
- Consider using `trigger="manual"` for control

**Visual glitches:**
- Check WebGL support in the browser
- Ensure proper CSS isolation
- Verify no conflicting CSS transforms

**Event callbacks not firing:**
- Make sure callbacks are stable (use `useCallback`)
- Check component lifecycle
- Verify event propagation isn't blocked

## 📚 Related Components

- **ARGlassEffects**: Combine with AR for 3D shatter effects
- **SeasonalParticles**: Add atmospheric effects to shattered content
- **AuroraPro**: Create aurora effects with shatter animations
- **Motion**: Enhance with smooth transitions

## 🔗 Resources

- [WebGL Shaders](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API)
- [CSS Transforms](https://developer.mozilla.org/en-US/docs/Web/CSS/transform)
- [Animation Performance](https://web.dev/animations-overview/)

---

*Create stunning glass shatter effects with GlassShatterEffects - where physics meets beauty.*

