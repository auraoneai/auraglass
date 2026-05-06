import{j as s}from"./iframe-DpweptvF.js";import{G as r}from"./GlassAlert-DmbKaGUb.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassButton-CoJjSHnE.js";import"./index-DErlfuJO.js";import"./LiquidGlassMaterial-nIJf4szv.js";import"./LiquidGlassLayerProvider-DwkmVtLC.js";import"./GlassPredictiveEngine-CJz8dse6.js";import"./GlassAchievementSystem-DQQoVp6r.js";import"./OptimizedGlassCore-UOg4NIOz.js";import"./GlassBiometricAdaptation-CJofGeVw.js";import"./MotionPreferenceContext-5A7bWbbY.js";import"./GlassEyeTracking-BvBuetm1.js";import"./GlassSpatialAudio-Csw4ezvx.js";import"./MotionFramer-BmJovKMH.js";import"./utilsCore-Diw1ReC2.js";import"./x-CqbWQJ3p.js";import"./createLucideIcon-eJ4-KqhR.js";import"./info-4-_b_JV9.js";import"./circle-alert-BwlOc-rh.js";import"./triangle-alert-CLV80028.js";import"./circle-check-big-Cic4d8hW.js";const D={title:"Components/Data-display/GlassAlert",component:r,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassalert component."}}},argTypes:{variant:{control:{type:"select"},options:["default","success","warning","error","info","destructive"],description:"Alert variant"},size:{control:{type:"select"},options:["sm","md","lg"],description:"Alert size"},dismissible:{control:"boolean",description:"Whether the alert can be dismissed"},showIcon:{control:"boolean",description:"Show default icon"}},args:{variant:"info",size:"md",dismissible:!1,showIcon:!0}},e={args:{children:"This is a sample alert message with important information."}},t={render:a=>s.jsxs("div",{className:"glass-flex glass-flex-col glass-gap-4",children:[s.jsx(r,{...a,variant:"info",children:"This is an info alert"}),s.jsx(r,{...a,variant:"success",children:"This is a success alert"}),s.jsx(r,{...a,variant:"warning",children:"This is a warning alert"}),s.jsx(r,{...a,variant:"error",children:"This is an error alert"})]})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
