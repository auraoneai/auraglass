import{r as p,j as e,R as u}from"./iframe-D5XNSE8t.js";import{L as c}from"./LiquidGlassInspectorPanel-GdIyZjd-.js";import"./preload-helper-PPVm8Dsz.js";import"./LiquidGlassMaterial-PIWApLWo.js";import"./LiquidGlassLayerProvider-Cctd_86z.js";import"./LiquidGlassScrollEdge-Broz_UlU.js";const t=p.forwardRef(({metadata:n={},tags:s=[],rating:l,...i},d)=>e.jsx(c,{ref:d,title:i.title??"Photo Inspector",sections:[{id:"metadata",title:"Metadata",content:e.jsx("dl",{className:"glass-grid glass-grid-cols-2 glass-gap-2",children:Object.entries(n).map(([a,o])=>e.jsxs(u.Fragment,{children:[e.jsx("dt",{className:"glass-text-xs glass-text-secondary",children:a}),e.jsx("dd",{className:"glass-text-sm",children:o})]},a))})},{id:"tags",title:"Tags",content:e.jsx("div",{className:"glass-flex glass-flex-wrap glass-gap-1",children:s.map(a=>e.jsx("span",{className:"glass-radius-full glass-surface-subtle glass-px-2 glass-py-1 glass-text-xs",children:a},a))})},{id:"rating",title:"Rating",content:l}],...i}));t.displayName="LiquidGlassPhotoInspector";try{t.displayName="LiquidGlassPhotoInspector",t.__docgenInfo={description:"",displayName:"LiquidGlassPhotoInspector",props:{metadata:{defaultValue:{value:"{}"},description:"",name:"metadata",required:!1,type:{name:"Record<string, ReactNode> | undefined"}},tags:{defaultValue:{value:"[]"},description:"",name:"tags",required:!1,type:{name:"string[] | undefined"}},rating:{defaultValue:null,description:"",name:"rating",required:!1,type:{name:"ReactNode"}},title:{defaultValue:null,description:"",name:"title",required:!1,type:{name:"string | undefined"}},open:{defaultValue:null,description:"",name:"open",required:!0,type:{name:"boolean"}},materialVariant:{defaultValue:null,description:"",name:"materialVariant",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"clear"'},{value:'"regular"'}]}},placement:{defaultValue:null,description:"",name:"placement",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"left"'},{value:'"right"'},{value:'"bottom"'}]}},onOpenChange:{defaultValue:null,description:"",name:"onOpenChange",required:!1,type:{name:"((open: boolean) => void) | undefined"}},resizable:{defaultValue:null,description:"",name:"resizable",required:!1,type:{name:"boolean | undefined"}},selectionLabel:{defaultValue:null,description:"",name:"selectionLabel",required:!1,type:{name:"string | undefined"}}}}}catch{}const y={title:"Media/Liquid Glass Photo Inspector",component:t,parameters:{layout:"fullscreen",previewSurface:"media"}},r={render:()=>e.jsxs("div",{style:{minHeight:"100vh",display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(min(100%, 320px), 1fr))",gap:24,padding:32,boxSizing:"border-box"},children:[e.jsx("style",{children:".liquid-glass-inspector-panel button{border:0;border-radius:999px;background:rgba(255,255,255,.76);color:#0f172a;cursor:pointer;font:inherit;padding:4px 10px}"}),e.jsx("div",{style:{borderRadius:30,minHeight:520,background:"radial-gradient(circle at 32% 28%, #bfdbfe, transparent 24%), radial-gradient(circle at 72% 64%, #5eead4, transparent 28%), linear-gradient(135deg, #020617, #1d4ed8 48%, #0f766e)",boxShadow:"0 28px 90px rgba(2,6,23,0.34)"}}),e.jsx(t,{open:!0,title:"Photo Inspector",selectionLabel:"Campaign hero - selected",metadata:{Camera:"AuraCam Pro",Lens:"35mm",Exposure:"1/250",Color:"Display P3"},tags:["portrait","review","hero"],rating:e.jsx("span",{style:{color:"#0f172a"},children:"Approved"}),materialVariant:"clear",style:{width:"100%",minHeight:520}})]})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    minHeight: "100vh",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
    gap: 24,
    padding: 32,
    boxSizing: "border-box"
  }}>
      <style>{\`.liquid-glass-inspector-panel button{border:0;border-radius:999px;background:rgba(255,255,255,.76);color:#0f172a;cursor:pointer;font:inherit;padding:4px 10px}\`}</style>
      <div style={{
      borderRadius: 30,
      minHeight: 520,
      background: "radial-gradient(circle at 32% 28%, #bfdbfe, transparent 24%), radial-gradient(circle at 72% 64%, #5eead4, transparent 28%), linear-gradient(135deg, #020617, #1d4ed8 48%, #0f766e)",
      boxShadow: "0 28px 90px rgba(2,6,23,0.34)"
    }} />
      <LiquidGlassPhotoInspector open title="Photo Inspector" selectionLabel="Campaign hero - selected" metadata={{
      Camera: "AuraCam Pro",
      Lens: "35mm",
      Exposure: "1/250",
      Color: "Display P3"
    }} tags={["portrait", "review", "hero"]} rating={<span style={{
      color: "#0f172a"
    }}>Approved</span>} materialVariant="clear" style={{
      width: "100%",
      minHeight: 520
    }} />
    </div>
}`,...r.parameters?.docs?.source}}};const v=["Default"];export{r as Default,v as __namedExportsOrder,y as default};
