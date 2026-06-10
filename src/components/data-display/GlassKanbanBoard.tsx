"use client";
import { cn } from "../../lib/utilsComprehensive";
import React, { forwardRef, useCallback, useRef, useState } from "react";
import { useMotionPreferenceContext } from "../../contexts/MotionPreferenceContext";
import { Motion, OptimizedGlass } from "../../primitives";
import { useA11yId } from "../../utils/a11y";
import { useGlassSound } from "../../utils/soundDesign";
import {
  ContrastGuard,
  TextWithContrast,
} from "@/components/accessibility/ContrastGuard";
import { ANIMATION } from "../../tokens/designConstants";
import { useReducedMotion } from "../../hooks/useReducedMotion";

export interface KanbanCard {
  id: string;
  title: string;
  description?: string;
  content?: React.ReactNode;
  priority?: "low" | "medium" | "high" | "urgent";
  tags?: string[];
  assignee?: {
    id: string;
    name: string;
    avatar?: string;
  };
  dueDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  customData?: Record<string, unknown>;
}

export interface KanbanColumn {
  id: string;
  title: string;
  description?: string;
  color?: string;
  limit?: number;
  cards: KanbanCard[];
  allowedCardTypes?: string[];
  readOnly?: boolean;
  customData?: Record<string, unknown>;
}

export interface DragState {
  isDragging: boolean;
  draggedCard?: KanbanCard;
  draggedFrom?: string;
  dragOverColumn?: string;
  dragPosition?: number;
}

export interface GlassKanbanBoardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Board columns */
  columns?: KanbanColumn[];
  /** Board title */
  title?: string;
  /** Board description */
  description?: string;
  /** Whether cards can be dragged */
  enableDrag?: boolean;
  /** Whether to show card counts */
  showCardCounts?: boolean;
  /** Whether to show column limits */
  showColumnLimits?: boolean;
  /** Card size variant */
  cardSize?: "sm" | "md" | "lg";
  /** Whether to enable virtual scrolling */
  virtualized?: boolean;
  /** Column width */
  columnWidth?: string | number;
  /** Maximum board height */
  maxHeight?: string | number;
  /** Compact rendering for embedded previews and narrow containers */
  compact?: boolean;
  /** Contain the board in its parent without full-page sizing assumptions */
  contained?: boolean;
  /** Explicit board width */
  width?: string | number;
  /** Explicit board height */
  height?: string | number;
  /** Show the board title and description header */
  showHeader?: boolean;
  /** Show column-level toolbar controls such as add/delete */
  showToolbar?: boolean;
  /** Show add-card/add-column actions */
  showActions?: boolean;
  /** Custom card renderer */
  renderCard?: (card: KanbanCard, columnId: string) => React.ReactNode;
  /** Custom column header renderer */
  renderColumnHeader?: (column: KanbanColumn) => React.ReactNode;
  /** Card move handler */
  onCardMove?: (
    cardId: string,
    fromColumn: string,
    toColumn: string,
    position: number
  ) => void;
  /** Card click handler */
  onCardClick?: (card: KanbanCard, columnId: string) => void;
  /** Card double click handler */
  onCardDoubleClick?: (card: KanbanCard, columnId: string) => void;
  /** Column add handler */
  onColumnAdd?: () => void;
  /** Column update handler */
  onColumnUpdate?: (column: KanbanColumn) => void;
  /** Column delete handler */
  onColumnDelete?: (columnId: string) => void;
  /** Card add handler */
  onCardAdd?: (columnId: string) => void;
  /** Card update handler */
  onCardUpdate?: (card: KanbanCard, columnId: string) => void;
  /** Card delete handler */
  onCardDelete?: (cardId: string, columnId: string) => void;
  /** Whether to show add column button */
  showAddColumn?: boolean;
  /** Whether to show add card buttons */
  showAddCard?: boolean;
  /** Custom empty state */
  emptyState?: React.ReactNode;
  /** Respect motion preferences */
  respectMotionPreference?: boolean;
}

const DEFAULT_KANBAN_COLUMNS: KanbanColumn[] = [
  {
    id: "todo",
    title: "To do",
    color: "#38bdf8",
    limit: 3,
    cards: [
      {
        id: "demo-card-1",
        title: "Sketch hero",
        description: "Tighten layout and copy.",
        priority: "medium",
        tags: ["design"],
      },
    ],
  },
  {
    id: "doing",
    title: "Doing",
    color: "#a3e635",
    limit: 3,
    cards: [
      {
        id: "demo-card-2",
        title: "Wire previews",
        description: "Validate component states.",
        priority: "high",
        tags: ["qa"],
      },
    ],
  },
  {
    id: "done",
    title: "Done",
    color: "#f59e0b",
    limit: 4,
    cards: [
      {
        id: "demo-card-3",
        title: "Token pass",
        description: "Ship stable glass colors.",
        priority: "low",
        tags: ["tokens"],
      },
    ],
  },
];

