import React, { forwardRef, useState, useEffect, useCallback } from 'react';
import { OptimizedGlass } from '../../primitives';
import { Motion } from '../../primitives';
import { cn } from '../../lib/utilsComprehensive';
import { useA11yId } from '../../utils/a11y';
import { useMotionPreferenceContext } from '../../contexts/MotionPreferenceContext';
import { useGlassSound } from '../../utils/soundDesign';

export interface MoodState {
  name: string;
  color: string;
  intensity: number;
  description: string;
  icon?: React.ReactNode;
}

export interface GlassMoodRingProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Current mood state */
  mood?: MoodState;
  /** Available mood states */
  moodStates?: MoodState[];
  /** Size of the mood ring */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Whether the ring is interactive */
  interactive?: boolean;
  /** Whether to show mood transitions */
  animated?: boolean;
  /** Transition duration in milliseconds */
  transitionDuration?: number;
  /** Whether to show mood labels */
  showLabels?: boolean;
  /** Whether to show mood description */
  showDescription?: boolean;
  /** Custom mood change handler */
  onMoodChange?: (mood: MoodState) => void;
  /** Auto-transition interval in milliseconds */
  autoTransition?: number;
  /** Whether to enable biometric integration */
  biometricIntegration?: boolean;
  /** Ambient response to environmental factors */
  ambientResponse?: boolean;
  /** Ring thickness */
  thickness?: 'thin' | 'medium' | 'thick';
  /** Glow effect intensity */
  glowIntensity?: 'none' | 'subtle' | 'medium' | 'strong';
  /** Pulse animation */
  pulse?: boolean;
  /** Respect user's motion preferences */
  respectMotionPreference?: boolean;
}

const defaultMoodStates: MoodState[] = [
  { name: 'Happy', color: '#FFD700', intensity: 0.8, description: 'Feeling joyful and content' },
  { name: 'Calm', color: '#87CEEB', intensity: 0.6, description: 'Peaceful and relaxed' },
  { name: 'Energetic', color: '#FF4500', intensity: 0.9, description: 'Full of energy and excitement' },
  { name: 'Focused', color: '#9370DB', intensity: 0.7, description: 'Concentrated and determined' },
  { name: 'Stressed', color: '#DC143C', intensity: 0.8, description: 'Feeling overwhelmed or tense' },
  { name: 'Creative', color: '#FF69B4', intensity: 0.75, description: 'In a creative and imaginative state' },
  { name: 'Melancholic', color: '#4169E1', intensity: 0.5, description: 'Reflective and somewhat sad' },
  { name: 'Excited', color: '#32CD32', intensity: 0.85, description: 'Thrilled and anticipatory' },
  { name: 'Anxious', color: '#FF6347', intensity: 0.7, description: 'Worried or apprehensive' },
  { name: 'Peaceful', color: '#98FB98', intensity: 0.4, description: 'Completely at ease and serene' }
];

