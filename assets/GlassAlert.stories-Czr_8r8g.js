import{j as s}from"./iframe-C_vLCgmV.js";import{G as r}from"./GlassAlert-CQlfqvr1.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassButton-BCg-GsEv.js";import"./index-RG-K5OTs.js";import"./LiquidGlassMaterial-BcA2rjwO.js";import"./LiquidGlassLayerProvider-C85Vz4rQ.js";import"./a11y-BbCUV6V2.js";import"./GlassPredictiveEngine-CCvSKPQN.js";import"./GlassAchievementSystem-Cqapag4w.js";import"./OptimizedGlassCore-lqvY1K1L.js";import"./deviceCapabilities-CXqi70D6.js";import"./GlassBiometricAdaptation-g_CxFpp5.js";import"./MotionPreferenceContext-9UGqKYQR.js";import"./GlassEyeTracking-CuJ9LhVx.js";import"./GlassSpatialAudio-BQeaXM6E.js";import"./MotionFramer-DGhpSic8.js";import"./utilsCore-CHQMUrDx.js";import"./x-4g5CFtCU.js";import"./createLucideIcon-Pg8rt_v8.js";import"./info-BJupMWSS.js";import"./circle-alert-Ba16ZPCh.js";import"./triangle-alert-DsdowU3O.js";import"./circle-check-big-DxuioPp9.js";const S={title:"Data + Visualization/Glass Alert",component:r,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassalert component."}}},argTypes:{variant:{control:{type:"select"},options:["default","success","warning","error","info","destructive"],description:"Alert variant"},size:{control:{type:"select"},options:["sm","md","lg"],description:"Alert size"},dismissible:{control:"boolean",description:"Whether the alert can be dismissed"},showIcon:{control:"boolean",description:"Show default icon"}},args:{variant:"info",size:"md",dismissible:!1,showIcon:!0}},a={args:{animate:!1,children:"Review notice: sample alert content is visible.",style:{width:"min(280px, calc(100vw - 32px))",color:"#0f172a"}}},i={render:e=>s.jsxs("div",{className:"glass-flex glass-flex-col glass-gap-4",children:[s.jsx(r,{...e,variant:"info",children:"This is an info alert"}),s.jsx(r,{...e,variant:"success",children:"This is a success alert"}),s.jsx(r,{...e,variant:"warning",children:"This is a warning alert"}),s.jsx(r,{...e,variant:"error",children:"This is an error alert"})]})};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
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
