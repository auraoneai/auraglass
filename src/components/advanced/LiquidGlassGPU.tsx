import React, { useRef, useEffect, useCallback, useMemo, useState } from 'react';
import { cn } from '../../lib/utils';
import { LIQUID_GLASS, type LiquidGlassMaterial, type MaterialVariant } from '../../tokens/glass';

// WebGL shader sources for Liquid Glass effects
const VERTEX_SHADER = `
  attribute vec2 position;
  attribute vec2 texCoord;
  varying vec2 vTexCoord;
  varying vec2 vPosition;
  
  uniform mat4 uProjection;
  uniform mat4 uModelView;
  uniform float uTime;
  uniform vec2 uResolution;
  
  void main() {
    vTexCoord = texCoord;
    vPosition = position;
    gl_Position = uProjection * uModelView * vec4(position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  precision highp float;
  
  varying vec2 vTexCoord;
  varying vec2 vPosition;
  
  uniform sampler2D uBackdropTexture;
  uniform sampler2D uNormalMap;
  uniform vec2 uResolution;
  uniform float uTime;
  uniform float uIOR;
  uniform float uThickness;
  uniform float uSheen;
  uniform vec2 uTilt;
  uniform bool uEnableRefraction;
  uniform bool uEnableReflection;
  uniform bool uEnableParallax;
  
  // IOR-based refraction calculation
  vec2 refract2D(vec2 incident, vec2 normal, float ior) {
    float cosI = dot(incident, normal);
    float sinT2 = (1.0 - cosI * cosI) / (ior * ior);
    
    if (sinT2 > 1.0) {
      // Total internal reflection
      return reflect(incident, normal);
    }
    
    float cosT = sqrt(1.0 - sinT2);
    return incident / ior - normal * (cosT - cosI / ior);
  }
  
  // Generate procedural normal map for glass thickness
  vec3 generateNormal(vec2 uv, float thickness, float time) {
    vec2 offset = vec2(0.001) * thickness;
    
    // Create subtle surface variation
    float height1 = sin(uv.x * 20.0 + time * 0.5) * cos(uv.y * 15.0 + time * 0.3) * 0.1;
    float height2 = sin(uv.x * 35.0 - time * 0.7) * cos(uv.y * 25.0 - time * 0.4) * 0.05;
    
    float heightL = sin((uv.x - offset.x) * 20.0 + time * 0.5) * cos(uv.y * 15.0 + time * 0.3) * 0.1;
    float heightR = sin((uv.x + offset.x) * 20.0 + time * 0.5) * cos(uv.y * 15.0 + time * 0.3) * 0.1;
    float heightT = sin(uv.x * 20.0 + time * 0.5) * cos((uv.y + offset.y) * 15.0 + time * 0.3) * 0.1;
    float heightB = sin(uv.x * 20.0 + time * 0.5) * cos((uv.y - offset.y) * 15.0 + time * 0.3) * 0.1;
    
    vec3 normal;
    normal.x = (heightL - heightR) / (2.0 * offset.x);
    normal.y = (heightB - heightT) / (2.0 * offset.y);
    normal.z = 1.0;
    
    return normalize(normal);
  }
  
  // Fresnel reflectance calculation
  float fresnel(vec3 incident, vec3 normal, float ior) {
    float cosI = abs(dot(incident, normal));
    float sinI = sqrt(1.0 - cosI * cosI);
    float sinT = sinI / ior;
    
    if (sinT >= 1.0) {
      return 1.0; // Total internal reflection
    }
    
    float cosT = sqrt(1.0 - sinT * sinT);
    float rs = (ior * cosI - cosT) / (ior * cosI + cosT);
    float rp = (ior * cosT - cosI) / (ior * cosT + cosI);
    
    return (rs * rs + rp * rp) * 0.5;
  }
  
  void main() {
    vec2 uv = vTexCoord;
    vec2 screenUV = gl_FragCoord.xy / uResolution;
    
    // Generate surface normal based on thickness
    vec3 normal = generateNormal(uv, uThickness * 0.1, uTime);
    
    // Apply device tilt to normal
    normal.xy += uTilt * 0.3;
    normal = normalize(normal);
    
    vec4 color = vec4(0.0);
    
    if (uEnableRefraction) {
      // Calculate refracted sampling coordinates
      vec2 incident = normalize(vec2(0.0, -1.0));
      vec2 refracted = refract2D(incident, normal.xy, 1.0 / uIOR);
      
      // Sample backdrop with refraction offset
      vec2 refractedUV = screenUV + refracted * uThickness * 0.01;
      refractedUV = clamp(refractedUV, 0.0, 1.0);
      
      vec4 refractedColor = texture2D(uBackdropTexture, refractedUV);
      color += refractedColor * 0.7;
    } else {
      // Fallback: direct backdrop sampling
      color += texture2D(uBackdropTexture, screenUV) * 0.7;
    }
    
    if (uEnableReflection) {
      // Calculate reflection
      vec3 viewDir = normalize(vec3(screenUV - 0.5, -1.0));
      vec3 reflected = reflect(viewDir, normal);
      
      // Sample environment for reflection (simplified)
      vec2 reflectionUV = screenUV + reflected.xy * 0.05;
      reflectionUV = clamp(reflectionUV, 0.0, 1.0);
      
      vec4 reflectionColor = texture2D(uBackdropTexture, reflectionUV);
      
      // Apply Fresnel for realistic reflection strength
      float fresnelStrength = fresnel(viewDir, normal, uIOR);
      color += reflectionColor * fresnelStrength * 0.3;
    }
    
    // Edge sheen effect
    if (uSheen > 0.0) {
      float edgeDistance = min(min(uv.x, 1.0 - uv.x), min(uv.y, 1.0 - uv.y));
      float sheenStrength = 1.0 - smoothstep(0.0, 0.1, edgeDistance);
      
      vec3 sheenColor = vec3(1.0, 1.0, 1.0);
      color.rgb += sheenColor * sheenStrength * uSheen * 0.2;
    }
    
    // Glass tint overlay
    vec4 glassTint = vec4(1.0, 1.0, 1.0, 0.95);
    color = mix(color, glassTint, 0.15);
    
    // Apply thickness-based opacity
    color.a = 0.85 + uThickness * 0.02;
    
    gl_FragColor = color;
  }
`;

