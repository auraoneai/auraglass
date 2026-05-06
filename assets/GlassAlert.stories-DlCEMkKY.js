import{j as s}from"./iframe-mbNquNNc.js";import{G as r}from"./GlassAlert-BgI5CTDC.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassButton-Dj39LQ52.js";import"./index-vu3jGQGZ.js";import"./LiquidGlassMaterial-D9GzyZBz.js";import"./LiquidGlassLayerProvider-DsdConQJ.js";import"./GlassPredictiveEngine-D3b8OhcD.js";import"./GlassAchievementSystem-BuLAT0VQ.js";import"./OptimizedGlassCore-CPvpl-y1.js";import"./GlassBiometricAdaptation-Cvck8KpT.js";import"./MotionPreferenceContext-BfJvNZar.js";import"./GlassEyeTracking-jVjspFjL.js";import"./GlassSpatialAudio-CRCXq6J3.js";import"./MotionFramer-BekP4wEp.js";import"./utilsCore-CTDrFk4s.js";import"./x-aVOz36JM.js";import"./createLucideIcon-CpanR7Fq.js";import"./info-DmEsc3h5.js";import"./circle-alert-D0CGSfeX.js";import"./triangle-alert-CjXzcZrR.js";import"./circle-check-big-jae8Kl-w.js";const D={title:"Components/Data-display/GlassAlert",component:r,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassalert component."}}},argTypes:{variant:{control:{type:"select"},options:["default","success","warning","error","info","destructive"],description:"Alert variant"},size:{control:{type:"select"},options:["sm","md","lg"],description:"Alert size"},dismissible:{control:"boolean",description:"Whether the alert can be dismissed"},showIcon:{control:"boolean",description:"Show default icon"}},args:{variant:"info",size:"md",dismissible:!1,showIcon:!0}},e={args:{children:"This is a sample alert message with important information."}},t={render:a=>s.jsxs("div",{className:"glass-flex glass-flex-col glass-gap-4",children:[s.jsx(r,{...a,variant:"info",children:"This is an info alert"}),s.jsx(r,{...a,variant:"success",children:"This is a success alert"}),s.jsx(r,{...a,variant:"warning",children:"This is a warning alert"}),s.jsx(r,{...a,variant:"error",children:"This is an error alert"})]})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
