'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { motion } from 'framer-motion';
import {
    Flame,
    Palette,
    Pause,
    Play,
    Sparkles,
    Star,
    Waves,
    Wind,
    Zap
} from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '../../lib/utilsComprehensive';
import * as THREE from 'three';

// Aurora geometry and material factories
const AuroraFactory = {
  // Create aurora wave geometry
  createAuroraWave: (width = 20, height = 10, segments = 64) => {
    const geometry = new THREE.PlaneGeometry(width, height, segments, 32);

    // Add wave-like deformation
    const positions = geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const y = positions[i + 1];
      const wave = Math.sin(x * 0.2) * Math.cos(y * 0.3) * 2;
      positions[i + 2] = wave;
    }

    geometry.computeVertexNormals();
    return geometry;
  },

  // Create aurora curtain geometry
  createAuroraCurtain: (width = 15, height = 8, depth = 3) => {
    const geometry = new THREE.PlaneGeometry(width, height, 32, 16);

    // Add depth variation
    const positions = geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const y = positions[i + 1];
      const depthVariation = Math.sin(x * 0.3) * Math.cos(y * 0.4) * depth;
      positions[i + 2] = depthVariation;
    }

    geometry.computeVertexNormals();
    return geometry;
  },

  // Create aurora particles
  createAuroraParticles: (count = 100) => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    const colorPalette = [
      new THREE.Color(0x4fc3f7), // Light blue
      new THREE.Color(0x81c784), // Light green
      new THREE.Color(0xffb74d), // Light orange
      new THREE.Color(0xba68c8), // Light purple
      new THREE.Color(0xff8a65), // Light red
      new THREE.Color(0x4db6ac), // Light teal
    ];

    for (let i = 0; i < count; i++) {
      // Random position in aurora band
      positions[i * 3] = (Math.random() - 0.5) * 25;
      positions[i * 3 + 1] = Math.random() * 12 + 2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;

      // Random color from palette
      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      // Random size
      sizes[i] = Math.random() * 3 + 1;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    return geometry;
  },

  // Aurora wave material
  createAuroraMaterial: (options: any = {}) => {
    const {
      color1 = new THREE.Color(0x4fc3f7),
      color2 = new THREE.Color(0x81c784),
      color3 = new THREE.Color(0xba68c8),
      intensity = 1.0,
      speed = 1.0
    } = options;

    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color1: { value: color1 },
        color2: { value: color2 },
        color3: { value: color3 },
        intensity: { value: intensity },
        speed: { value: speed }
      },
      vertexShader: `
        varying vec3 vPosition;
        varying vec2 vUv;

        void main() {
          vPosition = position;
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 color1;
        uniform vec3 color2;
        uniform vec3 color3;
        uniform float intensity;
        uniform float speed;

        varying vec3 vPosition;
        varying vec2 vUv;

        // Noise function for organic movement
        float noise(vec2 st) {
          return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
        }

        void main() {
          vec2 st = vUv;
          float n = noise(st * 3.0 + time * speed * 0.1);

          // Create flowing aurora effect
          float wave1 = sin(st.x * 6.0 + time * speed) * 0.5 + 0.5;
          float wave2 = cos(st.y * 4.0 + time * speed * 0.7) * 0.5 + 0.5;
          float wave3 = sin((st.x + st.y) * 3.0 + time * speed * 0.5) * 0.5 + 0.5;

          // Mix colors based on waves
          vec3 color = mix(color1, color2, wave1);
          color = mix(color, color3, wave2);
          color = mix(color, color1, wave3);

          // Add some sparkle
          float sparkle = sin(time * 10.0 + st.x * 20.0 + st.y * 20.0) * 0.5 + 0.5;
          color += sparkle * 0.3;

          float alpha = (wave1 + wave2 + wave3) / 3.0 * intensity * 0.8;

          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    });
  },

  // Aurora particle material
  createParticleMaterial: () => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 }
      },
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;

        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform float time;
        varying vec3 vColor;

        void main() {
          float r = distance(gl_PointCoord, vec2(0.5, 0.5));
          if (r > 0.5) discard;

          float alpha = 1.0 - smoothstep(0.0, 0.5, r);
          alpha *= sin(time * 3.0 + gl_PointCoord.x * 10.0) * 0.3 + 0.7;

          gl_FragColor = vec4(vColor, alpha);
        }
      `,
      transparent: true,
      vertexColors: true,
      blending: THREE.AdditiveBlending
    });
  }
};

