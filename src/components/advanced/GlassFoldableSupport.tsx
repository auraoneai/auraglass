/**
 * AuraGlass Foldable Screen Support
 * Adaptive glass layouts for foldable and dual-screen devices
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

interface FoldableInfo {
  isFoldable: boolean;
  foldState: 'folded' | 'unfolded' | 'partial' | 'unknown';
  foldAngle?: number; // 0-180 degrees
  segments: ScreenSegment[];
  hinge?: {
    position: 'horizontal' | 'vertical';
    offset: number; // pixels from top/left
    width: number;  // hinge width in pixels
  };
}

interface ScreenSegment {
  left: number;
  top: number;
  width: number;
  height: number;
  devicePixelRatio: number;
}

interface GlassFoldableSupportProps {
  children: React.ReactNode;
  className?: string;
  adaptiveLayout?: boolean;
  bridgeHinge?: boolean;
  independentSegments?: boolean;
  continuousGlass?: boolean;
  foldAnimation?: boolean;
  onFoldStateChange?: (state: FoldableInfo) => void;
}

export function GlassFoldableSupport({
  children,
  className,
  adaptiveLayout = true,
  bridgeHinge = true,
  independentSegments = false,
  continuousGlass = true,
  foldAnimation = true,
  onFoldStateChange,
}: GlassFoldableSupportProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [foldableInfo, setFoldableInfo] = useState<FoldableInfo>({
    isFoldable: false,
    foldState: 'unknown',
    segments: [{
      left: 0,
      top: 0,
      width: window.innerWidth,
      height: window.innerHeight,
      devicePixelRatio: window.devicePixelRatio || 1,
    }],
  });
  const [layoutMode, setLayoutMode] = useState<'single' | 'dual' | 'extended'>('single');
  
  // Detect foldable device capabilities
  const detectFoldableCapabilities = useCallback(async () => {
    // Check for Visual Viewport API and Screen Segments
    if ('getScreenDetails' in window) {
      try {
        const screenDetails = await (window as any).getScreenDetails();
        const segments = screenDetails.screens.map((screen: any) => ({
          left: screen.left,
          top: screen.top,
          width: screen.width,
          height: screen.height,
          devicePixelRatio: screen.devicePixelRatio,
        }));
        
        const isFoldable = segments.length > 1;
        let hinge = undefined;
        
        if (isFoldable && segments.length === 2) {
          // Calculate hinge position
          const [segment1, segment2] = segments;
          
          if (segment1.top === segment2.top && segment1.height === segment2.height) {
            // Vertical hinge (side by side)
            hinge = {
              position: 'vertical' as const,
              offset: Math.max(segment1.left + segment1.width, segment2.left + segment2.width) - 
                     Math.min(segment1.left, segment2.left),
              width: Math.abs(segment2.left - (segment1.left + segment1.width)),
            };
          } else if (segment1.left === segment2.left && segment1.width === segment2.width) {
            // Horizontal hinge (top and bottom)
            hinge = {
              position: 'horizontal' as const,
              offset: Math.max(segment1.top + segment1.height, segment2.top + segment2.height) - 
                     Math.min(segment1.top, segment2.top),
              width: Math.abs(segment2.top - (segment1.top + segment1.height)),
            };
          }
        }
        
        setFoldableInfo({
          isFoldable,
          foldState: isFoldable ? 'unfolded' : 'unknown',
          segments,
          hinge,
        });
        
        setLayoutMode(isFoldable ? (segments.length > 2 ? 'extended' : 'dual') : 'single');
        
      } catch (error) {
        console.warn('Screen Details API not supported:', error);
      }
    }
    
    // Fallback: Check for CSS environment variables
    const spanningSupported = CSS.supports('(spanning: single-fold-vertical)') ||
                             CSS.supports('(spanning: single-fold-horizontal)');
    
    if (spanningSupported) {
      const spanning = getComputedStyle(document.documentElement)
        .getPropertyValue('env(fold-left)') || 
        getComputedStyle(document.documentElement)
        .getPropertyValue('env(fold-top)');
      
      if (spanning) {
        setFoldableInfo(prev => ({
          ...prev,
          isFoldable: true,
          foldState: 'unfolded',
        }));
        setLayoutMode('dual');
      }
    }
    
    // Check for dual-screen using media queries
    const isDualScreen = window.matchMedia('(spanning: single-fold-vertical)').matches ||
                        window.matchMedia('(spanning: single-fold-horizontal)').matches;
    
    if (isDualScreen) {
      setFoldableInfo(prev => ({
        ...prev,
        isFoldable: true,
        foldState: 'unfolded',
      }));
      setLayoutMode('dual');
    }
  }, []);
  
  // Monitor fold state changes
  const monitorFoldState = useCallback(() => {
    // Listen for orientation changes that might indicate folding
    const handleOrientationChange = () => {
      setTimeout(detectFoldableCapabilities, 100);
    };
    
    // Listen for resize events that might indicate folding
    const handleResize = () => {
      detectFoldableCapabilities();
    };
    
    // Listen for visibility changes (device folding might hide content)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setFoldableInfo(prev => ({
          ...prev,
          foldState: 'folded',
        }));
      } else {
        setFoldableInfo(prev => ({
          ...prev,
          foldState: prev.isFoldable ? 'unfolded' : 'unknown',
        }));
      }
    };
    
    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', handleResize);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [detectFoldableCapabilities]);
  
  // Initialize foldable detection
  useEffect(() => {
    detectFoldableCapabilities();
    const cleanup = monitorFoldState();
    return cleanup;
  }, [detectFoldableCapabilities, monitorFoldState]);
  
  // Notify parent of fold state changes
  useEffect(() => {
    onFoldStateChange?.(foldableInfo);
  }, [foldableInfo, onFoldStateChange]);
  
  // Generate layout based on foldable info
  const generateLayout = () => {
    if (!adaptiveLayout || !foldableInfo.isFoldable) {
      return (
        <div className="relative w-full h-full">
          {children}
        </div>
      );
    }
    
    const { segments, hinge } = foldableInfo;
    
    if (independentSegments && segments.length > 1) {
      // Render independent content for each segment
      return (
        <div className="relative w-full h-full flex">
          {segments.map((segment, index) => (
            <motion.div
              key={`segment-${index}`}
              className="relative"
              style={{
                width: `${(segment.width / window.innerWidth) * 100}%`,
                height: `${(segment.height / window.innerHeight) * 100}%`,
              }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="OptimizedGlass intensity={0.2} blur={6} w-full h-full">
                {React.Children.toArray(children)[index] || children}
              </div>
            </motion.div>
          ))}
        </div>
      );
    }
    
    // Adaptive single layout with hinge awareness
    return (
      <div className="relative w-full h-full">
        {bridgeHinge && hinge && (
          <HingeBridge hinge={hinge} continuousGlass={continuousGlass} />
        )}
        <div 
          className={cn(
            "relative",
            hinge?.position === 'vertical' && 'flex',
            hinge?.position === 'horizontal' && 'flex flex-col'
          )}
          style={{
            gap: hinge ? `${hinge.width}px` : undefined,
          }}
        >
          {children}
        </div>
      </div>
    );
  };
  
  return (
    <motion.div
      ref={containerRef}
      className={cn(
        "relative OptimizedGlass intensity={0.2} blur={6}",
        "transform-gpu will-change-transform",
        foldableInfo.isFoldable && 'glass-foldable-supported',
        className
      )}
      data-fold-state={foldableInfo.foldState}
      data-layout-mode={layoutMode}
      animate={foldAnimation ? {
        scale: foldableInfo.foldState === 'folded' ? 0.95 : 1,
        opacity: foldableInfo.foldState === 'folded' ? 0.8 : 1,
      } : undefined}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={`${layoutMode}-${foldableInfo.foldState}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {generateLayout()}
        </motion.div>
      </AnimatePresence>
      
      {/* Fold state indicator */}
      {foldableInfo.isFoldable && (
        <div className="absolute glass--glass--glass--glass--glass--glass--glass--glass--glass--glassglass--glassglass--top-2 right-2 glass-surface-primary p-1 glass-radius-sm text-xs opacity-50">
          <div className="flex items-center gap-1">
            <div 
              className={cn(
                "w-2 h-2 glass-radius-full",
                foldableInfo.foldState === 'folded' && "bg-red-400",
                foldableInfo.foldState === 'unfolded' && "bg-green-400",
                foldableInfo.foldState === 'partial' && "bg-yellow-400",
                foldableInfo.foldState === 'unknown' && "bg-gray-400"
              )}
            />
            <span>{layoutMode}</span>
          </div>
        </div>
      )}
    </motion.div>
  );
}

