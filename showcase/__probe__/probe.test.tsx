import * as React from 'react';
import { render } from '@testing-library/react';
jest.mock('../media-workspace/assets/still-harbor.avif', () => 'harbor.avif');
jest.mock('../media-workspace/assets/still-ridge.avif', () => 'ridge.avif');
jest.mock('../media-workspace/assets/still-dunes.avif', () => 'dunes.avif');
jest.mock('../media-workspace/assets/still-night.avif', () => 'night.avif');
jest.mock('../spatial-control-center/assets/room-living.avif', () => 'living.avif');
jest.mock('../spatial-control-center/assets/room-studio.avif', () => 'studio.avif');
jest.mock('../spatial-control-center/assets/room-kitchen.avif', () => 'kitchen.avif');
import { MediaWorkspace } from '../media-workspace/MediaWorkspace.showcase';
import { SpatialControlCenter } from '../spatial-control-center/SpatialControlCenter.showcase';
import { MusicPlayer } from '../music-player/MusicPlayer.showcase';

function dump(el: HTMLElement) {
  const out: string[] = [];
  el.querySelectorAll<HTMLElement>('[data-ag-surface], [data-ag-backdrop]').forEach((n) => {
    let depth = 0; let p = n.parentElement;
    while (p) { if (p.hasAttribute('data-ag-surface') && p.getAttribute('data-ag-layer') !== 'content') depth++; p = p.parentElement; }
    const a = (k: string) => n.getAttribute(k);
    out.push(`${'  '.repeat(depth)}${n.tagName.toLowerCase()} part=${a('data-ag-part')} layer=${a('data-ag-layer')} var=${a('data-ag-variant')} content=${a('data-ag-content')} shape=${a('data-ag-shape')} radius=${a('data-ag-radius')} nested=${a('data-ag-allow-nested')} bd=${a('data-ag-backdrop')} cls=${n.className}`);
  });
  return out.join('\n');
}
test('probe', () => {
  const r1 = render(<MediaWorkspace />); console.log('MW\n' + dump(document.body)); r1.unmount();
  const r2 = render(<MusicPlayer />); console.log('MP\n' + dump(document.body)); r2.unmount();
  const r3 = render(<SpatialControlCenter />); console.log('SCC\n' + dump(document.body)); r3.unmount();
});
