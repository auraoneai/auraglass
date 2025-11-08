import { cn } from '../../lib/utilsComprehensive';
import React, { forwardRef, useCallback, useRef, useState } from 'react';
import { useMotionPreferenceContext } from '../../contexts/MotionPreferenceContext';
import { Motion, OptimizedGlass } from '../../primitives';
import { useA11yId } from '../../utils/a11y';
import { useGlassSound } from '../../utils/soundDesign';

export interface KanbanCard {
  id: string;
  title: string;
  description?: string;
  content?: React.ReactNode;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  tags?: string[];
  assignee?: {
    id: string;
    name: string;
    avatar?: string;
  };
  dueDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  customData?: Record<string, any>;
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
  customData?: Record<string, any>;
}

export interface DragState {
  isDragging: boolean;
  draggedCard?: KanbanCard;
  draggedFrom?: string;
  dragOverColumn?: string;
  dragPosition?: number;
}

export interface GlassKanbanBoardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Board columns */
  columns: KanbanColumn[];
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
  cardSize?: 'sm' | 'md' | 'lg';
  /** Whether to enable virtual scrolling */
  virtualized?: boolean;
  /** Column width */
  columnWidth?: string | number;
  /** Maximum board height */
  maxHeight?: string | number;
  /** Custom card renderer */
  renderCard?: (card: KanbanCard, columnId: string) => React.ReactNode;
  /** Custom column header renderer */
  renderColumnHeader?: (column: KanbanColumn) => React.ReactNode;
  /** Card move handler */
  onCardMove?: (cardId: string, fromColumn: string, toColumn: string, position: number) => void;
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

