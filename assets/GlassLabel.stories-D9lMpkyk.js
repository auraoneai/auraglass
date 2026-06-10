import{j as s}from"./iframe-BGoRE5Do.js";import{aj as i,ai as l,I as o}from"./components-BtZOXrmB.js";import{G as a}from"./GlassLabel-pNCabdhg.js";import{G as n}from"./GlassInput-CqwT_-tc.js";import"./preload-helper-PPVm8Dsz.js";import"./a11y-BGeEhmxI.js";import"./LiquidGlassMaterial-EXPYOLQS.js";import"./LiquidGlassLayerProvider-BswDX_fa.js";import"./GlassButton-ut0nWQkJ.js";import"./GlassPredictiveEngine-DXXFPx-C.js";import"./GlassAchievementSystem-sLJT3mDp.js";import"./OptimizedGlassCore-MyIZufQF.js";import"./deviceCapabilities-DE3cL9ZV.js";import"./GlassBiometricAdaptation-IkNYnwgy.js";import"./MotionPreferenceContext-C_ZYUQ6H.js";import"./GlassEyeTracking-C9EGvaAJ.js";import"./GlassSpatialAudio-BIRTaCpS.js";import"./MotionFramer-CE9QfzfL.js";import"./utilsCore-B0u8WXX6.js";const A={title:"Controls/Inputs/Glass Label",component:a,parameters:{layout:"centered",previewSurface:"component",docs:{description:{component:"A glass-aware form label with required, icon, description, and state variants."}}},args:{children:"Workspace slug",description:"Lowercase letters, numbers, and hyphens only.",required:!0,enhanced:!0,icon:s.jsx(o,{size:15})}},e={render:r=>s.jsxs("div",{className:"glass-grid glass-w-[min(520px,calc(100vw-48px))] glass-gap-5 glass-rounded-3xl glass-border glass-border-white/25 glass-bg-white/35 glass-p-6 glass-shadow-xl glass-backdrop-blur-xl",children:[s.jsxs("div",{children:[s.jsx(a,{...r,htmlFor:"workspace-slug"}),s.jsx(n,{id:"workspace-slug",placeholder:"revenue-ops",fullWidth:!0})]}),s.jsx(a,{variant:"success",icon:s.jsx(i,{size:15}),description:"The saved value passed validation.",children:"Approved setting"}),s.jsx(a,{variant:"warning",icon:s.jsx(l,{size:15}),description:"This label is readable in warning contexts.",children:"Needs review"})]})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-grid glass-w-[min(520px,calc(100vw-48px))] glass-gap-5 glass-rounded-3xl glass-border glass-border-white/25 glass-bg-white/35 glass-p-6 glass-shadow-xl glass-backdrop-blur-xl">
      <div>
        <GlassLabel {...args} htmlFor="workspace-slug" />
        <GlassInput id="workspace-slug" placeholder="revenue-ops" fullWidth />
      </div>
      <GlassLabel variant="success" icon={<CheckCircle2 size={15} />} description="The saved value passed validation.">
        Approved setting
      </GlassLabel>
      <GlassLabel variant="warning" icon={<AlertTriangle size={15} />} description="This label is readable in warning contexts.">
        Needs review
      </GlassLabel>
    </div>
}`,...e.parameters?.docs?.source}}};const C=["Default"];export{e as Default,C as __namedExportsOrder,A as default};
