"use client";
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { cn } from "../../lib/utilsComprehensive";
import { ANIMATION } from "../../tokens/designConstants";

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
  type: "insert" | "delete" | "replace";
  elementId: string;
  position: number;
  content: string;
  timestamp: number;
}

export interface CollaborationActivity {
  id: string;
  userId: string;
  type: "join" | "leave" | "edit" | "comment" | "cursor_move";
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
  updateCursor: (position: {
    x: number;
    y: number;
    elementId?: string;
  }) => void;
  updateSelection: (selection: {
    elementId: string;
    start: number;
    end: number;
  }) => void;

  // Comments
  comments: CollaborationComment[];
  addComment: (comment: Omit<CollaborationComment, "id" | "timestamp">) => void;
  resolveComment: (commentId: string) => void;
  replyToComment: (
    commentId: string,
    reply: Omit<CollaborationComment, "id" | "timestamp" | "position">
  ) => void;

  // Live Editing
  edits: CollaborationEdit[];
  applyEdit: (edit: Omit<CollaborationEdit, "id" | "timestamp">) => void;

  // Activity
  activities: CollaborationActivity[];

  // Connection
  isConnected: boolean;
  connectionStatus:
    | "connecting"
    | "connected"
    | "disconnected"
    | "reconnecting";

  // Settings
  showCursors: boolean;
  showComments: boolean;
  showActivity: boolean;
  toggleCursors: () => void;
  toggleComments: () => void;
  toggleActivity: () => void;
}

const CollaborationContext = createContext<CollaborationContextType | null>(
  null
);

const defaultCollaborationContext: CollaborationContextType = {
  currentUser: null,
  users: [],
  setCurrentUser: () => {},
  updateCursor: () => {},
  updateSelection: () => {},
  comments: [],
  addComment: () => {},
  resolveComment: () => {},
  replyToComment: () => {},
  edits: [],
  applyEdit: () => {},
  activities: [],
  isConnected: false,
  connectionStatus: "disconnected",
  showCursors: true,
  showComments: true,
  showActivity: true,
  toggleCursors: () => {},
  toggleComments: () => {},
  toggleActivity: () => {},
};

export const useCollaboration = () => {
  const context = useContext(CollaborationContext);
  return context ?? defaultCollaborationContext;
};

interface CollaborationProviderProps {
  children: React.ReactNode;
  roomId: string;
  enableRealTime?: boolean;
  maxUsers?: number;
  className?: string;
  "data-testid"?: string;
}

