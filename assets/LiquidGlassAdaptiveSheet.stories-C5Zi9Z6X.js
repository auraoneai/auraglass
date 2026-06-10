import{j as e}from"./iframe-DuFCckax.js";import{L as i}from"./LiquidGlassAdaptiveSheet-Cm7qRHK1.js";import"./preload-helper-PPVm8Dsz.js";import"./LiquidGlassMaterial-Cfs6Tlc8.js";import"./LiquidGlassLayerProvider-5FQsJWNj.js";import"./LiquidGlassScrollEdge-C5qH8kjG.js";const l={title:"Surfaces/Modals/Liquid Glass Adaptive Sheet",component:i,parameters:{layout:"fullscreen",previewSurface:"app"}},t=`
  .liquid-adaptive-sheet-story {
    --sheet-story-ink: #0f172a;
    --sheet-story-muted: #334155;
    --sheet-story-panel: rgba(255, 255, 255, 0.68);
    --sheet-story-panel-border: rgba(15, 23, 42, 0.1);
    min-height: 100vh;
    padding: clamp(18px, 4vw, 32px);
    box-sizing: border-box;
    color: var(--sheet-story-ink);
  }

  .liquid-adaptive-sheet-card {
    position: relative;
    min-height: 520px;
    overflow: hidden;
    border: 1px solid var(--sheet-story-panel-border);
    border-radius: 28px;
    padding: 28px;
    background:
      linear-gradient(115deg, rgba(255,255,255,0.72), rgba(219,234,254,0.42)),
      repeating-linear-gradient(90deg, rgba(37,99,235,0.08) 0 72px, rgba(20,184,166,0.08) 72px 144px, rgba(244,114,182,0.08) 144px 216px);
    box-shadow: 0 24px 80px rgba(15, 23, 42, 0.14);
  }

  .liquid-adaptive-sheet-lane {
    display: grid;
    gap: 12px;
    max-width: 520px;
  }

  .liquid-adaptive-sheet-row {
    height: 58px;
    border-radius: 16px;
    background: var(--sheet-story-panel);
    border: 1px solid var(--sheet-story-panel-border);
  }

  .liquid-adaptive-sheet-copy,
  .liquid-adaptive-sheet-option {
    color: var(--sheet-story-muted);
  }

  .liquid-adaptive-sheet-option {
    border: 1px solid var(--sheet-story-panel-border);
    border-radius: 16px;
    padding: 14px;
    background: var(--sheet-story-panel);
  }

  .liquid-adaptive-sheet-story .liquid-glass-material {
    border: 1px solid rgba(255, 255, 255, 0.58) !important;
    background:
      linear-gradient(135deg, rgba(255,255,255,0.58), rgba(255,255,255,0.32)),
      linear-gradient(90deg, rgba(37,99,235,0.1), rgba(20,184,166,0.1)) !important;
    box-shadow: 0 24px 72px rgba(15, 23, 42, 0.18), inset 0 1px 0 rgba(255,255,255,0.5) !important;
    color: var(--sheet-story-ink);
  }

  [data-storybook-preview-mode="dark"] .liquid-adaptive-sheet-story {
    --sheet-story-ink: #f8fafc;
    --sheet-story-muted: #dbeafe;
    --sheet-story-panel: rgba(15, 23, 42, 0.58);
    --sheet-story-panel-border: rgba(226, 232, 240, 0.22);
  }

  [data-storybook-preview-mode="dark"] .liquid-adaptive-sheet-card {
    background:
      linear-gradient(135deg, rgba(15,23,42,0.82), rgba(30,41,59,0.62)),
      repeating-linear-gradient(90deg, rgba(96,165,250,0.2) 0 78px, rgba(45,212,191,0.16) 78px 156px, rgba(248,113,113,0.13) 156px 234px);
    box-shadow: 0 28px 90px rgba(0, 0, 0, 0.36);
  }

  [data-storybook-preview-mode="dark"] .liquid-adaptive-sheet-story .liquid-glass-material {
    border-color: rgba(226, 232, 240, 0.28) !important;
    background:
      linear-gradient(135deg, rgba(15,23,42,0.64), rgba(30,41,59,0.42)),
      linear-gradient(90deg, rgba(96,165,250,0.18), rgba(45,212,191,0.14)) !important;
    box-shadow: 0 28px 90px rgba(0, 0, 0, 0.34), inset 0 1px 0 rgba(255,255,255,0.16) !important;
  }

  [data-storybook-preview-mode="liquid"] .liquid-adaptive-sheet-card {
    background:
      linear-gradient(120deg, rgba(255,255,255,0.6), rgba(236,253,245,0.38)),
      repeating-linear-gradient(90deg, rgba(37,99,235,0.14) 0 70px, rgba(20,184,166,0.14) 70px 140px, rgba(217,70,239,0.1) 140px 210px);
  }

  [data-storybook-preview-mode="liquid"] .liquid-adaptive-sheet-story .liquid-glass-material {
    background:
      linear-gradient(135deg, rgba(255,255,255,0.5), rgba(255,255,255,0.26)),
      linear-gradient(90deg, rgba(37,99,235,0.14), rgba(20,184,166,0.12), rgba(217,70,239,0.08)) !important;
  }

  [data-storybook-preview-mode="high-contrast"] .liquid-adaptive-sheet-story {
    --sheet-story-ink: #fff;
    --sheet-story-muted: #fff;
    --sheet-story-panel: #000;
    --sheet-story-panel-border: #fff;
  }

  [data-storybook-preview-mode="high-contrast"] .liquid-adaptive-sheet-card {
    background: #000;
    box-shadow: none;
  }

  [data-storybook-preview-mode="high-contrast"] .liquid-adaptive-sheet-story .liquid-glass-material {
    border: 2px solid #fff !important;
    background: #000 !important;
    box-shadow: none !important;
    color: #fff !important;
  }
`,a={render:()=>e.jsxs("div",{className:"liquid-adaptive-sheet-story",children:[e.jsx("style",{children:t}),e.jsxs("div",{className:"liquid-adaptive-sheet-card",children:[e.jsx("h2",{style:{margin:0},children:"Project timeline"}),e.jsx("p",{className:"liquid-adaptive-sheet-copy",children:"The sheet is shown as an intentional presentation layer over app content."}),e.jsxs("div",{className:"liquid-adaptive-sheet-lane","aria-hidden":"true",children:[e.jsx("div",{className:"liquid-adaptive-sheet-row"}),e.jsx("div",{className:"liquid-adaptive-sheet-row",style:{width:"82%"}}),e.jsx("div",{className:"liquid-adaptive-sheet-row",style:{width:"68%"}})]})]}),e.jsx(i,{open:!0,title:"Export options",height:320,presentationMode:"parallel",children:e.jsxs("div",{style:{display:"grid",gap:12},children:[e.jsx("p",{className:"liquid-adaptive-sheet-copy",style:{margin:0},children:"Choose delivery settings for the selected media batch."}),e.jsx("div",{className:"liquid-adaptive-sheet-option",children:"Format: HEVC 4K"}),e.jsx("div",{className:"liquid-adaptive-sheet-option",children:"Destination: Review room"})]})})]})};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  render: () => <div className="liquid-adaptive-sheet-story">
      <style>{adaptiveSheetStoryCss}</style>
      <div className="liquid-adaptive-sheet-card">
        <h2 style={{
        margin: 0
      }}>Project timeline</h2>
        <p className="liquid-adaptive-sheet-copy">The sheet is shown as an intentional presentation layer over app content.</p>
        <div className="liquid-adaptive-sheet-lane" aria-hidden="true">
          <div className="liquid-adaptive-sheet-row" />
          <div className="liquid-adaptive-sheet-row" style={{
          width: "82%"
        }} />
          <div className="liquid-adaptive-sheet-row" style={{
          width: "68%"
        }} />
        </div>
      </div>
      <LiquidGlassAdaptiveSheet open title="Export options" height={320} presentationMode="parallel">
        <div style={{
        display: "grid",
        gap: 12
      }}>
          <p className="liquid-adaptive-sheet-copy" style={{
          margin: 0
        }}>Choose delivery settings for the selected media batch.</p>
          <div className="liquid-adaptive-sheet-option">Format: HEVC 4K</div>
          <div className="liquid-adaptive-sheet-option">Destination: Review room</div>
        </div>
      </LiquidGlassAdaptiveSheet>
    </div>
}`,...a.parameters?.docs?.source}}};const h=["Bottom"];export{a as Bottom,h as __namedExportsOrder,l as default};
