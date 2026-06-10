"use client";
/**
 * AuraGlass Biometric Adaptation System
 * Heart rate and stress-responsive UI with device sensors and ML analysis
 */

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  createContext,
  useContext,
  forwardRef,
} from "react";
import { motion, AnimatePresence, useMotionValue } from "framer-motion";
import { cn } from "../../lib/utils";
import { OptimizedGlass } from "../../primitives";
import { useA11yId } from "@/utils/a11y";
import { useMotionPreferenceContext } from "@/contexts/MotionPreferenceContext";
import { ContrastGuard } from "../accessibility/ContrastGuard";
import { ANIMATION, COLORS } from "../../tokens/designConstants";

// Biometric data types
interface BiometricReading {
  heartRate?: number;
  respiratoryRate?: number;
  heartRateVariability?: number;
  stressLevel?: number; // 0-1 scale
  temperature?: number;
  bloodOxygen?: number;
  timestamp: number;
  confidence: number;
}

interface StressIndicators {
  rapidClicking: number;
  irregularMovement: number;
  prolongedHover: number;
  errorFrequency: number;
  sessionDuration: number;
}

interface AdaptationSettings {
  sensitivity: number; // 0-1 scale
  responseSpeed: number; // ms delay
  enableColorAdaptation: boolean;
  enableMotionAdaptation: boolean;
  enableLayoutAdaptation: boolean;
  enableAudioAdaptation: boolean;
  stressThreshold: number; // 0-1 scale
  calmingThreshold: number; // 0-1 scale
}

interface BiometricProfile {
  userId: string;
  baselineHeartRate: number;
  stressPatterns: Array<{ trigger: string; response: number }>;
  preferences: {
    calmingColors: string[];
    stressColors: string[];
    calmingAnimations: string[];
    stressAnimations: string[];
  };
  history: BiometricReading[];
}

type BiometricAdaptationType = "color" | "motion" | "layout" | "audio";

interface ColorAdaptation {
  type: "calming" | "energizing";
  intensity: number;
  colors: string[];
}

interface MotionAdaptation {
  type: "calming" | "normal";
  speed: number;
  amplitude: number;
}

interface LayoutAdaptation {
  type: "simplified";
  density: number;
  spacing: number;
}

interface AudioAdaptation {
  type: "calming";
  volume: number;
  frequency: "low" | "medium" | "high";
}

type BiometricAdaptation =
  | ColorAdaptation
  | MotionAdaptation
  | LayoutAdaptation
  | AudioAdaptation;

interface BiometricAdaptationState {
  color?: ColorAdaptation;
  motion?: MotionAdaptation;
  layout?: LayoutAdaptation;
}

interface SensorLike {
  addEventListener(type: "reading", listener: () => void): void;
  stop(): void;
}

interface MotionSensorLike extends SensorLike {
  x: number | null;
  y: number | null;
  z: number | null;
}

interface AmbientLightSensorLike extends SensorLike {
  illuminance: number | null;
}

type MotionSensorConstructor<TSensor extends SensorLike> = new (options?: {
  frequency?: number;
}) => TSensor;

interface SensorWindow extends Window {
  Accelerometer?: MotionSensorConstructor<MotionSensorLike>;
  Gyroscope?: MotionSensorConstructor<MotionSensorLike>;
  AmbientLightSensor?: MotionSensorConstructor<AmbientLightSensorLike>;
}

interface BluetoothCharacteristicValueEvent extends Event {
  target: EventTarget & {
    value?: DataView;
  };
}

interface BluetoothRemoteGATTCharacteristicLike {
  startNotifications(): Promise<BluetoothRemoteGATTCharacteristicLike>;
  addEventListener(
    type: "characteristicvaluechanged",
    listener: (event: BluetoothCharacteristicValueEvent) => void
  ): void;
}

interface BluetoothRemoteGATTServiceLike {
  getCharacteristic(
    characteristic: string
  ): Promise<BluetoothRemoteGATTCharacteristicLike>;
}

interface BluetoothRemoteGATTServerLike {
  getPrimaryService(service: string): Promise<BluetoothRemoteGATTServiceLike>;
}

interface BluetoothDeviceLike {
  gatt: {
    connect(): Promise<BluetoothRemoteGATTServerLike>;
  };
}

interface BluetoothNavigator extends Navigator {
  bluetooth?: {
    requestDevice(options: {
      filters: Array<{ services: string[] }>;
      optionalServices: string[];
    }): Promise<BluetoothDeviceLike>;
  };
}

interface StoredBiometricProfile extends Partial<BiometricProfile> {}

const BIOMETRIC_ADAPTATION_TYPES: BiometricAdaptationType[] = [
  "color",
  "motion",
  "layout",
  "audio",
];

const isColorAdaptation = (
  adaptation: BiometricAdaptation
): adaptation is ColorAdaptation => "colors" in adaptation;

