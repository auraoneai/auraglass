import{j as s,r as c}from"./iframe-BGoRE5Do.js";import{G as o}from"./GlassSlider-sYlqO73K.js";import"./preload-helper-PPVm8Dsz.js";import"./MotionPreferenceContext-C_ZYUQ6H.js";import"./a11y-BGeEhmxI.js";import"./OptimizedGlassCore-MyIZufQF.js";import"./deviceCapabilities-DE3cL9ZV.js";const v={title:"Controls/Inputs/Glass Slider",component:o,parameters:{layout:"centered",previewSurface:"component",docs:{description:{component:"A glass slider for ranges, thresholds, and numeric tuning controls."}}},args:{label:"Campaign intensity",description:"Balance reach and frequency for the active audience.",min:0,max:100,step:5,defaultValue:65,showValue:!0,showTicks:!0,ticks:[0,25,50,75,100],variant:"info",formatValue:e=>`${e}%`}},i=e=>{const[a,d]=c.useState(e.value??e.defaultValue??65);return s.jsxs("div",{className:"glass-w-[min(640px,calc(100vw-48px))] glass-rounded-3xl glass-border glass-border-white/25 glass-bg-white/35 glass-p-6 glass-shadow-xl glass-backdrop-blur-xl",children:[s.jsx(o,{...e,value:a,onChange:d}),s.jsx("div",{className:"glass-mt-5 glass-grid glass-gap-3 sm:glass-grid-cols-3",children:["Audience","Spend","Quality"].map((l,n)=>s.jsxs("div",{className:"glass-rounded-2xl glass-border glass-border-white/20 glass-bg-white/25 glass-p-3",children:[s.jsx("div",{className:"glass-text-xs glass-text-secondary",children:l}),s.jsxs("div",{className:"glass-text-lg glass-font-semibold glass-text-primary",children:[Array.isArray(a)?a[n%a.length]:Math.max(12,Number(a)-n*8),"%"]})]},l))})]})},r={render:e=>s.jsx(i,{...e})},t={args:{label:"Budget guardrail",description:"Keep experiments inside the approved range.",defaultValue:[25,80],range:!0,variant:"success",formatValue:e=>`$${e}k`},render:e=>s.jsx(i,{...e})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  render: args => <SliderFrame {...args} />
}`,...r.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    label: "Budget guardrail",
    description: "Keep experiments inside the approved range.",
    defaultValue: [25, 80],
    range: true,
    variant: "success",
    formatValue: (value: number) => \`$\${value}k\`
  },
  render: args => <SliderFrame {...args} />
}`,...t.parameters?.docs?.source}}};const b=["Default","Range"];export{r as Default,t as Range,b as __namedExportsOrder,v as default};
