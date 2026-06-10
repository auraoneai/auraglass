"use client";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";
import { OptimizedGlass } from "../../primitives";

export interface MindMapNode {
  id: string;
  label: string;
  children?: MindMapNode[];
  color?: string;
  position?: { x: number; y: number };
  size?: "sm" | "md" | "lg";
  shape?: "circle" | "rectangle" | "diamond";
  icon?: React.ReactNode;
  data?: unknown;
}

export interface MindMapConnection {
  from: string;
  to: string;
  label?: string;
  type?: "solid" | "dashed" | "dotted";
  color?: string;
}

export interface GlassMindMapProps {
  /** Root node of the mind map */
  data: MindMapNode;
  /** Custom connections between nodes */
  connections?: MindMapConnection[];
  /** Whether nodes are editable */
  editable?: boolean;
  /** Whether to show mini-map */
  showMinimap?: boolean;
  /** Whether to enable zoom and pan */
  zoomable?: boolean;
  /** Layout direction */
  direction?: "horizontal" | "vertical" | "radial";
  /** Node spacing */
  nodeSpacing?: number;
  /** Custom className */
  className?: string;
  /** Node click handler */
  onNodeClick?: (node: MindMapNode) => void;
  /** Node double-click handler */
  onNodeDoubleClick?: (node: MindMapNode) => void;
  /** Node change handler (for editing) */
  onNodeChange?: (nodeId: string, changes: Partial<MindMapNode>) => void;
  /** Node add handler */
  onNodeAdd?: (parentId: string, newNode: MindMapNode) => void;
  /** Node delete handler */
  onNodeDelete?: (nodeId: string) => void;
}

interface PositionedNode extends MindMapNode {
  position: { x: number; y: number };
  level: number;
  parentId?: string;
}

