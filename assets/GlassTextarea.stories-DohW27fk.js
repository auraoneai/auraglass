import{j as e}from"./iframe-Ddb4tVEK.js";import{G as s}from"./GlassTextarea-BPGhqitw.js";import"./preload-helper-PPVm8Dsz.js";import"./circle-alert-D5sufKzJ.js";import"./createLucideIcon-ArTIMtiF.js";const x={title:"Components/Input/GlassTextarea",component:s,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glasstextarea component."}}},argTypes:{className:{control:"text",description:"className prop"},disabled:{control:"boolean",description:"disabled prop"},placeholder:{control:"text",description:"placeholder prop"},value:{control:"text",description:"value prop"},variant:{control:{type:"select"},options:["default","filled","outlined","minimal"],description:"variant prop"},size:{control:{type:"select"},options:["sm","md","lg"],description:"size prop"},state:{control:{type:"select"},options:["default","error","warning","success"],description:"state prop"}},args:{className:"",disabled:!1,placeholder:"Enter your text here...",value:"",variant:"default",size:"md",state:"default"}},r={args:{placeholder:"Enter your text here...",value:"This is the default GlassTextarea component with some sample text to demonstrate the glass morphism styling."}},t={render:a=>e.jsxs("div",{className:"glass-flex glass-flex-col glass-gap-4 max-w-md",children:[e.jsx(s,{...a,variant:"default",placeholder:"Default variant"}),e.jsx(s,{...a,variant:"filled",placeholder:"Filled variant"}),e.jsx(s,{...a,variant:"outlined",placeholder:"Outlined variant"}),e.jsx(s,{...a,variant:"minimal",placeholder:"Minimal variant"})]})},l={render:a=>e.jsxs("div",{className:"glass-flex glass-flex-col glass-gap-4 max-w-md",children:[e.jsx(s,{...a,state:"default",placeholder:"Default state"}),e.jsx(s,{...a,state:"success",placeholder:"Success state"}),e.jsx(s,{...a,state:"warning",placeholder:"Warning state"}),e.jsx(s,{...a,state:"error",placeholder:"Error state"})]})},o={render:a=>e.jsxs("div",{className:"glass-flex glass-flex-col glass-gap-4 max-w-md",children:[e.jsx(s,{...a,size:"sm",placeholder:"Small size"}),e.jsx(s,{...a,size:"md",placeholder:"Medium size"}),e.jsx(s,{...a,size:"lg",placeholder:"Large size"})]})},i={render:a=>e.jsxs("div",{className:"glass-flex glass-flex-col glass-gap-4 max-w-md",children:[e.jsx(s,{...a,label:"With Label",placeholder:"Textarea with label"}),e.jsx(s,{...a,showCharCount:!0,maxLength:100,placeholder:"With character count"}),e.jsx(s,{...a,helperText:"This is helper text",placeholder:"With helper text"}),e.jsx(s,{...a,errorText:"This field is required",placeholder:"With error text"})]})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    placeholder: 'Enter your text here...',
    value: 'This is the default GlassTextarea component with some sample text to demonstrate the glass morphism styling.'
  }
}`,...r.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-flex glass-flex-col glass-gap-4 max-w-md">
      <GlassTextarea {...args} variant="default" placeholder="Default variant" />
      <GlassTextarea {...args} variant="filled" placeholder="Filled variant" />
      <GlassTextarea {...args} variant="outlined" placeholder="Outlined variant" />
      <GlassTextarea {...args} variant="minimal" placeholder="Minimal variant" />
    </div>
}`,...t.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-flex glass-flex-col glass-gap-4 max-w-md">
      <GlassTextarea {...args} state="default" placeholder="Default state" />
      <GlassTextarea {...args} state="success" placeholder="Success state" />
      <GlassTextarea {...args} state="warning" placeholder="Warning state" />
      <GlassTextarea {...args} state="error" placeholder="Error state" />
    </div>
}`,...l.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-flex glass-flex-col glass-gap-4 max-w-md">
      <GlassTextarea {...args} size="sm" placeholder="Small size" />
      <GlassTextarea {...args} size="md" placeholder="Medium size" />
      <GlassTextarea {...args} size="lg" placeholder="Large size" />
    </div>
}`,...o.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-flex glass-flex-col glass-gap-4 max-w-md">
      <GlassTextarea {...args} label="With Label" placeholder="Textarea with label" />
      <GlassTextarea {...args} showCharCount maxLength={100} placeholder="With character count" />
      <GlassTextarea {...args} helperText="This is helper text" placeholder="With helper text" />
      <GlassTextarea {...args} errorText="This field is required" placeholder="With error text" />
    </div>
}`,...i.parameters?.docs?.source}}};const h=["Default","Variants","States","Sizes","WithFeatures"];export{r as Default,o as Sizes,l as States,t as Variants,i as WithFeatures,h as __namedExportsOrder,x as default};
