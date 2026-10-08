/* MAT-154 — hydration: renderToString then hydrateRoot of every server-safe
   export with console.error/console.warn spied for zero calls. */
import { describe, expect, it, jest } from '@jest/globals';
import * as React from 'react';
import { renderToString } from 'react-dom/server';
import { hydrateRoot } from 'react-dom/client';
import { act } from '@testing-library/react';
import { Surface } from '../Surface';
import { SurfaceGroup } from '../SurfaceGroup';
import { Environment } from '../Environment';
import { ScrollEdge } from '../ScrollEdge';
import { ConcentricFrame } from '../ConcentricFrame';
import { materialProps } from '../materialProps';

const Cases = () => (
  <Environment backdrop="light">
    <SurfaceGroup>
      <Surface layer="chrome" thickness="regular">a</Surface>
      <Surface layer="content">b</Surface>
      <Surface layer="chrome" render={<span />}>c</Surface>
    </SurfaceGroup>
    <ConcentricFrame radius="md" inset="2">
      <Surface shape="concentric">d</Surface>
    </ConcentricFrame>
    <ScrollEdge edge="top" />
  </Environment>
);

describe('hydration', () => {
  it('hydrates the whole tree with zero console errors', async () => {
    const err = jest.spyOn(console, 'error').mockImplementation(() => {});
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const host = document.createElement('div');
    document.body.appendChild(host);
    host.innerHTML = renderToString(<Cases />);
    await act(async () => {
      hydrateRoot(host, <Cases />);
    });
    expect(err).not.toHaveBeenCalled();
    expect(warn).not.toHaveBeenCalled();
    err.mockRestore(); warn.mockRestore();
    host.remove();
  });

  it('materialProps output is hydration-stable', () => {
    const a = materialProps({ layer: 'chrome', thickness: 'thin' });
    expect(Object.keys(a).every((k) => k.startsWith('data-ag-'))).toBe(true);
    expect(a['data-ag-thickness']).toBe('thin');
  });
});
