'use client';
import { useReducedMotion } from '@/hooks/useReducedMotion';
/**
 * AuraGlass Eye Tracking Integration
 * Gaze-responsive glass effects using WebGazer.js and device camera
 */

import React, { useEffect, useRef, useState, useCallback, createContext, useContext, forwardRef } from 'react';
import { motion, AnimatePresence, useMotionValue } from 'framer-motion';
import { cn } from '../../lib/utils';
import { OptimizedGlassCore as OptimizedGlass } from '@/primitives/OptimizedGlassCore';
import { useA11yId } from '@/utils/a11y';
import { useMotionPreferenceContext } from '@/contexts/MotionPreferenceContext';

// Eye tracking data types
interface GazePoint {
  x: number;
  y: number;
  timestamp: number;
  confidence: number;
}

interface GazeRegion {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  element?: HTMLElement;
}

interface GazeInteraction {
  region: GazeRegion;
  duration: number;
  intensity: number;
  type: 'fixation' | 'saccade' | 'pursuit' | 'drift';
  startTime: number;
  endTime: number;
}

interface EyeTrackingCalibration {
  isCalibrated: boolean;
  accuracy: number;
  points: Array<{ screen: { x: number; y: number }; gaze: { x: number; y: number } }>;
}

// WebGazer integration class
class WebGazerIntegration {
  private isInitialized = false;
  private isCalibrated = false;
  private gazeListeners: Array<(gaze: GazePoint) => void> = [];
  private calibrationPoints: Array<{ x: number; y: number }> = [];
  private lastGaze: GazePoint | null = null;

  async initialize(): Promise<boolean> {
    try {
      // Check if WebGazer is already loaded
      if (typeof window !== 'undefined' && !(window as any).webgazer) {
        // Dynamically load WebGazer
        await this.loadWebGazer();
      }

      const webgazer = (window as any).webgazer;
      if (!webgazer) {
        throw new Error('WebGazer failed to load');
      }

      // Initialize WebGazer
      await webgazer
        .setRegression('ridge')
        .setTracker('TFFacemesh')
        .setGazeListener((data: any, timestamp: number) => {
          if (data) {
            const gazePoint: GazePoint = {
              x: data.x,
              y: data.y,
              timestamp,
              confidence: data.confidence || 0.5,
            };
            this.lastGaze = gazePoint;
            this.gazeListeners.forEach((listener: any) => listener(gazePoint));
          }
        })
        .saveDataAcrossSessions(true)
        .begin();

      // Hide the video overlay
      webgazer.showVideoPreview(false).showPredictionPoints(false);

      this.isInitialized = true;
      return true;

    } catch (error) {
      console.warn('Failed to initialize eye tracking:', error);
      return false;
    }
  }

  private async loadWebGazer(): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://webgazer.cs.brown.edu/webgazer.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load WebGazer'));
      document.head.appendChild(script);
    });
  }

  addGazeListener(listener: (gaze: GazePoint) => void): () => void {
    this.gazeListeners.push(listener);
    return () => {
      const index = this.gazeListeners.indexOf(listener);
      if (index > -1) {
        this.gazeListeners.splice(index, 1);
      }
    };
  }

  async startCalibration(): Promise<void> {
    if (!this.isInitialized) return;

    this.calibrationPoints = [
      { x: 0.1, y: 0.1 }, { x: 0.5, y: 0.1 }, { x: 0.9, y: 0.1 },
      { x: 0.1, y: 0.5 }, { x: 0.5, y: 0.5 }, { x: 0.9, y: 0.5 },
      { x: 0.1, y: 0.9 }, { x: 0.5, y: 0.9 }, { x: 0.9, y: 0.9 }
    ];
  }

  async calibratePoint(x: number, y: number): Promise<void> {
    if (!this.isInitialized) return;

    const webgazer = (window as any).webgazer;
    if (webgazer) {
      // Add calibration point
      await new Promise(resolve => {
        webgazer.recordScreenPosition(x, y, 'click');
        setTimeout(resolve, 1000); // Allow time for calibration
      });
    }
  }

  finishCalibration(): void {
    this.isCalibrated = true;
  }

  getLastGaze(): GazePoint | null {
    return this.lastGaze;
  }

  cleanup(): void {
    if (this.isInitialized && (window as any).webgazer) {
      (window as any).webgazer.end();
    }
    this.gazeListeners = [];
    this.isInitialized = false;
    this.isCalibrated = false;
  }
}

