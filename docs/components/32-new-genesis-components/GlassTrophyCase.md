# GlassTrophyCase

Complete achievement system with tiers, categories, progress tracking, and gamification features.

## Overview

The `GlassTrophyCase` component provides a comprehensive gamification system for user engagement. It includes achievement tracking, progress visualization, tiered rewards, and interactive trophy displays with glassmorphism styling.

## Features

- **Achievement Tiers**: Bronze, Silver, Gold, Platinum, Diamond progression
- **Category System**: Reading, Engagement, Social, Exploration, Time, Special categories
- **Progress Tracking**: Visual progress bars and completion percentages
- **Gamification**: Points, rarity levels, and reward systems
- **Interactive UI**: Filterable grid/list views with search functionality
- **Sound Effects**: Achievement unlock audio feedback
- **Secret Achievements**: Hidden achievements for discovery
- **Statistics Dashboard**: User progress and completion metrics

## Usage

```tsx
import { GlassTrophyCase } from '@aura/aura-glass';

const achievements = [
  {
    id: 'first-article',
    title: 'First Steps',
    description: 'Read your first article',
    icon: BookOpen,
    tier: 'bronze',
    category: 'reading',
    progress: 1,
    maxProgress: 1,
    unlocked: true,
    rarity: 95,
    points: 10,
    glowColor: '#FFD700'
  },
  {
    id: 'speed-reader',
    title: 'Speed Reader',
    description: 'Read 50 articles',
    icon: Zap,
    tier: 'silver',
    category: 'reading',
    progress: 47,
    maxProgress: 50,
    unlocked: false,
    rarity: 60,
    points: 50,
    glowColor: '#E6E6FA'
  }
];

function AchievementPage() {
  return (
    <GlassTrophyCase
      achievements={achievements}
      onAchievementUnlock={(achievement) => {
        console.log('Achievement unlocked:', achievement.title);
        // Handle unlock logic (notifications, etc.)
      }}
      showProgress={true}
      enableSound={true}
      className="max-w-6xl mx-auto"
    />
  );
}
```

## API Reference

### GlassTrophyCase

Main achievement display component.

```tsx
type AchievementTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
type AchievementCategory = 'reading' | 'engagement' | 'social' | 'exploration' | 'time' | 'special';

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
  rarity: number; // 1-100
  points: number;
  prerequisite?: string[];
  secret?: boolean;
  animated?: boolean;
  glowColor: string;
  reward?: {
    type: 'theme' | 'badge' | 'feature' | 'title';
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
```

## Achievement Tiers

### Tier Specifications

| Tier | Color | Points Multiplier | Rarity Threshold | Unlock Effects |
|------|-------|-------------------|------------------|----------------|
| Bronze | `#CD7F32` | 1x | < 25% | Basic glow |
| Silver | `#C0C0C0` | 1.5x | 25-50% | Enhanced glow |
| Gold | `#FFD700` | 2x | 50-75% | Sparkle effects |
| Platinum | `#E5E4E2` | 3x | 75-90% | Premium effects |
| Diamond | `#B9F2FF` | 5x | > 90% | Ultimate effects |

## Achievement Categories

### Category Overview

- **Reading**: Article consumption and reading habits
- **Engagement**: User interaction and content engagement
- **Social**: Sharing, commenting, and social features
- **Exploration**: Content discovery and navigation
- **Time**: Time-based achievements and streaks
- **Special**: Unique, rare, or event-based achievements

## Advanced Usage

### Custom Achievement Creation

```tsx
const customAchievements: Achievement[] = [
  {
    id: 'theme-explorer',
    title: 'Theme Explorer',
    description: 'Try 10 different glass themes',
    icon: Palette,
    tier: 'gold',
    category: 'exploration',
    progress: 7,
    maxProgress: 10,
    unlocked: false,
    rarity: 35,
    points: 120,
    glowColor: '#FF6B6B',
    reward: {
      type: 'theme',
      value: 'rainbow-special'
    }
  },
  {
    id: 'accessibility-champion',
    title: 'Accessibility Champion',
    description: 'Enable all accessibility features',
    icon: Heart,
    tier: 'platinum',
    category: 'special',
    progress: 1,
    maxProgress: 1,
    unlocked: true,
    unlockedAt: new Date(),
    rarity: 15,
    points: 300,
    glowColor: '#4ECDC4'
  }
];
```

