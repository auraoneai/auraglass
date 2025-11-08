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

export interface ArtPrompt {
  id: string
  text: string
  style?: string
  category: 'abstract' | 'landscape' | 'portrait' | 'architecture' | 'nature' | 'surreal'
  tags: string[]
}

export interface GenerationSettings {
  model: 'stable-diffusion' | 'midjourney' | 'dall-e' | 'custom'
  style: string
  resolution: '512x512' | '768x768' | '1024x1024' | '1920x1080'
  steps: number
  guidance: number
  seed?: number
  iterations: number
}

export interface GlassGenerativeArtProps {
  prompt?: string
  suggestions?: ArtPrompt[]
  generationSettings?: Partial<GenerationSettings>
  showPromptLibrary?: boolean
  showAdvancedSettings?: boolean
  showGenerationHistory?: boolean
  enableIterativeGeneration?: boolean
  enablePromptEnhancement?: boolean
  enableStyleMixing?: boolean
  realTimeGeneration?: boolean
  onPromptChange?: (prompt: string) => void
  onGenerate?: (prompt: string, settings: GenerationSettings) => void
  onImageGenerated?: (imageUrl: string, metadata: any) => void
  className?: string
}

const defaultPromptSuggestions: ArtPrompt[] = [
  {
    id: 'cosmic-abstract',
    text: 'Cosmic abstract painting with swirling galaxies and nebulae in vibrant colors',
    style: 'abstract expressionism',
    category: 'abstract',
    tags: ['space', 'cosmic', 'vibrant', 'swirling']
  },
  {
    id: 'cyberpunk-city',
    text: 'Cyberpunk cityscape at night with neon lights reflecting on wet streets',
    style: 'digital art',
    category: 'architecture',
    tags: ['cyberpunk', 'neon', 'city', 'night']
  },
  {
    id: 'ethereal-portrait',
    text: 'Ethereal portrait of a person made of flowing light and energy',
    style: 'digital painting',
    category: 'portrait',
    tags: ['ethereal', 'light', 'energy', 'flowing']
  },
  {
    id: 'surreal-landscape',
    text: 'Surreal landscape with floating islands and impossible waterfalls',
    style: 'surrealism',
    category: 'landscape',
    tags: ['surreal', 'floating', 'impossible', 'waterfalls']
  },
  {
    id: 'biomech-fusion',
    text: 'Biomechanical fusion of organic forms and technological components',
    style: 'biomechanical art',
    category: 'surreal',
    tags: ['biomechanical', 'organic', 'technology', 'fusion']
  }
]

const stylePresets = [
  'photorealistic',
  'oil painting',
  'watercolor',
  'digital art',
  'abstract expressionism',
  'impressionism',
  'cyberpunk',
  'steampunk',
  'art nouveau',
  'minimalist',
  'baroque',
  'surrealism'
]

