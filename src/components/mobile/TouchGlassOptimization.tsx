'use client'

import { AnimatePresence, motion, PanInfo, useMotionValue } from 'framer-motion'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { cn } from '../../lib/utilsComprehensive'
import { createGlassStyle } from '../../core/mixins/glassMixins'

// Touch-Optimized Glass Component
interface TouchGlassProps {
  children: React.ReactNode
  onTap?: () => void
  onLongPress?: () => void
  onSwipe?: (direction: 'left' | 'right' | 'up' | 'down') => void
  className?: string
  touchFeedback?: boolean
  rippleEffect?: boolean
  hapticsEnabled?: boolean
  glassIntensity?: 'light' | 'medium' | 'heavy'
}

export function TouchOptimizedGlass({
  children,
  onTap,
  onLongPress,
  onSwipe,
  className='',
  touchFeedback = true,
  rippleEffect = true,
  hapticsEnabled = true,
  glassIntensity = 'medium'
}: TouchGlassProps) {
  const [isPressed, setIsPressed] = useState(false)
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number; timestamp: number }>>([])
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const scale = useMotionValue(1)
  const opacity = useMotionValue(1)

  // Haptic feedback function
  const triggerHaptics = useCallback((type: 'light' | 'medium' | 'heavy' = 'light') => {
    if (!hapticsEnabled || typeof window === 'undefined') return

    if ('navigator' in window && 'vibrate' in navigator) {
      const patterns = {
        light: [10],
        medium: [20],
        heavy: [30, 10, 30]
      }
      navigator.vibrate(patterns[type])
    }
  }, [hapticsEnabled])

  // Handle touch start
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault()
    setIsPressed(true)
    scale.set(0.95)

    if (touchFeedback) {
      triggerHaptics('light')
    }

    // Start long press timer
    if (onLongPress) {
      const timer = setTimeout(() => {
        triggerHaptics('medium')
        onLongPress()
        setLongPressTimer(null)
      }, 500)
      setLongPressTimer(timer)
    }

    // Add ripple effect
    if (rippleEffect && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      const touch = e.touches[0]
      const x = touch.clientX - rect.left
      const y = touch.clientY - rect.top

      const newRipple = {
        id: Date.now(),
        x,
        y,
        timestamp: Date.now()
      }

      setRipples(prev => [...prev, newRipple])

      // Remove ripple after animation
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== newRipple.id))
      }, 600)
    }
  }, [touchFeedback, rippleEffect, onLongPress, triggerHaptics, scale])

  // Handle touch end
  const handleTouchEnd = useCallback(() => {
    setIsPressed(false)
    scale.set(1)

    // Clear long press timer
    if (longPressTimer) {
      clearTimeout(longPressTimer)
      setLongPressTimer(null)
    }

    // Trigger tap if no long press occurred
    if (onTap && !longPressTimer) {
      triggerHaptics('light')
      onTap()
    }
  }, [longPressTimer, onTap, triggerHaptics, scale])

  // Handle pan gesture for swipe detection
  const handlePanEnd = useCallback((event: any, info: PanInfo) => {
    const { offset, velocity } = info
    const swipeThreshold = 50
    const velocityThreshold = 500

    if (Math.abs(offset.x) > swipeThreshold || Math.abs(velocity.x) > velocityThreshold) {
      const direction = offset.x > 0 ? 'right' : 'left'
      onSwipe?.(direction)
      triggerHaptics('medium')
    } else if (Math.abs(offset.y) > swipeThreshold || Math.abs(velocity.y) > velocityThreshold) {
      const direction = offset.y > 0 ? 'down' : 'up'
      onSwipe?.(direction)
      triggerHaptics('medium')
    }
  }, [onSwipe, triggerHaptics])

  const glassStyles = {
    light: createGlassStyle({ intent: "neutral", elevation: "level2" }),
    medium: createGlassStyle({ intent: "neutral", elevation: "level2" }),
    heavy: createGlassStyle({ intent: "neutral", elevation: "level2" })
  }

  const glassStyle = glassStyles[glassIntensity]

  return (
    <motion.div
      ref={containerRef}
      className={`relative overflow-hidden touch-none select-none ${className}`}
      style={{
        ...glassStyle,
        // Use createGlassStyle() instead,
        borderRadius: '12px',
        minHeight: '44px', // iOS minimum touch target
        minWidth: '44px',
        scale,
        opacity
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onPanEnd={handlePanEnd}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.1}
    >
      {children}

      {/* Ripple effects */}
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.div
            key={ripple.id}
            className="absolute pointer-events-none"
            style={{
              left: ripple.x - 20,
              top: ripple.y - 20,
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: '/* Use createGlassStyle({ intent: "neutral", elevation: "level2" }) */'
            }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 3, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        ))}
      </AnimatePresence>

      {/* Touch feedback overlay */}
      {touchFeedback && (
        <AnimatePresence>
          {isPressed && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: '/* Use createGlassStyle({ intent: "neutral", elevation: "level2" }) */',
                borderRadius: 'inherit'
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
            />
          )}
        </AnimatePresence>
      )}
    </motion.div>
  )
}

