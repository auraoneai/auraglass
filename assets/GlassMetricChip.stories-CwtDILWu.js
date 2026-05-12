import{j as a}from"./iframe-D5XNSE8t.js";import{G as r}from"./GlassMetricChip-C0wXkSKe.js";import"./preload-helper-PPVm8Dsz.js";import"./OptimizedGlassCore-CXfAtOX-.js";import"./deviceCapabilities-QhTB8XNW.js";const p={title:"Data + Visualization/Glass Metric Chip",component:r,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassmetricchip component."}}},argTypes:{className:{control:"text",description:"className prop"}},args:{className:""}},s={args:{label:"Revenue",value:"$12,345",delta:"+15%",intent:"success"}},e={render:t=>a.jsx("div",{className:"glass-flex glass-flex-wrap glass-gap-4",children:a.jsx(r,{...t})}),args:{label:"Users",value:1234}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Revenue',
    value: '$12,345',
    delta: '+15%',
    intent: 'success'
  }
}`,...s.parameters?.docs?.source}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-flex glass-flex-wrap glass-gap-4">
      <GlassMetricChip {...args} />
    </div>,
  args: {
    label: 'Users',
    value: 1234
  }
}`,...e.parameters?.docs?.source}}};const m=["Default","Variants"];export{s as Default,e as Variants,m as __namedExportsOrder,p as default};
