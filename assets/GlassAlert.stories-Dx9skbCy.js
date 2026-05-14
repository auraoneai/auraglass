import{j as s}from"./iframe-Ba4C8OEc.js";import{G as r}from"./GlassAlert-D8oBaun7.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassButton-DPKAQKso.js";import"./LiquidGlassMaterial-iSHTie31.js";import"./LiquidGlassLayerProvider--9uHHbrP.js";import"./a11y-S73Y6DdK.js";import"./GlassPredictiveEngine-DKT9LYlh.js";import"./GlassAchievementSystem-DTLyyi5m.js";import"./OptimizedGlassCore-CqLDO6n8.js";import"./deviceCapabilities-USAXnPyC.js";import"./GlassBiometricAdaptation-u-TThKbC.js";import"./MotionPreferenceContext-BFEebokt.js";import"./GlassEyeTracking-Im_FqsVT.js";import"./GlassSpatialAudio-pAaxFUmv.js";import"./MotionFramer-BD6tt_zB.js";import"./utilsCore-W4jNCRfx.js";import"./components-D1QjIubZ.js";const b={title:"Data + Visualization/Glass Alert",component:r,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassalert component."}}},argTypes:{variant:{control:{type:"select"},options:["default","success","warning","error","info","destructive"],description:"Alert variant"},size:{control:{type:"select"},options:["sm","md","lg"],description:"Alert size"},dismissible:{control:"boolean",description:"Whether the alert can be dismissed"},showIcon:{control:"boolean",description:"Show default icon"}},args:{variant:"info",size:"md",dismissible:!1,showIcon:!0}},a={args:{animate:!1,children:"Review notice: sample alert content is visible.",style:{width:"min(280px, calc(100vw - 32px))",color:"#0f172a"}}},i={render:e=>s.jsxs("div",{className:"glass-flex glass-flex-col glass-gap-4",children:[s.jsx(r,{...e,variant:"info",children:"This is an info alert"}),s.jsx(r,{...e,variant:"success",children:"This is a success alert"}),s.jsx(r,{...e,variant:"warning",children:"This is a warning alert"}),s.jsx(r,{...e,variant:"error",children:"This is an error alert"})]})};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
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
