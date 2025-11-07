'use client';

import { cn } from '../../lib/utilsComprehensive';
import { Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { Motion } from '../../primitives';
import { GlassButton } from '../button';
import { CardContent, GlassCard } from '../card';

export interface DateRange {
    from: Date | null;
    to: Date | null;
}

export interface GlassDateRangePickerProps {
    /**
     * Current date range value
     */
    value?: DateRange;
    /**
     * Default date range value
     */
    defaultValue?: DateRange;
    /**
     * Callback when date range changes
     */
    onChange?: (range: DateRange) => void;
    /**
     * Placeholder text
     */
    placeholder?: string;
    /**
     * Date format for display
     */
    dateFormat?: 'short' | 'long' | 'numeric';
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
     * Disabled state
     */
    disabled?: boolean;
    /**
     * Size variant
     */
    size?: 'sm' | 'md' | 'lg';
    /**
     * Custom className
     */
    className?: string;
    /**
     * Custom className for the popover
     */
    popoverClassName?: string;
    /**
     * Show clear button
     */
    showClear?: boolean;
    /**
     * Predefined date ranges
     */
    presets?: Array<{
        label: string;
        getValue: () => DateRange;
    }>;
    /**
     * Custom range label
     */
    rangeLabel?: string;
}

/**
 * GlassDateRangePicker component
 * A glassmorphism date range picker with calendar interface
 */
export const GlassDateRangePicker: React.FC<GlassDateRangePickerProps> = ({
    value,
    defaultValue,
    onChange,
    placeholder = 'Select date range',
    dateFormat = 'short',
    locale = 'en-US',
    minDate,
    maxDate,
    disabled = false,
    size = 'md',
    className,
    popoverClassName,
    showClear = true,
    presets = [
        {
            label: 'Today',
            getValue: () => {
                const today = new Date();
                return { from: today, to: today };
            }
        },
        {
            label: 'Yesterday',
            getValue: () => {
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                return { from: yesterday, to: yesterday };
            }
        },
        {
            label: 'Last 7 days',
            getValue: () => {
                const today = new Date();
                const lastWeek = new Date();
                lastWeek.setDate(today.getDate() - 6);
                return { from: lastWeek, to: today };
            }
        },
        {
            label: 'Last 30 days',
            getValue: () => {
                const today = new Date();
                const lastMonth = new Date();
                lastMonth.setDate(today.getDate() - 29);
                return { from: lastMonth, to: today };
            }
        },
        {
            label: 'This month',
            getValue: () => {
                const today = new Date();
                const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
                return { from: firstDay, to: today };
            }
        },
        {
            label: 'Last month',
            getValue: () => {
                const today = new Date();
                const firstDay = new Date(today.getFullYear(), today.getMonth() - 1, 1);
                const lastDay = new Date(today.getFullYear(), today.getMonth(), 0);
                return { from: firstDay, to: lastDay };
            }
        }
    ],
    rangeLabel = 'to',
    ...props
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentRange, setCurrentRange] = useState<DateRange>(value || defaultValue || { from: null, to: null });
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectingFrom, setSelectingFrom] = useState(true);

    const triggerRef = useRef<HTMLDivElement>(null);
    const popoverRef = useRef<HTMLDivElement>(null);

    // Size configurations
    const sizeConfigs = {
        sm: { trigger: 'h-8 glass-px-3 glass-text-sm', calendar: 'w-64' },
        md: { trigger: 'h-10 glass-px-4 glass-text-base', calendar: 'w-80' },
        lg: { trigger: 'h-12 glass-px-6 glass-text-lg', calendar: 'w-96' }
    };

    // Update current range when value prop changes
    useEffect(() => {
        if (value) {
            setCurrentRange(value);
        }
    }, [value]);

    // Handle range change
    const handleRangeChange = (newRange: DateRange) => {
        setCurrentRange(newRange);
        onChange?.(newRange);
    };

    // Handle date selection
    const handleDateSelect = (date: Date) => {
        const newRange = { ...currentRange };

        if (selectingFrom || !currentRange.from) {
            newRange.from = date;
            newRange.to = null;
            setSelectingFrom(false);
        } else if (!currentRange.to || date < currentRange.from) {
            newRange.from = date;
            newRange.to = null;
            setSelectingFrom(false);
        } else {
            newRange.to = date;
            setSelectingFrom(true);
            setIsOpen(false);
        }

        handleRangeChange(newRange);
    };

    // Handle preset selection
    const handlePresetSelect = (preset: typeof presets[0]) => {
        const newRange = preset.getValue();
        handleRangeChange(newRange);
        setIsOpen(false);
    };

    // Clear selection
    const handleClear = () => {
        handleRangeChange({ from: null, to: null });
        setSelectingFrom(true);
    };

    // Format date for display
    const formatDate = (date: Date | null) => {
        if (!date) return '';

        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: dateFormat === 'numeric' ? '2-digit' : dateFormat === 'long' ? 'long' : 'short',
            day: '2-digit'
        };

        return new Intl.DateTimeFormat(locale, options).format(date);
    };

    // Get display value
    const getDisplayValue = () => {
        if (!currentRange.from && !currentRange.to) {
            return placeholder;
        }

        if (currentRange.from && !currentRange.to) {
            return `${formatDate(currentRange.from)} ${rangeLabel} ...`;
        }

        if (currentRange.from && currentRange.to) {
            return `${formatDate(currentRange.from)} ${rangeLabel} ${formatDate(currentRange.to)}`;
        }

        return placeholder;
    };

    // Check if date is in range
    const isDateInRange = (date: Date) => {
        if (!currentRange.from || !currentRange.to) return false;
        return date >= currentRange.from && date <= currentRange.to;
    };

    // Check if date is range start or end
    const isRangeBoundary = (date: Date) => {
        if (!currentRange.from && !currentRange.to) return false;
        return (currentRange.from && date.toDateString() === currentRange.from.toDateString()) ||
            (currentRange.to && date.toDateString() === currentRange.to.toDateString());
    };

    // Generate calendar data
    const calendarData = React.useMemo(() => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

        const weeks: Date[][] = [];
        let currentWeek: Date[] = [];
        const currentDateIter = new Date(startDate);

        // Build weeks until we've passed the last day and flushed any partial week
        while (currentDateIter <= lastDay || currentWeek.length > 0) {
            currentWeek.push(new Date(currentDateIter));

            if (currentWeek.length === 7) {
                weeks.push([...currentWeek]);
                currentWeek = [];
                // If we've already passed the month end and just flushed the trailing week, break
                if (currentDateIter > lastDay) break;
            }

            currentDateIter.setDate(currentDateIter.getDate() + 1);
        }

        return {
            year,
            month,
            monthName: new Intl.DateTimeFormat(locale, { month: 'long' }).format(currentMonth),
            weeks
        };
    }, [currentMonth, locale]);

    // Navigate months
    const navigateMonth = (direction: 'prev' | 'next') => {
        setCurrentMonth((prev: any) => {
            const newDate = new Date(prev);
            if (direction === 'prev') {
                newDate.setMonth(newDate.getMonth() - 1);
            } else {
                newDate.setMonth(newDate.getMonth() + 1);
            }
            return newDate;
        });
    };

    // Check if date is disabled
    const isDisabled = (date: Date) => {
        if (minDate && date < minDate) return true;
        if (maxDate && date > maxDate) return true;
        return false;
    };

    // Check if date is today
    const isToday = (date: Date) => {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    };

    // Check if date is in current month
    const isCurrentMonth = (date: Date) => {
        return date.getMonth() === currentMonth.getMonth();
    };

    // Close popover when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                triggerRef.current &&
                !triggerRef.current.contains(event.target as Node) &&
                popoverRef.current &&
                !popoverRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const config = sizeConfigs[size];

    return (
        <div className="relative">
            {/* Trigger */}
            <div
                ref={triggerRef}
                className={cn(
                    'relative flex items-center justify-between bg-white/10 backdrop-blur-md border border-white/20',
                    'glass-radius-lg cursor-pointer transition-all duration-200',
                    'hover:bg-white/15 hover:border-white/30 focus-within:bg-white/15 focus-within:border-white/30',
                    config.trigger,
                    disabled && 'opacity-50 cursor-not-allowed',
                    className
                )}
                onClick={(e) => !disabled && setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Calendar className="w-4 h-4 text-primary/60 flex-shrink-0" />
                    <span className={cn(
                        'truncate',
                        (!currentRange.from && !currentRange.to) ? 'glass-text-primary/50' : 'glass-text-primary'
                    )}>
                        {getDisplayValue()}
                    </span>
                </div>

                <div className="flex items-center gap-1">
                    {showClear && (currentRange.from || currentRange.to) && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleClear();
                            }}
                            className="p-1 hover:glass-surface-subtle/20 glass-radius-md transition-colors"
                        >
                            <X className="w-3 h-3 text-primary/60" />
                        </button>
                    )}
                </div>
            </div>

            {/* Popover */}
            {isOpen && (
                <Motion preset="fadeIn" className="absolute z-50 glass-mt-2">
                    <div
                        ref={popoverRef}
                        className={cn(
                            'bg-black/20 backdrop-blur-md border border-white/20 glass-radius-xl shadow-2xl',
                            config.calendar,
                            popoverClassName
                        )}
                    >
                        <GlassCard variant="outline" className="border-0 bg-transparent">
                            <CardContent className="p-4">
                                <div className="flex gap-6">
                                    {/* Presets */}
                                    {presets && presets.length > 0 && (
                                        <div className="flex-shrink-0">
                                            <h4 className="text-sm font-medium text-primary/80 mb-3">Quick Select</h4>
                                            <div className="gap-1">
                                                {presets.map((preset, index) => (
                                                    <GlassButton
                                                        key={preset.label}
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={(e) => handlePresetSelect(preset)}
                                                        className="w-full justify-start text-left"
                                                    >
                                                        {preset.label}
                                                    </GlassButton>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Calendar */}
                                    <div className="flex-1">
                                        {/* Header */}
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-lg font-semibold text-primary">
                                                {calendarData.monthName} {calendarData.year}
                                            </h3>
                                            <div className="flex gap-1">
                                                <GlassButton
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={(e) => navigateMonth('prev')}
                                                >
                                                    <ChevronLeft className="w-4 h-4" />
                                                </GlassButton>
                                                <GlassButton
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={(e) => navigateMonth('next')}
                                                >
                                                    <ChevronRight className="w-4 h-4" />
                                                </GlassButton>
                                            </div>
                                        </div>

                                        {/* Calendar Grid */}
                                        <div className="gap-2">
                                            {/* Week headers */}
                                            <div className="grid grid-cols-7 gap-1">
                                                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                                                    <div
                                                        key={day}
                                                        className="text-center text-sm font-medium text-primary/60 py-2"
                                                    >
                                                        {day}
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Calendar days */}
                                            <div className="grid grid-cols-7 gap-1">
                                                {calendarData.weeks.flat().map((date, index) => {
                                                    const isInRange = isDateInRange(date);
                                                    const isBoundary = isRangeBoundary(date);
                                                    const isDisabledDate = isDisabled(date);
                                                    const isCurrentMonthDate = isCurrentMonth(date);
                                                    const isTodayDate = isToday(date);

                                                    return (
                                                        <Motion
                                                            key={index}
                                                            preset="scaleIn"
                                                            className="aspect-square"
                                                        >
                                                            <button
                                                                onClick={(e) => !isDisabledDate && handleDateSelect(date)}
                                                                disabled={isDisabledDate}
                                                                className={cn(
                                                                    'w-full h-full glass-radius-lg glass-text-sm font-medium transition-all duration-200',
                                                                    'flex items-center justify-center',
                                                                    'hover:bg-white/20 focus:bg-white/25 focus:outline-none',
                                                                    'disabled:opacity-50 disabled:cursor-not-allowed',
                                                                    {
                                                                        'glass-text-primary/60': !isCurrentMonthDate,
                                                                        'glass-text-primary': isCurrentMonthDate,
                                                                        'bg-primary/20 text-primary-foreground': isBoundary,
                                                                        'bg-primary/10': isInRange && !isBoundary,
                                                                        'bg-white/10 glass-text-primary font-semibold': isTodayDate && !isInRange && !isBoundary,
                                                                        'ring-2 ring-primary/50': isBoundary
                                                                    }
                                                                )}
                                                            >
                                                                {date.getDate()}
                                                            </button>
                                                        </Motion>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* Footer */}
                                        <div className="flex justify-between items-center glass-mt-4 pt-4 border-t border-white/10">
                                            <div className="text-sm text-primary/60">
                                                {selectingFrom ? 'Select start date' : 'Select end date'}
                                            </div>
                                            <div className="flex gap-2">
                                                <GlassButton
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={(e) => setIsOpen(false)}
                                                >
                                                    Cancel
                                                </GlassButton>
                                                <GlassButton
                                                    variant="primary"
                                                    size="sm"
                                                    onClick={(e) => setIsOpen(false)}
                                                >
                                                    Apply
                                                </GlassButton>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </GlassCard>
                    </div>
                </Motion>
            )}
        </div>
    );
};

export default GlassDateRangePicker;
