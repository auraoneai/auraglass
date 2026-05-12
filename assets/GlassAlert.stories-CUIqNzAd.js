import{j as s}from"./iframe-LB2Lfhgp.js";import{G as r}from"./GlassAlert-vdWJPOA1.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassButton-BB_LiVtS.js";import"./index-DCQcgPGK.js";import"./LiquidGlassMaterial-O4aHTI2D.js";import"./LiquidGlassLayerProvider-DEWz-jJN.js";import"./a11y-DBdyTOMI.js";import"./GlassPredictiveEngine-nHzYrt40.js";import"./GlassAchievementSystem-C7yLUSqC.js";import"./OptimizedGlassCore-Bt3saaFo.js";import"./deviceCapabilities-DKKFd1VE.js";import"./GlassBiometricAdaptation-CUjpLWNp.js";import"./MotionPreferenceContext-CGVERj_F.js";import"./GlassEyeTracking-d4dXQVzJ.js";import"./GlassSpatialAudio-Cjoio7Yg.js";import"./MotionFramer-CR_bXaKW.js";import"./utilsCore-iKIe4RkQ.js";import"./x-smbjVqLm.js";import"./createLucideIcon-CKdMI_TB.js";import"./info-CEhpYvOq.js";import"./circle-alert-DKAjFm44.js";import"./triangle-alert-yI_6h17f.js";import"./circle-check-big-CAGKcuRU.js";const S={title:"Data + Visualization/Glass Alert",component:r,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassalert component."}}},argTypes:{variant:{control:{type:"select"},options:["default","success","warning","error","info","destructive"],description:"Alert variant"},size:{control:{type:"select"},options:["sm","md","lg"],description:"Alert size"},dismissible:{control:"boolean",description:"Whether the alert can be dismissed"},showIcon:{control:"boolean",description:"Show default icon"}},args:{variant:"info",size:"md",dismissible:!1,showIcon:!0}},a={args:{animate:!1,children:"Review notice: sample alert content is visible.",style:{width:"min(280px, calc(100vw - 32px))",color:"#0f172a"}}},i={render:e=>s.jsxs("div",{className:"glass-flex glass-flex-col glass-gap-4",children:[s.jsx(r,{...e,variant:"info",children:"This is an info alert"}),s.jsx(r,{...e,variant:"success",children:"This is a success alert"}),s.jsx(r,{...e,variant:"warning",children:"This is a warning alert"}),s.jsx(r,{...e,variant:"error",children:"This is an error alert"})]})};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
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
