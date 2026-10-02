import{j as s}from"./iframe-DFMMcocb.js";import{I as l}from"./ImageList-CusiSyxz.js";import"./preload-helper-PPVm8Dsz.js";const n={title:"Media/Image List",component:l,parameters:{layout:"centered",docs:{description:{component:"A glass morphism imagelist component."}}},argTypes:{className:{control:"text",description:"className prop"}},args:{className:""}},a={render:r=>s.jsx("div",{className:"glass-neutral-level1 glass-rounded-3xl glass-p-6",children:s.jsx(l,{...r,children:["Launch grid","Review queue","Published set"].map(t=>s.jsx("div",{className:"glass-rounded-xl glass-bg-white/70 glass-p-4 glass-text-sm glass-text-primary",children:t},t))})}),args:{className:""}},e={render:r=>s.jsx("div",{className:"glass-flex glass-flex-wrap glass-gap-4",children:s.jsx(l,{...r,children:"Default"})}),args:{}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-neutral-level1 glass-rounded-3xl glass-p-6">
      <ImageList {...args}>
        {['Launch grid', 'Review queue', 'Published set'].map(label => <div key={label} className="glass-rounded-xl glass-bg-white/70 glass-p-4 glass-text-sm glass-text-primary">
            {label}
          </div>)}
      </ImageList>
    </div>,
  args: {
    className: ''
  }
}`,...a.parameters?.docs?.source}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  render: (args: any) => <div className="glass-flex glass-flex-wrap glass-gap-4">
      <ImageList {...args}>
        Default
      </ImageList>
    </div>,
  args: {}
}`,...e.parameters?.docs?.source}}};const d=["Default","Variants"];export{a as Default,e as Variants,d as __namedExportsOrder,n as default};
