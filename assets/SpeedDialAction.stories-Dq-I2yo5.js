import{j as s}from"./iframe-C1j_9pGm.js";import{S as r}from"./SpeedDialAction-ufDT_O-J.js";import{S as o}from"./share-2-BAtw2VYK.js";import{D as n}from"./download-C4s8TDmc.js";import{M as d}from"./message-square-D_8iJF5r.js";import"./preload-helper-PPVm8Dsz.js";import"./createLucideIcon-BFlZd7Ja.js";const v={title:"Controls/Buttons/Speed Dial Action",component:r,parameters:{layout:"centered",previewSurface:"component",docs:{description:{component:"A single speed-dial action with glass styling, tooltip text, and keyboard focus."}}},args:{open:!0,glass:!0,showTooltip:!0,direction:"up",size:"medium",tooltipTitle:"Share",icon:s.jsx(o,{size:18,"aria-hidden":"true"})}},e={render:i=>s.jsx("div",{className:"glass-relative glass-radius-2xl glass-border glass-border-subtle glass-surface-overlay glass-p-8",style:{width:"min(360px, calc(100vw - 64px))",minHeight:180},children:s.jsx(r,{...i})})},a={render:i=>s.jsx("div",{className:"glass-grid glass-grid-cols-3 glass-gap-4 glass-radius-2xl glass-border glass-border-subtle glass-surface-overlay glass-p-8",style:{width:"min(640px, calc(100vw - 64px))",minHeight:180},children:[{icon:s.jsx(o,{size:18,"aria-hidden":"true"}),tooltipTitle:"Share"},{icon:s.jsx(n,{size:18,"aria-hidden":"true"}),tooltipTitle:"Export"},{icon:s.jsx(d,{size:18,"aria-hidden":"true"}),tooltipTitle:"Comment"}].map((t,l)=>s.jsx("div",{className:"glass-relative glass-h-24",children:s.jsx(r,{...i,...t,index:l,totalActions:3})},t.tooltipTitle))})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-relative glass-radius-2xl glass-border glass-border-subtle glass-surface-overlay glass-p-8" style={{
    width: "min(360px, calc(100vw - 64px))",
    minHeight: 180
  }}>
      <SpeedDialAction {...args} />
    </div>
}`,...e.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-grid glass-grid-cols-3 glass-gap-4 glass-radius-2xl glass-border glass-border-subtle glass-surface-overlay glass-p-8" style={{
    width: "min(640px, calc(100vw - 64px))",
    minHeight: 180
  }}>
      {[{
      icon: <Share2 size={18} aria-hidden="true" />,
      tooltipTitle: "Share"
    }, {
      icon: <Download size={18} aria-hidden="true" />,
      tooltipTitle: "Export"
    }, {
      icon: <MessageSquare size={18} aria-hidden="true" />,
      tooltipTitle: "Comment"
    }].map((action, index) => <div key={action.tooltipTitle} className="glass-relative glass-h-24">
          <SpeedDialAction {...args} {...action} index={index} totalActions={3} />
        </div>)}
    </div>
}`,...a.parameters?.docs?.source}}};const S=["Default","Variants"];export{e as Default,a as Variants,S as __namedExportsOrder,v as default};
