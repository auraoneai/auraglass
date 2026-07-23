import{G as a,j as s,A as g}from"./iframe-CdDNbo2v.js";import{G as l}from"./GlassButton-DMsLvuTk.js";import{G as f}from"./GlassCard-BLrXR5FH.js";import{G as p}from"./GlassInput-wHUD5Igo.js";import"./preload-helper-PPVm8Dsz.js";import"./LiquidGlassMaterial-C7L_XzpE.js";import"./LiquidGlassLayerProvider-BmiLcxa3.js";import"./a11y-B__vCKol.js";import"./GlassPredictiveEngine-DK146jr5.js";import"./GlassAchievementSystem-k4lcNpEq.js";import"./OptimizedGlassCore-B1nsxF3j.js";import"./deviceCapabilities-CLkD7xxk.js";import"./GlassBiometricAdaptation-QCTxnhMN.js";import"./MotionPreferenceContext-mBLTPWGH.js";import"./GlassEyeTracking-DWqe5kEa.js";import"./GlassSpatialAudio-DMiQlRWH.js";import"./MotionFramer-BwSk7qC9.js";import"./utilsCore-DlqMbNDW.js";const y=`
  .ag-focus-story {
    --glass-text-primary: #f8fafc;
    --glass-text-secondary: #e2e8f0;
    --glass-text-tertiary: #cbd5e1;
    --typography-text-primary: #f8fafc;
    --typography-text-secondary: #e2e8f0;
    width: min(620px, 100%);
    max-width: 100%;
    overflow: visible;
    color: #f8fafc;
  }

  .ag-focus-story,
  .ag-focus-story *,
  .ag-focus-story *::before,
  .ag-focus-story *::after {
    box-sizing: border-box;
  }

  .ag-focus-story .glass-text-primary,
  .ag-focus-story .glass-text-secondary,
  .ag-focus-story h3,
  .ag-focus-story p,
  .ag-focus-story label,
  .ag-focus-story span {
    color: #f8fafc !important;
  }

  .ag-focus-story [data-testid="glass-card"],
  .ag-focus-story .glass-card {
    width: 100% !important;
    max-width: 100% !important;
    overflow: visible !important;
  }

  .ag-focus-story button,
  .ag-focus-story input {
    max-width: 100%;
  }

  .ag-focus-story button {
    background: rgba(15, 23, 42, 0.86) !important;
    color: #f8fafc !important;
    border-color: rgba(226, 232, 240, 0.26) !important;
  }

  @media (max-width: 640px) {
    .ag-focus-story {
      width: calc(100vw - 48px);
      max-width: calc(100vw - 48px);
    }
  }
`,P={title:"Foundations/Accessibility/Glass Focus Indicators",component:a,parameters:{layout:"padded",docs:{description:{component:"Advanced focus management system with animated rings, keyboard navigation, and screen reader integration for WCAG compliance."}}},tags:["autodocs"],decorators:[r=>s.jsx(g,{children:s.jsx(r,{})}),r=>s.jsxs("div",{className:"ag-focus-story",children:[s.jsx("style",{children:y}),s.jsx(r,{})]})]},m=({type:r,label:u,name:x})=>s.jsxs("label",{className:"glass-flex glass-items-center glass-gap-3 glass-radius-lg glass-border glass-border-subtle glass-surface-overlay glass-p-3 glass-text-sm glass-text-primary",children:[s.jsx("input",{type:r,name:x,className:"sr-only",style:{position:"absolute",opacity:0,pointerEvents:"none"}}),s.jsx("span",{"aria-hidden":"true",className:"glass-inline-flex glass-h-5 glass-w-5 glass-flex-shrink-0 glass-items-center glass-justify-center glass-border glass-border-subtle",style:{borderRadius:r==="radio"?"999px":6,background:"rgba(255,255,255,0.5)",boxShadow:"inset 0 1px 0 rgba(255,255,255,0.72)"},children:s.jsx("span",{style:{width:r==="radio"?8:10,height:r==="radio"?8:10,borderRadius:r==="radio"?"999px":3,background:"linear-gradient(135deg, #2563eb, #14b8a6)"}})}),s.jsx("span",{children:u})]}),e=()=>s.jsxs(f,{className:"glass-p-6 glass-space-y-4",style:{width:"100%",maxWidth:"100%",overflow:"visible"},children:[s.jsx("h3",{className:"glass-text-lg glass-font-semibold",children:"Focus Indicator Demo"}),s.jsx("p",{className:"glass-text-sm glass-text-secondary",children:"Use Tab to navigate between elements and see the focus indicators in action."}),s.jsxs("div",{className:"glass-space-y-3",children:[s.jsx(p,{placeholder:"First input field",label:"Name"}),s.jsx(p,{placeholder:"Second input field",label:"Email",type:"email"}),s.jsxs("div",{className:"glass-flex glass-flex-wrap glass-gap-3",children:[s.jsx(l,{children:"Primary Button"}),s.jsx(l,{variant:"secondary",children:"Secondary Button"}),s.jsx(l,{variant:"ghost",children:"Ghost Button"})]}),s.jsx(m,{type:"checkbox",label:"Checkbox option"}),s.jsx(m,{type:"radio",name:"demo",label:"Radio option 1"}),s.jsx(m,{type:"radio",name:"demo",label:"Radio option 2"})]})]}),o={render:()=>s.jsxs("div",{children:[s.jsx(a,{}),s.jsx(e,{})]})},t={render:()=>s.jsxs("div",{children:[s.jsx(a,{}),s.jsx(e,{})]})},i={render:()=>s.jsxs("div",{children:[s.jsx(a,{}),s.jsx(e,{})]})},n={decorators:[r=>s.jsx(g,{initialSettings:{highContrast:!0},children:s.jsx(r,{})})],render:()=>s.jsxs("div",{children:[s.jsx(a,{}),s.jsx(e,{})]})},c={render:()=>s.jsxs("div",{children:[s.jsx(a,{}),s.jsx(e,{})]})},d={render:()=>s.jsxs("div",{children:[s.jsx(a,{}),s.jsx(e,{})]})};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => <div>
      <GlassFocusIndicators />
      <DemoForm />
    </div>
}`,...o.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: () => <div>
      <GlassFocusIndicators />
      <DemoForm />
    </div>
}`,...t.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: () => <div>
      <GlassFocusIndicators />
      <DemoForm />
    </div>
}`,...i.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  decorators: [Story => <AccessibilityProvider initialSettings={{
    highContrast: true
  }}>
        <Story />
      </AccessibilityProvider>],
  render: () => <div>
      <GlassFocusIndicators />
      <DemoForm />
    </div>
}`,...n.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => <div>
      <GlassFocusIndicators />
      <DemoForm />
    </div>
}`,...c.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => <div>
      <GlassFocusIndicators />
      <DemoForm />
    </div>
}`,...d.parameters?.docs?.source}}};const O=["Default","OutlineVariant","GlowVariant","HighContrast","DangerColor","AlwaysVisible"];export{d as AlwaysVisible,c as DangerColor,o as Default,i as GlowVariant,n as HighContrast,t as OutlineVariant,O as __namedExportsOrder,P as default};
