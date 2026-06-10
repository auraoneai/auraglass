import{j as e}from"./iframe-GrkikuRp.js";import{L as a}from"./LiquidGlassScrollEdge-BPkT4anJ.js";import"./preload-helper-PPVm8Dsz.js";const o={title:"Foundations/Liquid Glass Primitives/Liquid Glass Scroll Edge",component:a,parameters:{layout:"fullscreen",previewSurface:"app"}},s={args:{edge:"top",styleMode:"soft",active:!0},render:r=>e.jsx("div",{style:{minHeight:"100vh",display:"grid",placeItems:"center",padding:32},children:e.jsxs("div",{className:"glass-relative glass-overflow-hidden glass-surface-subtle",style:{width:"min(680px, 100%)",minHeight:430,borderRadius:28,boxShadow:"0 24px 80px rgba(15,23,42,.14)"},children:[e.jsx(a,{...r}),e.jsx("div",{style:{padding:"42px 28px 28px",display:"grid",gap:12},children:["Project brief","Surface tokens","Motion settings","Contrast notes","Release checklist"].map(i=>e.jsx("div",{style:{borderRadius:16,padding:14,background:"rgba(255,255,255,0.78)",color:"#0f172a"},children:i},i))})]})})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    edge: "top",
    styleMode: "soft",
    active: true
  },
  render: args => <div style={{
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    padding: 32
  }}>
      <div className="glass-relative glass-overflow-hidden glass-surface-subtle" style={{
      width: "min(680px, 100%)",
      minHeight: 430,
      borderRadius: 28,
      boxShadow: "0 24px 80px rgba(15,23,42,.14)"
    }}>
        <LiquidGlassScrollEdge {...args} />
        <div style={{
        padding: "42px 28px 28px",
        display: "grid",
        gap: 12
      }}>
          {["Project brief", "Surface tokens", "Motion settings", "Contrast notes", "Release checklist"].map(item => <div key={item} style={{
          borderRadius: 16,
          padding: 14,
          background: "rgba(255,255,255,0.78)",
          color: "#0f172a"
        }}>{item}</div>)}
        </div>
      </div>
    </div>
}`,...s.parameters?.docs?.source}}};const l=["SoftTop"];export{s as SoftTop,l as __namedExportsOrder,o as default};
