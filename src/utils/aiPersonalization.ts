/**
 * AI-Powered Personalization Engine
 * Advanced machine learning system for adaptive user experience personalization
 */

import { useCallback, useRef, useState, useEffect, useMemo } from 'react';

// User interaction data structures
export interface UserInteraction {
  id: string;
  timestamp: number;
  type: 'click' | 'hover' | 'scroll' | 'focus' | 'type' | 'gesture' | 'voice' | 'gaze';
  target: string; // Component ID or selector
  context: string; // Page, section, or app context
  duration: number; // Interaction duration in ms
  position?: { x: number; y: number };
  metadata?: Record<string, any>;
}

// User behavior patterns
export interface BehaviorPattern {
  id: string;
  name: string;
  confidence: number; // 0-1 confidence score
  frequency: number; // How often this pattern occurs
  contexts: string[]; // Where this pattern applies
  temporal: {
    timeOfDay: number[]; // Hours when pattern is active
    dayOfWeek: number[]; // Days when pattern is active
    seasonality?: number; // Seasonal variation
  };
  triggers: string[]; // What triggers this pattern
  outcomes: string[]; // What typically follows this pattern
}

// Personalization preferences learned from behavior
export interface PersonalizationProfile {
  userId: string;
  created: number;
  lastUpdated: number;
  confidence: number;
  
  // UI Preferences
  uiPreferences: {
    colorScheme: 'light' | 'dark' | 'auto' | 'custom';
    animationSpeed: number; // 0.1-2.0 multiplier
    density: 'compact' | 'comfortable' | 'spacious';
    complexity: 'simple' | 'standard' | 'advanced';
    fontScale: number; // 0.8-1.5 multiplier
  };
  
  // Interaction Preferences
  interactionStyle: {
    primaryInput: 'mouse' | 'touch' | 'keyboard' | 'voice' | 'gaze' | 'gesture';
    preferredGestures: string[];
    clickPressure: number; // Preferred force level
    hoverDelay: number; // Preferred hover delay
    doubleClickSpeed: number;
    scrollSensitivity: number;
  };
  
  // Content Preferences
  contentPreferences: {
    informationDensity: 'minimal' | 'moderate' | 'detailed';
    explanationLevel: 'brief' | 'standard' | 'comprehensive';
    examplePreference: boolean; // Likes examples
    visualPreference: boolean; // Prefers visual over text
    progressIndicators: boolean; // Likes progress feedback
  };
  
  // Temporal Patterns
  temporalPatterns: {
    mostActiveHours: number[];
    peakPerformanceTime: number;
    preferredSessionDuration: number;
    breakFrequency: number; // Minutes between preferred breaks
  };
  
  // Cognitive Preferences
  cognitiveProfile: {
    processingSpeed: number; // Relative speed (0.1-2.0)
    workingMemoryCapacity: number; // Items that can be tracked (4-9)
    attentionSpan: number; // Average focus duration in minutes
    multitaskingPreference: boolean;
    interruptionTolerance: number; // 0-1 scale
  };
}

// Machine learning model for behavior prediction
interface MLModel {
  type: 'linear' | 'polynomial' | 'neural' | 'ensemble';
  features: string[];
  weights: number[];
  bias: number;
  accuracy: number;
  lastTrained: number;
}

// Personalization recommendations
export interface PersonalizationRecommendation {
  type: 'ui' | 'content' | 'interaction' | 'workflow';
  component: string;
  recommendation: string;
  confidence: number;
  reasoning: string[];
  expectedImpact: number; // Expected improvement (0-1)
  testable: boolean; // Can be A/B tested
}

// AI Learning Engine Class
class AIPersonalizationEngine {
  private interactions: UserInteraction[] = [];
  private patterns: BehaviorPattern[] = [];
  private profiles: Map<string, PersonalizationProfile> = new Map();
  private models: Map<string, MLModel> = new Map();
  private featureCache: Map<string, any> = new Map();
  
  // Add user interaction to learning dataset
  addInteraction(interaction: UserInteraction) {
    this.interactions.push(interaction);
    
    // Keep interactions buffer manageable (last 10,000 interactions)
    if (this.interactions.length > 10000) {
      this.interactions = this.interactions.slice(-10000);
    }
    
    // Trigger incremental learning
    this.incrementalLearning(interaction);
  }
  