// Eye tracking engine
class EyeTrackingEngine {
  private webgazer: WebGazerIntegration;
  private gazeHistory: GazePoint[] = [];
  private regions: Map<string, GazeRegion> = new Map();
  private activeInteractions: Map<string, GazeInteraction> = new Map();
  private fixationThreshold = 100; // ms
  private saccadeThreshold = 50; // pixels
  private isTracking = false;

  constructor() {
    this.webgazer = new WebGazerIntegration();
  }

  async initialize(): Promise<boolean> {
    const success = await this.webgazer.initialize();
    if (success) {
      this.webgazer.addGazeListener(this.handleGazePoint.bind(this));
      this.isTracking = true;
    }
    return success;
  }

  private handleGazePoint(gaze: GazePoint): void {
    if (!this.isTracking) return;

    // Add to history
    this.gazeHistory.push(gaze);
    
    // Keep only recent history
    if (this.gazeHistory.length > 1000) {
      this.gazeHistory = this.gazeHistory.slice(-500);
    }

    // Analyze gaze patterns
    this.analyzeGazePatterns(gaze);

    // Check region interactions
    this.checkRegionInteractions(gaze);
  }

  private analyzeGazePatterns(currentGaze: GazePoint): void {
    if (this.gazeHistory.length < 2) return;

    const previousGaze = this.gazeHistory[this.gazeHistory.length - 2];
    const distance = Math.sqrt(
      Math.pow(currentGaze.x - previousGaze.x, 2) + 
      Math.pow(currentGaze.y - previousGaze.y, 2)
    );

    const timeDiff = currentGaze.timestamp - previousGaze.timestamp;

    // Detect fixations, saccades, etc.
    if (distance < this.saccadeThreshold && timeDiff > this.fixationThreshold) {
      // Potential fixation
      this.handleFixation(currentGaze);
    } else if (distance > this.saccadeThreshold) {
      // Saccade movement
      this.handleSaccade(previousGaze, currentGaze);
    }
  }

  private handleFixation(gaze: GazePoint): void {
    // Find which region this fixation is in
    const region = this.findRegionAt(gaze.x, gaze.y);
    if (region) {
      const existingInteraction = this.activeInteractions.get(region.id);
      if (existingInteraction) {
        // Update existing interaction
        existingInteraction.endTime = gaze.timestamp;
        existingInteraction.duration = gaze.timestamp - existingInteraction.startTime;
        existingInteraction.intensity = Math.min(1, existingInteraction.intensity + 0.1);
      } else {
        // Start new interaction
        this.activeInteractions.set(region.id, {
          region,
          duration: 0,
          intensity: 0.1,
          type: 'fixation',
          startTime: gaze.timestamp,
          endTime: gaze.timestamp,
        });
      }
    }
  }

  private handleSaccade(from: GazePoint, to: GazePoint): void {
    // Handle rapid eye movement between regions
    const fromRegion = this.findRegionAt(from.x, from.y);
    const toRegion = this.findRegionAt(to.x, to.y);

    if (fromRegion && toRegion && fromRegion.id !== toRegion.id) {
      // End interaction with previous region
      const fromInteraction = this.activeInteractions.get(fromRegion.id);
      if (fromInteraction) {
        fromInteraction.endTime = from.timestamp;
        fromInteraction.type = 'saccade';
      }

      // Start interaction with new region
      this.activeInteractions.set(toRegion.id, {
        region: toRegion,
        duration: 0,
        intensity: 0.1,
        type: 'saccade',
        startTime: to.timestamp,
        endTime: to.timestamp,
      });
    }
  }

  private checkRegionInteractions(gaze: GazePoint): void {
    const currentRegion = this.findRegionAt(gaze.x, gaze.y);
    
    // End interactions for regions that are no longer being gazed at
    this.activeInteractions.forEach((interaction, regionId) => {
      if (!currentRegion || regionId !== currentRegion.id) {
        const timeSinceEnd = gaze.timestamp - interaction.endTime;
        if (timeSinceEnd > 500) { // 500ms timeout
          this.activeInteractions.delete(regionId);
        }
      }
    });
  }

