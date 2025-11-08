import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  currency: string;
  images: string[];
  thumbnail?: string;
  category: string;
  subcategory?: string;
  brand?: string;
  sku?: string;
  stock: number;
  rating: number;
  reviewCount: number;
  tags: string[];
  features: ProductFeature[];
  variants?: ProductVariant[];
  specifications?: Record<string, string>;
  dimensions?: {
    width: number;
    height: number;
    depth: number;
    weight: number;
    unit: string;
  };
  shippingInfo?: {
    freeShipping: boolean;
    weight: number;
    dimensions: string;
    estimatedDays: number;
  };
  isOnSale?: boolean;
  isNew?: boolean;
  isBestseller?: boolean;
  availability: 'in-stock' | 'out-of-stock' | 'pre-order' | 'discontinued';
  metadata?: Record<string, any>;
}

export interface ProductFeature {
  id: string;
  name: string;
  value: string | number | boolean;
  description?: string;
  importance?: 'low' | 'medium' | 'high';
  category?: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  value: string;
  price?: number;
  stock?: number;
  image?: string;
  sku?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  selectedVariants?: Record<string, string>;
  addedAt: Date;
  customizations?: Record<string, any>;
  giftWrap?: boolean;
  giftMessage?: string;
}

export interface WishlistItem {
  id: string;
  productId: string;
  product: Product;
  addedAt: Date;
  notes?: string;
  priority: 'low' | 'medium' | 'high';
  notify?: boolean;
}

export interface ProductReview {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  content: string;
  pros?: string[];
  cons?: string[];
  images?: string[];
  verifiedPurchase: boolean;
  helpful: number;
  notHelpful: number;
  createdAt: Date;
  sentiment?: 'positive' | 'neutral' | 'negative';
  keywords?: string[];
}

export interface PriceHistory {
  date: Date;
  price: number;
  source?: string;
}

export interface ProductComparison {
  id: string;
  products: Product[];
  comparisonMatrix: ComparisonFeature[];
  createdAt: Date;
  title?: string;
}

export interface ComparisonFeature {
  name: string;
  category: string;
  values: (string | number | boolean)[];
  importance: 'low' | 'medium' | 'high';
  winner?: number; // index of the winning product
  description?: string;
}

export interface Recommendation {
  productId: string;
  product: Product;
  score: number;
  reason: 'viewed-together' | 'bought-together' | 'similar' | 'trending' | 'personalized';
  explanation: string;
  confidence: number;
}

export interface ShippingOption {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: number;
  trackingAvailable: boolean;
  insuranceIncluded: boolean;
}

export interface PaymentMethod {
  id: string;
  type: 'credit-card' | 'debit-card' | 'paypal' | 'apple-pay' | 'google-pay' | 'bank-transfer';
  name: string;
  icon: string;
  processingFee?: number;
  acceptedCurrencies: string[];
}

interface EcommerceContextValue {
  // Product Management
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  removeProduct: (id: string) => void;
  getProduct: (id: string) => Product | undefined;
  getProductsByCategory: (category: string) => Product[];
  searchProducts: (query: string, filters?: ProductFilters) => Product[];

