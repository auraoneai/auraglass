import type { ReactNode } from "react";

export type StoryPreviewMode = "light" | "dark" | "liquid" | "high-contrast";
export type StorySurfaceKind = "component" | "app" | "media" | "plain";

interface StorySurfaceProps {
  children: ReactNode;
  mode: StoryPreviewMode;
  kind?: StorySurfaceKind;
  fullscreen?: boolean;
}

const surfaceByMode: Record<StoryPreviewMode, React.CSSProperties> = {
  light: {
    background:
      "linear-gradient(180deg, #f8fafc 0%, #eef2f7 48%, #e5e7eb 100%)",
    color: "#111827",
  },
  dark: {
    background:
      "linear-gradient(180deg, #0f172a 0%, #111827 52%, #020617 100%)",
    color: "#f8fafc",
  },
  liquid: {
    background:
      "linear-gradient(135deg, #f8fafc 0%, #e7f0ff 34%, #f6efff 66%, #eefcf8 100%)",
    color: "#111827",
  },
  "high-contrast": {
    background: "#000",
    color: "#fff",
  },
};

const sceneByKind: Record<StorySurfaceKind, React.CSSProperties> = {
  component: {
    alignItems: "center",
    justifyContent: "center",
  },
  app: {
    alignItems: "stretch",
    justifyContent: "stretch",
  },
  media: {
    alignItems: "center",
    justifyContent: "center",
    background:
      "linear-gradient(135deg, #0f172a 0%, #1d4ed8 46%, #0f766e 100%)",
    color: "#fff",
  },
  plain: {
    alignItems: "stretch",
    justifyContent: "stretch",
    background: "transparent",
  },
};

function LiquidBackdrop() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        background:
          "linear-gradient(120deg, rgba(59, 130, 246, 0.10), transparent 36%, rgba(20, 184, 166, 0.10) 72%, transparent), linear-gradient(180deg, rgba(255, 255, 255, 0.42), transparent 46%, rgba(15, 23, 42, 0.04))",
      }}
    />
  );
}

export function StorySurface({
  children,
  mode,
  kind = "component",
  fullscreen = false,
}: StorySurfaceProps) {
  const isLiquid = mode === "liquid";
  const backgroundTone = mode === "dark" || mode === "high-contrast" ? "dark" : "light";
  const minHeight = fullscreen ? "100vh" : "calc(100vh - 40px)";
  const padding = fullscreen ? 0 : "clamp(16px, 3vw, 32px)";
  const isComponentSurface = kind === "component";

  return (
    <div
      data-storybook-preview-mode={mode}
      data-storybook-surface={kind}
      data-bg={backgroundTone}
      className={backgroundTone === "dark" ? "glass-on-dark" : "glass-on-light"}
      style={{
        ...surfaceByMode[mode],
        ...sceneByKind[kind],
        position: "relative",
        width: "100%",
        minWidth: 0,
        maxWidth: "100vw",
        minHeight,
        display: "flex",
        boxSizing: "border-box",
        padding,
        overflowX: "hidden",
        overflowY: "auto",
        isolation: "isolate",
      }}
    >
      {isLiquid && kind !== "plain" && <LiquidBackdrop />}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: isComponentSurface ? "fit-content" : "100%",
          maxWidth: isComponentSurface ? "min(100%, 1120px)" : "none",
          minWidth: 0,
          boxSizing: "border-box",
        }}
      >
        {children}
      </div>
    </div>
  );
}
