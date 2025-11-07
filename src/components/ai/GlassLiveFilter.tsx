'use client'
import { cn } from '@/lib/utils';

import React, { forwardRef, useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { OptimizedGlass } from '../../primitives'
import { useA11yId } from '../../utils/a11y'
import { useMotionPreference } from '../../hooks/useMotionPreference'
import { useGlassSound } from '../../utils/soundDesign'
import { createGlassStyle } from '../../utils/createGlassStyle'

export interface FilterEffect {
  id: string
  name: string
  description: string
  category: 'artistic' | 'color' | 'blur' | 'distortion' | 'vintage' | 'modern'
  intensity: number
  parameters?: { [key: string]: number | string }
}

export interface ProcessingSettings {
  quality: 'low' | 'medium' | 'high' | 'ultra'
  fps: number
  enableGPU: boolean
  batchSize: number
}

export interface GlassLiveFilterProps {
  videoSource?: string | MediaStream
  imageSource?: string
  availableFilters?: FilterEffect[]
  selectedFilters?: string[]
  processingSettings?: Partial<ProcessingSettings>
  showFilterLibrary?: boolean
  showPreview?: boolean
  showControls?: boolean
  enableRealTimeProcessing?: boolean
  enableChaining?: boolean
  enableCustomFilters?: boolean
  maxFilters?: number
  canvasWidth?: number
  canvasHeight?: number
  onFilterApply?: (filterId: string, params: any) => void
  onProcessingComplete?: (processedData: string) => void
  onError?: (error: Error) => void
  className?: string
}

const defaultFilters: FilterEffect[] = [
  {
    id: 'grayscale',
    name: 'Grayscale',
    description: 'Convert to black and white',
    category: 'color',
    intensity: 1.0,
    parameters: { strength: 1.0 }
  },
  {
    id: 'sepia',
    name: 'Sepia',
    description: 'Vintage sepia tone effect',
    category: 'vintage',
    intensity: 0.8,
    parameters: { warmth: 0.8 }
  },
  {
    id: 'blur',
    name: 'Gaussian Blur',
    description: 'Smooth blur effect',
    category: 'blur',
    intensity: 1.0,
    parameters: { radius: 5 }
  },
  {
    id: 'sharpen',
    name: 'Sharpen',
    description: 'Enhance image details',
    category: 'artistic',
    intensity: 0.6,
    parameters: { amount: 0.6 }
  },
  {
    id: 'brightness',
    name: 'Brightness',
    description: 'Adjust image brightness',
    category: 'color',
    intensity: 1.2,
    parameters: { level: 1.2 }
  },
  {
    id: 'contrast',
    name: 'Contrast',
    description: 'Adjust image contrast',
    category: 'color',
    intensity: 1.3,
    parameters: { level: 1.3 }
  },
  {
    id: 'saturation',
    name: 'Saturation',
    description: 'Adjust color saturation',
    category: 'color',
    intensity: 1.5,
    parameters: { level: 1.5 }
  },
  {
    id: 'hue-shift',
    name: 'Hue Shift',
    description: 'Shift color hues',
    category: 'color',
    intensity: 0.5,
    parameters: { degrees: 30 }
  },
  {
    id: 'edge-detect',
    name: 'Edge Detection',
    description: 'Detect and highlight edges',
    category: 'artistic',
    intensity: 1.0,
    parameters: { threshold: 0.5 }
  },
  {
    id: 'emboss',
    name: 'Emboss',
    description: '3D embossed effect',
    category: 'artistic',
    intensity: 0.8,
    parameters: { strength: 0.8 }
  },
  {
    id: 'vintage',
    name: 'Vintage Film',
    description: 'Old film camera effect',
    category: 'vintage',
    intensity: 0.9,
    parameters: { grain: 0.3, vignette: 0.5 }
  },
  {
    id: 'neon',
    name: 'Neon Glow',
    description: 'Cyberpunk neon effect',
    category: 'modern',
    intensity: 1.2,
    parameters: { glow: 1.2, color: '#ff00ff' }
  }
]

const defaultProcessingSettings: ProcessingSettings = {
  quality: 'medium',
  fps: 30,
  enableGPU: true,
  batchSize: 4
}

export const GlassLiveFilter = forwardRef<HTMLDivElement, GlassLiveFilterProps>(
  ({
    videoSource,
    imageSource,
    availableFilters = defaultFilters,
    selectedFilters = [],
    processingSettings = {},
    showFilterLibrary = true,
    showPreview = true,
    showControls = true,
    enableRealTimeProcessing = true,
    enableChaining = true,
    enableCustomFilters = false,
    maxFilters = 5,
    canvasWidth = 800,
    canvasHeight = 600,
    onFilterApply,
    onProcessingComplete,
    onError,
    className='',
    ...props
  }, ref) => {
    const [isProcessing, setIsProcessing] = useState(false)
    const [activeFilters, setActiveFilters] = useState<string[]>(selectedFilters)
    const [filterParameters, setFilterParameters] = useState<{ [key: string]: any }>({})
    const [processedImageUrl, setProcessedImageUrl] = useState<string>('')
    const [originalImageUrl, setOriginalImageUrl] = useState<string>(imageSource || '')
    const [processingProgress, setProcessingProgress] = useState(0)
    
    const [settings, setSettings] = useState<ProcessingSettings>({
      ...defaultProcessingSettings,
      ...processingSettings
    })
    
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const videoRef = useRef<HTMLVideoElement>(null)
    const animationFrameRef = useRef<number>()
    const processedCanvasRef = useRef<HTMLCanvasElement>(null)
    
    const id = useA11yId('glass-live-filter')
    const { shouldAnimate } = useMotionPreference()
    const { play } = useGlassSound()

    // Initialize video stream
    const initializeVideo = useCallback(async () => {
      const video = videoRef.current
      if (!video) return

      try {
        if (videoSource instanceof MediaStream) {
          video.srcObject = videoSource
        } else if (typeof videoSource === 'string') {
          video.src = videoSource
        }
        await video.play()
      } catch (error) {
        onError?.(error as Error)
      }
    }, [videoSource, onError])

    // Apply filters to image data
    const applyFilters = useCallback((
      imageData: ImageData,
      filters: FilterEffect[]
    ): ImageData => {
      let processedData = new ImageData(
        new Uint8ClampedArray(imageData.data),
        imageData.width,
        imageData.height
      )

      filters.forEach((filter: any) => {
        const params = filterParameters[filter.id] || filter.parameters || {}
        
        switch (filter.id) {
          case 'grayscale':
            processedData = applyGrayscale(processedData, params.strength || 1.0)
            break
          case 'sepia':
            processedData = applySepia(processedData, params.warmth || 0.8)
            break
          case 'blur':
            // Simplified blur - in production would use proper convolution
            processedData = applyBlur(processedData, params.radius || 5)
            break
          case 'brightness':
            processedData = applyBrightness(processedData, params.level || 1.2)
            break
          case 'contrast':
            processedData = applyContrast(processedData, params.level || 1.3)
            break
          case 'saturation':
            processedData = applySaturation(processedData, params.level || 1.5)
            break
          case 'hue-shift':
            processedData = applyHueShift(processedData, params.degrees || 30)
            break
          case 'edge-detect':
            processedData = applyEdgeDetection(processedData, params.threshold || 0.5)
            break
          case 'emboss':
            processedData = applyEmboss(processedData, params.strength || 0.8)
            break
          case 'vintage':
            processedData = applyVintage(processedData, params)
            break
          case 'neon':
            processedData = applyNeonGlow(processedData, params)
            break
        }
      })

      return processedData
    }, [filterParameters])

    // Filter implementations
    const applyGrayscale = (imageData: ImageData, strength: number): ImageData => {
      const data = imageData.data
      for (let i = 0; i < data.length; i += 4) {
        const gray = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2])
        data[i] = data[i] + (gray - data[i]) * strength
        data[i + 1] = data[i + 1] + (gray - data[i + 1]) * strength
        data[i + 2] = data[i + 2] + (gray - data[i + 2]) * strength
      }
      return imageData
    }

    const applySepia = (imageData: ImageData, warmth: number): ImageData => {
      const data = imageData.data
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i]
        const g = data[i + 1]
        const b = data[i + 2]
        
        const tr = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189))
        const tg = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168))
        const tb = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131))
        
        data[i] = r + (tr - r) * warmth
        data[i + 1] = g + (tg - g) * warmth
        data[i + 2] = b + (tb - b) * warmth
      }
      return imageData
    }

    const applyBlur = (imageData: ImageData, radius: number): ImageData => {
      // Simplified box blur - in production would use Gaussian
      const data = imageData.data
      const width = imageData.width
      const height = imageData.height
      const output = new Uint8ClampedArray(data)
      
      const blurRadius = Math.floor(radius)
      for (let y = blurRadius; y < height - blurRadius; y++) {
        for (let x = blurRadius; x < width - blurRadius; x++) {
          let r = 0, g = 0, b = 0, a = 0
          let count = 0
          
          for (let dy = -blurRadius; dy <= blurRadius; dy++) {
            for (let dx = -blurRadius; dx <= blurRadius; dx++) {
              const idx = ((y + dy) * width + (x + dx)) * 4
              r += data[idx]
              g += data[idx + 1]
              b += data[idx + 2]
              a += data[idx + 3]
              count++
            }
          }
          
          const idx = (y * width + x) * 4
          output[idx] = r / count
          output[idx + 1] = g / count
          output[idx + 2] = b / count
          output[idx + 3] = a / count
        }
      }
      
      return new ImageData(output, width, height)
    }

    const applyBrightness = (imageData: ImageData, level: number): ImageData => {
      const data = imageData.data
      const factor = level
      for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, data[i] * factor)
        data[i + 1] = Math.min(255, data[i + 1] * factor)
        data[i + 2] = Math.min(255, data[i + 2] * factor)
      }
      return imageData
    }

    const applyContrast = (imageData: ImageData, level: number): ImageData => {
      const data = imageData.data
      const factor = level
      const intercept = 128 * (1 - factor)
      
      for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.max(0, Math.min(255, data[i] * factor + intercept))
        data[i + 1] = Math.max(0, Math.min(255, data[i + 1] * factor + intercept))
        data[i + 2] = Math.max(0, Math.min(255, data[i + 2] * factor + intercept))
      }
      return imageData
    }

    const applySaturation = (imageData: ImageData, level: number): ImageData => {
      const data = imageData.data
      for (let i = 0; i < data.length; i += 4) {
        const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
        data[i] = gray + (data[i] - gray) * level
        data[i + 1] = gray + (data[i + 1] - gray) * level
        data[i + 2] = gray + (data[i + 2] - gray) * level
      }
      return imageData
    }

    const applyHueShift = (imageData: ImageData, degrees: number): ImageData => {
      const data = imageData.data
      const radians = degrees * Math.PI / 180
      
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i] / 255
        const g = data[i + 1] / 255
        const b = data[i + 2] / 255
        
        // Convert RGB to HSL, shift hue, convert back
        const max = Math.max(r, g, b)
        const min = Math.min(r, g, b)
        const diff = max - min
        
        if (diff === 0) continue
        
        let h = 0
        if (max === r) h = ((g - b) / diff) % 6
        else if (max === g) h = (b - r) / diff + 2
        else h = (r - g) / diff + 4
        
        h = (h * 60 + degrees) % 360
        if (h < 0) h += 360
        
        const l = (max + min) / 2
        const s = diff / (1 - Math.abs(2 * l - 1))
        
        // Convert back to RGB
        const c = (1 - Math.abs(2 * l - 1)) * s
        const x = c * (1 - Math.abs((h / 60) % 2 - 1))
        const m = l - c / 2
        
        let nr = 0, ng = 0, nb = 0
        if (h < 60) { nr = c; ng = x; nb = 0 }
        else if (h < 120) { nr = x; ng = c; nb = 0 }
        else if (h < 180) { nr = 0; ng = c; nb = x }
        else if (h < 240) { nr = 0; ng = x; nb = c }
        else if (h < 300) { nr = x; ng = 0; nb = c }
        else { nr = c; ng = 0; nb = x }
        
        data[i] = Math.round((nr + m) * 255)
        data[i + 1] = Math.round((ng + m) * 255)
        data[i + 2] = Math.round((nb + m) * 255)
      }
      return imageData
    }

    const applyEdgeDetection = (imageData: ImageData, threshold: number): ImageData => {
      const data = imageData.data
      const width = imageData.width
      const height = imageData.height
      const output = new Uint8ClampedArray(data.length)
      
      // Sobel edge detection
      for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
          const idx = (y * width + x) * 4
          
          let gx = 0, gy = 0
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              const pixelIdx = ((y + dy) * width + (x + dx)) * 4
              const gray = 0.299 * data[pixelIdx] + 0.587 * data[pixelIdx + 1] + 0.114 * data[pixelIdx + 2]
              
              // Sobel kernels
              const sobelX = [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]]
              const sobelY = [[-1, -2, -1], [0, 0, 0], [1, 2, 1]]
              
              gx += gray * sobelX[dy + 1][dx + 1]
              gy += gray * sobelY[dy + 1][dx + 1]
            }
          }
          
          const magnitude = Math.sqrt(gx * gx + gy * gy)
          const edge = magnitude > threshold * 255 ? 255 : 0
          
          output[idx] = edge
          output[idx + 1] = edge
          output[idx + 2] = edge
          output[idx + 3] = data[idx + 3]
        }
      }
      
      return new ImageData(output, width, height)
    }

    const applyEmboss = (imageData: ImageData, strength: number): ImageData => {
      const data = imageData.data
      const width = imageData.width
      const height = imageData.height
      const output = new Uint8ClampedArray(data)
      
      // Emboss kernel
      const kernel = [[-2, -1, 0], [-1, 1, 1], [0, 1, 2]]
      
      for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
          let r = 0, g = 0, b = 0
          
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              const pixelIdx = ((y + dy) * width + (x + dx)) * 4
              const weight = kernel[dy + 1][dx + 1]
              
              r += data[pixelIdx] * weight
              g += data[pixelIdx + 1] * weight
              b += data[pixelIdx + 2] * weight
            }
          }
          
          const idx = (y * width + x) * 4
          output[idx] = Math.max(0, Math.min(255, r * strength + 128))
          output[idx + 1] = Math.max(0, Math.min(255, g * strength + 128))
          output[idx + 2] = Math.max(0, Math.min(255, b * strength + 128))
        }
      }
      
      return new ImageData(output, width, height)
    }

    const applyVintage = (imageData: ImageData, params: any): ImageData => {
      let result = imageData
      // Apply sepia first
      result = applySepia(result, 0.7)
      
      // Add grain
      const grain = params.grain || 0.3
      const data = result.data
      for (let i = 0; i < data.length; i += 4) {
        const noise = (Math.random() - 0.5) * grain * 255
        data[i] = Math.max(0, Math.min(255, data[i] + noise))
        data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise))
        data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise))
      }
      
      return result
    }

    const applyNeonGlow = (imageData: ImageData, params: any): ImageData => {
      const data = imageData.data
      const glow = params.glow || 1.2
      
      // Enhance bright colors and add glow effect
      for (let i = 0; i < data.length; i += 4) {
        const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3
        if (brightness > 128) {
          data[i] = Math.min(255, data[i] * glow)
          data[i + 1] = Math.min(255, data[i + 1] * glow)
          data[i + 2] = Math.min(255, data[i + 2] * glow)
        }
      }
      
      return imageData
    }

    // Process image/video frame
    const processFrame = useCallback(() => {
      const canvas = canvasRef.current
      const processedCanvas = processedCanvasRef.current
      const video = videoRef.current
      
      if (!canvas || !processedCanvas) return

      const ctx = canvas.getContext('2d')
      const processedCtx = processedCanvas.getContext('2d')
      
      if (!ctx || !processedCtx) return

      let imageData: ImageData | null = null

      // Get source image data
      if (video && !video.paused) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      } else if (originalImageUrl) {
        const img = new Image()
        img.onload = () => {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
          const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
          processImageData(imgData, processedCtx)
        }
        img.src = originalImageUrl
        return
      }

      if (imageData) {
        processImageData(imageData, processedCtx)
      }

      if (enableRealTimeProcessing && video && !video.paused) {
        animationFrameRef.current = requestAnimationFrame(processFrame)
      }
    }, [activeFilters, enableRealTimeProcessing, originalImageUrl])

    const processImageData = (imageData: ImageData, ctx: CanvasRenderingContext2D) => {
      const activeFilterObjects = availableFilters.filter((f: any) => activeFilters.includes(f.id))
      
      if (activeFilterObjects.length === 0) {
        ctx.putImageData(imageData, 0, 0)
        return
      }

      setIsProcessing(true)
      
      // Process filters
      const processedData = applyFilters(imageData, activeFilterObjects)
      ctx.putImageData(processedData, 0, 0)
      
      const processedUrl = ctx.canvas.toDataURL()
      setProcessedImageUrl(processedUrl)
      onProcessingComplete?.(processedUrl)
      
      setIsProcessing(false)
    }

    // Filter management
    const addFilter = useCallback((filterId: string) => {
      if (activeFilters.length >= maxFilters) {
        play('error')
        return
      }
      
      setActiveFilters((prev: any) => [...prev, filterId])
      const filter = availableFilters.find(f => f.id === filterId)
      if (filter) {
        setFilterParameters((prev: any) => ({
          ...prev,
          [filterId]: { ...filter.parameters }
        }))
        onFilterApply?.(filterId, filter.parameters)
        play('select')
      }
    }, [activeFilters, maxFilters, availableFilters, onFilterApply, play])

    const removeFilter = useCallback((filterId: string) => {
      setActiveFilters((prev: any) => prev.filter((id: any) => id !== filterId))
      setFilterParameters((prev: any) => {
        const { [filterId]: removed, ...rest } = prev
        return rest
      })
      play('remove')
    }, [play])

    const updateFilterParameter = useCallback((filterId: string, paramName: string, value: any) => {
      setFilterParameters((prev: any) => ({
        ...prev,
        [filterId]: {
          ...prev[filterId],
          [paramName]: value
        }
      }))
    }, [])

    // Initialize
    useEffect(() => {
      if (videoSource) {
        initializeVideo()
      }
      
      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current)
        }
      }
    }, [videoSource, initializeVideo])

    useEffect(() => {
      processFrame()
    }, [activeFilters, filterParameters, processFrame])

    const FilterLibrary = () => (
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-primary/80">Filter Library</h4>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {availableFilters.map((filter) => (
            <motion.div
              key={filter.id}
              className={`
                p-3 rounded-lg border cursor-pointer transition-all duration-200
                ${activeFilters.includes(filter.id)
                  ? 'border-blue-400 bg-blue-400/20'
                  : 'border-white/20 hover:border-white/40 bg-white/5'
                }
              `}
              whileHover={shouldAnimate ? { scale: 1.02 } : {}}
              whileTap={shouldAnimate ? { scale: 0.98 } : {}}
              onClick={() => {
                if (activeFilters.includes(filter.id)) {
                  removeFilter(filter.id)
                } else {
                  addFilter(filter.id)
                }
              }}
            >
              <div className="text-sm font-medium text-primary/90 mb-1">
                {filter.name}
              </div>
              <div className="text-xs text-primary/60 mb-2">
                {filter.description}
              </div>
              
              <div className="flex items-center justify-between">
                <span className={`
                  px-2 py-0.5 rounded text-xs font-medium
                  ${filter.category === 'artistic' ? 'bg-purple-500/20 text-purple-300' :
                    filter.category === 'color' ? 'bg-blue-500/20 text-blue-300' :
                    filter.category === 'blur' ? 'bg-gray-500/20 text-gray-300' :
                    filter.category === 'distortion' ? 'bg-red-500/20 text-red-300' :
                    filter.category === 'vintage' ? 'bg-orange-500/20 text-orange-300' :
                    'bg-green-500/20 text-green-300'
                  }
                `}>
                  {filter.category}
                </span>
                
                {activeFilters.includes(filter.id) && (
                  <div className="text-primary">✓</div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    )

    const ActiveFilters = () => (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-primary/80">
            Active Filters ({activeFilters.length}/{maxFilters})
          </h4>
          {activeFilters.length > 0 && (
            <button
              onClick={() => {
                setActiveFilters([])
                setFilterParameters({})
                play('clear')
              }}
              className="text-xs text-primary hover:glass-text-secondary transition-colors"
            >
              Clear All
            </button>
          )}
        </div>

        {activeFilters.length === 0 ? (
          <p className="text-sm text-primary/50 italic">No filters applied</p>
        ) : (
          <div className="space-y-3">
            {activeFilters.map((filterId, index) => {
              const filter = availableFilters.find(f => f.id === filterId)
              if (!filter) return null

              return (
                <div
                  key={filterId}
                  className="p-3 glass-radius-lg border border-white/10 glass-surface-subtle/5"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-primary/90">
                      {filter.name}
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-primary/60">#{index + 1}</span>
                      <button
                        onClick={() => removeFilter(filterId)}
                        className="text-primary hover:glass-text-secondary transition-colors"
                      >
                        ×
                      </button>
                    </div>
                  </div>

                  {/* Filter parameters */}
                  {filter.parameters && Object.entries(filter.parameters).map(([paramName, defaultValue]) => (
                    <div key={paramName} className="mt-2">
                      <label className="block text-xs text-primary/70 mb-1">
                        {paramName.charAt(0).toUpperCase() + paramName.slice(1)}:
                        {typeof defaultValue === 'number' ? 
                          ` ${(filterParameters[filterId]?.[paramName] ?? defaultValue).toFixed(2)}` : 
                          ''
                        }
                      </label>
                      {typeof defaultValue === 'number' ? (
                        <input
                          type="range"
                          min={paramName === 'degrees' ? -180 : 0}
                          max={paramName === 'degrees' ? 180 : paramName === 'radius' ? 20 : 3}
                          step={paramName === 'degrees' ? 1 : 0.1}
                          value={filterParameters[filterId]?.[paramName] ?? defaultValue}
                          onChange={(e) => updateFilterParameter(filterId, paramName, parseFloat(e.target.value))}
                          className="w-full h-2 glass-surface-subtle/20 glass-radius-lg appearance-none cursor-pointer"
                        />
                      ) : (
                        <input
                          type="color"
                          value={filterParameters[filterId]?.[paramName] ?? defaultValue}
                          onChange={(e) => updateFilterParameter(filterId, paramName, e.target.value)}
                          className="w-8 h-6 glass-radius border border-white/20"
                        />
                      )}
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        )}
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
              Live Image Filter
            </h3>
            <p className="text-sm text-primary/60">
              Real-time image and video processing with custom filters
            </p>
          </div>

          <div className="flex items-center space-x-2">
            {enableRealTimeProcessing && (
              <div className="flex items-center space-x-1 text-primary">
                <div className="w-2 h-2 glass-surface-green glass-radius-full animate-pulse" />
                <span className="text-xs">Real-time</span>
              </div>
            )}
            {isProcessing && (
              <div className="flex items-center space-x-1 text-primary">
                <div className="w-4 h-4 border-2 border-blue border-t-transparent glass-radius-full animate-spin" />
                <span className="text-xs">Processing</span>
              </div>
            )}
          </div>
        </div>

        {/* Preview area */}
        {showPreview && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Original */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-primary/80">Original</h4>
              <div className="relative aspect-video glass-surface-subtle/5 border border-white/20 glass-radius-lg overflow-hidden">
                <canvas
                  ref={canvasRef}
                  width={canvasWidth}
                  height={canvasHeight}
                  className="w-full h-full object-cover"
                />
                {videoSource && (
                  <video
                    ref={videoRef}
                    className="hidden"
                    autoPlay
                    muted
                    loop
                  />
                )}
              </div>
            </div>

            {/* Processed */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-primary/80">Filtered</h4>
              <div className="relative aspect-video glass-surface-subtle/5 border border-white/20 glass-radius-lg overflow-hidden">
                <canvas
                  ref={processedCanvasRef}
                  width={canvasWidth}
                  height={canvasHeight}
                  className="w-full h-full object-cover"
                />
                {isProcessing && (
                  <div className="absolute inset-0 glass-surface-dark/50 flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-white border-t-transparent glass-radius-full animate-spin" />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Controls */}
        {showControls && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ActiveFilters />
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-primary/80">Processing Settings</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-primary/70 mb-1">Quality</label>
                  <select
                    value={settings.quality}
                    onChange={(e) => setSettings((prev: any) => ({ 
                      ...prev, 
                      quality: e.target.value as any 
                    }))}
                    className="w-full p-2 glass-surface-subtle/10 border border-white/20 glass-radius-lg text-primary/90 text-sm"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="ultra">Ultra</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-primary/70 mb-1">
                    FPS: {settings.fps}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="60"
                    value={settings.fps}
                    onChange={(e) => setSettings((prev: any) => ({ 
                      ...prev, 
                      fps: parseInt(e.target.value) 
                    }))}
                    className="w-full h-2 glass-surface-subtle/20 glass-radius-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.enableGPU}
                    onChange={(e) => setSettings((prev: any) => ({ 
                      ...prev, 
                      enableGPU: e.target.checked 
                    }))}
                    className="w-4 h-4 glass-radius border-white/30"
                  />
                  <span className="text-sm text-primary/80">GPU Acceleration</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Filter library */}
        {showFilterLibrary && <FilterLibrary />}

        {/* Action buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div className="flex items-center space-x-4">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  const url = URL.createObjectURL(file)
                  setOriginalImageUrl(url)
                  play('upload')
                }
              }}
              className="hidden"
              id="image-upload"
            />
            <motion.label
              htmlFor="image-upload"
              className="px-4 py-2 glass-surface-blue hover:glass-surface-blue text-primary glass-radius-lg text-sm font-medium cursor-pointer transition-colors"
              whileHover={shouldAnimate ? { scale: 1.02 } : {}}
              whileTap={shouldAnimate ? { scale: 0.98 } : {}}
            >
              Upload Image
            </motion.label>

            <motion.button
              className="px-4 py-2 border border-white/30 hover:border-white/50 text-primary/80 glass-radius-lg text-sm transition-colors"
              whileHover={shouldAnimate ? { scale: 1.02 } : {}}
              whileTap={shouldAnimate ? { scale: 0.98 } : {}}
              onClick={() => processFrame()}
            >
              Apply Filters
            </motion.button>
          </div>

          {processedImageUrl && (
            <motion.a
              href={processedImageUrl}
              download="filtered-image.png"
              className="px-4 py-2 glass-surface-green hover:glass-surface-green text-primary glass-radius-lg text-sm font-medium transition-colors"
              whileHover={shouldAnimate ? { scale: 1.02 } : {}}
              whileTap={shouldAnimate ? { scale: 0.98 } : {}}
            >
              Download Result
            </motion.a>
          )}
        </div>
      </OptimizedGlass>
    )
  }
)

GlassLiveFilter.displayName = 'GlassLiveFilter'