  // Shopping Cart
  cart: CartItem[];
  addToCart: (productId: string, quantity?: number, variants?: Record<string, string>) => void;
  updateCartItem: (itemId: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemCount: () => number;
  cartSubtotal: number;
  cartTax: number;
  cartShipping: number;
  cartTotal: number;

  // Wishlist
  wishlist: WishlistItem[];
  addToWishlist: (productId: string, priority?: 'low' | 'medium' | 'high') => void;
  removeFromWishlist: (itemId: string) => void;
  moveToCart: (wishlistItemId: string) => void;
  shareWishlist: () => string;

  // Product Recommendations
  recommendations: Record<string, Recommendation[]>;
  getRecommendations: (productId: string, type?: string) => Recommendation[];
  generateRecommendations: (productId: string) => Promise<Recommendation[]>;

  // Product Comparison
  comparisons: ProductComparison[];
  createComparison: (productIds: string[], title?: string) => ProductComparison;
  updateComparison: (id: string, updates: Partial<ProductComparison>) => void;
  removeComparison: (id: string) => void;
  compareProducts: (productIds: string[]) => ComparisonFeature[];

  // Reviews and Ratings
  reviews: Record<string, ProductReview[]>;
  addReview: (productId: string, review: Omit<ProductReview, 'id' | 'createdAt'>) => void;
  updateReview: (reviewId: string, updates: Partial<ProductReview>) => void;
  removeReview: (reviewId: string) => void;
  getProductReviews: (productId: string) => ProductReview[];
  getAverageRating: (productId: string) => number;

  // Price Tracking
  priceHistory: Record<string, PriceHistory[]>;
  trackPrice: (productId: string) => void;
  untrackPrice: (productId: string) => void;
  getPriceHistory: (productId: string) => PriceHistory[];
  getPriceAlerts: () => { productId: string; oldPrice: number; newPrice: number }[];

  // Search and Filtering
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filters: ProductFilters;
  setFilters: (filters: ProductFilters) => void;
  sortBy: SortOption;
  setSortBy: (sort: SortOption) => void;

  // Analytics
  viewProduct: (productId: string) => void;
  trackEvent: (event: string, data?: Record<string, any>) => void;
  getAnalytics: () => EcommerceAnalytics;

  // Checkout
  shippingOptions: ShippingOption[];
  paymentMethods: PaymentMethod[];
  selectedShipping?: ShippingOption;
  selectedPayment?: PaymentMethod;
  setShippingOption: (option: ShippingOption) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
}

export interface ProductFilters {
  category?: string[];
  brand?: string[];
  priceRange?: [number, number];
  rating?: number;
  availability?: string[];
  features?: Record<string, string[]>;
  onSale?: boolean;
  freeShipping?: boolean;
  inStock?: boolean;
}

export type SortOption = 
  | 'relevance'
  | 'price-low-high'
  | 'price-high-low'
  | 'rating'
  | 'newest'
  | 'bestseller'
  | 'name-az'
  | 'name-za';

export interface EcommerceAnalytics {
  totalViews: number;
  totalPurchases: number;
  conversionRate: number;
  averageOrderValue: number;
  popularProducts: { productId: string; views: number; purchases: number }[];
  categoryPerformance: Record<string, { views: number; purchases: number }>;
  searchQueries: { query: string; count: number; results: number }[];
}

const EcommerceContext = createContext<EcommerceContextValue | null>(null);

// Mock AI recommendation engine
const mockRecommendationEngine = {
  async generateRecommendations(productId: string, products: Product[]): Promise<Recommendation[]> {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

    const product = products.find((p: any) => p.id === productId);
    if (!product) return [];

    // Generate different types of recommendations
    const recommendations: Recommendation[] = [];

    // Similar products (same category)
    const similarProducts = products.filter((p: any) => 
      p.id !== productId && 
      p.category === product.category &&
      Math.abs(p.price - product.price) / product.price < 0.5
    ).slice(0, 3);

    similarProducts.forEach((p: any) => {
      recommendations.push({
        productId: p.id,
        product: p,
        score: 0.8 + Math.random() * 0.2,
        reason: 'similar',
        explanation: `Similar to ${product.name} in ${product.category} category`,
        confidence: 0.75 + Math.random() * 0.2
      });
    });

    // Trending products
    const trendingProducts = products.filter((p: any) => 
      p.id !== productId && 
      (p.isBestseller || p.isNew)
    ).slice(0, 2);

    trendingProducts.forEach((p: any) => {
      recommendations.push({
        productId: p.id,
        product: p,
        score: 0.7 + Math.random() * 0.2,
        reason: 'trending',
        explanation: p.isBestseller ? 'Bestseller in our store' : 'New arrival that\'s gaining popularity',
        confidence: 0.8 + Math.random() * 0.15
      });
    });

    // Frequently bought together (mock)
    const complementaryProducts = products.filter((p: any) => 
      p.id !== productId && 
      p.category !== product.category &&
      p.price < product.price * 0.5
    ).slice(0, 2);

    complementaryProducts.forEach((p: any) => {
      recommendations.push({
        productId: p.id,
        product: p,
        score: 0.6 + Math.random() * 0.3,
        reason: 'bought-together',
        explanation: `Frequently purchased with ${product.name}`,
        confidence: 0.6 + Math.random() * 0.3
      });
    });

    return recommendations.sort((a, b) => b.score - a.score).slice(0, 8);
  }
};

export const EcommerceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [recommendations, setRecommendations] = useState<Record<string, Recommendation[]>>({});
  const [comparisons, setComparisons] = useState<ProductComparison[]>([]);
  const [reviews, setReviews] = useState<Record<string, ProductReview[]>>({});
  const [priceHistory, setPriceHistory] = useState<Record<string, PriceHistory[]>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<ProductFilters>({});
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [selectedShipping, setSelectedShipping] = useState<ShippingOption>();
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>();

