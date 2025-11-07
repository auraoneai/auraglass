import React, { useRef, useEffect } from 'react';
"use client";

import { cn } from '../../lib/utilsComprehensive';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import useAutoTextContrast from '../../hooks/useAutoTextContrast';
import {
  AURAONE_COMPARISON_EXAMPLES,
  ComparisonContent,
  ComparisonImage,
  FeatureComparison,
  GlassWipeSlider,
  SLIDER_PRESETS,
  type SliderMetric
} from './GlassWipeSlider';

// Example 1: AuraOne vs Scale AI Performance Comparison
export function AuraOneVsScaleAIComparison({ className }: { className?: string }) {
  const prefersReducedMotion = useReducedMotion();
  const [position, setPosition] = useState(50);
  const { labels, metrics } = AURAONE_COMPARISON_EXAMPLES.SCALE_AI;
  const sectionRef = useRef<HTMLDivElement>(null);
  useAutoTextContrast(sectionRef, { observe: true });

  return (
    <div ref={sectionRef} className={cn("glass-w-full glass-auto-gap glass-auto-gap-2xl glass-focus", className)} aria-label="AuraOne vs Scale AI wipe slider comparison" role="region">
      <div className="text-center glass-auto-gap glass-auto-gap-sm">
        <h3 className="text-2xl font-bold text-primary">AuraOne vs Scale AI</h3>
        <p className="text-primary/70">See the dramatic performance improvements</p>
      </div>

      <GlassWipeSlider
        beforeContent={
          <div className="relative w-full h-full glass-gradient-primary glass-gradient-primary glass-gradient-primary flex flex-col items-center justify-center text-center p-8">
            <div className="glass-foundation-complete bg-glass-gradient-subtle backdrop-blur-md-medium glass-radius-xl p-6 glass-container-md">
              <div className="glass-text-secondary text-4xl font-bold mb-2">Scale AI</div>
              <div className="text-primary/80 text-sm glass-auto-gap glass-auto-gap-sm">
                <div>• Complex setup process</div>
                <div>• 2-4 week training cycles</div>
                <div>• High infrastructure costs</div>
                <div>• Limited scalability</div>
              </div>
              <div className="glass-mt-4 text-xs glass-text-secondary">Traditional ML Platform</div>
            </div>
            <div className="absolute glass-bottom-4 glass-left-4 glass-text-secondary/60 text-xs">Legacy Approach</div>
          </div>
        }
        afterContent={
          <div className="relative w-full h-full glass-gradient-primary glass-gradient-primary glass-gradient-primary flex flex-col items-center justify-center text-center p-8">
            <div className="glass-foundation-complete bg-glass-gradient-strong backdrop-blur-md-medium glass-radius-xl p-6 glass-container-md border border-cyan-400/20">
              <div className="glass-text-secondary text-4xl font-bold mb-2">AuraOne</div>
              <div className="text-primary/90 text-sm glass-auto-gap glass-auto-gap-sm">
                <div>• One-click deployment</div>
                <div>• Sub-week training cycles</div>
                <div>• 80% cost reduction</div>
                <div>• Infinite scalability</div>
              </div>
              <div className="glass-mt-4 text-xs glass-text-secondary">Next-Gen AI Platform</div>
            </div>
            <div className="absolute glass-bottom-4 glass-right-4 glass-text-secondary/60 text-xs">Future-Ready</div>
          </div>
        }
        labels={labels}
        metrics={metrics as unknown as SliderMetric[]}
        showMetrics={true}
        initialPosition={75}
        onPositionChange={setPosition}
        onSnapToPreset={(preset) => {
          // Handle preset snap - implement based on your needs
          if (process.env.NODE_ENV === 'development') {
            console.log('Snapped to:', preset);
          }
        }}
        className="h-[500px] shadow-2xl"
        aria-label="Comparison slider"
      />

      <div className="text-center text-primary/60 text-sm">
        Current position: {Math.round(position)}% • Use keyboard navigation or drag the handle
      </div>
    </div>
  );
}