const isMotionAdaptation = (
  adaptation: BiometricAdaptation
): adaptation is MotionAdaptation => "speed" in adaptation;

const isLayoutAdaptation = (
  adaptation: BiometricAdaptation
): adaptation is LayoutAdaptation => "spacing" in adaptation;

// Biometric sensor integration
class BiometricSensorManager {
  private accelerometer: MotionSensorLike | null = null;
  private gyroscope: MotionSensorLike | null = null;
  private ambientLightSensor: AmbientLightSensorLike | null = null;
  private isSupported = false;
  private readings: BiometricReading[] = [];
  private listeners: Array<(reading: BiometricReading) => void> = [];

  async initialize(): Promise<boolean> {
    // CRITICAL SSR FIX: Skip all sensor initialization on server
    if (typeof window === "undefined") {
      return false;
    }

    try {
      const sensorWindow = window as SensorWindow;
      // Check for Generic Sensor API support
      if (sensorWindow.Accelerometer) {
        this.accelerometer = new sensorWindow.Accelerometer({
          frequency: 10,
        });
        this.accelerometer.addEventListener(
          "reading",
          this.handleAccelerometer.bind(this)
        );
      }

      if (sensorWindow.Gyroscope) {
        this.gyroscope = new sensorWindow.Gyroscope({ frequency: 10 });
        this.gyroscope.addEventListener(
          "reading",
          this.handleGyroscope.bind(this)
        );
      }

      if (sensorWindow.AmbientLightSensor) {
        this.ambientLightSensor = new sensorWindow.AmbientLightSensor();
        this.ambientLightSensor.addEventListener(
          "reading",
          this.handleAmbientLight.bind(this)
        );
      }

      // Check for Web Bluetooth (for heart rate monitors)
      if ("bluetooth" in navigator) {
        this.isSupported = true;
      }

      // Fallback: Use behavioral analysis for stress detection
      this.setupBehavioralAnalysis();

      return true;
    } catch {
      this.setupBehavioralAnalysis();
      return true; // Still functional with behavioral analysis
    }
  }

  private setupBehavioralAnalysis(): void {
    // CRITICAL SSR FIX: Skip document access on server
    if (typeof document === "undefined") {
      return;
    }

    // Track mouse/touch patterns for stress indicators
    let lastClickTime = 0;
    let clickCount = 0;
    let mouseMovements: Array<{ x: number; y: number; timestamp: number }> = [];
    let errorCount = 0;

    // Rapid clicking detection
    document.addEventListener("click", () => {
      const now = Date.now();
      if (now - lastClickTime < 500) {
        clickCount++;
      } else {
        clickCount = 0;
      }
      lastClickTime = now;

      if (clickCount > 5) {
        this.reportStressIndicator("rapidClicking", 0.8);
      }
    });

    // Mouse movement analysis
    document.addEventListener("mousemove", (e) => {
      mouseMovements.push({
        x: e.clientX,
        y: e.clientY,
        timestamp: Date.now(),
      });

      // Keep only recent movements
      if (mouseMovements.length > 10) {
        mouseMovements = mouseMovements.slice(-5);
      }

      // Analyze movement patterns
      if (mouseMovements.length > 3) {
        const movements = mouseMovements.slice(-3);
        const distances = movements.map((point, i) => {
          if (i === 0) return 0;
          const prev = movements[i - 1];
          return Math.sqrt(
            Math.pow(point.x - prev.x, 2) + Math.pow(point.y - prev.y, 2)
          );
        });

        const avgDistance =
          distances.reduce((sum, d) => sum + d, 0) / distances.length;
        const timeDiff =
          movements[movements.length - 1].timestamp - movements[0].timestamp;
        const speed = avgDistance / timeDiff;

        // Irregular, jittery movement indicates stress
        if (speed > 2 && avgDistance < 50) {
          this.reportStressIndicator("irregularMovement", 0.6);
        }
      }
    });

    // Error detection (could be hooked into form validation, etc.)
    window.addEventListener("error", () => {
      errorCount++;
      this.reportStressIndicator(
        "errorFrequency",
        Math.min(1, errorCount * 0.2)
      );
    });

    // Periodic behavioral analysis
    setInterval(() => {
      this.analyzeBehavioralPatterns();
    }, ANIMATION.DURATION.slower);
  }

  private handleAccelerometer(): void {
    if (!this.accelerometer) return;

    const x = this.accelerometer.x ?? 0;
    const y = this.accelerometer.y ?? 0;
    const z = this.accelerometer.z ?? 0;
    const acceleration = Math.sqrt(x * x + y * y + z * z);

    // High acceleration might indicate stress/agitation
    if (acceleration > 15) {
      this.reportBiometricReading({
        stressLevel: Math.min(1, acceleration / 30),
        timestamp: Date.now(),
        confidence: 0.6,
      });
    }
  }

