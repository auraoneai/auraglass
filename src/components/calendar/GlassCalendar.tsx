'use client';
import { cn } from "../../lib/utilsComprehensive";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Users,
} from "lucide-react";
import React, { useMemo, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Motion } from "../../primitives";
import { GlassButton } from "../button";
import { CardContent, CardHeader, CardTitle, GlassCard } from "../card";

export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  startTime?: string;
  endTime?: string;
  description?: string;
  location?: string;
  attendees?: string[];
  type?: "meeting" | "event" | "reminder" | "task";
  color?: string;
}

export interface GlassCalendarProps {
  /**
   * Currently selected date
   */
  selectedDate?: Date;
  /**
   * Callback when date is selected
   */
  onDateSelect?: (date: Date) => void;
  /**
   * Events to display on the calendar
   */
  events?: CalendarEvent[];
  /**
   * Calendar view mode
   */
  view?: "month" | "week" | "day";
  /**
   * Show events in calendar cells
   */
  showEvents?: boolean;
  /**
   * Highlight today's date
   */
  showToday?: boolean;
  /**
   * Show weekend days
   */
  showWeekends?: boolean;
  /**
   * Custom date formatting
   */
  dateFormat?: "short" | "long" | "numeric";
  /**
   * Locale for date formatting
   */
  locale?: string;
  /**
   * Minimum selectable date
   */
  minDate?: Date;
  /**
   * Maximum selectable date
   */
  maxDate?: Date;
  /**
   * Custom className
   */
  className?: string;
  /**
   * Loading state
   */
  loading?: boolean;
}

/**
 * GlassCalendar component
 * A full-featured calendar with glassmorphism styling and event support
 */
