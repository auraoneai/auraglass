import{j as s}from"./iframe-CCVHZjui.js";import{G as r}from"./GlassAlert-6DDeMj4J.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassButton-DEUjjEUk.js";import"./index-BPOeCqBN.js";import"./LiquidGlassMaterial-CE3NhfG1.js";import"./LiquidGlassLayerProvider-C8_KLYLy.js";import"./a11y-DYpJNAyD.js";import"./GlassPredictiveEngine-BnvkiC0B.js";import"./GlassAchievementSystem-Dn_4VNrl.js";import"./OptimizedGlassCore-D_hfAzIe.js";import"./deviceCapabilities-WGQt4yIJ.js";import"./GlassBiometricAdaptation-DQDXImLm.js";import"./MotionPreferenceContext-CryyGTeI.js";import"./GlassEyeTracking-Bw6bKOhQ.js";import"./GlassSpatialAudio-DmhcDjFY.js";import"./MotionFramer-D3JMoYt9.js";import"./utilsCore-CP_vVdbb.js";import"./x-J_4_vLiR.js";import"./createLucideIcon-WuVVelq6.js";import"./info-C1sVZy1p.js";import"./circle-alert-DLECpcf8.js";import"./triangle-alert-B8OyTqv6.js";import"./circle-check-big-DxMAU-e3.js";const S={title:"Data + Visualization/Glass Alert",component:r,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassalert component."}}},argTypes:{variant:{control:{type:"select"},options:["default","success","warning","error","info","destructive"],description:"Alert variant"},size:{control:{type:"select"},options:["sm","md","lg"],description:"Alert size"},dismissible:{control:"boolean",description:"Whether the alert can be dismissed"},showIcon:{control:"boolean",description:"Show default icon"}},args:{variant:"info",size:"md",dismissible:!1,showIcon:!0}},a={args:{animate:!1,children:"Review notice: sample alert content is visible.",style:{width:"min(280px, calc(100vw - 32px))",color:"#0f172a"}}},i={render:e=>s.jsxs("div",{className:"glass-flex glass-flex-col glass-gap-4",children:[s.jsx(r,{...e,variant:"info",children:"This is an info alert"}),s.jsx(r,{...e,variant:"success",children:"This is a success alert"}),s.jsx(r,{...e,variant:"warning",children:"This is a warning alert"}),s.jsx(r,{...e,variant:"error",children:"This is an error alert"})]})};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
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
