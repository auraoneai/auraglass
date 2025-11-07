/**
 * GlassTabBar Component
 * 
 * An advanced tab bar component with physics-based animations, glass styling,
 * and momentum scrolling for overflow tabs.
 */
import React, { useState, useRef, useEffect, useCallback, useMemo, forwardRef, useImperativeHandle } from 'react';
// import { useThemeColor, ThemeColors } from '../../hooks/useGlassTheme';
import { useAccessibilitySettings } from '../../hooks/useAccessibilitySettings';
import { TabBarContainer, TabSelector } from './styled';
import TabItemComponent from './components/TabItem';
import CollapsedMenu from './components/CollapsedMenu';
import ScrollButtons from './components/ScrollButtons';
import useResponsive from './hooks/useResponsive';
import useTabAnimations from './hooks/useTabAnimations';
import { calculateVisibleTabs, calculateTotalBadgeCount, getNextEnabledTabIndex, scrollTabIntoView } from './utils/tabUtils';
import { GlassTabBarProps, TabItem, ScrollPosition, ScrollAnimationRef, TabBarRef } from './types';
import { useAnimationContext } from '../../contexts/AnimationContext';
import { AnimationProps } from '../../types/animations';
import { SpringConfig } from '../../animations/physics/springPhysics';
import { cn } from '../../lib/utilsComprehensive';
import { OptimizedGlassCore as OptimizedGlass } from '../../primitives';

/**
 * GlassTabBar Component
 */
