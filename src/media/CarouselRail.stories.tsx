// CarouselRail.stories.tsx — states (SURF-488).
import type { Meta, StoryObj } from '@storybook/react';
import { CarouselRail } from './CarouselRail/CarouselRail';

const SLIDES = [1, 2, 3, 4, 5].map((i) => ({
  id: `s-${i}`,
  label: `Card ${i}`,
  children: <div style={{ height: 120, borderRadius: 12, background: 'linear-gradient(135deg,#8899bb,#dde4f0)', display: 'grid', placeItems: 'center' }}>Slide {i}</div>,
}));

const meta = {
  title: 'Media/CarouselRail',
  parameters: { ag: { subject: 'CarouselRail', kind: 'component' } },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Tabs: Story = { render: () => <CarouselRail.Root label="Highlights" slides={SLIDES} /> };
export const Buttons: Story = { render: () => <CarouselRail.Root label="Highlights" slides={SLIDES} indicatorsAs="buttons" /> };
export const Loop: Story = { render: () => <CarouselRail.Root label="Looping" slides={SLIDES} loop /> };
export const PerView: Story = { render: () => <CarouselRail.Root label="Two up" slides={SLIDES} slidesPerView={2} /> };
export const Autoplay: Story = { render: () => <CarouselRail.Root label="Auto" slides={SLIDES} autoplay={{ interval: 8000 }} loop /> };
