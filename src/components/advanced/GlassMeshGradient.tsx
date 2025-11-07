import { useReducedMotion } from '@/hooks/useReducedMotion';
/**
 * AuraGlass Ambient Mesh Gradients
 * Animated mesh gradients with glass overlay effects
 */

import React, { useRef, useEffect, useMemo, forwardRef } from 'react';
import { motion, useAnimationFrame } from 'framer-motion';
import { cn } from '../../lib/utilsComprehensive';
import { OptimizedGlass } from '../../primitives';
import { useA11yId } from '../../utils/a11y';

interface MeshPoint {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  radius: number;
}

interface GlassMeshGradientProps {
  className?: string;
  colors?: string[];
  points?: number;
  speed?: number;
  blur?: number;
  opacity?: number;
  animate?: boolean;
  interactive?: boolean;
  complexity?: 'simple' | 'moderate' | 'complex';
  variant?: 'ambient' | 'vibrant' | 'subtle' | 'dark';
}

export function GlassMeshGradient({
  className,
  colors = ['var(--glass-color-primary)', '#8b5cf6', '#ec4899', 'var(--glass-color-warning)'],
  points = 4,
  speed = 0.5,
  blur = 100,
  opacity = 0.8,
  animate = true,
  interactive = false,
  complexity = 'moderate',
  variant = 'ambient',
}: GlassMeshGradientProps) {
  const prefersReducedMotion = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const meshPoints = useRef<MeshPoint[]>([]);
  const mousePos = useRef({ x: 0, y: 0 });
  const frame = useRef(0);
  
  // Initialize mesh points
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const numPoints = complexity === 'simple' ? 3 : complexity === 'moderate' ? points : points * 2;
    
    meshPoints.current = Array.from({ length: numPoints }, (_, i) => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * speed,
      vy: (Math.random() - 0.5) * speed,
      color: colors[i % colors.length],
      radius: 100 + Math.random() * 200,
    }));
  }, [colors, points, speed, complexity]);
  
  // Handle mouse interaction
  useEffect(() => {
    if (!interactive) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const rect = canvas.getBoundingClientRect();
      mousePos.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [interactive]);
  
  // Resize handler
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const parent = canvas.parentElement;
      if (!parent) return;
      
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Animation loop
  useAnimationFrame((time) => {
    if (!animate) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    frame.current += 1;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw mesh points
    meshPoints.current.forEach((point, i) => {
      // Update position
      if (animate) {
        point.x += point.vx;
        point.y += point.vy;

        // Bounce off walls
        if (point.x < 0 || point.x > canvas.width) point.vx *= -1;
        if (point.y < 0 || point.y > canvas.height) point.vy *= -1;

        // Keep in bounds
        point.x = Math.max(0, Math.min(canvas.width, point.x));
        point.y = Math.max(0, Math.min(canvas.height, point.y));

        // Interactive mouse repulsion
        if (interactive) {
          const dx = mousePos.current.x - point.x;
          const dy = mousePos.current.y - point.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            const force = (150 - dist) / 150;
            point.vx -= (dx / dist) * force * 0.5;
            point.vy -= (dy / dist) * force * 0.5;
          }
        }

        // Add sinusoidal movement for organic feel
        point.x += Math.sin(frame.current * 0.01 + i) * 0.3;
        point.y += Math.cos(frame.current * 0.01 + i) * 0.3;
      }

      // Create gradient
      const gradient = ctx.createRadialGradient(
        point.x, point.y, 0,
        point.x, point.y, point.radius
      );

      const color = point.color;
      gradient.addColorStop(0, `${color}${Math.floor(opacity * 255).toString(16)}`);
      gradient.addColorStop(0.5, `${color}${Math.floor(opacity * 0.5 * 255).toString(16)}`);
      gradient.addColorStop(1, `${color}00`);

      // Draw gradient
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    });

    // Apply additional effects based on variant
    if (variant === 'vibrant') {
      ctx.globalCompositeOperation = 'screen';
    } else if (variant === 'dark') {
      ctx.globalCompositeOperation = 'multiply';
    } else if (variant === 'subtle') {
      ctx.globalAlpha = 0.5;
    }
  });
  
  // Generate CSS filter based on variant
  const filterStyle = useMemo(() => {
    switch (variant) {
      case 'vibrant':
        return 'saturate(1.5) brightness(1.2)';
      case 'subtle':
        return 'saturate(0.8) brightness(0.9)';
      case 'dark':
        return 'saturate(1.2) brightness(0.7) contrast(1.2)';
      default:
        return 'saturate(1) brightness(1)';
    }
  }, [variant]);
  
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{
          filter: `blur(${blur}px) ${filterStyle}`,
          opacity,
        }}
      />

    </div>
  );
}

