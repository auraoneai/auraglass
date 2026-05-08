import{j as s}from"./iframe-C4NFeGrN.js";import{G as r}from"./GlassAlert-BSbUnBuD.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassButton-BUfhtodi.js";import"./index-B_iEiQ1o.js";import"./LiquidGlassMaterial-CNyDwuYL.js";import"./LiquidGlassLayerProvider-BZ-DSawD.js";import"./a11y-Drh7-6qm.js";import"./GlassPredictiveEngine-p8dhL3l2.js";import"./GlassAchievementSystem-COJZihXG.js";import"./OptimizedGlassCore-pFwkcNDS.js";import"./deviceCapabilities-CcJXKEC9.js";import"./GlassBiometricAdaptation-VtcPE7IX.js";import"./MotionPreferenceContext-BsFuXk-N.js";import"./GlassEyeTracking-BVSsxMzB.js";import"./GlassSpatialAudio-CFC07lye.js";import"./MotionFramer-m7Rs0ztI.js";import"./utilsCore-CDQaqjab.js";import"./x-q8FUO0SA.js";import"./createLucideIcon-Dya9Njuo.js";import"./info-DnYe7dVP.js";import"./circle-alert-C-LCt_4f.js";import"./triangle-alert-Bb7WJOBp.js";import"./circle-check-big-DxELsDGK.js";const S={title:"Data + Visualization/Glass Alert",component:r,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassalert component."}}},argTypes:{variant:{control:{type:"select"},options:["default","success","warning","error","info","destructive"],description:"Alert variant"},size:{control:{type:"select"},options:["sm","md","lg"],description:"Alert size"},dismissible:{control:"boolean",description:"Whether the alert can be dismissed"},showIcon:{control:"boolean",description:"Show default icon"}},args:{variant:"info",size:"md",dismissible:!1,showIcon:!0}},a={args:{animate:!1,children:"Review notice: sample alert content is visible.",style:{width:"min(280px, calc(100vw - 32px))",color:"#0f172a"}}},i={render:e=>s.jsxs("div",{className:"glass-flex glass-flex-col glass-gap-4",children:[s.jsx(r,{...e,variant:"info",children:"This is an info alert"}),s.jsx(r,{...e,variant:"success",children:"This is a success alert"}),s.jsx(r,{...e,variant:"warning",children:"This is a warning alert"}),s.jsx(r,{...e,variant:"error",children:"This is an error alert"})]})};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
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
