'use client';

import { GlassButton } from '../button/GlassButton';
import { GlassTooltip } from '../modal/GlassPopover';

import { cn } from '../../lib/utilsComprehensive';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { createContext, forwardRef, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { OptimizedGlass } from '../../primitives';
import { Motion } from '../../primitives';

export interface NavigationItem {
  id: string;
  label: string;
  href?: string;
  icon?: React.ReactNode;
  badge?: string | number;
  children?: NavigationItem[];
  disabled?: boolean;
  onClick?: () => void;
}

export interface GlassSidebarProps {
  /**
   * Navigation items
   */
  items: NavigationItem[];
  /**
   * Currently active item
   */
  activeId?: string;
  /**
   * Sidebar variant
   */
  variant?: 'default' | 'compact' | 'floating' | 'overlay';
  /**
   * Sidebar width
   */
  width?: 'sm' | 'md' | 'lg' | 'xl';
  /**
   * Whether sidebar is collapsible
   */
  collapsible?: boolean;
  /**
   * Whether sidebar is collapsed
   */
  collapsed?: boolean;
  /**
   * Callback when collapsed state changes
   */
  onCollapsedChange?: (collapsed: boolean) => void;
  /**
   * Whether sidebar is open (for mobile/overlay)
   */
  open?: boolean;
  /**
   * Callback when open state changes
   */
  onOpenChange?: (open: boolean) => void;
  /**
   * Sidebar header content
   */
  header?: React.ReactNode;
  /**
   * Sidebar footer content
   */
  footer?: React.ReactNode;
  /**
   * Custom logo/brand
   */
  logo?: React.ReactNode;
  /**
   * Custom user info
   */
  userInfo?: React.ReactNode;
  /**
   * Navigation callback
   */
  onNavigate?: (item: NavigationItem) => void;
  /**
   * Custom item renderer
   */
  renderItem?: (item: NavigationItem, level: number) => React.ReactNode;
  className?: string;
}

interface SidebarContextValue {
  collapsed: boolean;
  activeId?: string;
  onNavigate?: (item: NavigationItem) => void;
  renderItem?: (item: NavigationItem, level: number) => React.ReactNode;
}

const SidebarContext = createContext<SidebarContextValue | undefined>(undefined);

const useSidebarContext = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('Sidebar components must be used within GlassSidebar');
  }
  return context;
};

/**
 * GlassSidebar component
 * A glassmorphism sidebar navigation with advanced features
 */
