/**
 * Emotional Intelligence Engine for Consciousness Interface
 * Advanced emotion recognition and UI adaptation system
 */

import { useCallback, useRef, useState, useEffect, useMemo } from 'react';

// Emotional state definitions
export interface EmotionalState {
  primary: EmotionType;
  secondary?: EmotionType;
  intensity: number; // 0-1 scale
  valence: number; // -1 (negative) to 1 (positive)
  arousal: number; // 0 (calm) to 1 (excited)
  confidence: number; // 0-1 confidence in detection
  timestamp: number;
  context?: string;
}

export type EmotionType = 
  | 'joy' | 'sadness' | 'anger' | 'fear' | 'surprise' | 'disgust'
  | 'calm' | 'excited' | 'focused' | 'stressed' | 'confused' | 'satisfied'
  | 'frustrated' | 'content' | 'anxious' | 'determined' | 'bored' | 'engaged';

// Biometric indicators for emotion detection
export interface BiometricIndicators {
  heartRateVariability: number; // HRV in ms
  skinConductance: number; // GSR values
  breathingRate: number; // Breaths per minute
  mouseVelocity: number; // Pixel velocity
  clickPressure: number; // Force of clicks (0-1)
  dwellTime: number; // Time spent on elements
  scrollPattern: 'smooth' | 'erratic' | 'hesitant' | 'rapid';
  typingRhythm: number; // Consistency in typing (0-1)
}

// Behavioral pattern indicators
export interface BehaviorPatterns {
  interactionFrequency: number; // Clicks/actions per minute
  navigationPattern: 'linear' | 'exploratory' | 'goal-directed' | 'lost' | 'hesitant';
  errorRate: number; // Mistakes or corrections
  decisionTime: number; // Average time to make choices
  multitaskingLevel: number; // Multiple tabs/apps usage
  attentionSpan: number; // Focus duration in seconds
  taskCompletion: number; // Completion rate (0-1)
  helpSeekingBehavior: boolean;
  scrollPattern?: 'smooth' | 'erratic' | 'hesitant' | 'rapid';
}

// UI adaptation configurations
export interface EmotionalUIAdaptation {
  colors: {
    primary: string;
    accent: string;
    background: string;
    text: string;
  };
  animations: {
    speed: number; // 0.1-2.0 multiplier
    intensity: number; // 0.1-2.0 multiplier
    type: 'calm' | 'energetic' | 'minimal' | 'playful';
  };
  layout: {
    complexity: 'simple' | 'moderate' | 'complex';
    spacing: 'tight' | 'normal' | 'loose';
    hierarchy: 'flat' | 'structured' | 'layered';
  };
  feedback: {
    haptic: boolean;
    audio: boolean;
    visual: boolean;
    intensity: number; // 0-1
  };
  assistance: {
    proactiveHelp: boolean;
    tooltips: boolean;
    guidance: 'minimal' | 'moderate' | 'extensive';
  };
}

