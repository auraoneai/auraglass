import { useReducedMotion } from '@/hooks/useReducedMotion';
'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { motion } from 'framer-motion';
import {
    Cloud,
    Flower,
    Leaf,
    Pause,
    Play,
    Snowflake,
    Sun,
    Wind
} from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '../../lib/utilsComprehensive';
import * as THREE from 'three';
import { SeededRandom } from '../../utils/random';

// Seasonal particle systems
const SeasonalParticleFactory = {
  // Snow particles
  createSnowParticle: (size = 1, complexity = 6) => {
    const geometry = new THREE.ConeGeometry(size * 0.1, size * 0.3, complexity);
    return geometry;
  },

  // Leaf particles
  createLeafParticle: (size = 1) => {
    const geometry = new THREE.PlaneGeometry(size, size * 1.5);
    // Add some curvature to make it look like a leaf
    const positions = geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const y = positions[i + 1];
      positions[i + 2] = Math.sin(x * 5) * 0.1 * Math.abs(y);
    }
    geometry.computeVertexNormals();
    return geometry;
  },

  // Flower petals
  createPetalParticle: (size = 1) => {
    const geometry = new THREE.PlaneGeometry(size, size * 2);
    // Curve the petal
    const positions = geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const y = positions[i + 1];
      positions[i + 2] = Math.sin(x * 3) * 0.2 * (1 - Math.abs(y));
    }
    geometry.computeVertexNormals();
    return geometry;
  },

  // Sun rays
  createSunRayParticle: (length = 1, width = 0.1) => {
    const geometry = new THREE.CylinderGeometry(width, width * 0.5, length, 8);
    return geometry;
  },

  // Rain drops
  createRainDropParticle: (length = 1) => {
    const geometry = new THREE.CylinderGeometry(0.02, 0.02, length, 6);
    return geometry;
  },

  // Create particle field for season
  createSeasonalField: (season: string, count = 50, random: SeededRandom = new SeededRandom()) => {
    const particles = [];

    for (let i = 0; i < count; i++) {
      let geometry;
      let material;

      switch (season) {
        case 'winter':
          geometry = SeasonalParticleFactory.createSnowParticle(0.5 + random.next() * 0.5);
          material = SeasonalParticleFactory.createSnowMaterial();
          break;
        case 'autumn':
          geometry = SeasonalParticleFactory.createLeafParticle(0.3 + random.next() * 0.4);
          material = SeasonalParticleFactory.createLeafMaterial();
          break;
        case 'spring':
          geometry = SeasonalParticleFactory.createPetalParticle(0.2 + random.next() * 0.3);
          material = SeasonalParticleFactory.createPetalMaterial(random);
          break;
        case 'summer':
          geometry = SeasonalParticleFactory.createSunRayParticle(1 + random.next() * 2);
          material = SeasonalParticleFactory.createSunRayMaterial();
          break;
        default:
          geometry = new THREE.SphereGeometry(0.1);
          material = new THREE.MeshBasicMaterial({ color: 0xffffff });
      }

      const particle = new THREE.Mesh(geometry, material);
      particle.position.set(
        random.nextSigned() * 10,
        random.next() * 15,
        random.nextSigned() * 5
      );
      particle.rotation.set(
        random.next() * Math.PI * 2,
        random.next() * Math.PI * 2,
        random.next() * Math.PI * 2
      );

      // Add custom properties for animation
      particle.userData = {
        originalY: particle.position.y,
        fallSpeed: 0.01 + random.next() * 0.05,
        rotationSpeed: random.nextSigned() * 0.02,
        windOffset: random.next() * Math.PI * 2,
        season
      };

      particles.push(particle);
    }

    return particles;
  },

  // Material factories
  createSnowMaterial: () => new THREE.MeshPhongMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.8,
    shininess: 100
  }),

  createLeafMaterial: () => new THREE.MeshPhongMaterial({
    color: new THREE.Color().setHSL(0.1, 0.8, 0.4),
    transparent: true,
    opacity: 0.9,
    side: THREE.DoubleSide
  }),

  createPetalMaterial: (random: SeededRandom) => new THREE.MeshPhongMaterial({
    color: new THREE.Color().setHSL(random.nextInRange(0.8, 1.0), 0.8, 0.6),
    transparent: true,
    opacity: 0.8,
    side: THREE.DoubleSide
  }),

  createSunRayMaterial: () => new THREE.MeshBasicMaterial({
    color: new THREE.Color(1, 0.9, 0.3),
    transparent: true,
    opacity: 0.6
  }),

  createRainMaterial: () => new THREE.MeshBasicMaterial({
    color: new THREE.Color(0.5, 0.7, 1),
    transparent: true,
    opacity: 0.7
  })
};

