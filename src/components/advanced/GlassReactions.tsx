import { useReducedMotion } from '@/hooks/useReducedMotion';
/**
 * AuraGlass Reactions System
 * Interactive emoji reactions with glass physics and animations
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence, useSpring, useMotionValue } from 'framer-motion';
import { cn } from '@/lib/utils';
import { glassSoundDesign } from '../../utils/soundDesign';

interface Reaction {
  id: string;
  emoji: string;
  position: { x: number; y: number };
  user?: {
    id: string;
    name: string;
    avatar?: string;
  };
  timestamp: number;
  intensity: number; // 0-1
  physics?: {
    velocity: { x: number; y: number };
    rotation: number;
    scale: number;
  };
}

interface ReactionType {
  emoji: string;
  name: string;
  color: string;
  sound?: string;
  shortcut?: string;
}

interface GlassReactionsProps {
  children: React.ReactNode;
  className?: string;
  reactions?: Reaction[];
  reactionTypes?: ReactionType[];
  maxReactions?: number;
  autoExpire?: number; // ms
  enablePhysics?: boolean;
  enableSounds?: boolean;
  enableShortcuts?: boolean;
  enableBurst?: boolean;
  glassEffect?: boolean;
  onReactionAdd?: (reaction: Omit<Reaction, 'id' | 'timestamp'>) => void;
  onReactionExpire?: (reactionId: string) => void;
}

const defaultReactionTypes: ReactionType[] = [
  { emoji: '👍', name: 'Like', color: 'var(--glass-color-primary)', sound: 'success', shortcut: '1' },
  { emoji: '❤️', name: 'Love', color: 'var(--glass-color-danger)', sound: 'notification', shortcut: '2' },
  { emoji: '😂', name: 'Laugh', color: 'var(--glass-color-warning)', sound: 'tap', shortcut: '3' },
  { emoji: '😮', name: 'Wow', color: '#8b5cf6', sound: 'morph', shortcut: '4' },
  { emoji: '😢', name: 'Sad', color: 'var(--glass-gray-500)', sound: 'slide', shortcut: '5' },
  { emoji: '😡', name: 'Angry', color: 'var(--glass-color-danger-dark)', sound: 'error', shortcut: '6' },
  { emoji: '🎉', name: 'Celebrate', color: 'var(--glass-color-success)', sound: 'success', shortcut: '7' },
  { emoji: '🤔', name: 'Think', color: '#f97316', sound: 'hover', shortcut: '8' },
];

export function GlassReactions({
  children,
  className,
  reactions = [],
  reactionTypes = defaultReactionTypes,
  maxReactions = 50,
  autoExpire = 5000,
  enablePhysics = true,
  enableSounds = true,
  enableShortcuts = true,
  enableBurst = true,
  glassEffect = true,
  onReactionAdd,
  onReactionExpire,
}: GlassReactionsProps) {
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [localReactions, setLocalReactions] = useState<Reaction[]>([]);
  const [showPicker, setShowPicker] = useState(false);
  const [pickerPosition, setPickerPosition] = useState({ x: 0, y: 0 });
  const lastClickTime = useRef(0);
  const burstCount = useRef(0);
  
  // Combine local and external reactions
  const allReactions = [...reactions, ...localReactions].slice(-maxReactions);
  
  // Handle click for reactions
  const handleClick = useCallback((e: React.MouseEvent) => {
    const now = Date.now();
    const timeSinceLastClick = now - lastClickTime.current;
    
    // Double click detection for quick reactions
    if (timeSinceLastClick < 300) {
      // Quick double-click reaction
      const container = containerRef.current;
      if (!container) return;
      
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Use first reaction type for quick reaction
      addReaction(reactionTypes[0].emoji, { x, y }, 1);
      
      // Burst effect for triple+ clicks
      if (enableBurst && timeSinceLastClick < 150) {
        burstCount.current++;
        if (burstCount.current >= 2) {
          // Create burst of reactions
          for (let i = 0; i < 5; i++) {
            setTimeout(() => {
              const randomType = reactionTypes[Math.floor(Math.random() * reactionTypes.length)];
              addReaction(randomType.emoji, {
                x: x + (Math.random() - 0.5) * 100,
                y: y + (Math.random() - 0.5) * 100,
              }, Math.random() * 0.5 + 0.5);
            }, i * 100);
          }
        }
      }
    } else {
      burstCount.current = 0;
    }
    
    lastClickTime.current = now;
  }, [reactionTypes, enableBurst]);
  
  // Handle right click for reaction picker
  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    
    const container = containerRef.current;
    if (!container) return;
    
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setPickerPosition({ x, y });
    setShowPicker(true);
  }, []);
  
  // Add reaction
  const addReaction = useCallback((emoji: string, position: { x: number; y: number }, intensity: number = 1) => {
    const reactionType = reactionTypes.find(r => r.emoji === emoji);
    
    const reaction: Reaction = {
      id: `${Date.now()}-${Math.random()}`,
      emoji,
      position,
      timestamp: Date.now(),
      intensity,
      physics: enablePhysics ? {
        velocity: {
          x: (Math.random() - 0.5) * 200 * intensity,
          y: -Math.random() * 100 * intensity - 50,
        },
        rotation: (Math.random() - 0.5) * 180,
        scale: 0.8 + Math.random() * 0.4,
      } : undefined,
    };
    
    setLocalReactions((prev: any) => [...prev, reaction]);
    
    // Play sound
    if (enableSounds && reactionType?.sound) {
      glassSoundDesign.playGlassSound(reactionType.sound as any);
    }
    
    // Trigger haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(50 * intensity);
    }
    
    onReactionAdd?.(reaction);
    
    // Auto expire
    if (autoExpire > 0) {
      setTimeout(() => {
        setLocalReactions((prev: any) => prev.filter((r: any) => r.id !== reaction.id));
        onReactionExpire?.(reaction.id);
      }, autoExpire);
    }
  }, [reactionTypes, enablePhysics, enableSounds, autoExpire, onReactionAdd, onReactionExpire]);
  
  // Handle keyboard shortcuts
  useEffect(() => {
    if (!enableShortcuts) return;
    
    const handleKeyPress = (e: KeyboardEvent) => {
      // Only trigger on number keys
      if (e.key >= '1' && e.key <= '9') {
        const index = parseInt(e.key) - 1;
        const reactionType = reactionTypes[index];
        
        if (reactionType) {
          // Add reaction at center of screen
          const container = containerRef.current;
          if (container) {
            const rect = container.getBoundingClientRect();
            addReaction(reactionType.emoji, {
              x: rect.width / 2,
              y: rect.height / 2,
            });
          }
        }
      }
    };
    
    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [enableShortcuts, reactionTypes, addReaction]);
  
  return (
    <div
      ref={containerRef}
      className={cn("relative", className)}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
    >
      {children}
      
      {/* Reactions overlay */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <AnimatePresence>
          {allReactions.map((reaction: any) => (
            <ReactionComponent
              key={reaction.id}
              reaction={reaction}
              enablePhysics={enablePhysics}
              glassEffect={glassEffect}
            />
          ))}
        </AnimatePresence>
      </div>
      
      {/* Reaction picker */}
      <AnimatePresence>
        {showPicker && (
          <ReactionPicker
            position={pickerPosition}
            reactionTypes={reactionTypes}
            onReactionSelect={(emoji) => {
              addReaction(emoji, pickerPosition);
              setShowPicker(false);
            }}
            onClose={() => setShowPicker(false)}
            glassEffect={glassEffect}
          />
        )}
      </AnimatePresence>
      
      {/* Keyboard shortcuts hint */}
      {enableShortcuts && (
        <div className="absolute bottom-2 right-2 glass-surface-primary p-2 glass-radius-sm text-xs opacity-50">
          Press 1-{reactionTypes.length} for quick reactions
        </div>
      )}
    </div>
  );
}

