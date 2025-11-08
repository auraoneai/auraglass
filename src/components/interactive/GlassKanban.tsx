import React, { useCallback, useEffect, useState } from "react";
import { cn } from "../../lib/utilsComprehensive";
import { OptimizedGlass, Motion } from "../../primitives";
import type { ConsciousnessFeatures } from "../layout/GlassContainer";
import {
  usePredictiveEngine,
  useInteractionRecorder,
} from "../advanced/GlassPredictiveEngine";
import { useAchievements } from "../advanced/GlassAchievementSystem";
import { useBiometricAdaptation } from "../advanced/GlassBiometricAdaptation";
import { useEyeTracking } from "../advanced/GlassEyeTracking";
import { useSpatialAudio } from "../advanced/GlassSpatialAudio";
import { GlassButton } from "../button";
import { useMotionPreferenceContext } from "../../contexts/MotionPreferenceContext";
import { Plus, MoreHorizontal, Eye, Target, Brain } from "lucide-react";
import {
  ContrastGuard,
  TextWithContrast,
} from "@/components/accessibility/ContrastGuard";

// Extend Window interface for spatial audio
declare global {
  interface Window {
    _kanbanSpatialAudio?: (
      type: "card-click" | "column-click" | "card-move"
    ) => void;
  }
}

export interface KanbanCard {
  id: string;
  title: string;
  description?: string;
  priority?: "low" | "medium" | "high";
  assignee?: string;
  dueDate?: Date;
  tags?: string[];
}

export interface KanbanColumn {
  id: string;
  title: string;
  cards: KanbanCard[];
  color?: string;
  limit?: number;
}

export interface GlassKanbanProps extends ConsciousnessFeatures {
  columns: KanbanColumn[];
  className?: string;
  /**
   * Enable drag and drop
   */
  enableDragDrop?: boolean;
  /**
   * Show column limits
   */
  showLimits?: boolean;
  /**
   * Show card metrics
   */
  showMetrics?: boolean;
  /**
   * Card click handler
   */
  onCardClick?: (cardId: string, columnId: string) => void;
  /**
   * Column click handler
   */
  onColumnClick?: (columnId: string) => void;
  /**
   * Card move handler
   */
  onCardMove?: (cardId: string, fromColumn: string, toColumn: string) => void;
}

/**
 * GlassKanban component
 * A comprehensive Kanban board with consciousness interface features
 */
