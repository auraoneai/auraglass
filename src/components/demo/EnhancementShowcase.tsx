'use client';
import { useReducedMotion } from "@/hooks/useReducedMotion";
/**
 * Enhancement Showcase
 * Comprehensive demo showcasing all advanced AuraGlass features:
 * - Physics-based glass interactions
 * - Environmental glass morphing
 * - Immersive 3D depth effects
 * - Organic natural animations
 * - Emotional intelligence adaptation
 * - Spatial computing foundations
 * - AI-powered personalization
 */

import React, { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/utils";

// Import all enhanced components and systems
import {
  EnhancedGlassButton,
  PhysicsGlassButton,
  ImmersiveGlassButton,
  VRGlassButton,
  SmartAdaptiveButton,
  UltraEnhancedButton,
} from "../button/EnhancedGlassButton";

import GlassPhysicsEngine from "../effects/GlassPhysicsEngine";
import GlassMorphingEngine from "../effects/GlassMorphingEngine";
import Glass3DEngine from "../effects/Glass3DEngine";
import OrganicAnimationEngine from "../animations/OrganicAnimationEngine";
import SpatialComputingEngine from "../spatial/SpatialComputingEngine";

// Import intelligence systems
import { useEmotionalIntelligence } from "../../utils/emotionalIntelligence";
import { useAIPersonalization } from "../../utils/aiPersonalization";

interface ShowcaseSection {
  id: string;
  title: string;
  description: string;
  component: React.ReactNode;
  features: string[];
  demoActions?: () => void;
}

export const EnhancementShowcase: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();
  const [activeSection, setActiveSection] = useState<string>("overview");
  const [demoState, setDemoState] = useState({
    interactionCount: 0,
    emotionDetected: null as any,
    predictions: [] as any[],
    adaptations: {} as any,
  });
  const [isFullDemo, setIsFullDemo] = useState(false);

  // Intelligence systems
  const { currentEmotion, uiAdaptation } = useEmotionalIntelligence();
  const { profile, recommendations } = useAIPersonalization("showcase-user");

  // Handle advanced interactions from components
  const handleAdvancedInteraction = useCallback((type: string, data: any) => {
    console.log("Advanced Interaction:", type, data);

    setDemoState((prev: any) => ({
      ...prev,
      interactionCount: prev.interactionCount + 1,
      emotionDetected:
        type === "emotion-detected" ? data : prev.emotionDetected,
      predictions:
        type === "behavior-predicted"
          ? [data, ...prev.predictions.slice(0, 4)]
          : prev.predictions,
      adaptations:
        type === "enhanced-click" ? data.adaptations : prev.adaptations,
    }));
  }, []);

  // Showcase sections
  const showcaseSections: ShowcaseSection[] = [
    {
      id: "overview",
      title: "AuraGlass Enhancement Overview",
      description:
        "Next-generation glassmorphism with consciousness interface technology",
      features: [
        "Physics-Based Glass Interactions",
        "Environmental Adaptation",
        "Immersive 3D Effects",
        "Organic Motion Patterns",
        "Emotional Intelligence",
        "Spatial Computing Support",
        "AI Personalization",
      ],
      component: (
        <div className="glass-grid glass-grid-cols-2 md:grid-cols-3 glass-gap-6 glass-p-8">
          <PhysicsGlassButton onAdvancedInteraction={handleAdvancedInteraction}>
            Physics Glass
          </PhysicsGlassButton>
          <ImmersiveGlassButton
            onAdvancedInteraction={handleAdvancedInteraction}
          >
            Immersive 3D
          </ImmersiveGlassButton>
          <SmartAdaptiveButton
            onAdvancedInteraction={handleAdvancedInteraction}
          >
            Smart Adaptive
          </SmartAdaptiveButton>
          <VRGlassButton onAdvancedInteraction={handleAdvancedInteraction}>
            VR Optimized
          </VRGlassButton>
          <UltraEnhancedButton
            className="col-span-2"
            onAdvancedInteraction={handleAdvancedInteraction}
          >
            Ultra Enhanced (All Features)
          </UltraEnhancedButton>
        </div>
      ),
    },
    {
      id: "physics",
      title: "Physics-Based Glass Effects",
      description:
        "Realistic glass interactions with particle systems and physics simulation",
      features: [
        "Ripple Effects",
        "Glass Shattering",
        "Bending & Warping",
        "Melting Transitions",
        "Freezing Effects",
        "Vibration Feedback",
      ],
      component: (
        <div className="glass-grid glass-grid-cols-2 md:grid-cols-3 glass-gap-4 glass-p-6">
          {["ripple", "shatter", "bend", "melt", "freeze", "vibrate"].map(
            (effect: any) => (
              <GlassPhysicsEngine
                key={effect}
                interaction={effect as any}
                intensity={1.2}
                className="glass-p-4 glass-surface-subtle/10 glass-glass-glass-backdrop-blur-sm glass-radius-lg glass-border glass-border-white/20 glass-contrast-guard"
              >
                <button className="glass-w-full h-16 text-primary font-medium capitalize glass-focus glass-touch-target glass-contrast-guard">
                  {effect} Effect
                </button>
              </GlassPhysicsEngine>
            )
          )}
        </div>
      ),
    },
    {
      id: "morphing",
      title: "Environmental Glass Morphing",
      description:
        "Glass effects that adapt to time, weather, user activity, and content type",
      features: [
        "Time-of-Day Adaptation",
        "Weather Response",
        "Seasonal Variations",
        "User Activity Awareness",
        "Content Type Optimization",
        "Real-Time Environmental Data",
      ],
      component: (
        <div className="space-y-6 glass-p-6">
          <div className="glass-grid glass-grid-cols-2 md:grid-cols-4 glass-gap-4">
            {[
              { context: { timeOfDay: "dawn" }, label: "Dawn Glass" },
              { context: { timeOfDay: "morning" }, label: "Morning Glass" },
              { context: { timeOfDay: "evening" }, label: "Evening Glass" },
              { context: { timeOfDay: "night" }, label: "Night Glass" },
            ].map(({ context, label }) => (
              <GlassMorphingEngine
                key={label}
                environmentalContext={context as any}
                className="glass-p-4 h-20 glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-lg"
              >
                <div className="text-primary glass-text-sm font-medium text-center">
                  {label}
                </div>
              </GlassMorphingEngine>
            ))}
          </div>

          <div className="glass-grid glass-grid-cols-1 md:grid-cols-3 glass-gap-4">
            {[
              { activity: "focused", content: "text" },
              { activity: "browsing", content: "media" },
              { activity: "creating", content: "interactive" },
            ].map(({ activity, content }) => (
              <GlassMorphingEngine
                key={`${activity}-${content}`}
                userActivity={activity as any}
                contentType={content as any}
                className="glass-p-6 h-24 glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-lg glass-border glass-border-white/30"
              >
                <div className="text-primary text-center">
                  <div className="font-medium capitalize">{activity}</div>
                  <div className="glass-text-sm opacity-70 capitalize">
                    {content} Content
                  </div>
                </div>
              </GlassMorphingEngine>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "spatial3d",
      title: "Immersive 3D Glass Effects",
      description:
        "Layered depth perception with parallax, holographic overlays, and interactive distortions",
      features: [
        "Multi-Layer Depth System",
        "Parallax Scrolling Effects",
        "Depth of Field Simulation",
        "Holographic Overlays",
        "Interactive Distortion Mesh",
        "Real-Time 3D Transformations",
      ],
      component: (
        <div className="space-y-6 glass-p-6">
          <Glass3DEngine
            enableParallax={true}
            enableDepthOfField={true}
            enableHolographic={true}
            enableDistortion={true}
            maxDepthLayers={6}
            className="h-64 glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-xl"
          >
            <div className="glass-flex glass-items-center glass-justify-center glass-h-full">
              <div className="text-primary text-center">
                <h3 className="glass-text-2xl font-bold mb-2">
                  3D Glass Portal
                </h3>
                <p className="text-primary/70">
                  Move your mouse for 3D interaction
                </p>
                <div className="glass-mt-4 glass-gap-4">
                  <button className="glass-px-4 glass-py-2 glass-surface-subtle/20 glass-radius-lg hover:glass-surface-subtle/30 transition-colors glass-focus glass-touch-target glass-contrast-guard">
                    Interact
                  </button>
                  <button className="glass-px-4 glass-py-2 glass-surface-subtle/20 glass-radius-lg hover:glass-surface-subtle/30 transition-colors glass-focus glass-touch-target glass-contrast-guard">
                    Experience
                  </button>
                </div>
              </div>
            </div>
          </Glass3DEngine>

          <div className="glass-grid glass-grid-cols-3 glass-gap-4">
            {Array.from({ length: 3 }, (_, i) => (
              <Glass3DEngine
                key={i}
                layers={[{ depth: i, parallaxFactor: i * 0.2 }]}
                className="h-32 glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-lg"
              >
                <div className="glass-flex glass-items-center glass-justify-center glass-h-full text-primary">
                  Layer {i + 1}
                </div>
              </Glass3DEngine>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "organic",
      title: "Organic Animation Engine",
      description:
        "Natural motion patterns with emotional context and physics-based behavior",
      features: [
        "Breathe & Pulse Patterns",
        "Wave & Flutter Motions",
        "Bloom & Crystallize Effects",
        "Emotional Context Awareness",
        "Physics-Based Springs",
        "Micro-Interaction Responses",
      ],
      component: (
        <div className="space-y-6 glass-p-6">
          <div className="glass-grid glass-grid-cols-2 md:grid-cols-4 glass-gap-4">
            {[
              { pattern: "gentle", emotion: "calm" },
              { pattern: "energetic", emotion: "excited" },
              { pattern: "interactive", emotion: "focused" },
              { pattern: "contemplative", emotion: "peaceful" },
            ].map(({ pattern, emotion }) => (
              <OrganicAnimationEngine
                key={pattern}
                sequences={(window as any).COMMON_SEQUENCES?.[pattern] || []}
                emotionalContext={emotion as any}
                className="h-24 glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-lg glass-flex glass-items-center glass-justify-center"
              >
                <div className="text-primary text-center">
                  <div className="font-medium capitalize">{pattern}</div>
                  <div className="glass-text-sm opacity-70">{emotion}</div>
                </div>
              </OrganicAnimationEngine>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "intelligence",
      title: "Emotional Intelligence & AI Personalization",
      description:
        "Adaptive UI that learns from user behavior and emotional state",
      features: [
        "Emotion Recognition",
        "Biometric Adaptation",
        "Behavior Pattern Learning",
        "Personalized Preferences",
        "Predictive Interactions",
        "Smart Recommendations",
      ],
      component: (
        <div className="space-y-6 glass-p-6">
          {/* Current Status */}
          <div className="glass-grid glass-grid-cols-1 md:grid-cols-2 glass-gap-6">
            <div className="glass-p-4 glass-surface-subtle/10 glass-radius-lg">
              <h4 className="text-primary font-medium mb-3">Emotional State</h4>
              {currentEmotion ? (
                <div className="glass-gap-2">
                  <div className="glass-flex glass-justify-between">
                    <span className="text-primary/70">Primary:</span>
                    <span className="text-primary capitalize">
                      {currentEmotion.primary}
                    </span>
                  </div>
                  <div className="glass-flex glass-justify-between">
                    <span className="text-primary/70">Intensity:</span>
                    <span className="text-primary">
                      {(currentEmotion.intensity * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="glass-flex glass-justify-between">
                    <span className="text-primary/70">Confidence:</span>
                    <span className="text-primary">
                      {(currentEmotion.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-primary/70">Analyzing emotions...</p>
              )}
            </div>

            <div className="glass-p-4 glass-surface-subtle/10 glass-radius-lg">
              <h4 className="text-primary font-medium mb-3">AI Profile</h4>
              {profile ? (
                <div className="glass-gap-2">
                  <div className="glass-flex glass-justify-between">
                    <span className="text-primary/70">Confidence:</span>
                    <span className="text-primary">
                      {(profile.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="glass-flex glass-justify-between">
                    <span className="text-primary/70">Interactions:</span>
                    <span className="text-primary">
                      {demoState.interactionCount}
                    </span>
                  </div>
                  <div className="glass-flex glass-justify-between">
                    <span className="text-primary/70">Theme:</span>
                    <span className="text-primary capitalize">
                      {profile.uiPreferences.colorScheme}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-primary/70">Building profile...</p>
              )}
            </div>
          </div>

          {/* Interactive Demo */}
          <div className="glass-grid glass-grid-cols-2 md:grid-cols-4 glass-gap-4">
            {Array.from({ length: 4 }, (_, i) => (
              <SmartAdaptiveButton
                key={i}
                onAdvancedInteraction={handleAdvancedInteraction}
                className="h-16"
              >
                Smart Button {i + 1}
              </SmartAdaptiveButton>
            ))}
          </div>

          {/* Recent Predictions */}
          {demoState.predictions.length > 0 && (
            <div className="glass-p-4 glass-surface-subtle/10 glass-radius-lg">
              <h4 className="text-primary font-medium mb-3">
                Behavioral Predictions
              </h4>
              <div className="glass-gap-2">
                {demoState.predictions.slice(0, 3).map((prediction, i) => (
                  <div
                    key={i}
                    className="glass-flex glass-justify-between glass-text-sm"
                  >
                    <span className="text-primary/70">{prediction.action}</span>
                    <span className="text-primary">
                      {(prediction.probability * 100).toFixed(0)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ),
    },
    {
      id: "spatial",
      title: "Spatial Computing Foundations",
      description:
        "AR/VR ready components with gesture recognition and spatial anchoring",
      features: [
        "WebXR Integration",
        "Gesture Recognition",
        "Spatial Anchoring",
        "Hand Tracking Support",
        "Mixed Reality Optimization",
        "Cross-Platform Compatibility",
      ],
      component: (
        <div className="space-y-6 glass-p-6">
          <SpatialComputingEngine
            enableGestures={true}
            enableAnchoring={true}
            gestureTypes={["tap", "pinch", "grab", "swipe"]}
            className="h-48 glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-xl"
            onGesture={(gesture) => console.log("Gesture detected:", gesture)}
          >
            <div className="glass-flex glass-items-center glass-justify-center glass-h-full">
              <div className="text-primary text-center">
                <h3 className="glass-text-xl font-bold mb-2">
                  Spatial Interface
                </h3>
                <p className="text-primary/70 mb-4">
                  Touch, pinch, or gesture to interact
                </p>
                <div className="glass-gap-4">
                  <button className="glass-px-4 glass-py-2 glass-surface-subtle/20 glass-radius-lg hover:glass-surface-subtle/30 transition-colors glass-focus glass-touch-target glass-contrast-guard">
                    Tap Gesture
                  </button>
                  <button className="glass-px-4 glass-py-2 glass-surface-subtle/20 glass-radius-lg hover:glass-surface-subtle/30 transition-colors glass-focus glass-touch-target glass-contrast-guard">
                    Pinch Gesture
                  </button>
                </div>
              </div>
            </div>
          </SpatialComputingEngine>

          <div className="text-center text-primary/70 glass-text-sm">
            * Spatial computing features require compatible hardware for full
            functionality
          </div>
        </div>
      ),
    },
    {
      id: "integration",
      title: "Complete System Integration",
      description:
        "All enhancement systems working together in perfect harmony",
      features: [
        "Unified Consciousness Interface",
        "Cross-System Optimization",
        "Seamless User Experience",
        "Adaptive Performance Scaling",
        "Real-Time Intelligence",
        "Future-Ready Architecture",
      ],
      component: (
        <div className="space-y-8 glass-p-6">
          {/* Ultimate Demo Component */}
          <Glass3DEngine
            enableParallax={true}
            enableDepthOfField={true}
            enableHolographic={true}
            maxDepthLayers={8}
            className="relative h-80 glass-gradient-primary glass-gradient-primary via-purple/30 glass-gradient-primary glass-radius-2xl overflow-hidden"
          >
            <GlassMorphingEngine
              enableRealTimeAdaptation={true}
              userActivity="focused"
              contentType="interactive"
              intensity={1.5}
            >
              <GlassPhysicsEngine
                interaction="ripple"
                intensity={1.3}
                enabled={true}
              >
                <OrganicAnimationEngine
                  sequences={(window as any).COMMON_SEQUENCES?.gentle || []}
                  emotionalContext={(currentEmotion?.primary as any) || "calm"}
                  enableMicroInteractions={true}
                >
                  <div className="glass-flex glass-items-center glass-justify-center glass-h-full">
                    <div className="text-primary text-center space-y-6">
                      <h2 className="glass-text-3xl font-bold">
                        Ultimate Glass Experience
                      </h2>
                      <p className="text-primary/80 max-w-md glass-mx-auto">
                        Every enhancement system active: Physics, Morphing, 3D,
                        Organic Motion, Emotional Intelligence, and AI
                        Personalization working in perfect harmony.
                      </p>

                      <div className="glass-grid glass-grid-cols-2 glass-gap-4 mt-8">
                        <UltraEnhancedButton
                          onAdvancedInteraction={handleAdvancedInteraction}
                          className="glass-surface-subtle/20 hover:glass-surface-subtle/30"
                        >
                          Experience Magic
                        </UltraEnhancedButton>
                        <UltraEnhancedButton
                          onAdvancedInteraction={handleAdvancedInteraction}
                          className="glass-surface-subtle/20 hover:glass-surface-subtle/30"
                        >
                          Feel the Future
                        </UltraEnhancedButton>
                      </div>
                    </div>
                  </div>
                </OrganicAnimationEngine>
              </GlassPhysicsEngine>
            </GlassMorphingEngine>
          </Glass3DEngine>

          {/* System Status */}
          <div className="glass-grid glass-grid-cols-2 md:grid-cols-4 glass-gap-4">
            {[
              { name: "Physics Engine", status: "Active", color: "green" },
              { name: "Morphing System", status: "Adapting", color: "blue" },
              { name: "3D Renderer", status: "Rendering", color: "purple" },
              { name: "AI Intelligence", status: "Learning", color: "orange" },
            ].map(({ name, status, color }) => (
              <div
                key={name}
                className="glass-p-3 glass-surface-subtle/10 glass-radius-lg"
              >
                <div className="glass-flex glass-items-center glass-justify-between">
                  <span className="text-primary glass-text-sm font-medium">
                    {name}
                  </span>
                  <div
                    className={`w-2 h-2 glass-radius-full bg-${color}-400 animate-pulse`}
                  />
                </div>
                <div className="text-primary/70 glass-text-xs glass-mt-1">
                  {status}
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="glass-min-h-screen glass-gradient-primary glass-gradient-primary via-purple-900 glass-gradient-primary">
      {/* Header */}
      <div className="glass-surface-subtle/5 glass-glass-glass-backdrop-blur-lg glass-border-b glass-border-white/10 glass-contrast-guard">
        <div className="max-w-7xl glass-mx-auto glass-px-4 sm:px-6 lg:px-8">
          <div className="glass-flex glass-items-center glass-justify-between h-16">
            <div className="glass-flex glass-items-center glass-gap-4">
              <div className="w-8 h-8 glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-lg" />
              <h1 className="text-primary glass-text-xl font-bold">
                AuraGlass Enhancement Showcase
              </h1>
            </div>
            <div className="glass-flex glass-items-center glass-gap-4">
              <div className="text-primary/70 glass-text-sm">
                Interactions: {demoState.interactionCount}
              </div>
              <button
                onClick={() => setIsFullDemo(!isFullDemo)}
                className="glass-px-4 glass-py-2 glass-surface-subtle/10 hover:glass-surface-subtle/20 text-primary glass-radius-lg transition-colors glass-focus glass-touch-target glass-contrast-guard"
              >
                {isFullDemo ? "Exit Full Demo" : "Full Demo Mode"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="glass-surface-subtle/5 glass-glass-glass-backdrop-blur-sm glass-contrast-guard">
        <div className="max-w-7xl glass-mx-auto glass-px-4 sm:px-6 lg:px-8">
          <nav className="glass-flex space-x-8 overflow-x-auto glass-py-4">
            {showcaseSections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`whitespace-nowrap pb-2 glass-px-1 border-b-2 font-medium glass-text-sm transition-colors glass-focus glass-touch-target glass-contrast-guard ${
                  activeSection === section.id
                    ? "border-white glass-text-primary"
                    : "border-transparent glass-text-primary/60 hover:glass-text-primary/80 hover:border-white/30"
                }`}
              >
                {section.title}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl glass-mx-auto glass-px-4 sm:px-6 lg:px-8 glass-py-8">
        <AnimatePresence mode="wait">
          {showcaseSections.map(
            (section) =>
              activeSection === section.id && (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={
                    prefersReducedMotion ? { duration: 0 } : { duration: 0.3 }
                  }
                  className="space-y-8"
                >
                  {/* Section Header */}
                  <div className="text-center glass-gap-4">
                    <h2 className="glass-text-4xl font-bold text-primary">
                      {section.title}
                    </h2>
                    <p className="glass-text-xl text-primary/70 max-w-3xl glass-mx-auto">
                      {section.description}
                    </p>

                    {/* Features List */}
                    <div className="glass-flex glass-flex-wrap glass-justify-center glass-gap-2 mt-6">
                      {section.features.map((feature) => (
                        <span
                          key={feature}
                          className="glass-px-3 glass-py-1 glass-surface-subtle/10 text-primary/90 glass-text-sm glass-radius-full"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Section Component */}
                  <div className="glass-surface-subtle/5 glass-glass-glass-backdrop-blur-lg glass-radius-2xl glass-border glass-border-white/10 overflow-hidden glass-contrast-guard">
                    {section.component}
                  </div>
                </motion.div>
              )
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="glass-surface-subtle/5 glass-glass-glass-backdrop-blur-lg glass-border-t glass-border-white/10 glass-mt-16 glass-contrast-guard">
        <div className="max-w-7xl glass-mx-auto glass-px-4 sm:px-6 lg:px-8 glass-py-8">
          <div className="text-center text-primary/60">
            <p className="glass-text-lg mb-2">
              Experience the future of glassmorphism with consciousness
              interface technology
            </p>
            <p className="glass-text-sm">
              Built with React, Framer Motion, and advanced AI/ML systems
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancementShowcase;