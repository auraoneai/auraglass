/* MAT-14 (REQ-MAT-14, REQ-FIN-52, FIN D.3-10): the provider's `preset` prop
   applies a preset with no manual mount registration. Rendering
   <AuraGlassProvider preset="graphite"> yields exactly one <style> whose text
   is the generated graphite cssText (scoped to [data-ag-root], with
   `--ag-color-accent: light-dark(`).

   Producer: the presetCss registration is REQ-FIN-04's (FIN-A,
   src/theme/mounts.ts, registered at first provider render). Until it is on
   `next`, the no-style case raises `pending: …` (PRD-F §4.3 rule 2 — the lane
   runner classifies it pending, never a pass); at AG_SCOPE=release the same
   condition is a plain failure. This file registers nothing itself. */
import { afterEach, describe, expect, it } from '@jest/globals';
import * as React from 'react';
import { render } from '@testing-library/react';
import { AuraGlassProvider } from '../AuraGlassProvider';
import { presetCssText } from '../presets';

const PRODUCER = 'REQ-FIN-04 provider mounts (FIN-A src/theme/mounts.ts registers presetCss)';
const pendingOrFail = (reason: string): never => {
  if (process.env.AG_SCOPE === 'release') throw new Error(`release scope: ${reason} (producer: ${PRODUCER})`);
  const e = new Error(`pending: ${reason} (producer: ${PRODUCER})`);
  e.name = 'AgPendingProducer';
  throw e;
};

afterEach(() => {
  document.documentElement.removeAttribute('data-ag-root');
  document.body.querySelectorAll('[data-ag-portal-root]').forEach((e) => e.remove());
});

describe('AuraGlassProvider preset prop (MAT-14)', () => {
  it('preset="graphite" renders one <style> with the graphite cssText, no manual registration', () => {
    const { container } = render(
      React.createElement(AuraGlassProvider, { preset: 'graphite' }, React.createElement('p', null, 'x')),
    );
    const styles = [...document.querySelectorAll('style')].filter((s) => (s.textContent ?? '').includes('--ag-color-'));
    if (styles.length === 0) pendingOrFail('AuraGlassProvider rendered no preset <style>: presetCss is not registered');
    expect(styles).toHaveLength(1);
    const css = styles[0]!.textContent ?? '';
    expect(css).toContain('--ag-color-accent: light-dark(');
    expect(css).toBe(presetCssText.graphite);
    expect(css.startsWith('[data-ag-root] {')).toBe(true);
    expect(container.contains(styles[0]!)).toBe(true);
    // no unregistered attribute is written for the preset
    expect(document.querySelector('[data-ag-theme]')).toBeNull();
  });
});
