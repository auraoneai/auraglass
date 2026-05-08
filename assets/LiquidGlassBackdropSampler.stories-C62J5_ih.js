import{r as t,v as u,R as c,j as e}from"./iframe-DyzGTO6j.js";import"./preload-helper-PPVm8Dsz.js";const n=t.forwardRef(({children:a,onSample:s,...l},o)=>{const d=t.useRef(null);t.useImperativeHandle(o,()=>d.current);const r=u(d,l);c.useEffect(()=>{s?.(r)},[s,r]);const p=typeof a=="function"?a(r):a;return e.jsx("div",{ref:d,"data-liquid-glass-backdrop-sampler":"true","data-contrast-hint":r.contrastHint,"data-requires-dimming":r.requiresDimming?"true":"false",children:p})});n.displayName="LiquidGlassBackdropSampler";try{n.displayName="LiquidGlassBackdropSampler",n.__docgenInfo={description:"",displayName:"LiquidGlassBackdropSampler",props:{onSample:{defaultValue:null,description:"",name:"onSample",required:!1,type:{name:"((sample: LiquidGlassBackdropSample) => void) | undefined"}},enabled:{defaultValue:null,description:"",name:"enabled",required:!1,type:{name:"boolean | undefined"}},variant:{defaultValue:null,description:"",name:"variant",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"regular"'},{value:'"clear"'}]}},throttleMs:{defaultValue:null,description:"",name:"throttleMs",required:!1,type:{name:"number | undefined"}},minContrastRatio:{defaultValue:null,description:"",name:"minContrastRatio",required:!1,type:{name:"number | undefined"}},observeMutations:{defaultValue:null,description:"",name:"observeMutations",required:!1,type:{name:"boolean | undefined"}},observeResize:{defaultValue:null,description:"",name:"observeResize",required:!1,type:{name:"boolean | undefined"}}}}}catch{}const f={title:"Foundations/Liquid Glass Primitives/Liquid Glass Backdrop Sampler",component:n,parameters:{layout:"fullscreen",previewSurface:"app"}},i={render:()=>e.jsx("div",{style:{width:"min(960px, 100%)",margin:"0 auto",padding:32,display:"grid",gap:20},children:e.jsxs("div",{style:{minHeight:320,borderRadius:28,padding:28,color:"#0f172a",background:"linear-gradient(135deg, rgba(255,255,255,0.82), rgba(219,234,254,0.72)), radial-gradient(circle at 20% 20%, rgba(59,130,246,0.22), transparent 28%), radial-gradient(circle at 82% 72%, rgba(20,184,166,0.22), transparent 32%)",boxShadow:"0 24px 80px rgba(15,23,42,0.16)"},children:[e.jsx("h2",{style:{margin:0,fontSize:22},children:"Backdrop sampling"}),e.jsx("p",{style:{maxWidth:560,margin:"8px 0 24px",color:"#475569"},children:"The sampler reads the content behind a Liquid Glass surface and exposes a stable preview payload for adaptive tinting."}),e.jsx(n,{children:a=>e.jsx("pre",{style:{margin:0,maxWidth:520,overflow:"auto",borderRadius:18,padding:16,background:"rgba(15,23,42,0.78)",color:"#e0f2fe",fontSize:12},children:JSON.stringify(a,null,2)})})]})})};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    width: "min(960px, 100%)",
    margin: "0 auto",
    padding: 32,
    display: "grid",
    gap: 20
  }}>
      <div style={{
      minHeight: 320,
      borderRadius: 28,
      padding: 28,
      color: "#0f172a",
      background: "linear-gradient(135deg, rgba(255,255,255,0.82), rgba(219,234,254,0.72)), radial-gradient(circle at 20% 20%, rgba(59,130,246,0.22), transparent 28%), radial-gradient(circle at 82% 72%, rgba(20,184,166,0.22), transparent 32%)",
      boxShadow: "0 24px 80px rgba(15,23,42,0.16)"
    }}>
        <h2 style={{
        margin: 0,
        fontSize: 22
      }}>Backdrop sampling</h2>
        <p style={{
        maxWidth: 560,
        margin: "8px 0 24px",
        color: "#475569"
      }}>
          The sampler reads the content behind a Liquid Glass surface and exposes a stable preview payload for adaptive tinting.
        </p>
        <LiquidGlassBackdropSampler>
          {sample => <pre style={{
          margin: 0,
          maxWidth: 520,
          overflow: "auto",
          borderRadius: 18,
          padding: 16,
          background: "rgba(15,23,42,0.78)",
          color: "#e0f2fe",
          fontSize: 12
        }}>
              {JSON.stringify(sample, null, 2)}
            </pre>}
        </LiquidGlassBackdropSampler>
      </div>
    </div>
}`,...i.parameters?.docs?.source}}};const b=["Default"];export{i as Default,b as __namedExportsOrder,f as default};
