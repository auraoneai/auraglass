/* REQ-QUAL-54 (REQ-FIN-106, FIN-451): Material Lab controls and spec knobs.
   Discrete axes reach the rendered Surface as public material attributes; public knobs are written by `style` on the
   Lab subtree only while they differ from the shipped value; spec knobs write only private `--_ag-*` overrides on
   `[data-ag-lab-override]`; the deviation badge, "Reset to shipped" and "Export MaterialSpec patch" behave as specified;
   with the CC-Q2 seam absent the spec panel says "pending seam" and exports nothing. */
import { describe, expect, it } from '@jest/globals';
import * as React from 'react';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { LabControls, LabSubject, PUBLIC_KNOBS, subtreeStyle, useLab } from '../../.storybook/lab/LabControls';
import type { LabAxes } from '../../.storybook/lab/LabControls';
import { SPEC_KNOBS, exportPatch, labSpecSeam, manifestEntryProblems, seamProblems } from '../../.storybook/lab/SpecKnobs';
import type { LabSpecSeam } from '../../.storybook/lab/SpecKnobs';
import { AuraGlassProvider } from '../../src/theme';

/** A well-formed seam for the tests (the real one is the CC-Q2 contract export; these names are fixtures only). */
const FIXTURE_SEAM = Object.fromEntries(SPEC_KNOBS.map((k) => [k.id, {
  privateVar: `--_ag-fixture-${k.id}`, token: `material.fixture.${k.id}`, cssVar: `--ag-fixture-${k.id}`,
}])) as unknown as LabSpecSeam;

function Lab({ initial = {}, seam }: { initial?: Partial<LabAxes>; seam: LabSpecSeam | null }) {
  const lab = useLab(initial, seam);
  return <><LabSubject lab={lab}>subject</LabSubject><LabControls lab={lab} /></>;
}
const subject = () => document.querySelector<HTMLElement>('[data-ag-lab-override]')!;
const subtree = () => document.querySelector<HTMLElement>('[data-ag-part="lab-subtree"]')!;
const privateInline = (el: HTMLElement) => Array.from(el.style).filter((p) => p.startsWith('--_ag-'));
const group = (name: RegExp) => screen.getByRole('radiogroup', { name });

describe('seam detection', () => {
  it('is pending while src/contracts/tokens.ts has no LAB_SPEC_VARS', () => {
    expect(labSpecSeam()).toBeNull();
    expect(labSpecSeam({})).toBeNull();
  });
  it('accepts a well-formed seam and rejects malformed ones with reasons', () => {
    expect(seamProblems(FIXTURE_SEAM)).toEqual([]);
    expect(labSpecSeam({ LAB_SPEC_VARS: FIXTURE_SEAM })).toBe(FIXTURE_SEAM);
    const bad = { ...FIXTURE_SEAM, rim: { privateVar: '--ag-rim', token: 'rim', cssVar: '--_ag-rim' } };
    expect(seamProblems(bad)).toEqual(['rim.privateVar must start with --_ag-', 'rim.token must be a DTCG path', 'rim.cssVar must start with --ag-']);
    expect(labSpecSeam({ LAB_SPEC_VARS: bad })).toBeNull();
  });
});

describe('discrete axes and public knobs', () => {
  it('thickness, variant, layer/content and booleans reach the Surface as material attributes', () => {
    render(<Lab seam={null} initial={{ layer: 'chrome', variant: 'regular' }} />);
    const s = subject();
    expect(s).toHaveAttribute('data-ag-surface', '');
    expect(s).toHaveAttribute('data-ag-thickness', 'regular');
    fireEvent.click(within(group(/thickness/i)).getByRole('radio', { name: 'thick' }));
    expect(s).toHaveAttribute('data-ag-thickness', 'thick');
    fireEvent.click(within(group(/variant/i)).getByRole('radio', { name: 'clear' }));
    expect(s).toHaveAttribute('data-ag-variant', 'clear');
    fireEvent.click(screen.getByRole('checkbox', { name: 'prominent' }));
    expect(s).toHaveAttribute('data-ag-prominent', '');
    fireEvent.click(within(group(/layer/i)).getByRole('radio', { name: 'content' }));
    expect(subject()).toHaveAttribute('data-ag-content', 'content-raised');
    expect(subject()).not.toHaveAttribute('data-ag-variant');
  });

  it('tier and transparency scope a provider on the Lab subtree (nested under the preview provider)', () => {
    render(<AuraGlassProvider storage={null}><Lab seam={null} /></AuraGlassProvider>);
    expect(subtree().querySelector('[data-ag-provider]')).toBeNull();
    fireEvent.click(within(group(/transparency/i)).getByRole('radio', { name: 'solid' }));
    const scoped = subtree().querySelector('[data-ag-provider]');
    expect(scoped).not.toBeNull();
    expect(scoped!.contains(subject())).toBe(true);
  });

  it('light angle writes --ag-light-angle on the subtree only while it differs from shipped', () => {
    render(<Lab seam={null} />);
    const angle = screen.getByRole('slider', { name: /light angle/i });
    const shipped = Number(angle.getAttribute('aria-valuenow'));
    expect(shipped).toBe(PUBLIC_KNOBS[0].fallback); // jsdom does not resolve the registered property
    expect(subtree().style.getPropertyValue('--ag-light-angle')).toBe('');
    fireEvent.change(angle, { target: { value: String(shipped + 36) } });
    expect(subtree().style.getPropertyValue('--ag-light-angle')).toBe(`${shipped + 36}deg`);
    expect(angle).toHaveAttribute('aria-valuenow', String(shipped + 36));
    fireEvent.change(angle, { target: { value: String(shipped) } });
    expect(subtree().style.getPropertyValue('--ag-light-angle')).toBe('');
    expect(subtreeStyle({ specular: 0.8, glassOpacity: 0.2 })).toEqual({ '--ag-specular': '0.8', '--ag-glass-opacity': '0.2' });
  });
});

