"use client";
import { GlassInput } from "../input/GlassInput";

import { cn } from "../../lib/utilsComprehensive";
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { OptimizedGlass } from "../../primitives";
import { Motion } from "../../primitives";
import { GlassButton, IconButton } from "../button/GlassButton";
import { GlassBadge } from "../data-display/GlassBadge";
import { GlassProgress } from "../data-display/GlassProgress";
import { ANIMATION } from "../../tokens/designConstants";
import { ContrastGuard } from "../accessibility/ContrastGuard";
import { useReducedMotion } from "../../hooks/useReducedMotion";

export interface UploadedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  url?: string;
  preview?: string;
  status: "pending" | "uploading" | "completed" | "error";
  progress?: number;
  error?: string;
}

export interface GlassFileUploadProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onChange"
> {
  /**
   * File input accept attribute
   */
  accept?: string;
  /**
   * Allow multiple files
   */
  multiple?: boolean;
  /**
   * Maximum file size in bytes
   */
  maxSize?: number;
  /**
   * Maximum number of files
   */
  maxFiles?: number;
  /**
   * Upload variant
   */
  variant?: "default" | "compact" | "minimal" | "grid";
  /**
   * Upload size
   */
  size?: "sm" | "md" | "lg";
  /**
   * Disabled state
   */
  disabled?: boolean;
  /**
   * Files array
   */
  files?: UploadedFile[];
  /**
   * Initial files for uncontrolled demos, previews, and preloaded upload flows.
   */
  defaultFiles?: UploadedFile[];
  /**
   * Compact rendering for embedded cards and dense app surfaces.
   */
  compact?: boolean;
  /**
   * Contain the uploader inside its parent instead of assuming a full-width page section.
   */
  contained?: boolean;
  /**
   * Explicit uploader width for constrained layouts.
   */
  width?: React.CSSProperties["width"];
  /**
   * Explicit uploader height for constrained layouts.
   */
  height?: React.CSSProperties["height"];
  /**
   * Maximum uploader height before file lists scroll.
   */
  maxHeight?: React.CSSProperties["maxHeight"];
  /**
   * Show per-file and batch upload/remove actions.
   */
  showActions?: boolean;
  /**
   * Show the dropzone. Disable this for review-only uploaded file lists.
   */
  showDropzone?: boolean;
  /**
   * File change handler
   */
  onChange?: (files: UploadedFile[]) => void;
  /**
   * Upload function
   */
  onUpload?: (file: File) => Promise<{ url: string } | void>;
  /**
   * File remove handler
   */
  onRemove?: (fileId: string) => void;
  /**
   * File preview handler
   */
  onPreview?: (file: UploadedFile) => void;
  /**
   * Show file previews
   */
  showPreviews?: boolean;
  /**
   * Show upload progress
   */
  showProgress?: boolean;
  /**
   * Upload instruction text
   */
  instruction?: string;
  /**
   * Helper text
   */
  helperText?: string;
  /**
   * Error text
   */
  error?: string;
  /**
   * Auto upload on file selection
   */
  autoUpload?: boolean;
  /**
   * Custom file renderer
   */
  renderFile?: (file: UploadedFile, index: number) => React.ReactNode;
  /**
   * Custom dropzone content
   */
  children?: React.ReactNode;
}

const EMPTY_UPLOADED_FILES: UploadedFile[] = [];

/**
 * GlassFileUpload component
 * File upload with drag-and-drop functionality and glassmorphism styling
 */
