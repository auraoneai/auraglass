import React from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/utils';

import { motion } from 'framer-motion'
import { forwardRef, useCallback, useEffect, useRef, useState } from 'react'
import { useMotionPreference } from '../../hooks/useMotionPreference'
import { OptimizedGlass } from '../../primitives'
import { useA11yId } from '../../utils/a11y'
import { createGlassStyle } from '../../utils/createGlassStyle'
import { useGlassSound } from '../../utils/soundDesign'

export interface GANModel {
  id: string
  name: string
  description: string
  type: 'dcgan' | 'stylegan' | 'cyclegan' | 'pix2pix' | 'biggan' | 'progressive'
  category: 'faces' | 'art' | 'landscapes' | 'objects' | 'general' | 'style_transfer'
  resolution: number
  latentDim: number
  trained: boolean
}

export interface GenerationParams {
  seed: number
  truncation: number
  styleStrength: number
  noiseStrength: number
  batchSize: number
  interpolationSteps: number
}

export interface TrainingConfig {
  epochs: number
  batchSize: number
  learningRate: number
  beta1: number
  beta2: number
  discriminatorSteps: number
  generatorSteps: number
}

export interface GlassGANGeneratorProps {
  availableModels?: GANModel[]
  selectedModel?: string
  generationParams?: Partial<GenerationParams>
  trainingConfig?: Partial<TrainingConfig>
  showModelSelector?: boolean
  showGenerationControls?: boolean
  showTrainingControls?: boolean
  showLatentSpace?: boolean
  showProgress?: boolean
  enableInterpolation?: boolean
  enableRealTime?: boolean
  maxGenerations?: number
  canvasWidth?: number
  canvasHeight?: number
  onModelSelect?: (modelId: string) => void
  onGenerate?: (images: string[], params: GenerationParams) => void
  onTrainingProgress?: (epoch: number, loss: { generator: number; discriminator: number }) => void
  className?: string
}

const defaultModels: GANModel[] = [
  {
    id: 'stylegan2-faces',
    name: 'StyleGAN2 Faces',
    description: 'High-quality human face generation',
    type: 'stylegan',
    category: 'faces',
    resolution: 1024,
    latentDim: 512,
    trained: true
  },
  {
    id: 'dcgan-art',
    name: 'DCGAN Art',
    description: 'Abstract art generation',
    type: 'dcgan',
    category: 'art',
    resolution: 256,
    latentDim: 100,
    trained: true
  },
  {
    id: 'biggan-objects',
    name: 'BigGAN Objects',
    description: 'Conditional object generation',
    type: 'biggan',
    category: 'objects',
    resolution: 512,
    latentDim: 128,
    trained: true
  },
  {
    id: 'cyclegan-style',
    name: 'CycleGAN Style Transfer',
    description: 'Unpaired image-to-image translation',
    type: 'cyclegan',
    category: 'style_transfer',
    resolution: 256,
    latentDim: 256,
    trained: true
  },
  {
    id: 'progressive-landscapes',
    name: 'Progressive Landscapes',
    description: 'Landscape scene generation',
    type: 'progressive',
    category: 'landscapes',
    resolution: 512,
    latentDim: 256,
    trained: true
  },
  {
    id: 'stylegan3-general',
    name: 'StyleGAN3 General',
    description: 'General purpose image generation',
    type: 'stylegan',
    category: 'general',
    resolution: 512,
    latentDim: 512,
    trained: false
  }
]

const defaultGenerationParams: GenerationParams = {
  seed: 42,
  truncation: 0.7,
  styleStrength: 1.0,
  noiseStrength: 0.5,
  batchSize: 4,
  interpolationSteps: 10
}

const defaultTrainingConfig: TrainingConfig = {
  epochs: 100,
  batchSize: 32,
  learningRate: 0.0002,
  beta1: 0.5,
  beta2: 0.999,
  discriminatorSteps: 1,
  generatorSteps: 1
}

