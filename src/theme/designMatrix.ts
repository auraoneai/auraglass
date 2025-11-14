// token-lint-ignore-file: persona design matrix encodes canonical raw color ramps
import type { CSSProperties } from "react";

export type PersonaId =
  | "midnight-slate"
  | "midnight-meridian"
  | "solar-apex"
  | "violet-nebula"
  | "aurora-noir"
  | "helios-foundry"
  | "glacier-morn"
  | "terra-inflect"
  | "lumen-veil"
  | "nimbus-relay";

export interface PersonaColorTokens {
  background: {
    canvas: string;
    surface: string;
  };
  text: {
    primary: string;
  };
  accent: {
    primary: string;
    secondary: string;
  };
  state: {
    success: string;
    warning: string;
    error: string;
  };
  shadow: {
    panel: string;
  };
  focus: {
    ring: string;
  };
}

export interface PersonaTypographyEntry {
  weight: number;
  size: string;
  letterSpacing: string;
  lineHeight?: string;
}

export interface PersonaTypographyScale {
  display: PersonaTypographyEntry;
  headline: PersonaTypographyEntry;
  metric: PersonaTypographyEntry;
  body: PersonaTypographyEntry;
  caption: PersonaTypographyEntry;
}

export interface PersonaSpacing {
  baseGrid: string;
  panelRadius: string;
  buttonRadius: string;
  overlayBlur: string;
  layoutPattern: string;
}

export interface PersonaMotionDurations {
  entry: string;
  hover: string;
  focus: string;
  async: string;
}

export interface PersonaMetadata {
  name: string;
  id: PersonaId;
  primaryContext: string;
  paletteAnchor: string;
  surfaceSchema: string;
  typographyScaleDescription: string;
  motionSignals: string;
  narrativePillars?: string[];
  keyTokens?: string[];
  microinteractionNotes?: string[];
}

export interface PersonaConfig {
  meta: PersonaMetadata;
  colors: PersonaColorTokens;
  typography: PersonaTypographyScale;
  spacing: PersonaSpacing;
  motion: PersonaMotionDurations;
  tokens?: Record<string, string | number | CSSProperties>;
}

