import React, { useState, useRef, useEffect, useMemo } from 'react';
import { cn } from '../../../lib/utilsComprehensive';
import { ContrastGuard, TextWithContrast } from '@/components/accessibility/ContrastGuard';

export interface AtmosphericEffectsProps {
  qualityTier?: 'low' | 'medium' | 'high' | 'ultra';
  color?: string;
  isReducedMotion?: boolean;

  /** Glass surface intent */
  intent?: 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
  
  /** Glass surface elevation */
  elevation?: 'level1' | 'level2' | 'level3' | 'level4';
  
  /** Performance tier */
  tier?: 'low' | 'medium' | 'high';
}

export const AtmosphericEffects: React.FC<AtmosphericEffectsProps> = ({
  // TODO: Integrate ContrastGuard in chart labels, tooltips, and legends for WCAG AA compliance

  qualityTier = 'medium',
  color = 'var(--glass-color-primary)',
  isReducedMotion = false,
}) => {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    opacity: number;
    velocity: { x: number; y: number };
  }>>([]);

  const animationRef = useRef<number>();
  const containerRef = useRef<HTMLDivElement>(null);

  // Particle count based on quality tier
  const particleCount = useMemo(() => {
    switch (qualityTier) {
      case 'low': return 0;
      case 'medium': return 15;
      case 'high': return 30;
      case 'ultra': return 50;
      default: return 15;
    }
  }, [qualityTier]);

  // Initialize particles
  useEffect(() => {
    if (isReducedMotion || qualityTier === 'low') {
      setParticles([]);
      return;
    }

    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.6 + 0.2,
      velocity: {
        x: (Math.random() - 0.5) * 0.5,
        y: (Math.random() - 0.5) * 0.5,
      },
    }));

    setParticles(newParticles);
  }, [particleCount, isReducedMotion, qualityTier]);

  // Animate particles
  useEffect(() => {
        if (isReducedMotion || !particles || particles.length === 0) return;

    const animate = () => {
      setParticles(prevParticles =>
        prevParticles.map((particle: any) => ({
          ...particle,
          x: (particle.x + particle.velocity.x + 100) % 100,
          y: (particle.y + particle.velocity.y + 100) % 100,
          opacity: 0.2 + Math.sin(Date.now() * 0.001 + particle.id) * 0.3,
        }))
      );

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isReducedMotion, particles.length]);

  if (qualityTier === 'low' || isReducedMotion) {
    return null;
  }

  const effectStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
    overflow: 'hidden',
    zIndex: -1,
  };

  return (
    <div data-glass-component ref={containerRef} style={effectStyle}>
      {/* Gradient background */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(ellipse at center, ${color}10 0%, transparent 70%)`,
          opacity: 0.3,
        }}
      />

      {/* Floating particles */}
      {particles.map((particle: any) => (
        <div
          key={particle.id}
          style={{
            position: 'absolute',
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${color}${Math.round(particle.opacity * 255).toString(16).padStart(2, '0')}, transparent)`,
            filter: `blur(${particle.size * 0.5}px)`,
            transition: 'all 0.3s ease',
          }}
        />
      ))}

      {/* Ambient glow effect */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '20%',
          width: '60%',
          height: '60%',
          background: `radial-gradient(ellipse, ${color}08, transparent)`,
          borderRadius: '50%',
          filter: 'blur(var(--glass-blur-lg))',
          animation: isReducedMotion ? 'none' : 'pulse 8s ease-in-out infinite',
        }}
      />
    </div>
  );
};

export default AtmosphericEffects;
