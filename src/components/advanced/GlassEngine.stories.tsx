import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import {
    EnvironmentalGlass,
    GlassColorTinting,
    GlassEngineDemo,
    GlassEngineProvider,
    GlassOpacityEngine,
    GlassTextureVariations,
    useGlassEngine
} from './GlassEngine';

const meta: Meta<typeof GlassEngineProvider> = {
  title: 'Advanced/GlassEngine',
  component: GlassEngineProvider,
  parameters: {
    docs: {
      description: {
        component: 'Advanced glass configuration system with environmental adaptation, texture generation, and dynamic glass property management.',
      },
    },
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof GlassEngineProvider>;

const TextureShowcase = () => {
  const { createGlassStyle } = useGlassEngine();
  const [selectedTexture, setSelectedTexture] = useState<string>('smooth');

  const textures = [
    { name: 'smooth', description: 'Clean, minimal texture for text-heavy content' },
    { name: 'frosted', description: 'Subtle frost-like texture for modern interfaces' },
    { name: 'rippled', description: 'Water-like ripple effects for dynamic content' },
    { name: 'crystalline', description: 'Crystal-like facets perfect for image galleries' },
    { name: 'liquid', description: 'Fluid, organic texture for video content' }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-primary mb-4">Glass Texture Variations</h2>
        <p className="text-primary/80">
          Five distinct glass textures for different content types
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {textures.map(texture => (
          <button
            key={texture.name}
            onClick={() => setSelectedTexture(texture.name)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
              selectedTexture === texture.name
                ? 'bg-white/20 text-white shadow-lg'
                : 'bg-white/10 text-white/80 hover:bg-white/15'
            }`}
          >
            {texture.name.charAt(0).toUpperCase() + texture.name.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {textures.map(texture => (
          <div key={texture.name} className="text-center">
            <div
              className={`p-6 rounded-2xl mb-4 transition-all duration-300 ${
                selectedTexture === texture.name ? 'scale-105' : ''
              }`}
              style={createGlassStyle('base', { texture: { type: texture.name as any, intensity: 0.6, animated: false } })}
            >
              <h3 className="text-xl font-semibold text-primary mb-2 capitalize">
                {texture.name}
              </h3>
              <p className="text-primary/70 text-sm">
                {texture.description}
              </p>
            </div>
            <div className="text-primary/60 text-xs">
              {selectedTexture === texture.name ? 'Active' : 'Click to preview'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const EnvironmentalControls = () => {
  const { adaptToEnvironment } = useGlassEngine();
  const [conditions, setConditions] = useState({
    weather: 'sunny' as const,
    temperature: 20,
    timeOfDay: 12,
    season: 'spring' as const
  });

  const handleAdapt = () => {
    adaptToEnvironment({
      weather: conditions.weather,
      temperature: conditions.temperature,
      timeOfDay: conditions.timeOfDay,
      humidity: 60,
      season: conditions.season
    });
  };

  return (
    <div className="glass-surface-subtle/10 backdrop-blur-lg glass-radius-2xl p-6">
      <h3 className="text-xl font-semibold text-primary mb-4">Environmental Controls</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-primary/80 text-sm mb-2">Weather</label>
          <select
            value={conditions.weather}
            onChange={(e) => setConditions(prev => ({ ...prev, weather: e.target.value as any }))}
            className="w-full px-3 py-2 glass-surface-subtle/10 border border-white/20 glass-radius-lg text-primary"
          >
            <option value="sunny">Sunny</option>
            <option value="cloudy">Cloudy</option>
            <option value="rainy">Rainy</option>
            <option value="snowy">Snowy</option>
            <option value="foggy">Foggy</option>
          </select>
        </div>

        <div>
          <label className="block text-primary/80 text-sm mb-2">Temperature (°C)</label>
          <input
            type="range"
            min="-10"
            max="40"
            value={conditions.temperature}
            onChange={(e) => setConditions(prev => ({ ...prev, temperature: parseInt(e.target.value) }))}
            className="w-full"
          />
          <div className="text-primary/60 text-sm mt-1">{conditions.temperature}°C</div>
        </div>

        <div>
          <label className="block text-primary/80 text-sm mb-2">Time of Day</label>
          <input
            type="range"
            min="0"
            max="23"
            value={conditions.timeOfDay}
            onChange={(e) => setConditions(prev => ({ ...prev, timeOfDay: parseInt(e.target.value) }))}
            className="w-full"
          />
          <div className="text-primary/60 text-sm mt-1">{conditions.timeOfDay}:00</div>
        </div>

        <div>
          <label className="block text-primary/80 text-sm mb-2">Season</label>
          <select
            value={conditions.season}
            onChange={(e) => setConditions(prev => ({ ...prev, season: e.target.value as any }))}
            className="w-full px-3 py-2 glass-surface-subtle/10 border border-white/20 glass-radius-lg text-primary"
          >
            <option value="spring">Spring</option>
            <option value="summer">Summer</option>
            <option value="autumn">Autumn</option>
            <option value="winter">Winter</option>
          </select>
        </div>
      </div>

      <button
        onClick={handleAdapt}
        className="mt-6 w-full px-6 py-3 glass-surface-subtle/20 hover:glass-surface-subtle/30 text-primary glass-radius-lg font-medium transition-colors"
      >
        Adapt to Environment
      </button>
    </div>
  );
};

export const InteractiveDemo: Story = {
  args: {},
  render: () => (
    <GlassEngineProvider>
      <div className="glass-min-h-screen glass-gradient-primary glass-gradient-primary via-purple-900 glass-gradient-primary p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-primary mb-4">
              🔧 Glass Engine Interactive Demo
            </h1>
            <p className="text-xl text-primary/80">
              Advanced glass configuration with environmental adaptation
            </p>
          </div>

          <div className="mb-12">
            <GlassEngineDemo />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <EnvironmentalControls />

            <div className="space-y-6">
              <div className="glass-surface-subtle/10 backdrop-blur-lg glass-radius-2xl p-6">
                <h3 className="text-xl font-semibold text-primary mb-4">Engine Features</h3>
                <div className="space-y-3 text-primary/80">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 glass-radius-full glass-surface-green" />
                    <span>Dynamic glass configuration</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 glass-radius-full glass-surface-green" />
                    <span>Environmental adaptation</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 glass-radius-full glass-surface-green" />
                    <span>5 texture variations</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 glass-radius-full glass-surface-green" />
                    <span>Content-aware tinting</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 glass-radius-full glass-surface-green" />
                    <span>Performance optimized</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 glass-radius-full glass-surface-green" />
                    <span>Real-time adjustments</span>
                  </div>
                </div>
              </div>

              <div className="glass-surface-subtle/10 backdrop-blur-lg glass-radius-2xl p-6">
                <h3 className="text-xl font-semibold text-primary mb-4">Usage Examples</h3>
                <div className="space-y-3 text-primary/80 text-sm">
                  <div className="p-3 glass-surface-subtle/5 glass-radius-lg font-mono">
                    {`<AdaptiveGlass variant="hover">Content</AdaptiveGlass>`}
                  </div>
                  <div className="p-3 glass-surface-subtle/5 glass-radius-lg font-mono">
                    {`<GlassOpacityEngine trigger="scroll">Content</GlassOpacityEngine>`}
                  </div>
                  <div className="p-3 glass-surface-subtle/5 glass-radius-lg font-mono">
                    {`<EnvironmentalGlass timeSync={true}>Content</EnvironmentalGlass>`}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GlassEngineProvider>
  ),
};

export const TextureVariations: Story = {
  args: {},
  render: () => (
    <GlassEngineProvider>
      <div className="glass-min-h-screen glass-gradient-primary glass-gradient-primary via-purple-900 glass-gradient-primary p-8">
        <div className="max-w-6xl mx-auto">
          <TextureShowcase />

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass-surface-subtle/10 backdrop-blur-lg glass-radius-2xl p-6">
              <h3 className="text-xl font-semibold text-primary mb-4">Texture Applications</h3>
              <div className="space-y-4">
                <div className="p-4 glass-surface-subtle/5 glass-radius-lg">
                  <h4 className="font-medium text-primary mb-2">Smooth - Text Content</h4>
                  <p className="text-primary/70 text-sm">Perfect for reading interfaces and documentation</p>
                </div>

                <div className="p-4 glass-surface-subtle/5 glass-radius-lg">
                  <h4 className="font-medium text-primary mb-2">Frosted - Modern UI</h4>
                  <p className="text-primary/70 text-sm">Contemporary interfaces with subtle texture</p>
                </div>

                <div className="p-4 glass-surface-subtle/5 glass-radius-lg">
                  <h4 className="font-medium text-primary mb-2">Rippled - Interactive</h4>
                  <p className="text-primary/70 text-sm">Dynamic content with movement and flow</p>
                </div>

                <div className="p-4 glass-surface-subtle/5 glass-radius-lg">
                  <h4 className="font-medium text-primary mb-2">Crystalline - Visual</h4>
                  <p className="text-primary/70 text-sm">Image galleries and visual showcases</p>
                </div>

                <div className="p-4 glass-surface-subtle/5 glass-radius-lg">
                  <h4 className="font-medium text-primary mb-2">Liquid - Media</h4>
                  <p className="text-primary/70 text-sm">Video players and rich media content</p>
                </div>
              </div>
            </div>

            <div className="glass-surface-subtle/10 backdrop-blur-lg glass-radius-2xl p-6">
              <h3 className="text-xl font-semibold text-primary mb-4">Performance Characteristics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 glass-surface-green/10 glass-radius-lg">
                  <span className="text-primary/80">Smooth</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 glass-surface-subtle/20 glass-radius-full">
                      <div className="w-16 h-2 glass-surface-green glass-radius-full" />
                    </div>
                    <span className="text-primary text-sm">Low</span>
                  </div>
                </div>

                <div className="flex justify-between items-center p-3 glass-surface-yellow/10 glass-radius-lg">
                  <span className="text-primary/80">Frosted</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 glass-surface-subtle/20 glass-radius-full">
                      <div className="w-12 h-2 glass-surface-yellow glass-radius-full" />
                    </div>
                    <span className="text-primary text-sm">Medium</span>
                  </div>
                </div>

                <div className="flex justify-between items-center p-3 glass-surface-primary/10 glass-radius-lg">
                  <span className="text-primary/80">Rippled</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 glass-surface-subtle/20 glass-radius-full">
                      <div className="w-14 h-2 glass-surface-primary glass-radius-full" />
                    </div>
                    <span className="text-primary text-sm">Medium</span>
                  </div>
                </div>

                <div className="flex justify-between items-center p-3 glass-surface-red/10 glass-radius-lg">
                  <span className="text-primary/80">Crystalline</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 glass-surface-subtle/20 glass-radius-full">
                      <div className="w-18 h-2 glass-surface-red glass-radius-full" />
                    </div>
                    <span className="text-primary text-sm">High</span>
                  </div>
                </div>

                <div className="flex justify-between items-center p-3 glass-surface-red/10 glass-radius-lg">
                  <span className="text-primary/80">Liquid</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 glass-surface-subtle/20 glass-radius-full">
                      <div className="w-18 h-2 glass-surface-red glass-radius-full" />
                    </div>
                    <span className="text-primary text-sm">High</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GlassEngineProvider>
  ),
};

export const EnvironmentalAdaptation: Story = {
  args: {},
  render: () => (
    <GlassEngineProvider>
      <div className="glass-min-h-screen glass-gradient-primary glass-gradient-primary via-purple-900 glass-gradient-primary p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-primary mb-4">
              🌍 Environmental Glass Adaptation
            </h1>
            <p className="text-xl text-primary/80">
              Glass effects that respond to weather, time, temperature, and seasons
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <EnvironmentalControls />

            <div className="space-y-6">
              <div className="glass-surface-subtle/10 backdrop-blur-lg glass-radius-2xl p-6">
                <h3 className="text-xl font-semibold text-primary mb-4">Weather Adaptations</h3>
                <div className="space-y-3">
                  <div className="p-3 glass-surface-blue/10 glass-radius-lg">
                    <h4 className="font-medium text-primary mb-1">Sunny</h4>
                    <p className="text-primary/70 text-sm">Increased brightness and contrast</p>
                  </div>

                  <div className="p-3 glass-surface-primary/10 glass-radius-lg">
                    <h4 className="font-medium glass-text-secondary mb-1">Cloudy</h4>
                    <p className="text-primary/70 text-sm">Moderate adjustments</p>
                  </div>

                  <div className="p-3 glass-surface-blue/10 glass-radius-lg">
                    <h4 className="font-medium glass-text-secondary mb-1">Rainy</h4>
                    <p className="text-primary/70 text-sm">Ripple texture activation</p>
                  </div>

                  <div className="p-3 glass-surface-subtle/10 glass-radius-lg">
                    <h4 className="font-medium text-primary mb-1">Snowy</h4>
                    <p className="text-primary/70 text-sm">Crystalline texture with brightness</p>
                  </div>

                  <div className="p-3 glass-surface-primary/10 glass-radius-lg">
                    <h4 className="font-medium text-gray-300 mb-1">Foggy</h4>
                    <p className="text-primary/70 text-sm">Reduced opacity and increased blur</p>
                  </div>
                </div>
              </div>

              <div className="glass-surface-subtle/10 backdrop-blur-lg glass-radius-2xl p-6">
                <h3 className="text-xl font-semibold text-primary mb-4">Time-Based Effects</h3>
                <div className="space-y-3">
                  <div className="p-3 glass-surface-primary/10 glass-radius-lg">
                    <h4 className="font-medium text-primary mb-1">Dawn (5-9 AM)</h4>
                    <p className="text-primary/70 text-sm">Warm amber tones</p>
                  </div>

                  <div className="p-3 glass-surface-blue/10 glass-radius-lg">
                    <h4 className="font-medium text-primary mb-1">Day (9-5 PM)</h4>
                    <p className="text-primary/70 text-sm">Bright blue accents</p>
                  </div>

                  <div className="p-3 glass-surface-primary/10 glass-radius-lg">
                    <h4 className="font-medium glass-text-secondary mb-1">Evening (5-8 PM)</h4>
                    <p className="text-primary/70 text-sm">Orange transitions</p>
                  </div>

                  <div className="p-3 bg-indigo-500/10 glass-radius-lg">
                    <h4 className="font-medium text-indigo-400 mb-1">Night (8-5 AM)</h4>
                    <p className="text-primary/70 text-sm">Indigo and purple</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <EnvironmentalGlass weatherAPI={false} timeSync={true}>
              <div className="p-6 text-center">
                <div className="text-4xl mb-3">☀️</div>
                <h3 className="text-xl font-semibold text-primary mb-2">Weather Reactive</h3>
                <p className="text-primary/70 text-sm">
                  Adapts to weather conditions with appropriate textures and effects
                </p>
              </div>
            </EnvironmentalGlass>

            <EnvironmentalGlass weatherAPI={false} timeSync={true}>
              <div className="p-6 text-center">
                <div className="text-4xl mb-3">🕐</div>
                <h3 className="text-xl font-semibold text-primary mb-2">Time Aware</h3>
                <p className="text-primary/70 text-sm">
                  Changes appearance throughout the day for optimal user experience
                </p>
              </div>
            </EnvironmentalGlass>

            <EnvironmentalGlass weatherAPI={false} timeSync={true}>
              <div className="p-6 text-center">
                <div className="text-4xl mb-3">🌡️</div>
                <h3 className="text-xl font-semibold text-primary mb-2">Temperature Sensitive</h3>
                <p className="text-primary/70 text-sm">
                  Adjusts based on temperature with frosted or liquid textures
                </p>
              </div>
            </EnvironmentalGlass>

            <EnvironmentalGlass weatherAPI={false} timeSync={true}>
              <div className="p-6 text-center">
                <div className="text-4xl mb-3">🍂</div>
                <h3 className="text-xl font-semibold text-primary mb-2">Seasonal Themes</h3>
                <p className="text-primary/70 text-sm">
                  Adapts color schemes to match seasonal themes and palettes
                </p>
              </div>
            </EnvironmentalGlass>
          </div>
        </div>
      </div>
    </GlassEngineProvider>
  ),
};

export const ContentAdaptation: Story = {
  args: {},
  render: () => (
    <GlassEngineProvider>
      <div className="glass-min-h-screen glass-gradient-primary glass-gradient-primary via-purple-900 glass-gradient-primary p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-primary mb-4">
              🎨 Content-Aware Glass Adaptation
            </h1>
            <p className="text-xl text-primary/80">
              Glass effects that automatically adapt to different content types
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <GlassTextureVariations contentType="text" autoAdapt={true}>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-primary mb-3">Text Content</h3>
                <p className="text-primary/70 text-sm mb-4">
                  Uses smooth texture for optimal readability and clean appearance
                </p>
                <div className="space-y-2 text-primary/60 text-xs">
                  <div>• Smooth texture</div>
                  <div>• High contrast</div>
                  <div>• Minimal blur</div>
                  <div>• Clean lines</div>
                </div>
              </div>
            </GlassTextureVariations>

            <GlassTextureVariations contentType="image" autoAdapt={true}>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-primary mb-3">Image Gallery</h3>
                <p className="text-primary/70 text-sm mb-4">
                  Crystalline texture enhances visual content with sparkling effects
                </p>
                <div className="space-y-2 text-primary/60 text-xs">
                  <div>• Crystalline texture</div>
                  <div>• Enhanced depth</div>
                  <div>• Visual interest</div>
                  <div>• Premium feel</div>
                </div>
              </div>
            </GlassTextureVariations>

            <GlassTextureVariations contentType="video" autoAdapt={true}>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-primary mb-3">Video Player</h3>
                <p className="text-primary/70 text-sm mb-4">
                  Liquid texture creates dynamic, flowing effects for media content
                </p>
                <div className="space-y-2 text-primary/60 text-xs">
                  <div>• Liquid texture</div>
                  <div>• Animated effects</div>
                  <div>• Dynamic movement</div>
                  <div>• Organic feel</div>
                </div>
              </div>
            </GlassTextureVariations>

            <GlassTextureVariations contentType="code" autoAdapt={true}>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-primary mb-3">Code Editor</h3>
                <p className="text-primary/70 text-sm mb-4">
                  Frosted texture provides subtle visual separation for technical content
                </p>
                <div className="space-y-2 text-primary/60 text-xs">
                  <div>• Frosted texture</div>
                  <div>• Technical appearance</div>
                  <div>• Subtle effects</div>
                  <div>• Professional look</div>
                </div>
              </div>
            </GlassTextureVariations>

            <GlassTextureVariations contentType="data" autoAdapt={true}>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-primary mb-3">Data Visualization</h3>
                <p className="text-primary/70 text-sm mb-4">
                  Rippled texture adds movement and life to data presentations
                </p>
                <div className="space-y-2 text-primary/60 text-xs">
                  <div>• Rippled texture</div>
                  <div>• Dynamic feel</div>
                  <div>• Data flow</div>
                  <div>• Interactive appearance</div>
                </div>
              </div>
            </GlassTextureVariations>

            <GlassColorTinting contentAware={true} intensity={0.3}>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-primary mb-3">Content Tinting</h3>
                <p className="text-primary/70 text-sm mb-4">
                  Automatically extracts and applies colors from content for harmony
                </p>
                <div className="space-y-2 text-primary/60 text-xs">
                  <div>• Color extraction</div>
                  <div>• Adaptive tinting</div>
                  <div>• Content harmony</div>
                  <div>• Dynamic adaptation</div>
                </div>
              </div>
            </GlassColorTinting>
          </div>

          <div className="glass-surface-subtle/10 backdrop-blur-lg glass-radius-2xl p-6">
            <h3 className="text-xl font-semibold text-primary mb-6 text-center">Content Adaptation Benefits</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl mb-3">📖</div>
                <h4 className="font-semibold text-primary mb-2">Better UX</h4>
                <p className="text-primary/70 text-sm">Optimized for content type</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-3">🎯</div>
                <h4 className="font-semibold text-primary mb-2">Context Aware</h4>
                <p className="text-primary/70 text-sm">Adapts to content automatically</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-3">⚡</div>
                <h4 className="font-semibold text-primary mb-2">Performance</h4>
                <p className="text-primary/70 text-sm">Optimized rendering per content</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-3">♿</div>
                <h4 className="font-semibold text-primary mb-2">Accessibility</h4>
                <p className="text-primary/70 text-sm">Enhanced readability and contrast</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GlassEngineProvider>
  ),
};

export const OpacityEngine: Story = {
  args: {},
  render: () => (
    <GlassEngineProvider>
      <div className="glass-min-h-screen glass-gradient-primary glass-gradient-primary via-purple-900 glass-gradient-primary p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-primary mb-4">
              🌊 Glass Opacity Engine
            </h1>
            <p className="text-xl text-primary/80">
              Dynamic opacity management with various triggers and smooth transitions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <GlassOpacityEngine trigger="hover" dynamicOpacity={true}>
              <div className="p-6 text-center">
                <h3 className="text-xl font-semibold text-primary mb-3">Hover Trigger</h3>
                <p className="text-primary/70 text-sm mb-4">
                  Opacity changes on mouse hover for interactive feedback
                </p>
                <div className="text-primary/60 text-xs">
                  Hover over this card to see the effect
                </div>
              </div>
            </GlassOpacityEngine>

            <GlassOpacityEngine trigger="scroll" dynamicOpacity={true}>
              <div className="p-6 text-center">
                <h3 className="text-xl font-semibold text-primary mb-3">Scroll Trigger</h3>
                <p className="text-primary/70 text-sm mb-4">
                  Opacity responds to scroll position for depth and progression
                </p>
                <div className="text-primary/60 text-xs">
                  Scroll to see opacity changes
                </div>
              </div>
            </GlassOpacityEngine>

            <GlassOpacityEngine trigger="time" dynamicOpacity={true}>
              <div className="p-6 text-center">
                <h3 className="text-xl font-semibold text-primary mb-3">Time Trigger</h3>
                <p className="text-primary/70 text-sm mb-4">
                  Opacity cycles based on time for ambient lighting effects
                </p>
                <div className="text-primary/60 text-xs">
                  Changes throughout the day
                </div>
              </div>
            </GlassOpacityEngine>
          </div>

          <div className="glass-surface-subtle/10 backdrop-blur-lg glass-radius-2xl p-6">
            <h3 className="text-xl font-semibold text-primary mb-6 text-center">Opacity Engine Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-medium text-primary mb-3">Trigger Types</h4>
                <div className="space-y-2 text-primary/80">
                  <div>• Hover - Interactive feedback</div>
                  <div>• Scroll - Depth and progression</div>
                  <div>• Time - Ambient lighting</div>
                  <div>• Content - Context awareness</div>
                  <div>• Custom - Programmatic control</div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-primary mb-3">Benefits</h4>
                <div className="space-y-2 text-primary/80">
                  <div>• Smooth transitions</div>
                  <div>• Performance optimized</div>
                  <div>• Accessibility aware</div>
                  <div>• Battery conscious</div>
                  <div>• Customizable ranges</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GlassEngineProvider>
  ),
};