export const DESIGN_MATRIX: Record<PersonaId, PersonaConfig> = {
  "midnight-slate": {
    meta: {
      name: "Midnight Slate",
      id: "midnight-slate",
      primaryContext:
        "Experimental intelligence workspaces, telemetry-heavy research platforms",
      paletteAnchor:
        "Deep charcoal / ultraviolet base with cyan ion accents, magenta diagnostics",
      surfaceSchema:
        "Layered glass panes (20–28px rhythm), 10px radius, spectral edge lighting, kinetic glow",
      typographyScaleDescription:
        "Body 15/22px, metrics 18/26px, hero 28/34px; cyan accent drives hierarchy",
      motionSignals:
        "Spectral pulses, cyan focus ring, prefers-reduced-motion fallbacks on glows",
      narrativePillars: ["Experimental", "Data-rich", "Kinetic"],
      keyTokens: [
        "Cyan ion accent for CTAs",
        "Magenta diagnostic for anomalies",
        "Slate neutrals for baselines",
      ],
      microinteractionNotes: [
        "Ripple pulses on chart hovers",
        "Cyan focus rings on control inputs",
        "Spectral toast elevation for async updates",
      ],
    },
    colors: {
      background: {
        canvas: "#090B1A",
        surface: "rgba(18,20,43,0.72)",
      },
      text: {
        primary: "#F2F5FF",
      },
      accent: {
        primary: "#4FD6FF",
        secondary: "#B26CFF",
      },
      state: {
        success: "#3BE0AA",
        warning: "#F5B94C",
        error: "#FF4D8D",
      },
      shadow: {
        panel: "0 24px 60px -30px rgba(79,214,255,0.45)",
      },
      focus: {
        ring: "0 0 0 3px rgba(79,214,255,0.32)",
      },
    },
    typography: {
      display: {
        weight: 600,
        size: "28px",
        letterSpacing: "0.5px",
      },
      headline: {
        weight: 500,
        size: "22px",
        letterSpacing: "0.4px",
      },
      metric: {
        weight: 600,
        size: "18px",
        letterSpacing: "0.3px",
      },
      body: {
        weight: 400,
        size: "15px",
        letterSpacing: "0.2px",
      },
      caption: {
        weight: 400,
        size: "13px",
        letterSpacing: "0.1px",
      },
    },
    spacing: {
      baseGrid: "24px",
      panelRadius: "10px",
      buttonRadius: "8px",
      overlayBlur: "32px",
      layoutPattern:
        "Analytics tri-column grid with stacked telemetry sidebars",
    },
    motion: {
      entry: "320ms",
      hover: "180ms",
      focus: "140ms",
      async: "360ms",
    },
  },
  "midnight-meridian": {
    meta: {
      name: "Midnight Meridian",
      id: "midnight-meridian",
      primaryContext:
        "Operational productivity suites, task orchestration dashboards",
      paletteAnchor:
        "Teal/emerald base with amber highlights, indigo support tones",
      surfaceSchema:
        "Elevated panels (16–24px rhythm), 12px radius, ambient shadows, subtle borders",
      typographyScaleDescription:
        "Body 14/20px, KPIs 16/24px, hero 24/30px; teal CTA halo",
      motionSignals:
        "Smooth ease-out motions, teal focus ring, timer pulses mapped to semantic state tokens",
      narrativePillars: ["Productive", "Task-focused", "Calm confidence"],
      keyTokens: [
        "Teal primary for progress",
        "Amber secondary for incentives",
        "Indigo depth for shells",
      ],
      microinteractionNotes: [
        "Timer sweep animations",
        "Teal halo on selection",
        "Soft scale on productivity widgets",
      ],
    },
    colors: {
      background: {
        canvas: "#081418",
        surface: "rgba(9,21,24,0.68)",
      },
      text: {
        primary: "#F3F9F9",
      },
      accent: {
        primary: "#34D2B4",
        secondary: "#FDB565",
      },
      state: {
        success: "#2CB67D",
        warning: "#FFBE55",
        error: "#FF5A65",
      },
      shadow: {
        panel: "0 18px 46px -28px rgba(52,210,180,0.38)",
      },
      focus: {
        ring: "0 0 0 3px rgba(52,210,180,0.30)",
      },
    },
    typography: {
      display: {
        weight: 600,
        size: "24px",
        letterSpacing: "0.3px",
      },
      headline: {
        weight: 500,
        size: "20px",
        letterSpacing: "0.2px",
      },
      metric: {
        weight: 600,
        size: "18px",
        letterSpacing: "0.2px",
      },
      body: {
        weight: 400,
        size: "14px",
        letterSpacing: "0.1px",
      },
      caption: {
        weight: 400,
        size: "12px",
        letterSpacing: "0px",
      },
    },
    spacing: {
      baseGrid: "20px",
      panelRadius: "12px",
      buttonRadius: "10px",
      overlayBlur: "24px",
      layoutPattern: "Productivity split pane with task queues + KPI strip",
    },
    motion: {
      entry: "280ms",
      hover: "160ms",
      focus: "120ms",
      async: "320ms",
    },
  },
  "solar-apex": {
    meta: {
      name: "Solar Apex",
      id: "solar-apex",
      primaryContext:
        "Executive control centers, compliance and governance consoles",
      paletteAnchor:
        "Midnight indigo charcoal with molten solar gradients (amber → persimmon), auric gold highlights",
      surfaceSchema:
        "Beveled 12px radii, luminous borders, long warm shadows, prismatic edges",
      typographyScaleDescription:
        "Body 15/22px, analytics 18/26px, hero 28/34px; auric headline emphasis",
      motionSignals:
        "Solar flare highlights, warm focus ring, gradient sweeps gated by motion preferences",
      narrativePillars: [
        "Executive authority",
        "Compliance",
        "Strategic oversight",
      ],
      keyTokens: [
        "Auric gold for primary CTAs",
        "Persimmon gradients for alerts",
        "Charcoal neutrals for balance",
      ],
      microinteractionNotes: [
        "Radiant sweeps on filters",
        "Warm flare on alert acknowledgements",
        "Prismatic overlay transitions",
      ],
    },
    colors: {
      background: {
        canvas: "#0D1324",
        surface: "rgba(17,23,38,0.70)",
      },
      text: {
        primary: "#F9F4EC",
      },
      accent: {
        primary: "#FFB545",
        secondary: "#FF784A",
      },
      state: {
        success: "#66DA8B",
        warning: "#FF9548",
        error: "#FF4A4A",
      },
      shadow: {
        panel: "0 28px 64px -32px rgba(255,181,69,0.42)",
      },
      focus: {
        ring: "0 0 0 3px rgba(255,181,69,0.35)",
      },
    },
    typography: {
      display: {
        weight: 600,
        size: "28px",
        letterSpacing: "0.4px",
      },
      headline: {
        weight: 500,
        size: "22px",
        letterSpacing: "0.3px",
      },
      metric: {
        weight: 600,
        size: "18px",
        letterSpacing: "0.3px",
      },
      body: {
        weight: 400,
        size: "15px",
        letterSpacing: "0.1px",
      },
      caption: {
        weight: 400,
        size: "13px",
        letterSpacing: "0.05px",
      },
    },
    spacing: {
      baseGrid: "22px",
      panelRadius: "12px",
      buttonRadius: "10px",
      overlayBlur: "28px",
      layoutPattern: "Executive dashboard with 12-column oversight grid",
    },
    motion: {
      entry: "340ms",
      hover: "200ms",
      focus: "150ms",
      async: "360ms",
    },
  },
  "violet-nebula": {
    meta: {
      name: "Violet Nebula",
      id: "violet-nebula",
      primaryContext:
        "Strategic foresight tooling, model governance and scenario planning",
      paletteAnchor:
        "Nebula violet base, electric fuchsia highlights, silver neutrals",
      surfaceSchema:
        "High-polish glass slabs (24–32px rhythm), 16px radius, holographic edge traces",
      typographyScaleDescription:
        "Body 16/24px, strategy cards 20/28px, hero 32/40px; silver typographic anchors",
      motionSignals:
        "Holographic shimmer loops (1200ms), depth parallax on hero panels, cyan-fuchsia focus gradient",
      narrativePillars: ["Futurist", "Predictive", "Multidimensional"],
      keyTokens: [
        "Nebula violet canvas",
        "Electric fuchsia highlights",
        "Silver typography anchors",
      ],
      microinteractionNotes: [
        "Holographic shimmer on hover",
        "Depth parallax on cards",
        "Cyan-fuchsia focus gradients with reduced-motion fades",
      ],
    },
    colors: {
      background: {
        canvas: "#08091C",
        surface: "rgba(16,18,44,0.68)",
      },
      text: {
        primary: "#F5F3FF",
      },
      accent: {
        primary: "#C06CFF",
        secondary: "#7AEFFF",
      },
      state: {
        success: "#62F5BF",
        warning: "#FFD470",
        error: "#FF5FB7",
      },
      shadow: {
        panel: "0 30px 70px -34px rgba(192,108,255,0.45)",
      },
      focus: {
        ring: "0 0 0 3px rgba(192,108,255,0.35)",
      },
    },
    typography: {
      display: {
        weight: 600,
        size: "32px",
        letterSpacing: "0.6px",
      },
      headline: {
        weight: 500,
        size: "24px",
        letterSpacing: "0.5px",
      },
      metric: {
        weight: 600,
        size: "20px",
        letterSpacing: "0.4px",
      },
      body: {
        weight: 400,
        size: "16px",
        letterSpacing: "0.2px",
      },
      caption: {
        weight: 400,
        size: "14px",
        letterSpacing: "0.1px",
      },
    },
    spacing: {
      baseGrid: "24px",
      panelRadius: "16px",
      buttonRadius: "12px",
      overlayBlur: "36px",
      layoutPattern: "Scenario canvas with 4-column narrative cards",
    },
    motion: {
      entry: "360ms",
      hover: "220ms",
      focus: "180ms",
      async: "380ms",
    },
  },
  "aurora-noir": {
    meta: {
      name: "Aurora Noir",
      id: "aurora-noir",
      primaryContext:
        "Observability networks, mission-critical operations command",
      paletteAnchor:
        "Midnight navy foundation with aurora green ribbons and cobalt glows",
      surfaceSchema:
        "Layered glass struts (22–30px rhythm), 12px radius, polar sheen overlays, dynamic depth fog",
      typographyScaleDescription:
        "Body 15/22px, metrics 17/24px, hero 26/32px; luminous aqua headlines",
      motionSignals:
        "Aurora sweep gradients (2400ms), telemetry ripple feedback, emerald focus corona",
      narrativePillars: [
        "Mission control",
        "Atmospheric",
        "Real-time observability",
      ],
      keyTokens: [
        "Aurora greens and cobalt glows",
        "Timeline rails and status grids",
        "Telemetry overlays",
      ],
      microinteractionNotes: [
        "Aurora trail follows cursor",
        "Ripple telemetry on data updates",
        "Emerald focus corona",
      ],
    },
    colors: {
      background: {
        canvas: "#0A1026",
        surface: "rgba(10,16,38,0.70)",
      },
      text: {
        primary: "#E9FBFF",
      },
      accent: {
        primary: "#3EF2A1",
        secondary: "#6F7CFF",
      },
      state: {
        success: "#38E8AE",
        warning: "#FFE27A",
        error: "#FF6F8C",
      },
      shadow: {
        panel: "0 26px 62px -28px rgba(62,242,161,0.38)",
      },
      focus: {
        ring: "0 0 0 3px rgba(62,242,161,0.30)",
      },
    },
    typography: {
      display: {
        weight: 600,
        size: "26px",
        letterSpacing: "0.4px",
      },
      headline: {
        weight: 500,
        size: "21px",
        letterSpacing: "0.3px",
      },
      metric: {
        weight: 600,
        size: "18px",
        letterSpacing: "0.3px",
      },
      body: {
        weight: 400,
        size: "15px",
        letterSpacing: "0.1px",
      },
      caption: {
        weight: 400,
        size: "13px",
        letterSpacing: "0.05px",
      },
    },
    spacing: {
      baseGrid: "22px",
      panelRadius: "12px",
      buttonRadius: "10px",
      overlayBlur: "30px",
      layoutPattern: "Mission command board with timeline rail",
    },
    motion: {
      entry: "300ms",
      hover: "190ms",
      focus: "150ms",
      async: "340ms",
    },
  },
  "helios-foundry": {
    meta: {
      name: "Helios Foundry",
      id: "helios-foundry",
      primaryContext:
        "Industrial automation platforms, robotics coordination suites",
      paletteAnchor:
        "Graphite slate with molten copper cores and brass highlights",
      surfaceSchema:
        "Structured pane grid (24–28px rhythm), 12px chamfer, brushed metal borders, volumetric glow",
      typographyScaleDescription:
        "Body 15/22px, metrics 18/26px, hero 30/36px; copper-accented numerals",
      motionSignals:
        "Mechanized slide-ins (220ms), gear pulse focus ring, thermal status flares on alerts",
      narrativePillars: [
        "Industrial precision",
        "Mechanical warmth",
        "Operational reliability",
      ],
      keyTokens: [
        "Molten copper primary",
        "Brass secondary",
        "Graphite foundations",
      ],
      microinteractionNotes: [
        "Gear pulse feedback on controls",
        "Thermal glow escalation on alerts",
        "Mechanized slide-ins for panels",
      ],
    },
    colors: {
      background: {
        canvas: "#10141F",
        surface: "rgba(16,20,31,0.74)",
      },
      text: {
        primary: "#FFF3E4",
      },
      accent: {
        primary: "#FF8450",
        secondary: "#F0C85A",
      },
      state: {
        success: "#6BDD8D",
        warning: "#FFC15A",
        error: "#FF5A3C",
      },
      shadow: {
        panel: "0 30px 66px -30px rgba(255,132,80,0.44)",
      },
      focus: {
        ring: "0 0 0 3px rgba(255,132,80,0.32)",
      },
    },
    typography: {
      display: {
        weight: 600,
        size: "30px",
        letterSpacing: "0.35px",
      },
      headline: {
        weight: 500,
        size: "22px",
        letterSpacing: "0.25px",
      },
      metric: {
        weight: 600,
        size: "19px",
        letterSpacing: "0.25px",
      },
      body: {
        weight: 400,
        size: "15px",
        letterSpacing: "0.1px",
      },
      caption: {
        weight: 400,
        size: "13px",
        letterSpacing: "0px",
      },
    },
    spacing: {
      baseGrid: "24px",
      panelRadius: "12px",
      buttonRadius: "10px",
      overlayBlur: "28px",
      layoutPattern: "Industrial twin layout with control sidebar",
    },
    motion: {
      entry: "260ms",
      hover: "150ms",
      focus: "130ms",
      async: "320ms",
    },
  },
  "glacier-morn": {
    meta: {
      name: "Glacier Morn",
      id: "glacier-morn",
      primaryContext:
        "Clinical oversight systems, healthcare compliance dashboards",
      paletteAnchor:
        "Deep arctic blue with icy cyan accents and pearl neutrals",
      surfaceSchema:
        "Frosted glass planes (18–24px rhythm), 10px radius, clinical translucency, low-noise shadows",
      typographyScaleDescription:
        "Body 15/22px, metrics 18/26px, hero 28/34px; icy teal emphasis",
      motionSignals:
        "Measured fades (200ms), heartbeat diagnostics glow, sterile focus outline",
      narrativePillars: ["Clinical trust", "Clarity", "Calm assurance"],
      keyTokens: ["Icy cyan primaries", "Pearl neutrals", "Soft navy shadows"],
      microinteractionNotes: [
        "Heartbeat pulses on vitals",
        "Sterile glow on input focus",
        "Gentle fades on tab transitions",
      ],
    },
    colors: {
      background: {
        canvas: "#071220",
        surface: "rgba(9,20,36,0.72)",
      },
      text: {
        primary: "#F0FAFF",
      },
      accent: {
        primary: "#5BE1FF",
        secondary: "#8AA8FF",
      },
      state: {
        success: "#63E2C6",
        warning: "#FFE08B",
        error: "#FF6B7D",
      },
      shadow: {
        panel: "0 26px 60px -30px rgba(91,225,255,0.40)",
      },
      focus: {
        ring: "0 0 0 3px rgba(91,225,255,0.32)",
      },
    },
    typography: {
      display: {
        weight: 600,
        size: "26px",
        letterSpacing: "0.45px",
      },
      headline: {
        weight: 500,
        size: "21px",
        letterSpacing: "0.35px",
      },
      metric: {
        weight: 600,
        size: "18px",
        letterSpacing: "0.3px",
      },
      body: {
        weight: 400,
        size: "15px",
        letterSpacing: "0.15px",
      },
      caption: {
        weight: 400,
        size: "13px",
        letterSpacing: "0.05px",
      },
    },
    spacing: {
      baseGrid: "20px",
      panelRadius: "10px",
      buttonRadius: "8px",
      overlayBlur: "26px",
      layoutPattern: "Clinical checklist layout with metrics spine",
    },
    motion: {
      entry: "300ms",
      hover: "170ms",
      focus: "140ms",
      async: "340ms",
    },
  },
  "terra-inflect": {
    meta: {
      name: "Terra Inflect",
      id: "terra-inflect",
      primaryContext: "Cyber defense war rooms, incident response workflows",
      paletteAnchor:
        "Obsidian base with volcanic ember gradients and hazard amber highlights",
      surfaceSchema:
        "Faceted panels (20–28px rhythm), 8px radius, ember-edge outlines, reinforced borders",
      typographyScaleDescription:
        "Body 15/22px, metrics 18/26px, hero 26/32px; ember-streak callouts",
      motionSignals:
        "Escalation pulses (160ms), perimeter scan sweeps, ember-lit focus ring",
      narrativePillars: [
        "Tactical readiness",
        "Threat response",
        "Resilient operations",
      ],
      keyTokens: [
        "Volcanic ember primaries",
        "Hazard amber warnings",
        "Obsidian backgrounds",
      ],
      microinteractionNotes: [
        "Ember flares on escalation",
        "Perimeter sweep focus states",
        "Assertive shake on critical errors",
      ],
    },
    colors: {
      background: {
        canvas: "#120E1A",
        surface: "rgba(24,16,32,0.74)",
      },
      text: {
        primary: "#FFEFE6",
      },
      accent: {
        primary: "#F8693A",
        secondary: "#FFAE4D",
      },
      state: {
        success: "#58D58C",
        warning: "#FF944A",
        error: "#FF5C3C",
      },
      shadow: {
        panel: "0 28px 64px -30px rgba(248,105,58,0.42)",
      },
      focus: {
        ring: "0 0 0 3px rgba(248,105,58,0.34)",
      },
    },
    typography: {
      display: {
        weight: 600,
        size: "26px",
        letterSpacing: "0.4px",
      },
      headline: {
        weight: 500,
        size: "21px",
        letterSpacing: "0.3px",
      },
      metric: {
        weight: 600,
        size: "18px",
        letterSpacing: "0.25px",
      },
      body: {
        weight: 400,
        size: "15px",
        letterSpacing: "0.1px",
      },
      caption: {
        weight: 400,
        size: "13px",
        letterSpacing: "0px",
      },
    },
    spacing: {
      baseGrid: "22px",
      panelRadius: "8px",
      buttonRadius: "6px",
      overlayBlur: "26px",
      layoutPattern: "Incident war room grid with alert stack",
    },
    motion: {
      entry: "260ms",
      hover: "150ms",
      focus: "120ms",
      async: "300ms",
    },
  },
  "lumen-veil": {
    meta: {
      name: "Lumen Veil",
      id: "lumen-veil",
      primaryContext:
        "Creative production suites, experiential storytelling systems",
      paletteAnchor:
        "Charcoal canvas with lavender halos and rose quartz highlights",
      surfaceSchema:
        "Soft diffusion panels (24–32px rhythm), 14px radius, iridescent film overlays, layered bokeh",
      typographyScaleDescription:
        "Body 16/24px, metrics 20/28px, hero 32/40px; lavender typographic anchors",
      motionSignals:
        "Cinematic cross-fades (260ms), parallax tilt on hero frames, gradient focus highlights",
      narrativePillars: [
        "Expressive storytelling",
        "Immersive creativity",
        "Luminous ambiance",
      ],
      keyTokens: [
        "Lavender halos",
        "Rose quartz highlights",
        "Charcoal neutrals",
      ],
      microinteractionNotes: [
        "Cinematic cross-fades",
        "Parallax tilt on hero frames",
        "Gradient-focused highlight loops",
      ],
    },
    colors: {
      background: {
        canvas: "#0C0B1C",
        surface: "rgba(14,13,30,0.72)",
      },
      text: {
        primary: "#FFF4FB",
      },
      accent: {
        primary: "#C79BFF",
        secondary: "#FF7DA9",
      },
      state: {
        success: "#74E4C2",
        warning: "#FFD38F",
        error: "#FF6CA8",
      },
      shadow: {
        panel: "0 30px 70px -32px rgba(199,155,255,0.45)",
      },
      focus: {
        ring: "0 0 0 3px rgba(199,155,255,0.32)",
      },
    },
    typography: {
      display: {
        weight: 600,
        size: "32px",
        letterSpacing: "0.55px",
      },
      headline: {
        weight: 500,
        size: "24px",
        letterSpacing: "0.45px",
      },
      metric: {
        weight: 600,
        size: "20px",
        letterSpacing: "0.35px",
      },
      body: {
        weight: 400,
        size: "16px",
        letterSpacing: "0.2px",
      },
      caption: {
        weight: 400,
        size: "14px",
        letterSpacing: "0.1px",
      },
    },
    spacing: {
      baseGrid: "24px",
      panelRadius: "14px",
      buttonRadius: "12px",
      overlayBlur: "32px",
      layoutPattern: "Storyboard flow with media spotlight strip",
    },
    motion: {
      entry: "340ms",
      hover: "210ms",
      focus: "170ms",
      async: "360ms",
    },
  },
  "nimbus-relay": {
    meta: {
      name: "Nimbus Relay",
      id: "nimbus-relay",
      primaryContext:
        "Real-time collaboration hubs, communications orchestration",
      paletteAnchor:
        "Midnight indigo with electric sky cyan and sunset coral accents",
      surfaceSchema:
        "Floating tile stacks (18–26px rhythm), 12px radius, airy drop shadows, signal halos",
      typographyScaleDescription:
        "Body 15/22px, metrics 18/26px, hero 28/34px; sky-kissed headings",
      motionSignals:
        "Cloud-drift motion (280ms), presence ping animations, dual-tone focus loop",
      narrativePillars: [
        "Connected collaboration",
        "Adaptive communication",
        "Lightness",
      ],
      keyTokens: [
        "Electric sky cyan for engagement",
        "Sunset coral accents",
        "Midnight indigo anchors",
      ],
      microinteractionNotes: [
        "Cloud drift animations",
        "Presence pings",
        "Dual-tone focus loop",
      ],
    },
    colors: {
      background: {
        canvas: "#060B1C",
        surface: "rgba(10,20,46,0.68)",
      },
      text: {
        primary: "#F4F8FF",
      },
      accent: {
        primary: "#5BD5FF",
        secondary: "#FF9F7C",
      },
      state: {
        success: "#3BE0AA",
        warning: "#FFC15A",
        error: "#FF5B82",
      },
      shadow: {
        panel: "0 24px 60px -28px rgba(91,213,255,0.32)",
      },
      focus: {
        ring: "0 0 0 3px rgba(91,213,255,0.26)",
      },
    },
    typography: {
      display: {
        weight: 600,
        size: "27px",
        letterSpacing: "0.4px",
      },
      headline: {
        weight: 500,
        size: "22px",
        letterSpacing: "0.3px",
      },
      metric: {
        weight: 600,
        size: "18px",
        letterSpacing: "0.25px",
      },
      body: {
        weight: 400,
        size: "15px",
        letterSpacing: "0.15px",
      },
      caption: {
        weight: 400,
        size: "13px",
        letterSpacing: "0.05px",
      },
    },
    spacing: {
      baseGrid: "22px",
      panelRadius: "12px",
      buttonRadius: "10px",
      overlayBlur: "28px",
      layoutPattern: "Floating collaboration tiles with live presence bar",
    },
    motion: {
      entry: "300ms",
      hover: "180ms",
      focus: "150ms",
      async: "340ms",
    },
  },
};

export const PERSONA_IDS = Object.keys(DESIGN_MATRIX) as PersonaId[];

export const PERSONA_LIST = PERSONA_IDS.map((id) => DESIGN_MATRIX[id]);

export const DEFAULT_PERSONA_ID: PersonaId = "midnight-slate";

export const getPersonaConfig = (id: PersonaId): PersonaConfig =>
  DESIGN_MATRIX[id];
