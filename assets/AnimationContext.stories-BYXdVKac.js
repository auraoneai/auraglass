import{am as r,j as e,an as i}from"./iframe-DFMMcocb.js";import{O as o}from"./OptimizedGlassCore-1D6AE-uZ.js";import"./preload-helper-PPVm8Dsz.js";import"./deviceCapabilities-iDxBLJQX.js";const d=()=>{const{reducedMotion:n,setReducedMotion:t,defaultSpring:a}=i();return e.jsxs(o,{as:"section",elevation:"level2","aria-label":"Animation provider state",className:"glass-p-6",style:{width:"min(32rem, calc(100vw - 32px))",maxWidth:"100%",display:"grid",gap:16},children:[e.jsxs("div",{children:[e.jsx("p",{className:"glass-text-sm glass-text-secondary",children:"Animation provider"}),e.jsx("h2",{className:"glass-text-xl glass-font-semibold glass-text-primary",children:n?"Reduced motion":"Full motion"})]}),e.jsxs("p",{className:"glass-text-secondary",children:["Spring ",a.stiffness," / ",a.damping," /"," ",a.mass]}),e.jsx("button",{type:"button",className:"glass-surface-subtle/10 glass-backdrop-blur-sm glass-border glass-border-white/20 glass-radius-lg glass-px-4 glass-py-2 glass-text-primary",onClick:()=>t(!n),children:"Toggle motion preference"})]})},u={title:"Foundations/Providers/Animation Provider",component:r,parameters:{layout:"centered",docs:{description:{component:"Direct provider coverage with a consumer that reads and updates the reduced-motion state and spring configuration."}}}},s={args:{children:null},render:()=>e.jsx(r,{defaultReducedMotion:!0,defaultSpring:{stiffness:120,damping:18,mass:.9},children:e.jsx(d,{})})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    children: null
  },
  render: () => <AnimationProvider defaultReducedMotion defaultSpring={{
    stiffness: 120,
    damping: 18,
    mass: 0.9
  }}>
      <AnimationConsumer />
    </AnimationProvider>
}`,...s.parameters?.docs?.source}}};const g=["Default"];export{s as Default,g as __namedExportsOrder,u as default};
