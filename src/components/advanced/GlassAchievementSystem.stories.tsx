/**
 * AuraGlass Achievement System Stories
 * Gamified user engagement with progressive rewards and glass-themed achievements
 */

import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import {
  GlassAchievementProvider,
  GlassAchievementNotifications,
  GlassAchievementDashboard,
  useAchievements,
  useAchievementTracker,
  achievementPresets,
} from './GlassAchievementSystem';

const meta: Meta<typeof GlassAchievementProvider> = {
  title: 'Advanced/Consciousness Interface/Achievement System',
  component: GlassAchievementProvider,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Glass Achievement System

Gamified user engagement with progressive rewards and glass-themed achievements.

## Features
- **Progressive XP System** - Earn experience points and level up through interactions
- **15+ Glass Achievements** - Themed achievements for different interaction patterns
- **Achievement Categories** - Interaction, exploration, mastery, social, creative, performance
- **Real-time Notifications** - Beautiful notifications with celebration effects
- **Achievement Dashboard** - Track progress, stats, and unlocked achievements
- **Behavioral Analytics** - Track streaks, session data, and user patterns

## Achievement Categories
- **Interaction** - Basic clicking, hovering, and component usage
- **Exploration** - Discovering new components and features
- **Mastery** - Advanced usage patterns and skill development
- **Performance** - Speed-based and efficiency achievements
- **Social** - Collaborative features and sharing
- **Creative** - Customization and personalization achievements

## Achievement Rarities
- **Common** (Gray) - Easy to earn, basic interactions (10-50 XP)
- **Rare** (Blue) - Moderate difficulty, sustained usage (50-100 XP)
- **Epic** (Purple) - Challenging requirements, skill-based (100-200 XP)
- **Legendary** (Gold) - Extremely difficult, long-term commitment (200-500 XP)

## Gamification Elements
- **XP and Levels** - Exponential progression curve with meaningful milestones
- **Achievement Notifications** - Celebration animations and visual feedback
- **Progress Tracking** - Visual progress bars and completion percentages
- **Statistics Dashboard** - Detailed analytics and performance metrics
- **Streak System** - Daily engagement rewards and consistency tracking

## Example Achievements
- **Glass Toucher** - First interaction (Common, 10 XP)
- **Glass Enthusiast** - 100 clicks (Rare, 50 XP)
- **Ethereal Navigator** - 500 hover interactions (Epic, 100 XP)
- **Glass Virtuoso** - Perfect 20-action combo (Legendary, 300 XP)
- **Consistency Crystal** - 30-day streak (Legendary, 500 XP)

## Privacy & Data
- **Local Storage** - All achievement data stored locally in browser
- **No Tracking** - No external analytics or data transmission
- **User Control** - Users can reset or disable achievement tracking
        `,
      },
    },
  },
  argTypes: {
    userId: {
      control: 'text',
      description: 'Unique identifier for the user',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof GlassAchievementProvider>;

// Interactive demo component
function AchievementSystemDemo() {
  const { progress, notifications } = useAchievements();
  const { trackClick, trackHover, trackCustomization, recordAction } = useAchievementTracker();
  const [showDashboard, setShowDashboard] = useState(true);
  const [showNotifications, setShowNotifications] = useState(true);
  const [actionCount, setActionCount] = useState(0);
  const [comboCount, setComboCount] = useState(0);

  const handleInteraction = (type: string, component?: string) => {
    setActionCount(prev => prev + 1);
    
    switch (type) {
      case 'click':
        trackClick(component);
        setComboCount(prev => prev + 1);
        break;
      case 'hover':
        trackHover(component);
        break;
      case 'customize':
        trackCustomization('theme', Math.random().toString());
        break;
      case 'special':
        recordAction('special_action', { component, timestamp: Date.now() });
        break;
    }
    
    // Simulate rapid interactions for combo achievements
    setTimeout(() => {
      setComboCount(prev => Math.max(0, prev - 1));
    }, 1000);
  };

  const unlockedCount = progress?.achievements.filter(a => a.unlocked).length || 0;
  const totalAchievements = progress?.achievements.length || 0;
  const recentNotifications = notifications.slice(-3);

  return (
    <div className="glass-min-h-screen p-8 space-y-8">
      {/* Header */}
      <div className="text-center gap-4">
        <h1 className="text-4xl font-bold text-primary">
          🎮 Glass Achievement System
        </h1>
        <p className="text-lg glass-text-secondary">
          Gamified engagement with progressive rewards and achievements
        </p>
        
        {/* Progress Overview */}
        <div className="flex justify-center items-center space-x-6">
          <div className="flex items-center gap-2 glass-surface-secondary glass-radius-full px-4 py-2">
            <span className="text-lg">⭐</span>
            <span className="text-sm text-primary">
              Level {progress?.level || 1}
            </span>
          </div>
          
          <div className="flex items-center gap-2 glass-surface-secondary glass-radius-full px-4 py-2">
            <span className="text-lg">✨</span>
            <span className="text-sm text-primary">
              {progress?.totalXP || 0} XP
            </span>
          </div>
          
          <div className="flex items-center gap-2 glass-surface-secondary glass-radius-full px-4 py-2">
            <span className="text-lg">🏆</span>
            <span className="text-sm text-primary">
              {unlockedCount}/{totalAchievements} Achievements
            </span>
          </div>
          
          <div className="flex items-center gap-2 glass-surface-secondary glass-radius-full px-4 py-2">
            <span className="text-lg">🔥</span>
            <span className="text-sm text-primary">
              {progress?.streak || 0} Day Streak
            </span>
          </div>
        </div>

        {/* XP Progress Bar */}
        {progress && (
          <div className="max-w-md mx-auto gap-2">
            <div className="glass-surface-secondary glass-radius-lg h-3 overflow-hidden">
              <div 
                className="h-full glass-gradient-primary glass-gradient-primary glass-gradient-primary transition-all duration-500"
                style={{ width: `${(progress.currentXP / progress.xpToNextLevel) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-xs glass-text-tertiary">
              <span>{progress.currentXP} XP</span>
              <span>{progress.xpToNextLevel} XP to Level {progress.level + 1}</span>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="flex justify-center gap-4">
          <button
            onClick={() => setShowDashboard(!showDashboard)}
            className="glass-surface-primary glass-elev-2 glass-radius-lg px-4 py-2 hover:glass-elev-3 transition-all duration-300"
          >
            {showDashboard ? '📊 Hide Dashboard' : '📊 Show Dashboard'}
          </button>
          
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="glass-surface-primary glass-elev-2 glass-radius-lg px-4 py-2 hover:glass-elev-3 transition-all duration-300"
          >
            {showNotifications ? '🔔 Hide Notifications' : '🔔 Show Notifications'}
          </button>
        </div>
      </div>

      {/* Interactive Achievement Triggers */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-primary mb-2">
            🎯 Achievement Triggers
          </h2>
          <p className="text-sm glass-text-secondary">
            Interact with elements below to unlock achievements
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { id: 'tap-button', icon: '🫳', label: 'Glass Tap', description: 'Click to earn interaction XP' },
            { id: 'hover-zone', icon: '👻', label: 'Hover Zone', description: 'Hover to build ethereal skills' },
            { id: 'combo-trigger', icon: '🎭', label: 'Combo Trigger', description: 'Click rapidly for combos' },
            { id: 'custom-element', icon: '🎨', label: 'Customizer', description: 'Unlock creative achievements' },
            { id: 'explore-card', icon: '🔍', label: 'Explorer', description: 'Discover new components' },
            { id: 'master-element', icon: '⚡', label: 'Mastery', description: 'Advanced interactions' },
            { id: 'social-button', icon: '🤝', label: 'Social Hub', description: 'Collaborative features' },
            { id: 'special-action', icon: '🌟', label: 'Special', description: 'Hidden achievements' },
          ].map((item) => (
            <button
              key={item.id}
              className="glass-surface-primary glass-elev-2 glass-radius-lg p-6 text-center gap-4 
                         hover:glass-elev-3 transition-all duration-300 cursor-pointer group"
              onClick={() => handleInteraction('click', item.id)}
              onMouseEnter={() => handleInteraction('hover', item.id)}
              onDoubleClick={() => handleInteraction('special', item.id)}
            >
              <div className="text-3xl group-hover:scale-110 transition-transform duration-300">
                {item.icon}
              </div>
              <h3 className="text-lg font-medium text-primary">
                {item.label}
              </h3>
              <p className="text-sm glass-text-secondary">
                {item.description}
              </p>
              <div className="text-xs glass-text-tertiary">
                {item.id === 'combo-trigger' ? `Combo: ${comboCount}` : 'Click to interact'}
              </div>
            </button>
          ))}
        </div>
        
        {/* Special Actions */}
        <div className="text-center gap-4">
          <h3 className="text-xl font-medium text-primary">
            🎨 Special Actions
          </h3>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => handleInteraction('customize')}
              className="glass-surface-secondary glass-elev-2 glass-radius-lg px-6 py-3 hover:glass-elev-3 transition-all duration-300"
            >
              🎨 Customize Theme
            </button>
            
            <button
              onClick={() => recordAction('collaborate', { users: ['demo-user'] })}
              className="glass-surface-secondary glass-elev-2 glass-radius-lg px-6 py-3 hover:glass-elev-3 transition-all duration-300"
            >
              🤝 Collaborate
            </button>
            
            <button
              onClick={() => {
                // Simulate rapid sequence for combo achievement
                for (let i = 0; i < 5; i++) {
                  setTimeout(() => handleInteraction('click', 'combo-sequence'), i * 100);
                }
              }}
              className="glass-surface-secondary glass-elev-2 glass-radius-lg px-6 py-3 hover:glass-elev-3 transition-all duration-300"
            >
              ⚡ Trigger Combo
            </button>
          </div>
        </div>
      </div>

      {/* Current Stats */}
      <div className="glass-surface-primary glass-elev-1 glass-radius-lg p-6">
        <h3 className="text-xl font-medium text-primary mb-4">
          📈 Session Statistics
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center glass-surface-secondary glass-radius-md p-4">
            <div className="text-2xl font-bold text-primary">{actionCount}</div>
            <div className="text-sm glass-text-secondary">Actions</div>
          </div>
          <div className="text-center glass-surface-secondary glass-radius-md p-4">
            <div className="text-2xl font-bold text-primary">{progress?.stats.totalInteractions || 0}</div>
            <div className="text-sm glass-text-secondary">Total Interactions</div>
          </div>
          <div className="text-center glass-surface-secondary glass-radius-md p-4">
            <div className="text-2xl font-bold text-primary">{progress?.stats.componentsExplored.length || 0}</div>
            <div className="text-sm glass-text-secondary">Components</div>
          </div>
          <div className="text-center glass-surface-secondary glass-radius-md p-4">
            <div className="text-2xl font-bold text-primary">{Math.max(comboCount, progress?.stats.highestStreak || 0)}</div>
            <div className="text-sm glass-text-secondary">Best Combo</div>
          </div>
        </div>
      </div>

      {/* Recent Notifications Preview */}
      {recentNotifications.length > 0 && (
        <div className="glass-surface-primary glass-elev-1 glass-radius-lg p-6">
          <h3 className="text-xl font-medium text-primary mb-4">
            🔔 Recent Achievements
          </h3>
          <div className="gap-3">
            {recentNotifications.map((notification, index) => (
              <div 
                key={`recent-${index}`}
                className="flex items-center gap-4 glass-surface-secondary glass-radius-md p-3"
              >
                <div className="text-2xl">{notification.achievement.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-primary">
                      {notification.achievement.title}
                    </span>
                    <span className={`glass-px-2 glass-py-1 glass-text-xs glass-radius-full capitalize
                      ${notification.achievement.rarity === 'common' ? 'bg-gray-600 glass-text-secondary' :
                        notification.achievement.rarity === 'rare' ? 'bg-blue-600 text-blue-200' :
                        notification.achievement.rarity === 'epic' ? 'bg-purple-600 text-purple-200' :
                        'bg-amber-500 text-amber-100'}`}>
                      {notification.achievement.rarity}
                    </span>
                  </div>
                  <div className="text-xs glass-text-secondary">
                    +{notification.achievement.xp} XP • {new Date(notification.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Achievement Guide */}
      <div className="glass-surface-primary glass-elev-1 glass-radius-lg p-6">
        <h3 className="text-xl font-medium text-primary mb-4">
          📚 Achievement Guide
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="gap-3">
            <h4 className="text-lg font-medium text-primary">Quick Achievements</h4>
            <ul className="gap-1 text-sm glass-text-secondary">
              <li>• Click any element (Glass Toucher)</li>
              <li>• Hover over elements (Ethereal Navigator)</li>
              <li>• Customize themes (Glass Artisan)</li>
              <li>• Explore different components</li>
            </ul>
          </div>
          <div className="gap-3">
            <h4 className="text-lg font-medium text-primary">Advanced Achievements</h4>
            <ul className="gap-1 text-sm glass-text-secondary">
              <li>• Build combo streaks (Glass Virtuoso)</li>
              <li>• Use components for extended time</li>
              <li>• Collaborate with other users</li>
              <li>• Maintain daily streaks</li>
            </ul>
          </div>
          <div className="gap-3">
            <h4 className="text-lg font-medium text-primary">Hidden Achievements</h4>
            <ul className="gap-1 text-sm glass-text-secondary">
              <li>• Double-click elements (Secret Keeper)</li>
              <li>• Use components at night (Night Owl)</li>
              <li>• Rapid interaction patterns</li>
              <li>• Discover easter eggs</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Achievement Dashboard */}
      <GlassAchievementDashboard show={showDashboard} />
      
      {/* Achievement Notifications */}
      {showNotifications && (
        <GlassAchievementNotifications position="top-right" />
      )}
    </div>
  );
}

export const Interactive: Story = {
  render: (args) => (
    <GlassAchievementProvider {...args}>
      <AchievementSystemDemo />
    </GlassAchievementProvider>
  ),
  args: {
    userId: 'storybook-demo-user',
  },
};

export const CasualMode: Story = {
  render: (args) => (
    <GlassAchievementProvider {...args}>
      <div className="glass-min-h-screen p-8 space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-primary mb-4">
            Casual Achievement Mode
          </h2>
          <p className="text-sm glass-text-secondary mb-6">
            Relaxed progression with standard XP rates and 3-second notifications
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Action 1', 'Action 2', 'Action 3', 'Action 4'].map((action, i) => {
            const { trackClick } = useAchievementTracker();
            return (
              <button
                key={action}
                className="glass-surface-primary glass-elev-2 glass-radius-lg p-6 text-center hover:glass-elev-3 transition-all duration-300"
                onClick={() => trackClick(`casual-action-${i}`)}
              >
                <div className="text-2xl mb-2">🎮</div>
                <div className="text-sm text-primary">{action}</div>
                <div className="text-xs glass-text-secondary">Casual XP</div>
              </button>
            );
          })}
        </div>
        
        <div className="glass-surface-primary glass-elev-1 glass-radius-lg p-6 text-center">
          <h3 className="text-lg font-medium text-primary mb-2">Casual Settings</h3>
          <div className="gap-1 text-sm glass-text-secondary">
            <div>• Normal XP rates (1x multiplier)</div>
            <div>• Standard notification duration (3 seconds)</div>
            <div>• Progress tracking enabled</div>
            <div>• All achievements visible</div>
          </div>
        </div>
      </div>
      <GlassAchievementDashboard show={true} />
      <GlassAchievementNotifications position="top-right" />
    </GlassAchievementProvider>
  ),
  args: {
    userId: 'casual-user',
  },
  parameters: {
    docs: {
      description: {
        story: 'Casual mode with standard progression and relaxed achievement unlocking.',
      },
    },
  },
};

export const HardcoreMode: Story = {
  render: (args) => (
    <GlassAchievementProvider {...args}>
      <div className="glass-min-h-screen p-8 space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-primary mb-4">
            Hardcore Achievement Mode
          </h2>
          <p className="text-sm glass-text-secondary mb-6">
            Challenging progression with reduced XP rates and hidden achievements
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {['Elite Challenge', 'Master Quest', 'Legendary Trial'].map((challenge, i) => {
            const { trackClick, recordAction } = useAchievementTracker();
            return (
              <button
                key={challenge}
                className="glass-surface-primary glass-elev-2 glass-radius-lg p-8 text-center hover:glass-elev-3 transition-all duration-300
                          border-2 border-red/30 hover:border-red/50"
                onClick={() => {
                  trackClick(`hardcore-challenge-${i}`);
                  recordAction('hardcore_action', { challenge, difficulty: 'extreme' });
                }}
              >
                <div className="text-3xl mb-4">⚔️</div>
                <h3 className="text-lg font-medium text-primary mb-2">{challenge}</h3>
                <p className="text-sm glass-text-secondary">
                  High difficulty challenge with reduced XP rewards
                </p>
                <div className="text-xs glass-text-tertiary glass-mt-2">
                  XP Multiplier: 0.5x
                </div>
              </button>
            );
          })}
        </div>
        
        <div className="glass-surface-primary glass-elev-1 glass-radius-lg p-6">
          <h3 className="text-lg font-medium text-primary mb-4">Hardcore Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-primary mb-2">Challenges</h4>
              <ul className="gap-1 text-xs glass-text-secondary">
                <li>• 50% reduced XP gain</li>
                <li>• Hidden achievement requirements</li>
                <li>• Longer notification duration (5 seconds)</li>
                <li>• Progress tracking with detailed analytics</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium text-primary mb-2">Rewards</h4>
              <ul className="gap-1 text-xs glass-text-secondary">
                <li>• Exclusive hardcore achievements</li>
                <li>• Special visual effects</li>
                <li>• Enhanced progression tracking</li>
                <li>• Elite status indicators</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <GlassAchievementDashboard show={true} />
      <GlassAchievementNotifications position="top-right" />
    </GlassAchievementProvider>
  ),
  args: {
    userId: 'hardcore-user',
  },
  parameters: {
    docs: {
      description: {
        story: 'Hardcore mode with challenging progression and hidden achievements.',
      },
    },
  },
};

export const MinimalMode: Story = {
  render: (args) => (
    <GlassAchievementProvider {...args}>
      <div className="glass-min-h-screen p-8 space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-primary mb-4">
            Minimal Achievement Mode
          </h2>
          <p className="text-sm glass-text-secondary mb-6">
            Quiet mode with minimal notifications and hidden progress tracking
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {['Simple Action', 'Quiet Task', 'Minimal Interaction', 'Basic Function', 'Clean Action', 'Pure Task'].map((action, i) => {
            const { trackClick } = useAchievementTracker();
            return (
              <button
                key={action}
                className="glass-surface-primary glass-elev-1 glass-radius-lg p-4 text-center hover:glass-elev-2 transition-all duration-300"
                onClick={() => trackClick(`minimal-${i}`)}
              >
                <div className="text-lg mb-2">⚪</div>
                <div className="text-sm text-primary">{action}</div>
              </button>
            );
          })}
        </div>
        
        <div className="glass-surface-primary glass-elev-1 glass-radius-lg p-6 text-center">
          <h3 className="text-lg font-medium text-primary mb-2">Minimal Settings</h3>
          <div className="gap-1 text-sm glass-text-secondary">
            <div>• Quiet mode notifications (2 seconds)</div>
            <div>• Progress tracking hidden</div>
            <div>• Minimal visual feedback</div>
            <div>• Background achievement tracking</div>
          </div>
        </div>
        
        {/* Note: Dashboard and notifications are intentionally minimal/hidden */}
      </div>
    </GlassAchievementProvider>
  ),
  args: {
    userId: 'minimal-user',
  },
  parameters: {
    docs: {
      description: {
        story: 'Minimal mode with quiet notifications and hidden progress for distraction-free usage.',
      },
    },
  },
};

// Notifications-only story
export const NotificationsOnly: Story = {
  render: (args) => (
    <GlassAchievementProvider {...args}>
      <div className="glass-min-h-screen p-8 space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-primary mb-4">
            Achievement Notifications Demo
          </h2>
          <p className="text-sm glass-text-secondary mb-6">
            Trigger actions to see achievement notifications
          </p>
        </div>
        
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {Array.from({ length: 12 }, (_, i) => {
            const { trackClick, trackHover, recordAction } = useAchievementTracker();
            return (
              <button
                key={i}
                className="aspect-square glass-surface-primary glass-elev-2 glass-radius-lg 
                          hover:glass-elev-3 transition-all duration-300 flex items-center justify-center"
                onClick={() => {
                  trackClick(`notification-trigger-${i}`);
                  if (i % 3 === 0) recordAction('special_trigger', { index: i });
                }}
                onMouseEnter={() => trackHover(`notification-hover-${i}`)}
              >
                <div className="text-xl">
                  {i % 4 === 0 ? '🎯' : i % 4 === 1 ? '🌟' : i % 4 === 2 ? '💎' : '🏆'}
                </div>
              </button>
            );
          })}
        </div>
        
        <div className="text-center glass-surface-primary glass-elev-1 glass-radius-lg p-4">
          <p className="text-sm glass-text-secondary">
            Click and hover over the buttons above to trigger achievement notifications in the top-right corner
          </p>
        </div>
      </div>
      <GlassAchievementNotifications position="top-right" />
    </GlassAchievementProvider>
  ),
  args: {
    userId: 'notification-demo-user',
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows achievement notifications triggered by user interactions.',
      },
    },
  },
};

// Dashboard-only story
export const DashboardOnly: Story = {
  render: (args) => (
    <GlassAchievementProvider {...args}>
      <div className="glass-min-h-screen p-8">
        <div className="text-center gap-4 mb-8">
          <h2 className="text-2xl font-bold text-primary">
            Achievement Dashboard
          </h2>
          <p className="text-sm glass-text-secondary">
            Track your progress, achievements, and statistics
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {Array.from({ length: 16 }, (_, i) => {
            const { trackClick } = useAchievementTracker();
            return (
              <button
                key={i}
                className="glass-surface-primary glass-elev-2 glass-radius-lg p-3 hover:glass-elev-3 transition-all duration-300"
                onClick={() => trackClick(`dashboard-test-${i}`)}
              >
                <div className="text-sm text-primary">Test {i + 1}</div>
              </button>
            );
          })}
        </div>
      </div>
      <GlassAchievementDashboard show={true} />
    </GlassAchievementProvider>
  ),
  args: {
    userId: 'dashboard-demo-user',
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the achievement dashboard with interactive elements for testing progress tracking.',
      },
    },
  },
};