### Achievement Progress Tracking

```tsx
function AchievementManager() {
  const [achievements, setAchievements] = useState(defaultAchievements);

  const updateProgress = (achievementId: string, newProgress: number) => {
    setAchievements(prev => prev.map(achievement => {
      if (achievement.id === achievementId) {
        const updated = { ...achievement, progress: newProgress };

        // Check for unlock
        if (!updated.unlocked && updated.progress >= updated.maxProgress) {
          updated.unlocked = true;
          updated.unlockedAt = new Date();

          // Trigger unlock callback
          onAchievementUnlock?.(updated);
        }

        return updated;
      }
      return achievement;
    }));
  };

  // Example: Update reading progress
  useEffect(() => {
    const articlesRead = getUserArticleCount();
    updateProgress('speed-reader', articlesRead);
  }, [articlesRead]);

  return (
    <GlassTrophyCase
      achievements={achievements}
      onAchievementUnlock={handleAchievementUnlock}
    />
  );
}
```

### Secret Achievements

```tsx
const secretAchievements: Achievement[] = [
  {
    id: 'glass-master',
    title: 'Glass Master',
    description: 'Discover the rainbow glass mode',
    icon: Diamond,
    tier: 'diamond',
    category: 'special',
    progress: 0,
    maxProgress: 1,
    unlocked: false,
    secret: true, // Hidden until unlocked
    rarity: 1,
    points: 1000,
    glowColor: '#FF1493',
    reward: {
      type: 'theme',
      value: 'rainbow-exclusive'
    }
  }
];
```

## Interactive Features

### Filtering and Search

```tsx
// Component provides built-in filtering
<GlassTrophyCase
  achievements={achievements}
  // Built-in search and filter controls
/>
```

**Filter Options:**
- Category filtering (all categories available)
- Tier filtering (bronze to diamond)
- Progress filtering (completed, in-progress, locked)
- Rarity filtering (common to legendary)

### View Modes

```tsx
// Grid view (default)
<GlassTrophyCase achievements={achievements} />

// List view available through built-in controls
// Toggle between grid and list views
```

### Achievement Modal

```tsx
// Detailed achievement view with modal
// Shows progress, description, rewards, unlock date
// Includes visual progress indicators and statistics
```

## Sound Effects

### Achievement Unlock Sounds

```tsx
<GlassTrophyCase
  achievements={achievements}
  enableSound={true} // Enable victory fanfare
/>
```

**Audio Features:**
- Victory fanfare using Web Audio API
- Achievement tier-based sound variations
- Respect for user audio preferences
- Graceful fallback for unsupported browsers

## Statistics and Analytics

### User Statistics

```tsx
const userStats = {
  totalPoints: 2450,
  achievementsUnlocked: 23,
  completionRate: 76,
  favoriteCategory: 'reading',
  longestStreak: 30,
  rarestAchievement: 'diamond-tier'
};

<GlassTrophyCase
  achievements={achievements}
  userStats={userStats}
/>
```

### Achievement Analytics

- **Completion Rate**: Percentage of achievements unlocked
- **Points Earned**: Total gamification points accumulated
- **Category Breakdown**: Achievement distribution by category
- **Rarity Distribution**: Achievement distribution by rarity
- **Unlock Timeline**: Achievement unlock history and patterns

## Accessibility

### WCAG Compliance

- **1.1.1 Non-text Content**: Achievement icons have text alternatives
- **1.4.3 Contrast**: High contrast support for achievement cards
- **2.1.1 Keyboard**: Full keyboard navigation support
- **2.4.6 Headings**: Proper heading structure for screen readers
- **4.1.2 Name, Role, Value**: Proper ARIA labels and descriptions

### Screen Reader Support

```tsx
// Automatic announcements for:
- Achievement unlocks
- Progress updates
- Filter changes
- View mode switches
```

### Keyboard Navigation

- **Tab**: Navigate between achievement cards
- **Enter/Space**: Open achievement details
- **Arrow Keys**: Navigate within modals and controls
- **Escape**: Close modals and overlays

## Performance Optimization

### Virtual Scrolling

For large achievement collections:

