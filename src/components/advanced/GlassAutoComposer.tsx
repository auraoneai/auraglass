"use client";
import { useReducedMotion } from "@/hooks/useReducedMotion";
/**
 * AuraGlass Auto Composer
 * On-demand generative UI layouts using LLMs + design tokens
 * Part of Next-Wave Systems (10/10) - Generative Design Systems
 *
 * @demo DEMO / EXPERIMENTAL COMPONENT — uses in-component mock data.
 * Generated layouts are produced by a local heuristic stand-in, NOT a real LLM
 * call. Wire it to a real model/generation backend before production use.
 */

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  createContext,
  useContext,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/utils";
import { ContrastGuard } from "../accessibility/ContrastGuard";
import { ANIMATION } from "../../tokens/designConstants";

// Generative UI types
interface UIPrompt {
  description: string;
  purpose: string;
  constraints?: string[];
  style?: "minimal" | "standard" | "detailed" | "experimental";
  components?: string[];
  interactions?: string[];
}

interface GeneratedLayout {
  id: string;
  prompt: UIPrompt;
  jsx: string;
  css: string;
  tokens: DesignTokens;
  confidence: number;
  iterations: number;
  timestamp: number;
}

type DesignTokenPrimitive = string | number;
type DesignTokenGroup = Record<
  string,
  DesignTokenPrimitive | Record<string, DesignTokenPrimitive>
>;

interface DesignTokens {
  colors: Record<string, string>;
  spacing: Record<string, string>;
  typography: DesignTokenGroup;
  shadows: Record<string, string>;
  borders: Record<string, string>;
  animations: DesignTokenGroup;
}

interface ComposerConfig {
  model: "claude" | "gpt" | "local";
  temperature: number;
  maxTokens: number;
  designSystem: "material" | "fluid" | "glass" | "custom";
  accessibility: boolean;
  responsive: boolean;
}

// AI-powered layout generator
class AILayoutGenerator {
  private config: ComposerConfig;
  private designTokens: DesignTokens;
  private templateLibrary: Map<string, string>;

  constructor(config: ComposerConfig) {
    this.config = config;
    this.designTokens = this.initializeDesignTokens();
    this.templateLibrary = new Map();
    this.loadTemplateLibrary();
  }

  private initializeDesignTokens(): DesignTokens {
    return {
      colors: {
        primary: "var(--glass-color-primary)",
        secondary: "var(--glass-color-success)",
        accent: "var(--glass-color-primary)",
        background:
          '/* Use createGlassStyle({ intent: "primary", elevation: "level2" }) */',
        surface:
          "color-mix(in srgb, var(--glass-white) var(--glass-opacity-10), transparent)",
        text: "var(--glass-white)",
        textSecondary:
          "color-mix(in srgb, var(--glass-white) var(--glass-opacity-70), transparent)",
      },
      spacing: {
        xs: "0.25rem",
        sm: "0.5rem",
        md: "1rem",
        lg: "1.5rem",
        xl: "2rem",
        "2xl": "3rem",
      },
      typography: {
        fontSize: {
          xs: "0.75rem",
          sm: "0.875rem",
          base: "1rem",
          lg: "1.125rem",
          xl: "1.25rem",
          "2xl": "1.5rem",
        },
        fontWeight: {
          light: 300,
          normal: 400,
          medium: 500,
          semibold: 600,
          bold: 700,
        },
      },
      shadows: {
        sm: "0 1px 2px 0 color-mix(in srgb, var(--glass-black) var(--glass-opacity-5), transparent)",
        md: "0 4px 6px -1px color-mix(in srgb, var(--glass-black) var(--glass-opacity-10), transparent)",
        lg: "0 10px 15px -3px color-mix(in srgb, var(--glass-black) var(--glass-opacity-10), transparent)",
        glass:
          "0 8px 32px color-mix(in srgb, var(--glass-black) var(--glass-opacity-37), transparent)",
      },
      borders: {
        radius: "0.375rem",
      },
      animations: {
        duration: {
          fast: "var(--glass-motion-duration-fast)",
          normal: "var(--glass-motion-duration-normal)",
          slow: "var(--glass-motion-duration-slow)",
        },
        easing: {
          ease: "var(--glass-motion-ease-standard)",
          easeIn: "var(--glass-motion-ease-in)",
          easeOut: "var(--glass-motion-ease-out)",
          bounce: "var(--glass-motion-ease-spring)",
        },
      },
    };
  }

