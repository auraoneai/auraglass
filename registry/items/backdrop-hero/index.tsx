import * as React from 'react';
import { Backdrop } from 'aura-glass/backdrops';

export interface BackdropHeroProps {
  preset: 'aurora' | 'mesh' | 'photo' | 'video' | 'grain';
  title: string;
  lede?: string;
  cta?: React.ReactNode;
  src?: string;
  tone?: 'light' | 'dark' | 'auto';
  motion?: 'static' | 'drift';
}

/** backdrop-hero (REQ-SURF-155): hero section on a Backdrop — server-renderable
 * for aurora/mesh/grain presets. */
export function BackdropHero({ preset, title, lede, cta, src, tone, motion = 'static' }: BackdropHeroProps) {
  const mediaProps = preset === 'photo' ? { src, alt: '' } : preset === 'video' ? { src } : {};
  return (
    <Backdrop {...({ preset, scheme: tone, motion, ...mediaProps } as React.ComponentProps<typeof Backdrop>)}>
      <div data-ag-part="backdrop-hero" style={{ padding: '6rem 2rem', textAlign: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '2.5rem' }}>{title}</h1>
        {lede ? <p style={{ maxInlineSize: '40rem', margin: '1rem auto' }}>{lede}</p> : null}
        {cta}
      </div>
    </Backdrop>
  );
}
