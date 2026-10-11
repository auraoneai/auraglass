/* consumer-4x Vite app: >=30 root exports, every surviving subpath,
   CSS vars, props, provider and date-fns usage (REQ-PLAT-63). */
import React from "react";
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
  ThemeProvider,
} from "aura-glass";
import type { GlassProps } from "aura-glass";
import * as sp_tokens from "aura-glass/tokens";
import * as sp_tokens_json from "aura-glass/tokens/json";
import * as sp_tokens_tailwind from "aura-glass/tokens/tailwind";
import * as sp_tokens_manifest from "aura-glass/tokens/manifest";
import * as sp_tokens_css from "aura-glass/tokens/css";
import * as sp_tokens_keyframes from "aura-glass/tokens/keyframes";
import * as sp_styles from "aura-glass/styles";
import * as sp_icons from "aura-glass/icons";
import * as sp_icons_action from "aura-glass/icons/action";
import * as sp_icons_navigation from "aura-glass/icons/navigation";
import * as sp_icons_status from "aura-glass/icons/status";
import * as sp_icons_media from "aura-glass/icons/media";
import * as sp_icons_data from "aura-glass/icons/data";
import * as sp_icons_commerce from "aura-glass/icons/commerce";
import * as sp_icons_collaboration from "aura-glass/icons/collaboration";
import * as sp_icons_ai from "aura-glass/icons/ai";
import * as sp_primitives from "aura-glass/primitives";
import * as sp_primitives_slot from "aura-glass/primitives/slot";
import * as sp_primitives_portal from "aura-glass/primitives/portal";
import * as sp_primitives_focus from "aura-glass/primitives/focus";
import * as sp_primitives_dismissable_layer from "aura-glass/primitives/dismissable-layer";
import * as sp_primitives_roving_focus from "aura-glass/primitives/roving-focus";
import * as sp_primitives_positioning from "aura-glass/primitives/positioning";
import * as sp_app_shell from "aura-glass/app-shell";
import * as sp_workspace from "aura-glass/workspace";
import * as sp_theme from "aura-glass/theme";
import * as sp_forms from "aura-glass/forms";
import * as sp_data from "aura-glass/data";
import * as sp_navigation from "aura-glass/navigation";
import * as sp_overlays from "aura-glass/overlays";
import * as sp_workflows from "aura-glass/workflows";
import * as sp_marketing from "aura-glass/marketing";
import * as sp_core_mixins_glassMixins from "aura-glass/core/mixins/glassMixins";
import * as sp_utils_env from "aura-glass/utils/env";
import * as sp_hooks_useGlassProbes from "aura-glass/hooks/useGlassProbes";
import * as sp_services_ai_config from "aura-glass/services/ai/config";
import * as sp_services_ai_cache_service from "aura-glass/services/ai/cache-service";
import * as sp_services_ai_openai_service from "aura-glass/services/ai/openai-service";
import * as sp_services_ai_vision_service from "aura-glass/services/ai/vision-service";
import * as sp_services_websocket_collaboration_service from "aura-glass/services/websocket/collaboration-service";
import * as sp_registry from "aura-glass/registry";
import * as sp_client from "aura-glass/client";
import * as sp_server from "aura-glass/server";
import * as sp_ssr from "aura-glass/ssr";
import * as sp_three from "aura-glass/three";
import { createRoot } from "react-dom/client";
import { format, addDays } from "date-fns";
import { Panel } from "@components/Panel";
import { HELLO } from "@lib/hello";
import { Chip } from "@/components/Chip";
import "./globals.css";

function App() {
  const when = format(addDays(new Date(), 1), "yyyy-MM-dd");
  const theme = useTheme();
  void useReducedMotion;
  void theme;
  void sp_tokens;
  void sp_tokens_json;
  void sp_tokens_tailwind;
  void sp_tokens_manifest;
  void sp_tokens_css;
  void sp_tokens_keyframes;
  void sp_styles;
  void sp_icons;
  void sp_icons_action;
  void sp_icons_navigation;
  void sp_icons_status;
  void sp_icons_media;
  void sp_icons_data;
  void sp_icons_commerce;
  void sp_icons_collaboration;
  void sp_icons_ai;
  void sp_primitives;
  void sp_primitives_slot;
  void sp_primitives_portal;
  void sp_primitives_focus;
  void sp_primitives_dismissable_layer;
  void sp_primitives_roving_focus;
  void sp_primitives_positioning;
  void sp_app_shell;
  void sp_workspace;
  void sp_theme;
  void sp_forms;
  void sp_data;
  void sp_navigation;
  void sp_overlays;
  void sp_workflows;
  void sp_marketing;
  void sp_core_mixins_glassMixins;
  void sp_utils_env;
  void sp_hooks_useGlassProbes;
  void sp_services_ai_config;
  void sp_services_ai_cache_service;
  void sp_services_ai_openai_service;
  void sp_services_ai_vision_service;
  void sp_services_websocket_collaboration_service;
  void sp_registry;
  void sp_client;
  void sp_server;
  void sp_ssr;
  void sp_three;
  const props: GlassProps = {};
  return (
    <ThemeProvider>
      <main data-mobile-page style={{ padding: "var(--glass-space-4)" }}>
        <Panel>{HELLO} {when} {props.size ?? "md"}</Panel>
        <GlassButton variant="primary">consumer-4x vite</GlassButton>
        <GlassCard><Chip />aura-glass page</GlassCard>
        <GlassForm schema={[]} title="form" />
        <GlassDataGrid columns={[]} data={[]} />
      </main>
    </ThemeProvider>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