  private loadTemplateLibrary(): void {
    this.templateLibrary.set(
      "card",
      `
      <div className="glass-surface-primary glass-elev-2 glass-radius-lg glass-p-6">
        {children}
      </div>
    `
    );

    this.templateLibrary.set(
      "button",
      `
      <motion.button
        className="glass-surface-secondary glass-px-4 glass-py-2 glass-radius-md glass-text-primary"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {children}
      </motion.button>
    `
    );

    this.templateLibrary.set(
      "input",
      `
      <input
        className="glass-surface-secondary glass-border glass-radius-md glass-px-3 glass-py-2 glass-text-primary glass-touch-target glass-contrast-guard"
        placeholder={placeholder}
      />
    `
    );
  }

  async generateLayout(prompt: UIPrompt): Promise<GeneratedLayout> {
    const startTime = Date.now();

    // For demo, we'll use rule-based generation
    // In practice, this would call an LLM API
    const generatedJSX = await this.generateJSXFromPrompt(prompt);
    const generatedCSS = await this.generateCSSFromPrompt(prompt);
    const iterations = 1;

    return {
      id: `layout-${Date.now()}`,
      prompt,
      jsx: generatedJSX,
      css: generatedCSS,
      tokens: this.designTokens,
      confidence: 0.85,
      iterations,
      timestamp: startTime,
    };
  }

  private async generateJSXFromPrompt(prompt: UIPrompt): Promise<string> {
    // Simulate AI generation with template matching
    const { description, purpose, style = "standard" } = prompt;

    let jsx = "";

    if (description.toLowerCase().includes("dashboard")) {
      jsx = this.generateDashboardLayout(prompt);
    } else if (description.toLowerCase().includes("form")) {
      jsx = this.generateFormLayout(prompt);
    } else if (description.toLowerCase().includes("card")) {
      jsx = this.generateCardLayout(prompt);
    } else if (description.toLowerCase().includes("list")) {
      jsx = this.generateListLayout(prompt);
    } else {
      jsx = this.generateGenericLayout(prompt);
    }

    return jsx;
  }

  private generateDashboardLayout(prompt: UIPrompt): string {
    const normalDuration = ANIMATION.DURATION.normal / 1000;
    return `
<div className="glass-min-glass-h-screen glass-surface-primary glass-p-6">
  <div className="glass-max-w-7xl glass-mx-auto glass-space-y-6">
    {/* Header */}
    <div className="glass-flex glass-items-center glass-justify-between">
      <h1 className="glass-text-3xl glass-font-bold glass-text-primary">Dashboard</h1>
      <div className="glass-flex glass-gap-4">
        <motion.button className="glass-surface-secondary glass-px-4 glass-py-2 glass-radius-md">
          Settings
        </motion.button>
        <motion.button className="glass-surface-accent glass-px-4 glass-py-2 glass-radius-md">
          New Item
        </motion.button>
      </div>
    </div>

    {/* Stats Grid */}
    <div className="glass-grid glass-grid-cols-1 md:glass-grid-cols-2 lg:glass-grid-cols-4 glass-gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          className="glass-surface-secondary glass-elev-2 glass-radius-lg glass-p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={prefersReducedMotion ? { duration: 0 } : { duration: ${normalDuration} }}
        >
          <div className="glass-text-2xl glass-font-bold glass-text-primary">{stat.value}</div>
          <div className="glass-text-sm glass-text-secondary">{stat.label}</div>
        </motion.div>
      ))}
    </div>

    {/* Main Content */}
    <div className="glass-grid glass-grid-cols-1 lg:glass-grid-cols-3 glass-gap-6">
      <div className="lg:glass-col-span-2">
        <div className="glass-surface-secondary glass-elev-2 glass-radius-lg glass-p-6">
          <h2 className="glass-text-xl glass-font-semibold glass-text-primary glass-mb-4">Main Chart</h2>
          {/* Chart component would go here */}
        </div>
      </div>
      <div className="glass-space-y-6">
        <div className="glass-surface-secondary glass-elev-2 glass-radius-lg glass-p-6">
          <h3 className="glass-text-lg glass-font-semibold glass-text-primary glass-mb-4">Recent Activity</h3>
          {/* Activity list would go here */}
        </div>
      </div>
    </div>
  </div>
</div>`;
  }