// Emotional recognition patterns
const EMOTION_PATTERNS: Record<EmotionType, {
  biometric: Partial<BiometricIndicators>;
  behavioral: Partial<BehaviorPatterns>;
  thresholds: { min: number; max: number };
}> = {
  joy: {
    biometric: { heartRateVariability: 50, mouseVelocity: 800, clickPressure: 0.6 },
    behavioral: { interactionFrequency: 15, taskCompletion: 0.8, errorRate: 0.1 },
    thresholds: { min: 0.6, max: 1.0 },
  },
  sadness: {
    biometric: { heartRateVariability: 30, mouseVelocity: 200, dwellTime: 5000 },
    behavioral: { interactionFrequency: 5, decisionTime: 3000, attentionSpan: 10 },
    thresholds: { min: 0.4, max: 0.8 },
  },
  anger: {
    biometric: { heartRateVariability: 80, skinConductance: 0.8, clickPressure: 0.9 },
    behavioral: { interactionFrequency: 20, errorRate: 0.3, scrollPattern: 'erratic' },
    thresholds: { min: 0.7, max: 1.0 },
  },
  fear: {
    biometric: { heartRateVariability: 90, skinConductance: 0.9, breathingRate: 20 },
    behavioral: { navigationPattern: 'hesitant', helpSeekingBehavior: true, errorRate: 0.4 },
    thresholds: { min: 0.6, max: 0.9 },
  },
  surprise: {
    biometric: { heartRateVariability: 70, mouseVelocity: 600 },
    behavioral: { decisionTime: 2000, navigationPattern: 'exploratory' },
    thresholds: { min: 0.5, max: 0.8 },
  },
  disgust: {
    biometric: { mouseVelocity: 100, dwellTime: 1000 },
    behavioral: { interactionFrequency: 3, taskCompletion: 0.2, errorRate: 0.2 },
    thresholds: { min: 0.5, max: 0.9 },
  },
  calm: {
    biometric: { heartRateVariability: 40, breathingRate: 12, mouseVelocity: 300 },
    behavioral: { interactionFrequency: 8, scrollPattern: 'smooth', attentionSpan: 30 },
    thresholds: { min: 0.3, max: 0.7 },
  },
  excited: {
    biometric: { heartRateVariability: 70, mouseVelocity: 1000, clickPressure: 0.8 },
    behavioral: { interactionFrequency: 18, multitaskingLevel: 0.8, scrollPattern: 'rapid' },
    thresholds: { min: 0.7, max: 1.0 },
  },
  focused: {
    biometric: { heartRateVariability: 45, mouseVelocity: 400, typingRhythm: 0.8 },
    behavioral: { attentionSpan: 60, taskCompletion: 0.9, navigationPattern: 'goal-directed' },
    thresholds: { min: 0.6, max: 0.9 },
  },
  stressed: {
    biometric: { heartRateVariability: 90, skinConductance: 0.8, breathingRate: 18 },
    behavioral: { errorRate: 0.4, decisionTime: 4000, multitaskingLevel: 0.9 },
    thresholds: { min: 0.7, max: 1.0 },
  },
  confused: {
    biometric: { dwellTime: 8000, mouseVelocity: 150 },
    behavioral: { navigationPattern: 'lost', helpSeekingBehavior: true, decisionTime: 5000 },
    thresholds: { min: 0.5, max: 0.8 },
  },
  satisfied: {
    biometric: { heartRateVariability: 35, mouseVelocity: 250 },
    behavioral: { taskCompletion: 0.95, interactionFrequency: 6, errorRate: 0.05 },
    thresholds: { min: 0.4, max: 0.8 },
  },
  frustrated: {
    biometric: { heartRateVariability: 85, clickPressure: 0.95, skinConductance: 0.7 },
    behavioral: { errorRate: 0.5, interactionFrequency: 25, scrollPattern: 'erratic' },
    thresholds: { min: 0.6, max: 1.0 },
  },
  content: {
    biometric: { heartRateVariability: 30, breathingRate: 10, mouseVelocity: 200 },
    behavioral: { attentionSpan: 45, taskCompletion: 0.8, interactionFrequency: 7 },
    thresholds: { min: 0.3, max: 0.7 },
  },
  anxious: {
    biometric: { heartRateVariability: 95, skinConductance: 0.85, breathingRate: 22 },
    behavioral: { helpSeekingBehavior: true, decisionTime: 6000, errorRate: 0.3 },
    thresholds: { min: 0.6, max: 0.95 },
  },
  determined: {
    biometric: { heartRateVariability: 60, mouseVelocity: 500, typingRhythm: 0.9 },
    behavioral: { taskCompletion: 0.95, attentionSpan: 90, navigationPattern: 'goal-directed' },
    thresholds: { min: 0.7, max: 1.0 },
  },
  bored: {
    biometric: { heartRateVariability: 25, mouseVelocity: 100, dwellTime: 10000 },
    behavioral: { interactionFrequency: 2, multitaskingLevel: 0.3, attentionSpan: 5 },
    thresholds: { min: 0.2, max: 0.6 },
  },
  engaged: {
    biometric: { heartRateVariability: 55, mouseVelocity: 600, typingRhythm: 0.85 },
    behavioral: { attentionSpan: 120, taskCompletion: 0.9, interactionFrequency: 12 },
    thresholds: { min: 0.7, max: 0.95 },
  },
};

