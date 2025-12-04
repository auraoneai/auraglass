'use client';
import React, {
  forwardRef,
  useRef,
  useEffect,
  useState,
  useCallback,
} from "react";
import { OptimizedGlass, Motion } from "../../primitives";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { cn } from "../../lib/utilsComprehensive";
import { useA11yId } from "../../utils/a11y";
import { useMotionPreference } from "../../hooks/useMotionPreference";
import { useGlassSound } from "../../utils/soundDesign";

export interface SignaturePoint {
  x: number;
  y: number;
  pressure?: number;
  timestamp: number;
}

export interface SignatureOptions {
  minWidth?: number;
  maxWidth?: number;
  penColor?: string;
  backgroundColor?: string;
  velocityFilterWeight?: number;
  throttle?: number;
}

export interface GlassSignaturePadProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Signature pad width */
  width?: number;
  /** Signature pad height */
  height?: number;
  /** Signature options */
  options?: SignatureOptions;
  /** Whether the pad is disabled */
  disabled?: boolean;
  /** Whether to show clear button */
  showClearButton?: boolean;
  /** Whether to show save button */
  showSaveButton?: boolean;
  /** Signature data as data URL */
  value?: string;
  /** Change handler */
  onChange?: (signature: string) => void;
  /** Start drawing handler */
  onBegin?: () => void;
  /** End drawing handler */
  onEnd?: () => void;
  /** Clear handler */
  onClear?: () => void;
  /** Save handler */
  onSave?: (signature: string) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Whether to show placeholder */
  showPlaceholder?: boolean;
  /** Format for export */
  exportFormat?: "png" | "jpeg" | "svg";
  /** Export quality (0-1) */
  exportQuality?: number;
  /** Respect user's motion preferences */
  respectMotionPreference?: boolean;
}

export const GlassSignaturePad = forwardRef<
  HTMLDivElement,
  GlassSignaturePadProps
