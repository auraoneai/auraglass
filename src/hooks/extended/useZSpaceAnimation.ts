import React from 'react';
import { useRef, useCallback, useEffect, useState } from 'react';
import { ZSpaceManager, zSpaceLayer } from '../../core/mixins/zSpaceLayer';
import { useMultiSpring, SpringConfig } from '../../animations/hooks/useMultiSpringBasic';

export interface ZSpaceLayer {
  id: string;
  zIndex: number;
  elevation: number;
  opacity: number;
  scale: number;
  blur: number;
  transform: string;
}

export interface ZSpaceAnimationConfig {
  /** Enable z-space animations */
  enabled?: boolean;
  /** Spring configuration for z-space transitions */
  springConfig?: SpringConfig;
  /** Default transition duration */
  duration?: number;
  /** Enable layered animations */
  layered?: boolean;
  /** Layer stagger delay */
  staggerDelay?: number;
  /** Maximum concurrent animations */
  maxConcurrent?: number;
  /** Enable depth-based scaling */
  depthScaling?: boolean;
  /** Depth scaling factor */
  depthScaleFactor?: number;
  /** Enable blur effects based on depth */
  depthBlur?: boolean;
  /** Maximum blur amount */
  maxBlur?: number;
}

const DEFAULT_CONFIG: Required<ZSpaceAnimationConfig> = {
  enabled: true,
  springConfig: { stiffness: 200, damping: 25, mass: 1 },
  duration: 300,
  layered: true,
  staggerDelay: 50,
  maxConcurrent: 5,
  depthScaling: true,
  depthScaleFactor: 0.02,
  depthBlur: true,
  maxBlur: 5,
};

