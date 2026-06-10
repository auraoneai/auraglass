import{j as s}from"./iframe-GrkikuRp.js";import{aj as i,ai as l,I as o}from"./components-DWrkUpM8.js";import{G as a}from"./GlassLabel-BFiGglXy.js";import{G as n}from"./GlassInput-CaaeA-dn.js";import"./preload-helper-PPVm8Dsz.js";import"./a11y-CCC13-1v.js";import"./LiquidGlassMaterial-QJo0sijf.js";import"./LiquidGlassLayerProvider-B3OXnDJ0.js";import"./GlassButton-D11IFtlb.js";import"./GlassPredictiveEngine-Cet71K7v.js";import"./GlassAchievementSystem-F37YjtOd.js";import"./OptimizedGlassCore-BK6ui_Z7.js";import"./deviceCapabilities-Cdjfew4F.js";import"./GlassBiometricAdaptation-xyUwR8ZA.js";import"./MotionPreferenceContext-BJCiJfFd.js";import"./GlassEyeTracking-DnsWplSi.js";import"./GlassSpatialAudio--c49q0dU.js";import"./MotionFramer-0RDYG5R5.js";import"./utilsCore-C85LumCN.js";const A={title:"Controls/Inputs/Glass Label",component:a,parameters:{layout:"centered",previewSurface:"component",docs:{description:{component:"A glass-aware form label with required, icon, description, and state variants."}}},args:{children:"Workspace slug",description:"Lowercase letters, numbers, and hyphens only.",required:!0,enhanced:!0,icon:s.jsx(o,{size:15})}},e={render:r=>s.jsxs("div",{className:"glass-grid glass-w-[min(520px,calc(100vw-48px))] glass-gap-5 glass-rounded-3xl glass-border glass-border-white/25 glass-bg-white/35 glass-p-6 glass-shadow-xl glass-backdrop-blur-xl",children:[s.jsxs("div",{children:[s.jsx(a,{...r,htmlFor:"workspace-slug"}),s.jsx(n,{id:"workspace-slug",placeholder:"revenue-ops",fullWidth:!0})]}),s.jsx(a,{variant:"success",icon:s.jsx(i,{size:15}),description:"The saved value passed validation.",children:"Approved setting"}),s.jsx(a,{variant:"warning",icon:s.jsx(l,{size:15}),description:"This label is readable in warning contexts.",children:"Needs review"})]})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
