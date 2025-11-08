import { cn } from '../../lib/utilsComprehensive';
import React, { forwardRef, useCallback, useMemo, useRef, useState } from 'react';
import { useMotionPreference } from '../../hooks/useMotionPreference';
import { Motion, OptimizedGlass } from '../../primitives';
import { useA11yId } from '../../utils/a11y';
import { useGlassSound } from '../../utils/soundDesign';

export interface GanttTask {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  progress: number; // 0-100
  dependencies?: string[];
  assignee?: {
    id: string;
    name: string;
    avatar?: string;
  };
  status?: 'not-started' | 'in-progress' | 'completed' | 'blocked' | 'cancelled';
  priority?: 'low' | 'medium' | 'high' | 'critical';
  color?: string;
  description?: string;
  milestone?: boolean;
  parent?: string;
  children?: string[];
  customData?: Record<string, any>;
}

export interface GanttTimeScale {
  unit: 'day' | 'week' | 'month' | 'quarter' | 'year';
  step: number;
}

export interface GanttViewOptions {
  showWeekends?: boolean;
  showToday?: boolean;
  showProgress?: boolean;
  showDependencies?: boolean;
  showMilestones?: boolean;
  showCriticalPath?: boolean;
  showBaseline?: boolean;
  showResources?: boolean;
}

export interface GlassGanttChartProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Tasks data */
  tasks: GanttTask[];
  /** Chart start date */
  startDate?: Date;
  /** Chart end date */
  endDate?: Date;
  /** Time scale configuration */
  timeScale?: GanttTimeScale;
  /** View options */
  viewOptions?: GanttViewOptions;
  /** Chart height */
  height?: number;
  /** Row height */
  rowHeight?: number;
  /** Column width for time units */
  columnWidth?: number;
  /** Whether tasks can be edited */
  editable?: boolean;
  /** Whether to show task hierarchy */
  showHierarchy?: boolean;
  /** Task click handler */
  onTaskClick?: (task: GanttTask) => void;
  /** Task update handler */
  onTaskUpdate?: (task: GanttTask) => void;
  /** Task resize handler */
  onTaskResize?: (taskId: string, startDate: Date, endDate: Date) => void;
  /** Task move handler */
  onTaskMove?: (taskId: string, startDate: Date, endDate: Date) => void;
  /** Progress update handler */
  onProgressUpdate?: (taskId: string, progress: number) => void;
  /** Dependency create handler */
  onDependencyCreate?: (fromTask: string, toTask: string) => void;
  /** Dependency delete handler */
  onDependencyDelete?: (fromTask: string, toTask: string) => void;
  /** Custom task renderer */
  renderTask?: (task: GanttTask, bounds: { x: number; width: number; y: number; height: number }) => React.ReactNode;
  /** Custom timeline header renderer */
  renderTimelineHeader?: (date: Date, unit: string) => React.ReactNode;
  /** Respect motion preferences */
  respectMotionPreference?: boolean;
}

