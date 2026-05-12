import{j as s}from"./iframe-DMS_w3ti.js";import{G as r}from"./GlassAlert-CDTb-m_P.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassButton-42JbTubC.js";import"./index-CBQBDJcz.js";import"./LiquidGlassMaterial-jc8k7wz5.js";import"./LiquidGlassLayerProvider-Co7xyhx0.js";import"./a11y-C8aSFzaY.js";import"./GlassPredictiveEngine-dl2Ev2_W.js";import"./GlassAchievementSystem-BRuQySjd.js";import"./OptimizedGlassCore-BJl9vDDN.js";import"./deviceCapabilities-BipSAG1R.js";import"./GlassBiometricAdaptation-B6W1s0G5.js";import"./MotionPreferenceContext-CNdW8zji.js";import"./GlassEyeTracking-B6NmTSOF.js";import"./GlassSpatialAudio-B7DGn6o2.js";import"./MotionFramer-ewjBujsI.js";import"./utilsCore-IWfe3uJL.js";import"./x-XW0JXj_h.js";import"./createLucideIcon-D5EWqkVJ.js";import"./info-Bf7w604r.js";import"./circle-alert-CQZG7g7I.js";import"./triangle-alert-CShV80TL.js";import"./circle-check-big-Dhu19wmT.js";const S={title:"Data + Visualization/Glass Alert",component:r,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassalert component."}}},argTypes:{variant:{control:{type:"select"},options:["default","success","warning","error","info","destructive"],description:"Alert variant"},size:{control:{type:"select"},options:["sm","md","lg"],description:"Alert size"},dismissible:{control:"boolean",description:"Whether the alert can be dismissed"},showIcon:{control:"boolean",description:"Show default icon"}},args:{variant:"info",size:"md",dismissible:!1,showIcon:!0}},a={args:{animate:!1,children:"Review notice: sample alert content is visible.",style:{width:"min(280px, calc(100vw - 32px))",color:"#0f172a"}}},i={render:e=>s.jsxs("div",{className:"glass-flex glass-flex-col glass-gap-4",children:[s.jsx(r,{...e,variant:"info",children:"This is an info alert"}),s.jsx(r,{...e,variant:"success",children:"This is a success alert"}),s.jsx(r,{...e,variant:"warning",children:"This is a warning alert"}),s.jsx(r,{...e,variant:"error",children:"This is an error alert"})]})};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
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
