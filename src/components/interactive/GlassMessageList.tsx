"use client";
import { cn } from "../../lib/utilsComprehensive";
import {
  AlertCircle,
  Check,
  CheckCheck,
  Clock,
  Download,
  File,
  Heart,
  Image as ImageIcon,
  MoreHorizontal,
  Reply,
  Video,
} from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Motion } from "../../primitives";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { GlassButton } from "../button";
import { CardContent, GlassCard } from "../card";
import { ChatMessage } from "./GlassChat";

export interface GlassMessageListProps {
  /**
   * Messages to display
   */
  messages?: ChatMessage[];
  /**
   * Current user ID
   */
  currentUserId?: string;
  /**
   * Enable message reactions
   */
  enableReactions?: boolean;
  /**
   * Enable message replies
   */
  enableReplies?: boolean;
  /**
   * Show message status
   */
  showMessageStatus?: boolean;
  /**
   * Show timestamps
   */
  showTimestamps?: boolean;
  /**
   * Show user avatars
   */
  showAvatars?: boolean;
  /**
   * Enable message search
   */
  enableSearch?: boolean;
  /**
   * Virtual scrolling
   */
  virtualScroll?: boolean;
  /**
   * Message click handler
   */
  onMessageClick?: (message: ChatMessage) => void;
  /**
   * Message reaction handler
   */
  onMessageReaction?: (messageId: string, emoji: string) => void;
  /**
   * Message reply handler
   */
  onMessageReply?: (messageId: string) => void;
  /**
   * Attachment download handler
   */
  onAttachmentDownload?: (attachment: { url: string; name: string }) => void;
  /**
   * Custom className
   */
  className?: string;
  /** Compact density for constrained cards, drawers, and documentation previews. */
  compact?: boolean;
  /** Keep the message list inside a bounded local surface. */
  contained?: boolean;
  /** Alias for compact preview rendering. */
  preview?: boolean;
  /** Maximum rendered height when contained or compact. */
  maxHeight?: number | string;
  /** Maximum rendered width when contained or compact. */
  maxWidth?: number | string;
  /** Optional density override for embedded surfaces. */
  density?: "compact" | "comfortable" | "spacious";
  /**
   * Custom data-testid for testing
   */
  "data-testid"?: string;
}

/**
 * GlassMessageList component
 * A scrollable list of chat messages with reactions, replies, and attachments
 */
