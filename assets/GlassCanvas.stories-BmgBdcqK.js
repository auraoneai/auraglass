import{j as a}from"./iframe-DFMMcocb.js";import{G as e}from"./GlassCanvas-I8bIPd8E.js";import{D as n}from"./GlassDragDropProvider-BFqeCA27.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassCore-ClJjsDJc.js";const p={title:"Workflows/Glass Canvas",component:e,parameters:{layout:"centered",previewSurface:"app",docs:{description:{component:"The real GlassCanvas mounted inside its drag-and-drop provider at a bounded, responsive editing size."}}}},s={render:()=>a.jsx("div",{style:{width:"min(920px, calc(100vw - 32px))",height:"min(620px, calc(100vh - 32px))",minWidth:0,minHeight:360,display:"flex",overflow:"hidden"},children:a.jsx(n,{style:{width:"100%",minWidth:0},children:a.jsx(e,{"data-testid":"glass-canvas-story"})})})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    width: "min(920px, calc(100vw - 32px))",
    height: "min(620px, calc(100vh - 32px))",
    minWidth: 0,
    minHeight: 360,
    display: "flex",
    overflow: "hidden"
  }}>
      <GlassDragDropProvider style={{
      width: "100%",
      minWidth: 0
    }}>
        <GlassCanvasComponent data-testid="glass-canvas-story" />
      </GlassDragDropProvider>
    </div>
}`,...s.parameters?.docs?.source}}};const l=["GlassCanvas"];export{s as GlassCanvas,l as __namedExportsOrder,p as default};
