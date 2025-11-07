import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import {
    Archive,
    Check,
    ChevronDown,
    ChevronRight,
    Code,
    FileText,
    Folder, FolderOpen,
    Image,
    MoreVertical,
    Music,
    Search,
    Video,
    X
} from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { GlassButton } from '../button/GlassButton';
import { GlassInput } from '../input/GlassInput';

export interface TreeNode {
    id: string;
    name: string;
    type: 'file' | 'folder';
    path: string;
    size?: number;
    modifiedAt?: Date;
    extension?: string;
    children?: TreeNode[];
    isExpanded?: boolean;
    isLoading?: boolean;
    canExpand?: boolean;
    level: number;
}

export interface GlassFileTreeProps {
    nodes: TreeNode[];
    onNodeSelect?: (node: TreeNode) => void;
    onNodeToggle?: (nodeId: string, expanded: boolean) => void;
    onNodeCreate?: (parentId: string, name: string, type: 'file' | 'folder') => void;
    onNodeDelete?: (nodeId: string) => void;
    onNodeRename?: (nodeId: string, newName: string) => void;
    onNodeMove?: (nodeId: string, newParentId: string) => void;
    onNodeCopy?: (nodeId: string, newParentId: string) => void;
    selectedNodeId?: string;
    expandedNodes?: string[];
    onExpandedChange?: (expandedNodes: string[]) => void;
    searchQuery?: string;
    onSearchChange?: (query: string) => void;
    showIcons?: boolean;
    showSize?: boolean;
    showModified?: boolean;
    allowCreate?: boolean;
    allowDelete?: boolean;
    allowRename?: boolean;
    allowMove?: boolean;
    allowCopy?: boolean;
    className?: string;
    maxHeight?: string | number;
    virtualize?: boolean;
    variant?: 'default' | 'compact' | 'minimal';
    size?: 'sm' | 'md' | 'lg';
    elevation?: 'low' | 'medium' | 'high';
}