// Individual reaction component
function ReactionComponent({
  reaction,
  enablePhysics,
  glassEffect,
}: {
  reaction: Reaction;
  enablePhysics: boolean;
  glassEffect: boolean;
}) {
  const prefersReducedMotion = useReducedMotion();
  const { emoji, position, physics, intensity, timestamp } = reaction;
  const age = (Date.now() - timestamp) / 1000; // seconds
  
  // Physics animation
  const x = useMotionValue(position.x);
  const y = useMotionValue(position.y);
  const rotation = useMotionValue(physics?.rotation || 0);
  const scale = useMotionValue(physics?.scale || 1);
  
  useEffect(() => {
    if (!enablePhysics || !physics) return;
    
    let animationId: number;
    let startTime = Date.now();
    
    const animate = () => {
      const now = Date.now();
      const deltaTime = (now - startTime) / 1000;
      startTime = now;
      
      // Apply gravity and velocity
      physics.velocity.y += 980 * deltaTime; // Gravity
      
      // Update position
      x.set(x.get() + physics.velocity.x * deltaTime);
      y.set(y.get() + physics.velocity.y * deltaTime);
      
      // Apply rotation
      rotation.set(rotation.get() + physics.rotation * deltaTime);
      
      // Apply scaling based on age (fade out)
      const ageScale = Math.max(0, 1 - age * 0.2);
      scale.set((physics.scale || 1) * ageScale);
      
      // Continue animation if still visible
      if (ageScale > 0) {
        animationId = requestAnimationFrame(animate);
      }
    };
    
    animationId = requestAnimationFrame(animate);
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [enablePhysics, physics, age, x, y, rotation, scale]);
  
  return (
    <motion.div
      className={cn(
        "absolute select-none",
        glassEffect && "OptimizedGlass intensity={0.2} blur={6} glass-blur-sm"
      )}
      style={{
        x: enablePhysics ? x : position.x,
        y: enablePhysics ? y : position.y,
        rotate: enablePhysics ? rotation : 0,
        scale: enablePhysics ? scale : 1,
        fontSize: `${24 + intensity * 12}px`,
      }}
      initial={{ 
        opacity: 0, 
        scale: 0,
        rotate: -180,
      }}
      animate={prefersReducedMotion ? {} : { 
        opacity: 1, 
        scale: enablePhysics ? undefined : 1 + intensity * 0.5,
        rotate: enablePhysics ? undefined : 0,
      }}
      exit={{ 
        opacity: 0, 
        scale: 0,
        rotate: 180,
      }}
      transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.3 }}
    >
      <span className="block transform -translate-x-1/2 -translate-y-1/2">
        {emoji}
      </span>
      
      {/* Glass shimmer effect */}
      {glassEffect && (
        <motion.div
          className="absolute inset-0 glass-gradient-primary glass-gradient-primary via-white glass-gradient-primary opacity-30"
          animate={prefersReducedMotion ? {} : {
            x: [-100, 100],
          }}
          transition={prefersReducedMotion ? { duration: 0 } : {
    duration: 2,
    repeat: Infinity,
    ease: 'linear',
          }}
        />
      )}
    </motion.div>
  );
}

