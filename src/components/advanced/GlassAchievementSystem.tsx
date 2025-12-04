'use client';
import { useReducedMotion } from "@/hooks/useReducedMotion";
/**
 * AuraGlass Achievement System
 * Gamified user engagement with progressive rewards and glass-themed achievements
 */

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  createContext,
  useContext,
  forwardRef,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/utils";
import { OptimizedGlass } from "../../primitives";
import {
  createButtonA11y,
  useA11yId,
  announceToScreenReader,
} from "../../utils/a11y";

// Achievement system types
interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category:
    | "interaction"
    | "exploration"
    | "mastery"
    | "social"
    | "creative"
    | "performance";
  rarity: "common" | "rare" | "epic" | "legendary";
  xp: number;
  requirements: AchievementRequirement[];
  rewards?: AchievementReward[];
  unlocked: boolean;
  unlockedAt?: number;
  progress: number; // 0-1
  hidden: boolean; // Hidden until certain conditions are met
}

interface AchievementRequirement {
  type:
    | "action_count"
    | "streak"
    | "time_spent"
    | "score_reached"
    | "items_collected"
    | "combo"
    | "challenge";
  action?: string;
  count?: number;
  duration?: number;
  score?: number;
  items?: string[];
  combo?: string[];
  challenge?: string;
}

interface AchievementReward {
  type: "xp" | "badge" | "theme" | "effect" | "sound" | "animation";
  value: string | number;
  description: string;
}

interface UserProgress {
  userId: string;
  level: number;
  totalXP: number;
  currentXP: number;
  xpToNextLevel: number;
  achievements: Achievement[];
  stats: UserStats;
  streak: number;
  lastActiveDate: string;
}

interface UserStats {
  totalInteractions: number;
  sessionsCompleted: number;
  timeSpent: number; // milliseconds
  componentsExplored: string[];
  highestStreak: number;
  perfectSessions: number;
  customizationsUnlocked: number;
  socialInteractions: number;
}

interface AchievementNotification {
  achievement: Achievement;
  timestamp: number;
  shown: boolean;
}

// Predefined achievements
const GLASS_ACHIEVEMENTS: Achievement[] = [
  // Interaction achievements
  {
    id: "first_click",
    title: "Glass Toucher",
    description: "Made your first interaction with a glass component",
    icon: "🫳",
    category: "interaction",
    rarity: "common",
    xp: 10,
    requirements: [{ type: "action_count", action: "click", count: 1 }],
    unlocked: false,
    progress: 0,
    hidden: false,
  },
  {
    id: "hundred_clicks",
    title: "Glass Enthusiast",
    description: "Clicked glass components 100 times",
    icon: "💎",
    category: "interaction",
    rarity: "rare",
    xp: 50,
    requirements: [{ type: "action_count", action: "click", count: 100 }],
    unlocked: false,
    progress: 0,
    hidden: false,
  },
  {
    id: "hover_master",
    title: "Ethereal Navigator",
    description: "Hovered over glass elements with perfect precision",
    icon: "👻",
    category: "mastery",
    rarity: "epic",
    xp: 100,
    requirements: [{ type: "action_count", action: "hover", count: 500 }],
    unlocked: false,
    progress: 0,
    hidden: false,
  },

  // Exploration achievements
  {
    id: "component_explorer",
    title: "Glass Archaeologist",
    description: "Discovered and interacted with 10 different glass components",
    icon: "🔍",
    category: "exploration",
    rarity: "rare",
    xp: 75,
    requirements: [{ type: "items_collected", items: [] }], // Dynamically populated
    unlocked: false,
    progress: 0,
    hidden: false,
  },
  {
    id: "hidden_features",
    title: "Secret Keeper",
    description: "Unlocked 5 hidden glass features",
    icon: "🗝️",
    category: "exploration",
    rarity: "legendary",
    xp: 200,
    requirements: [{ type: "items_collected", items: [] }],
    unlocked: false,
    progress: 0,
    hidden: true,
  },

  // Performance achievements
  {
    id: "speed_demon",
    title: "Glass Lightning",
    description: "Completed 10 interactions in under 5 seconds",
    icon: "⚡",
    category: "performance",
    rarity: "epic",
    xp: 150,
    requirements: [{ type: "challenge", challenge: "speed_interactions" }],
    unlocked: false,
    progress: 0,
    hidden: false,
  },
  {
    id: "combo_master",
    title: "Glass Virtuoso",
    description: "Performed a perfect 20-action combo",
    icon: "🎭",
    category: "performance",
    rarity: "legendary",
    xp: 300,
    requirements: [
      { type: "combo", combo: ["click", "hover", "scroll", "focus"] },
    ],
    unlocked: false,
    progress: 0,
    hidden: false,
  },

  // Time-based achievements
  {
    id: "night_owl",
    title: "Midnight Glass Shaper",
    description: "Used glass components between midnight and 6 AM",
    icon: "🦉",
    category: "creative",
    rarity: "rare",
    xp: 80,
    requirements: [{ type: "challenge", challenge: "night_usage" }],
    unlocked: false,
    progress: 0,
    hidden: false,
  },
  {
    id: "marathon_user",
    title: "Glass Endurance Master",
    description: "Spent 2 hours continuously using glass components",
    icon: "🏃‍♂️",
    category: "mastery",
    rarity: "epic",
    xp: 200,
    requirements: [{ type: "time_spent", duration: 7200000 }], // 2 hours
    unlocked: false,
    progress: 0,
    hidden: false,
  },

  // Social achievements
  {
    id: "collaborator",
    title: "Glass Harmonizer",
    description: "Collaborated with others using glass components",
    icon: "🤝",
    category: "social",
    rarity: "rare",
    xp: 100,
    requirements: [{ type: "action_count", action: "collaborate", count: 10 }],
    unlocked: false,
    progress: 0,
    hidden: false,
  },

  // Creative achievements
  {
    id: "customizer",
    title: "Glass Artisan",
    description: "Customized glass components with unique styles",
    icon: "🎨",
    category: "creative",
    rarity: "epic",
    xp: 150,
    requirements: [{ type: "action_count", action: "customize", count: 25 }],
    unlocked: false,
    progress: 0,
    hidden: false,
  },

  // Mastery achievements
  {
    id: "streak_master",
    title: "Consistency Crystal",
    description: "Maintained a 30-day streak of glass interactions",
    icon: "💠",
    category: "mastery",
    rarity: "legendary",
    xp: 500,
    requirements: [{ type: "streak", count: 30 }],
    unlocked: false,
    progress: 0,
    hidden: false,
  },
];

