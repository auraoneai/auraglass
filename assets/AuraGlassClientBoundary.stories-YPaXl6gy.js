import{r as n,n as i,j as e}from"./iframe-RsoZoStf.js";import{O as c}from"./OptimizedGlassCore-IzbAukgr.js";import"./preload-helper-PPVm8Dsz.js";import"./deviceCapabilities-CB0YcTGX.js";const s=({children:t,fallback:l=null})=>{const[r,o]=n.useState(()=>i());return n.useEffect(()=>{r||o(!0)},[r]),r?e.jsx(e.Fragment,{children:t}):e.jsx(e.Fragment,{children:l})};try{s.displayName="AuraGlassClientBoundary",s.__docgenInfo={description:"",displayName:"AuraGlassClientBoundary",props:{fallback:{defaultValue:{value:"null"},description:"",name:"fallback",required:!1,type:{name:"ReactNode"}}}}}catch{}const y={title:"Foundations/SSR/AuraGlass Client Boundary",component:s,parameters:{layout:"centered",docs:{description:{component:"Direct client-boundary coverage. The mounted Storybook preview proves that the client child replaces the server fallback after hydration."}}}},a={args:{children:null},render:()=>e.jsx(s,{fallback:e.jsx("p",{children:"Preparing client surface…"}),children:e.jsxs(c,{as:"section",elevation:"level2","aria-label":"Client boundary content",className:"glass-p-6",style:{width:"min(32rem, calc(100vw - 32px))",maxWidth:"100%",display:"grid",gap:8},children:[e.jsx("p",{className:"glass-text-sm glass-text-secondary",children:"Client boundary"}),e.jsx("h2",{className:"glass-text-xl glass-font-semibold glass-text-primary",children:"Hydrated glass content"}),e.jsx("p",{className:"glass-text-secondary",children:"Browser-only children are mounted and ready for interaction."})]})})};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    children: null
  },
  render: () => <AuraGlassClientBoundary fallback={<p>Preparing client surface…</p>}>
      <OptimizedGlassCore as="section" elevation="level2" aria-label="Client boundary content" className="glass-p-6" style={{
      width: "min(32rem, calc(100vw - 32px))",
      maxWidth: "100%",
      display: "grid",
      gap: 8
    }}>
        <p className="glass-text-sm glass-text-secondary">Client boundary</p>
        <h2 className="glass-text-xl glass-font-semibold glass-text-primary">
          Hydrated glass content
        </h2>
        <p className="glass-text-secondary">
          Browser-only children are mounted and ready for interaction.
        </p>
      </OptimizedGlassCore>
    </AuraGlassClientBoundary>
}`,...a.parameters?.docs?.source}}};const g=["Default"];export{a as Default,g as __namedExportsOrder,y as default};
