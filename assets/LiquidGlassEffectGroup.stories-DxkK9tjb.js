import{j as r}from"./iframe-CToTmdO0.js";import{a as t,L as i}from"./LiquidGlassMaterial-BG5wKcQI.js";import"./preload-helper-PPVm8Dsz.js";import"./LiquidGlassLayerProvider-CSLyvOJZ.js";const l={title:"Foundations/Liquid Glass Primitives/Liquid Glass Effect Group",component:t,parameters:{layout:"fullscreen",previewSurface:"app"}},a={render:()=>r.jsxs("div",{style:{minHeight:"100vh",display:"grid",placeItems:"center",padding:32,boxSizing:"border-box"},children:[r.jsx("style",{children:`
        .liquid-effect-group-story,
        .liquid-effect-group-story .liquid-glass-content {
          color: #0f172a !important;
        }

        [data-storybook-preview-mode="dark"] .liquid-effect-group-story {
          background:
            radial-gradient(circle at 20% 20%, rgba(96,165,250,.22), transparent 28%),
            radial-gradient(circle at 82% 72%, rgba(45,212,191,.18), transparent 30%),
            #0f172a !important;
          border: 1px solid rgba(226,232,240,.22);
          box-shadow: 0 24px 80px rgba(0,0,0,.34) !important;
          color: #f8fafc !important;
        }

        [data-storybook-preview-mode="dark"] .liquid-effect-group-story h2 {
          color: #f8fafc !important;
        }

        [data-storybook-preview-mode="dark"] .liquid-effect-group-story p {
          color: #dbeafe !important;
        }

        [data-storybook-preview-mode="dark"] .liquid-effect-group-story .liquid-glass-content {
          color: #f8fafc !important;
        }

        @media (max-width: 480px) {
          .liquid-effect-group-story {
            padding: 22px !important;
          }
        }
      `}),r.jsxs("div",{className:"liquid-effect-group-story",style:{width:"min(680px, 100%)",display:"grid",justifyItems:"center",gap:18,borderRadius:30,padding:28,background:"radial-gradient(circle at 20% 20%, rgba(96,165,250,.30), transparent 28%), radial-gradient(circle at 82% 72%, rgba(45,212,191,.24), transparent 30%), rgba(255,255,255,0.78)",boxShadow:"0 24px 80px rgba(15,23,42,.14)",color:"#0f172a"},children:[r.jsxs("div",{style:{textAlign:"center"},children:[r.jsx("h2",{style:{margin:0,fontSize:22},children:"Grouped effects"}),r.jsx("p",{style:{margin:"6px 0 0",color:"#475569"},children:"Adjacent surfaces share the same liquid response."})]}),r.jsx(t,{className:"glass-flex glass-gap-2",style:{borderRadius:999,padding:6,flexWrap:"wrap",justifyContent:"center"},children:["Inspect","Tune","Publish"].map(e=>r.jsx(i,{material:"liquid",interactive:!0,radius:"full",className:"glass-px-4 glass-py-2",children:e},e))})]})]})};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    padding: 32,
    boxSizing: "border-box"
  }}>
      <style>{\`
        .liquid-effect-group-story,
        .liquid-effect-group-story .liquid-glass-content {
          color: #0f172a !important;
        }

        [data-storybook-preview-mode="dark"] .liquid-effect-group-story {
          background:
            radial-gradient(circle at 20% 20%, rgba(96,165,250,.22), transparent 28%),
            radial-gradient(circle at 82% 72%, rgba(45,212,191,.18), transparent 30%),
            #0f172a !important;
          border: 1px solid rgba(226,232,240,.22);
          box-shadow: 0 24px 80px rgba(0,0,0,.34) !important;
          color: #f8fafc !important;
        }

        [data-storybook-preview-mode="dark"] .liquid-effect-group-story h2 {
          color: #f8fafc !important;
        }

        [data-storybook-preview-mode="dark"] .liquid-effect-group-story p {
          color: #dbeafe !important;
        }

        [data-storybook-preview-mode="dark"] .liquid-effect-group-story .liquid-glass-content {
          color: #f8fafc !important;
        }

        @media (max-width: 480px) {
          .liquid-effect-group-story {
            padding: 22px !important;
          }
        }
      \`}</style>
      <div className="liquid-effect-group-story" style={{
      width: "min(680px, 100%)",
      display: "grid",
      justifyItems: "center",
      gap: 18,
      borderRadius: 30,
      padding: 28,
      background: "radial-gradient(circle at 20% 20%, rgba(96,165,250,.30), transparent 28%), radial-gradient(circle at 82% 72%, rgba(45,212,191,.24), transparent 30%), rgba(255,255,255,0.78)",
      boxShadow: "0 24px 80px rgba(15,23,42,.14)",
      color: "#0f172a"
    }}>
        <div style={{
        textAlign: "center"
      }}>
          <h2 style={{
          margin: 0,
          fontSize: 22
        }}>Grouped effects</h2>
          <p style={{
          margin: "6px 0 0",
          color: "#475569"
        }}>Adjacent surfaces share the same liquid response.</p>
        </div>
        <LiquidGlassEffectGroup className="glass-flex glass-gap-2" style={{
        borderRadius: 999,
        padding: 6,
        flexWrap: "wrap",
        justifyContent: "center"
      }}>
          {["Inspect", "Tune", "Publish"].map(label => <LiquidGlassMaterial key={label} material="liquid" interactive radius="full" className="glass-px-4 glass-py-2">
              {label}
            </LiquidGlassMaterial>)}
        </LiquidGlassEffectGroup>
      </div>
    </div>
}`,...a.parameters?.docs?.source}}};const p=["GroupedButtons"];export{a as GroupedButtons,p as __namedExportsOrder,l as default};
