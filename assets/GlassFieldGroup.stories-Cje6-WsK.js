import{j as e}from"./iframe-DFMMcocb.js";import{G as a}from"./GlassDateField-QXAFmXfY.js";import{G as s}from"./GlassFieldGroup-B5kteo55.js";import{G as r}from"./GlassTimeField-BAydxzY5.js";import"./preload-helper-PPVm8Dsz.js";import"./components-Ue9Uo88O.js";import"./GlassInput-Dm4A5juN.js";import"./LiquidGlassMaterial-D8CGevp8.js";import"./LiquidGlassLayerProvider-B-mIHSJM.js";import"./a11y-Q0mX7KvA.js";import"./GlassButton-XgI0pEAb.js";import"./GlassPredictiveEngine-D_3E50m3.js";import"./GlassAchievementSystem-BqTd0FRN.js";import"./OptimizedGlassCore-1D6AE-uZ.js";import"./deviceCapabilities-iDxBLJQX.js";import"./GlassBiometricAdaptation-CNYoTdw5.js";import"./MotionPreferenceContext-VYRcsRrk.js";import"./GlassEyeTracking-DFVitI9H.js";import"./GlassSpatialAudio-BRwfDyUV.js";import"./MotionFramer-Cvto7X39.js";import"./utilsCore-D5Hayjvj.js";const T={title:"Controls/Inputs/Glass Field Group",component:s,parameters:{layout:"centered",previewSurface:"component"}},l={render:()=>e.jsx("div",{style:{width:"min(680px, calc(100vw - 48px))"},children:e.jsxs(s,{legend:"Launch window",description:"Choose the date and time when the release becomes available.",columns:2,children:[e.jsx(a,{label:"Date",defaultValue:"2026-09-18",fullWidth:!0}),e.jsx(r,{label:"Time",defaultValue:"09:30",fullWidth:!0})]})})},t={render:()=>e.jsx("div",{style:{width:"min(860px, calc(100vw - 48px))"},children:e.jsxs(s,{legend:"Milestones",columns:3,children:[e.jsx(a,{label:"Review",defaultValue:"2026-09-11",fullWidth:!0}),e.jsx(a,{label:"Launch",defaultValue:"2026-09-18",fullWidth:!0}),e.jsx(a,{label:"Retrospective",defaultValue:"2026-09-25",fullWidth:!0})]})})};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    width: "min(680px, calc(100vw - 48px))"
  }}>
      <GlassFieldGroup legend="Launch window" description="Choose the date and time when the release becomes available." columns={2}>
        <GlassDateField label="Date" defaultValue="2026-09-18" fullWidth />
        <GlassTimeField label="Time" defaultValue="09:30" fullWidth />
      </GlassFieldGroup>
    </div>
}`,...l.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    width: "min(860px, calc(100vw - 48px))"
  }}>
      <GlassFieldGroup legend="Milestones" columns={3}>
        <GlassDateField label="Review" defaultValue="2026-09-11" fullWidth />
        <GlassDateField label="Launch" defaultValue="2026-09-18" fullWidth />
        <GlassDateField label="Retrospective" defaultValue="2026-09-25" fullWidth />
      </GlassFieldGroup>
    </div>
}`,...t.parameters?.docs?.source}}};const y=["Default","ThreeColumns"];export{l as Default,t as ThreeColumns,y as __namedExportsOrder,T as default};