  // Extract features from interaction data
  private extractFeatures(interactions: UserInteraction[]): Record<string, number> {
    if (interactions.length === 0) return {};
    
    // Temporal features
    const now = Date.now();
    const recentInteractions = interactions.filter((i: any) => now - i.timestamp < 3600000); // Last hour
    
    const features = {
      // Interaction frequency
      totalInteractions: interactions.length,
      recentInteractionRate: recentInteractions.length / 60, // Interactions per minute
      
      // Interaction types distribution
      clickRatio: interactions.filter((i: any) => i.type === 'click').length / interactions.length,
      hoverRatio: interactions.filter((i: any) => i.type === 'hover').length / interactions.length,
      scrollRatio: interactions.filter((i: any) => i.type === 'scroll').length / interactions.length,
      
      // Duration patterns
      avgInteractionDuration: interactions.reduce((sum, i) => sum + i.duration, 0) / interactions.length,
      maxInteractionDuration: Math.max(...interactions.map((i: any) => i.duration)),
      minInteractionDuration: Math.min(...interactions.map((i: any) => i.duration)),
      
      // Temporal patterns
      hourOfDay: new Date().getHours(),
      dayOfWeek: new Date().getDay(),
      
      // Sequence patterns
      sequentialClicks: this.countSequentialPatterns(interactions, 'click'),
      rapidInteractions: interactions.filter((i: any) => i.duration < 100).length,
      slowInteractions: interactions.filter((i: any) => i.duration > 5000).length,
      
      // Spatial patterns (if position data available)
      avgPositionX: this.calculateAveragePosition(interactions, 'x'),
      avgPositionY: this.calculateAveragePosition(interactions, 'y'),
      positionVariance: this.calculatePositionVariance(interactions),
      
      // Context patterns
      uniqueContexts: new Set(interactions.map((i: any) => i.context)).size,
      contextSwitchRate: this.calculateContextSwitchRate(interactions),
    };
    
    return features;
  }
  
  // Incremental learning from new interaction
  private incrementalLearning(interaction: UserInteraction) {
    const recentInteractions = this.interactions.slice(-100); // Last 100 interactions
    const features = this.extractFeatures(recentInteractions);
    
    // Update behavior patterns
    this.updateBehaviorPatterns(interaction, features);
    
    // Update models incrementally
    this.updateModelsIncremental(features);
  }
  
  // Update behavior patterns based on new interaction
  private updateBehaviorPatterns(interaction: UserInteraction, features: Record<string, number>) {
    const patternId = `${interaction.type}-${interaction.context}`;
    let pattern = this.patterns.find(p => p.id === patternId);
    
    if (!pattern) {
      // Create new pattern
      pattern = {
        id: patternId,
        name: `${interaction.type} in ${interaction.context}`,
        confidence: 0.1,
        frequency: 1,
        contexts: [interaction.context],
        temporal: {
          timeOfDay: [new Date(interaction.timestamp).getHours()],
          dayOfWeek: [new Date(interaction.timestamp).getDay()],
        },
        triggers: [],
        outcomes: [],
      };
      this.patterns.push(pattern);
    } else {
      // Update existing pattern
      pattern.frequency += 1;
      pattern.confidence = Math.min(1, pattern.confidence + 0.01);
      
      // Update temporal data
      const hour = new Date(interaction.timestamp).getHours();
      const day = new Date(interaction.timestamp).getDay();
      
      if (!pattern.temporal.timeOfDay.includes(hour)) {
        pattern.temporal.timeOfDay.push(hour);
      }
      if (!pattern.temporal.dayOfWeek.includes(day)) {
        pattern.temporal.dayOfWeek.push(day);
      }
    }
  }
  