// WebGL capability detection and context management
export class LiquidGlassGPU {
  private gl: WebGLRenderingContext | null = null;
  private program: WebGLProgram | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private uniforms: Record<string, WebGLUniformLocation | null> = {};
  private attributes: Record<string, number> = {};
  private isInitialized = false;
  private animationFrameId: number | null = null;
  private backdropTexture: WebGLTexture | null = null;
  
  constructor() {}
  
  /**
   * Initialize WebGL context and shaders
   */
  async initialize(canvas: HTMLCanvasElement): Promise<boolean> {
    try {
      this.canvas = canvas;
      this.gl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;
      
      if (!this.gl) {
        console.warn('LiquidGlassGPU: WebGL not supported');
        return false;
      }
      
      // Check for required extensions
      const requiredExtensions = ['OES_texture_float', 'WEBGL_color_buffer_float'];
      for (const ext of requiredExtensions) {
        if (!this.gl.getExtension(ext)) {
          console.warn(`LiquidGlassGPU: Required extension ${ext} not available`);
        }
      }
      
      // Create shader program
      this.program = this.createShaderProgram(VERTEX_SHADER, FRAGMENT_SHADER);
      if (!this.program) {
        return false;
      }
      
      // Get uniform and attribute locations
      this.setupUniformsAndAttributes();
      
      // Set up geometry
      this.setupGeometry();
      
      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('LiquidGlassGPU: Initialization failed', error);
      return false;
    }
  }
  
