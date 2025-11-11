"use client";
import React, {
  forwardRef,
  useRef,
  useEffect,
  useState,
  useCallback,
} from "react";
import { OptimizedGlass } from "../../primitives";
import { Motion } from "../../primitives";
import { cn } from "../../lib/utilsComprehensive";
import { useA11yId } from "../../utils/a11y";
import { useMotionPreferenceContext } from "../../contexts/MotionPreferenceContext";
import { useGlassSound } from "../../utils/soundDesign";

export interface GesturePoint {
  x: number;
  y: number;
  timestamp: number;
  pressure?: number;
  id: string;
}

export interface GestureStroke {
  points: GesturePoint[];
  startTime: number;
  endTime: number;
  velocity: number;
  direction: number;
  distance: number;
  id: string;
}

export interface RecognizedGesture {
  type: string;
  confidence: number;
  data: any;
  timestamp: number;
  stroke: GestureStroke;
  id: string;
}

export interface GestureTemplate {
  name: string;
  type: string;
  points: Array<{ x: number; y: number }>;
  threshold: number;
}

export interface GlassGestureZoneProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Zone width */
  width?: number;
  /** Zone height */
  height?: number;
  /** Whether gesture recognition is active */
  active?: boolean;
  /** Gesture recognition sensitivity */
  sensitivity?: number;
  /** Maximum gesture duration */
  maxGestureDuration?: number;
  /** Minimum points for gesture */
  minGesturePoints?: number;
  /** Whether to show gesture trail */
  showTrail?: boolean;
  /** Trail color */
  trailColor?: string;
  /** Trail fade duration */
  trailFadeDuration?: number;
  /** Whether to show gesture feedback */
  showFeedback?: boolean;
  /** Feedback duration */
  feedbackDuration?: number;
  /** Custom gesture templates */
  gestureTemplates?: GestureTemplate[];
  /** Whether to enable multi-touch */
  multiTouch?: boolean;
  /** Maximum simultaneous touches */
  maxTouches?: number;
  /** Gesture recognition timeout */
  recognitionTimeout?: number;
  /** Whether to show debug info */
  debug?: boolean;
  /** Gesture start handler */
  onGestureStart?: (point: GesturePoint) => void;
  /** Gesture move handler */
  onGestureMove?: (point: GesturePoint, stroke: GestureStroke) => void;
  /** Gesture end handler */
  onGestureEnd?: (stroke: GestureStroke) => void;
  /** Gesture recognition handler */
  onGestureRecognized?: (gesture: RecognizedGesture) => void;
  /** Multi-touch handler */
  onMultiTouch?: (points: GesturePoint[]) => void;
  /** Show controls */
  showControls?: boolean;
  /** Respect user's motion preferences */
  respectMotionPreference?: boolean;
}

export const GlassGestureZone = forwardRef<
  HTMLDivElement,
  GlassGestureZoneProps
