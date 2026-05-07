import{A as l,j as s,u as y}from"./iframe-BJUPYBdj.js";import{G as p}from"./GlassButton-B47sqpMX.js";import{G as m}from"./GlassCard-DUXQaFKk.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CVvdFpfh.js";import"./LiquidGlassMaterial-BudbaD-0.js";import"./LiquidGlassLayerProvider-BOlOA680.js";import"./a11y-Cl5jzkbw.js";import"./GlassPredictiveEngine-yiru1Zak.js";import"./GlassAchievementSystem-BNWOa4S7.js";import"./OptimizedGlassCore-n2ERVMDY.js";import"./deviceCapabilities-C60oOEa3.js";import"./GlassBiometricAdaptation-CF628xeO.js";import"./MotionPreferenceContext-dbV6fYo1.js";import"./GlassEyeTracking-CJYTwkOd.js";import"./GlassSpatialAudio-BUzWn3vB.js";import"./MotionFramer-DEr7b4H0.js";import"./utilsCore-Djkk-eL4.js";const T={title:"Foundations/Accessibility/Accessibility Provider",component:l,parameters:{layout:"fullscreen",docs:{description:{component:"Accessibility context provider for managing WCAG compliance settings across the application."}}},tags:["autodocs"]},b=`
  .ag-accessibility-story {
    --glass-text-primary: #f8fafc;
    --glass-text-secondary: #e2e8f0;
    --glass-text-tertiary: #cbd5e1;
    --typography-text-primary: #f8fafc;
    --typography-text-secondary: #e2e8f0;
    height: 100vh;
    min-height: 100vh;
    width: 100%;
    overflow: auto;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    background:
      radial-gradient(circle at 18% 12%, rgba(59, 130, 246, 0.28), transparent 32%),
      radial-gradient(circle at 84% 20%, rgba(20, 184, 166, 0.22), transparent 30%),
      linear-gradient(135deg, #0f172a 0%, #1e1b4b 48%, #164e63 100%);
    color: #f8fafc;
    padding: clamp(16px, 4vw, 32px);
  }

  .ag-accessibility-story,
  .ag-accessibility-story *,
  .ag-accessibility-story *::before,
  .ag-accessibility-story *::after {
    box-sizing: border-box;
  }

  .ag-accessibility-story .glass-text-primary,
  .ag-accessibility-story .glass-text-secondary,
  .ag-accessibility-story h2,
  .ag-accessibility-story h3,
  .ag-accessibility-story span {
    color: #f8fafc !important;
  }

  .ag-accessibility-story pre {
    max-width: 100%;
    overflow-x: auto;
    color: #f8fafc !important;
    background: rgba(15, 23, 42, 0.78) !important;
  }

  .ag-accessibility-story label,
  .ag-accessibility-story [data-testid="glass-card"],
  .ag-accessibility-story .glass-card {
    background: rgba(15, 23, 42, 0.72) !important;
    color: #f8fafc !important;
  }

  .ag-accessibility-story button {
    color: #f8fafc !important;
  }

  @media (max-width: 640px) {
    .ag-accessibility-story {
      padding: 16px;
    }
  }
`,g=({children:e})=>s.jsxs("div",{className:"ag-accessibility-story glass-contrast-guard",children:[s.jsx("style",{children:b}),e]}),a=({label:e,checked:i,onChange:n})=>s.jsxs("label",{className:"glass-flex glass-items-center glass-justify-between glass-gap-4 glass-radius-lg glass-border glass-border-subtle glass-surface-overlay glass-p-3 glass-text-sm glass-text-primary",children:[s.jsx("span",{children:e}),s.jsx("input",{type:"checkbox",checked:i,onChange:t=>n(t.target.checked),className:"sr-only",style:{position:"absolute",opacity:0,pointerEvents:"none"}}),s.jsx("span",{"aria-hidden":"true",className:"glass-relative glass-inline-flex glass-h-6 glass-w-11 glass-flex-shrink-0 glass-radius-full glass-border glass-border-subtle",style:{background:i?"linear-gradient(135deg, rgba(37,99,235,0.78), rgba(20,184,166,0.72))":"rgba(255,255,255,0.48)"},children:s.jsx("span",{className:"glass-absolute glass-h-5 glass-w-5 glass-radius-full",style:{left:i?21:2,top:2,background:"#fff",boxShadow:"0 2px 8px rgba(15,23,42,0.22)",transition:"left 160ms ease"}})})]}),d=()=>{const{settings:e,updateSettings:i,resetToDefaults:n}=y();return s.jsxs("div",{className:"glass-p-6",style:{width:"min(760px, 100%)",maxWidth:"100%",display:"flex",flexDirection:"column",gap:16},children:[s.jsxs(m,{className:"glass-p-6",children:[s.jsx("h2",{className:"glass-text-xl glass-font-semibold glass-mb-4",children:"Accessibility Settings"}),s.jsxs("div",{className:"glass-grid glass-gap-3",style:{gridTemplateColumns:"repeat(auto-fit, minmax(220px, 1fr))"},children:[s.jsx(a,{label:"Focus Indicators",checked:e.focusIndicators,onChange:t=>i({focusIndicators:t})}),s.jsx(a,{label:"High Contrast",checked:e.highContrast,onChange:t=>i({highContrast:t})}),s.jsx(a,{label:"Reduced Motion",checked:e.reducedMotion,onChange:t=>i({reducedMotion:t})}),s.jsx(a,{label:"Large Text",checked:e.largeText,onChange:t=>i({largeText:t})})]}),s.jsx("div",{className:"mt-4",children:s.jsx(p,{onClick:n,children:"Reset to Defaults"})})]}),s.jsxs(m,{className:"glass-p-6",children:[s.jsx("h3",{className:"glass-text-lg glass-font-semibold glass-mb-2",children:"Current Settings"}),s.jsx("pre",{className:"glass-text-sm glass-surface-subtle glass-p-2 glass-radius",children:JSON.stringify(e,null,2)})]})]})},r={render:()=>s.jsx(g,{children:s.jsx(l,{children:s.jsx(d,{})})})},c={render:()=>s.jsx(g,{children:s.jsx(l,{initialSettings:{highContrast:!0},children:s.jsx(d,{})})})},o={render:()=>s.jsx(g,{children:s.jsx(l,{initialSettings:{reducedMotion:!0},children:s.jsx(d,{})})})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  render: () => <AccessibilityStoryFrame>
      <AccessibilityProvider>
        <AccessibilityDemo />
      </AccessibilityProvider>
    </AccessibilityStoryFrame>
}`,...r.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => <AccessibilityStoryFrame>
      <AccessibilityProvider initialSettings={{
      highContrast: true
    }}>
        <AccessibilityDemo />
      </AccessibilityProvider>
    </AccessibilityStoryFrame>
}`,...c.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => <AccessibilityStoryFrame>
      <AccessibilityProvider initialSettings={{
      reducedMotion: true
    }}>
        <AccessibilityDemo />
      </AccessibilityProvider>
    </AccessibilityStoryFrame>
}`,...o.parameters?.docs?.source}}};const E=["Default","HighContrast","ReducedMotion"];export{r as Default,c as HighContrast,o as ReducedMotion,E as __namedExportsOrder,T as default};
