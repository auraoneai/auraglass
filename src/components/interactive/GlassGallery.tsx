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
          className='group relative animate-fade-in'
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
              <div className='relative overflow-hidden'>
                <img
                  src={image.thumbnail || image.src}
                  alt={image.alt || image.title}
                  className='glass-w-full glass-h-full object-cover transition-transform duration-300 group-hover:scale-105'
                  loading="lazy"
                />

                {/* Selection Indicator */}
                {enableSelection && (
                  <div className='absolute glass-top-2 left-2'>
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
                          <div className='w-2 h-2 glass-surface-subtle glass-radius-full' />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Overlay with actions */}
                <div className='absolute inset-0 glass-surface-dark/0 group-hover:glass-surface-dark/40 transition-all duration-200'>
                  <div className='absolute inset-0 glass-flex glass-items-center glass-justify-center opacity-0 group-hover:opacity-100 transition-opacity'>
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
                        <ZoomIn className='w-4 h-4' />
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
                            <Heart className='w-4 h-4' />
                          </GlassButton>

                          <GlassButton
                            variant="secondary"
                            size="sm"
                            onClick={(e) => e.stopPropagation()}
                            className="glass-p-2"
                            aria-label={`Share ${image.title || image.alt || 'image'}`}
                          >
                            <Share2 className='w-4 h-4' />
                          </GlassButton>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Image Info */}
                {showInfo && image.title && (
                  <div className='absolute bottom-0 left-0 right-0 glass-p-3 glass-gradient-primary glass-gradient-primary glass-gradient-primary'>
                    <h3 className='text-primary font-medium glass-text-sm truncate'>
                      {image.title}
                    </h3>
                    {image.description && (
                      <p className='text-primary/80 glass-text-xs glass-mt-1 line-clamp-2'>
                        {image.description}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Card Footer */}
              {(image.likes || image.views || image.tags) && (
                <div className="glass-p-3 glass-border-t glass-border-white/10">
                  <div className='glass-flex glass-items-center glass-justify-between glass-text-xs text-primary/60'>
                    <div className="glass-flex glass-items-center glass-gap-3">
                      {image.likes && (
                        <span className="glass-flex glass-items-center glass-gap-1">
                          <Heart className='w-3 h-3' />
                          {image.likes}
                        </span>
                      )}
                      {image.views && (
                        <span className="glass-flex glass-items-center glass-gap-1">
                          <Eye className='w-3 h-3' />
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
          className='animate-slide-in-up'
          style={{
            animationDelay: `${Math.min(index, 20) * 50}ms`,
            animationFillMode: "both",
          }}
        >
          <GlassCard
            variant="elevated"
            interactive
            onClick={(e) => handleImageClick(image, index)}
            className='overflow-hidden cursor-pointer hover:scale-[1.01] transition-transform'
          >
            <CardContent className="glass-p-0">
              <div className="glass-flex">
                <div className='w-32 h-32 glass-flex-shrink-0'>
                  <img
                    src={image.thumbnail || image.src}
                    alt={image.alt || image.title}
                    className='glass-w-full glass-h-full object-cover'
                    loading="lazy"
                  />
                </div>

                <div className="glass-flex-1 glass-p-4">
                  <div className="glass-flex glass-items-start glass-justify-between">
                    <div className="glass-flex-1">
                      <h3 className='text-primary font-medium mb-1'>
                        {image.title}
                      </h3>
                      {image.description && (
                        <p className='text-primary/70 glass-text-sm mb-2'>
                          {image.description}
                        </p>
                      )}

                      <div className='glass-flex glass-items-center glass-gap-4 glass-text-xs text-primary/60'>
                        {image.likes && (
                          <span className="glass-flex glass-items-center glass-gap-1">
                            <Heart className='w-3 h-3' />
                            {image.likes}
                          </span>
                        )}
                        {image.views && (
                          <span className="glass-flex glass-items-center glass-gap-1">
                            <Eye className='w-3 h-3' />
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
                          <ZoomIn className='w-4 h-4' />
                        </GlassButton>

                        <GlassButton
                          variant="ghost"
                          size="sm"
                          onClick={(e) => e.stopPropagation()}
                          className="glass-p-2"
                          aria-label={`Like ${image.title || image.alt || 'image'}`}
                        >
                          <Heart className='w-4 h-4' />
                        </GlassButton>

                        <GlassButton
                          variant="ghost"
                          size="sm"
                          onClick={(e) => e.stopPropagation()}
                          className="glass-p-2"
                          aria-label={`Share ${image.title || image.alt || 'image'}`}
                        >
                          <Share2 className='w-4 h-4' />
                        </GlassButton>
                      </div>
                    )}
                  </div>

                  {image.tags && image.tags.length > 0 && (
                    <div className='glass-flex glass-gap-1 mt-3'>
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
        className='fixed inset-0 z-50 glass-surface-dark/90 glass-flex glass-items-center glass-justify-center glass-p-4'
      >
        <div className='relative max-w-4xl max-h-full'>
          {/* Close Button */}
          <GlassButton
            variant="secondary"
            size="sm"
            onClick={(e) => setLightboxIndex(null)}
            className='absolute top-4 right-4 z-10'
            aria-label="Close lightbox"
          >
            <X className='w-4 h-4' />
          </GlassButton>

          {/* Navigation */}
          {images.length > 1 && (
            <>
              <GlassButton
                variant="secondary"
                size="lg"
                onClick={(e) => handleLightboxNav("prev")}
                className='absolute left-4 glass-top-1/2 transform -translate-y-1/2'
                aria-label="Previous image"
              >
                <ChevronLeft className='w-6 h-6' />
              </GlassButton>

              <GlassButton
                variant="secondary"
                size="lg"
                onClick={(e) => handleLightboxNav("next")}
                className='absolute right-4 glass-top-1/2 transform -translate-y-1/2'
                aria-label="Next image"
              >
                <ChevronRight className='w-6 h-6' />
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
            className='max-h-[80vh]'
          />

          {/* Image Info */}
          {image && (image.title || image.description) && (
            <div className='glass-mt-4 text-center'>
              {image.title && (
                <h3 className='text-primary glass-text-lg font-medium mb-1'>
                  {image.title}
                </h3>
              )}
              {image.description && (
                <p className='text-primary/80'>{image.description}</p>
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
                className='bg-glass-fill ring-1 ring-white/10 glass-radius-md glass-px-3 glass-py-1 glass-text-sm text-primary focus:outline-none focus:ring-white/30'
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
              <Grid3X3 className='w-4 h-4' />
            </GlassButton>

            <GlassButton
              variant={viewMode === "list" ? "primary" : "ghost"}
              size="sm"
              onClick={(e) => setViewMode("list")}
              className="glass-p-2"
              aria-label="Switch to list view"
            >
              <List className='w-4 h-4' />
            </GlassButton>
          </div>
        </div>

        {/* Gallery Content */}
        {filteredImages.length === 0 ? (
          <div className='text-center glass-py-12'>
            <div className='text-primary/60 mb-4'>
              <Grid3X3 className='w-12 h-12 glass-mx-auto' />
            </div>
            <p className='text-primary/60'>
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