  private handleGyroscope(): void {
    if (!this.gyroscope) return;

    const x = this.gyroscope.x ?? 0;
    const y = this.gyroscope.y ?? 0;
    const z = this.gyroscope.z ?? 0;
    const rotation = Math.sqrt(x * x + y * y + z * z);

    // Rapid device rotation might indicate stress
    if (rotation > 5) {
      this.reportStressIndicator("deviceMovement", Math.min(1, rotation / 10));
    }
  }

  private handleAmbientLight(): void {
    if (!this.ambientLightSensor) return;

    const illuminance = this.ambientLightSensor.illuminance ?? 0;

    // Very low light might indicate late hours / stress
    if (illuminance < 10) {
      this.reportStressIndicator("lowLight", 0.3);
    }
  }

  private reportStressIndicator(type: string, level: number): void {
    this.reportBiometricReading({
      stressLevel: level,
      timestamp: Date.now(),
      confidence: 0.5,
    });
  }

  private analyzeBehavioralPatterns(): void {
    const now = Date.now();
    const recentReadings = this.readings.filter(
      (r) => now - r.timestamp < 30000
    ); // Last 30 seconds

    if (recentReadings.length === 0) return;

    // Calculate average stress level
    const avgStress =
      recentReadings.reduce((sum, r) => sum + (r.stressLevel || 0), 0) /
      recentReadings.length;

    // Generate composite reading
    this.reportBiometricReading({
      stressLevel: avgStress,
      heartRate: this.estimateHeartRateFromBehavior(avgStress),
      timestamp: now,
      confidence: 0.7,
    });
  }

  private estimateHeartRateFromBehavior(stressLevel: number): number {
    // Rough estimation: normal resting HR + stress factor
    const baselineHR = 70;
    return Math.round(baselineHR + stressLevel * 30);
  }

  private reportBiometricReading(reading: BiometricReading): void {
    this.readings.push(reading);

    // Keep only recent readings
    if (this.readings.length > 100) {
      this.readings = this.readings.slice(-50);
    }

    // Notify listeners
    this.listeners.forEach((listener) => listener(reading));
  }

  async connectHeartRateMonitor(): Promise<boolean> {
    // CRITICAL SSR FIX: Skip bluetooth access on server
    if (typeof navigator === "undefined") {
      return false;
    }

    try {
      const bluetoothNavigator = navigator as BluetoothNavigator;

      if (!bluetoothNavigator.bluetooth) {
        throw new Error("Web Bluetooth not supported");
      }

      const device = await bluetoothNavigator.bluetooth.requestDevice({
        filters: [{ services: ["heart_rate"] }],
        optionalServices: ["heart_rate"],
      });

      const server = await device.gatt.connect();
      const service = await server.getPrimaryService("heart_rate");
      const characteristic = await service.getCharacteristic(
        "heart_rate_measurement"
      );

      await characteristic.startNotifications();
      characteristic.addEventListener("characteristicvaluechanged", (event) => {
        const value = event.target.value;
        if (!value) return;
        const heartRate = value.getUint16(1, true);

        this.reportBiometricReading({
          heartRate,
          timestamp: Date.now(),
          confidence: 0.9,
        });
      });

      return true;
    } catch {
      return false;
    }
  }

  addListener(listener: (reading: BiometricReading) => void): () => void {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  getLatestReading(): BiometricReading | null {
    return this.readings.length > 0
      ? this.readings[this.readings.length - 1]
      : null;
  }

  getReadingHistory(duration: number = 300000): BiometricReading[] {
    const cutoff = Date.now() - duration;
    return this.readings.filter((r) => r.timestamp > cutoff);
  }

  cleanup(): void {
    if (this.accelerometer) {
      this.accelerometer.stop();
    }
    if (this.gyroscope) {
      this.gyroscope.stop();
    }
    if (this.ambientLightSensor) {
      this.ambientLightSensor.stop();
    }
    this.listeners = [];
    this.readings = [];
  }
}

// Adaptive UI engine
export class BiometricAdaptationEngine {
  private sensorManager: BiometricSensorManager;
  private settings: AdaptationSettings;
  private profile: BiometricProfile;
  private adaptationCallbacks: Map<
    string,
    (adaptation: BiometricAdaptation) => void
  > = new Map();
  private currentAdaptations: Map<string, BiometricAdaptation> = new Map();
  private adaptationTimeouts: Map<string, ReturnType<typeof setTimeout>> =
    new Map();

