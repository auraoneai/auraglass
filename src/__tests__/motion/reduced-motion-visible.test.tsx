/**
 * PLAT-100 — 35-row reduced-motion visibility table.
 *
 * For every { file, component, props } row: mockReducedMotion(true), mount
 * with the real framer-motion, flush effects + timers, then assert every
 * text-bearing descendant settled visible (opacity 1 / identity transform).
 * The regression this guards: `animate={cond ? {} : X}` left elements stuck
 * at `initial={{ opacity: 0 }}` for reduced-motion users.
 */

import React from "react";
import { render, act, cleanup } from "@testing-library/react";
import {
  mockReducedMotion,
  restoreReducedMotion,
  expectSettledVisible,
} from "../../test-utils/motion";

interface Row {
  file: string;
  component: string;
  props?: Record<string, unknown>;
}

const noop = () => {};
const items2 = [
  { id: "a", label: "Alpha" },
  { id: "b", label: "Beta" },
];

const rows: Row[] = [
  { file: "button/GlassButton", component: "GlassButton" },
  { file: "button/GlassFab", component: "GlassFab" },
  { file: "input/GlassInput", component: "GlassInput" },
  { file: "input/GlassCheckbox", component: "GlassCheckbox" },
  { file: "input/GlassSwitch", component: "GlassSwitch" },
  { file: "input/GlassSlider", component: "GlassSlider" },
  { file: "toggle-button/ToggleButton", component: "ToggleButton" },
  {
    file: "input/GlassRadioGroup",
    component: "GlassRadioGroup",
    props: { options: items2, name: "rg" },
  },
  {
    file: "input/GlassCheckboxGroup",
    component: "GlassCheckboxGroup",
    props: { options: items2, name: "cg" },
  },
  {
    file: "interactive/GlassStepper",
    component: "GlassStepper",
    props: {
      steps: [
        { id: "1", label: "One" },
        { id: "2", label: "Two" },
      ],
      activeStep: 0,
    },
  },
  {
    file: "modal/GlassModal",
    component: "GlassModal",
    props: { open: true, onClose: noop, children: "Modal body" },
  },
  {
    file: "modal/GlassDrawer",
    component: "GlassDrawer",
    props: { open: true, onClose: noop, children: "Drawer body" },
  },
  {
    file: "modal/GlassBottomSheet",
    component: "GlassBottomSheet",
    props: { open: true, onClose: noop, children: "Sheet body" },
  },
  {
    file: "mobile/GlassActionSheet",
    component: "GlassActionSheet",
    props: {
      open: true,
      onClose: noop,
      actions: [{ label: "Do it", onAction: noop }],
    },
  },
  {
    file: "modal/GlassPopover",
    component: "GlassPopover",
    props: {
      open: true,
      trigger: "click",
      content: <div>Pop content</div>,
      children: <button type="button">anchor</button>,
    },
  },
  {
    file: "modal/GlassTooltip",
    component: "GlassTooltip",
    props: { content: "Tip", children: <span>anchor</span> },
  },
  {
    file: "modal/GlassHoverCard",
    component: "GlassHoverCard",
    props: { open: true, children: "Card" },
  },
  {
    file: "navigation/GlassHeader",
    component: "GlassHeader",
    props: { children: "Header" },
  },
  {
    file: "navigation/GlassSidebar",
    component: "GlassSidebar",
    props: { items: [], children: "Side" },
  },
  {
    file: "layout/GlassContainer",
    component: "GlassContainer",
    props: { children: "Contained" },
  },
  {
    file: "interactive/GlassCarousel",
    component: "GlassCarousel",
    props: { items: items2 },
  },
  {
    file: "interactive/GlassCardLink",
    component: "GlassCardLink",
    props: { href: "#", children: "Link card" },
  },
  {
    file: "interactive/GlassAdvancedSearch",
    component: "GlassAdvancedSearch",
    props: { onSearch: noop },
  },
  {
    file: "interactive/GlassFacetSearch",
    component: "GlassFacetSearch",
    props: { facets: [], onSearch: noop },
  },
  {
    file: "interactive/GlassKanban",
    component: "GlassKanban",
    props: {
      columns: [{ id: "c1", title: "Col", cards: [] }],
    },
  },
  {
    file: "interactive/GlassChat",
    component: "GlassChat",
    props: { messages: [], onSend: noop },
  },
  {
    file: "interactive/GlassA11yAuditor",
    component: "GlassA11yAuditor",
    props: { children: "Audit me" },
  },
  {
    file: "templates/interactive/GlassDataTable",
    component: "GlassDataTable",
    props: {
      columns: [{ key: "name", title: "Name" }],
      data: [{ name: "Row" }],
    },
  },
  {
    file: "charts/GlassChart",
    component: "GlassChart",
    props: { data: [{ label: "A", value: 1 }], type: "bar" },
  },
  {
    file: "houdini/HoudiniGlassCard",
    component: "HoudiniGlassCard",
    props: { children: "Houdini" },
  },
  {
    file: "advanced/GlassQuantumStates",
    component: "GlassQuantumButton",
    props: { possibleStates: [{ state: { label: "S" }, probability: 1 }] },
  },
  {
    file: "advanced/GlassParallaxLayers",
    component: "GlassParallaxLayers",
    props: { layers: [{ depth: 1, content: <div>Layer</div> }] },
  },
  {
    file: "advanced/GlassReactions",
    component: "GlassReactions",
    props: { children: "React" },
  },
  {
    file: "social/GlassPresenceIndicator",
    component: "GlassPresenceIndicator",
    props: { status: "online" },
  },
  {
    file: "interactive/GlassAvatarGroup",
    component: "GlassAvatarGroup",
    props: { items: [{ id: "u1", name: "Ada" }] },
  },
];

