import{j as s}from"./iframe-BJUPYBdj.js";import{G as r}from"./GlassAlert-CmB7lWul.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassButton-B47sqpMX.js";import"./index-CVvdFpfh.js";import"./LiquidGlassMaterial-BudbaD-0.js";import"./LiquidGlassLayerProvider-BOlOA680.js";import"./a11y-Cl5jzkbw.js";import"./GlassPredictiveEngine-yiru1Zak.js";import"./GlassAchievementSystem-BNWOa4S7.js";import"./OptimizedGlassCore-n2ERVMDY.js";import"./deviceCapabilities-C60oOEa3.js";import"./GlassBiometricAdaptation-CF628xeO.js";import"./MotionPreferenceContext-dbV6fYo1.js";import"./GlassEyeTracking-CJYTwkOd.js";import"./GlassSpatialAudio-BUzWn3vB.js";import"./MotionFramer-DEr7b4H0.js";import"./utilsCore-Djkk-eL4.js";import"./x-DqthqxkJ.js";import"./createLucideIcon-BZQYpAY8.js";import"./info-Bz8_w7kR.js";import"./circle-alert-CusPIf_r.js";import"./triangle-alert-BdSWSeXE.js";import"./circle-check-big-BOPEtcqV.js";const V={title:"Data + Visualization/Glass Alert",component:r,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassalert component."}}},argTypes:{variant:{control:{type:"select"},options:["default","success","warning","error","info","destructive"],description:"Alert variant"},size:{control:{type:"select"},options:["sm","md","lg"],description:"Alert size"},dismissible:{control:"boolean",description:"Whether the alert can be dismissed"},showIcon:{control:"boolean",description:"Show default icon"}},args:{variant:"info",size:"md",dismissible:!1,showIcon:!0}},e={args:{children:"This is a sample alert message with important information."}},i={render:a=>s.jsxs("div",{className:"glass-flex glass-flex-col glass-gap-4",children:[s.jsx(r,{...a,variant:"info",children:"This is an info alert"}),s.jsx(r,{...a,variant:"success",children:"This is a success alert"}),s.jsx(r,{...a,variant:"warning",children:"This is a warning alert"}),s.jsx(r,{...a,variant:"error",children:"This is an error alert"})]})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
