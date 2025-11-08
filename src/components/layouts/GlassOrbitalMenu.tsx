import { AnimatePresence, motion, useMotionValue, useTransform } from 'framer-motion'
import React, { forwardRef, useCallback, useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { useMotionPreference } from '../../hooks/useMotionPreference'
import { OptimizedGlass } from '../../primitives'
import { useA11yId } from '../../utils/a11y'
import { useGlassSound } from '../../utils/soundDesign'

export interface OrbitalMenuItem {
  id: string
  label: string
  icon?: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  shortcut?: string
  category?: string
  priority?: number
  metadata?: Record<string, any>
}

export interface GlassOrbitalMenuProps {
  items: OrbitalMenuItem[]
  centerElement?: React.ReactNode
  radius?: number
  itemSize?: number
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
  rotationSpeed?: number
  autoRotate?: boolean
  hoverExpansion?: number
  springTension?: number
  springFriction?: number
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

export const GlassOrbitalMenu = forwardRef<HTMLDivElement, GlassOrbitalMenuProps>(
  ({
    items = [],
    centerElement,
    radius = 120,
    itemSize = 48,
    isOpen = false,
    onOpenChange,
    rotationSpeed = 0.5,
    autoRotate = false,
    hoverExpansion = 1.2,
    springTension = 300,
    springFriction = 25,
    glassConfig = {},
    soundEnabled = true,
    className='',
    style = {},
    ...props
  }, ref) => {
    const [activeItem, setActiveItem] = useState<string | null>(null)
    const [hoveredItem, setHoveredItem] = useState<string | null>(null)
    const [rotation, setRotation] = useState(0)
    const containerRef = useRef<HTMLDivElement>(null)
    const animationRef = useRef<number>()
    
    const { prefersReducedMotion } = useMotionPreference()
    const menuId = useA11yId()
    const { play } = useGlassSound()

    const rotationValue = useMotionValue(0)
    const rotationTransform = useTransform(rotationValue, [0, 360], [0, 360])

    useEffect(() => {
      if (autoRotate && isOpen && !prefersReducedMotion) {
        const animate = () => {
          setRotation((prev: any) => (prev + rotationSpeed) % 360)
          rotationValue.set(rotation)
          animationRef.current = requestAnimationFrame(animate)
        }
        animationRef.current = requestAnimationFrame(animate)
      }
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current)
        }
      }
    }, [autoRotate, isOpen, rotationSpeed, prefersReducedMotion, rotation, rotationValue])

    const handleCenterClick = useCallback(() => {
      onOpenChange?.(!isOpen)
      if (soundEnabled) {
        play(isOpen ? 'close' : 'open')
      }
    }, [isOpen, onOpenChange, soundEnabled, play])

    const handleItemClick = useCallback((item: OrbitalMenuItem) => {
      if (item.disabled) return
      
      setActiveItem(item.id)
      item.onClick?.()
      
      if (soundEnabled) {
        play('click')
      }

      setTimeout(() => setActiveItem(null), 200)
    }, [soundEnabled, play])

    const handleItemHover = useCallback((itemId: string | null) => {
      setHoveredItem(itemId)
      if (soundEnabled && itemId) {
        play('hover')
      }
    }, [soundEnabled, play])

    const calculateItemPosition = useCallback((index: number, total: number) => {
      const angle = ((360 / total) * index + rotation) * (Math.PI / 180)
      const x = Math.cos(angle) * radius
      const y = Math.sin(angle) * radius
      return { x, y, angle: angle * (180 / Math.PI) }
    }, [radius, rotation])

    const getItemVariants = () => ({
      hidden: {
        scale: 0,
        opacity: 0,
        x: 0,
        y: 0
      },
      visible: (i: number) => ({
        scale: 1,
        opacity: 1,
        x: calculateItemPosition(i, items.length).x,
        y: calculateItemPosition(i, items.length).y,
        transition: {
          type: 'spring',
          tension: springTension,
          friction: springFriction,
          delay: prefersReducedMotion ? 0 : i * 0.1
        }
      }),
      hover: {
        scale: hoverExpansion,
        transition: {
          type: 'spring',
          tension: springTension * 2,
          friction: springFriction
        }
      },
      active: {
        scale: 0.9,
        transition: {
          type: 'spring',
          tension: springTension * 3,
          friction: springFriction
        }
      }
    })

    const centerVariants = {
      closed: {
        rotate: 0,
        scale: 1
      },
      open: {
        rotate: prefersReducedMotion ? 0 : 180,
        scale: 1.1,
        transition: {
          type: 'spring',
          tension: springTension,
          friction: springFriction
        }
      }
    }

    return (
      <OptimizedGlass
        ref={ref}
        className={`glass-orbital-menu relative ${className}`}
        style={{
          width: (radius + itemSize) * 2 + 40,
          height: (radius + itemSize) * 2 + 40,
          ...style
        }}
        glassConfig={{
          blur: 20,
          opacity: 0.8,
          saturation: 1.2,
          brightness: 1.1,
          ...glassConfig
        }}
        aria-label="Orbital navigation menu"
        role="menu"
        id={menuId}
        {...props}
      >
        <div
          ref={containerRef}
          className="absolute inset-0 flex items-center justify-center"
        >
          {/* Center Button */}
          <motion.button
            className="relative z-20 flex items-center justify-center glass-surface glass-radius-full border border-white/20 backdrop-blur-md glass-surface-subtle/10 hover:glass-surface-subtle/15 transition-colors"
            style={{
              width: itemSize + 8,
              height: itemSize + 8
            }}
            variants={centerVariants}
            animate={isOpen ? 'open' : 'closed'}
            onClick={handleCenterClick}
            aria-expanded={isOpen}
            aria-controls={`${menuId}-items`}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
          >
            {centerElement || (
              <motion.div
                className="w-6 h-6 flex flex-col items-center justify-center"
                animate={{ rotate: isOpen ? 45 : 0 }}
              >
                <div className="w-4 h-0-5 glass-surface-subtle/70 mb-1" />
                <div className="w-4 h-0-5 glass-surface-subtle/70" />
              </motion.div>
            )}
          </motion.button>

          {/* Orbital Items */}
          <div
            id={`${menuId}-items`}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            role="group"
          >
            <AnimatePresence>
              {isOpen && items.map((item, index) => {
                const position = calculateItemPosition(index, items.length)
                const isHovered = hoveredItem === item.id
                const isActive = activeItem === item.id

                return (
                  <motion.div
                    key={item.id}
                    className="absolute pointer-events-auto"
                    custom={index}
                    variants={getItemVariants()}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    whileHover={!item.disabled ? "hover" : undefined}
                    style={{
                      x: position.x,
                      y: position.y
                    }}
                  >
                    <motion.button
                      className={`
                        relative flex items-center justify-center glass-surface rounded-full
                        border border-white/20 backdrop-blur-md transition-all duration-200
                        ${item.disabled
                          ? 'bg-white/5 text-white/40 cursor-not-allowed'
                          : 'bg-white/10 hover:bg-white/15 text-white/90 hover:text-white'
                        }
                        ${isActive ? 'ring-2 ring-white/40' : ''}
                      `}
                      style={{
                        width: itemSize,
                        height: itemSize
                      }}
                      onClick={() => handleItemClick(item)}
                      onMouseEnter={() => handleItemHover(item.id)}
                      onMouseLeave={() => handleItemHover(null)}
                      disabled={item.disabled}
                      role="menuitem"
                      aria-label={item.label}
                      title={item.shortcut ? `${item.label} (${item.shortcut})` : item.label}
                    >
                      {item.icon && (
                        <div className="text-lg">
                          {item.icon}
                        </div>
                      )}
                      
                      {item.shortcut && (
                        <div className="absolute -glass-top-2 -right-2 glass-surface-dark/50 text-primary/70 text-xs px-1 py-0.5 glass-radius text-[10px] backdrop-blur-sm">
                          {item.shortcut}
                        </div>
                      )}

                      {/* Hover Label */}
                      <AnimatePresence>
                        {isHovered && !prefersReducedMotion && (
                          <motion.div
                            className="absolute top-full mt-2 glass-surface-dark/80 text-primary text-xs px-2 py-1 glass-radius backdrop-blur-sm whitespace-nowrap"
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            transition={{ duration: 0.15 }}
                          >
                            {item.label}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>

          {/* Orbital Ring Indicator */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                className="absolute border border-white/10 glass-radius-full pointer-events-none"
                style={{
                  width: radius * 2,
                  height: radius * 2
                }}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{
                  type: 'spring',
                  tension: springTension,
                  friction: springFriction
                }}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Status Display */}
        <div className="absolute bottom-2 right-2 text-xs text-primary/60">
          {items.length} items
        </div>
      </OptimizedGlass>
    )
  }
)

GlassOrbitalMenu.displayName = 'GlassOrbitalMenu'