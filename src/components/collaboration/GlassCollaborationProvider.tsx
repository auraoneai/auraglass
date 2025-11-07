'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { cn } from '../../lib/utilsComprehensive';

export interface CollaborationUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  color: string;
  cursor?: {
    x: number;
    y: number;
    elementId?: string;
  };
  selection?: {
    elementId: string;
    start: number;
    end: number;
  };
  lastActive: number;
}

export interface CollaborationComment {
  id: string;
  userId: string;
  content: string;
  position: {
    x: number;
    y: number;
    elementId?: string;
  };
  timestamp: number;
  resolved?: boolean;
  replies?: CollaborationComment[];
}

export interface CollaborationEdit {
  id: string;
  userId: string;
  type: 'insert' | 'delete' | 'replace';
  elementId: string;
  position: number;
  content: string;
  timestamp: number;
}

export interface CollaborationActivity {
  id: string;
  userId: string;
  type: 'join' | 'leave' | 'edit' | 'comment' | 'cursor_move';
  description: string;
  timestamp: number;
  metadata?: any;
}

interface CollaborationContextType {
  // Users
  currentUser: CollaborationUser | null;
  users: CollaborationUser[];
  setCurrentUser: (user: CollaborationUser) => void;
  
  // Cursors & Selection
  updateCursor: (position: { x: number; y: number; elementId?: string }) => void;
  updateSelection: (selection: { elementId: string; start: number; end: number }) => void;
  
  // Comments
  comments: CollaborationComment[];
  addComment: (comment: Omit<CollaborationComment, 'id' | 'timestamp'>) => void;
  resolveComment: (commentId: string) => void;
  replyToComment: (commentId: string, reply: Omit<CollaborationComment, 'id' | 'timestamp' | 'position'>) => void;
  
  // Live Editing
  edits: CollaborationEdit[];
  applyEdit: (edit: Omit<CollaborationEdit, 'id' | 'timestamp'>) => void;
  
  // Activity
  activities: CollaborationActivity[];
  
  // Connection
  isConnected: boolean;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'reconnecting';
  
  // Settings
  showCursors: boolean;
  showComments: boolean;
  showActivity: boolean;
  toggleCursors: () => void;
  toggleComments: () => void;
  toggleActivity: () => void;
}

const CollaborationContext = createContext<CollaborationContextType | null>(null);

export const useCollaboration = () => {
  const context = useContext(CollaborationContext);
  if (!context) {
    throw new Error('useCollaboration must be used within a CollaborationProvider');
  }
  return context;
};

interface CollaborationProviderProps {
  children: React.ReactNode;
  roomId: string;
  enableRealTime?: boolean;
  maxUsers?: number;
}

// Generate random colors for users
const generateUserColor = (): string => {
  const colors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
    '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Simulate WebSocket connection for demo
class MockWebSocket {
  private listeners: { [event: string]: Function[] } = {};
  
  addEventListener(event: string, callback: Function) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }
  
  removeEventListener(event: string, callback: Function) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter((cb: any) => cb !== callback);
    }
  }
  
  send(data: string) {
    // Simulate message echo for demo
    setTimeout(() => {
      this.emit('message', { data });
    }, 50 + Math.random() * 100);
  }
  
  private emit(event: string, data: any) {
    if (this.listeners[event]) {
      this.listeners[event].forEach((callback: any) => callback(data));
    }
  }
  
  // Simulate other users
  simulateOtherUsers(roomId: string) {
    const otherUsers = [
      { id: 'user-2', name: 'Sarah Chen', email: 'sarah@company.com', color: '#EF4444' },
      { id: 'user-3', name: 'Mike Johnson', email: 'mike@company.com', color: '#10B981' },
      { id: 'user-4', name: 'Alex Rodriguez', email: 'alex@company.com', color: '#8B5CF6' }
    ];
    
    // Simulate users joining
    setTimeout(() => {
      this.emit('message', {
        data: JSON.stringify({
          type: 'user_joined',
          user: otherUsers[0]
        })
      });
    }, 2000);
    
    setTimeout(() => {
      this.emit('message', {
        data: JSON.stringify({
          type: 'user_joined',
          user: otherUsers[1]
        })
      });
    }, 4000);
    
    // Simulate cursor movements
    setInterval(() => {
      otherUsers.forEach((user: any) => {
        if (Math.random() > 0.7) {
          this.emit('message', {
            data: JSON.stringify({
              type: 'cursor_update',
              userId: user.id,
              cursor: {
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight
              }
            })
          });
        }
      });
    }, 1000);
  }
}