export const GlassKanbanBoard = forwardRef<HTMLDivElement, GlassKanbanBoardProps>(
  (
    {
      columns,
      title,
      description,
      enableDrag = true,
      showCardCounts = true,
      showColumnLimits = true,
      cardSize = 'md',
      virtualized = false,
      columnWidth = '300px',
      maxHeight,
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
      ...props
    },
    ref
  ) => {
    const { prefersReducedMotion } = useMotionPreferenceContext();
    const { play, feedback } = useGlassSound();
    const kanbanId = useA11yId('glass-kanban-board');
    
    const [dragState, setDragState] = useState<DragState>({ isDragging: false });
    const [scrollPositions, setScrollPositions] = useState<Record<string, number>>({});
    const columnRefs = useRef<Record<string, HTMLDivElement>>({});

    // Card size configurations
    const cardSizeConfig = {
      sm: {
        padding: 'glass-p-3',
        text: 'glass-text-sm',
        spacing: 'glass-gap-2',
        minHeight: 'min-h-[80px]',
      },
      md: {
        padding: 'glass-p-4',
        text: 'glass-text-sm',
        spacing: 'glass-gap-3',
        minHeight: 'min-h-[100px]',
      },
      lg: {
        padding: 'glass-p-6',
        text: 'glass-text-base',
        spacing: 'glass-gap-4',
        minHeight: 'min-h-[120px]',
      },
    };

    const config = cardSizeConfig[cardSize];

    // Priority colors
    const priorityColors = {
      low: 'border-green-500/30 bg-green-500/5',
      medium: 'border-yellow-500/30 bg-yellow-500/5',
      high: 'border-orange-500/30 bg-orange-500/5',
      urgent: 'border-red-500/30 bg-red-500/5',
    };

    // Handle drag start
    const handleDragStart = useCallback((card: KanbanCard, columnId: string) => {
      if (!enableDrag) return;

      setDragState({
        isDragging: true,
        draggedCard: card,
        draggedFrom: columnId,
      });
      feedback('slide');
    }, [enableDrag, feedback]);

    // Handle drag over
    const handleDragOver = useCallback((e: React.DragEvent, columnId: string) => {
      if (!dragState.isDragging) return;

      e.preventDefault();
      setDragState((prev: any) => ({
        ...prev,
        dragOverColumn: columnId,
      }));
    }, [dragState.isDragging]);

    // Handle drag end
    const handleDragEnd = useCallback(() => {
      setDragState({ isDragging: false });
    }, []);

    // Handle drop
    const handleDrop = useCallback((e: React.DragEvent, columnId: string, position?: number) => {
      e.preventDefault();

      if (!dragState.draggedCard || !dragState.draggedFrom) return;

      const targetPosition = position ?? 0;
      
      if (dragState.draggedFrom !== columnId) {
        onCardMove?.(dragState.draggedCard.id, dragState.draggedFrom, columnId, targetPosition);
        feedback('success');
      }

      setDragState({ isDragging: false });
    }, [dragState, onCardMove, feedback]);

    // Get card priority indicator
    const getPriorityIndicator = (priority?: KanbanCard['priority']) => {
      if (!priority) return null;

      const colors = {
        low: 'bg-green-500',
        medium: 'bg-yellow-500',
        high: 'bg-orange-500',
        urgent: 'bg-red-500',
      };

      return (
        <div className={cn('w-1 h-full absolute left-0 top-0 rounded-l-md', colors[priority])} />
      );
    };

    // Default card renderer
    const defaultRenderCard = useCallback((card: KanbanCard, columnId: string) => {
      return (
        <OptimizedGlass
          key={card.id}
          draggable={enableDrag && !columns.find(c => c.id === columnId)?.readOnly}
          onDragStart={(e: React.DragEvent) => handleDragStart(card, columnId)}
          onDragEnd={handleDragEnd}
          onClick={() => onCardClick?.(card, columnId)}
          onDoubleClick={() => onCardDoubleClick?.(card, columnId)}
          elevation="level2"
          intensity="medium"
          depth={1}
          tint="neutral"
          border="subtle"
          className={cn(
            'glass-kanban-card relative cursor-pointer transition-all duration-200',
            'glass-backdrop-blur-md border border-border/20 glass-radius-md',
            config.padding,
            config.minHeight,
            'hover:scale-[1.02] hover:shadow-lg',
            dragState.isDragging && dragState.draggedCard?.id === card.id && 'opacity-50 scale-95',
            card.priority && priorityColors[card.priority],
            enableDrag && 'cursor-grab active:cursor-grabbing'
          )}
          role="article"
          aria-label={`Card: ${card.title}`}
          tabIndex={0}
          onKeyDown={(e: React.KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ') {
              onCardClick?.(card, columnId);
            }
          }}
        >
          {getPriorityIndicator(card.priority)}
          
          <div className={cn('relative', config.spacing)}>
            {/* Card Title */}
            <h3 className={cn('font-semibold text-foreground line-clamp-2', config.text)}>
              {card.title}
            </h3>

            {/* Card Description */}
            {card.description && (
              <p className="glass-text-secondary text-sm line-clamp-3">
                {card.description}
              </p>
            )}

            {/* Custom Content */}
            {card.content && (
              <div className="text-sm">
                {card.content}
              </div>
            )}

            {/* Tags */}
            {card.tags && card.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {card.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs glass-surface-primary/10 text-primary glass-radius-full"
                  >
                    {tag}
                  </span>
                ))}
                {card.tags.length > 3 && (
                  <span className="px-2 py-1 text-xs glass-surface-subtle glass-text-secondary glass-radius-full">
                    +{card.tags.length - 3}
                  </span>
                )}
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between pt-2">
              {/* Assignee */}
              {card.assignee && (
                <div className="flex items-center gap-2">
                  {card.assignee.avatar ? (
                    <img
                      src={card.assignee.avatar}
                      alt={card.assignee.name}
                      className="w-6 h-6 glass-radius-full"
                    />
                  ) : (
                    <div className="w-6 h-6 glass-surface-primary/20 text-primary glass-radius-full flex items-center justify-center text-xs font-medium">
                      {card.assignee.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              )}

              {/* Due Date */}
              {card.dueDate && (
                <div className={cn(
                  'glass-text-xs glass-px-2 glass-py-1 glass-radius-md',
                  new Date(card.dueDate) < new Date()
                    ? 'bg-red-500/10 text-red-600'
                    : new Date(card.dueDate).getTime() - Date.now() < 24 * 60 * 60 * 1000
                    ? 'bg-yellow-500/10 text-yellow-600'
                    : 'bg-muted/20 glass-text-secondary'
                )}>
                  {new Date(card.dueDate).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
        </OptimizedGlass>
      );
    }, [
      enableDrag,
      columns,
      handleDragStart,
      handleDragEnd,
      onCardClick,
      onCardDoubleClick,
      config,
      dragState,
      priorityColors
    ]);

    // Default column header renderer
    const defaultRenderColumnHeader = useCallback((column: KanbanColumn) => {
      const cardCount = column.cards.length;
      const isOverLimit = column.limit && cardCount > column.limit;

      return (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 glass-radius-full"
              style={{ backgroundColor: column.color || 'var(--glass-gray-500)' }}
            />
            <h2 className="font-semibold text-primary">{column.title}</h2>
            {showCardCounts && (
              <span className={cn(
                'glass-px-2 glass-py-1 glass-text-xs glass-radius-full',
                isOverLimit 
                  ? 'bg-red-500/20 text-red-600' 
                  : 'bg-muted/20 glass-text-secondary'
              )}>
                {cardCount}
                {showColumnLimits && column.limit && ` / ${column.limit}`}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            {showAddCard && !column.readOnly && (
              <button
                onClick={() => onCardAdd?.(column.id)}
                className={cn(
                  'w-6 h-6 glass-radius-full bg-primary/10 hover:bg-primary/20',
                  'text-primary glass-text-sm font-bold transition-colors',
                  'flex items-center justify-center'
                )}
                title="Add card"
                aria-label={`Add card to ${column.title}`}
              >
                +
              </button>
            )}
            
            {onColumnDelete && (
              <button
                onClick={() => onColumnDelete(column.id)}
                className={cn(
                  'w-6 h-6 glass-radius-full bg-red-500/10 hover:bg-red-500/20',
                  'text-red-500 glass-text-sm transition-colors',
                  'flex items-center justify-center'
                )}
                title="Delete column"
                aria-label={`Delete ${column.title} column`}
              >
                ×
              </button>
            )}
          </div>
        </div>
      );
    }, [showCardCounts, showColumnLimits, showAddCard, onCardAdd, onColumnDelete]);

    // Handle column scroll
    const handleColumnScroll = useCallback((columnId: string, scrollTop: number) => {
      setScrollPositions((prev: any) => ({
        ...prev,
        [columnId]: scrollTop,
      }));
    }, []);

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
          'glass-kanban-board glass-radius-lg glass-backdrop-blur-md border border-border/20',
          className
        )}
        style={maxHeight ? { maxHeight } : undefined}
        {...props}
      >
        <Motion
          preset={!prefersReducedMotion && respectMotionPreference ? "fadeIn" : "none"}
          className="flex flex-col h-full"
        >
          {/* Board Header */}
          {(title || description) && (
            <div className="p-6 border-b border-glass-border/20">
              {title && (
                <h1 className="text-xl font-bold text-primary mb-2">
                  {title}
                </h1>
              )}
              {description && (
                <p className="glass-text-secondary">
                  {description}
                </p>
              )}
            </div>
          )}

          {/* Kanban Columns */}
          <div className="flex-1 overflow-x-auto overflow-y-hidden">
            {columns.length === 0 && emptyState ? (
              <div className="flex items-center justify-center h-full p-8">
                {emptyState}
              </div>
            ) : (
              <div className="flex gap-6 p-6 h-full" style={{ minWidth: 'fit-content' }}>
                {columns.map((column) => (
                  <Motion
                    key={column.id}
                    preset={!prefersReducedMotion && respectMotionPreference ? "slideUp" : "none"}
                    delay={columns.indexOf(column) * 100}
                  >
                    <OptimizedGlass
                      elevation="level2"
                      intensity="medium"
                      depth={2}
                      tint="neutral"
                      border="subtle"
                      className={cn(
                        'glass-kanban-column flex flex-col h-full',
                        'glass-backdrop-blur-md border border-border/20 glass-radius-lg',
                        dragState.dragOverColumn === column.id && 'ring-2 ring-primary/50'
                      )}
                      style={{ width: columnWidth, minWidth: columnWidth }}
                      onDragOver={(e: React.DragEvent) => handleDragOver(e, column.id)}
                      onDrop={(e: React.DragEvent) => handleDrop(e, column.id)}
                      role="region"
                      aria-label={`Column: ${column.title}`}
                    >
                      {/* Column Header */}
                      <div className="p-4 border-b border-glass-border/20">
                        {renderColumnHeader ? renderColumnHeader(column) : defaultRenderColumnHeader(column)}
                        {column.description && (
                          <p className="text-sm glass-text-secondary glass-mt-2">
                            {column.description}
                          </p>
                        )}
                      </div>

                      {/* Column Body */}
                      <div
                        ref={(el) => {
                          if (el) columnRefs.current[column.id] = el;
                        }}
                        className="flex-1 overflow-y-auto p-4 gap-3"
                        onScroll={(e: React.UIEvent) => handleColumnScroll(column.id, e.currentTarget.scrollTop)}
                      >
                        {column.cards.map((card, index) => (
                          <Motion
                            key={card.id}
                            preset={!prefersReducedMotion && respectMotionPreference ? "slideUp" : "none"}
                            delay={index * 50}
                          >
                            {renderCard ? renderCard(card, column.id) : defaultRenderCard(card, column.id)}
                          </Motion>
                        ))}

                        {/* Drop Zone */}
                        {enableDrag && dragState.isDragging && (
                          <div
                            className={cn(
                              'h-2 glass-radius-md border-2 border-dashed border-primary/30 transition-all',
                              dragState.dragOverColumn === column.id && 'bg-primary/10'
                            )}
                            onDragOver={(e: React.DragEvent) => e.preventDefault()}
                            onDrop={(e: React.DragEvent) => handleDrop(e, column.id, column.cards.length)}
                          />
                        )}

                        {/* Empty State */}
                        {column.cards.length === 0 && (
                          <div className="flex items-center justify-center h-32 glass-text-secondary text-sm border-2 border-dashed border-glass-border/20 glass-radius-lg">
                            {column.readOnly ? 'No cards' : 'Drop cards here or click + to add'}
                          </div>
                        )}
                      </div>
                    </OptimizedGlass>
                  </Motion>
                ))}

                {/* Add Column Button */}
                {showAddColumn && onColumnAdd && (
                  <Motion
                    preset={!prefersReducedMotion && respectMotionPreference ? "slideUp" : "none"}
                    delay={columns.length * 100}
                  >
                    <button
                      onClick={onColumnAdd}
                      className={cn(
                        'flex flex-col items-center justify-center h-full min-w-[280px]',
                        'border-2 border-dashed border-border/30 glass-radius-lg',
                        'hover:border-primary/50 hover:bg-primary/5 transition-all',
                        'glass-text-secondary hover:text-primary'
                      )}
                      aria-label="Add new column"
                    >
                      <div className="w-12 h-12 glass-radius-full bg-transparent/10 flex items-center justify-center mb-2">
                        <span className="text-2xl font-light">+</span>
                      </div>
                      <span className="text-sm font-medium">Add Column</span>
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

GlassKanbanBoard.displayName = 'GlassKanbanBoard';

export default GlassKanbanBoard;