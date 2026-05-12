import{j as s}from"./iframe-LAGStZOr.js";import{G as r}from"./GlassAlert-JsAkM7MQ.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassButton-CiF6lEMD.js";import"./index-D7SPj1j6.js";import"./LiquidGlassMaterial-DQpzMkZd.js";import"./LiquidGlassLayerProvider-vD8LxwbK.js";import"./a11y-C_KrV_f1.js";import"./GlassPredictiveEngine-DAQdsyWm.js";import"./GlassAchievementSystem-BnhTIUzm.js";import"./OptimizedGlassCore-Jd0dTpF2.js";import"./deviceCapabilities-B9hm0WxX.js";import"./GlassBiometricAdaptation-WKh1enEY.js";import"./MotionPreferenceContext-C7yRy-IY.js";import"./GlassEyeTracking-C5DLjJGe.js";import"./GlassSpatialAudio-BzqwaRwI.js";import"./MotionFramer-Duk6IhfR.js";import"./utilsCore-D2ntLguv.js";import"./x-DSgr2UsS.js";import"./createLucideIcon-BTlQ4bxp.js";import"./info-B23tAgtB.js";import"./circle-alert-CsLhzo6X.js";import"./triangle-alert-BXXkCRJ8.js";import"./circle-check-big-Bzyh1yxN.js";const S={title:"Data + Visualization/Glass Alert",component:r,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassalert component."}}},argTypes:{variant:{control:{type:"select"},options:["default","success","warning","error","info","destructive"],description:"Alert variant"},size:{control:{type:"select"},options:["sm","md","lg"],description:"Alert size"},dismissible:{control:"boolean",description:"Whether the alert can be dismissed"},showIcon:{control:"boolean",description:"Show default icon"}},args:{variant:"info",size:"md",dismissible:!1,showIcon:!0}},a={args:{animate:!1,children:"Review notice: sample alert content is visible.",style:{width:"min(280px, calc(100vw - 32px))",color:"#0f172a"}}},i={render:e=>s.jsxs("div",{className:"glass-flex glass-flex-col glass-gap-4",children:[s.jsx(r,{...e,variant:"info",children:"This is an info alert"}),s.jsx(r,{...e,variant:"success",children:"This is a success alert"}),s.jsx(r,{...e,variant:"warning",children:"This is a warning alert"}),s.jsx(r,{...e,variant:"error",children:"This is an error alert"})]})};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
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