export const GlassCalendar: React.FC<GlassCalendarProps> = ({
  selectedDate,
  onDateSelect,
  events = [],
  view = "month",
  showEvents = true,
  showToday = true,
  showWeekends = true,
  dateFormat = "short",
  locale = "en-US",
  minDate,
  maxDate,
  className,
  loading = false,
  ...props
}) => {
  const prefersReducedMotion = useReducedMotion();
  const [currentDate, setCurrentDate] = useState(selectedDate || new Date());
  const [selectedDateState, setSelectedDateState] = useState<Date | null>(
    selectedDate || null
  );

  // Get events for a specific date - OPTIMIZED with memoization
  const eventsByDate = useMemo(() => {
    const eventMap = new Map<string, CalendarEvent[]>();

    if (!events || !Array.isArray(events)) return eventMap;

    events.forEach((event: any) => {
      const eventDate = new Date(event.date);
      const dateKey = eventDate.toDateString();

      if (!eventMap.has(dateKey)) {
        eventMap.set(dateKey, []);
      }
      eventMap.get(dateKey)!.push(event);
    });

    return eventMap;
  }, [events]);

  const getEventsForDate = (date: Date) => {
    return eventsByDate.get(date.toDateString()) || [];
  };

  // Get month data
  const monthData = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const weeks: Date[][] = [];
    let currentWeek: Date[] = [];
    const currentDateIter = new Date(startDate);

    // SAFE calendar generation - prevent infinite loops
    let dayCount = 0;
    const maxDays = 42; // 6 weeks max = prevent infinite loops

    while (
      dayCount < maxDays &&
      (currentDateIter <= lastDay || currentWeek.length < 7)
    ) {
      currentWeek.push(new Date(currentDateIter));

      if (currentWeek.length === 7) {
        weeks.push([...currentWeek]);
        currentWeek = [];
      }

      currentDateIter.setDate(currentDateIter.getDate() + 1);
      dayCount++;

      // Safety break for full weeks
      if (weeks.length >= 6) break;
    }

    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }

    return {
      year,
      month,
      monthName: new Intl.DateTimeFormat(locale, { month: "long" }).format(
        currentDate
      ),
      weeks,
    };
  }, [currentDate, locale]);

  // Navigate to previous/next month
  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev: any) => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  // Check if date is today
  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  // Check if date is selected
  const isSelected = (date: Date) => {
    return (
      selectedDateState &&
      date.toDateString() === selectedDateState.toDateString()
    );
  };

  // Check if date is in current month
  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  // Check if date is disabled
  const isDisabled = (date: Date) => {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };

  // Handle date click
  const handleDateClick = (date: Date) => {
    if (isDisabled(date)) return;

    setSelectedDateState(date);
    onDateSelect?.(date);
  };

  // Get event type color
  const getEventColor = (event: CalendarEvent) => {
    if (event.color) return event.color;

    switch (event.type) {
      case "meeting":
        return "bg-blue-500/80";
      case "event":
        return "bg-green-500/80";
      case "reminder":
        return "bg-yellow-500/80";
      case "task":
        return "bg-purple-500/80";
      default:
        return "bg-gray-500/80";
    }
  };

  // Loading skeleton
  if (loading) {
    return (
      <GlassCard data-glass-component className={cn("glass-p-6", className)}>
        <div className='animate-pulse glass-gap-4'>
          <div className="glass-flex glass-items-center glass-justify-between">
            <div className='h-8 glass-surface-subtle/20 glass-radius-md w-32 glass-contrast-guard'></div>
            <div className="glass-flex glass-gap-2">
              <div className='w-8 h-8 glass-surface-subtle/20 glass-radius-md glass-contrast-guard'></div>
              <div className='w-8 h-8 glass-surface-subtle/20 glass-radius-md glass-contrast-guard'></div>
            </div>
          </div>
          <div className="glass-grid glass-grid-cols-7 glass-gap-2">
            {Array.from({ length: 35 }).map((_: any, i: any) => (
              <div
                key={i}
                className='aspect-square glass-surface-subtle/10 glass-radius-lg glass-contrast-guard'
              ></div>
            ))}
          </div>
        </div>
      </GlassCard>
    );
  }

  return (
    <div className="glass-w-full glass-typography-reset">
      <GlassCard
        variant="elevated"
        className={cn("overflow-hidden", className)}
        {...props}
      >
        {/* Calendar Header */}
        <CardHeader className="glass-border-b glass-border-white/10">
          <div className="glass-flex glass-items-center glass-justify-between">
            <CardTitle className='glass-subheading font-semibold text-primary glass-flex glass-items-center glass-gap-2'>
              <CalendarIcon className='w-6 h-6' />
              {monthData.monthName} {monthData.year}
            </CardTitle>

            <div className="glass-flex glass-items-center glass-gap-2">
              {/* Month navigation: glass morphism buttons */}
              <GlassButton
                variant="tertiary"
                size="sm"
                onClick={(e) => navigateMonth("prev")}
                disabled={loading}
                elevation="level1"
                intensity="medium"
                tint="neutral"
                border="subtle"
                aria-label="Previous month"
              >
                <ChevronLeft className='w-4 h-4 glass-focus glass-touch-target glass-contrast-guard' />
              </GlassButton>

              <GlassButton
                variant="tertiary"
                size="sm"
                onClick={(e) => setCurrentDate(new Date())}
                disabled={loading}
                elevation="level1"
                intensity="medium"
                tint="neutral"
                border="subtle"
              >
                Today
              </GlassButton>

              <GlassButton
                variant="tertiary"
                size="sm"
                onClick={(e) => navigateMonth("next")}
                disabled={loading}
                elevation="level1"
                intensity="medium"
                tint="neutral"
                border="subtle"
                aria-label="Next month"
              >
                <ChevronRight className='w-4 h-4 glass-focus glass-touch-target glass-contrast-guard' />
              </GlassButton>
            </div>
          </div>
        </CardHeader>

        {/* Calendar Grid */}
        <CardContent className="glass-p-4">
          {/* Week day headers */}
          <div
            className='glass-grid glass-gap-2 mb-4'
            style={{
              gridTemplateColumns: `repeat(${showWeekends ? 7 : 5}, minmax(0, 1fr))`,
            }}
          >
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
              (day, index) => {
                const isWeekend = index === 0 || index === 6;
                if (!showWeekends && isWeekend) return null;

                return (
                  <div
                    key={day}
                    className={cn(
                      "text-center glass-body font-medium glass-py-2 glass-radius-lg",
                      isWeekend
                        ? "glass-text-primary/60"
                        : "glass-text-primary/80"
                    )}
                  >
                    {day}
                  </div>
                );
              }
            )}
          </div>

          {/* Calendar days */}
          <div
            className="glass-grid glass-gap-2"
            style={{
              gridTemplateColumns: `repeat(${showWeekends ? 7 : 5}, minmax(0, 1fr))`,
            }}
          >
            {monthData.weeks.flat().map((date, index) => {
              const dateKey = date.toDateString();
              const dayEvents = eventsByDate.get(dateKey) || [];
              const hasEvents = dayEvents.length > 0;
              const isWeekend = date.getDay() === 0 || date.getDay() === 6;

              if (!showWeekends && isWeekend) return null;

              return (
                <div
                  key={`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`}
                  className='aspect-square'
                >
                  <button
                    onClick={(e) => handleDateClick(date)}
                    disabled={isDisabled(date)}
                    className={cn(
                      "w-full h-full glass-radius-lg transition-all duration-200 glass-focus glass-accent-primary glass-touch-target glass-contrast-guard",
                      "flex flex-col items-center justify-start glass-p-1",
                      "hover:bg-white/10 focus:bg-white/15 focus:outline-none hover:scale-105",
                      "disabled:opacity-50 disabled:cursor-not-allowed",
                      {
                        "glass-foundation-complete glass-glass-backdrop-blur-md bg-transparent border-white/40":
                          isSelected(date) ||
                          (isToday(date) && showToday && !isSelected(date)),
                        "glass-text-primary/60": !isCurrentMonth(date),
                        "glass-text-primary/90": isCurrentMonth(date),
                      }
                    )}
                    aria-label={`Select date ${date.toLocaleDateString(locale, { month: "long", day: "numeric", year: "numeric" })}`}
                  >
                    <span className='glass-body font-medium leading-none glass-touch-target glass-contrast-guard'>
                      {date.getDate()}
                    </span>

                    {/* Events indicator */}
                    {showEvents && hasEvents && (
                      <div className="glass-flex glass-flex-col glass-gap-0.5 glass-mt-1 glass-w-full">
                        {dayEvents.slice(0, 2).map((event) => (
                          <div
                            key={event.id}
                            className={cn(
                              "w-full h-1 glass-radius-full",
                              getEventColor(event)
                            )}
                          />
                        ))}
                        {dayEvents.length > 2 && (
                          <div className='glass-w-full glass-text-xs text-primary/60 text-center'>
                            +{dayEvents.length - 2}
                          </div>
                        )}
                      </div>
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Selected date events */}
          {selectedDateState && showEvents && (
            <div className='mt-6 pt-4 glass-border-t glass-border-white/10'>
              <h3 className='glass-text-lg font-semibold text-primary mb-3'>
                Events for{" "}
                {selectedDateState.toLocaleDateString(locale, {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </h3>

              <div className="glass-gap-3">
                {(eventsByDate.get(selectedDateState.toDateString()) || []).map(
                  (event) => (
                    <div key={event.id} className="glass-w-full">
                      <GlassCard className='glass-foundation-complete glass-glass-glass-backdrop-blur-md bg-transparent glass-border-white/40 glass-shadow-2xl glass-p-4 hover:shadow-2xl hover:bg-transparent transition-all cursor-pointer glass-contrast-guard'>
                        <div className="glass-flex glass-items-start glass-gap-3">
                          <div
                            className={cn(
                              "w-3 h-3 glass-radius-full glass-mt-2 flex-shrink-0",
                              getEventColor(event)
                            )}
                          />

                          <div className="glass-flex-1 glass-min-w-0">
                            <h4 className='font-medium text-primary glass-text-sm'>
                              {event.title}
                            </h4>

                            <div className='glass-flex glass-items-center glass-gap-4 glass-mt-2 glass-text-xs text-primary/70'>
                              {event.startTime && (
                                <div className="glass-flex glass-items-center glass-gap-1">
                                  <Clock className='w-3 h-3' />
                                  {event.startTime}
                                  {event.endTime && ` - ${event.endTime}`}
                                </div>
                              )}

                              {event.location && (
                                <div className="glass-flex glass-items-center glass-gap-1">
                                  <MapPin className='w-3 h-3' />
                                  {event.location}
                                </div>
                              )}

                              {event.attendees &&
                                event.attendees.length > 0 && (
                                  <div className="glass-flex glass-items-center glass-gap-1">
                                    <Users className='w-3 h-3' />
                                    {event.attendees.length} attendee
                                    {event.attendees.length !== 1 ? "s" : ""}
                                  </div>
                                )}
                            </div>

                            {event.description && (
                              <p className='glass-text-xs text-primary/60 glass-mt-2 line-clamp-2'>
                                {event.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </GlassCard>
                    </div>
                  )
                )}

                {(eventsByDate.get(selectedDateState.toDateString()) || [])
                  .length === 0 && (
                  <div className='text-center text-primary/50 glass-py-8'>
                    No events scheduled for this date
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </GlassCard>
    </div>
  );
};

// Calendar Event Card Component
export interface GlassCalendarEventCardProps {
  event: CalendarEvent;
  compact?: boolean;
  onClick?: () => void;
  className?: string;
}

export const GlassCalendarEventCard: React.FC<GlassCalendarEventCardProps> = ({
  event,
  compact = false,
  onClick,
  className,
}) => {
  const getEventTypeIcon = (type?: string) => {
    switch (type) {
      case "meeting":
        return <Users className='w-4 h-4' />;
      case "event":
        return <CalendarIcon className='w-4 h-4' />;
      case "reminder":
        return <Clock className='w-4 h-4' />;
      default:
        return <CalendarIcon className='w-4 h-4' />;
    }
  };

  const getEventColor = (event: CalendarEvent) => {
    if (event.color) return event.color;

    switch (event.type) {
      case "meeting":
        return "border-l-blue-500";
      case "event":
        return "border-l-green-500";
      case "reminder":
        return "border-l-yellow-500";
      case "task":
        return "border-l-purple-500";
      default:
        return "border-l-gray-500";
    }
  };

  if (compact) {
    return (
      <div
        className={cn(
          "flex items-center glass-gap-2 glass-p-2 glass-radius-lg border-l-4 bg-white/5",
          getEventColor(event),
          onClick && "cursor-pointer hover:bg-white/10 transition-colors",
          className
        )}
        onClick={onClick}
      >
        {getEventTypeIcon(event.type)}
        <div className="glass-flex-1 glass-min-w-0 glass-focus glass-touch-target glass-contrast-guard">
          <p className='glass-text-sm font-medium text-primary truncate'>
            {event.title}
          </p>
          {event.startTime && (
            <p className='glass-text-xs text-primary/60'>{event.startTime}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <GlassCard
      variant="outline"
      className={cn(
        "glass-p-4",
        onClick && "cursor-pointer hover:bg-white/5 transition-colors",
        className
      )}
      onClick={onClick}
    >
      <div className="glass-flex glass-items-start glass-gap-3 glass-focus glass-touch-target glass-contrast-guard">
        <div
          className={cn(
            "glass-p-2 glass-radius-lg bg-white/10",
            getEventColor(event).replace("border-l-", "text-")
          )}
        >
          {getEventTypeIcon(event.type)}
        </div>

        <div className="glass-flex-1 glass-min-w-0">
          <h3 className='font-medium text-primary'>{event.title}</h3>

          <div className='glass-flex glass-items-center glass-gap-4 glass-mt-2 glass-text-sm text-primary/70'>
            <div className="glass-flex glass-items-center glass-gap-1">
              <CalendarIcon className='w-4 h-4' />
              {event.date.toLocaleDateString()}
            </div>

            {event.startTime && (
              <div className="glass-flex glass-items-center glass-gap-1">
                <Clock className='w-4 h-4' />
                {event.startTime}
                {event.endTime && ` - ${event.endTime}`}
              </div>
            )}

            {event.location && (
              <div className="glass-flex glass-items-center glass-gap-1">
                <MapPin className='w-4 h-4' />
                {event.location}
              </div>
            )}
          </div>

          {event.description && (
            <p className='glass-text-sm text-primary/60 glass-mt-2'>
              {event.description}
            </p>
          )}

          {event.attendees && event.attendees.length > 0 && (
            <div className="glass-flex glass-items-center glass-gap-1 glass-mt-2">
              <Users className='w-4 h-4 text-primary/60' />
              <span className='glass-text-sm text-primary/60'>
                {event.attendees.join(", ")}
              </span>
            </div>
          )}
        </div>
      </div>
    </GlassCard>
  );
};

export default GlassCalendar;