// Aurora animation system
const AuroraAnimations = {
  // Flowing wave animation
  waveFlow: (mesh: THREE.Mesh, time: number, speed: number = 1) => {
    if (mesh.material && 'uniforms' in mesh.material && mesh.material.uniforms && typeof mesh.material.uniforms === 'object' && 'time' in mesh.material.uniforms) {
      (mesh.material.uniforms.time as any).value = time * speed;
    }
  },

  // Particle drift animation
  particleDrift: (particles: THREE.Points, time: number, speed: number = 1) => {
    if (!particles.geometry) return;

    const positions = particles.geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
      const originalX = positions[i];
      positions[i] = originalX + Math.sin(time * speed + i * 0.01) * 0.5;
    }
    particles.geometry.attributes.position.needsUpdate = true;
  },

  // Color shift animation
  colorShift: (mesh: THREE.Mesh, time: number, speed: number = 1) => {
    if (!mesh.material || !('uniforms' in mesh.material) || !mesh.material.uniforms) return;

    const hue = (time * speed * 0.1) % 1;
    const color1 = new THREE.Color().setHSL(hue, 0.7, 0.6);
    const color2 = new THREE.Color().setHSL((hue + 0.3) % 1, 0.7, 0.6);
    const color3 = new THREE.Color().setHSL((hue + 0.6) % 1, 0.7, 0.6);

    if (typeof mesh.material.uniforms === 'object' && 'color1' in mesh.material.uniforms) (mesh.material.uniforms.color1 as any).value = color1;
    if (typeof mesh.material.uniforms === 'object' && 'color2' in mesh.material.uniforms) (mesh.material.uniforms.color2 as any).value = color2;
    if (typeof mesh.material.uniforms === 'object' && 'color3' in mesh.material.uniforms) (mesh.material.uniforms.color3 as any).value = color3;
  },

  // Intensity pulsing
  intensityPulse: (mesh: THREE.Mesh, time: number, speed: number = 1) => {
    if (!mesh.material || !('uniforms' in mesh.material) || !mesh.material.uniforms) return;

    const pulse = Math.sin(time * speed) * 0.3 + 0.7;
    if (typeof mesh.material.uniforms === 'object' && 'intensity' in mesh.material.uniforms) (mesh.material.uniforms.intensity as any).value = pulse;
  }
};

// Main AuroraPro Component
interface AuroraProProps {
  intensity?: number;
  speed?: number;
  colorPalette?: 'arctic' | 'forest' | 'sunset' | 'ocean' | 'cosmic' | 'custom';
  customColors?: [string, string, string];
  particleCount?: number;
  showParticles?: boolean;
  showWaves?: boolean;
  showCurtain?: boolean;
  animationMode?: 'flow' | 'pulse' | 'shift' | 'mixed';
  className?: string;
  showControls?: boolean;
  autoAnimate?: boolean;
  onAnimationChange?: (mode: string) => void;
  children?: React.ReactNode;
}

