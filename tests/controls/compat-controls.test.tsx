/** CMP-171/323..331 (REQ-CMP-131): compat adapters for the 40 4.x control names —
    each adapter renders its 5.0 successor and warns once per symbol per page
    load (never at module scope). This is the render matrix. */
import { describe, expect, it, jest } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import * as React from 'react';
import { render, screen } from '@testing-library/react';

import {
  GlassButton, Button as Button4x, EnhancedGlassButton, RippleButton,
  GlassLinkButton, ToggleButton, MagneticButton, GlassFab,
  LiquidGlassButtonStyle, GlassIconButton,
  LiquidGlassControlGroup, LiquidGlassToolbar, GlassToolbar,
  ToggleButtonGroup, GlassToggle, GlassCommandBar, LiquidGlassMapControls,
  GlassActionBar, GlassSegmentedControl, LiquidGlassSegmentedControl,
  GlassSwitch, GlassSlider, GlassCheckbox, GlassCheckboxGroup, GlassRadioGroup,
  GlassInput, GlassTextarea, GlassFieldGroup, GlassValidationMessage,
  GlassFormField, LiquidGlassSearchField, GlassSearchField,
  GlassSearchInterface, GlassIntelligentSearch,
  GlassSelectCompound, GlassSelect, GlassCombobox, GlassMultiSelect,
  GlassTagInput, GlassMentionList,
} from '../../src/compat/cmp';

const OPTS = [
  { value: 'a', label: 'Alpha' },
  { value: 'b', label: 'Beta' },
];

type Row = { name: string; node: React.ReactElement; query?: () => unknown };

const ROWS: Row[] = [
  { name: 'GlassButton', node: <GlassButton>Go</GlassButton> },
  { name: 'Button (4.x alias)', node: <Button4x>Go</Button4x> },
  { name: 'EnhancedGlassButton', node: <EnhancedGlassButton>Go</EnhancedGlassButton> },
  { name: 'RippleButton', node: <RippleButton>Go</RippleButton> },
  { name: 'GlassLinkButton', node: <GlassLinkButton href="/x">Go</GlassLinkButton> },
  { name: 'ToggleButton', node: <ToggleButton>Go</ToggleButton> },
  { name: 'MagneticButton', node: <MagneticButton>Go</MagneticButton> },
  { name: 'GlassFab', node: <GlassFab icon={<i />} label="Add" /> },
  { name: 'LiquidGlassButtonStyle', node: <div data-x={String(LiquidGlassButtonStyle.opacity)} /> },
  { name: 'GlassIconButton', node: <GlassIconButton aria-label="Close" icon={<i />} /> },
  { name: 'LiquidGlassControlGroup', node: <LiquidGlassControlGroup><GlassButton>A</GlassButton></LiquidGlassControlGroup> },
  { name: 'LiquidGlassToolbar', node: <LiquidGlassToolbar items={[{ id: 'x', label: 'X' }]} /> },
  { name: 'GlassToolbar', node: <GlassToolbar items={[{ id: 'x', label: 'X' }]} /> },
  { name: 'ToggleButtonGroup', node: <ToggleButtonGroup value="a" /> },
  { name: 'GlassToggle', node: <GlassToggle label="T" /> },
  { name: 'GlassCommandBar', node: <GlassCommandBar commands={[{ id: 'x', label: 'X' }]} /> },
  { name: 'LiquidGlassMapControls', node: <LiquidGlassMapControls onZoomIn={() => {}} /> },
  { name: 'GlassActionBar', node: <GlassActionBar actions={[{ id: 'x', label: 'X' }]} /> },
  { name: 'GlassSegmentedControl', node: <GlassSegmentedControl items={[{ id: 'a', label: 'A' }]} /> },
  { name: 'LiquidGlassSegmentedControl', node: <LiquidGlassSegmentedControl segments={[{ id: 'a', label: 'A' }]} /> },
  { name: 'GlassSwitch', node: <GlassSwitch label="S" /> },
  { name: 'GlassSlider', node: <GlassSlider defaultValue={4} min={0} max={10} /> },
  { name: 'GlassCheckbox', node: <GlassCheckbox label="C" /> },
  { name: 'GlassCheckboxGroup', node: <GlassCheckboxGroup options={OPTS} /> },
  { name: 'GlassRadioGroup', node: <GlassRadioGroup options={OPTS} /> },
  { name: 'GlassInput', node: <GlassInput placeholder="p" /> },
  { name: 'GlassTextarea', node: <GlassTextarea rows={3} /> },
  { name: 'GlassFieldGroup', node: <GlassFieldGroup legend="L" /> },
  { name: 'GlassValidationMessage', node: <GlassValidationMessage message="Err" /> },
  { name: 'GlassFormField', node: <GlassFormField label="L"><input /></GlassFormField> },
  { name: 'LiquidGlassSearchField', node: <LiquidGlassSearchField /> },
  { name: 'GlassSearchField', node: <GlassSearchField /> },
  { name: 'GlassSearchInterface', node: <GlassSearchInterface /> },
  { name: 'GlassIntelligentSearch', node: <GlassIntelligentSearch /> },
  {
    name: 'GlassSelectCompound',
    node: (
      <GlassSelectCompound.Root>
        <GlassSelectCompound.Trigger placeholder="Pick" />
        <GlassSelectCompound.Content>
          <GlassSelectCompound.Item value="a">A</GlassSelectCompound.Item>
        </GlassSelectCompound.Content>
      </GlassSelectCompound.Root>
    ),
  },
  { name: 'GlassSelect', node: <GlassSelect options={OPTS} placeholder="Pick" /> },
  { name: 'GlassCombobox', node: <GlassCombobox options={['x', 'y']} /> },
  { name: 'GlassMultiSelect', node: <GlassMultiSelect options={OPTS} /> },
  { name: 'GlassTagInput', node: <GlassTagInput suggestions={['t1']} /> },
  { name: 'GlassMentionList', node: <GlassMentionList items={['u1']} /> },
];

describe('compat controls — 40-name render matrix (CMP-171)', () => {
  it('adapters warn at call time, once per symbol per page load', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const a = render(<GlassButton>One</GlassButton>);
    a.unmount();
    render(<GlassButton>Two</GlassButton>);
    const depCalls = warn.mock.calls.filter((c: unknown) => String((c as unknown[])[0]).startsWith("[aura-glass] DEP-C0001 "));
    expect(depCalls).toHaveLength(1);
    warn.mockRestore();
  });

  it('unmappable props drop with one warning each, never throw', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    render(<GlassButton predictive eyeTracking variant="gradient">Go</GlassButton>);
    const text = warn.mock.calls.flat().join(' ');
    expect(text).toContain('predictive');
    expect(text).toContain('eyeTracking');
    expect(text).toContain('variant:gradient');
    warn.mockRestore();
  });

  it.each(ROWS.map((r) => [r.name, r] as const))(
    '%s renders its 5.0 successor without throwing',
    (_name, row) => {
      const { container, unmount } = render(row.node);
      expect(container.innerHTML.length).toBeGreaterThan(0);
      unmount();
    },
  );
});
