import{r as c,j as s,c as p,d as h}from"./iframe-DL0Cy6Qm.js";import{f as u}from"./index-CLSxArU-.js";import"./preload-helper-PPVm8Dsz.js";import"./index-ByImX2pa.js";const d=[{id:"step1",label:"Step 1"},{id:"step2",label:"Step 2"},{id:"step3",label:"Step 3"}];function i({steps:r=d,active:a=d[0].id,onChange:g,className:m,...f}){const o=c.useRef(null);return c.useEffect(()=>{o.current=a},[a]),s.jsx("div",{"data-glass-component":!0,className:p("glass-flex glass-flex-wrap glass-items-center glass-justify-center glass-gap-3 glass-w-full glass-min-w-0",m),...f,children:r.map((e,b)=>{const t=e.id===a,S=t&&o.current!==a;return s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-3",children:[s.jsx("button",{type:"button","aria-current":t?"step":void 0,"aria-label":`Go to ${e.label}${t?" (current step)":""}`,className:p(`glass-px-3 glass-py-1.5 glass-radius-full glass-text-sm transition-all duration-[${h.DURATION.fast}ms]`,"ring-1 ring-white/10 bg-glass-fill glass-hover--translate-y-0-5 glass-press glass-ripple","glass-focus glass-touch-target glass-contrast-guard","glass-flex-shrink-0 glass-whitespace-nowrap",t?"glass-text-primary":"glass-text-primary/80"),onClick:v=>g?.(e.id),children:s.jsx("span",{className:p("relative",S&&"glass-pulse-ring"),children:e.label})}),b<r.length-1&&s.jsx("div",{className:"glass-w-8 glass-h-px glass-surface-subtle/15"})]},e.id)})})}try{i.displayName="GlassStepper",i.__docgenInfo={description:"",displayName:"GlassStepper",props:{steps:{defaultValue:{value:`[
  { id: "step1", label: "Step 1" },
  { id: "step2", label: "Step 2" },
  { id: "step3", label: "Step 3" },
]`},description:"",name:"steps",required:!1,type:{name:"Step[] | undefined"}},active:{defaultValue:{value:"DEFAULT_STEPS[0].id"},description:"",name:"active",required:!1,type:{name:"string | undefined"}},onChange:{defaultValue:null,description:"",name:"onChange",required:!1,type:{name:"((id: string) => void) | undefined"}}}}}catch{}const N={title:"Effects + Advanced/Glass Stepper",component:i,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassstepper component."}}},argTypes:{className:{control:"text",description:"Additional CSS classes"},active:{control:"text",description:"Active step ID"}},args:{className:"",active:"step1"}},l={args:{steps:[{id:"step1",label:"Step 1"},{id:"step2",label:"Step 2"},{id:"step3",label:"Step 3"},{id:"step4",label:"Step 4"}],onChange:u()}},n={args:{steps:[{id:"personal",label:"Personal Info"},{id:"account",label:"Account Setup"},{id:"preferences",label:"Preferences",optional:!0},{id:"review",label:"Review"},{id:"complete",label:"Complete"}],active:"account",onChange:u()}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    steps: [{
      id: 'step1',
      label: 'Step 1'
    }, {
      id: 'step2',
      label: 'Step 2'
    }, {
      id: 'step3',
      label: 'Step 3'
    }, {
      id: 'step4',
      label: 'Step 4'
    }],
    onChange: fn()
  }
}`,...l.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    steps: [{
      id: 'personal',
      label: 'Personal Info'
    }, {
      id: 'account',
      label: 'Account Setup'
    }, {
      id: 'preferences',
      label: 'Preferences',
      optional: true
    }, {
      id: 'review',
      label: 'Review'
    }, {
      id: 'complete',
      label: 'Complete'
    }],
    active: 'account',
    onChange: fn()
  }
}`,...n.parameters?.docs?.source}}};const _=["Default","WithOptionalSteps"];export{l as Default,n as WithOptionalSteps,_ as __namedExportsOrder,N as default};
