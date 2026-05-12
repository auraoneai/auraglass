import{j as s}from"./iframe-ChjdpTMc.js";import{G as r}from"./GlassAlert-BBJVOlOB.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassButton-B52AacQY.js";import"./index-BLCfc7M6.js";import"./LiquidGlassMaterial-BJhmvgAO.js";import"./LiquidGlassLayerProvider-BzmOFUIB.js";import"./a11y-Dsb5vlCx.js";import"./GlassPredictiveEngine-DXltJTPU.js";import"./GlassAchievementSystem-1rqoPyI_.js";import"./OptimizedGlassCore-DN1SoNCt.js";import"./deviceCapabilities-CmFcsI28.js";import"./GlassBiometricAdaptation-DIULEx2R.js";import"./MotionPreferenceContext-DQIb5qFV.js";import"./GlassEyeTracking-BiTzJrvO.js";import"./GlassSpatialAudio-Bh0QJys1.js";import"./MotionFramer-Co8aYoJM.js";import"./utilsCore-CsXu-XBU.js";import"./x-oDe_FnIT.js";import"./createLucideIcon-DLakD0cH.js";import"./info-D5SFlAHJ.js";import"./circle-alert-BVwqNgKA.js";import"./triangle-alert-5DtfY1Bk.js";import"./circle-check-big-DE8iD3xV.js";const S={title:"Data + Visualization/Glass Alert",component:r,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassalert component."}}},argTypes:{variant:{control:{type:"select"},options:["default","success","warning","error","info","destructive"],description:"Alert variant"},size:{control:{type:"select"},options:["sm","md","lg"],description:"Alert size"},dismissible:{control:"boolean",description:"Whether the alert can be dismissed"},showIcon:{control:"boolean",description:"Show default icon"}},args:{variant:"info",size:"md",dismissible:!1,showIcon:!0}},a={args:{animate:!1,children:"Review notice: sample alert content is visible.",style:{width:"min(280px, calc(100vw - 32px))",color:"#0f172a"}}},i={render:e=>s.jsxs("div",{className:"glass-flex glass-flex-col glass-gap-4",children:[s.jsx(r,{...e,variant:"info",children:"This is an info alert"}),s.jsx(r,{...e,variant:"success",children:"This is a success alert"}),s.jsx(r,{...e,variant:"warning",children:"This is a warning alert"}),s.jsx(r,{...e,variant:"error",children:"This is an error alert"})]})};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
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
