import{j as s}from"./iframe-FdJLCixk.js";import{G as r}from"./GlassAlert-ROdreiXt.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassButton-j_2Pw_Y5.js";import"./index-C6BsqZ3s.js";import"./LiquidGlassMaterial-D4rBDX3V.js";import"./LiquidGlassLayerProvider-DvBswG95.js";import"./a11y-COKpGJzx.js";import"./GlassPredictiveEngine-CPg2ixuh.js";import"./GlassAchievementSystem-Cda_e14L.js";import"./OptimizedGlassCore-DXYTmyU1.js";import"./deviceCapabilities-B5v4J8AJ.js";import"./GlassBiometricAdaptation-DCbN24Re.js";import"./MotionPreferenceContext-CQKnbTlR.js";import"./GlassEyeTracking-CC0J8GgV.js";import"./GlassSpatialAudio-BRLye1vD.js";import"./MotionFramer-uMbPgrLU.js";import"./utilsCore-DnuVLwe3.js";import"./x-DI7wczfR.js";import"./createLucideIcon-BQ5nBFq9.js";import"./info-CXADDMkh.js";import"./circle-alert-DMjgBXEB.js";import"./triangle-alert-C1exZZ1b.js";import"./circle-check-big-T0e5WPGV.js";const S={title:"Data + Visualization/Glass Alert",component:r,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassalert component."}}},argTypes:{variant:{control:{type:"select"},options:["default","success","warning","error","info","destructive"],description:"Alert variant"},size:{control:{type:"select"},options:["sm","md","lg"],description:"Alert size"},dismissible:{control:"boolean",description:"Whether the alert can be dismissed"},showIcon:{control:"boolean",description:"Show default icon"}},args:{variant:"info",size:"md",dismissible:!1,showIcon:!0}},a={args:{animate:!1,children:"Review notice: sample alert content is visible.",style:{width:"min(280px, calc(100vw - 32px))",color:"#0f172a"}}},i={render:e=>s.jsxs("div",{className:"glass-flex glass-flex-col glass-gap-4",children:[s.jsx(r,{...e,variant:"info",children:"This is an info alert"}),s.jsx(r,{...e,variant:"success",children:"This is a success alert"}),s.jsx(r,{...e,variant:"warning",children:"This is a warning alert"}),s.jsx(r,{...e,variant:"error",children:"This is an error alert"})]})};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
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
