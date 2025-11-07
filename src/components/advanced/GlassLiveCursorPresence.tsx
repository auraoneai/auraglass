import { useReducedMotion } from '@/hooks/useReducedMotion';
/**
 * AuraGlass Live Cursor Presence
 * Real-time collaborative cursor tracking with glass effects
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

interface CursorUser {
  id: string;
  name: string;
  avatar?: string;
  color: string;
  isTyping?: boolean;
  lastSeen: number;
}

interface CursorPosition {
  x: number;
  y: number;
  timestamp: number;
}

interface LiveCursor extends CursorUser {
  position: CursorPosition;
  velocity: { x: number; y: number };
  isVisible: boolean;
  trail: CursorPosition[];
}

interface GlassLiveCursorPresenceProps {
  children: React.ReactNode;
  className?: string;
  roomId: string;
  currentUser: CursorUser;
  connectionUrl?: string;
  maxUsers?: number;
  showTrails?: boolean;
  showLabels?: boolean;
  cursorSize?: number;
  trailLength?: number;
  fadeTimeout?: number; // ms
  smoothing?: number; // 0-1
  glassEffect?: boolean;
  onUserJoin?: (user: CursorUser) => void;
  onUserLeave?: (userId: string) => void;
  onCursorMove?: (userId: string, position: CursorPosition) => void;
}

export function GlassLiveCursorPresence({
  children,
  className,
  roomId,
  currentUser,
  connectionUrl = 'ws://localhost:8080',
  maxUsers = 20,
  showTrails = true,
  showLabels = true,
  cursorSize = 16,
  trailLength = 8,
  fadeTimeout = 5000,
  smoothing = 0.7,
  glassEffect = true,
  onUserJoin,
  onUserLeave,
  onCursorMove,
}: GlassLiveCursorPresenceProps) {
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const [cursors, setCursors] = useState<Map<string, LiveCursor>>(new Map());
  const [isConnected, setIsConnected] = useState(false);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  
  // Local cursor tracking
  const lastPosition = useRef({ x: 0, y: 0 });
  const lastSentTime = useRef(0);
  const sendThrottle = 50; // ms
  
  // WebSocket connection management
  const connect = useCallback(() => {
    try {
      const ws = new WebSocket(`${connectionUrl}/cursor-presence/${roomId}`);
      
      ws.onopen = () => {
        setIsConnected(true);
        setReconnectAttempts(0);
        
        // Send user join event
        ws.send(JSON.stringify({
          type: 'user:join',
          user: currentUser,
          timestamp: Date.now(),
        }));
      };
      
      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          handleWebSocketMessage(message);
        } catch (error) {
          console.warn('Invalid WebSocket message:', error);
        }
      };
      
      ws.onclose = () => {
        setIsConnected(false);
        
        // Attempt reconnection with exponential backoff
        if (reconnectAttempts < 5) {
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 10000);
          setTimeout(connect, delay);
          setReconnectAttempts((prev: any) => prev + 1);
        }
      };
      
      ws.onerror = (error) => {
        console.warn('WebSocket error:', error);
      };
      
      wsRef.current = ws;
      
    } catch (error) {
      console.warn('Failed to connect to cursor presence server:', error);
    }
  }, [connectionUrl, roomId, currentUser, reconnectAttempts]);
  
  // Handle WebSocket messages
  const handleWebSocketMessage = useCallback((message: any) => {
    switch (message.type) {
      case 'user:join':
        if (message.user.id !== currentUser.id) {
          setCursors((prev: Map<string, LiveCursor>) => {
            const newCursors = new Map(prev);
            newCursors.set(message.user.id, {
              ...message.user,
              position: { x: 0, y: 0, timestamp: Date.now() },
              velocity: { x: 0, y: 0 },
              isVisible: false,
              trail: [],
            });
            return newCursors;
          });
          onUserJoin?.(message.user);
        }
        break;
        
      case 'user:leave':
        setCursors((prev: Map<string, LiveCursor>) => {
          const newCursors = new Map(prev);
          newCursors.delete(message.userId);
          return newCursors;
        });
        onUserLeave?.(message.userId);
        break;
        
      case 'cursor:move':
        if (message.userId !== currentUser.id) {
          setCursors((prev: Map<string, LiveCursor>) => {
            const newCursors = new Map(prev);
            const existingCursor = newCursors.get(message.userId);
            
            if (existingCursor) {
              const newPosition = message.position;
              const oldPosition = existingCursor.position;
              
              // Calculate velocity
              const timeDiff = newPosition.timestamp - oldPosition.timestamp;
              const velocity = timeDiff > 0 ? {
                x: (newPosition.x - oldPosition.x) / timeDiff * 1000,
                y: (newPosition.y - oldPosition.y) / timeDiff * 1000,
              } : { x: 0, y: 0 };
              
              // Update trail
              const newTrail = showTrails ? [
                newPosition,
                ...existingCursor.trail.slice(0, trailLength - 1)
              ] : [];
              
              newCursors.set(message.userId, {
                ...existingCursor,
                position: newPosition,
                velocity,
                isVisible: true,
                trail: newTrail,
                lastSeen: Date.now(),
              });
            }
            
            return newCursors;
          });
          
          onCursorMove?.(message.userId, message.position);
        }
        break;
        
      case 'user:typing':
        setCursors((prev: Map<string, LiveCursor>) => {
          const newCursors = new Map(prev);
          const cursor = newCursors.get(message.userId);
          if (cursor) {
            newCursors.set(message.userId, {
              ...cursor,
              isTyping: message.isTyping,
            });
          }
          return newCursors;
        });
        break;
        
      case 'room:state':
        // Initial room state with all users
        message.users.forEach((user: CursorUser) => {
          if (user.id !== currentUser.id) {
            setCursors((prev: Map<string, LiveCursor>) => {
              const newCursors = new Map(prev);
              newCursors.set(user.id, {
                ...user,
                position: { x: 0, y: 0, timestamp: Date.now() },
                velocity: { x: 0, y: 0 },
                isVisible: false,
                trail: [],
              });
              return newCursors;
            });
          }
        });
        break;
    }
  }, [currentUser.id, onUserJoin, onUserLeave, onCursorMove, showTrails, trailLength]);
  
  // Track local cursor movement
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    
    const now = Date.now();
    if (now - lastSentTime.current < sendThrottle) return;
    
    const container = containerRef.current;
    if (!container) return;
    
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Only send if position changed significantly
    const dx = x - lastPosition.current.x;
    const dy = y - lastPosition.current.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > 2) {
      wsRef.current.send(JSON.stringify({
        type: 'cursor:move',
        userId: currentUser.id,
        position: { x, y, timestamp: now },
      }));
      
      lastPosition.current = { x, y };
      lastSentTime.current = now;
    }
  }, [currentUser.id, sendThrottle]);
  
  // Handle mouse leave
  const handleMouseLeave = useCallback(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'cursor:leave',
        userId: currentUser.id,
        timestamp: Date.now(),
      }));
    }
  }, [currentUser.id]);
  
  // Cleanup inactive cursors
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setCursors((prev: Map<string, LiveCursor>) => {
        const newCursors = new Map(prev);
        let hasChanges = false;
        
        newCursors.forEach((cursor, userId) => {
          if (now - cursor.lastSeen > fadeTimeout) {
            newCursors.set(userId, {
              ...cursor,
              isVisible: false,
            });
            hasChanges = true;
          }
        });
        
        return hasChanges ? newCursors : prev;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [fadeTimeout]);
  
  // Setup event listeners and connection
  useEffect(() => {
    connect();
    
    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseleave', handleMouseLeave);
    }
    
    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseleave', handleMouseLeave);
      }
      
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect, handleMouseMove, handleMouseLeave]);
  
  return (
    <div
      ref={containerRef}
      className={cn("relative", className)}
    >
      {children}
      
      {/* Live cursors */}
      <AnimatePresence>
        {Array.from(cursors.values()).map((cursor: any) => (
          cursor.isVisible && (
            <LiveCursorComponent
              key={cursor.id}
              cursor={cursor}
              size={cursorSize}
              showTrail={showTrails}
              showLabel={showLabels}
              smoothing={smoothing}
              glassEffect={glassEffect}
            />
          )
        ))}
      </AnimatePresence>
      
      {/* Connection status indicator */}
      <div className="absolute glass--glass--glass--glass--glass--glass--glass--glass--glass--glassglass--glassglass--top-2 left-2 flex items-center gap-2">
        <div
          className={cn(
            "w-2 h-2 glass-radius-full transition-colors",
            isConnected ? "bg-green-400" : "bg-red-400"
          )}
        />
        <span className="text-xs glass-text-secondary">
          {cursors.size} user{cursors.size !== 1 ? 's' : ''} online
        </span>
      </div>
    </div>
  );
}

