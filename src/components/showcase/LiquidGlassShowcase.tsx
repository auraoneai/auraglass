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
    <div className="liquid-glass-showcase glass-relative glass-min-h-screen glass-overflow-hidden glass-bg-default" data-liquid-glass-showcase="true">
      <LiquidGlassInsetSidebar
        items={[
          { id: "home", label: "Home" },
          { id: "media", label: "Media" },
          { id: "settings", label: "Settings" },
        ]}
        selectedId={tab}
        onSelect={setTab}
        className="glass-absolute glass-left-4 glass-top-4 glass-bottom-4"
      />
      <main className="glass-ml-80 glass-min-h-screen glass-p-6">
        <LiquidGlassToolbar
          floating
          scrollEdge="soft"
          left={<strong>Aura Liquid Glass</strong>}
          center={<LiquidGlassSearchField results={[{ id: "one", label: "Liquid toolbar" }]} />}
          right={<button type="button" onClick={() => setSheetOpen(true)}>Open</button>}
          groups={[{ id: "view", items: [{ id: "grid", label: "Grid" }, { id: "list", label: "List" }] }]}
        />
        <section className="glass-mt-6 glass-grid glass-gap-4">
          <div className="glass-aspect-video glass-radius-2xl glass-bg-[linear-gradient(135deg,#305cff,#14b8a6)] glass-p-4">
            <LiquidGlassMediaControls playing={false} duration={100} currentTime={40} />
          </div>
          <LiquidGlassBadgeCluster
            items={[
              { id: "a", label: "Adaptive" },
              { id: "b", label: "Grouped" },
              { id: "c", label: "Accessible" },
              { id: "d", label: "Motion-safe" },
            ]}
          />
        </section>
      </main>
      <div className="glass-fixed glass-bottom-4 glass-left-1/2 glass-z-50 glass-w-full glass-max-w-xl -glass-translate-x-1/2">
        <LiquidGlassTabBar
          tabs={[
            { id: "home", label: "Home" },
            { id: "media", label: "Media" },
            { id: "search", label: "Search" },
          ]}
          activeTab={tab}
          onChange={setTab}
          searchTabId="search"
          bottomAccessory={<LiquidGlassNowPlayingBar title="Liquid Study" subtitle="Aura System" progress={0.42} />}
        />
      </div>
      <LiquidGlassAdaptiveSheet open={sheetOpen} onOpenChange={setSheetOpen} title="Source Sheet">
        <p>This sheet demonstrates an adaptive Liquid Glass presentation surface.</p>
      </LiquidGlassAdaptiveSheet>
    </div>
  );
}

export default LiquidGlassShowcase;
