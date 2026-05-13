import{j as s}from"./iframe-6PHIdj5K.js";import{G as r}from"./GlassAlert-B97QOM-x.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassButton-DQN3cJ3X.js";import"./index-DaOI25_I.js";import"./LiquidGlassMaterial-2G5x3DpB.js";import"./LiquidGlassLayerProvider-BbZqwf9k.js";import"./a11y-BJ6VmGCi.js";import"./GlassPredictiveEngine-5-bjlLQ0.js";import"./GlassAchievementSystem-BjatmrXi.js";import"./OptimizedGlassCore-BMNTpg_C.js";import"./deviceCapabilities-EYD5uplS.js";import"./GlassBiometricAdaptation-D3RF1TY1.js";import"./MotionPreferenceContext-DHrzYxkV.js";import"./GlassEyeTracking-vqguxJe3.js";import"./GlassSpatialAudio-CT9R70tG.js";import"./MotionFramer-eYH5J7Z1.js";import"./utilsCore-AmY2pZqb.js";import"./x-shBXJ_z7.js";import"./createLucideIcon-CtIWFkcf.js";import"./info-_CG2ReWV.js";import"./circle-alert-MDYEAyPT.js";import"./triangle-alert-DgDsGZZC.js";import"./circle-check-big-DUYhrmH3.js";const S={title:"Data + Visualization/Glass Alert",component:r,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassalert component."}}},argTypes:{variant:{control:{type:"select"},options:["default","success","warning","error","info","destructive"],description:"Alert variant"},size:{control:{type:"select"},options:["sm","md","lg"],description:"Alert size"},dismissible:{control:"boolean",description:"Whether the alert can be dismissed"},showIcon:{control:"boolean",description:"Show default icon"}},args:{variant:"info",size:"md",dismissible:!1,showIcon:!0}},a={args:{animate:!1,children:"Review notice: sample alert content is visible.",style:{width:"min(280px, calc(100vw - 32px))",color:"#0f172a"}}},i={render:e=>s.jsxs("div",{className:"glass-flex glass-flex-col glass-gap-4",children:[s.jsx(r,{...e,variant:"info",children:"This is an info alert"}),s.jsx(r,{...e,variant:"success",children:"This is a success alert"}),s.jsx(r,{...e,variant:"warning",children:"This is a warning alert"}),s.jsx(r,{...e,variant:"error",children:"This is an error alert"})]})};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
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
