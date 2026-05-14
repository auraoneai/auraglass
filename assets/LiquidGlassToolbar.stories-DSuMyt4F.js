import{j as r}from"./iframe-Ba4C8OEc.js";import{L as a}from"./LiquidGlassToolbar-B628Xf24.js";import"./preload-helper-PPVm8Dsz.js";import"./LiquidGlassMaterial-iSHTie31.js";import"./LiquidGlassLayerProvider--9uHHbrP.js";import"./LiquidGlassScrollEdge-BP6erjbN.js";const b={title:"Navigation/Liquid Glass Toolbar",component:a,parameters:{layout:"fullscreen",previewSurface:"app"}},t=`
  .liquid-toolbar-story {
    --toolbar-story-ink: #0f172a;
    --toolbar-story-muted: #334155;
    --toolbar-story-border: rgba(15, 23, 42, 0.1);
    --toolbar-story-panel:
      linear-gradient(135deg, rgba(255,255,255,0.86), rgba(219,234,254,0.5)),
      radial-gradient(circle at 86% 16%, rgba(45,212,191,0.22), transparent 30%);
    min-height: 100vh;
    padding: clamp(18px, 4vw, 32px);
    box-sizing: border-box;
    color: var(--toolbar-story-ink);
  }

  .liquid-toolbar-story,
  .liquid-toolbar-story * {
    color: var(--toolbar-story-ink) !important;
  }

  .liquid-toolbar-story .liquid-toolbar-muted {
    color: var(--toolbar-story-muted) !important;
  }

  .liquid-toolbar-story .liquid-glass-toolbar {
    max-width: 100%;
  }

  .liquid-toolbar-story .liquid-glass-toolbar > .liquid-glass-material > div {
    flex-wrap: wrap;
    row-gap: 10px;
  }

  .liquid-toolbar-story .liquid-toolbar-content {
    min-height: 420px;
    margin-top: 24px;
    border: 1px solid var(--toolbar-story-border);
    border-radius: 28px;
    padding: 28px;
    background: var(--toolbar-story-panel);
    box-shadow: 0 24px 80px rgba(15, 23, 42, 0.14);
  }

  [data-storybook-preview-mode="dark"] .liquid-toolbar-story {
    --toolbar-story-ink: #f8fafc;
    --toolbar-story-muted: #dbeafe;
    --toolbar-story-border: rgba(226, 232, 240, 0.22);
    --toolbar-story-panel:
      linear-gradient(135deg, rgba(15,23,42,0.9), rgba(30,41,59,0.72)),
      radial-gradient(circle at 86% 16%, rgba(45,212,191,0.18), transparent 30%);
  }

  [data-storybook-preview-mode="liquid"] .liquid-toolbar-story {
    --toolbar-story-panel:
      linear-gradient(135deg, rgba(255,255,255,0.72), rgba(236,253,245,0.42)),
      radial-gradient(circle at 86% 16%, rgba(29,78,216,0.2), transparent 30%);
  }

  [data-storybook-preview-mode="high-contrast"] .liquid-toolbar-story {
    --toolbar-story-ink: #fff;
    --toolbar-story-muted: #fff;
    --toolbar-story-border: #fff;
    --toolbar-story-panel: #000;
  }
`,o={render:()=>r.jsxs("div",{className:"liquid-toolbar-story",children:[r.jsx("style",{children:t}),r.jsx(a,{floating:!0,scrollEdge:"soft",left:r.jsx("strong",{style:{minWidth:140},children:"Aura Studio"}),center:r.jsx("span",{className:"liquid-toolbar-muted",children:"Project: Liquid launch"}),groups:[{id:"tools",items:[{id:"save",label:"Save",primary:!0},{id:"share",label:"Share"}]}],right:r.jsx("span",{className:"liquid-toolbar-muted",children:"Profile"})}),r.jsx("section",{className:"liquid-toolbar-content",children:r.jsx("h2",{style:{margin:0},children:"Toolbar over app content"})})]})};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => <div className="liquid-toolbar-story">
      <style>{toolbarStoryCss}</style>
      <LiquidGlassToolbar floating scrollEdge="soft" left={<strong style={{
      minWidth: 140
    }}>Aura Studio</strong>} center={<span className="liquid-toolbar-muted">Project: Liquid launch</span>} groups={[{
      id: "tools",
      items: [{
        id: "save",
        label: "Save",
        primary: true
      }, {
        id: "share",
        label: "Share"
      }]
    }]} right={<span className="liquid-toolbar-muted">Profile</span>} />
      <section className="liquid-toolbar-content">
        <h2 style={{
        margin: 0
      }}>Toolbar over app content</h2>
      </section>
    </div>
}`,...o.parameters?.docs?.source}}};const p=["Default"];export{o as Default,p as __namedExportsOrder,b as default};
