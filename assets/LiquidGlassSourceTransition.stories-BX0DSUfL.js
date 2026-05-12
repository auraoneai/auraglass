import{r,b as G,j as a,R as h,c as q}from"./iframe-LAGStZOr.js";import"./preload-helper-PPVm8Dsz.js";const b=r.createContext(null);function v({children:n,disabled:l=!1}){const[o,p]=r.useState(null),d=r.useRef(new Map),u=r.useRef(new Map),i=G(),t=r.useCallback((e,s)=>{s?d.current.set(e,s):d.current.delete(e)},[]),g=r.useCallback((e,s)=>{s?u.current.set(e,s):u.current.delete(e)},[]),c=r.useMemo(()=>({activeId:o,registerSource:t,registerDestination:g,start:e=>!l&&p(e),end:()=>p(null),getSource:e=>d.current.get(e)?.getBoundingClientRect()??null,getDestination:e=>u.current.get(e)?.getBoundingClientRect()??null,reducedMotion:i||l}),[o,l,i,g,t]);return a.jsx(b.Provider,{value:c,children:n})}const f=r.forwardRef(({id:n,asChild:l=!1,children:o,className:p,onClick:d,...u},i)=>{const t=S(),g=r.useRef(null),c=r.useCallback(s=>{g.current=s,t?.registerSource(n,s),typeof i=="function"?i(s):i&&(i.current=s)},[t,n,i]),e=s=>{t?.start(n),d?.(s)};return l&&h.isValidElement(o)?h.cloneElement(o,{ref:c,onClick:e,"data-liquid-glass-transition-source":n}):a.jsx("div",{ref:c,className:q("liquid-glass-transition-source",p),onClick:e,"data-liquid-glass-transition-source":n,...u,children:o})});f.displayName="LiquidGlassSource";const y=r.forwardRef(({id:n,open:l=!0,children:o,className:p,style:d,...u},i)=>{const t=S(),g=r.useCallback(x=>{t?.registerDestination(n,x),typeof i=="function"?i(x):i&&(i.current=x)},[t,n,i]),c=t?.activeId===n,e=t?.getSource(n),s=e?`${e.left+e.width/2}px ${e.top+e.height/2}px`:void 0;return l?a.jsx("div",{ref:g,className:q("liquid-glass-transition-destination",c&&"liquid-glass-transition-active",t?.reducedMotion&&"liquid-glass-transition-reduced-motion",p),style:{transformOrigin:s,transition:t?.reducedMotion?"opacity 1ms linear":"transform var(--liquid-glass-source-transition-duration, 220ms) var(--liquid-glass-source-transition-easing, cubic-bezier(.2,.8,.2,1)), opacity 160ms ease",...d},"data-liquid-glass-transition-destination":n,"data-liquid-glass-transition-active":c?"true":"false",...u,children:o}):null});y.displayName="LiquidGlassDestination";function S(){return r.useContext(b)}try{f.displayName="LiquidGlassSource",f.__docgenInfo={description:"",displayName:"LiquidGlassSource",props:{namespace:{defaultValue:null,description:"",name:"namespace",required:!1,type:{name:"string | undefined"}},disabled:{defaultValue:{value:"false"},description:"",name:"disabled",required:!1,type:{name:"boolean | undefined"}},duration:{defaultValue:null,description:"",name:"duration",required:!1,type:{name:"number | undefined"}}}}}catch{}try{y.displayName="LiquidGlassDestination",y.__docgenInfo={description:"",displayName:"LiquidGlassDestination",props:{id:{defaultValue:null,description:"",name:"id",required:!0,type:{name:"string"}},open:{defaultValue:{value:"true"},description:"",name:"open",required:!1,type:{name:"boolean | undefined"}}}}}catch{}const C={title:"Foundations/Liquid Glass Primitives/Liquid Glass Source Transition",component:v,parameters:{layout:"fullscreen",previewSurface:"app"}},m={render:()=>a.jsxs("div",{style:{minHeight:"100vh",display:"grid",placeItems:"center",padding:32,boxSizing:"border-box"},children:[a.jsx("style",{children:`
        .liquid-source-transition-story,
        .liquid-source-transition-story * {
          color: #0f172a !important;
        }
      `}),a.jsx(v,{children:a.jsxs("div",{className:"liquid-source-transition-story",style:{width:"min(820px, 100%)",display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(min(100%, 240px), 1fr))",gap:20,borderRadius:30,padding:28,background:"radial-gradient(circle at 18% 20%, rgba(96,165,250,.30), transparent 28%), radial-gradient(circle at 82% 72%, rgba(45,212,191,.24), transparent 30%), rgba(255,255,255,0.78)",boxShadow:"0 24px 80px rgba(15,23,42,.14)",color:"#0f172a"},children:[a.jsxs(f,{id:"demo",className:"glass-p-4 glass-surface-subtle",style:{minHeight:180,borderRadius:24,display:"grid",alignContent:"end"},children:[a.jsx("strong",{children:"Source thumbnail"}),a.jsx("span",{style:{color:"#475569",fontSize:12},children:"Compact origin surface"})]}),a.jsxs(y,{id:"demo",className:"glass-p-5 glass-surface-default",style:{minHeight:220,borderRadius:24,display:"grid",alignContent:"center",gap:8},children:[a.jsx("strong",{style:{fontSize:20},children:"Expanded Liquid Glass destination"}),a.jsx("span",{style:{color:"#475569"},children:"Source and destination are shown together so the morph relationship is visible without relying on a tiny text-only sample."})]})]})})]})};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    padding: 32,
    boxSizing: "border-box"
  }}>
      <style>{\`
        .liquid-source-transition-story,
        .liquid-source-transition-story * {
          color: #0f172a !important;
        }
      \`}</style>
      <LiquidGlassTransitionProvider>
        <div className="liquid-source-transition-story" style={{
        width: "min(820px, 100%)",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))",
        gap: 20,
        borderRadius: 30,
        padding: 28,
        background: "radial-gradient(circle at 18% 20%, rgba(96,165,250,.30), transparent 28%), radial-gradient(circle at 82% 72%, rgba(45,212,191,.24), transparent 30%), rgba(255,255,255,0.78)",
        boxShadow: "0 24px 80px rgba(15,23,42,.14)",
        color: "#0f172a"
      }}>
          <LiquidGlassSource id="demo" className="glass-p-4 glass-surface-subtle" style={{
          minHeight: 180,
          borderRadius: 24,
          display: "grid",
          alignContent: "end"
        }}>
            <strong>Source thumbnail</strong>
            <span style={{
            color: "#475569",
            fontSize: 12
          }}>Compact origin surface</span>
          </LiquidGlassSource>
          <LiquidGlassDestination id="demo" className="glass-p-5 glass-surface-default" style={{
          minHeight: 220,
          borderRadius: 24,
          display: "grid",
          alignContent: "center",
          gap: 8
        }}>
            <strong style={{
            fontSize: 20
          }}>Expanded Liquid Glass destination</strong>
            <span style={{
            color: "#475569"
          }}>
              Source and destination are shown together so the morph relationship is
              visible without relying on a tiny text-only sample.
            </span>
          </LiquidGlassDestination>
        </div>
      </LiquidGlassTransitionProvider>
    </div>
}`,...m.parameters?.docs?.source}}};const _=["SourceToSheet"];export{m as SourceToSheet,_ as __namedExportsOrder,C as default};
