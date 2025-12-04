"use client";
import { cn } from "../../lib/utilsComprehensive";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Grid3X3,
  Heart,
  List,
  Share2,
  X,
  ZoomIn,
} from "lucide-react";
import React, { useCallback, useState } from "react";
import { Motion } from "../../primitives";
import { GlassButton } from "../button";
import { CardContent, GlassCard } from "../card";
import { GlassBadge } from "../data-display";
import { GlassImageViewer } from "./GlassImageViewer";

export interface GalleryImage {
  id: string;
  src: string;
  alt?: string;
  title?: string;
  description?: string;
  thumbnail?: string;
  width?: number;
  height?: number;
  tags?: string[];
  likes?: number;
  views?: number;
  createdAt?: Date;
  category?: string;
}

export interface GlassGalleryProps {
  /**
   * Gallery images
   */
  images?: GalleryImage[];
  /**
   * Gallery layout
   */
  layout?: "grid" | "masonry" | "list";
  /**
   * Grid columns
   */
  columns?: number;
  /**
   * Image aspect ratio
   */
  aspectRatio?: "square" | "portrait" | "landscape" | "auto";
  /**
   * Show image info
   */
  showInfo?: boolean;
  /**
   * Show image actions
   */
  showActions?: boolean;
  /**
   * Enable lightbox
   */
  enableLightbox?: boolean;
  /**
   * Show filters
   */
  showFilters?: boolean;
  /**
   * Enable selection mode
   */
  enableSelection?: boolean;
  /**
   * Custom className
   */
  className?: string;
  /**
   * Image click handler
   */
  onImageClick?: (image: GalleryImage, index: number) => void;
  /**
   * Selection change handler
   */
  onSelectionChange?: (selectedImages: GalleryImage[]) => void;
}

/**
 * GlassGallery component
 * A responsive image gallery with grid, masonry, and list layouts
 */