export const GlassGANGenerator = forwardRef<HTMLDivElement, GlassGANGeneratorProps>(
  ({
    availableModels = defaultModels,
    selectedModel = 'stylegan2-faces',
    generationParams = {},
    trainingConfig = {},
    showModelSelector = true,
    showGenerationControls = true,
    showTrainingControls = true,
    showLatentSpace = true,
    showProgress = true,
    enableInterpolation = true,
    enableRealTime = false,
    maxGenerations = 16,
    canvasWidth = 256,
    canvasHeight = 256,
    onModelSelect,
    onGenerate,
    onTrainingProgress,
    className='',
    ...props
  }, ref) => {
      const prefersReducedMotion = useReducedMotion();
    const [isGenerating, setIsGenerating] = useState(false)
    const [isTraining, setIsTraining] = useState(false)
    const [currentModel, setCurrentModel] = useState(selectedModel)
    const [generatedImages, setGeneratedImages] = useState<string[]>([])
    const [latentVectors, setLatentVectors] = useState<number[][]>([])
    const [trainingProgress, setTrainingProgress] = useState({ epoch: 0, generatorLoss: 0, discriminatorLoss: 0 })
    const [interpolationImages, setInterpolationImages] = useState<string[]>([])
    const [generationProgress, setGenerationProgress] = useState(0)
    
    const [params, setParams] = useState<GenerationParams>({
      ...defaultGenerationParams,
      ...generationParams
    })
    
    const [training, setTraining] = useState<TrainingConfig>({
      ...defaultTrainingConfig,
      ...trainingConfig
    })
    
    const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([])
    const latentSpaceCanvasRef = useRef<HTMLCanvasElement>(null)
    const interpolationCanvasRef = useRef<HTMLCanvasElement>(null)
    
    const id = useA11yId('glass-gan-generator')
    const { shouldAnimate } = useMotionPreference()
    const { play } = useGlassSound()

    // Get selected model
    const model = availableModels.find(m => m.id === currentModel) || availableModels[0]

    // Generate random latent vector
    const generateLatentVector = useCallback((dim: number): number[] => {
      return Array.from({ length: dim }, () => (Math.random() - 0.5) * 2)
    }, [])

    // Simulate GAN generation
    const generateGANImage = useCallback((
      latentVector: number[], 
      model: GANModel, 
      seed: number
    ): string => {
      const canvas = document.createElement('canvas')
      canvas.width = model.resolution
      canvas.height = model.resolution
      const ctx = canvas.getContext('2d')
      
      if (!ctx) return ''

      // Create different patterns based on GAN type
      const imageData = ctx.createImageData(canvas.width, canvas.height)
      const data = imageData.data

      switch (model.type) {
        case 'stylegan':
          // StyleGAN-like high quality patterns
          for (let y = 0; y < canvas.height; y++) {
            for (let x = 0; x < canvas.width; x++) {
              const i = (y * canvas.width + x) * 4
              
              // Use latent vector to influence generation
              const latentInfluence = latentVector.slice(0, 8).reduce((sum, val) => sum + val, 0) / 8
              
              const nx = (x / canvas.width - 0.5) * 2
              const ny = (y / canvas.height - 0.5) * 2
              
              if (model.category === 'faces') {
                // Face-like patterns
                const faceShape = Math.exp(-(nx * nx + ny * ny * 0.8) * 2)
                const detail = Math.sin(nx * 10) * Math.cos(ny * 10) * 0.1
                
                data[i] = Math.floor((0.8 + latentInfluence * 0.2 + detail) * faceShape * 255)
                data[i + 1] = Math.floor((0.7 + latentInfluence * 0.3 + detail) * faceShape * 255)
                data[i + 2] = Math.floor((0.6 + latentInfluence * 0.4 + detail) * faceShape * 255)
                data[i + 3] = 255
              } else {
                // General patterns
                const pattern = Math.sin(nx * 5 + latentInfluence) * Math.cos(ny * 5 + latentInfluence)
                data[i] = Math.floor((pattern + 1) * 128)
                data[i + 1] = Math.floor((Math.sin(pattern * 2) + 1) * 128)
                data[i + 2] = Math.floor((Math.cos(pattern * 3) + 1) * 128)
                data[i + 3] = 255
              }
            }
          }
          break
          
        case 'dcgan':
          // DCGAN-like artistic patterns
          for (let y = 0; y < canvas.height; y++) {
            for (let x = 0; x < canvas.width; x++) {
              const i = (y * canvas.width + x) * 4
              
              const latentSum = latentVector.slice(0, 5).reduce((sum, val) => sum + val, 0)
              const freq = 0.02 * (1 + latentSum * 0.1)
              
              const r = Math.sin(x * freq) * Math.cos(y * freq)
              const g = Math.sin((x + y) * freq * 0.8)
              const b = Math.cos((x - y) * freq * 1.2)
              
              data[i] = Math.floor((r + 1) * 128)
              data[i + 1] = Math.floor((g + 1) * 128)
              data[i + 2] = Math.floor((b + 1) * 128)
              data[i + 3] = 255
            }
          }
          break
          
        case 'biggan':
          // BigGAN-like class-conditional patterns
          for (let y = 0; y < canvas.height; y++) {
            for (let x = 0; x < canvas.width; x++) {
              const i = (y * canvas.width + x) * 4
              
              const classVector = latentVector.slice(-10)
              const dominantClass = Math.floor(Math.abs(classVector[0]) * 10)
              
              const colors = [
                [255, 100, 100], [100, 255, 100], [100, 100, 255],
                [255, 255, 100], [255, 100, 255], [100, 255, 255],
                [200, 150, 100], [150, 100, 200], [100, 200, 150],
                [180, 180, 180]
              ]
              
              const color = colors[dominantClass] || [128, 128, 128]
              const noise = (Math.random() - 0.5) * 50
              
              data[i] = Math.max(0, Math.min(255, color[0] + noise))
              data[i + 1] = Math.max(0, Math.min(255, color[1] + noise))
              data[i + 2] = Math.max(0, Math.min(255, color[2] + noise))
              data[i + 3] = 255
            }
          }
          break
          
        default:
          // Default pattern
          for (let y = 0; y < canvas.height; y++) {
            for (let x = 0; x < canvas.width; x++) {
              const i = (y * canvas.width + x) * 4
              
              const pattern = latentVector.slice(0, 3).reduce((sum, val, idx) => {
                return sum + val * Math.sin((x + y) * 0.01 * (idx + 1))
              }, 0)
              
              data[i] = Math.floor((Math.sin(pattern) + 1) * 128)
              data[i + 1] = Math.floor((Math.cos(pattern * 1.1) + 1) * 128)
              data[i + 2] = Math.floor((Math.sin(pattern * 0.9) + 1) * 128)
              data[i + 3] = 255
            }
          }
      }

      ctx.putImageData(imageData, 0, 0)
      return canvas.toDataURL()
    }, [])

    // Generate batch of images
    const generateImages = useCallback(async () => {
      if (!model.trained) {
        play('error')
        return
      }

      setIsGenerating(true)
      setGenerationProgress(0)
      play('processing')

      const newImages: string[] = []
      const newLatentVectors: number[][] = []

      for (let i = 0; i < params.batchSize; i++) {
        setGenerationProgress((i / params.batchSize) * 100)
        
        // Generate latent vector
        const latentVector = generateLatentVector(model.latentDim)
        
        // Apply truncation trick
        const truncatedVector = latentVector.map((val: any) => val * params.truncation)
        
        // Generate image
        const imageUrl = generateGANImage(truncatedVector, model, params.seed + i)
        
        newImages.push(imageUrl)
        newLatentVectors.push(truncatedVector)
        
        // Add delay for realistic generation time
        await new Promise(resolve => setTimeout(resolve, 200))
      }

      setGeneratedImages((prev: any) => [...newImages, ...prev].slice(0, maxGenerations))
      setLatentVectors((prev: any) => [...newLatentVectors, ...prev].slice(0, maxGenerations))
      setGenerationProgress(100)
      
      onGenerate?.(newImages, params)
      setIsGenerating(false)
      play('success')
    }, [model, params, generateLatentVector, generateGANImage, maxGenerations, onGenerate, play])

    // Generate interpolation between two latent vectors
    const generateInterpolation = useCallback(async () => {
      if (latentVectors.length < 2) return

      const vec1 = latentVectors[0]
      const vec2 = latentVectors[1]
      const steps = params.interpolationSteps
      
      const interpolatedImages: string[] = []

      for (let i = 0; i <= steps; i++) {
        const t = i / steps
        const interpolatedVector = vec1.map((val, idx) => 
          val * (1 - t) + vec2[idx] * t
        )
        
        const imageUrl = generateGANImage(interpolatedVector, model, params.seed)
        interpolatedImages.push(imageUrl)
      }

      setInterpolationImages(interpolatedImages)
    }, [latentVectors, params.interpolationSteps, params.seed, generateGANImage, model])

    // Simulate model training
    const trainModel = useCallback(async () => {
      if (!model) return

      setIsTraining(true)
      play('processing')

      for (let epoch = 0; epoch < training.epochs; epoch++) {
        // Simulate training step
        const generatorLoss = 1.0 + Math.random() * 0.5 - epoch * 0.01
        const discriminatorLoss = 0.8 + Math.random() * 0.3 - epoch * 0.005
        
        setTrainingProgress({
          epoch: epoch + 1,
          generatorLoss: Math.max(0.1, generatorLoss),
          discriminatorLoss: Math.max(0.1, discriminatorLoss)
        })
        
        onTrainingProgress?.(epoch + 1, {
          generator: generatorLoss,
          discriminator: discriminatorLoss
        })

        await new Promise(resolve => setTimeout(resolve, 100))
      }

      // Mark model as trained
      const modelIndex = availableModels.findIndex(m => m.id === currentModel)
      if (modelIndex !== -1) {
        availableModels[modelIndex].trained = true
      }

      setIsTraining(false)
      play('success')
    }, [model, training.epochs, currentModel, availableModels, onTrainingProgress, play])

    // Visualize latent space
    const visualizeLatentSpace = useCallback(() => {
      const canvas = latentSpaceCanvasRef.current
      if (!canvas || latentVectors.length === 0) return

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Draw latent vectors as points in 2D projection
      latentVectors.slice(0, 10).forEach((vector, idx) => {
        // Project high-dimensional vector to 2D using first two dimensions
        const x = (vector[0] + 2) / 4 * canvas.width
        const y = (vector[1] + 2) / 4 * canvas.height
        
        ctx.fillStyle = `hsl(${idx * 36}, 70%, 60%)`
        ctx.beginPath()
        ctx.arc(x, y, 5, 0, Math.PI * 2)
        ctx.fill()
        
        // Draw connections between nearby points
        latentVectors.slice(idx + 1, 10).forEach((otherVector, otherIdx) => {
          const distance = Math.sqrt(
            Math.pow(vector[0] - otherVector[0], 2) + 
            Math.pow(vector[1] - otherVector[1], 2)
          )
          
          if (distance < 1.0) {
            const ox = (otherVector[0] + 2) / 4 * canvas.width
            const oy = (otherVector[1] + 2) / 4 * canvas.height
            
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.3 * (1 - distance)})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(x, y)
            ctx.lineTo(ox, oy)
            ctx.stroke()
          }
        })
      })
    }, [latentVectors])

    // Handle model selection
    const handleModelSelect = useCallback((modelId: string) => {
      setCurrentModel(modelId)
      onModelSelect?.(modelId)
      play('select')
    }, [onModelSelect, play])

    // Real-time generation
    useEffect(() => {
      if (enableRealTime && model.trained) {
        const interval = setInterval(() => {
          if (!isGenerating) {
            generateImages()
          }
        }, 5000)
        
        return () => clearInterval(interval)
      }
    }, [enableRealTime, model.trained, isGenerating, generateImages])

    // Update latent space visualization
    useEffect(() => {
      visualizeLatentSpace()
    }, [latentVectors, visualizeLatentSpace])

    const ModelSelector = () => (
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-primary/80">GAN Models</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {availableModels.map((ganModel) => (
            <motion.div
              key={ganModel.id}
              className={`
                p-3 rounded-lg border cursor-pointer transition-all duration-200
                ${currentModel === ganModel.id
                  ? 'border-blue-400 bg-blue-400/20'
                  : 'border-white/20 hover:border-white/40 bg-white/5'
                }
              `}
              whileHover={shouldAnimate ? { scale: 1.01 } : {}}
              whileTap={shouldAnimate ? { scale: 0.99 } : {}}
              onClick={() => handleModelSelect(ganModel.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h5 className="text-sm font-medium text-primary/90">{ganModel.name}</h5>
                    {ganModel.trained ? (
                      <span className="px-2 py-0.5 glass-surface-green/20 glass-text-secondary glass-radius text-xs font-medium">
                        Trained
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 glass-surface-primary/20 glass-text-secondary glass-radius text-xs font-medium">
                        Untrained
                      </span>
                    )}
                  </div>
                  
                  <p className="text-xs text-primary/60 mb-2">{ganModel.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-xs text-primary/50">
                      <span>{ganModel.resolution}px</span>
                      <span>Z:{ganModel.latentDim}</span>
                    </div>
                    
                    <span className={`
                      px-2 py-0.5 rounded text-xs font-medium
                      ${ganModel.type === 'stylegan' ? 'bg-purple-500/20 text-purple-300' :
                        ganModel.type === 'dcgan' ? 'bg-blue-500/20 text-blue-300' :
                        ganModel.type === 'biggan' ? 'bg-green-500/20 text-green-300' :
                        ganModel.type === 'cyclegan' ? 'bg-red-500/20 text-red-300' :
                        'bg-gray-500/20 text-gray-300'
                      }
                    `}>
                      {ganModel.type.toUpperCase()}
                    </span>
                  </div>
                </div>
                
                {currentModel === ganModel.id && (
                  <div className="text-primary ml-2">✓</div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    )

    const GenerationControls = () => (
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-primary/80">Generation Parameters</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-primary/70 mb-1">
              Seed: {params.seed}
            </label>
            <input
              type="range"
              min="0"
              max="1000"
              value={params.seed}
              onChange={(e) => setParams((prev: any) => ({ 
                ...prev, 
                seed: parseInt(e.target.value) 
              }))}
              className="w-full h-2 glass-surface-subtle/20 glass-radius-lg appearance-none cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-xs text-primary/70 mb-1">
              Truncation: {params.truncation.toFixed(2)}
            </label>
            <input
              type="range"
              min="0.1"
              max="2.0"
              step="0.1"
              value={params.truncation}
              onChange={(e) => setParams((prev: any) => ({ 
                ...prev, 
                truncation: parseFloat(e.target.value) 
              }))}
              className="w-full h-2 glass-surface-subtle/20 glass-radius-lg appearance-none cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-xs text-primary/70 mb-1">
              Style Strength: {params.styleStrength.toFixed(2)}
            </label>
            <input
              type="range"
              min="0.0"
              max="2.0"
              step="0.1"
              value={params.styleStrength}
              onChange={(e) => setParams((prev: any) => ({ 
                ...prev, 
                styleStrength: parseFloat(e.target.value) 
              }))}
              className="w-full h-2 glass-surface-subtle/20 glass-radius-lg appearance-none cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-xs text-primary/70 mb-1">
              Batch Size: {params.batchSize}
            </label>
            <input
              type="range"
              min="1"
              max="8"
              value={params.batchSize}
              onChange={(e) => setParams((prev: any) => ({ 
                ...prev, 
                batchSize: parseInt(e.target.value) 
              }))}
              className="w-full h-2 glass-surface-subtle/20 glass-radius-lg appearance-none cursor-pointer"
            />
          </div>
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
              GAN Generator
            </h3>
            <p className="text-sm text-primary/60">
              Generative Adversarial Networks for image synthesis
            </p>
          </div>

          <div className="flex items-center space-x-2">
            {enableRealTime && model.trained && (
              <div className="flex items-center space-x-1 text-primary">
                <div className="w-2 h-2 glass-surface-green glass-radius-full animate-pulse" />
                <span className="text-xs">Auto-gen</span>
              </div>
            )}
            {isGenerating && (
              <div className="flex items-center space-x-1 text-primary">
                <div className="w-4 h-4 border-2 border-blue border-t-transparent glass-radius-full animate-spin" />
                <span className="text-xs">Generating...</span>
              </div>
            )}
            {isTraining && (
              <div className="flex items-center space-x-1 text-primary">
                <div className="w-4 h-4 border-2 border-orange-400 border-t-transparent glass-radius-full animate-spin" />
                <span className="text-xs">Training...</span>
              </div>
            )}
          </div>
        </div>

        {/* Generated images grid */}
        {generatedImages.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-primary/80">Generated Images</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {generatedImages.slice(0, maxGenerations).map((imageUrl, index) => (
                <motion.div
                  key={index}
                  className="relative aspect-square glass-radius-lg overflow-hidden glass-surface-subtle/10 group cursor-pointer"
                  whileHover={shouldAnimate ? { scale: 1.05 } : {}}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={prefersReducedMotion ? {} : { opacity: 1, scale: 1 }}
                  transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.3 }}
                >
                  <img 
                    src={imageUrl} 
                    alt={`Generated ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 glass-surface-dark/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button className="p-2 glass-surface-subtle/20 glass-radius-lg text-primary hover:glass-surface-subtle/30 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Generation progress */}
        {isGenerating && showProgress && (
          <div className={`
            p-3 rounded-lg border border-blue-400/30
            ${createGlassStyle({ blur: 'sm', opacity: 0.8 }).background}
          `}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-primary/80">Generating batch...</span>
              <span className="text-sm font-medium text-primary">
                {Math.round(generationProgress)}%
              </span>
            </div>
            <div className="w-full glass-surface-subtle/20 glass-radius-full h-2">
              <motion.div
                className="glass-surface-blue h-2 glass-radius-full"
                animate={{ width: `${generationProgress}%` }}
                transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.3  }}
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Model selector */}
          {showModelSelector && <ModelSelector />}

          {/* Generation controls */}
          {showGenerationControls && <GenerationControls />}
        </div>

        {/* Latent space visualization */}
        {showLatentSpace && latentVectors.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-primary/80">Latent Space (2D Projection)</h4>
            <canvas
              ref={latentSpaceCanvasRef}
              width={400}
              height={300}
              className="w-full max-w-md border border-white/20 glass-radius-lg glass-surface-dark/20"
            />
          </div>
        )}

        {/* Interpolation */}
        {enableInterpolation && interpolationImages.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-primary/80">Latent Interpolation</h4>
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {interpolationImages.map((imageUrl, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-16 h-16 glass-radius border border-white/20 overflow-hidden"
                >
                  <img 
                    src={imageUrl} 
                    alt={`Interpolation ${index}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Training progress */}
        {isTraining && showTrainingControls && (
          <div className={`
            p-3 rounded-lg border border-orange-400/30
            ${createGlassStyle({ blur: 'sm', opacity: 0.8 }).background}
          `}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-primary/80">Training Model...</span>
              <span className="text-sm font-medium text-primary">
                Epoch {trainingProgress.epoch}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-xs text-primary/60">
              <div>
                Generator Loss: {trainingProgress.generatorLoss.toFixed(3)}
              </div>
              <div>
                Discriminator Loss: {trainingProgress.discriminatorLoss.toFixed(3)}
              </div>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div className="flex items-center space-x-4">
            <motion.button
              className="px-4 py-2 glass-surface-blue hover:glass-surface-blue text-primary glass-radius-lg text-sm font-medium transition-colors disabled:opacity-50"
              whileHover={shouldAnimate ? { scale: 1.02 } : {}}
              whileTap={shouldAnimate ? { scale: 0.98 } : {}}
              onClick={generateImages}
              disabled={isGenerating || !model.trained}
            >
              {isGenerating ? 'Generating...' : 'Generate Images'}
            </motion.button>

            {enableInterpolation && latentVectors.length >= 2 && (
              <motion.button
                className="px-4 py-2 border border-white/30 hover:border-white/50 text-primary/80 glass-radius-lg text-sm transition-colors"
                whileHover={shouldAnimate ? { scale: 1.02 } : {}}
                whileTap={shouldAnimate ? { scale: 0.98 } : {}}
                onClick={generateInterpolation}
              >
                Interpolate
              </motion.button>
            )}

            {showTrainingControls && !model.trained && (
              <motion.button
                className="px-4 py-2 glass-surface-primary hover:glass-surface-primary text-primary glass-radius-lg text-sm font-medium transition-colors disabled:opacity-50"
                whileHover={shouldAnimate ? { scale: 1.02 } : {}}
                whileTap={shouldAnimate ? { scale: 0.98 } : {}}
                onClick={trainModel}
                disabled={isTraining}
              >
                {isTraining ? 'Training...' : 'Train Model'}
              </motion.button>
            )}
          </div>

          <div className="flex items-center space-x-2 text-xs text-primary/60">
            <span>Generated: {generatedImages.length}</span>
            <span>•</span>
            <span>Model: {model.name}</span>
          </div>
        </div>
      </OptimizedGlass>
    )
  }
)

GlassGANGenerator.displayName = 'GlassGANGenerator'