export function useZSpaceAnimation(
  initialLayers: ZSpaceLayer[] = [],
  config: ZSpaceAnimationConfig = {}
) {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  const zSpaceManagerRef = useRef(ZSpaceManager.getInstance());
  const [layers, setLayers] = useState<ZSpaceLayer[]>(initialLayers);
  const [animatingLayers, setAnimatingLayers] = useState<Set<string>>(new Set());
  const springSystem = useMultiSpring({}, { config: finalConfig.springConfig });

  // Initialize layers with z-space management
  useEffect(() => {
    initialLayers.forEach((layer: any) => {
      zSpaceManagerRef.current.registerLayer(layer.id, layer.zIndex);
    });

    setLayers(initialLayers);

    return () => {
      initialLayers.forEach((layer: any) => {
        zSpaceManagerRef.current.unregisterLayer(layer.id);
      });
    };
  }, [initialLayers]);

  // Animate layer to new z-space position
  const animateToZSpace = useCallback((
    layerId: string,
    targetElevation: number,
    options: {
      duration?: number;
      easing?: string;
      onComplete?: () => void;
    } = {}
  ) => {
    if (!finalConfig.enabled) return;

    const layer = layers.find(l => l.id === layerId);
    if (!layer) return;

    const { duration = finalConfig.duration, onComplete } = options;

    // Mark as animating
    setAnimatingLayers((prev: Set<string>) => new Set(prev).add(layerId));

    // Create spring animation targets
    const springTargets: Record<string, number> = {
      [`${layerId}-elevation`]: targetElevation,
      [`${layerId}-opacity`]: targetElevation > layer.elevation ? 1 : 0.8,
      [`${layerId}-scale`]: finalConfig.depthScaling
        ? 1 + (targetElevation * finalConfig.depthScaleFactor)
        : 1,
      [`${layerId}-blur`]: finalConfig.depthBlur
        ? Math.min(finalConfig.maxBlur, targetElevation * 0.1)
        : 0,
    };

    springSystem.start(springTargets);

    // Update layer after animation
    setTimeout(() => {
      setLayers((prev: any) => prev.map((l: any) =>
        l.id === layerId
          ? {
              ...l,
              elevation: targetElevation,
              zIndex: zSpaceManagerRef.current.getLayerZIndex(layerId),
              opacity: springTargets?.[`${layerId}-opacity`],
              scale: springTargets?.[`${layerId}-scale`],
              blur: springTargets?.[`${layerId}-blur`],
              transform: `scale(${springTargets?.[`${layerId}-scale`]}) translateZ(${targetElevation}px)`,
            }
          : l
      ));

      setAnimatingLayers((prev: Set<string>) => {
        const next = new Set(prev);
        next.delete(layerId);
        return next;
      });

      onComplete?.();
    }, duration);
  }, [layers, finalConfig, springSystem]);

  // Animate layered transition
  const animateLayeredTransition = useCallback((
    layerUpdates: Array<{
      id: string;
      elevation: number;
      delay?: number;
    }>,
    globalOptions: {
      staggerDelay?: number;
      duration?: number;
    } = {}
  ) => {
    if (!finalConfig.enabled || !finalConfig.layered) return;

    const { staggerDelay = finalConfig.staggerDelay, duration } = globalOptions;

    layerUpdates.forEach((update, index) => {
      const delay = update.delay ?? (index * staggerDelay);

      setTimeout(() => {
        animateToZSpace(update.id, update.elevation, { duration });
      }, delay);
    });
  }, [finalConfig, animateToZSpace]);

  // Bring layer to front
  const bringToFront = useCallback((
    layerId: string,
    options?: { duration?: number; onComplete?: () => void }
  ) => {
    const maxElevation = Math.max(...layers.map((l: any) => l.elevation)) + 10;
    animateToZSpace(layerId, maxElevation, options);
  }, [layers, animateToZSpace]);

  // Send layer to back
  const sendToBack = useCallback((
    layerId: string,
    options?: { duration?: number; onComplete?: () => void }
  ) => {
    const minElevation = Math.min(...layers.map((l: any) => l.elevation)) - 10;
    animateToZSpace(layerId, minElevation, options);
  }, [layers, animateToZSpace]);

  // Create depth-based stacking
  const createDepthStack = useCallback((
    layerIds: string[],
    baseElevation: number = 0,
    elevationStep: number = 5
  ) => {
    const updates = layerIds.map((id, index) => ({
      id,
      elevation: baseElevation + (index * elevationStep),
    }));

    animateLayeredTransition(updates);
  }, [animateLayeredTransition]);

  // Animate focus transition
  const animateFocusTransition = useCallback((
    focusedLayerId: string,
    backgroundLayers: string[],
    options: {
      focusElevation?: number;
      backgroundElevation?: number;
      duration?: number;
    } = {}
  ) => {
    const {
      focusElevation = 20,
      backgroundElevation = -5,
      duration = finalConfig.duration,
    } = options;

    // Bring focused layer to front
    animateToZSpace(focusedLayerId, focusElevation, { duration });

    // Push background layers back
    setTimeout(() => {
      backgroundLayers.forEach((layerId: any) => {
        animateToZSpace(layerId, backgroundElevation, { duration: duration * 0.8 });
      });
    }, duration * 0.2);
  }, [animateToZSpace, finalConfig.duration]);

  // Get layer styles for rendering
  const getLayerStyles = useCallback((layerId: string) => {
    const layer = layers.find(l => l.id === layerId);
    if (!layer) return {};

    const isAnimating = animatingLayers.has(layerId);
    const springValues = springSystem.values;

    // Use spring values if animating, otherwise use layer values
    const elevation = isAnimating
      ? springValues[`${layerId}-elevation`] ?? layer.elevation
      : layer.elevation;

    const opacity = isAnimating
      ? springValues[`${layerId}-opacity`] ?? layer.opacity
      : layer.opacity;

    const scale = isAnimating
      ? springValues[`${layerId}-scale`] ?? layer.scale
      : layer.scale;

    const blur = isAnimating
      ? springValues[`${layerId}-blur`] ?? layer.blur
      : layer.blur;

    return {
      ...zSpaceLayer({
        zIndex: zSpaceManagerRef.current.getLayerZIndex(layerId),
        elevation,
        opacity,
      }),
      transform: `scale(${scale}) translateZ(${elevation}px)`,
      filter: blur > 0 ? `blur(${blur}px)` : 'none',
      transition: finalConfig.enabled ? `all ${finalConfig.duration}ms ease` : 'none',
    };
  }, [layers, animatingLayers, springSystem.values, finalConfig]);

  // Add new layer
  const addLayer = useCallback((
    layer: Omit<ZSpaceLayer, 'zIndex'>,
    options: {
      animateIn?: boolean;
      initialElevation?: number;
      duration?: number;
    } = {}
  ) => {
    const { animateIn = true, initialElevation = 0, duration } = options;

    const newLayer: ZSpaceLayer = {
      ...layer,
      zIndex: zSpaceManagerRef.current.registerLayer(layer.id),
      elevation: initialElevation,
      opacity: 0,
      scale: 0.8,
      blur: 0,
      transform: `scale(0.8) translateZ(${initialElevation}px)`,
    };

    setLayers((prev: any) => [...prev, newLayer]);

    if (animateIn) {
      setTimeout(() => {
        animateToZSpace(layer.id, layer.elevation, { duration });
      }, 16); // Next frame
    }
  }, [animateToZSpace]);

  // Remove layer
  const removeLayer = useCallback((
    layerId: string,
    options: {
      animateOut?: boolean;
      duration?: number;
      onComplete?: () => void;
    } = {}
  ) => {
    const { animateOut = true, duration, onComplete } = options;

    if (animateOut) {
      animateToZSpace(layerId, -20, {
        duration,
        onComplete: () => {
          setLayers((prev: any) => prev.filter((l: any) => l.id !== layerId));
          zSpaceManagerRef.current.unregisterLayer(layerId);
          onComplete?.();
        },
      });
    } else {
      setLayers((prev: any) => prev.filter((l: any) => l.id !== layerId));
      zSpaceManagerRef.current.unregisterLayer(layerId);
      onComplete?.();
    }
  }, [animateToZSpace]);

  // Update layer properties
  const updateLayer = useCallback((
    layerId: string,
    updates: Partial<ZSpaceLayer>,
    options: {
      animate?: boolean;
      duration?: number;
    } = {}
  ) => {
    const { animate = true, duration } = options;

    if (animate && updates.elevation !== undefined) {
      animateToZSpace(layerId, updates.elevation, { duration });
    } else {
      setLayers((prev: any) => prev.map((layer: any) =>
        layer.id === layerId ? { ...layer, ...updates } : layer
      ));
    }
  }, [animateToZSpace]);

  // Get layer information
  const getLayer = useCallback((layerId: string): ZSpaceLayer | undefined => {
    return layers.find(l => l.id === layerId);
  }, [layers]);

  // Get all layer information
  const getAllLayers = useCallback((): ZSpaceLayer[] => {
    return [...layers];
  }, [layers]);

  // Check if layer is animating
  const isLayerAnimating = useCallback((layerId: string): boolean => {
    return animatingLayers.has(layerId);
  }, [animatingLayers]);

  // Get animation progress
  const getAnimationProgress = useCallback((layerId: string): number => {
    if (!isLayerAnimating(layerId)) return 1;

    const springValues = springSystem.values;
    const targetElevation = layers.find(l => l.id === layerId)?.elevation ?? 0;
    const currentElevation = springValues[`${layerId}-elevation`] ?? targetElevation;

    // Simple progress calculation
    return Math.abs(currentElevation / targetElevation) || 0;
  }, [isLayerAnimating, springSystem.values, layers]);

  return {
    layers,
    animatingLayers,

    // Layer management
    addLayer,
    removeLayer,
    updateLayer,
    getLayer,
    getAllLayers,

    // Animation methods
    animateToZSpace,
    animateLayeredTransition,
    bringToFront,
    sendToBack,
    createDepthStack,
    animateFocusTransition,

    // Style methods
    getLayerStyles,

    // State methods
    isLayerAnimating,
    getAnimationProgress,

    // Configuration
    config: finalConfig,
    zSpaceManager: zSpaceManagerRef.current,
  };
}