  private generateFormLayout(prompt: UIPrompt): string {
    return `
<div className="glass-max-w-md glass-mx-auto glass-surface-primary glass-elev-3 glass-radius-lg glass-p-8">
  <h2 className="glass-text-2xl glass-font-bold glass-text-primary glass-mb-6 glass-text-center">Contact Form</h2>
  
  <form className="glass-space-y-6">
    <div>
      <label className="glass-block glass-text-sm glass-font-medium glass-text-secondary glass-mb-2">
        Full Name
      </label>
      <input
        type="text"
        className="glass-w-full glass-surface-secondary glass-border glass-radius-md glass-px-3 glass-py-2 glass-text-primary placeholder-glass-opacity-50 glass-touch-target glass-contrast-guard"
        placeholder="Enter your full name"
      />
    </div>

    <div>
      <label className="glass-block glass-text-sm glass-font-medium glass-text-secondary glass-mb-2">
        Email Address
      </label>
      <input
        type="email"
        className="glass-w-full glass-surface-secondary glass-border glass-radius-md glass-px-3 glass-py-2 glass-text-primary placeholder-glass-opacity-50 glass-touch-target glass-contrast-guard"
        placeholder="Enter your email"
      />
    </div>

    <div>
      <label className="glass-block glass-text-sm glass-font-medium glass-text-secondary glass-mb-2">
        Message
      </label>
      <textarea
        rows={4}
        className="glass-w-full glass-surface-secondary glass-border glass-radius-md glass-px-3 glass-py-2 glass-text-primary placeholder-glass-opacity-50 glass-touch-target glass-contrast-guard"
        placeholder="Enter your message"
      />
    </div>

    <motion.button
      type="submit"
      className="glass-w-full glass-surface-accent glass-elev-2 glass-radius-md glass-py-3 glass-font-semibold glass-text-primary"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      Send Message
    </motion.button>
  </form>
</div>`;
  }

  private generateCardLayout(prompt: UIPrompt): string {
    const normalDuration = ANIMATION.DURATION.normal / 1000;
    return `
<div className="glass-grid glass-grid-cols-1 md:glass-grid-cols-2 lg:glass-grid-cols-3 glass-gap-6 glass-p-6">
  {items.map((item, index) => (
    <motion.div
      key={item.id}
      className="glass-surface-secondary glass-elev-2 glass-radius-lg glass-overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
      transition={prefersReducedMotion ? { duration: 0 } : { duration: ${ANIMATION.DURATION.normal / 1000} }}
      whileHover={{ scale: 1.02 }}
    >
      {item.image && (
        <div className="glass-aspect-video glass-gradient-primary glass-gradient-primary glass-gradient-primary"></div>
      )}
      
      <div className="glass-p-6">
        <h3 className="glass-text-xl glass-font-semibold glass-text-primary glass-mb-2">
          {item.title}
        </h3>
        <p className="glass-text-secondary glass-mb-4">
          {item.description}
        </p>
        
        <div className="glass-flex glass-items-center glass-justify-between">
          <span className="glass-text-sm glass-text-tertiary">
            {item.date}
          </span>
          <motion.button
            className="glass-surface-accent glass-px-3 glass-py-1 glass-radius-sm glass-text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View
          </motion.button>
        </div>
      </div>
    </motion.div>
  ))}
</div>`;
  }

