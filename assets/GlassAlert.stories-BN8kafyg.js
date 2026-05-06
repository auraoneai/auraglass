import{j as s}from"./iframe-rcK9Xf1b.js";import{G as r}from"./GlassAlert-CaM34FTR.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassButton-B7wlFxfc.js";import"./index-SHVQWzfF.js";import"./LiquidGlassMaterial-B5rEZqMl.js";import"./LiquidGlassLayerProvider-BIHgxTaw.js";import"./GlassPredictiveEngine-CVTNJ8qr.js";import"./GlassAchievementSystem-DYlVdNF6.js";import"./OptimizedGlassCore-BtDfN8Ts.js";import"./GlassBiometricAdaptation-BGrhrjU2.js";import"./MotionPreferenceContext-mQDtMATf.js";import"./GlassEyeTracking-Bnvi94mr.js";import"./GlassSpatialAudio-6tN9NdIH.js";import"./MotionFramer-D0-HiDbD.js";import"./utilsCore-jun4nkmH.js";import"./x-CciiwU2d.js";import"./createLucideIcon-DsZsNNjc.js";import"./info-DOAbwTmd.js";import"./circle-alert-CqNOAsXk.js";import"./triangle-alert-DQU7WF-C.js";import"./circle-check-big-C3Iqh5pu.js";const D={title:"Components/Data-display/GlassAlert",component:r,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassalert component."}}},argTypes:{variant:{control:{type:"select"},options:["default","success","warning","error","info","destructive"],description:"Alert variant"},size:{control:{type:"select"},options:["sm","md","lg"],description:"Alert size"},dismissible:{control:"boolean",description:"Whether the alert can be dismissed"},showIcon:{control:"boolean",description:"Show default icon"}},args:{variant:"info",size:"md",dismissible:!1,showIcon:!0}},e={args:{children:"This is a sample alert message with important information."}},t={render:a=>s.jsxs("div",{className:"glass-flex glass-flex-col glass-gap-4",children:[s.jsx(r,{...a,variant:"info",children:"This is an info alert"}),s.jsx(r,{...a,variant:"success",children:"This is a success alert"}),s.jsx(r,{...a,variant:"warning",children:"This is a warning alert"}),s.jsx(r,{...a,variant:"error",children:"This is an error alert"})]})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