// Seasonal animation system
const SeasonalAnimations = {
  // Snow falling animation
  snowFall: (particle: THREE.Mesh, time: number, windStrength: number = 1) => {
    particle.position.y -= particle.userData.fallSpeed;
    particle.position.x += Math.sin(time * 2 + particle.userData.windOffset) * 0.01 * windStrength;
    particle.rotation.x += particle.userData.rotationSpeed;
    particle.rotation.y += particle.userData.rotationSpeed * 0.5;

    // Reset particle when it falls below screen
    if (particle.position.y < -10) {
      particle.position.y = 15 + Math.random() * 5;
      particle.position.x = (Math.random() - 0.5) * 20;
    }
  },

  // Leaf falling animation
  leafFall: (particle: THREE.Mesh, time: number, windStrength: number = 1) => {
    particle.position.y -= particle.userData.fallSpeed;
    particle.position.x += Math.sin(time * 1.5 + particle.userData.windOffset) * 0.02 * windStrength;
    particle.rotation.x += particle.userData.rotationSpeed;
    particle.rotation.z += particle.userData.rotationSpeed * 2;

    if (particle.position.y < -10) {
      particle.position.y = 15 + Math.random() * 5;
      particle.position.x = (Math.random() - 0.5) * 20;
    }
  },

  // Petal floating animation
  petalFloat: (particle: THREE.Mesh, time: number, windStrength: number = 1) => {
    particle.position.y -= particle.userData.fallSpeed * 0.5;
    particle.position.x += Math.sin(time * 1 + particle.userData.windOffset) * 0.015 * windStrength;
    particle.rotation.y += particle.userData.rotationSpeed;
    particle.rotation.x += Math.sin(time * 3 + particle.userData.windOffset) * 0.01;

    if (particle.position.y < -10) {
      particle.position.y = 15 + Math.random() * 5;
      particle.position.x = (Math.random() - 0.5) * 20;
    }
  },

  // Sun ray pulsing animation
  sunRayPulse: (particle: THREE.Mesh, time: number) => {
    const pulse = Math.sin(time * 4) * 0.3 + 0.7;
    particle.scale.y = pulse;
    if (particle.material && 'opacity' in particle.material) {
      particle.material.opacity = 0.3 + pulse * 0.4;
    }
  },

  // Rain falling animation
  rainFall: (particle: THREE.Mesh, time: number, windStrength: number = 1) => {
    particle.position.y -= particle.userData.fallSpeed * 3;
    particle.position.x += windStrength * 0.05;

    if (particle.position.y < -10) {
      particle.position.y = 15 + Math.random() * 5;
      particle.position.x = (Math.random() - 0.5) * 20;
    }
  }
};

// Main SeasonalParticles Component
export interface SeasonalParticlesProps {
  season?: 'winter' | 'spring' | 'summer' | 'autumn' | 'auto';
  particleCount?: number;
  windStrength?: number;
  animationSpeed?: number;
  className?: string;
  showControls?: boolean;
  autoSeason?: boolean;
  seasonDuration?: number;
  onSeasonChange?: (season: string) => void;
  seed?: number | string;
  children?: React.ReactNode;
}