export const GlassKanbanBoard = forwardRef<
  HTMLDivElement,
  GlassKanbanBoardProps
>(
  (
    {
      columns = [],
      title,
      description,
      enableDrag = true,
      showCardCounts = true,
      showColumnLimits = true,
      cardSize = "md",
      virtualized = false,
      columnWidth = "300px",
      maxHeight,
      compact = false,
      contained = false,
      width,
      height,
      showHeader = true,
      showToolbar = true,
      showActions = true,
      renderCard,
      renderColumnHeader,
      onCardMove,
      onCardClick,
      onCardDoubleClick,
      onColumnAdd,
      onColumnUpdate,
      onColumnDelete,
      onCardAdd,
      onCardUpdate,
      onCardDelete,
      showAddColumn = true,
      showAddCard = true,
      emptyState,
      respectMotionPreference = true,
      className,
      style,
      "aria-label": ariaLabel,
      "data-testid": dataTestId,
      ...props
    },
    ref
  ) => {
    const { prefersReducedMotion } = useMotionPreferenceContext();
    const { play, feedback } = useGlassSound();
    const kanbanId = useA11yId("glass-kanban-board");

    const [dragState, setDragState] = useState<DragState>({
      isDragging: false,
    });
    const [scrollPositions, setScrollPositions] = useState<
      Record<string, number>
    >({});
    const columnRefs = useRef<Record<string, HTMLDivElement>>({});

    // Card size configurations
    const cardSizeConfig = {
      sm: {
        padding: "glass-p-3",
        text: "glass-text-sm",
        spacing: "glass-gap-2",
        minHeight: "min-h-[80px]",
      },
      md: {
        padding: "glass-p-4",
        text: "glass-text-sm",
        spacing: "glass-gap-3",
        minHeight: "min-h-[100px]",
      },
      lg: {
        padding: "glass-p-6",
        text: "glass-text-base",
        spacing: "glass-gap-4",
        minHeight: "min-h-[120px]",
      },
    };

    const numericColumnWidth =
      typeof columnWidth === "number"
        ? columnWidth
        : Number.parseFloat(String(columnWidth));
    const isCompact =
      compact ||
      cardSize === "sm" ||
      (!!numericColumnWidth && numericColumnWidth <= 160);
    const config = cardSizeConfig[cardSize];
    const boardColumns =
      columns.length === 0 && !emptyState ? DEFAULT_KANBAN_COLUMNS : columns;
    const effectiveShowAddColumn = showActions && showAddColumn;
    const effectiveShowAddCard = showActions && showAddCard;
    const effectiveColumnWidth =
      contained && compact && columnWidth === "300px" ? "180px" : columnWidth;

    // Priority colors
    const priorityColors = {
      low: "glass-border-green-500/30 bg-green-500/5",
      medium: "glass-border-yellow-500/30 bg-yellow-500/5",
      high: "glass-border-orange-500/30 bg-orange-500/5",
      urgent: "glass-border-red-500/30 bg-red-500/5",
    };

    // Handle drag start
    const handleDragStart = useCallback(
      (card: KanbanCard, columnId: string) => {
        if (!enableDrag) return;

        setDragState({
          isDragging: true,
          draggedCard: card,
          draggedFrom: columnId,
        });
        feedback("slide");
      },
      [enableDrag, feedback]
    );

    // Handle drag over
    const handleDragOver = useCallback(
      (e: React.DragEvent, columnId: string) => {
        if (!dragState.isDragging) return;

        e.preventDefault();
        setDragState((prev) => ({
          ...prev,
          dragOverColumn: columnId,
        }));
      },
      [dragState.isDragging]
    );

    // Handle drag end
    const handleDragEnd = useCallback(() => {
      setDragState({ isDragging: false });
    }, []);

    // Handle drop
    const handleDrop = useCallback(
      (e: React.DragEvent, columnId: string, position?: number) => {
        e.preventDefault();

        if (!dragState.draggedCard || !dragState.draggedFrom) return;

        const targetPosition = position ?? 0;

        if (dragState.draggedFrom !== columnId) {
          onCardMove?.(
            dragState.draggedCard.id,
            dragState.draggedFrom,
            columnId,
            targetPosition
          );
          feedback("success");
        }

        setDragState({ isDragging: false });
      },
      [dragState, onCardMove, feedback]
    );

    // Get card priority indicator
    const getPriorityIndicator = (priority?: KanbanCard["priority"]) => {
      if (!priority) return null;

      const colors = {
        low: "bg-green-500",
        medium: "bg-yellow-500",
        high: "bg-orange-500",
        urgent: "bg-red-500",
      };

      return (
        <div
          className={cn(
            "glass-w-1 glass-h-full glass-absolute left-0 top-0 rounded-l-md",
            colors[priority]
          )}
        />
      );
    };

    // Default card renderer
    const defaultRenderCard = useCallback(
      (card: KanbanCard, columnId: string) => {
        return (
          <OptimizedGlass
            key={card.id}
            draggable={
              enableDrag &&
              !boardColumns.find((c) => c.id === columnId)?.readOnly
            }
            onDragStart={(e: React.DragEvent) =>
              handleDragStart(card, columnId)
            }
            onDragEnd={handleDragEnd}
            onClick={() => onCardClick?.(card, columnId)}
            onDoubleClick={() => onCardDoubleClick?.(card, columnId)}
            elevation="level2"
            intensity="medium"
            depth={1}
            tint="neutral"
            border="subtle"
            className={cn(
              `glass-kanban-card glass-relative glass-cursor-pointer transition-all duration-[${ANIMATION.DURATION.fast}ms]`,
              "glass-backdrop-blur-md glass-border glass-border-glass-border/20 glass-radius-md",
              !isCompact && config.padding,
              config.minHeight,
              "hover:scale-[1.02] hover:shadow-lg",
              dragState.isDragging &&
                dragState.draggedCard?.id === card.id &&
                "opacity-50 scale-95",
              card.priority && priorityColors[card.priority],
              enableDrag && "cursor-grab glass-active-cursor-grabbing"
            )}
            role="article"
            aria-label={`Card: ${card.title}`}
            tabIndex={0}
            style={{
              padding: isCompact ? "0.55rem 0.6rem" : undefined,
              minHeight: isCompact ? 64 : undefined,
              overflow: "hidden",
            }}
            onKeyDown={(e: React.KeyboardEvent) => {
              if (e.key === "Enter" || e.key === " ") {
                onCardClick?.(card, columnId);
              }
            }}
          >
            {getPriorityIndicator(card.priority)}

            <div
              className={cn("glass-relative", !isCompact && config.spacing)}
              style={{
                display: "grid",
                gap: isCompact ? "0.35rem" : undefined,
                minWidth: 0,
              }}
            >
              {/* Card Title */}
              <h3
                className={cn(
                  "glass-font-semibold glass-text-primary line-clamp-2",
                  !isCompact && config.text
                )}
                style={{
                  margin: 0,
                  color: "rgba(248,250,252,0.96)",
                  fontSize: isCompact ? "0.78rem" : undefined,
                  lineHeight: isCompact ? 1.25 : undefined,
                  overflowWrap: "anywhere",
                }}
              >
                <ContrastGuard>{card.title}</ContrastGuard>
              </h3>

              {/* Card Description */}
              {card.description && !isCompact && (
                <ContrastGuard>
                  <p className="glass-text-secondary glass-text-sm glass-line-clamp-3">
                    {card.description}
                  </p>
                </ContrastGuard>
              )}

              {/* Custom Content */}
              {card.content && (
                <div className="glass-text-sm">{card.content}</div>
              )}

              {/* Tags */}
              {card.tags && card.tags.length > 0 && (
                <div
                  className="glass-flex glass-flex-wrap glass-gap-1"
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: isCompact ? 4 : undefined,
                  }}
                >
                  {card.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="glass-px-2 glass-py-1 glass-text-xs glass-surface-primary/10 glass-text-primary glass-radius-full"
                      style={{
                        maxWidth: "100%",
                        padding: isCompact ? "0.15rem 0.35rem" : undefined,
                        borderRadius: 999,
                        background:
                          "color-mix(in srgb, hsl(var(--glass-color-primary)) 10%, transparent)",
                        color: "rgba(191,232,255,0.92)",
                        fontSize: isCompact ? "0.62rem" : undefined,
                        lineHeight: 1.1,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <ContrastGuard>{tag}</ContrastGuard>
                    </span>
                  ))}
                  {card.tags.length > 3 && (
                    <ContrastGuard>
                      <span className="glass-px-2 glass-py-1 glass-text-xs glass-surface-subtle glass-text-secondary glass-radius-full">
                        +{card.tags.length - 3}
                      </span>
                    </ContrastGuard>
                  )}
                </div>
              )}

              {/* Footer */}
              <div
                className="glass-flex glass-items-center glass-justify-between glass-pt-2"
                style={{ display: isCompact ? "none" : undefined }}
              >
                {/* Assignee */}
                {card.assignee && (
                  <div className="glass-flex glass-items-center glass-gap-2">
                    {card.assignee.avatar ? (
                      <img
                        src={card.assignee.avatar}
                        alt={card.assignee.name}
                        className="glass-w-6 glass-h-6 glass-radius-full"
                      />
                    ) : (
                      <div className="glass-w-6 glass-h-6 glass-surface-primary/20 glass-text-primary glass-radius-full glass-flex glass-items-center glass-justify-center glass-text-xs glass-font-medium">
                        <ContrastGuard>
                          {card.assignee.name.charAt(0).toUpperCase()}
                        </ContrastGuard>
                      </div>
                    )}
                  </div>
                )}

                {/* Due Date */}
                {card.dueDate && (
                  <div
                    className={cn(
                      "glass-text-xs glass-px-2 glass-py-1 glass-radius-md",
                      new Date(card.dueDate) < new Date()
                        ? "bg-red-500/10 text-red-600"
                        : new Date(card.dueDate).getTime() - Date.now() <
                            24 * 60 * 60 * 1000
                          ? "bg-yellow-500/10 text-yellow-600"
                          : "bg-muted/20 glass-text-secondary"
                    )}
                  >
                    <ContrastGuard>
                      {new Date(card.dueDate).toLocaleDateString()}
                    </ContrastGuard>
                  </div>
                )}
              </div>
            </div>
          </OptimizedGlass>
        );
      },
      [
        enableDrag,
        boardColumns,
        handleDragStart,
        handleDragEnd,
        onCardClick,
        onCardDoubleClick,
        config,
        dragState,
        priorityColors,
        isCompact,
      ]
    );

    // Default column header renderer
    const defaultRenderColumnHeader = useCallback(
      (column: KanbanColumn) => {
        const cardCount = column.cards.length;
        const isOverLimit = column.limit && cardCount > column.limit;

        return (
          <div
            className="glass-flex glass-items-center glass-justify-between"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 6,
              minWidth: 0,
            }}
          >
            <div
              className="glass-flex glass-items-center glass-gap-2"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                minWidth: 0,
              }}
            >
              <div
                className="glass-w-3 glass-h-3 glass-radius-full"
                style={{
                  backgroundColor: column.color || "var(--glass-gray-500)",
                  width: isCompact ? 7 : 12,
                  height: isCompact ? 7 : 12,
                  borderRadius: 999,
                  flex: "0 0 auto",
                }}
              />
              <ContrastGuard>
                <h2
                  className="glass-font-semibold glass-text-primary"
                  style={{
                    margin: 0,
                    minWidth: 0,
                    color: "rgba(248,250,252,0.96)",
                    fontSize: isCompact ? "0.74rem" : "0.9rem",
                    lineHeight: 1.2,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {column.title}
                </h2>
              </ContrastGuard>
              {showCardCounts && (
                <ContrastGuard>
                  <span
                    className={cn(
                      "glass-px-2 glass-py-1 glass-text-xs glass-radius-full",
                      isOverLimit
                        ? "bg-red-500/20 text-red-600"
                        : "bg-muted/20 glass-text-secondary"
                    )}
                  >
                    {cardCount}
                    {showColumnLimits && column.limit && ` / ${column.limit}`}
                  </span>
                </ContrastGuard>
              )}
            </div>

            {showToolbar && (
              <div className="glass-flex glass-items-center glass-gap-1">
                {effectiveShowAddCard && !column.readOnly && (
                  <button
                    onClick={() => onCardAdd?.(column.id)}
                    className={cn(
                      "glass-w-6 glass-h-6 glass-radius-full bg-primary/10 hover:bg-primary/20",
                      "glass-text-primary glass-text-sm glass-font-bold transition-colors",
                      "glass-flex glass-items-center glass-justify-center glass-focus glass-touch-target glass-contrast-guard"
                    )}
                    title="Add card"
                    aria-label={`Add card to ${column.title}`}
                  >
                    +
                  </button>
                )}

                {showActions && onColumnDelete && (
                  <button
                    onClick={() => onColumnDelete(column.id)}
                    className={cn(
                      "glass-w-6 glass-h-6 glass-radius-full bg-red-500/10 hover:bg-red-500/20",
                      "text-red-500 glass-text-sm transition-colors",
                      "glass-flex glass-items-center glass-justify-center glass-focus glass-touch-target glass-contrast-guard"
                    )}
                    title="Delete column"
                    aria-label={`Delete ${column.title} column`}
                  >
                    ×
                  </button>
                )}
              </div>
            )}
          </div>
        );
      },
      [
        showCardCounts,
        showColumnLimits,
        effectiveShowAddCard,
        showActions,
        showToolbar,
        onCardAdd,
        onColumnDelete,
        isCompact,
      ]
    );

    // Handle column scroll
    const handleColumnScroll = useCallback(
      (columnId: string, scrollTop: number) => {
        setScrollPositions((prev) => ({
          ...prev,
          [columnId]: scrollTop,
        }));
      },
      []
    );

    const maxHeightStyle = maxHeight ? { maxHeight } : undefined;
    const columnsContainerStyle = {
      minWidth: boardColumns.length > 0 ? "fit-content" : "100%",
      gap: isCompact ? 8 : undefined,
      padding: isCompact ? 10 : undefined,
    };

    return (
      <OptimizedGlass
        ref={ref}
        id={kanbanId}
        elevation="level1"
        intensity="medium"
        depth={1}
        tint="neutral"
        border="subtle"
        className={cn(
          "glass-kanban-board glass-radius-lg glass-backdrop-blur-md glass-border glass-border-glass-border/20",
          className
        )}
        style={{
          ...(maxHeightStyle ?? {}),
          width,
          height,
          overflow: "hidden",
          maxWidth: contained ? "100%" : undefined,
          color: "rgba(248,250,252,0.94)",
          ...style,
        }}
        role="region"
        aria-label={ariaLabel || "Kanban Board"}
        data-testid={dataTestId}
        {...props}
      >
        <Motion
          preset={
            !prefersReducedMotion && respectMotionPreference ? "fadeIn" : "none"
          }
          className="glass-flex glass-flex-col glass-h-full"
        >
          {/* Board Header */}
          {showHeader && (title || description) && (
            <div
              className="glass-p-6 glass-border-b glass-border-glass-border/20"
              style={{ padding: isCompact ? "0.75rem 0.9rem" : undefined }}
            >
              {title && (
                <h1
                  className="glass-text-xl glass-font-bold glass-text-primary glass-mb-2"
                  style={{
                    fontSize: isCompact ? "0.95rem" : undefined,
                    marginBottom: isCompact ? "0.25rem" : undefined,
                  }}
                >
                  {title}
                </h1>
              )}
              {description && !isCompact && (
                <p className="glass-text-secondary">{description}</p>
              )}
            </div>
          )}

          {/* Kanban Columns */}
          <div
            className="glass-flex-1 glass-overflow-x-auto glass-overflow-y-glass-hidden"
            style={{ overflowX: "auto", overflowY: "hidden", minHeight: 0 }}
          >
            {boardColumns.length === 0 && emptyState ? (
              <div className="glass-flex glass-items-center glass-justify-center glass-h-full glass-p-8">
                {emptyState}
              </div>
            ) : (
              <div
                className={cn(
                  "glass-flex glass-h-full",
                  !isCompact && "glass-gap-6 glass-p-6"
                )}
                style={{ ...columnsContainerStyle }}
              >
                {boardColumns.map((column) => (
                  <Motion
                    key={column.id}
                    preset={
                      !prefersReducedMotion && respectMotionPreference
                        ? "slideUp"
                        : "none"
                    }
                    delay={boardColumns.indexOf(column) * 100}
                  >
                    <OptimizedGlass
                      elevation="level2"
                      intensity="medium"
                      depth={2}
                      tint="neutral"
                      border="subtle"
                      className={cn(
                        "glass-kanban-column glass-flex glass-flex-col glass-h-full",
                        "glass-backdrop-blur-md glass-border glass-border-glass-border/20 glass-radius-lg",
                        dragState.dragOverColumn === column.id &&
                          "ring-2 ring-primary/50"
                      )}
                      style={{
                        width: effectiveColumnWidth,
                        minWidth: effectiveColumnWidth,
                        maxWidth: effectiveColumnWidth,
                        overflow: "hidden",
                      }}
                      onDragOver={(e: React.DragEvent) =>
                        handleDragOver(e, column.id)
                      }
                      onDrop={(e: React.DragEvent) => handleDrop(e, column.id)}
                      role="region"
                      aria-label={`Column: ${column.title}`}
                    >
                      {/* Column Header */}
                      <div
                        className="glass-p-4 glass-border-b glass-border-glass-border/20"
                        style={{
                          padding: isCompact ? "0.5rem 0.55rem" : undefined,
                          borderBottom: "1px solid rgba(255,255,255,0.08)",
                        }}
                      >
                        {renderColumnHeader
                          ? renderColumnHeader(column)
                          : defaultRenderColumnHeader(column)}
                        {column.description && (
                          <p className="glass-text-sm glass-text-secondary glass-mt-2">
                            {column.description}
                          </p>
                        )}
                      </div>

                      {/* Column Body */}
                      <div
                        ref={(el) => {
                          if (el) columnRefs.current[column.id] = el;
                        }}
                        className="glass-flex-1 glass-overflow-y-auto glass-p-4 glass-gap-3"
                        style={{
                          display: "grid",
                          alignContent: "start",
                          gap: isCompact ? 8 : 12,
                          padding: isCompact ? "0.5rem" : undefined,
                          overflowY: "auto",
                          minHeight: 0,
                        }}
                        onScroll={(e: React.UIEvent) =>
                          handleColumnScroll(
                            column.id,
                            e.currentTarget.scrollTop
                          )
                        }
                      >
                        {column.cards.map((card, index) => (
                          <Motion
                            key={card.id}
                            preset={
                              !prefersReducedMotion && respectMotionPreference
                                ? "slideUp"
                                : "none"
                            }
                            delay={index * 50}
                          >
                            {renderCard
                              ? renderCard(card, column.id)
                              : defaultRenderCard(card, column.id)}
                          </Motion>
                        ))}

                        {/* Drop Zone */}
                        {enableDrag && dragState.isDragging && (
                          <div
                            className={cn(
                              "glass-h-2 glass-radius-md glass-border-2 glass-border-dashed glass-border-primary transition-all",
                              dragState.dragOverColumn === column.id &&
                                "bg-primary/10"
                            )}
                            onDragOver={(e: React.DragEvent) =>
                              e.preventDefault()
                            }
                            onDrop={(e: React.DragEvent) =>
                              handleDrop(e, column.id, column.cards.length)
                            }
                          />
                        )}

                        {/* Empty State */}
                        {column.cards.length === 0 && (
                          <div className="glass-flex glass-items-center glass-justify-center glass-h-32 glass-text-secondary glass-text-sm glass-border-2 glass-border-dashed glass-border-glass-border/20 glass-radius-lg">
                            {column.readOnly
                              ? "No cards"
                              : "Drop cards here or click + to add"}
                          </div>
                        )}
                      </div>
                    </OptimizedGlass>
                  </Motion>
                ))}

                {/* Add Column Button */}
                {effectiveShowAddColumn && onColumnAdd && (
                  <Motion
                    preset={
                      !prefersReducedMotion && respectMotionPreference
                        ? "slideUp"
                        : "none"
                    }
                    delay={boardColumns.length * 100}
                  >
                    <button
                      onClick={onColumnAdd}
                      className={cn(
                        "glass-flex glass-flex-col glass-items-center glass-justify-center glass-h-full min-w-[280px]",
                        "glass-border-2 glass-border-dashed glass-border-glass-border/30 glass-radius-lg",
                        "hover:glass-border-primary hover:bg-primary/5 transition-all",
                        "glass-text-secondary hover:glass-text-primary glass-focus glass-touch-target glass-contrast-guard"
                      )}
                      aria-label="Add new column"
                    >
                      <div className="glass-w-12 glass-h-12 glass-radius-full glass-bg-transparent/10 glass-flex glass-items-center glass-justify-center glass-mb-2">
                        <span className="glass-text-2xl glass-font-light">
                          +
                        </span>
                      </div>
                      <span className="glass-text-sm glass-font-medium">
                        Add Column
                      </span>
                    </button>
                  </Motion>
                )}
              </div>
            )}
          </div>
        </Motion>
      </OptimizedGlass>
    );
  }
);

GlassKanbanBoard.displayName = "GlassKanbanBoard";

export default GlassKanbanBoard;