const GlassFileTree = React.forwardRef<HTMLDivElement, GlassFileTreeProps>(
    ({
        nodes,
        onNodeSelect,
        onNodeToggle,
        onNodeCreate,
        onNodeDelete,
        onNodeRename,
        onNodeMove,
        onNodeCopy,
        selectedNodeId,
        expandedNodes = [],
        onExpandedChange,
        searchQuery = '',
        onSearchChange,
        showIcons = true,
        showSize = false,
        showModified = false,
        allowCreate = false,
        allowDelete = false,
        allowRename = false,
        allowMove = false,
        allowCopy = false,
        className,
        maxHeight = '400px',
        virtualize = false,
        variant = 'default',
        size = 'md',
        elevation = 'medium',
        ...props
    }, ref) => {
        const [renamingNode, setRenamingNode] = useState<string | null>(null);
        const [newName, setNewName] = useState('');
        const [creatingNode, setCreatingNode] = useState<{ parentId: string; type: 'file' | 'folder' } | null>(null);
        const [newNodeName, setNewNodeName] = useState('');
        const [localExpandedNodes, setLocalExpandedNodes] = useState<string[]>(expandedNodes);
        const [draggedNode, setDraggedNode] = useState<TreeNode | null>(null);
        const [dragOverNode, setDragOverNode] = useState<string | null>(null);

        // Sync local expanded state with props
        useEffect(() => {
            setLocalExpandedNodes(expandedNodes);
        }, [expandedNodes]);

        const handleToggle = useCallback((node: TreeNode) => {
            if (node.type !== 'folder' || !node.canExpand) return;

            const newExpanded = localExpandedNodes.includes(node.id)
                ? localExpandedNodes.filter((id: any) => id !== node.id)
                : [...localExpandedNodes, node.id];

            setLocalExpandedNodes(newExpanded);
            onExpandedChange?.(newExpanded);
            onNodeToggle?.(node.id, !localExpandedNodes.includes(node.id));
        }, [localExpandedNodes, onExpandedChange, onNodeToggle]);

        const handleSelect = useCallback((node: TreeNode) => {
            onNodeSelect?.(node);
        }, [onNodeSelect]);

        const handleContextMenuAction = useCallback((action: string, node: TreeNode) => {
            switch (action) {
                case 'rename':
                    if (allowRename) {
                        setRenamingNode(node.id);
                        setNewName(node.name);
                    }
                    break;
                case 'delete':
                    if (allowDelete) {
                        onNodeDelete?.(node.id);
                    }
                    break;
                case 'copy':
                    if (allowCopy) {
                        // This would typically open a dialog to select destination
                        console.log('Copy node:', node.id);
                    }
                    break;
                case 'move':
                    if (allowMove) {
                        // This would typically open a dialog to select destination
                        console.log('Move node:', node.id);
                    }
                    break;
                case 'newFolder':
                    if (allowCreate && node.type === 'folder') {
                        setCreatingNode({ parentId: node.id, type: 'folder' });
                        setNewNodeName('');
                    }
                    break;
                case 'newFile':
                    if (allowCreate && node.type === 'folder') {
                        setCreatingNode({ parentId: node.id, type: 'file' });
                        setNewNodeName('');
                    }
                    break;
            }
        }, [allowRename, allowDelete, allowCopy, allowMove, allowCreate, onNodeDelete]);

        const handleRenameSubmit = useCallback(() => {
            if (renamingNode && newName.trim()) {
                onNodeRename?.(renamingNode, newName.trim());
                setRenamingNode(null);
                setNewName('');
            }
        }, [renamingNode, newName, onNodeRename]);

        const handleCreateSubmit = useCallback(() => {
            if (creatingNode && newNodeName.trim()) {
                onNodeCreate?.(creatingNode.parentId, newNodeName.trim(), creatingNode.type);
                setCreatingNode(null);
                setNewNodeName('');
            }
        }, [creatingNode, newNodeName, onNodeCreate]);

        const handleDragStart = useCallback((event: React.DragEvent, node: TreeNode) => {
            setDraggedNode(node);
            const ghost = document.createElement('div');
            ghost.className='pointer-events-none px-2 py-1 glass-radius-md glass-surface-dark/40 ring-1 ring-white/10 text-primary text-xs backdrop-blur-md shadow-xl';
            ghost.textContent = node.name;
            document.body.appendChild(ghost);
            event.dataTransfer.setDragImage(ghost, 8, 8);
            setTimeout(() => ghost.remove(), 0);
        }, []);

        const handleDragOver = useCallback((event: React.DragEvent, node: TreeNode) => {
            if (node.type === 'folder' && draggedNode && draggedNode.id !== node.id) {
                event.preventDefault();
                setDragOverNode(node.id);
            }
        }, [draggedNode]);

        const handleDragEnd = useCallback(() => {
            setDraggedNode(null);
            setDragOverNode(null);
        }, []);

        const handleDrop = useCallback((event: React.DragEvent, node: TreeNode) => {
            if (draggedNode && node.type === 'folder' && draggedNode.id !== node.id) {
                event.preventDefault();
                onNodeMove?.(draggedNode.id, node.id);
                setDraggedNode(null);
                setDragOverNode(null);
            }
        }, [draggedNode, onNodeMove]);

        const filteredNodes = useMemo(() => {
            if (!searchQuery) return nodes;

            const filterNodes = (nodes: TreeNode[]): TreeNode[] => {
                return nodes.reduce((filtered: TreeNode[], node) => {
                    const matches = node.name.toLowerCase().includes(searchQuery.toLowerCase());

                    if (matches) {
                        filtered.push(node);
                    } else if (node.children && node.children.length > 0) {
                        const filteredChildren = filterNodes(node.children);
                        if (filteredChildren.length > 0) {
                            filtered.push({
                                ...node,
                                children: filteredChildren,
                                isExpanded: true
                            });
                        }
                    }

                    return filtered;
                }, []);
            };

            return filterNodes(nodes);
        }, [nodes, searchQuery]);

        const getFileIcon = useCallback((node: TreeNode) => {
            if (node.type === 'folder') {
                return localExpandedNodes.includes(node.id) ?
                    <FolderOpen className="w-4 h-4 text-primary" /> :
                    <Folder className="w-4 h-4 text-primary" />;
            }

            const ext = node.extension?.toLowerCase();
            switch (ext) {
                case 'jpg':
                case 'jpeg':
                case 'png':
                case 'gif':
                case 'webp':
                    return <Image className="w-4 h-4 text-primary" />;
                case 'mp4':
                case 'avi':
                case 'mov':
                case 'mkv':
                    return <Video className="w-4 h-4 text-primary" />;
                case 'mp3':
                case 'wav':
                case 'flac':
                    return <Music className="w-4 h-4 text-pink-400" />;
                case 'zip':
                case 'rar':
                case '7z':
                    return <Archive className="w-4 h-4 text-primary" />;
                case 'js':
                case 'ts':
                case 'jsx':
                case 'tsx':
                case 'py':
                case 'java':
                case 'cpp':
                case 'c':
                case 'php':
                case 'html':
                case 'css':
                    return <Code className="w-4 h-4 text-primary" />;
                default:
                    return <FileText className="w-4 h-4 glass-text-secondary" />;
            }
        }, [localExpandedNodes]);

        const formatFileSize = useCallback((bytes?: number) => {
            if (!bytes) return '';
            const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
            const i = Math.floor(Math.log(bytes) / Math.log(1024));
            return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
        }, []);

        const formatDate = useCallback((date?: Date) => {
            if (!date) return '';
            return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }, []);

        const sizeClasses = {
            sm: 'glass-text-sm',
            md: 'glass-text-base',
            lg: 'glass-text-lg'
        };

        const variantClasses = {
            default: 'glass-p-4',
            compact: 'glass-p-2',
            minimal: 'glass-p-1'
        };

        const elevationClasses = {
            low: 'backdrop-blur-md bg-white/10 border border-white/20',
            medium: 'backdrop-blur-md bg-white/20 border border-white/30 shadow-lg',
            high: 'backdrop-blur-md bg-white/30 border border-white/40 shadow-2xl'
        };

        const TreeNodeComponent = ({ node, level = 0 }: { node: TreeNode; level?: number }) => {
            const isExpanded = localExpandedNodes.includes(node.id);
            const isSelected = selectedNodeId === node.id;
            const isDragOver = dragOverNode === node.id;
            const indent = level * 16;

            return (
                <div>
                    <div
                        className={cn(
                            'flex items-center glass-gap-1 glass-py-1 glass-px-2 glass-radius-md cursor-pointer hover:bg-white/10 transition-all duration-200 group relative',
                            'hover:-translate-y-0.5 glass-press',
                            isSelected && 'bg-blue-500/20 text-blue-300',
                            isDragOver && 'bg-green-500/20 ring-1 ring-green-400 glass-pulse-ring',
                            renamingNode === node.id && 'bg-white/5'
                        )}
                        style={{ paddingLeft: `${indent + 8}px` }}
                        onClick={(e) => handleSelect(node)}
                        draggable
                        onDragStart={(e) => handleDragStart(e, node)}
                        onDragOver={(e) => handleDragOver(e, node)}
                        onDragEnd={handleDragEnd}
                        onDrop={(e) => handleDrop(e, node)}
                    >
                        {/* Expand/Collapse Button */}
                        {node.type === 'folder' && node.canExpand && (
                            <GlassButton
                                variant="ghost"
                                size="sm"
                                className="w-4 h-4 p-0 hover:glass-surface-subtle/20"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleToggle(node);
                                }}
                            >
                                {isExpanded ? (
                                    <ChevronDown className="w-3 h-3" />
                                ) : (
                                    <ChevronRight className="w-3 h-3" />
                                )}
                            </GlassButton>
                        )}

                        {/* Spacer for files */}
                        {node.type === 'file' && (
                            <div className="w-4" />
                        )}

                        {/* Icon */}
                        {showIcons && (
                            <div className="flex-shrink-0">
                                {getFileIcon(node)}
                            </div>
                        )}

                        {/* Name */}
                        <div className="flex-1 min-w-0">
                            {renamingNode === node.id ? (
                                <div className="flex items-center gap-2">
                                    <GlassInput
                                        value={newName}
                                        onChange={(e) => setNewName(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') handleRenameSubmit();
                                            if (e.key === 'Escape') setRenamingNode(null);
                                        }}
                                        autoFocus
                                        className="flex-1 h-6 text-sm glass-pulse-ring"
                                    />
                                    <GlassButton
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleRenameSubmit}
                                        className="w-6 h-6 p-0"
                                    >
                                        <Check className="w-3 h-3" />
                                    </GlassButton>
                                    <GlassButton
                                        variant="ghost"
                                        size="sm"
                                        onClick={(e) => setRenamingNode(null)}
                                        className="w-6 h-6 p-0"
                                    >
                                        <X className="w-3 h-3" />
                                    </GlassButton>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <span className="truncate text-primary">{node.name}</span>
                                    {showSize && node.size && (
                                        <span className="text-xs text-primary/60">
                                            ({formatFileSize(node.size)})
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Modified Date */}
                        {showModified && node.modifiedAt && (
                            <div className="text-xs text-primary/60 hidden md:block">
                                {formatDate(node.modifiedAt)}
                            </div>
                        )}

                        {/* Context Menu */}
                        <GlassButton
                            variant="ghost"
                            size="sm"
                            className="w-6 h-6 p-0 opacity-0 group-hover:opacity-100 hover:glass-surface-subtle/20"
                            onClick={(e) => {
                                e.stopPropagation();
                                // Simple action for now
                                console.log('Context menu for:', node.name);
                            }}
                        >
                            <MoreVertical className="w-3 h-3" />
                        </GlassButton>
                    </div>

                    {/* Children */}
                    <AnimatePresence>
                        {isExpanded && node.children && node.children.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden"
                            >
                                {node.children.map((child) => (
                                    <TreeNodeComponent
                                        key={child.id}
                                        node={{ ...child, level: level + 1 }}
                                        level={level + 1}
                                    />
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Loading indicator */}
                    {isExpanded && node.isLoading && (
                        <div
                            className="flex items-center py-1"
                            style={{ paddingLeft: `${indent + 32}px` }}
                        >
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white glass-radius-full animate-spin" />
                            <span className="text-sm text-primary/60 glass-ml-2">Loading...</span>
                        </div>
                    )}
                </div>
            );
        };

        return (
            <div
                ref={ref}
                className={cn(
                    'glass-radius-xl overflow-hidden',
                    elevationClasses[elevation],
                    variantClasses[variant],
                    sizeClasses[size],
                    className
                )}
                {...props}
            >
                {/* Search */}
                <div className="mb-4">
                    <GlassInput
                        placeholder="Search files..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange?.(e.target.value)}
                        leftIcon={<Search className="w-4 h-4" />}
                    />
                </div>

                {/* Tree */}
                <div
                    className="overflow-y-auto"
                    style={{ maxHeight }}
                >
                    {filteredNodes.length > 0 ? (
                        filteredNodes.map((node) => (
                            <TreeNodeComponent key={node.id} node={node} />
                        ))
                    ) : (
                        <div className="text-center py-8 text-primary/60">
                            {searchQuery ? 'No files found' : 'No files to display'}
                        </div>
                    )}
                </div>

                {/* Create Node Dialog */}
                {creatingNode && (
                    <div className="fixed inset-0 glass-surface-dark/50 backdrop-blur-md z-50 flex items-center justify-center">
                        <div className="glass-radius-lg p-6 max-w-md w-full mx-4 glass-surface-subtle/5 ring-1 ring-white/10">
                            <h3 className="text-lg font-semibold text-primary mb-4">
                                Create New {creatingNode.type === 'folder' ? 'Folder' : 'File'}
                            </h3>
                            <GlassInput
                                placeholder={`${creatingNode.type === 'folder' ? 'Folder' : 'File'} name...`}
                                value={newNodeName}
                                onChange={(e) => setNewNodeName(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleCreateSubmit()}
                                className="mb-4"
                                autoFocus
                            />
                            <div className="flex gap-2">
                                <GlassButton
                                    variant="ghost"
                                    onClick={(e) => setCreatingNode(null)}
                                    className="flex-1"
                                >
                                    Cancel
                                </GlassButton>
                                <GlassButton
                                    variant="primary"
                                    onClick={handleCreateSubmit}
                                    disabled={!newNodeName.trim()}
                                    className="flex-1"
                                >
                                    Create
                                </GlassButton>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }
);

GlassFileTree.displayName = 'GlassFileTree';

export { GlassFileTree };