  private findRegionAt(x: number, y: number): GazeRegion | null {
    for (const region of this.regions.values()) {
      if (x >= region.x && x <= region.x + region.width &&
          y >= region.y && y <= region.y + region.height) {
        return region;
      }
    }
    return null;
  }

  registerRegion(region: GazeRegion): void {
    this.regions.set(region.id, region);
  }

  unregisterRegion(regionId: string): void {
    this.regions.delete(regionId);
    this.activeInteractions.delete(regionId);
  }

  getActiveInteractions(): GazeInteraction[] {
    return Array.from(this.activeInteractions.values());
  }

  getRegionInteraction(regionId: string): GazeInteraction | null {
    return this.activeInteractions.get(regionId) || null;
  }

  async startCalibration(): Promise<void> {
    return this.webgazer.startCalibration();
  }

  async calibratePoint(x: number, y: number): Promise<void> {
    return this.webgazer.calibratePoint(x, y);
  }

  finishCalibration(): void {
    this.webgazer.finishCalibration();
  }

  cleanup(): void {
    this.webgazer.cleanup();
    this.activeInteractions.clear();
    this.regions.clear();
    this.gazeHistory = [];
    this.isTracking = false;
  }
}

// React context for eye tracking
const EyeTrackingContext = createContext<{
  engine: EyeTrackingEngine | null;
  isInitialized: boolean;
  isCalibrating: boolean;
  activeInteractions: GazeInteraction[];
  startCalibration: () => Promise<void>;
  finishCalibration: () => void;
}>({
  engine: null,
  isInitialized: false,
  isCalibrating: false,
  activeInteractions: [],
  startCalibration: async () => {},
  finishCalibration: () => {},
});

// Provider component
export function GlassEyeTrackingProvider({
  children,
  autoInitialize = false,
  onGazeInteraction,
}: {
  children: React.ReactNode;
  autoInitialize?: boolean;
  onGazeInteraction?: (interaction: GazeInteraction) => void;
}) {
  const prefersReducedMotion = useReducedMotion();
  const engineRef = useRef<EyeTrackingEngine>();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [activeInteractions, setActiveInteractions] = useState<GazeInteraction[]>([]);

  // Initialize engine
  useEffect(() => {
    engineRef.current = new EyeTrackingEngine();

    if (autoInitialize) {
      engineRef.current.initialize().then(success => {
        setIsInitialized(success);
        if (!success) {
          console.warn('Eye tracking initialization failed. Using fallback mode.');
        }
      });
    }

    return () => {
      if (engineRef.current) {
        engineRef.current.cleanup();
      }
    };
  }, [autoInitialize]);

  // Update active interactions
  useEffect(() => {
    if (!engineRef.current || !isInitialized) return;

    const interval = setInterval(() => {
      const interactions = engineRef.current!.getActiveInteractions();
      setActiveInteractions(interactions);
      
      // Trigger callback for new interactions
      interactions.forEach((interaction: any) => onGazeInteraction?.(interaction));
    }, 100);

    return () => clearInterval(interval);
  }, [isInitialized, onGazeInteraction]);

  const startCalibration = useCallback(async () => {
    if (!engineRef.current) return;
    
    setIsCalibrating(true);
    await engineRef.current.startCalibration();
  }, []);

  const finishCalibration = useCallback(() => {
    if (!engineRef.current) return;
    
    engineRef.current.finishCalibration();
    setIsCalibrating(false);
  }, []);

  const value = {
    engine: engineRef.current || null,
    isInitialized,
    isCalibrating,
    activeInteractions,
    startCalibration,
    finishCalibration,
  };

  return (
    <EyeTrackingContext.Provider value={value}>
      {children}
    </EyeTrackingContext.Provider>
  );
}

// Hook to use eye tracking
export function useEyeTracking() {
  const context = useContext(EyeTrackingContext);
  if (!context) {
    throw new Error('useEyeTracking must be used within GlassEyeTrackingProvider');
  }
  return context;
}

