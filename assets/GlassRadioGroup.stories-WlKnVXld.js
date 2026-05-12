import{j as e,r as c}from"./iframe-LB2Lfhgp.js";import{G as t}from"./GlassRadioGroup-CXGDSvlQ.js";import{G as d}from"./gauge-D_gsQnSu.js";import{C as p}from"./chart-column-CnyayYwP.js";import{S as m}from"./shield-check-Duf9go81.js";import"./preload-helper-PPVm8Dsz.js";import"./a11y-DBdyTOMI.js";import"./useMotionPreference-PpLcchZF.js";import"./MotionFramer-CR_bXaKW.js";import"./utilsCore-iKIe4RkQ.js";import"./OptimizedGlassCore-Bt3saaFo.js";import"./deviceCapabilities-DKKFd1VE.js";import"./createLucideIcon-CKdMI_TB.js";const n=[{value:"balanced",label:"Balanced delivery",description:"Optimize pacing across reach, spend, and quality.",icon:e.jsx(d,{size:18})},{value:"performance",label:"Performance first",description:"Prioritize conversion likelihood and active segments.",icon:e.jsx(p,{size:18})},{value:"guarded",label:"Guarded rollout",description:"Slow changes until policy checks and approvals clear.",icon:e.jsx(m,{size:18})}],S={title:"Controls/Inputs/Glass Radio Group",component:t,parameters:{layout:"centered",previewSurface:"component",docs:{description:{component:"A glass radio group for mutually exclusive choices with card and compact layouts."}}},args:{label:"Optimization mode",description:"Choose how the launch system should tune delivery.",options:n,defaultValue:"balanced",variant:"card",size:"md"}},i=a=>{const[s,l]=c.useState(a.value??a.defaultValue??"balanced");return e.jsx("div",{className:"glass-w-[min(720px,calc(100vw-48px))] glass-rounded-3xl glass-border glass-border-white/25 glass-bg-white/35 glass-p-6 glass-shadow-xl glass-backdrop-blur-xl",children:e.jsx(t,{...a,value:s,onValueChange:l})})},r={render:a=>e.jsx(i,{...a})},o={args:{orientation:"horizontal",variant:"default",options:n.map(({value:a,label:s})=>({value:a,label:s}))},render:a=>e.jsx(i,{...a})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  render: args => <RadioFrame {...args} />
}`,...r.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    orientation: "horizontal",
    variant: "default",
    options: options.map(({
      value,
      label
    }) => ({
      value,
      label
    }))
  },
  render: args => <RadioFrame {...args} />
}`,...o.parameters?.docs?.source}}};const R=["Default","Horizontal"];export{r as Default,o as Horizontal,R as __namedExportsOrder,S as default};