// Achievement engine
class GlassAchievementEngine {
  private progress: UserProgress;
  private achievements: Achievement[];
  private actionHistory: Array<{
    action: string;
    timestamp: number;
    context: any;
  }> = [];
  private sessionStart: number = Date.now();
  private notifications: AchievementNotification[] = [];
  private listeners: Array<(notification: AchievementNotification) => void> =
    [];
  private checkInterval: NodeJS.Timeout | null = null;

  constructor(userId: string = "default") {
    this.achievements = [...GLASS_ACHIEVEMENTS];
    this.progress = {
      userId,
      level: 1,
      totalXP: 0,
      currentXP: 0,
      xpToNextLevel: 100,
      achievements: this.achievements,
      stats: {
        totalInteractions: 0,
        sessionsCompleted: 0,
        timeSpent: 0,
        componentsExplored: [],
        highestStreak: 0,
        perfectSessions: 0,
        customizationsUnlocked: 0,
        socialInteractions: 0,
      },
      streak: 0,
      lastActiveDate: new Date().toDateString(),
    };

    this.loadProgress();
    this.updateStreak();
    this.startPeriodicChecks();
  }

  private loadProgress(): void {
    // CRITICAL SSR FIX: Skip localStorage access on server
    if (typeof localStorage === 'undefined') {
      return;
    }

    try {
      const stored = localStorage.getItem(
        `auraglass-achievements-${this.progress.userId}`
      );
      if (stored) {
        const data = JSON.parse(stored);
        this.progress = { ...this.progress, ...data };

        // Merge achievements with any new ones
        this.progress.achievements = this.mergeAchievements(
          data.achievements || []
        );
      }
    } catch (error) {
      console.warn("Failed to load achievement progress:", error);
    }
  }

  private mergeAchievements(storedAchievements: Achievement[]): Achievement[] {
    const merged = [...this.achievements];

    storedAchievements.forEach((stored: any) => {
      const index = merged.findIndex((a) => a.id === stored.id);
      if (index >= 0) {
        merged[index] = { ...merged[index], ...stored };
      }
    });

    return merged;
  }

  private saveProgress(): void {
    // CRITICAL SSR FIX: Skip localStorage access on server
    if (typeof localStorage === 'undefined') {
      return;
    }

    try {
      localStorage.setItem(
        `auraglass-achievements-${this.progress.userId}`,
        JSON.stringify(this.progress)
      );
    } catch (error) {
      console.warn("Failed to save achievement progress:", error);
    }
  }

