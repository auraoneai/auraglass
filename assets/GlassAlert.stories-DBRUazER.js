import{j as s}from"./iframe-OZreUAtx.js";import{G as r}from"./GlassAlert-CMB_D4_n.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassButton-6w9EY7YA.js";import"./index-BXuO5XkR.js";import"./LiquidGlassMaterial-6ZsmKJqk.js";import"./LiquidGlassLayerProvider-D9koVs6n.js";import"./GlassPredictiveEngine-Hj8SU_hc.js";import"./GlassAchievementSystem-CfusDed6.js";import"./OptimizedGlassCore-DAQZMOh8.js";import"./GlassBiometricAdaptation-DaD9o7IG.js";import"./MotionPreferenceContext-DTxERmBA.js";import"./GlassEyeTracking-DEo0jGT7.js";import"./GlassSpatialAudio-C984SGkY.js";import"./MotionFramer-BTsVQK94.js";import"./utilsCore-B384u8by.js";import"./x-CMtMyPIA.js";import"./createLucideIcon-B0rn4XfH.js";import"./info-D4dqNtF8.js";import"./circle-alert-Br-4cN5a.js";import"./triangle-alert-Bth7OtCj.js";import"./circle-check-big-DHPvp05_.js";const D={title:"Components/Data-display/GlassAlert",component:r,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassalert component."}}},argTypes:{variant:{control:{type:"select"},options:["default","success","warning","error","info","destructive"],description:"Alert variant"},size:{control:{type:"select"},options:["sm","md","lg"],description:"Alert size"},dismissible:{control:"boolean",description:"Whether the alert can be dismissed"},showIcon:{control:"boolean",description:"Show default icon"}},args:{variant:"info",size:"md",dismissible:!1,showIcon:!0}},e={args:{children:"This is a sample alert message with important information."}},t={render:a=>s.jsxs("div",{className:"glass-flex glass-flex-col glass-gap-4",children:[s.jsx(r,{...a,variant:"info",children:"This is an info alert"}),s.jsx(r,{...a,variant:"success",children:"This is a success alert"}),s.jsx(r,{...a,variant:"warning",children:"This is a warning alert"}),s.jsx(r,{...a,variant:"error",children:"This is an error alert"})]})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