// Mobile Glass Navigation Component
interface MobileGlassNavigationProps {
  children: React.ReactNode
  swipeThreshold?: number
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  className?: string
}

export function MobileGlassNavigation({
  children,
  swipeThreshold = 50,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  className=''
}: MobileGlassNavigationProps) {
  const [swipeDirection, setSwipeDirection] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleSwipe = useCallback((direction: 'left' | 'right' | 'up' | 'down') => {
    setSwipeDirection(direction)

    switch (direction) {
      case 'left':
        onSwipeLeft?.()
        break
      case 'right':
        onSwipeRight?.()
        break
      case 'up':
        onSwipeUp?.()
        break
      case 'down':
        onSwipeDown?.()
        break
    }

    // Reset swipe direction after animation
    setTimeout(() => setSwipeDirection(null), 300)
  }, [onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown])

  return (
    <motion.div
      ref={containerRef}
      className={`relative ${className}`}
      style={createGlassStyle({ intent: "neutral", elevation: "level2" })}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      onDragEnd={(event, info) => {
        const { offset, velocity } = info

        if (Math.abs(offset.x) > swipeThreshold || Math.abs(velocity.x) > 500) {
          const direction = offset.x > 0 ? 'right' : 'left'
          handleSwipe(direction)
        } else if (Math.abs(offset.y) > swipeThreshold || Math.abs(velocity.y) > 500) {
          const direction = offset.y > 0 ? 'down' : 'up'
          handleSwipe(direction)
        }
      }}
      animate={swipeDirection ? {
        x: swipeDirection === 'left' ? -50 : swipeDirection === 'right' ? 50 : 0,
        y: swipeDirection === 'up' ? -50 : swipeDirection === 'down' ? 50 : 0,
        opacity: 0.7
      } : {
        x: 0,
        y: 0,
        opacity: 1
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {children}
    </motion.div>
  )
}

// Adaptive Glass Density Component
interface AdaptiveGlassDensityProps {
  children: React.ReactNode
  screenSize?: 'small' | 'medium' | 'large' | 'xlarge'
  devicePixelRatio?: number
  autoAdapt?: boolean
  className?: string
}

export function AdaptiveGlassDensity({
  children,
  screenSize,
  devicePixelRatio,
  autoAdapt = true,
  className=''
}: AdaptiveGlassDensityProps) {
  const [currentDensity, setCurrentDensity] = useState<'light' | 'medium' | 'heavy'>('medium')

  useEffect(() => {
    if (!autoAdapt) return

    const updateDensity = () => {
      const width = window.innerWidth
      const pixelRatio = devicePixelRatio || window.devicePixelRatio || 1

      let density: 'light' | 'medium' | 'heavy' = 'medium'

      if (width < 768) {
        density = pixelRatio > 2 ? 'light' : 'medium'
      } else if (width < 1200) {
        density = pixelRatio > 1.5 ? 'medium' : 'heavy'
      } else {
        density = pixelRatio > 1.5 ? 'heavy' : 'medium'
      }

      setCurrentDensity(density)
    }

    updateDensity()
    window.addEventListener('resize', updateDensity)
    return () => window.removeEventListener('resize', updateDensity)
  }, [autoAdapt, devicePixelRatio])

  const densityStyles = {
    light: createGlassStyle({ intent: "neutral", elevation: "level2" }),
    medium: createGlassStyle({ intent: "neutral", elevation: "level2" }),
    heavy: createGlassStyle({ intent: "neutral", elevation: "level2" })
  }

  const style = densityStyles[currentDensity]

  return (
    <motion.div
      className={className}
      style={{
        ...style,
        // Use createGlassStyle() instead,
        borderRadius: '12px',
        transition: 'all 0.3s ease-in-out'
      }}
      animate={{ opacity: 1 }}
      initial={{ opacity: 0 }}
    >
      {children}
    </motion.div>
  )
}

// Touch Ripple Effects Component
interface TouchRippleEffectsProps {
  children: React.ReactNode
  color?: string
  maxRipples?: number
  rippleDuration?: number
  className?: string
}

export function TouchRippleEffects({
  children,
  color = 'rgba(255, 255, 255, 0.3)',
  maxRipples = 3,
  rippleDuration = 600,
  className=''
}: TouchRippleEffectsProps) {
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([])
  const containerRef = useRef<HTMLDivElement>(null)

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const touch = e.touches[0]
    const x = touch.clientX - rect.left
    const y = touch.clientY - rect.top

    const newRipple = { id: Date.now(), x, y }
    setRipples(prev => {
      const updated = [...prev, newRipple]
      return updated.slice(-maxRipples) // Keep only the latest ripples
    })

    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id))
    }, rippleDuration)
  }, [maxRipples, rippleDuration])

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      onTouchStart={handleTouchStart}
    >
      {children}

      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.div
            key={ripple.id}
            className="absolute pointer-events-none glass-radius-full"
            style={{
              left: ripple.x - 20,
              top: ripple.y - 20,
              width: 40,
              height: 40,
              background: color
            }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 4, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: rippleDuration / 1000, ease: 'easeOut' }}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

