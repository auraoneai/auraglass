'use client';

import { cn } from '../../lib/utilsComprehensive';
import {
    Activity,
    Circle,
    Clock,
    MapPin,
    MessageCircle,
    MoreHorizontal,
    Phone,
    Users,
    Video
} from 'lucide-react';
import React, { useCallback, useState } from 'react';
import { Motion } from '../../primitives';
import { GlassButton } from '../button';
import { CardContent, CardHeader, CardTitle, GlassCard } from '../card';
import { GlassBadge } from '../data-display';

export interface UserPresence {
    id: string;
    name: string;
    avatar?: string;
    status: 'online' | 'offline' | 'away' | 'busy' | 'invisible';
    lastSeen?: Date;
    location?: string;
    activity?: string;
    customStatus?: string;
    role?: 'admin' | 'moderator' | 'member' | 'guest';
}

export interface GlassUserPresenceProps {
    /**
     * Current user
     */
    currentUser?: UserPresence;
    /**
     * List of users to display
     */
    users: UserPresence[];
    /**
     * Show online count
     */
    showOnlineCount?: boolean;
    /**
     * Show user roles
     */
    showRoles?: boolean;
    /**
     * Show user locations
     */
    showLocations?: boolean;
    /**
     * Show user activities
     */
    showActivities?: boolean;
    /**
     * Enable user actions
     */
    enableActions?: boolean;
    /**
     * Enable status updates
     */
    enableStatusUpdate?: boolean;
    /**
     * Group users by status
     */
    groupByStatus?: boolean;
    /**
     * Compact mode
     */
    compact?: boolean;
    /**
     * Max users to display
     */
    maxUsers?: number;
    /**
     * User click handler
     */
    onUserClick?: (user: UserPresence) => void;
    /**
     * User action handler
     */
    onUserAction?: (userId: string, action: string) => void;
    /**
     * Status change handler
     */
    onStatusChange?: (status: UserPresence['status']) => void;
    /**
     * Custom className
     */
    className?: string;
}

/**
 * GlassUserPresence component
 * Display user presence status with avatars and online indicators
 */
