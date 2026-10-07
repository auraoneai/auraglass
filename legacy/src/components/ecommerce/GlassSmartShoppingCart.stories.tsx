import type { Meta, StoryObj } from "@storybook/react";

import {
  GlassEcommerceProvider as EcommerceProvider,
  type CartItem,
  type Product,
} from "./GlassEcommerceProvider";
import { GlassSmartShoppingCart as ShoppingCart } from "./GlassSmartShoppingCart";

const productArtwork = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 240 240">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#f8fafc"/>
        <stop offset="1" stop-color="#cbd5e1"/>
      </linearGradient>
    </defs>
    <rect width="240" height="240" rx="42" fill="url(#g)"/>
    <circle cx="120" cy="105" r="52" fill="none" stroke="#64748b" stroke-width="14"/>
    <path d="M76 174h88" stroke="#334155" stroke-width="14" stroke-linecap="round"/>
  </svg>
`)}`;

const auroraHeadphones: Product = {
  id: "aurora-headphones",
  name: "Aurora Studio Headphones",
  description: "Spatial audio headphones with adaptive noise control.",
  price: 329,
  originalPrice: 379,
  currency: "USD",
  images: [productArtwork],
  thumbnail: productArtwork,
  category: "Audio",
  brand: "Aura",
  sku: "AU-STUDIO-01",
  stock: 18,
  rating: 4.9,
  reviewCount: 284,
  tags: ["spatial-audio", "wireless"],
  features: [
    { id: "spatial", name: "Spatial audio", value: true, importance: "high" },
  ],
  isOnSale: true,
  availability: "in-stock",
};

const representativeItems: CartItem[] = [
  {
    id: "cart-aurora-headphones",
    productId: auroraHeadphones.id,
    product: auroraHeadphones,
    quantity: 1,
    addedAt: new Date("2026-08-12T12:00:00.000Z"),
  },
];

const meta = {
  title: "Workflows/Glass Smart Shopping Cart",
  component: ShoppingCart,
  parameters: {
    layout: "centered",
    previewSurface: "component",
    docs: {
      description: {
        component:
          "Direct rendering of both public GlassSmartShoppingCart and SmartShoppingCart export names with deterministic product data.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ShoppingCart>;

export default meta;
type Story = StoryObj<typeof meta>;

const renderCart = (items: CartItem[]) => (
  <EcommerceProvider>
    <div style={{ width: "min(520px, calc(100vw - 32px))" }}>
      <ShoppingCart
        items={items}
        variant="sidebar"
        compact
        contained
        maxHeight="min(540px, calc(100vh - 48px))"
        showRecommendations={false}
        showShippingCalculator={false}
        showPromoCode={false}
      />
    </div>
  </EcommerceProvider>
);

export const GlassSmartShoppingCart: Story = {
  render: () => renderCart(representativeItems),
};

export const SmartShoppingCart: Story = {
  render: () => renderCart([]),
};
