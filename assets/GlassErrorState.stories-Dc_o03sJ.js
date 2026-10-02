import{j as t}from"./iframe-DFMMcocb.js";import{G as a}from"./GlassErrorState-CQ6ijrXQ.js";import"./preload-helper-PPVm8Dsz.js";import"./components-Ue9Uo88O.js";import"./GlassButton-XgI0pEAb.js";import"./LiquidGlassMaterial-D8CGevp8.js";import"./LiquidGlassLayerProvider-B-mIHSJM.js";import"./a11y-Q0mX7KvA.js";import"./GlassPredictiveEngine-D_3E50m3.js";import"./GlassAchievementSystem-BqTd0FRN.js";import"./OptimizedGlassCore-1D6AE-uZ.js";import"./deviceCapabilities-iDxBLJQX.js";import"./GlassBiometricAdaptation-CNYoTdw5.js";import"./MotionPreferenceContext-VYRcsRrk.js";import"./GlassEyeTracking-DFVitI9H.js";import"./GlassSpatialAudio-BRwfDyUV.js";import"./MotionFramer-Cvto7X39.js";import"./utilsCore-D5Hayjvj.js";const E={title:"Data + Visualization/Glass Error State",component:a,parameters:{layout:"centered",previewSurface:"component"},args:{title:"Analytics are temporarily unavailable",description:"We could not refresh this workspace. Your existing data is safe.",retryLabel:"Try again",onRetry:()=>{},details:"Request ID: AG-1048 · Last successful sync: 2 minutes ago"}},e={render:s=>t.jsx("div",{style:{width:"min(620px, calc(100vw - 48px))"},children:t.jsx(a,{...s})})},r={args:{severity:"warning",title:"Some metrics may be delayed",description:"The latest warehouse sync is still processing.",details:void 0},render:s=>t.jsx("div",{style:{width:"min(620px, calc(100vw - 48px))"},children:t.jsx(a,{...s})})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