  constructor(settings: Partial<AdaptationSettings> = {}) {
    this.sensorManager = new BiometricSensorManager();
    this.settings = {
      sensitivity: 0.7,
      responseSpeed: 1000,
      enableColorAdaptation: true,
      enableMotionAdaptation: true,
      enableLayoutAdaptation: true,
      enableAudioAdaptation: true,
      stressThreshold: 0.7,
      calmingThreshold: 0.3,
      ...settings,
    };

    this.profile = {
      userId: "default",
      baselineHeartRate: 70,
      stressPatterns: [],
      preferences: {
        calmingColors: [
          "var(--glass-color-primary)",
          "#06b6d4",
          "var(--glass-color-success)",
          "#8b5cf6",
        ],
        stressColors: [
          "var(--glass-color-danger)",
          "var(--glass-color-warning)",
          "#ec4899",
        ],
        calmingAnimations: ["gentle", "slow", "smooth"],
        stressAnimations: ["fast", "sharp", "intense"],
      },
      history: [],
    };
  }

  async initialize(): Promise<boolean> {
    const success = await this.sensorManager.initialize();

    if (success) {
      this.sensorManager.addListener(this.handleBiometricReading.bind(this));
      this.loadProfile();
    }

    return success;
  }

  private handleBiometricReading(reading: BiometricReading): void {
    this.profile.history.push(reading);

    // Keep history manageable
    if (this.profile.history.length > 1000) {
      this.profile.history = this.profile.history.slice(-500);
    }

    // Determine adaptation needed
    const adaptations = this.determineAdaptations(reading);

    // Apply adaptations with debouncing
    this.debounceAdaptations(adaptations);
  }

  private determineAdaptations(
    reading: BiometricReading
  ): Map<string, BiometricAdaptation> {
    const adaptations = new Map<string, BiometricAdaptation>();
    const stressLevel = reading.stressLevel || 0;

    // Color adaptations
    if (this.settings.enableColorAdaptation) {
      if (stressLevel > this.settings.stressThreshold) {
        adaptations.set("color", {
          type: "calming",
          intensity: stressLevel,
          colors: this.profile.preferences.calmingColors,
        });
      } else if (stressLevel < this.settings.calmingThreshold) {
        adaptations.set("color", {
          type: "energizing",
          intensity: 1 - stressLevel,
          colors: this.profile.preferences.stressColors,
        });
      }
    }

    // Motion adaptations
    if (this.settings.enableMotionAdaptation) {
      if (stressLevel > this.settings.stressThreshold) {
        adaptations.set("motion", {
          type: "calming",
          speed: Math.max(0.5, 1 - stressLevel),
          amplitude: Math.max(0.3, 1 - stressLevel),
        });
      } else {
        adaptations.set("motion", {
          type: "normal",
          speed: 1,
          amplitude: 1,
        });
      }
    }

    // Layout adaptations
    if (
      this.settings.enableLayoutAdaptation &&
      stressLevel > this.settings.stressThreshold
    ) {
      adaptations.set("layout", {
        type: "simplified",
        density: Math.max(0.5, 1 - stressLevel),
        spacing: Math.min(2, 1 + stressLevel),
      });
    }

    // Audio adaptations
    if (this.settings.enableAudioAdaptation) {
      if (stressLevel > this.settings.stressThreshold) {
        adaptations.set("audio", {
          type: "calming",
          volume: Math.max(0.1, 0.5 - stressLevel * 0.3),
          frequency: "low",
        });
      }
    }

    return adaptations;
  }

  private debounceAdaptations(
    adaptations: Map<string, BiometricAdaptation>
  ): void {
    adaptations.forEach((adaptation, type) => {
      const existingTimeout = this.adaptationTimeouts.get(type);
      if (existingTimeout) {
        clearTimeout(existingTimeout);
      }

      const timeout = setTimeout(() => {
        this.applyAdaptation(type, adaptation);
        this.adaptationTimeouts.delete(type);
      }, this.settings.responseSpeed);

      this.adaptationTimeouts.set(type, timeout);
    });
  }

  private applyAdaptation(type: string, adaptation: BiometricAdaptation): void {
    this.currentAdaptations.set(type, adaptation);

    const callback = this.adaptationCallbacks.get(type);
    if (callback) {
      callback(adaptation);
    }
  }

  registerAdaptationCallback(
    type: string,
    callback: (adaptation: BiometricAdaptation) => void
  ): void {
    this.adaptationCallbacks.set(type, callback);
  }

  unregisterAdaptationCallback(type: string): void {
    this.adaptationCallbacks.delete(type);
  }

  getCurrentAdaptation(type: string): BiometricAdaptation | undefined {
    return this.currentAdaptations.get(type);
  }

  async connectHeartRateMonitor(): Promise<boolean> {
    return this.sensorManager.connectHeartRateMonitor();
  }

  getLatestReading(): BiometricReading | null {
    return this.sensorManager.getLatestReading();
  }

  getProfile(): BiometricProfile {
    return { ...this.profile };
  }

  updateSettings(settings: Partial<AdaptationSettings>): void {
    this.settings = { ...this.settings, ...settings };
  }

