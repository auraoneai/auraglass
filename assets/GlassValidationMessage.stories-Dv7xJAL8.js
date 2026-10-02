import{j as e}from"./iframe-DFMMcocb.js";import{G as a}from"./GlassValidationMessage-D7MyOJVc.js";import"./preload-helper-PPVm8Dsz.js";import"./components-Ue9Uo88O.js";import"./OptimizedGlassCore-1D6AE-uZ.js";import"./deviceCapabilities-iDxBLJQX.js";const d={title:"Controls/Inputs/Glass Validation Message",component:a,parameters:{layout:"centered",previewSurface:"component"},args:{tone:"error",children:"Enter a valid workspace URL before continuing."}},s={},n={render:()=>e.jsxs("div",{style:{display:"grid",gap:12,width:"min(480px, calc(100vw - 48px))"},children:[e.jsx(a,{tone:"error",children:"The workspace URL is already in use."}),e.jsx(a,{tone:"warning",children:"This change will affect twelve collaborators."}),e.jsx(a,{tone:"success",children:"Workspace settings are ready to publish."}),e.jsx(a,{tone:"info",children:"You can update this value again at any time."})]})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:"{}",...s.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: "grid",
    gap: 12,
    width: "min(480px, calc(100vw - 48px))"
  }}>
      <GlassValidationMessage tone="error">
        The workspace URL is already in use.
      </GlassValidationMessage>
      <GlassValidationMessage tone="warning">
        This change will affect twelve collaborators.
      </GlassValidationMessage>
      <GlassValidationMessage tone="success">
        Workspace settings are ready to publish.
      </GlassValidationMessage>
      <GlassValidationMessage tone="info">
        You can update this value again at any time.
      </GlassValidationMessage>
    </div>
}`,...n.parameters?.docs?.source}}};const p=["Default","ToneMatrix"];export{s as Default,n as ToneMatrix,p as __namedExportsOrder,d as default};