// Calibration component
export function GlassEyeTrackingCalibration({
  onComplete,
  className,
}: {
  onComplete?: () => void;
  className?: string;
}) {
  const prefersReducedMotion = useReducedMotion();
  const { startCalibration, finishCalibration, isCalibrating } = useEyeTracking();
  const [currentPoint, setCurrentPoint] = useState(0);
  const [isCalibrationActive, setIsCalibrationActive] = useState(false);

  const calibrationPoints = [
    { x: 10, y: 10 }, { x: 50, y: 10 }, { x: 90, y: 10 },
    { x: 10, y: 50 }, { x: 50, y: 50 }, { x: 90, y: 50 },
    { x: 10, y: 90 }, { x: 50, y: 90 }, { x: 90, y: 90 }
  ];

  const handleStartCalibration = async () => {
    await startCalibration();
    setIsCalibrationActive(true);
    setCurrentPoint(0);
  };

  const handlePointClick = async (point: { x: number; y: number }, index: number) => {
    if (!isCalibrationActive) return;

    // Convert percentage to screen coordinates
    const screenX = (point.x / 100) * window.innerWidth;
    const screenY = (point.y / 100) * window.innerHeight;

    // Simulate calibration point click
    const engine = useEyeTracking().engine;
    if (engine) {
      await engine.calibratePoint(screenX, screenY);
    }

    // Move to next point
    if (index < calibrationPoints.length - 1) {
      setCurrentPoint(index + 1);
    } else {
      // Calibration complete
      finishCalibration();
      setIsCalibrationActive(false);
      onComplete?.();
    }
  };

  if (!isCalibrating && !isCalibrationActive) {
    return (
      <div className={cn("glass-flex glass-flex-col glass-items-center glass-gap-4", className)}>
        <div className={cn("glass-text-center")}>
          <h3 className={cn("glass-text-lg glass-font-medium glass-text-primary glass-mb-2")}>
            Eye Tracking Calibration
          </h3>
          <p className={cn("glass-text-sm glass-text-secondary glass-mb-4")}>
            Look at each dot and click to calibrate your gaze tracking
          </p>
          <motion.button
            className={cn(
              "glass-px-6 glass-py-3 glass-surface-primary glass-elev-2 glass-radius-lg",
              "glass-text-primary font-medium transition-all duration-300",
              "hover:glass-elev-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            )}
            onClick={handleStartCalibration}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Start Calibration
          </motion.button>
        </div>
      </div>
    );
  }

  if (isCalibrationActive) {
    return (
      <div className={cn("fixed inset-0 z-50 glass-surface-primary", className)}>
        <div className={cn("glass-absolute glass-inset-0")}>
          <div className={cn("glass-relative glass-w-full glass-h-full")}>
            {/* Progress */}
            <div className={cn("glass-absolute glass-top-4 glass-left-1-2 glass-translate-x-1/2-neg")}> 
              <div className={cn("glass-surface-secondary glass-radius-lg glass-px-4 glass-py-2")}>
                <span className={cn("glass-text-sm glass-text-primary")}>
                  Point {currentPoint + 1} of {calibrationPoints.length}
                </span>
              </div>
            </div>

            {/* Instructions */}
            <div className={cn("glass-absolute glass-top-20 glass-left-1-2 glass-translate-x-1/2-neg glass-text-center")}> 
              <p className={cn("glass-text-lg glass-text-primary glass-mb-2")}>
                Look at the blue dot and click it
              </p>
              <p className={cn("glass-text-sm glass-text-secondary")}>
                Keep your head still and follow the dot with your eyes
              </p>
            </div>

            {/* Calibration points */}
            {calibrationPoints.map((point, index) => (
              <motion.div
                key={index}
                className={cn("glass-absolute glass-w-4 glass-h-4 glass-translate-x-1/2-neg glass-translate-y-1/2-neg glass-cursor-pointer glass-focus")}
                ref={(el)=>{ if(el){ el.style.left = `${point.x}%`; el.style.top = `${point.y}%`; }}}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: index === currentPoint ? [1, 1.2, 1] : index < currentPoint ? 1 : 0,
                  opacity: index <= currentPoint ? 1 : 0.3,
                }}
                transition={prefersReducedMotion ? { duration: 0 } : {
    duration: index === currentPoint ? 0.5 : 0.2,
    repeat: index === currentPoint ? Infinity : 0,
                }}
                onClick={() => handlePointClick(point, index)}
              >
                <div
                  className={cn(
                    "glass-w-full glass-h-full glass-radius-full",
                    index === currentPoint
                      ? "glass-surface-accent glass-ring-4 glass-ring-accent/30"
                      : index < currentPoint
                      ? "glass-surface-success"
                      : "glass-surface-muted"
                  )}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
}

// Gaze-responsive component wrapper
export function GlassGazeResponsive({
  children,
  className,
  regionId,
  onGazeEnter,
  onGazeLeave,
  onGazeIntensityChange,
  glassIntensity = true,
  glassRadius = true,
  glassBlur = true,
}: {
  children: React.ReactNode;
  className?: string;
  regionId: string;
  onGazeEnter?: (interaction: GazeInteraction) => void;
  onGazeLeave?: () => void;
  onGazeIntensityChange?: (intensity: number) => void;
  glassIntensity?: boolean;
  glassRadius?: boolean;
  glassBlur?: boolean;
}) {
  const prefersReducedMotion = useReducedMotion();
  const { engine, activeInteractions } = useEyeTracking();
  const elementRef = useRef<HTMLDivElement>(null);
  const [isGazed, setIsGazed] = useState(false);
  const [gazeIntensity, setGazeIntensity] = useState(0);

  // Register region with eye tracking engine
  useEffect(() => {
    if (!engine || !elementRef.current) return;

    const element = elementRef.current;
    const rect = element.getBoundingClientRect();
    
    const region: GazeRegion = {
      id: regionId,
      x: rect.left,
      y: rect.top,
      width: rect.width,
      height: rect.height,
      element,
    };

    engine.registerRegion(region);

    // Update region on resize/scroll
    const updateRegion = () => {
      const newRect = element.getBoundingClientRect();
      engine.registerRegion({
        ...region,
        x: newRect.left,
        y: newRect.top,
        width: newRect.width,
        height: newRect.height,
      });
    };

    window.addEventListener('resize', updateRegion);
    window.addEventListener('scroll', updateRegion);

    return () => {
      engine.unregisterRegion(regionId);
      window.removeEventListener('resize', updateRegion);
      window.removeEventListener('scroll', updateRegion);
    };
  }, [engine, regionId]);

  // Track gaze interactions
  useEffect(() => {
    const interaction = activeInteractions.find(i => i.region.id === regionId);

    if (interaction && !isGazed) {
      setIsGazed(true);
      onGazeEnter?.(interaction);
    } else if (!interaction && isGazed) {
      setIsGazed(false);
      setGazeIntensity(0);
      onGazeLeave?.();
    }

    if (interaction) {
      setGazeIntensity(interaction.intensity);
      onGazeIntensityChange?.(interaction.intensity);
    }
  }, [activeInteractions, regionId, isGazed, onGazeEnter, onGazeLeave, onGazeIntensityChange]);

  return (
    <motion.div
      ref={elementRef}
      className={cn(
        "transition-all duration-300",
        glassIntensity && isGazed && "OptimizedGlassCore intensity={0.2} glassBlur={6}",
        className
      )}
      animate={{
        scale: isGazed ? 1 + gazeIntensity * 0.02 : 1,
        ...(glassBlur && {
          // Use createGlassStyle() instead,
        }),
        ...(glassRadius && {
          borderRadius: `${8 + gazeIntensity * 4}px`,
        }),
      }}
      transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.3 }}
      // background color applied via ref assignment above
    >
      {children}
      
      {/* Gaze indicator */}
      <AnimatePresence>
        {isGazed && (
          <motion.div
            className={cn("glass-absolute glass-inset-0 glass-pointer-events-none glass-radius-inherit")}
            initial={{ opacity: 0 }}
            animate={prefersReducedMotion ? {} : { opacity: 0.8 }}
            exit={{ opacity: 0 }}
          >
            <div 
              className={cn("glass-absolute glass-inset-0 glass-radius-inherit")}
              style={{
                boxShadow: `inset 0 0 ${20 + gazeIntensity * 30}px var(--glass-color-primary, ${0.2 + gazeIntensity * 0.3})`,
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Gaze visualization overlay
export function GlassGazeVisualization({
  show = false,
  className,
}: {
  show?: boolean;
  className?: string;
}) {
  const { activeInteractions } = useEyeTracking();

  if (!show) return null;

  return (
    <div className={cn("glass-fixed glass-inset-0 glass-pointer-events-none glass-z-40", className)}>
      <AnimatePresence>
        {activeInteractions.map((interaction: any) => (
          <motion.div
            key={interaction.region.id}
            className="glass-absolute"
            ref={(el)=>{ if(!el) return; const r=interaction.region as any; el.style.left = typeof r.x==='number'? `${r.x}px` : r.x; el.style.top = typeof r.y==='number'? `${r.y}px` : r.y; el.style.width = typeof r.width==='number'? `${r.width}px` : r.width; el.style.height = typeof r.height==='number'? `${r.height}px` : r.height; }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 0.6, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div
              className={cn("glass-w-full glass-h-full glass-border-2 glass-radius-md")}
              ref={(el)=>{ if(!el) return; const a=interaction.intensity; el.style.borderColor = `var(--glass-color-primary,${a})`; el.style.backgroundColor = `var(--glass-color-primary,${a*0.1})`; }}
            />
            <div className={cn("glass-absolute glass--top-2 glass-left-0 glass-text-xs glass-font-mono glass-text-primary")}> 
              {interaction.type} ({(interaction.intensity * 100).toFixed(0)}%)
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// Presets for different eye tracking modes
export const eyeTrackingPresets = {
  subtle: {
    glassIntensity: 0.5,
    responsiveness: 0.3,
    visualFeedback: false,
  },
  standard: {
    glassIntensity: 1.0,
    responsiveness: 0.6,
    visualFeedback: true,
  },
  dramatic: {
    glassIntensity: 1.5,
    responsiveness: 1.0,
    visualFeedback: true,
  },
  accessibility: {
    glassIntensity: 0.8,
    responsiveness: 0.4,
    visualFeedback: true,
    highContrast: true,
  },
};

interface GlassEyeTrackingProps extends React.HTMLAttributes<HTMLDivElement> {
  autoInitialize?: boolean;
  showCalibration?: boolean;
  showVisualization?: boolean;
  children?: React.ReactNode;
  onGazeInteraction?: (interaction: GazeInteraction) => void;
}

function EyeTrackingSummaryCard() {
  const { isInitialized, isCalibrating, activeInteractions } = useEyeTracking();

  return (
    <div
      className={cn(
        "glass-surface-primary glass-radius-2xl glass-p-6 glass-space-y-4",
        "glass-border glass-border-white/10 glass-shadow-soft-lg"
      )}
      data-testid="glass-eye-tracking-summary"
    >
      <div>
        <p className='glass-text-xs glass-text-tertiary uppercase tracking-wide'>
          Eye tracking
        </p>
        <h2 className='glass-text-2xl glass-text-primary font-semibold'>
          {isInitialized ? "Active" : "Initializing"}
        </h2>
        <p className="glass-text-sm glass-text-secondary">
          {isCalibrating
            ? "Calibration in progress"
            : "Capturing gaze interactions"}
        </p>
      </div>
      <div className="glass-grid glass-grid-cols-2 glass-gap-3">
        <div className="glass-surface-subtle glass-radius-xl glass-p-4">
          <p className='glass-text-xs glass-text-tertiary mb-1'>Interactions</p>
          <p className='glass-text-lg glass-text-primary font-semibold'>
            {activeInteractions.length}
          </p>
        </div>
        <div className="glass-surface-subtle glass-radius-xl glass-p-4">
          <p className='glass-text-xs glass-text-tertiary mb-1'>Status</p>
          <p className='glass-text-lg glass-text-primary font-semibold'>
            {isCalibrating ? "Calibrating" : "Tracking"}
          </p>
        </div>
      </div>
    </div>
  );
}

export const GlassEyeTracking: React.FC<GlassEyeTrackingProps> = ({
  autoInitialize = false,
  showCalibration = true,
  showVisualization = true,
  className,
  children,
  onGazeInteraction,
  ...rest
}) => (
  <GlassEyeTrackingProvider
    autoInitialize={autoInitialize}
    onGazeInteraction={onGazeInteraction}
  >
    <div
      className={cn(
        "glass-eye-tracking glass-relative glass-space-y-4",
        className
      )}
      {...rest}
    >
      {children ?? <EyeTrackingSummaryCard />}
      {showCalibration && <GlassEyeTrackingCalibration />}
      {showVisualization && <GlassGazeVisualization show />}
    </div>
  </GlassEyeTrackingProvider>
);

export default GlassEyeTracking;