// Mobile Glass Bottom Sheet Component
interface MobileGlassBottomSheetProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  height?: string
  snapPoints?: string[]
  className?: string
}

export function MobileGlassBottomSheet({
  isOpen,
  onClose,
  children,
  height = '50vh',
  snapPoints = ['25vh', '50vh', '75vh'],
  className=''
}: MobileGlassBottomSheetProps) {
  const [currentHeight, setCurrentHeight] = useState(height)

  const handleDragEnd = useCallback((event: any, info: PanInfo) => {
    const { offset, velocity } = info
    const swipeThreshold = 100

    if (offset.y > swipeThreshold || velocity.y > 500) {
      // Close the sheet if dragged down significantly
      onClose()
    } else {
      // Snap to nearest snap point
      const currentY = info.point.y
      const closestSnapPoint = snapPoints.reduce((closest, snapPoint) => {
        const snapY = parseFloat(snapPoint)
        const currentDiff = Math.abs(currentY - snapY)
        const closestDiff = Math.abs(currentY - parseFloat(closest))
        return currentDiff < closestDiff ? snapPoint : closest
      })

      setCurrentHeight(closestSnapPoint)
    }
  }, [onClose, snapPoints])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className={cn("glass-foundation-complete glass-position-fixed glass-inset-0 glass-surface-overlay glass-z-40")}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Bottom Sheet */}
          <motion.div
            className={`fixed bottom-0 left-0 right-0 z-50 ${className}`}
            style={createGlassStyle({ intent: "neutral", elevation: "level2" })}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.1}
            onDragEnd={handleDragEnd}
          >
            {/* Handle */}
            <div className="flex justify-center py-3">
              <div className={cn("glass-w-12 glass-h-1.5 glass-surface-secondary glass-radius-full")} />
            </div>

            {/* Content */}
            <div className="px-6 pb-6 overflow-y-auto max-h-full">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
