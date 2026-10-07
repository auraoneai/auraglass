import{j as r}from"./iframe-Cqi-9gHA.js";import{G as t}from"./GlassInput-DolFnFNQ.js";import{G as s}from"./GlassFormField-CLpCHNCi.js";import"./preload-helper-PPVm8Dsz.js";import"./LiquidGlassMaterial-D0WtSJtx.js";import"./LiquidGlassLayerProvider-BPcOSNPa.js";import"./a11y-DBBBNlGj.js";import"./GlassButton-DSUfTc6z.js";import"./GlassPredictiveEngine-DWJWfFvG.js";import"./GlassAchievementSystem-a9__MuEd.js";import"./OptimizedGlassCore-CWgizUMZ.js";import"./deviceCapabilities-DlsmEFaF.js";import"./GlassBiometricAdaptation-CK7SW6sR.js";import"./MotionPreferenceContext-Da-updIo.js";import"./GlassEyeTracking-PHKeMwz0.js";import"./GlassSpatialAudio-CItqE0YP.js";import"./MotionFramer-CH53jSUC.js";import"./utilsCore-iuxhMr4m.js";import"./GlassValidationMessage-DeixD9g8.js";import"./components-D_brxh8E.js";const y={title:"Controls/Inputs/Glass Form Field",component:s,parameters:{layout:"centered",previewSurface:"component"}},e={render:()=>r.jsx("div",{style:{width:"min(440px, calc(100vw - 48px))"},children:r.jsx(s,{label:"Workspace name",htmlFor:"workspace-name",description:"This appears in navigation and shared links.",required:!0,children:r.jsx(t,{id:"workspace-name",defaultValue:"Northstar Studio","aria-label":"Workspace name",fullWidth:!0})})})},a={render:()=>r.jsx("div",{style:{width:"min(440px, calc(100vw - 48px))"},children:r.jsx(s,{label:"Workspace slug",htmlFor:"workspace-slug",error:"Use lowercase letters, numbers, and hyphens only.",children:r.jsx(t,{id:"workspace-slug",defaultValue:"Northstar Studio","aria-invalid":!0,"aria-label":"Workspace slug",state:"error",fullWidth:!0})})})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    width: "min(440px, calc(100vw - 48px))"
  }}>
      <GlassFormField label="Workspace name" htmlFor="workspace-name" description="This appears in navigation and shared links." required>
        <GlassInput id="workspace-name" defaultValue="Northstar Studio" aria-label="Workspace name" fullWidth />
      </GlassFormField>
    </div>
}`,...e.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    width: "min(440px, calc(100vw - 48px))"
  }}>
      <GlassFormField label="Workspace slug" htmlFor="workspace-slug" error="Use lowercase letters, numbers, and hyphens only.">
        <GlassInput id="workspace-slug" defaultValue="Northstar Studio" aria-invalid={true} aria-label="Workspace slug" state="error" fullWidth />
      </GlassFormField>
    </div>
}`,...a.parameters?.docs?.source}}};const j=["Default","WithValidationError"];export{e as Default,a as WithValidationError,j as __namedExportsOrder,y as default};