export const GlassUserPresence: React.FC<GlassUserPresenceProps> = ({
    currentUser,
    users,
    showOnlineCount = true,
    showRoles = false,
    showLocations = false,
    showActivities = false,
    enableActions = false,
    enableStatusUpdate = false,
    groupByStatus = false,
    compact = false,
    maxUsers,
    onUserClick,
    onUserAction,
    onStatusChange,
    className,
    ...props
}) => {
    const [showAllUsers, setShowAllUsers] = useState(false);

    // Get status color and icon
    const getStatusConfig = useCallback((status: UserPresence['status']) => {
        switch (status) {
            case 'online':
                return {
                    color: 'bg-green-400',
                    borderColor: 'border-green-400',
                    textColor: 'text-green-400',
                    icon: Circle,
                    label: 'Online'
                };
            case 'away':
                return {
                    color: 'bg-yellow-400',
                    borderColor: 'border-yellow-400',
                    textColor: 'text-yellow-400',
                    icon: Clock,
                    label: 'Away'
                };
            case 'busy':
                return {
                    color: 'bg-red-400',
                    borderColor: 'border-red-400',
                    textColor: 'text-red-400',
                    icon: Circle,
                    label: 'Busy'
                };
            case 'invisible':
                return {
                    color: 'bg-gray-400',
                    borderColor: 'border-gray-400',
                    textColor: 'glass-text-secondary',
                    icon: Circle,
                    label: 'Invisible'
                };
            default:
                return {
                    color: 'bg-gray-400',
                    borderColor: 'border-gray-400',
                    textColor: 'glass-text-secondary',
                    icon: Circle,
                    label: 'Offline'
                };
        }
    }, []);

    // Get role badge
    const getRoleBadge = useCallback((role?: string) => {
        switch (role) {
            case 'admin':
                return <GlassBadge variant="destructive" size="sm">Admin</GlassBadge>;
            case 'moderator':
                return <GlassBadge variant="warning" size="sm">Mod</GlassBadge>;
            case 'member':
                return <GlassBadge variant="secondary" size="sm">Member</GlassBadge>;
            case 'guest':
                return <GlassBadge variant="outline" size="sm">Guest</GlassBadge>;
            default:
                return null;
        }
    }, []);

    // Format last seen time
    const formatLastSeen = useCallback((date: Date) => {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days === 1) return 'Yesterday';
        if (days < 7) return `${days}d ago`;
        return date.toLocaleDateString();
    }, []);

    // Handle status change
    const handleStatusChange = useCallback((status: UserPresence['status']) => {
        onStatusChange?.(status);
    }, [onStatusChange]);

    // Filter and sort users
    const processedUsers = users
        .filter(user => user.status !== 'invisible' || user.id === currentUser?.id)
        .sort((a, b) => {
            // Sort by status priority
            const statusOrder: Record<UserPresence['status'], number> = {
                online: 0,
                away: 1,
                busy: 2,
                offline: 3,
                invisible: 4
            };
            const aOrder = statusOrder[a.status] ?? 3;
            const bOrder = statusOrder[b.status] ?? 3;

            if (aOrder !== bOrder) return aOrder - bOrder;

            // Then by name
            return a.name.localeCompare(b.name);
        });

    const displayUsers = showAllUsers || !maxUsers ? processedUsers : processedUsers.slice(0, maxUsers);
    const onlineCount = users.filter(user => user.status === 'online').length;

    // Group users by status
    const groupedUsers = processedUsers.reduce((groups, user) => {
        if (!groups[user.status]) {
            groups[user.status] = [];
        }
        groups[user.status].push(user);
        return groups;
    }, {} as Record<string, UserPresence[]>);

    return (
        <Motion preset="fadeIn" className="w-full">
            <GlassCard className={cn('overflow-hidden', className)} {...props}>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-primary text-lg font-semibold flex items-center gap-2">
                            <Users className="w-5 h-5" />
                            Team Presence
                        </CardTitle>

                        {showOnlineCount && (
                            <GlassBadge variant="secondary">
                                {onlineCount} online
                            </GlassBadge>
                        )}
                    </div>
                </CardHeader>

                <CardContent className="pt-0">
                    {/* Current user status */}
                    {currentUser && enableStatusUpdate && (
                        <div className="mb-6 p-3 glass-surface-subtle/5 glass-radius-lg">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <div className="w-10 h-10 glass-radius-full glass-surface-subtle/20 flex items-center justify-center">
                                            {currentUser.avatar ? (
                                                <img
                                                    src={currentUser.avatar}
                                                    alt={currentUser.name}
                                                    className="w-full h-full glass-radius-full object-cover"
                                                />
                                            ) : (
                                                <span className="text-primary font-medium">
                                                    {currentUser.name.charAt(0).toUpperCase()}
                                                </span>
                                            )}
                                        </div>
                                        <div className={cn(
                                            'absolute -bottom-1 -right-1 w-4 h-4 glass-radius-full border-2 border-black',
                                            getStatusConfig(currentUser.status).color
                                        )} />
                                    </div>

                                    <div>
                                        <p className="text-primary font-medium">{currentUser.name}</p>
                                        <p className="text-primary/60 text-sm">Set your status</p>
                                    </div>
                                </div>

                                <div className="flex gap-1">
                                    {(['online', 'away', 'busy', 'invisible'] as const).map((status) => {
                                        const config = getStatusConfig(status);
                                        const IconComponent = config.icon;

                                        return (
                                            <GlassButton
                                                key={status}
                                                variant={currentUser.status === status ? "primary" : "ghost"}
                                                size="sm"
                                                onClick={(e) => handleStatusChange(status)}
                                                className="p-2"
                                                title={config.label}
                                            >
                                                <IconComponent className="w-3 h-3" />
                                            </GlassButton>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* User list */}
                    {groupByStatus ? (
                        // Grouped by status
                        <div className="gap-4">
                            {Object.entries(groupedUsers).map(([status, statusUsers]) => {
                                const config = getStatusConfig(status as UserPresence['status']);

                                return (
                                    <div key={status}>
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className={cn('w-2 h-2 glass-radius-full', config.color)} />
                                            <span className="text-primary/80 text-sm font-medium">
                                                {config.label} ({statusUsers.length})
                                            </span>
                                        </div>

                                        <div className="gap-2">
                                            {statusUsers.map((user) => (
                                                <UserPresenceItem
                                                    key={user.id}
                                                    user={user}
                                                    compact={compact}
                                                    showRoles={showRoles}
                                                    showLocations={showLocations}
                                                    showActivities={showActivities}
                                                    enableActions={enableActions}
                                                    onUserClick={onUserClick}
                                                    onUserAction={onUserAction}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        // Flat list
                        <div className="gap-2">
                            {displayUsers.map((user) => (
                                <UserPresenceItem
                                    key={user.id}
                                    user={user}
                                    compact={compact}
                                    showRoles={showRoles}
                                    showLocations={showLocations}
                                    showActivities={showActivities}
                                    enableActions={enableActions}
                                    onUserClick={onUserClick}
                                    onUserAction={onUserAction}
                                />
                            ))}

                            {/* Show more button */}
                            {maxUsers && users.length > maxUsers && !showAllUsers && (
                                <GlassButton
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => setShowAllUsers(true)}
                                    className="w-full glass-mt-2"
                                >
                                    Show {users.length - maxUsers} more
                                </GlassButton>
                            )}
                        </div>
                    )}
                </CardContent>
            </GlassCard>
        </Motion>
    );
};

// Individual user presence item
interface UserPresenceItemProps {
    user: UserPresence;
    compact?: boolean;
    showRoles?: boolean;
    showLocations?: boolean;
    showActivities?: boolean;
    enableActions?: boolean;
    onUserClick?: (user: UserPresence) => void;
    onUserAction?: (userId: string, action: string) => void;
}

const UserPresenceItem: React.FC<UserPresenceItemProps> = ({
    user,
    compact = false,
    showRoles = false,
    showLocations = false,
    showActivities = false,
    enableActions = false,
    onUserClick,
    onUserAction
}) => {
    const config = getStatusConfig(user.status);

    // Helper function (defined here since it's used in this component)
    function getStatusConfig(status: UserPresence['status']) {
        switch (status) {
            case 'online':
                return { color: 'bg-green-400', textColor: 'text-green-400', label: 'Online' };
            case 'away':
                return { color: 'bg-yellow-400', textColor: 'text-yellow-400', label: 'Away' };
            case 'busy':
                return { color: 'bg-red-400', textColor: 'text-red-400', label: 'Busy' };
            case 'invisible':
                return { color: 'bg-gray-400', textColor: 'glass-text-secondary', label: 'Invisible' };
            default:
                return { color: 'bg-gray-400', textColor: 'glass-text-secondary', label: 'Offline' };
        }
    }

    const formatLastSeen = (date: Date) => {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days === 1) return 'Yesterday';
        if (days < 7) return `${days}d ago`;
        return date.toLocaleDateString();
    };

    const getRoleBadge = (role?: string) => {
        switch (role) {
            case 'admin':
                return <GlassBadge variant="destructive" size="sm">Admin</GlassBadge>;
            case 'moderator':
                return <GlassBadge variant="warning" size="sm">Mod</GlassBadge>;
            case 'member':
                return <GlassBadge variant="secondary" size="sm">Member</GlassBadge>;
            case 'guest':
                return <GlassBadge variant="outline" size="sm">Guest</GlassBadge>;
            default:
                return null;
        }
    };

    return (
        <Motion
            preset="fadeIn"
            className={cn(
                'flex items-center glass-gap-3 glass-p-2 glass-radius-lg hover:bg-white/5 cursor-pointer transition-all duration-200',
                compact && 'glass-p-1'
            )}
            onClick={(e) => onUserClick?.(user)}
        >
            {/* Avatar */}
            <div className="relative flex-shrink-0">
                <div className={cn(
                    'glass-radius-full bg-white/20 flex items-center justify-center',
                    compact ? 'w-8 h-8' : 'w-10 h-10'
                )}>
                    {user.avatar ? (
                        <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-full h-full glass-radius-full object-cover"
                        />
                    ) : (
                        <span className={cn(
                            'glass-text-primary font-medium',
                            compact ? 'glass-text-sm' : 'glass-text-base'
                        )}>
                            {user.name.charAt(0).toUpperCase()}
                        </span>
                    )}
                </div>

                {/* Status indicator */}
                <div className={cn(
                    'absolute -bottom-1 -right-1 w-3 h-3 glass-radius-full border-2 border-black',
                    config.color,
                    compact && 'w-2 h-2 -bottom-0.5 -right-0.5'
                )} />
            </div>

            {/* User info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <p className={cn(
                        'glass-text-primary font-medium truncate',
                        compact ? 'glass-text-sm' : 'glass-text-base'
                    )}>
                        {user.name}
                    </p>

                    {showRoles && getRoleBadge(user.role)}
                </div>

                {!compact && (
                    <div className="gap-1">
                        {/* Status and last seen */}
                        <div className="flex items-center gap-2">
                            <span className={cn('glass-text-xs', config.textColor)}>
                                {config.label}
                            </span>

                            {user.status === 'offline' && user.lastSeen && (
                                <>
                                    <span className="text-primary/40 text-xs">•</span>
                                    <span className="text-primary/60 text-xs">
                                        {formatLastSeen(user.lastSeen)}
                                    </span>
                                </>
                            )}
                        </div>

                        {/* Custom status */}
                        {user.customStatus && (
                            <p className="text-primary/70 text-xs truncate">
                                {user.customStatus}
                            </p>
                        )}

                        {/* Activity */}
                        {showActivities && user.activity && (
                            <div className="flex items-center gap-1 text-primary/60 text-xs">
                                <Activity className="w-3 h-3" />
                                <span className="truncate">{user.activity}</span>
                            </div>
                        )}

                        {/* Location */}
                        {showLocations && user.location && (
                            <div className="flex items-center gap-1 text-primary/60 text-xs">
                                <MapPin className="w-3 h-3" />
                                <span className="truncate">{user.location}</span>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Actions */}
            {enableActions && (
                <div className="flex items-center gap-1">
                    <GlassButton
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            onUserAction?.(user.id, 'message');
                        }}
                        className="p-1"
                    >
                        <MessageCircle className="w-3 h-3" />
                    </GlassButton>

                    <GlassButton
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            onUserAction?.(user.id, 'call');
                        }}
                        className="p-1"
                    >
                        <Phone className="w-3 h-3" />
                    </GlassButton>

                    <GlassButton
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            onUserAction?.(user.id, 'video');
                        }}
                        className="p-1"
                    >
                        <Video className="w-3 h-3" />
                    </GlassButton>

                    <GlassButton
                        variant="ghost"
                        size="sm"
                        onClick={(e) => e.stopPropagation()}
                        className="p-1"
                    >
                        <MoreHorizontal className="w-3 h-3" />
                    </GlassButton>
                </div>
            )}
        </Motion>
    );
};

export default GlassUserPresence;