// Individual cursor component
function LiveCursorComponent({
  cursor,
  size,
  showTrail,
  showLabel,
  smoothing,
  glassEffect,
}: {
  cursor: LiveCursor;
  size: number;
  showTrail: boolean;
  showLabel: boolean;
  smoothing: number;
  glassEffect: boolean;
}) {
  return (
    <>
      {/* Cursor trail */}
      {showTrail && cursor.trail.map((trailPoint, index) => (
        <motion.div
          key={`trail-${cursor.id}-${index}`}
          className="absolute pointer-events-none"
          initial={{ opacity: 0, scale: 0 }}
          animate={prefersReducedMotion ? {} : {
            opacity: (1 - index / cursor.trail.length) * 0.5,
            scale: 1 - index * 0.1,
            x: trailPoint.x,
            y: trailPoint.y,
          }}
          exit={{ opacity: 0, scale: 0 }}
          transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.3 }}
        >
          <div
            className={cn(
              "glass-radius-full",
              glassEffect && "OptimizedGlass intensity={0.2} blur={6} glass-blur-sm"
            )}
            style={{
              width: size * 0.5,
              height: size * 0.5,
              backgroundColor: cursor.color,
            }}
          />
        </motion.div>
      ))}
      
      {/* Main cursor */}
      <motion.div
        className="absolute pointer-events-none z-50"
        initial={{ opacity: 0, scale: 0, rotate: 0 }}
        animate={prefersReducedMotion ? {} : {
          opacity: 1,
          scale: 1,
          x: cursor.position.x,
          y: cursor.position.y,
          rotate: Math.atan2(cursor.velocity.y, cursor.velocity.x) * 180 / Math.PI,
        }}
        exit={{ opacity: 0, scale: 0 }}
        transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.3 }}
      >
        {/* Cursor icon */}
        <div
          className={cn(
            "relative",
            glassEffect && "OptimizedGlass intensity={0.2} blur={6} glass-blur-sm glass-elev-2"
          )}
          style={{
            width: size,
            height: size,
            transform: 'translate(-2px, -2px)',
          }}
        >
          <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M5.5 3.21V20.79C5.5 21.17 5.96 21.32 6.23 21.05L11.5 15.77L14.5 20.79C14.74 21.18 15.26 21.18 15.5 20.79L17.27 18.15C17.51 17.76 17.51 17.24 17.27 16.85L14.27 11.83L20.79 5.31C21.17 5.04 21.02 4.5 20.64 4.5H3.36C2.98 4.5 2.83 5.04 3.21 5.31L5.5 3.21Z"
              fill={cursor.color}
              stroke="white"
              strokeWidth="1"
            />
          </svg>
          
          {/* Typing indicator */}
          {cursor.isTyping && (
            <motion.div
              className="absolute -glass--glass--glass--glass--glassglass--glass-top-1 -right-1 w-3 h-3 glass-surface-green glass-radius-full"
              animate={prefersReducedMotion ? {} : { scale: [1, 1.2, 1] }}
              transition={{ duration: prefersReducedMotion ? 0 :  repeat: Infinity, duration: 1  }}
            />
          )}
        </div>
        
        {/* User label */}
        {showLabel && (
          <motion.div
            className={cn(
              "absolute top-6 left-2 glass-px-2 glass-py-1 glass-text-xs glass-radius-md whitespace-nowrap",
              glassEffect ? "glass-surface-primary glass-text-primary" : "bg-black glass-text-primary"
            )}
            initial={{ opacity: 0, y: -10 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              backgroundColor: glassEffect ? undefined : cursor.color,
            }}
          >
            {cursor.avatar && (
              <img
                src={cursor.avatar}
                alt={cursor.name}
                className="inline-block w-3 h-3 glass-radius-full glass-mr-1"
              />
            )}
            {cursor.name}
          </motion.div>
        )}
      </motion.div>
    </>
  );
}

