'use client';
import { cn } from "../../lib/utilsComprehensive";
import {
  Mic as AudioIcon,
  Bold,
  Code,
  File,
  Image as ImageIcon,
  Italic,
  Link,
  Mic,
  Paperclip,
  Plus,
  Send,
  Smile,
  Square,
  Video,
  X,
} from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Motion } from "../../primitives";
import { GlassButton } from "../button";
import { CardContent, GlassCard } from "../card";

export interface ChatAttachment {
  id: string;
  file: File;
  type: "image" | "video" | "audio" | "file";
  preview?: string;
  size: number;
}

export interface GlassChatInputProps {
  /**
   * Placeholder text
   */
  placeholder?: string;
  /**
   * Enable file attachments
   */
  enableAttachments?: boolean;
  /**
   * Enable voice messages
   */
  enableVoice?: boolean;
  /**
   * Enable emoji picker
   */
  enableEmoji?: boolean;
  /**
   * Enable rich text formatting
   */
  enableFormatting?: boolean;
  /**
   * Enable mentions
   */
  enableMentions?: boolean;
  /**
   * Maximum character count
   */
  maxLength?: number;
  /**
   * Maximum file size in bytes
   */
  maxFileSize?: number;
  /**
   * Accepted file types
   */
  acceptedFileTypes?: string;
  /**
   * Show character count
   */
  showCharCount?: boolean;
  /**
   * Auto-resize textarea
   */
  autoResize?: boolean;
  /**
   * Disabled state
   */
  disabled?: boolean;
  /**
   * Loading state
   */
  loading?: boolean;
  /**
   * Send message handler
   */
  onSendMessage?: (content: string, attachments?: ChatAttachment[]) => void;
  /**
   * Typing handler
   */
  onTyping?: (isTyping: boolean) => void;
  /**
   * Attachment handler
   */
  onAttachmentAdd?: (attachment: ChatAttachment) => void;
  /**
   * Attachment remove handler
   */
  onAttachmentRemove?: (attachmentId: string) => void;
  /**
   * Voice recording handler
   */
  onVoiceRecording?: (blob: Blob) => void;
  /**
   * Custom className
   */
  className?: string;
}

/**
 * GlassChatInput component
 * A rich chat input with attachments, voice recording, and formatting
 */
