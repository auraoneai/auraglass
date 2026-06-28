import{j as e}from"./iframe-BM_sOc7A.js";import{L as a}from"./LiquidGlassInsetSidebar-D1dmwaQ3.js";import"./preload-helper-PPVm8Dsz.js";import"./LiquidGlassMaterial-8l7vVCDT.js";import"./LiquidGlassLayerProvider-Ce5BjS5e.js";import"./LiquidGlassScrollEdge-BlOhLWdG.js";const b={title:"Navigation/Liquid Glass Inset Sidebar",component:a,parameters:{layout:"fullscreen",previewSurface:"app"}},s=`
  .liquid-inset-sidebar-story {
    --inset-story-ink: #0f172a;
    --inset-story-muted: #334155;
    --inset-story-border: rgba(15, 23, 42, 0.1);
    --inset-story-panel:
      linear-gradient(135deg, rgba(255,255,255,0.86), rgba(219,234,254,0.54)),
      radial-gradient(circle at 90% 18%, rgba(45,212,191,0.24), transparent 28%);
    min-height: 100vh;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
    gap: 24px;
    padding: clamp(18px, 4vw, 32px);
    box-sizing: border-box;
    color: var(--inset-story-ink);
  }

  .liquid-inset-sidebar-story,
  .liquid-inset-sidebar-story * {
    color: var(--inset-story-ink) !important;
  }

  .liquid-inset-sidebar-story .liquid-inset-sidebar-panel {
    min-width: 0;
    border: 1px solid var(--inset-story-border);
    border-radius: 28px;
    padding: 28px;
    background: var(--inset-story-panel);
    box-shadow: 0 24px 80px rgba(15, 23, 42, 0.14);
  }

  .liquid-inset-sidebar-story .liquid-inset-sidebar-muted {
    color: var(--inset-story-muted) !important;
  }

  [data-storybook-preview-mode="dark"] .liquid-inset-sidebar-story {
    --inset-story-ink: #f8fafc;
    --inset-story-muted: #dbeafe;
    --inset-story-border: rgba(226, 232, 240, 0.22);
    --inset-story-panel:
      linear-gradient(135deg, rgba(15,23,42,0.9), rgba(30,41,59,0.72)),
      radial-gradient(circle at 90% 18%, rgba(45,212,191,0.18), transparent 30%);
  }

  [data-storybook-preview-mode="liquid"] .liquid-inset-sidebar-story {
    --inset-story-panel:
      linear-gradient(135deg, rgba(255,255,255,0.74), rgba(236,253,245,0.44)),
      radial-gradient(circle at 88% 20%, rgba(29,78,216,0.22), transparent 28%);
  }

  [data-storybook-preview-mode="high-contrast"] .liquid-inset-sidebar-story {
    --inset-story-ink: #fff;
    --inset-story-muted: #fff;
    --inset-story-border: #fff;
    --inset-story-panel: #000;
  }
`,i={render:()=>e.jsxs("div",{className:"liquid-inset-sidebar-story",children:[e.jsx("style",{children:s}),e.jsx(a,{items:[{id:"home",label:"Home",badge:"Live"},{id:"media",label:"Media"},{id:"library",label:"Library"},{id:"settings",label:"Settings"}],selectedId:"home",style:{width:"100%",minHeight:520}}),e.jsxs("main",{className:"liquid-inset-sidebar-panel",children:[e.jsx("h2",{style:{margin:0},children:"Workspace overview"}),e.jsx("p",{className:"liquid-inset-sidebar-muted",children:"Sidebar glass is shown against adjacent app content instead of floating alone."})]})]})};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: () => <div className="liquid-inset-sidebar-story">
      <style>{insetSidebarStoryCss}</style>
      <LiquidGlassInsetSidebar items={[{
      id: "home",
      label: "Home",
      badge: "Live"
    }, {
      id: "media",
      label: "Media"
    }, {
      id: "library",
      label: "Library"
    }, {
      id: "settings",
      label: "Settings"
    }]} selectedId="home" style={{
      width: "100%",
      minHeight: 520
    }} />
      <main className="liquid-inset-sidebar-panel">
        <h2 style={{
        margin: 0
      }}>Workspace overview</h2>
        <p className="liquid-inset-sidebar-muted">Sidebar glass is shown against adjacent app content instead of floating alone.</p>
      </main>
    </div>
}`,...i.parameters?.docs?.source}}};const m=["Default"];export{i as Default,m as __namedExportsOrder,b as default};
