// CarouselRail.stories.tsx — states (SURF-488) + the subjects the carousel
// APG, autoplay (L9) and blur-budget specs drive (REQ-SURF-147..150).
import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { CarouselRail, type CarouselRailRootProps } from './CarouselRail/CarouselRail';
import { AuraGlassProvider } from '../theme';
import { Backdrop } from '../backdrops';

const SLIDES = [1, 2, 3, 4, 5].map((i) => ({
  id: `s-${i}`,
  label: `Card ${i}`,
  children: <div style={{ height: 120, display: 'grid', placeItems: 'center' }}>Slide {i}</div>,
}));

/** Renders the rail plus a visible readout of the last onIndexChange value,
 * so browser specs can assert the callback (swipe, autoplay). */
function Observed(props: Omit<CarouselRailRootProps, 'slides' | 'onIndexChange'> & { slides?: CarouselRailRootProps['slides'] }) {
  const [last, setLast] = React.useState<number | null>(null);
  return (
    <div style={{ maxInlineSize: 640 }}>
      <CarouselRail.Root slides={SLIDES} {...props} onIndexChange={setLast} />
      <output data-testid="carousel-index">{last === null ? '' : String(last)}</output>
    </div>
  );
}

const meta = {
  title: 'Media/CarouselRail',
  parameters: { ag: { subject: 'CarouselRail', kind: 'component' } },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Tabs: Story = { render: () => <Observed label="Highlights" /> };
export const Buttons: Story = { render: () => <Observed label="Highlights" indicatorsAs="buttons" /> };
export const Loop: Story = { render: () => <CarouselRail.Root label="Looping" slides={SLIDES} loop /> };
export const PerView: Story = { render: () => <CarouselRail.Root label="Two up" slides={SLIDES} slidesPerView={2} /> };
/** Autoplay prop without the continuous gate: never rotates; the toggle offers Start. */
export const Autoplay: Story = { render: () => <Observed label="Auto" autoplay={{ interval: 8000 }} loop /> };
/** Autoplay under the gate: allowContinuous + motion=full → [data-ag-continuous="on"]. */
export const AutoplayGated: Story = {
  render: () => (
    <AuraGlassProvider allowContinuous motion="full">
      <Observed label="Auto (gated)" autoplay={{ interval: 5000 }} loop />
    </AuraGlassProvider>
  ),
};
/** Compositional parts: custom layout, Indicators as="buttons". */
export const Composed: Story = {
  render: () => (
    <CarouselRail.Root label="Composed" slides={SLIDES}>
      <CarouselRail.Viewport />
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
        <CarouselRail.Prev />
        <CarouselRail.Indicators as="buttons" />
        <CarouselRail.Next />
      </div>
    </CarouselRail.Root>
  ),
};
/** Over media (a SURF mesh backdrop): clear chrome navigation, data-ag-backdrop=media on the root. */
export const OverMedia: Story = {
  render: () => (
    <Backdrop preset="mesh" scheme="dark">
      <Observed label="Gallery" overMedia />
    </Backdrop>
  ),
};