// UI adaptation presets for different emotions
const UI_ADAPTATIONS: Record<EmotionType, EmotionalUIAdaptation> = {
  joy: {
    colors: { primary: '#FFD700', accent: '#FF6B6B', background: '#FFFAF0', text: '#2C3E50' },
    animations: { speed: 1.3, intensity: 1.5, type: 'playful' },
    layout: { complexity: 'moderate', spacing: 'normal', hierarchy: 'layered' },
    feedback: { haptic: true, audio: true, visual: true, intensity: 0.8 },
    assistance: { proactiveHelp: false, tooltips: true, guidance: 'minimal' },
  },
  sadness: {
    colors: { primary: '#6B9BD1', accent: '#B0C4DE', background: '#F8F8FF', text: '#4F4F4F' },
    animations: { speed: 0.7, intensity: 0.5, type: 'calm' },
    layout: { complexity: 'simple', spacing: 'loose', hierarchy: 'flat' },
    feedback: { haptic: false, audio: false, visual: true, intensity: 0.3 },
    assistance: { proactiveHelp: true, tooltips: true, guidance: 'extensive' },
  },
  anger: {
    colors: { primary: '#DC143C', accent: '#FF4500', background: '#FFF5EE', text: '#8B0000' },
    animations: { speed: 0.8, intensity: 0.3, type: 'minimal' },
    layout: { complexity: 'simple', spacing: 'loose', hierarchy: 'flat' },
    feedback: { haptic: false, audio: false, visual: false, intensity: 0.2 },
    assistance: { proactiveHelp: false, tooltips: false, guidance: 'minimal' },
  },
  fear: {
    colors: { primary: '#9370DB', accent: '#DDA0DD', background: '#F0F8FF', text: '#483D8B' },
    animations: { speed: 0.6, intensity: 0.4, type: 'calm' },
    layout: { complexity: 'simple', spacing: 'loose', hierarchy: 'structured' },
    feedback: { haptic: false, audio: false, visual: true, intensity: 0.5 },
    assistance: { proactiveHelp: true, tooltips: true, guidance: 'extensive' },
  },
  surprise: {
    colors: { primary: '#FFB347', accent: '#FFA500', background: '#FFFACD', text: '#8B4513' },
    animations: { speed: 1.2, intensity: 1.2, type: 'energetic' },
    layout: { complexity: 'moderate', spacing: 'normal', hierarchy: 'layered' },
    feedback: { haptic: true, audio: true, visual: true, intensity: 0.7 },
    assistance: { proactiveHelp: false, tooltips: true, guidance: 'moderate' },
  },
  disgust: {
    colors: { primary: '#8FBC8F', accent: '#98FB98', background: '#F5FFFA', text: '#2E8B57' },
    animations: { speed: 0.5, intensity: 0.2, type: 'minimal' },
    layout: { complexity: 'simple', spacing: 'tight', hierarchy: 'flat' },
    feedback: { haptic: false, audio: false, visual: false, intensity: 0.1 },
    assistance: { proactiveHelp: false, tooltips: false, guidance: 'minimal' },
  },
  calm: {
    colors: { primary: '#87CEEB', accent: '#B0E0E6', background: '#F0F8FF', text: '#4682B4' },
    animations: { speed: 0.8, intensity: 0.6, type: 'calm' },
    layout: { complexity: 'moderate', spacing: 'normal', hierarchy: 'structured' },
    feedback: { haptic: false, audio: true, visual: true, intensity: 0.4 },
    assistance: { proactiveHelp: false, tooltips: true, guidance: 'moderate' },
  },
  excited: {
    colors: { primary: '#FF69B4', accent: '#FFB6C1', background: '#FFF0F5', text: '#C71585' },
    animations: { speed: 1.5, intensity: 1.8, type: 'energetic' },
    layout: { complexity: 'complex', spacing: 'tight', hierarchy: 'layered' },
    feedback: { haptic: true, audio: true, visual: true, intensity: 0.9 },
    assistance: { proactiveHelp: false, tooltips: false, guidance: 'minimal' },
  },
  focused: {
    colors: { primary: '#4169E1', accent: '#6495ED', background: '#F8F8FF', text: '#191970' },
    animations: { speed: 1.0, intensity: 0.8, type: 'calm' },
    layout: { complexity: 'moderate', spacing: 'normal', hierarchy: 'structured' },
    feedback: { haptic: false, audio: false, visual: true, intensity: 0.5 },
    assistance: { proactiveHelp: false, tooltips: false, guidance: 'minimal' },
  },
  stressed: {
    colors: { primary: '#CD853F', accent: '#DEB887', background: '#FFF8DC', text: '#8B4513' },
    animations: { speed: 0.6, intensity: 0.3, type: 'calm' },
    layout: { complexity: 'simple', spacing: 'loose', hierarchy: 'flat' },
    feedback: { haptic: false, audio: false, visual: false, intensity: 0.2 },
    assistance: { proactiveHelp: true, tooltips: true, guidance: 'extensive' },
  },
  confused: {
    colors: { primary: '#D3D3D3', accent: '#DCDCDC', background: '#F5F5F5', text: '#696969' },
    animations: { speed: 0.7, intensity: 0.4, type: 'calm' },
    layout: { complexity: 'simple', spacing: 'loose', hierarchy: 'flat' },
    feedback: { haptic: false, audio: true, visual: true, intensity: 0.6 },
    assistance: { proactiveHelp: true, tooltips: true, guidance: 'extensive' },
  },
  satisfied: {
    colors: { primary: '#32CD32', accent: '#90EE90', background: '#F0FFF0', text: '#006400' },
    animations: { speed: 1.0, intensity: 0.8, type: 'calm' },
    layout: { complexity: 'moderate', spacing: 'normal', hierarchy: 'structured' },
    feedback: { haptic: true, audio: true, visual: true, intensity: 0.6 },
    assistance: { proactiveHelp: false, tooltips: false, guidance: 'minimal' },
  },
  frustrated: {
    colors: { primary: '#FF6347', accent: '#FFB347', background: '#FFF5EE', text: '#B22222' },
    animations: { speed: 0.5, intensity: 0.2, type: 'minimal' },
    layout: { complexity: 'simple', spacing: 'loose', hierarchy: 'flat' },
    feedback: { haptic: false, audio: false, visual: false, intensity: 0.1 },
    assistance: { proactiveHelp: true, tooltips: true, guidance: 'extensive' },
  },
  content: {
    colors: { primary: '#20B2AA', accent: '#48D1CC', background: '#F0FFFF', text: '#008B8B' },
    animations: { speed: 0.9, intensity: 0.7, type: 'calm' },
    layout: { complexity: 'moderate', spacing: 'normal', hierarchy: 'structured' },
    feedback: { haptic: false, audio: true, visual: true, intensity: 0.5 },
    assistance: { proactiveHelp: false, tooltips: true, guidance: 'moderate' },
  },
  anxious: {
    colors: { primary: '#DDA0DD', accent: '#E6E6FA', background: '#F8F8FF', text: '#8B008B' },
    animations: { speed: 0.6, intensity: 0.3, type: 'calm' },
    layout: { complexity: 'simple', spacing: 'loose', hierarchy: 'flat' },
    feedback: { haptic: false, audio: false, visual: true, intensity: 0.3 },
    assistance: { proactiveHelp: true, tooltips: true, guidance: 'extensive' },
  },
  determined: {
    colors: { primary: '#B22222', accent: '#CD5C5C', background: '#FFF0F0', text: '#8B0000' },
    animations: { speed: 1.1, intensity: 1.0, type: 'energetic' },
    layout: { complexity: 'complex', spacing: 'normal', hierarchy: 'structured' },
    feedback: { haptic: true, audio: false, visual: true, intensity: 0.7 },
    assistance: { proactiveHelp: false, tooltips: false, guidance: 'minimal' },
  },
  bored: {
    colors: { primary: '#A9A9A9', accent: '#C0C0C0', background: '#F8F8FF', text: '#2F2F2F' },
    animations: { speed: 1.2, intensity: 1.3, type: 'playful' },
    layout: { complexity: 'complex', spacing: 'normal', hierarchy: 'layered' },
    feedback: { haptic: true, audio: true, visual: true, intensity: 0.8 },
    assistance: { proactiveHelp: true, tooltips: true, guidance: 'moderate' },
  },
  engaged: {
    colors: { primary: '#1E90FF', accent: '#87CEFA', background: '#F0F8FF', text: '#00008B' },
    animations: { speed: 1.0, intensity: 1.0, type: 'energetic' },
    layout: { complexity: 'complex', spacing: 'normal', hierarchy: 'structured' },
    feedback: { haptic: false, audio: false, visual: true, intensity: 0.6 },
    assistance: { proactiveHelp: false, tooltips: false, guidance: 'minimal' },
  },
};

