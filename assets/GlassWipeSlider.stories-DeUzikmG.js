import{j as s}from"./iframe-C2Py7iTP.js";import{G as t}from"./GlassWipeSlider-B9iqxOHC.js";import"./preload-helper-PPVm8Dsz.js";import"./useMotionPreference-vZJsvje4.js";import"./use-motion-value-B9aQL0Y6.js";import"./use-spring-DVLInHT6.js";import"./use-transform-DRog8H5X.js";const c={title:"Components/Website-components/GlassWipeSlider",component:t,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glasswipeslider component."}}},argTypes:{className:{control:"text",description:"className prop"},initialPosition:{control:{type:"range",min:0,max:100},description:"initial position prop"},orientation:{control:{type:"select"},options:["horizontal","vertical"],description:"orientation prop"}},args:{className:"",initialPosition:50,orientation:"horizontal"}},a={args:{beforeContent:s.jsxs("div",{className:"glass-p-8 glass-text-center glass-gradient-primary glass-gradient-primary glass-gradient-primary dark:glass-gradient-primary dark:glass-gradient-primary glass-radius-lg",children:[s.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-mb-2",children:"Before"}),s.jsx("p",{className:"glass-text-sm opacity-80",children:"Initial state content"})]}),afterContent:s.jsxs("div",{className:"glass-p-8 glass-text-center glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-lg",children:[s.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-mb-2",children:"After"}),s.jsx("p",{className:"glass-text-sm opacity-80",children:"Final state content"})]}),initialPosition:50}},e={render:r=>s.jsx("div",{className:"glass-flex glass-flex-wrap glass-gap-4",children:s.jsx(t,{...r})}),args:{beforeContent:s.jsx("div",{className:"glass-p-4 glass-text-center glass-surface-red/20 glass-radius-md",children:s.jsx("span",{className:"glass-text-sm",children:"Before"})}),afterContent:s.jsx("div",{className:"glass-p-4 glass-text-center glass-surface-green/20 glass-radius-md",children:s.jsx("span",{className:"glass-text-sm",children:"After"})}),initialPosition:30}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    beforeContent: <div className="glass-p-8 glass-text-center glass-gradient-primary glass-gradient-primary glass-gradient-primary dark:glass-gradient-primary dark:glass-gradient-primary glass-radius-lg">
        <h3 className="glass-text-xl glass-font-semibold glass-mb-2">Before</h3>
        <p className="glass-text-sm opacity-80">Initial state content</p>
      </div>,
    afterContent: <div className="glass-p-8 glass-text-center glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-lg">
        <h3 className="glass-text-xl glass-font-semibold glass-mb-2">After</h3>
        <p className="glass-text-sm opacity-80">Final state content</p>
      </div>,
    initialPosition: 50
  }
}`,...a.parameters?.docs?.source}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-flex glass-flex-wrap glass-gap-4">
      <GlassWipeSlider {...args} />
    </div>,
  args: {
    beforeContent: <div className="glass-p-4 glass-text-center glass-surface-red/20 glass-radius-md">
        <span className="glass-text-sm">Before</span>
      </div>,
    afterContent: <div className="glass-p-4 glass-text-center glass-surface-green/20 glass-radius-md">
        <span className="glass-text-sm">After</span>
      </div>,
    initialPosition: 30
  }
}`,...e.parameters?.docs?.source}}};const d=["Default","Variants"];export{a as Default,e as Variants,d as __namedExportsOrder,c as default};
