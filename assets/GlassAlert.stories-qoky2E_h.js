import{j as s}from"./iframe-C1j_9pGm.js";import{G as r}from"./GlassAlert-7_i6_XJc.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassButton-DkcqNLpM.js";import"./index-BHYlK66i.js";import"./LiquidGlassMaterial-BfOIzeQM.js";import"./LiquidGlassLayerProvider-CRD6ea23.js";import"./a11y-DqIQidVG.js";import"./GlassPredictiveEngine-D7TA3Ph8.js";import"./GlassAchievementSystem-DGJv5RbB.js";import"./OptimizedGlassCore-fs4nsz79.js";import"./deviceCapabilities-BHvtgRvM.js";import"./GlassBiometricAdaptation-Cdkb9XAh.js";import"./MotionPreferenceContext-HBw8OzFx.js";import"./GlassEyeTracking-DElS-_jN.js";import"./GlassSpatialAudio-FEy3Zs_i.js";import"./MotionFramer-JM_agJcB.js";import"./utilsCore-MhQK04QN.js";import"./x-baH9xOOe.js";import"./createLucideIcon-BFlZd7Ja.js";import"./info-emIqPvV_.js";import"./circle-alert-BMZD9Dy8.js";import"./triangle-alert-BRG1h8YG.js";import"./circle-check-big-mkWfpIhx.js";const V={title:"Data + Visualization/Glass Alert",component:r,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassalert component."}}},argTypes:{variant:{control:{type:"select"},options:["default","success","warning","error","info","destructive"],description:"Alert variant"},size:{control:{type:"select"},options:["sm","md","lg"],description:"Alert size"},dismissible:{control:"boolean",description:"Whether the alert can be dismissed"},showIcon:{control:"boolean",description:"Show default icon"}},args:{variant:"info",size:"md",dismissible:!1,showIcon:!0}},e={args:{children:"This is a sample alert message with important information."}},i={render:a=>s.jsxs("div",{className:"glass-flex glass-flex-col glass-gap-4",children:[s.jsx(r,{...a,variant:"info",children:"This is an info alert"}),s.jsx(r,{...a,variant:"success",children:"This is a success alert"}),s.jsx(r,{...a,variant:"warning",children:"This is a warning alert"}),s.jsx(r,{...a,variant:"error",children:"This is an error alert"})]})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'This is a sample alert message with important information.'
  }
}`,...e.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
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
}`,...i.parameters?.docs?.source}}};const E=["Default","Variants"];export{e as Default,i as Variants,E as __namedExportsOrder,V as default};