  private generateListLayout(prompt: UIPrompt): string {
    const normalDuration = ANIMATION.DURATION.normal / 1000;
    return `
<div className="glass-max-w-2xl glass-mx-auto glass-surface-primary glass-elev-2 glass-radius-lg glass-overflow-hidden">
  <div className="glass-p-6 glass-border-b glass-border">
    <h2 className="glass-text-2xl glass-font-bold glass-text-primary">List Items</h2>
    <p className="glass-text-secondary glass-mt-1">Manage your items efficiently</p>
  </div>
  
  <div className="glass-divide-y glass-divide">
    {items.map((item, index) => (
      <motion.div
        key={item.id}
        className="glass-p-4 hover:glass-surface-secondary glass-transition-colors"
        initial={{ opacity: 0, x: -20 }}
        animate={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
        transition={prefersReducedMotion ? { duration: 0 } : { duration: ${ANIMATION.DURATION.normal / 1000} }}
      >
        <div className="glass-flex glass-items-center glass-justify-between">
          <div className="glass-flex glass-items-center glass-gap-3">
            <div className="glass-w-10 glass-h-10 glass-surface-accent glass-radius-full glass-flex glass-items-center glass-justify-center">
              {item.icon}
            </div>
            <div>
              <div className="glass-font-medium glass-text-primary">{item.title}</div>
              <div className="glass-text-sm glass-text-secondary">{item.subtitle}</div>
            </div>
          </div>
          
          <div className="glass-flex glass-items-center glass-gap-2">
            <motion.button
              className="glass-p-2 glass-surface-secondary glass-radius-md"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Edit
            </motion.button>
            <motion.button
              className="glass-p-2 glass-surface-secondary glass-radius-md"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Delete
            </motion.button>
          </div>
        </div>
      </motion.div>
    ))}
  </div>
</div>`;
  }

  private generateGenericLayout(prompt: UIPrompt): string {
    return `
<div className="glass-surface-primary glass-elev-2 glass-radius-lg glass-p-6">
  <div className="glass-text-center glass-gap-4">
    <h1 className="glass-text-3xl glass-font-bold glass-text-primary">
      Generated Component
    </h1>
    <p className="glass-text-secondary glass-max-w-md glass-mx-auto">
      This is a dynamically generated component based on your prompt: "${prompt.description}"
    </p>
    
    <div className="glass-flex glass-justify-center glass-gap-4 glass-pt-4">
      <motion.button
        className="glass-surface-accent glass-px-6 glass-py-3 glass-radius-md glass-font-medium"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Primary Action
      </motion.button>
      <motion.button
        className="glass-surface-secondary glass-px-6 glass-py-3 glass-radius-md glass-font-medium"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Secondary Action
      </motion.button>
    </div>
  </div>
</div>`;
  }

  private async generateCSSFromPrompt(prompt: UIPrompt): Promise<string> {
    const { style = "standard" } = prompt;

    const baseCSS = `
.generated-component {
  /* Base glassmorphism styles */
  backdrop-filter: var(--glass-backdrop-blur);
  -webkit-backdrop-filter: var(--glass-backdrop-blur);
  background: var(--glass-bg-default);
  border: 1px solid var(--glass-border-default);
  border-radius: var(--glass-radius-xl);
  box-shadow: var(--glass-elev-2);
}

.generated-component .glass-surface-primary {
  background: var(--glass-bg-default);
  backdrop-filter: var(--glass-backdrop-blur);
}

.generated-component .glass-surface-secondary {
  background: var(--glass-bg-default);
  backdrop-filter: var(--glass-backdrop-blur);
}

.generated-component .glass-text-primary {
  color: var(--glass-text-primary);
}

.generated-component .glass-text-secondary {
  color: var(--glass-text-secondary);
}

.generated-component .glass-border {
  border: 1px solid var(--glass-border-default);
}
`;

    let styleSpecificCSS = "";

    switch (style) {
      case "minimal":
        styleSpecificCSS = `
.generated-component {
  --glass-blur: var(--glass-blur-sm);
  --glass-opacity: var(--glass-opacity-5);
  --animation-duration: var(--glass-motion-duration-fast);
}
`;
        break;
      case "detailed":
        styleSpecificCSS = `
.generated-component {
  --glass-blur: var(--glass-blur-xl);
  --glass-opacity: var(--glass-opacity-15);
  --animation-duration: var(--glass-motion-duration-slow);
  box-shadow: var(--glass-elev-2);
}
`;
        break;
      case "experimental":
        styleSpecificCSS = `
.generated-component {
  --glass-blur: var(--glass-blur-2xl);
  --glass-opacity: var(--glass-opacity-20);
  --animation-duration: var(--glass-motion-duration-slower);
  background: var(--glass-bg-default);
  animation: glowPulse var(--glass-motion-duration-slowest) var(--glass-motion-ease-in-out) infinite alternate;
}

@keyframes glowPulse {
  0% { box-shadow: var(--glass-elev-2); }
  100% { box-shadow: var(--glass-elev-2); }
}
`;
        break;
    }

    return baseCSS + styleSpecificCSS;
  }
}