```tsx
// Automatic performance optimizations for 100+ achievements
<GlassTrophyCase
  achievements={largeAchievementArray}
/>
```

### Lazy Loading

- Achievement images and icons load on demand
- Progress bars animate only when visible
- Sound effects load asynchronously

### Memory Management

- Efficient state updates for progress tracking
- Proper cleanup of event listeners
- Optimized re-renders with proper dependency arrays

## Integration Examples

### With User Authentication

```tsx
function UserDashboard({ userId }) {
  const [achievements, setAchievements] = useState([]);
  const [userStats, setUserStats] = useState({});

  useEffect(() => {
    // Load user achievements from API
    loadUserAchievements(userId).then(setAchievements);
    loadUserStats(userId).then(setUserStats);
  }, [userId]);

  return (
    <GlassTrophyCase
      achievements={achievements}
      userStats={userStats}
      onAchievementUnlock={(achievement) => {
        // Sync to server
        syncAchievementUnlock(userId, achievement.id);
        // Show notification
        showAchievementNotification(achievement);
      }}
    />
  );
}
```

### With Progress Tracking

```tsx
function ReadingTracker() {
  const [readingStats, setReadingStats] = useState({
    articlesRead: 0,
    totalReadingTime: 0,
    currentStreak: 0
  });

  // Update achievements based on reading activity
  useEffect(() => {
    updateAchievementProgress('speed-reader', readingStats.articlesRead);
    updateAchievementProgress('streak-master', readingStats.currentStreak);
  }, [readingStats]);

  return (
    <div>
      <ReadingInterface onArticleRead={handleArticleRead} />
      <GlassTrophyCase achievements={achievements} />
    </div>
  );
}
```

### With Social Features

```tsx
function SocialDashboard() {
  const handleAchievementUnlock = (achievement) => {
    // Share achievement on social media
    shareAchievement(achievement);

    // Update friend leaderboards
    updateLeaderboards(achievement);

    // Send notifications to followers
    notifyFollowers(achievement);
  };

  return (
    <GlassTrophyCase
      achievements={achievements}
      onAchievementUnlock={handleAchievementUnlock}
    />
  );
}
```

## Customization

### Custom Achievement Cards

```tsx
// Extend default achievement card styling
<GlassTrophyCase
  achievements={achievements}
  className="custom-trophy-case"
/>

// Add custom CSS for specific achievements
<style jsx>{`
  .custom-trophy-case .achievement-card[data-tier="diamond"] {
    background: linear-gradient(45deg, #B9F2FF, #87CEEB);
    box-shadow: 0 0 30px rgba(185, 242, 255, 0.3);
  }
`}</style>
```

### Custom Sound Effects

```tsx
// Provide custom unlock sounds
const customSounds = {
  bronze: '/sounds/bronze-unlock.mp3',
  silver: '/sounds/silver-unlock.mp3',
  gold: '/sounds/gold-unlock.mp3',
  platinum: '/sounds/platinum-unlock.mp3',
  diamond: '/sounds/diamond-unlock.mp3'
};

<GlassTrophyCase
  achievements={achievements}
  enableSound={true}
  customSounds={customSounds}
/>
```

## Best Practices

1. **Progressive Disclosure**: Show locked achievements to encourage engagement
2. **Clear Requirements**: Make achievement criteria obvious and achievable
3. **Meaningful Rewards**: Provide valuable rewards for achievement completion
4. **Balanced Difficulty**: Ensure achievements are challenging but not frustrating
5. **Regular Updates**: Add new achievements periodically to maintain engagement
6. **Social Integration**: Allow achievement sharing and comparison
7. **Accessibility First**: Ensure all achievements are accessible to all users

## Troubleshooting

### Common Issues

**Achievements not unlocking:**
- Check progress calculation logic
- Verify achievement prerequisites are met
- Ensure proper state updates

**Performance issues:**
- Limit achievement count for large collections
- Use pagination for extensive achievement lists
- Optimize image loading for achievement icons

**Styling conflicts:**
- Avoid overriding glass effect styles
- Use proper CSS specificity
- Check for z-index conflicts with modals

**Audio not working:**
- Check browser audio permissions
- Verify Web Audio API support
- Provide fallback for unsupported browsers