export const CollaborationProvider: React.FC<CollaborationProviderProps> = ({
  children,
  roomId,
  enableRealTime = true,
  maxUsers = 10
}) => {
  const [currentUser, setCurrentUser] = useState<CollaborationUser | null>(null);
  const [users, setUsers] = useState<CollaborationUser[]>([]);
  const [comments, setComments] = useState<CollaborationComment[]>([]);
  const [edits, setEdits] = useState<CollaborationEdit[]>([]);
  const [activities, setActivities] = useState<CollaborationActivity[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'reconnecting'>('disconnected');
  const [showCursors, setShowCursors] = useState(true);
  const [showComments, setShowComments] = useState(true);
  const [showActivity, setShowActivity] = useState(true);
  
  const wsRef = useRef<MockWebSocket | null>(null);
  const cursorTimeoutRef = useRef<NodeJS.Timeout>();

  // Initialize connection
  useEffect(() => {
    if (!enableRealTime) return;

    setConnectionStatus('connecting');
    
    // Simulate connection delay
    setTimeout(() => {
      wsRef.current = new MockWebSocket();
      
      wsRef.current.addEventListener('message', handleWebSocketMessage);
      
      setIsConnected(true);
      setConnectionStatus('connected');
      
      // Start simulating other users for demo
      wsRef.current.simulateOtherUsers(roomId);
      
      // Add activity
      addActivity({
        userId: 'system',
        type: 'join',
        description: 'Connected to collaboration room'
      });
    }, 1000);

    return () => {
      if (wsRef.current) {
        setIsConnected(false);
        setConnectionStatus('disconnected');
      }
    };
  }, [roomId, enableRealTime]);

  const handleWebSocketMessage = (event: any) => {
    try {
      const data = JSON.parse(event.data);
      
      switch (data.type) {
        case 'user_joined':
          setUsers((prev: any) => {
            const existing = prev.find(u => u.id === data.user.id);
            if (existing) return prev;
            return [...prev, { ...data.user, lastActive: Date.now() }];
          });
          addActivity({
            userId: data.user.id,
            type: 'join',
            description: `${data.user.name} joined the session`
          });
          break;
          
        case 'user_left':
          setUsers((prev: any) => prev.filter((u: any) => u.id !== data.userId));
          addActivity({
            userId: data.userId,
            type: 'leave',
            description: `User left the session`
          });
          break;
          
        case 'cursor_update':
          setUsers((prev: any) => prev.map((user: any) => 
            user.id === data.userId 
              ? { ...user, cursor: data.cursor, lastActive: Date.now() }
              : user
          ));
          break;
          
        case 'comment_added':
          setComments((prev: any) => [...prev, data.comment]);
          addActivity({
            userId: data.comment.userId,
            type: 'comment',
            description: 'Added a comment'
          });
          break;
          
        case 'edit_applied':
          setEdits((prev: any) => [...prev.slice(-99), data.edit]); // Keep last 100 edits
          addActivity({
            userId: data.edit.userId,
            type: 'edit',
            description: `Made an edit`
          });
          break;
      }
    } catch (error) {
      console.warn('Failed to parse collaboration message:', error);
    }
  };

  const addActivity = useCallback((activity: Omit<CollaborationActivity, 'id' | 'timestamp'>) => {
    const newActivity: CollaborationActivity = {
      ...activity,
      id: `activity-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now()
    };
    
    setActivities((prev: any) => [newActivity, ...prev.slice(0, 49)]); // Keep last 50 activities
  }, []);

  const updateCursor = useCallback((position: { x: number; y: number; elementId?: string }) => {
    if (!currentUser || !wsRef.current) return;
    
    setCurrentUser((prev: any) => prev ? { ...prev, cursor: position, lastActive: Date.now() } : null);
    
    // Debounce cursor updates
    clearTimeout(cursorTimeoutRef.current);
    cursorTimeoutRef.current = setTimeout(() => {
      wsRef.current?.send(JSON.stringify({
        type: 'cursor_update',
        userId: currentUser.id,
        cursor: position
      }));
    }, 50);
  }, [currentUser]);

  const updateSelection = useCallback((selection: { elementId: string; start: number; end: number }) => {
    if (!currentUser || !wsRef.current) return;
    
    setCurrentUser((prev: any) => prev ? { ...prev, selection, lastActive: Date.now() } : null);
    
    wsRef.current.send(JSON.stringify({
      type: 'selection_update',
      userId: currentUser.id,
      selection
    }));
  }, [currentUser]);

  const addComment = useCallback((comment: Omit<CollaborationComment, 'id' | 'timestamp'>) => {
    if (!currentUser || !wsRef.current) return;
    
    const newComment: CollaborationComment = {
      ...comment,
      id: `comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now()
    };
    
    setComments((prev: any) => [...prev, newComment]);
    
    wsRef.current.send(JSON.stringify({
      type: 'comment_added',
      comment: newComment
    }));
  }, [currentUser]);

  const resolveComment = useCallback((commentId: string) => {
    setComments((prev: any) => prev.map((comment: any) => 
      comment.id === commentId ? { ...comment, resolved: true } : comment
    ));
    
    if (wsRef.current) {
      wsRef.current.send(JSON.stringify({
        type: 'comment_resolved',
        commentId
      }));
    }
  }, []);

  const replyToComment = useCallback((commentId: string, reply: Omit<CollaborationComment, 'id' | 'timestamp' | 'position'>) => {
    if (!currentUser) return;
    
    const newReply: CollaborationComment = {
      ...reply,
      id: `reply-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      position: { x: 0, y: 0 } // Replies don't need positions
    };
    
    setComments((prev: any) => prev.map((comment: any) => 
      comment.id === commentId 
        ? { ...comment, replies: [...(comment.replies || []), newReply] }
        : comment
    ));
  }, [currentUser]);

  const applyEdit = useCallback((edit: Omit<CollaborationEdit, 'id' | 'timestamp'>) => {
    if (!currentUser || !wsRef.current) return;
    
    const newEdit: CollaborationEdit = {
      ...edit,
      id: `edit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now()
    };
    
    setEdits((prev: any) => [...prev.slice(-99), newEdit]);
    
    wsRef.current.send(JSON.stringify({
      type: 'edit_applied',
      edit: newEdit
    }));
  }, [currentUser]);

  const toggleCursors = useCallback(() => setShowCursors((prev: any) => !prev), []);
  const toggleComments = useCallback(() => setShowComments((prev: any) => !prev), []);
  const toggleActivity = useCallback(() => setShowActivity((prev: any) => !prev), []);

  const handleSetCurrentUser = useCallback((user: CollaborationUser) => {
    const userWithDefaults = {
      ...user,
      color: user.color || generateUserColor(),
      lastActive: Date.now()
    };
    
    setCurrentUser(userWithDefaults);
    setUsers((prev: any) => {
      const existing = prev.find(u => u.id === user.id);
      if (existing) {
        return prev.map((u: any) => u.id === user.id ? userWithDefaults : u);
      }
      return [...prev, userWithDefaults];
    });
    
    addActivity({
      userId: user.id,
      type: 'join',
      description: `${user.name} joined the session`
    });
  }, [addActivity]);

  const value: CollaborationContextType = {
    currentUser,
    users,
    setCurrentUser: handleSetCurrentUser,
    updateCursor,
    updateSelection,
    comments,
    addComment,
    resolveComment,
    replyToComment,
    edits,
    applyEdit,
    activities,
    isConnected,
    connectionStatus,
    showCursors,
    showComments,
    showActivity,
    toggleCursors,
    toggleComments,
    toggleActivity
  };

  return (
    <CollaborationContext.Provider value={value}>
      {children}
    </CollaborationContext.Provider>
  );
};