  /**
   * Render liquid glass effect with given parameters
   */
  render(params: {
    ior: number;
    thickness: number;
    sheen: number;
    tilt: { x: number; y: number };
    enableRefraction: boolean;
    enableReflection: boolean;
    enableParallax: boolean;
    time: number;
  }): void {
    if (!this.gl || !this.program || !this.isInitialized) {
      return;
    }
    
    const gl = this.gl;
    
    // Clear and set up viewport
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.viewport(0, 0, this.canvas!.width, this.canvas!.height);
    
    // Use shader program
    gl.useProgram(this.program);
    
    // Update uniforms
    this.updateUniforms(params);
    
    // Draw quad
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
  
  /**
   * Update backdrop texture from DOM element
   */
  async updateBackdrop(element: HTMLElement): Promise<void> {
    if (!this.gl || !this.isInitialized) return;
    
    try {
      // Capture element as image data
      const imageData = await this.captureElementAsImageData(element);
      if (!imageData) return;
      
      // Update texture
      if (!this.backdropTexture) {
        this.backdropTexture = this.gl.createTexture();
      }
      
      this.gl.bindTexture(this.gl.TEXTURE_2D, this.backdropTexture);
      this.gl.texImage2D(
        this.gl.TEXTURE_2D,
        0,
        this.gl.RGBA,
        this.gl.RGBA,
        this.gl.UNSIGNED_BYTE,
        imageData
      );
      
      // Set texture parameters
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
      
    } catch (error) {
      console.warn('LiquidGlassGPU: Failed to update backdrop', error);
    }
  }
  
  /**
   * Clean up WebGL resources
   */
  dispose(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    
    if (this.gl) {
      if (this.program) {
        this.gl.deleteProgram(this.program);
      }
      if (this.backdropTexture) {
        this.gl.deleteTexture(this.backdropTexture);
      }
    }
    
    this.isInitialized = false;
  }
  
  /**
   * Check if GPU acceleration is available
   */
  static isSupported(): boolean {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      return !!gl;
    } catch {
      return false;
    }
  }
  
  // Private helper methods
  
  private createShaderProgram(vertexSource: string, fragmentSource: string): WebGLProgram | null {
    if (!this.gl) return null;
    
    const vertexShader = this.compileShader(vertexSource, this.gl.VERTEX_SHADER);
    const fragmentShader = this.compileShader(fragmentSource, this.gl.FRAGMENT_SHADER);
    
    if (!vertexShader || !fragmentShader) {
      return null;
    }
    
    const program = this.gl.createProgram();
    if (!program) return null;
    
    this.gl.attachShader(program, vertexShader);
    this.gl.attachShader(program, fragmentShader);
    this.gl.linkProgram(program);
    
    if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      console.error('LiquidGlassGPU: Shader program linking failed:', this.gl.getProgramInfoLog(program));
      this.gl.deleteProgram(program);
      return null;
    }
    
