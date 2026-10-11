/* ecommerce stories (REQ-QUAL-58): kind/tag `showcase`, one full-page story
   (layout fullscreen) and the product-detail and cart-sheet fragments. Tier S2. */
import type { Meta, StoryObj } from '@storybook/react';
import { Ecommerce, EcommerceCartSheet, EcommerceProductFragment } from './Ecommerce.showcase';

const meta = {
  title: 'Showcases/Ecommerce',
  component: Ecommerce,
  tags: ['showcase'],
  globals: { scene: 'photo' },
  parameters: { layout: 'fullscreen', ag: { subject: 'ecommerce', kind: 'showcase' } },
} satisfies Meta<typeof Ecommerce>;
export default meta;
type Story = StoryObj<typeof meta>;

export const FullPage: Story = { name: 'Full page' };

export const ProductDetail: Story = {
  name: 'Product detail',
  parameters: { layout: 'padded' },
  render: () => <EcommerceProductFragment />,
};

export const CartSheet: Story = {
  name: 'Cart sheet',
  render: () => <EcommerceCartSheet />,
};