// Hinge bridge component for seamless glass across fold
function HingeBridge({ 
  hinge, 
  continuousGlass 
}: { 
  hinge: NonNullable<FoldableInfo['hinge']>; 
  continuousGlass: boolean;
}) {
  if (!continuousGlass) return null;
  
  return (
    <div
      className={cn(
        "absolute OptimizedGlass intensity={0.2} blur={6} opacity-50",
        "pointer-events-none",
        hinge.position === 'vertical' && "top-0 bottom-0",
        hinge.position === 'horizontal' && "left-0 right-0"
      )}
      style={{
        ...(hinge.position === 'vertical' ? {
          left: `${hinge.offset}px`,
          width: `${hinge.width}px`,
        } : {
          top: `${hinge.offset}px`,
          height: `${hinge.width}px`,
        }),
        background: 'linear-gradient(90deg, transparent, rgba(var(--glass-color-primary) / 0.1), transparent)',
      }}
    />
  );
}

// Hook for accessing foldable state
export function useFoldableDevice() {
  const [foldableInfo, setFoldableInfo] = useState<FoldableInfo>({
    isFoldable: false,
    foldState: 'unknown',
    segments: [{
      left: 0,
      top: 0,
      width: window.innerWidth,
      height: window.innerHeight,
      devicePixelRatio: window.devicePixelRatio || 1,
    }],
  });
  
  return {
    ...foldableInfo,
    setFoldableInfo,
    isUnfolded: foldableInfo.foldState === 'unfolded',
    isFolded: foldableInfo.foldState === 'folded',
    isDualScreen: foldableInfo.segments.length > 1,
  };
}