  // Generate personalization profile for user
  generatePersonalizationProfile(userId: string): PersonalizationProfile {
    const userInteractions = this.interactions; // In real app, filter by userId
    const features = this.extractFeatures(userInteractions);
    
    // Analyze UI preferences from interaction patterns
    const uiPreferences = this.analyzeUIPreferences(userInteractions, features);
    const interactionStyle = this.analyzeInteractionStyle(userInteractions, features);
    const contentPreferences = this.analyzeContentPreferences(userInteractions, features);
    const temporalPatterns = this.analyzeTemporalPatterns(userInteractions, features);
    const cognitiveProfile = this.analyzeCognitiveProfile(userInteractions, features);
    
    const profile: PersonalizationProfile = {
      userId,
      created: Date.now(),
      lastUpdated: Date.now(),
      confidence: this.calculateOverallConfidence(userInteractions),
      uiPreferences,
      interactionStyle,
      contentPreferences,
      temporalPatterns,
      cognitiveProfile,
    };
    
    this.profiles.set(userId, profile);
    return profile;
  }
  
  // Analyze UI preferences from interaction data
  private analyzeUIPreferences(interactions: UserInteraction[], features: Record<string, number>): PersonalizationProfile['uiPreferences'] {
    return {
      colorScheme: features.hourOfDay > 18 || features.hourOfDay < 6 ? 'dark' : 'light',
      animationSpeed: Math.max(0.1, Math.min(2.0, 1 + (features.rapidInteractions - features.slowInteractions) / 100)),
      density: features.avgInteractionDuration < 1000 ? 'compact' : features.avgInteractionDuration > 3000 ? 'spacious' : 'comfortable',
      complexity: features.uniqueContexts > 10 ? 'advanced' : features.uniqueContexts < 5 ? 'simple' : 'standard',
      fontScale: Math.max(0.8, Math.min(1.5, 1 + (features.avgInteractionDuration - 2000) / 10000)),
    };
  }
  
  // Analyze interaction style preferences
  private analyzeInteractionStyle(interactions: UserInteraction[], features: Record<string, number>) {
    const typeDistribution = {
      mouse: features.clickRatio + features.hoverRatio,
      touch: interactions.filter((i: any) => i.metadata?.touch).length / interactions.length,
      keyboard: interactions.filter((i: any) => i.type === 'type').length / interactions.length,
    };
    
    const primaryInput = Object.entries(typeDistribution)
      .sort(([, a], [, b]) => b - a)[0][0] as 'mouse' | 'touch' | 'keyboard';
    
    return {
      primaryInput,
      preferredGestures: ['tap', 'swipe'], // Would analyze gesture interactions
      clickPressure: 0.5, // Would analyze from pressure data
      hoverDelay: features.avgInteractionDuration > 1000 ? 500 : 200,
      doubleClickSpeed: features.rapidInteractions > features.slowInteractions ? 300 : 500,
      scrollSensitivity: 1.0, // Would analyze scroll patterns
    };
  }
  
  // Analyze content preferences
  private analyzeContentPreferences(interactions: UserInteraction[], features: Record<string, number>): PersonalizationProfile['contentPreferences'] {
    const longInteractions = interactions.filter((i: any) => i.duration > 3000).length;
    const totalInteractions = interactions.length;

    return {
      informationDensity: longInteractions / totalInteractions > 0.3 ? 'detailed' : 'moderate',
      explanationLevel: features.uniqueContexts > 15 ? 'comprehensive' : 'standard',
      examplePreference: features.contextSwitchRate < 0.5, // Less switching suggests preference for examples
      visualPreference: features.hoverRatio > features.clickRatio, // More hovering suggests visual preference
      progressIndicators: features.avgInteractionDuration > 2000, // Longer interactions benefit from progress
    };
  }
  
  // Analyze temporal usage patterns
  private analyzeTemporalPatterns(interactions: UserInteraction[], features: Record<string, number>) {
    const hourDistribution = this.calculateHourDistribution(interactions);
    const peakHour = hourDistribution.indexOf(Math.max(...hourDistribution));
    
    return {
      mostActiveHours: hourDistribution.map((count, hour) => ({ hour, count }))
        .filter(({ count }) => count > hourDistribution.length * 0.1)
        .map(({ hour }) => hour),
      peakPerformanceTime: peakHour,
      preferredSessionDuration: features.avgInteractionDuration * 10, // Estimate
      breakFrequency: Math.max(15, 60 - features.recentInteractionRate * 5), // Minutes
    };
  }
  
