import{j as r}from"./iframe-DBVOVM-c.js";import{S as a}from"./ScrollButtons-DYCEu_av.js";import"./preload-helper-PPVm8Dsz.js";const c={title:"Components/Components/ScrollButtons",component:a,parameters:{layout:"centered",docs:{description:{component:"A glass morphism scrollbuttons component."}}},argTypes:{},args:{}},n={args:{}},o={render:s=>r.jsxs("div",{className:"glass-flex glass-flex-wrap glass-gap-4",children:[r.jsx(a,{...s,variant:"primary",children:"primary"},"primary"),r.jsx(a,{...s,variant:"secondary",children:"secondary"},"secondary"),r.jsx(a,{...s,variant:"ghost",children:"ghost"},"ghost"),r.jsx(a,{...s,variant:"outline",children:"outline"},"outline"),r.jsx(a,{...s,variant:"danger",children:"danger"},"danger")]}),args:{}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {}
}`,...n.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: (args: any) => <div className="glass-flex glass-flex-wrap glass-gap-4">
      <ScrollButtons key="primary" {...args} variant="primary">
        primary
      </ScrollButtons>
      <ScrollButtons key="secondary" {...args} variant="secondary">
        secondary
      </ScrollButtons>
      <ScrollButtons key="ghost" {...args} variant="ghost">
        ghost
      </ScrollButtons>
      <ScrollButtons key="outline" {...args} variant="outline">
        outline
      </ScrollButtons>
      <ScrollButtons key="danger" {...args} variant="danger">
        danger
      </ScrollButtons>
    </div>,
  args: {}
}`,...o.parameters?.docs?.source}}};const i=["Default","Variants"];export{n as Default,o as Variants,i as __namedExportsOrder,c as default};
