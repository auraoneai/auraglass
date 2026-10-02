import{j as s}from"./iframe-DFMMcocb.js";import{G as a}from"./GlassCollaborativeCursor-sbjDzcN2.js";import{G as o}from"./GlassCollaborationProvider-BAd6FzKE.js";import{O as r}from"./OptimizedGlassCore-1D6AE-uZ.js";import"./preload-helper-PPVm8Dsz.js";import"./deviceCapabilities-iDxBLJQX.js";const d={title:"Workflows/Glass Collaborative Cursor",component:a,parameters:{layout:"centered",docs:{description:{component:"Component-owned Storybook coverage for GlassCollaborativeCursor."}}}},l=[{id:"preview-reviewer",name:"Maya",email:"maya@example.com",color:"#14b8a6",cursor:{x:96,y:42},lastActive:Date.now()},{id:"preview-designer",name:"Jon",email:"jon@example.com",color:"#6366f1",cursor:{x:220,y:86},lastActive:Date.now()}],e={render:()=>s.jsx(r,{className:"glass-relative glass-w-96 glass-max-w-full glass-radius-lg glass-p-2",style:{minHeight:160},children:s.jsx(o,{roomId:"storybook-owned-cursor",enableRealTime:!1,children:s.jsx(a,{className:"glass-absolute glass-inset-0",previewUsers:l})})})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  render: () => <OptimizedGlass className="glass-relative glass-w-96 glass-max-w-full glass-radius-lg glass-p-2" style={{
    minHeight: 160
  }}>
      <Provider roomId="storybook-owned-cursor" enableRealTime={false}>
        <Component className="glass-absolute glass-inset-0" previewUsers={previewUsers} />
      </Provider>
    </OptimizedGlass>
}`,...e.parameters?.docs?.source}}};const g=["Default"];export{e as Default,g as __namedExportsOrder,d as default};
