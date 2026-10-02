import{G as r,j as s,A as m}from"./iframe-DFMMcocb.js";import{G as l}from"./GlassButton-XgI0pEAb.js";import{G as b}from"./GlassCard-egFn2GxY.js";import{G as g}from"./GlassInput-Dm4A5juN.js";import"./preload-helper-PPVm8Dsz.js";import"./LiquidGlassMaterial-D8CGevp8.js";import"./LiquidGlassLayerProvider-B-mIHSJM.js";import"./a11y-Q0mX7KvA.js";import"./GlassPredictiveEngine-D_3E50m3.js";import"./GlassAchievementSystem-BqTd0FRN.js";import"./OptimizedGlassCore-1D6AE-uZ.js";import"./deviceCapabilities-iDxBLJQX.js";import"./GlassBiometricAdaptation-CNYoTdw5.js";import"./MotionPreferenceContext-VYRcsRrk.js";import"./GlassEyeTracking-DFVitI9H.js";import"./GlassSpatialAudio-BRwfDyUV.js";import"./MotionFramer-Cvto7X39.js";import"./utilsCore-D5Hayjvj.js";const h=`
  .ag-focus-story {
    --glass-text-primary: #0f172a;
    --glass-text-secondary: #334155;
    --glass-text-tertiary: #475569;
    --typography-text-primary: #0f172a;
    --typography-text-secondary: #334155;
    width: min(620px, 100%);
    max-width: 100%;
    overflow: visible;
    color: #0f172a;
    --glass-focus-shadow-primary: 0 0 14px rgba(28, 28, 30, 0.18);
    --glass-focus-shadow-interactive: 0 0 18px rgba(28, 28, 30, 0.2);
    --glass-focus-shadow-navigation: 0 0 14px rgba(28, 28, 30, 0.18);
    --glass-focus-shadow-form: 0 0 14px rgba(28, 28, 30, 0.18);
  }

  .ag-focus-story::before {
    content: '';
    position: fixed;
    inset: 0;
    z-index: -1;
    background:
      radial-gradient(circle at 24% 14%, rgba(255, 255, 255, 0.98), transparent 38%),
      linear-gradient(145deg, #fafafa, #e9e9e9);
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
    color: #0f172a !important;
  }

  .ag-focus-story [data-testid="glass-card"],
  .ag-focus-story .glass-card {
    width: 100% !important;
    max-width: 100% !important;
    overflow: visible !important;
    background: linear-gradient(145deg, rgba(255, 255, 255, 0.30), rgba(255, 255, 255, 0.16)) !important;
    background-color: rgba(255, 255, 255, 0.18) !important;
    border-color: rgba(255, 255, 255, 0.28) !important;
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.28), inset 0 0 12px rgba(255,255,255,0.12), 0 20px 48px rgba(20,20,20,0.12) !important;
    backdrop-filter: blur(24px) saturate(1.4) brightness(1.04) contrast(1.02) !important;
    -webkit-backdrop-filter: blur(24px) saturate(1.4) brightness(1.04) contrast(1.02) !important;
  }

  .ag-focus-story label {
    background: linear-gradient(145deg, rgba(255, 255, 255, 0.30), rgba(255, 255, 255, 0.16)) !important;
    background-color: rgba(255, 255, 255, 0.18) !important;
    border-color: rgba(255, 255, 255, 0.28) !important;
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.28), inset 0 0 10px rgba(255,255,255,0.12), 0 8px 22px rgba(20,20,20,0.08) !important;
  }

  .ag-focus-story button,
  .ag-focus-story input {
    max-width: 100%;
  }

  .ag-focus-story button:not([data-button-variant='ghost']) {
    min-height: 40px;
    padding-inline: 16px;
    background: linear-gradient(145deg, rgba(255, 255, 255, 0.28), rgba(255, 255, 255, 0.14)) !important;
    background-color: rgba(255, 255, 255, 0.16) !important;
    color: #0f172a !important;
    border-color: rgba(255, 255, 255, 0.48) !important;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.28), inset 0 0 10px rgba(255, 255, 255, 0.14), 0 10px 28px rgba(20, 20, 20, 0.12) !important;
    backdrop-filter: blur(24px) saturate(1.4) brightness(1.04) contrast(1.02) !important;
    -webkit-backdrop-filter: blur(24px) saturate(1.4) brightness(1.04) contrast(1.02) !important;
  }

  .ag-focus-story button[data-button-variant='ghost'] {
    min-height: 40px;
    padding-inline: 16px;
    background: rgba(255, 255, 255, 0.16) !important;
    color: #0f172a !important;
    border-color: rgba(255, 255, 255, 0.24) !important;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.22), inset 0 0 10px rgba(255, 255, 255, 0.12) !important;
  }

  @media (max-width: 640px) {
    .ag-focus-story {
      width: calc(100vw - 48px);
      max-width: calc(100vw - 48px);
    }
  }
`,P={title:"Foundations/Accessibility/Glass Focus Indicators",component:r,parameters:{layout:"padded",docs:{description:{component:"Advanced focus management system with animated rings, keyboard navigation, and screen reader integration for WCAG compliance."}}},tags:["autodocs"],decorators:[a=>s.jsx(m,{children:s.jsx(a,{})}),a=>s.jsxs("div",{className:"ag-focus-story",children:[s.jsx("style",{children:h}),s.jsx(a,{})]})]},p=({type:a,label:x,name:u})=>s.jsxs("label",{className:"glass-flex glass-items-center glass-gap-3 glass-radius-lg glass-border glass-border-subtle glass-surface-overlay glass-p-3 glass-text-sm glass-text-primary",children:[s.jsx("input",{type:a,name:u,className:"sr-only",style:{position:"absolute",opacity:0,pointerEvents:"none"}}),s.jsx("span",{"aria-hidden":"true",className:"glass-inline-flex glass-h-5 glass-w-5 glass-flex-shrink-0 glass-items-center glass-justify-center glass-border glass-border-subtle",style:{borderRadius:a==="radio"?"999px":6,background:"rgba(255,255,255,0.5)",boxShadow:"inset 0 1px 0 rgba(255,255,255,0.72)"},children:s.jsx("span",{style:{width:a==="radio"?8:10,height:a==="radio"?8:10,borderRadius:a==="radio"?"999px":3,background:"#26303d"}})}),s.jsx("span",{children:x})]}),o=()=>s.jsxs(b,{className:"glass-p-6 glass-space-y-4",style:{width:"100%",maxWidth:"100%",overflow:"visible"},children:[s.jsx("h3",{className:"glass-text-lg glass-font-semibold",children:"Focus Indicator Demo"}),s.jsx("p",{className:"glass-text-sm glass-text-secondary",children:"Use Tab to navigate between elements and see the focus indicators in action."}),s.jsxs("div",{className:"glass-space-y-3",children:[s.jsx(g,{placeholder:"First input field",label:"Name"}),s.jsx(g,{placeholder:"Second input field",label:"Email",type:"email"}),s.jsxs("div",{className:"glass-flex glass-flex-wrap glass-gap-3",children:[s.jsx(l,{variant:"default",children:"Primary Button"}),s.jsx(l,{variant:"secondary",children:"Secondary Button"}),s.jsx(l,{variant:"ghost",children:"Ghost Button"})]}),s.jsx(p,{type:"checkbox",label:"Checkbox option"}),s.jsx(p,{type:"radio",name:"demo",label:"Radio option 1"}),s.jsx(p,{type:"radio",name:"demo",label:"Radio option 2"})]})]}),t={render:()=>s.jsxs("div",{children:[s.jsx(r,{}),s.jsx(o,{})]})},e={render:()=>s.jsxs("div",{children:[s.jsx(r,{}),s.jsx(o,{})]})},i={render:()=>s.jsxs("div",{children:[s.jsx(r,{}),s.jsx(o,{})]})},n={decorators:[a=>s.jsx(m,{initialSettings:{highContrast:!0},children:s.jsx(a,{})})],render:()=>s.jsxs("div",{children:[s.jsx(r,{}),s.jsx(o,{})]})},c={render:()=>s.jsxs("div",{children:[s.jsx(r,{}),s.jsx(o,{})]})},d={render:()=>s.jsxs("div",{children:[s.jsx(r,{}),s.jsx(o,{})]})};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: () => <div>
      <GlassFocusIndicators />
      <DemoForm />
    </div>
}`,...t.parameters?.docs?.source}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  render: () => <div>
      <GlassFocusIndicators />
      <DemoForm />
    </div>
}`,...e.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
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
}`,...d.parameters?.docs?.source}}};const O=["Default","OutlineVariant","GlowVariant","HighContrast","DangerColor","AlwaysVisible"];export{d as AlwaysVisible,c as DangerColor,t as Default,i as GlowVariant,n as HighContrast,e as OutlineVariant,O as __namedExportsOrder,P as default};