// Example 2: Feature Comparison with Vertical Orientation
export function VerticalFeatureComparison({ className }: { className?: string }) {
  const beforeFeatures = [
    { name: "Manual Configuration", available: true, highlight: false },
    { name: "Basic Analytics", available: true, highlight: false },
    { name: "Limited Templates", available: true, highlight: false },
    { name: "Auto-scaling", available: false, highlight: true },
    { name: "Real-time Monitoring", available: false, highlight: true },
    { name: "Enterprise Security", available: false, highlight: true },
  ];

  const afterFeatures = [
    { name: "One-click Setup", available: true, highlight: false },
    { name: "Advanced Analytics", available: true, highlight: false },
    { name: "1000+ Templates", available: true, highlight: false },
    { name: "Auto-scaling", available: true, highlight: true },
    { name: "Real-time Monitoring", available: true, highlight: true },
    { name: "Enterprise Security", available: true, highlight: true },
  ];

  const sectionRef = useRef<HTMLDivElement>(null);
  useAutoTextContrast(sectionRef, { observe: true });
  return (
    <div ref={sectionRef} className={cn("glass-w-full glass-auto-gap glass-auto-gap-2xl glass-focus", className)} aria-label="Vertical feature comparison slider" role="region">
      <div className="text-center glass-auto-gap glass-auto-gap-sm">
        <h3 className="text-2xl font-bold text-primary">Feature Evolution</h3>
        <p className="text-primary/70">Swipe vertically to compare capabilities</p>
      </div>

      <GlassWipeSlider
        orientation="vertical"
        height="600px"
        beforeContent={
          <FeatureComparison
            beforeFeatures={beforeFeatures}
            afterFeatures={afterFeatures}
            title="Competitor Platform"
          />
        }
        afterContent={
          <FeatureComparison
            beforeFeatures={afterFeatures}
            afterFeatures={beforeFeatures}
            title="AuraOne Platform"
          />
        }
        labels={{
          before: "Standard Platform",
          after: "AuraOne Platform",
          beforeDescription: "Limited capabilities",
          afterDescription: "Full-featured solution"
        }}
        initialPosition={30}
        handleSize="lg"
        trackStyle="bold"
        className="glass-container-2xl mx-auto shadow-2xl"
        aria-label="Vertical comparison slider"
      />
    </div>
  );
}

// Example 3: Performance Metrics Dashboard Comparison
export function PerformanceMetricsComparison({ className }: { className?: string }) {
  const performanceMetrics: SliderMetric[] = [
    {
      label: "Training Speed",
      beforeValue: "12",
      afterValue: "3",
      unit: " hours",
      highlight: true
    },
    {
      label: "Model Accuracy",
      beforeValue: "89.2",
      afterValue: "96.8",
      unit: "%",
      highlight: true
    },
    {
      label: "Resource Usage",
      beforeValue: "85",
      afterValue: "23",
      unit: "%",
      highlight: true
    },
    {
      label: "Cost per Model",
      beforeValue: "$2,400",
      afterValue: "$480",
      unit: "",
      highlight: true
    }
  ];

  const sectionRef = useRef<HTMLDivElement>(null);
  useAutoTextContrast(sectionRef, { observe: true });
  return (
    <div ref={sectionRef} className={cn("glass-w-full glass-auto-gap glass-auto-gap-2xl glass-focus", className)} aria-label="Performance metrics dashboard comparison" role="region">
      <div className="text-center glass-auto-gap glass-auto-gap-sm">
        <h3 className="text-2xl font-bold text-primary">Performance Impact</h3>
        <p className="text-primary/70">Real metrics from enterprise customers</p>
      </div>

      <GlassWipeSlider
        beforeContent={
          <div className="relative w-full h-full glass-gradient-primary glass-gradient-primary via-red-900/50 glass-gradient-primary p-8">
            <div className="h-full flex items-center justify-center">
              <div className="glass-foundation-complete bg-glass-gradient-subtle backdrop-blur-md-medium glass-radius-xl p-8 glass-container-md text-center">
                <h4 className="text-xl font-bold glass-text-secondary glass-mb-6">Legacy Platform</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="glass-auto-gap glass-auto-gap-xs">
                    <div className="text-primary/60">Training Time</div>
                    <div className="text-2xl font-bold glass-text-secondary">12h</div>
                  </div>
                  <div className="glass-auto-gap glass-auto-gap-xs">
                    <div className="text-primary/60">Accuracy</div>
                    <div className="text-2xl font-bold glass-text-secondary">89%</div>
                  </div>
                  <div className="glass-auto-gap glass-auto-gap-xs">
                    <div className="text-primary/60">Resources</div>
                    <div className="text-2xl font-bold glass-text-secondary">85%</div>
                  </div>
                  <div className="glass-auto-gap glass-auto-gap-xs">
                    <div className="text-primary/60">Cost</div>
                    <div className="text-2xl font-bold glass-text-secondary">$2.4K</div>
                  </div>
                </div>
                <div className="glass-mt-6 text-xs glass-text-secondary">High overhead, slow results</div>
              </div>
            </div>
          </div>
        }
        afterContent={
          <div className="relative w-full h-full glass-gradient-primary glass-gradient-primary via-green-900/50 glass-gradient-primary p-8">
            <div className="h-full flex items-center justify-center">
              <div className="glass-foundation-complete bg-glass-gradient-strong backdrop-blur-md-medium glass-radius-xl p-8 max-w-md text-center border border-green/20">
                <h4 className="text-xl font-bold glass-text-secondary mb-6">AuraOne Platform</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="glass-auto-gap glass-auto-gap-xs">
                    <div className="text-primary/60">Training Time</div>
                    <div className="text-2xl font-bold glass-text-secondary">3h</div>
                  </div>
                  <div className="glass-auto-gap glass-auto-gap-xs">
                    <div className="text-primary/60">Accuracy</div>
                    <div className="text-2xl font-bold glass-text-secondary">97%</div>
                  </div>
                  <div className="glass-auto-gap glass-auto-gap-xs">
                    <div className="text-primary/60">Resources</div>
                    <div className="text-2xl font-bold glass-text-secondary">23%</div>
                  </div>
                  <div className="glass-auto-gap glass-auto-gap-xs">
                    <div className="text-primary/60">Cost</div>
                    <div className="text-2xl font-bold glass-text-secondary">$480</div>
                  </div>
                </div>
                <div className="mt-6 text-green-200/60 text-xs">Optimized efficiency, superior results</div>
              </div>
            </div>
          </div>
        }
        labels={{
          before: "Traditional ML",
          after: "AuraOne",
          beforeDescription: "Resource intensive",
          afterDescription: "Optimized performance"
        }}
        metrics={performanceMetrics}
        showMetrics={true}
        initialPosition={20}
        enableMomentum={true}
        momentumMultiplier={0.4}
        height="500px"
        className="shadow-2xl"
      />
    </div>
  );
}

