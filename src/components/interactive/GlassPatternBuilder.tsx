'use client';
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

export interface PatternElement {
  type: "circle" | "square" | "triangle" | "line" | "arc" | "polygon" | "text";
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  color: string;
  opacity: number;
  strokeColor: string;
  strokeWidth: number;
  id: string;
  properties?: Record<string, any>;
}

export interface PatternLayer {
  name: string;
  elements: PatternElement[];
  visible: boolean;
  locked: boolean;
  opacity: number;
  blendMode: string;
  id: string;
}

export interface PatternTemplate {
  name: string;
  category: string;
  preview: string;
  layers: PatternLayer[];
  id: string;
}

export interface GlassPatternBuilderProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Canvas width */
  width?: number;
  /** Canvas height */
  height?: number;
  /** Current pattern layers */
  layers?: PatternLayer[];
  /** Active layer index */
  activeLayerIndex?: number;
  /** Selected element IDs */
  selectedElements?: string[];
  /** Whether grid is visible */
  showGrid?: boolean;
  /** Grid size */
  gridSize?: number;
  /** Whether to snap to grid */
  snapToGrid?: boolean;
  /** Zoom level */
  zoom?: number;
  /** Pattern templates */
  templates?: PatternTemplate[];
  /** Available colors */
  colorPalette?: string[];
  /** Whether to show rulers */
  showRulers?: boolean;
  /** Background color */
  backgroundColor?: string;
  /** Export format */
  exportFormat?: "png" | "svg" | "json";
  /** Pattern change handler */
  onChange?: (layers: PatternLayer[]) => void;
  /** Layer change handler */
  onLayerChange?: (layers: PatternLayer[], activeIndex: number) => void;
  /** Element selection handler */
  onElementSelect?: (elementIds: string[]) => void;
  /** Template apply handler */
  onTemplateApply?: (template: PatternTemplate) => void;
  /** Export handler */
  onExport?: (data: string, format: string) => void;
  /** Show controls */
  showControls?: boolean;
  /** Show layer panel */
  showLayerPanel?: boolean;
  /** Show element properties */
  showProperties?: boolean;
  /** Respect user's motion preferences */
  respectMotionPreference?: boolean;
}

export const GlassPatternBuilder = forwardRef<
  HTMLDivElement,
  GlassPatternBuilderProps
