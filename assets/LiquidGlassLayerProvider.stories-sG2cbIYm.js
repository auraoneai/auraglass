import{j as e}from"./iframe-Ba4C8OEc.js";import{L as a}from"./LiquidGlassLayerProvider--9uHHbrP.js";import{L as n}from"./LiquidGlassMaterial-iSHTie31.js";import"./preload-helper-PPVm8Dsz.js";const t={title:"Foundations/Liquid Glass Primitives/Liquid Glass Layer Provider",component:a,parameters:{layout:"fullscreen",previewSurface:"app"}},r={render:()=>e.jsxs("div",{style:{minHeight:"100vh",display:"grid",placeItems:"center",padding:32},children:[e.jsx("style",{children:`
        .liquid-layer-provider-story,
        .liquid-layer-provider-story * {
          color: #0f172a !important;
        }
      `}),e.jsx(a,{performanceLevel:"efficient",children:e.jsxs(n,{material:"liquid",radius:"2xl",className:"glass-p-6 liquid-layer-provider-story",style:{width:"min(680px, 100%)",minHeight:280,display:"grid",alignContent:"center",gap:18,color:"#0f172a"},children:[e.jsxs("div",{children:[e.jsx("strong",{style:{display:"block",marginBottom:8,fontSize:22},children:"Efficient layer policy"}),e.jsx("span",{style:{color:"#475569"},children:"The provider keeps nested Liquid Glass effects on a conservative rendering path for dense dashboards."})]}),e.jsx("div",{style:{display:"flex",flexWrap:"wrap",gap:12},children:["Shared backdrop","Reduced motion","Stable blur"].map(i=>e.jsx("span",{style:{borderRadius:999,padding:"8px 12px",background:"rgba(255,255,255,.82)",color:"#0f172a"},children:i},i))})]})})]})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    padding: 32
  }}>
      <style>{\`
        .liquid-layer-provider-story,
        .liquid-layer-provider-story * {
          color: #0f172a !important;
        }
      \`}</style>
      <LiquidGlassLayerProvider performanceLevel="efficient">
        <LiquidGlassMaterial material="liquid" radius="2xl" className="glass-p-6 liquid-layer-provider-story" style={{
        width: "min(680px, 100%)",
        minHeight: 280,
        display: "grid",
        alignContent: "center",
        gap: 18,
        color: "#0f172a"
      }}>
          <div>
            <strong style={{
            display: "block",
            marginBottom: 8,
            fontSize: 22
          }}>Efficient layer policy</strong>
            <span style={{
            color: "#475569"
          }}>The provider keeps nested Liquid Glass effects on a conservative rendering path for dense dashboards.</span>
          </div>
          <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 12
        }}>
            {["Shared backdrop", "Reduced motion", "Stable blur"].map(label => <span key={label} style={{
            borderRadius: 999,
            padding: "8px 12px",
            background: "rgba(255,255,255,.82)",
            color: "#0f172a"
          }}>
                {label}
              </span>)}
          </div>
        </LiquidGlassMaterial>
      </LiquidGlassLayerProvider>
    </div>
}`,...r.parameters?.docs?.source}}};const p=["EfficientPolicy"];export{r as EfficientPolicy,p as __namedExportsOrder,t as default};
