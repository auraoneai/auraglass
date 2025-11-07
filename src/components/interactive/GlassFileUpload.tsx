'use client';

import { GlassInput } from '../input/GlassInput';

import { cn } from '../../lib/utilsComprehensive';
import React, { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import { OptimizedGlass } from '../../primitives';
import { Motion } from '../../primitives';
import { GlassButton, IconButton } from '../button/GlassButton';
import { GlassBadge } from '../data-display/GlassBadge';
import { GlassProgress } from '../data-display/GlassProgress';

export interface UploadedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  url?: string;
  preview?: string;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  progress?: number;
  error?: string;
}

export interface GlassFileUploadProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
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
  variant?: 'default' | 'compact' | 'minimal' | 'grid';
  /**
   * Upload size
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Disabled state
   */
  disabled?: boolean;
  /**
   * Files array
   */
  files?: UploadedFile[];
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
      variant = 'default',
      size = 'md',
      disabled = false,
      files = [],
      onChange,
      onUpload,
      onRemove,
      onPreview,
      showPreviews = true,
      showProgress = true,
      instruction = 'Drag and drop files here, or click to select',
      helperText,
      error,
      autoUpload = false,
      renderFile,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const [internalFiles, setInternalFiles] = useState<UploadedFile[]>(files);
    const [isDragOver, setIsDragOver] = useState(false);
    const [isDragActive, setIsDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const dropZoneRef = useRef<HTMLDivElement>(null);

    const sizeClasses = {
      sm: 'glass-p-4 glass-text-sm',
      md: 'glass-p-6 glass-text-base',
      lg: 'p-8 glass-text-lg',
    };

    const variantClasses = {
      default: 'min-h-32',
      compact: 'min-h-20',
      minimal: 'min-h-16',
      grid: 'min-h-40',
    };

    // Sync internal files with props
    useEffect(() => {
      setInternalFiles(files);
    }, [files]);

    // Format file size
    const formatFileSize = (bytes: number): string => {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    // Validate file
    const validateFile = (file: File): string | null => {
      if (maxSize && file.size > maxSize) {
        return `File size must be less than ${formatFileSize(maxSize)}`;
      }

      if (accept) {
        const acceptedTypes = accept.split(',').map((type: any) => type.trim());
        const isAccepted = acceptedTypes.some(type => {
          if (type.startsWith('.')) {
            return file.name.toLowerCase().endsWith(type.toLowerCase());
          }
          return file.type.match(type.replace('*', '.*'));
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
        status: validationError ? 'error' : 'pending',
        error: validationError || undefined,
        progress: 0,
      };
    };

    // Handle file selection
    const handleFiles = useCallback(async (fileList: FileList) => {
      if (disabled) return;

      const newFiles = Array.from(fileList).map(createFileObject);

      // Check max files limit
      if (maxFiles && internalFiles.length + newFiles.length > maxFiles) {
        console.warn(`Maximum ${maxFiles} files allowed`);
        return;
      }

      const updatedFiles = multiple ? [...internalFiles, ...newFiles] : newFiles;
      setInternalFiles(updatedFiles);
      onChange?.(updatedFiles);

      // Auto upload valid files
      if (autoUpload && onUpload) {
        for (const fileObj of newFiles) {
          if (fileObj.status === 'pending') {
            await handleUpload(fileObj.id);
          }
        }
      }
    }, [disabled, maxFiles, internalFiles, multiple, onChange, autoUpload, onUpload]);

    // Handle file upload
    const handleUpload = async (fileId: string) => {
      if (!onUpload) return;

      const fileIndex = internalFiles.findIndex(f => f.id === fileId);
      if (fileIndex === -1) return;

      const fileObj = internalFiles[fileIndex];

      // Update status to uploading
      const updatedFiles = [...internalFiles];
      updatedFiles[fileIndex] = { ...fileObj, status: 'uploading', progress: 0 };
      setInternalFiles(updatedFiles);
      onChange?.(updatedFiles);

      try {
        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setInternalFiles(current => {
            const newFiles = [...current];
            const currentFile = newFiles.find(f => f.id === fileId);
            if (currentFile && currentFile.status === 'uploading') {
              currentFile.progress = Math.min((currentFile.progress || 0) + 10, 90);
            }
            return newFiles;
          });
        }, 200);

        const result = await onUpload(fileObj.file);

        clearInterval(progressInterval);

        // Update file with result
        const finalFiles = [...internalFiles];
        const finalIndex = finalFiles.findIndex(f => f.id === fileId);
        if (finalIndex !== -1) {
          finalFiles[finalIndex] = {
            ...finalFiles[finalIndex],
            status: 'completed',
            progress: 100,
            url: result?.url,
          };
          setInternalFiles(finalFiles);
          onChange?.(finalFiles);
        }
      } catch (error) {
        // Update file with error
        const errorFiles = [...internalFiles];
        const errorIndex = errorFiles.findIndex(f => f.id === fileId);
        if (errorIndex !== -1) {
          errorFiles[errorIndex] = {
            ...errorFiles[errorIndex],
            status: 'error',
            error: error instanceof Error ? error.message : 'Upload failed',
          };
          setInternalFiles(errorFiles);
          onChange?.(errorFiles);
        }
      }
    };

    // Handle file removal
    const handleRemove = (fileId: string) => {
      const updatedFiles = internalFiles.filter((f: any) => f.id !== fileId);
      setInternalFiles(updatedFiles);
      onChange?.(updatedFiles);
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
      e.target.value = '';
    };

    // Get file icon
    const getFileIcon = (type: string) => {
      if (type.startsWith('image/')) {
        return (
          <svg data-glass-component className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      }

      if (type.includes('pdf')) {
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        );
      }

      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
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
              'glass-p-3 border border-border/20',
              file.status === 'error' && 'border-destructive/50 bg-destructive/5'
            )}
          >
            <div className="flex items-center gap-3">
              {/* File icon/preview */}
              <div className="flex-shrink-0">
                {showPreviews && file.type.startsWith('image/') && file.preview ? (
                  <img
                    src={file.preview}
                    alt={file.name}
                    className="w-10 h-10 object-cover glass-radius-md"
                  />
                ) : (
                  <div className="w-10 h-10 glass-radius-md glass-surface-subtle flex items-center justify-center">
                    {getFileIcon(file.type)}
                  </div>
                )}
              </div>

              {/* File info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-primary truncate">
                  {file.name}
                </p>
                <div className="flex items-center gap-2 glass-mt-1">
                  <span className="text-xs glass-text-secondary">
                    {formatFileSize(file.size)}
                  </span>
                  <GlassBadge
                    variant={
                      file.status === 'completed' ? 'success' :
                        file.status === 'error' ? 'error' :
                          file.status === 'uploading' ? 'primary' : 'outline'
                    }
                    size="xs"
                  >
                    {file.status}
                  </GlassBadge>
                </div>

                {/* Progress bar */}
                {file.status === 'uploading' && showProgress && (
                  <GlassProgress
                    value={file.progress}
                    size="xs"
                    className="glass-mt-2"
                  />
                )}

                {/* Error message */}
                {file.error && (
                  <p className="text-xs text-destructive glass-mt-1">{file.error}</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1">
                {file.status === 'pending' && onUpload && (
                  <IconButton
                    icon="↑"
                    variant="ghost"
                    size="sm"
                    onClick={(e) => handleUpload(file.id)}
                    aria-label="Upload file"
                  />
                )}

                {file.status === 'completed' && onPreview && (
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
            </div>
          </OptimizedGlass>
        </Motion>
      );
    };

    return (
      <div ref={ref} className={cn('w-full', className)} {...props}>
        {/* Hidden file input */}
        <GlassInput ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleInputChange}
          className="hidden"
          disabled={disabled} />

        {/* Drop zone */}
        <OptimizedGlass
          variant="frosted"
          elevation={isDragOver ? 'level2' : 'level1'}
          intensity="medium"
          depth={2}
          tint="neutral"
          border="subtle"
          animation="none"
          performanceMode="medium"
          ref={dropZoneRef}
          className={cn(
            'relative border-2 border-dashed cursor-pointer transition-all',
            'hover:border-primary/50 focus:border-primary focus:outline-none',
            sizeClasses[size],
            variantClasses[variant],
            {
              'border-primary bg-primary/5': isDragOver,
              'border-border/30': !isDragOver && !error,
              'border-destructive bg-destructive/5': error,
              'opacity-50 cursor-not-allowed': disabled,
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
            <div className="flex flex-col items-center justify-center text-center">
              <svg
                className={cn(
                  'mx-auto mb-3 glass-text-secondary',
                  size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-12 h-12' : 'w-10 h-10'
                )}
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

              <p className="text-primary font-medium mb-1">
                {instruction}
              </p>

              {helperText && (
                <p className="text-sm glass-text-secondary">
                  {helperText}
                </p>
              )}

              {maxSize && (
                <p className="text-xs glass-text-secondary glass-mt-2">
                  Max file size: {formatFileSize(maxSize)}
                </p>
              )}
            </div>
          )}
        </OptimizedGlass>

        {/* Error message */}
        {error && (
          <p className="text-sm text-destructive glass-mt-2">{error}</p>
        )}

        {/* File list */}
        {internalFiles.length > 0 && (
          <div className={cn('glass-mt-4 glass-gap-2', {
            'grid grid-cols-2 md:grid-cols-3 glass-gap-3': variant === 'grid',
          })}>
            {internalFiles.map((file, index) => renderFileItem(file, index))}
          </div>
        )}

        {/* Upload all button */}
        {internalFiles.some(f => f.status === 'pending') && onUpload && !autoUpload && (
          <div className="glass-mt-4 flex justify-end">
            <GlassButton
              variant="default"
              size="sm"
              onClick={(e) => {
                internalFiles
                  .filter((f: any) => f.status === 'pending')
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

GlassFileUpload.displayName = 'GlassFileUpload';
