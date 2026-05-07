import{j as s}from"./iframe-CToTmdO0.js";import{G as r}from"./GlassAlert-BNb_tDQ8.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassButton-DSNiUgOn.js";import"./index-BR2f0aCL.js";import"./LiquidGlassMaterial-BG5wKcQI.js";import"./LiquidGlassLayerProvider-CSLyvOJZ.js";import"./a11y-E_E8Udq3.js";import"./GlassPredictiveEngine-fLxX_xo3.js";import"./GlassAchievementSystem-B-xkC3b-.js";import"./OptimizedGlassCore-tBAFSalT.js";import"./deviceCapabilities-BEZRvwEn.js";import"./GlassBiometricAdaptation-B0npAiDL.js";import"./MotionPreferenceContext-D7CbfrDA.js";import"./GlassEyeTracking-IHMCU-GA.js";import"./GlassSpatialAudio-pdJ1hzxm.js";import"./MotionFramer-BcMY4Q2P.js";import"./utilsCore-B3C7amq2.js";import"./x-C7V_9uVE.js";import"./createLucideIcon-CUGeHkPK.js";import"./info--xXCOzta.js";import"./circle-alert-g8LZN3sW.js";import"./triangle-alert-Bnnud45f.js";import"./circle-check-big-BR_TE4kD.js";const V={title:"Data + Visualization/Glass Alert",component:r,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassalert component."}}},argTypes:{variant:{control:{type:"select"},options:["default","success","warning","error","info","destructive"],description:"Alert variant"},size:{control:{type:"select"},options:["sm","md","lg"],description:"Alert size"},dismissible:{control:"boolean",description:"Whether the alert can be dismissed"},showIcon:{control:"boolean",description:"Show default icon"}},args:{variant:"info",size:"md",dismissible:!1,showIcon:!0}},e={args:{children:"This is a sample alert message with important information."}},i={render:a=>s.jsxs("div",{className:"glass-flex glass-flex-col glass-gap-4",children:[s.jsx(r,{...a,variant:"info",children:"This is an info alert"}),s.jsx(r,{...a,variant:"success",children:"This is a success alert"}),s.jsx(r,{...a,variant:"warning",children:"This is a warning alert"}),s.jsx(r,{...a,variant:"error",children:"This is an error alert"})]})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
