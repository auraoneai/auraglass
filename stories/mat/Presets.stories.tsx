/* stories/mat/Presets.stories.tsx — MAT-336 (REQ-MAT-01).
   Every material preset in light and dark, plus a createBrandGlassTheme
   playground with labelled, keyboard-operable OKLCH L/C/H number inputs
   rendering contrast pairs and the adjusted list; adjusted steps are marked
   with text AND an icon, not colour alone. The L/C/H inputs convert to hex
   locally and drive the kept-4.x createBrandGlassTheme; the frozen 5.0 theme
   API substitutes when MAT's theme internals land (pending, not blocked). */
import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Surface } from '../../src/material/index';
import { glassMaterialPresets } from '../../src/theme/materials';
import { createBrandGlassTheme } from '../../src/theme/createBrandGlassTheme';
import { CONTRAST_FLOOR, oklchToHex } from './_shared';
import { StorySurface } from '../../.storybook/StorySurface';

const PRESETS = Object.entries(glassMaterialPresets);

function PresetCard({ name, tokens }: { name: string; tokens: (typeof PRESETS)[number][1] }) {
  return (
    <Surface variant="regular" className={`preset-${name}`} style={{ padding: 0, overflow: 'hidden' }}>
      <div
        style={{
          background: tokens.background,
          backdropFilter: tokens.backdropFilter,
          WebkitBackdropFilter: tokens.WebkitBackdropFilter,
          border: `1px solid ${tokens.border}`,
          boxShadow: tokens.shadow,
          borderRadius: 12,
          padding: '14px 18px',
          minWidth: 150,
        }}
      >
        <code style={{ fontSize: 13 }}>{name}</code>
        <div style={{ fontSize: 11, opacity: 0.7 }}>blur {tokens.backdropBlur}</div>
      </div>
    </Surface>
  );
}

function PresetGrid({ scheme }: { scheme: 'light' | 'dark' }) {
  return (
    <StorySurface mode={scheme}>
      <div data-ag-theme={scheme} style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
        {PRESETS.map(([name, tokens]) => (
          <PresetCard key={name} name={name} tokens={tokens} />
        ))}
      </div>
    </StorySurface>
  );
}

/** contrast.pairs as key->ratio rows from the real theme object. */
function ContrastPairs({ theme }: { theme: ReturnType<typeof createBrandGlassTheme> }) {
  return (
    <div>
      <h4 style={{ margin: '8px 0 4px' }}>contrast.pairs</h4>
      <table style={{ borderCollapse: 'collapse', fontSize: 12 }}>
        <tbody>
          {theme.contrast.pairs.map((pair) => {
            const adjusted = pair.ratio < CONTRAST_FLOOR;
            return (
              <tr key={pair.name} data-pair={pair.name} data-adjusted={adjusted || undefined}>
                <td style={{ padding: '2px 10px', borderBottom: '1px solid #e2e8f0' }}>{pair.name}</td>
                <td style={{ padding: '2px 10px', borderBottom: '1px solid #e2e8f0' }}>{pair.ratio.toFixed(2)}:1</td>
                <td style={{ padding: '2px 10px', borderBottom: '1px solid #e2e8f0' }}>
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
  const hex = oklchToHex(l, c, h);
  const theme = createBrandGlassTheme(hex);
  const adjustedPairs = theme.contrast.adjusted;
  const input: React.CSSProperties = { width: 80, font: 'inherit' };
  return (
    <div data-ag-brand-playground style={{ display: 'grid', gap: 12 }}>
      <fieldset style={{ display: 'flex', gap: 16, border: '1px solid #cbd5e1', borderRadius: 8, padding: 12 }}>
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
        <span aria-hidden style={{ width: 28, height: 28, borderRadius: '50%', background: hex, alignSelf: 'end' }} />
        <code style={{ alignSelf: 'end' }}>{hex}</code>
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
  title: 'MAT/Presets',
  parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj<typeof meta>;

export const LightScheme: Story = {
  name: 'presets — light',
  render: () => <PresetGrid scheme="light" />,
};

export const DarkScheme: Story = {
  name: 'presets — dark',
  render: () => <PresetGrid scheme="dark" />,
};

export const BrandThemePlayground: Story = {
  name: 'createBrandGlassTheme playground',
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
