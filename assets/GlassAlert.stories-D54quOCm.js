import{j as s}from"./iframe-BvzymGjt.js";import{G as r}from"./GlassAlert-mATLIzLl.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassButton-BVHfBqfh.js";import"./index-JwCOk9wq.js";import"./LiquidGlassMaterial-JI_jzYet.js";import"./LiquidGlassLayerProvider-CJtka88e.js";import"./a11y-DPdpkR3m.js";import"./GlassPredictiveEngine-Dz7LnWwV.js";import"./GlassAchievementSystem-CKBD-Gym.js";import"./OptimizedGlassCore-B02J0fwe.js";import"./deviceCapabilities-B7YDzcww.js";import"./GlassBiometricAdaptation-D9YF3poe.js";import"./MotionPreferenceContext-DOLWeM-v.js";import"./GlassEyeTracking-D9jSxkg9.js";import"./GlassSpatialAudio-DHSENIRo.js";import"./MotionFramer-C3KXdYVW.js";import"./utilsCore-CvMw9IQa.js";import"./x-VgHlCL75.js";import"./createLucideIcon-BO6DqFNW.js";import"./info-BMoJu6ZP.js";import"./circle-alert-Ecsu1L1J.js";import"./triangle-alert-KTo2lM5E.js";import"./circle-check-big-BVw4zBrC.js";const S={title:"Data + Visualization/Glass Alert",component:r,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassalert component."}}},argTypes:{variant:{control:{type:"select"},options:["default","success","warning","error","info","destructive"],description:"Alert variant"},size:{control:{type:"select"},options:["sm","md","lg"],description:"Alert size"},dismissible:{control:"boolean",description:"Whether the alert can be dismissed"},showIcon:{control:"boolean",description:"Show default icon"}},args:{variant:"info",size:"md",dismissible:!1,showIcon:!0}},a={args:{animate:!1,children:"Review notice: sample alert content is visible.",style:{width:"min(280px, calc(100vw - 32px))",color:"#0f172a"}}},i={render:e=>s.jsxs("div",{className:"glass-flex glass-flex-col glass-gap-4",children:[s.jsx(r,{...e,variant:"info",children:"This is an info alert"}),s.jsx(r,{...e,variant:"success",children:"This is a success alert"}),s.jsx(r,{...e,variant:"warning",children:"This is a warning alert"}),s.jsx(r,{...e,variant:"error",children:"This is an error alert"})]})};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
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
}`,...i.parameters?.docs?.source}}};const V=["Default","Variants"];export{a as Default,i as Variants,V as __namedExportsOrder,S as default};
