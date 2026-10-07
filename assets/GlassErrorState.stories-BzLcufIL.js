import{j as t}from"./iframe-RsoZoStf.js";import{G as a}from"./GlassErrorState-BIJu4qzF.js";import"./preload-helper-PPVm8Dsz.js";import"./components-DwI53NlZ.js";import"./GlassButton-BmzykaoH.js";import"./LiquidGlassMaterial-GdijC9oA.js";import"./LiquidGlassLayerProvider-BQssgZYr.js";import"./a11y-WSL2JlLl.js";import"./GlassPredictiveEngine-xQEpY0TP.js";import"./GlassAchievementSystem-Bhc5NHtk.js";import"./OptimizedGlassCore-IzbAukgr.js";import"./deviceCapabilities-CB0YcTGX.js";import"./GlassBiometricAdaptation-B9HDXiFX.js";import"./MotionPreferenceContext-B3rOXnSa.js";import"./GlassEyeTracking-CJXggKsV.js";import"./GlassSpatialAudio-nY9QSvQ1.js";import"./MotionFramer-tKl7gvze.js";import"./utilsCore-DLcXNkaQ.js";const E={title:"Data + Visualization/Glass Error State",component:a,parameters:{layout:"centered",previewSurface:"component"},args:{title:"Analytics are temporarily unavailable",description:"We could not refresh this workspace. Your existing data is safe.",retryLabel:"Try again",onRetry:()=>{},details:"Request ID: AG-1048 · Last successful sync: 2 minutes ago"}},e={render:s=>t.jsx("div",{style:{width:"min(620px, calc(100vw - 48px))"},children:t.jsx(a,{...s})})},r={args:{severity:"warning",title:"Some metrics may be delayed",description:"The latest warehouse sync is still processing.",details:void 0},render:s=>t.jsx("div",{style:{width:"min(620px, calc(100vw - 48px))"},children:t.jsx(a,{...s})})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  render: args => <div style={{
    width: "min(620px, calc(100vw - 48px))"
  }}>
      <GlassErrorState {...args} />
    </div>
}`,...e.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    severity: "warning",
    title: "Some metrics may be delayed",
    description: "The latest warehouse sync is still processing.",
    details: undefined
  },
  render: args => <div style={{
    width: "min(620px, calc(100vw - 48px))"
  }}>
      <GlassErrorState {...args} />
    </div>
}`,...r.parameters?.docs?.source}}};const G=["Default","Warning"];export{e as Default,r as Warning,G as __namedExportsOrder,E as default};