export const GlassMessageList: React.FC<GlassMessageListProps> = ({
  messages = [],
  currentUserId,
  enableReactions = true,
  enableReplies = true,
  showMessageStatus = true,
  showTimestamps = true,
  showAvatars = true,
  enableSearch = false,
  virtualScroll = false,
  onMessageClick,
  onMessageReaction,
  onMessageReply,
  onAttachmentDownload,
  className,
  compact = false,
  contained = false,
  preview = false,
  maxHeight,
  maxWidth,
  density = "comfortable",
  "data-testid": dataTestId,
  ...props
}) => {
  const prefersReducedMotion = useReducedMotion();
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (
      messagesEndRef.current &&
      typeof messagesEndRef.current.scrollIntoView === "function"
    ) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Handle message click
  const handleMessageClick = useCallback(
    (message: ChatMessage) => {
      setSelectedMessage(selectedMessage === message.id ? null : message.id);
      onMessageClick?.(message);
    },
    [selectedMessage, onMessageClick]
  );

  // Handle reaction
  const handleReaction = useCallback(
    (messageId: string, emoji: string) => {
      onMessageReaction?.(messageId, emoji);
    },
    [onMessageReaction]
  );

  // Handle reply
  const handleReply = useCallback(
    (messageId: string) => {
      onMessageReply?.(messageId);
    },
    [onMessageReply]
  );

  // Handle attachment download
  const handleAttachmentDownload = useCallback(
    (attachment: { url: string; name: string }) => {
      onAttachmentDownload?.(attachment);
    },
    [onAttachmentDownload]
  );

  // Format timestamp
  const formatTimestamp = useCallback((date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);

    if (minutes < 1) return "now";
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }, []);

  // Filter messages based on search
  const filteredMessages = searchQuery
    ? messages.filter(
        (message: any) =>
          message.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          message.sender.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : messages;

  // Group messages by date
  const groupedMessages = filteredMessages.reduce(
    (groups, message) => {
      const date = message.timestamp.toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
      return groups;
    },
    {} as Record<string, ChatMessage[]>
  );
  const isCompact = compact || preview || density === "compact";
  const bounded = contained || isCompact;
  const resolvedMaxHeight =
    typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight;
  const resolvedMaxWidth =
    typeof maxWidth === "number" ? `${maxWidth}px` : maxWidth;
  const effectiveShowAvatars = isCompact ? false : showAvatars;
  const effectiveShowStatus = isCompact ? false : showMessageStatus;
  const effectiveEnableReplies = isCompact ? false : enableReplies;

  return (
    <Motion
      data-glass-component
      preset="fadeIn"
      className="glass-w-full glass-h-full"
    >
      <GlassCard
        className={cn(
          "flex flex-col h-full overflow-hidden",
          bounded && "glass-w-full",
          isCompact && "glass-text-sm",
          className
        )}
        style={{
          maxHeight: resolvedMaxHeight ?? (bounded ? "220px" : undefined),
          maxWidth: resolvedMaxWidth ?? (bounded ? "320px" : undefined),
        }}
        data-testid={dataTestId}
        role="log"
        aria-label="Message list"
        {...props}
      >
        {/* Search header */}
        {enableSearch && showSearch && (
          <div
            className={cn(
              isCompact ? "glass-p-2" : "glass-p-4",
              "glass-border-b glass-border-white/10"
            )}
          >
            <input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="glass-w-full glass-bg-fill glass-ring-1 glass-ring-white-opacity-10 glass-radius-lg glass-px-4 glass-py-2 glass-text-primary glass-placeholder-white-opacity-50 glass-focus-outline-none glass-focus-ring-white-opacity-30 glass-focus glass-touch-target glass-contrast-guard"
            />
          </div>
        )}

        {/* Messages */}
        <CardContent
          className={cn(
            "glass-flex-1 glass-overflow-y-auto",
            isCompact ? "glass-p-2" : "glass-p-4"
          )}
          spacing={isCompact ? "sm" : "lg"}
        >
          {Object.entries(groupedMessages).map(([date, dateMessages]) => (
            <div key={date}>
              {/* Date separator */}
              <div
                className={cn(
                  "glass-flex glass-items-center glass-justify-center",
                  isCompact ? "glass-my-2" : "glass-my-6"
                )}
              >
                <div className="glass-px-3 glass-py-1 glass-surface-subtle/10 glass-radius-full">
                  <span className="glass-text-primary-glass-opacity-60 glass-text-xs">
                    {new Date(date).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Messages for this date */}
              <div
                className={cn(
                  "glass-auto-gap",
                  isCompact ? "glass-auto-gap-sm" : "glass-auto-gap-md"
                )}
              >
                {dateMessages.map((message, index) => {
                  const isCurrentUser = message.sender.id === currentUserId;
                  const isSelected = selectedMessage === message.id;

                  return (
                    <div
                      key={message.id}
                      className={cn(
                        "group relative cursor-pointer glass-focus glass-touch-target",
                        !prefersReducedMotion &&
                          "transition-all duration-200 animate-slide-in-up",
                        isSelected && "ring-2 ring-primary glass-radius-lg"
                      )}
                      style={{
                        animationDelay: `${Math.min(index, 20) * 20}ms`,
                        animationFillMode: "both",
                      }}
                      onClick={() => handleMessageClick(message)}
                    >
                      <div
                        className={cn(
                          "flex glass-radius-lg transition-all duration-200",
                          isCompact
                            ? "glass-gap-2 glass-p-2"
                            : "glass-gap-3 glass-p-3",
                          isSelected ? "bg-primary/20" : "hover:bg-white/5"
                        )}
                      >
                        {/* Avatar */}
                        {effectiveShowAvatars && (
                          <div className="glass-flex-shrink-0">
                            <div className="glass-w-10 glass-h-10 glass-radius-full glass-surface-subtle/20 glass-flex glass-items-center glass-justify-center">
                              {message.sender.avatar ? (
                                <img
                                  src={message.sender.avatar}
                                  alt={message.sender.name}
                                  className="glass-w-full glass-h-full glass-radius-full glass-object-cover"
                                />
                              ) : (
                                <span className="glass-text-primary-glass-opacity-80 glass-text-sm glass-font-medium">
                                  {message.sender.name.charAt(0).toUpperCase()}
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Message content */}
                        <div className="glass-flex-1 glass-min-w-0">
                          {/* Header */}
                          <div
                            className={cn(
                              "glass-flex glass-items-center glass-gap-2",
                              isCompact ? "glass-mb-0" : "glass-mb-1"
                            )}
                          >
                            <span className="glass-text-primary glass-font-medium glass-text-sm">
                              {message.sender.name}
                            </span>

                            {message.sender.status && (
                              <div
                                className={cn(
                                  "w-2 h-2 glass-radius-full",
                                  message.sender.status === "online"
                                    ? "bg-green-400"
                                    : message.sender.status === "away"
                                      ? "bg-yellow-400"
                                      : message.sender.status === "busy"
                                        ? "bg-red-400"
                                        : "bg-gray-400"
                                )}
                              />
                            )}

                            {showTimestamps && !isCompact && (
                              <span className="glass-text-primary-glass-opacity-60 glass-text-xs glass-flex glass-items-center glass-gap-1">
                                <Clock className="glass-w-3 glass-h-3" />
                                {formatTimestamp(message.timestamp)}
                              </span>
                            )}

                            {message.edited && (
                              <span className="glass-text-primary-glass-opacity-50 glass-text-xs">
                                (edited)
                              </span>
                            )}
                          </div>

                          {/* Message text */}
                          <div
                            className={cn(
                              "glass-text-primary-glass-opacity-90 glass-leading-relaxed",
                              isCompact
                                ? "glass-text-xs glass-line-clamp-2"
                                : "glass-text-sm"
                            )}
                          >
                            {message.content}
                          </div>

                          {/* Attachments */}
                          {message.attachments &&
                            message.attachments.length > 0 &&
                            !isCompact && (
                              <div className="glass-mt-3 glass-auto-gap glass-auto-gap-sm">
                                {message.attachments.map(
                                  (attachment, attIndex) => (
                                    <div
                                      key={attIndex}
                                      className="glass-flex glass-items-center glass-gap-3 glass-p-3 glass-surface-dark/20 glass-radius-lg hover:glass-surface-dark/30 glass-transition-colors glass-cursor-pointer glass-border glass-border-white/10 hover:glass-border-white/20 glass-focus glass-touch-target glass-contrast-guard"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleAttachmentDownload({
                                          url: attachment.url,
                                          name: attachment.name,
                                        });
                                      }}
                                    >
                                      <div className="glass-flex-shrink-0">
                                        {attachment.type === "image" && (
                                          <ImageIcon className="glass-w-5 glass-h-5 glass-text-primary" />
                                        )}
                                        {attachment.type === "video" && (
                                          <Video className="glass-w-5 glass-h-5 glass-text-primary" />
                                        )}
                                        {attachment.type === "file" && (
                                          <File className="glass-w-5 glass-h-5 glass-text-primary" />
                                        )}
                                      </div>

                                      <div className="glass-flex-1 glass-min-w-0">
                                        <p className="glass-text-primary-glass-opacity-90 glass-text-sm glass-truncate">
                                          {attachment.name}
                                        </p>
                                        {attachment.size && (
                                          <p className="glass-text-primary-glass-opacity-60 glass-text-xs">
                                            {(
                                              attachment.size /
                                              1024 /
                                              1024
                                            ).toFixed(1)}{" "}
                                            MB
                                          </p>
                                        )}
                                      </div>

                                      <GlassButton
                                        variant="ghost"
                                        size="sm"
                                        className="glass-p-1"
                                      >
                                        <Download className="glass-w-4 glass-h-4" />
                                      </GlassButton>
                                    </div>
                                  )
                                )}
                              </div>
                            )}

                          {/* Reactions */}
                          {message.reactions &&
                            message.reactions.length > 0 && (
                              <div className="glass-flex glass-gap-1 glass-mt-2">
                                {message.reactions.map(
                                  (reaction, reactionIndex) => (
                                    <GlassButton
                                      key={reactionIndex}
                                      variant="ghost"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleReaction(
                                          message.id,
                                          reaction.emoji
                                        );
                                      }}
                                      className="glass-h-6 glass-px-2 glass-text-xs glass-surface-subtle/10 glass-focus glass-touch-target"
                                    >
                                      {reaction.emoji} {reaction.count}
                                    </GlassButton>
                                  )
                                )}
                              </div>
                            )}
                        </div>

                        {/* Message actions */}
                        {!isCompact && (
                          <div className="glass-absolute glass-right-2 glass-top-2 glass-z-10 glass-opacity-0 glass-group-glass-hover-opacity-100 glass-transition-opacity">
                            <div className="glass-flex glass-flex-col glass-gap-1">
                              {enableReactions && (
                                <GlassButton
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleReaction(message.id, "👍");
                                  }}
                                  className="glass-p-1 glass-focus glass-touch-target"
                                >
                                  <Heart className="glass-w-3 glass-h-3" />
                                </GlassButton>
                              )}

                              {effectiveEnableReplies && (
                                <GlassButton
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleReply(message.id);
                                  }}
                                  className="glass-p-1 glass-focus glass-touch-target"
                                >
                                  <Reply className="glass-w-3 glass-h-3" />
                                </GlassButton>
                              )}

                              <GlassButton
                                variant="ghost"
                                size="sm"
                                onClick={(e) => e.stopPropagation()}
                                className="glass-p-1 glass-focus glass-touch-target"
                              >
                                <MoreHorizontal className="glass-w-3 glass-h-3" />
                              </GlassButton>
                            </div>
                          </div>
                        )}

                        {/* Message status */}
                        {effectiveShowStatus && isCurrentUser && (
                          <div className="glass-flex-shrink-0 glass-ml-2">
                            {message.type === "system" ? (
                              <AlertCircle className="glass-w-4 glass-h-4 glass-text-primary" />
                            ) : (
                              <div className="glass-flex">
                                <Check className="glass-w-3 glass-h-3 glass-text-primary-glass-opacity-60" />
                                <CheckCheck className="glass-w-3 glass-h-3 glass-text-primary glass--ml-1" />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          <div ref={messagesEndRef} />
        </CardContent>

        {/* Search toggle */}
        {enableSearch && (
          <div
            className={cn(
              isCompact ? "glass-p-2" : "glass-p-4",
              "glass-border-t glass-border-white/10"
            )}
          >
            <GlassButton
              variant="ghost"
              size="sm"
              onClick={() => setShowSearch(!showSearch)}
              className="glass-w-full glass-focus glass-touch-target"
            >
              {showSearch ? "Hide Search" : "Search Messages"}
            </GlassButton>
          </div>
        )}
      </GlassCard>
    </Motion>
  );
};

export default GlassMessageList;