export const GlassGallery: React.FC<GlassGalleryProps> = ({
  images = [],
  layout = "grid",
  columns = 3,
  aspectRatio = "square",
  showInfo = true,
  showActions = true,
  enableLightbox = true,
  showFilters = false,
  enableSelection = false,
  className,
  onImageClick,
  onSelectionChange,
  ...props
}) => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filterCategory, setFilterCategory] = useState<string>("all");

  // Get aspect ratio classes
  const getAspectRatioClass = useCallback(() => {
    switch (aspectRatio) {
      case "square":
        return "aspect-square";
      case "portrait":
        return "aspect-[3/4]";
      case "landscape":
        return "aspect-[4/3]";
      case "auto":
      default:
        return "aspect-auto";
    }
  }, [aspectRatio]);

  // Get grid columns classes
  const getGridColumnsClass = useCallback(() => {
    const cols = Math.min(Math.max(columns, 1), 6);
    return `grid-cols-1 sm:grid-cols-2 md:grid-cols-${Math.min(cols, 3)} lg:grid-cols-${Math.min(cols, 4)} xl:grid-cols-${cols}`;
  }, [columns]);

  // Handle image click
  const handleImageClick = useCallback(
    (image: GalleryImage, index: number) => {
      if (enableSelection) {
        const newSelected = new Set(selectedImages);
        if (newSelected.has(image.id)) {
          newSelected.delete(image.id);
        } else {
          newSelected.add(image.id);
        }
        setSelectedImages(newSelected);
        onSelectionChange?.(
          images.filter((img: any) => newSelected.has(img.id))
        );
      } else if (enableLightbox) {
        setLightboxIndex(index);
      }

      onImageClick?.(image, index);
    },
    [
      enableSelection,
      enableLightbox,
      selectedImages,
      images,
      onImageClick,
      onSelectionChange,
    ]
  );

  // Handle lightbox navigation
  const handleLightboxNav = useCallback(
    (direction: "prev" | "next") => {
      if (lightboxIndex === null) return;

      let newIndex = lightboxIndex;
      if (direction === "prev") {
        newIndex = lightboxIndex > 0 ? lightboxIndex - 1 : images.length - 1;
      } else {
        newIndex = lightboxIndex < images.length - 1 ? lightboxIndex + 1 : 0;
      }
      setLightboxIndex(newIndex);
    },
    [lightboxIndex, images.length]
  );

  // Filter images by category
  const filteredImages = images.filter(
    (image: any) =>
      filterCategory === "all" || image.category === filterCategory
  );

  // Get unique categories
  const categories = Array.from(
    new Set(images.map((img: any) => img.category).filter(Boolean))
  );

  // Grid Layout
  const renderGridLayout = () => (
    <div className={cn("grid glass-gap-4", getGridColumnsClass())}>
      {filteredImages.map((image, index) => (
        <div
          key={image.id}
          className='glass-group glass-relative glass-animate-fade-in'
          style={{
            animationDelay: `${Math.min(index, 20) * 50}ms`,
            animationFillMode: "both",
          }}
        >
          <GlassCard
            variant="elevated"
            interactive
            onClick={(e) => handleImageClick(image, index)}
            className={cn(
              "overflow-hidden cursor-pointer hover:scale-[1.02] transition-all duration-200 glass-sheen glass-tilt",
              selectedImages.has(image.id) && "ring-2 ring-primary",
              getAspectRatioClass()
            )}
          >
            <CardContent className="glass-p-0">
              <div className='glass-relative glass-overflow-hidden'>
                <img
                  src={image.thumbnail || image.src}
                  alt={image.alt || image.title}
                  className='glass-w-full glass-h-full glass-object-cover glass-transition-transform glass-duration-300 glass-group-glass-hover-scale-105'
                  loading="lazy"
                />

                {/* Selection Indicator */}
                {enableSelection && (
                  <div className='glass-absolute glass-top-2 glass-left-2'>
                    <div
                      className={cn(
                        "w-5 h-5 glass-radius-md border-2 transition-all",
                        selectedImages.has(image.id)
                          ? "bg-primary border-primary"
                          : "bg-white/20 border-white/40"
                      )}
                    >
                      {selectedImages.has(image.id) && (
                        <div className="glass-w-full glass-h-full glass-flex glass-items-center glass-justify-center">
                          <div className='glass-w-2 glass-h-2 glass-surface-subtle glass-radius-full' />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Overlay with actions */}
                <div className='glass-absolute glass-inset-0 glass-surface-dark/0 glass-group-hover:glass-surface-dark/40 glass-transition-all glass-duration-200'>
                  <div className='glass-absolute glass-inset-0 glass-flex glass-items-center glass-justify-center glass-opacity-0 glass-group-glass-hover-opacity-100 glass-transition-opacity'>
                    <div className="glass-flex glass-gap-2">
                      <GlassButton
                        variant="secondary"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (enableLightbox) setLightboxIndex(index);
                        }}
                        className="glass-p-2"
                        aria-label={`View ${image.title || image.alt || 'image'} in lightbox`}
                      >
                        <ZoomIn className='glass-w-4 glass-h-4' />
                      </GlassButton>

                      {showActions && (
                        <>
                          <GlassButton
                            variant="secondary"
                            size="sm"
                            onClick={(e) => e.stopPropagation()}
                            className="glass-p-2"
                            aria-label={`Like ${image.title || image.alt || 'image'}`}
                          >
                            <Heart className='glass-w-4 glass-h-4' />
                          </GlassButton>

                          <GlassButton
                            variant="secondary"
                            size="sm"
                            onClick={(e) => e.stopPropagation()}
                            className="glass-p-2"
                            aria-label={`Share ${image.title || image.alt || 'image'}`}
                          >
                            <Share2 className='glass-w-4 glass-h-4' />
                          </GlassButton>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Image Info */}
                {showInfo && image.title && (
                  <div className='glass-absolute glass-bottom-0 glass-left-0 glass-right-0 glass-p-3 glass-gradient-primary glass-gradient-primary glass-gradient-primary'>
                    <h3 className='glass-text-primary glass-font-medium glass-text-sm glass-truncate'>
                      {image.title}
                    </h3>
                    {image.description && (
                      <p className='glass-text-primary-glass-opacity-80 glass-text-xs glass-mt-1 glass-line-clamp-2'>
                        {image.description}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Card Footer */}
              {(image.likes || image.views || image.tags) && (
                <div className="glass-p-3 glass-border-t glass-border-white/10">
                  <div className='glass-flex glass-items-center glass-justify-between glass-text-xs glass-text-primary-glass-opacity-60'>
                    <div className="glass-flex glass-items-center glass-gap-3">
                      {image.likes && (
                        <span className="glass-flex glass-items-center glass-gap-1">
                          <Heart className='glass-w-3 glass-h-3' />
                          {image.likes}
                        </span>
                      )}
                      {image.views && (
                        <span className="glass-flex glass-items-center glass-gap-1">
                          <Eye className='glass-w-3 glass-h-3' />
                          {image.views}
                        </span>
                      )}
                    </div>

                    {image.tags && image.tags.length > 0 && (
                      <div className="glass-flex glass-gap-1">
                        {image.tags.slice(0, 2).map((tag, tagIndex) => (
                          <GlassBadge
                            key={tagIndex}
                            variant="outline"
                            size="sm"
                          >
                            {tag}
                          </GlassBadge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </GlassCard>
        </div>
      ))}
    </div>
  );

  // List Layout
  const renderListLayout = () => (
    <div className="glass-auto-gap glass-auto-gap-lg">
      {filteredImages.map((image, index) => (
        <div
          key={image.id}
          className='glass-animate-slide-in-up'
          style={{
            animationDelay: `${Math.min(index, 20) * 50}ms`,
            animationFillMode: "both",
          }}
        >
          <GlassCard
            variant="elevated"
            interactive
            onClick={(e) => handleImageClick(image, index)}
            className='glass-overflow-hidden glass-cursor-pointer glass-hover-scale-1-01 glass-transition-transform'
          >
            <CardContent className="glass-p-0">
              <div className="glass-flex">
                <div className='glass-w-32 glass-h-32 glass-flex-shrink-0'>
                  <img
                    src={image.thumbnail || image.src}
                    alt={image.alt || image.title}
                    className='glass-w-full glass-h-full glass-object-cover'
                    loading="lazy"
                  />
                </div>

                <div className="glass-flex-1 glass-p-4">
                  <div className="glass-flex glass-items-start glass-justify-between">
                    <div className="glass-flex-1">
                      <h3 className='glass-text-primary glass-font-medium glass-mb-1'>
                        {image.title}
                      </h3>
                      {image.description && (
                        <p className='glass-text-primary-opacity-70 glass-text-sm glass-mb-2'>
                          {image.description}
                        </p>
                      )}

                      <div className='glass-flex glass-items-center glass-gap-4 glass-text-xs glass-text-primary-glass-opacity-60'>
                        {image.likes && (
                          <span className="glass-flex glass-items-center glass-gap-1">
                            <Heart className='glass-w-3 glass-h-3' />
                            {image.likes}
                          </span>
                        )}
                        {image.views && (
                          <span className="glass-flex glass-items-center glass-gap-1">
                            <Eye className='glass-w-3 glass-h-3' />
                            {image.views}
                          </span>
                        )}
                        {image.createdAt && (
                          <span>{image.createdAt.toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>

                    {showActions && (
                      <div className="glass-flex glass-gap-1 glass-ml-4">
                        <GlassButton
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (enableLightbox) setLightboxIndex(index);
                          }}
                          className="glass-p-2"
                          aria-label={`View ${image.title || image.alt || 'image'} in lightbox`}
                        >
                          <ZoomIn className='glass-w-4 glass-h-4' />
                        </GlassButton>

                        <GlassButton
                          variant="ghost"
                          size="sm"
                          onClick={(e) => e.stopPropagation()}
                          className="glass-p-2"
                          aria-label={`Like ${image.title || image.alt || 'image'}`}
                        >
                          <Heart className='glass-w-4 glass-h-4' />
                        </GlassButton>

                        <GlassButton
                          variant="ghost"
                          size="sm"
                          onClick={(e) => e.stopPropagation()}
                          className="glass-p-2"
                          aria-label={`Share ${image.title || image.alt || 'image'}`}
                        >
                          <Share2 className='glass-w-4 glass-h-4' />
                        </GlassButton>
                      </div>
                    )}
                  </div>

                  {image.tags && image.tags.length > 0 && (
                    <div className='glass-flex glass-gap-1 glass-mt-3'>
                      {image.tags.map((tag, tagIndex) => (
                        <GlassBadge key={tagIndex} variant="outline" size="sm">
                          {tag}
                        </GlassBadge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </GlassCard>
        </div>
      ))}
    </div>
  );

  // Lightbox Modal
  const renderLightbox = () => {
    if (lightboxIndex === null) return null;

    const image = images[lightboxIndex];

    return (
      <div
        data-glass-component
        className='glass-fixed glass-inset-0 glass-z-50 glass-surface-dark/90 glass-flex glass-items-center glass-justify-center glass-p-4'
      >
        <div className='glass-relative glass-max-w-4xl glass-max-h-full'>
          {/* Close Button */}
          <GlassButton
            variant="secondary"
            size="sm"
            onClick={(e) => setLightboxIndex(null)}
            className='glass-absolute glass-top-4 glass-right-4 glass-z-10'
            aria-label="Close lightbox"
          >
            <X className='glass-w-4 glass-h-4' />
          </GlassButton>

          {/* Navigation */}
          {images.length > 1 && (
            <>
              <GlassButton
                variant="secondary"
                size="lg"
                onClick={(e) => handleLightboxNav("prev")}
                className='glass-absolute glass-left-4 glass-top-1/2 glass-transform glass--translate-y-1-2'
                aria-label="Previous image"
              >
                <ChevronLeft className='glass-w-6 glass-h-6' />
              </GlassButton>

              <GlassButton
                variant="secondary"
                size="lg"
                onClick={(e) => handleLightboxNav("next")}
                className='glass-absolute glass-right-4 glass-top-1/2 glass-transform glass--translate-y-1-2'
                aria-label="Next image"
              >
                <ChevronRight className='glass-w-6 glass-h-6' />
              </GlassButton>
            </>
          )}

          {/* Image */}
          <GlassImageViewer
            images={images.map((img: any) => ({
              src: img.src,
              alt: img.alt,
              title: img.title,
            }))}
            initialIndex={lightboxIndex}
            enableZoom={true}
            enablePan={true}
            enableFullscreen={false}
            onImageChange={setLightboxIndex}
            className='glass-max-h-80vh'
          />

          {/* Image Info */}
          {image && (image.title || image.description) && (
            <div className='glass-mt-4 glass-text-center'>
              {image.title && (
                <h3 className='glass-text-primary glass-text-lg glass-font-medium glass-mb-1'>
                  {image.title}
                </h3>
              )}
              {image.description && (
                <p className='glass-text-primary-glass-opacity-80'>{image.description}</p>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <Motion preset="fadeIn" className="glass-w-full">
      <div
        className={cn("glass-auto-gap glass-auto-gap-2xl", className)}
        {...props}
      >
        {/* Header with filters and view options */}
        <div className="glass-flex glass-items-center glass-justify-between">
          <div className="glass-flex glass-items-center glass-gap-4">
            {showFilters && categories.length > 0 && (
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className='glass-bg-fill glass-ring-1 glass-ring-white-opacity-10 glass-radius-md glass-px-3 glass-py-1 glass-text-sm glass-text-primary glass-focus-outline-none glass-focus-ring-white-opacity-30'
              >
                <option value="all">All Categories</option>
                {categories.map((category: any) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            )}

            {enableSelection && selectedImages.size > 0 && (
              <GlassBadge variant="primary">
                {selectedImages.size} selected
              </GlassBadge>
            )}
          </div>

          <div className="glass-flex glass-items-center glass-gap-2">
            <GlassButton
              variant={viewMode === "grid" ? "primary" : "ghost"}
              size="sm"
              onClick={(e) => setViewMode("grid")}
              className="glass-p-2"
              aria-label="Switch to grid view"
            >
              <Grid3X3 className='glass-w-4 glass-h-4' />
            </GlassButton>

            <GlassButton
              variant={viewMode === "list" ? "primary" : "ghost"}
              size="sm"
              onClick={(e) => setViewMode("list")}
              className="glass-p-2"
              aria-label="Switch to list view"
            >
              <List className='glass-w-4 glass-h-4' />
            </GlassButton>
          </div>
        </div>

        {/* Gallery Content */}
        {filteredImages.length === 0 ? (
          <div className='glass-text-center glass-py-12'>
            <div className='glass-text-primary-glass-opacity-60 glass-mb-4'>
              <Grid3X3 className='glass-w-12 glass-h-12 glass-mx-auto' />
            </div>
            <p className='glass-text-primary-glass-opacity-60'>
              {filterCategory === "all"
                ? "No images to display"
                : `No images in ${filterCategory} category`}
            </p>
          </div>
        ) : viewMode === "grid" ? (
          renderGridLayout()
        ) : (
          renderListLayout()
        )}

        {/* Lightbox */}
        {renderLightbox()}
      </div>
    </Motion>
  );
};

export default GlassGallery;