// Emotional intelligence engine class
class EmotionalIntelligenceEngine {
  private biometricBuffer: BiometricIndicators[] = [];
  private behaviorBuffer: BehaviorPatterns[] = [];
  private emotionHistory: EmotionalState[] = [];
  private currentEmotion: EmotionalState | null = null;
  private adaptationCache = new Map<string, EmotionalUIAdaptation>();
  
  // Add biometric data point
  addBiometricData(indicators: Partial<BiometricIndicators>) {
    const fullIndicators: BiometricIndicators = {
      heartRateVariability: 50,
      skinConductance: 0.5,
      breathingRate: 15,
      mouseVelocity: 400,
      clickPressure: 0.5,
      dwellTime: 2000,
      scrollPattern: 'smooth',
      typingRhythm: 0.7,
      ...indicators,
    };
    
    this.biometricBuffer.push(fullIndicators);
    
    // Keep buffer size manageable
    if (this.biometricBuffer.length > 100) {
      this.biometricBuffer.shift();
    }
  }
  
  // Add behavioral data point
  addBehaviorData(patterns: Partial<BehaviorPatterns>) {
    const fullPatterns: BehaviorPatterns = {
      interactionFrequency: 10,
      navigationPattern: 'linear',
      errorRate: 0.1,
      decisionTime: 2000,
      multitaskingLevel: 0.5,
      attentionSpan: 30,
      taskCompletion: 0.7,
      helpSeekingBehavior: false,
      ...patterns,
    };
    
    this.behaviorBuffer.push(fullPatterns);
    
    // Keep buffer size manageable
    if (this.behaviorBuffer.length > 50) {
      this.behaviorBuffer.shift();
    }
  }
  
