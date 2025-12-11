"use client";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { AnimatePresence, motion } from "framer-motion";
import { ANIMATION } from "../../tokens/designConstants";
import {
  BookOpen,
  Calendar,
  Clock,
  Crown,
  Diamond,
  Eye,
  Flame,
  Gift,
  Grid,
  Heart,
  List,
  Lock,
  Search,
  Share2,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
  Unlock,
  Zap,
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { cn } from "../../lib/utilsComprehensive";

type AchievementTier = "bronze" | "silver" | "gold" | "platinum" | "diamond";
type AchievementCategory =
  | "reading"
  | "engagement"
  | "social"
  | "exploration"
  | "time"
  | "special";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  tier: AchievementTier;
  category: AchievementCategory;
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  unlockedAt?: Date;
  rarity: number; // 1-100, how rare this achievement is
  points: number;
  prerequisite?: string[]; // IDs of required achievements
  secret?: boolean; // Hidden until unlocked
  animated?: boolean;
  glowColor: string;
  reward?: {
    type: "theme" | "badge" | "feature" | "title";
    value: string;
  };
}

interface GlassTrophyCaseProps {
  achievements?: Achievement[];
  userStats?: Record<string, number>;
  onAchievementUnlock?: (achievement: Achievement) => void;
  showProgress?: boolean;
  enableSound?: boolean;
  className?: string;
}

const tierColors: Record<
  AchievementTier,
  { primary: string; secondary: string; glow: string }
> = {
  bronze: {
    primary: "var(--glass-border-default)",
    secondary: "var(--glass-border-subtle)",
    glow: "var(--glass-bg-hover)",
  },
  silver: {
    primary: "var(--glass-border-hover)",
    secondary: "var(--glass-border-default)",
    glow: "var(--glass-bg-active)",
  },
  gold: {
    primary: "var(--glass-border-strong)",
    secondary: "var(--glass-border-default)",
    glow: "var(--glass-bg-strong)",
  },
  platinum: {
    primary: "var(--glass-text-secondary)",
    secondary: "var(--glass-text-secondary)",
    glow: "var(--glass-bg-default)",
  },
  diamond: {
    primary: "var(--glass-text-primary)",
    secondary: "var(--glass-text-secondary)",
    glow: "var(--glass-bg-default)",
  },
};

const categoryIcons: Record<
  AchievementCategory,
  React.ComponentType<{ className?: string }>
> = {
  reading: BookOpen,
  engagement: Heart,
  social: Share2,
  exploration: Eye,
  time: Clock,
  special: Sparkles,
};

