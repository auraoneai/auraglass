'use client';

import { cn } from '../../lib/utilsComprehensive';
import React, { forwardRef, useState, useCallback, useMemo } from 'react';
import { OptimizedGlass } from '../../primitives';

export interface TransferListItem {
  /**
   * Unique identifier
   */
  id: string | number;
  /**
   * Display label
   */
  label: string;
  /**
   * Optional description
   */
  description?: string;
  /**
   * Whether the item is disabled
   */
  disabled?: boolean;
  /**
   * Optional icon
   */
  icon?: React.ReactNode;
}

export interface GlassTransferListProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /**
   * All available items
   */
  items: TransferListItem[];
  /**
   * Currently selected items (by ID)
   */
  value?: (string | number)[];
  /**
   * Callback when selection changes
   */
  onChange?: (selectedIds: (string | number)[]) => void;
  /**
   * Left list title
   * @default 'Available'
   */
  leftTitle?: string;
  /**
   * Right list title
   * @default 'Selected'
   */
  rightTitle?: string;
  /**
   * Enable search/filter
   * @default true
   */
  searchable?: boolean;
  /**
   * Left list search placeholder
   * @default 'Search available...'
   */
  leftSearchPlaceholder?: string;
  /**
   * Right list search placeholder
   * @default 'Search selected...'
   */
  rightSearchPlaceholder?: string;
  /**
   * Show item count
   * @default true
   */
  showCount?: boolean;
  /**
   * Minimum height of lists
   * @default '300px'
   */
  minHeight?: string;
  /**
   * Maximum height of lists
   * @default '400px'
   */
  maxHeight?: string;
  /**
   * Glassmorphism elevation level
   * @default 'level2'
   */
  elevation?: 'level1' | 'level2' | 'level3' | 'level4' | 'level5';
  /**
   * Whether the component is disabled
   * @default false
   */
  disabled?: boolean;
}

