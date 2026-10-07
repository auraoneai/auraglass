import{A as c,j as s,u as p}from"./iframe-RsoZoStf.js";import{G as m}from"./GlassButton-BmzykaoH.js";import{G as b}from"./GlassCard-CbtK8PY3.js";import"./preload-helper-PPVm8Dsz.js";import"./LiquidGlassMaterial-GdijC9oA.js";import"./LiquidGlassLayerProvider-BQssgZYr.js";import"./a11y-WSL2JlLl.js";import"./GlassPredictiveEngine-xQEpY0TP.js";import"./GlassAchievementSystem-Bhc5NHtk.js";import"./OptimizedGlassCore-IzbAukgr.js";import"./deviceCapabilities-CB0YcTGX.js";import"./GlassBiometricAdaptation-B9HDXiFX.js";import"./MotionPreferenceContext-B3rOXnSa.js";import"./GlassEyeTracking-CJXggKsV.js";import"./GlassSpatialAudio-nY9QSvQ1.js";import"./MotionFramer-tKl7gvze.js";import"./utilsCore-DLcXNkaQ.js";const G={title:"Foundations/Accessibility/Accessibility Provider",component:c,parameters:{layout:"fullscreen",docs:{description:{component:"Accessibility context provider for managing WCAG compliance settings across the application."}}},tags:["autodocs"]},y=`
  .ag-accessibility-story {
    --glass-text-primary: #0f172a;
    --glass-text-secondary: #334155;
    --glass-text-tertiary: #475569;
    --typography-text-primary: #0f172a;
    --typography-text-secondary: #334155;
    height: 100vh;
    min-height: 100vh;
    width: 100%;
    overflow: auto;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    background:
      radial-gradient(circle at 18% 10%, rgba(255, 255, 255, 0.98), transparent 38%),
      linear-gradient(145deg, #fafafa 0%, #ececec 100%);
    color: #0f172a;
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
    color: #0f172a !important;
  }

  .ag-accessibility-story pre {
    max-width: 100%;
    overflow-x: auto;
    color: #0f172a !important;
    background: linear-gradient(145deg, rgba(255, 255, 255, 0.30), rgba(255, 255, 255, 0.16)) !important;
    background-color: rgba(255, 255, 255, 0.18) !important;
    border: 1px solid rgba(255, 255, 255, 0.88) !important;
    backdrop-filter: blur(24px) saturate(1.4) brightness(1.04) contrast(1.02) !important;
    -webkit-backdrop-filter: blur(24px) saturate(1.4) brightness(1.04) contrast(1.02) !important;
  }

  .ag-accessibility-story label,
  .ag-accessibility-story [data-testid="glass-card"],
  .ag-accessibility-story .glass-card {
    background: linear-gradient(145deg, rgba(255, 255, 255, 0.30), rgba(255, 255, 255, 0.16)) !important;
    background-color: rgba(255, 255, 255, 0.18) !important;
    border-color: rgba(255, 255, 255, 0.9) !important;
    backdrop-filter: blur(24px) saturate(1.4) brightness(1.04) contrast(1.02) !important;
    -webkit-backdrop-filter: blur(24px) saturate(1.4) brightness(1.04) contrast(1.02) !important;
    color: #0f172a !important;
  }

  .ag-accessibility-story .glass-foundation-complete {
    background: linear-gradient(145deg, rgba(255, 255, 255, 0.32), rgba(255, 255, 255, 0.18)) !important;
    background-color: rgba(255, 255, 255, 0.20) !important;
    border-color: rgba(255, 255, 255, 0.92) !important;
    backdrop-filter: blur(24px) saturate(1.4) brightness(1.04) contrast(1.02) !important;
    -webkit-backdrop-filter: blur(24px) saturate(1.4) brightness(1.04) contrast(1.02) !important;
  }

  .ag-accessibility-story button {
    color: #0f172a !important;
    min-height: 40px;
    padding-inline: 16px;
  }

  .ag-accessibility-story__reset {
    display: flex;
    margin-top: 20px;
  }

  @media (max-width: 640px) {
    .ag-accessibility-story {
      padding: 16px;
    }
  }
`,g=({children:a})=>s.jsxs("div",{className:"ag-accessibility-story glass-contrast-guard",children:[s.jsx("style",{children:y}),a]}),r=({label:a,checked:t,onChange:n})=>s.jsxs("label",{className:"glass-flex glass-items-center glass-justify-between glass-gap-4 glass-radius-lg glass-border glass-border-subtle glass-surface-overlay glass-p-3 glass-text-sm glass-text-primary",children:[s.jsx("span",{children:a}),s.jsx("input",{type:"checkbox",checked:t,onChange:e=>n(e.target.checked),className:"sr-only",style:{position:"absolute",opacity:0,pointerEvents:"none"}}),s.jsx("span",{"aria-hidden":"true",className:"glass-relative glass-inline-flex glass-h-6 glass-w-11 glass-flex-shrink-0 glass-radius-full glass-border glass-border-subtle",style:{background:t?"linear-gradient(135deg, rgba(255,255,255,0.62), rgba(203,213,225,0.54))":"rgba(255,255,255,0.44)",boxShadow:t?"inset 0 1px 0 rgba(255,255,255,0.86), inset 0 0 0 1px rgba(15,23,42,0.16), 0 5px 14px rgba(15,23,42,0.10)":"inset 0 1px 0 rgba(255,255,255,0.78)"},children:s.jsx("span",{className:"glass-absolute glass-h-5 glass-w-5 glass-radius-full",style:{left:t?21:2,top:2,background:t?"#26303d":"#ffffff",boxShadow:"0 2px 8px rgba(15,23,42,0.18)",transition:"left 160ms ease"}})})]}),d=()=>{const{settings:a,updateSettings:t,resetToDefaults:n}=p();return s.jsxs("div",{className:"glass-p-6",style:{width:"min(760px, 100%)",maxWidth:"100%",display:"flex",flexDirection:"column",gap:16},children:[s.jsxs(b,{className:"glass-p-6",children:[s.jsx("h2",{className:"glass-text-xl glass-font-semibold glass-mb-4",children:"Accessibility Settings"}),s.jsxs("div",{className:"glass-grid glass-gap-3",style:{gridTemplateColumns:"repeat(auto-fit, minmax(min(220px, 100%), 1fr))"},children:[s.jsx(r,{label:"Focus Indicators",checked:a.focusIndicators,onChange:e=>t({focusIndicators:e})}),s.jsx(r,{label:"High Contrast",checked:a.highContrast,onChange:e=>t({highContrast:e})}),s.jsx(r,{label:"Reduced Motion",checked:a.reducedMotion,onChange:e=>t({reducedMotion:e})}),s.jsx(r,{label:"Large Text",checked:a.largeText,onChange:e=>t({largeText:e})})]}),s.jsx("div",{className:"ag-accessibility-story__reset","data-accessibility-reset-row":!0,children:s.jsx(m,{variant:"default",onClick:n,children:"Reset to Defaults"})})]}),s.jsxs(b,{className:"glass-p-6",children:[s.jsx("h3",{className:"glass-text-lg glass-font-semibold glass-mb-2",children:"Current Settings"}),s.jsx("pre",{className:"glass-text-sm glass-surface-subtle glass-p-2 glass-radius",children:JSON.stringify(a,null,2)})]})]})},i={render:()=>s.jsx(g,{children:s.jsx(c,{children:s.jsx(d,{})})})},o={render:()=>s.jsx(g,{children:s.jsx(c,{initialSettings:{highContrast:!0},children:s.jsx(d,{})})})},l={render:()=>s.jsx(g,{children:s.jsx(c,{initialSettings:{reducedMotion:!0},children:s.jsx(d,{})})})};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: () => <AccessibilityStoryFrame>
      <AccessibilityProvider>
        <AccessibilityDemo />
      </AccessibilityProvider>
    </AccessibilityStoryFrame>
}`,...i.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => <AccessibilityStoryFrame>
      <AccessibilityProvider initialSettings={{
      highContrast: true
    }}>
        <AccessibilityDemo />
      </AccessibilityProvider>
    </AccessibilityStoryFrame>
}`,...o.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <AccessibilityStoryFrame>
      <AccessibilityProvider initialSettings={{
      reducedMotion: true
    }}>
        <AccessibilityDemo />
      </AccessibilityProvider>
    </AccessibilityStoryFrame>
}`,...l.parameters?.docs?.source}}};const R=["Default","HighContrast","ReducedMotion"];export{i as Default,o as HighContrast,l as ReducedMotion,R as __namedExportsOrder,G as default};
