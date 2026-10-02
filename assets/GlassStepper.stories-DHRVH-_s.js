import{r as c,j as e,c as i,b as v}from"./iframe-DFMMcocb.js";import{f as g}from"./index-DdjpOZjl.js";import"./preload-helper-PPVm8Dsz.js";import"./index-ByImX2pa.js";const d=[{id:"step1",label:"Step 1"},{id:"step2",label:"Step 2"},{id:"step3",label:"Step 3"}];function p({steps:s=d,active:t=d[0].id,onChange:u,className:m,...f}){const o=c.useRef(null);return c.useEffect(()=>{o.current=t},[t]),e.jsx("div",{"data-glass-component":!0,className:i("glass-flex glass-flex-wrap glass-items-center glass-justify-center glass-gap-3 glass-w-full glass-min-w-0",m),...f,children:s.map((a,b)=>{const l=a.id===t,S=l&&o.current!==t;return e.jsxs("div",{className:"glass-flex glass-items-center glass-gap-3",children:[e.jsx("button",{type:"button","aria-current":l?"step":void 0,"aria-label":`Go to ${a.label}${l?" (current step)":""}`,className:i(`glass-px-3 glass-py-1.5 glass-radius-full glass-text-sm transition-all duration-[${v.DURATION.fast}ms]`,"ring-1 ring-white/10 bg-glass-fill glass-hover--translate-y-0-5 glass-press glass-ripple","glass-focus glass-touch-target glass-contrast-guard","glass-flex-shrink-0 glass-whitespace-nowrap",l?"glass-text-primary":"glass-text-primary/80"),onClick:x=>u?.(a.id),children:e.jsx("span",{className:i("relative",S&&"glass-pulse-ring"),children:a.label})}),b<s.length-1&&e.jsx("div",{className:"glass-w-8 glass-h-px glass-surface-subtle/15"})]},a.id)})})}try{p.displayName="GlassStepper",p.__docgenInfo={description:"",displayName:"GlassStepper",props:{steps:{defaultValue:{value:`[
  { id: "step1", label: "Step 1" },
  { id: "step2", label: "Step 2" },
  { id: "step3", label: "Step 3" },
]`},description:"",name:"steps",required:!1,type:{name:"Step[] | undefined"}},active:{defaultValue:{value:"DEFAULT_STEPS[0].id"},description:"",name:"active",required:!1,type:{name:"string | undefined"}},onChange:{defaultValue:null,description:"",name:"onChange",required:!1,type:{name:"((id: string) => void) | undefined"}}}}}catch{}const w={title:"Effects + Advanced/Glass Stepper",component:p,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassstepper component."}}},argTypes:{className:{control:"text",description:"Additional CSS classes"},active:{control:"text",description:"Active step ID"}},args:{className:"",active:"step1"}},n={render:s=>e.jsx("div",{className:"glass-neutral-level1 glass-rounded-3xl glass-p-6",children:e.jsx(p,{...s})}),args:{steps:[{id:"step1",label:"Step 1"},{id:"step2",label:"Step 2"},{id:"step3",label:"Step 3"},{id:"step4",label:"Step 4"}],className:"",onChange:g()}},r={args:{steps:[{id:"personal",label:"Personal Info"},{id:"account",label:"Account Setup"},{id:"preferences",label:"Preferences",optional:!0},{id:"review",label:"Review"},{id:"complete",label:"Complete"}],active:"account",onChange:g()}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-neutral-level1 glass-rounded-3xl glass-p-6">
      <GlassStepper {...args} />
    </div>,
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
    className: '',
    onChange: fn()
  }
}`,...n.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
}`,...r.parameters?.docs?.source}}};const _=["Default","WithOptionalSteps"];export{n as Default,r as WithOptionalSteps,_ as __namedExportsOrder,w as default};
