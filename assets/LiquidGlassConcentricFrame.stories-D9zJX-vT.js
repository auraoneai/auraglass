import{r as b,R as g,c as x,j as a}from"./iframe-Cqi-9gHA.js";import"./preload-helper-PPVm8Dsz.js";const f={sm:"var(--glass-radius-sm, 6px)",md:"var(--glass-radius-md, 8px)",lg:"var(--glass-radius-lg, 12px)",xl:"var(--glass-radius-xl, 16px)","2xl":"var(--glass-radius-2xl, 24px)",full:"9999px"};function q(e="lg",s=0,n="concentric",i=12){if(n==="capsule")return"9999px";const l=typeof e=="number"?`${e}px`:f[e]??`${i}px`;return n==="fixed"||s===0?l:typeof e=="number"?`${Math.max(e-s,0)}px`:`max(calc(${l} - ${s}px), ${i}px)`}const r=b.forwardRef(({radius:e="lg",inset:s=0,shape:n="concentric",fallbackRadius:i=8,asChild:l=!1,children:t,className:c,style:o,...u},p)=>{const v=typeof e=="number"?`${e}px`:f[e]??`${i}px`,y=q(e,s,n,i),m={"--liquid-glass-parent-radius":v,"--liquid-glass-frame-inset":`${s}px`,"--liquid-glass-frame-radius":y,borderRadius:"var(--liquid-glass-frame-radius)",boxShadow:"inset 0 0 8px rgba(255, 255, 255, 0.12)",color:"var(--glass-theme-text, var(--glass-text-primary))"};return l&&g.isValidElement(t)?g.cloneElement(t,{ref:p,className:x(t.props.className,c),style:{...m,...t.props.style,...o},"data-liquid-glass-concentric-frame":n,...u}):a.jsx("div",{ref:p,className:x("liquid-glass-concentric-frame",c),style:{...m,...o},"data-liquid-glass-concentric-frame":n,...u,children:t})});r.displayName="LiquidGlassConcentricFrame";try{r.displayName="LiquidGlassConcentricFrame",r.__docgenInfo={description:"",displayName:"LiquidGlassConcentricFrame",props:{radius:{defaultValue:{value:"lg"},description:"",name:"radius",required:!1,type:{name:"LiquidGlassConcentricRadius | undefined"}},inset:{defaultValue:{value:"0"},description:"",name:"inset",required:!1,type:{name:"number | undefined"}},shape:{defaultValue:{value:"concentric"},description:"",name:"shape",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"fixed"'},{value:'"concentric"'},{value:'"capsule"'},{value:'"rounded-rect"'}]}},fallbackRadius:{defaultValue:{value:"8"},description:"",name:"fallbackRadius",required:!1,type:{name:"number | undefined"}},asChild:{defaultValue:{value:"false"},description:"",name:"asChild",required:!1,type:{name:"boolean | undefined"}}}}}catch{}const N={title:"Foundations/Liquid Glass Primitives/Liquid Glass Concentric Frame",component:r,parameters:{layout:"fullscreen",previewSurface:"app"}},d={render:()=>a.jsx("div",{style:{width:"100%",minHeight:"100vh",display:"grid",placeItems:"center",padding:32,boxSizing:"border-box"},children:a.jsx(r,{radius:"2xl",inset:10,className:"glass-p-4 glass-neutral-level1",style:{width:"min(680px, 100%)",boxShadow:"0 24px 80px rgba(15,23,42,.14)"},children:a.jsx(r,{radius:"xl",inset:6,className:"glass-p-4 glass-surface-default",children:a.jsxs("div",{style:{display:"grid",gap:8,minHeight:220,alignContent:"center",padding:24,color:"#0f172a"},children:[a.jsx("strong",{style:{fontSize:22},children:"Nested source card"}),a.jsx("span",{style:{color:"#475569"},children:"Inset rings keep the refractive edge readable around grouped content."})]})})})})};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    width: "100%",
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    padding: 32,
    boxSizing: "border-box"
  }}>
      <LiquidGlassConcentricFrame radius="2xl" inset={10} className="glass-p-4 glass-neutral-level1" style={{
      width: "min(680px, 100%)",
      boxShadow: "0 24px 80px rgba(15,23,42,.14)"
    }}>
        <LiquidGlassConcentricFrame radius="xl" inset={6} className="glass-p-4 glass-surface-default">
          <div style={{
          display: "grid",
          gap: 8,
          minHeight: 220,
          alignContent: "center",
          padding: 24,
          color: "#0f172a"
        }}>
            <strong style={{
            fontSize: 22
          }}>Nested source card</strong>
            <span style={{
            color: "#475569"
          }}>Inset rings keep the refractive edge readable around grouped content.</span>
          </div>
        </LiquidGlassConcentricFrame>
      </LiquidGlassConcentricFrame>
    </div>
}`,...d.parameters?.docs?.source}}};const G=["Nested"];export{d as Nested,G as __namedExportsOrder,N as default};
