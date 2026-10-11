/* fragments/review/cmp.ts — CMP owns this file on both branches (§3.4).
   REQ-CMP-139: L14 design-review subjects over photo/dark-media. */
import type { ReviewItem } from "../../src/contracts/fragments";
export default [
  {
    id: "cmp-button-specular-quality",
    subject: "Button",
    criterion: "specular-quality",
    note: "specular rim + material quality on photo/dark-media backdrops",
  },
  {
    id: "cmp-button-optical-hierarchy",
    subject: "Button",
    criterion: "optical-hierarchy",
    note: "element reads at its intended optical weight over busy media",
  },
  {
    id: "cmp-button-radius-rhythm",
    subject: "Button",
    criterion: "radius-rhythm",
    note: "radius rhythm consistent with the family + neighbors",
  },
  {
    id: "cmp-button-one-hand",
    subject: "Button",
    criterion: "one-hand",
    note: "primary action reachable in one-hand use (44px target, thumb zone)",
  },
  {
    id: "cmp-iconbutton-specular-quality",
    subject: "IconButton",
    criterion: "specular-quality",
    note: "specular rim + material quality on photo/dark-media backdrops",
  },
  {
    id: "cmp-iconbutton-optical-hierarchy",
    subject: "IconButton",
    criterion: "optical-hierarchy",
    note: "element reads at its intended optical weight over busy media",
  },
  {
    id: "cmp-iconbutton-radius-rhythm",
    subject: "IconButton",
    criterion: "radius-rhythm",
    note: "radius rhythm consistent with the family + neighbors",
  },
  {
    id: "cmp-iconbutton-one-hand",
    subject: "IconButton",
    criterion: "one-hand",
    note: "primary action reachable in one-hand use (44px target, thumb zone)",
  },
  {
    id: "cmp-toolbar-specular-quality",
    subject: "Toolbar",
    criterion: "specular-quality",
    note: "specular rim + material quality on photo/dark-media backdrops",
  },
  {
    id: "cmp-toolbar-optical-hierarchy",
    subject: "Toolbar",
    criterion: "optical-hierarchy",
    note: "element reads at its intended optical weight over busy media",
  },
  {
    id: "cmp-toolbar-radius-rhythm",
    subject: "Toolbar",
    criterion: "radius-rhythm",
    note: "radius rhythm consistent with the family + neighbors",
  },
  {
    id: "cmp-toolbar-one-hand",
    subject: "Toolbar",
    criterion: "one-hand",
    note: "primary action reachable in one-hand use (44px target, thumb zone)",
  },
  {
    id: "cmp-segmentedcontrol-specular-quality",
    subject: "SegmentedControl",
    criterion: "specular-quality",
    note: "specular rim + material quality on photo/dark-media backdrops",
  },
  {
    id: "cmp-segmentedcontrol-optical-hierarchy",
    subject: "SegmentedControl",
    criterion: "optical-hierarchy",
    note: "element reads at its intended optical weight over busy media",
  },
  {
    id: "cmp-segmentedcontrol-radius-rhythm",
    subject: "SegmentedControl",
    criterion: "radius-rhythm",
    note: "radius rhythm consistent with the family + neighbors",
  },
  {
    id: "cmp-segmentedcontrol-one-hand",
    subject: "SegmentedControl",
    criterion: "one-hand",
    note: "primary action reachable in one-hand use (44px target, thumb zone)",
  },
  {
    id: "cmp-searchfield-specular-quality",
    subject: "SearchField",
    criterion: "specular-quality",
    note: "specular rim + material quality on photo/dark-media backdrops",
  },
  {
    id: "cmp-searchfield-optical-hierarchy",
    subject: "SearchField",
    criterion: "optical-hierarchy",
    note: "element reads at its intended optical weight over busy media",
  },
  {
    id: "cmp-searchfield-radius-rhythm",
    subject: "SearchField",
    criterion: "radius-rhythm",
    note: "radius rhythm consistent with the family + neighbors",
  },
  {
    id: "cmp-searchfield-one-hand",
    subject: "SearchField",
    criterion: "one-hand",
    note: "primary action reachable in one-hand use (44px target, thumb zone)",
  },
  {
    id: "cmp-overlay-popups-specular-quality",
    subject: "overlay-popups",
    criterion: "specular-quality",
    note: "specular rim + material quality on photo/dark-media backdrops",
  },
  {
    id: "cmp-overlay-popups-optical-hierarchy",
    subject: "overlay-popups",
    criterion: "optical-hierarchy",
    note: "element reads at its intended optical weight over busy media",
  },
  {
    id: "cmp-overlay-popups-radius-rhythm",
    subject: "overlay-popups",
    criterion: "radius-rhythm",
    note: "radius rhythm consistent with the family + neighbors",
  },
  {
    id: "cmp-overlay-popups-one-hand",
    subject: "overlay-popups",
    criterion: "one-hand",
    note: "primary action reachable in one-hand use (44px target, thumb zone)",
  },
] satisfies ReviewItem[];