// Reaction picker component
function ReactionPicker({
  position,
  reactionTypes,
  onReactionSelect,
  onClose,
  glassEffect,
}: {
  position: { x: number; y: number };
  reactionTypes: ReactionType[];
  onReactionSelect: (emoji: string) => void;
  onClose: () => void;
  glassEffect: boolean;
}) {
  const prefersReducedMotion = useReducedMotion();
  const pickerRef = useRef<HTMLDivElement>(null);
  
  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);
  
  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);
  
  return (
    <motion.div
      ref={pickerRef}
      className={cn(
        "absolute z-50 pointer-events-auto",
        glassEffect ? "glass-surface-primary glass-elev-3" : "bg-white shadow-lg",
        "glass-radius-lg glass-p-2"
      )}
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -100%)',
      }}
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      animate={prefersReducedMotion ? {} : { opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 10 }}
      transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.3 }}
    >
      <div className="grid grid-cols-4 gap-1">
        {reactionTypes.map((reactionType, index) => (
          <motion.button
            key={reactionType.emoji}
            className={cn(
              "w-10 h-10 flex items-center justify-center glass-radius-lg",
              "hover:bg-white/10 transition-colors glass-text-xl",
              glassEffect && "glass-button-secondary"
            )}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onReactionSelect(reactionType.emoji)}
            title={`${reactionType.name} (${reactionType.shortcut})`}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.3 }}
          >
            {reactionType.emoji}
          </motion.button>
        ))}
      </div>
      
      {/* Arrow pointer */}
      <div
        className={cn(
          "absolute top-full left-1/2 transform -translate-x-1/2",
          "w-0 h-0 border-l-4 border-r-4 border-t-4",
          "border-l-transparent border-r-transparent",
          glassEffect ? "border-t-white/20" : "border-t-white"
        )}
      />
    </motion.div>
  );
}

// Hook for reactions functionality
export function useGlassReactions() {
  const [reactions, setReactions] = useState<Reaction[]>([]);
  
  const addReaction = useCallback((
    emoji: string,
    position: { x: number; y: number },
    intensity: number = 1,
    user?: Reaction['user']
  ) => {
    const reaction: Reaction = {
      id: `${Date.now()}-${Math.random()}`,
      emoji,
      position,
      user,
      timestamp: Date.now(),
      intensity,
    };
    
    setReactions((prev: any) => [...prev, reaction]);
    
    return reaction;
  }, []);
  
  const removeReaction = useCallback((id: string) => {
    setReactions((prev: any) => prev.filter((r: any) => r.id !== id));
  }, []);
  
  const clearReactions = useCallback(() => {
    setReactions([]);
  }, []);
  
  return {
    reactions,
    addReaction,
    removeReaction,
    clearReactions,
  };
}

// Reaction bar component for quick access
export function GlassReactionBar({
  reactionTypes = defaultReactionTypes.slice(0, 6),
  onReactionClick,
  className,
  glassEffect = true,
}: {
  reactionTypes?: ReactionType[];
  onReactionClick?: (emoji: string) => void;
  className?: string;
  glassEffect?: boolean;
}) {
  const prefersReducedMotion = useReducedMotion();
  return (
    <motion.div
      className={cn(
        "flex items-center glass-gap-2 glass-p-2 glass-radius-full",
        glassEffect ? "glass-surface-primary glass-elev-2" : "bg-white shadow-lg",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
    >
      {reactionTypes.map((reactionType, index) => (
        <motion.button
          key={reactionType.emoji}
          className={cn(
            "w-8 h-8 flex items-center justify-center glass-radius-full",
            "hover:bg-white/10 transition-colors glass-text-lg",
            glassEffect && "glass-button-secondary"
          )}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onReactionClick?.(reactionType.emoji)}
          title={reactionType.name}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.3 }}
        >
          {reactionType.emoji}
        </motion.button>
      ))}
    </motion.div>
  );
}