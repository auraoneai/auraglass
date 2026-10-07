import{j as e}from"./iframe-Cqi-9gHA.js";import{G as a}from"./GlassDateField-BxVZk3tl.js";import{G as s}from"./GlassFieldGroup-sCZgT2Cf.js";import{G as r}from"./GlassTimeField-BB8xxiQC.js";import"./preload-helper-PPVm8Dsz.js";import"./components-D_brxh8E.js";import"./GlassInput-DolFnFNQ.js";import"./LiquidGlassMaterial-D0WtSJtx.js";import"./LiquidGlassLayerProvider-BPcOSNPa.js";import"./a11y-DBBBNlGj.js";import"./GlassButton-DSUfTc6z.js";import"./GlassPredictiveEngine-DWJWfFvG.js";import"./GlassAchievementSystem-a9__MuEd.js";import"./OptimizedGlassCore-CWgizUMZ.js";import"./deviceCapabilities-DlsmEFaF.js";import"./GlassBiometricAdaptation-CK7SW6sR.js";import"./MotionPreferenceContext-Da-updIo.js";import"./GlassEyeTracking-PHKeMwz0.js";import"./GlassSpatialAudio-CItqE0YP.js";import"./MotionFramer-CH53jSUC.js";import"./utilsCore-iuxhMr4m.js";const T={title:"Controls/Inputs/Glass Field Group",component:s,parameters:{layout:"centered",previewSurface:"component"}},l={render:()=>e.jsx("div",{style:{width:"min(680px, calc(100vw - 48px))"},children:e.jsxs(s,{legend:"Launch window",description:"Choose the date and time when the release becomes available.",columns:2,children:[e.jsx(a,{label:"Date",defaultValue:"2026-09-18",fullWidth:!0}),e.jsx(r,{label:"Time",defaultValue:"09:30",fullWidth:!0})]})})},t={render:()=>e.jsx("div",{style:{width:"min(860px, calc(100vw - 48px))"},children:e.jsxs(s,{legend:"Milestones",columns:3,children:[e.jsx(a,{label:"Review",defaultValue:"2026-09-11",fullWidth:!0}),e.jsx(a,{label:"Launch",defaultValue:"2026-09-18",fullWidth:!0}),e.jsx(a,{label:"Retrospective",defaultValue:"2026-09-25",fullWidth:!0})]})})};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
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