  private updateStreak(): void {
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    if (this.progress.lastActiveDate === yesterday) {
      this.progress.streak++;
    } else if (this.progress.lastActiveDate !== today) {
      this.progress.streak = 1;
    }

    this.progress.lastActiveDate = today;
    this.progress.stats.highestStreak = Math.max(
      this.progress.stats.highestStreak,
      this.progress.streak
    );
  }

  private startPeriodicChecks(): void {
    this.checkInterval = setInterval(() => {
      this.checkTimeBasedAchievements();
    }, 10000); // Check every 10 seconds
  }

  recordAction(action: string, context: any = {}): void {
    const timestamp = Date.now();

    this.actionHistory.push({ action, timestamp, context });
    this.progress.stats.totalInteractions++;

    // Keep history manageable
    if (this.actionHistory.length > 1000) {
      this.actionHistory = this.actionHistory.slice(-500);
    }

    // Update specific stats
    if (action === "component_interaction" && context.component) {
      if (!this.progress.stats.componentsExplored.includes(context.component)) {
        this.progress.stats.componentsExplored.push(context.component);
      }
    }

    if (action === "customize") {
      this.progress.stats.customizationsUnlocked++;
    }

    if (action === "collaborate") {
      this.progress.stats.socialInteractions++;
    }

    // Check achievements
    this.checkAchievements();
  }

  private checkAchievements(): void {
    this.progress.achievements.forEach((achievement: any) => {
      if (achievement.unlocked) return;

      const newProgress = this.calculateAchievementProgress(achievement);
      achievement.progress = newProgress;

      if (newProgress >= 1) {
        this.unlockAchievement(achievement);
      }
    });
  }

  private calculateAchievementProgress(achievement: Achievement): number {
    let totalProgress = 0;
    const requirements = achievement.requirements;

    requirements.forEach((req: any) => {
      let reqProgress = 0;

      switch (req.type) {
        case "action_count":
          if (req.action && req.count) {
            const actionCount = this.actionHistory.filter(
              (a: any) => a.action === req.action
            ).length;
            reqProgress = Math.min(1, actionCount / req.count);
          }
          break;

        case "streak":
          if (req.count) {
            reqProgress = Math.min(1, this.progress.streak / req.count);
          }
          break;

        case "time_spent":
          if (req.duration) {
            const sessionTime = Date.now() - this.sessionStart;
            reqProgress = Math.min(1, sessionTime / req.duration);
          }
          break;

        case "items_collected":
          if (achievement.id === "component_explorer") {
            reqProgress = Math.min(
              1,
              this.progress.stats.componentsExplored.length / 10
            );
          }
          break;

        case "challenge":
          reqProgress = this.checkChallenge(req.challenge || "");
          break;

        case "combo":
          reqProgress = this.checkCombo(req.combo || []);
          break;
      }

      totalProgress += reqProgress;
    });

    return totalProgress / requirements.length;
  }

  private checkChallenge(challenge: string): number {
    switch (challenge) {
      case "speed_interactions":
        // Check for 10 interactions in 5 seconds
        const recent = this.actionHistory.filter(
          (a: any) => Date.now() - a.timestamp < 5000
        );
        return Math.min(1, recent.length / 10);

      case "night_usage":
        const hour = new Date().getHours();
        return hour >= 0 && hour < 6 ? 1 : 0;

      default:
        return 0;
    }
  }

  private checkCombo(comboActions: string[]): number {
    if (comboActions.length === 0) return 0;

    // Check for sequence of actions in recent history
    const recentActions = this.actionHistory
      .slice(-20)
      .map((a: any) => a.action);
    let bestCombo = 0;
    let currentCombo = 0;

    recentActions.forEach((action: any) => {
      if (comboActions.includes(action)) {
        currentCombo++;
      } else {
        bestCombo = Math.max(bestCombo, currentCombo);
        currentCombo = 0;
      }
    });

    bestCombo = Math.max(bestCombo, currentCombo);
    return Math.min(1, bestCombo / 20);
  }

  private checkTimeBasedAchievements(): void {
    const sessionTime = Date.now() - this.sessionStart;
    this.progress.stats.timeSpent = sessionTime;

    // Check time-based achievements
    this.checkAchievements();
  }

