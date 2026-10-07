import type { Meta, StoryObj } from "@storybook/react";

import {
  GlassEcommerceProvider as EcommerceProvider,
  type Product,
} from "./GlassEcommerceProvider";
import { GlassProductRecommendations as ProductRecommendations } from "./GlassProductRecommendations";

const productArtwork = (
  kind: "headphones" | "speaker" | "dock",
  tone: string
) =>
  `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="360" height="240" viewBox="0 0 360 240">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#ffffff"/>
          <stop offset="1" stop-color="${tone}"/>
        </linearGradient>
      </defs>
      <rect width="360" height="240" rx="36" fill="url(#g)"/>
      <ellipse cx="180" cy="202" rx="86" ry="12" fill="#64748b" opacity=".14"/>
      ${
        kind === "headphones"
          ? `
        <path d="M116 126v-22c0-43 28-70 64-70s64 27 64 70v22" fill="none" stroke="#475569" stroke-width="12" stroke-linecap="round"/>
        <rect x="96" y="108" width="38" height="68" rx="18" fill="#ffffff" stroke="#64748b" stroke-width="5"/>
        <rect x="226" y="108" width="38" height="68" rx="18" fill="#ffffff" stroke="#64748b" stroke-width="5"/>
        <rect x="105" y="120" width="20" height="44" rx="10" fill="#cbd5e1"/>
        <rect x="235" y="120" width="20" height="44" rx="10" fill="#cbd5e1"/>
      `
          : kind === "speaker"
            ? `
        <rect x="118" y="38" width="124" height="156" rx="28" fill="#ffffff" stroke="#64748b" stroke-width="5"/>
        <circle cx="180" cy="116" r="42" fill="#e2e8f0" stroke="#64748b" stroke-width="5"/>
        <circle cx="180" cy="116" r="18" fill="#94a3b8"/>
        <circle cx="180" cy="66" r="6" fill="#64748b"/>
      `
            : `
        <rect x="132" y="26" width="96" height="146" rx="22" fill="#ffffff" stroke="#64748b" stroke-width="5"/>
        <rect x="145" y="42" width="70" height="104" rx="10" fill="#e2e8f0"/>
        <path d="M92 188h176l-18 22H110z" fill="#ffffff" stroke="#64748b" stroke-width="5" stroke-linejoin="round"/>
        <rect x="170" y="178" width="20" height="10" rx="5" fill="#94a3b8"/>
      `
      }
    </svg>
  `)}`;

const products = [
  {
    id: "studio-headphones",
    name: "Studio Headphones",
    price: 329,
    originalPrice: 379,
    thumbnail: productArtwork("headphones", "#dbe4ee"),
    category: "Audio",
    rating: 4.9,
    reviewCount: 284,
  },
  {
    id: "travel-speaker",
    name: "Travel Speaker",
    price: 189,
    thumbnail: productArtwork("speaker", "#e2e8f0"),
    category: "Audio",
    rating: 4.8,
    reviewCount: 176,
  },
  {
    id: "listening-dock",
    name: "Listening Dock",
    price: 149,
    thumbnail: productArtwork("dock", "#cbd5e1"),
    category: "Accessories",
    rating: 4.7,
    reviewCount: 92,
  },
] satisfies Array<Partial<Product> & Pick<Product, "id" | "name" | "price">>;

const meta = {
  title: "Workflows/Glass Product Recommendations",
  component: ProductRecommendations,
  parameters: {
    layout: "centered",
    previewSurface: "component",
    docs: {
      description: {
        component:
          "Direct rendering of the public GlassProductRecommendations export with deterministic product artwork and recommendation scores.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ProductRecommendations>;

export default meta;
type Story = StoryObj<typeof meta>;

export const GlassProductRecommendations: Story = {
  render: () => (
    <EcommerceProvider>
      <div style={{ width: "min(920px, calc(100vw - 32px))" }}>
        <ProductRecommendations
          products={products}
          title="Designed for your listening space"
          subtitle="A focused set of complementary studio essentials."
          maxItems={2}
          variant="compact"
          showPrices
          showRatings
          showQuickActions
        />
      </div>
    </EcommerceProvider>
  ),
};