    return program;
  }
  
  private compileShader(source: string, type: number): WebGLShader | null {
    if (!this.gl) return null;
    
    const shader = this.gl.createShader(type);
    if (!shader) return null;
    
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);
    
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.error('LiquidGlassGPU: Shader compilation failed:', this.gl.getShaderInfoLog(shader));
      this.gl.deleteShader(shader);
      return null;
    }
    
    return shader;
  }
  
  private setupUniformsAndAttributes(): void {
    if (!this.gl || !this.program) return;
    
    // Get uniform locations
    const uniformNames = [
      'uBackdropTexture', 'uNormalMap', 'uResolution', 'uTime',
      'uIOR', 'uThickness', 'uSheen', 'uTilt',
      'uEnableRefraction', 'uEnableReflection', 'uEnableParallax',
      'uProjection', 'uModelView'
    ];
    
    for (const name of uniformNames) {
      this.uniforms[name] = this.gl.getUniformLocation(this.program, name);
    }
    
    // Get attribute locations
    this.attributes.position = this.gl.getAttribLocation(this.program, 'position');
    this.attributes.texCoord = this.gl.getAttribLocation(this.program, 'texCoord');
  }
  
  private setupGeometry(): void {
    if (!this.gl) return;
    
    // Create quad geometry
    const positions = new Float32Array([
      -1, -1,  // bottom-left
       1, -1,  // bottom-right
      -1,  1,  // top-left
       1,  1   // top-right
    ]);
    
    const texCoords = new Float32Array([
      0, 0,  // bottom-left
      1, 0,  // bottom-right
      0, 1,  // top-left
      1, 1   // top-right
    ]);
    
    // Create and bind vertex buffer
    const positionBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, positions, this.gl.STATIC_DRAW);
    this.gl.enableVertexAttribArray(this.attributes.position);
    this.gl.vertexAttribPointer(this.attributes.position, 2, this.gl.FLOAT, false, 0, 0);
    
    // Create and bind texture coordinate buffer
    const texCoordBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, texCoordBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, texCoords, this.gl.STATIC_DRAW);
    this.gl.enableVertexAttribArray(this.attributes.texCoord);
    this.gl.vertexAttribPointer(this.attributes.texCoord, 2, this.gl.FLOAT, false, 0, 0);
  }
  
  private updateUniforms(params: {
    ior: number;
    thickness: number;
    sheen: number;
    tilt: { x: number; y: number };
    enableRefraction: boolean;
    enableReflection: boolean;
    enableParallax: boolean;
    time: number;
  }): void {
    if (!this.gl || !this.canvas) return;
    
    // Update scalar uniforms
    if (this.uniforms.uIOR) {
      this.gl.uniform1f(this.uniforms.uIOR, params.ior);
    }
    if (this.uniforms.uThickness) {
      this.gl.uniform1f(this.uniforms.uThickness, params.thickness);
    }
    if (this.uniforms.uSheen) {
      this.gl.uniform1f(this.uniforms.uSheen, params.sheen);
    }
    if (this.uniforms.uTime) {
      this.gl.uniform1f(this.uniforms.uTime, params.time);
    }
    
    // Update vector uniforms
    if (this.uniforms.uResolution) {
      this.gl.uniform2f(this.uniforms.uResolution, this.canvas.width, this.canvas.height);
    }
    if (this.uniforms.uTilt) {
      this.gl.uniform2f(this.uniforms.uTilt, params.tilt.x, params.tilt.y);
    }
    
    // Update boolean uniforms
    if (this.uniforms.uEnableRefraction) {
      this.gl.uniform1i(this.uniforms.uEnableRefraction, params.enableRefraction ? 1 : 0);
    }
    if (this.uniforms.uEnableReflection) {
      this.gl.uniform1i(this.uniforms.uEnableReflection, params.enableReflection ? 1 : 0);
    }
    if (this.uniforms.uEnableParallax) {
      this.gl.uniform1i(this.uniforms.uEnableParallax, params.enableParallax ? 1 : 0);
    }
    
    // Bind backdrop texture
    if (this.uniforms.uBackdropTexture && this.backdropTexture) {
      this.gl.activeTexture(this.gl.TEXTURE0);
      this.gl.bindTexture(this.gl.TEXTURE_2D, this.backdropTexture);
      this.gl.uniform1i(this.uniforms.uBackdropTexture, 0);
    }
  }
  
  private async captureElementAsImageData(element: HTMLElement): Promise<ImageData | null> {
    try {
      // In a real implementation, this would use various techniques:
      // - html2canvas for DOM elements
      // - OffscreenCanvas for better performance
      // - canvas.transferControlToOffscreen for worker threads
      
      // For now, create a simple placeholder
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;
      
      canvas.width = element.clientWidth || 256;
      canvas.height = element.clientHeight || 256;
      
      // Create gradient placeholder that simulates backdrop
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#4f46e5');
      gradient.addColorStop(0.5, '#7c3aed'); 
      gradient.addColorStop(1, '#ec4899');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      return ctx.getImageData(0, 0, canvas.width, canvas.height);
    } catch (error) {
      console.warn('LiquidGlassGPU: Failed to capture element', error);
      return null;
    }
  }
}

/**
 * React component wrapper for GPU-accelerated Liquid Glass
 */
export interface LiquidGlassGPUProps {
  material?: LiquidGlassMaterial;
  variant?: MaterialVariant;
  ior?: number;
  thickness?: number;
  sheen?: number;
  enableRefraction?: boolean;
  enableReflection?: boolean;
  enableParallax?: boolean;
  adaptToMotion?: boolean;
  className?: string;
  children?: React.ReactNode;
  onFallback?: () => void;
}