  // Analyze current emotional state
  analyzeEmotion(): EmotionalState | null {
    if (this.biometricBuffer.length < 5 || this.behaviorBuffer.length < 3) {
      return null; // Need more data for reliable analysis
    }
    
    const recentBiometrics = this.biometricBuffer.slice(-10);
    const recentBehaviors = this.behaviorBuffer.slice(-5);
    
    // Calculate averages
    const avgBiometrics = this.calculateBiometricAverages(recentBiometrics);
    const avgBehaviors = this.calculateBehaviorAverages(recentBehaviors);
    
    // Score each emotion
    const emotionScores: Record<EmotionType, number> = {} as any;
    
    Object.entries(EMOTION_PATTERNS).forEach(([emotion, pattern]) => {
      const emotionType = emotion as EmotionType;
      let score = 0;
      let factors = 0;
      
      // Score biometric match
      Object.entries(pattern.biometric).forEach(([key, expectedValue]) => {
        const actualValue = avgBiometrics[key as keyof BiometricIndicators];
        if (actualValue !== undefined && expectedValue !== undefined) {
          const similarity = this.calculateSimilarity(actualValue, expectedValue as any, key);
          score += similarity;
          factors++;
        }
      });
      
      // Score behavioral match
      Object.entries(pattern.behavioral).forEach(([key, expectedValue]) => {
        const actualValue = avgBehaviors[key as keyof BehaviorPatterns];
        if (actualValue !== undefined && expectedValue !== undefined) {
          const similarity = this.calculateSimilarity(actualValue, expectedValue as any, key);
          score += similarity;
          factors++;
        }
      });
      
      emotionScores[emotionType] = factors > 0 ? score / factors : 0;
    });
    
    // Find the highest scoring emotion
    const sortedEmotions = Object.entries(emotionScores)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 2);
    
    const [primaryEmotion, primaryScore] = sortedEmotions[0];
    const [secondaryEmotion, secondaryScore] = sortedEmotions[1] || [null, 0];
    
