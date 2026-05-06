import{j as s,c as g}from"./iframe-C2Py7iTP.js";import{f as e}from"./index-CLSxArU-.js";import"./preload-helper-PPVm8Dsz.js";import"./index-ByImX2pa.js";function r({steps:l=[],current:n=0,onNext:c=()=>{},onPrev:d=()=>{},onClose:o=()=>{},className:m,"data-testid":p,...u}){const i=(Array.isArray(l)?l:[])[n];return i?s.jsxs("div",{"data-glass-component":!0,className:g("fixed inset-0 z-[2000]",m),"data-testid":p,...u,children:[s.jsx("div",{className:"glass-absolute glass-inset-0 glass-surface-dark/60",onClick:o}),s.jsx("div",{className:"glass-absolute glass-inset-x-0 glass-bottom-10 glass-mx-auto glass-w-full glass-max-w-xl",children:s.jsxs("div",{className:"glass-radius-2xl glass-surface-subtle/10 glass-border glass-border-white/20 glass-p-4 glass-mx-4 glass-text-primary",children:[s.jsx("div",{className:"glass-mb-3",children:i.content}),s.jsxs("div",{className:"glass-flex glass-justify-between",children:[s.jsx("button",{className:"glass-px-3 glass-py-1 glass-radius-md glass-surface-subtle/10 glass-focus glass-touch-target glass-contrast-guard",onClick:d,disabled:n===0,children:"Back"}),s.jsxs("div",{className:"glass-gap-2",children:[s.jsx("button",{className:"glass-px-3 glass-py-1 glass-radius-md glass-surface-subtle/10 glass-focus glass-touch-target glass-contrast-guard",onClick:o,children:"Close"}),s.jsx("button",{className:"glass-px-3 glass-py-1 glass-radius-md glass-surface-blue glass-text-primary glass-focus glass-touch-target glass-contrast-guard",onClick:c,children:"Next"})]})]})]})})]}):null}try{r.displayName="GlassCoachmarks",r.__docgenInfo={description:"",displayName:"GlassCoachmarks",props:{steps:{defaultValue:{value:"[]"},description:"",name:"steps",required:!1,type:{name:"CoachmarkStep[]"}},current:{defaultValue:{value:"0"},description:"",name:"current",required:!1,type:{name:"number"}},onNext:{defaultValue:{value:"() => {}"},description:"",name:"onNext",required:!1,type:{name:"() => void"}},onPrev:{defaultValue:{value:"() => {}"},description:"",name:"onPrev",required:!1,type:{name:"() => void"}},onClose:{defaultValue:{value:"() => {}"},description:"",name:"onClose",required:!1,type:{name:"() => void"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string | undefined"}},"data-testid":{defaultValue:null,description:"",name:"data-testid",required:!1,type:{name:"string | undefined"}}}}}catch{}const v={title:"Components/Interactive/GlassCoachmarks",component:r,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glasscoachmarks component."}}},argTypes:{steps:{control:"object",description:"Array of coachmark steps"},current:{control:"number",description:"Current step index"}},args:{steps:[{id:"1",content:s.jsxs("div",{children:[s.jsx("h3",{className:"glass-font-semibold glass-mb-2",children:"Welcome to GlassCoachmarks!"}),s.jsx("p",{className:"glass-text-sm",children:"This is your first step in the guided tour."})]})},{id:"2",content:s.jsxs("div",{children:[s.jsx("h3",{className:"glass-font-semibold glass-mb-2",children:"Step 2"}),s.jsx("p",{className:"glass-text-sm",children:"Learn about the features available."})]})}],current:0}},a={args:{steps:[{id:"welcome",content:s.jsxs("div",{children:[s.jsx("h3",{className:"glass-font-semibold glass-mb-2",children:"Welcome!"}),s.jsx("p",{className:"glass-text-sm",children:"This is a guided tour of the application."})]})}],current:0,onNext:e(),onPrev:e(),onClose:e()}},t={args:{steps:[{id:"step1",content:s.jsxs("div",{children:[s.jsx("h3",{className:"glass-font-semibold glass-mb-2",children:"Step 1"}),s.jsx("p",{className:"glass-text-sm",children:"First step in the tour."})]})},{id:"step2",content:s.jsxs("div",{children:[s.jsx("h3",{className:"glass-font-semibold glass-mb-2",children:"Step 2"}),s.jsx("p",{className:"glass-text-sm",children:"Second step with more information."})]})},{id:"step3",content:s.jsxs("div",{children:[s.jsx("h3",{className:"glass-font-semibold glass-mb-2",children:"Step 3"}),s.jsx("p",{className:"glass-text-sm",children:"Final step of the tour."})]})}],current:1,onNext:e(),onPrev:e(),onClose:e()}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    steps: [{
      id: 'welcome',
      content: <div>
            <h3 className="glass-font-semibold glass-mb-2">Welcome!</h3>
            <p className="glass-text-sm">This is a guided tour of the application.</p>
          </div>
    }],
    current: 0,
    onNext: fn(),
    onPrev: fn(),
    onClose: fn()
  }
}`,...a.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    steps: [{
      id: 'step1',
      content: <div>
            <h3 className="glass-font-semibold glass-mb-2">Step 1</h3>
            <p className="glass-text-sm">First step in the tour.</p>
          </div>
    }, {
      id: 'step2',
      content: <div>
            <h3 className="glass-font-semibold glass-mb-2">Step 2</h3>
            <p className="glass-text-sm">Second step with more information.</p>
          </div>
    }, {
      id: 'step3',
      content: <div>
            <h3 className="glass-font-semibold glass-mb-2">Step 3</h3>
            <p className="glass-text-sm">Final step of the tour.</p>
          </div>
    }],
    current: 1,
    onNext: fn(),
    onPrev: fn(),
    onClose: fn()
  }
}`,...t.parameters?.docs?.source}}};const j=["Default","MultiStep"];export{a as Default,t as MultiStep,j as __namedExportsOrder,v as default};
