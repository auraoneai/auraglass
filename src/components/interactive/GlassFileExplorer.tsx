import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  Archive,
  ArrowUp,
  Check,
  Code,
  FileText,
  Folder,
  Grid,
  Home,
  Image,
  List,
  MoreVertical,
  Music,
  Plus,
  RefreshCw,
  Search,
  Upload,
  Video,
  X,
} from "lucide-react";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { OptimizedGlass } from "../../primitives";
import { GlassButton } from "../button/GlassButton";
import { GlassInput } from "../input/GlassInput";
import {
  GlassBreadcrumb,
  GlassBreadcrumbItem,
} from "../navigation/GlassBreadcrumb";

export interface FileItem {
  id: string;
  name: string;
  type: "file" | "folder";
  size?: number;
  modifiedAt: Date;
  createdAt: Date;
  extension?: string;
  mimeType?: string;
  thumbnail?: string;
  permissions?: string;
  owner?: string;
  path: string;
  parentId?: string;
  children?: FileItem[];
  isLoading?: boolean;
}

export interface GlassFileExplorerProps {
  currentPath: string;
  files: FileItem[];
  onNavigate: (path: string) => void;
  onFileSelect?: (file: FileItem) => void;
  onFileOpen?: (file: FileItem) => void;
  onFileDelete?: (fileId: string) => void;
  onFileRename?: (fileId: string, newName: string) => void;
  onFileMove?: (fileId: string, newPath: string) => void;
  onFileCopy?: (fileId: string, newPath: string) => void;
  onFolderCreate?: (parentPath: string, name: string) => void;
  onFileUpload?: (files: FileList, path: string) => void;
  onRefresh?: () => void;
  selectedFiles?: string[];
  onSelectionChange?: (fileIds: string[]) => void;
  loading?: boolean;
  viewMode?: "list" | "grid";
  onViewModeChange?: (mode: "list" | "grid") => void;
  showHiddenFiles?: boolean;
  onShowHiddenFilesChange?: (show: boolean) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  className?: string;
  showToolbar?: boolean;
  showBreadcrumb?: boolean;
  showSearch?: boolean;
  allowMultiSelect?: boolean;
  allowDragDrop?: boolean;
  variant?: "default" | "compact" | "minimal";
  size?: "sm" | "md" | "lg";
  elevation?: "low" | "medium" | "high";
}

const GlassFileExplorer = React.forwardRef<
  HTMLDivElement,
  GlassFileExplorerProps
