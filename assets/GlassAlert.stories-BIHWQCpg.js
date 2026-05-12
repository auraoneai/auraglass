import{j as s}from"./iframe-CN7unHsM.js";import{G as r}from"./GlassAlert-Gh-GkPtq.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassButton-DrnjcySN.js";import"./index-DiDiWpqJ.js";import"./LiquidGlassMaterial-BH5nbjzw.js";import"./LiquidGlassLayerProvider-sLyyA7i-.js";import"./a11y-snjFlI8c.js";import"./GlassPredictiveEngine-DiO3ODUn.js";import"./GlassAchievementSystem-DpuPYoX4.js";import"./OptimizedGlassCore-CD-CmIfG.js";import"./deviceCapabilities-CKMFLbhe.js";import"./GlassBiometricAdaptation-jsUrE8e8.js";import"./MotionPreferenceContext-C4z2RG7B.js";import"./GlassEyeTracking-B50rWLUZ.js";import"./GlassSpatialAudio-CkI41Eli.js";import"./MotionFramer-Dcb5vjfs.js";import"./utilsCore-CnxOVXuV.js";import"./x-UCyrPPGJ.js";import"./createLucideIcon-SauGLeX7.js";import"./info-Dy3NPdvp.js";import"./circle-alert-CAadzvbr.js";import"./triangle-alert-DvUD6Mqv.js";import"./circle-check-big-uHOde_WV.js";const S={title:"Data + Visualization/Glass Alert",component:r,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassalert component."}}},argTypes:{variant:{control:{type:"select"},options:["default","success","warning","error","info","destructive"],description:"Alert variant"},size:{control:{type:"select"},options:["sm","md","lg"],description:"Alert size"},dismissible:{control:"boolean",description:"Whether the alert can be dismissed"},showIcon:{control:"boolean",description:"Show default icon"}},args:{variant:"info",size:"md",dismissible:!1,showIcon:!0}},a={args:{animate:!1,children:"Review notice: sample alert content is visible.",style:{width:"min(280px, calc(100vw - 32px))",color:"#0f172a"}}},i={render:e=>s.jsxs("div",{className:"glass-flex glass-flex-col glass-gap-4",children:[s.jsx(r,{...e,variant:"info",children:"This is an info alert"}),s.jsx(r,{...e,variant:"success",children:"This is a success alert"}),s.jsx(r,{...e,variant:"warning",children:"This is a warning alert"}),s.jsx(r,{...e,variant:"error",children:"This is an error alert"})]})};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
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
