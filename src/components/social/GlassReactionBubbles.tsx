'use client';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import React, { forwardRef, useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { OptimizedGlass } from '../../primitives'
import { useGlassSound } from '../../utils/soundDesign'
import { useA11yId } from '../../utils/a11y'
import { useMotionPreference } from '../../hooks/useMotionPreference'
import { createGlassStyle } from '../../utils/createGlassStyle'

export interface ReactionBubble {
  id: string
  emoji: string
  userId: string
  userName: string
  userColor?: string
  x: number
  y: number
  timestamp: number
  size?: number
  velocity?: { x: number; y: number }
  life: number
  maxLife: number
}

export interface GlassReactionBubblesProps {
  width?: number
  height?: number
  reactions?: ReactionBubble[]
  availableEmojis?: string[]
  showControls?: boolean
  showUserNames?: boolean
  bubbleLifetime?: number
  maxBubbles?: number
  gravity?: number
  windForce?: number
  bounceEnabled?: boolean
  fadeOut?: boolean
  soundEnabled?: boolean
  realTimeMode?: boolean
  interactive?: boolean
  onReactionAdd?: (emoji: string, x?: number, y?: number) => void
  onReactionClick?: (reaction: ReactionBubble) => void
  className?: string
}

const defaultEmojis = [
  '❤️', '😀', '😂', '🎉', '👏', '🔥', '💯', '⭐',
  '👍', '👎', '😍', '🤔', '😮', '😢', '💪', '🙌'
]

const reactionColors = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57',
  '#FF9FF3', '#54A0FF', '#5F27CD', '#00D2D3', '#FF9F43'
]