describe('spec knobs', () => {
  it('pending seam: the panel says so, writes nothing and exports nothing', () => {
    render(<Lab seam={null} />);
    expect(screen.getByRole('note')).toHaveTextContent(/^pending seam/);
    expect(screen.getByRole('button', { name: 'Export MaterialSpec patch' })).toBeDisabled();
    expect(privateInline(subject())).toEqual([]);
    expect(exportPatch({ rim: 1.5 }, { rim: 1 }, null)).toBeNull();
    expect(screen.queryByText('Spec deviation — not shipped')).toBeNull();
  });

  it('with the seam: overrides are private vars on [data-ag-lab-override], badge on deviation, reset removes them', () => {
    // Compiled defaults are read from the subject's computed style before any override.
    const sheet = document.createElement('style');
    sheet.textContent = `[data-ag-lab-override] { ${SPEC_KNOBS.map((k) => `${FIXTURE_SEAM[k.id].privateVar}: ${k.min}${k.unit};`).join(' ')} }`;
    document.head.appendChild(sheet);
    try {
      render(<Lab seam={FIXTURE_SEAM} />);
      const rim = screen.getByRole('slider', { name: /^Rim/ });
      expect(rim).toHaveAttribute('aria-valuenow', '0.5');
      expect(screen.queryByText('Spec deviation — not shipped')).toBeNull();
      fireEvent.change(rim, { target: { value: '1.5' } });
      expect(subject().style.getPropertyValue('--_ag-fixture-rim')).toBe('1.5px');
      expect(subtree().style.getPropertyValue('--_ag-fixture-rim')).toBe('');
      expect(screen.getByText('Spec deviation — not shipped')).toBeInTheDocument();

      fireEvent.click(screen.getByRole('button', { name: 'Export MaterialSpec patch' }));
      const patch = JSON.parse(screen.getByLabelText('MaterialSpec patch').textContent ?? 'null') as unknown[];
      expect(patch).toEqual([{ name: 'material.fixture.rim', cssVar: '--ag-fixture-rim', type: 'glass-material', tier: 'material', modes: {}, value: '1.5px' }]);
      expect(patch.map(manifestEntryProblems)).toEqual([[]]);

      fireEvent.change(rim, { target: { value: '0.5' } });
      expect(screen.queryByText('Spec deviation — not shipped')).toBeNull();
      fireEvent.change(rim, { target: { value: '2' } });
      act(() => { subject().style.setProperty('--_ag-stray', '1'); });
      fireEvent.click(screen.getByRole('button', { name: 'Reset to shipped' }));
      expect(privateInline(subject())).toEqual([]);
      expect(screen.queryByText('Spec deviation — not shipped')).toBeNull();
      expect(screen.getByRole('slider', { name: /^Rim/ })).toHaveAttribute('aria-valuenow', '0.5');
    } finally {
      sheet.remove();
    }
  });

  it('Reset to shipped also restores public knobs and discrete axes', () => {
    render(<Lab seam={null} initial={{ thickness: 'thin' }} />);
    fireEvent.click(within(group(/thickness/i)).getByRole('radio', { name: 'thick' }));
    fireEvent.change(screen.getByRole('slider', { name: /specular/i }), { target: { value: '0.9' } });
    fireEvent.click(screen.getByRole('button', { name: 'Reset to shipped' }));
    expect(subject()).toHaveAttribute('data-ag-thickness', 'thin');
    expect(subtree().getAttribute('style') ?? '').toBe('');
  });

  it('the patch validator rejects entries that do not match TokenManifestEntry glass-material', () => {
    expect(manifestEntryProblems({ name: 'material.x', cssVar: '--ag-x', type: 'number', tier: 'material', modes: {}, value: '1' }))
      .toEqual(['type must be glass-material']);
    expect(manifestEntryProblems({ name: 'x', cssVar: '--_ag-x', type: 'glass-material', tier: 'ref', modes: { hover: '1' }, value: '', extra: 1 }))
      .toEqual(['keys must be exactly name,cssVar,type,tier,modes,value (got cssVar,extra,modes,name,tier,type,value)', 'name must be a DTCG path',
        'cssVar must start with --ag-', 'tier must be sys|material|comp', 'modes must map known modes to strings', 'value must be a non-empty string']);
  });
});
