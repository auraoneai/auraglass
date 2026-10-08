/* CMP-342: every lane-3h adapter file is re-exported through src/compat/cmp
   and through the stream barrel src/compat/index.ts (REQ-CMP-131). */
import { describe, expect, it } from '@jest/globals';
import * as cmp from '../cmp';

const EXPECTED = [
  // controls (CMP-323..331)
  'GlassButton','Button','EnhancedGlassButton','RippleButton','MagneticButton','GlassMagneticButton',
  'GlassLinkButton','ToggleButton','GlassFab','GlassIconButton','LiquidGlassButtonStyle',
  'LiquidGlassControlGroup','GlassToolbar','LiquidGlassToolbar','GlassCommandBar','GlassActionBar',
  'LiquidGlassMapControls','ToggleButtonGroup','GlassToggle','GlassSegmentedControl',
  'LiquidGlassSegmentedControl','GlassSwitch','GlassSlider','GlassCheckbox','GlassCheckboxGroup',
  'GlassRadioGroup','GlassInput','GlassTextarea','GlassFieldGroup','GlassValidationMessage',
  'GlassFormField','LiquidGlassSearchField','GlassSearchField','GlassSearchInterface',
  'GlassIntelligentSearch','GlassSelect','GlassSelectCompound','GlassCombobox','GlassMultiSelect',
  'GlassTagInput','GlassMentionList',
  // overlays (CMP-337..341)
  'GlassModal','GlassDialog','GlassDrawer','GlassBottomSheet','GlassActionSheet',
  'LiquidGlassAdaptiveSheet','GlassPopover','GlassHoverCard','GlassTooltip','Positioner',
  'GlassPositioner','GlassDropdownMenu','GlassContextMenu','GlassMenubar','LiquidGlassPopoverMenu',
  'GlassToast','GlassToastProvider','GlassToastViewport','useToast','GlassNotificationCenter',
  'useNotifications',
] as const;

describe('cmp compat manifest', () => {
  it('re-exports every 4.x compat symbol', () => {
    const missing = EXPECTED.filter((n) => !(n in cmp));
    expect(missing).toEqual([]);
  });
  it('exports are callable or component objects (no undefined)', () => {
    for (const n of EXPECTED) {
      const v = (cmp as Record<string, unknown>)[n];
      expect(['function','object']).toContain(typeof v);
      expect(v).not.toBeNull();
    }
  });
});
