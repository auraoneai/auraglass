import{j as s}from"./iframe-DFMMcocb.js";import{G as e}from"./GlassProgress-S5FmnnLW.js";import"./preload-helper-PPVm8Dsz.js";import"./a11y-Q0mX7KvA.js";import"./MotionPreferenceContext-VYRcsRrk.js";import"./OptimizedGlassCore-1D6AE-uZ.js";import"./deviceCapabilities-iDxBLJQX.js";const d={title:"Data + Visualization/Glass Progress",component:e,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassprogress component."}}},decorators:[a=>s.jsx("div",{className:"glass-radius-2xl glass-border glass-border-subtle glass-surface-overlay glass-p-5",style:{width:"min(640px, calc(100vw - 64px))"},children:s.jsx(a,{})})],argTypes:{className:{control:"text",description:"CSS class name"},value:{control:{type:"number",min:0,max:100},description:"Progress value (0-100)"},max:{control:{type:"number",min:1},description:"Maximum value"},variant:{control:{type:"select"},options:["default","success","warning","error","gradient","primary"],description:"Progress variant"},size:{control:{type:"select"},options:["xs","sm","md","lg","xl"],description:"Progress size"}},args:{className:"",value:65,max:100,variant:"primary",size:"md",label:"Workspace setup",showValue:!0,animated:!1}},r={args:{}},l={render:a=>s.jsxs("div",{className:"glass-flex glass-flex-col glass-gap-8",children:[s.jsxs("div",{children:[s.jsx("h4",{className:"glass-text-sm glass-font-medium glass-mb-2",children:"Primary (65%)"}),s.jsx(e,{...a,variant:"primary",value:65})]}),s.jsxs("div",{children:[s.jsx("h4",{className:"glass-text-sm glass-font-medium glass-mb-2",children:"Success (80%)"}),s.jsx(e,{...a,variant:"success",value:80})]}),s.jsxs("div",{children:[s.jsx("h4",{className:"glass-text-sm glass-font-medium glass-mb-2",children:"Warning (45%)"}),s.jsx(e,{...a,variant:"warning",value:45})]}),s.jsxs("div",{children:[s.jsx("h4",{className:"glass-text-sm glass-font-medium glass-mb-2",children:"Error (25%)"}),s.jsx(e,{...a,variant:"error",value:25})]})]})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {}
}`,...r.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-flex glass-flex-col glass-gap-8">
      <div>
        <h4 className="glass-text-sm glass-font-medium glass-mb-2">
          Primary (65%)
        </h4>
        <GlassProgress {...args} variant="primary" value={65} />
      </div>
      <div>
        <h4 className="glass-text-sm glass-font-medium glass-mb-2">
          Success (80%)
        </h4>
        <GlassProgress {...args} variant="success" value={80} />
      </div>
      <div>
        <h4 className="glass-text-sm glass-font-medium glass-mb-2">
          Warning (45%)
        </h4>
        <GlassProgress {...args} variant="warning" value={45} />
      </div>
      <div>
        <h4 className="glass-text-sm glass-font-medium glass-mb-2">
          Error (25%)
        </h4>
        <GlassProgress {...args} variant="error" value={25} />
      </div>
    </div>
}`,...l.parameters?.docs?.source}}};const p=["Default","Variants"];export{r as Default,l as Variants,p as __namedExportsOrder,d as default};