export const GlassMindMap: React.FC<GlassMindMapProps> = ({
  data,
  connections = [],
  editable = false,
  showMinimap = false,
  zoomable = true,
  direction = "horizontal",
  nodeSpacing = 120,
  className = "",
  onNodeClick,
  onNodeDoubleClick,
  onNodeChange,
  onNodeAdd,
  onNodeDelete,
}) => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [editingNode, setEditingNode] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);

  // Calculate positions for all nodes
  const calculatePositions = useCallback(
    (node: MindMapNode): PositionedNode[] => {
      const positionedNodes: PositionedNode[] = [];
      const spacing = Math.max(nodeSpacing, 150);
      const rowSpacing = 88;
      const root = { x: 80, y: 180 };

      const visit = (
        current: MindMapNode,
        level: number,
        siblingIndex: number,
        siblingCount: number,
        parentId: string | undefined,
        parentPosition: { x: number; y: number }
      ) => {
        const offset = (siblingIndex - (siblingCount - 1) / 2) * rowSpacing;
        let position = current.position;

        if (!position) {
          if (direction === "vertical") {
            position = {
              x: parentPosition.x + offset,
              y: root.y + level * spacing,
            };
          } else if (direction === "radial" && level > 0) {
            const angle = (siblingIndex / siblingCount) * Math.PI * 2;
            const radius = spacing * level;
            position = {
              x: root.x + Math.cos(angle) * radius,
              y: root.y + Math.sin(angle) * radius,
            };
          } else {
            position = {
              x: root.x + level * spacing,
              y: parentPosition.y + offset,
            };
          }
        }

        const positionedNode: PositionedNode = {
          ...current,
          position,
          level,
          parentId,
        };

        positionedNodes.push(positionedNode);

        current.children?.forEach((child, index) => {
          visit(
            child,
            level + 1,
            index,
            current.children?.length || 1,
            current.id,
            position
          );
        });
      };

      visit(node, 0, 0, 1, undefined, root);
      return positionedNodes;
    },
    [direction, nodeSpacing]
  );

  const positionedNodes = calculatePositions(data);
  const svgViewBox = useMemo(() => {
    if (positionedNodes.length === 0) return "-40 0 760 320";

    const minX = Math.min(...positionedNodes.map((node) => node.position.x));
    const minY = Math.min(...positionedNodes.map((node) => node.position.y));
    const maxX = Math.max(
      ...positionedNodes.map((node) => node.position.x + 140)
    );
    const maxY = Math.max(
      ...positionedNodes.map((node) => node.position.y + 80)
    );
    const width = Math.max(360, maxX - minX + 160);
    const height = Math.max(240, maxY - minY + 140);

    return `${minX - 80} ${minY - 70} ${width} ${height}`;
  }, [positionedNodes]);

  // Handle node click
  const handleNodeClick = (node: PositionedNode) => {
    setSelectedNode(node.id);
    onNodeClick?.(node);
  };

  // Handle node double click
  const handleNodeDoubleClick = (node: PositionedNode) => {
    if (editable) {
      setEditingNode(node.id);
      setEditValue(node.label);
    }
    onNodeDoubleClick?.(node);
  };

  // Handle editing
  const handleEditSubmit = () => {
    if (editingNode && editValue.trim()) {
      onNodeChange?.(editingNode, { label: editValue.trim() });
    }
    setEditingNode(null);
    setEditValue("");
  };

  const handleEditCancel = () => {
    setEditingNode(null);
    setEditValue("");
  };

  // Handle drag and drop
  const handleMouseDown = (e: React.MouseEvent, nodeId: string) => {
    if (!editable) return;
    setDraggedNode(nodeId);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!draggedNode || !dragStartRef.current) return;

      const deltaX = e.clientX - dragStartRef.current.x;
      const deltaY = e.clientY - dragStartRef.current.y;

      const node = positionedNodes.find((n) => n.id === draggedNode);
      if (node) {
        onNodeChange?.(draggedNode, {
          position: {
            x: node.position.x + deltaX,
            y: node.position.y + deltaY,
          },
        });
      }
    },
    [draggedNode, positionedNodes, onNodeChange]
  );

  const handleMouseUp = useCallback(() => {
    setDraggedNode(null);
    dragStartRef.current = null;
  }, []);

  // Handle zoom and pan
  const handleWheel = (e: React.WheelEvent) => {
    if (!zoomable) return;

    e.preventDefault();
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.max(0.1, Math.min(3, zoom * zoomFactor));
    setZoom(newZoom);
  };

  const handlePanStart = (e: React.MouseEvent) => {
    if (!zoomable) return;
    setIsPanning(true);
    dragStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handlePanMove = useCallback(
    (e: MouseEvent) => {
      if (!isPanning || !dragStartRef.current) return;
      setPan({
        x: e.clientX - dragStartRef.current.x,
        y: e.clientY - dragStartRef.current.y,
      });
    },
    [isPanning]
  );

  const handlePanEnd = useCallback(() => {
    setIsPanning(false);
    dragStartRef.current = null;
  }, []);

  // Event listeners
  useEffect(() => {
    if (draggedNode) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    if (isPanning) {
      document.addEventListener("mousemove", handlePanMove);
      document.addEventListener("mouseup", handlePanEnd);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mousemove", handlePanMove);
      document.removeEventListener("mouseup", handlePanEnd);
    };
  }, [
    draggedNode,
    isPanning,
    handleMouseMove,
    handleMouseUp,
    handlePanMove,
    handlePanEnd,
  ]);

  // Render connection lines
  const renderConnections = () => {
    const lines: JSX.Element[] = [];

    const addConnection = (
      fromNode: PositionedNode,
      toNode: PositionedNode
    ) => {
      const connection = connections.find(
        (c) => c.from === fromNode.id && c.to === toNode.id
      );
      const color = connection?.color || "rgba(255, 255, 255, 0.28)";
      const strokeDasharray =
        connection?.type === "dashed"
          ? "5,5"
          : connection?.type === "dotted"
            ? "2,2"
            : "none";

      lines.push(
        <line
          key={`${fromNode.id}-${toNode.id}`}
          x1={fromNode.position.x + 50}
          y1={fromNode.position.y + 25}
          x2={toNode.position.x + 50}
          y2={toNode.position.y + 25}
          stroke={color}
          strokeWidth="2"
          strokeDasharray={strokeDasharray}
          markerEnd="url(#arrowhead)"
        />
      );

      if (connection?.label) {
        const midX = (fromNode.position.x + toNode.position.x) / 2 + 50;
        const midY = (fromNode.position.y + toNode.position.y) / 2 + 25;

        lines.push(
          <text
            key={`${fromNode.id}-${toNode.id}-label`}
            x={midX}
            y={midY - 5}
            textAnchor="middle"
            className="glass-text-xs glass-fill-white/70"
          >
            {connection.label}
          </text>
        );
      }
    };

    // Add connections from custom connections array
    connections.forEach((conn: any) => {
      const fromNode = positionedNodes.find((n) => n.id === conn.from);
      const toNode = positionedNodes.find((n) => n.id === conn.to);
      if (fromNode && toNode) {
        addConnection(fromNode, toNode);
      }
    });

    // Add default parent-child connections
    const addParentChildConnections = (node: PositionedNode) => {
      node.children?.forEach((child: any) => {
        const childNode = positionedNodes.find((n) => n.id === child.id);
        if (childNode) {
          addConnection(node, childNode);
          addParentChildConnections(childNode);
        }
      });
    };
    addParentChildConnections(positionedNodes[0]);

    return lines;
  };

  // Render nodes
  const renderNodes = () => {
    return positionedNodes.map((node: any) => {
      const isSelected = selectedNode === node.id;
      const isEditing = editingNode === node.id;
      const isDragged = draggedNode === node.id;

      const nodeSize = node.size === "lg" ? 92 : node.size === "sm" ? 58 : 74;
      const nodeHeight = nodeSize * 0.5;
      const fill = node.color || "rgba(14, 25, 46, 0.86)";
      const stroke = isSelected
        ? "rgba(109, 211, 255, 0.72)"
        : "rgba(255, 255, 255, 0.22)";

      let nodeElement;

      if (isEditing) {
        nodeElement = (
          <foreignObject
            x={node.position.x}
            y={node.position.y}
            width={nodeSize}
            height={nodeHeight}
          >
            <input
              autoFocus
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleEditSubmit();
                if (e.key === "Escape") handleEditCancel();
              }}
              onBlur={handleEditSubmit}
              className="glass-w-full glass-h-full glass-px-2 glass-py-1 glass-bg-transparent glass-border glass-border-white/30 glass-radius-md glass-text-primary glass-text-sm glass-focus-outline-none focus:glass-border-white/60 glass-focus glass-touch-target glass-contrast-guard"
            />
          </foreignObject>
        );
      } else {
        let shapeElement;
        switch (node.shape) {
          case "rectangle":
            shapeElement = (
              <rect
                x={node.position.x}
                y={node.position.y}
                width={nodeSize}
                height={nodeHeight}
                rx="8"
                fill={fill}
                stroke={stroke}
                strokeWidth={isSelected ? "2" : "1"}
              />
            );
            break;
          case "diamond":
            const centerX = node.position.x + nodeSize / 2;
            const centerY = node.position.y + nodeHeight / 2;
            shapeElement = (
              <polygon
                points={`${centerX},${centerY - nodeHeight / 2} ${centerX + nodeSize / 2},${centerY} ${centerX},${centerY + nodeHeight / 2} ${centerX - nodeSize / 2},${centerY}`}
                fill={fill}
                stroke={stroke}
                strokeWidth={isSelected ? "2" : "1"}
              />
            );
            break;
          default: // circle
            shapeElement = (
              <circle
                cx={node.position.x + nodeSize / 2}
                cy={node.position.y + nodeHeight / 2}
                r={Math.min(nodeSize, nodeHeight) / 2}
                fill={fill}
                stroke={stroke}
                strokeWidth={isSelected ? "2" : "1"}
              />
            );
        }

        nodeElement = (
          <g
            className={cn(
              "glass-cursor-pointer glass-focus glass-touch-target glass-contrast-guard",
              isDragged ? "glass-cursor-grabbing" : "glass-cursor-grab"
            )}
            onMouseDown={(e) => handleMouseDown(e, node.id)}
            onClick={(e) => handleNodeClick(node)}
            onDoubleClick={() => handleNodeDoubleClick(node)}
          >
            {shapeElement}
            <text
              x={node.position.x + nodeSize / 2}
              y={node.position.y + nodeHeight / 2 + 4}
              textAnchor="middle"
              className="glass-text-sm glass-fill-white glass-font-medium glass-pointer-events-none glass-select-none"
              fill="rgba(255, 255, 255, 0.94)"
            >
              {node.icon && (
                <tspan x={node.position.x + nodeSize / 2 - 15}>
                  {node.icon}
                </tspan>
              )}
              <tspan
                x={
                  node.icon
                    ? node.position.x + nodeSize / 2 + 15
                    : node.position.x + nodeSize / 2
                }
              >
                {node.label}
              </tspan>
            </text>
          </g>
        );
      }

      return <g key={node.id}>{nodeElement}</g>;
    });
  };

  return (
    <OptimizedGlass
      data-glass-component
      className={cn(
        "glass-mind-map glass-relative glass-overflow-hidden glass-max-w-full glass-surface-dark/30 glass-border glass-border-white/10",
        className
      )}
      intensity="subtle"
      elevation="level1"
      style={{
        width: "100%",
        height: "clamp(200px, 32vw, 300px)",
        maxWidth: "100%",
        boxSizing: "border-box",
        background:
          "var(--glass-primary-level3-surface)",
      }}
    >
      {/* Toolbar */}
      <div className="glass-absolute glass-top-2 glass-left-2 glass-z-10 glass-flex glass-gap-2">
        <OptimizedGlass
          className="glass-px-2 glass-py-1 glass-radius-md glass-text-xs glass-cursor-pointer glass-surface-dark/40 hover:glass-surface-subtle/10 glass-focus glass-touch-target glass-contrast-guard"
          intensity="subtle"
          onClick={(e: React.MouseEvent) => setZoom(1)}
        >
          Reset Zoom
        </OptimizedGlass>
        <OptimizedGlass
          className="glass-px-2 glass-py-1 glass-radius-md glass-text-xs glass-surface-dark/40"
          intensity="subtle"
        >
          Zoom: {(zoom * 100).toFixed(0)}%
        </OptimizedGlass>
      </div>

      {/* Mini-map */}
      {showMinimap && (
        <div className="glass-absolute glass-bottom-4 glass-right-4 glass-z-10 glass-w-32 glass-h-24 glass-surface-dark/20 glass-radius-md glass-border glass-border-white/20">
          <svg className="glass-w-full glass-h-full" viewBox="0 0 320 240">
            {positionedNodes.map((node: any) => (
              <circle
                key={`mini-${node.id}`}
                cx={(node.position.x + 160) / 3}
                cy={(node.position.y + 120) / 3}
                r="2"
                fill="rgba(255, 255, 255, 0.48)"
              />
            ))}
          </svg>
        </div>
      )}

      {/* Main SVG Canvas */}
      <div
        ref={containerRef}
        className="glass-overflow-auto"
        onWheel={handleWheel}
        onMouseDown={handlePanStart}
        style={{
          width: "100%",
          height: "100%",
          minWidth: 0,
          minHeight: 0,
          cursor: isPanning ? "grabbing" : "grab",
          background:
            "var(--glass-neutral-level2-surface)",
        }}
      >
        <svg
          ref={svgRef}
          className="glass-w-full glass-h-full"
          viewBox={svgViewBox}
          preserveAspectRatio="xMidYMid meet"
          style={{
            transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
            transformOrigin: "center",
            overflow: "visible",
          }}
        >
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon
                points="0 0, 10 3.5, 0 7"
                fill="rgba(255, 255, 255, 0.32)"
              />
            </marker>
          </defs>

          {/* Render connections */}
          {renderConnections()}

          {/* Render nodes */}
          {renderNodes()}
        </svg>
      </div>
    </OptimizedGlass>
  );
};

