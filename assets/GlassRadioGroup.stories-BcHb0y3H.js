import{j as e}from"./iframe-C2Py7iTP.js";import{G as s}from"./GlassRadioGroup-BW9zi639.js";import"./preload-helper-PPVm8Dsz.js";import"./useMotionPreference-vZJsvje4.js";import"./MotionFramer-Bqa_dH4n.js";import"./utilsCore-DHlzAtb4.js";import"./OptimizedGlassCore-xEcyrF8U.js";const d={title:"Components/Input/GlassRadioGroup",component:s,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassradiogroup component."}}},argTypes:{className:{control:"text",description:"className prop"},disabled:{control:"boolean",description:"disabled prop"}},args:{className:"",disabled:!1}},a={args:{options:[{value:"option1",label:"Option 1"},{value:"option2",label:"Option 2"},{value:"option3",label:"Option 3"}],value:"option1"}},o={render:r=>e.jsx("div",{className:"glass-flex glass-flex-wrap glass-gap-4",children:e.jsx(s,{...r})}),args:{options:[{value:"a",label:"Choice A"},{value:"b",label:"Choice B"}],value:"a"}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    options: [{
      value: 'option1',
      label: 'Option 1'
    }, {
      value: 'option2',
      label: 'Option 2'
    }, {
      value: 'option3',
      label: 'Option 3'
    }],
    value: 'option1'
  }
}`,...a.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-flex glass-flex-wrap glass-gap-4">
      <GlassRadioGroup {...args} />
    </div>,
  args: {
    options: [{
      value: 'a',
      label: 'Choice A'
    }, {
      value: 'b',
      label: 'Choice B'
    }],
    value: 'a'
  }
}`,...o.parameters?.docs?.source}}};const u=["Default","Variants"];export{a as Default,o as Variants,u as __namedExportsOrder,d as default};
