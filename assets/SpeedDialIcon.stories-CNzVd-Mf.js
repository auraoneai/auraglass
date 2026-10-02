import{j as s}from"./iframe-DFMMcocb.js";import{a0 as n,a_ as t}from"./components-Ue9Uo88O.js";import{S as r}from"./SpeedDialIcon-BoGMZsgs.js";import"./preload-helper-PPVm8Dsz.js";const c={title:"Controls/Buttons/Speed Dial Icon",component:r,parameters:{layout:"centered",previewSurface:"component",docs:{description:{component:"The speed-dial icon transition between closed and open action states."}}},args:{icon:s.jsx(t,{size:24,"aria-hidden":"true"}),openIcon:s.jsx(n,{size:24,"aria-hidden":"true"}),open:!1}},a={render:e=>s.jsxs("div",{className:"glass-neutral-level1 glass-rounded-3xl glass-p-6 glass-border glass-border-subtle",style:{color:"rgba(20,25,32,.92)",minWidth:220},children:[s.jsx("p",{className:"glass-text-sm glass-font-semibold glass-mb-3",children:"Closed state"}),s.jsx("div",{className:"glass-inline-flex glass-h-14 glass-w-14 glass-items-center glass-justify-center glass-radius-full glass-surface-overlay glass-text-primary glass-border glass-border-subtle",style:{color:"rgba(20,25,32,.92)",boxShadow:"0 10px 28px rgba(20,25,32,.14)"},children:s.jsx(r,{...e})})]})},l={render:e=>s.jsxs("div",{className:"glass-flex glass-flex-wrap glass-gap-4",children:[s.jsx("div",{className:"glass-inline-flex glass-h-14 glass-w-14 glass-items-center glass-justify-center glass-radius-full glass-surface-blue glass-text-primary",children:s.jsx(r,{...e,open:!1})}),s.jsx("div",{className:"glass-inline-flex glass-h-14 glass-w-14 glass-items-center glass-justify-center glass-radius-full glass-surface-overlay glass-text-primary",children:s.jsx(r,{...e,open:!0})})]})};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-neutral-level1 glass-rounded-3xl glass-p-6 glass-border glass-border-subtle" style={{
    color: "rgba(20,25,32,.92)",
    minWidth: 220
  }}>
      <p className="glass-text-sm glass-font-semibold glass-mb-3">
        Closed state
      </p>
      <div className="glass-inline-flex glass-h-14 glass-w-14 glass-items-center glass-justify-center glass-radius-full glass-surface-overlay glass-text-primary glass-border glass-border-subtle" style={{
      color: "rgba(20,25,32,.92)",
      boxShadow: "0 10px 28px rgba(20,25,32,.14)"
    }}>
        <SpeedDialIcon {...args} />
      </div>
    </div>
}`,...a.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-flex glass-flex-wrap glass-gap-4">
      <div className="glass-inline-flex glass-h-14 glass-w-14 glass-items-center glass-justify-center glass-radius-full glass-surface-blue glass-text-primary">
        <SpeedDialIcon {...args} open={false} />
      </div>
      <div className="glass-inline-flex glass-h-14 glass-w-14 glass-items-center glass-justify-center glass-radius-full glass-surface-overlay glass-text-primary">
        <SpeedDialIcon {...args} open />
      </div>
    </div>
}`,...l.parameters?.docs?.source}}};const m=["Default","Variants"];export{a as Default,l as Variants,m as __namedExportsOrder,c as default};
