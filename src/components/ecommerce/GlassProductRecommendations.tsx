import React, { useState, useEffect, useCallback } from 'react';
import { Glass } from '../../primitives';
import { cn } from '../../lib/utilsComprehensive';
import { useEcommerce, Product, Recommendation } from './GlassEcommerceProvider';

export interface ProductRecommendationsProps {
  productId?: string;
  title?: string;
  subtitle?: string;
  maxItems?: number;
  variant?: 'grid' | 'carousel' | 'list' | 'compact';
  showPrices?: boolean;
  showRatings?: boolean;
  showQuickActions?: boolean;
  recommendationType?: 'similar' | 'trending' | 'personalized' | 'bought-together' | 'viewed-together' | 'all';
  className?: string;
  onProductClick?: (product: Product) => void;
}

interface ProductCardProps {
  recommendation: Recommendation;
  variant: 'grid' | 'carousel' | 'list' | 'compact';
  showPrice?: boolean;
  showRating?: boolean;
  showQuickActions?: boolean;
  onProductClick?: (product: Product) => void;
  onAddToCart: (productId: string) => void;
  onAddToWishlist: (productId: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  recommendation,
  variant,
  showPrice = true,
  showRating = true,
  showQuickActions = true,
  onProductClick,
  onAddToCart,
  onAddToWishlist
}) => {
  const { product, score, reason, explanation, confidence } = recommendation;
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const getReasonIcon = (reason: string) => {
    switch (reason) {
      case 'similar': return '🔄';
      case 'trending': return '📈';
      case 'personalized': return '🎯';
      case 'bought-together': return '🛍️';
      case 'viewed-together': return '👀';
      default: return '✨';
    }
  };

  const getReasonColor = (reason: string) => {
    switch (reason) {
      case 'similar': return 'bg-blue-100 text-blue-800';
      case 'trending': return 'bg-red-100 text-red-800';
      case 'personalized': return 'bg-purple-100 text-purple-800';
      case 'bought-together': return 'bg-green-100 text-green-800';
      case 'viewed-together': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderCompactCard = () => (
    <div className="flex items-center gap-3 p-3 hover:glass-surface-subtle glass-radius-lg transition-colors">
      <img
        src={imageError ? 'https://via.placeholder.com/60x60?text=No+Image' : (product.thumbnail || product.images[0])}
        alt={product.name}
        className="w-12 h-12 object-cover glass-radius"
        onError={() => setImageError(true)}
      />
      
      <div className="flex-1 min-w-0">
        <h3 className="font-medium glass-text-secondary text-sm truncate">
          {product.name}
        </h3>
        {showPrice && (
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm font-medium glass-text-secondary">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs glass-text-secondary line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
        )}
      </div>
      
      {showQuickActions && (
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToWishlist(product.id);
            }}
            className="p-1 glass-text-secondary hover:text-primary transition-colors glass-focus glass-touch-target glass-contrast-guard"
            title="Add to wishlist"
          >
            ♡
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product.id);
            }}
            className="p-1 glass-text-secondary hover:text-primary transition-colors glass-focus glass-touch-target glass-contrast-guard"
            title="Add to cart"
          >
            🛒
          </button>
        </div>
      )}
    </div>
  );

  const renderListCard = () => (
    <div className="flex gap-4 p-4 border border-subtle glass-radius-lg hover:shadow-md transition-all">
      <img
        src={imageError ? 'https://via.placeholder.com/120x120?text=No+Image' : (product.thumbnail || product.images[0])}
        alt={product.name}
        className="w-20 h-20 object-cover glass-radius"
        onError={() => setImageError(true)}
      />
      
      <div className="flex-1">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-medium glass-text-secondary line-clamp-2">
            {product.name}
          </h3>
          <div className={cn("text-xs px-2 py-1 rounded-full", getReasonColor(reason))}>
            {getReasonIcon(reason)} {reason.replace('-', ' ')}
          </div>
        </div>
        
        <p className="text-sm glass-text-secondary mb-3 line-clamp-2">
          {explanation}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {showPrice && (
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold glass-text-secondary">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm glass-text-secondary line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
            )}
            
            {showRating && (
              <div className="flex items-center gap-1">
                <span className="text-primary">★</span>
                <span className="text-sm glass-text-secondary">
                  {product.rating.toFixed(1)} ({product.reviewCount})
                </span>
              </div>
            )}
          </div>
          
          {showQuickActions && (
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToWishlist(product.id);
                }}
                className="px-3 py-1 text-sm glass-text-secondary hover:text-primary transition-colors glass-focus glass-touch-target glass-contrast-guard"
              >
                ♡ Wishlist
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToCart(product.id);
                }}
                className="px-3 py-1 glass-surface-blue text-primary text-sm glass-radius hover:glass-surface-blue transition-colors glass-focus glass-touch-target glass-contrast-guard"
              >
                Add to Cart
              </button>
            </div>
          )}
        </div>
        
        {/* Confidence Indicator */}
        <div className="mt-2 flex items-center gap-2">
          <span className="text-xs glass-text-secondary">Match confidence:</span>
          <div className="flex-1 glass-surface-subtle glass-radius-full h-1">
            <div 
              className="glass-surface-blue h-1 glass-radius-full transition-all"
              style={{ width: `${confidence * 100}%` }}
            />
          </div>
          <span className="text-xs glass-text-secondary">{Math.round(confidence * 100)}%</span>
        </div>
      </div>
    </div>
  );

  const renderGridCard = () => (
    <div
      className="group relative glass-surface-subtle border border-subtle glass-radius-lg overflow-hidden hover:shadow-lg transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={imageError ? 'https://via.placeholder.com/300x300?text=No+Image' : (product.thumbnail || product.images[0])}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={() => setImageError(true)}
        />
        
        {/* Badges */}
        <div className="absolute glass-top-2 left-2 flex flex-col gap-1">
          {product.isOnSale && (
            <span className="glass-surface-red text-primary text-xs px-2 py-1 glass-radius">
              SALE
            </span>
          )}
          {product.isNew && (
            <span className="glass-surface-green text-primary text-xs px-2 py-1 glass-radius">
              NEW
            </span>
          )}
          {product.isBestseller && (
            <span className="glass-surface-yellow text-primary text-xs px-2 py-1 glass-radius">
              BESTSELLER
            </span>
          )}
        </div>
        
        {/* Recommendation Reason */}
        <div className="absolute glass-top-2 right-2">
          <div className={cn("text-xs px-2 py-1 rounded-full", getReasonColor(reason))}>
            {getReasonIcon(reason)}
          </div>
        </div>
        
        {/* Quick Actions Overlay */}
        {showQuickActions && (
          <div className={cn(
            "absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center gap-3 transition-opacity duration-300",
            isHovered ? "opacity-100" : "opacity-0"
          )}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddToWishlist(product.id);
              }}
              className="p-2 glass-surface-subtle glass-radius-full glass-text-secondary hover:text-primary transition-colors glass-focus glass-touch-target glass-contrast-guard"
              title="Add to wishlist"
            >
              ♡
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product.id);
              }}
              className="p-2 glass-surface-blue text-primary glass-radius-full hover:glass-surface-blue transition-colors glass-focus glass-touch-target glass-contrast-guard"
              title="Add to cart"
            >
              🛒
            </button>
          </div>
        )}
      </div>
      
      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-medium glass-text-secondary mb-2 line-clamp-2">
          {product.name}
        </h3>
        
        {product.brand && (
          <p className="text-sm glass-text-secondary mb-2">{product.brand}</p>
        )}
        
        {showRating && (
          <div className="flex items-center gap-1 mb-3">
            <div className="flex text-primary">
              {Array.from({ length: 5 }, (_, i) => (
                <span key={i} className={i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}>
                  ★
                </span>
              ))}
            </div>
            <span className="text-sm glass-text-secondary">
              ({product.reviewCount})
            </span>
          </div>
        )}
        
        {showPrice && (
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg font-semibold glass-text-secondary">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm glass-text-secondary line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
        )}
        
        {/* Reason Explanation */}
        <p className="text-xs glass-text-secondary mb-3">{explanation}</p>
        
        {/* Confidence Bar */}
        <div className="flex items-center gap-2">
          <span className="text-xs glass-text-secondary">Match:</span>
          <div className="flex-1 glass-surface-subtle glass-radius-full h-1">
            <div 
              className="glass-surface-blue h-1 glass-radius-full"
              style={{ width: `${confidence * 100}%` }}
            />
          </div>
          <span className="text-xs glass-text-secondary">{Math.round(confidence * 100)}%</span>
        </div>
      </div>
    </div>
  );

  return (
    <div data-glass-component
      onClick={() => onProductClick?.(product)}
      className="cursor-pointer"
    >
      {variant === 'compact' && renderCompactCard()}
      {variant === 'list' && renderListCard()}
      {(variant === 'grid' || variant === 'carousel') && renderGridCard()}
    </div>
  );
};

