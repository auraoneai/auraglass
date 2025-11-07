import { useReducedMotion } from '@/hooks/useReducedMotion';
'use client'

import React, { forwardRef, useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { OptimizedGlass } from '../../primitives'
import { useA11yId } from '../../utils/a11y'
import { useMotionPreference } from '../../hooks/useMotionPreference'
import { createGlassStyle } from '../../utils/createGlassStyle'
import { cn } from '../../lib/utilsComprehensive'

export interface ProbabilityPoint {
  id: string
  x: number
  y: number
  z: number
  probability: number
  uncertainty: number
  waveFunction: number
  phase: number
  observationCount: number
  lastObserved?: number
}

export interface GlassProbabilityCloudProps {
  width?: number
  height?: number
  depth?: number
  probabilityPoints?: ProbabilityPoint[]
  uncertaintyPrinciple?: boolean
  quantumFluctuations?: boolean
  observerEffect?: boolean
  heisenbergUncertainty?: number
  waveParticleDuality?: boolean
  showProbabilityDensity?: boolean
  showWaveFunction?: boolean
  showUncertaintyBounds?: boolean
  animationSpeed?: number
  particleCount?: number
  measurementPrecision?: number
  realTimeMode?: boolean
  onMeasurement?: (point: ProbabilityPoint) => void
  onUncertaintyChange?: (uncertainty: number) => void
  className?: string
}

const generateQuantumNoise = (amplitude: number = 0.1) => 
  (Math.random() - 0.5) * amplitude * 2

const waveFunction = (x: number, y: number, t: number, frequency: number = 1) =>
  Math.sin(x * frequency + t) * Math.cos(y * frequency + t * 0.7)

const probabilityDensity = (waveAmp: number) => waveAmp * waveAmp

export const GlassProbabilityCloud = forwardRef<HTMLDivElement, GlassProbabilityCloudProps>(
  ({
  const prefersReducedMotion = useReducedMotion();
    width = 600,
    height = 400,
    depth = 200,
    probabilityPoints = [],
    uncertaintyPrinciple = true,
    quantumFluctuations = true,
    observerEffect = true,
    heisenbergUncertainty = 0.5,
    waveParticleDuality = true,
    showProbabilityDensity = true,
    showWaveFunction = true,
    showUncertaintyBounds = true,
    animationSpeed = 1,
    particleCount = 100,
    measurementPrecision = 0.1,
    realTimeMode = false,
    onMeasurement,
    onUncertaintyChange,
    className='',
    ...props
  }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [quantumTime, setQuantumTime] = useState(0)
    const [measurements, setMeasurements] = useState<Array<{
      point: ProbabilityPoint
      timestamp: number
      uncertainty: number
    }>>([])
    const [particles, setParticles] = useState<ProbabilityPoint[]>([])
    const [totalUncertainty, setTotalUncertainty] = useState(heisenbergUncertainty)

    // Motion preference hook
    const { shouldAnimate } = useMotionPreference()

    // Helper function to respect motion preferences
    const respectMotionPreference = (config: any) => shouldAnimate ? config : { duration: 0 }
    const [isObserved, setIsObserved] = useState(false)
    const id = useA11yId('glass-probability-cloud')

    // Initialize quantum particles
    useEffect(() => {
      const initialParticles: ProbabilityPoint[] = Array.from({ length: particleCount }, (_, i) => ({
        id: `particle-${i}`,
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * depth,
        probability: Math.random(),
        uncertainty: heisenbergUncertainty + generateQuantumNoise(0.1),
        waveFunction: Math.random() * 2 - 1,
        phase: Math.random() * Math.PI * 2,
        observationCount: 0
      }))

      setParticles([...probabilityPoints, ...initialParticles])
    }, [particleCount, width, height, depth, heisenbergUncertainty, probabilityPoints])

    // Quantum time evolution
    useEffect(() => {
      const interval = setInterval(() => {
        setQuantumTime((prev: any) => prev + 0.1 * animationSpeed)
      }, 16)
      return () => clearInterval(interval)
    }, [animationSpeed])

    // Update quantum system
    useEffect(() => {
      if (!realTimeMode) return

      const interval = setInterval(() => {
        setParticles((prev: any) => prev.map((particle: any) => {
          // Wave function evolution
          const newWaveFunction = waveFunction(
            particle.x / width * 4 * Math.PI,
            particle.y / height * 4 * Math.PI,
            quantumTime,
            1 + particle.phase / Math.PI
          )

          // Probability density from wave function
          const newProbability = probabilityDensity(newWaveFunction)

          // Quantum fluctuations
          let deltaX = 0, deltaY = 0, deltaZ = 0
          if (quantumFluctuations) {
            const fluctuationStrength = particle.uncertainty * 0.5
            deltaX = generateQuantumNoise(fluctuationStrength)
            deltaY = generateQuantumNoise(fluctuationStrength)
            deltaZ = generateQuantumNoise(fluctuationStrength)
          }

          // Heisenberg uncertainty principle
          let newUncertainty = particle.uncertainty
          if (uncertaintyPrinciple) {
            const momentum = Math.sqrt(deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ)
            const positionPrecision = 1 - momentum
            newUncertainty = Math.max(heisenbergUncertainty, 1 / (positionPrecision + 0.1))
          }

          // Observer effect - collapse wave function when observed
          if (observerEffect && isObserved) {
            const distance = Math.sqrt(
              Math.pow(particle.x - width/2, 2) + 
              Math.pow(particle.y - height/2, 2)
            )
            if (distance < 50) {
              return {
                ...particle,
                waveFunction: Math.sign(newWaveFunction) * 0.9,
                probability: 0.8,
                uncertainty: Math.max(0.1, particle.uncertainty * 0.5),
                observationCount: particle.observationCount + 1,
                lastObserved: Date.now()
              }
            }
          }

          return {
            ...particle,
            x: Math.max(0, Math.min(width, particle.x + deltaX)),
            y: Math.max(0, Math.min(height, particle.y + deltaY)),
            z: Math.max(0, Math.min(depth, particle.z + deltaZ)),
            waveFunction: newWaveFunction,
            probability: Math.max(0.01, Math.min(1, newProbability + 0.1)),
            uncertainty: Math.max(0.05, Math.min(2, newUncertainty)),
            phase: (particle.phase + 0.05) % (2 * Math.PI)
          }
        }))
      }, 50)

      return () => clearInterval(interval)
    }, [realTimeMode, quantumTime, width, height, depth, uncertaintyPrinciple, quantumFluctuations, observerEffect, heisenbergUncertainty, isObserved])

    // Update total uncertainty
    useEffect(() => {
      const avgUncertainty = particles.reduce((sum, p) => sum + p.uncertainty, 0) / particles.length
      setTotalUncertainty(avgUncertainty || heisenbergUncertainty)
      onUncertaintyChange?.(avgUncertainty)
    }, [particles, heisenbergUncertainty, onUncertaintyChange])

    // Canvas rendering
    useEffect(() => {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      // Clear canvas
      ctx.clearRect(0, 0, width, height)

      // Background quantum field
      if (showProbabilityDensity) {
        const imageData = ctx.createImageData(width, height)
        for (let x = 0; x < width; x += 4) {
          for (let y = 0; y < height; y += 4) {
            const wave = waveFunction(x / width * 4 * Math.PI, y / height * 4 * Math.PI, quantumTime)
            const density = probabilityDensity(wave)
            const intensity = Math.floor(density * 50 + 10)
            
            const index = (y * width + x) * 4
            if (index < imageData.data.length - 3) {
              imageData.data[index] = 100 + intensity     // R
              imageData.data[index + 1] = 50 + intensity   // G
              imageData.data[index + 2] = 200 + intensity  // B
              imageData.data[index + 3] = 30               // A
            }
          }
        }
        ctx.putImageData(imageData, 0, 0)
      }

      // Draw particles
      particles.forEach((particle: any) => {
        const opacity = observerEffect && particle.lastObserved && 
                       (Date.now() - particle.lastObserved < 1000) ? 0.9 : 
                       particle.probability * 0.7 + 0.1

        // Particle size based on uncertainty
        const baseSize = 2 + particle.uncertainty * 3
        const pulseSize = waveParticleDuality ? 
          baseSize * (1 + Math.sin(quantumTime * 3 + particle.phase) * 0.3) : 
          baseSize

        // Wave or particle rendering based on duality
        if (waveParticleDuality && particle.uncertainty > 0.3) {
          // Wave representation
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, pulseSize * 2, 0, 2 * Math.PI)
          ctx.fillStyle = `rgba(100, 150, 255, ${opacity * 0.3})`
          ctx.fill()
          
          // Wave rings
          for (let i = 1; i <= 3; i++) {
            ctx.beginPath()
            ctx.arc(particle.x, particle.y, pulseSize * i * 0.7, 0, 2 * Math.PI)
            ctx.strokeStyle = `rgba(150, 200, 255, ${opacity * 0.2 / i})`
            ctx.lineWidth = 1
            ctx.stroke()
          }
        } else {
          // Particle representation
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, pulseSize, 0, 2 * Math.PI)
          
          const gradient = ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, pulseSize
          )
          gradient.addColorStop(0, `rgba(255, 255, 255, ${opacity})`)
          gradient.addColorStop(1, `rgba(100, 150, 255, ${opacity * 0.3})`)
          ctx.fillStyle = gradient
          ctx.fill()
        }

        // Uncertainty bounds
        if (showUncertaintyBounds && particle.uncertainty > 0.2) {
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.uncertainty * 20, 0, 2 * Math.PI)
          ctx.strokeStyle = `rgba(255, 100, 100, ${particle.uncertainty * 0.3})`
          ctx.lineWidth = 1
          ctx.setLineDash([2, 3])
          ctx.stroke()
          ctx.setLineDash([])
        }
      })

      // Wave function visualization
      if (showWaveFunction) {
        ctx.strokeStyle = 'rgba(200, 200, 255, 0.4)'
        ctx.lineWidth = 1
        ctx.beginPath()
        
        for (let x = 0; x < width; x += 10) {
          const wave = waveFunction(x / width * 4 * Math.PI, height/2 / height * 4 * Math.PI, quantumTime)
          const y = height/2 + wave * 30
          if (x === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.stroke()

        // Vertical wave function
        ctx.beginPath()
        for (let y = 0; y < height; y += 10) {
          const wave = waveFunction(width/2 / width * 4 * Math.PI, y / height * 4 * Math.PI, quantumTime)
          const x = width/2 + wave * 30
          if (y === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.stroke()
      }
    }, [particles, quantumTime, width, height, showProbabilityDensity, showWaveFunction, showUncertaintyBounds, waveParticleDuality, observerEffect])

    const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current
      if (!canvas) return

      const rect = canvas.getBoundingClientRect()
      const clickX = e.clientX - rect.left
      const clickY = e.clientY - rect.top

      // Find nearest particle for measurement
      let nearestParticle: ProbabilityPoint | null = null
      let minDistance = Infinity

      particles.forEach((particle: any) => {
        const distance = Math.sqrt(
          Math.pow(particle.x - clickX, 2) + 
          Math.pow(particle.y - clickY, 2)
        )
        if (distance < minDistance && distance < 30) {
          minDistance = distance
          nearestParticle = particle
        }
      })

      if (nearestParticle) {
        // Perform measurement
        const measurement = {
          point: nearestParticle as ProbabilityPoint,
          timestamp: Date.now(),
          uncertainty: (nearestParticle as ProbabilityPoint).uncertainty
        }

        setMeasurements((prev: any) => [...prev.slice(-9), measurement])
        onMeasurement?.(nearestParticle)

        // Update particle due to measurement
        setParticles((prev: any) => prev.map((p: any) => 
          p.id === nearestParticle!.id ? {
            ...p,
            observationCount: p.observationCount + 1,
            lastObserved: Date.now(),
            uncertainty: Math.max(0.1, p.uncertainty * 0.7)
          } : p
        ))
      }
    }

    const averageProbability = useMemo(() => 
      particles.reduce((sum, p) => sum + p.probability, 0) / particles.length || 0,
      [particles]
    )

    const quantumCoherence = useMemo(() =>
      1 - (totalUncertainty - heisenbergUncertainty),
      [totalUncertainty, heisenbergUncertainty]
    )

    return (
      <OptimizedGlass
        ref={ref}
        variant="frosted"
        className={`relative ${className}`}
        {...props}
      >
        <div className="p-4 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className={cn("glass-text-xl glass-font-semibold glass-text-primary")}>
                Probability Cloud
              </h2>
              <p className={cn("glass-text-sm glass-text-secondary")}>
                {particles.length} quantum states
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsObserved(!isObserved)}
                className={`
                  px-3 py-1 rounded text-sm font-medium transition-colors duration-200
                  ${createGlassStyle({ variant: 'default' })}
                  glass-border-subtle
                  ${isObserved 
                    ? 'glass-text-danger glass-border-danger' 
                    : 'glass-text-secondary hover:glass-text-primary'
                  }
                `}
              >
                {isObserved ? '👁️ Observing' : '👁️‍🗨️ Observe'}
              </button>
              
              <div className={cn("glass-text-sm glass-text-muted")}>
                t: {quantumTime.toFixed(1)}
              </div>
            </div>
          </div>

          {/* Canvas */}
          <div className="relative">
            <canvas
              ref={canvasRef}
              width={width}
              height={height}
              className={cn("glass-border-subtle glass-radius-lg glass-cursor-crosshair glass-surface-overlay")}
              onClick={handleCanvasClick}
              onMouseEnter={() => setIsObserved(true)}
              onMouseLeave={() => setIsObserved(false)}
            />
            
            {/* Measurement indicator */}
            <AnimatePresence>
              {measurements.map((measurement: any) => (
                <motion.div
                  key={measurement.timestamp}
                  className="absolute pointer-events-none"
                  style={{
                    left: measurement.point.x,
                    top: measurement.point.y,
                    transform: 'translate(-50%, -50%)'
                  }}
                  initial={{ scale: 0, opacity: 1 }}
                  animate={prefersReducedMotion ? {} : { scale: 2, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={prefersReducedMotion ? { duration: 0 } : { duration: 1  }}
                >
                  <div className={cn("glass-w-4 glass-h-4 glass-border-2 glass-border-danger glass-radius-full")} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Quantum statistics */}
          <div className={cn(
            "glass-p-4 glass-radius-lg glass-border-subtle glass-space-y-3",
            createGlassStyle({ variant: 'default' })
          )}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className={cn("glass-text-secondary")}>Uncertainty:</span>
                <div className={cn("glass-flex glass-items-center glass-space-x-2 glass-mt-1")}>
                  <div className={cn("glass-flex-1 glass-h-2 glass-surface-muted glass-radius-full glass-overflow-hidden")}>
                    <motion.div
                      className={cn("glass-h-full glass-gradient-primary glass-radius-full")}
                      animate={{ width: `${Math.min(100, totalUncertainty * 100)}%` }}
                      transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.3  }}
                    />
                  </div>
                  <span className={cn("glass-text-primary glass-text-xs")}>
                    {(totalUncertainty * 100).toFixed(1)}%
                  </span>
                </div>
              </div>

              <div>
                <span className={cn("glass-text-secondary")}>Avg Probability:</span>
                <div className={cn("glass-text-primary glass-font-medium")}>
                  {(averageProbability * 100).toFixed(1)}%
                </div>
              </div>

              <div>
                <span className={cn("glass-text-secondary")}>Coherence:</span>
                <div className={cn("glass-text-primary glass-font-medium")}>
                  {Math.max(0, Math.min(100, quantumCoherence * 100)).toFixed(1)}%
                </div>
              </div>

              <div>
                <span className={cn("glass-text-secondary")}>Measurements:</span>
                <div className={cn("glass-text-primary glass-font-medium")}>
                  {measurements.length}
                </div>
              </div>
            </div>

            {/* Recent measurements */}
            {measurements.length > 0 && (
              <div className="space-y-1">
                <span className={cn("glass-text-secondary glass-text-sm")}>Recent Measurements:</span>
                <div className="flex flex-wrap gap-1">
                  {measurements.slice(-5).map((measurement: any) => (
                    <div
                      key={measurement.timestamp}
                      className={cn("glass-px-2 glass-py-1 glass-text-xs glass-surface-muted glass-radius glass-border-subtle")}
                    >
                      P: {(measurement.point.probability * 100).toFixed(0)}%
                      {measurement.uncertainty > 0.5 && (
                        <span className="text-primary ml-1">±{measurement.uncertainty.toFixed(1)}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className={cn("glass-flex glass-items-center glass-justify-between glass-text-sm glass-text-muted")}>
            <span>Click particles to measure • Hover to observe</span>
            <div className="flex items-center space-x-4">
              {uncertaintyPrinciple && (
                <span className="flex items-center space-x-1">
                  <span>⚛</span>
                  <span>Heisenberg</span>
                </span>
              )}
              {waveParticleDuality && (
                <span className="flex items-center space-x-1">
                  <span>〰️</span>
                  <span>Wave-Particle</span>
                </span>
              )}
              {realTimeMode && (
                <span className="flex items-center space-x-1 text-primary">
                  <div className={cn("glass-w-2 glass-h-2 glass-surface-success glass-radius-full glass-animate-pulse")} />
                  <span>Live</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </OptimizedGlass>
    )
  }
)