  private loadProfile(): void {
    // CRITICAL SSR FIX: Skip localStorage access on server
    if (typeof localStorage === "undefined") {
      return;
    }

    try {
      const stored = localStorage.getItem("auraglass-biometric-profile");
      if (stored) {
        const data = JSON.parse(stored) as StoredBiometricProfile;
        this.profile = { ...this.profile, ...data };
      }
    } catch {
      // Ignore invalid persisted profile data.
    }
  }

  private saveProfile(): void {
    // CRITICAL SSR FIX: Skip localStorage access on server
    if (typeof localStorage === "undefined") {
      return;
    }

    try {
      localStorage.setItem(
        "auraglass-biometric-profile",
        JSON.stringify(this.profile)
      );
    } catch {
      // Ignore storage failures; profile remains active in memory.
    }
  }

  cleanup(): void {
    this.sensorManager.cleanup();
    this.adaptationCallbacks.clear();
    this.currentAdaptations.clear();
    this.adaptationTimeouts.forEach((timeout) => clearTimeout(timeout));
    this.adaptationTimeouts.clear();
    this.saveProfile();
  }
}

// React context
const BiometricAdaptationContext = createContext<{
  engine: BiometricAdaptationEngine | null;
  isInitialized: boolean;
  latestReading: BiometricReading | null;
  currentStressLevel: number;
  connectHeartRateMonitor: () => Promise<boolean>;
}>({
  engine: null,
  isInitialized: false,
  latestReading: null,
  currentStressLevel: 0,
  connectHeartRateMonitor: async () => false,
});

// Provider component
export function GlassBiometricAdaptationProvider({
  children,
  settings,
  autoInitialize = true,
}: {
  children: React.ReactNode;
  settings?: Partial<AdaptationSettings>;
  autoInitialize?: boolean;
}) {
  const engineRef = useRef<BiometricAdaptationEngine | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [latestReading, setLatestReading] = useState<BiometricReading | null>(
    null
  );
  const [currentStressLevel, setCurrentStressLevel] = useState(0);

  useEffect(() => {
    engineRef.current = new BiometricAdaptationEngine(settings);

    if (autoInitialize) {
      engineRef.current.initialize().then((success) => {
        setIsInitialized(success);
      });
    }

    // Update latest reading periodically
    const interval = setInterval(() => {
      if (engineRef.current) {
        const reading = engineRef.current.getLatestReading();
        if (reading) {
          setLatestReading(reading);
          setCurrentStressLevel(reading.stressLevel || 0);
        }
      }
    }, ANIMATION.DURATION.fast);

    return () => {
      clearInterval(interval);
      if (engineRef.current) {
        engineRef.current.cleanup();
      }
    };
  }, [autoInitialize, settings]);

  const connectHeartRateMonitor = useCallback(async (): Promise<boolean> => {
    if (!engineRef.current) return false;
    return engineRef.current.connectHeartRateMonitor();
  }, []);

  const value = {
    engine: engineRef.current || null,
    isInitialized,
    latestReading,
    currentStressLevel,
    connectHeartRateMonitor,
  };

  return (
    <BiometricAdaptationContext.Provider value={value}>
      {children}
    </BiometricAdaptationContext.Provider>
  );
}

// Hook to use biometric adaptation
export function useBiometricAdaptation() {
  const context = useContext(BiometricAdaptationContext);
  if (!context) {
    throw new Error(
      "useBiometricAdaptation must be used within GlassBiometricAdaptationProvider"
    );
  }
  return context;
}

export class BiometricStressDetector extends BiometricAdaptationEngine {
  getStressLevel(): number {
    return this.getLatestReading()?.stressLevel ?? 0;
  }

