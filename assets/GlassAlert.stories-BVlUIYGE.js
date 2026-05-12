import{j as s}from"./iframe-D5XNSE8t.js";import{G as r}from"./GlassAlert-DEDNVj05.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassButton-BOFlydal.js";import"./index-C5YfwLuS.js";import"./LiquidGlassMaterial-PIWApLWo.js";import"./LiquidGlassLayerProvider-Cctd_86z.js";import"./a11y-BFAoh2ff.js";import"./GlassPredictiveEngine-z1M3s8P_.js";import"./GlassAchievementSystem-DddBzQgy.js";import"./OptimizedGlassCore-CXfAtOX-.js";import"./deviceCapabilities-QhTB8XNW.js";import"./GlassBiometricAdaptation-CNbD9aRM.js";import"./MotionPreferenceContext-BsYtSTuz.js";import"./GlassEyeTracking-XfaAeBCk.js";import"./GlassSpatialAudio-dtj1_O9L.js";import"./MotionFramer-BJ26b83I.js";import"./utilsCore-BoSRIG9I.js";import"./x-BwNljDFy.js";import"./createLucideIcon-C9kAMw0Q.js";import"./info-B9zahwnW.js";import"./circle-alert-Buw0w41z.js";import"./triangle-alert-1rjjK38N.js";import"./circle-check-big-DjSH82SF.js";const S={title:"Data + Visualization/Glass Alert",component:r,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassalert component."}}},argTypes:{variant:{control:{type:"select"},options:["default","success","warning","error","info","destructive"],description:"Alert variant"},size:{control:{type:"select"},options:["sm","md","lg"],description:"Alert size"},dismissible:{control:"boolean",description:"Whether the alert can be dismissed"},showIcon:{control:"boolean",description:"Show default icon"}},args:{variant:"info",size:"md",dismissible:!1,showIcon:!0}},a={args:{animate:!1,children:"Review notice: sample alert content is visible.",style:{width:"min(280px, calc(100vw - 32px))",color:"#0f172a"}}},i={render:e=>s.jsxs("div",{className:"glass-flex glass-flex-col glass-gap-4",children:[s.jsx(r,{...e,variant:"info",children:"This is an info alert"}),s.jsx(r,{...e,variant:"success",children:"This is a success alert"}),s.jsx(r,{...e,variant:"warning",children:"This is a warning alert"}),s.jsx(r,{...e,variant:"error",children:"This is an error alert"})]})};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
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