export const GlassSidebar = forwardRef<HTMLDivElement, GlassSidebarProps>(
  (
    {
      items,
      activeId,
      variant = 'default',
      width = 'md',
      collapsible = true,
      collapsed = false,
      onCollapsedChange,
      open = true,
      onOpenChange,
      header,
      footer,
      logo,
      userInfo,
      onNavigate,
      renderItem,
      className,
      ...props
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [edgeX, setEdgeX] = useState<number | null>(null);
    const [internalCollapsed, setInternalCollapsed] = useState(collapsed);
    const isCollapsed = collapsed ?? internalCollapsed;

    const widthClasses = {
      sm: isCollapsed ? 'w-16' : 'w-48',
      md: isCollapsed ? 'w-16' : 'w-64',
      lg: isCollapsed ? 'w-20' : 'w-72',
      xl: isCollapsed ? 'w-20' : 'w-80',
    };

    const variantClasses = {
      default: 'border-r border-border/20',
      compact: 'border-r border-border/10',
      floating: 'glass-mx-4 glass-my-4 squiricle border border-border/20',
      overlay: 'border-r border-border/20 shadow-xl',
    };

    const handleToggleCollapse = () => {
      const newCollapsed = !isCollapsed;
      setInternalCollapsed(newCollapsed);
      onCollapsedChange?.(newCollapsed);
    };

    const handleItemClick = (item: NavigationItem) => {
      if (item?.disabled) return;
      onNavigate?.(item);
      if (variant === 'overlay') {
        onOpenChange?.(false);
      }
    };

    const contextValue: SidebarContextValue = {
      collapsed: isCollapsed,
      activeId,
      onNavigate: handleItemClick,
      renderItem,
    };

    if (variant === 'overlay' && !open) {
      return null;
    }

    // Map width to px for fixed toggle placement
    const widthPxMap: Record<'sm' | 'md' | 'lg' | 'xl', number> = { sm: 192, md: 256, lg: 288, xl: 320 };
    const collapsedWidthPxMap: Record<'sm' | 'md' | 'lg' | 'xl', number> = { sm: 64, md: 64, lg: 80, xl: 80 };

    // Measure actual sidebar right edge in viewport coordinates
    useLayoutEffect(() => {
      const el = containerRef.current;
      if (!el) return;
      const update = () => {
        const rect = el.getBoundingClientRect();
        setEdgeX(rect.left + rect.width);
      };
      update();
      let ro: ResizeObserver | null = null;
      if (typeof window !== 'undefined' && 'ResizeObserver' in window) {
        ro = new ResizeObserver(() => update());
        ro.observe(el);
      }
      window.addEventListener('resize', update);
      window.addEventListener('scroll', update, true);
      const rafLoop = () => {
        update();
        rafId = requestAnimationFrame(rafLoop);
      };
      let rafId = requestAnimationFrame(rafLoop);
      return () => {
        if (ro) ro.disconnect();
        window.removeEventListener('resize', update);
        window.removeEventListener('scroll', update, true);
        cancelAnimationFrame(rafId);
      };
    }, [isCollapsed]);

    return (
      <SidebarContext.Provider value={contextValue}>
        <Motion
          preset={variant === 'overlay' ? 'slideRight' : 'none'}
          className={cn(
            variant === 'overlay' && 'fixed inset-y-0 left-0 z-50',
            'relative overflow-visible z-[60]'
          )}
          style={{ overflow: 'visible' }}
        >
          <OptimizedGlass
            ref={(node) => {
              containerRef.current = node as HTMLDivElement | null;
              if (typeof ref === 'function') ref(node as any);
              else if (ref && typeof (ref as any) === 'object') (ref as any).current = node;
            }}
            intent="primary"
            elevation={variant === 'floating' ? "level2" : "level1"}
            intensity="medium"
            depth={variant === 'floating' ? 3 : 2}
            tint="lavender"
            border={variant === 'floating' ? 'gradient' : 'subtle'}
            animation="none"
            performanceMode="medium"
            className={cn(
              'h-screen max-h-screen flex flex-col transition-colors overflow-visible',
              widthClasses?.[width],
              variantClasses?.[variant],
              variant === 'floating' ? 'squiricle' : '',
              className
            )}
            style={{ overflow: 'visible' }}
            {...props}
          >
            {/* Background tints removed to respect global layout color */}
            {/* Header */}
            {(header || logo) && (
              <div className="flex-shrink-0 p-4 border-b border-glass-border/20">
                {header || (
                  <div className="flex items-center justify-center w-full">
                    {logo && (
                      <div className={cn(
                        "flex items-center glass-gap-3 transition-all duration-300",
                        isCollapsed ? "scale-75 opacity-70" : "scale-100 opacity-100"
                      )}>
                        {logo}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* User Info */}
            {userInfo && !isCollapsed && (
              <div className="flex-shrink-0 p-4 border-b border-glass-border/10">
                {userInfo}
              </div>
            )}

            {/* Navigation */}
            <div className={cn(
              "flex-1 glass-px-4 glass-py-2",
              isCollapsed ? "overflow-hidden" : "overflow-y-auto overflow-x-visible"
            )}>
              <SidebarNavigation items={items} />
            </div>

            {/* Footer */}
            {footer && (
              <div className="flex-shrink-0 p-4 border-t border-glass-border/20">
                {footer}
              </div>
            )}

            {/* Toggle Button moved outside container to avoid any clipping */}
          </OptimizedGlass>
        </Motion>

        {collapsible && (() => {
          // Render toggle into document.body to avoid any local stacking/overflow issues
          const [mounted, setMounted] = (function useMounted() {
            const [m, setM] = useState(false);
            useEffect(() => setM(true), []);
            return [m, setM] as const;
          })();
          if (!mounted) return null;
          const fallbackX = (isCollapsed ? collapsedWidthPxMap : widthPxMap)[width];
          const centerX = (edgeX ?? fallbackX);
          // Render inside a fullscreen, pointer-events-none layer; toggle itself is pointer-events-auto
          return createPortal(
            // Seam overlay: narrow, full-height, click-through slice at the exact sidebar edge
            <div
              className="fixed top-0 h-screen z-[2147483647]"
              style={{ left: Math.max(0, centerX - 24), width: 48, pointerEvents: 'auto' }}
            >
              <button
                type="button"
                onClick={handleToggleCollapse}
                title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                className={cn(
                  'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 glass-radius-full',
                  'flex items-center justify-center',
                  // Frosted surface
                  'backdrop-blur-md2xl bg-white/55 border border-white/80',
                  'shadow-[0_6px_18px_rgba(0,0,0,0.35),inset_0_1px_2px_rgba(255,255,255,0.35)] ring-1 ring-white/40',
                  'hover:bg-white/65 active:bg-white/70',
                )}
                aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                {isCollapsed ? (
                  <ChevronRight className="w-5 h-5 text-primary drop-shadow-[0_1px_8px_rgba(0,0,0,0.8)]" strokeWidth={3} />
                ) : (
                  <ChevronLeft className="w-5 h-5 text-primary drop-shadow-[0_1px_8px_rgba(0,0,0,0.8)]" strokeWidth={3} />
                )}
              </button>
            </div>,
            document.body
          );
        })()}

        {/* Overlay backdrop */}
        {variant === 'overlay' && open && (
          <div
            className="fixed inset-0 glass-surface-dark/50 z-40"
            onClick={(e) => onOpenChange?.(false)}
          />
        )}
      </SidebarContext.Provider>
    );
  }
);

GlassSidebar.displayName = 'GlassSidebar';

/**
 * SidebarNavigation component
 */
interface SidebarNavigationProps {
  items: NavigationItem[];
  level?: number;
}

function SidebarNavigation({ items, level = 0 }: SidebarNavigationProps) {
  return (
    <ul className={cn('glass-gap-2', level > 0 && 'glass-ml-4')}>
      {(items || []).map((item) => (
        <SidebarNavigationItem key={item?.id} item={item} level={level} />
      ))}
    </ul>
  );
}

/**
 * SidebarNavigationItem component
 */
interface SidebarNavigationItemProps {
  item: NavigationItem;
  level: number;
}

function SidebarNavigationItem({ item, level }: SidebarNavigationItemProps) {
  const { collapsed, activeId, onNavigate, renderItem } = useSidebarContext();
  // Only expand the most essential group by default
  const shouldExpandByDefault = level === 0 && item?.id === 'home';
  const [isExpanded, setIsExpanded] = useState(shouldExpandByDefault);

  const isActive = activeId === item?.id;
  const hasChildren = item?.children && item?.children.length > 0;

  if (renderItem) {
    return <li>{renderItem(item, level)}</li>;
  }

  const handleClick = () => {
    if (hasChildren && !collapsed) {
      setIsExpanded(!isExpanded);
    } else {
      onNavigate?.(item);
      item?.onClick?.();
    }
  };

  const buttonContent = (
    <GlassButton
      variant="ghost"
      onClick={handleClick}
      disabled={item?.disabled}
      className={cn(
        'w-full flex items-center glass-gap-3 glass-radius-md transition-all duration-200 relative group',
        'hover:bg-white/10 focus:outline-none',
        collapsed ? 'glass-px-2 glass-py-2.5 justify-center' : 'glass-px-3 glass-py-2',
        'glass-text-sm font-medium',
        isActive ? 'bg-primary/15 text-primary shadow-[0_0_0_2px_${glassStyles.borderColor || "rgba(59, 130, 246, 0.2)"}]' : '',
        !isActive && 'glass-text-secondary hover:text-foreground',
        item?.disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      {/* Icon */}
      {item?.icon && (
        <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-lg">
          {React.cloneElement(item?.icon as React.ReactElement, {
            className: cn(
              (item?.icon as React.ReactElement).props?.className,
              collapsed ? "w-6 h-6" : "w-5 h-5"
            )
          })}
        </span>
      )}

      {/* Label and badge */}
      {!collapsed && (
        <>
          <span className="flex-1 text-left whitespace-nowrap truncate leading-5">{item?.label}</span>

          {item?.badge && (
            <span
              className={cn(
                'flex-shrink-0 glass-px-2 glass-py-1 glass-text-xs glass-radius-full font-medium transition-all duration-200',
                'bg-black/15 border border-black/20 shadow-md backdrop-blur-md',
                'group-hover:bg-black/20 group-hover:border-black/25 group-hover:shadow-lg',
                'relative z-10' // Ensure badge stays above any background effects
              )}
              style={{
                color: '#ffffff', // white text on dark background
              }}
            >
              {item?.badge}
            </span>
          )}

          {hasChildren && (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={cn(
                'flex-shrink-0 transition-transform duration-200 glass-text-primary/50',
                isExpanded ? 'rotate-90' : 'rotate-0'
              )}
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          )}
        </>
      )}
    </GlassButton>
  );

  return (
    <li>
      {collapsed && item?.label ? (
        <GlassTooltip
          content={item?.label}
          placement="right"
          zIndex={9999}
          showDelay={300}
        >
          {buttonContent}
        </GlassTooltip>
      ) : (
        buttonContent
      )}

      {/* Children */}
      {hasChildren && !collapsed && isExpanded && (
        <Motion
          preset="slideDown"
          className="glass-mt-1"
        >
          <div className="glass-ml-2 pl-4 border-l border-glass-border/20">
            <SidebarNavigation items={item?.children!} level={level + 1} />
          </div>
        </Motion>
      )}
    </li>
  );
}

/**
 * SidebarBrand component
 */
export interface SidebarBrandProps {
  logo?: React.ReactNode;
  title?: string;
  subtitle?: string;
  href?: string;
  onClick?: () => void;
  className?: string;
}

export function SidebarBrand({ logo, title, subtitle, href, onClick, className }: SidebarBrandProps) {
  const { collapsed } = useSidebarContext();

  const Content = () => (
    <div className={cn(
      'flex items-center glass-gap-3',
      collapsed && 'justify-center'
    )}>
      {logo && (
        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
          {logo}
        </div>
      )}

      {!collapsed && (title || subtitle) && (
        <div className="flex-1 min-glass-w-0">
          {title && (
            <h1 className="text-lg font-bold text-primary truncate">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="text-xs glass-text-secondary truncate">
              {subtitle}
            </p>
          )}
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <a href={href} className={cn('block', className)}>
        <Content />
      </a>
    );
  }

  if (onClick) {
    return (
      <GlassButton variant="ghost" onClick={onClick} className={cn('block w-full text-left', className)}>
        <Content />
      </GlassButton>
    );
  }

  return (
    <div className={className}>
      <Content />
    </div>
  );
}

/**
 * SidebarUserInfo component
 */
export interface SidebarUserInfoProps {
  name: string;
  email?: string;
  avatar?: string;
  status?: 'online' | 'away' | 'busy' | 'offline';
  actions?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export function SidebarUserInfo({
  name,
  email,
  avatar,
  status,
  actions,
  onClick,
  className,
}: SidebarUserInfoProps) {
  const { collapsed } = useSidebarContext();

  if (collapsed) {
    return (
      <div className={cn('flex justify-center', className)}>
        <div className="relative">
          {avatar ? (
            <img
              src={avatar}
              alt={name}
              className="w-8 h-8 glass-radius-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 glass-radius-full glass-surface-primary/20 flex items-center justify-center">
              <span className="text-sm font-medium">{name.charAt(0)}</span>
            </div>
          )}

          {status && (
            <div className={cn(
              'absolute -bottom-0.5 -right-0.5 w-3 h-3 glass-radius-full border border-background',
              {
                'bg-green-500': status === 'online',
                'bg-yellow-500': status === 'away',
                'bg-red-500': status === 'busy',
                'bg-gray-500': status === 'offline',
              }
            )} />
          )}
        </div>
      </div>
    );
  }

  const Content = () => (
    <div className="flex items-center gap-3">
      <div className="relative flex-shrink-0">
        {avatar ? (
          <img
            src={avatar}
            alt={name}
            className="w-10 h-10 glass-radius-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 glass-radius-full glass-surface-primary/20 flex items-center justify-center">
            <span className="text-lg font-medium">{name.charAt(0)}</span>
          </div>
        )}

        {status && (
          <div className={cn(
            'absolute -bottom-0.5 -right-0.5 w-3 h-3 glass-radius-full border-2 border-background',
            {
              'bg-green-500': status === 'online',
              'bg-yellow-500': status === 'away',
              'bg-red-500': status === 'busy',
              'bg-gray-500': status === 'offline',
            }
          )} />
        )}
      </div>

      <div className="flex-1 min-glass-w-0">
        <p className="text-sm font-medium text-primary truncate">{name}</p>
        {email && (
          <p className="text-xs glass-text-secondary truncate">{email}</p>
        )}
      </div>

      {actions && (
        <div className="flex-shrink-0">
          {actions}
        </div>
      )}
    </div>
  );

  if (onClick) {
    return (
      <GlassButton
        variant="ghost"
        onClick={onClick}
        className={cn(
          'w-full text-left glass-p-2 glass-radius-md',
          'hover:bg-muted/50 transition-colors',
          className
        )}
      >
        <Content />
      </GlassButton>
    );
  }

  return (
    <div className={className}>
      <Content />
    </div>
  );
}
