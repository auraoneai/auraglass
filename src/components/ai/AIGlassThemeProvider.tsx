"use client";
import React from "react";
import { cn } from "../../lib/utilsComprehensive";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

// Types for AI theme system
interface GlassTheme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
  };
  glass: {
    blur: number;
    opacity: number;
    borderRadius: string;
  };
  animations: {
    duration: number;
    easing: string;
  };
  metadata: {
    sentiment: string;
    context: string;
    created: Date;
  };
}

interface ContentSentiment {
  sentiment: string;
  intensity: number;
  confidence: number;
  keywords: string[];
  emotions: Record<string, number>;
}

interface ContentContext {
  type: string;
  category: string;
  urgency: string;
  readability: number;
  complexity: string;
  length: string;
  timeOfDay: string;
  season: string;
}

interface UserBehavior {
  preferredIntensity: number;
  preferredContrast: number;
  readingTime: number;
  deviceType: string;
  accessibilityNeeds: {
    highContrast: boolean;
    reducedMotion: boolean;
    largerText: boolean;
  };
  engagementLevel: number;
  returnRate: number;
}

interface AIThemeConfig {
  adaptToSentiment: boolean;
  adaptToContext: boolean;
  adaptToTime: boolean;
  adaptToSeason: boolean;
  adaptToBehavior: boolean;
  enableABTesting: boolean;
  accessibilityFirst: boolean;
  performanceMode: boolean;
}

interface ThemeWeights {
  sentiment: number;
  context: number;
  time: number;
  season: number;
  behavior: number;
}

// AI Theme Provider context interface
interface AIGlassThemeContextType {
  // Current AI state
  currentTheme: GlassTheme | null;
  isGenerating: boolean;
  generationError: string | null;

  // AI Configuration
  aiConfig: AIThemeConfig;
  updateAIConfig: (config: Partial<AIThemeConfig>) => void;

  // Theme generation
  generateTheme: (
    content: string,
    context?: Partial<ContentContext>
  ) => Promise<GlassTheme>;
  generateThemeFromSentiment: (
    sentiment: ContentSentiment,
    context?: Partial<ContentContext>
  ) => Promise<GlassTheme>;

  // Theme management
  themeHistory: GlassTheme[];
  favoriteThemes: GlassTheme[];
  addToFavorites: (theme: GlassTheme) => void;
  removeFromFavorites: (themeId: string) => void;

  // User behavior tracking
  userBehavior: UserBehavior;
  updateUserBehavior: (behavior: Partial<UserBehavior>) => void;
  trackInteraction: (
    themeId: string,
    engagement: number,
    satisfaction: number
  ) => void;

  // Performance and accessibility
  performanceMode: boolean;
  setPerformanceMode: (enabled: boolean) => void;
  accessibilityMode: boolean;
  setAccessibilityMode: (enabled: boolean) => void;

  // Cache and persistence
  clearCache: () => void;
  exportAIData: () => string;
  importAIData: (data: string) => boolean;
}

// Default user behavior
const DEFAULT_USER_BEHAVIOR: UserBehavior = {
  preferredIntensity: 0.6,
  preferredContrast: 0.5,
  readingTime: 5,
  deviceType: "desktop",
  accessibilityNeeds: {
    highContrast: false,
    reducedMotion: false,
    largerText: false,
  },
  engagementLevel: 0.5,
  returnRate: 0.5,
};

// Create context
const AIGlassThemeContext = createContext<AIGlassThemeContextType | undefined>(
  undefined
);

interface AIGlassThemeProviderProps {
  children: ReactNode;
  initialConfig?: Partial<AIThemeConfig>;
  storageKey?: string;
  enableAnalytics?: boolean;
  className?: string;
  "data-testid"?: string;
}

