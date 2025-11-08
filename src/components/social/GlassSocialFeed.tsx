import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

import React, { forwardRef, useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { OptimizedGlass } from "../../primitives";
import { useA11yId } from "../../utils/a11y";
import { useMotionPreference } from "../../hooks/useMotionPreference";
import { createGlassStyle } from "../../utils/createGlassStyle";

export interface SocialPost {
  id: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
    username: string;
    verified?: boolean;
  };
  content: string;
  timestamp: Date;
  likes: number;
  shares: number;
  comments: number;
  media?: {
    type: "image" | "video" | "gif";
    url: string;
    thumbnail?: string;
    alt?: string;
  }[];
  isLiked?: boolean;
  isShared?: boolean;
  tags?: string[];
  mentions?: string[];
}

export interface GlassSocialFeedProps {
  posts: SocialPost[];
  currentUserId?: string;
  showInteractions?: boolean;
  showTimestamps?: boolean;
  showMedia?: boolean;
  showTags?: boolean;
  compactMode?: boolean;
  maxHeight?: number;
  infiniteScroll?: boolean;
  realTimeUpdates?: boolean;
  sortBy?: "timestamp" | "likes" | "engagement";
  filterBy?: "all" | "following" | "liked";
  onLike?: (postId: string) => void;
  onShare?: (postId: string) => void;
  onComment?: (postId: string) => void;
  onUserClick?: (userId: string) => void;
  onPostClick?: (postId: string) => void;
  onLoadMore?: () => void;
  className?: string;
}

const engagementLevels = {
  low: { color: "var(--glass-gray-500)", icon: "📊" },
  medium: { color: "var(--glass-color-success)", icon: "📈" },
  high: { color: "var(--glass-color-warning)", icon: "🔥" },
  viral: { color: "var(--glass-color-danger)", icon: "🚀" },
};