export const GlassChatInput: React.FC<GlassChatInputProps> = ({
  placeholder = "Type a message...",
  enableAttachments = true,
  enableVoice = false,
  enableEmoji = true,
  enableFormatting = false,
  enableMentions = false,
  maxLength,
  maxFileSize = 10 * 1024 * 1024, // 10MB
  acceptedFileTypes = "image/*,video/*,audio/*,.pdf,.doc,.docx,.txt",
  showCharCount = false,
  autoResize = true,
  disabled = false,
  loading = false,
  onSendMessage,
  onTyping,
  onAttachmentAdd,
  onAttachmentRemove,
  onVoiceRecording,
  className,
  ...props
}) => {
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState<ChatAttachment[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showFormatting, setShowFormatting] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout>();
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  // Auto-resize textarea
  useEffect(() => {
    if (autoResize && textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [message, autoResize]);

  // Handle typing indicator
  useEffect(() => {
    if (!onTyping) return;

    if (message.length > 0 && !isTyping) {
      setIsTyping(true);
      onTyping(true);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      if (isTyping) {
        setIsTyping(false);
        onTyping(false);
      }
    }, 2000);

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [message, isTyping, onTyping]);

  // Handle input change
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      let value = e.target.value;

      if (maxLength && value.length > maxLength) {
        value = value.substring(0, maxLength);
      }

      setMessage(value);
    },
    [maxLength]
  );

  // Handle key press
  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, []);

  // Handle send message
  const handleSendMessage = useCallback(() => {
    if (!message.trim() && attachments.length === 0) return;
    if (disabled || loading) return;

    onSendMessage?.(message.trim(), attachments);

    // Reset state
    setMessage("");
    setAttachments([]);
    setIsTyping(false);
    onTyping?.(false);

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [message, attachments, disabled, loading, onSendMessage, onTyping]);

  // Handle file attachment
  const handleFileSelect = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);

      files.forEach((file: any) => {
        if (file.size > maxFileSize) {
          console.warn(`File ${file.name} is too large`);
          return;
        }

        const attachment: ChatAttachment = {
          id: `${Date.now()}-${Math.random()}`,
          file,
          type: file.type.startsWith("image/")
            ? "image"
            : file.type.startsWith("video/")
              ? "video"
              : file.type.startsWith("audio/")
                ? "audio"
                : "file",
          size: file.size,
        };

        // Create preview for images
        if (attachment.type === "image") {
          const reader = new FileReader();
          reader.onload = () => {
            attachment.preview = reader.result as string;
            setAttachments((prev: any) => [...prev, attachment]);
            onAttachmentAdd?.(attachment);
          };
          reader.readAsDataURL(file);
        } else {
          setAttachments((prev: any) => [...prev, attachment]);
          onAttachmentAdd?.(attachment);
        }
      });

      e.target.value = "";
    },
    [maxFileSize, onAttachmentAdd]
  );

  // Remove attachment
  const handleRemoveAttachment = useCallback(
    (attachmentId: string) => {
      setAttachments((prev: any) =>
        prev.filter((att: any) => att.id !== attachmentId)
      );
      onAttachmentRemove?.(attachmentId);
    },
    [onAttachmentRemove]
  );

  // Handle voice recording
  const handleVoiceToggle = useCallback(() => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false);
      setRecordingTime(0);

      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }

      // Here you would typically get the recorded blob and call onVoiceRecording
      // For now, we'll just simulate it
      const mockBlob = new Blob(["mock audio data"], { type: "audio/wav" });
      onVoiceRecording?.(mockBlob);
    } else {
      // Start recording
      setIsRecording(true);

      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime((prev: any) => prev + 1);
      }, 1000);
    }
  }, [isRecording, onVoiceRecording]);

  // Format recording time
  const formatRecordingTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }, []);

  // Handle emoji selection
  const handleEmojiSelect = useCallback((emoji: string) => {
    setMessage((prev: any) => prev + emoji);
    setShowEmojiPicker(false);
  }, []);

  // Handle formatting
  const handleFormatting = useCallback(
    (format: string) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = message.substring(start, end);

      let formattedText = "";
      switch (format) {
        case "bold":
          formattedText = `**${selectedText}**`;
          break;
        case "italic":
          formattedText = `*${selectedText}*`;
          break;
        case "code":
          formattedText = `\`${selectedText}\``;
          break;
        case "link":
          formattedText = `[${selectedText}](url)`;
          break;
        case "quote":
          formattedText = `> ${selectedText}`;
          break;
        case "list":
          formattedText = `- ${selectedText}`;
          break;
      }

      const newMessage =
        message.substring(0, start) + formattedText + message.substring(end);
      setMessage(newMessage);

      // Reset cursor position
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(
          start + formattedText.length,
          start + formattedText.length
        );
      }, 0);
    },
    [message]
  );

  // Get file type icon
  const getFileIcon = useCallback((type: string) => {
    if (type.startsWith("image/")) return <ImageIcon className='w-4 h-4' />;
    if (type.startsWith("video/")) return <Video className='w-4 h-4' />;
    if (type.startsWith("audio/")) return <AudioIcon className='w-4 h-4' />;
    return <File className='w-4 h-4' />;
  }, []);

  // Format file size
  const formatFileSize = useCallback((bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  }, []);

  return (
    <Motion data-glass-component preset="fadeIn" className="glass-w-full">
      <GlassCard className={cn("overflow-hidden", className)} {...props}>
        <CardContent className="glass-p-4">
          {/* Attachments preview */}
          {attachments.length > 0 && (
            <div
              className='mb-4 glass-gap-2'
              role="list"
              aria-label="Attached files"
            >
              {attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  role="listitem"
                  className="glass-flex glass-items-center glass-gap-3 glass-p-3 glass-surface-subtle/10 glass-radius-lg"
                >
                  {/* Preview */}
                  <div className="glass-flex-shrink-0">
                    {attachment.preview ? (
                      <img
                        src={attachment.preview}
                        alt={attachment.file.name}
                        className='w-10 h-10 glass-radius-md object-cover'
                      />
                    ) : (
                      <div className='w-10 h-10 glass-radius-md glass-surface-subtle/20 glass-flex glass-items-center glass-justify-center'>
                        {getFileIcon(attachment.file.type)}
                      </div>
                    )}
                  </div>

                  {/* File info */}
                  <div className="glass-flex-1 glass-min-w-0">
                    <p className='text-primary glass-text-sm truncate'>
                      {attachment.file.name}
                    </p>
                    <p className='text-primary/60 glass-text-xs'>
                      {formatFileSize(attachment.size)}
                    </p>
                  </div>

                  {/* Remove button */}
                  <GlassButton
                    variant="ghost"
                    size="sm"
                    onClick={(e) => handleRemoveAttachment(attachment.id)}
                    className="glass-p-1"
                  >
                    <X className='w-4 h-4' />
                  </GlassButton>
                </div>
              ))}
            </div>
          )}

          {/* Input area */}
          <div className="glass-flex glass-items-end glass-gap-3">
            {/* Attachment button */}
            {enableAttachments && (
              <GlassButton
                variant="ghost"
                size="sm"
                onClick={handleFileSelect}
                disabled={disabled || loading}
                aria-label="Attach file"
                className="glass-p-2 glass-flex-shrink-0"
              >
                <Paperclip className='w-4 h-4' aria-hidden="true" />
              </GlassButton>
            )}

            {/* Voice recording button */}
            {enableVoice && (
              <GlassButton
                variant={isRecording ? "destructive" : "ghost"}
                size="sm"
                onClick={handleVoiceToggle}
                disabled={disabled || loading}
                aria-label={
                  isRecording
                    ? `Stop recording (${formatRecordingTime(recordingTime)})`
                    : "Start voice recording"
                }
                aria-pressed={isRecording}
                className="glass-p-2 glass-flex-shrink-0"
              >
                {isRecording ? (
                  <>
                    <Square className='w-4 h-4 glass-mr-2' aria-hidden="true" />
                    <span className="glass-text-xs" aria-hidden="true">
                      {formatRecordingTime(recordingTime)}
                    </span>
                  </>
                ) : (
                  <Mic className='w-4 h-4' aria-hidden="true" />
                )}
              </GlassButton>
            )}

            {/* Formatting toolbar */}
            {enableFormatting && showFormatting && (
              <div className='glass-flex glass-gap-1 glass-p-2 glass-surface-subtle/10 glass-radius-lg mb-2'>
                <GlassButton
                  variant="ghost"
                  size="sm"
                  onClick={(e) => handleFormatting("bold")}
                  className="glass-p-1"
                >
                  <Bold className='w-3 h-3' />
                </GlassButton>
                <GlassButton
                  variant="ghost"
                  size="sm"
                  onClick={(e) => handleFormatting("italic")}
                  className="glass-p-1"
                >
                  <Italic className='w-3 h-3' />
                </GlassButton>
                <GlassButton
                  variant="ghost"
                  size="sm"
                  onClick={(e) => handleFormatting("code")}
                  className="glass-p-1"
                >
                  <Code className='w-3 h-3' />
                </GlassButton>
                <GlassButton
                  variant="ghost"
                  size="sm"
                  onClick={(e) => handleFormatting("link")}
                  className="glass-p-1"
                >
                  <Link className='w-3 h-3' />
                </GlassButton>
              </div>
            )}

            {/* Main input */}
            <div className='glass-flex-1 relative'>
              <textarea
                ref={textareaRef}
                id="chat-message-input"
                value={message}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder={isRecording ? "Recording..." : placeholder}
                disabled={disabled || loading || isRecording}
                aria-label="Chat message"
                aria-describedby={
                  showCharCount && maxLength ? "char-count" : undefined
                }
                aria-multiline="true"
                className={cn(
                  "w-full bg-glass-fill ring-1 ring-white/10 glass-radius-lg glass-px-4 glass-py-3 glass-text-primary placeholder-white/50",
                  "focus:outline-none focus:ring-white/30 resize-none min-h-[44px] max-h-[120px]",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
                rows={1}
              />

              {/* Character count */}
              {showCharCount && maxLength && (
                <div
                  id="char-count"
                  className='absolute bottom-2 right-3 glass-text-xs text-primary/50'
                  aria-live="polite"
                >
                  {message.length}/{maxLength}
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="glass-flex glass-gap-1 glass-flex-shrink-0">
              {/* Emoji button */}
              {enableEmoji && (
                <GlassButton
                  variant="ghost"
                  size="sm"
                  onClick={(e) => setShowEmojiPicker(!showEmojiPicker)}
                  disabled={disabled || loading}
                  className="glass-p-2"
                >
                  <Smile className='w-4 h-4' />
                </GlassButton>
              )}

              {/* Formatting toggle */}
              {enableFormatting && (
                <GlassButton
                  variant={showFormatting ? "primary" : "ghost"}
                  size="sm"
                  onClick={(e) => setShowFormatting(!showFormatting)}
                  disabled={disabled || loading}
                  className="glass-p-2"
                >
                  <Plus className='w-4 h-4' />
                </GlassButton>
              )}

              {/* Send button */}
              <GlassButton
                variant="primary"
                size="sm"
                onClick={handleSendMessage}
                disabled={
                  (!message.trim() && attachments.length === 0) ||
                  disabled ||
                  loading ||
                  isRecording
                }
                className="glass-p-2"
              >
                {loading ? (
                  <div className='w-4 h-4 glass-border-2 glass-border-white/20 glass-border-t-white glass-radius-full animate-spin' />
                ) : (
                  <Send className='w-4 h-4' />
                )}
              </GlassButton>
            </div>
          </div>

          {/* Emoji picker */}
          {showEmojiPicker && (
            <div className='mt-3 glass-p-3 glass-surface-subtle/10 glass-radius-lg'>
              <div className="glass-grid glass-grid-cols-8 glass-gap-2">
                {[
                  "😀",
                  "😂",
                  "😊",
                  "😍",
                  "🤔",
                  "😎",
                  "👍",
                  "👎",
                  "❤️",
                  "🔥",
                  "⭐",
                  "🎉",
                  "🙌",
                  "✨",
                  "💯",
                  "🚀",
                ].map((emoji) => (
                  <button
                    key={emoji}
                    onClick={(e) => handleEmojiSelect(emoji)}
                    className='w-8 h-8 hover:glass-surface-subtle/20 glass-radius-md transition-colors glass-text-lg'
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileChange}
            className='hidden glass-touch-target glass-contrast-guard'
            accept={acceptedFileTypes}
          />
        </CardContent>
      </GlassCard>
    </Motion>
  );
};

export default GlassChatInput;