import { useReducedMotion } from '@/hooks/useReducedMotion';
'use client';

import { motion } from 'framer-motion';
import {
    Droplets,
    Eye,
    Gauge,
    Layers,
    Settings,
    Sparkles,
    Sun,
    Zap
} from 'lucide-react';
import React, { useRef, useState } from 'react';
import { cn } from '../../lib/utilsComprehensive';
import { useGlassEffect, useHoudiniGlass } from './HoudiniGlassProvider';

interface HoudiniGlassCardProps {
  children: React.ReactNode;
  className?: string;
  preset?: 'standard' | 'frosted' | 'minimal' | 'heavy' | 'crystal';
  effects?: string[];
  enableWorklets?: boolean;
  customProperties?: Record<string, string>;
  interactive?: boolean;
  showControls?: boolean;
  title?: string;
  description?: string;
}

export function HoudiniGlassCard({
  children,
  className='',
  preset = 'standard',
  effects = ['frost'],
  enableWorklets = true,
  customProperties = {},
  interactive = true,
  showControls = false,
  title,
  description
}: HoudiniGlassCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);
  const { isSupported, enabledEffects, toggleEffect, performanceMode } = useHoudiniGlass();
  const [isHovered, setIsHovered] = useState(false);
  const [showEffectControls, setShowEffectControls] = useState(false);

  // Apply glass effects using the Houdini hook
  const { appliedEffects, canUseWorklets } = useGlassEffect(cardRef, effects, {
    preset,
    customProperties,
    enableWorklets: enableWorklets
  });

  const handleMouseEnter = () => {
    if (interactive) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setIsHovered(false);
    }
  };

  const getEffectIcon = (effect: string) => {
    switch (effect) {
      case 'frost': return <Sparkles className="w-4 h-4" />;
      case 'caustics': return <Sun className="w-4 h-4" />;
      case 'border': return <Layers className="w-4 h-4" />;
      case 'refraction': return <Droplets className="w-4 h-4" />;
      default: return <Zap className="w-4 h-4" />;
    }
  };

  const getPerformanceIndicator = () => {
    const prefersReducedMotion = useReducedMotion();
    if (performanceMode) {
      return (
        <span title="Performance mode active">
          <Gauge className="w-4 h-4 text-primary" />
        </span>
      );
    }
    return (
      <span title="Full effects active">
        <Zap className="w-4 h-4 text-primary" />
      </span>
    );
  };

  return (
    <motion.div
      ref={cardRef}
      className={cn(
        // Base glass foundation with design tokens
        'glass-foundation-complete glass-radius-xl glass-p-lg',
        'relative overflow-hidden',
        // Houdini-specific classes
        'houdini-glass',
        {
          'houdini-glass-fallback': !isSupported,
          'houdini-glass-performance': performanceMode,
          'cursor-pointer glass-press glass-magnet': interactive,
        },
        // Glass effects
        'glass-overlay-specular glass-parallax',
        'glass-transition glass-focus',
        className
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      whileHover={interactive ? { scale: 1.02 } : {}}
      whileTap={interactive ? { scale: 0.98 } : {}}
      transition={prefersReducedMotion ? { duration: 0 } : {
    duration: performanceMode ? 0.15 : 0.3,
    ease: "easeOut"
      }}
    >
      {/* Header */}
      {(title || description || showControls) && (
        <div className="mb-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {title && (
                <h3 className="text-lg font-semibold glass-text-secondary dark:text-primary mb-1">
                  {title}
                </h3>
              )}
              {description && (
                <p className="text-sm glass-text-secondary dark:text-gray-300">
                  {description}
                </p>
              )}
            </div>

            {/* Controls */}
            {showControls && (
              <div className="flex items-center gap-2 ml-4">
                {/* Performance indicator */}
                {getPerformanceIndicator()}

                {/* Effect controls toggle */}
                <button
                  onClick={() => setShowEffectControls(!showEffectControls)}
                  className="p-2 glass-radius-lg hover:glass-surface-subtle/10 transition-colors"
                  title="Toggle effect controls"
                >
                  <Settings className="w-4 h-4 glass-text-secondary dark:glass-text-secondary" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Effect Controls Panel */}
      {showEffectControls && showControls && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-4 p-3 glass-radius-lg glass-surface-dark/5 dark:glass-surface-subtle/5"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium glass-text-secondary dark:text-gray-300">
              Glass Effects
            </span>
            <span className="text-xs glass-text-secondary dark:glass-text-secondary">
              {appliedEffects.length} active
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {['frost', 'caustics', 'border', 'refraction'].map((effect: any) => (
              <button
                key={effect}
                onClick={() => toggleEffect(effect)}
                className={`
                  flex items-center gap-2 p-2 rounded-lg text-sm transition-all
                  ${enabledEffects.includes(effect)
                    ? 'bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-500/30'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }
                `}
                title={`${enabledEffects.includes(effect) ? 'Disable' : 'Enable'} ${effect} effect`}
              >
                {getEffectIcon(effect)}
                <span className="capitalize">{effect}</span>
                {enabledEffects.includes(effect) && (
                  <Eye className="w-3 h-3 ml-auto" />
                )}
              </button>
            ))}
          </div>

          {/* Worklet status */}
          <div className="mt-2 text-xs glass-text-secondary dark:glass-text-secondary">
            Worklets: {canUseWorklets ? '✅ Supported' : '❌ Fallback'}
          </div>
        </motion.div>
      )}

      {/* Main Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Hover effect overlay */}
      {interactive && (
        <motion.div
          className="absolute inset-0 glass-gradient-primary glass-gradient-primary glass-gradient-primary pointer-events-none"
          initial={{ opacity: 0 }}
          animate={prefersReducedMotion ? {} : { opacity: isHovered ? 1 : 0 }}
          transition={prefersReducedMotion ? { duration: 0 } : { duration: performanceMode ? 0.1 : 0.2  }}
        />
      )}

      {/* Status indicators */}
      {showControls && (
        <div className="absolute glass-top-2 right-2 flex gap-1">
          {appliedEffects.map((effect: any) => (
            <div
              key={effect}
              className="w-2 h-2 glass-radius-full glass-surface-blue opacity-60"
              title={`Active: ${effect}`}
            />
          ))}
        </div>
      )}

      {/* Browser support indicator */}
      {!isSupported && (
        <div className="absolute bottom-2 right-2">
          <div
            className="w-2 h-2 glass-radius-full bg-amber-400"
            title="Houdini not supported - using fallback styles"
          />
        </div>
      )}
    </motion.div>
  );
}

// Demo component showcasing different Houdini glass effects
export function HoudiniGlassShowcase() {
  const [selectedPreset, setSelectedPreset] = useState<'standard' | 'frosted' | 'minimal' | 'heavy' | 'crystal'>('standard');
  const [selectedEffects, setSelectedEffects] = useState<string[]>(['frost']);
  const { isSupported, hasPaintAPI, hasPropertyAPI } = useHoudiniGlass();

  const presets = [
    { id: 'standard', name: 'Standard', description: 'Balanced glass effect' },
    { id: 'frosted', name: 'Frosted', description: 'Enhanced blur and opacity' },
    { id: 'minimal', name: 'Minimal', description: 'Subtle glass appearance' },
    { id: 'heavy', name: 'Heavy', description: 'Maximum glass intensity' },
    { id: 'crystal', name: 'Crystal', description: 'Ultra-clear glass effect' }
  ] as const;

  const availableEffects = [
    { id: 'frost', name: 'Frost', description: 'Icy glass texture' },
    { id: 'caustics', name: 'Caustics', description: 'Light refraction patterns' },
    { id: 'border', name: 'Border', description: 'Animated border effects' },
    { id: 'refraction', name: 'Refraction', description: 'Light bending effects' }
  ];

  const toggleEffect = (effectId: string) => {
    setSelectedEffects((prev: any) =>
      prev.includes(effectId)
        ? prev.filter((id: any) => id !== effectId)
        : [...prev, effectId]
    );
  };

  return (
    <div className="space-y-6">
      {/* Browser Support Status */}
      <HoudiniGlassCard
        title="Houdini Glass Support"
        description="Check browser compatibility for CSS Houdini features"
        showControls={true}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-3 glass-radius-lg glass-surface-subtle dark:glass-surface-primary">
            <div className={`text-2xl mb-2 ${isSupported ? 'text-green-500' : 'text-red-500'}`}>
              {isSupported ? '✅' : '❌'}
            </div>
            <div className="font-medium">Overall Support</div>
            <div className="text-sm glass-text-secondary dark:glass-text-secondary">
              Houdini APIs available
            </div>
          </div>

          <div className="text-center p-3 glass-radius-lg glass-surface-subtle dark:glass-surface-primary">
            <div className={`text-2xl mb-2 ${hasPropertyAPI ? 'text-green-500' : 'text-red-500'}`}>
              {hasPropertyAPI ? '✅' : '❌'}
            </div>
            <div className="font-medium">Properties API</div>
            <div className="text-sm glass-text-secondary dark:glass-text-secondary">
              Custom properties support
            </div>
          </div>

          <div className="text-center p-3 glass-radius-lg glass-surface-subtle dark:glass-surface-primary">
            <div className={`text-2xl mb-2 ${hasPaintAPI ? 'text-green-500' : 'text-red-500'}`}>
              {hasPaintAPI ? '✅' : '❌'}
            </div>
            <div className="font-medium">Paint API</div>
            <div className="text-sm glass-text-secondary dark:glass-text-secondary">
              Paint worklets support
            </div>
          </div>
        </div>
      </HoudiniGlassCard>

      {/* Preset Selection */}
      <HoudiniGlassCard
        title="Glass Presets"
        description="Choose from predefined glass effect configurations"
        showControls={true}
      >
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {presets.map((preset: any) => (
            <button
              key={preset.id}
              onClick={() => setSelectedPreset(preset.id)}
              className={`
                p-3 rounded-lg text-left transition-all
                ${selectedPreset === preset.id
                  ? 'bg-blue-500/20 border-2 border-blue-500/50 text-blue-700 dark:text-blue-300'
                  : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border-2 border-transparent'
                }
              `}
            >
              <div className="font-medium text-sm">{preset.name}</div>
              <div className="text-xs glass-text-secondary dark:glass-text-secondary mt-1">
                {preset.description}
              </div>
            </button>
          ))}
        </div>
      </HoudiniGlassCard>

      {/* Effect Selection */}
      <HoudiniGlassCard
        title="Glass Effects"
        description="Enable/disable individual glass effect layers"
        showControls={true}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {availableEffects.map((effect: any) => (
            <button
              key={effect.id}
              onClick={() => toggleEffect(effect.id)}
              className={`
                p-3 rounded-lg text-left transition-all
                ${selectedEffects.includes(effect.id)
                  ? 'bg-green-500/20 border-2 border-green-500/50 text-green-700 dark:text-green-300'
                  : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border-2 border-transparent'
                }
              `}
            >
              <div className="font-medium text-sm flex items-center gap-2">
                {getEffectIcon(effect.id)}
                {effect.name}
              </div>
              <div className="text-xs glass-text-secondary dark:glass-text-secondary mt-1">
                {effect.description}
              </div>
            </button>
          ))}
        </div>
      </HoudiniGlassCard>

      {/* Live Preview */}
      <HoudiniGlassCard
        title="Live Preview"
        description={`Preset: ${selectedPreset} | Effects: ${selectedEffects.join(', ')}`}
        preset={selectedPreset}
        effects={selectedEffects}
        showControls={true}
        interactive={true}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 glass-radius-lg glass-gradient-primary glass-gradient-primary glass-gradient-primary dark:glass-gradient-primary dark:glass-gradient-primary">
              <h4 className="font-medium glass-text-secondary dark:text-primary mb-2">Content Area 1</h4>
              <p className="text-sm glass-text-secondary dark:text-gray-300">
                This is a preview of how the selected glass effects appear with your content.
                The effects are applied using CSS Houdini for maximum performance.
              </p>
            </div>

            <div className="p-4 glass-radius-lg glass-gradient-primary glass-gradient-primary glass-gradient-primary dark:glass-gradient-primary dark:glass-gradient-primary">
              <h4 className="font-medium glass-text-secondary dark:text-primary mb-2">Content Area 2</h4>
              <p className="text-sm glass-text-secondary dark:text-gray-300">
                Experiment with different presets and effects to find the perfect glass
                aesthetic for your application.
              </p>
            </div>
          </div>

          <div className="p-4 glass-radius-lg glass-gradient-primary glass-gradient-primary glass-gradient-primary dark:glass-gradient-primary dark:glass-gradient-primary">
            <h4 className="font-medium glass-text-secondary dark:text-primary mb-2">Interactive Element</h4>
            <p className="text-sm glass-text-secondary dark:text-gray-300 mb-3">
              Hover over this card to see the interactive effects in action.
            </p>
            <button className="px-4 py-2 glass-surface-blue text-primary glass-radius-lg hover:glass-surface-blue transition-colors">
              Interactive Button
            </button>
          </div>
        </div>
      </HoudiniGlassCard>
    </div>
  );
}

// Helper function for effect icons (used in showcase)
function getEffectIcon(effect: string) {
  switch (effect) {
    case 'frost': return <Sparkles className="w-4 h-4" />;
    case 'caustics': return <Sun className="w-4 h-4" />;
    case 'border': return <Layers className="w-4 h-4" />;
    case 'refraction': return <Droplets className="w-4 h-4" />;
    default: return <Zap className="w-4 h-4" />;
  }
}

export default HoudiniGlassCard;
