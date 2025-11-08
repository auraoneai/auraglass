'use client';
import { useReducedMotion } from "@/hooks/useReducedMotion";
import React, { forwardRef, useState, useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { OptimizedGlass } from "../../primitives";
import { useA11yId } from "../../utils/a11y";
import { useMotionPreference } from "../../hooks/useMotionPreference";
import { createGlassStyle } from "../../utils/createGlassStyle";
import { cn } from "../../lib/utilsComprehensive";

export interface WaveEquation {
  id: string;
  name: string;
  type: "sine" | "cosine" | "gaussian" | "complex" | "standing" | "traveling";
  amplitude: number;
  frequency: number;
  phase: number;
  wavelength: number;
  velocity: number;
  damping?: number;
  color: string;
}

export interface GlassWaveFunctionProps {
  width?: number;
  height?: number;
  waveEquations: WaveEquation[];
  showInterference?: boolean;
  showPhaseSpace?: boolean;
  showAmplitude?: boolean;
  showFrequencySpectrum?: boolean;
  animationSpeed?: number;
  resolution?: number;
  timeScale?: number;
  showGrid?: boolean;
  showLabels?: boolean;
  realTimeMode?: boolean;
  onWaveInteraction?: (
    waveId: string,
    position: { x: number; y: number }
  ) => void;
  className?: string;
}

const waveTypes = {
  sine: (
    x: number,
    t: number,
    amplitude: number,
    frequency: number,
    phase: number,
    k: number,
    velocity: number
  ) => amplitude * Math.sin(k * x - 2 * Math.PI * frequency * t + phase),

  cosine: (
    x: number,
    t: number,
    amplitude: number,
    frequency: number,
    phase: number,
    k: number,
    velocity: number
  ) => amplitude * Math.cos(k * x - 2 * Math.PI * frequency * t + phase),

  gaussian: (
    x: number,
    t: number,
    amplitude: number,
    frequency: number,
    phase: number,
    k: number,
    velocity: number
  ) =>
    amplitude *
    Math.exp(-Math.pow(x - velocity * t, 2) / 20) *
    Math.sin(k * x - 2 * Math.PI * frequency * t + phase),

  complex: (
    x: number,
    t: number,
    amplitude: number,
    frequency: number,
    phase: number,
    k: number,
    velocity: number
  ) => {
    const real =
      amplitude * Math.cos(k * x - 2 * Math.PI * frequency * t + phase);
    const imag =
      amplitude * Math.sin(k * x - 2 * Math.PI * frequency * t + phase);
    return Math.sqrt(real * real + imag * imag);
  },

  standing: (
    x: number,
    t: number,
    amplitude: number,
    frequency: number,
    phase: number,
    k: number,
    velocity: number
  ) =>
    amplitude * Math.sin(k * x + phase) * Math.cos(2 * Math.PI * frequency * t),

  traveling: (
    x: number,
    t: number,
    amplitude: number,
    frequency: number,
    phase: number,
    k: number,
    velocity: number
  ) => amplitude * Math.sin(k * x - 2 * Math.PI * frequency * t + phase),
};

export const GlassWaveFunction = forwardRef<
  HTMLDivElement,
  GlassWaveFunctionProps
>(
  (
    {
      width = 800,
      height = 400,
      waveEquations,
      showInterference = true,
      showPhaseSpace = false,
      showAmplitude = true,
      showFrequencySpectrum = false,
      animationSpeed = 1,
      resolution = 2,
      timeScale = 1,
      showGrid = true,
      showLabels = true,
      realTimeMode = true,
      onWaveInteraction,
      className = "",
      ...props
    },
    ref
  ) => {
    const prefersReducedMotion = useReducedMotion();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const phaseCanvasRef = useRef<HTMLCanvasElement>(null);
    const spectrumCanvasRef = useRef<HTMLCanvasElement>(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [selectedWave, setSelectedWave] = useState<string | null>(null);
    const [waveData, setWaveData] = useState<Record<string, number[]>>({});
    const id = useA11yId("glass-wave-function");
    const { shouldAnimate } = useMotionPreference();

    // Time evolution
    useEffect(() => {
      if (!realTimeMode) return;

      const interval = setInterval(() => {
        setCurrentTime((prev: any) => prev + 0.1 * animationSpeed * timeScale);
      }, 16);
      return () => clearInterval(interval);
    }, [realTimeMode, animationSpeed, timeScale]);

    // Generate wave data
    const calculateWaves = useMemo(() => {
      const points = Math.floor(width / resolution);
      const newWaveData: Record<string, number[]> = {};

      waveEquations.forEach((wave: any) => {
        const k = (2 * Math.PI) / wave.wavelength;
        const data: number[] = [];

        for (let i = 0; i < points; i++) {
          const x = (i / points) * width - width / 2; // Center the wave
          const waveFunc = waveTypes[wave.type as keyof typeof waveTypes];
          let y = waveFunc(
            x,
            currentTime,
            wave.amplitude,
            wave.frequency,
            wave.phase,
            k,
            wave.velocity
          );

          // Apply damping if present
          if (wave.damping && wave.damping > 0) {
            y *= Math.exp(-wave.damping * Math.abs(x));
          }

          data.push(y);
        }

        newWaveData[wave.id] = data;
      });

      setWaveData(newWaveData);
      return newWaveData;
    }, [waveEquations, currentTime, width, resolution]);

    // Main canvas rendering
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.clearRect(0, 0, width, height);

      // Grid
      if (showGrid) {
        ctx.strokeStyle = "var(--glass-bg-default)";
        ctx.lineWidth = 1;

        // Horizontal grid lines
        for (let y = 0; y <= height; y += 40) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }

        // Vertical grid lines
        for (let x = 0; x <= width; x += 40) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }

        // Center line
        ctx.strokeStyle = "var(--glass-bg-hover)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, height / 2);
        ctx.lineTo(width, height / 2);
        ctx.stroke();
      }

      // Draw individual waves
      Object.entries(waveData).forEach(([waveId, data]) => {
        const wave = waveEquations.find((w) => w.id === waveId);
        if (!wave) return;

        ctx.strokeStyle = wave.color;
        ctx.lineWidth = selectedWave === waveId ? 3 : 2;
        ctx.globalAlpha = selectedWave && selectedWave !== waveId ? 0.3 : 0.8;

        ctx.beginPath();
        data.forEach((y, i) => {
          const x = (i / data.length) * width;
          const canvasY = height / 2 - y * (height / 4); // Scale and center

          if (i === 0) {
            ctx.moveTo(x, canvasY);
          } else {
            ctx.lineTo(x, canvasY);
          }
        });
        ctx.stroke();

        // Wave labels
        if (showLabels) {
          ctx.fillStyle = wave.color;
          ctx.font = "12px Arial";
          ctx.globalAlpha = 1;
          ctx.fillText(
            wave.name,
            10,
            20 + Object.keys(waveData).indexOf(waveId) * 20
          );
        }
      });

      // Interference pattern
      if (showInterference && waveEquations.length > 1) {
        const interferenceData: number[] = [];
        const dataLength = Math.min(
          ...Object.values(waveData).map((d: any) => d.length)
        );

        for (let i = 0; i < dataLength; i++) {
          const sum = Object.values(waveData).reduce(
            (total, data) => total + (data[i] || 0),
            0
          );
          interferenceData.push(sum);
        }

        ctx.strokeStyle = "var(--glass-white)";
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.9;
        ctx.setLineDash([5, 5]);

        ctx.beginPath();
        interferenceData.forEach((y, i) => {
          const x = (i / interferenceData.length) * width;
          const canvasY = height / 2 - y * (height / 4);

          if (i === 0) {
            ctx.moveTo(x, canvasY);
          } else {
            ctx.lineTo(x, canvasY);
          }
        });
        ctx.stroke();
        ctx.setLineDash([]);
      }

      ctx.globalAlpha = 1;
    }, [
      waveData,
      waveEquations,
      width,
      height,
      showGrid,
      showLabels,
      showInterference,
      selectedWave,
    ]);

    // Phase space visualization
    useEffect(() => {
      if (!showPhaseSpace) return;

      const canvas = phaseCanvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const phaseWidth = 200;
      const phaseHeight = 200;

      ctx.clearRect(0, 0, phaseWidth, phaseHeight);

      // Grid for phase space
      ctx.strokeStyle = "var(--glass-bg-default)";
      ctx.lineWidth = 1;

      for (let i = 0; i <= 10; i++) {
        const x = (i / 10) * phaseWidth;
        const y = (i / 10) * phaseHeight;

        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, phaseHeight);
        ctx.moveTo(0, y);
        ctx.lineTo(phaseWidth, y);
        ctx.stroke();
      }

      // Draw phase trajectories
      waveEquations.forEach((wave, index) => {
        const data = waveData[wave.id];
        if (!data) return;

        ctx.strokeStyle = wave.color;
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.7;

        ctx.beginPath();
        data.forEach((amplitude, i) => {
          if (i === 0) return;

          const prevAmplitude = data[i - 1];
          const velocity = amplitude - prevAmplitude; // Approximate velocity

          const x = ((amplitude + 2) / 4) * phaseWidth; // Normalize to canvas
          const y = phaseHeight - ((velocity + 2) / 4) * phaseHeight;

          if (i === 1) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        });
        ctx.stroke();
      });

      ctx.globalAlpha = 1;
    }, [showPhaseSpace, waveData, waveEquations]);

    // Frequency spectrum
    useEffect(() => {
      if (!showFrequencySpectrum) return;

      const canvas = spectrumCanvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const spectrumWidth = 300;
      const spectrumHeight = 150;

      ctx.clearRect(0, 0, spectrumWidth, spectrumHeight);

      // Draw frequency bars
      waveEquations.forEach((wave, index) => {
        const barWidth = spectrumWidth / waveEquations.length;
        const barHeight = (wave.amplitude / 2) * spectrumHeight;
        const x = index * barWidth;
        const y = spectrumHeight - barHeight;

        ctx.fillStyle = wave.color;
        ctx.globalAlpha = 0.7;
        ctx.fillRect(x + 2, y, barWidth - 4, barHeight);

        // Frequency label
        ctx.fillStyle = "var(--glass-white)";
        ctx.font = "10px Arial";
        ctx.globalAlpha = 1;
        ctx.fillText(
          `${wave.frequency.toFixed(1)}Hz`,
          x + 5,
          spectrumHeight - 5
        );
      });
    }, [showFrequencySpectrum, waveEquations]);

    const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Find closest wave
      let closestWave: string | null = null;
      let minDistance = Infinity;

      Object.entries(waveData).forEach(([waveId, data]) => {
        const dataIndex = Math.floor((x / width) * data.length);
        const waveY = height / 2 - data[dataIndex] * (height / 4);
        const distance = Math.abs(y - waveY);

        if (distance < minDistance && distance < 30) {
          minDistance = distance;
          closestWave = waveId;
        }
      });

      if (closestWave) {
        setSelectedWave((prev: any) =>
          prev === closestWave ? null : closestWave
        );
        onWaveInteraction?.(closestWave, { x, y });
      }
    };

    return (
      <OptimizedGlass
        ref={ref}
        variant="frosted"
        className={cn("glass-p-4 glass-space-y-4", className)}
        {...props}
      >
        {/* Header */}
        <div className="glass-flex glass-items-center glass-justify-between">
          <div>
            <h3
              className={cn(
                "glass-text-lg glass-font-semibold glass-text-primary"
              )}
            >
              Wave Function Visualization
            </h3>
            <p className={cn("glass-text-sm glass-text-secondary")}>
              {waveEquations.length} wave{waveEquations.length !== 1 ? "s" : ""}
              {selectedWave &&
                ` • Selected: ${waveEquations.find((w) => w.id === selectedWave)?.name}`}
            </p>
          </div>

          <div className={cn("glass-flex glass-items-center glass-space-x-4")}>
            {realTimeMode && (
              <div
                className={cn(
                  "glass-flex glass-items-center glass-space-x-1 glass-text-success"
                )}
              >
                <div
                  className={cn(
                    "glass-w-2 glass-h-2 glass-surface-success glass-radius-full glass-animate-pulse"
                  )}
                />
                <span className={cn("glass-text-xs")}>Live</span>
              </div>
            )}
            <div className={cn("glass-text-sm glass-text-secondary")}>
              t = {currentTime.toFixed(1)}
            </div>
          </div>
        </div>

        {/* Main wave canvas */}
        <div className={cn("glass-relative")}>
          <canvas
            ref={canvasRef}
            width={width}
            height={height}
            className={cn(
              "glass-border glass-border-primary glass-radius-lg glass-surface-dark glass-cursor-crosshair"
            )}
            onClick={handleCanvasClick}
          />

          {/* Amplitude indicators */}
          {showAmplitude && (
            <div
              className={cn(
                "glass-absolute glass-left-2 glass-top-2 glass-space-y-1"
              )}
            >
              <div className={cn("glass-text-xs glass-text-secondary")}>
                Amplitude
              </div>
              <div className={cn("glass-text-xs glass-text-success")}>+2</div>
              <div
                className={cn("glass-text-xs glass-text-muted")}
                style={{ marginTop: height / 4 - 20 }}
              >
                0
              </div>
              <div
                className={cn("glass-text-xs glass-text-danger")}
                style={{ marginTop: height / 2 - 40 }}
              >
                -2
              </div>
            </div>
          )}
        </div>

        <div className={cn("glass-flex glass-space-x-4")}>
          {/* Phase space */}
          {showPhaseSpace && (
            <div>
              <h4
                className={cn(
                  "glass-text-sm glass-font-medium glass-text-primary glass-mb-2"
                )}
              >
                Phase Space
              </h4>
              <canvas
                ref={phaseCanvasRef}
                width={200}
                height={200}
                className={cn(
                  "glass-border glass-border-primary glass-radius glass-surface-dark"
                )}
              />
              <div className={cn("glass-text-xs glass-text-muted glass-mt-1")}>
                Position vs Velocity
              </div>
            </div>
          )}

          {/* Frequency spectrum */}
          {showFrequencySpectrum && (
            <div>
              <h4
                className={cn(
                  "glass-text-sm glass-font-medium glass-text-primary glass-mb-2"
                )}
              >
                Frequency Spectrum
              </h4>
              <canvas
                ref={spectrumCanvasRef}
                width={300}
                height={150}
                className={cn(
                  "glass-border glass-border-primary glass-radius glass-surface-dark"
                )}
              />
            </div>
          )}
        </div>

        {/* Wave parameters */}
        <div
          className={cn(
            "glass-p-3 glass-radius-lg glass-border glass-border-subtle glass-space-y-3",
            createGlassStyle({ blur: "sm", opacity: 0.6 }).background
          )}
        >
          <h4
            className={cn(
              "glass-text-sm glass-font-semibold glass-text-primary"
            )}
          >
            Wave Parameters
          </h4>

          <div className={cn("glass-grid glass-gap-2")}>
            {waveEquations.map((wave: any) => (
              <motion.div
                key={wave.id}
                className={cn(
                  "glass-p-2 glass-radius glass-border glass-transition-colors glass-duration-200 glass-cursor-pointer",
                  selectedWave === wave.id
                    ? "glass-border-primary glass-surface-subtle"
                    : "glass-border-muted hover:glass-border-primary"
                )}
                onClick={() =>
                  setSelectedWave((prev: any) =>
                    prev === wave.id ? null : wave.id
                  )
                }
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div
                  className={cn(
                    "glass-flex glass-items-center glass-justify-between"
                  )}
                >
                  <div
                    className={cn(
                      "glass-flex glass-items-center glass-space-x-2"
                    )}
                  >
                    <div
                      className={cn("glass-w-3 glass-h-3 glass-radius-full")}
                      style={{ backgroundColor: wave.color }}
                    />
                    <span
                      className={cn(
                        "glass-text-sm glass-font-medium glass-text-primary"
                      )}
                    >
                      {wave.name}
                    </span>
                    <span
                      className={cn(
                        "glass-text-xs glass-text-muted glass-capitalize"
                      )}
                    >
                      ({wave.type})
                    </span>
                  </div>

                  <div
                    className={cn(
                      "glass-flex glass-items-center glass-space-x-4 glass-text-xs glass-text-secondary"
                    )}
                  >
                    <span>A: {wave.amplitude.toFixed(1)}</span>
                    <span>f: {wave.frequency.toFixed(1)}Hz</span>
                    <span>λ: {wave.wavelength.toFixed(0)}</span>
                    <span>v: {wave.velocity.toFixed(0)}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div
          className={cn(
            "glass-flex glass-items-center glass-justify-between glass-text-sm glass-text-secondary"
          )}
        >
          <span>Click waves to select • Time: {timeScale}x speed</span>
          <div className={cn("glass-flex glass-items-center glass-space-x-4")}>
            <span>Resolution: {resolution}px</span>
            <span>Animation: {animationSpeed}x</span>
          </div>
        </div>
      </OptimizedGlass>
    );
  }
);