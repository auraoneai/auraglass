'use client'

import React from 'react';
import { motion } from 'framer-motion'
import { forwardRef, useCallback, useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { useMotionPreference } from '../../hooks/useMotionPreference'
import { OptimizedGlass } from '../../primitives'
import { useA11yId } from '../../utils/a11y'
import { createGlassStyle } from '../../utils/createGlassStyle'
import { useGlassSound } from '../../utils/soundDesign'

export interface AudioSettings {
  volume: number
  gain: number
  bassBoost: number
  trebleBoost: number
  smoothing: number
  fftSize: number
}

export interface VisualizationSettings {
  mode: 'bars' | 'wave' | 'circular' | 'spectrum' | 'particles' | 'ripples'
  colorScheme: 'rainbow' | 'monochrome' | 'neon' | 'fire' | 'ice' | 'galaxy'
  particleCount: number
  sensitivity: number
  symmetry: boolean
  mirror: boolean
}

export interface GlassMusicVisualizerProps {
  audioSource?: string | MediaStream
  audioSettings?: Partial<AudioSettings>
  visualSettings?: Partial<VisualizationSettings>
  showControls?: boolean
  showFrequencyDisplay?: boolean
  showWaveform?: boolean
  showSpectrum?: boolean
  realTimeAnalysis?: boolean
  enableInteraction?: boolean
  enableRecording?: boolean
  canvasWidth?: number
  canvasHeight?: number
  onAudioLoad?: (duration: number) => void
  onFrequencyData?: (data: Uint8Array) => void
  onBeatDetected?: (intensity: number) => void
  className?: string
}

const defaultAudioSettings: AudioSettings = {
  volume: 0.8,
  gain: 1.0,
  bassBoost: 0,
  trebleBoost: 0,
  smoothing: 0.8,
  fftSize: 256
}

const defaultVisualSettings: VisualizationSettings = {
  mode: 'bars',
  colorScheme: 'rainbow',
  particleCount: 100,
  sensitivity: 1.0,
  symmetry: false,
  mirror: false
}

const colorSchemes = {
  rainbow: ['#ff0000', '#ff8000', '#ffff00', '#80ff00', '#00ff00', '#00ff80', '#00ffff', '#0080ff', '#0000ff', '#8000ff'],
  monochrome: ['#ffffff', '#e0e0e0', '#c0c0c0', '#a0a0a0', '#808080', '#606060', '#404040', '#202020'],
  neon: ['#ff00ff', '#ff0080', '#ff0040', '#ff8040', '#ffff40', '#80ff40', '#40ff40', '#40ff80', '#40ffff', '#4080ff'],
  fire: ['#ffff00', '#ffcc00', '#ff9900', '#ff6600', '#ff3300', '#ff0000', '#cc0000', '#990000'],
  ice: ['#ffffff', '#e0f0ff', '#c0e0ff', '#a0d0ff', '#80c0ff', '#60b0ff', '#40a0ff', '#2090ff'],
  galaxy: ['#1a1a2e', '#16213e', '#0f3460', '#533483', '#7209b7', '#a663cc', '#4cc9f0']
}

export const GlassMusicVisualizer = forwardRef<HTMLDivElement, GlassMusicVisualizerProps>(
  ({
    audioSource,
    audioSettings = {},
    visualSettings = {},
    showControls = true,
    showFrequencyDisplay = true,
    showWaveform = true,
    showSpectrum = true,
    realTimeAnalysis = true,
    enableInteraction = true,
    enableRecording = false,
    canvasWidth = 800,
    canvasHeight = 400,
    onAudioLoad,
    onFrequencyData,
    onBeatDetected,
    className='',
    ...props
  }, ref) => {
    const [isPlaying, setIsPlaying] = useState(false)
    const [isRecording, setIsRecording] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [frequencyData, setFrequencyData] = useState<Uint8Array>(new Uint8Array(128))
    const [waveformData, setWaveformData] = useState<Uint8Array>(new Uint8Array(128))
    const [beatIntensity, setBeatIntensity] = useState(0)
    
    const [audioConfig, setAudioConfig] = useState<AudioSettings>({
      ...defaultAudioSettings,
      ...audioSettings
    })
    
    const [visualConfig, setVisualConfig] = useState<VisualizationSettings>({
      ...defaultVisualSettings,
      ...visualSettings
    })
    
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const audioRef = useRef<HTMLAudioElement>(null)
    const audioContextRef = useRef<AudioContext | null>(null)
    const analyserRef = useRef<AnalyserNode | null>(null)
    const sourceRef = useRef<AudioBufferSourceNode | null>(null)
    const animationFrameRef = useRef<number>()
    const particles = useRef<Array<{
      x: number
      y: number
      vx: number
      vy: number
      size: number
      color: string
      life: number
    }>>([])
    
    const id = useA11yId('glass-music-visualizer')
    const { shouldAnimate } = useMotionPreference()
    const { play } = useGlassSound()

    // Initialize audio context and analyser
    const initializeAudio = useCallback(async () => {
      try {
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
        }

        const context = audioContextRef.current
        const analyser = context.createAnalyser()
        analyser.fftSize = audioConfig.fftSize
        analyser.smoothingTimeConstant = audioConfig.smoothing

        analyserRef.current = analyser

        // Initialize frequency and waveform data arrays
        const bufferLength = analyser.frequencyBinCount
        setFrequencyData(new Uint8Array(bufferLength))
        setWaveformData(new Uint8Array(bufferLength))

        // Connect audio source if provided
        if (audioSource && typeof audioSource === 'string') {
          const audio = audioRef.current
          if (audio) {
            audio.src = audioSource
            const source = context.createMediaElementSource(audio)
            source.connect(analyser)
            analyser.connect(context.destination)
            sourceRef.current = source as any
          }
        } else if (audioSource instanceof MediaStream) {
          const source = context.createMediaStreamSource(audioSource)
          source.connect(analyser)
          analyser.connect(context.destination)
          sourceRef.current = source as any
        }

      } catch (error) {
        console.error('Failed to initialize audio:', error)
      }
    }, [audioSource, audioConfig.fftSize, audioConfig.smoothing])

    // Beat detection algorithm
    const detectBeat = useCallback((frequencyData: Uint8Array) => {
      const bassRange = Math.floor(frequencyData.length * 0.1)
      const midRange = Math.floor(frequencyData.length * 0.3)
      
      let bassSum = 0
      let midSum = 0
      
      for (let i = 0; i < bassRange; i++) {
        bassSum += frequencyData[i]
      }
      
      for (let i = bassRange; i < midRange; i++) {
        midSum += frequencyData[i]
      }
      
      const bassAvg = bassSum / bassRange
      const midAvg = midSum / (midRange - bassRange)
      const intensity = (bassAvg + midAvg) / 2 / 255
      
      setBeatIntensity(intensity)
      
      if (intensity > 0.7) {
        onBeatDetected?.(intensity)
      }
      
      return intensity
    }, [onBeatDetected])

    // Visualization rendering
    const renderVisualization = useCallback(() => {
      const canvas = canvasRef.current
      const analyser = analyserRef.current
      
      if (!canvas || !analyser) return

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      // Update data arrays
      const frequencyArray = new Uint8Array(analyser.frequencyBinCount)
      const waveformArray = new Uint8Array(analyser.frequencyBinCount)
      
      analyser.getByteFrequencyData(frequencyArray)
      analyser.getByteTimeDomainData(waveformArray)
      
      setFrequencyData(frequencyArray)
      setWaveformData(waveformArray)
      onFrequencyData?.(frequencyArray)

      // Detect beats
      const beat = detectBeat(frequencyArray)

      // Clear canvas
      ctx.fillStyle = 'rgba(var(--glass-color-black) / var(--glass-opacity-10))'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Get colors for current scheme
      const colors = colorSchemes[visualConfig.colorScheme] || colorSchemes.rainbow

      switch (visualConfig.mode) {
        case 'bars':
          renderBars(ctx, frequencyArray, colors, beat)
          break
        case 'wave':
          renderWave(ctx, waveformArray, colors, beat)
          break
        case 'circular':
          renderCircular(ctx, frequencyArray, colors, beat)
          break
        case 'spectrum':
          renderSpectrum(ctx, frequencyArray, colors, beat)
          break
        case 'particles':
          renderParticles(ctx, frequencyArray, colors, beat)
          break
        case 'ripples':
          renderRipples(ctx, frequencyArray, colors, beat)
          break
      }

      if (realTimeAnalysis && isPlaying) {
        animationFrameRef.current = requestAnimationFrame(renderVisualization)
      }
    }, [visualConfig, realTimeAnalysis, isPlaying, detectBeat, onFrequencyData])

    // Visualization modes
    const renderBars = (ctx: CanvasRenderingContext2D, data: Uint8Array, colors: string[], beat: number) => {
      const barWidth = ctx.canvas.width / data.length
      const heightScale = visualConfig.sensitivity

      for (let i = 0; i < data.length; i++) {
        const barHeight = (data[i] / 255) * ctx.canvas.height * heightScale
        const colorIndex = Math.floor((i / data.length) * colors.length)
        
        // Add beat intensity to color brightness
        const alpha = Math.max(0.3, beat)
        ctx.fillStyle = colors[colorIndex] + Math.floor(alpha * 255).toString(16).padStart(2, '0')
        
        ctx.fillRect(i * barWidth, ctx.canvas.height - barHeight, barWidth - 1, barHeight)
        
        // Mirror effect
        if (visualConfig.mirror) {
          ctx.fillRect(i * barWidth, 0, barWidth - 1, barHeight)
        }
      }
    }

    const renderWave = (ctx: CanvasRenderingContext2D, data: Uint8Array, colors: string[], beat: number) => {
      ctx.lineWidth = 2 + beat * 3
      ctx.strokeStyle = colors[Math.floor(beat * colors.length)]
      
      ctx.beginPath()
      const sliceWidth = ctx.canvas.width / data.length
      let x = 0

      for (let i = 0; i < data.length; i++) {
        const v = (data[i] / 128.0) * visualConfig.sensitivity
        const y = (v * ctx.canvas.height) / 2

        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }

        x += sliceWidth
      }

      ctx.stroke()
    }

    const renderCircular = (ctx: CanvasRenderingContext2D, data: Uint8Array, colors: string[], beat: number) => {
      const centerX = ctx.canvas.width / 2
      const centerY = ctx.canvas.height / 2
      const radius = Math.min(centerX, centerY) * 0.7
      
      for (let i = 0; i < data.length; i++) {
        const angle = (i / data.length) * Math.PI * 2
        const amplitude = (data[i] / 255) * radius * visualConfig.sensitivity * 0.5
        
        const x1 = centerX + Math.cos(angle) * radius
        const y1 = centerY + Math.sin(angle) * radius
        const x2 = centerX + Math.cos(angle) * (radius + amplitude)
        const y2 = centerY + Math.sin(angle) * (radius + amplitude)
        
        const colorIndex = Math.floor((i / data.length) * colors.length)
        ctx.strokeStyle = colors[colorIndex]
        ctx.lineWidth = 1 + beat * 2
        
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.stroke()
      }
    }

    const renderSpectrum = (ctx: CanvasRenderingContext2D, data: Uint8Array, colors: string[], beat: number) => {
      const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height)
      const pixels = imageData.data
      
      // Shift existing data left
      for (let x = 0; x < ctx.canvas.width - 1; x++) {
        for (let y = 0; y < ctx.canvas.height; y++) {
          const sourceIndex = ((y * ctx.canvas.width) + x + 1) * 4
          const targetIndex = ((y * ctx.canvas.width) + x) * 4
          
          pixels[targetIndex] = pixels[sourceIndex]
          pixels[targetIndex + 1] = pixels[sourceIndex + 1]
          pixels[targetIndex + 2] = pixels[sourceIndex + 2]
          pixels[targetIndex + 3] = pixels[sourceIndex + 3]
        }
      }
      
      // Add new column
      const x = ctx.canvas.width - 1
      for (let i = 0; i < data.length; i++) {
        const y = Math.floor((i / data.length) * ctx.canvas.height)
        const intensity = data[i] / 255
        const colorIndex = Math.floor(intensity * colors.length)
        const color = colors[colorIndex] || '#ffffff'
        
        const r = parseInt(color.slice(1, 3), 16)
        const g = parseInt(color.slice(3, 5), 16)
        const b = parseInt(color.slice(5, 7), 16)
        
        const index = (y * ctx.canvas.width + x) * 4
        pixels[index] = r * intensity
        pixels[index + 1] = g * intensity
        pixels[index + 2] = b * intensity
        pixels[index + 3] = 255 * intensity
      }
      
      ctx.putImageData(imageData, 0, 0)
    }

    const renderParticles = (ctx: CanvasRenderingContext2D, data: Uint8Array, colors: string[], beat: number) => {
      // Update existing particles
      particles.current = particles.current.filter((particle: any) => {
        particle.x += particle.vx
        particle.y += particle.vy
        particle.life -= 0.01
        particle.vy += 0.1 // gravity
        
        return particle.life > 0 && 
               particle.x >= 0 && particle.x <= ctx.canvas.width &&
               particle.y >= 0 && particle.y <= ctx.canvas.height
      })
      
      // Create new particles based on frequency data
      for (let i = 0; i < data.length; i += 4) {
        if (particles.current.length < visualConfig.particleCount) {
          const intensity = data[i] / 255
          if (intensity > 0.1) {
            particles.current.push({
              x: (i / data.length) * ctx.canvas.width,
              y: ctx.canvas.height - (intensity * ctx.canvas.height * 0.5),
              vx: (Math.random() - 0.5) * 4,
              vy: -Math.random() * intensity * 5,
              size: intensity * 5 + 1,
              color: colors[Math.floor(intensity * colors.length)],
              life: 1.0
            })
          }
        }
      }
      
      // Render particles
      particles.current.forEach((particle: any) => {
        ctx.save()
        ctx.globalAlpha = particle.life
        ctx.fillStyle = particle.color
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      })
    }

    const renderRipples = (ctx: CanvasRenderingContext2D, data: Uint8Array, colors: string[], beat: number) => {
      const centerX = ctx.canvas.width / 2
      const centerY = ctx.canvas.height / 2
      
      // Calculate average intensity
      const avgIntensity = data.reduce((sum, val) => sum + val, 0) / data.length / 255
      
      // Draw ripples based on beat intensity
      if (beat > 0.3) {
        const rippleCount = 5
        for (let i = 0; i < rippleCount; i++) {
          const radius = (beat * 200) + (i * 50)
          const alpha = Math.max(0, 1 - (radius / 300))
          
          ctx.strokeStyle = colors[i % colors.length] + Math.floor(alpha * 255).toString(16).padStart(2, '0')
          ctx.lineWidth = 3
          ctx.beginPath()
          ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
          ctx.stroke()
        }
      }
      
      // Add frequency-based elements
      for (let i = 0; i < data.length; i += 8) {
        const angle = (i / data.length) * Math.PI * 2
        const intensity = data[i] / 255
        const radius = intensity * 100 + 50
        
        const x = centerX + Math.cos(angle) * radius
        const y = centerY + Math.sin(angle) * radius
        
        ctx.fillStyle = colors[Math.floor(intensity * colors.length)]
        ctx.beginPath()
        ctx.arc(x, y, intensity * 5 + 1, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // Audio controls
    const handlePlay = useCallback(async () => {
      if (!audioContextRef.current) {
        await initializeAudio()
      }
      
      if (audioRef.current) {
        try {
          await audioRef.current.play()
          setIsPlaying(true)
          renderVisualization()
          play('play')
        } catch (error) {
          console.error('Failed to play audio:', error)
        }
      }
    }, [initializeAudio, renderVisualization, play])

    const handlePause = useCallback(() => {
      if (audioRef.current) {
        audioRef.current.pause()
        setIsPlaying(false)
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current)
        }
        play('pause')
      }
    }, [play])

    const handleStop = useCallback(() => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
        setIsPlaying(false)
        setCurrentTime(0)
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current)
        }
        play('stop')
      }
    }, [play])

    // Initialize on mount
    useEffect(() => {
      if (audioSource) {
        initializeAudio()
      }
      
      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current)
        }
        if (audioContextRef.current) {
          audioContextRef.current.close()
        }
      }
    }, [audioSource, initializeAudio])

    // Update canvas size
    useEffect(() => {
      const canvas = canvasRef.current
      if (canvas) {
        canvas.width = canvasWidth
        canvas.height = canvasHeight
      }
    }, [canvasWidth, canvasHeight])

    const Controls = () => (
      <div className="flex items-center space-x-4">
        <motion.button
          className="p-2 glass-surface-blue hover:glass-surface-blue text-primary glass-radius-lg transition-colors"
          whileHover={shouldAnimate ? { scale: 1.1 } : {}}
          whileTap={shouldAnimate ? { scale: 0.9 } : {}}
          onClick={isPlaying ? handlePause : handlePlay}
        >
          {isPlaying ? '⏸️' : '▶️'}
        </motion.button>

        <motion.button
          className="p-2 glass-surface-primary hover:glass-surface-primary text-primary glass-radius-lg transition-colors"
          whileHover={shouldAnimate ? { scale: 1.1 } : {}}
          whileTap={shouldAnimate ? { scale: 0.9 } : {}}
          onClick={handleStop}
        >
          ⏹️
        </motion.button>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-primary/60">
            {Math.floor(currentTime / 60)}:{Math.floor(currentTime % 60).toString().padStart(2, '0')}
          </span>
          <span className="text-primary/40">/</span>
          <span className="text-xs text-primary/60">
            {Math.floor(duration / 60)}:{Math.floor(duration % 60).toString().padStart(2, '0')}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-primary/80">Volume:</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={audioConfig.volume}
            onChange={(e) => {
              const volume = parseFloat(e.target.value)
              setAudioConfig((prev: any) => ({ ...prev, volume }))
              if (audioRef.current) {
                audioRef.current.volume = volume
              }
            }}
            className="w-16 h-2 glass-surface-subtle/20 glass-radius-lg appearance-none cursor-pointer"
          />
        </div>
      </div>
    )

    return (
      <OptimizedGlass
        ref={ref}
        variant="frosted"
        className={`p-6 space-y-6 ${className}`}
        {...props}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-primary/90">
              Music Visualizer
            </h3>
            <p className="text-sm text-primary/60">
              Real-time audio visualization and analysis
            </p>
          </div>

          <div className="flex items-center space-x-2">
            {realTimeAnalysis && (
              <div className="flex items-center space-x-1 text-primary">
                <div className="w-2 h-2 glass-surface-green glass-radius-full animate-pulse" />
                <span className="text-xs">Live</span>
              </div>
            )}
            {isRecording && (
              <div className="flex items-center space-x-1 text-primary">
                <div className="w-2 h-2 glass-surface-red glass-radius-full animate-pulse" />
                <span className="text-xs">Recording</span>
              </div>
            )}
          </div>
        </div>

        {/* Audio element */}
        {audioSource && typeof audioSource === 'string' && (
          <audio
            ref={audioRef}
            src={audioSource}
            onLoadedMetadata={() => {
              if (audioRef.current) {
                setDuration(audioRef.current.duration)
                onAudioLoad?.(audioRef.current.duration)
              }
            }}
            onTimeUpdate={() => {
              if (audioRef.current) {
                setCurrentTime(audioRef.current.currentTime)
              }
            }}
          />
        )}

        {/* Controls */}
        {showControls && <Controls />}

        {/* Main visualization canvas */}
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={canvasWidth}
            height={canvasHeight}
            className={`
              w-full border border-white/20 rounded-lg bg-black/20
              ${enableInteraction ? 'cursor-pointer' : ''}
            `}
            onClick={enableInteraction ? (isPlaying ? handlePause : handlePlay) : undefined}
          />
          
          {/* Beat intensity indicator */}
          <div className="absolute glass--glass--glass--glass--glass--glass--glass--glass--glass--glassglass--glassglass--top-2 right-2">
            <div 
              className="w-4 h-4 glass-radius-full glass-surface-red"
              style={{ 
                opacity: beatIntensity,
                transform: `scale(${1 + beatIntensity})` 
              }}
            />
          </div>
        </div>

        {/* Visualization controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-primary/80">Visualization</h4>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-primary/70 mb-1">Mode</label>
                <select
                  value={visualConfig.mode}
                  onChange={(e) => setVisualConfig((prev: any) => ({ 
                    ...prev, 
                    mode: e.target.value as any 
                  }))}
                  className="w-full p-2 glass-surface-subtle/10 border border-white/20 glass-radius-lg text-primary/90 text-sm"
                >
                  <option value="bars">Frequency Bars</option>
                  <option value="wave">Waveform</option>
                  <option value="circular">Circular</option>
                  <option value="spectrum">Spectrum</option>
                  <option value="particles">Particles</option>
                  <option value="ripples">Ripples</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-primary/70 mb-1">Color Scheme</label>
                <select
                  value={visualConfig.colorScheme}
                  onChange={(e) => setVisualConfig((prev: any) => ({ 
                    ...prev, 
                    colorScheme: e.target.value as any 
                  }))}
                  className="w-full p-2 glass-surface-subtle/10 border border-white/20 glass-radius-lg text-primary/90 text-sm"
                >
                  <option value="rainbow">Rainbow</option>
                  <option value="monochrome">Monochrome</option>
                  <option value="neon">Neon</option>
                  <option value="fire">Fire</option>
                  <option value="ice">Ice</option>
                  <option value="galaxy">Galaxy</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-primary/70 mb-1">
                  Sensitivity: {visualConfig.sensitivity.toFixed(1)}
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="3.0"
                  step="0.1"
                  value={visualConfig.sensitivity}
                  onChange={(e) => setVisualConfig((prev: any) => ({ 
                    ...prev, 
                    sensitivity: parseFloat(e.target.value) 
                  }))}
                  className="w-full h-2 glass-surface-subtle/20 glass-radius-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-medium text-primary/80">Audio Settings</h4>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-primary/70 mb-1">
                  Smoothing: {audioConfig.smoothing.toFixed(1)}
                </label>
                <input
                  type="range"
                  min="0.0"
                  max="1.0"
                  step="0.1"
                  value={audioConfig.smoothing}
                  onChange={(e) => {
                    const smoothing = parseFloat(e.target.value)
                    setAudioConfig((prev: any) => ({ ...prev, smoothing }))
                    if (analyserRef.current) {
                      analyserRef.current.smoothingTimeConstant = smoothing
                    }
                  }}
                  className="w-full h-2 glass-surface-subtle/20 glass-radius-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs text-primary/70 mb-1">FFT Size</label>
                <select
                  value={audioConfig.fftSize}
                  onChange={(e) => setAudioConfig((prev: any) => ({ 
                    ...prev, 
                    fftSize: parseInt(e.target.value) 
                  }))}
                  className="w-full p-2 glass-surface-subtle/10 border border-white/20 glass-radius-lg text-primary/90 text-sm"
                >
                  <option value="128">128</option>
                  <option value="256">256</option>
                  <option value="512">512</option>
                  <option value="1024">1024</option>
                  <option value="2048">2048</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Frequency display */}
        {showFrequencyDisplay && (
          <div className={`
            p-3 rounded-lg border border-white/10
            ${createGlassStyle({ blur: 'sm', opacity: 0.6 }).background}
          `}>
            <h4 className="text-sm font-medium text-primary/80 mb-2">Frequency Analysis</h4>
            <div className="grid grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-primary/60">Bass:</span>
                <div className="text-primary/90 font-medium">
                  {Math.round((frequencyData.slice(0, 8).reduce((a, b) => a + b, 0) / 8 / 255) * 100)}%
                </div>
              </div>
              <div>
                <span className="text-primary/60">Mid:</span>
                <div className="text-primary/90 font-medium">
                  {Math.round((frequencyData.slice(8, 32).reduce((a, b) => a + b, 0) / 24 / 255) * 100)}%
                </div>
              </div>
              <div>
                <span className="text-primary/60">Treble:</span>
                <div className="text-primary/90 font-medium">
                  {Math.round((frequencyData.slice(32).reduce((a, b) => a + b, 0) / (frequencyData.length - 32) / 255) * 100)}%
                </div>
              </div>
              <div>
                <span className="text-primary/60">Beat:</span>
                <div className="text-primary/90 font-medium">
                  {Math.round(beatIntensity * 100)}%
                </div>
              </div>
            </div>
          </div>
        )}
      </OptimizedGlass>
    )
  }
)

GlassMusicVisualizer.displayName = 'GlassMusicVisualizer'