  getConfidence(): number {
    return this.getLatestReading()?.confidence ?? 0;
  }
}

// Stress-responsive glass component
export const GlassStressResponsive = forwardRef<
  HTMLDivElement,
  {
    children: React.ReactNode;
    className?: string;
    adaptationType?: "color" | "motion" | "layout" | "all";
    respectMotionPreference?: boolean;
    "aria-label"?: string;
    "aria-describedby"?: string;
    role?: string;
  }
>(function GlassStressResponsive(
  {
    children,
    className,
    adaptationType = "all",
    respectMotionPreference = true,
    "aria-label": ariaLabel,
    "aria-describedby": ariaDescribedBy,
    role,
    ...restProps
  },
  ref
) {
  const { engine, currentStressLevel, latestReading } =
    useBiometricAdaptation();
  const [adaptations, setAdaptations] = useState<BiometricAdaptationState>({});
  const { prefersReducedMotion } = useMotionPreferenceContext();
  const stressId = useA11yId("stress-responsive");
  const descriptionId = useA11yId("stress-description");

  useEffect(() => {
    if (!engine) return;

    const handleColorAdaptation = (adaptation: BiometricAdaptation) => {
      if (
        (adaptationType === "color" || adaptationType === "all") &&
        isColorAdaptation(adaptation)
      ) {
        setAdaptations((prev) => ({ ...prev, color: adaptation }));
      }
    };

    const handleMotionAdaptation = (adaptation: BiometricAdaptation) => {
      if (
        (adaptationType === "motion" || adaptationType === "all") &&
        isMotionAdaptation(adaptation)
      ) {
        setAdaptations((prev) => ({ ...prev, motion: adaptation }));
      }
    };

    const handleLayoutAdaptation = (adaptation: BiometricAdaptation) => {
      if (
        (adaptationType === "layout" || adaptationType === "all") &&
        isLayoutAdaptation(adaptation)
      ) {
        setAdaptations((prev) => ({ ...prev, layout: adaptation }));
      }
    };

    engine.registerAdaptationCallback("color", handleColorAdaptation);
    engine.registerAdaptationCallback("motion", handleMotionAdaptation);
    engine.registerAdaptationCallback("layout", handleLayoutAdaptation);

    return () => {
      engine.unregisterAdaptationCallback("color");
      engine.unregisterAdaptationCallback("motion");
      engine.unregisterAdaptationCallback("layout");
    };
  }, [engine, adaptationType]);

  // Calculate adaptive styles
  const colorAdaptation = adaptations.color;
  const motionAdaptation = adaptations.motion;
  const layoutAdaptation = adaptations.layout;

  const adaptiveStyles: React.CSSProperties = {};

  if (colorAdaptation) {
    if (colorAdaptation.type === "calming") {
      const calmColor = colorAdaptation.colors[0] || COLORS.semantic.primary;
      adaptiveStyles.backgroundColor = `${calmColor}20`;
      adaptiveStyles.borderColor = `${calmColor}40`;
    }
  }

  const motionSpeed = motionAdaptation?.speed || 1;
  const layoutSpacing = layoutAdaptation?.spacing || 1;
  const shouldAnimate = respectMotionPreference ? !prefersReducedMotion : true;

  return (
    <motion.div
      ref={ref}
      style={{ ...adaptiveStyles }}
      animate={
        shouldAnimate
          ? {
              scale:
                1 +
                (currentStressLevel > 0.7 ? -0.02 : 0.01) * currentStressLevel,
              padding: `${8 * layoutSpacing}px`,
            }
          : {}
      }
      transition={
        shouldAnimate
          ? {
              duration: ANIMATION.DURATION.slower / 1000 / motionSpeed,
              ease: currentStressLevel > 0.7 ? "easeOut" : "easeInOut",
            }
          : {}
      }
      id={stressId}
      role={role || "region"}
      aria-label={
        ariaLabel ||
        `Stress-responsive interface (${Math.round(currentStressLevel * 100)}% stress level)`
      }
      aria-describedby={ariaDescribedBy || descriptionId}
      aria-live="polite"
      className={cn(
        "glass-surface glass-border glass-radius-md glass-backdrop-blur transition-all",
        { transitionDuration: "var(--glass-motion-duration-slower)" },
        currentStressLevel > 0.7
          ? "glass-surface-subtle glass-border-subtle"
          : "glass-surface-medium glass-border-medium",
        currentStressLevel > 0.7 && "calming-mode",
        className
      )}
      {...restProps}
    >
      <OptimizedGlass>
        {/* Screen reader description */}
        <span id={descriptionId} className="glass-sr-only">
          Biometric adaptation interface responding to stress level{" "}
          {Math.round(currentStressLevel * 100)}%.
          {adaptationType !== "all"
            ? ` Adaptation type: ${adaptationType}`
            : " All adaptations active."}
        </span>
        <ContrastGuard>{children}</ContrastGuard>

        {/* Stress level indicator */}
        <div className="glass-absolute glass-top-2 glass-right-2 glass-opacity-30">
          <div
            className={cn(
              "glass-w-2 glass-h-2 glass-radius-full glass-transition",
              currentStressLevel > 0.7
                ? "glass-surface-danger"
                : currentStressLevel > 0.4
                  ? "glass-surface-warning"
                  : "glass-surface-success"
            )}
            aria-hidden
          />
        </div>
      </OptimizedGlass>
    </motion.div>
  );
});

// Biometric dashboard
export const GlassBiometricDashboard = forwardRef<
  HTMLDivElement,
  {
    className?: string;
    show?: boolean;
    "aria-label"?: string;
    role?: string;
  }
>(function GlassBiometricDashboard(
  { className, show = true, "aria-label": ariaLabel, role, ...restProps },
  ref
) {
  const { latestReading, currentStressLevel, connectHeartRateMonitor, engine } =
    useBiometricAdaptation();

  const [history, setHistory] = useState<BiometricReading[]>([]);
  const [showDetails, setShowDetails] = useState(false);
  const dashboardId = useA11yId("biometric-dashboard");

  useEffect(() => {
    if (!engine) return;

    const interval = setInterval(() => {
      const readings = engine.getLatestReading();
      if (readings) {
        setHistory((prev) => [...prev.slice(-19), readings]); // Keep last 20 readings
      }
    }, ANIMATION.DURATION.normal);

    return () => clearInterval(interval);
  }, [engine]);

  if (!show) return null;

  return (
    <OptimizedGlass
      ref={ref}
      intensity={"subtle"}
      glassBlur={"strong"}
      className={cn("fixed top-4 left-4 glass-p-4 glass-radius-lg", className)}
      id={dashboardId}
      role={role || "region"}
      aria-label={ariaLabel || "Biometric monitoring dashboard"}
      {...restProps}
    >
      <ContrastGuard>
        <div className="glass-flex glass-items-center glass-justify-between glass-mb-3">
          <h3 className="glass-text-sm glass-font-medium glass-text-secondary dark:glass-text-secondary">
            Biometrics
          </h3>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="glass-text-xs glass-text-secondary hover:glass-text-secondary glass-focus glass-touch-target"
            aria-expanded={showDetails}
            aria-controls={`${dashboardId}-details`}
            aria-label={showDetails ? "Hide details" : "Show details"}
          >
            {showDetails ? "−" : "+"}
          </button>
        </div>

        {/* Current status */}
        <div className="glass-gap-2">
          <div className="glass-flex glass-items-center glass-justify-between">
            <span className="glass-text-xs glass-text-secondary dark:glass-text-secondary">
              Stress Level
            </span>
            <div className="glass-flex glass-items-center glass-gap-2">
              <div className="glass-w-16 glass-h-2 glass-surface-subtle glass-radius-full glass-overflow-hidden">
                <motion.div
                  className={cn(
                    "glass-h-full glass-radius-full glass-transition",
                    currentStressLevel > 0.7
                      ? "glass-surface-danger"
                      : currentStressLevel > 0.4
                        ? "glass-surface-warning"
                        : "glass-surface-success"
                  )}
                  animate={{ width: `${currentStressLevel * 100}%` }}
                  transition={{ duration: ANIMATION.DURATION.slow / 1000 }}
                />
              </div>
              <span className="glass-text-xs glass-text-secondary dark:glass-text-secondary">
                {(currentStressLevel * 100).toFixed(0)}%
              </span>
            </div>
          </div>

          {latestReading?.heartRate && (
            <div className="glass-flex glass-items-center glass-justify-between">
              <span className="glass-text-xs glass-text-secondary dark:glass-text-secondary">
                Heart Rate
              </span>
              <span className="glass-text-xs glass-text-secondary dark:glass-text-secondary">
                {latestReading.heartRate} bpm
              </span>
            </div>
          )}
        </div>
      </ContrastGuard>

      {/* Detailed view */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            id={`${dashboardId}-details`}
            className="glass-mt-4 glass-pt-4 glass-border-t glass-border-white/10 glass-gap-3"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: ANIMATION.DURATION.normal / 1000 }}
          >
            {/* Stress history chart */}
            <ContrastGuard>
              <div>
                <div className="glass-text-xs glass-text-secondary glass-mb-2">
                  Stress History
                </div>
                <div className="glass-relative glass-h-12 glass-surface-primary/50 glass-radius-md">
                  {history.map((reading, index) => (
                    <div
                      key={index}
                      ref={(el) => {
                        if (!el) return;
                        el.style.left = `${(index / (history.length - 1)) * 100}%`;
                        el.style.height = `${(reading.stressLevel || 0) * 100}%`;
                        el.style.backgroundColor =
                          (reading.stressLevel || 0) > 0.7
                            ? "var(--glass-color-danger)"
                            : (reading.stressLevel || 0) > 0.4
                              ? "var(--glass-color-warning)"
                              : "var(--glass-color-success)";
                      }}
                      className="glass-absolute glass-bottom-0 glass-w-1 glass-radius-md"
                    />
                  ))}
                </div>
              </div>

              {/* Heart rate monitor connection */}
              <div>
                <button
                  onClick={connectHeartRateMonitor}
                  className={cn(
                    "glass-w-full glass-px-3 glass-py-2 glass-text-xs glass-surface-subtle glass-radius-md glass-focus glass-touch-target",
                    "glass-text-secondary hover:glass-surface-subtle glass-transition"
                  )}
                  aria-label="Connect heart rate monitor"
                >
                  <ContrastGuard>Connect Heart Rate Monitor</ContrastGuard>
                </button>
              </div>

              {/* Current adaptations */}
              {engine && (
                <div>
                  <div className="glass-text-xs glass-text-secondary dark:glass-text-secondary glass-mb-2">
                    Active Adaptations
                  </div>
                  <div className="glass-gap-1">
                    {BIOMETRIC_ADAPTATION_TYPES.map((type) => {
                      const adaptation = engine.getCurrentAdaptation(type);
                      return adaptation ? (
                        <div
                          key={type}
                          className="glass-flex glass-items-center glass-justify-between glass-text-xs"
                        >
                          <span className="glass-text-secondary dark:glass-text-secondary glass-capitalize">
                            {type}
                          </span>
                          <span className="glass-text-secondary dark:glass-text-secondary glass-capitalize">
                            {adaptation.type}
                          </span>
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
              )}

              {/* Readings info */}
              {latestReading && (
                <div>
                  <div className="glass-text-xs glass-text-secondary dark:glass-text-secondary glass-mb-1">
                    Last Reading
                  </div>
                  <div className="glass-text-xs glass-text-secondary dark:glass-text-secondary">
                    {new Date(latestReading.timestamp).toLocaleTimeString()}
                  </div>
                  <div className="glass-text-xs glass-text-secondary dark:glass-text-secondary">
                    Confidence: {(latestReading.confidence * 100).toFixed(0)}%
                  </div>
                </div>
              )}
            </ContrastGuard>
          </motion.div>
        )}
      </AnimatePresence>
    </OptimizedGlass>
  );
});

// Presets for different adaptation modes
export const biometricAdaptationPresets = {
  subtle: {
    sensitivity: 0.3,
    responseSpeed: 2000,
    stressThreshold: 0.8,
    calmingThreshold: 0.2,
  },
  standard: {
    sensitivity: 0.7,
    responseSpeed: 1000,
    stressThreshold: 0.7,
    calmingThreshold: 0.3,
  },
  sensitive: {
    sensitivity: 0.9,
    responseSpeed: 500,
    stressThreshold: 0.5,
    calmingThreshold: 0.4,
  },
  accessibility: {
    sensitivity: 0.8,
    responseSpeed: 1500,
    enableColorAdaptation: true,
    enableMotionAdaptation: true,
    enableLayoutAdaptation: true,
    stressThreshold: 0.6,
  },
};

interface GlassBiometricAdaptationProps
  extends React.HTMLAttributes<HTMLDivElement> {
  settings?: Partial<AdaptationSettings>;
  autoInitialize?: boolean;
  showDashboard?: boolean;
  children?: React.ReactNode;
}

function BiometricSummaryCard() {
  const { latestReading, currentStressLevel, isInitialized } =
    useBiometricAdaptation();

  return (
    <div
      className={cn(
        "glass-surface-primary glass-radius-2xl glass-p-6 glass-space-y-4",
        "glass-border glass-border-white/10 glass-shadow-soft-lg"
      )}
      data-testid="glass-biometric-summary"
    >
      <ContrastGuard>
        <div>
          <p className="glass-text-xs glass-text-tertiary glass-uppercase glass-tracking-wide">
            Biometric adaptation
          </p>
          <h2 className="glass-text-2xl glass-text-primary glass-font-semibold">
            {isInitialized ? "Monitoring" : "Initializing"}
          </h2>
          <p className="glass-text-sm glass-text-secondary">
            Stress level {(currentStressLevel * 100).toFixed(0)}%
          </p>
        </div>
        <div className="glass-grid glass-grid-cols-2 glass-gap-3">
          <div className="glass-surface-subtle glass-radius-xl glass-p-4">
            <p className="glass-text-xs glass-text-tertiary glass-mb-1">
              Heart rate
            </p>
            <p className="glass-text-lg glass-text-primary glass-font-semibold">
              {latestReading?.heartRate
                ? `${latestReading.heartRate.toFixed(0)} bpm`
                : "—"}
            </p>
          </div>
          <div className="glass-surface-subtle glass-radius-xl glass-p-4">
            <p className="glass-text-xs glass-text-tertiary glass-mb-1">
              Respiratory
            </p>
            <p className="glass-text-lg glass-text-primary glass-font-semibold">
              {latestReading?.respiratoryRate
                ? `${latestReading.respiratoryRate.toFixed(0)} rpm`
                : "—"}
            </p>
          </div>
        </div>
        <div className="glass-text-xs glass-text-secondary">
          Confidence{" "}
          {latestReading
            ? `${Math.round((latestReading.confidence || 0) * 100)}%`
            : "Collecting signals"}
        </div>
      </ContrastGuard>
    </div>
  );
}

export const GlassBiometricAdaptation: React.FC<
  GlassBiometricAdaptationProps
> = ({
  settings,
  autoInitialize = true,
  showDashboard = true,
  className,
  children,
  ...rest
}) => (
  <GlassBiometricAdaptationProvider
    settings={settings}
    autoInitialize={autoInitialize}
  >
    <div
      className={cn(
        "glass-biometric-adaptation glass-relative glass-space-y-4",
        className
      )}
      {...rest}
    >
      {children ?? <BiometricSummaryCard />}
      {showDashboard && <GlassBiometricDashboard />}
    </div>
  </GlassBiometricAdaptationProvider>
);

export default GlassBiometricAdaptation;
