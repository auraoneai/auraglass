import{j as s}from"./iframe-B_p7zla-.js";import{G as r}from"./GlassAlert-0mrkAq8f.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassButton-BLOvqXGF.js";import"./index-CGSQAKf9.js";import"./LiquidGlassMaterial-C_6TtWno.js";import"./LiquidGlassLayerProvider-C-9aZbrB.js";import"./a11y-Js05jiIh.js";import"./GlassPredictiveEngine-D6Iw_Zo5.js";import"./GlassAchievementSystem-CjoOxvts.js";import"./OptimizedGlassCore-DOcR6zy-.js";import"./deviceCapabilities-BJ_x-v1T.js";import"./GlassBiometricAdaptation-D1X16vNJ.js";import"./MotionPreferenceContext-BpYLW5VW.js";import"./GlassEyeTracking-1XHT9Ucr.js";import"./GlassSpatialAudio-N4RyGCEL.js";import"./MotionFramer-o4e46iWo.js";import"./utilsCore-8IEQIJNb.js";import"./x-BFu83igl.js";import"./createLucideIcon-D6fqlqMf.js";import"./info-DkejK4x-.js";import"./circle-alert-BEdVFR22.js";import"./triangle-alert-COBD8mhP.js";import"./circle-check-big-0g36UREI.js";const S={title:"Data + Visualization/Glass Alert",component:r,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassalert component."}}},argTypes:{variant:{control:{type:"select"},options:["default","success","warning","error","info","destructive"],description:"Alert variant"},size:{control:{type:"select"},options:["sm","md","lg"],description:"Alert size"},dismissible:{control:"boolean",description:"Whether the alert can be dismissed"},showIcon:{control:"boolean",description:"Show default icon"}},args:{variant:"info",size:"md",dismissible:!1,showIcon:!0}},a={args:{animate:!1,children:"Review notice: sample alert content is visible.",style:{width:"min(280px, calc(100vw - 32px))",color:"#0f172a"}}},i={render:e=>s.jsxs("div",{className:"glass-flex glass-flex-col glass-gap-4",children:[s.jsx(r,{...e,variant:"info",children:"This is an info alert"}),s.jsx(r,{...e,variant:"success",children:"This is a success alert"}),s.jsx(r,{...e,variant:"warning",children:"This is a warning alert"}),s.jsx(r,{...e,variant:"error",children:"This is an error alert"})]})};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
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