// Responsive hook for foldable layouts
export function useFoldableLayout() {
  const { isFoldable, foldState, segments, hinge } = useFoldableDevice();
  
  const getOptimalLayout = useCallback((content: React.ReactNode[]) => {
    if (!isFoldable || foldState === 'folded') {
      return { layout: 'single', items: [content] };
    }
    
    if (segments.length === 2) {
      // Dual screen - split content
      const midpoint = Math.ceil(content.length / 2);
      return {
        layout: 'dual',
        items: [
          content.slice(0, midpoint),
          content.slice(midpoint),
        ],
      };
    }
    
    if (segments.length > 2) {
      // Multi-screen - distribute content
      const itemsPerScreen = Math.ceil(content.length / segments.length);
      const items = segments.map((_, index) => 
        content.slice(index * itemsPerScreen, (index + 1) * itemsPerScreen)
      );
      return { layout: 'extended', items };
    }
    
    return { layout: 'single', items: [content] };
  }, [isFoldable, foldState, segments]);
  
  return {
    isFoldable,
    foldState,
    segments,
    hinge,
    getOptimalLayout,
  };
}

// Preset configurations
export const foldablePresets = {
  seamless: {
    adaptiveLayout: true,
    bridgeHinge: true,
    independentSegments: false,
    continuousGlass: true,
    foldAnimation: true,
  },
  independent: {
    adaptiveLayout: true,
    bridgeHinge: false,
    independentSegments: true,
    continuousGlass: false,
    foldAnimation: false,
  },
  minimal: {
    adaptiveLayout: false,
    bridgeHinge: false,
    independentSegments: false,
    continuousGlass: false,
    foldAnimation: false,
  },
  gaming: {
    adaptiveLayout: true,
    bridgeHinge: false,
    independentSegments: true,
    continuousGlass: false,
    foldAnimation: true,
  },
  productivity: {
    adaptiveLayout: true,
    bridgeHinge: true,
    independentSegments: true,
    continuousGlass: true,
    foldAnimation: false,
  },
};