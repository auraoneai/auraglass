"use client";
/**
 * Styled Components Bundle
 *
 * Components that use styled-components internally.
 * Import from 'aura-glass/styled' to use these components.
 * Requires styled-components as a peer dependency.
 */

// Charts
export { GlassChart } from "../components/charts/GlassChart";
export { GlassDataChart } from "../components/charts/GlassDataChart";
export { GlassDataChart as DataChart } from "../components/charts/GlassDataChart";

// Data Display
export { GlassDataGrid } from "../components/data-display/GlassDataGrid";

// Backgrounds
export { default as AtmosphericBackground } from "../components/backgrounds/AtmosphericBackground";
export { DynamicAtmosphere } from "../components/backgrounds/GlassDynamicAtmosphere";
export { default as ParticleBackground } from "../components/backgrounds/ParticleBackground";

// Cookie Consent
export { CompactCookieNotice } from "../components/cookie-consent/CompactCookieNotice";
export { CookieConsent } from "../components/cookie-consent/CookieConsent";
export { GlobalCookieConsent } from "../components/cookie-consent/GlobalCookieConsent";

// Image List
export { ImageList } from "../components/image-list/ImageList";
export { ImageListItem } from "../components/image-list/ImageListItem";
export { ImageListItemBar } from "../components/image-list/ImageListItemBar";

// Input
export { GlassMultiSelect } from "../components/input/GlassMultiSelect";

// Interactive
export { GlassFocusRing } from "../components/interactive/GlassFocusRing";

// Navigation
export { GlassTabBar } from "../components/navigation/GlassTabBar";

// Speed Dial
export { SpeedDial } from "../components/speed-dial/SpeedDial";
export { default as SpeedDialAction } from "../components/speed-dial/SpeedDialAction";
export { default as SpeedDialIcon } from "../components/speed-dial/SpeedDialIcon";

// Tree View
export { TreeItem } from "../components/tree-view/TreeItem";
export { TreeView } from "../components/tree-view/TreeView";

// Visual Feedback
export { default as FocusIndicator } from "../components/visual-feedback/FocusIndicator";
export { default as RippleButton } from "../components/visual-feedback/RippleButton";
export { default as StateIndicator } from "../components/visual-feedback/StateIndicator";
export { default as VisualFeedback } from "../components/visual-feedback/VisualFeedback";

// Re-export types
export type { ChartDataset } from "../components/charts/GlassDataChart";
