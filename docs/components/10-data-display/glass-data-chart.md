### GlassDataChart

Advanced chart component with physics-based interactions, accessibility features, and comprehensive customization options.

```tsx
import { GlassDataChartProps } from 'aura-glass';

const chartData = {
  labels: ['January', 'February', 'March', 'April', 'May'],
  datasets: [{
    label: 'Revenue',
    data: [12000, 19000, 15000, 25000, 22000],
    borderColor: 'rgba(75, 192, 192, 1)',
    backgroundColor: 'rgba(75, 192, 192, 0.2)',
    tension: 0.4
  }]
};

<GlassDataChart
  type="line"
  data={chartData}
  title="Monthly Revenue"
  description="Revenue trends over the past 5 months"
  width="100%"
  height={400}
  glass={true}
  interactive={true}
  accessibility={{
    enabled: true,
    announceOnFocus: true,
    description: 'Line chart showing monthly revenue trends'
  }}
  physics={{
    enabled: true,
    gravity: 0.5,
    friction: 0.8
  }}
  onPointClick={(data) => console.log('Point clicked:', data)}
  onLegendClick={(dataset) => console.log('Legend clicked:', dataset)}
/>
```

**Props:**
- `type: 'bar' | 'line' | 'area' | 'pie' | 'doughnut' | 'radar' | 'polarArea' | 'bubble' | 'scatter'` - Chart type
- `data: ChartData` - Chart.js compatible data object
- `options?: ChartOptions` - Chart.js options object
- `title?: string` - Chart title
- `description?: string` - Chart description
- `width?: string | number` - Chart width
- `height?: string | number` - Chart height
- `glass?: boolean` - Enable glassmorphism effects
- `interactive?: boolean` - Enable chart interactions
- `responsive?: boolean` - Enable responsive behavior
- `maintainAspectRatio?: boolean` - Maintain aspect ratio
- `accessibility?: AccessibilityOptions` - Accessibility configuration
- `physics?: PhysicsOptions` - Physics-based interaction settings
- `animation?: AnimationOptions` - Animation configuration
- `theme?: ThemeOptions` - Custom theme settings
- `plugins?: Plugin[]` - Additional Chart.js plugins
- `onDataUpdate?: (data: ChartData) => void` - Data update callback
- `onPointClick?: (data: PointData) => void` - Point click callback
- `onLegendClick?: (dataset: Dataset) => void` - Legend click callback
- `className?: string` - Additional CSS classes

**ChartData Interface:**
- `labels?: string[]` - Chart labels
- `datasets: Dataset[]` - Chart datasets

**Dataset Interface:**
- `label?: string` - Dataset label
- `data: number[]` - Dataset values
- `borderColor?: string | string[]` - Border color
- `backgroundColor?: string | string[]` - Background color
- `borderWidth?: number` - Border width
- `fill?: boolean | string` - Fill configuration
