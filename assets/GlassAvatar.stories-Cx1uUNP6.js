import{j as s}from"./iframe-C2Py7iTP.js";import{G as a}from"./GlassAvatar-DzUhC8JD.js";import"./preload-helper-PPVm8Dsz.js";import"./OptimizedGlassCore-xEcyrF8U.js";const c={title:"Components/Data-display/GlassAvatar",component:a,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassavatar component."}}},argTypes:{className:{control:"text",description:"CSS class name"},variant:{control:{type:"select"},options:["default","circle","square","glass-radius-md"],description:"Avatar variant"},size:{control:{type:"select"},options:["xs","sm","md","lg","xl","2xl"],description:"Avatar size"},status:{control:{type:"select"},options:["online","offline","away","busy"],description:"Status indicator"},src:{control:"text",description:"Image source URL"},alt:{control:"text",description:"Alt text for image"}},args:{className:"",variant:"circle",size:"md",src:"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",alt:"User avatar"}},e={args:{}},r={render:t=>s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-4",children:[s.jsx(a,{...t,size:"sm",status:"online"}),s.jsx(a,{...t,size:"md",status:"away"}),s.jsx(a,{...t,size:"lg",status:"busy"}),s.jsx(a,{...t,size:"xl",status:"offline"})]})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  args: {}
}`,...e.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-flex glass-items-center glass-gap-4">
      <GlassAvatar {...args} size="sm" status="online" />
      <GlassAvatar {...args} size="md" status="away" />
      <GlassAvatar {...args} size="lg" status="busy" />
      <GlassAvatar {...args} size="xl" status="offline" />
    </div>
}`,...r.parameters?.docs?.source}}};const m=["Default","Variants"];export{e as Default,r as Variants,m as __namedExportsOrder,c as default};
