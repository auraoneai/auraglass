import{j as a}from"./iframe-B_p7zla-.js";import{G as r}from"./GlassJSONViewer-DEDmn8Lg.js";import"./preload-helper-PPVm8Dsz.js";import"./OptimizedGlassCore-DOcR6zy-.js";import"./deviceCapabilities-BJ_x-v1T.js";const p={title:"Data + Visualization/Glass JSONViewer",component:r,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassjsonviewer component."}}},argTypes:{className:{control:"text",description:"className prop"}},args:{className:""}},s={args:{value:{name:"GlassJSONViewer",description:"This is the default glassjsonviewer component.",properties:{value:"any JSON object",className:"optional CSS class"}}}},e={render:o=>a.jsx("div",{className:"glass-flex glass-flex-wrap glass-gap-4",children:a.jsx(r,{...o})}),args:{value:{component:"GlassJSONViewer",variant:"default"}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    value: {
      name: 'GlassJSONViewer',
      description: 'This is the default glassjsonviewer component.',
      properties: {
        value: 'any JSON object',
        className: 'optional CSS class'
      }
    }
  }
}`,...s.parameters?.docs?.source}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-flex glass-flex-wrap glass-gap-4">
      <GlassJSONViewer {...args} />
    </div>,
  args: {
    value: {
      component: 'GlassJSONViewer',
      variant: 'default'
    }
  }
}`,...e.parameters?.docs?.source}}};const m=["Default","Variants"];export{s as Default,e as Variants,m as __namedExportsOrder,p as default};