// Example 4: Image Comparison with Custom Styling
export function ImageBeforeAfterComparison({ className }: { className?: string }) {
  return (
    <div className={cn("w-full glass-auto-gap glass-auto-gap-2xl", className)}>
      <div className="text-center glass-auto-gap glass-auto-gap-sm">
        <h3 className="text-2xl font-bold text-primary">Visual Results</h3>
        <p className="text-primary/70">Model training results comparison</p>
      </div>

      <GlassWipeSlider
        beforeContent={
          <ComparisonImage
            src="data:image/svg+xml,%3Csvg width='800' height='400' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23666'%3EImage Content%3C/text%3E%3C/svg%3E"
            alt="Before optimization - noisy results"
            className="opacity-90"
          />
        }
        afterContent={
          <ComparisonImage
            src="data:image/svg+xml,%3Csvg width='800' height='400' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23666'%3EImage Content%3C/text%3E%3C/svg%3E"
            alt="After optimization - clean results"
            loading="eager"
          />
        }
        labels={{
          before: "Raw Output",
          after: "AuraOne Enhanced",
          beforeDescription: "Unprocessed results",
          afterDescription: "AI-optimized output"
        }}
        showProgress={true}
        showLabels={true}
        enableSnapping={true}
        snapThreshold={8}
        handleSize="lg"
        trackStyle="minimal"
        gradientOverlay={true}
        height="400px"
        className="glass-radius-xl shadow-2xl overflow-hidden"
      />
    </div>
  );
}

