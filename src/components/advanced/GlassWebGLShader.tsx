"use client";
/**
 * AuraGlass WebGL Glass Shaders
 * Advanced GPU-accelerated glass effects
 */

import React, { useRef, useEffect, useState } from "react";
import { cn } from "../../lib/utilsComprehensive";
import { ContrastGuard } from "../accessibility/ContrastGuard";
import { ANIMATION } from "../../tokens/designConstants";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { createGlassStyle } from "../../core/mixins/glassMixins";

interface ShaderProps {
  className?: string;
  style?: React.CSSProperties;
  variant?: "refraction" | "dispersion" | "frosted" | "crystal" | "prism";
  intensity?: number;
  animated?: boolean;
  interactive?: boolean;
  backgroundColor?: string;
  renderMode?: "auto" | "webgl" | "css";
  respectMotionPreference?: boolean;
  compact?: boolean;
  contained?: boolean;
  preview?: boolean;
  height?: number | string;
  maxHeight?: number | string;
}

const shaderFallbackPanelStyle: React.CSSProperties = {
  ...createGlassStyle({ intent: "primary", elevation: "level3" }),
  minHeight: 220,
  borderColor: "rgba(226, 232, 240, 0.14)",
  color: "#e5f4ff",
};

const shaderFallbackLineStyle: React.CSSProperties = {
  ...createGlassStyle({ intent: "primary", elevation: "level2" }),
};

const shaderFallbackTileStyle: React.CSSProperties = {
  ...createGlassStyle({ intent: "primary", elevation: "level3" }),
  borderColor: "rgba(226,232,240,0.26)",
  boxShadow:
    "0 24px 80px rgba(56,189,248,0.2), inset 0 1px 0 rgba(255,255,255,0.18)",
  transform: "translate(-50%, -50%)",
};

// Vertex shader (common for all variants)
const vertexShaderSource = `
  attribute vec2 a_position;
  attribute vec2 a_texCoord;
  varying vec2 v_texCoord;

  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
    v_texCoord = a_texCoord;
  }
`;