export const GlassMoodRing = forwardRef<HTMLDivElement, GlassMoodRingProps>(
  (
    {
      mood,
      moodStates = defaultMoodStates,
      size = 'md',
      interactive = true,
      animated = true,
      transitionDuration = 1000,
      showLabels = true,
      showDescription = false,
      onMoodChange,
      autoTransition,
      biometricIntegration = false,
      ambientResponse = false,
      thickness = 'medium',
      glowIntensity = 'medium',
      pulse = false,
      respectMotionPreference = true,
      className,
      ...props
    },
    ref
  ) => {
    const { prefersReducedMotion } = useMotionPreferenceContext();
    const { play } = useGlassSound();
    const moodRingId = useA11yId('glass-mood-ring');
    
    const [currentMood, setCurrentMood] = useState<MoodState>(mood || moodStates[0]);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [autoTransitionActive, setAutoTransitionActive] = useState(false);

    const sizeConfig = {
      sm: {
        ring: 'w-16 h-16',
        center: 'w-8 h-8',
        text: 'glass-text-xs',
        description: 'glass-text-xs',
        glow: 'shadow-lg',
      },
      md: {
        ring: 'w-24 h-24',
        center: 'w-12 h-12',
        text: 'glass-text-sm',
        description: 'glass-text-sm',
        glow: 'shadow-xl',
      },
      lg: {
        ring: 'w-32 h-32',
        center: 'w-16 h-16',
        text: 'glass-text-base',
        description: 'glass-text-base',
        glow: 'shadow-2xl',
      },
      xl: {
        ring: 'w-40 h-40',
        center: 'w-20 h-20',
        text: 'glass-text-lg',
        description: 'glass-text-lg',
        glow: 'shadow-2xl',
      },
    };

    const thicknessConfig = {
      thin: 'border-2',
      medium: 'border-4',
      thick: 'border-8',
    };

    const glowConfig = {
      none: '',
      subtle: 'shadow-sm',
      medium: 'shadow-lg shadow-current/30',
      strong: 'shadow-2xl shadow-current/50',
    };

    const config = sizeConfig[size];

    // Auto-transition effect
    useEffect(() => {
      if (!autoTransition || !autoTransitionActive) return;

      const interval = setInterval(() => {
        const currentIndex = moodStates.findIndex(m => m.name === currentMood.name);
        const nextIndex = (currentIndex + 1) % moodStates.length;
        handleMoodChange(moodStates[nextIndex]);
      }, autoTransition);

      return () => clearInterval(interval);
    }, [autoTransition, autoTransitionActive, currentMood, moodStates]);

    // Biometric integration simulation
    useEffect(() => {
      if (!biometricIntegration) return;

      // Simulate biometric data affecting mood
      const biometricInterval = setInterval(() => {
        // This would normally connect to actual biometric sensors
        const randomMood = moodStates[Math.floor(Math.random() * moodStates.length)];
        if (Math.random() > 0.8) { // 20% chance to change
          handleMoodChange(randomMood);
        }
      }, 10000);

      return () => clearInterval(biometricInterval);
    }, [biometricIntegration, moodStates]);

    // Ambient response simulation
    useEffect(() => {
      if (!ambientResponse) return;

      // Simulate environmental factors affecting mood
      const ambientInterval = setInterval(() => {
        const hour = new Date().getHours();
        let ambientMood = currentMood;

        // Simulate time of day effects
        if (hour >= 6 && hour < 12) {
          ambientMood = moodStates.find(m => m.name === 'Energetic') || currentMood;
        } else if (hour >= 12 && hour < 18) {
          ambientMood = moodStates.find(m => m.name === 'Focused') || currentMood;
        } else if (hour >= 18 && hour < 22) {
          ambientMood = moodStates.find(m => m.name === 'Calm') || currentMood;
        } else {
          ambientMood = moodStates.find(m => m.name === 'Peaceful') || currentMood;
        }

        if (ambientMood !== currentMood) {
          handleMoodChange(ambientMood);
        }
      }, 60000); // Check every minute

      return () => clearInterval(ambientInterval);
    }, [ambientResponse, currentMood, moodStates]);

    // Handle mood changes
    const handleMoodChange = useCallback((newMood: MoodState) => {
      if (newMood.name === currentMood.name) return;

      setIsTransitioning(true);
      
      setTimeout(() => {
        setCurrentMood(newMood);
        setIsTransitioning(false);
        onMoodChange?.(newMood);
        play('mood_change');
      }, animated ? transitionDuration / 2 : 0);
    }, [currentMood, animated, transitionDuration, onMoodChange, play]);

    // Handle ring click
    const handleRingClick = useCallback(() => {
      if (!interactive) return;

      const currentIndex = moodStates.findIndex(m => m.name === currentMood.name);
      const nextIndex = (currentIndex + 1) % moodStates.length;
      handleMoodChange(moodStates[nextIndex]);
    }, [interactive, moodStates, currentMood, handleMoodChange]);

    // Toggle auto-transition
    const toggleAutoTransition = useCallback(() => {
      setAutoTransitionActive(!autoTransitionActive);
      play('toggle');
    }, [autoTransitionActive, play]);

    return (
      <OptimizedGlass
        ref={ref}
        id={moodRingId}
        elevation="level2"
        intensity="medium"
        depth={2}
        tint="neutral"
        border="subtle"
        className={cn(
          'glass-mood-ring relative inline-flex flex-col items-center justify-center glass-p-6 glass-radius-lg',
          'backdrop-blur-md border border-border/20',
          className
        )}
        {...props}
      >
        <Motion
          preset={!prefersReducedMotion && respectMotionPreference ? "fadeIn" : "none"}
          className="flex flex-col items-center gap-4"
        >
          {/* Main Mood Ring */}
          <div className="relative">
            <Motion
              as="div"
              preset={!prefersReducedMotion && respectMotionPreference ? "scaleIn" : "none"}
              className={cn(
                'relative glass-radius-full border-solid transition-all duration-1000',
                config.ring,
                thicknessConfig[thickness],
                glowConfig[glowIntensity],
                interactive && 'cursor-pointer hover:scale-105',
                pulse && !prefersReducedMotion && 'animate-pulse',
                isTransitioning && 'opacity-50'
              )}
              style={{
                borderColor: currentMood.color,
                boxShadow: glowIntensity !== 'none' ? `0 0 20px ${currentMood.color}40` : undefined
              }}
              onClick={handleRingClick}
              role={interactive ? 'button' : 'status'}
              aria-label={`Current mood: ${currentMood.name} - ${currentMood.description}`}
              tabIndex={interactive ? 0 : -1}
              onKeyDown={(e) => {
                if ((e.key === 'Enter' || e.key === ' ') && interactive) {
                  e.preventDefault();
                  handleRingClick();
                }
              }}
            >
              {/* Center circle */}
              <div
                className={cn(
                  'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
                  'glass-radius-full flex items-center justify-center transition-all duration-1000',
                  config.center,
                  !prefersReducedMotion && 'animate-pulse'
                )}
                style={{
                  backgroundColor: `${currentMood.color}${Math.round(currentMood.intensity * 255).toString(16)}`,
                  boxShadow: `inset 0 0 10px ${currentMood.color}80`
                }}
              >
                {currentMood.icon && (
                  <div className="text-primary/90">
                    {currentMood.icon}
                  </div>
                )}
              </div>

              {/* Intensity rings */}
              {Array.from({ length: 3 }, (_, i) => (
                <div
                  key={i}
                  className={cn(
                    'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
                    'glass-radius-full border transition-all duration-1000',
                    !prefersReducedMotion && 'animate-pulse'
                  )}
                  style={{
                    width: `${60 + i * 20}%`,
                    height: `${60 + i * 20}%`,
                    borderColor: `${currentMood.color}${Math.round((currentMood.intensity - i * 0.2) * 255).toString(16)}`,
                    animationDelay: `${i * 200}ms`,
                    opacity: Math.max(0, currentMood.intensity - i * 0.3)
                  }}
                />
              ))}
            </Motion>

            {/* Transition overlay */}
            {isTransitioning && (
              <div className={cn(
                'absolute inset-0 glass-radius-full bg-gradient-radial from-white/20 to-transparent',
                'animate-spin'
              )} />
            )}
          </div>

          {/* Mood Information */}
          <div className="text-center gap-2">
            {showLabels && (
              <Motion
                preset={!prefersReducedMotion && respectMotionPreference ? "slideUp" : "none"}
                className={cn(
                  'font-semibold transition-colors duration-500',
                  config.text
                )}
                style={{ color: currentMood.color }}
              >
                {currentMood.name}
              </Motion>
            )}

            {showDescription && (
              <Motion
                preset={!prefersReducedMotion && respectMotionPreference ? "slideUp" : "none"}
                delay={100}
                className={cn(
                  'glass-text-secondary max-w-xs text-center',
                  config.description
                )}
              >
                {currentMood.description}
              </Motion>
            )}
          </div>

          {/* Mood Selector */}
          {interactive && moodStates.length > 1 && (
            <Motion
              preset={!prefersReducedMotion && respectMotionPreference ? "slideUp" : "none"}
              delay={200}
              className="flex flex-wrap gap-1 justify-center max-w-xs"
            >
              {moodStates.map((mood, index) => (
                <button
                  key={mood.name}
                  onClick={() => handleMoodChange(mood)}
                  className={cn(
                    'w-6 h-6 glass-radius-full border-2 transition-all duration-200',
                    'hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2',
                    currentMood.name === mood.name && 'ring-2 ring-white',
                    'focus:ring-white/50'
                  )}
                  style={{
                    backgroundColor: mood.color,
                    borderColor: currentMood.name === mood.name ? 'white' : mood.color
                  }}
                  title={mood.name}
                  aria-label={`Select ${mood.name} mood`}
                />
              ))}
            </Motion>
          )}

          {/* Controls */}
          {(autoTransition || biometricIntegration || ambientResponse) && (
            <Motion
              preset={!prefersReducedMotion && respectMotionPreference ? "slideUp" : "none"}
              delay={300}
              className="flex gap-2 items-center text-xs glass-text-secondary"
            >
              {autoTransition && (
                <button
                  onClick={toggleAutoTransition}
                  className={cn(
                    'glass-px-2 glass-py-1 glass-radius-md border transition-colors',
                    autoTransitionActive 
                      ? 'bg-primary/20 border-primary/40 text-primary' 
                      : 'border-border/40 hover:border-border'
                  )}
                >
                  Auto {autoTransitionActive ? 'On' : 'Off'}
                </button>
              )}

              {biometricIntegration && (
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 glass-surface-green glass-radius-full animate-pulse" />
                  <span>Bio</span>
                </div>
              )}

              {ambientResponse && (
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 glass-surface-blue glass-radius-full animate-pulse" />
                  <span>Ambient</span>
                </div>
              )}
            </Motion>
          )}
        </Motion>
      </OptimizedGlass>
    );
  }
);

GlassMoodRing.displayName = 'GlassMoodRing';

export default GlassMoodRing;