    // Calculate confidence based on score separation
    const confidence = primaryScore - (secondaryScore || 0);
    
    if (primaryScore < 0.3) {
      return null; // Score too low for reliable detection
    }
    
    const emotionalState: EmotionalState = {
      primary: primaryEmotion as EmotionType,
      secondary: secondaryScore > 0.2 ? (secondaryEmotion as EmotionType) : undefined,
      intensity: primaryScore,
      valence: this.calculateValence(primaryEmotion as EmotionType),
      arousal: this.calculateArousal(primaryEmotion as EmotionType),
      confidence: Math.min(confidence, 1),
      timestamp: Date.now(),
    };
    
    this.currentEmotion = emotionalState;
    this.emotionHistory.push(emotionalState);
    
    // Keep history manageable
    if (this.emotionHistory.length > 100) {
      this.emotionHistory.shift();
    }
    
    return emotionalState;
  }
  
  // Get UI adaptation for current emotion
  getUIAdaptation(emotion?: EmotionType): EmotionalUIAdaptation {
    const targetEmotion = emotion || this.currentEmotion?.primary || 'calm';
    const cacheKey = `${targetEmotion}-${this.currentEmotion?.intensity || 1}`;
    
    if (this.adaptationCache.has(cacheKey)) {
      return this.adaptationCache.get(cacheKey)!;
    }
    
    const baseAdaptation = UI_ADAPTATIONS[targetEmotion];
    const intensity = this.currentEmotion?.intensity || 1;
    
    // Scale adaptation based on emotion intensity
    const scaledAdaptation: EmotionalUIAdaptation = {
      colors: baseAdaptation.colors,
      animations: {
        ...baseAdaptation.animations,
        speed: baseAdaptation.animations.speed * intensity,
        intensity: baseAdaptation.animations.intensity * intensity,
      },
      layout: baseAdaptation.layout,
      feedback: {
        ...baseAdaptation.feedback,
        intensity: baseAdaptation.feedback.intensity * intensity,
      },
      assistance: baseAdaptation.assistance,
    };
    
    this.adaptationCache.set(cacheKey, scaledAdaptation);
    return scaledAdaptation;
  }
  
  // Calculate similarity between actual and expected values
  private calculateSimilarity(actual: any, expected: any, key: string): number {
    if (typeof actual === 'string' && typeof expected === 'string') {
      return actual === expected ? 1 : 0;
    }
    
    if (typeof actual === 'boolean' && typeof expected === 'boolean') {
      return actual === expected ? 1 : 0;
    }
    
    if (typeof actual === 'number' && typeof expected === 'number') {
      // Normalize based on key type
      const maxValue = this.getMaxValueForKey(key);
      const normalizedActual = actual / maxValue;
      const normalizedExpected = expected / maxValue;
      const difference = Math.abs(normalizedActual - normalizedExpected);
      return Math.max(0, 1 - difference);
    }
    
    return 0;
  }
  
  private getMaxValueForKey(key: string): number {
    const maxValues: Record<string, number> = {
      heartRateVariability: 100,
      skinConductance: 1,
      breathingRate: 30,
      mouseVelocity: 2000,
      clickPressure: 1,
      dwellTime: 20000,
      typingRhythm: 1,
      interactionFrequency: 50,
      errorRate: 1,
      decisionTime: 10000,
      multitaskingLevel: 1,
      attentionSpan: 300,
      taskCompletion: 1,
    };
    
    return maxValues[key] || 1;
  }
  
  private calculateBiometricAverages(data: BiometricIndicators[]): Partial<BiometricIndicators> {
    if (data.length === 0) return {};
    
    const sums: Partial<BiometricIndicators> = {};
    const keys = Object.keys(data[0]) as (keyof BiometricIndicators)[];

    keys.forEach((key: any) => {
      if (typeof (data[0] as any)[key] === 'number') {
        (sums as any)[key] = data.reduce((sum, item) => sum + ((item as any)[key] as number), 0) / data.length as any;
      }
    });

    return sums;
  }
  
  private calculateBehaviorAverages(data: BehaviorPatterns[]): Partial<BehaviorPatterns> {
    if (data.length === 0) return {};
    
    const sums: Partial<BehaviorPatterns> = {};
    const keys = Object.keys(data[0]) as (keyof BehaviorPatterns)[];

    keys.forEach((key: any) => {
      if (typeof (data[0] as any)[key] === 'number') {
        (sums as any)[key] = data.reduce((sum, item) => sum + ((item as any)[key] as number), 0) / data.length as any;
      } else if (typeof (data[0] as any)[key] === 'boolean') {
        const trueCount = data.filter((item: any) => (item as any)[key]).length;
        (sums as any)[key] = trueCount > data.length / 2 as any;
      }
    });
    
    return sums;
  }
  
  private calculateValence(emotion: EmotionType): number {
    const valenceMap: Record<EmotionType, number> = {
      joy: 0.9, sadness: -0.8, anger: -0.6, fear: -0.7, surprise: 0.3, disgust: -0.5,
      calm: 0.2, excited: 0.7, focused: 0.1, stressed: -0.6, confused: -0.3, satisfied: 0.8,
      frustrated: -0.7, content: 0.6, anxious: -0.5, determined: 0.4, bored: -0.2, engaged: 0.7,
    };
    return valenceMap[emotion] || 0;
  }
  
  private calculateArousal(emotion: EmotionType): number {
    const arousalMap: Record<EmotionType, number> = {
      joy: 0.8, sadness: 0.2, anger: 0.9, fear: 0.9, surprise: 0.8, disgust: 0.6,
      calm: 0.1, excited: 0.9, focused: 0.5, stressed: 0.8, confused: 0.4, satisfied: 0.3,
      frustrated: 0.8, content: 0.2, anxious: 0.7, determined: 0.6, bored: 0.1, engaged: 0.7,
    };
    return arousalMap[emotion] || 0.5;
  }
  
  // Get emotion trend over time
  getEmotionTrend(timeWindow = 300000): EmotionalState[] { // 5 minutes default
    const cutoff = Date.now() - timeWindow;
    return this.emotionHistory.filter((state: any) => state.timestamp >= cutoff);
  }
  
  // Check if emotion has stabilized
  isEmotionStable(threshold = 0.1, timeWindow = 60000): boolean { // 1 minute default
    const recentEmotions = this.getEmotionTrend(timeWindow);
    if (recentEmotions.length < 3) return false;
    
    const intensityVariation = this.calculateVariation(
      recentEmotions.map((e: any) => e.intensity)
    );
    
    return intensityVariation < threshold;
  }
  
  private calculateVariation(values: number[]): number {
    if (values.length === 0) return 0;
    const mean = values.reduce((a, b) => a + b) / values.length;
    const variance = values.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / values.length;
    return Math.sqrt(variance);
  }
}