export function SeasonalParticles({
  season = 'auto',
  particleCount = 30,
  windStrength = 1,
  animationSpeed = 1,
  className='',
  showControls = false,
  autoSeason = true,
  seasonDuration = 10000, // 10 seconds per season
  onSeasonChange,
  children,
  seed,
}: SeasonalParticlesProps) {
  const prefersReducedMotion = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentSeason, setCurrentSeason] = useState(season === 'auto' ? 'winter' : season);
  const [particles, setParticles] = useState<THREE.Mesh[]>([]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [seasonIndex, setSeasonIndex] = useState(0);

  const seasons = ['winter', 'spring', 'summer', 'autumn'];

  // Initialize particles for current season
  useEffect(() => {
    const seededRandom = new SeededRandom(seed ?? `${currentSeason}-${particleCount}`);
    const newParticles = SeasonalParticleFactory.createSeasonalField(currentSeason, particleCount, seededRandom);
    setParticles(newParticles);

    onSeasonChange?.(currentSeason);
  }, [currentSeason, particleCount, onSeasonChange, seed]);

  // Auto season rotation
  useEffect(() => {
    if (!autoSeason || season !== 'auto') return;

    const interval = setInterval(() => {
      setSeasonIndex((prev: any) => {
        const next = (prev + 1) % seasons.length;
        setCurrentSeason(seasons[next] as 'winter' | 'spring' | 'summer' | 'autumn');
        return next;
      });
    }, seasonDuration);

    return () => clearInterval(interval);
  }, [autoSeason, season, seasonDuration, seasons]);

  // Manual season control
  const changeSeason = useCallback((newSeason: string) => {
    setCurrentSeason(newSeason as 'winter' | 'spring' | 'summer' | 'autumn');
    setSeasonIndex(seasons.indexOf(newSeason));
  }, [seasons]);

  // Play/pause control
  const togglePlay = useCallback(() => {
    setIsPlaying((prev: any) => !prev);
  }, []);

  // Get season icon
  const getSeasonIcon = (seasonName: string) => {
    switch (seasonName) {
      case 'winter': return <Snowflake className={cn("glass-w-4 glass-h-4")} />;
      case 'spring': return <Flower className={cn("glass-w-4 glass-h-4")} />;
      case 'summer': return <Sun className={cn("glass-w-4 glass-h-4")} />;
      case 'autumn': return <Leaf className={cn("glass-w-4 glass-h-4")} />;
      default: return <Cloud className={cn("glass-w-4 glass-h-4")} />;
    }
  };

  // Get season colors for UI
  const getSeasonColors = (seasonName: string) => {
    switch (seasonName) {
      case 'winter': return 'text-blue-400 border-blue-400/30 bg-blue-400/10';
      case 'spring': return 'text-pink-400 border-pink-400/30 bg-pink-400/10';
      case 'summer': return 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10';
      case 'autumn': return 'text-orange-400 border-orange-400/30 bg-orange-400/10';
      default: return 'text-gray-400 border-gray-400/30 bg-gray-400/10';
    }
  };

  return (
    <div className={cn("seasonal-particles glass-relative glass-overflow-hidden", className)}>
      {/* 3D Canvas */}
      <Canvas
        ref={canvasRef}
        className={cn("glass-absolute glass-inset-0 glass-pointer-events-none")}
        camera={{ position: [0, 5, 10], fov: 75 }}
        gl={{ alpha: true, antialias: true }}
      >
        <SeasonalScene
          particles={particles}
          currentSeason={currentSeason}
          windStrength={windStrength}
          animationSpeed={animationSpeed}
          isPlaying={isPlaying}
        />
      </Canvas>

      {/* Content overlay */}
      <div className={cn("glass-relative glass-z-10")}>
        {children}
      </div>

      {/* Season indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
        className={cn("glass-absolute glass-top-4 glass-left-4 glass-px-3 glass-py-2 glass-radius-lg glass-foundation-complete glass-border", getSeasonColors(currentSeason))}
      >
        <div className={cn("glass-flex glass-items-center glass-gap-2")}>
          {getSeasonIcon(currentSeason)}
          <span className={cn("glass-text-sm glass-font-medium glass-capitalize")}>{currentSeason}</span>
        </div>
      </motion.div>

      {/* Controls */}
      {showControls && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          className="absolute bottom-4 right-4 flex flex-col gap-2"
        >
          {/* Season selector */}
          <div className="flex gap-2 p-2 glass-surface-dark/20 backdrop-blur-lg glass-radius-lg border border-white/10">
            {seasons.map((seasonName: any) => (
              <button
                key={seasonName}
                onClick={() => changeSeason(seasonName)}
                className={`p-2 rounded-lg transition-colors ${
                  currentSeason === seasonName
                    ? 'bg-white/20 text-white'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
                title={`Switch to ${seasonName}`}
              >
                {getSeasonIcon(seasonName)}
              </button>
            ))}
          </div>

          {/* Playback controls */}
          <div className="flex gap-2 p-2 glass-surface-dark/20 backdrop-blur-lg glass-radius-lg border border-white/10">
            <button
              onClick={togglePlay}
              className="p-2 glass-radius-lg text-primary hover:glass-surface-subtle/10 transition-colors"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>

            <div className="flex items-center gap-2 text-primary/60 text-sm">
              <Wind className="w-3 h-3" />
              <span>{windStrength.toFixed(1)}</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Wind strength indicator */}
      {windStrength > 0 && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
          className="absolute top-4 right-4 px-3 py-2 glass-surface-dark/20 backdrop-blur-lg glass-radius-lg border border-white/10"
        >
          <div className="flex items-center gap-2 text-primary/60 text-sm">
            <motion.div
              animate={prefersReducedMotion ? {} : {
                x: windStrength > 0 ? [0, 5, 0] : 0
              }}
              transition={prefersReducedMotion ? { duration: 0 } : {
    duration: 2,
    repeat: Infinity,
    ease: 'easeInOut'
              }}
            >
              <Wind className="w-3 h-3" />
            </motion.div>
            <span>Wind: {windStrength.toFixed(1)}</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// 3D Seasonal Scene Component
function SeasonalScene({ particles, currentSeason, windStrength, animationSpeed, isPlaying }: any) {
  const { scene } = useThree();

  // Add particles to scene
  useEffect(() => {
    particles.forEach((particle: THREE.Mesh) => {
      scene.add(particle);
    });

    return () => {
      particles.forEach((particle: THREE.Mesh) => {
        scene.remove(particle);
      });
    };
  }, [particles, scene]);

  // Animation loop
  useFrame((state) => {
    if (!isPlaying) return;

    const time = state.clock.elapsedTime * animationSpeed;

    particles.forEach((particle: THREE.Mesh) => {
      if (!particle.userData) return;

      switch (particle.userData.season || currentSeason) {
        case 'winter':
          SeasonalAnimations.snowFall(particle, time, windStrength);
          break;
        case 'autumn':
          SeasonalAnimations.leafFall(particle, time, windStrength);
          break;
        case 'spring':
          SeasonalAnimations.petalFloat(particle, time, windStrength);
          break;
        case 'summer':
          SeasonalAnimations.sunRayPulse(particle, time);
          break;
      }
    });
  });

  return (
    <>
      {/* Lighting based on season */}
      <ambientLight intensity={0.3} />
      {currentSeason === 'summer' && (
        <directionalLight position={[10, 10, 5]} intensity={1.2} color={0xffeb3b} />
      )}
      {currentSeason === 'winter' && (
        <directionalLight position={[5, 5, 10]} intensity={0.8} color={0xe3f2fd} />
      )}
      {currentSeason === 'autumn' && (
        <directionalLight position={[5, 10, 5]} intensity={0.9} color={0xff9800} />
      )}
      {currentSeason === 'spring' && (
        <directionalLight position={[10, 5, 5]} intensity={1.0} color={0xe91e63} />
      )}
    </>
  );
}

// Preset configurations
export const seasonalPresets = {
  gentle: {
    particleCount: 20,
    windStrength: 0.5,
    animationSpeed: 0.8,
    seasonDuration: 15000
  },
  lively: {
    particleCount: 40,
    windStrength: 1.2,
    animationSpeed: 1.2,
    seasonDuration: 10000
  },
  dramatic: {
    particleCount: 60,
    windStrength: 2.0,
    animationSpeed: 1.5,
    seasonDuration: 8000
  },
  subtle: {
    particleCount: 15,
    windStrength: 0.3,
    animationSpeed: 0.6,
    seasonDuration: 20000
  }
};

// Seasonal themes for integration
export const seasonalThemes = {
  winter: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    glassColor: 'var(--glass-bg-default)',
    accentColor: '#e3f2fd'
  },
  spring: {
    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    glassColor: 'var(--glass-bg-disabled)',
    accentColor: '#fce4ec'
  },
  summer: {
    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    glassColor: 'var(--glass-bg-default)',
    accentColor: '#fff3e0'
  },
  autumn: {
    background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    glassColor: 'rgba(255, 255, 255, 0.12)',
    accentColor: '#efebe9'
  }
};

export default SeasonalParticles;

