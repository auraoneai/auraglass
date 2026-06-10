import{j as s}from"./iframe-BGoRE5Do.js";import{G as r}from"./GlassProgress-CRy6-NrL.js";import"./preload-helper-PPVm8Dsz.js";import"./a11y-BGeEhmxI.js";import"./MotionPreferenceContext-C_ZYUQ6H.js";import"./OptimizedGlassCore-MyIZufQF.js";import"./deviceCapabilities-DE3cL9ZV.js";const d={title:"Data + Visualization/Glass Progress",component:r,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassprogress component."}}},decorators:[a=>s.jsx("div",{className:"glass-radius-2xl glass-border glass-border-subtle glass-surface-overlay glass-p-5",style:{width:"min(640px, calc(100vw - 64px))"},children:s.jsx(a,{})})],argTypes:{className:{control:"text",description:"CSS class name"},value:{control:{type:"number",min:0,max:100},description:"Progress value (0-100)"},max:{control:{type:"number",min:1},description:"Maximum value"},variant:{control:{type:"select"},options:["default","success","warning","error","gradient","primary"],description:"Progress variant"},size:{control:{type:"select"},options:["xs","sm","md","lg","xl"],description:"Progress size"}},args:{className:"",value:65,max:100,variant:"primary",size:"md"}},e={args:{}},l={render:a=>s.jsxs("div",{className:"glass-flex glass-flex-col glass-gap-8",children:[s.jsxs("div",{children:[s.jsx("h4",{className:"glass-text-sm glass-font-medium glass-mb-2",children:"Primary (65%)"}),s.jsx(r,{...a,variant:"primary",value:65})]}),s.jsxs("div",{children:[s.jsx("h4",{className:"glass-text-sm glass-font-medium glass-mb-2",children:"Success (80%)"}),s.jsx(r,{...a,variant:"success",value:80})]}),s.jsxs("div",{children:[s.jsx("h4",{className:"glass-text-sm glass-font-medium glass-mb-2",children:"Warning (45%)"}),s.jsx(r,{...a,variant:"warning",value:45})]}),s.jsxs("div",{children:[s.jsx("h4",{className:"glass-text-sm glass-font-medium glass-mb-2",children:"Error (25%)"}),s.jsx(r,{...a,variant:"error",value:25})]})]})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  args: {}
}`,...e.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
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
}`,...l.parameters?.docs?.source}}};const p=["Default","Variants"];export{e as Default,l as Variants,p as __namedExportsOrder,d as default};
