import{j as s}from"./iframe-BVJcMDDP.js";import{G as r}from"./GlassAlert-BEgteGPO.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassButton-gi-rDkpT.js";import"./index-BeHrpr1h.js";import"./LiquidGlassMaterial-CL6ROdeZ.js";import"./LiquidGlassLayerProvider-D2JFf6sb.js";import"./a11y-BlwVq89o.js";import"./GlassPredictiveEngine-D4mTpLSA.js";import"./GlassAchievementSystem-CXirgsU1.js";import"./OptimizedGlassCore-DzSkF5wV.js";import"./deviceCapabilities-9ai_ldnn.js";import"./GlassBiometricAdaptation-LYqiCYYS.js";import"./MotionPreferenceContext-BKHCntjv.js";import"./GlassEyeTracking-B4vL1R01.js";import"./GlassSpatialAudio-U__Jh808.js";import"./MotionFramer-BKEBzTCi.js";import"./utilsCore-h7axX66k.js";import"./x-CTUf2xby.js";import"./createLucideIcon-DER72wqv.js";import"./info-CriCzt_Y.js";import"./circle-alert-DzNSVo7A.js";import"./triangle-alert-CRwNNzbV.js";import"./circle-check-big-Cy835k8j.js";const S={title:"Data + Visualization/Glass Alert",component:r,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassalert component."}}},argTypes:{variant:{control:{type:"select"},options:["default","success","warning","error","info","destructive"],description:"Alert variant"},size:{control:{type:"select"},options:["sm","md","lg"],description:"Alert size"},dismissible:{control:"boolean",description:"Whether the alert can be dismissed"},showIcon:{control:"boolean",description:"Show default icon"}},args:{variant:"info",size:"md",dismissible:!1,showIcon:!0}},a={args:{animate:!1,children:"Review notice: sample alert content is visible.",style:{width:"min(280px, calc(100vw - 32px))",color:"#0f172a"}}},i={render:e=>s.jsxs("div",{className:"glass-flex glass-flex-col glass-gap-4",children:[s.jsx(r,{...e,variant:"info",children:"This is an info alert"}),s.jsx(r,{...e,variant:"success",children:"This is a success alert"}),s.jsx(r,{...e,variant:"warning",children:"This is a warning alert"}),s.jsx(r,{...e,variant:"error",children:"This is an error alert"})]})};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
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
