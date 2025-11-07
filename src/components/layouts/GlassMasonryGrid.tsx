'use client'

import React from 'react';
import { motion, PanInfo } from 'framer-motion'
import { forwardRef, useCallback, useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { useMotionPreference } from '../../hooks/useMotionPreference'
import { OptimizedGlass } from '../../primitives'
import { useA11yId } from '../../utils/a11y'
import { createGlassStyle } from '../../utils/createGlassStyle'
import { useGlassSound } from '../../utils/soundDesign'
import { ContrastGuard, TextWithContrast } from '@/components/accessibility/ContrastGuard';

export interface MasonryItem {
  id: string
  content: React.ReactNode
  height?: number
  aspectRatio?: number
  priority?: number
  category?: string
  metadata?: { [key: string]: any }
}

export interface MasonryConfig {
  columns: number | 'auto'
  gap: number
  minItemWidth: number
  maxItemWidth?: number
  itemPadding: number
  autoResize: boolean
  animationDelay: number
  breakpoints: { [key: number]: number }
}

export interface GlassMasonryGridProps {
  items: MasonryItem[]
  config?: Partial<MasonryConfig>
  showControls?: boolean
  showFilters?: boolean
  showStats?: boolean
  enableVirtualization?: boolean
  enableInfiniteScroll?: boolean
  enableDragReorder?: boolean
  enableSearch?: boolean
  filterBy?: string
  sortBy?: 'id' | 'height' | 'priority' | 'category'
  sortOrder?: 'asc' | 'desc'
  loadingItems?: number
  onItemClick?: (item: MasonryItem, index: number) => void
  onItemsReorder?: (items: MasonryItem[]) => void
  onLoadMore?: () => void
  onFilterChange?: (filter: string) => void
  className?: string
}

const defaultConfig: MasonryConfig = {
  columns: 'auto',
  gap: 16,
  minItemWidth: 200,
  maxItemWidth: 400,
  itemPadding: 12,
  autoResize: true,
  animationDelay: 0.05,
  breakpoints: {
    1200: 4,
    900: 3,
    600: 2,
    400: 1
  }
}

interface LayoutItem extends MasonryItem {
  x: number
  y: number
  width: number
  computedHeight: number
  column: number
}

export const GlassMasonryGrid = forwardRef<HTMLDivElement, GlassMasonryGridProps>(
  ({
  // TODO: Integrate ContrastGuard for any section titles, labels, and helper text for WCAG AA compliance

    items,
    config = {},
    showControls = true,
    showFilters = true,
    showStats = true,
    enableVirtualization = false,
    enableInfiniteScroll = false,
    enableDragReorder = false,
    enableSearch = false,
    filterBy = '',
    sortBy = 'id',
    sortOrder = 'asc',
    loadingItems = 0,
    onItemClick,
    onItemsReorder,
    onLoadMore,
    onFilterChange,
    className='',
    ...props
  }, ref) => {
    const [layoutItems, setLayoutItems] = useState<LayoutItem[]>([])
    const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 })
    const [activeFilter, setActiveFilter] = useState(filterBy)
    const [searchQuery, setSearchQuery] = useState('')
    const [currentSort, setCurrentSort] = useState({ by: sortBy, order: sortOrder })
    const [draggedItem, setDraggedItem] = useState<string | null>(null)
    const [visibleItems, setVisibleItems] = useState<LayoutItem[]>([])
    const [loadingMore, setLoadingMore] = useState(false)
    
    const containerRef = useRef<HTMLDivElement>(null)
    const itemRefs = useRef<{ [key: string]: HTMLDivElement }>({})
    const resizeObserver = useRef<ResizeObserver | null>(null)
    const intersectionObserver = useRef<IntersectionObserver | null>(null)
    
    const [masonryConfig] = useState<MasonryConfig>({
      ...defaultConfig,
      ...config
    })
    
    const id = useA11yId('glass-masonry-grid')
    const { shouldAnimate } = useMotionPreference()
    const { play } = useGlassSound()

    // Calculate optimal number of columns
    const calculateColumns = useCallback((containerWidth: number): number => {
      if (masonryConfig.columns !== 'auto') {
        return masonryConfig.columns as number
      }

      // Use breakpoints to determine columns
      const sortedBreakpoints = Object.entries(masonryConfig.breakpoints)
        .map(([width, cols]) => [parseInt(width), cols] as [number, number])
        .sort((a, b) => b[0] - a[0])

      for (const [breakpoint, columns] of sortedBreakpoints) {
        if (containerWidth >= breakpoint) {
          return columns
        }
      }

      // Fallback calculation
      const availableWidth = containerWidth - (masonryConfig.gap * 2)
      const itemWidthWithGap = masonryConfig.minItemWidth + masonryConfig.gap
      return Math.max(1, Math.floor(availableWidth / itemWidthWithGap))
    }, [masonryConfig])

    // Filter and sort items
    const processItems = useCallback((itemsToProcess: MasonryItem[]): MasonryItem[] => {
      let processed = [...itemsToProcess]

      // Apply search filter
      if (searchQuery.trim()) {
        processed = processed.filter((item: any) => {
          const searchText = searchQuery.toLowerCase()
          return (
            item.id.toLowerCase().includes(searchText) ||
            item.category?.toLowerCase().includes(searchText) ||
            JSON.stringify(item.metadata).toLowerCase().includes(searchText)
          )
        })
      }

      // Apply category filter
      if (activeFilter && activeFilter !== 'all') {
        processed = processed.filter((item: any) => item.category === activeFilter)
      }

      // Sort items
      processed.sort((a, b) => {
        let aVal: any, bVal: any

        switch (currentSort.by) {
          case 'height':
            aVal = a.height || 200
            bVal = b.height || 200
            break
          case 'priority':
            aVal = a.priority || 0
            bVal = b.priority || 0
            break
          case 'category':
            aVal = a.category || ''
            bVal = b.category || ''
            break
          default:
            aVal = a.id
            bVal = b.id
        }

        if (currentSort.order === 'desc') {
          return aVal < bVal ? 1 : aVal > bVal ? -1 : 0
        }
        return aVal > bVal ? 1 : aVal < bVal ? -1 : 0
      })

      return processed
    }, [searchQuery, activeFilter, currentSort])

    // Calculate masonry layout
    const calculateLayout = useCallback((processedItems: MasonryItem[], containerWidth: number): LayoutItem[] => {
      if (!containerWidth || processedItems.length === 0) return []

      const numColumns = calculateColumns(containerWidth)
      const availableWidth = containerWidth - (masonryConfig.gap * (numColumns + 1))
      const itemWidth = Math.min(
        masonryConfig.maxItemWidth || Infinity,
        Math.max(masonryConfig.minItemWidth, availableWidth / numColumns)
      )

      const columnHeights = new Array(numColumns).fill(0)
      const layoutItems: LayoutItem[] = []

      processedItems.forEach((item, index) => {
        // Find shortest column
        const shortestColumn = columnHeights.indexOf(Math.min(...columnHeights))
        
        // Calculate item dimensions
        let itemHeight = item.height || 200
        if (item.aspectRatio) {
          itemHeight = itemWidth / item.aspectRatio
        }
        
        // Position calculation
        const x = masonryConfig.gap + (shortestColumn * (itemWidth + masonryConfig.gap))
        const y = columnHeights[shortestColumn] + (columnHeights[shortestColumn] === 0 ? masonryConfig.gap : masonryConfig.gap)

        const layoutItem: LayoutItem = {
          ...item,
          x,
          y,
          width: itemWidth,
          computedHeight: itemHeight,
          column: shortestColumn
        }

        layoutItems.push(layoutItem)
        columnHeights[shortestColumn] += itemHeight + masonryConfig.gap
      })

      return layoutItems
    }, [calculateColumns, masonryConfig])

    // Update layout when items or container changes
    const updateLayout = useCallback(() => {
      if (!containerRef.current) return

      const containerWidth = containerRef.current.offsetWidth
      const processedItems = processItems(items)
      const newLayoutItems = calculateLayout(processedItems, containerWidth)
      
      setLayoutItems(newLayoutItems)
      const computedHeight = newLayoutItems.length
        ? Math.max(...newLayoutItems.map((item: any) => item.y + item.computedHeight)) + masonryConfig.gap
        : 0;
      setContainerDimensions({
        width: containerWidth,
        height: computedHeight
      })

      // Update visible items for virtualization
      if (enableVirtualization) {
        const container = containerRef.current
        const scrollTop = container.scrollTop
        const viewportHeight = container.offsetHeight
        const buffer = viewportHeight * 0.5

        const visible = newLayoutItems.filter((item: any) => {
          const itemTop = item.y
          const itemBottom = item.y + item.computedHeight
          return itemBottom >= scrollTop - buffer && itemTop <= scrollTop + viewportHeight + buffer
        })

        setVisibleItems(visible)
      } else {
        setVisibleItems(newLayoutItems)
      }
    }, [items, processItems, calculateLayout, masonryConfig, enableVirtualization])

    // Handle resize
    useEffect(() => {
      if (!masonryConfig.autoResize) return

      const handleResize = () => {
        updateLayout()
      }

      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }, [updateLayout, masonryConfig.autoResize])

    // Setup resize observer
    useEffect(() => {
      if (!containerRef.current) return

      resizeObserver.current = new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (entry.target === containerRef.current) {
            updateLayout()
          }
        }
      })

      resizeObserver.current.observe(containerRef.current)

      return () => {
        resizeObserver.current?.disconnect()
      }
    }, [updateLayout])

    // Setup infinite scroll
    useEffect(() => {
      if (!enableInfiniteScroll || !containerRef.current) return

      intersectionObserver.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !loadingMore) {
              setLoadingMore(true)
              onLoadMore?.()
              setTimeout(() => setLoadingMore(false), 1000)
            }
          })
        },
        { threshold: 0.1 }
      )

      // Create sentinel element
      const sentinel = document.createElement('div')
      sentinel.className='masonry-sentinel'
      sentinel.style.height = '1px'
      containerRef.current.appendChild(sentinel)
      intersectionObserver.current.observe(sentinel)

      return () => {
        intersectionObserver.current?.disconnect()
      }
    }, [enableInfiniteScroll, loadingMore, onLoadMore])

    // Initial layout calculation
    useEffect(() => {
      updateLayout()
    }, [updateLayout])

    // Handle drag and drop
    const handleDragStart = useCallback((event: MouseEvent | TouchEvent | PointerEvent, itemId: string) => {
      if (!enableDragReorder) return

      setDraggedItem(itemId)
      play('pickup')
    }, [enableDragReorder, play])


    const handleDrop = useCallback((event: MouseEvent | TouchEvent | PointerEvent, targetItemId: string) => {
      if (!enableDragReorder || !draggedItem) return

      const newItems = [...items]
      const draggedIndex = newItems.findIndex(item => item.id === draggedItem)
      const targetIndex = newItems.findIndex(item => item.id === targetItemId)

      if (draggedIndex !== -1 && targetIndex !== -1) {
        const [draggedItemObj] = newItems.splice(draggedIndex, 1)
        newItems.splice(targetIndex, 0, draggedItemObj)

        onItemsReorder?.(newItems)
        play('place')
      }

      setDraggedItem(null)
    }, [enableDragReorder, draggedItem, items, onItemsReorder, play])

    // Get unique categories for filtering
    const categories = Array.from(new Set(items.map((item: any) => item.category).filter(Boolean)))

    const FilterControls = () => (
      <div className="flex flex-wrap items-center gap-4 mb-6">
        {enableSearch && (
          <div className="flex-1 glass-min-w-48">
            <input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-2 glass-surface-subtle/10 border border-white/20 glass-radius-lg text-primary/90 placeholder-white/50 text-sm"
            />
          </div>
        )}
        
        {showFilters && categories.length > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-primary/70">Filter:</span>
            <select
              value={activeFilter}
              onChange={(e) => {
                setActiveFilter(e.target.value)
                onFilterChange?.(e.target.value)
              }}
              className="p-2 glass-surface-subtle/10 border border-white/20 glass-radius text-primary/90 text-sm"
            >
              <option value="">All</option>
              {categories.map((category: any) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        )}
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-primary/70">Sort:</span>
          <select
            value={currentSort.by}
            onChange={(e) => setCurrentSort((prev: any) => ({ ...prev, by: e.target.value as any }))}
            className="p-2 glass-surface-subtle/10 border border-white/20 glass-radius text-primary/90 text-sm"
          >
            <option value="id">ID</option>
            <option value="height">Height</option>
            <option value="priority">Priority</option>
            <option value="category">Category</option>
          </select>
          
          <button
            onClick={() => setCurrentSort((prev: any) => ({ 
              ...prev, 
              order: prev.order === 'asc' ? 'desc' : 'asc' 
            }))}
            className="p-2 glass-surface-subtle/10 hover:glass-surface-subtle/20 border border-white/20 glass-radius text-primary/90 text-sm transition-colors"
          >
            {currentSort.order === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>
    )

    const StatsPanel = () => {
      const processedItems = processItems(items)
      const totalHeight = Math.max(...layoutItems.map((item: any) => item.y + item.computedHeight))
      const avgHeight = layoutItems.length > 0 ? totalHeight / layoutItems.length : 0

      return (
        <div className={`
          mb-4 p-3 rounded-lg border border-white/10
          ${createGlassStyle({ blur: 'sm', opacity: 0.6 }).background}
        `}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-primary/60">Total Items:</span>
              <div className="text-primary/90 font-medium">{items.length}</div>
            </div>
            <div>
              <span className="text-primary/60">Visible:</span>
              <div className="text-primary/90 font-medium">{processedItems.length}</div>
            </div>
            <div>
              <span className="text-primary/60">Columns:</span>
              <div className="text-primary/90 font-medium">
                {containerDimensions.width ? calculateColumns(containerDimensions.width) : '-'}
              </div>
            </div>
            <div>
              <span className="text-primary/60">Avg Height:</span>
              <div className="text-primary/90 font-medium">{avgHeight.toFixed(0)}px</div>
            </div>
          </div>
        </div>
      )
    }

    return (
      <OptimizedGlass
        ref={ref}
        variant="frosted"
        className={`p-6 ${className}`}
        {...props}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-primary/90">
              Masonry Grid
            </h3>
            <p className="text-sm text-primary/60">
              Pinterest-style dynamic layout system
            </p>
          </div>

          {enableVirtualization && (
            <div className="flex items-center space-x-1 text-primary">
              <div className="w-2 h-2 glass-surface-blue glass-radius-full" />
              <span className="text-xs">Virtualized</span>
            </div>
          )}
        </div>

        {/* Stats */}
        {showStats && <StatsPanel />}

        {/* Controls */}
        {(showControls || showFilters || enableSearch) && <FilterControls />}

        {/* Masonry Container */}
        <div
          ref={containerRef}
          className="relative overflow-auto"
          style={{
            height: enableVirtualization ? '600px' : 'auto',
            maxHeight: enableVirtualization ? '600px' : 'none'
          }}
        >
          <div
            className="relative"
            style={{
              width: '100%',
              height: containerDimensions.height || 'auto',
              minHeight: containerDimensions.height || 200
            }}
          >
            {visibleItems.map((item, index) => (
              <motion.div
                key={item.id}
                ref={(el) => {
                  if (el) itemRefs.current[item.id] = el
                }}
                className={`
                  absolute cursor-pointer transition-all duration-200
                  ${draggedItem === item.id ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}
                  ${enableDragReorder ? 'hover:scale-105' : ''}
                `}
                style={{
                  left: item.x,
                  top: item.y,
                  width: item.width,
                  height: item.computedHeight,
                  zIndex: draggedItem === item.id ? 1000 : 1
                }}
                initial={shouldAnimate ? { opacity: 0, scale: 0.8 } : false}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  delay: shouldAnimate ? index * masonryConfig.animationDelay : 0,
                  duration: 0.3 
                }}
                drag={enableDragReorder}
                onDragStart={(event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => handleDragStart(event as any, item.id)}
                onDragEnd={(event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => handleDrop(event as any, item.id)}
                onClick={() => {
                  onItemClick?.(item, index)
                  play('select')
                }}
              >
                <OptimizedGlass
                  variant="frosted"
                  className="w-full h-full hover:glass-surface-subtle/10 transition-all duration-200"
                  style={{ padding: masonryConfig.itemPadding }}
                >
                  {item.content}
                </OptimizedGlass>
              </motion.div>
            ))}

            {/* Loading items */}
            {loadingItems > 0 && (
              <>
                {Array.from({ length: loadingItems }, (_, i) => (
                  <div
                    key={`loading-${i}`}
                    className="absolute glass-surface-subtle/5 border border-white/20 glass-radius-lg animate-pulse"
                    style={{
                      left: (i % calculateColumns(containerDimensions.width)) * (300 + masonryConfig.gap) + masonryConfig.gap,
                      top: containerDimensions.height + masonryConfig.gap,
                      width: 300,
                      height: 200 + Math.random() * 100
                    }}
                  />
                ))}
              </>
            )}

            {/* Infinite scroll loading indicator */}
            {loadingMore && enableInfiniteScroll && (
              <div 
                className="absolute w-full flex items-center justify-center py-8"
                style={{ top: containerDimensions.height + masonryConfig.gap }}
              >
                <div className="flex items-center space-x-2 text-primary">
                  <div className="w-4 h-4 border-2 border-blue border-t-transparent glass-radius-full animate-spin" />
                  <span className="text-sm">Loading more items...</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/10 text-xs text-primary/60">
          <div className="flex items-center space-x-4">
            {enableDragReorder && <span>Drag items to reorder</span>}
            {enableInfiniteScroll && <span>Scroll to load more</span>}
            {enableVirtualization && <span>Virtualized for performance</span>}
          </div>
          
          <div>
            Grid: {containerDimensions.width}×{containerDimensions.height}px
          </div>
        </div>
      </OptimizedGlass>
    )
  }
)

GlassMasonryGrid.displayName = 'GlassMasonryGrid'
