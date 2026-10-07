import{j as r}from"./iframe-Cqi-9gHA.js";import{G as t}from"./GlassPageStructure-iRh7t-VZ.js";import{D as a}from"./GlassDragDropProvider-B5rV4ZPW.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassCore-BlpRxUNK.js";const c={title:"Workflows/Glass Page Structure",component:t,parameters:{layout:"centered",previewSurface:"app",docs:{description:{component:"The real page-structure navigator mounted against a live drag-and-drop context."}}}},e={render:()=>r.jsx("div",{style:{width:"min(352px, calc(100vw - 32px))",height:"min(620px, calc(100vh - 32px))",minWidth:0,minHeight:420,overflow:"hidden"},children:r.jsx(a,{style:{width:"100%",height:"100%"},children:r.jsx(t,{className:"glass-max-w-full","data-testid":"glass-page-structure-story"})})})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
        <GlassPageStructureComponent className="glass-max-w-full" data-testid="glass-page-structure-story" />
      </GlassDragDropProvider>
    </div>
}`,...e.parameters?.docs?.source}}};const l=["GlassPageStructure"];export{e as GlassPageStructure,l as __namedExportsOrder,c as default};
