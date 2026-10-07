import{j as o}from"./iframe-RsoZoStf.js";import{C as e,G as s}from"./GlassCollaborationProvider-B6BjFtbx.js";import{G as i}from"./GlassCollaborationDashboard-14onWred.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassCore-CUjrQ4HR.js";const b={title:"Workflows/Glass Collaboration Provider",component:e,parameters:{layout:"centered",previewSurface:"app",docs:{description:{component:"Both public provider exports mounted with a real collaboration-dashboard consumer. Network transport is disabled for deterministic Storybook rendering."}}}},l=()=>o.jsx("div",{style:{width:"min(360px, calc(100vw - 32px))",minWidth:0,minHeight:136,display:"grid",placeItems:"center"},children:o.jsx(i,{})}),r={args:{children:null,roomId:"storybook-collaboration-room"},render:()=>o.jsx(e,{roomId:"storybook-collaboration-room",enableRealTime:!1,"data-testid":"collaboration-provider-story",children:o.jsx(l,{})})},a={args:{children:null,roomId:"storybook-glass-collaboration-room"},render:()=>o.jsx(s,{roomId:"storybook-glass-collaboration-room",enableRealTime:!1,"data-testid":"glass-collaboration-provider-story",children:o.jsx(l,{})})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    children: null,
    roomId: "storybook-collaboration-room"
  },
  render: () => <GlassCollaborationProviderModule.CollaborationProvider roomId="storybook-collaboration-room" enableRealTime={false} data-testid="collaboration-provider-story">
      <ProviderChild />
    </GlassCollaborationProviderModule.CollaborationProvider>
}`,...r.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    children: null,
    roomId: "storybook-glass-collaboration-room"
  },
  render: () => <GlassCollaborationProviderModule.GlassCollaborationProvider roomId="storybook-glass-collaboration-room" enableRealTime={false} data-testid="glass-collaboration-provider-story">
      <ProviderChild />
    </GlassCollaborationProviderModule.GlassCollaborationProvider>
}`,...a.parameters?.docs?.source}}};const p=["CollaborationProvider","GlassCollaborationProvider"];export{r as CollaborationProvider,a as GlassCollaborationProvider,p as __namedExportsOrder,b as default};
