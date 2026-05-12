import{j as o}from"./iframe-C690vU5J.js";import{L as a}from"./LiquidGlassBottomAccessory-D12St4gc.js";import"./preload-helper-PPVm8Dsz.js";import"./LiquidGlassMaterial-BBmAKzP0.js";import"./LiquidGlassLayerProvider-DhxSOSnK.js";const n={title:"Navigation/Liquid Glass Bottom Accessory",component:a,parameters:{layout:"fullscreen",previewSurface:"app"}},s=`
  .liquid-bottom-accessory-story {
    --accessory-story-ink: #0f172a;
    --accessory-story-muted: #334155;
    --accessory-story-border: rgba(15, 23, 42, 0.1);
    min-height: 100vh;
    display: grid;
    place-items: center;
    padding: clamp(18px, 4vw, 32px);
    box-sizing: border-box;
    color: var(--accessory-story-ink);
  }

  .liquid-bottom-accessory-stage {
    width: min(760px, 100%);
    min-height: 420px;
    display: grid;
    align-items: end;
    padding: 28px;
    box-sizing: border-box;
    border: 1px solid var(--accessory-story-border);
    border-radius: 32px;
    background:
      linear-gradient(135deg, rgba(255,255,255,0.68), rgba(219,234,254,0.38)),
      repeating-linear-gradient(90deg, rgba(29,78,216,0.16) 0 80px, rgba(20,184,166,0.14) 80px 160px, rgba(236,72,153,0.1) 160px 240px);
    box-shadow: 0 24px 80px rgba(15, 23, 42, 0.14);
  }

  .liquid-bottom-accessory-story .liquid-glass-bottom-accessory {
    border: 1px solid rgba(255, 255, 255, 0.58) !important;
    background:
      linear-gradient(135deg, rgba(255,255,255,0.58), rgba(255,255,255,0.32)),
      linear-gradient(90deg, rgba(29,78,216,0.1), rgba(20,184,166,0.1)) !important;
    box-shadow: 0 18px 54px rgba(15, 23, 42, 0.16), inset 0 1px 0 rgba(255,255,255,0.48) !important;
    color: var(--accessory-story-ink);
  }

  .liquid-bottom-accessory-artwork {
    width: 42px;
    height: 42px;
    flex: 0 0 auto;
    border-radius: 12px;
    background: linear-gradient(135deg, #1d4ed8, #14b8a6);
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.3);
  }

  .liquid-bottom-accessory-title {
    display: block;
  }

  .liquid-bottom-accessory-meta,
  .liquid-bottom-accessory-time {
    color: var(--accessory-story-muted);
    font-size: 12px;
  }

  .liquid-bottom-accessory-meta {
    display: block;
  }

  [data-storybook-preview-mode="dark"] .liquid-bottom-accessory-story {
    --accessory-story-ink: #f8fafc;
    --accessory-story-muted: #dbeafe;
    --accessory-story-border: rgba(226, 232, 240, 0.22);
  }

  [data-storybook-preview-mode="dark"] .liquid-bottom-accessory-stage {
    background:
      linear-gradient(135deg, rgba(15,23,42,0.86), rgba(30,41,59,0.62)),
      repeating-linear-gradient(90deg, rgba(96,165,250,0.22) 0 80px, rgba(45,212,191,0.16) 80px 160px, rgba(244,114,182,0.14) 160px 240px);
    box-shadow: 0 28px 90px rgba(0, 0, 0, 0.36);
  }

  [data-storybook-preview-mode="dark"] .liquid-bottom-accessory-story .liquid-glass-bottom-accessory {
    border-color: rgba(226, 232, 240, 0.28) !important;
    background:
      linear-gradient(135deg, rgba(15,23,42,0.66), rgba(30,41,59,0.42)),
      linear-gradient(90deg, rgba(96,165,250,0.18), rgba(45,212,191,0.14)) !important;
    box-shadow: 0 22px 64px rgba(0, 0, 0, 0.34), inset 0 1px 0 rgba(255,255,255,0.16) !important;
  }

  [data-storybook-preview-mode="liquid"] .liquid-bottom-accessory-stage {
    background:
      linear-gradient(135deg, rgba(255,255,255,0.58), rgba(236,253,245,0.36)),
      repeating-linear-gradient(90deg, rgba(29,78,216,0.18) 0 80px, rgba(20,184,166,0.16) 80px 160px, rgba(236,72,153,0.12) 160px 240px);
  }

  [data-storybook-preview-mode="liquid"] .liquid-bottom-accessory-story .liquid-glass-bottom-accessory {
    background:
      linear-gradient(135deg, rgba(255,255,255,0.5), rgba(255,255,255,0.26)),
      linear-gradient(90deg, rgba(29,78,216,0.14), rgba(20,184,166,0.12), rgba(236,72,153,0.08)) !important;
  }

  [data-storybook-preview-mode="high-contrast"] .liquid-bottom-accessory-story {
    --accessory-story-ink: #fff;
    --accessory-story-muted: #fff;
    --accessory-story-border: #fff;
  }

  [data-storybook-preview-mode="high-contrast"] .liquid-bottom-accessory-stage,
  [data-storybook-preview-mode="high-contrast"] .liquid-bottom-accessory-artwork {
    background: #000;
    box-shadow: none;
  }

  [data-storybook-preview-mode="high-contrast"] .liquid-bottom-accessory-story .liquid-glass-material,
  [data-storybook-preview-mode="high-contrast"] .liquid-bottom-accessory-artwork {
    border: 2px solid #fff !important;
    background: #000 !important;
    box-shadow: none !important;
    color: #fff !important;
  }
`,r={render:()=>o.jsxs("div",{className:"liquid-bottom-accessory-story",children:[o.jsx("style",{children:s}),o.jsx("div",{className:"liquid-bottom-accessory-stage",children:o.jsxs(a,{children:[o.jsx("div",{className:"liquid-bottom-accessory-artwork"}),o.jsxs("div",{style:{minWidth:0,flex:1},children:[o.jsx("strong",{className:"liquid-bottom-accessory-title",children:"Now playing"}),o.jsx("span",{className:"liquid-bottom-accessory-meta",children:"Liquid Study - Aura System"})]}),o.jsx("span",{className:"liquid-bottom-accessory-time",children:"2:14"})]})})]})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  render: () => <div className="liquid-bottom-accessory-story">
      <style>{bottomAccessoryStoryCss}</style>
      <div className="liquid-bottom-accessory-stage">
        <LiquidGlassBottomAccessory>
          <div className="liquid-bottom-accessory-artwork" />
          <div style={{
          minWidth: 0,
          flex: 1
        }}>
            <strong className="liquid-bottom-accessory-title">Now playing</strong>
            <span className="liquid-bottom-accessory-meta">Liquid Study - Aura System</span>
          </div>
          <span className="liquid-bottom-accessory-time">2:14</span>
        </LiquidGlassBottomAccessory>
      </div>
    </div>
}`,...r.parameters?.docs?.source}}};const b=["Default"];export{r as Default,b as __namedExportsOrder,n as default};
