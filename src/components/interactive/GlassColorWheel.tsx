'use client';

import React, { forwardRef, useRef, useEffect, useState, useCallback } from 'react';
import { OptimizedGlass } from '../../primitives';
import { Motion } from '../../primitives';
import { cn } from '../../lib/utilsComprehensive';
import { useA11yId } from '../../utils/a11y';
import { useMotionPreferenceContext } from '../../contexts/MotionPreferenceContext';
import { useGlassSound } from '../../utils/soundDesign';

interface HSV {
  h: number; // 0-360
  s: number; // 0-100
  v: number; // 0-100
}

interface RGB {
  r: number; // 0-255
  g: number; // 0-255
  b: number; // 0-255
}

export interface GlassColorWheelProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Current color value in hex format */
  value?: string;
  /** Default color value */
  defaultValue?: string;
  /** Size of the color wheel */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Whether the color wheel is disabled */
  disabled?: boolean;
  /** Whether to show alpha channel */
  showAlpha?: boolean;
  /** Alpha value (0-1) */
  alpha?: number;
  /** Default alpha value */
  defaultAlpha?: number;
  /** Predefined color swatches */
  swatches?: string[];
  /** Whether to show color swatches */
  showSwatches?: boolean;
  /** Whether to show color input fields */
  showInputs?: boolean;
  /** Input format for color values */
  inputFormat?: 'hex' | 'rgb' | 'hsl' | 'hsv';
  /** Color change handler */
  onChange?: (color: string, hsv: HSV, rgb: RGB, alpha?: number) => void;
  /** Alpha change handler */
  onAlphaChange?: (alpha: number) => void;
  /** Respect user's motion preferences */
  respectMotionPreference?: boolean;
}

// Color conversion utilities
const hsvToRgb = (h: number, s: number, v: number): RGB => {
  h = h / 360;
  s = s / 100;
  v = v / 100;

  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);

  let r: number, g: number, b: number;

  switch (i % 6) {
    case 0: r = v; g = t; b = p; break;
    case 1: r = q; g = v; b = p; break;
    case 2: r = p; g = v; b = t; break;
    case 3: r = p; g = q; b = v; break;
    case 4: r = t; g = p; b = v; break;
    case 5: r = v; g = p; b = q; break;
    default: r = 0; g = 0; b = 0; break;
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
};

const rgbToHsv = (r: number, g: number, b: number): HSV => {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;

  let h = 0;
  let s = max === 0 ? 0 : (diff / max) * 100;
  let v = max * 100;

  if (diff !== 0) {
    switch (max) {
      case r: h = ((g - b) / diff + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / diff + 2) / 6; break;
      case b: h = ((r - g) / diff + 4) / 6; break;
    }
  }

  return { h: h * 360, s, v };
};

const hexToRgb = (hex: string): RGB | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

const rgbToHex = (r: number, g: number, b: number): string => {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
};

