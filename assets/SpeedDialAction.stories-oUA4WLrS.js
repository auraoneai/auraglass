import{j as s}from"./iframe-DuFCckax.js";import{f as l,a6 as n,bC as d}from"./components-C7UdsWPt.js";import{S as r}from"./SpeedDialAction-fUXsmgyz.js";import"./preload-helper-PPVm8Dsz.js";const u={title:"Controls/Buttons/Speed Dial Action",component:r,parameters:{layout:"centered",previewSurface:"component",docs:{description:{component:"A single speed-dial action with glass styling, tooltip text, and keyboard focus."}}},args:{open:!0,glass:!0,showTooltip:!0,direction:"up",size:"medium",tooltipTitle:"Share",icon:s.jsx(l,{size:18,"aria-hidden":"true"})}},e={render:i=>s.jsx("div",{className:"glass-relative glass-radius-2xl glass-border glass-border-subtle glass-surface-overlay glass-p-8",style:{width:"min(360px, calc(100vw - 64px))",minHeight:180},children:s.jsx(r,{...i})})},a={render:i=>s.jsx("div",{className:"glass-grid glass-grid-cols-3 glass-gap-4 glass-radius-2xl glass-border glass-border-subtle glass-surface-overlay glass-p-8",style:{width:"min(640px, calc(100vw - 64px))",minHeight:180},children:[{icon:s.jsx(l,{size:18,"aria-hidden":"true"}),tooltipTitle:"Share"},{icon:s.jsx(n,{size:18,"aria-hidden":"true"}),tooltipTitle:"Export"},{icon:s.jsx(d,{size:18,"aria-hidden":"true"}),tooltipTitle:"Comment"}].map((t,o)=>s.jsx("div",{className:"glass-relative glass-h-24",children:s.jsx(r,{...i,...t,index:o,totalActions:3})},t.tooltipTitle))})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
}`,...a.parameters?.docs?.source}}};const x=["Default","Variants"];export{e as Default,a as Variants,x as __namedExportsOrder,u as default};