  // Mock shipping and payment options
  const shippingOptions: ShippingOption[] = [
    {
      id: 'standard',
      name: 'Standard Shipping',
      description: 'Free shipping on orders over $50',
      price: 0,
      estimatedDays: 5,
      trackingAvailable: true,
      insuranceIncluded: false
    },
    {
      id: 'express',
      name: 'Express Shipping',
      description: 'Fast delivery with tracking',
      price: 9.99,
      estimatedDays: 2,
      trackingAvailable: true,
      insuranceIncluded: true
    },
    {
      id: 'overnight',
      name: 'Overnight Delivery',
      description: 'Next business day delivery',
      price: 24.99,
      estimatedDays: 1,
      trackingAvailable: true,
      insuranceIncluded: true
    }
  ];

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'credit-card',
      type: 'credit-card',
      name: 'Credit Card',
      icon: '💳',
      acceptedCurrencies: ['USD', 'EUR', 'GBP']
    },
    {
      id: 'paypal',
      type: 'paypal',
      name: 'PayPal',
      icon: '🅿️',
      acceptedCurrencies: ['USD', 'EUR', 'GBP']
    },
    {
      id: 'apple-pay',
      type: 'apple-pay',
      name: 'Apple Pay',
      icon: '🍎',
      acceptedCurrencies: ['USD', 'EUR', 'GBP']
    }
  ];

  // Cart calculations
  const cartSubtotal = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  const cartTax = cartSubtotal * 0.08; // 8% tax
  const cartShipping = selectedShipping?.price || 0;
  const cartTotal = cartSubtotal + cartTax + cartShipping;

  const addProduct = useCallback((product: Product) => {
    setProducts((prev: any) => [...prev, product]);
  }, []);

  const updateProduct = useCallback((id: string, updates: Partial<Product>) => {
    setProducts((prev: any) => prev.map((product: any) => 
      product.id === id ? { ...product, ...updates } : product
    ));
  }, []);

  const removeProduct = useCallback((id: string) => {
    setProducts((prev: any) => prev.filter((product: any) => product.id !== id));
  }, []);

  const getProduct = useCallback((id: string) => {
    return products.find((product: any) => product.id === id);
  }, [products]);

  const getProductsByCategory = useCallback((category: string) => {
    return products.filter((product: any) => product.category === category);
  }, [products]);

  const searchProducts = useCallback((query: string, searchFilters?: ProductFilters) => {
    let filtered = products;

    // Text search
    if (query) {
      const lowercaseQuery = query.toLowerCase();
      filtered = filtered.filter((product: any) =>
        product.name.toLowerCase().includes(lowercaseQuery) ||
        product.description.toLowerCase().includes(lowercaseQuery) ||
        product.tags.some((tag: any) => tag.toLowerCase().includes(lowercaseQuery)) ||
        product.brand?.toLowerCase().includes(lowercaseQuery)
      );
    }

    // Apply filters
    const activeFilters = searchFilters || filters;
    
    if (activeFilters.category?.length) {
      filtered = filtered.filter((product: any) => activeFilters.category!.includes(product.category));
    }
    
    if (activeFilters.brand?.length) {
      filtered = filtered.filter((product: any) => 
        product.brand && activeFilters.brand!.includes(product.brand)
      );
    }
    
    if (activeFilters.priceRange) {
      const [min, max] = activeFilters.priceRange;
      filtered = filtered.filter((product: any) => product.price >= min && product.price <= max);
    }
    
    if (activeFilters.rating) {
      filtered = filtered.filter((product: any) => product.rating >= activeFilters.rating!);
    }
    
    if (activeFilters.onSale) {
      filtered = filtered.filter((product: any) => product.isOnSale);
    }
    
    if (activeFilters.inStock) {
      filtered = filtered.filter((product: any) => product.availability === 'in-stock');
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-low-high':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high-low':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'name-az':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-za':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'bestseller':
        filtered.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0));
        break;
    }

    return filtered;
  }, [products, filters, sortBy]);

  const addToCart = useCallback((productId: string, quantity = 1, variants?: Record<string, string>) => {
    const product = getProduct(productId);
    if (!product) return;

    setCart((prev: any) => {
      const existingItem = prev.find((item: any) => 
        item.productId === productId &&
        JSON.stringify(item.selectedVariants) === JSON.stringify(variants)
      );

      if (existingItem) {
        return prev.map((item: any) =>
          item.id === existingItem.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        const newItem: CartItem = {
          id: `cart_${Date.now()}_${Math.random()}`,
          productId,
          product,
          quantity,
          selectedVariants: variants,
          addedAt: new Date()
        };
        return [...prev, newItem];
      }
    });
  }, [getProduct]);

  const updateCartItem = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCart((prev: any) => prev.map((item: any) =>
      item.id === itemId ? { ...item, quantity } : item
    ));
  }, []);

  const removeFromCart = useCallback((itemId: string) => {
    setCart((prev: any) => prev.filter((item: any) => item.id !== itemId));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const getCartTotal = useCallback(() => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  }, [cart]);

  const getCartItemCount = useCallback(() => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  }, [cart]);

  const addToWishlist = useCallback((productId: string, priority: 'low' | 'medium' | 'high' = 'medium') => {
    const product = getProduct(productId);
    if (!product) return;

    const existingItem = wishlist.find((item: any) => item.productId === productId);
    if (existingItem) return;

    const newItem: WishlistItem = {
      id: `wishlist_${Date.now()}_${Math.random()}`,
      productId,
      product,
      addedAt: new Date(),
      priority
    };

    setWishlist((prev: any) => [...prev, newItem]);
  }, [getProduct, wishlist]);

  const removeFromWishlist = useCallback((itemId: string) => {
    setWishlist((prev: any) => prev.filter((item: any) => item.id !== itemId));
  }, []);

  const moveToCart = useCallback((wishlistItemId: string) => {
    const wishlistItem = wishlist.find((item: any) => item.id === wishlistItemId);
    if (!wishlistItem) return;

    addToCart(wishlistItem.productId, 1);
    removeFromWishlist(wishlistItemId);
  }, [wishlist, addToCart, removeFromWishlist]);

  const shareWishlist = useCallback(() => {
    const wishlistData = JSON.stringify(wishlist.map((item: any) => item.productId));
    return `${window.location.origin}/wishlist?items=${encodeURIComponent(wishlistData)}`;
  }, [wishlist]);

  const getRecommendations = useCallback((productId: string, type?: string) => {
    return recommendations[productId] || [];
  }, [recommendations]);

  const generateRecommendations = useCallback(async (productId: string) => {
    const recs = await mockRecommendationEngine.generateRecommendations(productId, products);
    setRecommendations((prev: any) => ({ ...prev, [productId]: recs }));
    return recs;
  }, [products]);

  const createComparison = useCallback((productIds: string[], title?: string) => {
    const comparisonProducts = productIds.map((id: any) => getProduct(id)).filter(Boolean) as Product[];
    if (comparisonProducts.length < 2) throw new Error('At least 2 products required for comparison');

    const comparisonMatrix = compareProducts(productIds);
    
    const comparison: ProductComparison = {
      id: `comparison_${Date.now()}`,
      products: comparisonProducts,
      comparisonMatrix,
      createdAt: new Date(),
      title: title || `Comparison of ${comparisonProducts.length} products`
    };

    setComparisons((prev: any) => [...prev, comparison]);
    return comparison;
  }, [getProduct]);

  const updateComparison = useCallback((id: string, updates: Partial<ProductComparison>) => {
    setComparisons((prev: any) => prev.map((comp: any) =>
      comp.id === id ? { ...comp, ...updates } : comp
    ));
  }, []);

  const removeComparison = useCallback((id: string) => {
    setComparisons((prev: any) => prev.filter((comp: any) => comp.id !== id));
  }, []);

  const compareProducts = useCallback((productIds: string[]) => {
    const comparisonProducts = productIds.map((id: any) => getProduct(id)).filter(Boolean) as Product[];
    const features: ComparisonFeature[] = [];

    // Price comparison
    features.push({
      name: 'Price',
      category: 'General',
      values: comparisonProducts.map((p: any) => `$${p.price.toFixed(2)}`),
      importance: 'high',
      winner: comparisonProducts.indexOf(comparisonProducts.reduce((min, p) => p.price < min.price ? p : min))
    });

    // Rating comparison
    features.push({
      name: 'Rating',
      category: 'General',
      values: comparisonProducts.map((p: any) => p.rating),
      importance: 'high',
      winner: comparisonProducts.indexOf(comparisonProducts.reduce((max, p) => p.rating > max.rating ? p : max))
    });

    // Stock comparison
    features.push({
      name: 'Stock',
      category: 'Availability',
      values: comparisonProducts.map((p: any) => p.stock),
      importance: 'medium'
    });

    return features;
  }, [getProduct]);

  const addReview = useCallback((productId: string, review: Omit<ProductReview, 'id' | 'createdAt'>) => {
    const newReview: ProductReview = {
      ...review,
      id: `review_${Date.now()}_${Math.random()}`,
      productId,
      createdAt: new Date()
    };

    setReviews((prev: any) => ({
      ...prev,
      [productId]: [...(prev[productId] || []), newReview]
    }));
  }, []);

  const updateReview = useCallback((reviewId: string, updates: Partial<ProductReview>) => {
    setReviews((prev: any) => {
      const newReviews = { ...prev };
      Object.keys(newReviews).forEach((productId: any) => {
        newReviews[productId] = newReviews[productId].map((review: any) =>
          review.id === reviewId ? { ...review, ...updates } : review
        );
      });
      return newReviews;
    });
  }, []);

  const removeReview = useCallback((reviewId: string) => {
    setReviews((prev: any) => {
      const newReviews = { ...prev };
      Object.keys(newReviews).forEach((productId: any) => {
        newReviews[productId] = newReviews[productId].filter((review: any) => review.id !== reviewId);
      });
      return newReviews;
    });
  }, []);

  const getProductReviews = useCallback((productId: string) => {
    return reviews[productId] || [];
  }, [reviews]);

  const getAverageRating = useCallback((productId: string) => {
    const productReviews = getProductReviews(productId);
    if (productReviews.length === 0) return 0;
    
    const sum = productReviews.reduce((total, review) => total + review.rating, 0);
    return sum / productReviews.length;
  }, [getProductReviews]);

  const trackPrice = useCallback((productId: string) => {
    const product = getProduct(productId);
    if (!product) return;

    const historyEntry: PriceHistory = {
      date: new Date(),
      price: product.price,
      source: 'tracking'
    };

    setPriceHistory((prev: any) => ({
      ...prev,
      [productId]: [...(prev[productId] || []), historyEntry]
    }));
  }, [getProduct]);

  const untrackPrice = useCallback((productId: string) => {
    setPriceHistory((prev: any) => {
      const newHistory = { ...prev };
      delete newHistory[productId];
      return newHistory;
    });
  }, []);

  const getPriceHistory = useCallback((productId: string) => {
    return priceHistory[productId] || [];
  }, [priceHistory]);

  const getPriceAlerts = useCallback(() => {
    // Mock price alerts
    return [];
  }, []);

  const viewProduct = useCallback((productId: string) => {
    // Track product view for analytics
    trackEvent('product_view', { productId });
  }, []);

  const trackEvent = useCallback((event: string, data?: Record<string, any>) => {
    // Mock analytics tracking
    console.log('Analytics event:', event, data);
  }, []);

  const getAnalytics = useCallback((): EcommerceAnalytics => {
    // Mock analytics data
    return {
      totalViews: 1250,
      totalPurchases: 89,
      conversionRate: 7.1,
      averageOrderValue: 156.78,
      popularProducts: products.slice(0, 5).map((p: any) => ({
        productId: p.id,
        views: Math.floor(Math.random() * 500) + 100,
        purchases: Math.floor(Math.random() * 50) + 10
      })),
      categoryPerformance: products.reduce((acc, p) => {
        if (!acc[p.category]) {
          acc[p.category] = { views: 0, purchases: 0 };
        }
        acc[p.category].views += Math.floor(Math.random() * 100) + 50;
        acc[p.category].purchases += Math.floor(Math.random() * 20) + 5;
        return acc;
      }, {} as Record<string, { views: number; purchases: number }>),
      searchQueries: [
        { query: 'wireless headphones', count: 45, results: 12 },
        { query: 'laptop stand', count: 38, results: 8 },
        { query: 'smartphone case', count: 32, results: 15 }
      ]
    };
  }, [products]);

  const setShippingOption = useCallback((option: ShippingOption) => {
    setSelectedShipping(option);
  }, []);

  const setPaymentMethod = useCallback((method: PaymentMethod) => {
    setSelectedPayment(method);
  }, []);

  const value: EcommerceContextValue = {
    products,
    addProduct,
    updateProduct,
    removeProduct,
    getProduct,
    getProductsByCategory,
    searchProducts,
    cart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartItemCount,
    cartSubtotal,
    cartTax,
    cartShipping,
    cartTotal,
    wishlist,
    addToWishlist,
    removeFromWishlist,
    moveToCart,
    shareWishlist,
    recommendations,
    getRecommendations,
    generateRecommendations,
    comparisons,
    createComparison,
    updateComparison,
    removeComparison,
    compareProducts,
    reviews,
    addReview,
    updateReview,
    removeReview,
    getProductReviews,
    getAverageRating,
    priceHistory,
    trackPrice,
    untrackPrice,
    getPriceHistory,
    getPriceAlerts,
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    sortBy,
    setSortBy,
    viewProduct,
    trackEvent,
    getAnalytics,
    shippingOptions,
    paymentMethods,
    selectedShipping,
    selectedPayment,
    setShippingOption,
    setPaymentMethod
  };

  return (
    <EcommerceContext.Provider data-glass-component value={value}>
      {children}
    </EcommerceContext.Provider>
  );
};

export { EcommerceProvider as GlassEcommerceProvider };

export const useEcommerce = () => {
  const context = useContext(EcommerceContext);
  if (!context) {
    throw new Error('useEcommerce must be used within an EcommerceProvider');
  }
  return context;
};