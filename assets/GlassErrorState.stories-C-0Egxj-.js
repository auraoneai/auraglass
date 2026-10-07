import{j as t}from"./iframe-Cqi-9gHA.js";import{G as a}from"./GlassErrorState-D78znoJl.js";import"./preload-helper-PPVm8Dsz.js";import"./components-D_brxh8E.js";import"./GlassButton-DSUfTc6z.js";import"./LiquidGlassMaterial-D0WtSJtx.js";import"./LiquidGlassLayerProvider-BPcOSNPa.js";import"./a11y-DBBBNlGj.js";import"./GlassPredictiveEngine-DWJWfFvG.js";import"./GlassAchievementSystem-a9__MuEd.js";import"./OptimizedGlassCore-CWgizUMZ.js";import"./deviceCapabilities-DlsmEFaF.js";import"./GlassBiometricAdaptation-CK7SW6sR.js";import"./MotionPreferenceContext-Da-updIo.js";import"./GlassEyeTracking-PHKeMwz0.js";import"./GlassSpatialAudio-CItqE0YP.js";import"./MotionFramer-CH53jSUC.js";import"./utilsCore-iuxhMr4m.js";const E={title:"Data + Visualization/Glass Error State",component:a,parameters:{layout:"centered",previewSurface:"component"},args:{title:"Analytics are temporarily unavailable",description:"We could not refresh this workspace. Your existing data is safe.",retryLabel:"Try again",onRetry:()=>{},details:"Request ID: AG-1048 · Last successful sync: 2 minutes ago"}},e={render:s=>t.jsx("div",{style:{width:"min(620px, calc(100vw - 48px))"},children:t.jsx(a,{...s})})},r={args:{severity:"warning",title:"Some metrics may be delayed",description:"The latest warehouse sync is still processing.",details:void 0},render:s=>t.jsx("div",{style:{width:"min(620px, calc(100vw - 48px))"},children:t.jsx(a,{...s})})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