  private unlockAchievement(achievement: Achievement): void {
    achievement.unlocked = true;
    achievement.unlockedAt = Date.now();
    achievement.progress = 1;

    // Award XP
    this.addXP(achievement.xp);

    // Create notification
    const notification: AchievementNotification = {
      achievement: { ...achievement },
      timestamp: Date.now(),
      shown: false,
    };

    this.notifications.push(notification);

    // Notify listeners
    this.listeners.forEach((listener: any) => listener(notification));

    // Apply rewards
    this.applyAchievementRewards(achievement);

    this.saveProgress();
  }

  private addXP(xp: number): void {
    this.progress.totalXP += xp;
    this.progress.currentXP += xp;

    // Level up check
    while (this.progress.currentXP >= this.progress.xpToNextLevel) {
      this.progress.currentXP -= this.progress.xpToNextLevel;
      this.progress.level++;
      this.progress.xpToNextLevel = this.calculateXPForNextLevel();

      // Level up achievement
      this.recordAction("level_up", { level: this.progress.level });
    }
  }

  private calculateXPForNextLevel(): number {
    // Exponential XP curve
    return Math.floor(100 * Math.pow(1.5, this.progress.level - 1));
  }

  private applyAchievementRewards(achievement: Achievement): void {
    if (!achievement.rewards) return;

    achievement.rewards.forEach((reward: any) => {
      switch (reward.type) {
        case "theme":
          // Unlock theme
          this.recordAction("theme_unlocked", { theme: reward.value });
          break;
        case "effect":
          // Unlock visual effect
          this.recordAction("effect_unlocked", { effect: reward.value });
          break;
        case "sound":
          // Unlock sound
          this.recordAction("sound_unlocked", { sound: reward.value });
          break;
      }
    });
  }

  getProgress(): UserProgress {
    return { ...this.progress };
  }

  getUnlockedAchievements(): Achievement[] {
    return this.progress.achievements.filter((a: any) => a.unlocked);
  }

  getAvailableAchievements(): Achievement[] {
    return this.progress.achievements.filter(
      (a: any) => !a.unlocked && !a.hidden
    );
  }

  getNotifications(): AchievementNotification[] {
    return [...this.notifications];
  }

  markNotificationShown(notificationIndex: number): void {
    if (this.notifications[notificationIndex]) {
      this.notifications[notificationIndex].shown = true;
    }
  }

  addListener(
    listener: (notification: AchievementNotification) => void
  ): () => void {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  cleanup(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }
    this.saveProgress();
  }
}

// React context
const AchievementContext = createContext<{
  engine: GlassAchievementEngine | null;
  progress: UserProgress | null;
  recordAction: (action: string, context?: any) => void;
  notifications: AchievementNotification[];
}>({
  engine: null,
  progress: null,
  recordAction: () => {},
  notifications: [],
});

// Provider component
export function GlassAchievementProvider({
  children,
  userId,
}: {
  children: React.ReactNode;
  userId?: string;
}) {
  const prefersReducedMotion = useReducedMotion();
  const engineRef = useRef<GlassAchievementEngine | null>(null);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [notifications, setNotifications] = useState<AchievementNotification[]>(
    []
  );

  useEffect(() => {
    engineRef.current = new GlassAchievementEngine(userId);
    setProgress(engineRef.current.getProgress());

    const removeListener = engineRef.current.addListener((notification) => {
      setNotifications((prev: any) => [...prev, notification]);
    });

    // Update progress periodically
    const interval = setInterval(() => {
      if (engineRef.current) {
        setProgress(engineRef.current.getProgress());
      }
    }, 5000);

    return () => {
      clearInterval(interval);
      removeListener();
      if (engineRef.current) {
        engineRef.current.cleanup();
      }
    };
  }, [userId]);

  const recordAction = useCallback((action: string, context: any = {}) => {
    if (engineRef.current) {
      engineRef.current.recordAction(action, context);
    }
  }, []);

  const value = {
    engine: engineRef.current || null,
    progress,
    recordAction,
    notifications,
  };

  return (
    <AchievementContext.Provider value={value}>
      {children}
    </AchievementContext.Provider>
  );
}

// Hook to use achievements
export function useAchievements() {
  const context = useContext(AchievementContext);
  if (!context) {
    throw new Error(
      "useAchievements must be used within GlassAchievementProvider"
    );
  }
  return context;
}

