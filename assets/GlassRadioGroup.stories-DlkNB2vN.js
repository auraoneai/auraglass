import{j as e,r as c}from"./iframe-B8jVgyad.js";import{ak as d,aa as p,t as u}from"./components-Dfh6oSUn.js";import{G as t}from"./GlassRadioGroup-501VX87O.js";import"./preload-helper-PPVm8Dsz.js";import"./a11y-B5SIjMKz.js";import"./useMotionPreference-BlzAqUHb.js";import"./MotionFramer-B8wcyPsS.js";import"./utilsCore-jJSD4MRq.js";import"./OptimizedGlassCore-LJ9cg0Vq.js";import"./deviceCapabilities-TeCERPXa.js";const n=[{value:"balanced",label:"Balanced delivery",description:"Optimize pacing across reach, spend, and quality.",icon:e.jsx(d,{size:18})},{value:"performance",label:"Performance first",description:"Prioritize conversion likelihood and active segments.",icon:e.jsx(p,{size:18})},{value:"guarded",label:"Guarded rollout",description:"Slow changes until policy checks and approvals clear.",icon:e.jsx(u,{size:18})}],y={title:"Controls/Inputs/Glass Radio Group",component:t,parameters:{layout:"centered",previewSurface:"component",docs:{description:{component:"A glass radio group for mutually exclusive choices with card and compact layouts."}}},args:{label:"Optimization mode",description:"Choose how the launch system should tune delivery.",options:n,defaultValue:"balanced",variant:"card",size:"md"}},i=a=>{const[s,l]=c.useState(a.value??a.defaultValue??"balanced");return e.jsx("div",{className:"glass-w-[min(720px,calc(100vw-48px))] glass-rounded-3xl glass-border glass-border-white/25 glass-bg-white/35 glass-p-6 glass-shadow-xl glass-backdrop-blur-xl",children:e.jsx(t,{...a,value:s,onValueChange:l})})},r={render:a=>e.jsx(i,{...a})},o={args:{orientation:"horizontal",variant:"default",options:n.map(({value:a,label:s})=>({value:a,label:s}))},render:a=>e.jsx(i,{...a})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
}`,...o.parameters?.docs?.source}}};const G=["Default","Horizontal"];export{r as Default,o as Horizontal,G as __namedExportsOrder,y as default};