>(
  (
    {
      currentPath,
      files,
      onNavigate,
      onFileSelect,
      onFileOpen,
      onFileDelete,
      onFileRename,
      onFileMove,
      onFileCopy,
      onFolderCreate,
      onFileUpload,
      onRefresh,
      selectedFiles = [],
      onSelectionChange,
      loading = false,
      viewMode = "list",
      onViewModeChange,
      showHiddenFiles = false,
      onShowHiddenFilesChange,
      searchQuery = "",
      onSearchChange,
      className,
      showToolbar = true,
      showBreadcrumb = true,
      showSearch = true,
      allowMultiSelect = true,
      allowDragDrop = true,
      variant = "default",
      size = "md",
      elevation = "medium",
      ...props
    },
    ref
  ) => {
    const prefersReducedMotion = useReducedMotion();
    const [draggedItem, setDraggedItem] = useState<FileItem | null>(null);
    const [dragOverItem, setDragOverItem] = useState<string | null>(null);
    const [renamingFile, setRenamingFile] = useState<string | null>(null);
    const [newName, setNewName] = useState("");
    const [creatingFolder, setCreatingFolder] = useState(false);
    const [newFolderName, setNewFolderName] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const pathSegments = useMemo(() => {
      return currentPath.split("/").filter(Boolean);
    }, [currentPath]);

    const filteredFiles = useMemo(() => {
      let filtered = files;

      // Filter by search query
      if (searchQuery) {
        filtered = filtered.filter((file: any) =>
          file.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      // Filter hidden files
      if (!showHiddenFiles) {
        filtered = filtered.filter((file: any) => !file.name.startsWith("."));
      }

      return filtered;
    }, [files, searchQuery, showHiddenFiles]);

    const sortedFiles = useMemo(() => {
      return [...filteredFiles].sort((a, b) => {
        // Folders first, then files
        if (a.type !== b.type) {
          return a.type === "folder" ? -1 : 1;
        }
        // Alphabetical sort
        return a.name.localeCompare(b.name);
      });
    }, [filteredFiles]);

    const handleFileClick = useCallback(
      (file: FileItem, event: React.MouseEvent) => {
        if (renamingFile === file.id) return;

        if (allowMultiSelect && (event.ctrlKey || event.metaKey)) {
          // Multi-select
          const newSelection = selectedFiles.includes(file.id)
            ? selectedFiles.filter((id: any) => id !== file.id)
            : [...selectedFiles, file.id];
          onSelectionChange?.(newSelection);
        } else if (
          allowMultiSelect &&
          event.shiftKey &&
          selectedFiles.length > 0
        ) {
          // Range select
          const currentIndex = sortedFiles.findIndex(
            (f) => f.id === selectedFiles[0]
          );
          const targetIndex = sortedFiles.findIndex((f) => f.id === file.id);
          const startIndex = Math.min(currentIndex, targetIndex);
          const endIndex = Math.max(currentIndex, targetIndex);
          const rangeSelection = sortedFiles
            .slice(startIndex, endIndex + 1)
            .map((f: any) => f.id);
          onSelectionChange?.(rangeSelection);
        } else {
          // Single select
          onSelectionChange?.([file.id]);
          onFileSelect?.(file);

          if (file.type === "folder") {
            onNavigate(file.path);
          } else {
            onFileOpen?.(file);
          }
        }
      },
      [
        renamingFile,
        allowMultiSelect,
        selectedFiles,
        onSelectionChange,
        onFileSelect,
        onNavigate,
        onFileOpen,
        sortedFiles,
      ]
    );

    const handleBreadcrumbClick = useCallback(
      (segmentIndex: number) => {
        const newPath = "/" + pathSegments.slice(0, segmentIndex + 1).join("/");
        onNavigate(newPath);
      },
      [pathSegments, onNavigate]
    );

    const handleContextMenuAction = useCallback(
      (action: string, file: FileItem) => {
        switch (action) {
          case "open":
            if (file.type === "folder") {
              onNavigate(file.path);
            } else {
              onFileOpen?.(file);
            }
            break;
          case "rename":
            setRenamingFile(file.id);
            setNewName(file.name);
            break;
          case "delete":
            onFileDelete?.(file.id);
            break;
          case "download":
            // Handle download
            break;
        }
      },
      [onNavigate, onFileOpen, onFileDelete]
    );

    const handleRenameSubmit = useCallback(() => {
      if (renamingFile && newName.trim()) {
        onFileRename?.(renamingFile, newName.trim());
        setRenamingFile(null);
        setNewName("");
      }
    }, [renamingFile, newName, onFileRename]);

    const handleCreateFolder = useCallback(() => {
      if (newFolderName.trim()) {
        onFolderCreate?.(currentPath, newFolderName.trim());
        setCreatingFolder(false);
        setNewFolderName("");
      }
    }, [newFolderName, currentPath, onFolderCreate]);

    const handleFileUpload = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const fileList = event.target.files;
        if (fileList && fileList.length > 0) {
          onFileUpload?.(fileList, currentPath);
        }
        // Reset input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      },
      [currentPath, onFileUpload]
    );

    const handleDragStart = useCallback(
      (event: React.DragEvent, file: FileItem) => {
        if (!allowDragDrop) return;
        setDraggedItem(file);

        // Create a lightweight glass ghost for drag image
        const ghost = document.createElement("div");
        ghost.className =
          "pointer-events-none px-3 py-1.5 glass-radius-lg glass-surface-dark/40 ring-1 ring-white/10 text-primary text-sm glass-glass-backdrop-blur-md shadow-xl glass-contrast-guard";
        ghost.textContent = file.name;
        document.body.appendChild(ghost);
        event.dataTransfer.setDragImage(ghost, 10, 10);
        // Remove ghost after drag starts (browser clones the node)
        setTimeout(() => ghost.remove(), 0);
      },
      [allowDragDrop]
    );

    const handleDragOver = useCallback(
      (event: React.DragEvent, fileId?: string) => {
        if (allowDragDrop) {
          event.preventDefault();
          setDragOverItem(fileId || null);
        }
      },
      [allowDragDrop]
    );

    const handleDrop = useCallback(
      (event: React.DragEvent, targetFile?: FileItem) => {
        if (allowDragDrop && draggedItem && targetFile?.type === "folder") {
          event.preventDefault();
          onFileMove?.(draggedItem.id, targetFile.path);
          setDraggedItem(null);
          setDragOverItem(null);
        }
      },
      [allowDragDrop, draggedItem, onFileMove]
    );

    const getFileIcon = useCallback((file: FileItem) => {
      if (file.type === "folder") {
        return <Folder className="w-5 h-5 text-primary" />;
      }

      const ext = file.extension?.toLowerCase();
      switch (ext) {
        case "jpg":
        case "jpeg":
        case "png":
        case "gif":
        case "webp":
          return <Image className="w-5 h-5 text-primary" />;
        case "mp4":
        case "avi":
        case "mov":
        case "mkv":
          return <Video className="w-5 h-5 text-primary" />;
        case "mp3":
        case "wav":
        case "flac":
          return <Music className="w-5 h-5 text-pink-400" />;
        case "zip":
        case "rar":
        case "7z":
          return <Archive className="w-5 h-5 text-primary" />;
        case "js":
        case "ts":
        case "jsx":
        case "tsx":
        case "py":
        case "java":
        case "cpp":
        case "c":
        case "php":
        case "html":
        case "css":
          return <Code className="w-5 h-5 text-primary" />;
        default:
          return <FileText className="w-5 h-5 glass-text-secondary" />;
      }
    }, []);

    const formatFileSize = useCallback((bytes?: number) => {
      if (!bytes) return "";
      const sizes = ["B", "KB", "MB", "GB", "TB"];
      const i = Math.floor(Math.log(bytes) / Math.log(1024));
      return (
        Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i]
      );
    }, []);

    const formatDate = useCallback((date: Date) => {
      return (
        date.toLocaleDateString() +
        " " +
        date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    }, []);

    const sizeClasses = {
      sm: "glass-text-sm",
      md: "glass-text-base",
      lg: "glass-text-lg",
    };

    const variantClasses = {
      default: "glass-p-6",
      compact: "glass-p-4",
      minimal: "glass-p-2",
    };

    const elevationClasses = {
      low: "glass-backdrop-blur-md bg-white/10 border border-white/20",
      medium:
        "glass-backdrop-blur-md bg-white/20 border border-white/30 shadow-lg",
      high: "glass-backdrop-blur-md bg-white/30 border border-white/40 shadow-2xl",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "glass-radius-xl",
          elevationClasses[elevation],
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {/* Toolbar */}
        {showToolbar && (
          <div className="glass-flex glass-items-center glass-justify-between mb-4 pb-4 glass-border-b glass-border-white/20">
            <div className="glass-flex glass-items-center glass-gap-2">
              <GlassButton
                variant="ghost"
                size="sm"
                onClick={(e) => onNavigate("/")}
                disabled={currentPath === "/"}
                className="text-primary/70 hover:text-primary"
              >
                <Home className="w-4 h-4" />
              </GlassButton>

              <GlassButton
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  const parentPath =
                    currentPath.split("/").slice(0, -1).join("/") || "/";
                  onNavigate(parentPath);
                }}
                disabled={currentPath === "/"}
                className="text-primary/70 hover:text-primary"
              >
                <ArrowUp className="w-4 h-4" />
              </GlassButton>

              <GlassButton
                variant="ghost"
                size="sm"
                onClick={onRefresh}
                className="text-primary/70 hover:text-primary"
              >
                <RefreshCw className="w-4 h-4" />
              </GlassButton>
            </div>

            <div className="glass-flex glass-items-center glass-gap-2">
              {onFolderCreate && (
                <GlassButton
                  variant="ghost"
                  size="sm"
                  onClick={(e) => setCreatingFolder(true)}
                  className="text-primary/70 hover:text-primary"
                >
                  <Plus className="w-4 h-4 glass-mr-1" />
                  New Folder
                </GlassButton>
              )}

              {onFileUpload && (
                <>
                  <GlassButton
                    variant="ghost"
                    size="sm"
                    onClick={(e) => fileInputRef.current?.click()}
                    className="text-primary/70 hover:text-primary"
                  >
                    <Upload className="w-4 h-4 glass-mr-1" />
                    Upload
                  </GlassButton>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden glass-touch-target glass-contrast-guard"
                  />
                </>
              )}

              <div className="glass-flex glass-items-center glass-border glass-border-white/20 glass-radius-lg">
                <GlassButton
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={(e) => onViewModeChange?.("list")}
                  className="glass-radius-r-none glass-border-r glass-border-white/20"
                >
                  <List className="w-4 h-4" />
                </GlassButton>
                <GlassButton
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={(e) => onViewModeChange?.("grid")}
                  className="glass-radius-l-none"
                >
                  <Grid className="w-4 h-4" />
                </GlassButton>
              </div>
            </div>
          </div>
        )}

        {/* Breadcrumb */}
        {showBreadcrumb && (
          <div className="mb-4">
            <GlassBreadcrumb>
              <GlassBreadcrumbItem>
                <GlassButton
                  variant="ghost"
                  size="sm"
                  onClick={(e) => onNavigate("/")}
                >
                  Root
                </GlassButton>
              </GlassBreadcrumbItem>
              {pathSegments.map((segment, index) => (
                <GlassBreadcrumbItem key={segment}>
                  <GlassButton
                    variant="ghost"
                    size="sm"
                    onClick={(e) => handleBreadcrumbClick(index)}
                  >
                    {segment}
                  </GlassButton>
                </GlassBreadcrumbItem>
              ))}
            </GlassBreadcrumb>
          </div>
        )}

        {/* Search */}
        {showSearch && (
          <div className="mb-4">
            <GlassInput
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>
        )}

        {/* File List/Grid */}
        <div className="glass-flex-1 overflow-auto">
          {loading ? (
            <div className="glass-flex glass-items-center glass-justify-center glass-py-8">
              <div className="w-8 h-8 glass-border-2 glass-border-white/30 glass-border-t-white glass-radius-full animate-spin" />
            </div>
          ) : (
            <div
              className={cn(
                viewMode === "grid"
                  ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 glass-gap-4"
                  : "glass-gap-1"
              )}
            >
              <AnimatePresence>
                {sortedFiles.map((file) => (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={
                      prefersReducedMotion ? {} : { opacity: 1, scale: 1 }
                    }
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={cn(
                      "relative group",
                      selectedFiles.includes(file.id) && "ring-2 ring-blue-400",
                      dragOverItem === file.id && "ring-2 ring-green-400"
                    )}
                  >
                    <div className="relative">
                      <OptimizedGlass
                        elevation={"level1"}
                        interactive
                        className={cn(
                          "cursor-pointer glass-radius-lg transition-all duration-200",
                          viewMode === "grid"
                            ? "glass-p-3"
                            : "flex items-center glass-gap-3 glass-p-3",
                          selectedFiles.includes(file.id) &&
                            "ring-1 ring-blue-400/40",
                          draggedItem?.id === file.id &&
                            "glass-lift scale-[1.02] ring-1 ring-white/15 shadow-xl",
                          dragOverItem === file.id && "glass-pulse-ring"
                        )}
                        onClick={(e: React.MouseEvent) =>
                          handleFileClick(file, e)
                        }
                        draggable={allowDragDrop}
                        onDragStart={(e: React.DragEvent) =>
                          handleDragStart(e, file)
                        }
                        onDragOver={(e: React.DragEvent) =>
                          handleDragOver(e, file.id)
                        }
                        onDragEnd={() => {
                          setDraggedItem(null);
                          setDragOverItem(null);
                        }}
                        onDrop={(e: React.DragEvent) => handleDrop(e, file)}
                      >
                        {viewMode === "grid" ? (
                          <div className="glass-flex glass-flex-col glass-items-center text-center">
                            {file.thumbnail ? (
                              <img
                                src={file.thumbnail}
                                alt={file.name}
                                className="w-12 h-12 object-cover glass-radius-md mb-2"
                              />
                            ) : (
                              <div className="w-12 h-12 glass-flex glass-items-center glass-justify-center mb-2">
                                {getFileIcon(file)}
                              </div>
                            )}
                            <div className="glass-text-sm text-primary font-medium truncate glass-w-full">
                              {file.name}
                            </div>
                            {file.type === "file" && file.size && (
                              <div className="glass-text-xs text-primary/60">
                                {formatFileSize(file.size)}
                              </div>
                            )}
                          </div>
                        ) : (
                          <>
                            <div className="glass-flex-shrink-0">
                              {file.thumbnail ? (
                                <img
                                  src={file.thumbnail}
                                  alt={file.name}
                                  className="w-8 h-8 object-cover glass-radius-md"
                                />
                              ) : (
                                getFileIcon(file)
                              )}
                            </div>

                            <div className="glass-flex-1 glass-min-w-0">
                              {renamingFile === file.id ? (
                                <div className="glass-flex glass-items-center glass-gap-2">
                                  <GlassInput
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter")
                                        handleRenameSubmit();
                                      if (e.key === "Escape")
                                        setRenamingFile(null);
                                    }}
                                    autoFocus
                                    className="glass-flex-1 glass-pulse-ring"
                                  />
                                  <GlassButton
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleRenameSubmit}
                                  >
                                    <Check className="w-4 h-4" />
                                  </GlassButton>
                                  <GlassButton
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => setRenamingFile(null)}
                                  >
                                    <X className="w-4 h-4" />
                                  </GlassButton>
                                </div>
                              ) : (
                                <div className="font-medium text-primary truncate">
                                  {file.name}
                                </div>
                              )}
                              <div className="glass-text-sm text-primary/60">
                                {file.type === "file"
                                  ? formatFileSize(file.size)
                                  : "Folder"}
                                {file.modifiedAt &&
                                  ` • ${formatDate(file.modifiedAt)}`}
                              </div>
                            </div>
                          </>
                        )}
                      </OptimizedGlass>

                      {/* Simple context menu button */}
                      <GlassButton
                        variant="ghost"
                        size="sm"
                        className="absolute glass-top-2 right-2 w-6 h-6 glass-p-0 opacity-0 group-hover:opacity-100 hover:glass-surface-subtle/20"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Simple action - could be expanded to show a menu
                          handleContextMenuAction("open", file);
                        }}
                      >
                        <MoreVertical className="w-3 h-3" />
                      </GlassButton>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Create Folder Dialog */}
        {creatingFolder && (
          <div className="fixed inset-0 glass-surface-dark/50 glass-glass-backdrop-blur-md z-50 glass-flex glass-items-center glass-justify-center glass-contrast-guard">
            <OptimizedGlass
              elevation={"level2"}
              className="glass-radius-lg glass-p-6 max-w-md glass-w-full glass-mx-4"
            >
              <h3 className="glass-text-lg font-semibold text-primary mb-4">
                Create New Folder
              </h3>
              <GlassInput
                placeholder="Folder name..."
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreateFolder()}
                className="mb-4"
                autoFocus
              />
              <div className="glass-flex glass-gap-2">
                <GlassButton
                  variant="ghost"
                  onClick={(e) => setCreatingFolder(false)}
                  className="glass-flex-1"
                >
                  Cancel
                </GlassButton>
                <GlassButton
                  variant="primary"
                  onClick={handleCreateFolder}
                  disabled={!newFolderName.trim()}
                  className="glass-flex-1"
                >
                  Create
                </GlassButton>
              </div>
            </OptimizedGlass>
          </div>
        )}
      </div>
    );
  }
);

GlassFileExplorer.displayName = "GlassFileExplorer";

export { GlassFileExplorer };
