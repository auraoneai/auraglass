import{j as s}from"./iframe-DL0Cy6Qm.js";import{aj as i,ai as l,I as o}from"./components-DpExAbu2.js";import{G as a}from"./GlassLabel-BABRgcN-.js";import{G as n}from"./GlassInput-Box-XUNm.js";import"./preload-helper-PPVm8Dsz.js";import"./a11y-BmS7yTss.js";import"./LiquidGlassMaterial-UbBe1GEe.js";import"./LiquidGlassLayerProvider-CWq40Pup.js";import"./GlassButton-DfOzjBO4.js";import"./GlassPredictiveEngine-05Sa5boq.js";import"./GlassAchievementSystem-BHEgKCBn.js";import"./OptimizedGlassCore-DCil-Mtt.js";import"./deviceCapabilities-bTwC3axp.js";import"./GlassBiometricAdaptation-BgUrssxj.js";import"./MotionPreferenceContext-CE2cIJWP.js";import"./GlassEyeTracking-DbcgmIgS.js";import"./GlassSpatialAudio-BSI6cL7u.js";import"./MotionFramer-CMmRorie.js";import"./utilsCore-BTp3mrmn.js";const A={title:"Controls/Inputs/Glass Label",component:a,parameters:{layout:"centered",previewSurface:"component",docs:{description:{component:"A glass-aware form label with required, icon, description, and state variants."}}},args:{children:"Workspace slug",description:"Lowercase letters, numbers, and hyphens only.",required:!0,enhanced:!0,icon:s.jsx(o,{size:15})}},e={render:r=>s.jsxs("div",{className:"glass-grid glass-w-[min(520px,calc(100vw-48px))] glass-gap-5 glass-rounded-3xl glass-border glass-border-white/25 glass-bg-white/35 glass-p-6 glass-shadow-xl glass-backdrop-blur-xl",children:[s.jsxs("div",{children:[s.jsx(a,{...r,htmlFor:"workspace-slug"}),s.jsx(n,{id:"workspace-slug",placeholder:"revenue-ops",fullWidth:!0})]}),s.jsx(a,{variant:"success",icon:s.jsx(i,{size:15}),description:"The saved value passed validation.",children:"Approved setting"}),s.jsx(a,{variant:"warning",icon:s.jsx(l,{size:15}),description:"This label is readable in warning contexts.",children:"Needs review"})]})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