// Layout optimizer using genetic algorithms
class LayoutOptimizer {
  private population: GeneratedLayout[];
  private fitnessScores: Map<string, number>;
  private generationCount: number;

  constructor() {
    this.population = [];
    this.fitnessScores = new Map();
    this.generationCount = 0;
  }

  async optimizeLayout(
    baseLayout: GeneratedLayout,
    userFeedback: number[]
  ): Promise<GeneratedLayout> {
    // Initialize population if empty
    if (this.population.length === 0) {
      this.population = await this.createInitialPopulation(baseLayout);
    }

    // Calculate fitness scores
    this.calculateFitnessScores(userFeedback);

    // Evolve the population
    this.population = await this.evolvePopulation();
    this.generationCount++;

    // Return the best layout
    return this.getBestLayout();
  }

  private async createInitialPopulation(
    baseLayout: GeneratedLayout
  ): Promise<GeneratedLayout[]> {
    const population: GeneratedLayout[] = [baseLayout];

    // Create variants
    for (let i = 0; i < 9; i++) {
      const variant = await this.createVariant(baseLayout);
      population.push(variant);
    }

    return population;
  }

  private async createVariant(
    layout: GeneratedLayout
  ): Promise<GeneratedLayout> {
    // Create variations in the layout
    const mutations = [
      "spacing",
      "colors",
      "typography",
      "shadows",
      "animations",
    ];

    const randomMutation =
      mutations[Math.floor(Math.random() * mutations.length)];
    const mutatedTokens = { ...layout.tokens };

    // Apply random mutations
    switch (randomMutation) {
      case "colors":
        const hue = Math.floor(Math.random() * 360);
        mutatedTokens.colors.primary = `hsl(${hue}, 70%, 60%)`;
        break;
      case "spacing":
        const scale = 0.8 + Math.random() * 0.4; // 0.8 to 1.2
        Object.keys(mutatedTokens.spacing).forEach((key) => {
          const value = parseFloat(mutatedTokens.spacing[key]);
          mutatedTokens.spacing[key] = `${value * scale}rem`;
        });
        break;
    }

    return {
      ...layout,
      id: `${layout.id}-variant-${Date.now()}`,
      tokens: mutatedTokens,
      confidence: layout.confidence * (0.8 + Math.random() * 0.4),
      timestamp: Date.now(),
    };
  }

  private calculateFitnessScores(feedback: number[]): void {
    this.population.forEach((layout, index) => {
      const score = feedback[index] || 0.5; // Default neutral feedback
      this.fitnessScores.set(layout.id, score);
    });
  }

  private async evolvePopulation(): Promise<GeneratedLayout[]> {
    // Selection, crossover, and mutation
    const selected = this.selection();
    const offspring = await this.crossover(selected);
    return this.mutation(offspring);
  }

