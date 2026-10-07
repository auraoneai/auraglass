import type { Meta, StoryObj } from "@storybook/react";

import { Glass } from "../../primitives";
import {
  GlassEcommerceProvider as EcommerceProvider,
  useEcommerce,
} from "./GlassEcommerceProvider";

const EcommerceWorkspaceSummary = () => {
  const { cart, wishlist, shippingOptions, paymentMethods, cartTotal } =
    useEcommerce();

  return (
    <Glass
      className="glass-p-6"
      style={{ width: "min(520px, calc(100vw - 32px))" }}
    >
      <div className="glass-space-y-5">
        <div>
          <p className="glass-text-xs glass-font-medium glass-text-tertiary glass-uppercase glass-tracking-wide">
            Commerce workspace
          </p>
          <h2 className="glass-text-xl glass-font-semibold glass-text-primary glass-mt-1">
            Storefront services are ready
          </h2>
          <p className="glass-text-sm glass-text-secondary glass-mt-2">
            Cart, wishlist, fulfillment, and payment state are available to
            every surface inside the provider.
          </p>
        </div>

        <div className="glass-grid glass-grid-cols-2 glass-gap-3">
          <div className="glass-surface-subtle glass-radius-lg glass-p-4">
            <div className="glass-text-xs glass-text-tertiary">Cart items</div>
            <div className="glass-text-2xl glass-font-semibold glass-text-primary glass-mt-1">
              {cart.length}
            </div>
          </div>
          <div className="glass-surface-subtle glass-radius-lg glass-p-4">
            <div className="glass-text-xs glass-text-tertiary">Wishlist</div>
            <div className="glass-text-2xl glass-font-semibold glass-text-primary glass-mt-1">
              {wishlist.length}
            </div>
          </div>
          <div className="glass-surface-subtle glass-radius-lg glass-p-4">
            <div className="glass-text-xs glass-text-tertiary">Fulfillment</div>
            <div className="glass-text-lg glass-font-semibold glass-text-primary glass-mt-1">
              {shippingOptions.length} options
            </div>
          </div>
          <div className="glass-surface-subtle glass-radius-lg glass-p-4">
            <div className="glass-text-xs glass-text-tertiary">Payment</div>
            <div className="glass-text-lg glass-font-semibold glass-text-primary glass-mt-1">
              {paymentMethods.length} methods
            </div>
          </div>
        </div>

        <div className="glass-flex glass-items-center glass-justify-between glass-border-t glass-border-subtle glass-pt-4">
          <span className="glass-text-sm glass-text-secondary">
            Current total
          </span>
          <span className="glass-text-lg glass-font-semibold glass-text-primary">
            ${cartTotal.toFixed(2)}
          </span>
        </div>
      </div>
    </Glass>
  );
};

const meta = {
  title: "Workflows/Glass Ecommerce Provider",
  component: EcommerceProvider,
  parameters: {
    layout: "centered",
    previewSurface: "component",
    docs: {
      description: {
        component:
          "Direct rendering of the public GlassEcommerceProvider export with a live consumer reading its commerce state.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof EcommerceProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const GlassEcommerceProvider: Story = {
  args: {
    children: null,
  },
  render: () => (
    <EcommerceProvider>
      <EcommerceWorkspaceSummary />
    </EcommerceProvider>
  ),
};
