import{j as r}from"./iframe-DFMMcocb.js";import{G as t}from"./GlassPropertyPanel-D_4HTyhe.js";import{D as a}from"./GlassDragDropProvider-BFqeCA27.js";import"./preload-helper-PPVm8Dsz.js";import"./colorInput-DwY-dk75.js";import"./GlassCore-ClJjsDJc.js";const d={title:"Workflows/Glass Property Panel",component:t,parameters:{layout:"centered",previewSurface:"app",docs:{description:{component:"The real property inspector mounted against a live drag-and-drop context."}}}},e={render:()=>r.jsx("div",{style:{width:"min(352px, calc(100vw - 32px))",height:"min(620px, calc(100vh - 32px))",minWidth:0,minHeight:420,overflow:"hidden"},children:r.jsx(a,{style:{width:"100%",height:"100%"},children:r.jsx(t,{className:"glass-max-w-full","data-testid":"glass-property-panel-story"})})})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    width: "min(352px, calc(100vw - 32px))",
    height: "min(620px, calc(100vh - 32px))",
    minWidth: 0,
    minHeight: 420,
    overflow: "hidden"
  }}>
      <GlassDragDropProvider style={{
      width: "100%",
      height: "100%"
    }}>
        <GlassPropertyPanelComponent className="glass-max-w-full" data-testid="glass-property-panel-story" />
      </GlassDragDropProvider>
    </div>
}`,...e.parameters?.docs?.source}}};const m=["GlassPropertyPanel"];export{e as GlassPropertyPanel,m as __namedExportsOrder,d as default};
