import{j as s}from"./iframe-CmCTHNdg.js";import{G as r}from"./GlassAlert-BYx8hFVF.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassButton-exu3jFjl.js";import"./index-CAwN4TlI.js";import"./LiquidGlassMaterial-BVZTL7OE.js";import"./LiquidGlassLayerProvider-CgsufSV2.js";import"./a11y-CGf66_f7.js";import"./GlassPredictiveEngine-CW4UQ2f3.js";import"./GlassAchievementSystem-DRIN5Sx0.js";import"./OptimizedGlassCore-DdRXKYNZ.js";import"./deviceCapabilities-BIzeQ8zU.js";import"./GlassBiometricAdaptation-CHrZGU0g.js";import"./MotionPreferenceContext-LVTuxRrL.js";import"./GlassEyeTracking-Bifz749I.js";import"./GlassSpatialAudio-jWen5KuY.js";import"./MotionFramer-CymAQigi.js";import"./utilsCore-BnC1_gd8.js";import"./x-CaYJSJge.js";import"./createLucideIcon-CTGDdcyK.js";import"./info-Dm2Qg4uM.js";import"./circle-alert-CeSlmuC_.js";import"./triangle-alert-B45zJDXB.js";import"./circle-check-big-CVoww7Cz.js";const S={title:"Data + Visualization/Glass Alert",component:r,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassalert component."}}},argTypes:{variant:{control:{type:"select"},options:["default","success","warning","error","info","destructive"],description:"Alert variant"},size:{control:{type:"select"},options:["sm","md","lg"],description:"Alert size"},dismissible:{control:"boolean",description:"Whether the alert can be dismissed"},showIcon:{control:"boolean",description:"Show default icon"}},args:{variant:"info",size:"md",dismissible:!1,showIcon:!0}},a={args:{animate:!1,children:"Review notice: sample alert content is visible.",style:{width:"min(280px, calc(100vw - 32px))",color:"#0f172a"}}},i={render:e=>s.jsxs("div",{className:"glass-flex glass-flex-col glass-gap-4",children:[s.jsx(r,{...e,variant:"info",children:"This is an info alert"}),s.jsx(r,{...e,variant:"success",children:"This is a success alert"}),s.jsx(r,{...e,variant:"warning",children:"This is a warning alert"}),s.jsx(r,{...e,variant:"error",children:"This is an error alert"})]})};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
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
