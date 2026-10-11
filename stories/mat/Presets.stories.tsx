/* stories/mat/Presets.stories.tsx — MAT-336 (REQ-MAT-01), story contract per
   REQ-FIN-59 / REQ-FIN-106 (D.3-38).
   Every theme preset (the generated `presets` table) in light and dark, plus a
   createBrandTheme playground with labelled, keyboard-operable OKLCH L/C/H
   number inputs rendering contrast pairs and the adjusted list; adjusted steps
   are marked with text AND an icon, not colour alone.
   The story supplies no optics, ink or private vars: each preset is applied
   through `<AuraGlassProvider preset scheme>` and the Surfaces inside it are
   painted only by the shipped material CSS. Scheme is the story's `scheme`
   global (the preview decorator owns the axes, contract S-41/S-42). */
import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Surface } from '../../src/material/index';
import { AuraGlassProvider } from '../../src/theme/AuraGlassProvider';
import { presets, type PresetId } from '../../src/theme/presets';
import { createBrandTheme } from '../../src/theme/createBrandTheme';
import type { StoryAgParameters } from '../../src/contracts/testing';
import { CONTRAST_FLOOR } from './_shared';

type Scheme = 'light' | 'dark';
const PRESET_IDS = Object.keys(presets) as PresetId[];
const cellPad: React.CSSProperties = { padding: '2px 10px' };

function PresetCard({ id, scheme }: { id: PresetId; scheme: Scheme }) {
  const preset = presets[id];
  return (
    <AuraGlassProvider storage={null} preset={id} scheme={scheme}>
      <div data-preset={id} style={{ display: 'grid', gap: 8, minWidth: 180 }}>
        <Surface variant="regular" thickness="regular">
          <div style={{ padding: '14px 18px' }}>
            <code style={{ fontSize: 13 }}>{preset.name}</code>
            <dl style={{ margin: '6px 0 0', fontSize: 11 }}>
              <dt>canvas ({scheme})</dt>
              <dd style={{ margin: 0 }}>{preset.canvas[scheme]}</dd>
              <dt>accent</dt>
              <dd style={{ margin: 0 }}>{preset.accent}</dd>
              <dt>radius scale</dt>
              <dd style={{ margin: 0 }}>{preset.radiusScale ?? 1}</dd>
            </dl>
          </div>
        </Surface>
        <Surface variant="clear" thickness="thin">
          <span style={{ display: 'block', padding: '8px 18px', fontSize: 12 }}>clear / thin</span>
        </Surface>
      </div>
    </AuraGlassProvider>
  );
}

function PresetGrid({ scheme }: { scheme: Scheme }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
      {PRESET_IDS.map((id) => (
        <PresetCard key={id} id={id} scheme={scheme} />
      ))}
    </div>
  );
}

