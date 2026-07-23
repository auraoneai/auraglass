import{j as s}from"./iframe-CdDNbo2v.js";import{G as r}from"./GlassAlert-Cf-vM_1J.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassButton-DMsLvuTk.js";import"./LiquidGlassMaterial-C7L_XzpE.js";import"./LiquidGlassLayerProvider-BmiLcxa3.js";import"./a11y-B__vCKol.js";import"./GlassPredictiveEngine-DK146jr5.js";import"./GlassAchievementSystem-k4lcNpEq.js";import"./OptimizedGlassCore-B1nsxF3j.js";import"./deviceCapabilities-CLkD7xxk.js";import"./GlassBiometricAdaptation-QCTxnhMN.js";import"./MotionPreferenceContext-mBLTPWGH.js";import"./GlassEyeTracking-DWqe5kEa.js";import"./GlassSpatialAudio-DMiQlRWH.js";import"./MotionFramer-BwSk7qC9.js";import"./utilsCore-DlqMbNDW.js";import"./components-Blpg7iwI.js";const b={title:"Data + Visualization/Glass Alert",component:r,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassalert component."}}},argTypes:{variant:{control:{type:"select"},options:["default","success","warning","error","info","destructive"],description:"Alert variant"},size:{control:{type:"select"},options:["sm","md","lg"],description:"Alert size"},dismissible:{control:"boolean",description:"Whether the alert can be dismissed"},showIcon:{control:"boolean",description:"Show default icon"}},args:{variant:"info",size:"md",dismissible:!1,showIcon:!0}},a={args:{animate:!1,children:"Review notice: sample alert content is visible.",style:{width:"min(280px, calc(100vw - 32px))",color:"#0f172a"}}},i={render:e=>s.jsxs("div",{className:"glass-flex glass-flex-col glass-gap-4",children:[s.jsx(r,{...e,variant:"info",children:"This is an info alert"}),s.jsx(r,{...e,variant:"success",children:"This is a success alert"}),s.jsx(r,{...e,variant:"warning",children:"This is a warning alert"}),s.jsx(r,{...e,variant:"error",children:"This is an error alert"})]})};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    animate: false,
    children: 'Review notice: sample alert content is visible.',
    style: {
      width: 'min(280px, calc(100vw - 32px))',
      color: '#0f172a'
    }
  }
}`,...a.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-flex glass-flex-col glass-gap-4">
      <GlassAlert {...args} variant="info">
        This is an info alert
      </GlassAlert>
      <GlassAlert {...args} variant="success">
        This is a success alert
      </GlassAlert>
      <GlassAlert {...args} variant="warning">
        This is a warning alert
      </GlassAlert>
      <GlassAlert {...args} variant="error">
        This is an error alert
      </GlassAlert>
    </div>
}`,...i.parameters?.docs?.source}}};const j=["Default","Variants"];export{a as Default,i as Variants,j as __namedExportsOrder,b as default};