export function AuroraPro({
  intensity = 1.0,
  speed = 1.0,
  colorPalette = 'arctic',
  customColors,
  particleCount = 50,
  showParticles = true,
  showWaves = true,
  showCurtain = false,
  animationMode = 'flow',
  className='',
  showControls = false,
  autoAnimate = true,
  onAnimationChange,
  children
}: AuroraProProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoAnimate);
  const [currentMode, setCurrentMode] = useState(animationMode);
  const [auroraMeshes, setAuroraMeshes] = useState<THREE.Mesh[]>([]);
  const [particleSystem, setParticleSystem] = useState<THREE.Points | null>(null);

  // Color palette configurations
  const colorPalettes = {
    arctic: ['#4fc3f7', '#81c784', '#ba68c8'],
    forest: ['#4caf50', '#8bc34a', '#009688'],
    sunset: ['#ff9800', '#e91e63', '#9c27b0'],
    ocean: ['#00bcd4', '#2196f3', '#3f51b5'],
    cosmic: ['#9c27b0', '#673ab7', '#3f51b5'],
    custom: customColors || ['var(--glass-white)', 'var(--glass-white)', 'var(--glass-white)']
  };

  // Initialize aurora elements
  useEffect(() => {
    const meshes: THREE.Mesh[] = [];
    const colors = colorPalettes[colorPalette].map((c: any) => new THREE.Color(c));

    // Create wave mesh
    if (showWaves) {
      const waveGeometry = AuroraFactory.createAuroraWave(25, 12, 64);
      const waveMaterial = AuroraFactory.createAuroraMaterial({
        color1: colors[0],
        color2: colors[1],
        color3: colors[2],
        intensity,
        speed
      });
      const waveMesh = new THREE.Mesh(waveGeometry, waveMaterial);
      waveMesh.position.set(0, 5, -5);
      meshes.push(waveMesh);
    }

    // Create curtain mesh
    if (showCurtain) {
      const curtainGeometry = AuroraFactory.createAuroraCurtain(20, 10, 2);
      const curtainMaterial = AuroraFactory.createAuroraMaterial({
        color1: colors[1],
        color2: colors[2],
        color3: colors[0],
        intensity: intensity * 0.8,
        speed: speed * 0.7
      });
      const curtainMesh = new THREE.Mesh(curtainGeometry, curtainMaterial);
      curtainMesh.position.set(0, 3, -3);
      meshes.push(curtainMesh);
    }

    // Create particle system
    if (showParticles) {
      const particleGeometry = AuroraFactory.createAuroraParticles(particleCount);
      const particleMaterial = AuroraFactory.createParticleMaterial();
      const particles = new THREE.Points(particleGeometry, particleMaterial);
      setParticleSystem(particles);
    }

    setAuroraMeshes(meshes);
  }, [colorPalette, intensity, speed, showWaves, showCurtain, showParticles, particleCount, customColors]);

  // Handle animation mode changes
  const changeAnimationMode = useCallback((mode: string) => {
    setCurrentMode(mode as 'flow' | 'pulse' | 'shift' | 'mixed');
    onAnimationChange?.(mode);
  }, [onAnimationChange]);

  // Toggle play/pause
  const togglePlay = useCallback(() => {
    setIsPlaying((prev: any) => !prev);
  }, []);

  // Get animation mode icon
  const getAnimationIcon = (mode: string) => {
    switch (mode) {
      case 'flow': return <Waves className={cn("glass-w-4 glass-h-4")} />;
      case 'pulse': return <Zap className={cn("glass-w-4 glass-h-4")} />;
      case 'shift': return <Palette className={cn("glass-w-4 glass-h-4")} />;
      case 'mixed': return <Sparkles className={cn("glass-w-4 glass-h-4")} />;
      default: return <Star className={cn("glass-w-4 glass-h-4")} />;
    }
  };

  // Get color palette colors for UI
  const getPaletteColors = (palette: string) => {
    return colorPalettes[palette as keyof typeof colorPalettes] || colorPalettes.arctic;
  };

  return (
    <div className={cn("aurora-pro glass-relative glass-overflow-hidden", className)}>
      {/* 3D Canvas */}
      <Canvas
        ref={canvasRef}
        className={cn("glass-absolute glass-inset-0 glass-pointer-events-none")}
        camera={{ position: [0, 8, 15], fov: 75 }}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: 'high-performance'
        }}
      >
        <AuroraScene
          auroraMeshes={auroraMeshes}
          particleSystem={particleSystem}
          currentMode={currentMode}
          intensity={intensity}
          speed={speed}
          isPlaying={isPlaying}
        />
      </Canvas>

      {/* Content overlay */}
      <div className={cn("glass-relative glass-z-10")}>
        {children}
      </div>

      {/* Aurora intensity indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn("glass-absolute glass-top-4 glass-left-4 glass-px-3 glass-py-2 glass-radius-lg glass-foundation-complete glass-border glass-border-subtle glass-surface-dark")}
      >
        <div className={cn("glass-flex glass-items-center glass-gap-2 glass-text-white")}>
          <div className={cn("glass-flex glass-gap-1")}>
            {getPaletteColors(colorPalette).map((color, index) => (
              <div
                key={index}
                className={cn("glass-w-3 glass-h-3 glass-radius-full")}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <span className={cn("glass-text-sm glass-font-medium glass-capitalize")}>{colorPalette}</span>
          <div className={cn("glass-flex glass-items-center glass-gap-1 glass-text-xs glass-text-secondary")}>
            <Flame className={cn("glass-w-3 glass-h-3")} />
            <span>{(intensity * 100).toFixed(0)}%</span>
          </div>
        </div>
      </motion.div>

      {/* Controls */}
      {showControls && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn("glass-absolute glass-bottom-4 glass-right-4 glass-flex glass-flex-col glass-gap-2")}
        >
          {/* Animation mode selector */}
          <div className={cn("glass-flex glass-gap-2 glass-p-2 glass-surface-dark glass-foundation-complete glass-radius-lg glass-border glass-border-subtle")}>
            {['flow', 'pulse', 'shift', 'mixed'].map((mode: any) => (
              <button
                key={mode}
                onClick={() => changeAnimationMode(mode)}
                className={cn(
                  "glass-p-2 glass-radius-lg glass-transition-colors",
                  currentMode === mode
                    ? "glass-surface-subtle glass-text-white"
                    : "glass-text-secondary hover:glass-text-white hover:glass-surface-hover"
                )}
                title={`Switch to ${mode} animation`}
              >
                {getAnimationIcon(mode)}
              </button>
            ))}
          </div>

          {/* Playback and settings */}
          <div className={cn("glass-flex glass-gap-2 glass-p-2 glass-surface-dark glass-foundation-complete glass-radius-lg glass-border glass-border-subtle")}>
            <button
              onClick={togglePlay}
              className={cn("glass-p-2 glass-radius-lg glass-text-white hover:glass-surface-hover glass-transition-colors")}
              title={isPlaying ? 'Pause Aurora' : 'Play Aurora'}
            >
              {isPlaying ? <Pause className={cn("glass-w-4 glass-h-4")} /> : <Play className={cn("glass-w-4 glass-h-4")} />}
            </button>

            <div className={cn("glass-flex glass-items-center glass-gap-2 glass-text-secondary glass-text-sm")}>
              <Wind className={cn("glass-w-3 glass-h-3")} />
              <span>{speed.toFixed(1)}x</span>
            </div>
          </div>

          {/* Color palette selector */}
          <div className={cn("glass-grid glass-grid-cols-2 glass-gap-2 glass-p-2 glass-surface-dark glass-foundation-complete glass-radius-lg glass-border glass-border-subtle")}>
            {Object.keys(colorPalettes).slice(0, 6).map((palette: any) => (
              <button
                key={palette}
                onClick={() => {/* Would update colorPalette prop */}}
                className={cn(
                  "glass-p-2 glass-radius-lg glass-transition-colors glass-text-xs",
                  colorPalette === palette
                    ? "glass-surface-subtle glass-text-white"
                    : "glass-text-secondary hover:glass-text-white hover:glass-surface-hover"
                )}
                title={`Switch to ${palette} palette`}
              >
                <div className={cn("glass-flex glass-gap-0.5 glass-mb-1")}>
                  {getPaletteColors(palette).map((color, index) => (
                    <div
                      key={index}
                      className={cn("glass-w-2 glass-h-2 glass-radius-full")}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <span className={cn("glass-capitalize")}>{palette}</span>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Aurora status indicator */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className={cn("glass-absolute glass-top-4 glass-right-4 glass-px-3 glass-py-2 glass-radius-lg glass-foundation-complete glass-border glass-border-subtle glass-surface-dark")}
      >
        <div className={cn("glass-flex glass-items-center glass-gap-2 glass-text-secondary glass-text-sm")}>
          <motion.div
            animate={{
              scale: isPlaying ? [1, 1.2, 1] : 1,
              opacity: isPlaying ? [0.6, 1, 0.6] : 0.6
            }}
            transition={{
              duration: 2,
              repeat: isPlaying ? Infinity : 0,
              ease: 'easeInOut'
            }}
          >
            <Sparkles className={cn("glass-w-3 glass-h-3")} />
          </motion.div>
          <span className={cn("glass-capitalize")}>{currentMode}</span>
          {isPlaying && <div className={cn("glass-w-2 glass-h-2 glass-surface-success glass-radius-full glass-animate-pulse")} />}
        </div>
      </motion.div>
    </div>
  );
}

// 3D Aurora Scene Component
function AuroraScene({
  auroraMeshes,
  particleSystem,
  currentMode,
  intensity,
  speed,
  isPlaying
}: any) {
  const { scene } = useThree();

  // Add aurora meshes to scene
  useEffect(() => {
    auroraMeshes.forEach((mesh: THREE.Mesh) => {
      scene.add(mesh);
    });

    if (particleSystem) {
      scene.add(particleSystem);
    }

    return () => {
      auroraMeshes.forEach((mesh: THREE.Mesh) => {
        scene.remove(mesh);
      });
      if (particleSystem) {
        scene.remove(particleSystem);
      }
    };
  }, [auroraMeshes, particleSystem, scene]);

  // Animation loop
  useFrame((state) => {
    if (!isPlaying) return;

    const time = state.clock.elapsedTime;

    // Animate aurora meshes
    auroraMeshes.forEach((mesh: THREE.Mesh, index: number) => {
      const meshSpeed = speed * (0.8 + index * 0.2);

      switch (currentMode) {
        case 'flow':
          AuroraAnimations.waveFlow(mesh, time, meshSpeed);
          break;
        case 'pulse':
          AuroraAnimations.intensityPulse(mesh, time, meshSpeed);
          break;
        case 'shift':
          AuroraAnimations.colorShift(mesh, time, meshSpeed);
          break;
        case 'mixed':
          AuroraAnimations.waveFlow(mesh, time, meshSpeed);
          AuroraAnimations.intensityPulse(mesh, time, meshSpeed * 0.5);
          if (index % 2 === 0) {
            AuroraAnimations.colorShift(mesh, time, meshSpeed * 0.3);
          }
          break;
      }
    });

    // Animate particles
    if (particleSystem) {
      AuroraAnimations.particleDrift(particleSystem, time, speed * 0.5);
    }
  });

  return (
    <>
      {/* Atmospheric lighting */}
      <ambientLight intensity={0.1} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={0.3}
        color={0x4fc3f7}
      />
      <pointLight
        position={[0, 15, 0]}
        intensity={0.2}
        color={0x81c784}
      />

      {/* Subtle fog effect */}
      <fog attach="fog" args={['#000011', 10, 50]} />
    </>
  );
}

// Preset configurations
export const auroraPresets = {
  subtle: {
    intensity: 0.6,
    speed: 0.5,
    particleCount: 30,
    colorPalette: 'arctic',
    animationMode: 'flow'
  },
  dynamic: {
    intensity: 1.0,
    speed: 1.0,
    particleCount: 50,
    colorPalette: 'cosmic',
    animationMode: 'mixed'
  },
  intense: {
    intensity: 1.5,
    speed: 1.5,
    particleCount: 80,
    colorPalette: 'sunset',
    animationMode: 'pulse'
  },
  serene: {
    intensity: 0.4,
    speed: 0.3,
    particleCount: 20,
    colorPalette: 'ocean',
    animationMode: 'shift'
  }
};

// Aurora themes for integration
export const auroraThemes = {
  northern: {
    background: 'linear-gradient(180deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)',
    glassColor: 'rgba(79, 195, 247, 0.1)',
    accentColor: '#4fc3f7'
  },
  mystical: {
    background: 'linear-gradient(180deg, #0f0f23 0%, #1a1a2e 50%, #2d1b69 100%)',
    glassColor: 'rgba(186, 104, 200, 0.1)',
    accentColor: '#ba68c8'
  },
  tropical: {
    background: 'linear-gradient(180deg, #0c0c0c 0%, #1a1a2e 50%, #0f3460 100%)',
    glassColor: 'rgba(0, 188, 212, 0.1)',
    accentColor: '#00bcd4'
  },
  enchanted: {
    background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    glassColor: 'rgba(255, 152, 77, 0.1)',
    accentColor: '#ff9843'
  }
};

export default AuroraPro;
