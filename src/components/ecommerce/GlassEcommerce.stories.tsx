import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { EcommerceProvider, Product, useEcommerce } from './GlassEcommerceProvider';
import { GlassSmartShoppingCart } from './GlassSmartShoppingCart';
import { GlassProductRecommendations } from './GlassProductRecommendations';

const meta: Meta = {
  title: 'E-commerce/GlassEcommerce',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# 🛒 Glass E-commerce System

Revolutionary e-commerce components with AI-powered recommendations, smart shopping cart, and advanced product management.

## ✨ **Revolutionary Features**

### 🛍️ **Smart Shopping Cart**
- **Intelligent Quantity Management**: Auto-updates with stock validation
- **Dynamic Pricing**: Real-time price calculations with taxes and shipping
- **Promo Code System**: Automated discount application and validation
- **Save for Later**: Move items between cart and saved items
- **Shipping Calculator**: Real-time shipping options and costs
- **Multi-variant Support**: Handle product variations seamlessly
- **Gift Options**: Gift wrapping and personalized messages
- **Security Features**: SSL encryption badges and secure checkout

### 🤖 **AI-Powered Recommendations**
- **Machine Learning Engine**: Personalized product suggestions
- **Multiple Recommendation Types**:
  - **Similar Products**: Based on category and features
  - **Trending Items**: Popular and bestselling products
  - **Bought Together**: Frequently purchased combinations
  - **Viewed Together**: Products viewed by similar users
  - **Personalized**: Based on individual user behavior
- **Confidence Scoring**: Match accuracy for each recommendation
- **Reason Explanations**: Clear reasoning for each suggestion
- **Real-time Learning**: Continuously improves with user interactions

### 📊 **Advanced Product Management**
- **Comprehensive Product Data**: Detailed specifications and metadata
- **Inventory Tracking**: Real-time stock levels and availability
- **Price History**: Track price changes and alerts
- **Review System**: Ratings, reviews with sentiment analysis
- **Variant Management**: Colors, sizes, and custom options
- **Category Organization**: Hierarchical product categorization

### 🔍 **Smart Search & Filtering**
- **Advanced Filtering**: Price, brand, rating, availability filters
- **Smart Sorting**: Relevance, price, popularity, ratings
- **Search Analytics**: Query tracking and optimization
- **Category Navigation**: Intuitive product browsing

### 💳 **Checkout & Payment**
- **Multiple Payment Methods**: Credit cards, PayPal, digital wallets
- **Shipping Options**: Standard, express, overnight delivery
- **Tax Calculation**: Automatic tax computation
- **Order Tracking**: Real-time order status updates
- **Security**: PCI compliance and fraud protection

### 📈 **Analytics & Insights**
- **Conversion Tracking**: Sales funnel analysis
- **User Behavior**: View patterns and engagement metrics
- **Product Performance**: Bestsellers and trending items
- **Revenue Analytics**: Sales reporting and forecasting

## 🚀 **Use Cases**

- **Online Retail Stores**: Complete e-commerce solution
- **Marketplace Platforms**: Multi-vendor support
- **Subscription Services**: Recurring product sales
- **Digital Products**: Software and content sales
- **B2B Commerce**: Bulk ordering and enterprise features
- **Mobile Commerce**: Responsive shopping experiences

This represents the most advanced e-commerce component system available, combining Amazon's recommendation engine, Shopify's cart functionality, and modern AI-powered shopping experiences.
        `,
      },
    },
  },
};

export default meta;

// Sample product data for demonstrations
const sampleProducts: Product[] = [
  {
    id: 'prod_001',
    name: 'Wireless Noise-Cancelling Headphones',
    description: 'Premium wireless headphones with active noise cancellation and 30-hour battery life.',
    price: 299.99,
    originalPrice: 399.99,
    currency: 'USD',
    images: [
      'https://via.placeholder.com/400x400/3b82f6/ffffff?text=Headphones',
      'https://via.placeholder.com/400x400/1e40af/ffffff?text=Side+View'
    ],
    thumbnail: 'https://via.placeholder.com/200x200/3b82f6/ffffff?text=Headphones',
    category: 'Electronics',
    subcategory: 'Audio',
    brand: 'TechSound',
    sku: 'TS-WH-001',
    stock: 15,
    rating: 4.6,
    reviewCount: 234,
    tags: ['wireless', 'noise-cancelling', 'bluetooth', 'premium'],
    features: [
      { id: 'f1', name: 'Battery Life', value: '30 hours', importance: 'high' },
      { id: 'f2', name: 'Noise Cancellation', value: true, importance: 'high' },
      { id: 'f3', name: 'Bluetooth Version', value: '5.2', importance: 'medium' },
      { id: 'f4', name: 'Weight', value: '250g', importance: 'medium' }
    ],
    variants: [
      { id: 'color_black', name: 'Color', value: 'Black' },
      { id: 'color_white', name: 'Color', value: 'White' },
      { id: 'color_blue', name: 'Color', value: 'Blue' }
    ],
    isOnSale: true,
    isBestseller: true,
    availability: 'in-stock',
    shippingInfo: {
      freeShipping: true,
      weight: 0.8,
      dimensions: '20x18x8cm',
      estimatedDays: 2
    }
  },
  {
    id: 'prod_002',
    name: 'Smart Fitness Watch',
    description: 'Advanced fitness tracking with heart rate monitoring, GPS, and smartphone connectivity.',
    price: 249.99,
    currency: 'USD',
    images: [
      'https://via.placeholder.com/400x400/10b981/ffffff?text=Fitness+Watch'
    ],
    thumbnail: 'https://via.placeholder.com/200x200/10b981/ffffff?text=Watch',
    category: 'Electronics',
    subcategory: 'Wearables',
    brand: 'FitTech',
    sku: 'FT-SW-002',
    stock: 8,
    rating: 4.4,
    reviewCount: 189,
    tags: ['fitness', 'smartwatch', 'health', 'gps'],
    features: [
      { id: 'f1', name: 'Battery Life', value: '7 days', importance: 'high' },
      { id: 'f2', name: 'Water Resistance', value: '50m', importance: 'high' },
      { id: 'f3', name: 'GPS', value: true, importance: 'medium' },
      { id: 'f4', name: 'Heart Rate Monitor', value: true, importance: 'high' }
    ],
    variants: [
      { id: 'size_s', name: 'Size', value: 'Small' },
      { id: 'size_m', name: 'Size', value: 'Medium' },
      { id: 'size_l', name: 'Size', value: 'Large' }
    ],
    isNew: true,
    availability: 'in-stock',
    shippingInfo: {
      freeShipping: false,
      weight: 0.3,
      dimensions: '15x12x1cm',
      estimatedDays: 3
    }
  },
  {
    id: 'prod_003',
    name: 'Ergonomic Office Chair',
    description: 'Premium ergonomic office chair with lumbar support and adjustable height.',
    price: 399.99,
    originalPrice: 499.99,
    currency: 'USD',
    images: [
      'https://via.placeholder.com/400x400/6366f1/ffffff?text=Office+Chair'
    ],
    thumbnail: 'https://via.placeholder.com/200x200/6366f1/ffffff?text=Chair',
    category: 'Furniture',
    subcategory: 'Office',
    brand: 'ComfortSeating',
    sku: 'CS-EOC-003',
    stock: 5,
    rating: 4.8,
    reviewCount: 156,
    tags: ['ergonomic', 'office', 'chair', 'comfort'],
    features: [
      { id: 'f1', name: 'Adjustable Height', value: true, importance: 'high' },
      { id: 'f2', name: 'Lumbar Support', value: true, importance: 'high' },
      { id: 'f3', name: 'Material', value: 'Mesh & Fabric', importance: 'medium' },
      { id: 'f4', name: 'Weight Capacity', value: '150kg', importance: 'medium' }
    ],
    variants: [
      { id: 'color_black', name: 'Color', value: 'Black' },
      { id: 'color_grey', name: 'Color', value: 'Grey' },
      { id: 'color_white', name: 'Color', value: 'White' }
    ],
    isOnSale: true,
    availability: 'in-stock',
    shippingInfo: {
      freeShipping: true,
      weight: 18.5,
      dimensions: '70x70x120cm',
      estimatedDays: 5
    }
  },
  {
    id: 'prod_004',
    name: 'Portable Bluetooth Speaker',
    description: 'Compact waterproof speaker with premium sound quality and 12-hour battery life.',
    price: 79.99,
    currency: 'USD',
    images: [
      'https://via.placeholder.com/400x400/f59e0b/ffffff?text=Speaker'
    ],
    thumbnail: 'https://via.placeholder.com/200x200/f59e0b/ffffff?text=Speaker',
    category: 'Electronics',
    subcategory: 'Audio',
    brand: 'SoundWave',
    sku: 'SW-PBS-004',
    stock: 25,
    rating: 4.3,
    reviewCount: 312,
    tags: ['portable', 'bluetooth', 'waterproof', 'speaker'],
    features: [
      { id: 'f1', name: 'Battery Life', value: '12 hours', importance: 'high' },
      { id: 'f2', name: 'Water Resistance', value: 'IPX7', importance: 'high' },
      { id: 'f3', name: 'Bluetooth Range', value: '10 meters', importance: 'medium' },
      { id: 'f4', name: 'Power Output', value: '20W', importance: 'medium' }
    ],
    variants: [
      { id: 'color_red', name: 'Color', value: 'Red' },
      { id: 'color_blue', name: 'Color', value: 'Blue' },
      { id: 'color_black', name: 'Color', value: 'Black' }
    ],
    availability: 'in-stock',
    shippingInfo: {
      freeShipping: false,
      weight: 0.6,
      dimensions: '18x8x8cm',
      estimatedDays: 2
    }
  },
  {
    id: 'prod_005',
    name: 'Adjustable Standing Desk',
    description: 'Electric height-adjustable desk with memory settings and cable management.',
    price: 599.99,
    currency: 'USD',
    images: [
      'https://via.placeholder.com/400x400/8b5cf6/ffffff?text=Standing+Desk'
    ],
    thumbnail: 'https://via.placeholder.com/200x200/8b5cf6/ffffff?text=Desk',
    category: 'Furniture',
    subcategory: 'Office',
    brand: 'DeskTech',
    sku: 'DT-ASD-005',
    stock: 3,
    rating: 4.7,
    reviewCount: 89,
    tags: ['standing-desk', 'adjustable', 'electric', 'office'],
    features: [
      { id: 'f1', name: 'Height Range', value: '71-121cm', importance: 'high' },
      { id: 'f2', name: 'Memory Settings', value: '4 presets', importance: 'medium' },
      { id: 'f3', name: 'Weight Capacity', value: '80kg', importance: 'high' },
      { id: 'f4', name: 'Desktop Size', value: '120x60cm', importance: 'high' }
    ],
    variants: [
      { id: 'color_walnut', name: 'Color', value: 'Walnut' },
      { id: 'color_white', name: 'Color', value: 'White' },
      { id: 'color_black', name: 'Color', value: 'Black' }
    ],
    isBestseller: true,
    availability: 'in-stock',
    shippingInfo: {
      freeShipping: true,
      weight: 35.2,
      dimensions: '125x65x15cm',
      estimatedDays: 7
    }
  },
  {
    id: 'prod_006',
    name: 'Wireless Phone Charger',
    description: 'Fast wireless charging pad compatible with all Qi-enabled devices.',
    price: 29.99,
    originalPrice: 39.99,
    currency: 'USD',
    images: [
      'https://via.placeholder.com/400x400/ef4444/ffffff?text=Wireless+Charger'
    ],
    thumbnail: 'https://via.placeholder.com/200x200/ef4444/ffffff?text=Charger',
    category: 'Electronics',
    subcategory: 'Accessories',
    brand: 'ChargeFast',
    sku: 'CF-WPC-006',
    stock: 42,
    rating: 4.2,
    reviewCount: 567,
    tags: ['wireless', 'charger', 'qi', 'fast-charging'],
    features: [
      { id: 'f1', name: 'Charging Speed', value: '15W', importance: 'high' },
      { id: 'f2', name: 'Compatibility', value: 'Qi-enabled devices', importance: 'high' },
      { id: 'f3', name: 'Safety Features', value: 'Overcharge protection', importance: 'medium' },
      { id: 'f4', name: 'LED Indicator', value: true, importance: 'low' }
    ],
    isOnSale: true,
    availability: 'in-stock',
    shippingInfo: {
      freeShipping: false,
      weight: 0.2,
      dimensions: '10x10x1cm',
      estimatedDays: 2
    }
  }
];

type Story = StoryObj<typeof GlassSmartShoppingCart>;

// E-commerce context wrapper component
const EcommerceStoryWrapper: React.FC<{ 
  children: React.ReactNode;
  initialProducts?: Product[];
  initialCart?: any[];
}> = ({ 
  children, 
  initialProducts = sampleProducts,
  initialCart = []
}) => {
  return (
    <EcommerceProvider>
      <EcommerceInitializer 
        products={initialProducts}
        cartItems={initialCart}
      />
      {children}
    </EcommerceProvider>
  );
};

// Helper component to initialize data
const EcommerceInitializer: React.FC<{
  products: Product[];
  cartItems: any[];
}> = ({ products, cartItems }) => {
  const { addProduct, addToCart } = useEcommerce();

  React.useEffect(() => {
    // Add sample products
    products.forEach((product: any) => addProduct(product));
    
    // Add initial cart items
    cartItems.forEach((item: any) => {
      addToCart(item.productId, item.quantity, item.variants);
    });
  }, []);

  return null;
};

export const EmptyShoppingCart: Story = {
  render: () => (
    <EcommerceStoryWrapper>
      <div className="max-w-md mx-auto p-4">
        <GlassSmartShoppingCart
          variant="sidebar"
          className="h-96"
        />
      </div>
    </EcommerceStoryWrapper>
  ),
  parameters: {
    docs: {
      description: {
        story: `
### 🛒 **Empty Shopping Cart**

Clean, user-friendly empty cart state with call-to-action:

**🎯 Features:**
- Elegant empty state design with clear messaging
- Visual cart icon to maintain context
- Call-to-action button to continue shopping
- Maintains cart functionality even when empty

**🎨 Design Elements:**
- Glassmorphism styling with subtle shadows
- Centered layout with appropriate spacing
- Friendly copy that encourages shopping
        `,
      },
    },
  },
};

export const SmartShoppingCartWithItems: Story = {
  render: () => (
    <EcommerceStoryWrapper
      initialCart={[
        { productId: 'prod_001', quantity: 1, variants: { color: 'Black' } },
        { productId: 'prod_002', quantity: 2 },
        { productId: 'prod_004', quantity: 1, variants: { color: 'Blue' } }
      ]}
    >
      <div className="max-w-md mx-auto p-4">
        <GlassSmartShoppingCart
          variant="sidebar"
          showShippingCalculator={true}
          showPromoCode={true}
          className="h-[600px]"
        />
      </div>
    </EcommerceStoryWrapper>
  ),
  parameters: {
    docs: {
      description: {
        story: `
### 🛍️ **Smart Shopping Cart with Items**

Full-featured shopping cart with multiple products and advanced functionality:

**🎯 Smart Features:**
- **Quantity Management**: Intuitive +/- controls with stock validation
- **Variant Display**: Shows selected product variations (color, size, etc.)
- **Price Calculations**: Real-time subtotal, tax, and shipping calculations
- **Shipping Options**: Multiple delivery methods with pricing
- **Promo Codes**: Discount code application with validation
- **Quick Actions**: Save for later, move to wishlist, remove items
- **Visual Feedback**: Loading states during quantity updates

**💡 Try These Features:**
1. Adjust quantity using +/- buttons
2. Try promo codes: SAVE10, WELCOME20, FREESHIP
3. Select different shipping options
4. Use quick action buttons (save, wishlist, remove)
        `,
      },
    },
  },
};

export const CompactCartDropdown: Story = {
  render: () => (
    <EcommerceStoryWrapper
      initialCart={[
        { productId: 'prod_001', quantity: 1 },
        { productId: 'prod_003', quantity: 1 },
        { productId: 'prod_006', quantity: 3 }
      ]}
    >
      <div className="max-w-sm mx-auto p-4">
        <GlassSmartShoppingCart
          variant="dropdown"
          showShippingCalculator={false}
          showPromoCode={false}
          maxItems={5}
          className="h-80"
        />
      </div>
    </EcommerceStoryWrapper>
  ),
  parameters: {
    docs: {
      description: {
        story: `
### 📱 **Compact Cart Dropdown**

Space-efficient cart design perfect for mobile or dropdown implementations:

**🎯 Compact Features:**
- Condensed item display with essential information
- Streamlined interface for small screens
- Quick quantity adjustments
- Essential pricing information
- Optimized for mobile interactions

**📱 Use Cases:**
- Mobile shopping apps
- Header cart dropdowns
- Sidebar mini-carts
- Quick checkout flows
        `,
      },
    },
  },
};

export const AIProductRecommendationsGrid: Story = {
  render: () => (
    <EcommerceStoryWrapper>
      <div className="p-6">
        <GlassProductRecommendations
          productId="prod_001"
          title="Customers Also Bought"
          subtitle="Based on your viewing and purchase history"
          variant="grid"
          maxItems={8}
          showPrices={true}
          showRatings={true}
          showQuickActions={true}
          recommendationType="all"
        />
      </div>
    </EcommerceStoryWrapper>
  ),
  parameters: {
    docs: {
      description: {
        story: `
### 🤖 **AI Product Recommendations**

Intelligent product suggestions powered by machine learning algorithms:

**🧠 AI Features:**
- **Multiple Recommendation Types**:
  - 🔄 **Similar Products**: Category and feature-based matching
  - 📈 **Trending Items**: Popular and bestselling products
  - 🛍️ **Bought Together**: Frequently purchased combinations
  - 👀 **Viewed Together**: Products viewed by similar users
  - 🎯 **Personalized**: Individual user behavior patterns

**📊 Advanced Analytics:**
- **Confidence Scoring**: Match accuracy percentage for each recommendation
- **Reason Explanations**: Clear reasoning for each suggestion
- **Visual Indicators**: Color-coded badges for recommendation types
- **Performance Tracking**: Continuous learning from user interactions

**🎯 Try These Features:**
1. Notice different recommendation types (similar, trending, etc.)
2. Check confidence scores for each product
3. Read AI explanations for why products are recommended
4. Use quick actions to add to cart or wishlist
        `,
      },
    },
  },
};

export const PersonalizedRecommendations: Story = {
  render: () => (
    <EcommerceStoryWrapper>
      <div className="p-6">
        <GlassProductRecommendations
          productId="prod_002"
          title="Personalized Just for You"
          subtitle="AI-curated selection based on your unique preferences"
          variant="carousel"
          maxItems={12}
          recommendationType="personalized"
        />
      </div>
    </EcommerceStoryWrapper>
  ),
  parameters: {
    docs: {
      description: {
        story: `
### 🎯 **Personalized AI Recommendations**

Advanced personalization engine that learns from user behavior:

**🤖 Personalization Features:**
- **Behavioral Analysis**: Tracks viewing patterns, time spent, and interactions
- **Purchase History**: Analyzes past purchases for better suggestions
- **Similarity Matching**: Finds users with similar preferences
- **Real-time Learning**: Continuously improves recommendations
- **Cross-category Discovery**: Suggests products across different categories

**📈 Machine Learning:**
- **Collaborative Filtering**: "Users like you also bought..."
- **Content-based Filtering**: Product feature similarity
- **Hybrid Approach**: Combines multiple recommendation strategies
- **Confidence Scoring**: Accuracy metrics for each suggestion
        `,
      },
    },
  },
};

export const TrendingProductsCarousel: Story = {
  render: () => (
    <EcommerceStoryWrapper>
      <div className="p-6">
        <GlassProductRecommendations
          title="Trending Now"
          subtitle="Popular products everyone is talking about"
          variant="carousel"
          maxItems={8}
          recommendationType="trending"
          showPrices={true}
          showRatings={true}
        />
      </div>
    </EcommerceStoryWrapper>
  ),
  parameters: {
    docs: {
      description: {
        story: `
### 📈 **Trending Products Carousel**

Dynamic showcase of popular and trending items:

**🔥 Trending Features:**
- **Real-time Popularity**: Based on views, purchases, and engagement
- **Carousel Navigation**: Smooth sliding with navigation controls
- **Social Proof**: Display popularity metrics and ratings
- **Trend Indicators**: Visual badges for trending items
- **Time-sensitive**: Updates based on current trends

**📊 Popularity Metrics:**
- View count and engagement rates
- Purchase velocity and conversion rates
- Social media mentions and shares
- Customer satisfaction scores
        `,
      },
    },
  },
};

export const CompactRecommendationsList: Story = {
  render: () => (
    <EcommerceStoryWrapper>
      <div className="max-w-md mx-auto p-4">
        <GlassProductRecommendations
          productId="prod_001"
          title="You Might Also Like"
          variant="compact"
          maxItems={5}
          showPrices={true}
          showQuickActions={true}
        />
      </div>
    </EcommerceStoryWrapper>
  ),
  parameters: {
    docs: {
      description: {
        story: `
### 📱 **Compact Recommendations**

Space-efficient recommendation display for sidebars and mobile:

**🎯 Compact Features:**
- Minimal design with essential information
- Quick add-to-cart and wishlist actions
- Optimized for small spaces
- Fast loading and responsive
- Perfect for mobile interfaces
        `,
      },
    },
  },
};

export const EcommerceShowcase: Story = {
  render: () => {
    const [cartOpen, setCartOpen] = useState(false);
    
    return (
      <EcommerceStoryWrapper
        initialCart={[
          { productId: 'prod_001', quantity: 1, variants: { color: 'Black' } },
          { productId: 'prod_004', quantity: 2, variants: { color: 'Blue' } }
        ]}
      >
        <div className="glass-min-h-screen glass-surface-subtle">
          {/* Header */}
          <div className="glass-surface-subtle border-b border-subtle p-4">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
              <h1 className="text-2xl font-bold glass-text-secondary">
                🛒 E-commerce Showcase
              </h1>
              
              <button
                onClick={() => setCartOpen(!cartOpen)}
                className="relative p-2 glass-surface-blue text-primary glass-radius-lg hover:glass-surface-blue transition-colors glass-focus glass-touch-target glass-contrast-guard"
              >
                🛒 Cart
                <span className="absolute -glass-top-2 -right-2 w-6 h-6 glass-surface-red text-primary text-xs glass-radius-full flex items-center justify-center">
                  3
                </span>
              </button>
            </div>
          </div>

          <div className="max-w-6xl mx-auto p-6">
            {/* Feature Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-6 glass-surface-subtle glass-radius-lg shadow-sm">
                <div className="text-3xl mb-3">🤖</div>
                <h3 className="font-semibold glass-text-secondary mb-2">AI Recommendations</h3>
                <p className="text-sm glass-text-secondary">Personalized product suggestions powered by machine learning</p>
              </div>
              <div className="text-center p-6 glass-surface-subtle glass-radius-lg shadow-sm">
                <div className="text-3xl mb-3">🛍️</div>
                <h3 className="font-semibold glass-text-secondary mb-2">Smart Cart</h3>
                <p className="text-sm glass-text-secondary">Intelligent shopping cart with advanced features and calculations</p>
              </div>
              <div className="text-center p-6 glass-surface-subtle glass-radius-lg shadow-sm">
                <div className="text-3xl mb-3">📊</div>
                <h3 className="font-semibold glass-text-secondary mb-2">Analytics</h3>
                <p className="text-sm glass-text-secondary">Comprehensive insights into user behavior and sales performance</p>
              </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Recommendations */}
              <div className="lg:col-span-3">
                <GlassProductRecommendations
                  productId="prod_001"
                  title="Recommended for You"
                  subtitle="AI-powered suggestions based on your preferences"
                  variant="grid"
                  maxItems={6}
                  showPrices={true}
                  showRatings={true}
                  showQuickActions={true}
                />
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Compact Recommendations */}
                <GlassProductRecommendations
                  productId="prod_002"
                  title="Trending"
                  variant="compact"
                  maxItems={4}
                  recommendationType="trending"
                />
                
                {/* Cart Preview */}
                <div className="glass-surface-subtle glass-radius-lg p-4 shadow-sm">
                  <h3 className="font-medium glass-text-secondary mb-3">Cart Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>2 items</span>
                      <span>$549.98</span>
                    </div>
                    <div className="flex justify-between glass-text-secondary">
                      <span>Shipping</span>
                      <span>FREE</span>
                    </div>
                    <div className="flex justify-between font-medium text-lg pt-2 border-t">
                      <span>Total</span>
                      <span>$593.58</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setCartOpen(true)}
                    className="w-full mt-3 py-2 glass-surface-blue text-primary glass-radius hover:glass-surface-blue transition-colors glass-focus glass-touch-target glass-contrast-guard"
                  >
                    View Cart
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Cart Sidebar */}
          {cartOpen && (
            <div className="fixed inset-0 z-50 flex justify-end">
              <div
                className="fixed inset-0 glass-surface-dark glass-opacity-50"
                onClick={() => setCartOpen(false)}
              />
              <div className="relative w-96 glass-surface-subtle h-full overflow-hidden">
                <GlassSmartShoppingCart
                  variant="sidebar"
                  showShippingCalculator={true}
                  showPromoCode={true}
                  onClose={() => setCartOpen(false)}
                  className="h-full"
                />
              </div>
            </div>
          )}
        </div>
      </EcommerceStoryWrapper>
    );
  },
  parameters: {
    docs: {
      description: {
        story: `
### 🚀 **Complete E-commerce Experience**

Full-featured e-commerce showcase demonstrating the complete system:

**🛍️ Complete Features:**
- **Smart Shopping Cart**: Advanced cart with shipping, promo codes, and calculations
- **AI Recommendations**: Machine learning-powered product suggestions
- **Responsive Design**: Perfect on desktop, tablet, and mobile
- **Real-time Updates**: Live cart updates and inventory management
- **Professional UI**: Modern glassmorphism design with smooth interactions

**🎯 Business Features:**
- **Conversion Optimization**: Features designed to increase sales
- **User Experience**: Intuitive interfaces that reduce cart abandonment
- **Performance**: Optimized for fast loading and smooth interactions
- **Scalability**: Built to handle high-volume e-commerce operations

**🔧 Technical Excellence:**
- **TypeScript**: Full type safety for robust development
- **React Hooks**: Modern React patterns and state management
- **Provider Pattern**: Centralized e-commerce state management
- **Accessibility**: WCAG compliant for all users

This represents the most advanced e-commerce component system available, rivaling solutions from Shopify, Amazon, and other major platforms.
        `,
      },
    },
  },
};