const defaultAchievements: Achievement[] = [
  {
    id: "first-article",
    title: "First Steps",
    description: "Read your first article",
    icon: BookOpen,
    tier: "bronze",
    category: "reading",
    progress: 1,
    maxProgress: 1,
    unlocked: true,
    unlockedAt: new Date("2024-01-15"),
    rarity: 95,
    points: 10,
    glowColor: "var(--glass-glow-gold, var(--glass-color-warning))",
  },
  {
    id: "speed-reader",
    title: "Speed Reader",
    description: "Read 50 articles",
    icon: Zap,
    tier: "silver",
    category: "reading",
    progress: 47,
    maxProgress: 50,
    unlocked: false,
    rarity: 60,
    points: 50,
    glowColor: "var(--glass-glow-lavender, var(--glass-color-secondary))",
  },
  {
    id: "bookworm",
    title: "Bookworm",
    description: "Read 500 articles",
    icon: BookOpen,
    tier: "gold",
    category: "reading",
    progress: 347,
    maxProgress: 500,
    unlocked: false,
    rarity: 15,
    points: 200,
    glowColor: "var(--glass-glow-soft-gold, var(--glass-color-warning-light))",
  },
  {
    id: "streak-master",
    title: "Streak Master",
    description: "Maintain a 30-day reading streak",
    icon: Flame,
    tier: "gold",
    category: "time",
    progress: 15,
    maxProgress: 30,
    unlocked: false,
    rarity: 20,
    points: 150,
    glowColor: "var(--glass-glow-warm, #FF6347)",
  },
  {
    id: "early-bird",
    title: "Early Bird",
    description: "Read 10 articles before 8 AM",
    icon: Calendar,
    tier: "bronze",
    category: "time",
    progress: 3,
    maxProgress: 10,
    unlocked: false,
    rarity: 40,
    points: 30,
    glowColor: "var(--glass-glow-sky, #87CEEB)",
  },
  {
    id: "social-butterfly",
    title: "Social Butterfly",
    description: "Share 25 articles",
    icon: Share2,
    tier: "silver",
    category: "social",
    progress: 12,
    maxProgress: 25,
    unlocked: false,
    rarity: 35,
    points: 75,
    glowColor: "var(--glass-glow-rose, #FFB6C1)",
  },
  {
    id: "curator",
    title: "Curator",
    description: "Bookmark 100 articles",
    icon: Target,
    tier: "silver",
    category: "engagement",
    progress: 67,
    maxProgress: 100,
    unlocked: false,
    rarity: 45,
    points: 60,
    glowColor: "var(--glass-glow-mint, #98FB98)",
  },
  {
    id: "explorer",
    title: "Explorer",
    description: "Read articles from 10 different categories",
    icon: Eye,
    tier: "gold",
    category: "exploration",
    progress: 7,
    maxProgress: 10,
    unlocked: false,
    rarity: 25,
    points: 120,
    glowColor: "var(--glass-glow-plum, #DDA0DD)",
  },
  {
    id: "trendsetter",
    title: "Trendsetter",
    description: "Be among first 10 to read 5 trending articles",
    icon: TrendingUp,
    tier: "platinum",
    category: "special",
    progress: 2,
    maxProgress: 5,
    unlocked: false,
    rarity: 5,
    points: 300,
    glowColor: "var(--glass-glow-ice, #F0F8FF)",
  },
  {
    id: "perfectionist",
    title: "Perfectionist",
    description: "Complete 50 article quizzes with 100% score",
    icon: Crown,
    tier: "diamond",
    category: "engagement",
    progress: 12,
    maxProgress: 50,
    unlocked: false,
    rarity: 2,
    points: 500,
    glowColor: "var(--glass-glow-cyan, #00FFFF)",
  },
  {
    id: "night-owl",
    title: "Night Owl",
    description: "Read 20 articles after midnight",
    icon: Calendar,
    tier: "bronze",
    category: "time",
    progress: 8,
    maxProgress: 20,
    unlocked: false,
    rarity: 30,
    points: 40,
    glowColor: "var(--glass-glow-midnight, #191970)",
  },
  {
    id: "glass-master",
    title: "Glass Master",
    description: "Discover the rainbow glass mode",
    icon: Diamond,
    tier: "diamond",
    category: "special",
    progress: 0,
    maxProgress: 1,
    unlocked: false,
    secret: true,
    rarity: 1,
    points: 1000,
    glowColor: "#FF1493",
    reward: {
      type: "theme",
      value: "rainbow-exclusive",
    },
  },
];

