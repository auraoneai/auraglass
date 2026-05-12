import{j as s}from"./iframe-C690vU5J.js";import{G as r}from"./GlassAlert-7MOSjjAz.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassButton-BdLvfXig.js";import"./index-Dayedyh0.js";import"./LiquidGlassMaterial-BBmAKzP0.js";import"./LiquidGlassLayerProvider-DhxSOSnK.js";import"./a11y-CqibiY8Q.js";import"./GlassPredictiveEngine-Ce11n6gf.js";import"./GlassAchievementSystem-BgZ4Ujyz.js";import"./OptimizedGlassCore-BFIVwF34.js";import"./deviceCapabilities-CziwpX2D.js";import"./GlassBiometricAdaptation-Y65y9KhH.js";import"./MotionPreferenceContext-IxMuCihq.js";import"./GlassEyeTracking-DaVr191_.js";import"./GlassSpatialAudio-C5lfjDI8.js";import"./MotionFramer-BSdpDBRW.js";import"./utilsCore-BwjSsiAl.js";import"./x-C9p9miAZ.js";import"./createLucideIcon-B2KPDEa6.js";import"./info-sM2F2ls8.js";import"./circle-alert-1IMtAuDY.js";import"./triangle-alert-DGfmPRW4.js";import"./circle-check-big-CwzbYhKg.js";const S={title:"Data + Visualization/Glass Alert",component:r,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassalert component."}}},argTypes:{variant:{control:{type:"select"},options:["default","success","warning","error","info","destructive"],description:"Alert variant"},size:{control:{type:"select"},options:["sm","md","lg"],description:"Alert size"},dismissible:{control:"boolean",description:"Whether the alert can be dismissed"},showIcon:{control:"boolean",description:"Show default icon"}},args:{variant:"info",size:"md",dismissible:!1,showIcon:!0}},a={args:{animate:!1,children:"Review notice: sample alert content is visible.",style:{width:"min(280px, calc(100vw - 32px))",color:"#0f172a"}}},i={render:e=>s.jsxs("div",{className:"glass-flex glass-flex-col glass-gap-4",children:[s.jsx(r,{...e,variant:"info",children:"This is an info alert"}),s.jsx(r,{...e,variant:"success",children:"This is a success alert"}),s.jsx(r,{...e,variant:"warning",children:"This is a warning alert"}),s.jsx(r,{...e,variant:"error",children:"This is an error alert"})]})};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
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