// Generate random colors for users
const generateUserColor = (): string => {
  const colors = [
    "var(--glass-color-primary)",
    "var(--glass-color-danger)",
    "var(--glass-color-success)",
    "var(--glass-color-warning)",
    "var(--glass-color-secondary)",
    "var(--glass-color-accent)",
    "var(--glass-color-info)",
    "var(--glass-color-success-light)",
    "var(--glass-color-warning-light)",
    "var(--glass-color-primary-light)",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

export const CollaborationProvider: React.FC<CollaborationProviderProps> = ({
  children,
  roomId,
  enableRealTime = true,
  maxUsers = 10,
  className,
  "data-testid": dataTestId,
}) => {
  const [currentUser, setCurrentUser] = useState<CollaborationUser | null>(
    null
  );
  const [users, setUsers] = useState<CollaborationUser[]>([]);
  const [comments, setComments] = useState<CollaborationComment[]>([]);
  const [edits, setEdits] = useState<CollaborationEdit[]>([]);
  const [activities, setActivities] = useState<CollaborationActivity[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<
    "connecting" | "connected" | "disconnected" | "reconnecting"
  >("disconnected");
  const [showCursors, setShowCursors] = useState(true);
  const [showComments, setShowComments] = useState(true);
  const [showActivity, setShowActivity] = useState(true);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const heartbeatRef = useRef<NodeJS.Timeout>();
  const cursorTimeoutRef = useRef<NodeJS.Timeout>();

  const addActivity = useCallback(
    (activity: Omit<CollaborationActivity, "id" | "timestamp">) => {
      const newActivity: CollaborationActivity = {
        ...activity,
        id: `activity-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now(),
      };

      setActivities((prev: any) => [newActivity, ...prev.slice(0, 49)]); // Keep last 50 activities
    },
    []
  );

  const handleWebSocketMessage = useCallback(
    (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data as string);

        switch (data.type) {
          case "user_joined":
            setUsers((prev: any) => {
              const existing = prev.find((u: any) => u.id === data.user.id);
              if (existing) return prev;
              return [...prev, { ...data.user, lastActive: Date.now() }];
            });
            addActivity({
              userId: data.user.id,
              type: "join",
              description: `${data.user.name} joined the session`,
            });
            break;

          case "user_left":
            setUsers((prev: any) =>
              prev.filter((u: any) => u.id !== data.userId)
            );
            addActivity({
              userId: data.userId,
              type: "leave",
              description: `User left the session`,
            });
            break;

          case "cursor_update":
            setUsers((prev: any) =>
              prev.map((user: any) =>
                user.id === data.userId
                  ? { ...user, cursor: data.cursor, lastActive: Date.now() }
                  : user
              )
            );
            break;

          case "comment_added":
            setComments((prev: any) => [...prev, data.comment]);
            addActivity({
              userId: data.comment.userId,
              type: "comment",
              description: "Added a comment",
            });
            break;

          case "edit_applied":
            setEdits((prev: any) => [...prev.slice(-99), data.edit]); // Keep last 100 edits
            addActivity({
              userId: data.edit.userId,
              type: "edit",
              description: `Made an edit`,
            });
            break;
        }
      } catch {
        // Ignore malformed collaboration messages and keep the connection alive.
      }
    },
    [addActivity]
  );

  // Initialize connection
  useEffect(() => {
    if (!enableRealTime) return;

    const wsBase =
      process.env.NEXT_PUBLIC_WEBSOCKET_SERVER_URL ||
      process.env.WEBSOCKET_SERVER_URL ||
      "";

    if (!wsBase) {
      return;
    }

    let cancelled = false;
    let reconnectAttempts = 0;

    const normalizedBase = wsBase.replace(/\/$/, "");
    const connect = () => {
      if (cancelled) return;
      const roomParam = `roomId=${encodeURIComponent(roomId)}`;
      const url =
        normalizedBase.includes("?") || normalizedBase.includes("&")
          ? `${normalizedBase}&${roomParam}`
          : `${normalizedBase}?${roomParam}`;

      setConnectionStatus(
        reconnectAttempts === 0 ? "connecting" : "reconnecting"
      );

      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        if (cancelled) return;
        reconnectAttempts = 0;
        setIsConnected(true);
        setConnectionStatus("connected");
        addActivity({
          userId: "system",
          type: "join",
          description: "Connected to collaboration room",
        });

        heartbeatRef.current = setInterval(() => {
          if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(
              JSON.stringify({ type: "ping", ts: Date.now(), roomId })
            );
          }
        }, ANIMATION.DURATION.slower * 25);
      };

      ws.onmessage = handleWebSocketMessage;

      ws.onclose = () => {
        if (cancelled) return;
        setIsConnected(false);
        setConnectionStatus("reconnecting");
        if (heartbeatRef.current) {
          clearInterval(heartbeatRef.current);
        }
        const backoff = Math.min(
          ANIMATION.DURATION.slower * 50,
          ANIMATION.DURATION.slower * 2 ** reconnectAttempts
        );
        reconnectAttempts += 1;
        reconnectTimeoutRef.current = setTimeout(connect, backoff);
      };

      ws.onerror = () => {
        ws.close();
      };
    };

    connect();

    return () => {
      cancelled = true;
      if (heartbeatRef.current) {
        clearInterval(heartbeatRef.current);
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      setIsConnected(false);
      setConnectionStatus("disconnected");
    };
  }, [roomId, enableRealTime, handleWebSocketMessage, addActivity]);

  const sendMessage = useCallback((payload: any) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    wsRef.current.send(JSON.stringify(payload));
  }, []);

  const updateCursor = useCallback(
    (position: { x: number; y: number; elementId?: string }) => {
      if (!currentUser) return;

      setCurrentUser((prev: any) =>
        prev ? { ...prev, cursor: position, lastActive: Date.now() } : null
      );

      // Debounce cursor updates
      clearTimeout(cursorTimeoutRef.current);
      cursorTimeoutRef.current = setTimeout(() => {
        sendMessage({
          type: "cursor_update",
          userId: currentUser.id,
          cursor: position,
        });
      }, ANIMATION.DURATION.fast / 4);
    },
    [currentUser, sendMessage]
  );

  const updateSelection = useCallback(
    (selection: { elementId: string; start: number; end: number }) => {
      if (!currentUser) return;

      setCurrentUser((prev: any) =>
        prev ? { ...prev, selection, lastActive: Date.now() } : null
      );

      sendMessage({
        type: "selection_update",
        userId: currentUser.id,
        selection,
      });
    },
    [currentUser, sendMessage]
  );

  const addComment = useCallback(
    (comment: Omit<CollaborationComment, "id" | "timestamp">) => {
      if (!currentUser) return;

      const newComment: CollaborationComment = {
        ...comment,
        id: `comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now(),
      };

      setComments((prev: any) => [...prev, newComment]);

      sendMessage({
        type: "comment_added",
        comment: newComment,
      });
    },
    [currentUser, sendMessage]
  );

  const resolveComment = useCallback(
    (commentId: string) => {
      setComments((prev: any) =>
        prev.map((comment: any) =>
          comment.id === commentId ? { ...comment, resolved: true } : comment
        )
      );

      sendMessage({
        type: "comment_resolved",
        commentId,
      });
    },
    [sendMessage]
  );

  const replyToComment = useCallback(
    (
      commentId: string,
      reply: Omit<CollaborationComment, "id" | "timestamp" | "position">
    ) => {
      if (!currentUser) return;

      const newReply: CollaborationComment = {
        ...reply,
        id: `reply-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now(),
        position: { x: 0, y: 0 }, // Replies don't need positions
      };

      setComments((prev: any) =>
        prev.map((comment: any) =>
          comment.id === commentId
            ? { ...comment, replies: [...(comment.replies || []), newReply] }
            : comment
        )
      );
    },
    [currentUser]
  );

  const applyEdit = useCallback(
    (edit: Omit<CollaborationEdit, "id" | "timestamp">) => {
      if (!currentUser) return;

      const newEdit: CollaborationEdit = {
        ...edit,
        id: `edit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now(),
      };

      setEdits((prev: any) => [...prev.slice(-99), newEdit]);

      sendMessage({
        type: "edit_applied",
        edit: newEdit,
      });
    },
    [currentUser, sendMessage]
  );

  const toggleCursors = useCallback(
    () => setShowCursors((prev: any) => !prev),
    []
  );
  const toggleComments = useCallback(
    () => setShowComments((prev: any) => !prev),
    []
  );
  const toggleActivity = useCallback(
    () => setShowActivity((prev: any) => !prev),
    []
  );

  const handleSetCurrentUser = useCallback(
    (user: CollaborationUser) => {
      const userWithDefaults = {
        ...user,
        color: user.color || generateUserColor(),
        lastActive: Date.now(),
      };

      setCurrentUser(userWithDefaults);
      setUsers((prev: any) => {
        const existing = prev.find((u: any) => u.id === user.id);
        if (existing) {
          return prev.map((u: any) =>
            u.id === user.id ? userWithDefaults : u
          );
        }
        return [...prev, userWithDefaults];
      });

      addActivity({
        userId: user.id,
        type: "join",
        description: `${user.name} joined the session`,
      });
    },
    [addActivity]
  );

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
    toggleActivity,
  };

  return (
    <CollaborationContext.Provider data-glass-component value={value}>
      <div className={className} data-testid={dataTestId}>
        {children}
      </div>
    </CollaborationContext.Provider>
  );
};

// Export as GlassCollaborationProvider for backward compatibility
export const GlassCollaborationProvider = CollaborationProvider;