>(
  (
    {
      width = 400,
      height = 200,
      options = {},
      disabled = false,
      showClearButton = true,
      showSaveButton = true,
      value,
      onChange,
      onBegin,
      onEnd,
      onClear,
      onSave,
      placeholder = "Sign here",
      showPlaceholder = true,
      exportFormat = "png",
      exportQuality = 0.9,
      respectMotionPreference = true,
      className,
      ...props
    },
    ref
  ) => {
    const { shouldAnimate } = useMotionPreference();
    const { play } = useGlassSound();

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const contextRef = useRef<CanvasRenderingContext2D | null>(null);
    const signaturePadId = useA11yId("glass-signature-pad");

    const [isDrawing, setIsDrawing] = useState(false);
    const [isEmpty, setIsEmpty] = useState(true);
    const [points, setPoints] = useState<SignaturePoint[]>([]);
    const [lastVelocity, setLastVelocity] = useState(0);
    const [lastWidth, setLastWidth] = useState(0);

    const defaultOptions: Required<SignatureOptions> = {
      minWidth: 0.5,
      maxWidth: 2.5,
      penColor: "var(--glass-black)",
      backgroundColor: "transparent",
      velocityFilterWeight: 0.7,
      throttle: 16,
      ...options,
    };

    // Initialize canvas
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const context = canvas.getContext("2d");
      if (!context) return;

      contextRef.current = context;

      // Set canvas size
      canvas.width = width;
      canvas.height = height;

      // Configure context
      context.lineCap = "round";
      context.lineJoin = "round";
      context.imageSmoothingEnabled = true;

      // Set background
      if (defaultOptions.backgroundColor !== "transparent") {
        context.fillStyle = defaultOptions.backgroundColor;
        context.fillRect(0, 0, width, height);
      }

      // Load existing signature if provided
      if (value) {
        const img = new Image();
        img.onload = () => {
          context.clearRect(0, 0, width, height);
          if (defaultOptions.backgroundColor !== "transparent") {
            context.fillStyle = defaultOptions.backgroundColor;
            context.fillRect(0, 0, width, height);
          }
          context.drawImage(img, 0, 0);
          setIsEmpty(false);
        };
        img.src = value;
      }
    }, [width, height, defaultOptions.backgroundColor, value]);

    // Calculate stroke width based on velocity
    const calculateStrokeWidth = useCallback(
      (velocity: number) => {
        return Math.max(
          defaultOptions.maxWidth / (velocity + 1),
          defaultOptions.minWidth
        );
      },
      [defaultOptions.minWidth, defaultOptions.maxWidth]
    );

    // Add point to signature
    const addPoint = useCallback(
      (point: SignaturePoint) => {
        const context = contextRef.current;
        if (!context || points.length === 0) return;

        const lastPoint = points[points.length - 1];
        const distance = Math.sqrt(
          Math.pow(point.x - lastPoint.x, 2) +
            Math.pow(point.y - lastPoint.y, 2)
        );
        const time = point.timestamp - lastPoint.timestamp;
        const velocity = time > 0 ? distance / time : 0;

        // Apply velocity filter
        const filteredVelocity =
          defaultOptions.velocityFilterWeight * velocity +
          (1 - defaultOptions.velocityFilterWeight) * lastVelocity;

        const strokeWidth = calculateStrokeWidth(filteredVelocity);

        // Smooth width transition
        const smoothWidth = lastWidth * 0.3 + strokeWidth * 0.7;

        context.beginPath();
        context.moveTo(lastPoint.x, lastPoint.y);
        context.lineTo(point.x, point.y);
        context.strokeStyle = defaultOptions.penColor;
        context.lineWidth = smoothWidth;
        context.stroke();

        setLastVelocity(filteredVelocity);
        setLastWidth(smoothWidth);
        setPoints((prev: any) => [...prev, point]);
        setIsEmpty(false);
      },
      [
        points,
        lastVelocity,
        lastWidth,
        defaultOptions.penColor,
        defaultOptions.velocityFilterWeight,
        calculateStrokeWidth,
      ]
    );

    // Get pointer position
    const getPointerPos = useCallback(
      (event: React.PointerEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };

        const rect = canvas.getBoundingClientRect();
        return {
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        };
      },
      []
    );

    // Start signature
    const handlePointerDown = useCallback(
      (event: React.PointerEvent<HTMLCanvasElement>) => {
        if (disabled) return;

        event.preventDefault();
        setIsDrawing(true);

        const pos = getPointerPos(event);
        const point: SignaturePoint = {
          x: pos.x,
          y: pos.y,
          pressure: (event as any).pressure || 1,
          timestamp: Date.now(),
        };

        setPoints([point]);
        setLastVelocity(0);
        setLastWidth(defaultOptions.minWidth);

        onBegin?.();
        play("signature_start");
      },
      [disabled, getPointerPos, defaultOptions.minWidth, onBegin, play]
    );

    // Continue signature
    const handlePointerMove = useCallback(
      (event: React.PointerEvent<HTMLCanvasElement>) => {
        if (!isDrawing || disabled) return;

        const pos = getPointerPos(event);
        const point: SignaturePoint = {
          x: pos.x,
          y: pos.y,
          pressure: (event as any).pressure || 1,
          timestamp: Date.now(),
        };

        addPoint(point);
      },
      [isDrawing, disabled, getPointerPos, addPoint]
    );

    // End signature
    const handlePointerUp = useCallback(() => {
      if (!isDrawing) return;

      setIsDrawing(false);

      // Export signature
      const canvas = canvasRef.current;
      if (canvas) {
        const dataUrl = canvas.toDataURL(
          `image/${exportFormat}`,
          exportQuality
        );
        onChange?.(dataUrl);
      }

      onEnd?.();
      play("signature_complete");
    }, [isDrawing, exportFormat, exportQuality, onChange, onEnd, play]);

    // Clear signature
    const clear = useCallback(() => {
      const canvas = canvasRef.current;
      const context = contextRef.current;
      if (!canvas || !context) return;

      context.clearRect(0, 0, width, height);

      if (defaultOptions.backgroundColor !== "transparent") {
        context.fillStyle = defaultOptions.backgroundColor;
        context.fillRect(0, 0, width, height);
      }

      setPoints([]);
      setIsEmpty(true);
      setIsDrawing(false);

      onChange?.("");
      onClear?.();
      play("clear");
    }, [
      width,
      height,
      defaultOptions.backgroundColor,
      onChange,
      onClear,
      play,
    ]);

    // Save signature
    const save = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas || isEmpty) return;

      const dataUrl = canvas.toDataURL(`image/${exportFormat}`, exportQuality);
      onSave?.(dataUrl);
      play("save");
    }, [isEmpty, exportFormat, exportQuality, onSave, play]);

    // Draw placeholder
    const drawPlaceholder = useCallback(() => {
      const canvas = canvasRef.current;
      const context = contextRef.current;
      if (!canvas || !context || !isEmpty || !showPlaceholder) return;

      context.save();
      context.fillStyle = "rgba(156, 163, 175, 0.5)";
      context.font = "16px sans-serif";
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText(placeholder, width / 2, height / 2);
      context.restore();
    }, [isEmpty, showPlaceholder, placeholder, width, height]);

    // Redraw placeholder when needed
    useEffect(() => {
      if (isEmpty) {
        const timeout = setTimeout(drawPlaceholder, 100);
        return () => clearTimeout(timeout);
      }
    }, [isEmpty, drawPlaceholder]);

    return (
      <OptimizedGlass
        data-glass-component
        ref={ref}
        id={signaturePadId}
        elevation="level1"
        intensity="subtle"
        depth={1}
        tint="neutral"
        border="subtle"
        className={cn(
          "glass-signature-pad glass-radius-lg glass-glass-backdrop-blur-md glass-contrast-guard border border-border/20",
          disabled && "opacity-50 pointer-events-none",
          className
        )}
        {...props}
      >
        <Motion
          preset={shouldAnimate && respectMotionPreference ? "fadeIn" : "none"}
          className="glass-p-4 glass-gap-4"
        >
          {/* Canvas container */}
          <div className='glass-relative'>
            <canvas
              ref={canvasRef}
              width={width}
              height={height}
              className={cn(
                "border border-border/20 glass-radius-md bg-white cursor-crosshair",
                "touch-none", // Prevent touch scrolling
                disabled && "cursor-not-allowed"
              )}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
              style={{ width, height }}
              role="application"
              aria-label="Signature pad - draw your signature here"
              aria-describedby={`${signaturePadId}-instructions`}
            />

            {/* Instructions */}
            <div id={`${signaturePadId}-instructions`} className='glass-sr-only'>
              Use your mouse or finger to draw your signature. Press clear to
              start over.
            </div>
          </div>

          {/* Action buttons */}
          {(showClearButton || showSaveButton) && (
            <div className="glass-flex glass-justify-between glass-items-center">
              <div className="glass-flex glass-gap-2">
                {showClearButton && (
                  <button
                    onClick={clear}
                    disabled={disabled || isEmpty}
                    className={cn(
                      "glass-px-4 glass-py-2 glass-radius-md glass-text-sm font-medium transition-all duration-200",
                      "glass-hover-scale-105 active:scale-95",
                      "focus:outline-none focus:ring-2 focus:ring-primary/50",
                      "disabled:opacity-50 glass-disabled-cursor-not-allowed disabled:hover:scale-100",
                      "glass-focus glass-touch-target glass-contrast-guard"
                    )}
                  >
                    <OptimizedGlass
                      elevation="level2"
                      intensity="medium"
                      depth={1}
                      tint="neutral"
                      border="subtle"
                      className="glass-w-full glass-h-full"
                    >
                      Clear
                    </OptimizedGlass>
                  </button>
                )}
              </div>

              <div className="glass-flex glass-gap-2">
                {showSaveButton && (
                  <button
                    onClick={save}
                    disabled={disabled || isEmpty}
                    className={cn(
                      "glass-px-4 glass-py-2 glass-radius-md glass-text-sm font-medium transition-all duration-200",
                      "glass-hover-scale-105 active:scale-95",
                      "focus:outline-none focus:ring-2 focus:ring-primary/50",
                      "disabled:opacity-50 glass-disabled-cursor-not-allowed disabled:hover:scale-100",
                      "glass-focus glass-touch-target glass-contrast-guard"
                    )}
                  >
                    <OptimizedGlass
                      elevation="level2"
                      intensity="medium"
                      depth={1}
                      tint="primary"
                      border="subtle"
                      className="glass-w-full glass-h-full"
                    >
                      Save
                    </OptimizedGlass>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Status indicator */}
          <div className="glass-flex glass-items-center glass-justify-between glass-text-sm glass-text-secondary">
            <span>{isEmpty ? "No signature" : "Signature captured"}</span>

            {isDrawing && (
              <div className="glass-flex glass-items-center glass-gap-2">
                <div className='glass-w-2 glass-h-2 glass-surface-primary glass-radius-full glass-animate-pulse' />
                <span>Drawing...</span>
              </div>
            )}
          </div>
        </Motion>
      </OptimizedGlass>
    );
  }
);

GlassSignaturePad.displayName = "GlassSignaturePad";

export default GlassSignaturePad;