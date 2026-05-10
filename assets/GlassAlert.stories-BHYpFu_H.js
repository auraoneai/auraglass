import{j as s}from"./iframe-DinEdlu4.js";import{G as r}from"./GlassAlert-DtjtgC6v.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassButton-DtDq-6cE.js";import"./index-BSZLQSMP.js";import"./LiquidGlassMaterial-CvuHza0N.js";import"./LiquidGlassLayerProvider-GNUOtjWn.js";import"./a11y-BZVU29oS.js";import"./GlassPredictiveEngine-BKPaam1d.js";import"./GlassAchievementSystem-GIvRvVG8.js";import"./OptimizedGlassCore-mTd-BSmd.js";import"./deviceCapabilities-8hOeRztp.js";import"./GlassBiometricAdaptation-DQo37Ppl.js";import"./MotionPreferenceContext-C6zfnLSu.js";import"./GlassEyeTracking-D-igIz05.js";import"./GlassSpatialAudio-FTaDbqAm.js";import"./MotionFramer-WyK-4knE.js";import"./utilsCore-EAOjHx1h.js";import"./x-BIWu70bn.js";import"./createLucideIcon-DfdB-aiz.js";import"./info-CAUJl0eZ.js";import"./circle-alert-BIDFUaUj.js";import"./triangle-alert-BzOlJwwl.js";import"./circle-check-big-C14fiPCs.js";const S={title:"Data + Visualization/Glass Alert",component:r,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassalert component."}}},argTypes:{variant:{control:{type:"select"},options:["default","success","warning","error","info","destructive"],description:"Alert variant"},size:{control:{type:"select"},options:["sm","md","lg"],description:"Alert size"},dismissible:{control:"boolean",description:"Whether the alert can be dismissed"},showIcon:{control:"boolean",description:"Show default icon"}},args:{variant:"info",size:"md",dismissible:!1,showIcon:!0}},a={args:{animate:!1,children:"Review notice: sample alert content is visible.",style:{width:"min(280px, calc(100vw - 32px))",color:"#0f172a"}}},i={render:e=>s.jsxs("div",{className:"glass-flex glass-flex-col glass-gap-4",children:[s.jsx(r,{...e,variant:"info",children:"This is an info alert"}),s.jsx(r,{...e,variant:"success",children:"This is a success alert"}),s.jsx(r,{...e,variant:"warning",children:"This is a warning alert"}),s.jsx(r,{...e,variant:"error",children:"This is an error alert"})]})};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
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