// Fragment shaders for different glass effects
const fragmentShaders = {
  refraction: `
    precision mediump float;

    uniform sampler2D u_image;
    uniform vec2 u_resolution;
    uniform vec2 u_mouse;
    uniform float u_time;
    uniform float u_intensity;

    varying vec2 v_texCoord;

    void main() {
      vec2 uv = v_texCoord;
      vec2 center = vec2(0.5, 0.5);
      vec2 mouseNorm = u_mouse / u_resolution;

      // Calculate refraction based on distance from mouse
      float dist = distance(uv, mouseNorm);
      float refraction = sin(dist * 10.0 - u_time * 2.0) * 0.02 * u_intensity;

      // Apply chromatic aberration
      vec2 rOffset = uv + vec2(refraction, 0.0);
      vec2 gOffset = uv;
      vec2 bOffset = uv - vec2(refraction, 0.0);

      float r = texture2D(u_image, rOffset).r;
      float g = texture2D(u_image, gOffset).g;
      float b = texture2D(u_image, bOffset).b;

      gl_FragColor = vec4(r, g, b, 1.0);
    }
  `,

  dispersion: `
    precision mediump float;

    uniform sampler2D u_image;
    uniform vec2 u_resolution;
    uniform float u_time;
    uniform float u_intensity;

    varying vec2 v_texCoord;

    void main() {
      vec2 uv = v_texCoord;

      // Rainbow dispersion effect
      float wave = sin(uv.y * 10.0 + u_time) * 0.01 * u_intensity;

      vec2 rUV = uv + vec2(wave * 2.0, 0.0);
      vec2 gUV = uv + vec2(wave, 0.0);
      vec2 bUV = uv;

      vec3 color;
      color.r = texture2D(u_image, rUV).r;
      color.g = texture2D(u_image, gUV).g;
      color.b = texture2D(u_image, bUV).b;

      // Add prismatic highlights
      float highlight = sin(uv.x * 20.0 + u_time * 2.0) * 0.1;
      color += vec3(highlight, highlight * 0.5, highlight * 0.3);

      gl_FragColor = vec4(color, 1.0);
    }
  `,

  frosted: `
    precision mediump float;

    uniform sampler2D u_image;
    uniform vec2 u_resolution;
    uniform float u_time;
    uniform float u_intensity;

    varying vec2 v_texCoord;

    float random(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
    }

    void main() {
      vec2 uv = v_texCoord;
      vec3 color = vec3(0.0);

      // Frosted glass blur
      float blurSize = 0.01 * u_intensity;
      int samples = 9;

      for(int i = 0; i < samples; i++) {
        float angle = float(i) / float(samples) * 6.28318;
        vec2 offset = vec2(cos(angle), sin(angle)) * blurSize;
        offset *= random(uv + float(i));

        color += texture2D(u_image, uv + offset).rgb;
      }

      color /= float(samples);

      // Add frost texture
      float frost = random(uv * 100.0 + u_time * 0.1) * 0.1;
      color += vec3(frost);

      gl_FragColor = vec4(color, 1.0);
    }
  `,

  crystal: `
    precision mediump float;

    uniform sampler2D u_image;
    uniform vec2 u_resolution;
    uniform vec2 u_mouse;
    uniform float u_time;
    uniform float u_intensity;

    varying vec2 v_texCoord;

    void main() {
      vec2 uv = v_texCoord;
      vec2 center = vec2(0.5, 0.5);

      // Crystal facets
      float angle = atan(uv.y - center.y, uv.x - center.x);
      float facets = 8.0;
      angle = floor(angle * facets) / facets;

      float dist = distance(uv, center);
      vec2 facetUV = center + vec2(cos(angle), sin(angle)) * dist;

      // Refraction through crystal
      vec2 refractUV = mix(uv, facetUV, u_intensity * 0.5);
      vec3 color = texture2D(u_image, refractUV).rgb;

      // Add sparkle
      float sparkle = sin(angle * 20.0 + u_time * 3.0) * 0.2;
      color += vec3(sparkle);

      // Inner reflections
      float reflection = sin(dist * 30.0 - u_time * 2.0) * 0.1;
      color += vec3(reflection, reflection * 0.8, reflection * 1.2);

      gl_FragColor = vec4(color, 1.0);
    }
  `,

  prism: `
    precision mediump float;

    uniform sampler2D u_image;
    uniform vec2 u_resolution;
    uniform float u_time;
    uniform float u_intensity;

    varying vec2 v_texCoord;

    vec3 hsv2rgb(vec3 c) {
      vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
      vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
      return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
    }

    void main() {
      vec2 uv = v_texCoord;

      // Prism light splitting
      float prismAngle = uv.x + sin(uv.y * 10.0 + u_time) * 0.1;

      // Sample at different wavelengths
      vec3 color = vec3(0.0);
      int samples = 7;

      for(int i = 0; i < samples; i++) {
        float wavelength = float(i) / float(samples);
        vec2 offset = vec2(wavelength * 0.02 * u_intensity, 0.0);

        vec3 sample = texture2D(u_image, uv + offset).rgb;

        // Apply wavelength-based tinting
        vec3 tint = hsv2rgb(vec3(wavelength, 0.8, 1.0));
        color += sample * tint;
      }

      color /= float(samples);

      // Add rainbow spectrum overlay
      float spectrum = sin(prismAngle * 20.0) * 0.3;
      vec3 rainbow = hsv2rgb(vec3(prismAngle, 1.0, spectrum));
      color = mix(color, rainbow, 0.2 * u_intensity);

      gl_FragColor = vec4(color, 1.0);
    }
  `,
};

