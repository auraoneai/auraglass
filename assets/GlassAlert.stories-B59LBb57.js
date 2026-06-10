import{j as s}from"./iframe-DuFCckax.js";import{G as r}from"./GlassAlert-DSCTmHe8.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassButton-DDzmL2zF.js";import"./LiquidGlassMaterial-Cfs6Tlc8.js";import"./LiquidGlassLayerProvider-5FQsJWNj.js";import"./a11y-BVXyQ8aU.js";import"./GlassPredictiveEngine-Ci4rC9p_.js";import"./GlassAchievementSystem-BEHFsrBx.js";import"./OptimizedGlassCore-Dfu3jw2K.js";import"./deviceCapabilities-8v_R2xci.js";import"./GlassBiometricAdaptation-Bp-PMjOH.js";import"./MotionPreferenceContext-BLXtcDKN.js";import"./GlassEyeTracking-dCkUfXF5.js";import"./GlassSpatialAudio-oo5EQ7tC.js";import"./MotionFramer-1yHy_OeU.js";import"./utilsCore-D4-BhdPx.js";import"./components-C7UdsWPt.js";const b={title:"Data + Visualization/Glass Alert",component:r,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassalert component."}}},argTypes:{variant:{control:{type:"select"},options:["default","success","warning","error","info","destructive"],description:"Alert variant"},size:{control:{type:"select"},options:["sm","md","lg"],description:"Alert size"},dismissible:{control:"boolean",description:"Whether the alert can be dismissed"},showIcon:{control:"boolean",description:"Show default icon"}},args:{variant:"info",size:"md",dismissible:!1,showIcon:!0}},a={args:{animate:!1,children:"Review notice: sample alert content is visible.",style:{width:"min(280px, calc(100vw - 32px))",color:"#0f172a"}}},i={render:e=>s.jsxs("div",{className:"glass-flex glass-flex-col glass-gap-4",children:[s.jsx(r,{...e,variant:"info",children:"This is an info alert"}),s.jsx(r,{...e,variant:"success",children:"This is a success alert"}),s.jsx(r,{...e,variant:"warning",children:"This is a warning alert"}),s.jsx(r,{...e,variant:"error",children:"This is an error alert"})]})};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
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
