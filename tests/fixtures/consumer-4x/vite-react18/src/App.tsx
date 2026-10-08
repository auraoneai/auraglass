import {
  GlassButton,
  GlassCard,
  GlassInput,
  GlassSelect,
  GlassModal,
  GlassTabs,
  GlassSwitch,
  GlassTooltip,
  GlassBadge,
  GlassAvatar,
  GlassSkeleton,
  GlassProgress,
  GlassSlider,
  GlassToast,
  GlassDrawer,
  GlassDropdown,
  GlassTable,
  GlassForm,
  GlassCheckbox,
  GlassRadio,
  GlassAccordion,
  GlassBreadcrumb,
  GlassPagination,
  GlassStepper,
  GlassTimeline,
  GlassCommandPalette,
  GlassDataGrid,
  OptimizedGlass,
  useTheme,
  useReducedMotion,
  ThemeProvider
} from "aura-glass";
import "aura-glass/styles";
import "aura-glass/tokens/css";
import { ThemeProvider as Named } from "aura-glass";
import type { GlassProps } from "aura-glass";

import "./globals.css";

  void GlassButton;
  void GlassCard;
  void GlassInput;
  void GlassSelect;
  void GlassModal;
  void GlassTabs;
  void GlassSwitch;
  void GlassTooltip;
  void GlassBadge;
  void GlassAvatar;
  void GlassSkeleton;
  void GlassProgress;
  void GlassSlider;
  void GlassToast;
  void GlassDrawer;
  void GlassDropdown;
  void GlassTable;
  void GlassForm;
  void GlassCheckbox;
  void GlassRadio;
  void GlassAccordion;
  void GlassBreadcrumb;
  void GlassPagination;
  void GlassStepper;
  void GlassTimeline;
  void GlassCommandPalette;
  void GlassDataGrid;
  void OptimizedGlass;
  void useTheme;
  void useReducedMotion;
  void ThemeProvider;
void Named;
void (0 as unknown as GlassProps);

export function App() {
  return (
    <ThemeProvider>
      <main className="glass-min-h-screen glass-p-4 md:glass-p-8" data-mobile-page>
        <OptimizedGlass>consumer 4.x fixture</OptimizedGlass>
      </main>
    </ThemeProvider>
  );
}
