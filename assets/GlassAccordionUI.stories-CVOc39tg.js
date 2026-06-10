import{j as a}from"./iframe-DL0Cy6Qm.js";import{G as r}from"./GlassAccordion-DBsQeeUv.js";import"./preload-helper-PPVm8Dsz.js";import"./a11y-BmS7yTss.js";import"./MotionPreferenceContext-CE2cIJWP.js";import"./OptimizedGlassCore-DCil-Mtt.js";import"./deviceCapabilities-bTwC3axp.js";const p={title:"Controls/Inputs/Glass Accordion UI",component:r,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassaccordionui component."}}},argTypes:{className:{control:"text",description:"className prop"}},args:{className:""}},e={args:{className:"glass-w-[min(22rem,calc(100vw-3rem))] !glass-text-slate-950",defaultValue:"overview",items:[{id:"overview",title:"Component overview",content:"Accordion content renders inside a translucent panel."},{id:"usage",title:"Usage",content:"Use the glass accordion for grouped settings and FAQs."}]}},s={render:n=>a.jsx("div",{className:"glass-flex glass-flex-wrap glass-gap-4",children:a.jsx(r,{...n,children:"Default"})}),args:{}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  args: {
    className: 'glass-w-[min(22rem,calc(100vw-3rem))] !glass-text-slate-950',
    defaultValue: 'overview',
    items: [{
      id: 'overview',
      title: 'Component overview',
      content: 'Accordion content renders inside a translucent panel.'
    }, {
      id: 'usage',
      title: 'Usage',
      content: 'Use the glass accordion for grouped settings and FAQs.'
    }]
  }
}`,...e.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: (args: any) => <div className="glass-flex glass-flex-wrap glass-gap-4">
      <GlassAccordionUI {...args}>
        Default
      </GlassAccordionUI>
    </div>,
  args: {}
}`,...s.parameters?.docs?.source}}};const g=["Default","Variants"];export{e as Default,s as Variants,g as __namedExportsOrder,p as default};
