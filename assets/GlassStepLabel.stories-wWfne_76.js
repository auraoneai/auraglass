import{j as e}from"./iframe-OZreUAtx.js";import{G as s}from"./GlassStepLabel-KGITcSPk.js";import"./preload-helper-PPVm8Dsz.js";import"./MotionFramer-BTsVQK94.js";import"./utilsCore-B384u8by.js";const n={title:"Components/Input/GlassStepLabel",component:s,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glasssteplabel component."}}},argTypes:{label:{control:"text",description:"Label text for the step"},active:{control:"boolean",description:"Whether the step is active"},completed:{control:"boolean",description:"Whether the step is completed"},orientation:{control:{type:"select",options:["horizontal","vertical"]},description:"Orientation of the step label"}},args:{label:"Step Label",active:!1,completed:!1,orientation:"horizontal"}},t={args:{label:"Step 1",active:!0,completed:!1,orientation:"horizontal"}},a={render:l=>e.jsxs("div",{className:"glass-flex glass-flex-wrap glass-gap-4",children:[e.jsx(s,{...l}),e.jsx(s,{...l,label:"Completed Step",active:!1,completed:!0}),e.jsx(s,{...l,label:"Inactive Step",active:!1,completed:!1})]}),args:{label:"Active Step",active:!0,completed:!1,orientation:"vertical"}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Step 1',
    active: true,
    completed: false,
    orientation: 'horizontal'
  }
}`,...t.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-flex glass-flex-wrap glass-gap-4">
      <GlassStepLabel {...args} />
      <GlassStepLabel {...args} label="Completed Step" active={false} completed={true} />
      <GlassStepLabel {...args} label="Inactive Step" active={false} completed={false} />
    </div>,
  args: {
    label: 'Active Step',
    active: true,
    completed: false,
    orientation: 'vertical'
  }
}`,...a.parameters?.docs?.source}}};const m=["Default","Variants"];export{t as Default,a as Variants,m as __namedExportsOrder,n as default};