// Hook for cursor presence functionality
export function useLiveCursorPresence(roomId: string, currentUser: CursorUser) {
  const [connectedUsers, setConnectedUsers] = useState<CursorUser[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  
  const broadcastTyping = useCallback((isTyping: boolean) => {
    // This would send typing status to other users
  }, []);
  
  const sendReaction = useCallback((reaction: string, position: { x: number; y: number }) => {
    // This would send reaction at cursor position
  }, []);
  
  return {
    connectedUsers,
    isConnected,
    broadcastTyping,
    sendReaction,
  };
}

// Preset configurations
export const cursorPresencePresets = {
  minimal: {
    showTrails: false,
    showLabels: false,
    cursorSize: 12,
    glassEffect: false,
  },
  standard: {
    showTrails: true,
    showLabels: true,
    cursorSize: 16,
    trailLength: 5,
    glassEffect: true,
  },
  immersive: {
    showTrails: true,
    showLabels: true,
    cursorSize: 20,
    trailLength: 10,
    smoothing: 0.5,
    glassEffect: true,
  },
  gaming: {
    showTrails: true,
    showLabels: false,
    cursorSize: 14,
    trailLength: 8,
    smoothing: 0.2,
    glassEffect: false,
  },
  presentation: {
    showTrails: false,
    showLabels: true,
    cursorSize: 24,
    glassEffect: true,
  },
};