export const GlassProductRecommendations: React.FC<ProductRecommendationsProps> = ({
  productId,
  title = 'Recommended for You',
  subtitle,
  maxItems = 8,
  variant = 'grid',
  showPrices = true,
  showRatings = true,
  showQuickActions = true,
  recommendationType = 'all',
  className,
  onProductClick
}) => {
  const {
    recommendations,
    getRecommendations,
    generateRecommendations,
    addToCart,
    addToWishlist
  } = useEcommerce();

  const [loading, setLoading] = useState(false);
  const [currentRecommendations, setCurrentRecommendations] = useState<Recommendation[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Load recommendations
  useEffect(() => {
    if (!productId) return;
    
    const loadRecommendations = async () => {
      setLoading(true);
      
      let recs = getRecommendations(productId);
      
      if (recs.length === 0) {
        recs = await generateRecommendations(productId);
      }
      
      // Filter by recommendation type
      if (recommendationType !== 'all') {
        recs = recs.filter((rec: any) => rec.reason === recommendationType);
      }
      
      setCurrentRecommendations(recs.slice(0, maxItems));
      setLoading(false);
    };

    loadRecommendations();
  }, [productId, recommendationType, maxItems, getRecommendations, generateRecommendations]);

  const handleAddToCart = useCallback((productId: string) => {
    addToCart(productId, 1);
    // You could show a toast notification here
  }, [addToCart]);

  const handleAddToWishlist = useCallback((productId: string) => {
    addToWishlist(productId);
    // You could show a toast notification here
  }, [addToWishlist]);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev: any) => 
      prev + 1 >= Math.ceil(currentRecommendations.length / getItemsPerView()) ? 0 : prev + 1
    );
  }, [currentRecommendations.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev: any) => 
      prev - 1 < 0 ? Math.ceil(currentRecommendations.length / getItemsPerView()) - 1 : prev - 1
    );
  }, [currentRecommendations.length]);

  const getItemsPerView = () => {
    switch (variant) {
      case 'carousel': return 4;
      case 'grid': return 8;
      default: return currentRecommendations.length;
    }
  };

  if (loading) {
    return (
      <Glass className={cn("p-6", className)}>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin glass-radius-full h-12 w-12 border-4 border-blue border-t-transparent"></div>
        </div>
      </Glass>
    );
  }

  if (currentRecommendations.length === 0) {
    return (
      <Glass className={cn("p-6", className)}>
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🤖</div>
          <h3 className="text-lg font-medium glass-text-secondary mb-2">
            No recommendations available
          </h3>
          <p className="glass-text-secondary">
            We're still learning about your preferences. Check back later!
          </p>
        </div>
      </Glass>
    );
  }

  return (
    <Glass className={cn("p-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold glass-text-secondary">
            {title}
          </h2>
          {subtitle && (
            <p className="glass-text-secondary mt-1">{subtitle}</p>
          )}
        </div>
        
        {variant === 'carousel' && (
          <div className="flex items-center gap-2">
            <button
              onClick={prevSlide}
              className="p-2 glass-text-secondary hover:glass-text-secondary transition-colors glass-focus glass-touch-target glass-contrast-guard glass-focus glass-touch-target glass-contrast-guard"
            >
              ←
            </button>
            <span className="text-sm glass-text-secondary">
              {currentIndex + 1} / {Math.ceil(currentRecommendations.length / getItemsPerView())}
            </span>
            <button
              onClick={nextSlide}
              className="p-2 glass-text-secondary hover:glass-text-secondary transition-colors glass-focus glass-touch-target glass-contrast-guard glass-focus glass-touch-target glass-contrast-guard"
            >
              →
            </button>
          </div>
        )}
      </div>

      {/* Recommendations Grid/Carousel */}
      <div className={cn(
        variant === 'grid' && "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6",
        variant === 'carousel' && "overflow-hidden",
        variant === 'list' && "space-y-4",
        variant === 'compact' && "space-y-2"
      )}>
        {variant === 'carousel' ? (
          <div
            className="flex transition-transform duration-300"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
              width: `${Math.ceil(currentRecommendations.length / getItemsPerView()) * 100}%`
            }}
          >
            {Array.from({ length: Math.ceil(currentRecommendations.length / getItemsPerView()) }, (_, slideIndex) => (
              <div
                key={slideIndex}
                className="grid grid-cols-4 gap-6 w-full flex-shrink-0"
              >
                {currentRecommendations
                  .slice(slideIndex * getItemsPerView(), (slideIndex + 1) * getItemsPerView())
                  .map((recommendation: any) => (
                    <ProductCard
                      key={recommendation.productId}
                      recommendation={recommendation}
                      variant={variant}
                      showPrice={showPrices}
                      showRating={showRatings}
                      showQuickActions={showQuickActions}
                      onProductClick={onProductClick}
                      onAddToCart={handleAddToCart}
                      onAddToWishlist={handleAddToWishlist}
                    />
                  ))}
              </div>
            ))}
          </div>
        ) : (
          currentRecommendations.map((recommendation: any) => (
            <ProductCard
              key={recommendation.productId}
              recommendation={recommendation}
              variant={variant}
              showPrice={showPrices}
              showRating={showRatings}
              showQuickActions={showQuickActions}
              onProductClick={onProductClick}
              onAddToCart={handleAddToCart}
              onAddToWishlist={handleAddToWishlist}
            />
          ))
        )}
      </div>

      {/* AI Insights */}
      <div className="mt-6 p-4 glass-surface-subtle glass-radius-lg">
        <div className="flex items-start gap-3">
          <div className="text-2xl">🤖</div>
          <div>
            <h3 className="font-medium text-primary mb-1">AI Insights</h3>
            <p className="text-sm text-primary">
              These recommendations are personalized based on your browsing history, 
              purchase patterns, and preferences similar to users like you. 
              Our AI analyzes {currentRecommendations.length} factors to suggest the best products for you.
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              {Array.from(new Set(currentRecommendations.map((r: any) => r.reason))).map((reason: any) => (
                <span
                  key={reason}
                  className={cn("text-xs px-2 py-1 rounded-full", getReasonColor(reason))}
                >
                  {getReasonIcon(reason)} {reason.replace('-', ' ')}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Glass>
  );

  function getReasonColor(reason: string): string {
    switch (reason) {
      case 'similar': return 'bg-blue-100 text-blue-800';
      case 'trending': return 'bg-red-100 text-red-800';
      case 'personalized': return 'bg-purple-100 text-purple-800';
      case 'bought-together': return 'bg-green-100 text-green-800';
      case 'viewed-together': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  function getReasonIcon(reason: string): string {
    switch (reason) {
      case 'similar': return '🔄';
      case 'trending': return '📈';
      case 'personalized': return '🎯';
      case 'bought-together': return '🛍️';
      case 'viewed-together': return '👀';
      default: return '✨';
    }
  }
};
