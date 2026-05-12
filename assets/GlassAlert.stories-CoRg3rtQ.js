import{j as s}from"./iframe-CXbhLBXA.js";import{G as r}from"./GlassAlert-C7OVYmXc.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassButton-DqfAw9yt.js";import"./index-C4dy-78K.js";import"./LiquidGlassMaterial-DmLZCyOG.js";import"./LiquidGlassLayerProvider-6tyztJ16.js";import"./a11y-BJgrmYZ-.js";import"./GlassPredictiveEngine-UWtFxNpt.js";import"./GlassAchievementSystem--g6lt073.js";import"./OptimizedGlassCore-ClSJuy9q.js";import"./deviceCapabilities-BiQAPMnE.js";import"./GlassBiometricAdaptation-CVQyWdUN.js";import"./MotionPreferenceContext-DS5tUD5P.js";import"./GlassEyeTracking-DZ1OMKL8.js";import"./GlassSpatialAudio-CVfAtkkI.js";import"./MotionFramer-C32WALOd.js";import"./utilsCore-qPq2jRlE.js";import"./x-CUg_-kK6.js";import"./createLucideIcon-5X2vFipY.js";import"./info-D37MCwFm.js";import"./circle-alert-Bx10tOx-.js";import"./triangle-alert-DuEh0FU9.js";import"./circle-check-big-D-XvINWm.js";const S={title:"Data + Visualization/Glass Alert",component:r,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassalert component."}}},argTypes:{variant:{control:{type:"select"},options:["default","success","warning","error","info","destructive"],description:"Alert variant"},size:{control:{type:"select"},options:["sm","md","lg"],description:"Alert size"},dismissible:{control:"boolean",description:"Whether the alert can be dismissed"},showIcon:{control:"boolean",description:"Show default icon"}},args:{variant:"info",size:"md",dismissible:!1,showIcon:!0}},a={args:{animate:!1,children:"Review notice: sample alert content is visible.",style:{width:"min(280px, calc(100vw - 32px))",color:"#0f172a"}}},i={render:e=>s.jsxs("div",{className:"glass-flex glass-flex-col glass-gap-4",children:[s.jsx(r,{...e,variant:"info",children:"This is an info alert"}),s.jsx(r,{...e,variant:"success",children:"This is a success alert"}),s.jsx(r,{...e,variant:"warning",children:"This is a warning alert"}),s.jsx(r,{...e,variant:"error",children:"This is an error alert"})]})};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
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