const modules: Record<string, any> = {
  "button/GlassButton": require("../../components/button/GlassButton"),
  "button/GlassFab": require("../../components/button/GlassFab"),
  "input/GlassInput": require("../../components/input/GlassInput"),
  "input/GlassCheckbox": require("../../components/input/GlassCheckbox"),
  "input/GlassSwitch": require("../../components/input/GlassSwitch"),
  "input/GlassSlider": require("../../components/input/GlassSlider"),
  "toggle-button/ToggleButton": require("../../components/toggle-button/ToggleButton"),
  "input/GlassRadioGroup": require("../../components/input/GlassRadioGroup"),
  "input/GlassCheckboxGroup": require("../../components/input/GlassCheckboxGroup"),
  "interactive/GlassStepper": require("../../components/interactive/GlassStepper"),
  "modal/GlassModal": require("../../components/modal/GlassModal"),
  "modal/GlassDrawer": require("../../components/modal/GlassDrawer"),
  "modal/GlassBottomSheet": require("../../components/modal/GlassBottomSheet"),
  "mobile/GlassActionSheet": require("../../components/mobile/GlassActionSheet"),
  "modal/GlassPopover": require("../../components/modal/GlassPopover"),
  "modal/GlassTooltip": require("../../components/modal/GlassTooltip"),
  "modal/GlassHoverCard": require("../../components/modal/GlassHoverCard"),
  "navigation/GlassHeader": require("../../components/navigation/GlassHeader"),
  "navigation/GlassSidebar": require("../../components/navigation/GlassSidebar"),
  "layout/GlassContainer": require("../../components/layout/GlassContainer"),
  "interactive/GlassCarousel": require("../../components/interactive/GlassCarousel"),
  "interactive/GlassCardLink": require("../../components/interactive/GlassCardLink"),
  "interactive/GlassAdvancedSearch": require("../../components/interactive/GlassAdvancedSearch"),
  "interactive/GlassFacetSearch": require("../../components/interactive/GlassFacetSearch"),
  "interactive/GlassKanban": require("../../components/interactive/GlassKanban"),
  "interactive/GlassChat": require("../../components/interactive/GlassChat"),
  "interactive/GlassA11yAuditor": require("../../components/interactive/GlassA11yAuditor"),
  "templates/interactive/GlassDataTable": require("../../components/templates/interactive/GlassDataTable"),
  "charts/GlassChart": require("../../components/charts/GlassChart"),
  "houdini/HoudiniGlassCard": require("../../components/houdini/HoudiniGlassCard"),
  "advanced/GlassQuantumStates": require("../../components/advanced/GlassQuantumStates"),
  "advanced/GlassParallaxLayers": require("../../components/advanced/GlassParallaxLayers"),
  "advanced/GlassReactions": require("../../components/advanced/GlassReactions"),
  "social/GlassPresenceIndicator": require("../../components/social/GlassPresenceIndicator"),
  "interactive/GlassAvatarGroup": require("../../components/interactive/GlassAvatarGroup"),
};

jest.useFakeTimers();

afterEach(() => {
  cleanup();
  restoreReducedMotion();
  jest.clearAllTimers();
});

describe("reduced-motion visibility (35-row table)", () => {
  it("has exactly 35 rows", () => {
    expect(rows.length).toBe(35);
  });

  it.each(rows.map((r) => [r.component, r] as const))(
    "%s settles visible under prefers-reduced-motion",
    async (_name, row) => {
      mockReducedMotion(true);
      const mod = modules[row.file];
      const C = mod[row.component] || mod.default?.[row.component];
      // forwardRef components are objects ({ $$typeof, render }); plain fns also valid
      expect(
        typeof C === "function" || (C && typeof C === "object" && C.$$typeof)
      ).toBeTruthy();

      let utils: ReturnType<typeof render>;
      await act(async () => {
        utils = render(React.createElement(C, row.props || {}));
      });
      await act(async () => {
        jest.advanceTimersByTime(2000);
      });
      expectSettledVisible(
        utils!.container.firstElementChild || utils!.container
      );
    },
    20000
  );
});
