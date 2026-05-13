import{j as s}from"./iframe-CWR0-zUi.js";import{G as r}from"./GlassAlert-JvDRByZ4.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassButton-SHcvRa7W.js";import"./index-gJPcExbB.js";import"./LiquidGlassMaterial-C3sWBx_W.js";import"./LiquidGlassLayerProvider-CP44SBEZ.js";import"./a11y-DSISWsBF.js";import"./GlassPredictiveEngine-Cif37kog.js";import"./GlassAchievementSystem-B4pUY0Vz.js";import"./OptimizedGlassCore-BBTk9mqX.js";import"./deviceCapabilities-D9RQ8fuG.js";import"./GlassBiometricAdaptation-CTzLEBN3.js";import"./MotionPreferenceContext-9ity8rND.js";import"./GlassEyeTracking-CvSiy76D.js";import"./GlassSpatialAudio-uINrNyo9.js";import"./MotionFramer-uOc5z-wd.js";import"./utilsCore-jGV8p3MB.js";import"./x-CZ2IpQXm.js";import"./createLucideIcon-BQVzcqpb.js";import"./info-CK9-4obM.js";import"./circle-alert-CowtMZZK.js";import"./triangle-alert-Dptl_wKO.js";import"./circle-check-big-DNFgTmVL.js";const S={title:"Data + Visualization/Glass Alert",component:r,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassalert component."}}},argTypes:{variant:{control:{type:"select"},options:["default","success","warning","error","info","destructive"],description:"Alert variant"},size:{control:{type:"select"},options:["sm","md","lg"],description:"Alert size"},dismissible:{control:"boolean",description:"Whether the alert can be dismissed"},showIcon:{control:"boolean",description:"Show default icon"}},args:{variant:"info",size:"md",dismissible:!1,showIcon:!0}},a={args:{animate:!1,children:"Review notice: sample alert content is visible.",style:{width:"min(280px, calc(100vw - 32px))",color:"#0f172a"}}},i={render:e=>s.jsxs("div",{className:"glass-flex glass-flex-col glass-gap-4",children:[s.jsx(r,{...e,variant:"info",children:"This is an info alert"}),s.jsx(r,{...e,variant:"success",children:"This is a success alert"}),s.jsx(r,{...e,variant:"warning",children:"This is a warning alert"}),s.jsx(r,{...e,variant:"error",children:"This is an error alert"})]})};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
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
