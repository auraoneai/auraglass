import{j as r}from"./iframe-RsoZoStf.js";import{G as t}from"./GlassInput-ZzQM0vBn.js";import{G as s}from"./GlassFormField-BF3TFKxa.js";import"./preload-helper-PPVm8Dsz.js";import"./LiquidGlassMaterial-GdijC9oA.js";import"./LiquidGlassLayerProvider-BQssgZYr.js";import"./a11y-WSL2JlLl.js";import"./GlassButton-BmzykaoH.js";import"./GlassPredictiveEngine-xQEpY0TP.js";import"./GlassAchievementSystem-Bhc5NHtk.js";import"./OptimizedGlassCore-IzbAukgr.js";import"./deviceCapabilities-CB0YcTGX.js";import"./GlassBiometricAdaptation-B9HDXiFX.js";import"./MotionPreferenceContext-B3rOXnSa.js";import"./GlassEyeTracking-CJXggKsV.js";import"./GlassSpatialAudio-nY9QSvQ1.js";import"./MotionFramer-tKl7gvze.js";import"./utilsCore-DLcXNkaQ.js";import"./GlassValidationMessage-BdPmw19i.js";import"./components-DwI53NlZ.js";const y={title:"Controls/Inputs/Glass Form Field",component:s,parameters:{layout:"centered",previewSurface:"component"}},e={render:()=>r.jsx("div",{style:{width:"min(440px, calc(100vw - 48px))"},children:r.jsx(s,{label:"Workspace name",htmlFor:"workspace-name",description:"This appears in navigation and shared links.",required:!0,children:r.jsx(t,{id:"workspace-name",defaultValue:"Northstar Studio","aria-label":"Workspace name",fullWidth:!0})})})},a={render:()=>r.jsx("div",{style:{width:"min(440px, calc(100vw - 48px))"},children:r.jsx(s,{label:"Workspace slug",htmlFor:"workspace-slug",error:"Use lowercase letters, numbers, and hyphens only.",children:r.jsx(t,{id:"workspace-slug",defaultValue:"Northstar Studio","aria-invalid":!0,"aria-label":"Workspace slug",state:"error",fullWidth:!0})})})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