export function AIGlassThemeProvider({
  children,
  initialConfig = {},
  storageKey = "ai-glass-theme-data",
  enableAnalytics = true,
  className,
  "data-testid": dataTestId,
}: AIGlassThemeProviderProps) {
  // Core state
  const [currentTheme, setCurrentTheme] = useState<GlassTheme | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  // Configuration state
  const [aiConfig, setAIConfig] = useState<AIThemeConfig>({
    adaptToSentiment: true,
    adaptToContext: true,
    adaptToTime: true,
    adaptToSeason: true,
    adaptToBehavior: true,
    enableABTesting: false,
    accessibilityFirst: true,
    performanceMode: false,
    ...initialConfig,
  });

  // User behavior state
  const [userBehavior, setUserBehavior] = useState<UserBehavior>(
    DEFAULT_USER_BEHAVIOR
  );

  // Theme management state
  const [themeHistory, setThemeHistory] = useState<GlassTheme[]>([]);
  const [favoriteThemes, setFavoriteThemes] = useState<GlassTheme[]>([]);

  // Performance state
  const [performanceMode, setPerformanceMode] = useState(false);
  const [accessibilityMode, setAccessibilityMode] = useState(false);

  // Refs for performance tracking
  const generationStartTime = useRef<number>(0);
  const sentimentUsage = useRef<Map<string, number>>(new Map());
  const engagementHistory = useRef<
    Array<{ timestamp: Date; engagement: number }>
  >([]);

  // Initialize on mount
  useEffect(() => {
    const initializeAI = async () => {
      try {
        // Load persisted data
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          const data = JSON.parse(saved);

          if (data.userBehavior) {
            setUserBehavior({ ...DEFAULT_USER_BEHAVIOR, ...data.userBehavior });
          }

          if (data.themeHistory) {
            setThemeHistory(data.themeHistory);
          }

          if (data.favoriteThemes) {
            setFavoriteThemes(data.favoriteThemes);
          }

          if (data.aiConfig) {
            setAIConfig({ ...aiConfig, ...data.aiConfig });
          }
        }

        console.log("AI Glass Theme Provider initialized");
      } catch (error) {
        console.error("Failed to initialize AI Glass Theme Provider:", error);
        setGenerationError("Failed to initialize AI theme system");
      }
    };

    initializeAI();
  }, []);

  // Persist data when state changes
  useEffect(() => {
    const dataToSave = {
      userBehavior,
      themeHistory: themeHistory.slice(-50), // Keep last 50 themes
      favoriteThemes,
      aiConfig,
      timestamp: new Date().toISOString(),
    };

    try {
      localStorage.setItem(storageKey, JSON.stringify(dataToSave));
    } catch (error) {
      console.warn("Failed to save AI theme data:", error);
    }
  }, [userBehavior, themeHistory, favoriteThemes, aiConfig, storageKey]);

  // Update AI config
  const updateAIConfig = useCallback((config: Partial<AIThemeConfig>) => {
    setAIConfig((prev: any) => {
      const newConfig = { ...prev, ...config };
      return newConfig;
    });
  }, []);

  // Generate theme from content (simplified implementation)
  const generateTheme = useCallback(
    async (
      content: string,
      context: Partial<ContentContext> = {}
    ): Promise<GlassTheme> => {
      setIsGenerating(true);
      setGenerationError(null);
      generationStartTime.current = performance.now();

      try {
        // Simulate AI processing delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Simple theme generation based on content analysis
        const contentLength = content.length;
        const hasKeywords = ["urgent", "important", "breaking"].some((word) =>
          content.toLowerCase().includes(word)
        );

        // Generate colors based on content analysis
        const baseHue = hasKeywords ? 0 : Math.random() * 360; // Red for urgent, random for others
        const saturation = 0.7;
        const lightness = 0.6;

        const theme: GlassTheme = {
          id: `theme-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: `Generated Theme ${themeHistory.length + 1}`,
          colors: {
            primary: `hsl(${baseHue}, ${saturation * 100}%, ${lightness * 100}%)`,
            secondary: `hsl(${(baseHue + 60) % 360}, ${saturation * 100}%, ${(lightness + 0.1) * 100}%)`,
            accent: `hsl(${(baseHue + 120) % 360}, ${saturation * 100}%, ${(lightness - 0.1) * 100}%)`,
            background: `hsl(${baseHue}, ${saturation * 50}%, ${lightness * 20}%)`,
            surface: `hsl(${baseHue}, ${saturation * 30}%, ${lightness * 40}%)`,
            text: `hsl(${baseHue}, ${saturation * 20}%, ${lightness * 90}%)`,
          },
          glass: {
            blur: Math.max(8, Math.min(20, contentLength / 100)),
            opacity: hasKeywords ? 0.9 : 0.7,
            borderRadius: hasKeywords ? "8px" : "16px",
          },
          animations: {
            duration: performanceMode ? 0.1 : 0.5,
            easing: "ease-out",
          },
          metadata: {
            sentiment: hasKeywords ? "urgent" : "neutral",
            context: context.type || "general",
            created: new Date(),
          },
        };

        // Update theme history
        setThemeHistory((prev: any) => [theme, ...prev.slice(0, 49)]);
        setCurrentTheme(theme);

        return theme;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Theme generation failed";
        setGenerationError(errorMessage);
        console.error("Theme generation error:", error);
        throw error;
      } finally {
        setIsGenerating(false);
      }
    },
    [themeHistory.length, performanceMode]
  );

  // Generate theme from sentiment
  const generateThemeFromSentiment = useCallback(
    async (
      sentiment: ContentSentiment,
      context: Partial<ContentContext> = {}
    ): Promise<GlassTheme> => {
      // Track sentiment usage
      const currentCount = sentimentUsage.current.get(sentiment.sentiment) || 0;
      sentimentUsage.current.set(sentiment.sentiment, currentCount + 1);

      // Create mock content based on sentiment
      const mockContent = `This is ${sentiment.sentiment} content with ${sentiment.intensity} intensity`;
      return generateTheme(mockContent, context);
    },
    [generateTheme]
  );

  // Update user behavior
  const updateUserBehavior = useCallback((behavior: Partial<UserBehavior>) => {
    setUserBehavior((prev: any) => ({ ...prev, ...behavior }));
  }, []);

  // Track user interaction with theme
  const trackInteraction = useCallback(
    (themeId: string, engagement: number, satisfaction: number) => {
      if (!enableAnalytics) return;

      // Record engagement
      engagementHistory.current.push({
        timestamp: new Date(),
        engagement,
      });

      // Keep only last 100 engagement records
      if (engagementHistory.current.length > 100) {
        engagementHistory.current = engagementHistory.current.slice(-100);
      }

      // Update user behavior based on interaction
      const currentEngagement = userBehavior.engagementLevel;
      const newEngagement = (currentEngagement + engagement) / 2;

      updateUserBehavior({
        engagementLevel: newEngagement,
        returnRate:
          satisfaction > 0.7
            ? Math.min(1, userBehavior.returnRate + 0.1)
            : userBehavior.returnRate,
      });
    },
    [enableAnalytics, userBehavior, updateUserBehavior]
  );

  // Favorites management
  const addToFavorites = useCallback((theme: GlassTheme) => {
    setFavoriteThemes((prev: any) => {
      if (prev.find((t: any) => t.id === theme.id)) return prev;
      return [theme, ...prev];
    });
  }, []);

  const removeFromFavorites = useCallback((themeId: string) => {
    setFavoriteThemes((prev: any) => prev.filter((t: any) => t.id !== themeId));
  }, []);

  // Cache and data management
  const clearCache = useCallback(() => {
    setThemeHistory([]);
    sentimentUsage.current.clear();
    engagementHistory.current = [];

    try {
      localStorage.removeItem(storageKey);
    } catch (error) {
      console.warn("Failed to clear cache:", error);
    }
  }, [storageKey]);

  const exportAIData = useCallback((): string => {
    const exportData = {
      version: "1.0.0",
      timestamp: new Date().toISOString(),
      aiConfig,
      userBehavior,
      themeHistory,
      favoriteThemes,
    };

    return JSON.stringify(exportData, null, 2);
  }, [aiConfig, userBehavior, themeHistory, favoriteThemes]);

  const importAIData = useCallback(
    (data: string): boolean => {
      try {
        const importData = JSON.parse(data);

        if (importData.aiConfig) {
          updateAIConfig(importData.aiConfig);
        }

        if (importData.userBehavior) {
          updateUserBehavior(importData.userBehavior);
        }

        if (importData.themeHistory) {
          setThemeHistory(importData.themeHistory);
        }

        if (importData.favoriteThemes) {
          setFavoriteThemes(importData.favoriteThemes);
        }

        return true;
      } catch (error) {
        console.error("Failed to import AI data:", error);
        return false;
      }
    },
    [updateAIConfig, updateUserBehavior]
  );

  // Context value
  const contextValue: AIGlassThemeContextType = {
    // Current state
    currentTheme,
    isGenerating,
    generationError,

    // Configuration
    aiConfig,
    updateAIConfig,

    // Theme generation
    generateTheme,
    generateThemeFromSentiment,

    // Theme management
    themeHistory,
    favoriteThemes,
    addToFavorites,
    removeFromFavorites,

    // User behavior
    userBehavior,
    updateUserBehavior,
    trackInteraction,

    // Performance and accessibility
    performanceMode,
    setPerformanceMode,
    accessibilityMode,
    setAccessibilityMode,

    // Data management
    clearCache,
    exportAIData,
    importAIData,
  };

  return (
    <AIGlassThemeContext.Provider value={contextValue}>
      <div className={className} data-testid={dataTestId}>
        {children}
      </div>
    </AIGlassThemeContext.Provider>
  );
}

// Hook to use AI Glass Theme context
export function useAIGlassTheme() {
  const context = useContext(AIGlassThemeContext);
  if (context === undefined) {
    throw new Error(
      "useAIGlassTheme must be used within an AIGlassThemeProvider"
    );
  }
  return context;
}

// Utility hook for simplified theme generation
export function useSmartTheme() {
  const { generateTheme, trackInteraction, currentTheme } = useAIGlassTheme();

  const generateFromContent = useCallback(
    async (content: string) => {
      const theme = await generateTheme(content);
      return theme;
    },
    [generateTheme]
  );

  const generateFromArticle = useCallback(
    async (title: string, body: string, category?: string) => {
      const content = `${title} ${body}`;
      const context = category ? { category, type: "news" as const } : {};
      return generateTheme(content, context);
    },
    [generateTheme]
  );

  const recordEngagement = useCallback(
    (engagement: number, satisfaction: number = 0.7) => {
      if (currentTheme) {
        trackInteraction(currentTheme.id, engagement, satisfaction);
      }
    },
    [currentTheme, trackInteraction]
  );

  return {
    generateFromContent,
    generateFromArticle,
    recordEngagement,
    currentTheme,
  };
}

export default AIGlassThemeProvider;