// Hook for parallax z-space effects
export function useParallaxZSpace(
  layers: Array<{ id: string; depth: number; content: React.ReactNode }>,
  config: ZSpaceAnimationConfig & {
    mouseInfluence?: number;
    scrollInfluence?: number;
  } = {}
) {
  const {
    mouseInfluence = 0.1,
    scrollInfluence = 0.5,
    ...zSpaceConfig
  } = config;

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollPosition, setScrollPosition] = useState(0);

  const zSpaceAnimation = useZSpaceAnimation(
    layers.map((layer: any) => ({
      id: layer.id,
      zIndex: 1,
      elevation: 0,
      opacity: 1,
      scale: 1,
      blur: 0,
      transform: '',
    })),
    zSpaceConfig
  );

  // Mouse parallax effect
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 2;
      const y = (event.clientY / window.innerHeight - 0.5) * 2;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Scroll parallax effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Apply parallax effects
  useEffect(() => {
    layers.forEach((layer: any) => {
      const mouseOffset = {
        x: mousePosition.x * layer.depth * mouseInfluence * 10,
        y: mousePosition.y * layer.depth * mouseInfluence * 10,
      };

      const scrollOffset = scrollPosition * layer.depth * scrollInfluence * 0.1;

      const totalElevation = mouseOffset.y + scrollOffset;

      zSpaceAnimation.animateToZSpace(layer.id, totalElevation, {
        duration: 50, // Quick response for parallax
      });
    });
  }, [layers, mousePosition, scrollPosition, mouseInfluence, scrollInfluence, zSpaceAnimation]);

  return {
    ...zSpaceAnimation,
    mousePosition,
    scrollPosition,
  };
}

