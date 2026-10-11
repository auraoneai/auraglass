/* mobile-productivity stories (REQ-QUAL-58): kind/tag `showcase`, one full-page
   story (layout fullscreen, 390×844) and fragments for the tab bar + accessory and
   the quick-add Sheet at each of its three detents. The 834 layout is a viewport option. */
import type { Meta, StoryObj } from '@storybook/react';
import { MobileProductivity, MobileSheetAtDetent, MobileTabBar } from './MobileProductivity.showcase';

const VIEWPORTS = {
  phone390: { name: 'Phone 390×844', styles: { width: '390px', height: '844px' }, type: 'mobile' },
  tablet834: { name: 'Tablet 834×1194', styles: { width: '834px', height: '1194px' }, type: 'tablet' },
} as const;

const meta = {
  title: 'Showcases/Mobile Productivity',
  component: MobileProductivity,
  tags: ['showcase'],
  globals: { scene: 'photo', viewport: { value: 'phone390', isRotated: false } },
  parameters: {
    layout: 'fullscreen',
    viewport: { options: VIEWPORTS },
    ag: { subject: 'mobile-productivity', kind: 'showcase' },
  },
} satisfies Meta<typeof MobileProductivity>;
export default meta;
type Story = StoryObj<typeof meta>;

export const FullPage: Story = { name: 'Full page' };

export const TabBarAccessory: Story = {
  name: 'Tab bar + accessory',
  parameters: { layout: 'padded' },
  render: () => <MobileTabBar />,
};

export const SheetPeek: Story = {
  name: 'Sheet detent 1 (peek)',
  render: () => <MobileSheetAtDetent detent={0} />,
};

export const SheetForm: Story = {
  name: 'Sheet detent 2 (form)',
  render: () => <MobileSheetAtDetent detent={1} />,
};

export const SheetFull: Story = {
  name: 'Sheet detent 3 (full)',
  render: () => <MobileSheetAtDetent detent={2} />,
};