export function GlassWebGLShader({
  className,
  variant = "refraction",
  intensity = 1,
  animated = true,
  interactive = true,
  backgroundColor = "transparent",
  renderMode = "auto",
  respectMotionPreference = true,
  compact = false,
  contained = false,
  preview = false,
  height,
  maxHeight,
  style,
}: ShaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const animationRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [isSupported, setIsSupported] = useState(true);
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate =
    animated && (respectMotionPreference ? !prefersReducedMotion : true);
  const useCssFallback = renderMode === "css";
  const isBounded = compact || contained || preview;
  const resolvedHeight = typeof height === "number" ? `${height}px` : height;
  const resolvedMaxHeight =
    typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight;
  const boundedStyle: React.CSSProperties = {
    minHeight: resolvedHeight ?? (isBounded ? 220 : undefined),
    maxHeight: resolvedMaxHeight ?? (isBounded ? 240 : undefined),
    width: "100%",
    ...(style ?? {}),
  };

  // Initialize WebGL
  useEffect(() => {
    if (useCssFallback) {
      setIsSupported(false);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    setIsSupported(true);

    const gl =
      canvas.getContext("webgl") ||
      (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);

    if (!gl) {
      setIsSupported(false);
      return;
    }

    glRef.current = gl;

    // Create shaders
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(
      gl,
      gl.FRAGMENT_SHADER,
      fragmentShaders[variant]
    );

    if (!vertexShader || !fragmentShader) {
      setIsSupported(false);
      return;
    }

    // Create program
    const program = createProgram(
      gl as WebGLRenderingContext,
      vertexShader,
      fragmentShader
    );
    if (!program) {
      setIsSupported(false);
      return;
    }

    programRef.current = program;

    // Set up geometry
    setupGeometry(gl as WebGLRenderingContext, program);

    // Set up texture
    setupTexture(gl as WebGLRenderingContext);

    render();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      try {
        const loseContext = gl.getExtension("WEBGL_lose_context");
        loseContext?.loseContext();
      } catch {}
      glRef.current = null;
      programRef.current = null;
    };
  }, [variant, shouldAnimate, intensity, useCssFallback]);

  // Handle mouse interaction
  useEffect(() => {
    if (!interactive || prefersReducedMotion || typeof window === "undefined") {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [interactive, prefersReducedMotion]);

  // Create shader
  function createShader(
    gl: WebGLRenderingContext,
    type: number,
    source: string
  ): WebGLShader | null {
    const shader = gl.createShader(type);
    if (!shader) return null;

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      gl.deleteShader(shader);
      return null;
    }

    return shader;
  }

  // Create program
  function createProgram(
    gl: WebGLRenderingContext,
    vertexShader: WebGLShader,
    fragmentShader: WebGLShader
  ): WebGLProgram | null {
    const program = gl.createProgram();
    if (!program) return null;

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program);
      return null;
    }

    return program;
  }

  // Set up geometry
  function setupGeometry(gl: WebGLRenderingContext, program: WebGLProgram) {
    // Positions
    const positions = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Texture coordinates
    const texCoords = new Float32Array([0, 1, 1, 1, 0, 0, 1, 0]);

    const texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, texCoords, gl.STATIC_DRAW);

    const texCoordLocation = gl.getAttribLocation(program, "a_texCoord");
    gl.enableVertexAttribArray(texCoordLocation);
    gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);
  }

  // Set up texture
  function setupTexture(gl: WebGLRenderingContext) {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Create gradient texture
    const width = 256;
    const height = 256;
    const pixels = new Uint8Array(width * height * 4);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4;
        pixels[i] = (x / width) * 255; // R
        pixels[i + 1] = (y / height) * 255; // G
        pixels[i + 2] = 128; // B
        pixels[i + 3] = 255; // A
      }
    }

    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      width,
      height,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      pixels
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  }

  // Render loop
  function render() {
    const gl = glRef.current;
    const program = programRef.current;
    const canvas = canvasRef.current;

    if (!gl || !program || !canvas) return;

    // Clear canvas
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Use program
    gl.useProgram(program);

    // Set uniforms
    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    gl.uniform2f(resolutionLocation, canvas.width, canvas.height);

    const mouseLocation = gl.getUniformLocation(program, "u_mouse");
    gl.uniform2f(mouseLocation, mouseRef.current.x, mouseRef.current.y);

    const timeLocation = gl.getUniformLocation(program, "u_time");
    gl.uniform1f(timeLocation, performance.now() / 1000);

    const intensityLocation = gl.getUniformLocation(program, "u_intensity");
    gl.uniform1f(intensityLocation, intensity);

    // Draw
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    // Continue animation
    if (shouldAnimate && typeof requestAnimationFrame === "function") {
      animationRef.current = requestAnimationFrame(render);
    }
  }

  if (!isSupported) {
    return (
      <div
        data-glass-component
        className={cn(
          "glass-relative glass-overflow-hidden glass-rounded-2xl glass-border glass-p-4",
          className
        )}
        role="status"
        style={{ ...shaderFallbackPanelStyle, ...boundedStyle }}
      >
        <div
          className="glass-absolute glass-inset-x-6 glass-top-8 glass-h-px"
          style={{
            ...shaderFallbackLineStyle,
            animation: shouldAnimate
              ? "ag-webgl-shader-line 2.8s ease-in-out infinite alternate"
              : undefined,
          }}
        />
        <div
          className="glass-absolute glass-left-1/2 glass-top-1/2 glass-h-20 glass-w-20 glass-rounded-2xl glass-border"
          style={{
            ...shaderFallbackTileStyle,
            animation: shouldAnimate
              ? "ag-webgl-shader-tile 3.2s ease-in-out infinite alternate"
              : undefined,
          }}
        />
        <div
          aria-hidden="true"
          className="glass-absolute ag-webgl-shader-orb"
          style={{
            left: "-18%",
            top: "18%",
            width: "64%",
            height: "48%",
            borderRadius: 999,
            filter: "blur(18px)",
            mixBlendMode: "screen",
            opacity: 0.68,
            animation: shouldAnimate
              ? "ag-webgl-shader-orb 2.4s ease-in-out infinite alternate"
              : undefined,
          }}
        />
        {shouldAnimate ? (
          <style>{`
            .ag-webgl-shader-orb {
              background: radial-gradient(circle, rgba(124,211,255,0.74) 0%, rgba(216,111,255,0.44) 42%, transparent 72%);
            }
            @keyframes ag-webgl-shader-tile {
              0% { transform: translate(-68%, -56%) rotate(-10deg) scale(0.86); opacity: 0.45; }
              50% { transform: translate(-38%, -42%) rotate(13deg) scale(1.18); opacity: 1; }
              100% { transform: translate(-52%, -64%) rotate(-4deg) scale(0.96); opacity: 0.64; }
            }
            @keyframes ag-webgl-shader-line {
              0% { transform: translateX(-34%); opacity: 0.24; }
              50% { transform: translateX(46%); opacity: 1; }
              100% { transform: translateX(8%); opacity: 0.5; }
            }
            @keyframes ag-webgl-shader-orb {
              0% { transform: translate3d(0%, -10%, 0) scale(0.82); opacity: 0.38; }
              50% { transform: translate3d(86%, 8%, 0) scale(1.16); opacity: 0.9; }
              100% { transform: translate3d(44%, 38%, 0) scale(0.98); opacity: 0.62; }
            }
          `}</style>
        ) : null}
        <div className="glass-relative glass-z-10 glass-flex glass-h-full glass-min-h-48 glass-flex-col glass-justify-between">
          <div>
            <p className="glass-text-xs glass-uppercase glass-tracking-widest glass-text-primary-glass-opacity-60">
              CSS shader
            </p>
            <p className="glass-mt-1 glass-text-base glass-font-semibold glass-text-primary">
              {variant} glass field
            </p>
          </div>
          <p className="glass-text-sm glass-text-secondary">
            Lightweight preview mode active.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={{ backgroundColor, ...boundedStyle }}
    >
      <canvas
        ref={canvasRef}
        className="glass-absolute glass-inset-0 glass-w-full glass-h-full glass-pointer-events-none"
        width={800}
        height={600}
        aria-hidden="true"
      />
    </div>
  );
}
