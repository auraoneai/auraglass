import{j as s}from"./iframe-Ddb4tVEK.js";import{G as r}from"./GlassAlert-C49YfqZl.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassButton-CJ332-qo.js";import"./index-DAiHXfhF.js";import"./LiquidGlassMaterial-CJVSwNtK.js";import"./LiquidGlassLayerProvider-NQCydaKh.js";import"./GlassPredictiveEngine-C8g_o_9w.js";import"./GlassAchievementSystem-DHCvT44W.js";import"./OptimizedGlassCore-ac4MFqVE.js";import"./GlassBiometricAdaptation-BVXLOW49.js";import"./MotionPreferenceContext-BplUqfQw.js";import"./GlassEyeTracking-C03ckNec.js";import"./GlassSpatialAudio-6GnWgsuk.js";import"./MotionFramer-BQlEmU1w.js";import"./utilsCore-DCiYDi1n.js";import"./x-K5-YY48B.js";import"./createLucideIcon-ArTIMtiF.js";import"./info-D44Yz7kS.js";import"./circle-alert-D5sufKzJ.js";import"./triangle-alert-C_czXG00.js";import"./circle-check-big-BcJIMe4y.js";const D={title:"Components/Data-display/GlassAlert",component:r,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassalert component."}}},argTypes:{variant:{control:{type:"select"},options:["default","success","warning","error","info","destructive"],description:"Alert variant"},size:{control:{type:"select"},options:["sm","md","lg"],description:"Alert size"},dismissible:{control:"boolean",description:"Whether the alert can be dismissed"},showIcon:{control:"boolean",description:"Show default icon"}},args:{variant:"info",size:"md",dismissible:!1,showIcon:!0}},e={args:{children:"This is a sample alert message with important information."}},t={render:a=>s.jsxs("div",{className:"glass-flex glass-flex-col glass-gap-4",children:[s.jsx(r,{...a,variant:"info",children:"This is an info alert"}),s.jsx(r,{...a,variant:"success",children:"This is a success alert"}),s.jsx(r,{...a,variant:"warning",children:"This is a warning alert"}),s.jsx(r,{...a,variant:"error",children:"This is an error alert"})]})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
