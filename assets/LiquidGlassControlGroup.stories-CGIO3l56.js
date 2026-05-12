import{j as o}from"./iframe-C_vLCgmV.js";import{L as e}from"./LiquidGlassControlGroup-DrFRCUat.js";import"./preload-helper-PPVm8Dsz.js";import"./LiquidGlassMaterial-BcA2rjwO.js";import"./LiquidGlassLayerProvider-C85Vz4rQ.js";const p={title:"Controls/Inputs/Liquid Glass Control Group",component:e,parameters:{layout:"fullscreen",previewSurface:"app"}},t={border:0,borderRadius:999,color:"inherit",cursor:"pointer",font:"inherit",minWidth:42,padding:"8px 12px"},n=`
  .liquid-control-group-story {
    --control-story-ink: #0f172a;
    --control-story-muted: #334155;
    --control-story-panel: rgba(255, 255, 255, 0.66);
    --control-story-border: rgba(15, 23, 42, 0.1);
    --control-story-active: rgba(37, 99, 235, 0.16);
    --control-story-active-strong: rgba(20, 184, 166, 0.18);
    min-height: 100vh;
    display: grid;
    place-items: center;
    padding: clamp(18px, 4vw, 32px);
    box-sizing: border-box;
    color: var(--control-story-ink);
  }

  .liquid-control-group-panel {
    width: min(760px, 100%);
    display: grid;
    gap: 22px;
    border: 1px solid var(--control-story-border);
    border-radius: 30px;
    padding: 28px;
    background:
      linear-gradient(135deg, var(--control-story-panel), rgba(236,253,245,0.36)),
      repeating-linear-gradient(90deg, rgba(96,165,250,0.15) 0 72px, rgba(45,212,191,0.13) 72px 144px, rgba(244,114,182,0.1) 144px 216px);
    box-shadow: 0 24px 80px rgba(15, 23, 42, 0.14);
  }

  .liquid-control-group-story p {
    color: var(--control-story-muted);
  }

  .liquid-control-group-row {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    align-items: center;
  }

  .liquid-control-group-story .liquid-glass-control-group {
    border: 1px solid rgba(255, 255, 255, 0.58) !important;
    background:
      linear-gradient(135deg, rgba(255,255,255,0.58), rgba(255,255,255,0.32)),
      linear-gradient(90deg, rgba(96,165,250,0.1), rgba(45,212,191,0.1)) !important;
    box-shadow: 0 18px 54px rgba(15, 23, 42, 0.16), inset 0 1px 0 rgba(255,255,255,0.48) !important;
    color: var(--control-story-ink);
  }

  .liquid-control-group-button {
    background: transparent;
  }

  .liquid-control-group-button.is-active {
    background: var(--control-story-active);
    box-shadow: inset 0 0 0 1px rgba(37, 99, 235, 0.18);
  }

  .liquid-control-group-button.is-alternate {
    background: var(--control-story-active-strong);
    box-shadow: inset 0 0 0 1px rgba(20, 184, 166, 0.2);
  }

  [data-storybook-preview-mode="dark"] .liquid-control-group-story {
    --control-story-ink: #f8fafc;
    --control-story-muted: #dbeafe;
    --control-story-panel: rgba(15, 23, 42, 0.66);
    --control-story-border: rgba(226, 232, 240, 0.22);
    --control-story-active: rgba(96, 165, 250, 0.32);
    --control-story-active-strong: #0f766e;
  }

  [data-storybook-preview-mode="dark"] .liquid-control-group-panel {
    background:
      linear-gradient(135deg, rgba(15,23,42,0.86), rgba(30,41,59,0.62)),
      repeating-linear-gradient(90deg, rgba(96,165,250,0.2) 0 72px, rgba(45,212,191,0.16) 72px 144px, rgba(244,114,182,0.14) 144px 216px);
    box-shadow: 0 28px 90px rgba(0, 0, 0, 0.36);
  }

  [data-storybook-preview-mode="dark"] .liquid-control-group-story .liquid-glass-control-group {
    border-color: rgba(226, 232, 240, 0.28) !important;
    background:
      linear-gradient(135deg, rgba(15,23,42,0.66), rgba(30,41,59,0.42)),
      linear-gradient(90deg, rgba(96,165,250,0.18), rgba(45,212,191,0.14)) !important;
    box-shadow: 0 22px 64px rgba(0, 0, 0, 0.34), inset 0 1px 0 rgba(255,255,255,0.16) !important;
  }

  [data-storybook-preview-mode="dark"] .liquid-control-group-button.is-alternate {
    color: #fff !important;
    background: var(--control-story-active-strong);
    box-shadow: inset 0 0 0 1px rgba(153, 246, 228, 0.42);
  }

  [data-storybook-preview-mode="liquid"] .liquid-control-group-panel {
    background:
      linear-gradient(135deg, rgba(255,255,255,0.58), rgba(224,242,254,0.36)),
      repeating-linear-gradient(90deg, rgba(96,165,250,0.18) 0 72px, rgba(45,212,191,0.16) 72px 144px, rgba(244,114,182,0.12) 144px 216px);
  }

  [data-storybook-preview-mode="liquid"] .liquid-control-group-story .liquid-glass-control-group {
    background:
      linear-gradient(135deg, rgba(255,255,255,0.5), rgba(255,255,255,0.26)),
      linear-gradient(90deg, rgba(96,165,250,0.14), rgba(45,212,191,0.12), rgba(244,114,182,0.08)) !important;
  }

  [data-storybook-preview-mode="high-contrast"] .liquid-control-group-story {
    --control-story-ink: #fff;
    --control-story-muted: #fff;
    --control-story-panel: #000;
    --control-story-border: #fff;
    --control-story-active: #000;
    --control-story-active-strong: #000;
  }

  [data-storybook-preview-mode="high-contrast"] .liquid-control-group-panel {
    background: #000;
    box-shadow: none;
  }

  [data-storybook-preview-mode="high-contrast"] .liquid-control-group-story .liquid-glass-material,
  [data-storybook-preview-mode="high-contrast"] .liquid-control-group-button {
    border: 2px solid #fff !important;
    background: #000 !important;
    box-shadow: none !important;
    color: #fff !important;
  }
`,r={render:()=>o.jsxs("div",{className:"liquid-control-group-story",children:[o.jsx("style",{children:n}),o.jsxs("div",{className:"liquid-control-group-panel",children:[o.jsxs("div",{children:[o.jsx("h2",{style:{margin:0,fontSize:22},children:"Formatting controls"}),o.jsx("p",{style:{margin:"6px 0 0"},children:"Multiple density groups stay readable without overlapping or browser-native chrome."})]}),o.jsxs("div",{className:"liquid-control-group-row",children:[o.jsxs(e,{selectionMode:"multiple",children:[o.jsx("button",{type:"button",className:"liquid-control-group-button is-active",style:{...t,fontWeight:700},"aria-pressed":"true",children:"B"}),o.jsx("button",{type:"button",className:"liquid-control-group-button",style:{...t,fontStyle:"italic"},"aria-pressed":"false",children:"I"}),o.jsx("button",{type:"button",className:"liquid-control-group-button",style:{...t,textDecoration:"underline"},"aria-pressed":"false",children:"U"})]}),o.jsxs(e,{selectionMode:"single",materialVariant:"clear",children:[o.jsx("button",{type:"button",className:"liquid-control-group-button is-alternate",style:t,"aria-pressed":"true",children:"Left"}),o.jsx("button",{type:"button",className:"liquid-control-group-button",style:t,"aria-pressed":"false",children:"Center"}),o.jsx("button",{type:"button",className:"liquid-control-group-button",style:t,"aria-pressed":"false",children:"Right"})]})]})]})]})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  render: () => <div className="liquid-control-group-story">
      <style>{controlGroupStoryCss}</style>
      <div className="liquid-control-group-panel">
        <div>
          <h2 style={{
          margin: 0,
          fontSize: 22
        }}>Formatting controls</h2>
          <p style={{
          margin: "6px 0 0"
        }}>
            Multiple density groups stay readable without overlapping or browser-native chrome.
          </p>
        </div>
        <div className="liquid-control-group-row">
          <LiquidGlassControlGroup selectionMode="multiple">
            <button type="button" className="liquid-control-group-button is-active" style={{
            ...textButtonStyle,
            fontWeight: 700
          }} aria-pressed="true">B</button>
            <button type="button" className="liquid-control-group-button" style={{
            ...textButtonStyle,
            fontStyle: "italic"
          }} aria-pressed="false">I</button>
            <button type="button" className="liquid-control-group-button" style={{
            ...textButtonStyle,
            textDecoration: "underline"
          }} aria-pressed="false">U</button>
          </LiquidGlassControlGroup>
          <LiquidGlassControlGroup selectionMode="single" materialVariant="clear">
            <button type="button" className="liquid-control-group-button is-alternate" style={textButtonStyle} aria-pressed="true">Left</button>
            <button type="button" className="liquid-control-group-button" style={textButtonStyle} aria-pressed="false">Center</button>
            <button type="button" className="liquid-control-group-button" style={textButtonStyle} aria-pressed="false">Right</button>
          </LiquidGlassControlGroup>
        </div>
      </div>
    </div>
}`,...r.parameters?.docs?.source}}};const u=["ToolbarGroup"];export{r as ToolbarGroup,u as __namedExportsOrder,p as default};