  // Analyze cognitive processing patterns
  private analyzeCognitiveProfile(interactions: UserInteraction[], features: Record<string, number>) {
    return {
      processingSpeed: Math.max(0.1, Math.min(2.0, features.rapidInteractions / Math.max(1, features.slowInteractions))),
      workingMemoryCapacity: Math.max(4, Math.min(9, 7 - features.contextSwitchRate * 3)),
      attentionSpan: Math.max(1, features.avgInteractionDuration / 60000), // Minutes
      multitaskingPreference: features.contextSwitchRate > 0.3,
      interruptionTolerance: Math.max(0, Math.min(1, 1 - features.sequentialClicks / 100)),
    };
  }
  
  // Generate personalization recommendations
  generateRecommendations(userId: string): PersonalizationRecommendation[] {
    const profile = this.profiles.get(userId);
    if (!profile) return [];
    
    const recommendations: PersonalizationRecommendation[] = [];
    
    // UI recommendations
    if (profile.uiPreferences.animationSpeed < 0.7) {
      recommendations.push({
        type: 'ui',
        component: 'animations',
        recommendation: 'Reduce animation speed to match user preference for slower interactions',
        confidence: 0.8,
        reasoning: ['User shows preference for slower interactions', 'Animation speed below threshold'],
        expectedImpact: 0.3,
        testable: true,
      });
    }
    
    // Content recommendations
    if (profile.contentPreferences.informationDensity === 'detailed' && profile.cognitiveProfile.attentionSpan > 5) {
      recommendations.push({
        type: 'content',
        component: 'information-display',
        recommendation: 'Show more detailed information by default',
        confidence: 0.9,
        reasoning: ['User prefers detailed information', 'High attention span supports more content'],
        expectedImpact: 0.4,
        testable: true,
      });
    }
    
    // Interaction recommendations
    if (profile.interactionStyle.primaryInput === 'touch' && profile.uiPreferences.density !== 'spacious') {
      recommendations.push({
        type: 'interaction',
        component: 'button-spacing',
        recommendation: 'Increase button spacing for touch interactions',
        confidence: 0.85,
        reasoning: ['Primary input is touch', 'Touch interfaces benefit from more spacing'],
        expectedImpact: 0.35,
        testable: true,
      });
    }
    
    return recommendations.sort((a, b) => b.expectedImpact - a.expectedImpact);
  }
  
  // Predict user behavior for given context
  predictBehavior(context: string, currentTime?: number): { action: string; probability: number }[] {
    const time = currentTime || Date.now();
    const hour = new Date(time).getHours();
    const day = new Date(time).getDay();
    
    const relevantPatterns = this.patterns.filter((pattern: any) =>
      pattern.contexts.includes(context) &&
      pattern.temporal.timeOfDay.includes(hour) &&
      pattern.temporal.dayOfWeek.includes(day)
    );
    
    return relevantPatterns
      .map((pattern: any) => ({
        action: pattern.name,
        probability: pattern.confidence * pattern.frequency / 100,
      }))
      .sort((a, b) => b.probability - a.probability)
      .slice(0, 5);
  }
  
  // Utility methods
  private countSequentialPatterns(interactions: UserInteraction[], type: string): number {
    let count = 0;
    let sequential = 0;
    
    for (let i = 0; i < interactions.length; i++) {
      if (interactions[i].type === type) {
        sequential++;
      } else {
        if (sequential > 1) count++;
        sequential = 0;
      }
    }
    
    return count;
  }
  
  private calculateAveragePosition(interactions: UserInteraction[], axis: 'x' | 'y'): number {
    const withPosition = interactions.filter((i: any) => i.position);
    if (withPosition.length === 0) return 0;
    
    return withPosition.reduce((sum, i) => sum + i.position![axis], 0) / withPosition.length;
  }
  
  private calculatePositionVariance(interactions: UserInteraction[]): number {
    const withPosition = interactions.filter((i: any) => i.position);
    if (withPosition.length === 0) return 0;
    
    const avgX = this.calculateAveragePosition(interactions, 'x');
    const avgY = this.calculateAveragePosition(interactions, 'y');
    
    const variance = withPosition.reduce((sum, i) => {
      const dx = i.position!.x - avgX;
      const dy = i.position!.y - avgY;
      return sum + (dx * dx + dy * dy);
    }, 0) / withPosition.length;
    
    return Math.sqrt(variance);
  }
  
