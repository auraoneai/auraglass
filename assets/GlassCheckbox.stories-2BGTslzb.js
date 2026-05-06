import{j as e}from"./iframe-DBVOVM-c.js";import{G as s}from"./GlassCheckbox-C3j0JSDe.js";import"./preload-helper-PPVm8Dsz.js";import"./MotionPreferenceContext-DuNK6mTA.js";import"./OptimizedGlassCore-CyIux4a_.js";import"./MotionFramer-DLgCJzPg.js";import"./utilsCore-B0Pwu3YL.js";import"./minus-DP_BWr-J.js";import"./createLucideIcon-HCPRkE_a.js";import"./check-DomXwogN.js";const h={title:"Components/Input/GlassCheckbox",component:s,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glasscheckbox component."}}},argTypes:{className:{control:"text",description:"className prop"},disabled:{control:"boolean",description:"disabled prop"},label:{control:"text",description:"label prop"},description:{control:"text",description:"description prop"},size:{control:{type:"select"},options:["sm","md","lg"],description:"size prop"},variant:{control:{type:"select"},options:["default","success","warning","error","info"],description:"variant prop"}},args:{className:"",disabled:!1,label:"Accept terms and conditions",description:"By checking this box, you agree to our terms.",size:"md",variant:"default"}},r={args:{label:"Default checkbox",description:"This is a default GlassCheckbox component"}},l={render:a=>e.jsxs("div",{className:"glass-flex glass-flex-col glass-gap-4 max-w-md",children:[e.jsx(s,{...a,variant:"default",label:"Default variant"}),e.jsx(s,{...a,variant:"success",label:"Success variant"}),e.jsx(s,{...a,variant:"warning",label:"Warning variant"}),e.jsx(s,{...a,variant:"error",label:"Error variant"}),e.jsx(s,{...a,variant:"info",label:"Info variant"})]})},o={render:a=>e.jsxs("div",{className:"glass-flex glass-flex-col glass-gap-4 max-w-md",children:[e.jsx(s,{...a,size:"sm",label:"Small size"}),e.jsx(s,{...a,size:"md",label:"Medium size"}),e.jsx(s,{...a,size:"lg",label:"Large size"})]})},t={render:a=>e.jsxs("div",{className:"glass-flex glass-flex-col glass-gap-4 max-w-md",children:[e.jsx(s,{...a,checked:!1,label:"Unchecked"}),e.jsx(s,{...a,checked:!0,label:"Checked"}),e.jsx(s,{...a,indeterminate:!0,label:"Indeterminate"}),e.jsx(s,{...a,disabled:!0,label:"Disabled"}),e.jsx(s,{...a,disabled:!0,checked:!0,label:"Disabled checked"})]})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Default checkbox',
    description: 'This is a default GlassCheckbox component'
  }
}`,...r.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-flex glass-flex-col glass-gap-4 max-w-md">
      <GlassCheckbox {...args} variant="default" label="Default variant" />
      <GlassCheckbox {...args} variant="success" label="Success variant" />
      <GlassCheckbox {...args} variant="warning" label="Warning variant" />
      <GlassCheckbox {...args} variant="error" label="Error variant" />
      <GlassCheckbox {...args} variant="info" label="Info variant" />
    </div>
}`,...l.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-flex glass-flex-col glass-gap-4 max-w-md">
      <GlassCheckbox {...args} size="sm" label="Small size" />
      <GlassCheckbox {...args} size="md" label="Medium size" />
      <GlassCheckbox {...args} size="lg" label="Large size" />
    </div>
}`,...o.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-flex glass-flex-col glass-gap-4 max-w-md">
      <GlassCheckbox {...args} checked={false} label="Unchecked" />
      <GlassCheckbox {...args} checked={true} label="Checked" />
      <GlassCheckbox {...args} indeterminate label="Indeterminate" />
      <GlassCheckbox {...args} disabled label="Disabled" />
      <GlassCheckbox {...args} disabled checked label="Disabled checked" />
    </div>
}`,...t.parameters?.docs?.source}}};const f=["Default","Variants","Sizes","States"];export{r as Default,o as Sizes,t as States,l as Variants,f as __namedExportsOrder,h as default};
