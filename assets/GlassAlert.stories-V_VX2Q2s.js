import{j as s}from"./iframe-C2Py7iTP.js";import{G as r}from"./GlassAlert-BtNPIXGB.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassButton-DyQ1uYYO.js";import"./index-BO6jdYrs.js";import"./LiquidGlassMaterial-CmfeHEzl.js";import"./LiquidGlassLayerProvider-DpzmTZb0.js";import"./GlassPredictiveEngine-ZsWyIufl.js";import"./GlassAchievementSystem-DjbL6xVt.js";import"./OptimizedGlassCore-xEcyrF8U.js";import"./GlassBiometricAdaptation-A7cjmcue.js";import"./MotionPreferenceContext-DOVeBjOR.js";import"./GlassEyeTracking-CyJl1QCH.js";import"./GlassSpatialAudio-BXD-nyUP.js";import"./MotionFramer-Bqa_dH4n.js";import"./utilsCore-DHlzAtb4.js";import"./x-Btfotm7d.js";import"./createLucideIcon-DYSTPsPi.js";import"./info-D_ZVxvph.js";import"./circle-alert-D27adgJe.js";import"./triangle-alert-TOOLFTvF.js";import"./circle-check-big-CydwchTR.js";const D={title:"Components/Data-display/GlassAlert",component:r,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassalert component."}}},argTypes:{variant:{control:{type:"select"},options:["default","success","warning","error","info","destructive"],description:"Alert variant"},size:{control:{type:"select"},options:["sm","md","lg"],description:"Alert size"},dismissible:{control:"boolean",description:"Whether the alert can be dismissed"},showIcon:{control:"boolean",description:"Show default icon"}},args:{variant:"info",size:"md",dismissible:!1,showIcon:!0}},e={args:{children:"This is a sample alert message with important information."}},t={render:a=>s.jsxs("div",{className:"glass-flex glass-flex-col glass-gap-4",children:[s.jsx(r,{...a,variant:"info",children:"This is an info alert"}),s.jsx(r,{...a,variant:"success",children:"This is a success alert"}),s.jsx(r,{...a,variant:"warning",children:"This is a warning alert"}),s.jsx(r,{...a,variant:"error",children:"This is an error alert"})]})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
