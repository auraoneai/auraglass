"use client";

import React, { useState } from "react";
import { LiquidGlassBadgeCluster } from "../data-display/LiquidGlassBadgeCluster";
import { LiquidGlassMediaControls } from "../media/LiquidGlassMediaControls";
import { LiquidGlassNowPlayingBar } from "../media/LiquidGlassNowPlayingBar";
import { LiquidGlassInsetSidebar } from "../navigation/LiquidGlassInsetSidebar";
import { LiquidGlassTabBar } from "../navigation/LiquidGlassTabBar";
import { LiquidGlassToolbar } from "../navigation/LiquidGlassToolbar";
import { LiquidGlassSearchField } from "../search/LiquidGlassSearchField";
import { LiquidGlassAdaptiveSheet } from "../modal/LiquidGlassAdaptiveSheet";

export function LiquidGlassShowcase() {
  const [tab, setTab] = useState("home");
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <div
      className="liquid-glass-showcase"
      data-bg="light"
      data-liquid-glass-showcase="true"
      style={{
        position: "relative",
        minHeight: "100vh",
        padding: 28,
        boxSizing: "border-box",
        overflow: "hidden",
        color: "#0f172a",
        background:
          "linear-gradient(135deg, #eef6ff 0%, #f8fbff 42%, #effdf8 100%)",
      }}
    >
      <style>{`
        .liquid-glass-showcase {
          --glass-text-primary: rgba(15, 23, 42, 0.92);
          --glass-text-secondary: rgba(71, 85, 105, 0.92);
          --glass-text-tertiary: rgba(100, 116, 139, 0.9);
        }

        .liquid-glass-showcase-layout {
          grid-template-columns: 260px minmax(0, 1fr);
        }

        .liquid-glass-showcase-content {
          grid-template-columns: minmax(0, 1.4fr) minmax(280px, 0.6fr);
        }

        @media (max-width: 820px) {
          .liquid-glass-showcase {
            padding: 18px;
            overflow: auto;
          }

          .liquid-glass-showcase-layout,
          .liquid-glass-showcase-content {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            '/* Use createGlassStyle({ intent: "primary", elevation: "level3" }) */',
        }}
      />
      <div
        className="liquid-glass-showcase-layout"
        style={{
          position: "relative",
          display: "grid",
          gap: 24,
          minHeight: "calc(100vh - 56px)",
        }}
      >
        <LiquidGlassInsetSidebar
          items={[
            { id: "home", label: "Home", badge: "Live" },
            { id: "media", label: "Media" },
            { id: "settings", label: "Settings" },
          ]}
          selectedId={tab}
          onSelect={setTab}
          style={{ width: "100%", minHeight: "100%" }}
        />
        <main
          style={{
            display: "grid",
            gridTemplateRows: "auto minmax(0, 1fr) auto",
            gap: 20,
            minWidth: 0,
          }}
        >
          <LiquidGlassToolbar
            floating
            scrollEdge="soft"
            left={
              <div style={{ minWidth: 170 }}>
                <strong style={{ display: "block", fontSize: 16 }}>
                  Aura Liquid Glass
                </strong>
                <span
                  style={{ display: "block", fontSize: 12, color: "#475569" }}
                >
                  Production app chrome
                </span>
              </div>
            }
            center={
              <LiquidGlassSearchField
                placeholder="Search surfaces"
                scope="Workspace"
                style={{ width: 280 }}
              />
            }
            right={
              <button
                type="button"
                onClick={() => setSheetOpen(true)}
                style={{
                  border: 0,
                  borderRadius: 999,
                  background:
                    '/* Use createGlassStyle({ intent: "primary", elevation: "level2" }) */',
                  color: "#0f172a",
                  cursor: "pointer",
                  font: "inherit",
                  padding: "7px 14px",
                }}
              >
                Open
              </button>
            }
            groups={[
              {
                id: "view",
                items: [
                  { id: "grid", label: "Grid" },
                  { id: "list", label: "List" },
                ],
              },
            ]}
          />
          <section
            className="liquid-glass-showcase-content"
            style={{
              display: "grid",
              gap: 20,
              minHeight: 0,
            }}
          >
            <div
              style={{
                minHeight: 360,
                borderRadius: 28,
                padding: 20,
                display: "flex",
                alignItems: "flex-end",
                background:
                  "linear-gradient(135deg, #1d4ed8 0%, #2563eb 38%, #14b8a6 100%)",
                boxShadow: "0 24px 80px rgba(15, 23, 42, 0.18)",
              }}
            >
              <LiquidGlassMediaControls
                playing={false}
                duration={100}
                currentTime={40}
              />
            </div>
            <div style={{ display: "grid", gap: 16, alignContent: "start" }}>
              <LiquidGlassBadgeCluster
                expanded
                items={[
                  { id: "a", label: "Adaptive" },
                  { id: "b", label: "Grouped" },
                  { id: "c", label: "Accessible" },
                  { id: "d", label: "Motion-safe" },
                ]}
              />
              <div
                style={{
                  borderRadius: 24,
                  padding: 18,
                  background:
                    '/* Use createGlassStyle({ intent: "neutral", elevation: "level3" }) */',
                  boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.66)",
                }}
              >
                <h2 style={{ margin: 0, fontSize: 18 }}>
                  Surface intelligence
                </h2>
                <p style={{ margin: "8px 0 0", color: "#475569" }}>
                  Liquid Glass groups navigation, media, search, and transient
                  UI without making content hard to read.
                </p>
              </div>
            </div>
          </section>
          <div style={{ maxWidth: 680, margin: "0 auto", width: "100%" }}>
            <LiquidGlassTabBar
              tabs={[
                { id: "home", label: "Home" },
                { id: "media", label: "Media" },
                { id: "search", label: "Search" },
              ]}
              activeTab={tab}
              onChange={setTab}
              minimizeBehavior="never"
              searchTabId="search"
              bottomAccessory={
                <LiquidGlassNowPlayingBar
                  className="liquid-glass-showcase-now-playing"
                  title="Liquid Study"
                  subtitle="Aura System"
                  progress={0.42}
                  style={
                    {
                      color: "#f8fafc",
                      "--glass-text-secondary": "rgba(226, 232, 240, 0.88)",
                    } as React.CSSProperties
                  }
                />
              }
            />
          </div>
        </main>
      </div>
      <LiquidGlassAdaptiveSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        title="Source Sheet"
      >
        <p>
          This sheet demonstrates an adaptive Liquid Glass presentation surface.
        </p>
      </LiquidGlassAdaptiveSheet>
    </div>
  );
}

export default LiquidGlassShowcase;
