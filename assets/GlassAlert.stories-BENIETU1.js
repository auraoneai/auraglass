import{j as s}from"./iframe-CrdWMSIk.js";import{G as r}from"./GlassAlert-DzN2jnWU.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassButton-lz_wCgCM.js";import"./index-DKmh9zBI.js";import"./LiquidGlassMaterial-YBLuTURd.js";import"./LiquidGlassLayerProvider-BhQt7x6P.js";import"./a11y-C6c8VL3n.js";import"./GlassPredictiveEngine-BhHh5Egl.js";import"./GlassAchievementSystem-CE07MKXS.js";import"./OptimizedGlassCore-BMxL0Y3X.js";import"./deviceCapabilities-ClxBxKMX.js";import"./GlassBiometricAdaptation-DQiz_XaC.js";import"./MotionPreferenceContext-DKjHjyas.js";import"./GlassEyeTracking-DFFnPhoi.js";import"./GlassSpatialAudio-Dx1K3ePa.js";import"./MotionFramer-tOJilvcO.js";import"./utilsCore-CKkXzodi.js";import"./x-DfAV7dXl.js";import"./createLucideIcon-r_pQPiZy.js";import"./info-BOegIMe6.js";import"./circle-alert-DQheRjkE.js";import"./triangle-alert-B6IpP55b.js";import"./circle-check-big-Cvo367f9.js";const S={title:"Data + Visualization/Glass Alert",component:r,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassalert component."}}},argTypes:{variant:{control:{type:"select"},options:["default","success","warning","error","info","destructive"],description:"Alert variant"},size:{control:{type:"select"},options:["sm","md","lg"],description:"Alert size"},dismissible:{control:"boolean",description:"Whether the alert can be dismissed"},showIcon:{control:"boolean",description:"Show default icon"}},args:{variant:"info",size:"md",dismissible:!1,showIcon:!0}},a={args:{animate:!1,children:"Review notice: sample alert content is visible.",style:{width:"min(280px, calc(100vw - 32px))",color:"#0f172a"}}},i={render:e=>s.jsxs("div",{className:"glass-flex glass-flex-col glass-gap-4",children:[s.jsx(r,{...e,variant:"info",children:"This is an info alert"}),s.jsx(r,{...e,variant:"success",children:"This is a success alert"}),s.jsx(r,{...e,variant:"warning",children:"This is a warning alert"}),s.jsx(r,{...e,variant:"error",children:"This is an error alert"})]})};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
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