// Utility hook for mind map data management
export const useMindMap = (initialData: MindMapNode) => {
  const [data, setData] = useState(initialData);

  const addNode = (parentId: string, newNode: MindMapNode) => {
    const updateNode = (node: MindMapNode): MindMapNode => {
      if (node.id === parentId) {
        return {
          ...node,
          children: [...(node.children || []), newNode],
        };
      }
      return {
        ...node,
        children: node.children?.map(updateNode),
      };
    };

    setData(updateNode);
  };

  const updateNode = (nodeId: string, changes: Partial<MindMapNode>) => {
    const updateNodeRecursive = (node: MindMapNode): MindMapNode => {
      if (node.id === nodeId) {
        return { ...node, ...changes };
      }
      return {
        ...node,
        children: node.children?.map(updateNodeRecursive),
      };
    };

    setData(updateNodeRecursive);
  };

  const deleteNode = (nodeId: string) => {
    const deleteNodeRecursive = (node: MindMapNode): MindMapNode => {
      return {
        ...node,
        children: node.children
          ?.filter((child: any) => {
            if (child.id === nodeId) return false;
            return true;
          })
          .map(deleteNodeRecursive),
      };
    };

    setData(deleteNodeRecursive);
  };

  return {
    data,
    addNode,
    updateNode,
    deleteNode,
    setData,
  };
};
