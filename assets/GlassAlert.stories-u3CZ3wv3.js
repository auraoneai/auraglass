import{j as s}from"./iframe-CsQVqAwV.js";import{G as r}from"./GlassAlert-_96uik13.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassButton-BSJPvHfc.js";import"./LiquidGlassMaterial-CRcy5buz.js";import"./LiquidGlassLayerProvider-D2HBAC0J.js";import"./a11y-Hmy9mHoX.js";import"./GlassPredictiveEngine-f8zsKCVc.js";import"./GlassAchievementSystem-DfLKECHx.js";import"./OptimizedGlassCore-9QmO_Ix3.js";import"./deviceCapabilities-Buw_PRut.js";import"./GlassBiometricAdaptation-CLS2xsX8.js";import"./MotionPreferenceContext-CUUlsW5l.js";import"./GlassEyeTracking-gXPSzZth.js";import"./GlassSpatialAudio-DotJXLvx.js";import"./MotionFramer-DW55GtF3.js";import"./utilsCore-ClZUzpJN.js";import"./components-DbL1lRmA.js";const b={title:"Data + Visualization/Glass Alert",component:r,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassalert component."}}},argTypes:{variant:{control:{type:"select"},options:["default","success","warning","error","info","destructive"],description:"Alert variant"},size:{control:{type:"select"},options:["sm","md","lg"],description:"Alert size"},dismissible:{control:"boolean",description:"Whether the alert can be dismissed"},showIcon:{control:"boolean",description:"Show default icon"}},args:{variant:"info",size:"md",dismissible:!1,showIcon:!0}},a={args:{animate:!1,children:"Review notice: sample alert content is visible.",style:{width:"min(280px, calc(100vw - 32px))",color:"#0f172a"}}},i={render:e=>s.jsxs("div",{className:"glass-flex glass-flex-col glass-gap-4",children:[s.jsx(r,{...e,variant:"info",children:"This is an info alert"}),s.jsx(r,{...e,variant:"success",children:"This is a success alert"}),s.jsx(r,{...e,variant:"warning",children:"This is a warning alert"}),s.jsx(r,{...e,variant:"error",children:"This is an error alert"})]})};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
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
}`,...i.parameters?.docs?.source}}};const j=["Default","Variants"];export{a as Default,i as Variants,j as __namedExportsOrder,b as default};
