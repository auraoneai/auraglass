'use client';
import React, { useCallback, useEffect, useRef, useState } from "react";
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
  data?: any;
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
  showMinimap = true,
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
    (node: MindMapNode, level = 0, parentId?: string): PositionedNode[] => {
      const positionedNodes: PositionedNode[] = [];

      // Calculate position based on direction and level
      let x = 0,
        y = 0;

      switch (direction) {
        case "horizontal":
          x = level * nodeSpacing;
          y = positionedNodes.length * 60 - (node.children?.length || 1) * 30;
          break;
        case "vertical":
          x = positionedNodes.length * 60 - (node.children?.length || 1) * 30;
          y = level * nodeSpacing;
          break;
        case "radial":
          const angle =
            (positionedNodes.length / (node.children?.length || 1)) *
            Math.PI *
            2;
          const radius = level * nodeSpacing;
          x = Math.cos(angle) * radius;
          y = Math.sin(angle) * radius;
          break;
      }

      const positionedNode: PositionedNode = {
        ...node,
        position: node.position || { x, y },
        level,
        parentId,
      };

      positionedNodes.push(positionedNode);

      // Process children
      node.children?.forEach((child: any) => {
        positionedNodes.push(...calculatePositions(child, level + 1, node.id));
      });

      return positionedNodes;
    },
    [direction, nodeSpacing]
  );

  const positionedNodes = calculatePositions(data);

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
      const color = connection?.color || "var(--glass-white)40";
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
            className="glass-text-xs fill-white/70"
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

      const nodeSize = node.size === "lg" ? 100 : node.size === "sm" ? 60 : 80;
      const nodeHeight = nodeSize * 0.5;

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
              className="glass-w-full glass-h-full glass-px-2 glass-py-1 bg-transparent glass-border glass-border-white/30 glass-radius-md text-primary glass-text-sm focus:outline-none focus:border-white/60 glass-focus glass-touch-target glass-contrast-guard"
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
                fill={node.color || "var(--glass-white)20"}
                stroke={
                  isSelected ? "var(--glass-white)60" : "var(--glass-white)30"
                }
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
                fill={node.color || "var(--glass-white)20"}
                stroke={
                  isSelected ? "var(--glass-white)60" : "var(--glass-white)30"
                }
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
                fill={node.color || "var(--glass-white)20"}
                stroke={
                  isSelected ? "var(--glass-white)60" : "var(--glass-white)30"
                }
                strokeWidth={isSelected ? "2" : "1"}
              />
            );
        }

        nodeElement = (
          <g
            className={`cursor-pointer glass-focus glass-touch-target glass-contrast-guard ${isDragged ? "cursor-grabbing" : "cursor-grab"}`}
            onMouseDown={(e) => handleMouseDown(e, node.id)}
            onClick={(e) => handleNodeClick(node)}
            onDoubleClick={() => handleNodeDoubleClick(node)}
          >
            {shapeElement}
            <text
              x={node.position.x + nodeSize / 2}
              y={node.position.y + nodeHeight / 2 + 4}
              textAnchor="middle"
              className="glass-text-sm fill-white font-medium pointer-events-none select-none"
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
      className={`relative overflow-hidden ${className}`}
      intensity="medium"
      elevation="level1"
    >
      {/* Toolbar */}
      <div className="absolute top-4 left-4 z-10 glass-flex glass-gap-2">
        <OptimizedGlass
          className="glass-px-3 glass-py-1 glass-radius-md glass-text-sm cursor-pointer hover:glass-surface-subtle/10 glass-focus glass-touch-target glass-contrast-guard"
          intensity="subtle"
          onClick={(e: React.MouseEvent) => setZoom(1)}
        >
          Reset Zoom
        </OptimizedGlass>
        <OptimizedGlass
          className="glass-px-3 glass-py-1 glass-radius-md glass-text-sm"
          intensity="subtle"
        >
          Zoom: {(zoom * 100).toFixed(0)}%
        </OptimizedGlass>
      </div>

      {/* Mini-map */}
      {showMinimap && (
        <div className="absolute bottom-4 right-4 z-10 w-32 h-24 glass-surface-dark/20 glass-radius-md glass-border glass-border-white/20">
          <svg className="glass-w-full glass-h-full" viewBox="0 0 320 240">
            {positionedNodes.map((node: any) => (
              <circle
                key={`mini-${node.id}`}
                cx={(node.position.x + 160) / 3}
                cy={(node.position.y + 120) / 3}
                r="2"
                fill="var(--glass-white)60"
              />
            ))}
          </svg>
        </div>
      )}

      {/* Main SVG Canvas */}
      <div
        ref={containerRef}
        className="glass-w-full glass-h-full overflow-hidden"
        onWheel={handleWheel}
        onMouseDown={handlePanStart}
        style={{ cursor: isPanning ? "grabbing" : "grab" }}
      >
        <svg
          ref={svgRef}
          className="glass-w-full glass-h-full"
          style={{
            transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
            transformOrigin: "center",
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
              <polygon points="0 0, 10 3.5, 0 7" fill="var(--glass-white)40" />
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