// Global emotional intelligence engine instance
const emotionalEngine = new EmotionalIntelligenceEngine();

// React hooks for emotional intelligence
export const useEmotionalIntelligence = () => {
  const [currentEmotion, setCurrentEmotion] = useState<EmotionalState | null>(null);
  const [uiAdaptation, setUiAdaptation] = useState<EmotionalUIAdaptation>(UI_ADAPTATIONS.calm);
  
  const addBiometricData = useCallback((data: Partial<BiometricIndicators>) => {
    emotionalEngine.addBiometricData(data);
  }, []);
  
  const addBehaviorData = useCallback((data: Partial<BehaviorPatterns>) => {
    emotionalEngine.addBehaviorData(data);
  }, []);
  
  const analyzeEmotion = useCallback(() => {
    const emotion = emotionalEngine.analyzeEmotion();
    if (emotion) {
      setCurrentEmotion(emotion);
      setUiAdaptation(emotionalEngine.getUIAdaptation(emotion.primary));
    }
    return emotion;
  }, []);
  
  const getEmotionTrend = useCallback((timeWindow?: number) => {
    return emotionalEngine.getEmotionTrend(timeWindow);
  }, []);
  
  const isStable = useCallback((threshold?: number, timeWindow?: number) => {
    return emotionalEngine.isEmotionStable(threshold, timeWindow);
  }, []);
  
  return {
    currentEmotion,
    uiAdaptation,
    addBiometricData,
    addBehaviorData,
    analyzeEmotion,
    getEmotionTrend,
    isStable,
  };
};

export default emotionalEngine;