export function GlassKanban({
  // TODO: Integrate ContrastGuard for table cells, list items, badges, card titles, and other text content for WCAG AA compliance

  columns,
  className,
  enableDragDrop = true,
  showLimits = true,
  showMetrics = false,
  onCardClick,
  onColumnClick,
  onCardMove,
  // Consciousness features
  consciousness = false,
  predictive = false,
  adaptive = false,
  eyeTracking = false,
  spatialAudio = false,
  trackAchievements = false,
}: GlassKanbanProps) {
  // Consciousness state
  const [cardInteractionCounts, setCardInteractionCounts] = useState<
    Record<string, number>
  >({});
  const [columnInteractionCounts, setColumnInteractionCounts] = useState<
    Record<string, number>
  >({});
  const [focusedCard, setFocusedCard] = useState<string | null>(null);
  const [focusedColumn, setFocusedColumn] = useState<string | null>(null);
  const [workflowSuggestions, setWorkflowSuggestions] = useState<
    Array<{
      cardId: string;
      suggestedColumn: string;
      reason: string;
      priority: number;
    }>
  >([]);
  const [boardMetrics, setBoardMetrics] = useState<{
    totalCards: number;
    bottlenecks: string[];
    productivity: number;
    completionRate: number;
  } | null>(null);

  // Consciousness hooks
  const predictiveEngine = predictive ? usePredictiveEngine() : null;
  const eyeTracker = eyeTracking ? useEyeTracking() : null;
  const biometricAdapter = adaptive ? useBiometricAdaptation() : null;
  const spatialAudioEngine = spatialAudio ? useSpatialAudio() : null;
  const interactionRecorder = consciousness ? useInteractionRecorder() : null;
  const achievementTracker = trackAchievements ? useAchievements() : null;

  // Consciousness effects
  // Eye tracking for card and column focus
  useEffect(() => {
    if (!eyeTracking || !eyeTracker) return;

    const handleGazeData = (gazeData: any) => {
      // Find focused card
      const cardElements = document.querySelectorAll(
        '[data-consciousness-card="true"]'
      );
      let focusedCardId: string | null = null;

      cardElements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        if (
          gazeData.x >= rect.left &&
          gazeData.x <= rect.right &&
          gazeData.y >= rect.top &&
          gazeData.y <= rect.bottom
        ) {
          focusedCardId = element.getAttribute("data-card-id");
        }
      });

      setFocusedCard(focusedCardId);

      // Find focused column
      const columnElements = document.querySelectorAll(
        '[data-consciousness-column="true"]'
      );
      let focusedColumnId: string | null = null;

      columnElements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        if (
          gazeData.x >= rect.left &&
          gazeData.x <= rect.right &&
          gazeData.y >= rect.top &&
          gazeData.y <= rect.bottom
        ) {
          focusedColumnId = element.getAttribute("data-column-id");
        }
      });

      setFocusedColumn(focusedColumnId);

      // Record achievements for focus tracking
      if (
        trackAchievements &&
        achievementTracker &&
        (focusedCardId || focusedColumnId)
      ) {
        achievementTracker.recordAction("kanban_gaze_focus", {
          cardId: focusedCardId,
          columnId: focusedColumnId,
          gazeTime: Date.now(),
        });
      }
    };

    // Eye tracking functionality temporarily disabled
    // eyeTracker.startTracking(handleGazeData);
    // return () => eyeTracker.stopTracking();
  }, [eyeTracking, eyeTracker, achievementTracker, trackAchievements]);

  // Predictive workflow suggestions
  useEffect(() => {
    if (!predictive || !predictiveEngine) return;

    const generateWorkflowSuggestions = async () => {
      try {
        const boardContext = {
          columns: columns.map((col: any) => ({
            id: col.id,
            title: col.title,
            cardCount: col.cards.length,
            limit: col.limit,
            cards: col.cards.map((card: any) => ({
              id: card.id,
              title: card.title,
              priority: card.priority,
              interactionCount: cardInteractionCounts[card.id] || 0,
            })),
          })),
          interactions: cardInteractionCounts,
        };

        const suggestions =
          (await predictiveEngine.engine?.generateWorkflowSuggestions(
            boardContext
          )) || [];
        setWorkflowSuggestions(suggestions.slice(0, 3));

        // Generate board metrics
        const metrics =
          (await predictiveEngine.engine?.analyzeBoardPerformance(
            boardContext
          )) || {};
        setBoardMetrics(metrics);
      } catch (error) {
        console.warn("Predictive workflow generation failed:", error);
      }
    };

    if (columns.length > 0) {
      const timeoutId = setTimeout(generateWorkflowSuggestions, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [columns, predictive, predictiveEngine, cardInteractionCounts]);

  // Spatial audio for card interactions
  useEffect(() => {
    if (!spatialAudio || !spatialAudioEngine) return;

    const playInteractionSound = (
      type: "card-click" | "column-click" | "card-move"
    ) => {
      const soundMap = {
        "card-click": {
          sound: "card-select",
          volume: 0.4,
          position: { x: 0, y: 0, z: 0 },
        },
        "column-click": {
          sound: "column-focus",
          volume: 0.3,
          position: { x: -0.5, y: 0, z: 0 },
        },
        "card-move": {
          sound: "card-move",
          volume: 0.5,
          position: { x: 0.5, y: 0, z: 0 },
        },
      };

      const config = soundMap[type];
      spatialAudioEngine.playGlassSound(config.sound, config.position, {
        volume: config.volume,
        reverb: 0.2,
      });
    };

    // Store sound function for use in handlers
    window._kanbanSpatialAudio = playInteractionSound;

    return () => {
      delete window._kanbanSpatialAudio;
    };
  }, [spatialAudio, spatialAudioEngine]);

  // Enhanced card click handler
  const handleCardClick = useCallback(
    (cardId: string, columnId: string) => {
      // Update interaction counts
      setCardInteractionCounts((prev: any) => ({
        ...prev,
        [cardId]: (prev[cardId] || 0) + 1,
      }));

      // Record interaction for consciousness tracking
      if (consciousness && interactionRecorder) {
        const mockEvent = {
          currentTarget: { id: `card-${cardId}` },
          clientX: 0,
          clientY: 0,
          button: 0,
          ctrlKey: false,
          altKey: false,
          shiftKey: false,
          metaKey: false,
          preventDefault: () => {},
          stopPropagation: () => {},
        } as React.MouseEvent;
        interactionRecorder.recordClick(mockEvent);
      }

      // Track achievement
      if (trackAchievements && achievementTracker) {
        achievementTracker.recordAction("kanban_card_interaction", {
          cardId,
          columnId,
          timestamp: Date.now(),
        });
      }

      // Play spatial audio
      if (spatialAudio && window._kanbanSpatialAudio) {
        window._kanbanSpatialAudio("card-click");
      }

      onCardClick?.(cardId, columnId);
    },
    [
      consciousness,
      interactionRecorder,
      trackAchievements,
      achievementTracker,
      spatialAudio,
      onCardClick,
      cardInteractionCounts,
    ]
  );

  // Enhanced column click handler
  const handleColumnClick = useCallback(
    (columnId: string) => {
      // Update interaction counts
      setColumnInteractionCounts((prev: any) => ({
        ...prev,
        [columnId]: (prev[columnId] || 0) + 1,
      }));

      // Record interaction for consciousness tracking
      if (consciousness && interactionRecorder) {
        const mockEvent = {
          currentTarget: { id: `column-${columnId}` },
          clientX: 0,
          clientY: 0,
          button: 0,
          ctrlKey: false,
          altKey: false,
          shiftKey: false,
          metaKey: false,
          preventDefault: () => {},
          stopPropagation: () => {},
        } as React.MouseEvent;
        interactionRecorder.recordClick(mockEvent);
      }

      // Play spatial audio
      if (spatialAudio && window._kanbanSpatialAudio) {
        window._kanbanSpatialAudio("column-click");
      }

      onColumnClick?.(columnId);
    },
    [
      consciousness,
      interactionRecorder,
      spatialAudio,
      onColumnClick,
      columnInteractionCounts,
    ]
  );

  return (
    <Motion
      data-glass-component
      preset="fadeIn"
      className="glass-w-full glass-h-full"
    >
      <div
        className={cn(
          "grid glass-gap-4 glass-p-4",
          consciousness && "consciousness-kanban-board",
          predictive &&
            workflowSuggestions.length > 0 &&
            "consciousness-predictive-board",
          adaptive && "consciousness-adaptive-board",
          eyeTracking && "consciousness-eye-trackable",
          className
        )}
        style={{
          gridTemplateColumns: `repeat(${columns.length}, minmax(280px, 1fr))`,
        }}
        data-consciousness-kanban="true"
        data-consciousness-active={String(!!consciousness)}
        data-predictive={String(!!predictive)}
        data-adaptive={String(!!adaptive)}
        data-eye-tracking={String(!!eyeTracking)}
        data-spatial-audio={String(!!spatialAudio)}
      >
        {/* Board Metrics */}
        {showMetrics && boardMetrics && (
          <div className="col-span-full mb-4 glass-p-3 glass-surface-subtle/5 glass-radius-lg glass-border glass-border-white/10">
            <div className="glass-flex glass-items-center glass-justify-between glass-text-sm">
              <div className="glass-flex glass-items-center glass-gap-4">
                <span className="text-primary/80">
                  Total Cards: {boardMetrics.totalCards}
                </span>
                <span className="text-primary/80">
                  Productivity: {Math.round(boardMetrics.productivity * 100)}%
                </span>
                <span className="text-primary/80">
                  Completion Rate:{" "}
                  {Math.round(boardMetrics.completionRate * 100)}%
                </span>
              </div>
              {boardMetrics.bottlenecks.length > 0 && (
                <div className="glass-flex glass-items-center glass-gap-2">
                  <Target className="w-4 h-4 text-primary" />
                  <span className="text-primary glass-text-xs">
                    Bottlenecks: {boardMetrics.bottlenecks.join(", ")}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Workflow Suggestions */}
        {predictive && workflowSuggestions.length > 0 && (
          <div className="col-span-full mb-4 glass-p-3 glass-surface-primary/10 glass-radius-lg glass-border glass-border-primary/20">
            <div className="glass-flex glass-items-center glass-gap-2 mb-2">
              <Brain className="w-4 h-4 text-primary" />
              <span className="text-primary glass-text-sm font-medium">
                Workflow Suggestions
              </span>
            </div>
            <div className="glass-gap-2">
              {workflowSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="glass-text-xs text-primary/70 glass-flex glass-items-center glass-justify-between"
                >
                  <span>
                    Move "{suggestion.cardId}" to "{suggestion.suggestedColumn}"
                  </span>
                  <span className="text-primary/80">{suggestion.reason}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {columns.map((column) => {
          const isOverLimit =
            column.limit && column.cards.length > column.limit;
          const isFocused = eyeTracking && focusedColumn === column.id;
          const interactionCount = columnInteractionCounts[column.id] || 0;

          return (
            <div
              key={column.id}
              className={cn(
                "glass-gap-3 min-h-[200px] glass-p-3 glass-radius-xl",
                "bg-white/5 border border-white/10",
                isFocused && "consciousness-column-focused",
                isOverLimit && "consciousness-column-overlimit",
                interactionCount > 0 && "consciousness-column-interacted",
                consciousness && "consciousness-enhanced-column"
              )}
              data-consciousness-column="true"
              data-column-id={column.id}
              data-interaction-count={interactionCount}
              data-gaze-focused={isFocused}
              data-over-limit={isOverLimit}
              onClick={() => handleColumnClick(column.id)}
            >
              {/* Column Header */}
              <div className="glass-flex glass-items-center glass-justify-between">
                <div
                  className="glass-text-sm text-primary font-medium glass-flex glass-items-center glass-gap-2"
                  style={{ color: column.color || "white" }}
                >
                  {column.title}
                  <span className="glass-text-xs text-primary/60">
                    ({column.cards.length})
                  </span>
                  {isFocused && <Eye className="w-3 h-3 text-primary" />}
                </div>

                <div className="glass-flex glass-items-center glass-gap-2">
                  {showLimits && column.limit && (
                    <span
                      className={cn(
                        "glass-text-xs glass-px-2 glass-py-1 glass-radius-md",
                        isOverLimit
                          ? "bg-red-500/20 text-red-300"
                          : "bg-white/10 glass-text-primary/60"
                      )}
                    >
                      {column.cards.length}/{column.limit}
                    </span>
                  )}

                  <GlassButton
                    variant="ghost"
                    size="sm"
                    className="glass-p-1"
                    consciousness={consciousness}
                    adaptive={adaptive}
                    spatialAudio={spatialAudio}
                    trackAchievements={trackAchievements}
                  >
                    <Plus className="w-3 h-3" />
                  </GlassButton>

                  <GlassButton
                    variant="ghost"
                    size="sm"
                    className="glass-p-1"
                    consciousness={consciousness}
                    adaptive={adaptive}
                    spatialAudio={spatialAudio}
                    trackAchievements={trackAchievements}
                  >
                    <MoreHorizontal className="w-3 h-3" />
                  </GlassButton>
                </div>
              </div>

              {/* Cards */}
              <div className="glass-gap-2">
                {column.cards.map((card, cardIndex) => {
                  const isCardFocused = eyeTracking && focusedCard === card.id;
                  const cardInteractionCount =
                    cardInteractionCounts[card.id] || 0;
                  const hasSuggestion = workflowSuggestions.some(
                    (s) => s.cardId === card.id
                  );

                  return (
                    <OptimizedGlass
                      key={card.id}
                      elevation="level1"
                      className={cn(
                        "glass-radius-lg glass-p-3 border cursor-pointer transition-all duration-200",
                        "hover:border-white/30 hover:bg-white/10",
                        isCardFocused &&
                          "consciousness-card-focused border-primary",
                        cardInteractionCount > 0 &&
                          "consciousness-card-interacted",
                        hasSuggestion &&
                          "consciousness-card-suggested border-yellow-400/50",
                        card.priority === "high" && "border-red-400/50",
                        card.priority === "medium" && "border-yellow-400/50",
                        card.priority === "low" && "border-green-400/50",
                        consciousness && "consciousness-enhanced-card"
                      )}
                      style={{
                        animationDelay: `${cardIndex * 50}ms`,
                        animationFillMode: "both",
                      }}
                      data-consciousness-card="true"
                      data-card-id={card.id}
                      data-column-id={column.id}
                      data-interaction-count={cardInteractionCount}
                      data-gaze-focused={isCardFocused}
                      data-priority={card.priority}
                      data-has-suggestion={hasSuggestion}
                      onClick={() => handleCardClick(card.id, column.id)}
                    >
                      <div className="glass-flex glass-items-start glass-justify-between mb-2">
                        <div className="glass-text-sm text-primary font-medium glass-flex-1">
                          {card.title}
                          {isCardFocused && (
                            <Eye className="inline-block w-3 h-3 text-primary glass-ml-2" />
                          )}
                        </div>
                        {hasSuggestion && (
                          <div className="glass-text-xs text-primary glass-surface-yellow/20 glass-px-2 glass-py-1 glass-radius-md">
                            Suggested
                          </div>
                        )}
                      </div>

                      {card.description && (
                        <div className="glass-text-xs text-primary/70 mb-2">
                          {card.description}
                        </div>
                      )}

                      <div className="glass-flex glass-items-center glass-justify-between">
                        <div className="glass-flex glass-items-center glass-gap-2">
                          {card.priority && (
                            <span
                              className={cn(
                                "glass-text-xs glass-px-2 glass-py-1 glass-radius-md",
                                card.priority === "high" &&
                                  "bg-red-500/20 text-red-300",
                                card.priority === "medium" &&
                                  "bg-yellow-500/20 text-yellow-300",
                                card.priority === "low" &&
                                  "bg-green-500/20 text-green-300"
                              )}
                            >
                              {card.priority}
                            </span>
                          )}

                          {card.tags && card.tags.length > 0 && (
                            <div className="glass-flex glass-gap-1">
                              {card.tags.slice(0, 2).map((tag, index) => (
                                <span
                                  key={index}
                                  className="glass-text-xs text-primary glass-surface-primary/20 glass-px-1 glass-radius-md"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {cardInteractionCount > 0 && (
                          <span className="glass-text-xs text-primary/50">
                            {cardInteractionCount} interactions
                          </span>
                        )}
                      </div>

                      {card.assignee && (
                        <div className="glass-text-xs text-primary/60 glass-mt-2">
                          Assigned: {card.assignee}
                        </div>
                      )}

                      {card.dueDate && (
                        <div className="glass-text-xs text-primary/60 glass-mt-1">
                          Due: {card.dueDate.toLocaleDateString()}
                        </div>
                      )}
                    </OptimizedGlass>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </Motion>
  );
}

// Consciousness-Enhanced Kanban Variants
export const GlassPredictiveKanban: React.FC<GlassKanbanProps> = (props) => (
  <GlassKanban {...props} consciousness={true} predictive={true} />
);

export const GlassAdaptiveKanban: React.FC<GlassKanbanProps> = (props) => (
  <GlassKanban {...props} consciousness={true} adaptive={true} />
);

export const GlassEyeTrackingKanban: React.FC<GlassKanbanProps> = (props) => (
  <GlassKanban {...props} consciousness={true} eyeTracking={true} />
);

export const GlassSpatialAudioKanban: React.FC<GlassKanbanProps> = (props) => (
  <GlassKanban {...props} consciousness={true} spatialAudio={true} />
);

export const GlassAchievementKanban: React.FC<GlassKanbanProps> = (props) => (
  <GlassKanban {...props} consciousness={true} trackAchievements={true} />
);

export const GlassConsciousnessKanban: React.FC<GlassKanbanProps> = (props) => (
  <GlassKanban
    {...props}
    consciousness={true}
    predictive={true}
    adaptive={true}
    eyeTracking={true}
    spatialAudio={true}
    trackAchievements={true}
  />
);

export default GlassKanban;
