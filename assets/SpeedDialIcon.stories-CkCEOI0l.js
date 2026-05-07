import{j as s}from"./iframe-B2YkWo0R.js";import{S as r}from"./SpeedDialIcon-BH7iv60H.js";import{M as n}from"./minus-Ubbw3lI4.js";import{P as i}from"./plus-C-7ZKARZ.js";import"./preload-helper-PPVm8Dsz.js";import"./createLucideIcon-DR1KmGc4.js";const u={title:"Controls/Buttons/Speed Dial Icon",component:r,parameters:{layout:"centered",previewSurface:"component",docs:{description:{component:"The speed-dial icon transition between closed and open action states."}}},args:{icon:s.jsx(i,{size:24,"aria-hidden":"true"}),openIcon:s.jsx(n,{size:24,"aria-hidden":"true"}),open:!1}},a={render:e=>s.jsx("div",{className:"glass-inline-flex glass-h-14 glass-w-14 glass-items-center glass-justify-center glass-radius-full glass-surface-blue glass-text-primary",children:s.jsx(r,{...e})})},l={render:e=>s.jsxs("div",{className:"glass-flex glass-flex-wrap glass-gap-4",children:[s.jsx("div",{className:"glass-inline-flex glass-h-14 glass-w-14 glass-items-center glass-justify-center glass-radius-full glass-surface-blue glass-text-primary",children:s.jsx(r,{...e,open:!1})}),s.jsx("div",{className:"glass-inline-flex glass-h-14 glass-w-14 glass-items-center glass-justify-center glass-radius-full glass-surface-overlay glass-text-primary",children:s.jsx(r,{...e,open:!0})})]})};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-inline-flex glass-h-14 glass-w-14 glass-items-center glass-justify-center glass-radius-full glass-surface-blue glass-text-primary">
      <SpeedDialIcon {...args} />
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
}`,...l.parameters?.docs?.source}}};const m=["Default","Variants"];export{a as Default,l as Variants,m as __namedExportsOrder,u as default};
