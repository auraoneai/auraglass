import{r as u,j as e,c as p}from"./iframe-BM_sOc7A.js";import{L as m}from"./LiquidGlassMaterial-8l7vVCDT.js";import"./preload-helper-PPVm8Dsz.js";import"./LiquidGlassLayerProvider-Ce5BjS5e.js";const g={sm:"glass-px-3 glass-py-1 glass-text-sm",md:"glass-px-4 glass-py-2",lg:"glass-px-5 glass-py-3",xl:"glass-px-6 glass-py-4 glass-text-lg"},a=u.forwardRef(({prominent:s=!1,materialVariant:r="regular",size:l="md",className:n,children:i,...o},d)=>e.jsx(m,{material:"liquid",variant:r,radius:"full",interactive:!0,children:e.jsx("button",{ref:d,type:"button",className:p("liquid-glass-button-style glass-inline-flex glass-items-center glass-justify-center glass-gap-2 glass-radius-full glass-bg-transparent glass-font-medium glass-outline-none",g[l],s&&"glass-text-primary",n),"data-liquid-glass-button-style":"true",...o,children:i})}));a.displayName="LiquidGlassButtonStyle";try{a.displayName="LiquidGlassButtonStyle",a.__docgenInfo={description:"",displayName:"LiquidGlassButtonStyle",props:{prominent:{defaultValue:{value:"false"},description:"",name:"prominent",required:!1,type:{name:"boolean | undefined"}},materialVariant:{defaultValue:{value:"regular"},description:"",name:"materialVariant",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"regular"'},{value:'"clear"'}]}},size:{defaultValue:{value:"md"},description:"",name:"size",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"sm"'},{value:'"md"'},{value:'"lg"'},{value:'"xl"'}]}}}}}catch{}const f={title:"Controls/Buttons/Liquid Glass Button Style",component:a,parameters:{layout:"fullscreen",previewSurface:"app"}},c={display:"flex",flexWrap:"wrap",gap:12,alignItems:"center"},t={render:()=>e.jsxs("div",{style:{minHeight:"100vh",display:"grid",placeItems:"center",padding:32},children:[e.jsx("style",{children:`
        [data-storybook-preview-mode="dark"] .liquid-glass-button-style {
          color: #0f172a !important;
          background: rgba(255, 255, 255, 0.86) !important;
          border-color: rgba(255, 255, 255, 0.3) !important;
        }
      `}),e.jsxs("div",{style:{width:"min(720px, 100%)",borderRadius:28,padding:28,background:"rgba(255,255,255,0.68)",boxShadow:"0 24px 80px rgba(15,23,42,0.14)"},children:[e.jsx("p",{style:{margin:"0 0 16px",color:"#475569"},children:"Primary Liquid Glass button treatment in a real action group."}),e.jsxs("div",{style:c,children:[e.jsx(a,{prominent:!0,size:"xl",children:"Continue"}),e.jsx(a,{size:"lg",children:"Save draft"}),e.jsx(a,{materialVariant:"clear",size:"lg",children:"Preview"})]})]})]})};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    padding: 32
  }}>
      <style>{\`
        [data-storybook-preview-mode="dark"] .liquid-glass-button-style {
          color: #0f172a !important;
          background: rgba(255, 255, 255, 0.86) !important;
          border-color: rgba(255, 255, 255, 0.3) !important;
        }
      \`}</style>
      <div style={{
      width: "min(720px, 100%)",
      borderRadius: 28,
      padding: 28,
      background: "rgba(255,255,255,0.68)",
      boxShadow: "0 24px 80px rgba(15,23,42,0.14)"
    }}>
        <p style={{
        margin: "0 0 16px",
        color: "#475569"
      }}>Primary Liquid Glass button treatment in a real action group.</p>
        <div style={actionRowStyle}>
          <LiquidGlassButtonStyle prominent size="xl">Continue</LiquidGlassButtonStyle>
          <LiquidGlassButtonStyle size="lg">Save draft</LiquidGlassButtonStyle>
          <LiquidGlassButtonStyle materialVariant="clear" size="lg">Preview</LiquidGlassButtonStyle>
        </div>
      </div>
    </div>
}`,...t.parameters?.docs?.source}}};const q=["Prominent"];export{t as Prominent,q as __namedExportsOrder,f as default};