  private selection(): GeneratedLayout[] {
    // Tournament selection
    const selected: GeneratedLayout[] = [];
    const tournamentSize = 3;

    while (selected.length < this.population.length / 2) {
      const tournament: GeneratedLayout[] = [];

      for (let i = 0; i < tournamentSize; i++) {
        const randomIndex = Math.floor(Math.random() * this.population.length);
        tournament.push(this.population[randomIndex]);
      }

      // Select the best from tournament
      const winner = tournament.reduce((best, current) => {
        const bestScore = this.fitnessScores.get(best.id) || 0;
        const currentScore = this.fitnessScores.get(current.id) || 0;
        return currentScore > bestScore ? current : best;
      });

      selected.push(winner);
    }

    return selected;
  }

  private async crossover(
    parents: GeneratedLayout[]
  ): Promise<GeneratedLayout[]> {
    const offspring: GeneratedLayout[] = [...parents];

    // Create offspring by combining parent traits
    while (offspring.length < this.population.length) {
      const parent1 = parents[Math.floor(Math.random() * parents.length)];
      const parent2 = parents[Math.floor(Math.random() * parents.length)];

      const child = await this.combineLayouts(parent1, parent2);
      offspring.push(child);
    }

    return offspring;
  }

  private async combineLayouts(
    parent1: GeneratedLayout,
    parent2: GeneratedLayout
  ): Promise<GeneratedLayout> {
    // Combine design tokens from both parents
    const combinedTokens: DesignTokens = {
      colors:
        Math.random() > 0.5 ? parent1.tokens.colors : parent2.tokens.colors,
      spacing:
        Math.random() > 0.5 ? parent1.tokens.spacing : parent2.tokens.spacing,
      typography:
        Math.random() > 0.5
          ? parent1.tokens.typography
          : parent2.tokens.typography,
      shadows:
        Math.random() > 0.5 ? parent1.tokens.shadows : parent2.tokens.shadows,
      borders:
        Math.random() > 0.5 ? parent1.tokens.borders : parent2.tokens.borders,
      animations:
        Math.random() > 0.5
          ? parent1.tokens.animations
          : parent2.tokens.animations,
    };

    return {
      id: `child-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      prompt: parent1.prompt,
      jsx: Math.random() > 0.5 ? parent1.jsx : parent2.jsx,
      css: parent1.css, // Would need more sophisticated combination
      tokens: combinedTokens,
      confidence: (parent1.confidence + parent2.confidence) / 2,
      iterations: Math.max(parent1.iterations, parent2.iterations) + 1,
      timestamp: Date.now(),
    };
  }

  private async mutation(
    population: GeneratedLayout[]
  ): Promise<GeneratedLayout[]> {
    const mutationRate = 0.1;

    return Promise.all(
      population.map(async (layout) => {
        if (Math.random() < mutationRate) {
          return await this.createVariant(layout);
        }
        return layout;
      })
    );
  }

  private getBestLayout(): GeneratedLayout {
    return this.population.reduce((best, current) => {
      const bestScore = this.fitnessScores.get(best.id) || 0;
      const currentScore = this.fitnessScores.get(current.id) || 0;
      return currentScore > bestScore ? current : best;
    });
  }
}

// React Context
const AutoComposerContext = createContext<{
  generator: AILayoutGenerator | null;
  optimizer: LayoutOptimizer | null;
  generateLayout: (prompt: UIPrompt) => Promise<GeneratedLayout>;
  optimizeLayout: (
    layout: GeneratedLayout,
    feedback: number[]
  ) => Promise<GeneratedLayout>;
  currentLayouts: GeneratedLayout[];
}>({
  generator: null,
  optimizer: null,
  generateLayout: async () => ({}) as GeneratedLayout,
  optimizeLayout: async () => ({}) as GeneratedLayout,
  currentLayouts: [],
});

// Provider component
export function GlassAutoComposerProvider({
  children,
  config = {
    model: "claude",
    temperature: 0.7,
    maxTokens: 2000,
    designSystem: "glass",
    accessibility: true,
    responsive: true,
  },
}: {
  children: React.ReactNode;
  config?: Partial<ComposerConfig>;
}) {
  const prefersReducedMotion = useReducedMotion();
  const generatorRef = useRef<AILayoutGenerator>();
  const optimizerRef = useRef<LayoutOptimizer>();
  const [currentLayouts, setCurrentLayouts] = useState<GeneratedLayout[]>([]);

  useEffect(() => {
    const fullConfig: ComposerConfig = {
      model: "claude",
      temperature: 0.7,
      maxTokens: 2000,
      designSystem: "glass",
      accessibility: true,
      responsive: true,
      ...config,
    };

    generatorRef.current = new AILayoutGenerator(fullConfig);
    optimizerRef.current = new LayoutOptimizer();
  }, [config]);

  const generateLayout = useCallback(
    async (prompt: UIPrompt): Promise<GeneratedLayout> => {
      if (!generatorRef.current) throw new Error("Generator not initialized");

      const layout = await generatorRef.current.generateLayout(prompt);
      setCurrentLayouts((prev) => [...prev, layout]);
      return layout;
    },
    []
  );

  const optimizeLayout = useCallback(
    async (
      layout: GeneratedLayout,
      feedback: number[]
    ): Promise<GeneratedLayout> => {
      if (!optimizerRef.current) throw new Error("Optimizer not initialized");

      const optimized = await optimizerRef.current.optimizeLayout(
        layout,
        feedback
      );
      setCurrentLayouts((prev) => [...prev, optimized]);
      return optimized;
    },
    []
  );

  const value = {
    generator: generatorRef.current || null,
    optimizer: optimizerRef.current || null,
    generateLayout,
    optimizeLayout,
    currentLayouts,
  };

  return (
    <AutoComposerContext.Provider value={value}>
      {children}
    </AutoComposerContext.Provider>
  );
}

// Hook to use auto composer
export function useAutoComposer() {
  const context = useContext(AutoComposerContext);
  if (!context) {
    throw new Error(
      "useAutoComposer must be used within GlassAutoComposerProvider"
    );
  }
  return context;
}

// Auto composer interface
export function GlassAutoComposerInterface({
  className,
}: {
  className?: string;
}) {
  const { generateLayout } = useAutoComposer();
  const [prompt, setPrompt] = useState("");
  const [generatedLayout, setGeneratedLayout] =
    useState<GeneratedLayout | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    try {
      const layout = await generateLayout({
        description: prompt,
        purpose: "user-requested",
        style: "standard",
      });
      setGeneratedLayout(layout);
    } catch {
      setGeneratedLayout(null);
    } finally {
      setIsGenerating(false);
    }
  };

  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      className={cn("space-y-6", className)}
      role="main"
      aria-label="AI Layout Generator"
    >
      <div className="glass-surface-primary glass-elev-2 glass-radius-lg glass-p-6">
        <ContrastGuard>
          <h2 className="glass-text-2xl glass-font-bold glass-text-primary glass-mb-4">
            AI Layout Generator
          </h2>
        </ContrastGuard>

        <div className="glass-gap-4">
          <div>
            <label
              htmlFor="layout-prompt-textarea"
              className="glass-block glass-text-sm glass-font-medium glass-text-secondary glass-mb-2"
            >
              <ContrastGuard>Describe the layout you want</ContrastGuard>
            </label>
            <textarea
              id="layout-prompt-textarea"
              className="glass-w-full glass-surface-secondary glass-border glass-radius-md glass-px-3 glass-py-2 glass-text-primary glass-touch-target glass-contrast-guard"
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., Create a modern dashboard with charts, stats cards, and a sidebar navigation"
              aria-label="Layout description input"
              aria-describedby="layout-prompt-description"
            />
            <span id="layout-prompt-description" className="glass-sr-only">
              Enter a description of the layout you want to generate
            </span>
          </div>

          <motion.button
            className="glass-surface-accent glass-px-6 glass-py-3 glass-radius-md glass-font-medium"
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            whileHover={prefersReducedMotion ? undefined : { scale: 1.02 }}
            whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : {
                    duration: ANIMATION.DURATION.fast,
                    ease: ANIMATION.EASING.easeOut,
                  }
            }
            aria-label={isGenerating ? "Generating layout" : "Generate layout"}
            aria-busy={isGenerating}
          >
            <ContrastGuard>
              {isGenerating ? "Generating..." : "Generate Layout"}
            </ContrastGuard>
          </motion.button>
        </div>
      </div>

      {/* Generated Layout Preview */}
      {generatedLayout && (
        <div
          className="glass-surface-primary glass-elev-2 glass-radius-lg glass-p-6"
          role="region"
          aria-label="Generated layout preview"
        >
          <div className="glass-flex glass-items-center glass-justify-between glass-mb-4">
            <ContrastGuard>
              <h3 className="glass-text-xl glass-font-semibold glass-text-primary">
                Generated Layout
              </h3>
            </ContrastGuard>
            <div className="glass-flex glass-items-center glass-gap-2">
              <ContrastGuard>
                <span className="glass-text-sm glass-text-secondary">
                  Confidence: {(generatedLayout.confidence * 100).toFixed(0)}%
                </span>
              </ContrastGuard>
            </div>
          </div>

          <div className="glass-gap-4">
            <div>
              <ContrastGuard>
                <h4 className="glass-text-sm glass-font-medium glass-text-secondary glass-mb-2">
                  JSX Code
                </h4>
              </ContrastGuard>
              <pre
                className="glass-surface-secondary glass-radius-md glass-p-4 glass-text-xs glass-text-primary glass-overflow-x-auto"
                aria-label="Generated JSX code"
              >
                {generatedLayout.jsx}
              </pre>
            </div>

            <div>
              <ContrastGuard>
                <h4 className="glass-text-sm glass-font-medium glass-text-secondary glass-mb-2">
                  CSS Styles
                </h4>
              </ContrastGuard>
              <pre
                className="glass-surface-secondary glass-radius-md glass-p-4 glass-text-xs glass-text-primary glass-overflow-x-auto"
                aria-label="Generated CSS styles"
              >
                {generatedLayout.css}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Layout renderer component
export function GlassGeneratedLayoutRenderer({
  layout,
  data = {},
  className,
}: {
  layout: GeneratedLayout;
  data?: Record<string, unknown>;
  className?: string;
}) {
  const renderJSX = useCallback(() => {
    // In a real implementation, this would safely execute the generated JSX
    // For demo purposes, we'll show a placeholder
    return (
      <div className="generated-component glass-p-6 glass-text-center">
        <ContrastGuard>
          <h3 className="glass-text-xl glass-font-bold glass-text-primary glass-mb-2">
            Generated Component Preview
          </h3>
          <p className="glass-text-secondary glass-mb-4">
            Based on: "{layout.prompt.description}"
          </p>
          <div className="glass-text-xs glass-text-tertiary">
            Generated at: {new Date(layout.timestamp).toLocaleString()}
          </div>
        </ContrastGuard>
      </div>
    );
  }, [layout]);

  return (
    <div className={cn("generated-layout", className)}>
      <style>{layout.css}</style>
      {renderJSX()}
    </div>
  );
}

// Hook for layout generation
export function useLayoutGenerator() {
  const { generateLayout, currentLayouts } = useAutoComposer();

  const generateFromDescription = useCallback(
    async (description: string) => {
      return generateLayout({
        description,
        purpose: "user-generated",
        style: "standard",
      });
    },
    [generateLayout]
  );

  return {
    generateFromDescription,
    currentLayouts,
    hasLayouts: currentLayouts.length > 0,
  };
}

// Presets for different generation modes
export const autoComposerPresets = {
  creative: {
    temperature: 0.9,
    style: "experimental",
    iterations: 5,
  },
  balanced: {
    temperature: 0.7,
    style: "standard",
    iterations: 3,
  },
  conservative: {
    temperature: 0.3,
    style: "minimal",
    iterations: 1,
  },
  accessibility: {
    temperature: 0.5,
    style: "standard",
    accessibility: true,
    iterations: 2,
  },
};

// Main component wrapper for testing and simple usage
export function GlassAutoComposer({
  children,
  className,
  ...props
}: {
  children?: React.ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <GlassAutoComposerProvider>
      <div className={className} {...props}>
        {children || <GlassAutoComposerInterface />}
      </div>
    </GlassAutoComposerProvider>
  );
}
