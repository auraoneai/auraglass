import{j as s}from"./iframe-BEVTBSqr.js";import{G as r}from"./GlassAlert-DhDFNV0-.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassButton-bg50TCz0.js";import"./index-CU8u3l8Y.js";import"./LiquidGlassMaterial-D5p4jx7m.js";import"./LiquidGlassLayerProvider-h5jHUths.js";import"./GlassPredictiveEngine-y5xM3Rm5.js";import"./GlassAchievementSystem-DvDrrRIP.js";import"./OptimizedGlassCore-BMFMzxVt.js";import"./GlassBiometricAdaptation-BLAoJQ8Y.js";import"./MotionPreferenceContext-FWf-G1hj.js";import"./GlassEyeTracking-DQtZEr81.js";import"./GlassSpatialAudio-D9F1e_tt.js";import"./MotionFramer-xTbOeNdo.js";import"./utilsCore-DpNKUJXO.js";import"./x-DMiishBO.js";import"./createLucideIcon-rSP2W7k9.js";import"./info-Bx2qrVjV.js";import"./circle-alert-DfgaUyy6.js";import"./triangle-alert-CqIGOcpM.js";import"./circle-check-big-DM4_qdYO.js";const D={title:"Components/Data-display/GlassAlert",component:r,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassalert component."}}},argTypes:{variant:{control:{type:"select"},options:["default","success","warning","error","info","destructive"],description:"Alert variant"},size:{control:{type:"select"},options:["sm","md","lg"],description:"Alert size"},dismissible:{control:"boolean",description:"Whether the alert can be dismissed"},showIcon:{control:"boolean",description:"Show default icon"}},args:{variant:"info",size:"md",dismissible:!1,showIcon:!0}},e={args:{children:"This is a sample alert message with important information."}},t={render:a=>s.jsxs("div",{className:"glass-flex glass-flex-col glass-gap-4",children:[s.jsx(r,{...a,variant:"info",children:"This is an info alert"}),s.jsx(r,{...a,variant:"success",children:"This is a success alert"}),s.jsx(r,{...a,variant:"warning",children:"This is a warning alert"}),s.jsx(r,{...a,variant:"error",children:"This is an error alert"})]})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'This is a sample alert message with important information.'
  }
}`,...e.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
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
}`,...t.parameters?.docs?.source}}};const S=["Default","Variants"];export{e as Default,t as Variants,S as __namedExportsOrder,D as default};