// Animated mesh gradient background component
export const GlassMeshBackground = forwardRef<HTMLDivElement, GlassMeshGradientProps & { children?: React.ReactNode }>(function GlassMeshBackground({
  children,
  className,
  ...meshProps
}, ref) {
  const backgroundId = useA11yId('mesh-background');
  
  return (
    <OptimizedGlass
      ref={ref}
      intensity="subtle"
      blur="medium"
      className={cn("relative", className)}
      id={backgroundId}
      role="presentation"
      aria-label="Mesh gradient background"
      aria-hidden="true"
    >
      <GlassMeshGradient
        className="absolute inset-0"
        {...meshProps}
      />
      <div className="relative z-10">
        {children}
      </div>
    </OptimizedGlass>
  );
});

// Preset configurations
export const meshGradientPresets = {
  ocean: {
    colors: ['#0891b2', '#06b6d4', '#0ea5e9', '#0284c7'],
    variant: 'ambient' as const,
    speed: 0.3,
    blur: 120,
  },
  sunset: {
    colors: ['#f97316', '#fb923c', '#ec4899', '#f43f5e'],
    variant: 'vibrant' as const,
    speed: 0.4,
    blur: 100,
  },
  aurora: {
    colors: ['var(--glass-color-success)', '#14b8a6', '#06b6d4', 'var(--glass-color-primary)', '#8b5cf6'],
    variant: 'ambient' as const,
    speed: 0.2,
    blur: 150,
    points: 5,
  },
  galaxy: {
    colors: ['#6366f1', '#8b5cf6', '#a855f7', '#d946ef'],
    variant: 'dark' as const,
    speed: 0.15,
    blur: 200,
    complexity: 'complex' as const,
  },
  minimal: {
    colors: ['var(--glass-gray-200)', 'var(--glass-gray-300)', 'var(--glass-gray-400)'],
    variant: 'subtle' as const,
    speed: 0.1,
    blur: 150,
    complexity: 'simple' as const,
  },
};

// Hook for dynamic color generation
export function useMeshGradientColors(baseColor: string, scheme: 'analogous' | 'complementary' | 'triadic' = 'analogous'): string[] {
  return useMemo(() => {
    // Parse base color (simplified - would need proper color parsing)
    const colors: string[] = [baseColor];
    
    // Generate color scheme (simplified logic)
    switch (scheme) {
      case 'analogous':
        colors.push(
          adjustHue(baseColor, 30),
          adjustHue(baseColor, -30),
          adjustHue(baseColor, 60)
        );
        break;
      case 'complementary':
        colors.push(
          adjustHue(baseColor, 180),
          adjustHue(baseColor, 150),
          adjustHue(baseColor, 210)
        );
        break;
      case 'triadic':
        colors.push(
          adjustHue(baseColor, 120),
          adjustHue(baseColor, 240)
        );
        break;
    }
    
    return colors;
  }, [baseColor, scheme]);
}

// Helper function for hue adjustment (simplified)
function adjustHue(color: string, degrees: number): string {
  // This would need proper HSL conversion
  // For now, return variations
  return color + degrees.toString(16).slice(-2);
}