// Hook for 3D card stacking effects
export function useCardStackZSpace(
  cardCount: number,
  config: ZSpaceAnimationConfig & {
    cardSpacing?: number;
    maxRotation?: number;
    interactionRadius?: number;
  } = {}
) {
  const {
    cardSpacing = 2,
    maxRotation = 15,
    interactionRadius = 200,
    ...zSpaceConfig
  } = config;

  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Create card layers
  const cardLayers: ZSpaceLayer[] = Array.from({ length: cardCount }, (_, index) => ({
    id: `card-${index}`,
    zIndex: cardCount - index,
    elevation: index * cardSpacing,
    opacity: 1,
    scale: 1,
    blur: 0,
    transform: `translateZ(${index * cardSpacing}px)`,
  }));

  const zSpaceAnimation = useZSpaceAnimation(cardLayers, zSpaceConfig);

  // Mouse interaction for 3D effects
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Apply 3D card effects
  useEffect(() => {
    cardLayers.forEach((_, index) => {
      const cardId = `card-${index}`;
      const baseElevation = index * cardSpacing;

      if (hoveredCard === index) {
        // Lift hovered card
        zSpaceAnimation.animateToZSpace(cardId, baseElevation + 20, {
          duration: 200,
        });
      } else if (hoveredCard !== null) {
        // Adjust other cards based on proximity to hovered card
        const distance = Math.abs(index - hoveredCard);
        const elevationOffset = Math.max(0, 10 - distance * 2);
        zSpaceAnimation.animateToZSpace(cardId, baseElevation + elevationOffset, {
          duration: 300,
        });
      } else {
        // Return to base position
        zSpaceAnimation.animateToZSpace(cardId, baseElevation, {
          duration: 400,
        });
      }
    });
  }, [cardLayers, hoveredCard, cardSpacing, zSpaceAnimation]);

  const handleCardHover = useCallback((cardIndex: number) => {
    setHoveredCard(cardIndex);
  }, []);

  const handleCardLeave = useCallback(() => {
    setHoveredCard(null);
  }, []);

  return {
    ...zSpaceAnimation,
    hoveredCard,
    handleCardHover,
    handleCardLeave,
    cardCount,
  };
}

// Hook for depth-based navigation
export function useDepthNavigation(
  navigationItems: Array<{ id: string; label: string; depth: number }>,
  config: ZSpaceAnimationConfig = {}
) {
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [navigationPath, setNavigationPath] = useState<string[]>([]);

  // Create navigation layers with depth-based positioning
  const navLayers: ZSpaceLayer[] = navigationItems.map((item, index) => ({
    id: item?.id,
    zIndex: 10 - item?.depth,
    elevation: item?.depth * 5,
    opacity: 1,
    scale: 1 - (item?.depth * 0.1),
    blur: item?.depth * 2,
    transform: `scale(${1 - (item?.depth * 0.1)}) translateZ(${item?.depth * 5}px)`,
  }));

  const zSpaceAnimation = useZSpaceAnimation(navLayers, config);

  const navigateTo = useCallback((itemId: string) => {
    const item = navigationItems.find(i => i.id === itemId);
    if (!item) return;

    // Update navigation path
    const newPath = [...navigationPath];
    const existingIndex = newPath.indexOf(itemId);

    if (existingIndex >= 0) {
      // Going back in navigation
      newPath.splice(existingIndex + 1);
    } else {
      // Going deeper
      newPath.push(itemId);
    }

    setNavigationPath(newPath);
    setActiveItem(itemId);

    // Animate depth changes
    navigationItems.forEach((navItem: any) => {
      const isInPath = newPath.includes(navItem.id);
      const isActive = navItem.id === itemId;

      const targetElevation = isActive ? 15 :
                            isInPath ? 10 - (newPath.indexOf(navItem.id) * 2) :
                            navItem.depth * 5;

      zSpaceAnimation.animateToZSpace(navItem.id, targetElevation, {
        duration: 300,
      });
    });
  }, [navigationItems, navigationPath, zSpaceAnimation]);

  const goBack = useCallback(() => {
    if ((navigationPath?.length || 0) > 1) {
      const previousItem = navigationPath[(navigationPath?.length || 0) - 2];
      navigateTo(previousItem);
    }
  }, [navigationPath, navigateTo]);

  const goHome = useCallback(() => {
    if ((navigationPath?.length || 0) > 0) {
      navigateTo(navigationPath[0]);
    }
  }, [navigationPath, navigateTo]);

  return {
    ...zSpaceAnimation,
    activeItem,
    navigationPath,
    navigateTo,
    goBack,
    goHome,
    canGoBack: (navigationPath?.length || 0) > 1,
  };
}