export function GlassTrophyCase({
  achievements = defaultAchievements,
  userStats = {},
  onAchievementUnlock,
  showProgress = true,
  enableSound = true,
  className = "",
}: GlassTrophyCaseProps) {
  const prefersReducedMotion = useReducedMotion();
  const [selectedCategory, setSelectedCategory] = useState<
    AchievementCategory | "all"
  >("all");
  const [selectedTier, setSelectedTier] = useState<AchievementTier | "all">(
    "all"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<
    "recent" | "progress" | "rarity" | "points"
  >("recent");
  const [showLocked, setShowLocked] = useState(true);
  const [selectedAchievement, setSelectedAchievement] =
    useState<Achievement | null>(null);

  // Filter and sort achievements
  const filteredAchievements = useMemo(() => {
    return achievements
      .filter((achievement: any) => {
        // Category filter
        if (
          selectedCategory !== "all" &&
          achievement.category !== selectedCategory
        ) {
          return false;
        }

        // Tier filter
        if (selectedTier !== "all" && achievement.tier !== selectedTier) {
          return false;
        }

        // Show locked filter
        if (!showLocked && !achievement.unlocked) {
          return false;
        }

        // Search filter
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          return (
            achievement.title.toLowerCase().includes(query) ||
            achievement.description.toLowerCase().includes(query)
          );
        }

        // Secret achievements
        if (achievement.secret && !achievement.unlocked) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "recent":
            if (a.unlockedAt && b.unlockedAt) {
              return b.unlockedAt.getTime() - a.unlockedAt.getTime();
            }
            return a.unlocked === b.unlocked ? 0 : a.unlocked ? -1 : 1;

          case "progress":
            const aProgress = a.progress / a.maxProgress;
            const bProgress = b.progress / b.maxProgress;
            return bProgress - aProgress;

          case "rarity":
            return a.rarity - b.rarity;

          case "points":
            return b.points - a.points;

          default:
            return 0;
        }
      });
  }, [
    achievements,
    selectedCategory,
    selectedTier,
    searchQuery,
    showLocked,
    sortBy,
  ]);

  // Calculate stats
  const stats = useMemo(() => {
    const unlocked = achievements.filter((a: any) => a.unlocked).length;
    const total = achievements.filter(
      (a: any) => !a.secret || a.unlocked
    ).length;
    const totalPoints = achievements
      .filter((a: any) => a.unlocked)
      .reduce((sum, a) => sum + a.points, 0);

    const tierCounts = achievements.reduce(
      (counts, achievement) => {
        if (achievement.unlocked) {
          counts[achievement.tier] = (counts[achievement.tier] || 0) + 1;
        }
        return counts;
      },
      {} as Record<AchievementTier, number>
    );

    return {
      unlocked,
      total,
      totalPoints,
      tierCounts,
      completionRate: Math.round((unlocked / total) * 100),
    };
  }, [achievements]);

  // Categories with counts
  const categories = useMemo(() => {
    const categoryCounts = achievements.reduce(
      (counts, achievement) => {
        counts[achievement.category] = (counts[achievement.category] || 0) + 1;
        return counts;
      },
      {} as Record<AchievementCategory, number>
    );

    return Object.entries(categoryCounts).map(([category, count]) => ({
      id: category as AchievementCategory,
      name: category.charAt(0).toUpperCase() + category.slice(1),
      count,
      icon: categoryIcons[category as AchievementCategory],
    }));
  }, [achievements]);

  // Play unlock sound
  const playUnlockSound = () => {
    if (!enableSound) return;

    try {
      const audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Victory fanfare
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C, E, G, C
      notes.forEach((freq, index) => {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();

        osc.connect(gain);
        gain.connect(audioContext.destination);

        osc.frequency.value = freq;
        osc.type = "sine";

        gain.gain.setValueAtTime(0.1, audioContext.currentTime + index * 0.1);
        gain.gain.exponentialRampToValueAtTime(
          0.01,
          audioContext.currentTime + 0.5 + index * 0.1
        );

        osc.start(audioContext.currentTime + index * 0.1);
        osc.stop(audioContext.currentTime + 0.5 + index * 0.1);
      });
    } catch (error) {
      console.warn("Unable to play unlock sound:", error);
    }
  };

  // Check for newly unlocked achievements
  useEffect(() => {
    achievements.forEach((achievement: any) => {
      if (
        !achievement.unlocked &&
        achievement.progress >= achievement.maxProgress
      ) {
        const updatedAchievement = {
          ...achievement,
          unlocked: true,
          unlockedAt: new Date(),
        };
        playUnlockSound();
        onAchievementUnlock?.(updatedAchievement);
      }
    });
  }, [achievements, onAchievementUnlock]);

  const AchievementCard = ({ achievement }: { achievement: Achievement }) => {
    const tierColor = tierColors[achievement.tier];
    const progressPercentage =
      (achievement.progress / achievement.maxProgress) * 100;

    return (
      <motion.div
        className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all ${
          achievement.unlocked
            ? "border-white/40 bg-white/10 hover:bg-white/15"
            : "border-white/20 bg-white/5 hover:bg-white/10 opacity-70"
        }`}
        style={{
          borderColor: achievement.unlocked ? tierColor.primary : undefined,
          boxShadow: achievement.unlocked
            ? `0 0 20px ${tierColor.glow}40, inset 0 0 20px ${tierColor.primary}10`
            : undefined,
        }}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setSelectedAchievement(achievement)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        layout
      >
        {/* Tier badge */}
        <div
          className="glass-absolute glass--top-2 glass--right-2 glass-px-2 glass-py-1 glass-radius-full glass-text-xs glass-font-bold glass-border"
          style={{
            backgroundColor: `${tierColor.primary}20`,
            borderColor: `${tierColor.primary}40`,
            color: tierColor.primary,
          }}
        >
          {achievement.tier.toUpperCase()}
        </div>

        {/* Unlock glow effect */}
        {achievement.unlocked && (
          <motion.div
            className="glass-absolute glass-inset-0 glass-radius-xl"
            style={{
              background: `radial-gradient(circle at center, ${tierColor.glow}20 0%, transparent 70%)`,
              filter: "blur(var(--glass-blur-md, 8px))",
            }}
            animate={
              prefersReducedMotion
                ? {}
                : {
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }
            }
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : { duration: 2, repeat: Infinity }
            }
          />
        )}

        {/* Lock overlay for locked achievements */}
        {!achievement.unlocked && (
          <div className="glass-absolute glass-top-4 glass-right-4">
            <Lock className="glass-w-5 glass-h-5 glass-text-primary-glass-opacity-40" />
          </div>
        )}

        {/* Achievement icon */}
        <div className="glass-flex glass-items-center glass-justify-center glass-mb-4">
          <div
            className={`p-4 rounded-full border-2 ${
              achievement.unlocked ? "border-white/40" : "border-white/20"
            }`}
            style={{
              backgroundColor: `${tierColor.primary}20`,
              borderColor: achievement.unlocked ? tierColor.primary : undefined,
            }}
          >
            <achievement.icon
              className={`w-8 h-8 ${
                achievement.unlocked ? "text-white" : "text-white/50"
              }`}
            />
          </div>
        </div>

        {/* Achievement details */}
        <div className="glass-text-center glass-mb-4">
          <div
            role="heading"
            aria-level={2}
            className={`text-lg font-bold mb-2 ${
              achievement.unlocked ? "text-white" : "text-white/60"
            }`}
          >
            {achievement.title}
          </div>
          <p
            className={`text-sm ${
              achievement.unlocked ? "text-white/80" : "text-white/50"
            }`}
          >
            {achievement.description}
          </p>
        </div>

        {/* Progress bar */}
        {showProgress && !achievement.unlocked && (
          <div className="glass-mb-4">
            <div className="glass-flex glass-justify-between glass-items-center glass-mb-2">
              <span className="glass-text-xs glass-text-primary-glass-opacity-60">
                Progress
              </span>
              <span className="glass-text-xs glass-text-primary-glass-opacity-60">
                {achievement.progress}/{achievement.maxProgress}
              </span>
            </div>
            <div className="glass-h-2 glass-surface-subtle/10 glass-radius-full glass-overflow-hidden">
              <motion.div
                className="glass-h-full glass-radius-full"
                style={{ backgroundColor: tierColor.primary }}
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={
                  prefersReducedMotion
                    ? { duration: 0 }
                    : { duration: 1, ease: "easeOut" }
                }
              />
            </div>
          </div>
        )}

        {/* Points and rarity */}
        <div className="glass-flex glass-items-center glass-justify-between glass-text-xs">
          <div className="glass-flex glass-items-center glass-gap-2">
            <Trophy className="glass-w-4 glass-h-4 glass-text-primary" />
            <span className="glass-text-primary-glass-opacity-60">
              {achievement.points} pts
            </span>
          </div>
          <div className="glass-flex glass-items-center glass-gap-1">
            <Diamond className="glass-w-3 glass-h-3 glass-text-primary-glass-opacity-40" />
            <span className="glass-text-primary-glass-opacity-40">
              {achievement.rarity}% rare
            </span>
          </div>
        </div>

        {/* Unlock date */}
        {achievement.unlocked && achievement.unlockedAt && (
          <div className="glass-mt-2 glass-text-center">
            <span className="glass-text-xs glass-text-primary-glass-opacity-50">
              Unlocked {achievement.unlockedAt.toLocaleDateString()}
            </span>
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className={`w-full max-w-7xl mx-auto ${className}`}>
      {/* Header */}
      <div className="glass-flex glass-flex-col lg:glass-flex-row lg:glass-items-center lg:glass-justify-between glass-gap-6 glass-mb-8">
        <div>
          <h1 className="glass-text-3xl glass-font-bold glass-text-primary glass-mb-2 glass-flex glass-items-center glass-gap-3">
            <Trophy className="glass-w-8 glass-h-8 glass-text-primary" />
            Glass Trophy Case
          </h1>
          <p className="glass-text-primary-glass-opacity-60">
            Showcase your reading achievements and unlock special rewards
          </p>
        </div>

        <div className="glass-flex glass-flex-wrap glass-gap-4">
          {/* Stats */}
          <div className="glass-backdrop-blur-lg glass-contrast-guard glass-surface-subtle/10 glass-border glass-border-white/20 glass-radius-xl glass-p-4 glass-contrast-guard">
            <div className="glass-flex glass-items-center glass-gap-4">
              <div className="glass-text-center">
                <div className="glass-text-2xl glass-font-bold glass-text-primary">
                  {stats.unlocked}
                </div>
                <div className="glass-text-xs glass-text-primary-glass-opacity-60">
                  Unlocked
                </div>
              </div>
              <div className="glass-text-center">
                <div className="glass-text-2xl glass-font-bold glass-text-primary">
                  {stats.total}
                </div>
                <div className="glass-text-xs glass-text-primary-glass-opacity-60">
                  Total
                </div>
              </div>
              <div className="glass-text-center">
                <div className="glass-text-2xl glass-font-bold glass-text-primary">
                  {stats.totalPoints}
                </div>
                <div className="glass-text-xs glass-text-primary-glass-opacity-60">
                  Points
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="glass-flex glass-flex-wrap glass-gap-4 glass-mb-6">
        {/* Search */}
        <div className="glass-relative glass-flex-1 glass-min-w-64">
          <Search className="glass-absolute glass-left-3 glass-top-1/2 glass-transform glass--translate-y-1-2 glass-w-4 glass-h-4 glass-text-primary-glass-opacity-60" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search achievements..."
            aria-label="Search achievements"
            className={cn(
              "glass-foundation-complete glass-w-full glass-pl-10 glass-pr-4 glass-py-3",
              "glass-text-primary placeholder:glass-text-muted glass-radius-xl",
              "glass-border-subtle glass-focus glass-transition glass-touch-target glass-contrast-guard"
            )}
          />
        </div>

        {/* Category filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value as any)}
          aria-label="Filter by category"
          className={cn(
            "glass-foundation-complete glass-px-4 glass-py-3 glass-radius-xl",
            "glass-text-primary glass-border-subtle glass-focus glass-transition glass-touch-target glass-contrast-guard"
          )}
        >
          <option value="all">All Categories</option>
          {categories.map((category: any) => (
            <option key={category.id} value={category.id}>
              {category.name} ({category.count})
            </option>
          ))}
        </select>

        {/* Tier filter */}
        <select
          value={selectedTier}
          onChange={(e) => setSelectedTier(e.target.value as any)}
          aria-label="Filter by tier"
          className={cn(
            "glass-foundation-complete glass-px-4 glass-py-3 glass-radius-xl",
            "glass-text-primary glass-border-subtle glass-focus glass-transition glass-touch-target glass-contrast-guard"
          )}
        >
          <option value="all">All Tiers</option>
          <option value="bronze">Bronze</option>
          <option value="silver">Silver</option>
          <option value="gold">Gold</option>
          <option value="platinum">Platinum</option>
          <option value="diamond">Diamond</option>
        </select>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          aria-label="Sort by"
          className={cn(
            "glass-foundation-complete glass-px-4 glass-py-3 glass-radius-xl",
            "glass-text-primary glass-border-subtle glass-focus glass-transition"
          )}
        >
          <option value="recent">Recent</option>
          <option value="progress">Progress</option>
          <option value="rarity">Rarity</option>
          <option value="points">Points</option>
        </select>

        {/* View mode */}
        <div className="glass-flex glass-surface-subtle/10 glass-radius-xl glass-p-1">
          <motion.button
            onClick={() => setViewMode("grid")}
            aria-label="Grid view"
            className={`p-2 rounded-lg transition-all ${
              viewMode === "grid" ? "bg-white/20 text-white" : "text-white/60"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Grid className="glass-w-4 glass-h-4" />
          </motion.button>
          <motion.button
            onClick={() => setViewMode("list")}
            aria-label="List view"
            className={`p-2 rounded-lg transition-all ${
              viewMode === "list" ? "bg-white/20 text-white" : "text-white/60"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <List className="glass-w-4 glass-h-4" />
          </motion.button>
        </div>

        {/* Show locked toggle */}
        <motion.button
          onClick={() => setShowLocked(!showLocked)}
          aria-label={
            showLocked ? "Hide locked achievements" : "Show locked achievements"
          }
          className={`px-4 py-3 border border-white/20 rounded-xl transition-all ${
            showLocked ? "bg-white/10 text-white" : "bg-white/5 text-white/60"
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {showLocked ? (
            <Unlock className="glass-w-4 glass-h-4" />
          ) : (
            <Lock className="glass-w-4 glass-h-4" />
          )}
        </motion.button>
      </div>

      {/* Achievements Grid/List */}
      <motion.div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "space-y-4"
        }
        layout
      >
        <AnimatePresence>
          {filteredAchievements.map((achievement) => (
            <AchievementCard key={achievement.id} achievement={achievement} />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Achievement Detail Modal */}
      <AnimatePresence>
        {selectedAchievement && (
          <>
            <motion.div
              className="glass-fixed glass-inset-0 glass-surface-dark/50 glass-backdrop-blur-sm glass-contrast-guard glass-z-50 glass-contrast-guard"
              initial={{ opacity: 0 }}
              animate={prefersReducedMotion ? {} : { opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedAchievement(null)}
            />

            <motion.div
              className="glass-fixed glass-inset-0 glass-flex glass-items-center glass-justify-center glass-z-50 glass-p-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={prefersReducedMotion ? {} : { opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className="glass-max-w-lg glass-w-full glass-backdrop-blur-lg glass-contrast-guard glass-surface-subtle/10 glass-border glass-border-white/20 glass-radius-xl glass-p-8 glass-contrast-guard">
                <div className="glass-text-center">
                  <div className="glass-flex glass-items-center glass-justify-center glass-mb-4">
                    <div
                      className="glass-p-6 glass-radius-full glass-border-2"
                      style={{
                        backgroundColor: `${tierColors[selectedAchievement.tier].primary}20`,
                        borderColor:
                          tierColors[selectedAchievement.tier].primary,
                      }}
                    >
                      <selectedAchievement.icon className="glass-w-12 glass-h-12 glass-touch-target glass-contrast-guard" />
                    </div>
                  </div>

                  <h2 className="glass-text-2xl glass-font-bold glass-text-primary glass-mb-2">
                    {selectedAchievement.title}
                  </h2>

                  <div className="glass-flex glass-items-center glass-justify-center glass-gap-2 glass-mb-4">
                    <div
                      className="glass-px-3 glass-py-1 glass-radius-full glass-text-sm glass-font-bold glass-border"
                      style={{
                        backgroundColor: `${tierColors[selectedAchievement.tier].primary}20`,
                        borderColor: `${tierColors[selectedAchievement.tier].primary}40`,
                        color: tierColors[selectedAchievement.tier].primary,
                      }}
                    >
                      {selectedAchievement.tier.toUpperCase()}
                    </div>
                    <div className="glass-px-3 glass-py-1 glass-surface-subtle/10 glass-border glass-border-white/20 glass-radius-full glass-text-sm glass-text-primary-glass-opacity-80">
                      {selectedAchievement.rarity}% rare
                    </div>
                  </div>

                  <p className="glass-text-primary-opacity-70 glass-mb-6">
                    {selectedAchievement.description}
                  </p>

                  {!selectedAchievement.unlocked && (
                    <div className="glass-mb-6">
                      <div className="glass-flex glass-justify-between glass-items-center glass-mb-2">
                        <span className="glass-text-sm glass-text-primary-glass-opacity-60">
                          Progress
                        </span>
                        <span className="glass-text-sm glass-text-primary-glass-opacity-60">
                          {selectedAchievement.progress}/
                          {selectedAchievement.maxProgress}
                        </span>
                      </div>
                      <div className="glass-h-3 glass-surface-subtle/10 glass-radius-full glass-overflow-hidden">
                        <div
                          className="glass-h-full glass-radius-full glass-transition-all glass-duration-1000"
                          style={{
                            backgroundColor:
                              tierColors[selectedAchievement.tier].primary,
                            width: `${(selectedAchievement.progress / selectedAchievement.maxProgress) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="glass-flex glass-items-center glass-justify-center glass-gap-6 glass-mb-6">
                    <div className="glass-text-center">
                      <div className="glass-text-xl glass-font-bold glass-text-primary">
                        {selectedAchievement.points}
                      </div>
                      <div className="glass-text-sm glass-text-primary-glass-opacity-60">
                        Points
                      </div>
                    </div>

                    <div className="glass-text-center">
                      <div className="glass-text-xl glass-font-bold glass-text-primary">
                        {selectedAchievement.category}
                      </div>
                      <div className="glass-text-sm glass-text-primary-glass-opacity-60">
                        Category
                      </div>
                    </div>
                  </div>

                  {selectedAchievement.reward && (
                    <div className="glass-p-4 glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-border glass-border-purple-500/30 glass-radius-xl glass-mb-6">
                      <div className="glass-flex glass-items-center glass-justify-center glass-gap-2 glass-mb-2">
                        <Gift className="glass-w-5 glass-h-5 glass-text-primary" />
                        <span className="glass-text-primary glass-font-medium">
                          Reward
                        </span>
                      </div>
                      <div className="glass-text-secondary glass-text-sm">
                        Unlocks: {selectedAchievement.reward.value}
                      </div>
                    </div>
                  )}

                  {selectedAchievement.unlocked &&
                    selectedAchievement.unlockedAt && (
                      <div className="glass-text-primary glass-text-sm">
                        ✓ Unlocked on{" "}
                        {selectedAchievement.unlockedAt.toLocaleDateString()}
                      </div>
                    )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Empty state */}
      {filteredAchievements.length === 0 && (
        <motion.div
          className="glass-text-center glass-py-16"
          initial={{ opacity: 0 }}
          animate={prefersReducedMotion ? {} : { opacity: 1 }}
        >
          <Trophy className="glass-w-16 glass-h-16 glass-text-primary-glass-opacity-30 glass-mx-auto glass-mb-4" />
          <div
            role="heading"
            aria-level={2}
            className="glass-text-xl glass-font-semibold glass-text-primary-glass-opacity-60 glass-mb-2"
          >
            No achievements found
          </div>
          <p className="glass-text-primary-glass-opacity-40">
            Try adjusting your filters or{" "}
            {!showLocked
              ? "show locked achievements"
              : "start reading to unlock some!"}
          </p>
        </motion.div>
      )}
    </div>
  );
}

export default GlassTrophyCase;