export const GlassFileUpload = forwardRef<HTMLDivElement, GlassFileUploadProps>(
  (
    {
      accept,
      multiple = false,
      maxSize = 10 * 1024 * 1024, // 10MB
      maxFiles = 10,
      variant = "compact",
      size = "sm",
      disabled = false,
      files,
      defaultFiles = EMPTY_UPLOADED_FILES,
      compact = false,
      contained = false,
      width,
      height,
      maxHeight,
      showActions = true,
      showDropzone = true,
      onChange,
      onUpload,
      onRemove,
      onPreview,
      showPreviews = true,
      showProgress = true,
      instruction = "Drop files or click to select",
      helperText,
      error,
      autoUpload = false,
      renderFile,
      children,
      className,
      style,
      ...props
    },
    ref
  ) => {
    const isControlled = files !== undefined;
    const [internalFiles, setInternalFiles] =
      useState<UploadedFile[]>(defaultFiles);
    const [isDragOver, setIsDragOver] = useState(false);
    const [isDragActive, setIsDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const dropZoneRef = useRef<HTMLDivElement>(null);
    const visibleFiles = files ?? internalFiles;
    const isCompact = compact || variant === "minimal";

    const sizeClasses = {
      sm: "glass-p-4 glass-text-sm",
      md: "glass-p-5 glass-text-base",
      lg: "glass-p-6 glass-text-lg",
    };

    const variantClasses = {
      default: "glass-min-h-32",
      compact: "glass-min-h-20",
      minimal: "glass-min-h-16",
      grid: "glass-min-h-32",
    };

    // Sync internal files with props
    useEffect(() => {
      if (isControlled) {
        setInternalFiles(files ?? EMPTY_UPLOADED_FILES);
      }
    }, [files, isControlled]);

    const commitFiles = useCallback(
      (nextFiles: UploadedFile[]) => {
        if (!isControlled) {
          setInternalFiles(nextFiles);
        }
        onChange?.(nextFiles);
      },
      [isControlled, onChange]
    );

    // Format file size
    const formatFileSize = (bytes: number): string => {
      if (bytes === 0) return "0 Bytes";
      const k = 1024;
      const sizes = ["Bytes", "KB", "MB", "GB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    // Validate file
    const validateFile = (file: File): string | null => {
      if (maxSize && file.size > maxSize) {
        return `File size must be less than ${formatFileSize(maxSize)}`;
      }

      if (accept) {
        const acceptedTypes = accept.split(",").map((type: any) => type.trim());
        const isAccepted = acceptedTypes.some((type) => {
          if (type.startsWith(".")) {
            return file.name.toLowerCase().endsWith(type.toLowerCase());
          }
          return file.type.match(type.replace("*", ".*"));
        });

        if (!isAccepted) {
          return `File type not accepted. Accepted types: ${accept}`;
        }
      }

      return null;
    };

    // Create file object
    const createFileObject = (file: File): UploadedFile => {
      const id = Math.random().toString(36).substr(2, 9);
      const validationError = validateFile(file);

      return {
        id,
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        status: validationError ? "error" : "pending",
        error: validationError || undefined,
        progress: 0,
      };
    };

    // Handle file selection
    const handleFiles = useCallback(
      async (fileList: FileList) => {
        if (disabled) return;

        const newFiles = Array.from(fileList).map(createFileObject);

        // Check max files limit
        if (maxFiles && visibleFiles.length + newFiles.length > maxFiles) {
          return;
        }

        const updatedFiles = multiple
          ? [...visibleFiles, ...newFiles]
          : newFiles;
        commitFiles(updatedFiles);

        // Auto upload valid files
        if (autoUpload && onUpload) {
          for (const fileObj of newFiles) {
            if (fileObj.status === "pending") {
              await handleUpload(fileObj.id);
            }
          }
        }
      },
      [
        disabled,
        maxFiles,
        visibleFiles,
        multiple,
        commitFiles,
        autoUpload,
        onUpload,
      ]
    );

    // Handle file upload
    const handleUpload = async (fileId: string) => {
      if (!onUpload) return;

      const fileIndex = visibleFiles.findIndex((f) => f.id === fileId);
      if (fileIndex === -1) return;

      const fileObj = visibleFiles[fileIndex];

      // Update status to uploading
      const updatedFiles = [...visibleFiles];
      updatedFiles[fileIndex] = {
        ...fileObj,
        status: "uploading",
        progress: 0,
      };
      commitFiles(updatedFiles);

      try {
        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setInternalFiles((current) => {
            const newFiles = [...(isControlled ? visibleFiles : current)];
            const currentFile = newFiles.find((f) => f.id === fileId);
            if (currentFile && currentFile.status === "uploading") {
              currentFile.progress = Math.min(
                (currentFile.progress || 0) + 10,
                90
              );
            }
            return newFiles;
          });
        }, ANIMATION.DURATION.fast);

        const result = await onUpload(fileObj.file);

        clearInterval(progressInterval);

        // Update file with result
        const finalFiles = [...visibleFiles];
        const finalIndex = finalFiles.findIndex((f) => f.id === fileId);
        if (finalIndex !== -1) {
          finalFiles[finalIndex] = {
            ...finalFiles[finalIndex],
            status: "completed",
            progress: 100,
            url: result?.url,
          };
          commitFiles(finalFiles);
        }
      } catch (error) {
        // Update file with error
        const errorFiles = [...visibleFiles];
        const errorIndex = errorFiles.findIndex((f) => f.id === fileId);
        if (errorIndex !== -1) {
          errorFiles[errorIndex] = {
            ...errorFiles[errorIndex],
            status: "error",
            error: error instanceof Error ? error.message : "Upload failed",
          };
          commitFiles(errorFiles);
        }
      }
    };

    // Handle file removal
    const handleRemove = (fileId: string) => {
      const updatedFiles = visibleFiles.filter((f: any) => f.id !== fileId);
      commitFiles(updatedFiles);
      onRemove?.(fileId);
    };

    // Drag and drop handlers
    const handleDragEnter = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragActive(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragActive(false);
      setIsDragOver(false);
    };

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(true);
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragActive(false);
      setIsDragOver(false);

      const { files: droppedFiles } = e.dataTransfer;
      if (droppedFiles && droppedFiles.length > 0) {
        handleFiles(droppedFiles);
      }
    };

    // Click to select files
    const handleClick = () => {
      if (!disabled) {
        fileInputRef.current?.click();
      }
    };

    // File input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { files } = e.target;
      if (files && files.length > 0) {
        handleFiles(files);
      }
      // Reset input value to allow selecting the same file again
      e.target.value = "";
    };

    // Get file icon
    const getFileIcon = (type: string) => {
      if (type.startsWith("image/")) {
        return (
          <svg
            data-glass-component
            className="glass-w-5 glass-h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        );
      }

      if (type.includes("pdf")) {
        return (
          <svg
            className="glass-w-5 glass-h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
        );
      }

      return (
        <svg
          className="glass-w-5 glass-h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      );
    };

    // Render file item
    const renderFileItem = (file: UploadedFile, index: number) => {
      if (renderFile) {
        return renderFile(file, index);
      }

      return (
        <Motion key={file.id} preset="slideDown">
          <OptimizedGlass
            intent="neutral"
            elevation="level1"
            intensity="medium"
            depth={2}
            tint="neutral"
            border="subtle"
            animation="none"
            performanceMode="medium"
            className={cn(
              "glass-p-3 border border-border/20",
              isCompact && "glass-p-2",
              file.status === "error" &&
                "border-destructive/50 bg-destructive/5"
            )}
          >
            <div className="glass-flex glass-items-center glass-gap-3">
              {/* File icon/preview */}
              <div className="glass-flex-shrink-0">
                {showPreviews &&
                !isCompact &&
                file.type.startsWith("image/") &&
                file.preview ? (
                  <img
                    src={file.preview}
                    alt={file.name}
                    className="glass-w-10 glass-h-10 glass-object-cover glass-radius-md"
                  />
                ) : (
                  <div className="glass-w-10 glass-h-10 glass-radius-md glass-surface-subtle glass-flex glass-items-center glass-justify-center">
                    {getFileIcon(file.type)}
                  </div>
                )}
              </div>

              {/* File info */}
              <div className="glass-flex-1 glass-min-glass-w-0">
                <p className="glass-text-sm glass-font-medium glass-text-primary glass-truncate">
                  {file.name}
                </p>
                <div className="glass-flex glass-items-center glass-gap-2 glass-mt-1">
                  <span className="glass-text-xs glass-text-secondary">
                    {formatFileSize(file.size)}
                  </span>
                  <GlassBadge
                    variant={
                      file.status === "completed"
                        ? "success"
                        : file.status === "error"
                          ? "error"
                          : file.status === "uploading"
                            ? "primary"
                            : "outline"
                    }
                    size="xs"
                  >
                    {file.status}
                  </GlassBadge>
                </div>

                {/* Progress bar */}
                {file.status === "uploading" && showProgress && (
                  <GlassProgress
                    value={file.progress}
                    size="xs"
                    className="glass-mt-2"
                  />
                )}

                {/* Error message */}
                {file.error && (
                  <p className="glass-text-xs glass-text-danger glass-mt-1">
                    {file.error}
                  </p>
                )}
              </div>

              {/* Actions */}
              {showActions && (
              <div className="glass-flex glass-items-center glass-gap-1">
                {file.status === "pending" && onUpload && (
                  <IconButton
                    icon="↑"
                    variant="ghost"
                    size="sm"
                    onClick={(e) => handleUpload(file.id)}
                    aria-label="Upload file"
                  />
                )}

                {file.status === "completed" && onPreview && (
                  <IconButton
                    icon="👁"
                    variant="ghost"
                    size="sm"
                    onClick={(e) => onPreview(file)}
                    aria-label="Preview file"
                  />
                )}

                <IconButton
                  icon="×"
                  variant="ghost"
                  size="sm"
                  onClick={(e) => handleRemove(file.id)}
                  aria-label="Remove file"
                />
              </div>
              )}
            </div>
          </OptimizedGlass>
        </Motion>
      );
    };

    return (
      <div
        ref={ref}
        data-glass-component
        className={cn(
          "glass-w-full glass-max-w-full glass-min-w-0",
          contained && "glass-overflow-hidden",
          className
        )}
        style={{
          width,
          height,
          maxHeight,
          overflow: maxHeight || height ? "auto" : undefined,
          ...style,
        }}
        data-testid={props["data-testid"] || "glassfileupload"}
        {...props}
      >
        {/* Hidden file input */}
        <GlassInput
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleInputChange}
          className="glass-hidden"
          disabled={disabled}
        />

        {/* Drop zone */}
        {showDropzone && (
        <OptimizedGlass
          variant="frosted"
          elevation={isDragOver ? "level2" : "level1"}
          intensity="medium"
          depth={2}
          tint="neutral"
          border="subtle"
          animation="none"
          performanceMode="medium"
          ref={dropZoneRef}
          className={cn(
            "glass-relative glass-border glass-border-dashed glass-cursor-pointer glass-transition-all glass-overflow-hidden",
            "hover:glass-border-blue focus:glass-border-blue glass-focus-outline-none",
            sizeClasses[size],
            variantClasses[variant],
            isCompact && "glass-min-h-16",
            {
              "glass-border-blue glass-surface-blue/20": isDragOver,
              "glass-border-white/20 glass-surface-dark/20":
                !isDragOver && !error,
              "glass-border-red glass-surface-red/20": error,
              "glass-opacity-50 glass-cursor-not-allowed": disabled,
            }
          )}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={handleClick}
          tabIndex={disabled ? -1 : 0}
          role="button"
          aria-label="File upload area"
        >
          {children || (
            <div className="glass-flex glass-flex-col glass-items-center glass-justify-center glass-text-center">
              <svg
                className={cn("glass-mx-auto glass-mb-2 glass-text-secondary", {
                  "glass-w-8 glass-h-8": size === "sm",
                  "glass-w-10 glass-h-10": size === "md",
                  "glass-w-12 glass-h-12": size === "lg",
                })}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>

              <p className="glass-text-primary glass-font-medium glass-mb-1">
                {instruction}
              </p>

              {helperText && (
                <p className="glass-text-sm glass-text-secondary">
                  {helperText}
                </p>
              )}

              {maxSize && (
                <p className={cn("glass-text-xs glass-text-secondary glass-mt-2", isCompact && "glass-hidden")}>
                  Max file size: {formatFileSize(maxSize)}
                </p>
              )}
            </div>
          )}
        </OptimizedGlass>
        )}

        {/* Error message */}
        {error && (
          <p className="glass-text-sm glass-text-danger glass-mt-2">{error}</p>
        )}

        {/* File list */}
        {visibleFiles.length > 0 && (
          <div
            className={cn("glass-mt-4 glass-gap-2", {
              "grid grid-cols-2 md:grid-cols-3 glass-gap-3": variant === "grid",
            })}
          >
            {visibleFiles.map((file, index) => renderFileItem(file, index))}
          </div>
        )}

        {/* Upload all button */}
        {showActions &&
          visibleFiles.some((f) => f.status === "pending") &&
          onUpload &&
          !autoUpload && (
            <div className="glass-mt-4 glass-flex glass-justify-end">
              <GlassButton
                variant="default"
                size="sm"
                onClick={(e) => {
                  visibleFiles
                    .filter((f: any) => f.status === "pending")
                    .forEach((f: any) => handleUpload(f.id));
                }}
                disabled={disabled}
              >
                Upload All
              </GlassButton>
            </div>
          )}
      </div>
    );
  }
);

GlassFileUpload.displayName = "GlassFileUpload";
