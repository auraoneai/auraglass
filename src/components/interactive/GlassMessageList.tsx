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

  return (
    <Motion
      data-glass-component
      preset="fadeIn"
      className="glass-w-full glass-h-full"
    >
      <GlassCard
        className={cn("flex flex-col h-full overflow-hidden", className)}
        data-testid={dataTestId}
        role="log"
        aria-label="Message list"
        {...props}
      >
        {/* Search header */}
        {enableSearch && showSearch && (
          <div className="glass-p-4 glass-border-b glass-border-white/10">
            <input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='glass-w-full bg-glass-fill ring-1 ring-white/10 glass-radius-lg glass-px-4 glass-py-2 text-primary placeholder-white/50 focus:outline-none focus:ring-white/30 glass-focus glass-touch-target glass-contrast-guard'
            />
          </div>
        )}

        {/* Messages */}
        <CardContent
          className='glass-flex-1 overflow-y-auto glass-p-4'
          spacing="lg"
        >
          {Object.entries(groupedMessages).map(([date, dateMessages]) => (
            <div key={date}>
              {/* Date separator */}
              <div className="glass-flex glass-items-center glass-justify-center glass-my-6">
                <div className="glass-px-3 glass-py-1 glass-surface-subtle/10 glass-radius-full">
                  <span className='text-primary/60 glass-text-xs'>
                    {new Date(date).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Messages for this date */}
              <div className="glass-auto-gap glass-auto-gap-md">
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
                          "flex glass-gap-3 glass-p-3 glass-radius-lg transition-all duration-200",
                          isSelected ? "bg-primary/20" : "hover:bg-white/5"
                        )}
                      >
                        {/* Avatar */}
                        {showAvatars && (
                          <div className="glass-flex-shrink-0">
                            <div className='w-10 h-10 glass-radius-full glass-surface-subtle/20 glass-flex glass-items-center glass-justify-center'>
                              {message.sender.avatar ? (
                                <img
                                  src={message.sender.avatar}
                                  alt={message.sender.name}
                                  className='glass-w-full glass-h-full glass-radius-full object-cover'
                                />
                              ) : (
                                <span className='text-primary/80 glass-text-sm font-medium'>
                                  {message.sender.name.charAt(0).toUpperCase()}
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Message content */}
                        <div className="glass-flex-1 glass-min-w-0">
                          {/* Header */}
                          <div className='glass-flex glass-items-center glass-gap-2 mb-1'>
                            <span className='text-primary font-medium glass-text-sm'>
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

                            {showTimestamps && (
                              <span className='text-primary/60 glass-text-xs glass-flex glass-items-center glass-gap-1'>
                                <Clock className='w-3 h-3' />
                                {formatTimestamp(message.timestamp)}
                              </span>
                            )}

                            {message.edited && (
                              <span className='text-primary/50 glass-text-xs'>
                                (edited)
                              </span>
                            )}
                          </div>

                          {/* Message text */}
                          <div className='text-primary/90 glass-text-sm leading-relaxed'>
                            {message.content}
                          </div>

                          {/* Attachments */}
                          {message.attachments &&
                            message.attachments.length > 0 && (
                              <div className='mt-3 glass-auto-gap glass-auto-gap-sm'>
                                {message.attachments.map(
                                  (attachment, attIndex) => (
                                    <div
                                      key={attIndex}
                                      className='glass-flex glass-items-center glass-gap-3 glass-p-3 glass-surface-dark/20 glass-radius-lg hover:glass-surface-dark/30 transition-colors cursor-pointer glass-border glass-border-white/10 hover:border-white/20 glass-focus glass-touch-target glass-contrast-guard'
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
                                          <ImageIcon className='w-5 h-5 text-primary' />
                                        )}
                                        {attachment.type === "video" && (
                                          <Video className='w-5 h-5 text-primary' />
                                        )}
                                        {attachment.type === "file" && (
                                          <File className='w-5 h-5 text-primary' />
                                        )}
                                      </div>

                                      <div className="glass-flex-1 glass-min-w-0">
                                        <p className='text-primary/90 glass-text-sm truncate'>
                                          {attachment.name}
                                        </p>
                                        {attachment.size && (
                                          <p className='text-primary/60 glass-text-xs'>
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
                                        <Download className='w-4 h-4' />
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
                                      className='h-6 glass-px-2 glass-text-xs glass-surface-subtle/10 glass-focus glass-touch-target'
                                    >
                                      {reaction.emoji} {reaction.count}
                                    </GlassButton>
                                  )
                                )}
                              </div>
                            )}
                        </div>

                        {/* Message actions */}
                        <div className='glass-flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity'>
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
                                <Heart className='w-3 h-3' />
                              </GlassButton>
                            )}

                            {enableReplies && (
                              <GlassButton
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleReply(message.id);
                                }}
                                className="glass-p-1 glass-focus glass-touch-target"
                              >
                                <Reply className='w-3 h-3' />
                              </GlassButton>
                            )}

                            <GlassButton
                              variant="ghost"
                              size="sm"
                              onClick={(e) => e.stopPropagation()}
                              className="glass-p-1 glass-focus glass-touch-target"
                            >
                              <MoreHorizontal className='w-3 h-3' />
                            </GlassButton>
                          </div>
                        </div>

                        {/* Message status */}
                        {showMessageStatus && isCurrentUser && (
                          <div className="glass-flex-shrink-0 glass-ml-2">
                            {message.type === "system" ? (
                              <AlertCircle className='w-4 h-4 text-primary' />
                            ) : (
                              <div className="glass-flex">
                                <Check className='w-3 h-3 text-primary/60' />
                                <CheckCheck className='w-3 h-3 text-primary -glass-ml-1' />
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
          <div className="glass-p-4 glass-border-t glass-border-white/10">
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