export const GlassTransferList = forwardRef<HTMLDivElement, GlassTransferListProps>(
  (
    {
      items,
      value = [],
      onChange,
      leftTitle = 'Available',
      rightTitle = 'Selected',
      searchable = true,
      leftSearchPlaceholder = 'Search available...',
      rightSearchPlaceholder = 'Search selected...',
      showCount = true,
      minHeight = '300px',
      maxHeight = '400px',
      elevation = 'level2',
      disabled = false,
      className,
      ...props
    },
    ref
  ) => {
    const [leftSearch, setLeftSearch] = useState('');
    const [rightSearch, setRightSearch] = useState('');
    const [leftChecked, setLeftChecked] = useState<Set<string | number>>(new Set());
    const [rightChecked, setRightChecked] = useState<Set<string | number>>(new Set());

    const selectedItems = useMemo(
      () => items.filter((item) => value.includes(item.id)),
      [items, value]
    );

    const availableItems = useMemo(
      () => items.filter((item) => !value.includes(item.id)),
      [items, value]
    );

    const filteredAvailable = useMemo(() => {
      if (!leftSearch) return availableItems;
      return availableItems.filter(
        (item) =>
          item.label.toLowerCase().includes(leftSearch.toLowerCase()) ||
          item.description?.toLowerCase().includes(leftSearch.toLowerCase())
      );
    }, [availableItems, leftSearch]);

    const filteredSelected = useMemo(() => {
      if (!rightSearch) return selectedItems;
      return selectedItems.filter(
        (item) =>
          item.label.toLowerCase().includes(rightSearch.toLowerCase()) ||
          item.description?.toLowerCase().includes(rightSearch.toLowerCase())
      );
    }, [selectedItems, rightSearch]);

    const handleToggle = useCallback(
      (id: string | number, isLeft: boolean) => {
        if (disabled) return;

        const checked = isLeft ? leftChecked : rightChecked;
        const setChecked = isLeft ? setLeftChecked : setRightChecked;

        const newChecked = new Set(checked);
        if (newChecked.has(id)) {
          newChecked.delete(id);
        } else {
          newChecked.add(id);
        }
        setChecked(newChecked);
      },
      [disabled, leftChecked, rightChecked]
    );

    const handleMoveRight = useCallback(() => {
      if (disabled || leftChecked.size === 0) return;

      const newValue = [...value, ...Array.from(leftChecked)];
      onChange?.(newValue);
      setLeftChecked(new Set());
    }, [disabled, leftChecked, value, onChange]);

    const handleMoveLeft = useCallback(() => {
      if (disabled || rightChecked.size === 0) return;

      const newValue = value.filter((id) => !rightChecked.has(id));
      onChange?.(newValue);
      setRightChecked(new Set());
    }, [disabled, rightChecked, value, onChange]);

    const handleMoveAllRight = useCallback(() => {
      if (disabled) return;

      const allIds = availableItems.filter((item) => !item.disabled).map((item) => item.id);
      onChange?.([...value, ...allIds]);
      setLeftChecked(new Set());
    }, [disabled, availableItems, value, onChange]);

    const handleMoveAllLeft = useCallback(() => {
      if (disabled) return;

      onChange?.([]);
      setRightChecked(new Set());
    }, [disabled, onChange]);

    const renderList = (
      listItems: TransferListItem[],
      checked: Set<string | number>,
      onToggle: (id: string | number) => void,
      search: string,
      setSearch: (value: string) => void,
      searchPlaceholder: string,
      title: string,
      isLeft: boolean
    ) => (
      <div className="flex-1 flex flex-col">
        <div className="glass-p-3 border-b glass-border-subtle">
          <div className="flex items-center justify-between mb-2">
            <h3 className="glass-text-base font-semibold glass-text-primary">{title}</h3>
            {showCount && (
              <span className="glass-text-sm glass-text-secondary">
                {listItems.length} item{listItems.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          {searchable && (
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={searchPlaceholder}
              disabled={disabled}
              className={cn(
                'w-full glass-p-2 glass-radius-md',
                'glass-text-sm glass-text-primary',
                'bg-white/5 border glass-border-subtle',
                'focus:outline-none glass-focus',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            />
          )}
        </div>
        <div
          className="flex-1 overflow-y-auto glass-p-2"
          style={{ minHeight, maxHeight }}
        >
          {listItems.length === 0 ? (
            <div className="flex items-center justify-center h-full glass-text-secondary glass-text-sm">
              No items
            </div>
          ) : (
            <div className="space-y-1">
              {listItems.map((item) => (
                <label
                  key={item.id}
                  className={cn(
                    'flex items-start gap-3 glass-p-2 glass-radius-md',
                    'cursor-pointer transition-all duration-200',
                    'hover:bg-white/5',
                    checked.has(item.id) && 'bg-white/10',
                    item.disabled && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  <input
                    type="checkbox"
                    checked={checked.has(item.id)}
                    onChange={() => onToggle(item.id)}
                    disabled={disabled || item.disabled}
                    className="mt-0.5 glass-focus"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {item.icon && (
                        <span className="flex-shrink-0">{item.icon}</span>
                      )}
                      <span className="glass-text-sm glass-text-primary font-medium truncate">
                        {item.label}
                      </span>
                    </div>
                    {item.description && (
                      <p className="glass-text-xs glass-text-secondary mt-1 truncate">
                        {item.description}
                      </p>
                    )}
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
    );

    const TransferButton = ({
      onClick,
      icon,
      disabled: btnDisabled,
      label,
    }: {
      onClick: () => void;
      icon: React.ReactNode;
      disabled?: boolean;
      label: string;
    }) => (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled || btnDisabled}
        className={cn(
          'glass-p-2 glass-radius-md',
          'transition-all duration-200',
          'hover:bg-white/10 active:bg-white/20',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'glass-text-primary',
          'glass-focus'
        )}
        aria-label={label}
        title={label}
      >
        {icon}
      </button>
    );

    return (
      <OptimizedGlass data-glass-component
        ref={ref}
        elevation={elevation}
        className={cn('flex gap-4 glass-p-4 glass-radius-lg', className)}
        {...props}
      >
        {renderList(
          filteredAvailable,
          leftChecked,
          (id) => handleToggle(id, true),
          leftSearch,
          setLeftSearch,
          leftSearchPlaceholder,
          leftTitle,
          true
        )}

        <div className="flex flex-col justify-center gap-2 glass-p-2">
          <TransferButton
            onClick={handleMoveAllRight}
            disabled={availableItems.length === 0}
            label="Move all to selected"
            icon={
              <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
                <path d="M13 5l7 7-7 7M5 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }
          />
          <TransferButton
            onClick={handleMoveRight}
            disabled={leftChecked.size === 0}
            label="Move selected to right"
            icon={
              <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
                <path d="M5 12h14m-7-7l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }
          />
          <TransferButton
            onClick={handleMoveLeft}
            disabled={rightChecked.size === 0}
            label="Move selected to left"
            icon={
              <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
                <path d="M19 12H5m7 7l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }
          />
          <TransferButton
            onClick={handleMoveAllLeft}
            disabled={selectedItems.length === 0}
            label="Move all to available"
            icon={
              <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
                <path d="M11 5l-7 7 7 7M19 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }
          />
        </div>

        {renderList(
          filteredSelected,
          rightChecked,
          (id) => handleToggle(id, false),
          rightSearch,
          setRightSearch,
          rightSearchPlaceholder,
          rightTitle,
          false
        )}
      </OptimizedGlass>
    );
  }
);

GlassTransferList.displayName = 'GlassTransferList';

export default GlassTransferList;
