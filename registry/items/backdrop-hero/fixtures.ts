// fixtures.ts — deterministic sample data for backdrop-hero (no clocks, no randomness,
// no network — contract §3.3 file contract). Stories and showcases import it.
import type { BackdropHeroProps } from './index';

export const HERO_PROPS: BackdropHeroProps = {
  preset: 'photo',
  title: 'Glass everywhere',
  lede: 'Ship the material',
  src: '/media/hero.jpg',
};

export const HERO_EMPTY_PROPS: BackdropHeroProps = { preset: 'aurora', title: '', lede: '' };