export const GlassGanttChart = forwardRef<HTMLDivElement, GlassGanttChartProps>(
  (
    {
      tasks,
      startDate,
      endDate,
      timeScale = { unit: 'day', step: 1 },
      viewOptions = {
        showWeekends: true,
        showToday: true,
        showProgress: true,
        showDependencies: true,
        showMilestones: true,
        showCriticalPath: false,
        showBaseline: false,
        showResources: true,
      },
      height = 600,
      rowHeight = 40,
      columnWidth = 40,
      editable = false,
      showHierarchy = true,
      onTaskClick,
      onTaskUpdate,
      onTaskResize,
      onTaskMove,
      onProgressUpdate,
      onDependencyCreate,
      onDependencyDelete,
      renderTask,
      renderTimelineHeader,
      respectMotionPreference = true,
      className,
      ...props
    },
    ref
  ) => {
    const { shouldAnimate } = useMotionPreference();
    const { play } = useGlassSound();
    const ganttId = useA11yId('glass-gantt-chart');
    
    const [selectedTask, setSelectedTask] = useState<string | null>(null);
    const [dragState, setDragState] = useState<{
      isDragging: boolean;
      taskId?: string;
      startX?: number;
      startDate?: Date;
      mode?: 'move' | 'resize-start' | 'resize-end';
    }>({ isDragging: false });
    const [scrollPosition, setScrollPosition] = useState({ x: 0, y: 0 });
    const [hoveredTask, setHoveredTask] = useState<string | null>(null);

    const chartRef = useRef<HTMLDivElement>(null);
    const timelineRef = useRef<HTMLDivElement>(null);
    const taskListRef = useRef<HTMLDivElement>(null);

    // Calculate date range
    const dateRange = useMemo(() => {
      const taskDates = tasks.flatMap(task => [task.startDate, task.endDate]);
      const minDate = startDate || new Date(Math.min(...taskDates.map((d: any) => d.getTime())));
      const maxDate = endDate || new Date(Math.max(...taskDates.map((d: any) => d.getTime())));
      
      // Add some padding
      const paddedStart = new Date(minDate);
      paddedStart.setDate(paddedStart.getDate() - 7);
      
      const paddedEnd = new Date(maxDate);
      paddedEnd.setDate(paddedEnd.getDate() + 7);
      
      return { start: paddedStart, end: paddedEnd };
    }, [tasks, startDate, endDate]);

    // Generate time columns
    const timeColumns = useMemo(() => {
      const columns: Date[] = [];
      const current = new Date(dateRange.start);
      
      while (current <= dateRange.end) {
        columns.push(new Date(current));
        
        switch (timeScale.unit) {
          case 'day':
            current.setDate(current.getDate() + timeScale.step);
            break;
          case 'week':
            current.setDate(current.getDate() + (7 * timeScale.step));
            break;
          case 'month':
            current.setMonth(current.getMonth() + timeScale.step);
            break;
          case 'quarter':
            current.setMonth(current.getMonth() + (3 * timeScale.step));
            break;
          case 'year':
            current.setFullYear(current.getFullYear() + timeScale.step);
            break;
        }
      }
      
      return columns;
    }, [dateRange, timeScale]);

    // Calculate task positions
    const getTaskPosition = useCallback((task: GanttTask) => {
      const totalDuration = dateRange.end.getTime() - dateRange.start.getTime();
      const taskStart = task.startDate.getTime() - dateRange.start.getTime();
      const taskDuration = task.endDate.getTime() - task.startDate.getTime();
      
      const x = (taskStart / totalDuration) * (timeColumns.length * columnWidth);
      const width = (taskDuration / totalDuration) * (timeColumns.length * columnWidth);
      
      return { x, width: Math.max(width, 20) }; // Minimum width of 20px
    }, [dateRange, timeColumns.length, columnWidth]);

    // Status colors
    const statusColors = {
      'not-started': 'bg-gray-400',
      'in-progress': 'bg-blue-500',
      'completed': 'bg-green-500',
      'blocked': 'bg-red-500',
      'cancelled': 'bg-gray-600',
    };

    // Priority colors
    const priorityColors = {
      low: 'border-green-500/30',
      medium: 'border-yellow-500/30',
      high: 'border-orange-500/30',
      critical: 'border-red-500/30',
    };

    // Handle task drag start
    const handleTaskDragStart = useCallback((e: React.MouseEvent, taskId: string, mode: 'move' | 'resize-start' | 'resize-end') => {
      if (!editable) return;

      const task = tasks.find(t => t.id === taskId);
      if (!task) return;

      setDragState({
        isDragging: true,
        taskId,
        startX: e.clientX,
        startDate: task.startDate,
        mode,
      });

      play('drag_start');
    }, [editable, tasks, play]);

    // Handle task drag
    const handleTaskDrag = useCallback((e: React.MouseEvent) => {
      if (!dragState.isDragging || !dragState.taskId || !dragState.startX || !dragState.startDate) return;

      const deltaX = e.clientX - dragState.startX;
      const totalDuration = dateRange.end.getTime() - dateRange.start.getTime();
      const timePerPixel = totalDuration / (timeColumns.length * columnWidth);
      const deltaTime = deltaX * timePerPixel;

      const task = tasks.find(t => t.id === dragState.taskId);
      if (!task) return;

      if (dragState.mode === 'move') {
        const newStartDate = new Date(dragState.startDate.getTime() + deltaTime);
        const taskDuration = task.endDate.getTime() - task.startDate.getTime();
        const newEndDate = new Date(newStartDate.getTime() + taskDuration);
        
        onTaskMove?.(dragState.taskId, newStartDate, newEndDate);
      } else if (dragState.mode === 'resize-end') {
        const newEndDate = new Date(task.endDate.getTime() + deltaTime);
        if (newEndDate > task.startDate) {
          onTaskResize?.(dragState.taskId, task.startDate, newEndDate);
        }
      } else if (dragState.mode === 'resize-start') {
        const newStartDate = new Date(task.startDate.getTime() + deltaTime);
        if (newStartDate < task.endDate) {
          onTaskResize?.(dragState.taskId, newStartDate, task.endDate);
        }
      }
    }, [dragState, dateRange, timeColumns.length, columnWidth, tasks, onTaskMove, onTaskResize]);

    // Handle task drag end
    const handleTaskDragEnd = useCallback(() => {
      if (dragState.isDragging) {
        setDragState({ isDragging: false });
        play('drag_end');
      }
    }, [dragState.isDragging, play]);

    // Handle progress update
    const handleProgressUpdate = useCallback((taskId: string, e: React.MouseEvent, progressBarWidth: number) => {
      if (!editable) return;

      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const progress = Math.max(0, Math.min(100, (x / progressBarWidth) * 100));
      
      onProgressUpdate?.(taskId, Math.round(progress));
      play('progress_update');
    }, [editable, onProgressUpdate, play]);

    // Format date for header
    const formatHeaderDate = useCallback((date: Date) => {
      switch (timeScale.unit) {
        case 'day':
          return date.getDate().toString();
        case 'week':
          return `W${Math.ceil(date.getDate() / 7)}`;
        case 'month':
          return date.toLocaleDateString('default', { month: 'short' });
        case 'quarter':
          return `Q${Math.ceil((date.getMonth() + 1) / 3)}`;
        case 'year':
          return date.getFullYear().toString();
        default:
          return date.toLocaleDateString();
      }
    }, [timeScale.unit]);

    // Organize tasks by hierarchy
    const organizedTasks = useMemo(() => {
      if (!showHierarchy) return tasks;

      const taskMap = new Map(tasks.map((task: any) => [task.id, task]));
      const roots: GanttTask[] = [];
      const children = new Map<string, GanttTask[]>();

      // Build hierarchy
      tasks.forEach((task: any) => {
        if (task.parent) {
          const parentChildren = children.get(task.parent) || [];
          parentChildren.push(task);
          children.set(task.parent, parentChildren);
        } else {
          roots.push(task);
        }
      });

      // Flatten with hierarchy
      const flattened: GanttTask[] = [];
      const addTasksRecursively = (taskList: GanttTask[], level = 0) => {
        taskList.forEach((task: any) => {
          flattened.push({ ...task, customData: { ...task.customData, level } });
          const taskChildren = children.get(task.id);
          if (taskChildren) {
            addTasksRecursively(taskChildren, level + 1);
          }
        });
      };

      addTasksRecursively(roots);
      return flattened;
    }, [tasks, showHierarchy]);

    // Default task renderer
    const defaultRenderTask = useCallback((task: GanttTask, bounds: { x: number; width: number; y: number; height: number }) => {
      const isSelected = selectedTask === task.id;
      const isHovered = hoveredTask === task.id;
      const level = (task.customData?.level as number) || 0;

      if (task.milestone) {
        return (
          <div data-glass-component
            className={cn(
              'absolute flex items-center justify-center cursor-pointer',
              'transform rotate-45 border-2',
              task.color ? `border-[${task.color}] bg-[${task.color}]/20` : 'border-primary bg-primary/20',
              isSelected && 'ring-2 ring-primary/50',
              isHovered && 'scale-110'
            )}
            style={{
              left: bounds.x,
              top: bounds.y + bounds.height / 4,
              width: bounds.height / 2,
              height: bounds.height / 2,
            }}
            onClick={() => onTaskClick?.(task)}
            onMouseEnter={() => setHoveredTask(task.id)}
            onMouseLeave={() => setHoveredTask(null)}
            title={`${task.name} (Milestone)`}
          />
        );
      }

      return (
        <OptimizedGlass
          elevation="level2"
          intensity="medium"
          depth={1}
          tint="neutral"
          border="subtle"
          className={cn(
            'absolute cursor-pointer transition-all duration-200',
            'backdrop-blur-sm border border-border/20 glass-radius-md',
            task.priority && priorityColors[task.priority],
            isSelected && 'ring-2 ring-primary/50',
            isHovered && 'shadow-lg scale-[1.02]'
          )}
          style={{
            left: bounds.x,
            top: bounds.y + 4,
            width: bounds.width,
            height: bounds.height - 8,
            marginLeft: showHierarchy ? level * 20 : 0,
          }}
          onClick={() => {
            setSelectedTask(task.id);
            onTaskClick?.(task);
          }}
          onMouseEnter={() => setHoveredTask(task.id)}
          onMouseLeave={() => setHoveredTask(null)}
          onMouseDown={(e: React.MouseEvent) => handleTaskDragStart(e, task.id, 'move')}
        >
          {/* Task Bar */}
          <div className="relative h-full flex items-center">
            {/* Status Color */}
            <div 
              className={cn(
                'absolute left-0 top-0 h-full w-1 rounded-l',
                task.status ? statusColors[task.status] : statusColors['not-started']
              )} 
            />

            {/* Progress Bar */}
            {viewOptions.showProgress && task.progress > 0 && (
              <div
                className="absolute left-1 glass-top-1 bottom-1 glass-surface-primary/30 glass-radius-sm transition-all duration-300"
                style={{ width: `${(task.progress / 100) * (bounds.width - 8)}px` }}
                onClick={(e: React.MouseEvent) => handleProgressUpdate(task.id, e, bounds.width - 8)}
              />
            )}

            {/* Task Content */}
            <div className="flex-1 px-3 min-w-0">
              <div className="text-sm font-medium text-primary truncate">
                {task.name}
              </div>
              {viewOptions.showResources && task.assignee && (
                <div className="text-xs glass-text-secondary truncate">
                  {task.assignee.name}
                </div>
              )}
            </div>

            {/* Progress Percentage */}
            {viewOptions.showProgress && (
              <div className="text-xs glass-text-secondary px-2">
                {task.progress}%
              </div>
            )}

            {/* Resize Handles */}
            {editable && isSelected && (
              <>
                <div
                  className="absolute left-0 top-0 bottom-0 w-1 cursor-ew-resize glass-surface-primary/20 hover:glass-surface-primary/40"
                  onMouseDown={(e: React.MouseEvent) => handleTaskDragStart(e, task.id, 'resize-start')}
                />
                <div
                  className="absolute right-0 top-0 bottom-0 w-1 cursor-ew-resize glass-surface-primary/20 hover:glass-surface-primary/40"
                  onMouseDown={(e: React.MouseEvent) => handleTaskDragStart(e, task.id, 'resize-end')}
                />
              </>
            )}
          </div>
        </OptimizedGlass>
      );
    }, [
      selectedTask,
      hoveredTask,
      priorityColors,
      statusColors,
      showHierarchy,
      viewOptions.showProgress,
      viewOptions.showResources,
      editable,
      onTaskClick,
      handleTaskDragStart,
      handleProgressUpdate
    ]);

    // Handle scroll synchronization
    const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
      const scrollLeft = e.currentTarget.scrollLeft;
      const scrollTop = e.currentTarget.scrollTop;
      
      setScrollPosition({ x: scrollLeft, y: scrollTop });
      
      if (timelineRef.current) {
        timelineRef.current.scrollLeft = scrollLeft;
      }
      if (taskListRef.current) {
        taskListRef.current.scrollTop = scrollTop;
      }
    }, []);

    return (
      <OptimizedGlass
        ref={ref}
        id={ganttId}
        elevation="level1"
        intensity="subtle"
        depth={1}
        tint="neutral"
        border="subtle"
        className={cn(
          'glass-gantt-chart glass-radius-lg backdrop-blur-md border border-border/20 overflow-hidden',
          className
        )}
        style={{ height }}
        onMouseMove={handleTaskDrag}
        onMouseUp={handleTaskDragEnd}
        onMouseLeave={handleTaskDragEnd}
        {...props}
      >
        <Motion
          preset={shouldAnimate && respectMotionPreference ? "fadeIn" : "none"}
          className="h-full flex flex-col"
        >
          {/* Header */}
          <div className="flex border-b border-glass-border/20">
            {/* Task List Header */}
            <div className="w-64 p-4 border-r border-glass-border/20 glass-surface-overlay">
              <h3 className="text-sm font-semibold text-primary">Tasks</h3>
            </div>

            {/* Timeline Header */}
            <div
              ref={timelineRef}
              className="flex-1 overflow-x-hidden glass-surface-overlay"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <div 
                className="flex h-16"
                style={{ width: timeColumns.length * columnWidth }}
              >
                {timeColumns.map((date, index) => {
                  const isToday = viewOptions.showToday && 
                    date.toDateString() === new Date().toDateString();
                  const isWeekend = !viewOptions.showWeekends && (date.getDay() === 0 || date.getDay() === 6);

                  return (
                    <div
                      key={index}
                      className={cn(
                        'flex-shrink-0 border-r border-border/10 flex items-center justify-center glass-text-xs',
                        isToday && 'bg-primary/10 text-primary font-semibold',
                        isWeekend && 'bg-muted/20 glass-text-secondary'
                      )}
                      style={{ width: columnWidth }}
                    >
                      {renderTimelineHeader ? renderTimelineHeader(date, timeScale.unit) : formatHeaderDate(date)}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-1 overflow-hidden">
            {/* Task List */}
            <div 
              ref={taskListRef}
              className="w-64 border-r border-glass-border/20 overflow-y-hidden glass-surface-overlay"
            >
              <div>
                {organizedTasks.map((task, index) => {
                  const level = (task.customData?.level as number) || 0;
                  
                  return (
                    <Motion
                      key={task.id}
                      preset={shouldAnimate && respectMotionPreference ? "slideUp" : "none"}
                      delay={index * 50}
                    >
                      <div
                        className={cn(
                          'flex items-center glass-p-2 border-b border-border/10 cursor-pointer transition-colors',
                          'hover:bg-background/40',
                          selectedTask === task.id && 'bg-primary/10 text-primary'
                        )}
                        style={{ 
                          height: rowHeight,
                          paddingLeft: showHierarchy ? 8 + (level * 16) : 8 
                        }}
                        onClick={() => {
                          setSelectedTask(task.id);
                          onTaskClick?.(task);
                        }}
                      >
                        {showHierarchy && task.children && task.children.length > 0 && (
                          <button className="glass-mr-2 glass-text-secondary hover:text-primary">
                            ▼
                          </button>
                        )}
                        
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-primary truncate">
                            {task.name}
                          </div>
                          {task.assignee && (
                            <div className="text-xs glass-text-secondary truncate">
                              {task.assignee.name}
                            </div>
                          )}
                        </div>

                        {task.milestone && (
                          <div className="w-3 h-3 glass-surface-primary glass-radius-full transform rotate-45 glass-ml-2" />
                        )}
                      </div>
                    </Motion>
                  );
                })}
              </div>
            </div>

            {/* Chart Area */}
            <div 
              ref={chartRef}
              className="flex-1 overflow-auto relative"
              onScroll={handleScroll}
            >
              <div 
                className="relative"
                style={{ 
                  width: timeColumns.length * columnWidth,
                  height: organizedTasks.length * rowHeight
                }}
              >
                {/* Grid Lines */}
                <div className="absolute inset-0">
                  {/* Vertical lines */}
                  {timeColumns.map((date, index) => {
                    const isToday = viewOptions.showToday && 
                      date.toDateString() === new Date().toDateString();
                    const isWeekend = date.getDay() === 0 || date.getDay() === 6;

                    return (
                      <div
                        key={index}
                        className={cn(
                          'absolute top-0 bottom-0 border-r',
                          isToday ? 'border-primary/50 bg-primary/5' : 'border-border/10',
                          !viewOptions.showWeekends && isWeekend && 'bg-muted/10'
                        )}
                        style={{ left: index * columnWidth }}
                      />
                    );
                  })}

                  {/* Horizontal lines */}
                  {organizedTasks.map((_, index) => (
                    <div
                      key={index}
                      className="absolute left-0 right-0 border-b border-glass-border/10"
                      style={{ top: (index + 1) * rowHeight }}
                    />
                  ))}
                </div>

                {/* Tasks */}
                {organizedTasks.map((task, index) => {
                  const position = getTaskPosition(task);
                  const bounds = {
                    x: position.x,
                    width: position.width,
                    y: index * rowHeight,
                    height: rowHeight,
                  };

                  return (
                    <Motion
                      key={task.id}
                      preset={shouldAnimate && respectMotionPreference ? "slideRight" : "none"}
                      delay={index * 100}
                    >
                      {renderTask ? renderTask(task, bounds) : defaultRenderTask(task, bounds)}
                    </Motion>
                  );
                })}

                {/* Dependencies */}
                {viewOptions.showDependencies && organizedTasks.map((task: any) => 
                  task.dependencies?.map((depId: any) => {
                    const depTask = organizedTasks.find(t => t.id === depId);
                    if (!depTask) return null;

                    const taskIndex = organizedTasks.indexOf(task);
                    const depIndex = organizedTasks.indexOf(depTask);
                    const taskPos = getTaskPosition(task);
                    const depPos = getTaskPosition(depTask);

                    return (
                      <svg
                        key={`${task.id}-${depId}`}
                        className="absolute pointer-events-none"
                        style={{
                          left: 0,
                          top: 0,
                          width: '100%',
                          height: '100%',
                        }}
                      >
                        <line
                          x1={depPos.x + depPos.width}
                          y1={depIndex * rowHeight + rowHeight / 2}
                          x2={taskPos.x}
                          y2={taskIndex * rowHeight + rowHeight / 2}
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeDasharray="4,4"
                          className="text-primary/40"
                        />
                        <polygon
                          points={`${taskPos.x - 6},${taskIndex * rowHeight + rowHeight / 2 - 3} ${taskPos.x},${taskIndex * rowHeight + rowHeight / 2} ${taskPos.x - 6},${taskIndex * rowHeight + rowHeight / 2 + 3}`}
                          fill="currentColor"
                          className="text-primary/40"
                        />
                      </svg>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </Motion>
      </OptimizedGlass>
    );
  }
);

GlassGanttChart.displayName = 'GlassGanttChart';

export default GlassGanttChart;