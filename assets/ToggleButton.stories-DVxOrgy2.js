import{j as s}from"./iframe-LB2Lfhgp.js";import{T as a}from"./ToggleButton-XrPDaCly.js";import{c}from"./createLucideIcon-CKdMI_TB.js";import{S as d}from"./star-CyCwilSW.js";import{H as m}from"./heart-BysG04H6.js";import"./preload-helper-PPVm8Dsz.js";import"./a11y-DBdyTOMI.js";import"./GlassAchievementSystem-C7yLUSqC.js";import"./OptimizedGlassCore-Bt3saaFo.js";import"./deviceCapabilities-DKKFd1VE.js";import"./GlassBiometricAdaptation-CUjpLWNp.js";import"./MotionPreferenceContext-CGVERj_F.js";import"./GlassEyeTracking-d4dXQVzJ.js";import"./GlassPredictiveEngine-nHzYrt40.js";import"./GlassSpatialAudio-Cjoio7Yg.js";import"./MotionFramer-CR_bXaKW.js";import"./utilsCore-iKIe4RkQ.js";const u=[["path",{d:"M7 10v12",key:"1qc93n"}],["path",{d:"M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z",key:"emmmcr"}]],p=c("thumbs-up",u),D={title:"Reference/Legacy Components/Toggle Button",component:a,parameters:{layout:"centered",docs:{description:{component:"A toggle button with glassmorphism styling and physics-based animations."}}},argTypes:{children:{control:"text",description:"Button content/text"},selected:{control:"boolean",description:"Whether the button is selected/toggled"},value:{control:"text",description:"Value associated with the button"},size:{control:{type:"select"},options:["sm","md","lg","medium"],description:"Size variant"},variant:{control:{type:"select"},options:["default","primary","secondary","outlined"],description:"Visual variant"},color:{control:{type:"select"},options:["primary","secondary","success","warning","error","info","default"],description:"Color theme"},glass:{control:"boolean",description:"Enable glassmorphism effect"},glassVariant:{control:{type:"select"},options:["frosted","dynamic","clear","tinted","luminous"],description:"Glass styling variant"},blurStrength:{control:{type:"select"},options:["none","light","standard","heavy"],description:"Blur strength for glass effect"},fullWidth:{control:"boolean",description:"Make button full width"},disabled:{control:"boolean",description:"Disable the button"},className:{control:"text",description:"Additional CSS classes"}},args:{children:"Toggle",selected:!1,size:"md",variant:"default",color:"primary",glass:!0,glassVariant:"frosted",blurStrength:"standard",fullWidth:!1,disabled:!1}},r={args:{children:"Like"}},n={render:e=>s.jsxs("div",{className:"glass-flex glass-flex-wrap glass-gap-4",children:[s.jsx(a,{...e,variant:"default",children:"Default"}),s.jsx(a,{...e,variant:"primary",children:"Primary"}),s.jsx(a,{...e,variant:"secondary",children:"Secondary"}),s.jsx(a,{...e,variant:"outlined",children:"Outlined"})]})},t={render:e=>s.jsxs("div",{className:"glass-flex glass-flex-wrap glass-gap-4",children:[s.jsx(a,{...e,color:"primary",children:"Primary"}),s.jsx(a,{...e,color:"secondary",children:"Secondary"}),s.jsx(a,{...e,color:"success",children:"Success"}),s.jsx(a,{...e,color:"warning",children:"Warning"}),s.jsx(a,{...e,color:"error",children:"Error"}),s.jsx(a,{...e,color:"info",children:"Info"})]})},o={render:e=>s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-4",children:[s.jsx(a,{...e,size:"sm",children:"Small"}),s.jsx(a,{...e,size:"md",children:"Medium"}),s.jsx(a,{...e,size:"lg",children:"Large"})]})},l={render:e=>s.jsxs("div",{className:"glass-flex glass-flex-wrap glass-gap-4",children:[s.jsxs(a,{...e,children:[s.jsx(p,{className:"glass-w-4 glass-h-4 glass-mr-2"}),"Like"]}),s.jsxs(a,{...e,children:[s.jsx(d,{className:"glass-w-4 glass-h-4 glass-mr-2"}),"Favorite"]}),s.jsxs(a,{...e,children:[s.jsx(m,{className:"glass-w-4 glass-h-4 glass-mr-2"}),"Love"]})]})},i={args:{children:"Selected",selected:!0}},g={render:e=>s.jsxs("div",{className:"glass-flex glass-flex-wrap glass-gap-4",children:[s.jsx(a,{...e,glassVariant:"frosted",children:"Frosted"}),s.jsx(a,{...e,glassVariant:"dynamic",children:"Dynamic"}),s.jsx(a,{...e,glassVariant:"clear",children:"Clear"}),s.jsx(a,{...e,glassVariant:"tinted",children:"Tinted"}),s.jsx(a,{...e,glassVariant:"luminous",children:"Luminous"})]}),args:{glass:!0}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Like'
  }
}`,...r.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-flex glass-flex-wrap glass-gap-4">
      <ToggleButton {...args} variant="default">
        Default
      </ToggleButton>
      <ToggleButton {...args} variant="primary">
        Primary
      </ToggleButton>
      <ToggleButton {...args} variant="secondary">
        Secondary
      </ToggleButton>
      <ToggleButton {...args} variant="outlined">
        Outlined
      </ToggleButton>
    </div>
}`,...n.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-flex glass-flex-wrap glass-gap-4">
      <ToggleButton {...args} color="primary">
        Primary
      </ToggleButton>
      <ToggleButton {...args} color="secondary">
        Secondary
      </ToggleButton>
      <ToggleButton {...args} color="success">
        Success
      </ToggleButton>
      <ToggleButton {...args} color="warning">
        Warning
      </ToggleButton>
      <ToggleButton {...args} color="error">
        Error
      </ToggleButton>
      <ToggleButton {...args} color="info">
        Info
      </ToggleButton>
    </div>
}`,...t.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-flex glass-items-center glass-gap-4">
      <ToggleButton {...args} size="sm">
        Small
      </ToggleButton>
      <ToggleButton {...args} size="md">
        Medium
      </ToggleButton>
      <ToggleButton {...args} size="lg">
        Large
      </ToggleButton>
    </div>
}`,...o.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-flex glass-flex-wrap glass-gap-4">
      <ToggleButton {...args}>
        <ThumbsUp className="glass-w-4 glass-h-4 glass-mr-2" />
        Like
      </ToggleButton>
      <ToggleButton {...args}>
        <Star className="glass-w-4 glass-h-4 glass-mr-2" />
        Favorite
      </ToggleButton>
      <ToggleButton {...args}>
        <Heart className="glass-w-4 glass-h-4 glass-mr-2" />
        Love
      </ToggleButton>
    </div>
}`,...l.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Selected',
    selected: true
  }
}`,...i.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-flex glass-flex-wrap glass-gap-4">
      <ToggleButton {...args} glassVariant="frosted">
        Frosted
      </ToggleButton>
      <ToggleButton {...args} glassVariant="dynamic">
        Dynamic
      </ToggleButton>
      <ToggleButton {...args} glassVariant="clear">
        Clear
      </ToggleButton>
      <ToggleButton {...args} glassVariant="tinted">
        Tinted
      </ToggleButton>
      <ToggleButton {...args} glassVariant="luminous">
        Luminous
      </ToggleButton>
    </div>,
  args: {
    glass: true
  }
}`,...g.parameters?.docs?.source}}};const W=["Default","Variants","Colors","Sizes","WithIcons","Selected","GlassVariants"];export{t as Colors,r as Default,g as GlassVariants,i as Selected,o as Sizes,n as Variants,l as WithIcons,W as __namedExportsOrder,D as default};