>(
  (
    {
      width = 800,
      height = 600,
      layers = [],
      activeLayerIndex = 0,
      selectedElements = [],
      showGrid = true,
      gridSize = 20,
      snapToGrid = false,
      zoom = 1,
      templates = [],
      colorPalette = [
        "#FF6B6B",
        "#4ECDC4",
        "#45B7D1",
        "#96CEB4",
        "#FFEAA7",
        "#DDA0DD",
        "#F8C471",
      ],
      showRulers = true,
      backgroundColor = "var(--glass-white)",
      exportFormat = "png",
      onChange,
      onLayerChange,
      onElementSelect,
      onTemplateApply,
      onExport,
      showControls = true,
      showLayerPanel = true,
      showProperties = true,
      respectMotionPreference = true,
      className,
      ...props
    },
    ref
  ) => {
    const { prefersReducedMotion, isMotionSafe } = useMotionPreferenceContext();
    const { play } = useGlassSound();

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const patternBuilderId = useA11yId("glass-pattern-builder");

    const [currentLayers, setCurrentLayers] = useState<PatternLayer[]>(
      layers.length > 0
        ? layers
        : [
            {
              name: "Layer 1",
              elements: [],
              visible: true,
              locked: false,
              opacity: 1,
              blendMode: "normal",
              id: "layer-1",
            },
          ]
    );
    const [activeLayer, setActiveLayer] = useState(activeLayerIndex);
    const [selectedElementIds, setSelectedElementIds] =
      useState<string[]>(selectedElements);
    const [currentTool, setCurrentTool] =
      useState<PatternElement["type"]>("circle");
    const [currentColor, setCurrentColor] = useState(colorPalette[0]);
    const [isDrawing, setIsDrawing] = useState(false);
    const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(
      null
    );
    const [currentZoom, setCurrentZoom] = useState(zoom);
    const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
    const [history, setHistory] = useState<PatternLayer[][]>([currentLayers]);
    const [historyIndex, setHistoryIndex] = useState(0);

    // Default templates
    const defaultTemplates: PatternTemplate[] = [
      {
        name: "Geometric Grid",
        category: "Abstract",
        preview: "grid-preview",
        id: "template-grid",
        layers: [
          {
            name: "Grid Layer",
            id: "grid-layer",
            visible: true,
            locked: false,
            opacity: 1,
            blendMode: "normal",
            elements: Array.from({ length: 25 }, (_, i) => ({
              type: "square" as const,
              x: (i % 5) * 100 + 50,
              y: Math.floor(i / 5) * 100 + 50,
              width: 60,
              height: 60,
              rotation: 0,
              color: colorPalette[i % colorPalette.length],
              opacity: 0.8,
              strokeColor: "var(--glass-black)",
              strokeWidth: 2,
              id: `grid-${i}`,
              properties: {},
            })),
          },
        ],
      },
      {
        name: "Concentric Circles",
        category: "Organic",
        preview: "circles-preview",
        id: "template-circles",
        layers: [
          {
            name: "Circles Layer",
            id: "circles-layer",
            visible: true,
            locked: false,
            opacity: 1,
            blendMode: "normal",
            elements: Array.from({ length: 8 }, (_, i) => ({
              type: "circle" as const,
              x: width / 2,
              y: height / 2,
              width: (i + 1) * 40,
              height: (i + 1) * 40,
              rotation: 0,
              color: "transparent",
              opacity: 0.6,
              strokeColor: colorPalette[i % colorPalette.length],
              strokeWidth: 3,
              id: `circle-${i}`,
              properties: {},
            })),
          },
        ],
      },
      {
        name: "Mandala",
        category: "Decorative",
        preview: "mandala-preview",
        id: "template-mandala",
        layers: [
          {
            name: "Mandala Layer",
            id: "mandala-layer",
            visible: true,
            locked: false,
            opacity: 1,
            blendMode: "normal",
            elements: Array.from({ length: 12 }, (_, i) => ({
              type: "circle" as const,
              x: width / 2 + Math.cos((i * Math.PI) / 6) * 100,
              y: height / 2 + Math.sin((i * Math.PI) / 6) * 100,
              width: 40,
              height: 40,
              rotation: 0,
              color: colorPalette[i % 3],
              opacity: 0.7,
              strokeColor: "var(--glass-black)",
              strokeWidth: 1,
              id: `mandala-${i}`,
              properties: {},
            })),
          },
        ],
      },
    ];

    const allTemplates = [...defaultTemplates, ...templates];

    // Get mouse position relative to canvas
    const getCanvasPos = useCallback(
      (event: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };

        const rect = canvas.getBoundingClientRect();
        const x = (event.clientX - rect.left - panOffset.x) / currentZoom;
        const y = (event.clientY - rect.top - panOffset.y) / currentZoom;

        if (snapToGrid) {
          return {
            x: Math.round(x / gridSize) * gridSize,
            y: Math.round(y / gridSize) * gridSize,
          };
        }

        return { x, y };
      },
      [panOffset, currentZoom, snapToGrid, gridSize]
    );

    // Create new element
    const createElement = useCallback(
      (x: number, y: number): PatternElement => {
        return {
          type: currentTool,
          x,
          y,
          width: 50,
          height: 50,
          rotation: 0,
          color: currentColor,
          opacity: 1,
          strokeColor: "var(--glass-black)",
          strokeWidth: 2,
          id: `element-${Date.now()}-${Math.random()}`,
          properties: {},
        };
      },
      [currentTool, currentColor]
    );

    // Handle canvas mouse events
    const handleMouseDown = useCallback(
      (event: React.MouseEvent<HTMLCanvasElement>) => {
        const pos = getCanvasPos(event);

        // Check if clicking on existing element
        const clickedElement = currentLayers[activeLayer]?.elements.find(
          (element) => {
            return (
              pos.x >= element.x - element.width / 2 &&
              pos.x <= element.x + element.width / 2 &&
              pos.y >= element.y - element.height / 2 &&
              pos.y <= element.y + element.height / 2
            );
          }
        );

        if (clickedElement) {
          // Select element
          setSelectedElementIds([clickedElement.id]);
          onElementSelect?.([clickedElement.id]);
        } else {
          // Start drawing new element
          setIsDrawing(true);
          setDragStart(pos);
          setSelectedElementIds([]);
          onElementSelect?.([]);
        }

        play("tap");
      },
      [getCanvasPos, currentLayers, activeLayer, onElementSelect, play]
    );

    const handleMouseMove = useCallback(
      (event: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing || !dragStart) return;

        // Update drawing preview or element size
        // This would be implemented for interactive drawing
      },
      [isDrawing, dragStart]
    );

    const handleMouseUp = useCallback(
      (event: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing || !dragStart) return;

        const pos = getCanvasPos(event);
        const newElement = createElement(dragStart.x, dragStart.y);

        // Add element to active layer
        const updatedLayers = [...currentLayers];
        if (updatedLayers[activeLayer]) {
          updatedLayers[activeLayer] = {
            ...updatedLayers[activeLayer],
            elements: [...updatedLayers[activeLayer].elements, newElement],
          };

          setCurrentLayers(updatedLayers);
          addToHistory(updatedLayers);
          onChange?.(updatedLayers);
          onLayerChange?.(updatedLayers, activeLayer);
        }

        setIsDrawing(false);
        setDragStart(null);
        play("success");
      },
      [
        isDrawing,
        dragStart,
        getCanvasPos,
        createElement,
        currentLayers,
        activeLayer,
        onChange,
        onLayerChange,
        play,
      ]
    );

    // Add to history for undo/redo
    const addToHistory = useCallback(
      (newLayers: PatternLayer[]) => {
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push([...newLayers]);

        if (newHistory.length > 50) {
          newHistory.shift();
        } else {
          setHistoryIndex(historyIndex + 1);
        }

        setHistory(newHistory);
      },
      [history, historyIndex]
    );

    // Undo/Redo
    const undo = useCallback(() => {
      if (historyIndex > 0) {
        setHistoryIndex(historyIndex - 1);
        setCurrentLayers(history[historyIndex - 1]);
        play("tap");
      }
    }, [historyIndex, history, play]);

    const redo = useCallback(() => {
      if (historyIndex < history.length - 1) {
        setHistoryIndex(historyIndex + 1);
        setCurrentLayers(history[historyIndex + 1]);
        play("tap");
      }
    }, [historyIndex, history, play]);

    // Layer operations
    const addLayer = useCallback(() => {
      const newLayer: PatternLayer = {
        name: `Layer ${currentLayers.length + 1}`,
        elements: [],
        visible: true,
        locked: false,
        opacity: 1,
        blendMode: "normal",
        id: `layer-${Date.now()}`,
      };

      const updatedLayers = [...currentLayers, newLayer];
      setCurrentLayers(updatedLayers);
      setActiveLayer(updatedLayers.length - 1);
      addToHistory(updatedLayers);
      onLayerChange?.(updatedLayers, updatedLayers.length - 1);
      play("success");
    }, [currentLayers, addToHistory, onLayerChange, play]);

    const deleteLayer = useCallback(
      (layerIndex: number) => {
        if (currentLayers.length <= 1) return;

        const updatedLayers = currentLayers.filter(
          (_, index) => index !== layerIndex
        );
        setCurrentLayers(updatedLayers);
        setActiveLayer(Math.min(activeLayer, updatedLayers.length - 1));
        addToHistory(updatedLayers);
        onLayerChange?.(
          updatedLayers,
          Math.min(activeLayer, updatedLayers.length - 1)
        );
        play("error");
      },
      [currentLayers, activeLayer, addToHistory, onLayerChange, play]
    );

    // Apply template
    const applyTemplate = useCallback(
      (template: PatternTemplate) => {
        setCurrentLayers(template.layers);
        setActiveLayer(0);
        addToHistory(template.layers);
        onTemplateApply?.(template);
        onChange?.(template.layers);
        play("success");
      },
      [addToHistory, onTemplateApply, onChange, play]
    );

    // Export pattern
    const exportPattern = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      switch (exportFormat) {
        case "png":
          const pngData = canvas.toDataURL("image/png");
          onExport?.(pngData, "png");
          break;
        case "svg":
          // Generate SVG data
          const svgData = generateSVG(currentLayers, width, height);
          onExport?.(svgData, "svg");
          break;
        case "json":
          const jsonData = JSON.stringify(
            { layers: currentLayers, width, height },
            null,
            2
          );
          onExport?.(jsonData, "json");
          break;
      }

      play("success");
    }, [currentLayers, width, height, exportFormat, onExport, play]);

    // Generate SVG
    const generateSVG = useCallback(
      (layers: PatternLayer[], w: number, h: number): string => {
        let svg = `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">`;
        svg += `<rect width="100%" height="100%" fill="${backgroundColor}"/>`;

        layers.forEach((layer: any) => {
          if (!layer.visible) return;

          svg += `<g opacity="${layer.opacity}">`;

          layer.elements.forEach((element: any) => {
            switch (element.type) {
              case "circle":
                svg += `<circle cx="${element.x}" cy="${element.y}" r="${element.width / 2}" 
                      fill="${element.color}" stroke="${element.strokeColor}" stroke-width="${element.strokeWidth}" 
                      opacity="${element.opacity}" transform="rotate(${element.rotation} ${element.x} ${element.y})"/>`;
                break;
              case "square":
                svg += `<rect x="${element.x - element.width / 2}" y="${element.y - element.height / 2}" 
                      width="${element.width}" height="${element.height}" 
                      fill="${element.color}" stroke="${element.strokeColor}" stroke-width="${element.strokeWidth}" 
                      opacity="${element.opacity}" transform="rotate(${element.rotation} ${element.x} ${element.y})"/>`;
                break;
              // Add more shapes as needed
            }
          });

          svg += "</g>";
        });

        svg += "</svg>";
        return svg;
      },
      [backgroundColor]
    );

    // Render canvas
    const render = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Clear canvas
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, width, height);

      // Apply zoom and pan
      ctx.save();
      ctx.translate(panOffset.x, panOffset.y);
      ctx.scale(currentZoom, currentZoom);

      // Draw grid
      if (showGrid) {
        ctx.strokeStyle =
          "rgba(var(--glass-color-black) / var(--glass-opacity-10))";
        ctx.lineWidth = 1 / currentZoom;

        for (let x = 0; x <= width; x += gridSize) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }

        for (let y = 0; y <= height; y += gridSize) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }
      }

      // Draw layers
      currentLayers.forEach((layer, layerIndex) => {
        if (!layer.visible) return;

        ctx.save();
        ctx.globalAlpha = layer.opacity;

        layer.elements.forEach((element: any) => {
          ctx.save();
          ctx.translate(element.x, element.y);
          ctx.rotate((element.rotation * Math.PI) / 180);
          ctx.globalAlpha = element.opacity;

          // Draw element based on type
          switch (element.type) {
            case "circle":
              ctx.fillStyle = element.color;
              ctx.strokeStyle = element.strokeColor;
              ctx.lineWidth = element.strokeWidth;
              ctx.beginPath();
              ctx.arc(0, 0, element.width / 2, 0, Math.PI * 2);
              if (element.color !== "transparent") ctx.fill();
              if (element.strokeWidth > 0) ctx.stroke();
              break;

            case "square":
              ctx.fillStyle = element.color;
              ctx.strokeStyle = element.strokeColor;
              ctx.lineWidth = element.strokeWidth;
              if (element.color !== "transparent") {
                ctx.fillRect(
                  -element.width / 2,
                  -element.height / 2,
                  element.width,
                  element.height
                );
              }
              if (element.strokeWidth > 0) {
                ctx.strokeRect(
                  -element.width / 2,
                  -element.height / 2,
                  element.width,
                  element.height
                );
              }
              break;

            case "triangle":
              ctx.fillStyle = element.color;
              ctx.strokeStyle = element.strokeColor;
              ctx.lineWidth = element.strokeWidth;
              ctx.beginPath();
              ctx.moveTo(0, -element.height / 2);
              ctx.lineTo(-element.width / 2, element.height / 2);
              ctx.lineTo(element.width / 2, element.height / 2);
              ctx.closePath();
              if (element.color !== "transparent") ctx.fill();
              if (element.strokeWidth > 0) ctx.stroke();
              break;

            case "line":
              ctx.strokeStyle = element.strokeColor || element.color;
              ctx.lineWidth = element.strokeWidth;
              ctx.beginPath();
              ctx.moveTo(-element.width / 2, 0);
              ctx.lineTo(element.width / 2, 0);
              ctx.stroke();
              break;
          }

          // Highlight selected elements
          if (selectedElementIds.includes(element.id)) {
            ctx.strokeStyle = "var(--glass-color-primary)";
            ctx.lineWidth = 2 / currentZoom;
            ctx.setLineDash([5 / currentZoom, 5 / currentZoom]);
            ctx.strokeRect(
              -element.width / 2 - 5,
              -element.height / 2 - 5,
              element.width + 10,
              element.height + 10
            );
            ctx.setLineDash([]);
          }

          ctx.restore();
        });

        ctx.restore();
      });

      ctx.restore();

      // Draw rulers
      if (showRulers) {
        ctx.fillStyle =
          "rgba(var(--glass-color-black) / var(--glass-opacity-10))";
        ctx.fillRect(0, 0, width, 20);
        ctx.fillRect(0, 0, 20, height);

        ctx.fillStyle = "#333";
        ctx.font = "10px monospace";
        ctx.textAlign = "center";

        // Horizontal ruler
        for (let x = 0; x < width; x += 50) {
          ctx.fillText(x.toString(), x + panOffset.x, 15);
        }

        // Vertical ruler
        ctx.save();
        ctx.rotate(-Math.PI / 2);
        for (let y = 0; y < height; y += 50) {
          ctx.fillText(y.toString(), -y - panOffset.y, 15);
        }
        ctx.restore();
      }
    }, [
      backgroundColor,
      width,
      height,
      panOffset,
      currentZoom,
      showGrid,
      gridSize,
      currentLayers,
      selectedElementIds,
      showRulers,
    ]);

    // Animation loop
    useEffect(() => {
      const animate = () => {
        render();
        if (!prefersReducedMotion) {
          requestAnimationFrame(animate);
        }
      };
      animate();
    }, [render, prefersReducedMotion]);

    // Canvas setup
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      canvas.width = width;
      canvas.height = height;
    }, [width, height]);

    // Tool panel
    const renderToolPanel = () => {
      if (!showControls) return null;

      return (
        <OptimizedGlass
          elevation="level2"
          intensity="medium"
          depth={1}
          tint="neutral"
          border="subtle"
          className="glass-pattern-tools glass-flex glass-flex-wrap glass-items-center glass-gap-4 glass-p-4 glass-radius-lg glass-backdrop-blur-md glass-contrast-guard glass-border glass-border-glass-border/20 glass-contrast-guard"
        >
          {/* Tools */}
          <div className="glass-flex glass-items-center glass-gap-2">
            <span className='glass-text-sm glass-font-medium'>Tool:</span>
            {(["circle", "square", "triangle", "line"] as const).map(
              (tool: any) => (
                <button
                  key={tool}
                  onClick={() => setCurrentTool(tool)}
                  className={cn(
                    "glass-px-3 glass-py-1 glass-radius-md transition-colors capitalize glass-focus glass-touch-target glass-contrast-guard",
                    currentTool === tool
                      ? "bg-primary/20 text-primary"
                      : "bg-background/20 hover:bg-background/30"
                  )}
                >
                  {tool}
                </button>
              )
            )}
          </div>

          {/* Colors */}
          <div className="glass-flex glass-items-center glass-gap-2">
            <span className='glass-text-sm glass-font-medium'>Color:</span>
            <div className="glass-flex glass-gap-1">
              {colorPalette.map((color, i) => (
                <button
                  key={`${color}-${i}`}
                  onClick={() => setCurrentColor(color)}
                  className={cn(
                    "w-6 h-6 glass-radius-sm border-2 transition-all glass-focus glass-touch-target glass-contrast-guard",
                    currentColor === color
                      ? "border-primary"
                      : "border-border/30"
                  )}
                  style={{ backgroundColor: color }}
                  aria-label={`Select color ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="glass-flex glass-items-center glass-gap-2">
            <button
              onClick={undo}
              className='glass-focus glass-touch-target glass-contrast-guard glass-radius-md glass-surface-overlay hover:glass-surface-overlay glass-px-3 glass-py-1'
            >
              Undo
            </button>
            <button
              onClick={redo}
              className='glass-focus glass-touch-target glass-contrast-guard glass-radius-md glass-surface-overlay hover:glass-surface-overlay glass-px-3 glass-py-1'
            >
              Redo
            </button>
            <button
              onClick={exportPattern}
              className='glass-focus glass-touch-target glass-contrast-guard glass-radius-md glass-surface-primary/20 hover:glass-surface-primary/30 glass-px-3 glass-py-1 glass-text-primary'
            >
              Export
            </button>
          </div>

          {/* Zoom */}
          <div className="glass-flex glass-items-center glass-gap-2">
            <span className="glass-text-sm">Zoom:</span>
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.1"
              value={currentZoom}
              onChange={(e) => setCurrentZoom(parseFloat(e.target.value))}
              className='glass-w-20 glass-focus glass-touch-target glass-contrast-guard'
              aria-label="Zoom level"
            />
            <span className='glass-text-sm glass-min-w-3ch'>
              {Math.round(currentZoom * 100)}%
            </span>
          </div>
        </OptimizedGlass>
      );
    };

    // Layer panel
    const renderLayerPanel = () => {
      if (!showLayerPanel) return null;

      return (
        <OptimizedGlass
          elevation="level2"
          intensity="medium"
          depth={1}
          tint="neutral"
          border="subtle"
          className="glass-layer-panel glass-p-4 glass-radius-lg glass-backdrop-blur-md glass-contrast-guard glass-border glass-border-glass-border/20 glass-contrast-guard"
        >
          <div className='glass-flex glass-items-center glass-justify-between glass-mb-3'>
            <span className='glass-text-sm glass-font-medium'>Layers</span>
            <button
              onClick={addLayer}
              className='glass-px-2 glass-py-1 glass-radius-md glass-surface-primary/20 hover:glass-surface-primary/30 glass-text-primary glass-text-xs glass-focus glass-touch-target glass-contrast-guard'
            >
              Add
            </button>
          </div>

          <div className='glass-space-y-2'>
            {currentLayers.map((layer, index) => (
              <div
                key={layer.id}
                className={cn(
                  "glass-p-2 glass-radius-md border transition-colors cursor-pointer glass-focus glass-touch-target glass-contrast-guard",
                  index === activeLayer
                    ? "border-primary/50 bg-primary/10"
                    : "border-border/20 bg-background/10 hover:bg-background/20"
                )}
                onClick={() => setActiveLayer(index)}
              >
                <div className="glass-flex glass-items-center glass-justify-between">
                  <span className='glass-text-sm glass-font-medium'>
                    {layer.name}
                  </span>
                  <div className="glass-flex glass-items-center glass-gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const updated = [...currentLayers];
                        updated[index] = {
                          ...updated[index],
                          visible: !updated[index].visible,
                        };
                        setCurrentLayers(updated);
                      }}
                      className='glass-text-xs glass-px-1 hover:glass-surface-overlay glass-radius-sm glass-focus glass-touch-target glass-contrast-guard'
                      aria-label={layer.visible ? `Hide layer ${layer.name}` : `Show layer ${layer.name}`}
                    >
                      {layer.visible ? "👁" : "👁‍🗨"}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteLayer(index);
                      }}
                      className='glass-text-xs glass-px-1 hover:glass-surface-red/20 glass-radius-sm glass-text-primary glass-focus glass-touch-target glass-contrast-guard'
                      aria-label={`Delete layer ${layer.name}`}
                    >
                      🗑
                    </button>
                  </div>
                </div>
                <div className="glass-text-xs glass-text-secondary glass-mt-1">
                  {layer.elements.length} elements
                </div>
              </div>
            ))}
          </div>
        </OptimizedGlass>
      );
    };

    // Template panel
    const renderTemplates = () => {
      return (
        <OptimizedGlass
          elevation="level2"
          intensity="medium"
          depth={1}
          tint="neutral"
          border="subtle"
          className="glass-templates glass-p-4 glass-radius-lg glass-backdrop-blur-md glass-contrast-guard glass-border glass-border-glass-border/20 glass-contrast-guard"
        >
          <div className='glass-text-sm glass-font-medium glass-mb-3'>Templates</div>
          <div className='glass-space-y-2'>
            {allTemplates.map((template: any) => (
              <button
                key={template.id}
                onClick={() => applyTemplate(template)}
                className='glass-w-full glass-p-2 glass-radius-md glass-surface-overlay hover:glass-surface-overlay glass-text-left glass-focus glass-touch-target glass-contrast-guard'
              >
                <div className='glass-text-sm glass-font-medium'>{template.name}</div>
                <div className="glass-text-xs glass-text-secondary">
                  {template.category}
                </div>
              </button>
            ))}
          </div>
        </OptimizedGlass>
      );
    };

    return (
      <OptimizedGlass
        ref={ref}
        id={patternBuilderId}
        elevation="level1"
        intensity="subtle"
        depth={1}
        tint="neutral"
        border="subtle"
        className={cn(
          "glass-pattern-builder relative glass-radius-lg glass-backdrop-blur glass-contrast-guard border border-border/20",
          className
        )}
        {...props}
      >
        <Motion
          preset={isMotionSafe && respectMotionPreference ? "fadeIn" : "none"}
          className="glass-flex glass-flex-col glass-gap-4 glass-p-4"
        >
          {renderToolPanel()}

          <div className="glass-flex glass-gap-4">
            {showLayerPanel && (
              <div className='glass-w-64 glass-space-y-4'>
                {renderLayerPanel()}
                {renderTemplates()}
              </div>
            )}

            <div className="glass-flex-1">
              <canvas
                ref={canvasRef}
                width={width}
                height={height}
                className='glass-border glass-border-glass-border/20 glass-radius-md glass-surface-subtle glass-cursor-crosshair'
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                style={{ width, height }}
              />
            </div>
          </div>
        </Motion>
      </OptimizedGlass>
    );
  }
);

GlassPatternBuilder.displayName = "GlassPatternBuilder";

export default GlassPatternBuilder;