  private calculateContextSwitchRate(interactions: UserInteraction[]): number {
    if (interactions.length < 2) return 0;
    
    let switches = 0;
    for (let i = 1; i < interactions.length; i++) {
      if (interactions[i].context !== interactions[i - 1].context) {
        switches++;
      }
    }
    
    return switches / (interactions.length - 1);
  }
  
  private calculateHourDistribution(interactions: UserInteraction[]): number[] {
    const distribution = new Array(24).fill(0);
    
    interactions.forEach((interaction: any) => {
      const hour = new Date(interaction.timestamp).getHours();
      distribution[hour]++;
    });
    
    return distribution;
  }
  
  private calculateOverallConfidence(interactions: UserInteraction[]): number {
    if (interactions.length < 10) return 0.1;
    if (interactions.length < 50) return 0.3;
    if (interactions.length < 200) return 0.6;
    if (interactions.length < 500) return 0.8;
    return 0.9;
  }
  
  private updateModelsIncremental(features: Record<string, number>) {
    // Simplified incremental learning - in production would use proper ML algorithms
    Object.entries(features).forEach(([feature, value]) => {
      let model = this.models.get(feature);
      if (!model) {
        model = {
          type: 'linear',
          features: [feature],
          weights: [1],
          bias: 0,
          accuracy: 0.5,
          lastTrained: Date.now(),
        };
        this.models.set(feature, model);
      }
      
      // Simple weight update (would use gradient descent in production)
      model.weights[0] = model.weights[0] * 0.99 + value * 0.01;
      model.lastTrained = Date.now();
    });
  }
}

// Global AI personalization engine
const aiPersonalizationEngine = new AIPersonalizationEngine();

// React hooks for AI personalization
export const useAIPersonalization = (userId: string) => {
  const [profile, setProfile] = useState<PersonalizationProfile | null>(null);
  const [recommendations, setRecommendations] = useState<PersonalizationRecommendation[]>([]);
  const [isLearning, setIsLearning] = useState(false);
  
  const recordInteraction = useCallback((interaction: Omit<UserInteraction, 'id' | 'timestamp'>) => {
    const fullInteraction: UserInteraction = {
      ...interaction,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    };
    
    aiPersonalizationEngine.addInteraction(fullInteraction);
  }, []);
  
  const updateProfile = useCallback(() => {
    setIsLearning(true);
    const newProfile = aiPersonalizationEngine.generatePersonalizationProfile(userId);
    setProfile(newProfile);
    
    const newRecommendations = aiPersonalizationEngine.generateRecommendations(userId);
    setRecommendations(newRecommendations);
    setIsLearning(false);
  }, [userId]);
  
  const predictBehavior = useCallback((context: string) => {
    return aiPersonalizationEngine.predictBehavior(context);
  }, []);
  
  // Auto-update profile periodically
  useEffect(() => {
    const interval = setInterval(updateProfile, 30000); // Every 30 seconds
    updateProfile(); // Initial update
    
    return () => clearInterval(interval);
  }, [updateProfile]);
  
  return {
    profile,
    recommendations,
    isLearning,
    recordInteraction,
    updateProfile,
    predictBehavior,
  };
};

// Hook for automatic interaction recording
export const useInteractionRecording = (componentId: string, userId: string) => {
  const { recordInteraction } = useAIPersonalization(userId);
  const startTime = useRef<number>(0);
  
  const startInteraction = useCallback((type: UserInteraction['type'], context?: string) => {
    startTime.current = Date.now();
    return {
      type,
      target: componentId,
      context: context || window.location.pathname,
    };
  }, [componentId]);
  
  const endInteraction = useCallback((interactionStart: any, position?: { x: number; y: number }) => {
    const duration = Date.now() - startTime.current;
    recordInteraction({
      ...interactionStart,
      duration,
      position,
    });
  }, [recordInteraction]);
  
  return {
    startInteraction,
    endInteraction,
  };
};

export default aiPersonalizationEngine;