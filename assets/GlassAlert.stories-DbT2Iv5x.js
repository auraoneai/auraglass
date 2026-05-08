import{j as s}from"./iframe-DyzGTO6j.js";import{G as r}from"./GlassAlert-7zT98xO_.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassButton-BrJRrsri.js";import"./index-Bb1xwjPN.js";import"./LiquidGlassMaterial-CWkqPUkP.js";import"./LiquidGlassLayerProvider-B2La73T1.js";import"./a11y-D_lkiUOl.js";import"./GlassPredictiveEngine-NVfzhScj.js";import"./GlassAchievementSystem-CoiXhaON.js";import"./OptimizedGlassCore-Dz0CoTUd.js";import"./deviceCapabilities-Cly_GjbT.js";import"./GlassBiometricAdaptation-Boags1Ct.js";import"./MotionPreferenceContext-4xWPoQ-i.js";import"./GlassEyeTracking-DPTFm0rv.js";import"./GlassSpatialAudio-D0NYCka6.js";import"./MotionFramer-yZPRa-tO.js";import"./utilsCore-CvH3yKBE.js";import"./x-DUUl5CSB.js";import"./createLucideIcon-BZG7jVWE.js";import"./info-DO85QKpS.js";import"./circle-alert-Dpu9XSbb.js";import"./triangle-alert-CiVwqkxw.js";import"./circle-check-big-YfiprLff.js";const V={title:"Data + Visualization/Glass Alert",component:r,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassalert component."}}},argTypes:{variant:{control:{type:"select"},options:["default","success","warning","error","info","destructive"],description:"Alert variant"},size:{control:{type:"select"},options:["sm","md","lg"],description:"Alert size"},dismissible:{control:"boolean",description:"Whether the alert can be dismissed"},showIcon:{control:"boolean",description:"Show default icon"}},args:{variant:"info",size:"md",dismissible:!1,showIcon:!0}},e={args:{children:"This is a sample alert message with important information."}},i={render:a=>s.jsxs("div",{className:"glass-flex glass-flex-col glass-gap-4",children:[s.jsx(r,{...a,variant:"info",children:"This is an info alert"}),s.jsx(r,{...a,variant:"success",children:"This is a success alert"}),s.jsx(r,{...a,variant:"warning",children:"This is a warning alert"}),s.jsx(r,{...a,variant:"error",children:"This is an error alert"})]})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
