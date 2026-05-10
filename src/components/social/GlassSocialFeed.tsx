"use client";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

import React, { forwardRef, useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { OptimizedGlass } from "../../primitives";
import { useA11yId } from "../../utils/a11y";
import { useMotionPreference } from "../../hooks/useMotionPreference";
import { createGlassStyle } from "../../utils/createGlassStyle";
import { ANIMATION } from "../../tokens/designConstants";
import { ContrastGuard } from "../accessibility/ContrastGuard";

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
    const sortSelectId = useA11yId("glass-social-sort");

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
      }, ANIMATION.DURATION.slower * 7);

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
            duration: ANIMATION.DURATION.normal / 1000,
            delay: index * 0.05,
          })}
          className="glass-relative glass-p-4 glass-radius-lg glass-cursor-pointer glass-transition-all glass-border glass-border-white/10"
          style={{
            ...createGlassStyle({ variant: "default", radius: "lg" }),
            transitionDuration: `${ANIMATION.DURATION.fast}ms`,
          }}
          onClick={() => onPostClick?.(post.id)}
        >
          {/* Author header */}
          <div className="glass-flex glass-items-start glass-space-x-3 glass-mb-3">
            <motion.div
              className="glass-relative glass-cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onUserClick?.(post.author.id);
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div
                className={cn(
                  "glass-radius-full glass-flex glass-items-center glass-justify-center glass-text-primary glass-font-semibold glass-overflow-hidden",
                  compactMode ? "glass-w-8 glass-h-8" : "glass-w-12 glass-h-12"
                )}
                style={createGlassStyle({ variant: "default", radius: "full" })}
              >
                {post.author.avatar ? (
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="glass-w-full glass-h-full glass-radius-full glass-object-cover"
                  />
                ) : (
                  post.author.name.charAt(0).toUpperCase()
                )}
              </div>
              {post.author.verified && (
                <div
                  className="glass-absolute glass-w-4 glass-h-4 glass-surface-primary glass-radius-full glass-flex glass-items-center glass-justify-center"
                  style={{ right: -4, bottom: -4 }}
                >
                  <span className="glass-text-primary glass-text-xs">✓</span>
                </div>
              )}
            </motion.div>

            <div className="glass-flex-1 glass-min-w-0">
              <div className="glass-flex glass-items-center glass-space-x-2">
                <h3
                  className={cn(
                    "glass-font-semibold glass-text-primary glass-truncate",
                    compactMode ? "glass-text-sm" : "glass-text-base"
                  )}
                >
                  {post.author.name}
                </h3>
                <span
                  className={cn(
                    "glass-text-secondary",
                    compactMode ? "glass-text-xs" : "glass-text-sm"
                  )}
                >
                  @{post.author.username}
                </span>
                <div
                  className="glass-w-2 glass-h-2 glass-radius-full"
                  style={{
                    backgroundColor: engagementLevels[engagement].color,
                  }}
                  title={`${engagement} engagement`}
                />
              </div>
              {showTimestamps && (
                <p
                  className={cn(
                    "glass-text-tertiary",
                    compactMode ? "glass-text-xs" : "glass-text-sm"
                  )}
                >
                  {formatTimeAgo(post.timestamp)}
                </p>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="glass-mb-3">
            <p
              className={cn(
                "glass-text-primary glass-leading-relaxed",
                compactMode ? "glass-text-sm" : "glass-text-base"
              )}
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
                  className="glass-ml-2 glass-text-primary hover:glass-text-secondary glass-text-sm glass-font-medium glass-focus glass-touch-target glass-contrast-guard"
                >
                  {isExpanded ? "Show less" : "Show more"}
                </button>
              )}
            </p>

            {/* Tags */}
            {showTags && post.tags && post.tags.length > 0 && (
              <div className="glass-flex glass-flex-wrap glass-gap-2 glass-mt-2">
                {post.tags.map((tag: any) => (
                  <span
                    key={tag}
                    className="glass-px-2 glass-py-1 glass-text-xs glass-radius-full glass-surface-info glass-text-primary glass-cursor-pointer glass-transition-colors"
                    style={{
                      transitionDuration: `${ANIMATION.DURATION.fast}ms`,
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Media */}
          {showMedia && post.media && post.media.length > 0 && (
            <div className="glass-mb-3 glass-radius-lg glass-overflow-hidden">
              <div
                className={cn(
                  "glass-grid glass-gap-2",
                  post.media.length === 1
                    ? "glass-grid-cols-1"
                    : "glass-grid-cols-2"
                )}
              >
                {post.media.slice(0, 4).map((media, mediaIndex) => (
                  <div
                    key={mediaIndex}
                    className="glass-relative glass-aspect-square glass-surface-subtle/5 glass-radius-lg glass-overflow-hidden"
                  >
                    {media.type === "image" ? (
                      <img
                        src={media.url}
                        alt={media.alt || "Post media"}
                        className="glass-w-full glass-h-full glass-object-cover glass-hover-scale-105"
                        style={{
                          transition: `transform ${ANIMATION.DURATION.normal}ms ease`,
                        }}
                      />
                    ) : media.type === "video" ? (
                      <video
                        src={media.url}
                        poster={media.thumbnail}
                        className="glass-w-full glass-h-full glass-object-cover"
                        controls
                      />
                    ) : (
                      <img
                        src={media.url}
                        alt={media.alt || "GIF"}
                        className="glass-w-full glass-h-full glass-object-cover"
                      />
                    )}
                    {post.media &&
                      post.media.length > 4 &&
                      mediaIndex === 3 && (
                        <div
                          className="glass-absolute glass-inset-0 glass-flex glass-items-center glass-justify-center"
                          style={{
                            background:
                              '/* Use createGlassStyle({ intent: "primary", elevation: "level2" }) */',
                          }}
                        >
                          <span className="glass-text-primary glass-font-semibold">
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
            <div className="glass-flex glass-items-center glass-justify-between glass-pt-3 glass-border-t glass-border-white/10">
              <div className="glass-flex glass-items-center glass-space-x-6">
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLike(post.id);
                  }}
                  className={cn(
                    "glass-flex glass-items-center glass-space-x-2 glass-text-sm glass-transition-colors glass-focus glass-touch-target glass-contrast-guard",
                    isLiked ? "glass-text-danger" : "glass-text-secondary"
                  )}
                  style={{ transitionDuration: `${ANIMATION.DURATION.fast}ms` }}
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
                  className="glass-flex glass-items-center glass-space-x-2 glass-text-sm glass-text-secondary glass-transition-colors glass-focus glass-touch-target glass-contrast-guard"
                  style={{ transitionDuration: "200ms" }}
                >
                  <span>💬</span>
                  <span>{post.comments}</span>
                </button>

                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShare(post.id);
                  }}
                  className={cn(
                    "glass-flex glass-items-center glass-space-x-2 glass-text-sm glass-transition-colors glass-focus glass-touch-target glass-contrast-guard",
                    isShared ? "glass-text-success" : "glass-text-secondary"
                  )}
                  style={{ transitionDuration: `${ANIMATION.DURATION.fast}ms` }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>🔄</span>
                  <span>{post.shares + (isShared ? 1 : 0)}</span>
                </motion.button>
              </div>

              <div className="glass-flex glass-items-center glass-space-x-2 glass-text-sm glass-text-primary-glass-opacity-50">
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
        style={{
          maxHeight,
          overflowY: maxHeight ? "auto" : undefined,
          overflowX: "hidden",
        }}
        {...props}
      >
        <div className="glass-p-4 glass-space-y-4">
          {/* Feed controls */}
          <div className="glass-flex glass-items-center glass-justify-between">
            <h2 className="glass-text-lg glass-font-semibold glass-text-primary-glass-opacity-90">
              Social Feed ({processedPosts.length})
            </h2>
            <div className="glass-flex glass-items-center glass-space-x-2 glass-text-sm">
              {realTimeUpdates && (
                <div className="glass-flex glass-items-center glass-space-x-1 glass-text-primary">
                  <div className="glass-w-2 glass-h-2 glass-surface-success glass-radius-full glass-animate-pulse" />
                  <span>Live</span>
                </div>
              )}
              <label htmlFor={sortSelectId} className="glass-sr-only">
                Sort posts by
              </label>
              <select
                id={sortSelectId}
                value={sortBy}
                onChange={(e) => {
                  /* Would update sortBy in real implementation */
                }}
                className="glass-surface-subtle/10 glass-border glass-border-white/20 glass-radius glass-px-2 glass-py-1 glass-text-primary glass-text-sm glass-focus glass-touch-target glass-contrast-guard"
                aria-label="Sort posts by"
              >
                <option value="timestamp">Latest</option>
                <option value="likes">Most Liked</option>
                <option value="engagement">Most Engaging</option>
              </select>
            </div>
          </div>

          {/* Posts */}
          <div
            className={cn(
              "glass-space-y-4",
              maxHeight && "glass-overflow-y-auto"
            )}
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
                className="glass-w-full glass-p-4 glass-radius-lg glass-text-sm glass-font-medium glass-text-secondary glass-transition-colors glass-border glass-border-white/10 glass-focus glass-touch-target glass-contrast-guard"
                style={{
                  ...createGlassStyle({ variant: "default", radius: "lg" }),
                  transitionDuration: "200ms",
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Load More Posts
              </motion.button>
            )}
          </div>

          {/* Empty state */}
          {processedPosts.length === 0 && (
            <div className="glass-text-center glass-py-12">
              <div className="glass-text-6xl glass-mb-4">📱</div>
              <h3 className="glass-text-lg glass-font-semibold glass-text-primary-opacity-70 glass-mb-2">
                No posts to show
              </h3>
              <p className="glass-text-primary-glass-opacity-50">
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
