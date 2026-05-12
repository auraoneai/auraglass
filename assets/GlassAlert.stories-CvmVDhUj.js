import{j as s}from"./iframe-DxUvObG1.js";import{G as r}from"./GlassAlert-xQAx92eI.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassButton-BKwl-q-g.js";import"./index-BaBnAiqB.js";import"./LiquidGlassMaterial-BTDbEReQ.js";import"./LiquidGlassLayerProvider-BQCQV5bZ.js";import"./a11y-vOvrykAi.js";import"./GlassPredictiveEngine-Db1qhY2e.js";import"./GlassAchievementSystem-Cgco6AOk.js";import"./OptimizedGlassCore-Ge4l3l3b.js";import"./deviceCapabilities-Ciz7WW1Y.js";import"./GlassBiometricAdaptation-jVd1d_Gs.js";import"./MotionPreferenceContext-CAU0EN1d.js";import"./GlassEyeTracking-C5efJHMa.js";import"./GlassSpatialAudio-DleknYpK.js";import"./MotionFramer-B6pu9S5n.js";import"./utilsCore-B6VxTi_O.js";import"./x-D9oDDJlj.js";import"./createLucideIcon-BfKGEw_5.js";import"./info-DjvNRzBX.js";import"./circle-alert-tSHeZej1.js";import"./triangle-alert-5VYgeA_B.js";import"./circle-check-big-DDiQ69ta.js";const S={title:"Data + Visualization/Glass Alert",component:r,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassalert component."}}},argTypes:{variant:{control:{type:"select"},options:["default","success","warning","error","info","destructive"],description:"Alert variant"},size:{control:{type:"select"},options:["sm","md","lg"],description:"Alert size"},dismissible:{control:"boolean",description:"Whether the alert can be dismissed"},showIcon:{control:"boolean",description:"Show default icon"}},args:{variant:"info",size:"md",dismissible:!1,showIcon:!0}},a={args:{animate:!1,children:"Review notice: sample alert content is visible.",style:{width:"min(280px, calc(100vw - 32px))",color:"#0f172a"}}},i={render:e=>s.jsxs("div",{className:"glass-flex glass-flex-col glass-gap-4",children:[s.jsx(r,{...e,variant:"info",children:"This is an info alert"}),s.jsx(r,{...e,variant:"success",children:"This is a success alert"}),s.jsx(r,{...e,variant:"warning",children:"This is a warning alert"}),s.jsx(r,{...e,variant:"error",children:"This is an error alert"})]})};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
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
