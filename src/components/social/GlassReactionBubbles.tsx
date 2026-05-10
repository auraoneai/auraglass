"use client";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import React, {
  forwardRef,
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { OptimizedGlass } from "../../primitives";
import { useGlassSound } from "../../utils/soundDesign";
import { useA11yId } from "../../utils/a11y";
import { useMotionPreference } from "../../hooks/useMotionPreference";
import { createGlassStyle } from "../../utils/createGlassStyle";

export interface ReactionBubble {
  id: string;
  emoji: string;
  userId: string;
  userName: string;
  userColor?: string;
  x: number;
  y: number;
  timestamp: number;
  size?: number;
  velocity?: { x: number; y: number };
  life: number;
  maxLife: number;
}

export interface GlassReactionBubblesProps {
  width?: number;
  height?: number;
  reactions?: ReactionBubble[];
  availableEmojis?: string[];
  showControls?: boolean;
  showUserNames?: boolean;
  bubbleLifetime?: number;
  maxBubbles?: number;
  gravity?: number;
  windForce?: number;
  bounceEnabled?: boolean;
  fadeOut?: boolean;
  soundEnabled?: boolean;
  realTimeMode?: boolean;
  interactive?: boolean;
  onReactionAdd?: (emoji: string, x?: number, y?: number) => void;
  onReactionClick?: (reaction: ReactionBubble) => void;
  className?: string;
}

const defaultEmojis = [
  "❤️",
  "😀",
  "😂",
  "🎉",
  "👏",
  "🔥",
  "💯",
  "⭐",
  "👍",
  "👎",
  "😍",
  "🤔",
  "😮",
  "😢",
  "💪",
  "🙌",
];

const reactionColors = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FECA57",
  "#FF9FF3",
  "#54A0FF",
  "#5F27CD",
  "#00D2D3",
  "#FF9F43",
];

const createDefaultReactions = (): ReactionBubble[] => {
  const now = Date.now();
  return [
    {
      id: "demo-reaction-1",
      emoji: "🎉",
      userId: "demo-a",
      userName: "Aurora",
      userColor: "#38bdf8",
      x: 96,
      y: 86,
      timestamp: now - 1200,
      size: 34,
      velocity: { x: 0.2, y: -0.4 },
      life: 4200,
      maxLife: 5000,
    },
    {
      id: "demo-reaction-2",
      emoji: "✨",
      userId: "demo-b",
      userName: "Lumen",
      userColor: "#a3e635",
      x: 168,
      y: 118,
      timestamp: now - 2400,
      size: 30,
      velocity: { x: -0.1, y: -0.2 },
      life: 3600,
      maxLife: 5000,
    },
    {
      id: "demo-reaction-3",
      emoji: "💎",
      userId: "demo-c",
      userName: "Orbit",
      userColor: "#22d3ee",
      x: 238,
      y: 76,
      timestamp: now - 3600,
      size: 32,
      velocity: { x: 0.1, y: -0.3 },
      life: 3000,
      maxLife: 5000,
    },
  ];
};

const createSeededRandom = (seed = 1234) => {
  let value = seed >>> 0;
  return () => {
    value = (value * 1664525 + 1013904223) % 4294967296;
    return value / 4294967296;
  };
};

export const GlassReactionBubbles = forwardRef<
  HTMLDivElement,
  GlassReactionBubblesProps