// Achievement notification component
export function GlassAchievementNotifications({
  className,
  position = "top-right",
}: {
  className?: string;
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
}) {
  const { notifications, engine } = useAchievements();
  const [visibleNotifications, setVisibleNotifications] = useState<
    AchievementNotification[]
  >([]);

  useEffect(() => {
    const newNotifications = notifications.filter((n: any) => !n.shown);
    if (newNotifications.length > 0) {
      setVisibleNotifications((prev: any) => [...prev, ...newNotifications]);

      // Mark as shown
      newNotifications.forEach((_, index) => {
        const actualIndex = notifications.indexOf(newNotifications[index]);
        engine?.markNotificationShown(actualIndex);
      });
    }
  }, [notifications, engine]);

  const removeNotification = (notification: AchievementNotification) => {
    setVisibleNotifications((prev: any) =>
      prev.filter((n: any) => n !== notification)
    );
  };

  const positionClasses = {
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
  };

  return (
    <div
      className={cn(
        "fixed z-50 glass-gap-2",
        positionClasses[position],
        className
      )}
    >
      <AnimatePresence>
        {visibleNotifications.map((notification, index) => (
          <AchievementNotificationCard
            key={`${notification.achievement.id}-${notification.timestamp}`}
            notification={notification}
            onClose={() => removeNotification(notification)}
            delay={index * 200}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

// Individual notification card
const AchievementNotificationCard = forwardRef<
  HTMLDivElement,
  {
    notification: AchievementNotification;
    onClose: () => void;
    delay?: number;
  }
>(({ notification, onClose, delay = 0 }, ref) => {
  const prefersReducedMotion = useReducedMotion();
  const { achievement } = notification;
  const componentId = useA11yId("achievement-notification");

  // Announce achievement unlock to screen readers
  useEffect(() => {
    announceToScreenReader(
      `Achievement unlocked: ${achievement.title}. ${achievement.description}. You earned ${achievement.xp} XP.`,
      "polite"
    );
  }, [achievement]);

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000 + delay);

    return () => clearTimeout(timer);
  }, [onClose, delay]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  const rarityColors = {
    common: "from-gray-600 to-gray-700",
    rare: "from-blue-600 to-blue-700",
    epic: "from-purple-600 to-purple-700",
    legendary: "from-amber-500 to-orange-600",
  };

  return (
    <motion.div
      ref={ref}
      id={componentId}
      role="alert"
      aria-live="polite"
      aria-atomic="true"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className='glass-relative'
      initial={{ x: 300, opacity: 0, scale: 0.8 }}
      animate={prefersReducedMotion ? {} : { x: 0, opacity: 1, scale: 1 }}
      exit={{ x: 300, opacity: 0, scale: 0.8 }}
      transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.3 }}
    >
      <OptimizedGlass
        intent="neutral"
        elevation="level4"
        intensity="strong"
        depth={3}
        tint="neutral"
        border="glow"
        animation="none"
        performanceMode="medium"
        className='glass-w-80 glass-p-4 glass-relative glass-overflow-hidden glass-radius-lg'
      >
        {/* Rarity glow */}
        <div
          className={cn(
            "absolute inset-0 opacity-20 bg-gradient-to-br",
            rarityColors[achievement.rarity]
          )}
        />

        <div className='glass-relative glass-z-10'>
          {/* Header */}
          <div className='glass-flex glass-items-start glass-justify-between glass-mb-3'>
            <div className="glass-flex glass-items-center glass-gap-3">
              <div className="glass-text-2xl">{achievement.icon}</div>
              <div>
                <div className="glass-flex glass-items-center glass-gap-2">
                  <h3 className='glass-text-sm glass-font-medium glass-text-primary-glass-opacity-90'>
                    Achievement Unlocked!
                  </h3>
                  <span
                    className={cn(
                      "glass-px-2 glass-py-1 glass-text-xs glass-radius-full capitalize",
                      achievement.rarity === "common" &&
                        "bg-gray-600 glass-text-secondary",
                      achievement.rarity === "rare" &&
                        "bg-blue-600 text-blue-200",
                      achievement.rarity === "epic" &&
                        "bg-purple-600 text-purple-200",
                      achievement.rarity === "legendary" &&
                        "bg-amber-500 text-amber-100"
                    )}
                  >
                    {achievement.rarity}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className='glass-text-xs glass-text-primary-glass-opacity-60 hover:glass-text-primary-glass-opacity-90 glass-focus glass-touch-target glass-contrast-guard glass-focus glass-touch-target glass-contrast-guard'
              aria-label="Close achievement notification"
            >
              ✕
            </button>
          </div>

          {/* Achievement details */}
          <div className='glass-mb-3'>
            <h4 className='glass-font-medium glass-text-primary-glass-opacity-90 glass-mb-1'>
              {achievement.title}
            </h4>
            <p className='glass-text-sm glass-text-primary-opacity-70'>
              {achievement.description}
            </p>
          </div>

          {/* XP reward */}
          <div className="glass-flex glass-items-center glass-justify-between">
            <div className="glass-flex glass-items-center glass-gap-2">
              <div className='glass-text-xs glass-text-primary-glass-opacity-60'>Reward:</div>
              <div className="glass-flex glass-items-center glass-gap-1">
                <span className='glass-text-amber-400'>✨</span>
                <span className='glass-text-sm glass-font-medium glass-text-primary-glass-opacity-90'>
                  +{achievement.xp} XP
                </span>
              </div>
            </div>
            <div className='glass-text-xs glass-text-primary-glass-opacity-50'>
              {achievement.category}
            </div>
          </div>
        </div>
      </OptimizedGlass>

      {/* Celebration particles */}
      <motion.div
        className='glass-absolute glass-inset-0 glass-pointer-events-none'
        initial={{ opacity: 0 }}
        animate={prefersReducedMotion ? {} : { opacity: [0, 1, 0] }}
        transition={
          prefersReducedMotion
            ? { duration: 0 }
            : { duration: 2, delay: delay / 1000 + 0.5 }
        }
      >
        {Array.from({ length: 12 }, (_, i) => (
          <motion.div
            key={i}
            className='glass-absolute glass-w-1 glass-h-1 glass-surface-amber glass-radius-full'
            style={{
              left: "50%",
              top: "50%",
            }}
            animate={
              prefersReducedMotion
                ? {}
                : {
                    x: [0, Math.cos((i * 30 * Math.PI) / 180) * 100],
                    y: [0, Math.sin((i * 30 * Math.PI) / 180) * 100],
                    opacity: [1, 0],
                    scale: [1, 0],
                  }
            }
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : {
                    duration: 1.5,
                    delay: delay / 1000 + 0.5 + i * 0.1,
                    ease: "easeOut",
                  }
            }
          />
        ))}
      </motion.div>
    </motion.div>
  );
});
// Achievement dashboard
export function GlassAchievementDashboard({
  className,
  show = true,
}: {
  className?: string;
  show?: boolean;
}) {
  const prefersReducedMotion = useReducedMotion();
  const { progress, engine } = useAchievements();
  const [activeTab, setActiveTab] = useState<
    "progress" | "achievements" | "stats"
  >("progress");

  if (!show || !progress) return null;

  const unlockedAchievements = engine?.getUnlockedAchievements() || [];
  const availableAchievements = engine?.getAvailableAchievements() || [];

  return (
    <section>
      <OptimizedGlass
        intent="neutral"
        elevation="level3"
        intensity="medium"
        depth={3}
        tint="neutral"
        border="subtle"
        animation="none"
        performanceMode="medium"
        className={cn(
          "fixed bottom-4 left-4 w-96 max-h-96 overflow-hidden glass-radius-lg",
          className
        )}
        role="complementary"
        aria-label="Achievement dashboard"
      >
        {/* Header */}
        <div className="glass-p-4 glass-border-b glass-border-white/10">
          <div className='glass-flex glass-items-center glass-justify-between glass-mb-2'>
            <h3 className='glass-text-lg glass-font-medium glass-text-primary-glass-opacity-90'>
              Glass Achievements
            </h3>
            <div className='glass-text-sm glass-text-primary-opacity-70'>
              Level {progress.level}
            </div>
          </div>

          {/* XP Progress bar */}
          <div className='glass-w-full glass-surface-subtle/5 glass-backdrop-blur-sm glass-contrast-guard glass-radius-sm glass-h-2 glass-overflow-hidden glass-contrast-guard'>
            <motion.div
              className="glass-h-full glass-gradient-primary glass-gradient-primary glass-gradient-primary"
              animate={{
                width: `${(progress.currentXP / progress.xpToNextLevel) * 100}%`,
              }}
              transition={
                prefersReducedMotion ? { duration: 0 } : { duration: 0.5 }
              }
            />
          </div>
          <div className='glass-flex glass-justify-between glass-text-xs glass-text-primary-glass-opacity-50 glass-mt-1'>
            <span>{progress.currentXP} XP</span>
            <span>{progress.xpToNextLevel} XP to next level</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="glass-flex glass-border-b glass-border-white/10">
          {[
            { id: "progress", label: "Progress", count: progress.totalXP },
            {
              id: "achievements",
              label: "Achievements",
              count: unlockedAchievements.length,
            },
            {
              id: "stats",
              label: "Stats",
              count: progress.stats.totalInteractions,
            },
          ].map((tab: any) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex-1 glass-px-3 glass-py-2 glass-text-sm transition-colors glass-focus glass-touch-target glass-contrast-guard",
                activeTab === tab.id
                  ? "glass-text-primary/90 bg-white/10"
                  : "glass-text-primary/60 hover:glass-text-primary/90"
              )}
            >
              <div>{tab.label}</div>
              <div className="glass-text-xs">{tab.count}</div>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className='glass-p-4 glass-max-glass-h-64 glass-overflow-y-auto'>
          {activeTab === "progress" && (
            <div className="glass-gap-3">
              <div className='glass-grid glass-grid-cols-2 glass-gap-2 glass-text-center'>
                <div className="glass-surface-subtle/5 glass-backdrop-blur-sm glass-contrast-guard glass-radius-md glass-p-2 glass-contrast-guard">
                  <div className='glass-text-lg glass-font-medium glass-text-primary-glass-opacity-90'>
                    {progress.level}
                  </div>
                  <div className='glass-text-xs glass-text-primary-glass-opacity-60'>Level</div>
                </div>
                <div className="glass-surface-subtle/5 glass-backdrop-blur-sm glass-contrast-guard glass-radius-md glass-p-2 glass-contrast-guard">
                  <div className='glass-text-lg glass-font-medium glass-text-primary-glass-opacity-90'>
                    {progress.totalXP}
                  </div>
                  <div className='glass-text-xs glass-text-primary-glass-opacity-60'>Total XP</div>
                </div>
              </div>

              <div>
                <h4 className='glass-text-sm glass-font-medium glass-text-primary-glass-opacity-90 glass-mb-2'>
                  In Progress
                </h4>
                <div className="glass-gap-2">
                  {availableAchievements.slice(0, 3).map((achievement: any) => (
                    <div
                      key={achievement.id}
                      className="glass-surface-subtle/5 glass-backdrop-blur-sm glass-contrast-guard glass-radius-sm glass-p-2 glass-contrast-guard"
                    >
                      <div className='glass-flex glass-items-center glass-justify-between glass-mb-1'>
                        <span className='glass-text-sm glass-text-primary-glass-opacity-90'>
                          {achievement.title}
                        </span>
                        <span className='glass-text-xs glass-text-primary-glass-opacity-60'>
                          {(achievement.progress * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className='glass-w-full glass-surface-subtle glass-radius-full glass-h-1'>
                        <div
                          className='glass-surface-blue glass-h-1 glass-radius-full'
                          style={{ width: `${achievement.progress * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "achievements" && (
            <div className="glass-gap-2">
              {unlockedAchievements.map((achievement: any) => (
                <div
                  key={achievement.id}
                  className="glass-surface-subtle/5 glass-backdrop-blur-sm glass-contrast-guard glass-radius-sm glass-p-3 glass-contrast-guard"
                >
                  <div className="glass-flex glass-items-center glass-gap-3">
                    <div className="glass-text-xl">{achievement.icon}</div>
                    <div className="glass-flex-1">
                      <div className="glass-flex glass-items-center glass-justify-between">
                        <h4 className='glass-text-sm glass-font-medium glass-text-primary-glass-opacity-90'>
                          {achievement.title}
                        </h4>
                        <span className='glass-text-xs glass-text-primary-glass-opacity-60'>
                          +{achievement.xp} XP
                        </span>
                      </div>
                      <p className='glass-text-xs glass-text-primary-glass-opacity-60'>
                        {achievement.description}
                      </p>
                      {achievement.unlockedAt && (
                        <div className='glass-text-xs glass-text-primary-glass-opacity-50 glass-mt-1'>
                          Unlocked{" "}
                          {new Date(
                            achievement.unlockedAt
                          ).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "stats" && (
            <div className="glass-gap-3">
              <div className="glass-grid glass-grid-cols-2 glass-gap-2">
                {[
                  {
                    label: "Interactions",
                    value: progress.stats.totalInteractions,
                  },
                  {
                    label: "Components",
                    value: progress.stats.componentsExplored.length,
                  },
                  { label: "Streak", value: progress.streak },
                  {
                    label: "Sessions",
                    value: progress.stats.sessionsCompleted,
                  },
                  {
                    label: "Time Spent",
                    value: `${Math.floor(progress.stats.timeSpent / 60000)}m`,
                  },
                  { label: "Social", value: progress.stats.socialInteractions },
                ].map((stat: any) => (
                  <div
                    key={stat.label}
                    className='glass-surface-subtle/5 glass-backdrop-blur-sm glass-contrast-guard glass-radius-md glass-p-2 glass-text-center glass-contrast-guard'
                  >
                    <div className='glass-text-lg glass-font-medium glass-text-primary-glass-opacity-90'>
                      {stat.value}
                    </div>
                    <div className='glass-text-xs glass-text-primary-glass-opacity-60'>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </OptimizedGlass>
    </section>
  );
}

// Hook for easy achievement integration
export function useAchievementTracker() {
  const { recordAction } = useAchievements();

  const trackClick = useCallback(
    (component?: string) => {
      recordAction("click", { component });
      if (component) {
        recordAction("component_interaction", { component });
      }
    },
    [recordAction]
  );

  const trackHover = useCallback(
    (component?: string) => {
      recordAction("hover", { component });
      if (component) {
        recordAction("component_interaction", { component });
      }
    },
    [recordAction]
  );

  const trackCustomization = useCallback(
    (type: string, value: any) => {
      recordAction("customize", { type, value });
    },
    [recordAction]
  );

  const trackCollaboration = useCallback(
    (action: string, users: string[]) => {
      recordAction("collaborate", { action, users });
    },
    [recordAction]
  );

  return {
    trackClick,
    trackHover,
    trackCustomization,
    trackCollaboration,
    recordAction,
  };
}

// Achievement presets
export const achievementPresets = {
  casual: {
    xpMultiplier: 1,
    notificationDuration: 3000,
    showProgress: true,
  },
  hardcore: {
    xpMultiplier: 0.5,
    notificationDuration: 5000,
    showProgress: true,
    hiddenAchievements: true,
  },
  minimal: {
    xpMultiplier: 1,
    notificationDuration: 2000,
    showProgress: false,
    quietMode: true,
  },
};

interface GlassAchievementSystemProps
  extends React.HTMLAttributes<HTMLDivElement> {
  userId?: string;
  showDashboard?: boolean;
  showNotifications?: boolean;
  children?: React.ReactNode;
}

function AchievementSummaryCard() {
  const { progress } = useAchievements();

  const statBlocks = [
    {
      label: "Current level",
      value: progress?.level ?? "—",
    },
    {
      label: "Unlocked",
      value: progress?.achievements.filter((a) => a.unlocked).length ?? 0,
    },
    {
      label: "Streak",
      value: progress?.streak ?? 0,
    },
  ];

  return (
    <div
      className={cn(
        "glass-surface-primary glass-radius-2xl glass-p-6 glass-space-y-4",
        "glass-border glass-border-white/10 glass-shadow-soft-lg"
      )}
      data-testid="glass-achievement-summary"
    >
      <div>
        <p className='glass-text-xs glass-text-tertiary glass-uppercase glass-tracking-wide'>
          Achievement System
        </p>
        <h2 className='glass-text-2xl glass-text-primary glass-font-semibold'>
          {progress ? progress.stats.totalInteractions : "Calibrating"}
        </h2>
        <p className="glass-text-sm glass-text-secondary">
          Total interactions tracked
        </p>
      </div>
      <div className="glass-grid glass-grid-cols-3 glass-gap-3">
        {statBlocks.map((stat) => (
          <div
            key={stat.label}
            className="glass-surface-subtle glass-radius-xl glass-p-3"
          >
            <p className='glass-text-xs glass-text-tertiary glass-uppercase glass-tracking-wide'>
              {stat.label}
            </p>
            <p className='glass-text-lg glass-text-primary glass-font-semibold'>
              {stat.value}
            </p>
          </div>
        ))}
      </div>
      <div className="glass-text-xs glass-text-secondary">
        XP to next level: {progress ? progress.xpToNextLevel : "—"}
      </div>
    </div>
  );
}

export const GlassAchievementSystem: React.FC<GlassAchievementSystemProps> = ({
  userId,
  className,
  children,
  showDashboard = true,
  showNotifications = true,
  ...rest
}) => (
  <GlassAchievementProvider userId={userId}>
    <div
      className={cn(
        "glass-achievement-system glass-relative glass-space-y-4",
        className
      )}
      {...rest}
    >
      {children ?? <AchievementSummaryCard />}
      {showDashboard && <GlassAchievementDashboard />}
      {showNotifications && <GlassAchievementNotifications />}
    </div>
  </GlassAchievementProvider>
);

export default GlassAchievementSystem;