export const GlassColorWheel = forwardRef<HTMLDivElement, GlassColorWheelProps>(
  (
    {
      value,
      defaultValue = '#ff0000',
      size = 'md',
      disabled = false,
      showAlpha = false,
      alpha,
      defaultAlpha = 1,
      swatches = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', 'var(--glass-black)', 'var(--glass-white)'],
      showSwatches = true,
      showInputs = true,
      inputFormat = 'hex',
      onChange,
      onAlphaChange,
      respectMotionPreference = true,
      className,
      ...props
    },
    ref
  ) => {
    const { prefersReducedMotion, isMotionSafe } = useMotionPreferenceContext();
    const { play } = useGlassSound();
    
    const wheelRef = useRef<HTMLCanvasElement>(null);
    const saturationRef = useRef<HTMLCanvasElement>(null);
    const alphaRef = useRef<HTMLCanvasElement>(null);
    
    const colorWheelId = useA11yId('glass-color-wheel');
    
    const [currentColor, setCurrentColor] = useState(value || defaultValue);
    const [currentAlpha, setCurrentAlpha] = useState(alpha ?? defaultAlpha);
    const [isDragging, setIsDragging] = useState<'wheel' | 'saturation' | 'alpha' | null>(null);
    
    // Parse initial color
    const initialRgb = hexToRgb(currentColor) || { r: 255, g: 0, b: 0 };
    const [hsv, setHsv] = useState<HSV>(rgbToHsv(initialRgb.r, initialRgb.g, initialRgb.b));

    const sizeConfig = {
      sm: {
        wheel: 120,
        saturation: 120,
        alpha: 120,
        thumb: 12,
        container: 'w-40',
        input: 'glass-text-xs h-6',
      },
      md: {
        wheel: 160,
        saturation: 160,
        alpha: 160,
        thumb: 16,
        container: 'w-52',
        input: 'glass-text-sm h-8',
      },
      lg: {
        wheel: 200,
        saturation: 200,
        alpha: 200,
        thumb: 20,
        container: 'w-64',
        input: 'glass-text-sm h-10',
      },
      xl: {
        wheel: 240,
        saturation: 240,
        alpha: 240,
        thumb: 24,
        container: 'w-80',
        input: 'glass-text-base h-10',
      },
    };

    const config = sizeConfig[size];

    // Draw color wheel
    useEffect(() => {
      const canvas = wheelRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(centerX, centerY) - 10;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw color wheel
      for (let angle = 0; angle < 360; angle++) {
        const startAngle = (angle - 2) * Math.PI / 180;
        const endAngle = angle * Math.PI / 180;
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.arc(centerX, centerY, radius * 0.6, endAngle, startAngle, true);
        ctx.closePath();
        
        const gradient = ctx.createRadialGradient(centerX, centerY, radius * 0.6, centerX, centerY, radius);
        gradient.addColorStop(0, `hsl(${angle}, 100%, 50%)`);
        gradient.addColorStop(1, `hsl(${angle}, 100%, 50%)`);
        
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      // Draw inner circle (saturation/brightness selector area)
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 0.6, 0, 2 * Math.PI);
      ctx.fillStyle = 'var(--glass-white)';
      ctx.fill();
      ctx.strokeStyle = '#dddddd';
      ctx.stroke();
    }, [config.wheel]);

    // Draw saturation/brightness area
    useEffect(() => {
      const canvas = saturationRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // Create base color from hue
      const baseColor = hsvToRgb(hsv.h, 100, 100);
      
      // Draw saturation/brightness gradient
      const imageData = ctx.createImageData(width, height);
      const data = imageData.data;

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const saturation = (x / width) * 100;
          const brightness = ((height - y) / height) * 100;
          
          const rgb = hsvToRgb(hsv.h, saturation, brightness);
          
          const index = (y * width + x) * 4;
          data[index] = rgb.r;     // Red
          data[index + 1] = rgb.g; // Green
          data[index + 2] = rgb.b; // Blue
          data[index + 3] = 255;   // Alpha
        }
      }

      ctx.putImageData(imageData, 0, 0);
    }, [hsv.h, config.saturation]);

    // Draw alpha slider
    useEffect(() => {
      if (!showAlpha) return;
      
      const canvas = alphaRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // Draw checkerboard background
      const checkSize = 8;
      for (let y = 0; y < height; y += checkSize) {
        for (let x = 0; x < width; x += checkSize) {
          const isEven = (Math.floor(x / checkSize) + Math.floor(y / checkSize)) % 2 === 0;
          ctx.fillStyle = isEven ? 'var(--glass-white)' : '#cccccc';
          ctx.fillRect(x, y, checkSize, checkSize);
        }
      }

      // Draw alpha gradient
      const rgb = hsvToRgb(hsv.h, hsv.s, hsv.v);
      const gradient = ctx.createLinearGradient(0, 0, width, 0);
      gradient.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0)`);
      gradient.addColorStop(1, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`);
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    }, [hsv, currentAlpha, showAlpha, config.alpha]);

    const updateColor = useCallback((newHsv: HSV, newAlpha?: number) => {
      setHsv(newHsv);
      
      const rgb = hsvToRgb(newHsv.h, newHsv.s, newHsv.v);
      const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
      
      setCurrentColor(hex);
      
      if (newAlpha !== undefined) {
        setCurrentAlpha(newAlpha);
      }
      
      onChange?.(hex, newHsv, rgb, newAlpha ?? currentAlpha);
      play('tap');
    }, [onChange, currentAlpha, play]);

    // Handle color wheel interaction
    const handleWheelInteraction = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
      if (disabled) return;

      const canvas = wheelRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const x = event.clientX - rect.left - centerX;
      const y = event.clientY - rect.top - centerY;
      
      const distance = Math.sqrt(x * x + y * y);
      const maxRadius = Math.min(centerX, centerY) - 10;
      const minRadius = maxRadius * 0.6;
      
      // Check if click is in the wheel ring
      if (distance >= minRadius && distance <= maxRadius) {
        let angle = Math.atan2(y, x) * 180 / Math.PI;
        if (angle < 0) angle += 360;
        
        updateColor({ ...hsv, h: angle });
      }
    }, [disabled, hsv, updateColor]);

    // Handle saturation/brightness area interaction
    const handleSaturationInteraction = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
      if (disabled) return;

      const canvas = saturationRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      const saturation = Math.max(0, Math.min(100, (x / canvas.width) * 100));
      const brightness = Math.max(0, Math.min(100, ((canvas.height - y) / canvas.height) * 100));
      
      updateColor({ ...hsv, s: saturation, v: brightness });
    }, [disabled, hsv, updateColor]);

    // Handle alpha slider interaction
    const handleAlphaInteraction = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
      if (disabled || !showAlpha) return;

      const canvas = alphaRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      
      const newAlpha = Math.max(0, Math.min(1, x / canvas.width));
      setCurrentAlpha(newAlpha);
      onAlphaChange?.(newAlpha);
      
      const rgb = hsvToRgb(hsv.h, hsv.s, hsv.v);
      const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
      onChange?.(hex, hsv, rgb, newAlpha);
    }, [disabled, showAlpha, hsv, onChange, onAlphaChange]);

    // Handle swatch selection
    const handleSwatchClick = useCallback((color: string) => {
      if (disabled) return;

      const rgb = hexToRgb(color);
      if (rgb) {
        const newHsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
        updateColor(newHsv);
      }
    }, [disabled, updateColor]);

    // Format color value for input
    const formatColorValue = useCallback(() => {
      const rgb = hsvToRgb(hsv.h, hsv.s, hsv.v);
      
      switch (inputFormat) {
        case 'rgb':
          return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
        case 'hsl':
          // Convert HSV to HSL (simplified)
          const hsl = { h: hsv.h, s: hsv.s, l: hsv.v };
          return `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)`;
        case 'hsv':
          return `hsv(${Math.round(hsv.h)}, ${Math.round(hsv.s)}%, ${Math.round(hsv.v)}%)`;
        default:
          return currentColor;
      }
    }, [hsv, currentColor, inputFormat]);

    return (
      <OptimizedGlass
        ref={ref}
        id={colorWheelId}
        elevation="level2"
        intensity="medium"
        depth={2}
        tint="neutral"
        border="subtle"
        className={cn(
          'glass-color-wheel glass-p-4 glass-radius-lg backdrop-blur-md border border-border/20',
          config.container,
          disabled && 'opacity-50 pointer-events-none',
          className
        )}
        {...props}
      >
        <Motion
          preset={isMotionSafe && respectMotionPreference ? "fadeIn" : "none"}
          className="gap-4"
        >
          {/* Color Wheel */}
          <div className="relative flex justify-center">
            <canvas
              ref={wheelRef}
              width={config.wheel}
              height={config.wheel}
              className="cursor-crosshair glass-radius-full"
              onClick={handleWheelInteraction}
              onMouseDown={() => setIsDragging('wheel')}
              onMouseMove={(e) => isDragging === 'wheel' && handleWheelInteraction(e)}
              onMouseUp={() => setIsDragging(null)}
            />
            
            {/* Hue indicator */}
            <div
              className="absolute w-4 h-4 border-2 border-white glass-radius-full shadow-lg pointer-events-none"
              style={{
                left: '50%',
                top: '50%',
                transform: `translate(-50%, -50%) translate(${Math.cos(hsv.h * Math.PI / 180) * (config.wheel / 2 - 20)}px, ${Math.sin(hsv.h * Math.PI / 180) * (config.wheel / 2 - 20)}px)`
              }}
            />
          </div>

          {/* Saturation/Brightness Area */}
          <div className="relative">
            <canvas
              ref={saturationRef}
              width={config.saturation}
              height={config.saturation * 0.6}
              className="w-full cursor-crosshair glass-radius-md border border-glass-border/20"
              onClick={handleSaturationInteraction}
              onMouseDown={() => setIsDragging('saturation')}
              onMouseMove={(e) => isDragging === 'saturation' && handleSaturationInteraction(e)}
              onMouseUp={() => setIsDragging(null)}
            />
            
            {/* Saturation/Brightness indicator */}
            <div
              className="absolute w-3 h-3 border-2 border-white glass-radius-full shadow-lg pointer-events-none"
              style={{
                left: `${hsv.s}%`,
                top: `${100 - hsv.v}%`,
                transform: 'translate(-50%, -50%)'
              }}
            />
          </div>

          {/* Alpha Slider */}
          {showAlpha && (
            <div className="relative">
              <canvas
                ref={alphaRef}
                width={config.alpha}
                height={20}
                className="w-full cursor-crosshair glass-radius-md border border-glass-border/20"
                onClick={handleAlphaInteraction}
                onMouseDown={() => setIsDragging('alpha')}
                onMouseMove={(e) => isDragging === 'alpha' && handleAlphaInteraction(e)}
                onMouseUp={() => setIsDragging(null)}
              />
              
              {/* Alpha indicator */}
              <div
                className="absolute w-3 h-6 border-2 border-white glass-radius-md shadow-lg pointer-events-none"
                style={{
                  left: `${currentAlpha * 100}%`,
                  top: '50%',
                  transform: 'translate(-50%, -50%)'
                }}
              />
            </div>
          )}

          {/* Color Preview */}
          <div className="flex items-center gap-2">
            <div
              className="w-12 h-8 glass-radius-md border border-glass-border/20 shadow-inner"
              style={{
                backgroundColor: showAlpha ? `${currentColor}${Math.round(currentAlpha * 255).toString(16).padStart(2, '0')}` : currentColor
              }}
            />
            
            {showInputs && (
              <input
                type="text"
                value={formatColorValue()}
                onChange={(e) => {
                  const newColor = e.target.value;
                  if (inputFormat === 'hex' && /^#[0-9A-F]{6}$/i.test(newColor)) {
                    const rgb = hexToRgb(newColor);
                    if (rgb) {
                      const newHsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
                      updateColor(newHsv);
                    }
                  }
                }}
                className={cn(
                  'flex-1 glass-px-2 glass-radius-md border border-border/20 bg-background/50',
                  'focus:outline-none focus:ring-2 focus:ring-primary/50',
                  config.input
                )}
              />
            )}
          </div>

          {/* Color Swatches */}
          {showSwatches && swatches.length > 0 && (
            <div className="grid grid-cols-8 gap-1">
              {swatches.map((swatch, index) => (
                <Motion
                  key={index}
                  preset={isMotionSafe && respectMotionPreference ? "scaleIn" : "none"}
                  delay={index * 20}
                  onClick={() => handleSwatchClick(swatch)}
                  className={cn(
                    'w-6 h-6 glass-radius-md border border-border/20 cursor-pointer',
                    'hover:scale-110 active:scale-95 transition-transform',
                    currentColor.toLowerCase() === swatch.toLowerCase() && 'ring-2 ring-primary'
                  )}
                  style={{ backgroundColor: swatch }}
                />
              ))}
            </div>
          )}
        </Motion>
      </OptimizedGlass>
    );
  }
);

GlassColorWheel.displayName = 'GlassColorWheel';

export default GlassColorWheel;