>(
  (
    {
      width = 360,
      height = 260,
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
      className = "",
      ...props
    },
    ref
  ) => {
    const prefersReducedMotion = useReducedMotion();
    const [bubbles, setBubbles] = useState<ReactionBubble[]>(
      reactions.length > 0 ? reactions : createDefaultReactions
    );
    const [selectedEmoji, setSelectedEmoji] = useState(availableEmojis[0]);
    const [isAnimating, setIsAnimating] = useState(false);
    const { play } = useGlassSound();
    const id = useA11yId("glass-reaction-bubbles");
    const { shouldAnimate } = useMotionPreference();
    const randomRef = useRef<() => number>();
    const isTestEnv =
      typeof process !== "undefined" &&
      process.env?.JEST_WORKER_ID !== undefined;

    if (!randomRef.current) {
      randomRef.current =
        process.env.NODE_ENV === "test"
          ? createSeededRandom()
          : () => Math.random();
    }

    const random = randomRef.current;

    // Simulated reactions in real-time mode
    useEffect(() => {
      if (isTestEnv) return;

      if (!realTimeMode) return;

      const interval = setInterval(() => {
        if (random() < 0.3) {
          const emoji =
            availableEmojis[Math.floor(random() * availableEmojis.length)];
          const x = random() * (width - 40) + 20;
          const y = random() * (height - 40) + 20;
          addReaction(emoji, x, y, `user-${Date.now()}`, "Anonymous");
        }
      }, 2000);

      return () => clearInterval(interval);
    }, [realTimeMode, availableEmojis, width, height]);

    // Physics simulation
    useEffect(() => {
      if (isTestEnv) return;

      if (bubbles.length === 0) return;

      const animationFrame = requestAnimationFrame(() => {
        setBubbles((prev: any) =>
          prev
            .map((bubble: any) => {
              // Update lifetime
              const newLife = bubble.life - 16; // Assuming ~60fps
              if (newLife <= 0) return null;

              // Update position based on physics
              const newVelocity = { ...bubble.velocity! };
              newVelocity.y += gravity; // Apply gravity
              newVelocity.x += (random() - 0.5) * windForce; // Apply wind

              let newX = bubble.x + newVelocity.x;
              let newY = bubble.y + newVelocity.y;

              // Bounce off walls if enabled
              if (bounceEnabled) {
                if (newX <= 0 || newX >= width - 40) {
                  newVelocity.x *= -0.7; // Damping on bounce
                  newX = Math.max(0, Math.min(width - 40, newX));
                }
                if (newY <= 0 || newY >= height - 40) {
                  newVelocity.y *= -0.7; // Damping on bounce
                  newY = Math.max(0, Math.min(height - 40, newY));
                }
              } else {
                // Wrap around
                if (newX < -40) newX = width;
                if (newX > width) newX = -40;
                if (newY < -40) newY = height;
                if (newY > height) newY = -40;
              }

              return {
                ...bubble,
                x: newX,
                y: newY,
                velocity: newVelocity,
                life: newLife,
              };
            })
            .filter(
              (bubble: any): bubble is NonNullable<typeof bubble> =>
                bubble !== null
            )
        );
      });

      return () => cancelAnimationFrame(animationFrame);
    }, [bubbles, gravity, windForce, bounceEnabled, width, height]);

    const addReaction = useCallback(
      (
        emoji: string,
        x?: number,
        y?: number,
        userId?: string,
        userName?: string
      ) => {
        const newBubble: ReactionBubble = {
          id: `reaction-${Date.now()}-${random()}`,
          emoji,
          userId: userId || "current",
          userName: userName || "You",
          userColor:
            reactionColors[Math.floor(random() * reactionColors.length)],
          x: x ?? random() * (width - 40) + 20,
          y: y ?? random() * (height - 40) + 20,
          timestamp: Date.now(),
          size: 30 + random() * 20,
          velocity: {
            x: (random() - 0.5) * 4,
            y: (random() - 0.5) * 4 - 2, // Slight upward bias
          },
          life: bubbleLifetime,
          maxLife: bubbleLifetime,
        };

        setBubbles((prev: any) => {
          const updated = [...prev, newBubble].slice(-maxBubbles);
          return updated;
        });

        if (soundEnabled) {
          play("notification");
        }

        onReactionAdd?.(emoji, newBubble.x, newBubble.y);
      },
      [
        width,
        height,
        bubbleLifetime,
        maxBubbles,
        soundEnabled,
        play,
        onReactionAdd,
      ]
    );

    const handleCanvasClick = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (!interactive) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        addReaction(selectedEmoji, x, y);
      },
      [interactive, selectedEmoji, addReaction]
    );

    const handleBubbleClick = useCallback(
      (bubble: ReactionBubble, e: React.MouseEvent) => {
        e.stopPropagation();
        onReactionClick?.(bubble);

        // Add a small burst effect
        for (let i = 0; i < 3; i++) {
          addReaction(
            bubble.emoji,
            bubble.x + (random() - 0.5) * 20,
            bubble.y + (random() - 0.5) * 20
          );
        }
      },
      [onReactionClick, addReaction]
    );

    const getBubbleOpacity = (bubble: ReactionBubble) => {
      if (!fadeOut) return 1;
      return Math.max(0.1, bubble.life / bubble.maxLife);
    };

    const getBubbleScale = (bubble: ReactionBubble) => {
      const ageRatio = 1 - bubble.life / bubble.maxLife;
      return 0.8 + Math.sin(ageRatio * Math.PI) * 0.4;
    };

    const ReactionBubbleComponent = ({
      bubble,
    }: {
      bubble: ReactionBubble;
    }) => (
      <motion.div
        className={cn(
          "glass-absolute glass-cursor-pointer glass-select-none glass-z-10"
        )}
        style={{
          left: bubble.x,
          top: bubble.y,
          fontSize: bubble.size || 30,
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={
          prefersReducedMotion
            ? {}
            : {
                scale: getBubbleScale(bubble),
                opacity: getBubbleOpacity(bubble),
                rotate: Math.sin(Date.now() / 1000 + bubble.timestamp) * 10,
              }
        }
        exit={{
          scale: 0,
          opacity: 0,
          y: bubble.y - 50,
        }}
        transition={
          shouldAnimate
            ? {
                type: "spring",
                stiffness: 300,
                damping: 20,
              }
            : { duration: 0 }
        }
        onClick={(e) => handleBubbleClick(bubble, e)}
        whileHover={{ scale: getBubbleScale(bubble) * 1.1 }}
        whileTap={{ scale: getBubbleScale(bubble) * 0.9 }}
      >
        <div
          className={cn(
            "glass-relative glass-inline-flex glass-items-center glass-justify-center glass-radius-full glass-border glass-border-white/20",
            createGlassStyle({ blur: "sm", opacity: 0.8 }).background
          )}
        >
          <span className={cn("glass-text-2xl")}>{bubble.emoji}</span>

          {showUserNames && (
            <motion.div
              className={cn(
                "glass-absolute glass-bottom-8-neg glass-left-1/2 glass-transform glass-translate-x-1/2-neg"
              )}
              initial={{ opacity: 0, y: 10 }}
              animate={prefersReducedMotion ? {} : { opacity: 0.8, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={shouldAnimate ? { delay: 0.2 } : { duration: 0 }}
            >
              <div
                className={cn(
                  "glass-px-2 glass-py-1 glass-text-xs glass-font-medium glass-text-primary glass-radius glass-border glass-border-white/20 glass-whitespace-nowrap",
                  createGlassStyle({ blur: "sm", opacity: 0.8 }).background
                )}
              >
                {bubble.userName}
              </div>
            </motion.div>
          )}

          {/* Particle trail effect */}
          <motion.div
            className={cn("glass-absolute glass-inset-0 glass-radius-full")}
            style={{
              background: `radial-gradient(circle, ${bubble.userColor || "#FF6B6B"}40 0%, transparent 70%)`,
            }}
            animate={
              prefersReducedMotion
                ? {}
                : {
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 0.1, 0.3],
                  }
            }
            transition={
              shouldAnimate
                ? {
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }
                : { duration: 0 }
            }
          />
        </div>
      </motion.div>
    );

    const EmojiSelector = () => (
      <motion.div
        className={cn(
          "glass-flex glass-flex-wrap glass-gap-2 glass-p-3 glass-radius-lg glass-max-w-xs",
          createGlassStyle({ blur: "sm", opacity: 0.8 }).background
        )}
        initial={{ opacity: 0, y: 20 }}
        animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
        transition={shouldAnimate ? { duration: 0.3 } : { duration: 0 }}
      >
        {availableEmojis.map((emoji: any) => (
          <button
            key={emoji}
            onClick={() => setSelectedEmoji(emoji)}
            className={cn(
              "glass-w-10 glass-h-10 glass-radius-lg glass-flex glass-items-center glass-justify-center glass-text-xl glass-focus glass-touch-target glass-contrast-guard",
              selectedEmoji === emoji
                ? "glass-surface-subtle/20 glass-ring-2 glass-ring-primary"
                : "glass-surface-transparent"
            )}
          >
            {emoji}
          </button>
        ))}
      </motion.div>
    );

    const stats = {
      totalReactions: bubbles.length,
      recentReactions: bubbles.filter(
        (b: any) => Date.now() - b.timestamp < 5000
      ).length,
      mostUsedEmoji: bubbles.reduce(
        (acc, bubble) => {
          acc[bubble.emoji] = (acc[bubble.emoji] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      ),
    };

    const mostUsed = Object.entries(stats.mostUsedEmoji).sort(
      ([, a], [, b]) => b - a
    )[0];

    const ambientParticles = useMemo(() => {
      if (isTestEnv) {
        return Array.from({ length: 5 }, (_, i) => ({
          left: (width / 6) * (i + 1),
          top: (height / 6) * (i + 1),
          duration: 3 + i * 0.25,
          delay: i * 0.2,
        }));
      }

      return Array.from({ length: 5 }, () => ({
        left: random() * width,
        top: random() * height,
        duration: 3 + random() * 2,
        delay: random() * 2,
      }));
    }, [height, isTestEnv, random, width]);

    return (
      <OptimizedGlass
        ref={ref}
        intensity="subtle"
        className={cn("glass-relative glass-overflow-hidden", className)}
        style={{ width: "100%", maxWidth: "100%", height }}
        {...props}
      >
        {/* Main reaction area */}
        <div
          className={cn("glass-absolute glass-inset-0 glass-cursor-crosshair")}
          onClick={handleCanvasClick}
          style={{ width: "100%", height }}
        >
          <AnimatePresence>
            {bubbles.map((bubble: any) => (
              <ReactionBubbleComponent key={bubble.id} bubble={bubble} />
            ))}
          </AnimatePresence>

          {/* Floating particles for ambiance */}
          {ambientParticles.map((particle, i) => (
            <motion.div
              key={i}
              className={cn(
                "glass-absolute glass-w-2 glass-h-2 glass-surface-muted glass-radius-full"
              )}
              style={{
                left: particle.left,
                top: particle.top,
              }}
              animate={
                prefersReducedMotion
                  ? {}
                  : {
                      y: [0, -20, 0],
                      opacity: [0.2, 0.8, 0.2],
                      scale: [0.5, 1, 0.5],
                    }
              }
              transition={
                shouldAnimate
                  ? {
                      duration: particle.duration,
                      repeat: Infinity,
                      delay: particle.delay,
                      ease: "easeInOut",
                    }
                  : { duration: 0 }
              }
            />
          ))}
        </div>

        {/* Controls */}
        {showControls && (
          <div
            className={cn(
              "glass-absolute glass-top-4 glass-left-4 glass-z-20 glass-max-w-48"
            )}
          >
            <EmojiSelector />
          </div>
        )}

        {/* Stats */}
        <motion.div
          className={cn(
            "glass-absolute glass-top-4 glass-right-4 glass-z-20 glass-p-3 glass-radius-lg",
            createGlassStyle({ blur: "sm", opacity: 0.8 }).background
          )}
          initial={{ opacity: 0, x: 20 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
          transition={shouldAnimate ? { delay: 0.5 } : { duration: 0 }}
        >
          <div
            className={cn("glass-text-sm glass-text-secondary glass-space-y-1")}
          >
            <div
              className={cn(
                "glass-flex glass-items-center glass-gap-2 glass-whitespace-nowrap"
              )}
            >
              <span>{stats.totalReactions}</span>
              <span className={cn("glass-text-muted")}>total</span>
            </div>
            <div
              className={cn(
                "glass-flex glass-items-center glass-gap-2 glass-whitespace-nowrap"
              )}
            >
              <span>{stats.recentReactions}</span>
              <span className={cn("glass-text-muted")}>recent</span>
            </div>
            {mostUsed && (
              <div
                className={cn(
                  "glass-flex glass-items-center glass-gap-2 glass-whitespace-nowrap"
                )}
              >
                <span>{mostUsed[0]}</span>
                <span className={cn("glass-text-muted")}>{mostUsed[1]}x</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Instructions */}
        {interactive && showControls && height >= 300 && (
          <motion.div
            className={cn(
              "glass-absolute glass-bottom-4 glass-left-1-2 glass-z-20 glass-px-4 glass-py-2 glass-radius-lg glass-text-sm glass-text-secondary glass-whitespace-nowrap",
              createGlassStyle({ blur: "sm", opacity: 0.8 }).background
            )}
            style={{ transform: "translateX(-50%)" }}
            initial={{ opacity: 0, y: 20 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={shouldAnimate ? { delay: 1 } : { duration: 0 }}
          >
            Click anywhere to add {selectedEmoji} • Click bubbles to multiply
            them
          </motion.div>
        )}

        {/* Real-time indicator */}
        {realTimeMode && (
          <div
            className={cn(
              "glass-absolute glass-bottom-4 glass-right-4 glass-z-20 glass-flex glass-items-center glass-space-x-2 glass-text-sm glass-text-muted"
            )}
          >
            <div
              className={cn(
                "glass-w-2 glass-h-2 glass-surface-success glass-radius-full"
              )}
            />
            <span>Live reactions</span>
          </div>
        )}
      </OptimizedGlass>
    );
  }
);