export const GlassTabBar = forwardRef<TabBarRef, GlassTabBarProps & AnimationProps>((props, ref) => {
  const {
    tabs,
    activeTab,
    onChange,
    orientation = 'horizontal',
    variant = 'default',
    glassVariant = 'frosted',
    blurStrength = 'standard',
    animationStyle = 'spring',
    physics = {
      tension: 280,
      friction: 26,
      mass: 1
    },
    alignment = 'center',
    color = 'primary',
    fullWidth = false,
    scrollable = true,
    showLabels = true,
    elevated = false,
    background = true,
    width,
    height,
    borderRadius,
    className,
    style,
    onContextMenu,
    renderTab,
    iconPosition = 'left',
    verticalDisplayMode = 'expanded',
    placement = 'top',
    responsiveOrientation,
    responsiveConfig,
    collapseTabs = false,
    renderCollapsedMenu,
    keyboardNavigation = true,
    tabIndex = 0,
    ariaLabel = 'Tab Navigation',
    tabStyle,
    tabClassName,
    activeTabClassName,
    defaultBadgeAnimation,
    badgeStyle,
    animationConfig: propAnimationConfig,
    disableAnimation: propDisableAnimation,
    // Capture remaining props
    ...restProps 
  } = props;
  
  const responsiveState = useResponsive();
  
  // Calculate effective values based on responsive state
  const effectiveOrientation = responsiveState.isMobile && responsiveOrientation === 'vertical' ? 'vertical' : orientation;
  const effectiveShowLabels = responsiveState.isMobile ? false : showLabels;
  const effectiveIconPosition = iconPosition as ('top' | 'left' | 'right');
  const effectiveVerticalDisplayMode = verticalDisplayMode;
  const effectiveFullWidth = responsiveState.isMobile ? true : fullWidth;
  const effectiveWidth = width || (responsiveState.isMobile ? '100%' : 'auto');
  const effectiveHeight = height;
  const maxVisibleTabs = responsiveState.isMobile ? 3 : 8;
  
  // Hooks
  const { settings: accessibilitySettings } = useAccessibilitySettings();
  const isReducedMotion = accessibilitySettings?.reducedMotion || false;
  const contextValue = useAnimationContext();
  const colorValue = 'var(--glass-color-primary)'; // Default color

  // Determine final animation settings
  const finalDisableAnimation = !!(propDisableAnimation ?? (contextValue as any)?.disableAnimation ?? isReducedMotion);

  const finalAnimationConfig: SpringConfig | undefined = useMemo(() => {
    return (
      propAnimationConfig ??
      (contextValue as any)?.animationConfig ??
      (physics ? { tension: physics.tension, friction: physics.friction, mass: physics.mass } : undefined) ?? // Convert old prop
      undefined // Or a default config if needed
    );
  }, [propAnimationConfig, contextValue, physics]);
  
  // Refs
  const tabsRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  
  // State
  const [selectorStyle, setSelectorStyle] = useState({
    width: 0,
    height: 0,
    left: 0,
    top: 0,
  });
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  
  // State for collapsed tabs
  const [visibleTabs, setVisibleTabs] = useState<TabItem[]>(tabs);
  const [collapsedTabs, setCollapsedTabs] = useState<TabItem[]>([]);
  const [showCollapsedMenu, setShowCollapsedMenu] = useState(false);
  
  // Ref for tracking tab widths to determine when to collapse
  const tabWidthsRef = useRef<number[]>([]);
  
  // Set up scroll animation
  const [scrollPosition, setScrollPosition] = useState<ScrollPosition>({ x: 0, y: 0, left: 0, top: 0 });
  
  // Initialize scroll animation ref
  const scrollAnimationRef = useRef<ScrollAnimationRef>({
    rafId: null,
    velocity: { x: 0, y: 0 },
    timestamp: 0,
    active: false
  });
  
  // Set up tab animations
  const {
    animateToTab,
    setActiveTab,
    activeIndex,
    isAnimating,
    selectorPosition,
    selectorWidth
  } = useTabAnimations(activeTab || 0);

  // Magnetic effect state
  const [tabMagneticData, setTabMagneticData] = useState({
    closestTabIndex: null as number | null,
    selectionProgress: 0
  });

  // Physics animation state
  const [usePhysicsAnimation, setUsePhysicsAnimation] = useState(false);

  // Spring props for animations
  const [springProps, setSpringProps] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0
  });

  // Transform state for magnetic effects
  const [transform, setTransform] = useState({
    translateX: 0,
    translateY: 0
  });

  // Expose imperative methods via the forwarded ref
  useImperativeHandle(ref, () => ({
    getContainerElement: () => tabsRef.current,
    getTabElements: () => tabRefs.current,
    getTabElement: (index: number) => {
      if (index >= 0 && index < tabRefs.current.length) {
        return tabRefs.current[index];
      }
      return null;
    },
    getActiveTab: () => activeTab || 0,
    setActiveTab: (index: number) => {
      if (index >= 0 && index < tabs.length && !tabs[index].disabled) {
        // Create a synthetic mouse event
        const syntheticEvent = {
          currentTarget: tabRefs.current[index] || document.createElement('button'),
          preventDefault: () => {},
          stopPropagation: () => {}
        } as React.MouseEvent<HTMLButtonElement>;

        // Call the onChange handler with the synthetic event
        onChange(syntheticEvent, index);
      }
    },
    selectTab: (index: number) => {
      if (index >= 0 && index < tabs.length && !tabs[index].disabled) {
        // Create a synthetic mouse event
        const syntheticEvent = {
          currentTarget: tabRefs.current[index] || document.createElement('button'),
          preventDefault: () => {},
          stopPropagation: () => {}
        } as React.MouseEvent<HTMLButtonElement>;

        // Call the onChange handler with the synthetic event
        onChange(syntheticEvent, index);
      }
    },
    scrollToTab: (index: number, smooth = true) => {
      if (index >= 0 && index < tabRefs.current.length && tabRefs.current[index] && tabsRef.current) {
        scrollTabIntoView(
          tabRefs.current[index]!,
          tabsRef.current!,
          smooth ? 'smooth' : 'auto'
        );
      }
    },
    toggleBadge: (index: number, show: boolean) => {
      // Badge toggle functionality - implement based on your application needs
      // This provides the interface for dynamic badge show/hide functionality
    },
    updateBadge: (index: number, value: number | string) => {
      // Badge update functionality - implement based on your application needs
      // This provides the interface for dynamic badge value updates
    },
    isScrolling: () => isScrolling
  }), [tabsRef, tabRefs, tabs, onChange, effectiveOrientation, isScrolling, activeTab]);
  
  // Handle tab click
  const handleTabClick = (event: React.MouseEvent<HTMLButtonElement>, index: number) => {
    if (collapseTabs && index === visibleTabs.length - 1) {
      // This is the "More" menu tab, toggle the menu
      setShowCollapsedMenu(!showCollapsedMenu);
      return;
    }
    
    // If this is a normal tab click, handle it normally
    if (visibleTabs[index].disabled) return;
    onChange(event, index);
  };
  
  // Handle collapsed tab selection
  const handleCollapsedTabSelect = (collapsedIndex: number) => {
    // Find the original index of this tab in the full tabs array
    const realIndex = collapsedTabs[collapsedIndex] ? 
      tabs.findIndex(tab => tab.value === collapsedTabs[collapsedIndex].value) : -1;
    
    if (realIndex !== -1) {
      // Create a synthetic event that matches the expected type
      const syntheticEvent = {
        currentTarget: tabRefs.current[realIndex] || document.createElement('button'),
        preventDefault: () => {},
        stopPropagation: () => {}
      } as React.MouseEvent<HTMLButtonElement>;
      
      onChange(syntheticEvent, realIndex);
    }
    
    // Close the menu
    setShowCollapsedMenu(false);
  };
  
  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!keyboardNavigation) return;
    
    let newIndex = activeTab;
    
    switch (event.key) {
      case 'ArrowRight':
        if (effectiveOrientation === 'horizontal') {
          event.preventDefault();
          newIndex = getNextEnabledTabIndex(tabs as any, activeTab || 0, 'next');
        }
        break;
      case 'ArrowLeft':
        if (effectiveOrientation === 'horizontal') {
          event.preventDefault();
          newIndex = getNextEnabledTabIndex(tabs as any, activeTab || 0, 'prev');
        }
        break;
      case 'ArrowDown':
        if (effectiveOrientation === 'vertical') {
          event.preventDefault();
          newIndex = getNextEnabledTabIndex(tabs as any, activeTab || 0, 'next');
        }
        break;
      case 'ArrowUp':
        if (effectiveOrientation === 'vertical') {
          event.preventDefault();
          newIndex = getNextEnabledTabIndex(tabs as any, activeTab || 0, 'prev');
        }
        break;
      case 'Home':
        event.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        event.preventDefault();
        newIndex = tabs.length - 1;
        break;
      case 'Enter':
      case ' ': // Space
        event.preventDefault();
        if (!tabs[index].disabled) {
          onChange(event, index);
        }
        return; // Skip the auto-navigation below
      default:
        return; // Exit for other keys
    }
    
    // Only change tabs if we found a new enabled tab
    if (newIndex !== activeTab) {
      onChange(event, newIndex || 0);
      // Focus the new tab
      setTimeout(() => {
        const newTabEl = tabRefs.current[newIndex || 0];
        if (newTabEl) {
          newTabEl.focus();
        }
      }, 10);
    }
  };
  
  // Handle scroll visibility check
  const checkScrollVisibility = useCallback(() => {
    if (!tabsRef.current || !scrollable) return;
    
    const container = tabsRef.current;
    
    if (effectiveOrientation === 'horizontal') {
      setShowLeftScroll(container.scrollLeft > 0);
      setShowRightScroll(
        container.scrollLeft < container.scrollWidth - container.clientWidth - 2
      );
    } else {
      setShowLeftScroll(container.scrollTop > 0);
      setShowRightScroll(
        container.scrollTop < container.scrollHeight - container.clientHeight - 2
      );
    }
  }, [effectiveOrientation, scrollable]);
  
  // Set scroll target with animation
  const setScrollTarget = (position: ScrollPosition | { x: number; y: number }, animate = true) => {
    const scrollPos = 'left' in position ? position : { ...position, left: position.x, top: position.y };
    setScrollPosition(scrollPos);

    if (tabsRef.current) {
      if (animate) {
        // Apply smooth scrolling if animate is true
        tabsRef.current.scrollTo({
          left: scrollPos.left,
          top: scrollPos.top,
          behavior: 'smooth'
        });
      } else {
        // Instant scroll
        tabsRef.current.scrollLeft = scrollPos.left;
        tabsRef.current.scrollTop = scrollPos.top;
      }
    }
  };
  
  // Handle scroll button click
  const handleScroll = (direction: 'left' | 'right' | 'up' | 'down') => {
    if (!tabsRef.current) return;
    
    const container = tabsRef.current;
    const scrollAmount = effectiveOrientation === 'horizontal' ? container.clientWidth / 2 : container.clientHeight / 2;

    const targetPosition: ScrollPosition = {
      x: scrollPosition.left,
      y: scrollPosition.top,
      left: scrollPosition.left,
      top: scrollPosition.top
    };
    
    if (effectiveOrientation === 'horizontal') {
      if (direction === 'left') {
        targetPosition.x = Math.max(0, scrollPosition.left - scrollAmount);
        targetPosition.left = targetPosition.x;
      } else {
        targetPosition.x = Math.min(
          container.scrollWidth - container.clientWidth,
          scrollPosition.left + scrollAmount
        );
        targetPosition.left = targetPosition.x;
      }
      targetPosition.y = scrollPosition.top;
      targetPosition.top = scrollPosition.top;
    } else {
      if (direction === 'up') {
        targetPosition.y = Math.max(0, scrollPosition.top - scrollAmount);
        targetPosition.top = targetPosition.y;
      } else {
        targetPosition.y = Math.min(
          container.scrollHeight - container.clientHeight,
          scrollPosition.top + scrollAmount
        );
        targetPosition.top = targetPosition.y;
      }
      targetPosition.x = scrollPosition.left;
      targetPosition.left = scrollPosition.left;
    }
    
    setScrollTarget(targetPosition);
  };
  
  // Setup momentum tracking
  const momentumRef = useRef({
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
    lastMoveTime: 0,
    velocityX: 0,
    velocityY: 0
  });
  
  // Set up scroll animation configuration
  const scrollPhysicsConfig = useMemo(() => {
    return {
      // Use physics parameters that create a fluid scrolling experience
      tension: 180,
      friction: 24,
      mass: 1,
      // Adjust physics based on animation style preference for consistency
      ...(animationStyle === 'spring' ? { friction: 18 } : {}),
      ...(animationStyle === 'keyframes' ? { tension: 220, friction: 26 } : {}),
      ...(isReducedMotion ? { tension: 280, friction: 36 } : {})
    };
  }, [animationStyle, isReducedMotion]);
  
  // Handle scroll gesture events
  const handleScrollGestureStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (!scrollable || !tabsRef.current) return;
    
    // Cancel any ongoing scroll animation
    if (scrollAnimationRef.current.rafId !== null) {
      cancelAnimationFrame(scrollAnimationRef.current.rafId);
      scrollAnimationRef.current.rafId = null;
      scrollAnimationRef.current.active = false;
    }
    
    let clientX = 0;
    let clientY = 0;
    
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    // Initialize momentum tracking
    momentumRef.current = {
      startX: clientX,
      startY: clientY,
      lastX: clientX,
      lastY: clientY,
      lastMoveTime: Date.now(),
      velocityX: 0,
      velocityY: 0
    };
    
    setIsScrolling(true);
  };
  
  const handleScrollGestureMove = (e: React.MouseEvent<Element> | React.TouchEvent<Element>) => {
    if (!isScrolling || !tabsRef.current) return;
    
    // Prevent default to avoid browser handling
    e.preventDefault();
    
    const container = tabsRef.current;
    let clientX = 0;
    let clientY = 0;
    
    if ('touches' in e) {
      // Touch event
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      // Mouse event
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    // Calculate delta
    const deltaX = clientX - momentumRef.current.lastX;
    const deltaY = clientY - momentumRef.current.lastY;
    
    // Track velocity for momentum
    const now = Date.now();
    const elapsed = now - momentumRef.current.lastMoveTime;
    if (elapsed > 0) {
      momentumRef.current.velocityX = deltaX / elapsed * 15; // Scale for better feel
      momentumRef.current.velocityY = deltaY / elapsed * 15;
    }
    
    // Update last position and time
    momentumRef.current.lastX = clientX;
    momentumRef.current.lastY = clientY;
    momentumRef.current.lastMoveTime = now;
    
    // Apply scroll delta
    if (effectiveOrientation === 'horizontal') {
      container.scrollLeft -= deltaX;
      setScrollTarget({ left: container.scrollLeft, top: scrollPosition.top, x: container.scrollLeft, y: scrollPosition.y }, false);
    } else {
      container.scrollTop -= deltaY;
      setScrollTarget({ left: scrollPosition.left, top: container.scrollTop, x: scrollPosition.x, y: container.scrollTop }, false);
    }
    
    checkScrollVisibility();
  };
  
  const handleScrollGestureEnd = () => {
    if (!isScrolling || !tabsRef.current) return;
    
    setIsScrolling(false);
    
    const container = tabsRef.current;
    const velocityX = momentumRef.current.velocityX;
    const velocityY = momentumRef.current.velocityY;
    
    // Only apply momentum if velocity is significant
    if (Math.abs(velocityX) > 0.5 || Math.abs(velocityY) > 0.5) {
      // Get boundaries for scrolling
      const maxScrollX = container.scrollWidth - container.clientWidth;
      const maxScrollY = container.scrollHeight - container.clientHeight;
      
      // Store velocity for physics-based animation
      scrollAnimationRef.current.velocity = {
        x: velocityX,
        y: velocityY
      };
      scrollAnimationRef.current.timestamp = Date.now();
      scrollAnimationRef.current.active = true;
      
      // Use a more sophisticated physics-based animation
      const animateScroll = () => {
        if (!scrollAnimationRef.current.active || !tabsRef.current) {
          scrollAnimationRef.current.rafId = null;
          return;
        }
        
        const now = Date.now();
        const elapsed = now - scrollAnimationRef.current.timestamp;
        scrollAnimationRef.current.timestamp = now;
        
        // Convert to seconds for physics calculations
        const dt = Math.min(elapsed, 64) / 1000; // Cap at 64ms to avoid big jumps
        
        // Apply physics (spring-driven deceleration)
        const friction = scrollPhysicsConfig.friction;
        const frictionFactor = Math.pow(0.95, friction * dt * 60); // Scale by dt
        
        // Update velocity with friction
        scrollAnimationRef.current.velocity.x *= frictionFactor;
        scrollAnimationRef.current.velocity.y *= frictionFactor;
        
        // Calculate new scroll position
        let newScrollX = tabsRef.current.scrollLeft - scrollAnimationRef.current.velocity.x * dt * 60;
        let newScrollY = tabsRef.current.scrollTop - scrollAnimationRef.current.velocity.y * dt * 60;
        
        // Apply boundaries
        newScrollX = Math.max(0, Math.min(maxScrollX, newScrollX));
        newScrollY = Math.max(0, Math.min(maxScrollY, newScrollY));
        
        // Apply scroll position
        if (effectiveOrientation === 'horizontal') {
          tabsRef.current.scrollLeft = newScrollX;
          setScrollTarget({ left: newScrollX, top: scrollPosition.top, x: newScrollX, y: scrollPosition.y }, false);
        } else {
          tabsRef.current.scrollTop = newScrollY;
          setScrollTarget({ left: scrollPosition.left, top: newScrollY, x: scrollPosition.x, y: newScrollY }, false);
        }
        
        // Check if we should stop animating
        const stopThreshold = 0.1;
        const isMoving = 
          Math.abs(scrollAnimationRef.current.velocity.x) > stopThreshold || 
          Math.abs(scrollAnimationRef.current.velocity.y) > stopThreshold;
        
        // Apply boundary bounce effect if we hit an edge
        if (effectiveOrientation === 'horizontal') {
          if (newScrollX === 0 || newScrollX === maxScrollX) {
            // Bounce effect: reverse velocity with damping
            scrollAnimationRef.current.velocity.x *= -0.3;
          }
        } else {
          if (newScrollY === 0 || newScrollY === maxScrollY) {
            // Bounce effect: reverse velocity with damping
            scrollAnimationRef.current.velocity.y *= -0.3;
          }
        }
        
        // Continue animation or stop
        if (isMoving) {
          checkScrollVisibility();
          scrollAnimationRef.current.rafId = requestAnimationFrame(animateScroll);
        } else {
          scrollAnimationRef.current.active = false;
          scrollAnimationRef.current.rafId = null;
        }
      };
      
      // Start animation
      scrollAnimationRef.current.rafId = requestAnimationFrame(animateScroll);
    }
  };
  
  // Update selector position function
  const updateSelectorPosition = useCallback(() => {
    if (!tabsRef.current || !activeTab || activeTab < 0 || activeTab >= tabs.length) return;

    const activeTabElement = tabRefs.current[activeTab];
    if (!activeTabElement) return;

    const tabRect = activeTabElement.getBoundingClientRect();
    const containerRect = tabsRef.current.getBoundingClientRect();

    // Update selector style
    const newStyle = {
      width: tabRect.width,
      height: tabRect.height,
      left: activeTabElement.offsetLeft,
      top: activeTabElement.offsetTop,
    };

    // Adjust for underlined variant
    if (variant === 'underline') {
      if (effectiveOrientation === 'horizontal') {
        newStyle.height = 2;
        newStyle.top = containerRect.height - 2;
      } else {
        newStyle.width = 2;
        newStyle.left = containerRect.width - 2;
      }
    }

    setSelectorStyle(newStyle);
    setSpringProps(newStyle);
  }, [activeTab, effectiveOrientation, variant, tabs.length]);

  // Magnetic selector function
  const magneticSelector = useCallback((e: React.MouseEvent<Element>) => {
    if (animationStyle !== 'spring' || !tabsRef.current) return;

    const container = tabsRef.current;
    const rect = container.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Find closest tab
    let closestIndex = 0;
    let closestDistance = Infinity;

    tabRefs.current.forEach((tabRef, index) => {
      if (!tabRef || visibleTabs[index]?.disabled) return;

      const tabRect = tabRef.getBoundingClientRect();
      const tabCenterX = tabRect.left + tabRect.width / 2 - rect.left;
      const tabCenterY = tabRect.top + tabRect.height / 2 - rect.top;

      const distance = Math.sqrt(
        Math.pow(mouseX - tabCenterX, 2) + Math.pow(mouseY - tabCenterY, 2)
      );

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    // Update magnetic data
    const progress = Math.max(0, Math.min(1, 1 - closestDistance / 100));
    setTabMagneticData({
      closestTabIndex: closestIndex,
      selectionProgress: progress
    });

    // Update transform based on magnetic effect
    if (progress > 0.1) {
      const closestTab = tabRefs.current[closestIndex];
      if (closestTab) {
        const tabRect = closestTab.getBoundingClientRect();
        const tabCenterX = tabRect.left + tabRect.width / 2 - rect.left;
        const tabCenterY = tabRect.top + tabRect.height / 2 - rect.top;

        setTransform({
          translateX: (tabCenterX - mouseX) * progress * 0.3,
          translateY: (tabCenterY - mouseY) * progress * 0.3
        });
      }
    } else {
      setTransform({ translateX: 0, translateY: 0 });
    }
  }, [animationStyle, visibleTabs]);

  // Handle mouse leave
  const handleMouseLeave = useCallback(() => {
    if (animationStyle === 'spring' && usePhysicsAnimation) {
      // Reset selector position
      updateSelectorPosition();
      setTabMagneticData({ closestTabIndex: null, selectionProgress: 0 });
      setTransform({ translateX: 0, translateY: 0 });
    }
  }, [animationStyle, usePhysicsAnimation, updateSelectorPosition]);
  
  // Update selector position when active tab changes
  useEffect(() => {
    if (!tabsRef.current || !activeTab || activeTab < 0 || activeTab >= tabs.length) return;

    const activeTabElement = tabRefs.current[activeTab];
    if (!activeTabElement) return;

    const tabRect = activeTabElement.getBoundingClientRect();
    const containerRect = tabsRef.current.getBoundingClientRect();

    // Update selector style - this code needs to be in sync with updateSelectorPosition
    const newStyle = {
      width: tabRect.width,
      height: tabRect.height,
      left: activeTabElement.offsetLeft,
      top: activeTabElement.offsetTop,
    };

    // Adjust for underlined variant
    if (variant === 'underline') {
        if (effectiveOrientation === 'horizontal') {
        newStyle.height = 2;
        newStyle.top = containerRect.height - 2;
        } else {
        newStyle.width = 2;
        newStyle.left = containerRect.width - 2;
      }
    }

    setSelectorStyle(newStyle); // Update local state for non-animated rendering
    setSpringProps(newStyle); // Update spring props for animations

    // Apply any physics-based animations
    if (animationStyle === 'spring') {
      updateSelectorPosition();
    }

    // Also scroll active tab into view
    scrollTabIntoView(
      activeTabElement!,
      tabsRef.current!,
      'smooth'
    );
  }, [activeTab, effectiveOrientation, scrollable, tabs.length, variant, tabsRef, tabRefs, animationStyle, updateSelectorPosition]);
  
  // Setup scroll event listener
  useEffect(() => {
    const container = tabsRef.current;
    if (!container || !scrollable) return;
    
    const handleScroll = () => {
      checkScrollVisibility();
      
      // Update inertial scroll position
      if (orientation === 'horizontal') {
        setScrollTarget({ x: container.scrollLeft, y: scrollPosition.y }, false);
      } else {
        setScrollTarget({ x: scrollPosition.x, y: container.scrollTop }, false);
      }
    };
    
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [scrollable, orientation, checkScrollVisibility]);
  
  // Check scroll visibility on mount and when tabs change
  useEffect(() => {
    checkScrollVisibility();
    
    // Reset tab state when tabs change
    // Initialize with all tabs visible temporarily
    setVisibleTabs(tabs);
    setCollapsedTabs([]);
    
    // Re-calculate visible tabs after a short delay to allow DOM updates
    if (collapseTabs) {
      const timerId = setTimeout(() => {
        if (!tabsRef.current) return;
        
        // Ensure tabRefs array is aligned with tabs array
        if (tabRefs.current.length !== tabs.length) {
          if (process.env.NODE_ENV === 'development') {
            console.warn('GlassTabBar: tabRefs length mismatch, delaying recalculation.');
          }
          // Optionally, could reschedule or handle this state
          return;
        }
    
        // Update tab width measurements more robustly
        const currentTabWidths: number[] = [];
        tabs.forEach((_, index) => {
          const tabRef = tabRefs.current[index];
          const width = tabRef ? tabRef.getBoundingClientRect().width : 50; // Use fallback if ref missing
          currentTabWidths[index] = width > 0 ? width : 50; // Use fallback if width is 0
        });
        tabWidthsRef.current = currentTabWidths;
        
        const { visibleTabs: newVisible, hiddenTabs: newCollapsed } = calculateVisibleTabs(
          tabs as any,
          tabsRef.current.clientWidth
        );
        
        setVisibleTabs(newVisible);
        setCollapsedTabs(newCollapsed);
      }, 50); // Short delay for DOM updates
      
      return () => clearTimeout(timerId); // Cleanup timeout on effect re-run
    }
    // Only include dependencies that trigger recalculation
  }, [tabs, checkScrollVisibility, collapseTabs, maxVisibleTabs]);
  
  // Create magnetic trail effect component
  const MagneticTrailEffect = useCallback(() => {
    if (animationStyle !== 'spring' ||
        !tabMagneticData.closestTabIndex ||
        tabMagneticData.closestTabIndex === activeTab ||
        tabMagneticData.selectionProgress < 0.2) {
      return null;
    }
    
    const trailOpacity = Math.min(0.4, tabMagneticData.selectionProgress * 0.4);
    const trailSize = 20 + tabMagneticData.selectionProgress * 30;
    
    return (
      <div 
        style={{
          position: 'absolute',
          pointerEvents: 'none',
          zIndex: 0,
          width: `${trailSize}px`,
          height: `${trailSize}px`,
          borderRadius: '50%',
          background: color === 'default' ? 
            `rgba(255, 255, 255, ${trailOpacity})` : 
            `var(--color-${color}-transparent)`,
          filter: `blur(${trailSize / 4}px)`,
          opacity: trailOpacity,
          transform: `translate3d(${
            springProps.left + springProps.width / 2 - trailSize / 2
          }px, ${
            springProps.top + springProps.height / 2 - trailSize / 2
          }px, 0)`,
          transition: 'transform 0.1s ease-out, width 0.2s ease, height 0.2s ease, opacity 0.2s ease'
        }}
      />
    );
  }, [
    animationStyle, 
    tabMagneticData, 
    activeTab, 
    color, 
    springProps
  ]);
  
  // Filter out props that shouldn't be passed to the styled component
  const filteredRestProps = Object.fromEntries(
    Object.entries(restProps).filter(([key]) => ![
      'onDrag', 'onDragStart', 'onDragEnd', 'onDragOver', 'onDragEnter', 'onDragLeave', 'onDrop', 'draggable'
    ].includes(key))
  );

  // Container styling classes
  const containerClasses = cn(
    'glass-tab-bar flex items-center relative overflow-hidden glass-radius-lg glass-p-1',
    {
      'flex-col': effectiveOrientation === 'vertical',
      'flex-row': effectiveOrientation === 'horizontal',
    },
    className
  );

  // Container styles
  const containerStyle = {
    width: effectiveWidth,
    height: effectiveHeight,
    borderRadius: typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius || '8px',
    ...style,
  };

  // Glass configuration based on props
  const glassConfig = {
    elevation: elevated ? 'level2' : 'level1',
    tier: 'medium',
    intensity: 'medium',
    depth: elevated ? 3 : 2,
    tint: 'neutral',
    border: 'subtle',
    animation: finalDisableAnimation ? 'none' : 'gentle',
    performanceMode: 'medium',
  } as const;

  return (
    <OptimizedGlass
      ref={tabsRef}
      intent="neutral"
      elevation={glassConfig.elevation as any}
      tier={glassConfig.tier as any}
      intensity={glassConfig.intensity as any}
      depth={glassConfig.depth}
      tint={glassConfig.tint as any}
      border={glassConfig.border as any}
      animation={glassConfig.animation as any}
      performanceMode={glassConfig.performanceMode as any}
      className={containerClasses}
      style={containerStyle}
      onMouseMove={isScrolling ? handleScrollGestureMove : magneticSelector}
      onMouseLeave={isScrolling ? handleScrollGestureEnd : handleMouseLeave}
      onMouseDown={handleScrollGestureStart}
      onTouchStart={handleScrollGestureStart}
      onTouchMove={isScrolling ? handleScrollGestureMove : undefined}
      onMouseUp={isScrolling ? handleScrollGestureEnd : undefined}
      onTouchEnd={isScrolling ? handleScrollGestureEnd : undefined}
      role="tablist"
      aria-label={ariaLabel}
      aria-orientation={effectiveOrientation}
      {...filteredRestProps}
    >
      {/* Selector indicator */}
      {variant !== 'default' && (
        <div
          className="absolute transition-all duration-300 ease-out will-change-transform pointer-events-none glass-radius-lg glass-surface-subtle border-subtle"
        >
          {/* Specular sheen */}
          <div className="absolute inset-0 pointer-events-none glass-radius-lg glass-overlay-specular" />
        </div>
      )}
      
      {/* Magnetic trail effect */}
      {animationStyle === 'spring' && !finalDisableAnimation && (
        <div className="absolute inset-0 pointer-events-none glass-radius-lg opacity-30">
          <div
            className="absolute glass-radius-full glass-surface-blue/20 transition-all duration-500 ease-out"
            style={{
              left: `${tabMagneticData.closestTabIndex !== null ? tabMagneticData.closestTabIndex * 60 : 0}px`,
              width: '60px',
              height: '100%',
              transform: `scale(${tabMagneticData.selectionProgress})`,
            }}
          />
        </div>
      )}
      
      {/* Tab buttons */}
      {visibleTabs.map((tab, index) => {
        const isActive = index === activeTab;
        
        // Check if this specific tab represents the "More" menu trigger
        const isMoreTab = collapseTabs && collapsedTabs.length > 0 && index === visibleTabs.length - 1;
        
        // Setup ref tracking of all tab elements 
        const setTabRef = (el: HTMLButtonElement | null) => {
          tabRefs.current[index] = el;
        };
        
        // Conditionally render using renderTab prop or default TabItemComponent
        return renderTab ? (
          <React.Fragment key={`tab-${tab.value}`}>{renderTab(tab, index, isActive)}</React.Fragment>
        ) : (
          <TabItemComponent
            id={tab.id || `tab-${index}`}
            label={tab.label}
            icon={tab.icon}
            badge={tab.badge}
            disabled={tab.disabled}
            active={isActive}
            onClick={(e) => handleTabClick(e, index)}
          />
        );
      })}
      
      {/* Scroll arrows for horizontal orientation */}
      {scrollable && effectiveOrientation === 'horizontal' && (
        <ScrollButtons
          onScrollLeft={() => handleScroll('left')}
          onScrollRight={() => handleScroll('right')}
          showLeft={showLeftScroll}
          showRight={showRightScroll}
        />
      )}

      {/* Scroll arrows for vertical orientation */}
      {scrollable && effectiveOrientation === 'vertical' && (
        <ScrollButtons
          onScrollLeft={() => handleScroll('up')}
          onScrollRight={() => handleScroll('down')}
          showLeft={showLeftScroll}
          showRight={showRightScroll}
        />
      )}
      
      {/* Collapsed tabs menu */}
      {collapseTabs && collapsedTabs.length > 0 && (
        renderCollapsedMenu ?
          renderCollapsedMenu(collapsedTabs, activeTab || 0, handleCollapsedTabSelect) : 
          <CollapsedMenu
            items={collapsedTabs}
            onItemClick={(item) => {
              const index = collapsedTabs.indexOf(item);
              handleCollapsedTabSelect(index);
            }}
          />
      )}
    </OptimizedGlass>
  );
});

// Add displayName for better debugging
GlassTabBar.displayName = 'GlassTabBar';

export default GlassTabBar;