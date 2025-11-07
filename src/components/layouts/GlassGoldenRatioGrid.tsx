'use client'

import { AnimatePresence, motion } from 'framer-motion'
import React, { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { useMotionPreference } from '../../hooks/useMotionPreference'
import { OptimizedGlass } from '../../primitives'
import { useA11yId } from '../../utils/a11y'
import { useGlassSound } from '../../utils/soundDesign'
import { ContrastGuard, TextWithContrast } from '@/components/accessibility/ContrastGuard';

export interface GoldenRatioItem {
  id: string
  content: React.ReactNode
  priority?: number
  category?: string
  aspectRatio?: number
  minSize?: { width: number; height: number }
  maxSize?: { width: number; height: number }
  metadata?: Record<string, any>
}

export interface GoldenRatioSection {
  width: number
  height: number
  x: number
  y: number
  item?: GoldenRatioItem
  level: number
  ratio: number
}

export interface GlassGoldenRatioGridProps {
  items: GoldenRatioItem[]
  containerWidth?: number
  containerHeight?: number
  goldenRatio?: number
  subdivisionLevels?: number
  spacing?: number
  animateLayout?: boolean
  showGrid?: boolean
  showRatioLines?: boolean
  responsive?: boolean
  onItemClick?: (item: GoldenRatioItem) => void
  onItemHover?: (item: GoldenRatioItem | null) => void
  onLayoutChange?: (sections: GoldenRatioSection[]) => void
  glassConfig?: {
    blur?: number
    opacity?: number
    saturation?: number
    brightness?: number
    contrast?: number
  }
  soundEnabled?: boolean
  className?: string
  style?: React.CSSProperties
}

export const GlassGoldenRatioGrid = forwardRef<HTMLDivElement, GlassGoldenRatioGridProps>(
  ({
  // TODO: Integrate ContrastGuard for any section titles, labels, and helper text for WCAG AA compliance

    items = [],
    containerWidth = 800,
    containerHeight = 600,
    goldenRatio = 1.618,
    subdivisionLevels = 4,
    spacing = 8,
    animateLayout = true,
    showGrid = false,
    showRatioLines = true,
    responsive = true,
    onItemClick,
    onItemHover,
    onLayoutChange,
    glassConfig = {},
    soundEnabled = true,
    className='',
    style = {},
    ...props
  }, ref) => {
    const [hoveredItem, setHoveredItem] = useState<string | null>(null)
    const [selectedItem, setSelectedItem] = useState<string | null>(null)
    const [dimensions, setDimensions] = useState({ width: containerWidth, height: containerHeight })
    const containerRef = useRef<HTMLDivElement>(null)
    
    const { prefersReducedMotion } = useMotionPreference()
    const gridId = useA11yId()
    const { play } = useGlassSound()

    // Responsive dimension handling
    useEffect(() => {
      if (!responsive || !containerRef.current) return

      const resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
          const { width, height } = entry.contentRect
          setDimensions({ width, height })
        }
      })

      resizeObserver.observe(containerRef.current)
      return () => resizeObserver.disconnect()
    }, [responsive])

    // Generate golden ratio subdivisions
    const generateGoldenSections = useCallback((): GoldenRatioSection[] => {
      const sections: GoldenRatioSection[] = []
      const queue: Array<{ x: number; y: number; width: number; height: number; level: number }> = [
        { x: 0, y: 0, width: dimensions.width, height: dimensions.height, level: 0 }
      ]

      while (queue.length > 0 && sections.length < Math.pow(2, subdivisionLevels)) {
        const current = queue.shift()!
        
        if (current.level >= subdivisionLevels) {
          sections.push({
            ...current,
            ratio: current.width / current.height
          })
          continue
        }

        // Apply golden ratio subdivision
        const isHorizontalSplit = current.width > current.height
        
        if (isHorizontalSplit) {
          // Split horizontally using golden ratio
          const majorWidth = current.width / goldenRatio
          const minorWidth = current.width - majorWidth

          queue.push({
            x: current.x,
            y: current.y,
            width: majorWidth,
            height: current.height,
            level: current.level + 1
          })

          queue.push({
            x: current.x + majorWidth,
            y: current.y,
            width: minorWidth,
            height: current.height,
            level: current.level + 1
          })
        } else {
          // Split vertically using golden ratio
          const majorHeight = current.height / goldenRatio
          const minorHeight = current.height - majorHeight

          queue.push({
            x: current.x,
            y: current.y,
            width: current.width,
            height: majorHeight,
            level: current.level + 1
          })

          queue.push({
            x: current.x,
            y: current.y + majorHeight,
            width: current.width,
            height: minorHeight,
            level: current.level + 1
          })
        }
      }

      return sections
    }, [dimensions, goldenRatio, subdivisionLevels])

    // Assign items to sections based on priority and size requirements
    const assignItemsToSections = useCallback((sections: GoldenRatioSection[]): GoldenRatioSection[] => {
      const sortedItems = [...items].sort((a, b) => (b.priority || 0) - (a.priority || 0))
      const sortedSections = [...sections].sort((a, b) => (b.width * b.height) - (a.width * a.height))
      
      const assignedSections = sortedSections.map((section, index) => {
        const item = sortedItems[index]
        return {
          ...section,
          item: item || undefined
        }
      })

      return assignedSections
    }, [items])

    const sections = useMemo(() => {
      const goldenSections = generateGoldenSections()
      const assignedSections = assignItemsToSections(goldenSections)
      
      // Notify about layout changes
      onLayoutChange?.(assignedSections)
      
      return assignedSections
    }, [generateGoldenSections, assignItemsToSections, onLayoutChange])

    // Generate spiral golden ratio curve points
    const generateGoldenSpiral = useCallback((): Array<{ x: number; y: number }> => {
      const points: Array<{ x: number; y: number }> = []
      const centerX = dimensions.width / 2
      const centerY = dimensions.height / 2
      const maxRadius = Math.min(dimensions.width, dimensions.height) / 3

      for (let i = 0; i < 200; i++) {
        const angle = i * 0.2
        const radius = (maxRadius / 20) * Math.pow(goldenRatio, angle / (Math.PI * 2))
        
        const x = centerX + radius * Math.cos(angle)
        const y = centerY + radius * Math.sin(angle)
        
        if (x >= 0 && x <= dimensions.width && y >= 0 && y <= dimensions.height) {
          points.push({ x, y })
        }
      }

      return points
    }, [dimensions, goldenRatio])

    const spiralPoints = useMemo(() => generateGoldenSpiral(), [generateGoldenSpiral])

    const handleItemClick = useCallback((item: GoldenRatioItem) => {
      setSelectedItem(item.id)
      onItemClick?.(item)
      
      if (soundEnabled) {
        play('click')
      }
    }, [onItemClick, soundEnabled, play])

    const handleItemHover = useCallback((item: GoldenRatioItem | null) => {
      setHoveredItem(item?.id || null)
      onItemHover?.(item)
      
      if (soundEnabled && item) {
        play('hover')
      }
    }, [onItemHover, soundEnabled, play])

    const getItemVariants = () => ({
      hidden: {
        scale: 0,
        opacity: 0
      },
      visible: (delay: number) => ({
        scale: 1,
        opacity: 1,
        transition: {
          type: 'spring',
          tension: 300,
          friction: 25,
          delay: prefersReducedMotion ? 0 : delay * 0.05
        }
      }),
      hover: {
        scale: 1.02,
        transition: {
          type: 'spring',
          tension: 400,
          friction: 20
        }
      },
      selected: {
        scale: 1.05,
        transition: {
          type: 'spring',
          tension: 400,
          friction: 20
        }
      }
    })

    return (
      <OptimizedGlass
        ref={ref}
        className={`glass-golden-ratio-grid relative overflow-hidden ${className}`}
        style={{
          width: responsive ? '100%' : containerWidth,
          height: responsive ? '100%' : containerHeight,
          minHeight: containerHeight,
          ...style
        }}
        glassConfig={{
          blur: 12,
          opacity: 0.95,
          saturation: 1.05,
          brightness: 1.02,
          ...glassConfig
        }}
        role="grid"
        aria-label="Golden ratio layout grid"
        id={gridId}
        {...props}
      >
        <div
          ref={containerRef}
          className="absolute inset-0"
          style={{ width: dimensions.width, height: dimensions.height }}
        >
          {/* Golden spiral overlay */}
          {showRatioLines && (
            <svg
              className="absolute inset-0 pointer-events-none"
              width={dimensions.width}
              height={dimensions.height}
            >
              <path
                d={`M ${spiralPoints.map((p: any) => `${p.x},${p.y}`).join(' L ')}`}
                stroke="rgba(255, 215, 0, 0.3)"
                strokeWidth="2"
                fill="none"
                strokeDasharray="5,5"
              />
            </svg>
          )}

          {/* Grid lines */}
          {showGrid && (
            <svg
              className="absolute inset-0 pointer-events-none"
              width={dimensions.width}
              height={dimensions.height}
            >
              {sections.map((section, index) => (
                <rect
                  key={`grid-${index}`}
                  x={section.x}
                  y={section.y}
                  width={section.width}
                  height={section.height}
                  stroke="rgba(var(--glass-color-white) / var(--glass-opacity-20))"
                  strokeWidth="1"
                  fill="none"
                  strokeDasharray="3,3"
                />
              ))}
            </svg>
          )}

          {/* Grid sections with items */}
          <AnimatePresence>
            {sections.map((section, index) => {
              const hasItem = !!section.item
              const isHovered = hasItem && hoveredItem === section.item!.id
              const isSelected = hasItem && selectedItem === section.item!.id

              return (
                <motion.div
                  key={`section-${index}`}
                  className={`
                    absolute overflow-hidden
                    ${hasItem ? 'cursor-pointer' : 'cursor-default'}
                  `}
                  style={{
                    left: section.x + spacing / 2,
                    top: section.y + spacing / 2,
                    width: section.width - spacing,
                    height: section.height - spacing
                  }}
                  custom={index}
                  variants={getItemVariants()}
                  initial="hidden"
                  animate={isSelected ? "selected" : isHovered ? "hover" : "visible"}
                  exit="hidden"
                  onMouseEnter={() => hasItem && handleItemHover(section.item!)}
                  onMouseLeave={() => handleItemHover(null)}
                  onClick={() => hasItem && handleItemClick(section.item!)}
                >
                  {hasItem ? (
                    <div
                      className={`
                        w-full h-full glass-surface rounded-lg border border-white/20 
                        backdrop-blur-md transition-all duration-200 p-3
                        flex items-center justify-center text-center
                        ${isHovered || isSelected
                          ? 'bg-white/20 border-white/40'
                          : 'bg-white/10 border-white/20'
                        }
                      `}
                    >
                      {section.item!.content}
                    </div>
                  ) : (
                    <div
                      className="w-full h-full border border-dashed border-white/10 glass-radius-lg
                                flex items-center justify-center text-primary/30"
                    >
                      <div className="text-xs">Empty</div>
                    </div>
                  )}

                  {/* Section info overlay */}
                  {(showGrid || isHovered) && (
                    <div className="absolute glass--glass--glass--glass--glassglass--glass-top-1 left-1 glass-surface-dark/50 text-primary text-xs px-1 py-0.5 glass-radius backdrop-blur-sm">
                      {section.ratio.toFixed(2)}
                    </div>
                  )}

                  {/* Golden ratio indicator */}
                  {Math.abs(section.ratio - goldenRatio) < 0.1 && (
                    <div className="absolute glass--glass--glass--glass--glassglass--glass-top-1 right-1 w-2 h-2 glass-surface-yellow glass-radius-full opacity-70" />
                  )}
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        {/* Statistics panel */}
        <div className="absolute bottom-4 left-4 flex flex-col gap-1 text-xs text-primary/70">
          <div className="glass-surface-dark/20 px-2 py-1 glass-radius backdrop-blur-sm">
            Sections: {sections.length}
          </div>
          <div className="glass-surface-dark/20 px-2 py-1 glass-radius backdrop-blur-sm">
            Items: {items.length}
          </div>
          <div className="glass-surface-dark/20 px-2 py-1 glass-radius backdrop-blur-sm">
            Golden Ratio: {goldenRatio}
          </div>
          <div className="glass-surface-dark/20 px-2 py-1 glass-radius backdrop-blur-sm">
            Levels: {subdivisionLevels}
          </div>
        </div>

        {/* Legend */}
        <div className="absolute top-4 right-4 flex flex-col gap-1 text-xs text-primary/70">
          <div className="flex items-center gap-2 glass-surface-dark/20 px-2 py-1 glass-radius backdrop-blur-sm">
            <div className="w-2 h-2 glass-surface-yellow glass-radius-full" />
            Golden Ratio
          </div>
          {showRatioLines && (
            <div className="flex items-center gap-2 glass-surface-dark/20 px-2 py-1 glass-radius backdrop-blur-sm">
              <div className="w-4 h-0-5 glass-surface-yellow opacity-50" style={{ background: 'repeating-linear-gradient(to right, var(--glass-color-warning-light) 0, var(--glass-color-warning-light) 3px, transparent 3px, transparent 6px)' }} />
              Spiral
            </div>
          )}
        </div>
      </OptimizedGlass>
    )
  }
)

GlassGoldenRatioGrid.displayName = 'GlassGoldenRatioGrid'