export const LiquidGlassGPURenderer: React.FC<LiquidGlassGPUProps> = ({
  material = 'liquid',
  variant = 'regular',
  ior = LIQUID_GLASS.material.ior.liquid,
  thickness = LIQUID_GLASS.material.thickness.medium,
  sheen = LIQUID_GLASS.material.sheen.subtle,
  enableRefraction = true,
  enableReflection = true,
  enableParallax = false,
  adaptToMotion = true,
  className,
  children,
  onFallback,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const gpuRef = useRef<LiquidGlassGPU | null>(null);
  const [isGPUSupported, setIsGPUSupported] = useState(false);
  const [deviceTilt, setDeviceTilt] = useState({ x: 0, y: 0 });
  const startTimeRef = useRef(Date.now());
  
  // Initialize GPU renderer
  useEffect(() => {
    const initializeGPU = async () => {
      if (!canvasRef.current) return;
      
      const isSupported = LiquidGlassGPU.isSupported();
      setIsGPUSupported(isSupported);
      
      if (!isSupported) {
        onFallback?.();
        return;
      }
      
      gpuRef.current = new LiquidGlassGPU();
      const success = await gpuRef.current.initialize(canvasRef.current);
      
      if (!success) {
        setIsGPUSupported(false);
        onFallback?.();
      }
    };
    
    initializeGPU();
    
    return () => {
      gpuRef.current?.dispose();
    };
  }, [onFallback]);
  
  // Device motion tracking
  useEffect(() => {
    if (!adaptToMotion || !isGPUSupported) return;
    
    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.beta !== null && event.gamma !== null) {
        const sensitivity = LIQUID_GLASS.motionFluency.tilt.sensitivity;
        setDeviceTilt({
          x: Math.max(-1, Math.min(1, event.gamma * sensitivity)),
          y: Math.max(-1, Math.min(1, event.beta * sensitivity)),
        });
      }
    };
    
    if (typeof DeviceOrientationEvent !== 'undefined') {
      window.addEventListener('deviceorientation', handleOrientation);
      return () => window.removeEventListener('deviceorientation', handleOrientation);
    }
  }, [adaptToMotion, isGPUSupported]);
  
  // Animation loop
  useEffect(() => {
    if (!isGPUSupported || !gpuRef.current) return;
    
    let animationId: number;
    
    const animate = () => {
      if (gpuRef.current && canvasRef.current) {
        const time = (Date.now() - startTimeRef.current) / 1000;
        
        gpuRef.current.render({
          ior,
          thickness,
          sheen,
          tilt: deviceTilt,
          enableRefraction,
          enableReflection,
          enableParallax,
          time,
        });
        
        // Update backdrop periodically
        if (containerRef.current && Math.floor(time * 10) % 5 === 0) {
          gpuRef.current.updateBackdrop(containerRef.current);
        }
      }
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [
    isGPUSupported,
    ior,
    thickness,
    sheen,
    deviceTilt,
    enableRefraction,
    enableReflection,
    enableParallax,
  ]);
  
  // Resize canvas to match container
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;
    
    const resizeCanvas = () => {
      const canvas = canvasRef.current!;
      const container = containerRef.current!;
      const rect = container.getBoundingClientRect();
      
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);
  
  if (!isGPUSupported) {
    // Fallback to CSS-based rendering
    return (
      <div data-glass-component
        ref={containerRef}
        className={cn('glass-surface-primary glass-blur-backdrop glass-relative glass-overflow-hidden', className)}
        style={{
          // Use createGlassStyle() instead,
          // Use createGlassStyle() instead,
          background: `linear-gradient(135deg, rgba(255,255,255,${0.15 + sheen * 0.05}) 0%, rgba(255,255,255,${0.05 + sheen * 0.02}) 100%)`,
          border: `1px solid rgba(255,255,255,${0.3 + sheen * 0.1})`,
        }}
      >
        {children}
      </div>
    );
  }
  
  return (
    <div
      ref={containerRef}
      className={cn('glass-surface-primary glass-relative glass-overflow-hidden', className)}
    >
      <canvas
        ref={canvasRef}
        className={cn('glass-absolute glass-inset-0 glass-w-full glass-h-full glass-pointer-events-none')}
        style={{ zIndex: 1 }}
      />
      <div className={cn('glass-relative glass-z-10')}>
        {children}
      </div>
    </div>
  );
};

export default LiquidGlassGPURenderer;