export const GlassSocialFeed = forwardRef<HTMLDivElement, GlassSocialFeedProps>(
  (
    {
      posts,
      currentUserId,
      showInteractions = true,
      showTimestamps = true,
      showMedia = true,
      showTags = true,
      compactMode = false,
      maxHeight,
      infiniteScroll = false,
      realTimeUpdates = false,
      sortBy = "timestamp",
      filterBy = "all",
      onLike,
      onShare,
      onComment,
      onUserClick,
      onPostClick,
      onLoadMore,
      className = "",
      ...props
    },
    ref
  ) => {
    const prefersReducedMotion = useReducedMotion();
    const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
    const [sharedPosts, setSharedPosts] = useState<Set<string>>(new Set());
    const [expandedPosts, setExpandedPosts] = useState<Set<string>>(new Set());
    const [simulatedPosts, setSimulatedPosts] = useState(posts);
    const id = useA11yId("glass-social-feed");

    // Motion preference hook
    const { shouldAnimate } = useMotionPreference();

    // Helper function to respect motion preferences
    const respectMotionPreference = (config: any) =>
      shouldAnimate ? config : { duration: 0 };

    // Simulated real-time updates
    useEffect(() => {
      if (!realTimeUpdates) return;

      const interval = setInterval(() => {
        setSimulatedPosts((prev: any) =>
          prev.map((post: any) => ({
            ...post,
            likes:
              post.likes +
              (Math.random() < 0.3 ? Math.floor(Math.random() * 3) : 0),
            comments: post.comments + (Math.random() < 0.2 ? 1 : 0),
            shares: post.shares + (Math.random() < 0.15 ? 1 : 0),
          }))
        );
      }, 5000);

      return () => clearInterval(interval);
    }, [realTimeUpdates]);

    const processedPosts = useMemo(() => {
      let filtered = [...simulatedPosts];

      // Apply filters
      switch (filterBy) {
        case "following":
          // In a real app, this would filter by followed users
          filtered = filtered.filter((post: any) => post.author.verified);
          break;
        case "liked":
          filtered = filtered.filter((post: any) => likedPosts.has(post.id));
          break;
      }

      // Apply sorting
      switch (sortBy) {
        case "likes":
          filtered.sort((a, b) => b.likes - a.likes);
          break;
        case "engagement":
          filtered.sort(
            (a, b) =>
              b.likes +
              b.comments +
              b.shares -
              (a.likes + a.comments + a.shares)
          );
          break;
        default:
          filtered.sort(
            (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
          );
      }

      return filtered;
    }, [simulatedPosts, filterBy, sortBy, likedPosts]);

    const formatTimeAgo = (timestamp: Date) => {
      const now = new Date();
      const diff = now.getTime() - timestamp.getTime();
      const minutes = Math.floor(diff / 60000);
      const hours = Math.floor(diff / 3600000);
      const days = Math.floor(diff / 86400000);

      if (minutes < 1) return "Just now";
      if (minutes < 60) return `${minutes}m`;
      if (hours < 24) return `${hours}h`;
      if (days < 7) return `${days}d`;
      return timestamp.toLocaleDateString();
    };

    const getEngagementLevel = (post: SocialPost) => {
      const total = post.likes + post.comments + post.shares;
      if (total > 1000) return "viral";
      if (total > 100) return "high";
      if (total > 10) return "medium";
      return "low";
    };

    const handleLike = (postId: string) => {
      setLikedPosts((prev: Set<string>) => {
        const newSet = new Set(prev);
        if (newSet.has(postId)) {
          newSet.delete(postId);
        } else {
          newSet.add(postId);
        }
        return newSet;
      });
      onLike?.(postId);
    };

    const handleShare = (postId: string) => {
      setSharedPosts((prev: Set<string>) => new Set(prev).add(postId));
      onShare?.(postId);
    };

    const handlePostExpand = (postId: string) => {
      setExpandedPosts((prev: Set<string>) => {
        const newSet = new Set(prev);
        if (newSet.has(postId)) {
          newSet.delete(postId);
        } else {
          newSet.add(postId);
        }
        return newSet;
      });
    };

    const PostCard = ({ post, index }: { post: SocialPost; index: number }) => {
      const isExpanded = expandedPosts.has(post.id);
      const isLiked = likedPosts.has(post.id);
      const isShared = sharedPosts.has(post.id);
      const engagement = getEngagementLevel(post);
      const shouldTruncate = !compactMode && post.content.length > 200;

      return (
        <motion.div
          layout
          initial={{ opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={respectMotionPreference({
            duration: 0.3,
            delay: index * 0.05,
          })}
          className={`
            relative p-4 rounded-lg cursor-pointer transition-all duration-200
            ${createGlassStyle({ variant: "default" })}
            hover:bg-white/5 border border-white/10
          `}
          onClick={() => onPostClick?.(post.id)}
        >
          {/* Author header */}
          <div className="glass-flex glass-items-start space-x-3 mb-3">
            <motion.div
              className="relative cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onUserClick?.(post.author.id);
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div
                className={`
                ${compactMode ? "w-8 h-8" : "w-12 h-12"}
                rounded-full bg-gradient-to-br from-gray-300 to-gray-500
                flex items-center justify-center text-white font-semibold
                ${createGlassStyle({ variant: "default" })}
              `}
              >
                {post.author.avatar ? (
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="glass-w-full glass-h-full glass-radius-full object-cover"
                  />
                ) : (
                  post.author.name.charAt(0).toUpperCase()
                )}
              </div>
              {post.author.verified && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 glass-surface-blue glass-radius-full glass-flex glass-items-center glass-justify-center">
                  <span className="text-primary glass-text-xs">✓</span>
                </div>
              )}
            </motion.div>

            <div className="glass-flex-1 glass-min-w-0">
              <div className="glass-flex glass-items-center space-x-2">
                <h4
                  className={`
                  font-semibold text-white/90 truncate
                  ${compactMode ? "text-sm" : "text-base"}
                `}
                >
                  {post.author.name}
                </h4>
                <span
                  className={`
                  text-white/60
                  ${compactMode ? "text-xs" : "text-sm"}
                `}
                >
                  @{post.author.username}
                </span>
                <div
                  className="w-2 h-2 glass-radius-full"
                  style={{
                    backgroundColor: engagementLevels[engagement].color,
                  }}
                  title={`${engagement} engagement`}
                />
              </div>
              {showTimestamps && (
                <p
                  className={`
                  text-white/50
                  ${compactMode ? "text-xs" : "text-sm"}
                `}
                >
                  {formatTimeAgo(post.timestamp)}
                </p>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="mb-3">
            <p
              className={`
              text-white/90 leading-relaxed
              ${compactMode ? "text-sm" : "text-base"}
            `}
            >
              {shouldTruncate && !isExpanded
                ? `${post.content.slice(0, 200)}...`
                : post.content}
              {shouldTruncate && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePostExpand(post.id);
                  }}
                  className="ml-2 text-primary hover:glass-text-secondary glass-text-sm font-medium glass-focus glass-touch-target glass-contrast-guard"
                >
                  {isExpanded ? "Show less" : "Show more"}
                </button>
              )}
            </p>

            {/* Tags */}
            {showTags && post.tags && post.tags.length > 0 && (
              <div className="glass-flex glass-flex-wrap glass-gap-2 mt-2">
                {post.tags.map((tag: any) => (
                  <span
                    key={tag}
                    className={`
                      px-2 py-1 text-xs rounded-full bg-blue-500/20 text-blue-300 
                      hover:bg-blue-500/30 cursor-pointer transition-colors duration-200
                    `}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Media */}
          {showMedia && post.media && post.media.length > 0 && (
            <div className="mb-3 glass-radius-lg overflow-hidden">
              <div
                className={`
                grid gap-2
                ${post.media.length === 1 ? "grid-cols-1" : "grid-cols-2"}
              `}
              >
                {post.media.slice(0, 4).map((media, mediaIndex) => (
                  <div
                    key={mediaIndex}
                    className="relative aspect-square glass-surface-subtle/5 glass-radius-lg overflow-hidden"
                  >
                    {media.type === "image" ? (
                      <img
                        src={media.url}
                        alt={media.alt || "Post media"}
                        className="glass-w-full glass-h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    ) : media.type === "video" ? (
                      <video
                        src={media.url}
                        poster={media.thumbnail}
                        className="glass-w-full glass-h-full object-cover"
                        controls
                      />
                    ) : (
                      <img
                        src={media.url}
                        alt={media.alt || "GIF"}
                        className="glass-w-full glass-h-full object-cover"
                      />
                    )}
                    {post.media &&
                      post.media.length > 4 &&
                      mediaIndex === 3 && (
                        <div className="absolute inset-0 glass-surface-dark/60 glass-flex glass-items-center glass-justify-center">
                          <span className="text-primary font-semibold">
                            +{post.media.length - 3} more
                          </span>
                        </div>
                      )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Interactions */}
          {showInteractions && (
            <div className="glass-flex glass-items-center glass-justify-between pt-3 glass-border-t glass-border-white/10">
              <div className="glass-flex glass-items-center space-x-6">
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLike(post.id);
                  }}
                  className={`
                    flex items-center space-x-2 text-sm transition-colors duration-200
                    ${isLiked ? "text-red-400" : "text-white/60 hover:text-red-400"}
                  `}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>{isLiked ? "❤️" : "🤍"}</span>
                  <span>{post.likes + (isLiked ? 1 : 0)}</span>
                </motion.button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onComment?.(post.id);
                  }}
                  className="glass-flex glass-items-center space-x-2 glass-text-sm text-primary/60 hover:text-primary transition-colors duration-200 glass-focus glass-touch-target glass-contrast-guard"
                >
                  <span>💬</span>
                  <span>{post.comments}</span>
                </button>

                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShare(post.id);
                  }}
                  className={`
                    flex items-center space-x-2 text-sm transition-colors duration-200
                    ${isShared ? "text-green-400" : "text-white/60 hover:text-green-400"}
                  `}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>🔄</span>
                  <span>{post.shares + (isShared ? 1 : 0)}</span>
                </motion.button>
              </div>

              <div className="glass-flex glass-items-center space-x-2 glass-text-sm text-primary/50">
                <span>{engagementLevels[engagement].icon}</span>
                <span>{post.likes + post.comments + post.shares}</span>
              </div>
            </div>
          )}
        </motion.div>
      );
    };

    return (
      <OptimizedGlass
        ref={ref}
        variant="frosted"
        className={`${className}`}
        style={{ maxHeight }}
        {...props}
      >
        <div className="glass-p-4 space-y-4">
          {/* Feed controls */}
          <div className="glass-flex glass-items-center glass-justify-between">
            <h2 className="glass-text-lg font-semibold text-primary/90">
              Social Feed ({processedPosts.length})
            </h2>
            <div className="glass-flex glass-items-center space-x-2 glass-text-sm">
              {realTimeUpdates && (
                <div className="glass-flex glass-items-center space-x-1 text-primary">
                  <div className="w-2 h-2 glass-surface-green glass-radius-full animate-pulse" />
                  <span>Live</span>
                </div>
              )}
              <select
                value={sortBy}
                onChange={(e) => {
                  /* Would update sortBy in real implementation */
                }}
                className="glass-surface-subtle/10 glass-border glass-border-white/20 glass-radius glass-px-2 glass-py-1 text-primary glass-text-sm glass-focus glass-touch-target glass-contrast-guard"
              >
                <option value="timestamp">Latest</option>
                <option value="likes">Most Liked</option>
                <option value="engagement">Most Engaging</option>
              </select>
            </div>
          </div>

          {/* Posts */}
          <div
            className={`
              space-y-4 
              ${maxHeight ? "overflow-y-auto" : ""}
            `}
          >
            <AnimatePresence>
              {processedPosts.map((post, index) => (
                <PostCard key={post.id} post={post} index={index} />
              ))}
            </AnimatePresence>

            {/* Load more */}
            {infiniteScroll && onLoadMore && (
              <motion.button
                onClick={onLoadMore}
                className={`
                  w-full p-4 rounded-lg text-sm font-medium text-white/70 
                  hover:text-white hover:bg-white/5 transition-colors duration-200
                  ${createGlassStyle({ variant: "default" })}
                  border border-white/10
                `}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Load More Posts
              </motion.button>
            )}
          </div>

          {/* Empty state */}
          {processedPosts.length === 0 && (
            <div className="text-center glass-py-12">
              <div className="text-6xl mb-4">📱</div>
              <h3 className="glass-text-lg font-semibold text-primary/70 mb-2">
                No posts to show
              </h3>
              <p className="text-primary/50">
                {filterBy === "liked"
                  ? "You haven't liked any posts yet"
                  : "Your feed is empty. Try following some users!"}
              </p>
            </div>
          )}
        </div>
      </OptimizedGlass>
    );
  }
);