// Example 5: Interactive Preset Demo
export function PresetPositionDemo({ className }: { className?: string }) {
  const prefersReducedMotion = useReducedMotion();
  const [currentPosition, setCurrentPosition] = useState(50);
  const [activePreset, setActivePreset] = useState<number | null>(null);

  return (
    <div className={cn("w-full glass-auto-gap glass-auto-gap-2xl", className)}>
      <div className="text-center glass-auto-gap glass-auto-gap-sm">
        <h3 className="text-2xl font-bold text-primary">Preset Positions Demo</h3>
        <p className="text-primary/70">Click buttons to jump to preset positions</p>
      </div>

      {/* Preset buttons */}
      <div className="flex flex-wrap justify-center gap-3">
        {Object.entries(SLIDER_PRESETS).map(([key, value]) => (
          <button
            key={key}
            onClick={(e) => {
              setCurrentPosition(value);
              setActivePreset(value);
              setTimeout(() => setActivePreset(null), 600);
            }}
            className={cn(
              "glass-px-4 glass-py-2 glass-radius-lg glass-foundation-complete bg-glass-gradient-subtle backdrop-blur-md-medium border border-white/20",
              "glass-text-primary/80 glass-text-sm font-medium transition-all duration-200",
              "hover:bg-white/10 hover:border-white/30 hover:scale-105",
              currentPosition === value && "bg-blue-500/20 border-blue-400/50 text-blue-300"
            )}
          >
            {key.replace('_', ' ')} ({value}%)
          </button>
        ))}
      </div>

      <GlassWipeSlider
        beforeContent={
          <ComparisonContent background="gradient">
            <div className="text-center glass-auto-gap glass-auto-gap-lg">
              <div className="text-4xl font-bold text-primary">Before</div>
              <div className="text-primary/70">Traditional approach with limitations</div>
              <div className="grid grid-cols-2 gap-4 text-sm max-w-xs">
                <div className="glass-foundation-complete glass-surface-red/10 glass-radius-lg p-3">
                  <div className="glass-text-secondary font-semibold">Slow</div>
                </div>
                <div className="glass-foundation-complete glass-surface-red/10 glass-radius-lg p-3">
                  <div className="glass-text-secondary font-semibold">Expensive</div>
                </div>
                <div className="glass-foundation-complete glass-surface-red/10 glass-radius-lg p-3">
                  <div className="glass-text-secondary font-semibold">Complex</div>
                </div>
                <div className="glass-foundation-complete glass-surface-red/10 glass-radius-lg p-3">
                  <div className="glass-text-secondary font-semibold">Limited</div>
                </div>
              </div>
            </div>
          </ComparisonContent>
        }
        afterContent={
          <ComparisonContent background="gradient">
            <div className="text-center glass-auto-gap glass-auto-gap-lg">
              <div className="text-4xl font-bold text-primary">After</div>
              <div className="text-primary/70">AuraOne platform advantages</div>
              <div className="grid grid-cols-2 gap-4 text-sm max-w-xs">
                <div className="glass-foundation-complete glass-surface-green/10 glass-radius-lg p-3">
                  <div className="glass-text-secondary font-semibold">Fast</div>
                </div>
                <div className="glass-foundation-complete glass-surface-green/10 glass-radius-lg p-3">
                  <div className="glass-text-secondary font-semibold">Affordable</div>
                </div>
                <div className="glass-foundation-complete glass-surface-green/10 glass-radius-lg p-3">
                  <div className="glass-text-secondary font-semibold">Simple</div>
                </div>
                <div className="glass-foundation-complete glass-surface-green/10 glass-radius-lg p-3">
                  <div className="glass-text-secondary font-semibold">Scalable</div>
                </div>
              </div>
            </div>
          </ComparisonContent>
        }
        initialPosition={currentPosition}
        onPositionChange={setCurrentPosition}
        onSnapToPreset={(preset) => {
          if (process.env.NODE_ENV === 'development') {
            console.log('Snapped to preset:', preset);
          }
          setActivePreset(preset);
          setTimeout(() => setActivePreset(null), 600);
        }}
        labels={{
          before: "Competitor",
          after: "AuraOne"
        }}
        enableSnapping={true}
        snapThreshold={10}
        enableMomentum={true}
        height="350px"
        className="shadow-2xl"
      />

      <div className="text-center glass-auto-gap glass-auto-gap-sm">
        <div className="text-primary/80">
          Current Position: <span className="font-mono font-semibold glass-text-secondary">{Math.round(currentPosition)}%</span>
        </div>
        {activePreset !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="chip chip-blue text-sm"
          >
            Jumped to {activePreset}%
          </motion.div>
        )}
      </div>
    </div>
  );
}

// Master example component showcasing all features
export function GlassWipeSliderShowcase({ className }: { className?: string }) {
  return (
    <div className={cn("w-full glass-auto-gap glass-auto-gap-4xl py-8", className)}>
      <div className="text-center glass-auto-gap glass-auto-gap-lg glass-mb-12">
        <h2 className="text-3xl font-bold text-primary">GlassWipe Slider Showcase</h2>
        <p className="text-primary/70 max-w-2xl mx-auto">
          Production-ready comparison sliders with smooth animations, accessibility,
          and competitive analysis features for AuraOne.
        </p>
      </div>

      <AuraOneVsScaleAIComparison />
      <VerticalFeatureComparison />
      <PerformanceMetricsComparison />
      <ImageBeforeAfterComparison />
      <PresetPositionDemo />

      <div className="text-center glass-auto-gap glass-auto-gap-lg pt-8">
        <div className="text-primary/60 text-sm">
          All sliders support keyboard navigation, touch gestures, momentum scrolling, and preset snapping.
        </div>
        <div className="text-primary/50 text-xs">
          Fully accessible with ARIA support and motion-aware animations.
        </div>
      </div>
    </div>
  );
}

// Main GlassWipeSliderExamples component
export interface GlassWipeSliderExamplesProps {
  className?: string;
  children?: React.ReactNode;
}

export function GlassWipeSliderExamples({ className, children }: GlassWipeSliderExamplesProps) {
  return (
    <div className={className}>
      <GlassWipeSliderShowcase />
      {children}
    </div>
  );
}
