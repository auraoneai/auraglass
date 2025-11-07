/**
 * Z-Space App Layout
 * Full application layout with Z-space depth layers for navigation, content, and overlays
 */

import React, { CSSProperties, forwardRef, ReactNode } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { GlassContainer } from './GlassContainer';

/**
 * Z-Space App Layout Props
 */
export interface ZSpaceAppLayoutProps {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  header?: ReactNode;
  sidebar?: ReactNode;
  footer?: ReactNode;
  overlay?: ReactNode;
  perspective?: number;
  headerDepth?: number; // Z position of header
  sidebarDepth?: number; // Z position of sidebar
  contentDepth?: number; // Z position of main content
  footerDepth?: number; // Z position of footer
  overlayDepth?: number; // Z position of overlay
  sidebarWidth?: string | number;
  headerHeight?: string | number;
  footerHeight?: string | number;
  sidebarPosition?: 'left' | 'right';
  collapsedSidebar?: boolean;
  onSidebarToggle?: () => void;
}

/**
 * Z-Space App Layout Component
 */
export const ZSpaceAppLayout = forwardRef<HTMLDivElement, ZSpaceAppLayoutProps>(
  (
    {
      children,
      className = '',
      style = {},
      header,
      sidebar,
      footer,
      overlay,
      perspective = 1500,
      headerDepth = 30,
      sidebarDepth = 20,
      contentDepth = 0,
      footerDepth = 10,
      overlayDepth = 100,
      sidebarWidth = 280,
      headerHeight = 64,
      footerHeight = 60,
      sidebarPosition = 'left',
      collapsedSidebar = false,
      onSidebarToggle,
    },
    ref
  ) => {
    const prefersReducedMotion = useReducedMotion();

    // Convert numeric values to pixels
    const sidebarWidthPx = typeof sidebarWidth === 'number' ? `${sidebarWidth}px` : sidebarWidth;
    const headerHeightPx = typeof headerHeight === 'number' ? `${headerHeight}px` : headerHeight;
    const footerHeightPx = typeof footerHeight === 'number' ? `${footerHeight}px` : footerHeight;

    /**
     * Container styles
     */
    const containerStyles: CSSProperties = {
      ...style,
      position: 'relative',
      width: '100%',
      height: '100vh',
      perspective: `${perspective}px`,
      transformStyle: 'preserve-3d',
      overflow: 'hidden',
    };

    /**
     * Get layer transform
     */
    const getLayerTransform = (depth: number): string => {
      if (prefersReducedMotion) return 'none';
      return `translateZ(${depth}px)`;
    };

    /**
     * Header styles
     */
    const headerStyles: CSSProperties = {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: headerHeightPx,
      transform: getLayerTransform(headerDepth),
      transformStyle: 'preserve-3d',
      zIndex: 40,
    };

    /**
     * Sidebar styles
     */
    const sidebarStyles: CSSProperties = {
      position: 'fixed',
      top: header ? headerHeightPx : 0,
      [sidebarPosition]: 0,
      bottom: footer ? footerHeightPx : 0,
      width: collapsedSidebar ? '64px' : sidebarWidthPx,
      transform: getLayerTransform(sidebarDepth),
      transformStyle: 'preserve-3d',
      transition: prefersReducedMotion ? 'none' : 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      zIndex: 30,
    };

    /**
     * Main content styles
     */
    const mainStyles: CSSProperties = {
      position: 'fixed',
      top: header ? headerHeightPx : 0,
      bottom: footer ? footerHeightPx : 0,
      left: sidebar && sidebarPosition === 'left' ? (collapsedSidebar ? '64px' : sidebarWidthPx) : 0,
      right: sidebar && sidebarPosition === 'right' ? (collapsedSidebar ? '64px' : sidebarWidthPx) : 0,
      transform: getLayerTransform(contentDepth),
      transformStyle: 'preserve-3d',
      overflow: 'auto',
      transition: prefersReducedMotion ? 'none' : 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      zIndex: 10,
    };

    /**
     * Footer styles
     */
    const footerStyles: CSSProperties = {
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: footerHeightPx,
      transform: getLayerTransform(footerDepth),
      transformStyle: 'preserve-3d',
      zIndex: 20,
    };

    /**
     * Overlay styles
     */
    const overlayStyles: CSSProperties = {
      position: 'fixed',
      inset: 0,
      transform: getLayerTransform(overlayDepth),
      transformStyle: 'preserve-3d',
      zIndex: 50,
      pointerEvents: overlay ? 'auto' : 'none',
    };

    return (
      <div
        ref={ref}
        className={`zspace-app-layout ${className}`}
        style={containerStyles}
      >
        {/* Header */}
        {header && (
          <div className="zspace-app-layout-header" style={headerStyles}>
            <GlassContainer style={{ width: '100%', height: '100%' }}>
              {header}
            </GlassContainer>
          </div>
        )}

        {/* Sidebar */}
        {sidebar && (
          <div className="zspace-app-layout-sidebar" style={sidebarStyles}>
            <GlassContainer style={{ width: '100%', height: '100%' }}>
              {sidebar}

              {/* Sidebar toggle button */}
              {onSidebarToggle && (
                <button
                  onClick={onSidebarToggle}
                  className="zspace-sidebar-toggle"
                  style={{
                    position: 'absolute',
                    top: '50%',
                    [sidebarPosition === 'left' ? 'right' : 'left']: '-16px',
                    transform: 'translateY(-50%)',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    border: '1px solid var(--aura-glass-border-color, rgba(255, 255, 255, 0.2))',
                    background: 'var(--aura-glass-bg, rgba(255, 255, 255, 0.1))',
                    backdropFilter: 'var(--aura-glass-blur-md, blur(10px))',
                    color: 'var(--aura-text-primary, #ffffff)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: prefersReducedMotion
                      ? 'none'
                      : 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    zIndex: 1,
                  }}
                  aria-label={collapsedSidebar ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                  {collapsedSidebar ? '→' : '←'}
                </button>
              )}
            </GlassContainer>
          </div>
        )}

        {/* Main Content */}
        <main className="zspace-app-layout-main" style={mainStyles}>
          <GlassContainer style={{ minHeight: '100%', padding: '20px' }}>
            {children}
          </GlassContainer>
        </main>

        {/* Footer */}
        {footer && (
          <div className="zspace-app-layout-footer" style={footerStyles}>
            <GlassContainer style={{ width: '100%', height: '100%' }}>
              {footer}
            </GlassContainer>
          </div>
        )}

        {/* Overlay */}
        {overlay && (
          <div className="zspace-app-layout-overlay" style={overlayStyles}>
            <GlassContainer style={{ width: '100%', height: '100%' }}>
              {overlay}
            </GlassContainer>
          </div>
        )}

        <style>{`
          .zspace-app-layout {
            font-family: var(--aura-font-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif);
          }

          .zspace-sidebar-toggle:hover {
            background: var(--aura-glass-bg-hover, rgba(255, 255, 255, 0.15)) !important;
            transform: translateY(-50%) scale(1.05);
          }

          .zspace-sidebar-toggle:active {
            transform: translateY(-50%) scale(0.95);
          }

          .zspace-sidebar-toggle:focus-visible {
            outline: 2px solid var(--aura-accent-color, #00d4ff);
            outline-offset: 2px;
          }

          @media (prefers-reduced-motion: reduce) {
            .zspace-app-layout *,
            .zspace-sidebar-toggle {
              transform: none !important;
              transition: none !important;
            }
          }

          @media (max-width: 768px) {
            .zspace-app-layout-sidebar {
              transform: translateX(${sidebarPosition === 'left' ? '-100%' : '100%'}) !important;
            }

            .zspace-app-layout-sidebar.mobile-open {
              transform: none !important;
            }

            .zspace-app-layout-main {
              left: 0 !important;
              right: 0 !important;
            }
          }
        `}</style>
      </div>
    );
  }
);

ZSpaceAppLayout.displayName = 'ZSpaceAppLayout';
