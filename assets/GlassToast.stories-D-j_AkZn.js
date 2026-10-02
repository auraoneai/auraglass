import{j as s}from"./iframe-DFMMcocb.js";import{G as t}from"./GlassToast-U6sZo_oE.js";import"./preload-helper-PPVm8Dsz.js";import"./components-Ue9Uo88O.js";import"./MotionFramer-Cvto7X39.js";import"./utilsCore-D5Hayjvj.js";import"./OptimizedGlassCore-1D6AE-uZ.js";import"./deviceCapabilities-iDxBLJQX.js";const g={title:"Data + Visualization/Glass Toast",component:t,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glasstoast component."}}},argTypes:{className:{control:"text",description:"Custom className for the toast"},title:{control:"text",description:"Toast title"},description:{control:"text",description:"Toast description"},type:{control:{type:"select"},options:["success","error","warning","info"],description:"Toast type"}},args:{className:"",title:"Toast Title",description:"This is a sample toast message",type:"info"}},o={args:{title:"Sample Toast",description:"This is a sample toast notification.",type:"info"}},r={render:e=>s.jsxs("div",{className:"glass-flex glass-flex-col glass-gap-4",children:[s.jsx(t,{...e,type:"success",title:"Success!",description:"Operation completed successfully."}),s.jsx(t,{...e,type:"error",title:"Error!",description:"Something went wrong."}),s.jsx(t,{...e,type:"warning",title:"Warning!",description:"Please check your input."}),s.jsx(t,{...e,type:"info",title:"Info!",description:"Here's some information."})]})};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    title: 'Sample Toast',
    description: 'This is a sample toast notification.',
    type: 'info'
  }
}`,...o.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-flex glass-flex-col glass-gap-4">
      <GlassToast {...args} type="success" title="Success!" description="Operation completed successfully." />
      <GlassToast {...args} type="error" title="Error!" description="Something went wrong." />
      <GlassToast {...args} type="warning" title="Warning!" description="Please check your input." />
      <GlassToast {...args} type="info" title="Info!" description="Here's some information." />
    </div>
}`,...r.parameters?.docs?.source}}};const u=["Default","Variants"];export{o as Default,r as Variants,u as __namedExportsOrder,g as default};