export const GlassGenerativeArt = forwardRef<HTMLDivElement, GlassGenerativeArtProps>(
  ({
    prompt = '',
    suggestions = defaultPromptSuggestions,
    generationSettings = {},
    showPromptLibrary = true,
    showAdvancedSettings = true,
    showGenerationHistory = true,
    enableIterativeGeneration = true,
    enablePromptEnhancement = true,
    enableStyleMixing = false,
    realTimeGeneration = false,
    onPromptChange,
    onGenerate,
    onImageGenerated,
    className='',
    ...props
  }, ref) => {
      const prefersReducedMotion = useReducedMotion();
    const [currentPrompt, setCurrentPrompt] = useState(prompt)
    const [isGenerating, setIsGenerating] = useState(false)
    const [generationProgress, setGenerationProgress] = useState(0)
    const [enablePromptEnhancementState, setEnablePromptEnhancementState] = useState(enablePromptEnhancement)
    const [generatedImages, setGeneratedImages] = useState<string[]>([])
    const [generationHistory, setGenerationHistory] = useState<Array<{
      id: string
      prompt: string
      imageUrl: string
      settings: GenerationSettings
      timestamp: number
    }>>([])
    
    const [settings, setSettings] = useState<GenerationSettings>({
      model: 'stable-diffusion',
      style: 'photorealistic',
      resolution: '768x768',
      steps: 25,
      guidance: 7.5,
      iterations: 1,
      ...generationSettings
    })
    
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const id = useA11yId('glass-generative-art')
    const { shouldAnimate } = useMotionPreference()
    const { play } = useGlassSound()

    // Enhanced prompt generation
    const enhancePrompt = useCallback((basePrompt: string): string => {
      const enhancementPhrases = [
        'highly detailed',
        'professional quality',
        'studio lighting',
        '8k resolution',
        'masterpiece',
        'trending on artstation',
        'photorealistic',
        'cinematic composition'
      ]
      
      const randomEnhancements = enhancementPhrases
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .join(', ')
      
      return `${basePrompt}, ${randomEnhancements}, ${settings.style} style`
    }, [settings.style])

    // Generate art simulation
    const generateArt = useCallback(async (promptText: string) => {
      if (!promptText.trim()) return

      setIsGenerating(true)
      setGenerationProgress(0)
      play('processing')

      const enhancedPrompt = enablePromptEnhancement ? enhancePrompt(promptText) : promptText

      // Simulate generation steps
      const steps = [
        { label: 'Initializing model...', duration: 300 },
        { label: 'Processing prompt...', duration: 500 },
        { label: 'Generating base composition...', duration: 1000 },
        { label: 'Adding details...', duration: 1500 },
        { label: 'Applying style...', duration: 800 },
        { label: 'Refining image...', duration: 700 },
        { label: 'Finalizing...', duration: 400 }
      ]

      for (let i = 0; i < steps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, steps[i].duration))
        setGenerationProgress(((i + 1) / steps.length) * 100)
      }

      // Generate multiple iterations if requested
      const newImages: string[] = []
      for (let i = 0; i < settings.iterations; i++) {
        const canvas = canvasRef.current
        if (canvas) {
          const ctx = canvas.getContext('2d')
          if (ctx) {
            // Create unique generative art based on prompt
            canvas.width = 512
            canvas.height = 512
            
            // Background based on prompt category
            const promptLower = promptText.toLowerCase()
            let bgGradient: CanvasGradient
            
            if (promptLower.includes('space') || promptLower.includes('cosmic')) {
              bgGradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 400)
              bgGradient.addColorStop(0, '#1a1a2e')
              bgGradient.addColorStop(0.5, '#16213e')
              bgGradient.addColorStop(1, '#0f3460')
            } else if (promptLower.includes('cyberpunk') || promptLower.includes('neon')) {
              bgGradient = ctx.createLinearGradient(0, 0, 512, 512)
              bgGradient.addColorStop(0, '#0a0a0a')
              bgGradient.addColorStop(0.5, '#1a0f2e')
              bgGradient.addColorStop(1, '#2d1b69')
            } else if (promptLower.includes('nature') || promptLower.includes('landscape')) {
              bgGradient = ctx.createLinearGradient(0, 0, 0, 512)
              bgGradient.addColorStop(0, '#87ceeb')
              bgGradient.addColorStop(0.7, '#98fb98')
              bgGradient.addColorStop(1, '#228b22')
            } else {
              bgGradient = ctx.createLinearGradient(0, 0, 512, 512)
              bgGradient.addColorStop(0, '#667eea')
              bgGradient.addColorStop(1, '#764ba2')
            }
            
            ctx.fillStyle = bgGradient
            ctx.fillRect(0, 0, 512, 512)

            // Add generative elements based on style
            if (settings.style.includes('abstract')) {
              // Abstract shapes and forms
              for (let j = 0; j < 15; j++) {
                ctx.save()
                ctx.translate(Math.random() * 512, Math.random() * 512)
                ctx.rotate(Math.random() * Math.PI * 2)
                
                const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 50 + Math.random() * 100)
                gradient.addColorStop(0, `hsla(${Math.random() * 360}, 70%, 60%, 0.8)`)
                gradient.addColorStop(1, `hsla(${Math.random() * 360}, 50%, 40%, 0.3)`)
                
                ctx.fillStyle = gradient
                ctx.beginPath()
                ctx.ellipse(0, 0, Math.random() * 80 + 20, Math.random() * 120 + 30, 0, 0, Math.PI * 2)
                ctx.fill()
                ctx.restore()
              }
            } else if (settings.style.includes('geometric')) {
              // Geometric patterns
              for (let j = 0; j < 20; j++) {
                ctx.save()
                ctx.translate(Math.random() * 512, Math.random() * 512)
                ctx.rotate(Math.random() * Math.PI * 2)
                
                ctx.strokeStyle = `hsla(${Math.random() * 360}, 60%, 50%, 0.7)`
                ctx.lineWidth = Math.random() * 3 + 1
                ctx.beginPath()
                
                const size = Math.random() * 60 + 20
                ctx.rect(-size/2, -size/2, size, size)
                ctx.stroke()
                ctx.restore()
              }
            } else if (promptLower.includes('particle') || settings.style.includes('digital')) {
              // Particle effects
              for (let j = 0; j < 100; j++) {
                ctx.fillStyle = `hsla(${Math.random() * 60 + 180}, 80%, 60%, ${Math.random() * 0.8 + 0.2})`
                ctx.beginPath()
                ctx.arc(
                  Math.random() * 512,
                  Math.random() * 512,
                  Math.random() * 3 + 1,
                  0,
                  Math.PI * 2
                )
                ctx.fill()
              }
            }

            // Add texture overlay
            const imageData = ctx.getImageData(0, 0, 512, 512)
            const data = imageData.data
            for (let j = 0; j < data.length; j += 4) {
              const noise = (Math.random() - 0.5) * 20
              data[j] = Math.max(0, Math.min(255, data[j] + noise))
              data[j + 1] = Math.max(0, Math.min(255, data[j + 1] + noise))
              data[j + 2] = Math.max(0, Math.min(255, data[j + 2] + noise))
            }
            ctx.putImageData(imageData, 0, 0)

            const imageUrl = canvas.toDataURL('image/png')
            newImages.push(imageUrl)
          }
        }
      }

      setGeneratedImages((prev: any) => [...newImages, ...prev].slice(0, 12))
      
      // Add to history
      const historyEntry = {
        id: Date.now().toString(),
        prompt: enhancedPrompt,
        imageUrl: newImages[0] || '',
        settings: { ...settings },
        timestamp: Date.now()
      }
      setGenerationHistory((prev: any) => [historyEntry, ...prev].slice(0, 20))

      setIsGenerating(false)
      play('success')
      
      if (newImages[0]) {
        onImageGenerated?.(newImages[0], historyEntry)
      }
    }, [settings, enablePromptEnhancement, enhancePrompt, onImageGenerated, play])

    // Handle prompt changes
    useEffect(() => {
      if (realTimeGeneration && currentPrompt && currentPrompt !== prompt) {
        const debounceTimer = setTimeout(() => {
          generateArt(currentPrompt)
        }, 2000)
        return () => clearTimeout(debounceTimer)
      }
    }, [currentPrompt, realTimeGeneration, generateArt, prompt])

    const PromptLibrary = () => (
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-primary/80">Prompt Library</h4>
        <div className="grid gap-2">
          {suggestions.map((suggestion) => (
            <motion.div
              key={suggestion.id}
              className="p-3 glass-radius-lg border border-white/20 hover:border-white/40 glass-surface-subtle/5 cursor-pointer transition-colors"
              whileHover={shouldAnimate ? { scale: 1.01 } : {}}
              onClick={() => {
                setCurrentPrompt(suggestion.text)
                onPromptChange?.(suggestion.text)
                play('select')
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-primary/90 mb-1">{suggestion.text}</p>
                  <div className="flex items-center space-x-2">
                    <span className={`
                      px-2 py-0.5 rounded text-xs font-medium
                      ${suggestion.category === 'abstract' ? 'bg-purple-500/20 text-purple-300' :
                        suggestion.category === 'landscape' ? 'bg-green-500/20 text-green-300' :
                        suggestion.category === 'portrait' ? 'bg-blue-500/20 text-blue-300' :
                        suggestion.category === 'architecture' ? 'bg-gray-500/20 text-gray-300' :
                        suggestion.category === 'nature' ? 'bg-emerald-500/20 text-emerald-300' :
                        'bg-pink-500/20 text-pink-300'
                      }
                    `}>
                      {suggestion.category}
                    </span>
                    {suggestion.tags.slice(0, 2).map((tag: any) => (
                      <span key={tag} className="px-1.5 py-0.5 glass-surface-subtle/10 text-primary/60 glass-radius text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    )

    const AdvancedSettings = () => (
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-primary/80">Generation Settings</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-primary/70 mb-2">Model</label>
            <select
              value={settings.model}
              onChange={(e) => setSettings((prev: any) => ({ 
                ...prev, 
                model: e.target.value as any 
              }))}
              className="w-full p-2 glass-surface-subtle/10 border border-white/20 glass-radius-lg text-primary/90 text-sm"
            >
              <option value="stable-diffusion">Stable Diffusion</option>
              <option value="midjourney">Midjourney</option>
              <option value="dall-e">DALL-E</option>
              <option value="custom">Custom Model</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-primary/70 mb-2">Style</label>
            <select
              value={settings.style}
              onChange={(e) => setSettings((prev: any) => ({ 
                ...prev, 
                style: e.target.value 
              }))}
              className="w-full p-2 glass-surface-subtle/10 border border-white/20 glass-radius-lg text-primary/90 text-sm"
            >
              {stylePresets.map((style: any) => (
                <option key={style} value={style}>
                  {style.charAt(0).toUpperCase() + style.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-primary/70 mb-2">Resolution</label>
            <select
              value={settings.resolution}
              onChange={(e) => setSettings((prev: any) => ({ 
                ...prev, 
                resolution: e.target.value as any 
              }))}
              className="w-full p-2 glass-surface-subtle/10 border border-white/20 glass-radius-lg text-primary/90 text-sm"
            >
              <option value="512x512">512 × 512</option>
              <option value="768x768">768 × 768</option>
              <option value="1024x1024">1024 × 1024</option>
              <option value="1920x1080">1920 × 1080</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-primary/70 mb-2">
              Iterations: {settings.iterations}
            </label>
            <input
              type="range"
              min="1"
              max="4"
              value={settings.iterations}
              onChange={(e) => setSettings((prev: any) => ({ 
                ...prev, 
                iterations: parseInt(e.target.value) 
              }))}
              className="w-full h-2 glass-surface-subtle/20 glass-radius-lg appearance-none cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-xs text-primary/70 mb-2">
              Steps: {settings.steps}
            </label>
            <input
              type="range"
              min="10"
              max="50"
              value={settings.steps}
              onChange={(e) => setSettings((prev: any) => ({ 
                ...prev, 
                steps: parseInt(e.target.value) 
              }))}
              className="w-full h-2 glass-surface-subtle/20 glass-radius-lg appearance-none cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-xs text-primary/70 mb-2">
              Guidance: {settings.guidance}
            </label>
            <input
              type="range"
              min="1"
              max="20"
              step="0.5"
              value={settings.guidance}
              onChange={(e) => setSettings((prev: any) => ({ 
                ...prev, 
                guidance: parseFloat(e.target.value) 
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
              AI Art Generator
            </h3>
            <p className="text-sm text-primary/60">
              Create stunning AI-generated artwork from text prompts
            </p>
          </div>

          <div className="flex items-center space-x-2">
            {realTimeGeneration && (
              <div className="flex items-center space-x-1 text-primary">
                <div className="w-2 h-2 glass-surface-green glass-radius-full animate-pulse" />
                <span className="text-xs">Live</span>
              </div>
            )}
            {isGenerating && (
              <div className="flex items-center space-x-1 text-primary">
                <div className="w-4 h-4 border-2 border-blue border-t-transparent glass-radius-full animate-spin" />
                <span className="text-xs">Generating</span>
              </div>
            )}
          </div>
        </div>

        {/* Prompt input */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-primary/80 mb-2">
              Describe your artwork
            </label>
            <textarea
              value={currentPrompt}
              onChange={(e) => {
                setCurrentPrompt(e.target.value)
                onPromptChange?.(e.target.value)
              }}
              placeholder="A majestic dragon soaring through a cosmic nebula, digital art style, highly detailed..."
              className="w-full h-24 p-3 glass-surface-subtle/10 border border-white/20 glass-radius-lg text-primary/90 placeholder-white/50 resize-none focus:outline-none focus:border-blue"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enablePromptEnhancementState}
                  onChange={(e) => setEnablePromptEnhancementState(e.target.checked)}
                  className="w-4 h-4 glass-radius border-white/30"
                />
                <span className="text-sm text-primary/80">Enhance Prompt</span>
              </label>
            </div>

            <motion.button
              className="px-6 py-2 glass-surface-blue hover:glass-surface-blue text-primary glass-radius-lg font-medium transition-colors disabled:opacity-50"
              whileHover={shouldAnimate ? { scale: 1.02 } : {}}
              whileTap={shouldAnimate ? { scale: 0.98 } : {}}
              onClick={() => generateArt(currentPrompt)}
              disabled={isGenerating || !currentPrompt.trim()}
            >
              {isGenerating ? 'Generating...' : 'Generate Art'}
            </motion.button>
          </div>
        </div>

        {/* Progress indicator */}
        {isGenerating && (
          <div className={`
            p-3 rounded-lg border border-blue-400/30
            ${createGlassStyle({ blur: 'sm', opacity: 0.8 }).background}
          `}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-primary/80">Generating artwork...</span>
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

        {/* Generated images grid */}
        {generatedImages.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-primary/80">Generated Artwork</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {generatedImages.map((imageUrl, index) => (
                <motion.div
                  key={index}
                  className="relative aspect-square glass-radius-lg overflow-hidden glass-surface-subtle/10 group cursor-pointer"
                  whileHover={shouldAnimate ? { scale: 1.02 } : {}}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={prefersReducedMotion ? {} : { opacity: 1, scale: 1 }}
                  transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.3 }}
                >
                  <img 
                    src={imageUrl} 
                    alt={`Generated art ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 glass-surface-dark/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button className="p-2 glass-surface-subtle/20 glass-radius-lg text-primary hover:glass-surface-subtle/30 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Prompt library */}
          {showPromptLibrary && <PromptLibrary />}

          {/* Advanced settings */}
          {showAdvancedSettings && <AdvancedSettings />}
        </div>

        {/* Generation history */}
        {showGenerationHistory && generationHistory.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-primary/80">Recent Generations</h4>
            <div className="space-y-2 glass-max-h-64 overflow-y-auto">
              {generationHistory.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center space-x-3 p-2 glass-radius-lg glass-surface-subtle/5 hover:glass-surface-subtle/10 cursor-pointer transition-colors"
                  onClick={() => {
                    setCurrentPrompt(entry.prompt)
                    onPromptChange?.(entry.prompt)
                  }}
                >
                  <img 
                    src={entry.imageUrl} 
                    alt="Generated" 
                    className="w-12 h-12 glass-radius object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-primary/90 truncate">{entry.prompt}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-primary/60">
                        {entry.settings.model}
                      </span>
                      <span className="text-xs text-primary/60">
                        {entry.settings.resolution}
                      </span>
                      <span className="text-xs text-primary/60">
                        {new Date(entry.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <canvas
          ref={canvasRef}
          className="hidden"
        />
      </OptimizedGlass>
    )
  }
)

GlassGenerativeArt.displayName = 'GlassGenerativeArt'