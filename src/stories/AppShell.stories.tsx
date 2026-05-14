import meta, { FullSurface } from "./AppChromeVisualBaseline.stories";

export default {
  ...meta,
  title: "3.2/App Shell",
};

export const NativeAppShell = FullSurface;

export const SaaSAppShell = {
  ...FullSurface,
  name: "SaaS Dashboard Shell",
};

export const AICommandCenterShell = {
  ...FullSurface,
  name: "AI Command Center Shell",
};

export const MediaWorkspaceShell = {
  ...FullSurface,
  name: "Media Workspace Shell",
};

export const EcommerceAdminShell = {
  ...FullSurface,
  name: "Ecommerce Admin Shell",
};

export const CollaborationWorkspaceShell = {
  ...FullSurface,
  name: "Collaboration Workspace Shell",
};
