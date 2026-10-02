import{r as l,q as c,R as f,j as e}from"./iframe-DFMMcocb.js";import"./preload-helper-PPVm8Dsz.js";const r=l.forwardRef(({children:a,onSample:d,className:t,style:o,...p},u)=>{const s=l.useRef(null);l.useImperativeHandle(u,()=>s.current);const n=c(s,p);f.useEffect(()=>{d?.(n)},[d,n]);const m=typeof a=="function"?a(n):a;return e.jsx("div",{ref:s,className:["liquid-glass-backdrop-sampler",t].filter(Boolean).join(" "),style:{color:"var(--glass-theme-text, var(--glass-text-primary))",boxShadow:"inset 0 0 8px rgba(255, 255, 255, 0.12)",...o},"data-liquid-glass-backdrop-sampler":"true","data-contrast-hint":n.contrastHint,"data-requires-dimming":n.requiresDimming?"true":"false",children:m})});r.displayName="LiquidGlassBackdropSampler";try{r.displayName="LiquidGlassBackdropSampler",r.__docgenInfo={description:"",displayName:"LiquidGlassBackdropSampler",props:{onSample:{defaultValue:null,description:"",name:"onSample",required:!1,type:{name:"((sample: LiquidGlassBackdropSample) => void) | undefined"}},enabled:{defaultValue:null,description:"",name:"enabled",required:!1,type:{name:"boolean | undefined"}},variant:{defaultValue:null,description:"",name:"variant",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"clear"'},{value:'"regular"'}]}},throttleMs:{defaultValue:null,description:"",name:"throttleMs",required:!1,type:{name:"number | undefined"}},minContrastRatio:{defaultValue:null,description:"",name:"minContrastRatio",required:!1,type:{name:"number | undefined"}},observeMutations:{defaultValue:null,description:"",name:"observeMutations",required:!1,type:{name:"boolean | undefined"}},observeResize:{defaultValue:null,description:"",name:"observeResize",required:!1,type:{name:"boolean | undefined"}}}}}catch{}const b={title:"Foundations/Liquid Glass Primitives/Liquid Glass Backdrop Sampler",component:r,parameters:{layout:"fullscreen",previewSurface:"app"}},i={render:()=>e.jsx("div",{style:{width:"min(960px, 100%)",margin:"0 auto",padding:32,display:"grid",gap:20},children:e.jsxs("div",{className:"glass-neutral-level1",style:{minHeight:320,borderRadius:28,padding:28,color:"#0f172a",boxShadow:"0 24px 80px rgba(15,23,42,0.16)"},children:[e.jsx("h2",{style:{margin:0,fontSize:22},children:"Backdrop sampling"}),e.jsx("p",{style:{maxWidth:560,margin:"8px 0 24px",color:"#475569"},children:"The sampler reads the content behind a Liquid Glass surface and exposes a stable preview payload for adaptive tinting."}),e.jsx(r,{children:a=>e.jsx("pre",{style:{margin:0,maxWidth:520,overflow:"auto",borderRadius:18,padding:16,border:"1px solid rgba(80,102,130,0.18)",background:"rgba(255,255,255,0.28)",color:"#172033",boxShadow:"inset 0 1px 0 rgba(255,255,255,0.28)",fontSize:12},children:JSON.stringify(a,null,2)})})]})})};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    width: "min(960px, 100%)",
    margin: "0 auto",
    padding: 32,
    display: "grid",
    gap: 20
  }}>
      <div className="glass-neutral-level1" style={{
      minHeight: 320,
      borderRadius: 28,
      padding: 28,
      color: "#0f172a",
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
          border: "1px solid rgba(80,102,130,0.18)",
          background: "rgba(255,255,255,0.28)",
          color: "#172033",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.28)",
          fontSize: 12
        }}>
              {JSON.stringify(sample, null, 2)}
            </pre>}
        </LiquidGlassBackdropSampler>
      </div>
    </div>
}`,...i.parameters?.docs?.source}}};const h=["Default"];export{i as Default,h as __namedExportsOrder,b as default};