>(
  (
    {
      width = 600,
      height = 400,
      active = true,
      sensitivity = 0.8,
      maxGestureDuration = 5000,
      minGesturePoints = 3,
      showTrail = true,
      trailColor = "var(--glass-color-primary)",
      trailFadeDuration = 2000,
      showFeedback = true,
      feedbackDuration = 1000,
      gestureTemplates = [],
      multiTouch = false,
      maxTouches = 2,
      recognitionTimeout = 1000,
      debug = false,
      onGestureStart,
      onGestureMove,
      onGestureEnd,
      onGestureRecognized,
      onMultiTouch,
      showControls = true,
      respectMotionPreference = true,
      className,
      ...props
    },
    ref
  ) => {
    const { prefersReducedMotion, isMotionSafe } = useMotionPreferenceContext();
    const { play } = useGlassSound();

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>();
    const gestureZoneId = useA11yId("glass-gesture-zone");

    const [currentStrokes, setCurrentStrokes] = useState<
      Map<string, GestureStroke>
    >(new Map());
    const [completedStrokes, setCompletedStrokes] = useState<GestureStroke[]>(
      []
    );
    const [recognizedGestures, setRecognizedGestures] = useState<
      RecognizedGesture[]
    >([]);
    const [trailPoints, setTrailPoints] = useState<
      Array<{ point: GesturePoint; opacity: number; size: number }>
    >([]);
    const [feedbackGestures, setFeedbackGestures] = useState<
      Array<{ gesture: RecognizedGesture; opacity: number }>
    >([]);
    const [activePoints, setActivePoints] = useState<GesturePoint[]>([]);
    const [isMultiTouchActive, setIsMultiTouchActive] = useState(false);

    // Default gesture templates
    const defaultTemplates: GestureTemplate[] = [
      {
        name: "Circle",
        type: "circle",
        points: Array.from({ length: 16 }, (_, i) => ({
          x: Math.cos((i / 16) * Math.PI * 2),
          y: Math.sin((i / 16) * Math.PI * 2),
        })),
        threshold: 0.3,
      },
      {
        name: "Swipe Right",
        type: "swipe_right",
        points: [
          { x: -1, y: 0 },
          { x: -0.5, y: 0 },
          { x: 0, y: 0 },
          { x: 0.5, y: 0 },
          { x: 1, y: 0 },
        ],
        threshold: 0.4,
      },
      {
        name: "Swipe Left",
        type: "swipe_left",
        points: [
          { x: 1, y: 0 },
          { x: 0.5, y: 0 },
          { x: 0, y: 0 },
          { x: -0.5, y: 0 },
          { x: -1, y: 0 },
        ],
        threshold: 0.4,
      },
      {
        name: "Swipe Up",
        type: "swipe_up",
        points: [
          { x: 0, y: 1 },
          { x: 0, y: 0.5 },
          { x: 0, y: 0 },
          { x: 0, y: -0.5 },
          { x: 0, y: -1 },
        ],
        threshold: 0.4,
      },
      {
        name: "Swipe Down",
        type: "swipe_down",
        points: [
          { x: 0, y: -1 },
          { x: 0, y: -0.5 },
          { x: 0, y: 0 },
          { x: 0, y: 0.5 },
          { x: 0, y: 1 },
        ],
        threshold: 0.4,
      },
      {
        name: "Tap",
        type: "tap",
        points: [{ x: 0, y: 0 }],
        threshold: 0.1,
      },
      {
        name: "Double Tap",
        type: "double_tap",
        points: [{ x: 0, y: 0 }],
        threshold: 0.1,
      },
      {
        name: "Pinch",
        type: "pinch",
        points: [
          { x: -0.5, y: 0 },
          { x: 0, y: 0 },
          { x: 0.5, y: 0 },
        ],
        threshold: 0.3,
      },
    ];

    const allTemplates = [...defaultTemplates, ...gestureTemplates];

    // Normalize points to [-1, 1] range
    const normalizePoints = useCallback(
      (points: GesturePoint[]): Array<{ x: number; y: number }> => {
        if (points.length === 0) return [];

        const minX = Math.min(...points.map((p: any) => p.x));
        const maxX = Math.max(...points.map((p: any) => p.x));
        const minY = Math.min(...points.map((p: any) => p.y));
        const maxY = Math.max(...points.map((p: any) => p.y));

        const centerX = (minX + maxX) / 2;
        const centerY = (minY + maxY) / 2;
        const scaleX = Math.max(1, (maxX - minX) / 2);
        const scaleY = Math.max(1, (maxY - minY) / 2);
        const scale = Math.max(scaleX, scaleY);

        return points.map((point: any) => ({
          x: (point.x - centerX) / scale,
          y: (point.y - centerY) / scale,
        }));
      },
      []
    );

    // Calculate gesture similarity using DTW (Dynamic Time Warping)
    const calculateSimilarity = useCallback(
      (
        gesturePoints: Array<{ x: number; y: number }>,
        templatePoints: Array<{ x: number; y: number }>
      ): number => {
        if (gesturePoints.length === 0 || templatePoints.length === 0) return 0;

        const m = gesturePoints.length;
        const n = templatePoints.length;
        const dtw: number[][] = Array(m + 1)
          .fill(null)
          .map(() => Array(n + 1).fill(Infinity));

        dtw[0][0] = 0;

        for (let i = 1; i <= m; i++) {
          for (let j = 1; j <= n; j++) {
            const cost = Math.sqrt(
              Math.pow(gesturePoints[i - 1].x - templatePoints[j - 1].x, 2) +
                Math.pow(gesturePoints[i - 1].y - templatePoints[j - 1].y, 2)
            );

            dtw[i][j] =
              cost +
              Math.min(
                dtw[i - 1][j], // insertion
                dtw[i][j - 1], // deletion
                dtw[i - 1][j - 1] // match
              );
          }
        }

        // Normalize by path length
        const similarity = 1 - dtw[m][n] / Math.max(m, n);
        return Math.max(0, similarity);
      },
      []
    );

    // Recognize gesture
    const recognizeGesture = useCallback(
      (stroke: GestureStroke) => {
        if (stroke.points.length < minGesturePoints) return;

        const normalizedPoints = normalizePoints(stroke.points);
        let bestMatch: {
          template: GestureTemplate;
          confidence: number;
        } | null = null;

        for (const template of allTemplates) {
          const confidence = calculateSimilarity(
            normalizedPoints,
            template.points
          );

          if (confidence >= template.threshold * sensitivity) {
            if (!bestMatch || confidence > bestMatch.confidence) {
              bestMatch = { template, confidence };
            }
          }
        }

        if (bestMatch) {
          const recognizedGesture: RecognizedGesture = {
            type: bestMatch.template.type,
            confidence: bestMatch.confidence,
            data: {
              template: bestMatch.template.name,
              strokeId: stroke.id,
              duration: stroke.endTime - stroke.startTime,
              velocity: stroke.velocity,
              direction: stroke.direction,
              distance: stroke.distance,
            },
            timestamp: Date.now(),
            stroke,
            id: `gesture-${Date.now()}`,
          };

          setRecognizedGestures((prev: any) => [
            ...prev.slice(-9),
            recognizedGesture,
          ]);
          onGestureRecognized?.(recognizedGesture);

          // Add feedback
          if (showFeedback) {
            setFeedbackGestures((prev: any) => [
              ...prev,
              { gesture: recognizedGesture, opacity: 1 },
            ]);
          }

          play("success");
        }
      },
      [
        minGesturePoints,
        normalizePoints,
        allTemplates,
        calculateSimilarity,
        sensitivity,
        onGestureRecognized,
        showFeedback,
        play,
      ]
    );

    // Calculate stroke properties
    const calculateStrokeProperties = useCallback(
      (points: GesturePoint[]): Partial<GestureStroke> => {
        if (points.length < 2) {
          return { velocity: 0, direction: 0, distance: 0 };
        }

        let totalDistance = 0;
        let totalTime = 0;

        for (let i = 1; i < points.length; i++) {
          const dx = points[i].x - points[i - 1].x;
          const dy = points[i].y - points[i - 1].y;
          const dt = points[i].timestamp - points[i - 1].timestamp;

          totalDistance += Math.sqrt(dx * dx + dy * dy);
          totalTime += dt;
        }

        const velocity = totalTime > 0 ? totalDistance / totalTime : 0;

        // Calculate overall direction
        const startPoint = points[0];
        const endPoint = points[points.length - 1];
        const direction = Math.atan2(
          endPoint.y - startPoint.y,
          endPoint.x - startPoint.x
        );

        return { velocity, direction, distance: totalDistance };
      },
      []
    );

    // Get pointer position
    const getPointerPosition = useCallback(
      (event: React.PointerEvent<HTMLCanvasElement>): GesturePoint => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0, timestamp: Date.now(), id: "" };

        const rect = canvas.getBoundingClientRect();
        return {
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
          timestamp: Date.now(),
          pressure: (event as any).pressure || 1,
          id: `point-${Date.now()}-${Math.random()}`,
        };
      },
      []
    );

    // Handle pointer events
    const handlePointerDown = useCallback(
      (event: React.PointerEvent<HTMLCanvasElement>) => {
        if (!active) return;

        event.preventDefault();
        const point = getPointerPosition(event);
        const pointerId = event.pointerId.toString();

        const newStroke: GestureStroke = {
          points: [point],
          startTime: Date.now(),
          endTime: Date.now(),
          velocity: 0,
          direction: 0,
          distance: 0,
          id: `stroke-${pointerId}-${Date.now()}`,
        };

        setCurrentStrokes(
          (prev: any) => new Map(prev.set(pointerId, newStroke))
        );
        setActivePoints((prev: any) => [...prev, point]);

        onGestureStart?.(point);
        play("tap");
      },
      [active, getPointerPosition, onGestureStart, play]
    );

    const handlePointerMove = useCallback(
      (event: React.PointerEvent<HTMLCanvasElement>) => {
        if (!active) return;

        const point = getPointerPosition(event);
        const pointerId = event.pointerId.toString();
        const currentStroke = currentStrokes.get(pointerId);

        if (!currentStroke) return;

        const updatedStroke: GestureStroke = {
          ...currentStroke,
          points: [...currentStroke.points, point],
          endTime: Date.now(),
          ...calculateStrokeProperties([...currentStroke.points, point]),
        };

        setCurrentStrokes(
          (prev: any) => new Map(prev.set(pointerId, updatedStroke))
        );

        // Add to trail
        if (showTrail) {
          setTrailPoints((prev: any) => [
            ...prev,
            {
              point,
              opacity: 1,
              size: Math.min(8, Math.max(2, (point.pressure || 1) * 6)),
            },
          ]);
        }

        onGestureMove?.(point, updatedStroke);
      },
      [
        active,
        getPointerPosition,
        currentStrokes,
        calculateStrokeProperties,
        showTrail,
        onGestureMove,
      ]
    );

    const handlePointerUp = useCallback(
      (event: React.PointerEvent<HTMLCanvasElement>) => {
        if (!active) return;

        const pointerId = event.pointerId.toString();
        const stroke = currentStrokes.get(pointerId);

        if (!stroke) return;

        const finalStroke: GestureStroke = {
          ...stroke,
          endTime: Date.now(),
          ...calculateStrokeProperties(stroke.points),
        };

        setCurrentStrokes((prev: Map<string, GestureStroke>) => {
          const newMap = new Map(prev);
          newMap.delete(pointerId);
          return newMap;
        });

        setCompletedStrokes((prev: any) => [...prev.slice(-19), finalStroke]);
        setActivePoints((prev: any) =>
          prev.filter(
            (p: any) => p.id !== stroke.points[stroke.points.length - 1]?.id
          )
        );

        // Recognize gesture after a short delay
        setTimeout(() => {
          recognizeGesture(finalStroke);
        }, 100);

        onGestureEnd?.(finalStroke);
        play("success");
      },
      [
        active,
        currentStrokes,
        calculateStrokeProperties,
        recognizeGesture,
        onGestureEnd,
        play,
      ]
    );

    // Handle multi-touch
    useEffect(() => {
      const activeCount = currentStrokes.size;

      if (multiTouch && activeCount >= 2) {
        setIsMultiTouchActive(true);
        const points = Array.from(currentStrokes.values()).map(
          (stroke: any) => stroke.points[stroke.points.length - 1]
        );
        onMultiTouch?.(points);
      } else {
        setIsMultiTouchActive(false);
      }
    }, [currentStrokes, multiTouch, onMultiTouch]);

    // Fade trail points
    useEffect(() => {
      if (!showTrail) return;

      const interval = setInterval(() => {
        setTrailPoints((prev: any) =>
          prev
            .map((item: any) => ({
              ...item,
              opacity: Math.max(0, item.opacity - 0.02),
            }))
            .filter((item: any) => item.opacity > 0)
        );
      }, 16);

      return () => clearInterval(interval);
    }, [showTrail]);

    // Fade feedback
    useEffect(() => {
      if (!showFeedback) return;

      const interval = setInterval(() => {
        setFeedbackGestures((prev: any) =>
          prev
            .map((item: any) => ({
              ...item,
              opacity: Math.max(0, item.opacity - 0.01),
            }))
            .filter((item: any) => item.opacity > 0)
        );
      }, 16);

      return () => clearInterval(interval);
    }, [showFeedback]);

    // Render canvas
    const render = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Draw trail
      if (showTrail && !prefersReducedMotion) {
        trailPoints.forEach((item, index) => {
          const { point, opacity, size } = item;

          ctx.globalAlpha = opacity;
          ctx.fillStyle = trailColor;
          ctx.beginPath();
          ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // Draw active strokes
      ctx.globalAlpha = 1;
      ctx.strokeStyle = trailColor;
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      currentStrokes.forEach((stroke: any) => {
        if (stroke.points.length < 2) return;

        ctx.beginPath();
        ctx.moveTo(stroke.points[0].x, stroke.points[0].y);

        for (let i = 1; i < stroke.points.length; i++) {
          ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
        }

        ctx.stroke();
      });

      // Draw multi-touch indicators
      if (isMultiTouchActive) {
        activePoints.forEach((point: any) => {
          ctx.strokeStyle = "#FF6B6B";
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(point.x, point.y, 15, 0, Math.PI * 2);
          ctx.stroke();
        });
      }

      // Draw feedback
      feedbackGestures.forEach(({ gesture, opacity }) => {
        const centerX = width / 2;
        const centerY = height / 2;

        ctx.globalAlpha = opacity;
        ctx.fillStyle = "#4ADE80";
        ctx.font = "18px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(
          gesture.type.replace("_", " ").toUpperCase(),
          centerX,
          centerY
        );

        // Draw confidence
        ctx.font = "12px sans-serif";
        ctx.fillText(
          `${Math.round(gesture.confidence * 100)}%`,
          centerX,
          centerY + 25
        );
      });

      // Debug info
      if (debug) {
        ctx.globalAlpha = 1;
        ctx.fillStyle = "white";
        ctx.font = "10px monospace";
        ctx.textAlign = "left";

        let y = 15;
        ctx.fillText(`Active Strokes: ${currentStrokes.size}`, 10, y);
        y += 15;
        ctx.fillText(`Completed: ${completedStrokes.length}`, 10, y);
        y += 15;
        ctx.fillText(`Recognized: ${recognizedGestures.length}`, 10, y);
        y += 15;
        ctx.fillText(`Multi-touch: ${isMultiTouchActive}`, 10, y);
        y += 15;
        ctx.fillText(`Trail Points: ${trailPoints.length}`, 10, y);
      }
    }, [
      width,
      height,
      showTrail,
      prefersReducedMotion,
      trailPoints,
      trailColor,
      currentStrokes,
      isMultiTouchActive,
      activePoints,
      feedbackGestures,
      debug,
      completedStrokes.length,
      recognizedGestures.length,
    ]);

    // Animation loop
    useEffect(() => {
      const animate = () => {
        render();
        animationRef.current = requestAnimationFrame(animate);
      };

      animate();

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }, [render]);

    // Canvas setup
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      canvas.width = width;
      canvas.height = height;
    }, [width, height]);

    // Clear all data
    const clearAll = useCallback(() => {
      setCurrentStrokes(new Map());
      setCompletedStrokes([]);
      setRecognizedGestures([]);
      setTrailPoints([]);
      setFeedbackGestures([]);
      setActivePoints([]);
      play("error");
    }, [play]);

    // Controls
    const renderControls = () => {
      if (!showControls) return null;

      return (
        <OptimizedGlass
          elevation="level2"
          intensity="medium"
          depth={1}
          tint="neutral"
          border="subtle"
          className="glass-gesture-controls glass-flex glass-flex-wrap glass-items-center glass-gap-4 glass-p-4 glass-radius-lg glass-glass-glass-backdrop-blur-md glass-border glass-border-glass-border/20 glass-contrast-guard"
        >
          <div className="glass-flex glass-items-center glass-gap-2">
            <button
              onClick={() => {}}
              className={cn(
                "glass-px-3 glass-py-1 glass-radius-md glass-focus glass-touch-target glass-contrast-guard",
                active
                  ? "bg-green-500/20 hover:bg-green-500/30 text-green-400"
                  : "bg-red-500/20 hover:bg-red-500/30 text-red-400"
              )}
            >
              {active ? "Active" : "Inactive"}
            </button>

            <button
              onClick={clearAll}
              className="glass-px-3 glass-py-1 glass-radius-md bg-secondary/20 hover:bg-secondary/30 glass-focus glass-touch-target glass-focus glass-touch-target glass-contrast-guard"
            >
              Clear
            </button>
          </div>

          <div className="glass-flex glass-items-center glass-gap-2">
            <label htmlFor="gesture-sensitivity" className="glass-text-sm">
              Sensitivity:
            </label>
            <input
              id="gesture-sensitivity"
              type="range"
              min="0.1"
              max="1"
              step="0.1"
              value={sensitivity}
              onChange={(e) => {}}
              className="w-20 glass-focus glass-touch-target glass-contrast-guard"
              aria-label="Gesture sensitivity"
            />
            <span className="glass-text-sm min-w-[3ch]">
              {Math.round(sensitivity * 100)}%
            </span>
          </div>

          <div className="glass-flex glass-items-center glass-gap-2">
            <label className="glass-text-sm">
              <input
                type="checkbox"
                checked={showTrail}
                onChange={(e) => {}}
                className="glass-mr-1 glass-focus glass-touch-target glass-contrast-guard"
              />
              Trail
            </label>
            <label className="glass-text-sm">
              <input
                type="checkbox"
                checked={multiTouch}
                onChange={(e) => {}}
                className="glass-mr-1 glass-focus glass-touch-target glass-contrast-guard"
              />
              Multi-touch
            </label>
            <label className="glass-text-sm">
              <input
                type="checkbox"
                checked={debug}
                onChange={(e) => {}}
                className="glass-mr-1 glass-focus glass-touch-target glass-contrast-guard"
              />
              Debug
            </label>
          </div>
        </OptimizedGlass>
      );
    };

    return (
      <OptimizedGlass
        ref={ref}
        id={gestureZoneId}
        elevation="level1"
        intensity="subtle"
        depth={1}
        tint="neutral"
        border="subtle"
        className={cn(
          "glass-gesture-zone relative glass-radius-lg glass-glass-backdrop-blur-md border border-border/20 glass-contrast-guard",
          className
        )}
        data-testid={props["data-testid"]}
        aria-label={props["aria-label"] || "Gesture recognition zone"}
        {...props}
      >
        <Motion
          preset={isMotionSafe && respectMotionPreference ? "fadeIn" : "none"}
          className="glass-flex glass-flex-col glass-gap-4 glass-p-4"
        >
          {renderControls()}

          <div className="relative">
            <canvas
              ref={canvasRef}
              width={width}
              height={height}
              className={cn(
                "border border-border/20 glass-radius-md bg-background/5",
                active && "cursor-crosshair"
              )}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
              style={{ width, height, touchAction: "none" }}
            />
          </div>

          {/* Recent gestures */}
          {recognizedGestures.length > 0 && (
            <div className="glass-p-4 glass-surface-overlay glass-radius-md">
              <div className="glass-text-sm font-medium mb-2">
                Recent Gestures:
              </div>
              <div className="space-y-1">
                {recognizedGestures.slice(-5).map((gesture: any) => (
                  <div
                    key={gesture.id}
                    className="glass-text-xs glass-p-2 glass-surface-primary/10 glass-radius-sm"
                  >
                    <span className="font-medium">
                      {gesture.type.replace("_", " ")}
                    </span>
                    <span className="glass-text-secondary glass-ml-2">
                      {Math.round(gesture.confidence * 100)}% confidence
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Motion>
      </OptimizedGlass>
    );
  }
);

GlassGestureZone.displayName = "GlassGestureZone";

export default GlassGestureZone;