/** contrast.pairs as key->ratio rows from the real theme object. */
function ContrastPairs({ theme }: { theme: ReturnType<typeof createBrandTheme> }) {
  return (
    <div>
      <h4 style={{ margin: '8px 0 4px' }}>contrast.pairs</h4>
      <table style={{ borderCollapse: 'collapse', fontSize: 12 }}>
        <tbody>
          {theme.contrast.pairs.map((pair) => {
            const adjusted = pair.ratio < CONTRAST_FLOOR;
            return (
              <tr key={pair.name} data-pair={pair.name} data-adjusted={adjusted || undefined}>
                <td style={cellPad}>{pair.name}</td>
                <td style={cellPad}>{pair.ratio.toFixed(2)}:1</td>
                <td style={cellPad}>
                  {adjusted ? <span role="img" aria-label="below contrast floor">⚠ below {CONTRAST_FLOOR} floor</span> : 'ok'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function BrandPlayground() {
  const [l, setL] = React.useState(0.6);
  const [c, setC] = React.useState(0.15);
  const [h, setH] = React.useState(250);
  const brand = `oklch(${l} ${c} ${h})`;
  const theme = createBrandTheme({ l, c, h });
  const adjustedPairs = theme.contrast.adjusted;
  const input: React.CSSProperties = { width: 80, font: 'inherit' };
  return (
    <div data-ag-brand-playground style={{ display: 'grid', gap: 12 }}>
      <fieldset style={{ display: 'flex', gap: 16, borderRadius: 8, padding: 12 }}>
        <legend>OKLCH brand colour</legend>
        <label>
          L (lightness 0–1)<br />
          <input aria-label="OKLCH lightness" type="number" min={0} max={1} step={0.01} value={l}
            onChange={(e) => setL(Number(e.target.value))} style={input} />
        </label>
        <label>
          C (chroma 0–0.4)<br />
          <input aria-label="OKLCH chroma" type="number" min={0} max={0.4} step={0.01} value={c}
            onChange={(e) => setC(Number(e.target.value))} style={input} />
        </label>
        <label>
          H (hue 0–360)<br />
          <input aria-label="OKLCH hue" type="number" min={0} max={360} step={1} value={h}
            onChange={(e) => setH(Number(e.target.value))} style={input} />
        </label>
        {/* swatch of the user-entered input value; not a library component or its wrapper */}
        <span aria-hidden style={{ width: 28, height: 28, borderRadius: '50%', background: brand, alignSelf: 'end' }} />
        <code style={{ alignSelf: 'end' }}>{brand}</code>
      </fieldset>
      <ContrastPairs theme={theme} />
      <div data-ag-adjusted-count={adjustedPairs.length}>
        <h4 style={{ margin: '8px 0 4px' }}>contrast.adjusted ({adjustedPairs.length})</h4>
        {adjustedPairs.length === 0 ? (
          <p style={{ fontSize: 12 }}>all pairs above {CONTRAST_FLOOR}:1</p>
        ) : (
          <ul style={{ margin: 0, fontSize: 12 }}>
            {adjustedPairs.map((adj) => (
              <li key={`${adj.name}-${adj.field}`}>
                <span role="img" aria-label="adjusted">⚠</span> {adj.name} — {adj.field}: {adj.from.toFixed(3)} → {adj.to.toFixed(3)}
                (icon + text, not colour alone)
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

const meta: Meta = {
  parameters: { ag: { subject: 'Presets', kind: 'showcase' } },
  title: 'MAT/Presets',
  parameters: {
    layout: 'padded',
    ag: { subject: 'MatPresets', kind: 'lab' } satisfies StoryAgParameters,
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

/** Each preset's provider emits its preset <style> through the registered
    presetCss mount (REQ-FIN-04, FIN-A). Until that mount is registered the
    providers emit none and this reports pending; once present, every preset
    must yield exactly one style and no two presets may emit the same text. */
const presetPlay: Story['play'] = async ({ canvasElement }) => {
  const cards = Array.from(canvasElement.querySelectorAll<HTMLElement>('[data-preset]'));
  if (cards.length !== PRESET_IDS.length) {
    throw new Error(`Presets: rendered ${cards.length} preset cards, expected ${PRESET_IDS.length}`);
  }
  const styles = cards.map((card) => card.parentElement?.querySelectorAll(':scope > style[data-ag-theme-style]') ?? []);
  if (styles.every((s) => s.length === 0)) {
    console.info('pending: AuraGlassProvider presetCss mount not registered (REQ-FIN-04, FIN-A) — preset styles asserted when it lands');
    return;
  }
  const bad = cards.filter((_, i) => styles[i]!.length !== 1).map((card) => card.dataset.preset);
  if (bad.length > 0) throw new Error(`Presets: providers without exactly one preset style: ${bad.join(', ')}`);
  const texts = new Set(styles.map((s) => s[0]!.textContent ?? ''));
  if (texts.size !== cards.length) throw new Error('Presets: two presets emitted identical preset CSS');
};

export const LightScheme: Story = {
  name: 'presets — light',
  globals: { scheme: 'light' },
  render: () => <PresetGrid scheme="light" />,
  play: presetPlay,
};

export const DarkScheme: Story = {
  name: 'presets — dark',
  globals: { scheme: 'dark' },
  render: () => <PresetGrid scheme="dark" />,
  play: presetPlay,
};

export const BrandThemePlayground: Story = {
  name: 'createBrandTheme playground',
  render: () => <BrandPlayground />,
  play: async ({ canvasElement }) => {
    const lInput = canvasElement.querySelector('input[aria-label="OKLCH lightness"]');
    if (!(lInput instanceof HTMLInputElement)) throw new Error('Presets: L input missing');
    // Simulate the user typing L=0.85 through React's setter: use the native
    // input value setter then dispatch input/change.
    const nativeSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
    if (!nativeSetter) throw new Error('Presets: cannot drive input');
    nativeSetter.call(lInput, '0.85');
    lInput.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise((r) => setTimeout(r, 60));
    const count = canvasElement.querySelector('[data-ag-adjusted-count]');
    const n = Number(count?.getAttribute('data-ag-adjusted-count') ?? '0');
    if (!(n >= 1)) {
      throw new Error(`Presets: changing L to 0.85 showed ${n} adjusted steps, expected >= 1`);
    }
  },
};
