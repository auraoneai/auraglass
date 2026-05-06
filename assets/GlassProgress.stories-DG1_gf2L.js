import{j as s}from"./iframe-Ddb4tVEK.js";import{G as a}from"./GlassProgress-DGWJYtBr.js";import"./preload-helper-PPVm8Dsz.js";import"./MotionPreferenceContext-BplUqfQw.js";import"./OptimizedGlassCore-ac4MFqVE.js";const c={title:"Components/Data-display/GlassProgress",component:a,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassprogress component."}}},argTypes:{className:{control:"text",description:"CSS class name"},value:{control:{type:"number",min:0,max:100},description:"Progress value (0-100)"},max:{control:{type:"number",min:1},description:"Maximum value"},variant:{control:{type:"select"},options:["default","success","warning","error","gradient","primary"],description:"Progress variant"},size:{control:{type:"select"},options:["xs","sm","md","lg","xl"],description:"Progress size"}},args:{className:"",value:65,max:100,variant:"primary",size:"md"}},r={args:{}},n={render:e=>s.jsxs("div",{className:"glass-flex glass-flex-col glass-gap-8",children:[s.jsxs("div",{children:[s.jsx("h4",{className:"glass-text-sm glass-font-medium glass-mb-2",children:"Primary (65%)"}),s.jsx(a,{...e,variant:"primary",value:65})]}),s.jsxs("div",{children:[s.jsx("h4",{className:"glass-text-sm glass-font-medium glass-mb-2",children:"Success (80%)"}),s.jsx(a,{...e,variant:"success",value:80})]}),s.jsxs("div",{children:[s.jsx("h4",{className:"glass-text-sm glass-font-medium glass-mb-2",children:"Warning (45%)"}),s.jsx(a,{...e,variant:"warning",value:45})]}),s.jsxs("div",{children:[s.jsx("h4",{className:"glass-text-sm glass-font-medium glass-mb-2",children:"Error (25%)"}),s.jsx(a,{...e,variant:"error",value:25})]})]})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {}
}`,...r.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-flex glass-flex-col glass-gap-8">
      <div>
        <h4 className="glass-text-sm glass-font-medium glass-mb-2">Primary (65%)</h4>
        <GlassProgress {...args} variant="primary" value={65} />
      </div>
      <div>
        <h4 className="glass-text-sm glass-font-medium glass-mb-2">Success (80%)</h4>
        <GlassProgress {...args} variant="success" value={80} />
      </div>
      <div>
        <h4 className="glass-text-sm glass-font-medium glass-mb-2">Warning (45%)</h4>
        <GlassProgress {...args} variant="warning" value={45} />
      </div>
      <div>
        <h4 className="glass-text-sm glass-font-medium glass-mb-2">Error (25%)</h4>
        <GlassProgress {...args} variant="error" value={25} />
      </div>
    </div>
}`,...n.parameters?.docs?.source}}};const g=["Default","Variants"];export{r as Default,n as Variants,g as __namedExportsOrder,c as default};
