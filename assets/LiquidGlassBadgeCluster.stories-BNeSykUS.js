import{j as e}from"./iframe-D2N3vCdj.js";import{L as r}from"./LiquidGlassBadgeCluster-ea_Hil5H.js";import"./preload-helper-PPVm8Dsz.js";import"./LiquidGlassMaterial-Y3bF4vfX.js";import"./LiquidGlassLayerProvider-DuyeeDou.js";const n={title:"Data + Visualization/Liquid Glass Badge Cluster",component:r,parameters:{layout:"fullscreen",previewSurface:"app"}},d=`
  .liquid-badge-cluster-story {
    --badge-story-ink: #0f172a;
    --badge-story-muted: #334155;
    --badge-story-panel: rgba(255, 255, 255, 0.72);
    --badge-story-border: rgba(15, 23, 42, 0.1);
    min-height: 100vh;
    display: grid;
    place-items: center;
    padding: clamp(18px, 4vw, 32px);
    box-sizing: border-box;
    color: var(--badge-story-ink);
  }

  .liquid-badge-cluster-panel {
    display: grid;
    gap: 18px;
    width: min(560px, 100%);
    border: 1px solid var(--badge-story-border);
    border-radius: 28px;
    padding: 28px;
    background:
      linear-gradient(135deg, var(--badge-story-panel), rgba(224,242,254,0.42)),
      repeating-linear-gradient(90deg, rgba(14,165,233,0.12) 0 68px, rgba(16,185,129,0.12) 68px 136px, rgba(168,85,247,0.1) 136px 204px);
    box-shadow: 0 24px 80px rgba(15, 23, 42, 0.14);
  }

  .liquid-badge-cluster-story p {
    color: var(--badge-story-muted);
  }

  .liquid-badge-cluster-story .liquid-glass-badge-cluster {
    border: 1px solid rgba(255, 255, 255, 0.58) !important;
    background:
      linear-gradient(135deg, rgba(255,255,255,0.58), rgba(255,255,255,0.32)),
      linear-gradient(90deg, rgba(14,165,233,0.1), rgba(16,185,129,0.1)) !important;
    box-shadow: 0 18px 54px rgba(15, 23, 42, 0.16), inset 0 1px 0 rgba(255,255,255,0.48) !important;
    color: var(--badge-story-ink);
  }

  .liquid-badge-cluster-story .liquid-glass-badge-cluster .glass-surface-primary {
    color: #fff;
    text-shadow: 0 1px 2px rgba(15, 23, 42, 0.28);
  }

  [data-storybook-preview-mode="dark"] .liquid-badge-cluster-story {
    --badge-story-ink: #f8fafc;
    --badge-story-muted: #dbeafe;
    --badge-story-panel: rgba(15, 23, 42, 0.62);
    --badge-story-border: rgba(226, 232, 240, 0.22);
  }

  [data-storybook-preview-mode="dark"] .liquid-badge-cluster-panel {
    background:
      linear-gradient(135deg, rgba(15,23,42,0.86), rgba(30,41,59,0.62)),
      repeating-linear-gradient(90deg, rgba(56,189,248,0.18) 0 68px, rgba(45,212,191,0.15) 68px 136px, rgba(192,132,252,0.14) 136px 204px);
    box-shadow: 0 28px 90px rgba(0, 0, 0, 0.36);
  }

  [data-storybook-preview-mode="dark"] .liquid-badge-cluster-story .liquid-glass-badge-cluster {
    border-color: rgba(226, 232, 240, 0.28) !important;
    background:
      linear-gradient(135deg, rgba(15,23,42,0.66), rgba(30,41,59,0.42)),
      linear-gradient(90deg, rgba(56,189,248,0.18), rgba(45,212,191,0.14)) !important;
    box-shadow: 0 22px 64px rgba(0, 0, 0, 0.34), inset 0 1px 0 rgba(255,255,255,0.16) !important;
  }

  [data-storybook-preview-mode="liquid"] .liquid-badge-cluster-panel {
    background:
      linear-gradient(135deg, rgba(255,255,255,0.66), rgba(236,253,245,0.38)),
      repeating-linear-gradient(90deg, rgba(14,165,233,0.16) 0 68px, rgba(16,185,129,0.15) 68px 136px, rgba(168,85,247,0.12) 136px 204px);
  }

  [data-storybook-preview-mode="liquid"] .liquid-badge-cluster-story .liquid-glass-badge-cluster {
    background:
      linear-gradient(135deg, rgba(255,255,255,0.5), rgba(255,255,255,0.26)),
      linear-gradient(90deg, rgba(14,165,233,0.14), rgba(16,185,129,0.12), rgba(168,85,247,0.08)) !important;
  }

  [data-storybook-preview-mode="high-contrast"] .liquid-badge-cluster-story {
    --badge-story-ink: #fff;
    --badge-story-muted: #fff;
    --badge-story-panel: #000;
    --badge-story-border: #fff;
  }

  [data-storybook-preview-mode="high-contrast"] .liquid-badge-cluster-panel {
    background: #000;
    box-shadow: none;
  }

  [data-storybook-preview-mode="high-contrast"] .liquid-badge-cluster-story .liquid-glass-material,
  [data-storybook-preview-mode="high-contrast"] .liquid-badge-cluster-story .glass-surface-primary {
    border: 2px solid #fff !important;
    background: #000 !important;
    box-shadow: none !important;
    color: #fff !important;
    text-shadow: none;
  }
`,a={render:()=>e.jsxs("div",{className:"liquid-badge-cluster-story",children:[e.jsx("style",{children:d}),e.jsxs("div",{className:"liquid-badge-cluster-panel",children:[e.jsxs("div",{children:[e.jsx("h2",{style:{margin:0,fontSize:20},children:"Review filters"}),e.jsx("p",{style:{margin:"6px 0 0"},children:"Collapsed badges retain context and reveal overflow intentionally."})]}),e.jsx(r,{items:[{id:"a",label:"Adaptive",selected:!0},{id:"b",label:"Grouped"},{id:"c",label:"Accessible"},{id:"d",label:"Motion-safe"}],maxCollapsed:2})]})]})};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  render: () => <div className="liquid-badge-cluster-story">
      <style>{badgeClusterStoryCss}</style>
      <div className="liquid-badge-cluster-panel">
        <div>
          <h2 style={{
          margin: 0,
          fontSize: 20
        }}>Review filters</h2>
          <p style={{
          margin: "6px 0 0"
        }}>Collapsed badges retain context and reveal overflow intentionally.</p>
        </div>
        <LiquidGlassBadgeCluster items={[{
        id: "a",
        label: "Adaptive",
        selected: true
      }, {
        id: "b",
        label: "Grouped"
      }, {
        id: "c",
        label: "Accessible"
      }, {
        id: "d",
        label: "Motion-safe"
      }]} maxCollapsed={2} />
      </div>
    </div>
}`,...a.parameters?.docs?.source}}};const g=["Collapsed"];export{a as Collapsed,g as __namedExportsOrder,n as default};