export const GlassReactionBubbles = forwardRef<HTMLDivElement, GlassReactionBubblesProps>(
  ({
    width = 600,
    height = 400,
    reactions = [],
    availableEmojis = defaultEmojis,
    showControls = true,
    showUserNames = true,
    bubbleLifetime = 5000,
    maxBubbles = 50,
    gravity = 0.1,
    windForce = 0.05,
    bounceEnabled = true,
    fadeOut = true,
    soundEnabled = true,
    realTimeMode = false,
    interactive = true,
    onReactionAdd,
    onReactionClick,
    className='',
    ...props
  }, ref) => {
      const prefersReducedMotion = useReducedMotion();
    const [bubbles, setBubbles] = useState<ReactionBubble[]>(reactions)
    const [selectedEmoji, setSelectedEmoji] = useState(availableEmojis[0])
    const [isAnimating, setIsAnimating] = useState(false)
    const { play } = useGlassSound()
    const id = useA11yId('glass-reaction-bubbles')
    const { shouldAnimate } = useMotionPreference()

    // Simulated reactions in real-time mode
    useEffect(() => {
      if (!realTimeMode) return

      const interval = setInterval(() => {
        if (Math.random() < 0.3) {
          const emoji = availableEmojis[Math.floor(Math.random() * availableEmojis.length)]
          const x = Math.random() * (width - 40) + 20
          const y = Math.random() * (height - 40) + 20
          addReaction(emoji, x, y, `user-${Date.now()}`, 'Anonymous')
        }
      }, 2000)

      return () => clearInterval(interval)
    }, [realTimeMode, availableEmojis, width, height])

    // Physics simulation
    useEffect(() => {
      if (bubbles.length === 0) return

      const animationFrame = requestAnimationFrame(() => {
        setBubbles((prev: any) =>
          prev
            .map((bubble: any) => {
              // Update lifetime
              const newLife = bubble.life - 16 // Assuming ~60fps
              if (newLife <= 0) return null

              // Update position based on physics
              const newVelocity = { ...bubble.velocity! }
              newVelocity.y += gravity // Apply gravity
              newVelocity.x += (Math.random() - 0.5) * windForce // Apply wind

              let newX = bubble.x + newVelocity.x
              let newY = bubble.y + newVelocity.y

              // Bounce off walls if enabled
              if (bounceEnabled) {
                if (newX <= 0 || newX >= width - 40) {
                  newVelocity.x *= -0.7 // Damping on bounce
                  newX = Math.max(0, Math.min(width - 40, newX))
                }
                if (newY <= 0 || newY >= height - 40) {
                  newVelocity.y *= -0.7 // Damping on bounce
                  newY = Math.max(0, Math.min(height - 40, newY))
                }
              } else {
                // Wrap around
                if (newX < -40) newX = width
                if (newX > width) newX = -40
                if (newY < -40) newY = height
                if (newY > height) newY = -40
              }

              return {
                ...bubble,
                x: newX,
                y: newY,
                velocity: newVelocity,
                life: newLife
              }
            })
            .filter((bubble: any): bubble is NonNullable<typeof bubble> => bubble !== null)
        )
      })

      return () => cancelAnimationFrame(animationFrame)
    }, [bubbles, gravity, windForce, bounceEnabled, width, height])

    const addReaction = useCallback((emoji: string, x?: number, y?: number, userId?: string, userName?: string) => {
      const newBubble: ReactionBubble = {
        id: `reaction-${Date.now()}-${Math.random()}`,
        emoji,
        userId: userId || 'current',
        userName: userName || 'You',
        userColor: reactionColors[Math.floor(Math.random() * reactionColors.length)],
        x: x ?? Math.random() * (width - 40) + 20,
        y: y ?? Math.random() * (height - 40) + 20,
        timestamp: Date.now(),
        size: 30 + Math.random() * 20,
        velocity: {
          x: (Math.random() - 0.5) * 4,
          y: (Math.random() - 0.5) * 4 - 2 // Slight upward bias
        },
        life: bubbleLifetime,
        maxLife: bubbleLifetime
      }

      setBubbles((prev: any) => {
        const updated = [...prev, newBubble].slice(-maxBubbles)
        return updated
      })

      if (soundEnabled) {
        play('notification')
      }

      onReactionAdd?.(emoji, newBubble.x, newBubble.y)
    }, [width, height, bubbleLifetime, maxBubbles, soundEnabled, play, onReactionAdd])

    const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
      if (!interactive) return

      const rect = e.currentTarget.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      addReaction(selectedEmoji, x, y)
    }, [interactive, selectedEmoji, addReaction])

    const handleBubbleClick = useCallback((bubble: ReactionBubble, e: React.MouseEvent) => {
      e.stopPropagation()
      onReactionClick?.(bubble)
      
      // Add a small burst effect
      for (let i = 0; i < 3; i++) {
        addReaction(bubble.emoji, bubble.x + (Math.random() - 0.5) * 20, bubble.y + (Math.random() - 0.5) * 20)
      }
    }, [onReactionClick, addReaction])

    const getBubbleOpacity = (bubble: ReactionBubble) => {
      if (!fadeOut) return 1
      return Math.max(0.1, bubble.life / bubble.maxLife)
    }

    const getBubbleScale = (bubble: ReactionBubble) => {
      const ageRatio = 1 - (bubble.life / bubble.maxLife)
      return 0.8 + Math.sin(ageRatio * Math.PI) * 0.4
    }

    const ReactionBubbleComponent = ({ bubble }: { bubble: ReactionBubble }) => (
      <motion.div
        className={cn('glass-absolute glass-cursor-pointer glass-select-none glass-z-10')}
        style={{
          left: bubble.x,
          top: bubble.y,
          fontSize: bubble.size || 30
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={prefersReducedMotion ? {} : {
          scale: getBubbleScale(bubble),
          opacity: getBubbleOpacity(bubble),
          rotate: Math.sin(Date.now() / 1000 + bubble.timestamp) * 10
        }}
        exit={{
          scale: 0,
          opacity: 0,
          y: bubble.y - 50
        }}
        transition={shouldAnimate ? {
          type: 'spring',
          stiffness: 300,
          damping: 20
        } : { duration: 0 }}
        onClick={(e) => handleBubbleClick(bubble, e)}
        whileHover={{ scale: getBubbleScale(bubble) * 1.1 }}
        whileTap={{ scale: getBubbleScale(bubble) * 0.9 }}
      >
        <div className={`
          relative inline-flex items-center justify-center rounded-full
          ${createGlassStyle({ blur: 'sm', opacity: 0.8 }).background}
          border border-white/20
        `}>
          <span className={cn('glass-text-2xl')}>{bubble.emoji}</span>
          
          {showUserNames && (
            <motion.div
              className={cn('glass-absolute glass-bottom-8-neg glass-left-1/2 glass-transform glass-translate-x-1/2-neg')}
              initial={{ opacity: 0, y: 10 }}
              animate={prefersReducedMotion ? {} : { opacity: 0.8, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={shouldAnimate ? { delay: 0.2 } : { duration: 0 }}
            >
              <div className={`
                px-2 py-1 text-xs font-medium text-white rounded
                ${createGlassStyle({ blur: 'sm', opacity: 0.8 }).background}
                border border-white/20 whitespace-nowrap
              `}>
                {bubble.userName}
              </div>
            </motion.div>
          )}

          {/* Particle trail effect */}
          <motion.div
            className={cn('glass-absolute glass-inset-0 glass-radius-full')}
            style={{
              background: `radial-gradient(circle, ${bubble.userColor || '#FF6B6B'}40 0%, transparent 70%)`
            }}
            animate={prefersReducedMotion ? {} : {
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.1, 0.3]
            }}
            transition={shouldAnimate ? {
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            } : { duration: 0 }}
          />
        </div>
      </motion.div>
    )

    const EmojiSelector = () => (
      <motion.div
        className={`
          flex flex-wrap gap-2 p-3 rounded-lg max-w-xs
          ${createGlassStyle({ blur: 'sm', opacity: 0.8 }).background}
        `}
        initial={{ opacity: 0, y: 20 }}
        animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
        transition={shouldAnimate ? { duration: 0.3 } : { duration: 0 }}
      >
        {availableEmojis.map((emoji: any) => (
          <button
            key={emoji}
            onClick={() => setSelectedEmoji(emoji)}
            className={`
              w-10 h-10 rounded-lg flex items-center justify-center text-xl
              transition-all duration-200 hover:scale-110
              glass-focus glass-touch-target glass-contrast-guard
              ${selectedEmoji === emoji
                ? 'bg-white/20 ring-2 ring-blue-400/50'
                : 'hover:bg-white/10'
              }
            `}
          >
            {emoji}
          </button>
        ))}
      </motion.div>
    )

    const stats = {
      totalReactions: bubbles.length,
      recentReactions: bubbles.filter((b: any) => Date.now() - b.timestamp < 5000).length,
      mostUsedEmoji: bubbles.reduce((acc, bubble) => {
        acc[bubble.emoji] = (acc[bubble.emoji] || 0) + 1
        return acc
      }, {} as Record<string, number>)
    }

    const mostUsed = Object.entries(stats.mostUsedEmoji)
      .sort(([,a], [,b]) => b - a)[0]

    return (
      <OptimizedGlass
        ref={ref}
        intensity="subtle"
        className={cn('glass-relative glass-overflow-hidden', className)}
        style={{ width, height }}
        {...props}
      >
        {/* Main reaction area */}
        <div
          className={cn('glass-absolute glass-inset-0 glass-cursor-crosshair')}
          onClick={handleCanvasClick}
          style={{ width, height }}
        >
          <AnimatePresence>
            {bubbles.map((bubble: any) => (
              <ReactionBubbleComponent key={bubble.id} bubble={bubble} />
            ))}
          </AnimatePresence>

          {/* Floating particles for ambiance */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className={cn('glass-absolute glass-w-2 glass-h-2 glass-surface-muted glass-radius-full')}
              style={{
                left: Math.random() * width,
                top: Math.random() * height
              }}
              animate={prefersReducedMotion ? {} : {
                y: [0, -20, 0],
                opacity: [0.2, 0.8, 0.2],
                scale: [0.5, 1, 0.5]
              }}
              transition={shouldAnimate ? {
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: 'easeInOut'
              } : { duration: 0 }}
            />
          ))}
        </div>

        {/* Controls */}
        {showControls && (
          <div className={cn('glass-absolute glass-top-4 glass-left-4 glass-z-20')}>
            <EmojiSelector />
          </div>
        )}

        {/* Stats */}
        <motion.div
          className={`
            absolute top-4 right-4 z-20 p-3 rounded-lg
            ${createGlassStyle({ blur: 'sm', opacity: 0.8 }).background}
          `}
          initial={{ opacity: 0, x: 20 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
          transition={shouldAnimate ? { delay: 0.5 } : { duration: 0 }}
        >
          <div className={cn('glass-text-sm glass-text-secondary glass-space-y-1')}>
            <div className={cn('glass-flex glass-items-center glass-space-x-2')}>
              <span>{stats.totalReactions}</span>
              <span className={cn('glass-text-muted')}>total</span>
            </div>
            <div className={cn('glass-flex glass-items-center glass-space-x-2')}>
              <span>{stats.recentReactions}</span>
              <span className={cn('glass-text-muted')}>recent</span>
            </div>
            {mostUsed && (
              <div className={cn('glass-flex glass-items-center glass-space-x-2')}>
                <span>{mostUsed[0]}</span>
                <span className={cn('glass-text-muted')}>{mostUsed[1]}x</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Instructions */}
        {interactive && showControls && (
          <motion.div
            className={`
              absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20
              px-4 py-2 rounded-lg text-sm text-white/70
              ${createGlassStyle({ blur: 'sm', opacity: 0.8 }).background}
            `}
            initial={{ opacity: 0, y: 20 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={shouldAnimate ? { delay: 1 } : { duration: 0 }}
          >
            Click anywhere to add {selectedEmoji} • Click bubbles to multiply them
          </motion.div>
        )}

        {/* Real-time indicator */}
        {realTimeMode && (
          <div className={cn('glass-absolute glass-bottom-4 glass-right-4 glass-z-20 glass-flex glass-items-center glass-space-x-2 glass-text-sm glass-text-muted')}>
            <div className={cn('glass-w-2 glass-h-2 glass-surface-success glass-radius-full')} />
            <span>Live reactions</span>
          </div>
        )}
      </OptimizedGlass>
    )
  }
)